<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>设备预约</span>
                <el-tooltip
                    :show-after="200"
                    :hide-after="0"
                    class="box-item"
                    effect="dark"
                    content="刷新列表"
                    placement="top"
                >
                    <el-button
                        circle
                        :icon="Refresh"
                        @click="getTableList()"
                    ></el-button>
                </el-tooltip>
            </div>
        </template>
        <!-- 表格 -->
        <el-table
            ref="tableRef"
            :data="tableList"
            style="width: 100%"
            table-layout="fixed"
            border
        >
            <!-- 展开行 -->
            <el-table-column
                type="expand"
                label="详细信息"
                width="100"
                fixed
            >
                <template #default="scope">
                    <ExpandInfo :info="scope.row"></ExpandInfo>
                </template>
            </el-table-column>
            <!-- 序号列 -->
            <el-table-column
                type="index"
                label="序号"
                width="60"
                fixed
            ></el-table-column>
            <!-- 设备名称 -->
            <el-table-column
                prop="name"
                label="设备名称"
                fixed
            ></el-table-column>
            <!-- 预约人 -->
            <el-table-column
                prop="apply_name"
                label="预约人"
                width="120"
            ></el-table-column>
            <!-- 申请时间 -->
            <el-table-column
                label="申请时间"
                width="165"
            >
                <template #default="scope">
                    {{ formatTime(scope.row.apply_time) }}
                </template>
            </el-table-column>
            <!-- 预约日期 -->
            <el-table-column
                label="预约日期"
                width="165"
            >
                <template #default="scope">
                    {{ formatDate(scope.row.book_date) }}
                </template>
            </el-table-column>
            <!-- 当前状态 -->
            <el-table-column
                label="当前状态"
                width="100"
            >
                <template #default="scope">
                    <el-tag
                        :type="getType(scope.row)"
                        effect="dark"
                    >
                        {{ getState(scope.row) }}
                    </el-tag>
                </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
                v-if="store.state.userInfo.role === 2"
                label="操作"
                width="180"
                fixed="right"
            >
                <template #default="scope">
                    <!-- 同意申请 -->
                    <el-popconfirm
                        v-if="scope.row.state === 0 && scope.row.book_date > dayjs().startOf('day').valueOf()"
                        width="160"
                        confirm-button-text="是"
                        cancel-button-text="否"
                        title="确认同意申请吗？"
                        @confirm="agree(scope.row)"
                    >
                        <template #reference>
                            <el-button
                                v-if="scope.row.state === 0 && scope.row.book_date > dayjs().startOf('day').valueOf()"
                                type="primary"
                                size="small"
                                link
                                :icon="Check"
                                @click="loseFocus()"
                            >
                                同意申请
                            </el-button>
                        </template>
                    </el-popconfirm>
                    <!-- 拒绝申请 -->
                    <el-popconfirm
                        v-if="scope.row.state === 0 && scope.row.book_date > dayjs().startOf('day').valueOf()"
                        width="160"
                        confirm-button-text="是"
                        cancel-button-text="否"
                        title="确认拒绝申请吗？"
                        @confirm="refuse(scope.row.id)"
                    >
                        <template #reference>
                            <el-button
                                v-if="scope.row.state === 0 && scope.row.book_date > dayjs().startOf('day').valueOf()"
                                type="primary"
                                size="small"
                                link
                                :icon="Close"
                                @click="loseFocus()"
                            >
                                拒绝申请
                            </el-button>
                        </template>
                    </el-popconfirm>
                    <!-- 无需操作 -->
                    <el-button
                        v-if="scope.row.state !== 0 || scope.row.book_date < dayjs().startOf('day').valueOf()"
                        type="primary"
                        size="small"
                        link
                        @click="loseFocus()"
                    >
                        {{ getState(scope.row) }},无需操作
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>
<script setup>
    import { ref, reactive, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import { Delete, Plus, Edit, Setting, Check, Close, Refresh } from '@element-plus/icons-vue'
    import dayjs from 'dayjs'
    import axios from 'axios'
    import loseFocus from '@/util/loseFocus'
    import ExpandInfo from '@/components/EquipmentBook/ExpandInfo.vue'

    const store = useStore()
    // 获取预约列表
    const getTableList = async () => {
        let res
        if (store.state.userInfo.role === 1) {
            res = await axios.get('/admin/equipment/getBookList')
        } else {
            res = await axios.get(`/admin/equipment/getBookList/${store.state.userInfo.number}`)
        }

        // console.log(res.data.data)
        tableList.splice(0, tableList.length, ...res.data.data)
    }
    onMounted(() => {
        getTableList()
    })

    // 预约表格
    const tableList = reactive([])

    // 格式化时间
    const formatTime = timeStamp => {
        const formattedTime = dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss')
        return formattedTime
    }
    // 格式化日期
    const formatDate = timeStamp => {
        const formattedDate = dayjs(timeStamp).format('YYYY-MM-DD')
        return formattedDate
    }
    // 获取设备状态
    const getType = data => {
        if (data.book_date < dayjs().startOf('day').valueOf() && data.state === 0) {
            return 'info'
        }
        const colors = ['warning', 'danger', 'success', '']
        return colors[data.state]
    }
    const getState = data => {
        if (data.book_date < dayjs().startOf('day').valueOf() && data.state === 0) {
            return '已过期'
        }
        const states = ['待审核', '未通过', '已通过', '已归还']
        return states[data.state]
    }

    //#region 操作
    // 同意申请
    const agree = async data => {
        // console.log(data.id, data.equip_id)
        try {
            const res = await axios.post('/admin/book/agree', { id: data.id, equip_id: data.equip_id })
            if (res.status === 201) {
                ElMessage.success(res.data.message)
                getTableList()
            }
        } catch (error) {
            ElMessage.error(error.response.data.error)
            getTableList()
        }
    }
    // 拒绝申请
    const refuse = async id => {
        // console.log(id)
        try {
            const res = await axios.post('/admin/book/refuse', { id })
            if (res.status === 201) {
                ElMessage.success(res.data.message)
                getTableList()
            }
        } catch (error) {
            ElMessage.error(error.response.data.error)
            getTableList()
        }
    }
    //#endregion
</script>
<style lang="scss" scoped>
    :deep(.el-table__cell .cell) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .el-card {
        min-height: 600px;
    }
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>