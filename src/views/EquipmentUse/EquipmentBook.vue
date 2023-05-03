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
            <!-- 预约编号 -->
            <el-table-column
                label="预约编号"
                width="100"
                fixed
            >
                <template #default="scope">
                    {{ scope.row.id }}
                </template>
            </el-table-column>
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
                        width="160"
                        confirm-button-text="是"
                        cancel-button-text="否"
                        title="确认同意申请吗？"
                        @confirm="agree(scope.row)"
                    >
                        <template #reference>
                            <el-button
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
                    <el-button
                        type="primary"
                        size="small"
                        link
                        :icon="Close"
                        @click="refuse(scope.row)"
                    >
                        拒绝申请
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- 拒绝申请对话框 -->
    <RefuseBook
        v-model="applicationDialog"
        :applicationBook="applicationBook"
        @closeDialog="closeDialog"
        @getTableList="getTableList"
    ></RefuseBook>
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
    import RefuseBook from '@/components/EquipmentBook/RefuseBook.vue'

    //#region 面包屑导航数据
    const route = useRoute()
    const store = useStore()
    const zhNames = route.meta.zh_name
    store.commit('changeBreadCrumb', zhNames)
    //#endregion

    // 获取预约列表
    const getTableList = async () => {
        let res
        if (store.state.userInfo.role === 1) {
            res = await axios.post('/admin/equipment/getBookList')
        } else {
            res = await axios.post(`/admin/equipment/getBookList/${store.state.userInfo.number}`)
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
        const colors = ['warning', 'success', 'danger', '', 'info', 'info']
        return colors[data.state]
    }
    const getState = data => {
        const states = ['待审核', '已同意', '已拒绝', '已归还', '已过期', '已取消']
        return states[data.state]
    }

    //#region 操作
    // 同意申请
    const agree = async data => {
        if (data.state === 0) {
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
        } else if (data.state === 4) {
            ElMessage.warning('此申请已过期')
        } else if (data.state === 5) {
            ElMessage.warning('此申请已取消')
        } else {
            ElMessage.warning('您已处理此申请')
        }
    }
    // 拒绝申请
    // 对话框
    const applicationDialog = ref(false)
    const applicationBook = ref()
    const refuse = async data => {
        // console.log(data)
        loseFocus()
        if (data.state === 0) {
            applicationBook.value = data
            applicationDialog.value = true
        } else if (data.state === 4) {
            ElMessage.warning('此申请已过期')
        } else if (data.state === 5) {
            ElMessage.warning('此申请已取消')
        } else {
            ElMessage.warning('您已处理此申请')
        }
    }
    // 关闭对话框
    const closeDialog = () => {
        applicationDialog.value = false
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
