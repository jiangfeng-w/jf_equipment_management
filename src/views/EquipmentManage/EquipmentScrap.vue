<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>设备报废</span>
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
                    <ExpandInfo :info="scope.row" />
                </template>
            </el-table-column>
            <!-- 设备名称 -->
            <el-table-column
                label="设备名称"
                width="150"
                fixed
            >
                <template #default="scope">
                    <el-tooltip
                        :show-after="200"
                        :hide-after="0"
                        class="box-item"
                        effect="dark"
                        :content="scope.row.name"
                        placement="top"
                    >
                        {{ scope.row.name }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- 申请时间 -->
            <el-table-column
                label="申请时间"
                width="170"
            >
                <template #default="scope">
                    {{ formatTime(scope.row.apply_time) }}
                </template>
            </el-table-column>
            <!-- 审批时间 -->
            <el-table-column
                label="审批时间"
                width="170"
            >
                <template #default="scope">
                    {{ formatTime(scope.row.approve_time) }}
                </template>
            </el-table-column>
            <!-- 申请人 -->
            <el-table-column
                label="设备负责人"
                prop="manager_name"
                min-width="100"
            ></el-table-column>

            <!-- 状态 -->
            <el-table-column
                label="设备状态"
                min-width="80"
            >
                <template #default="scope">
                    <el-tag
                        type="danger"
                        :effect="getEffect(scope.row.state)"
                        :hit="true"
                    >
                        {{ getState(scope.row.state) }}
                    </el-tag>
                </template>
            </el-table-column>
            <!-- 设备管理员操作 -->
            <el-table-column
                label="操作"
                width="180"
                fixed="right"
            >
                <template #default="scope">
                    <!-- 再次申请 -->
                    <el-popconfirm
                        v-if="scope.row.state === 1"
                        width="160"
                        confirm-button-text="是"
                        cancel-button-text="否"
                        title="确认再次申请吗？"
                        @confirm="reApply(scope.row.id)"
                    >
                        <template #reference>
                            <el-button
                                v-if="scope.row.state === 1"
                                type="primary"
                                size="small"
                                link
                                :icon="Setting"
                                @click="loseFocus()"
                            >
                                再次申请
                            </el-button>
                        </template>
                    </el-popconfirm>
                    <!-- 取消申请 -->
                    <el-popconfirm
                        width="160"
                        confirm-button-text="是"
                        cancel-button-text="否"
                        title="确认取消申请吗？"
                        @confirm="cancleApply(scope.row)"
                    >
                        <template #reference>
                            <el-button
                                type="primary"
                                size="small"
                                link
                                :icon="Delete"
                                @click="loseFocus()"
                            >
                                取消申请
                            </el-button>
                        </template>
                    </el-popconfirm>
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
    import ExpandInfo from '@/components/EquipmentScrap/ExpandInfo.vue'

    //#region 面包屑导航数据
    const route = useRoute()
    const store = useStore()
    const zhNames = route.meta.zh_name
    store.commit('changeBreadCrumb', zhNames)
    //#endregion

    // 获取列表
    const getTableList = async () => {
        const res = await axios.get(`/admin/equipment/scrap/${store.state.userInfo.number}`)

        tableList.splice(0, tableList.length, ...res.data.data)
        // console.log(tableList)
    }
    // 表格数据
    const tableList = reactive([])
    // 获取列表
    onMounted(() => {
        getTableList()
    })

    // 获取设备状态
    const getEffect = state => {
        const effects = ['light', 'plain', 'dark']
        return effects[state]
    }
    // 获取设备状态
    const getState = state => {
        const stateArr = ['申请中', '申请失败', '已报废']
        return stateArr[state]
    }
    // 格式化时间
    const formatTime = timeStamp => {
        if (timeStamp) {
            const formattedTime = dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss')
            return formattedTime
        } else {
            return '未审批'
        }
    }

    //#region 设备管理员
    // 再次申请
    // 再次申请
    const reApply = async id => {
        // console.log(id)
        try {
            const res = await axios.post('/admin/scrap/reapply', { id })
            if (res.status === 201) {
                ElMessage.success(res.data.message)
                getTableList()
            }
        } catch (error) {
            ElMessage.error(error.response.data.error)
            getTableList()
        }
    }
    // 取消申请
    const cancleApply = async data => {
        // console.log(id)
        try {
            const res = await axios.post('/admin/scrap/repaircompleted', { id: data.id, pic: data.now_pic })
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
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
