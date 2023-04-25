<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>设备报废</span>
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
            <!-- 报废原因 -->
            <el-table-column label="报废原因">
                <template #default="scope">
                    <el-tooltip
                        :show-after="200"
                        :hide-after="0"
                        class="box-item"
                        effect="dark"
                        :content="scope.row.reason_application"
                        placement="top"
                    >
                        {{ scope.row.reason_application }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- 申请人 -->
            <el-table-column
                label="设备负责人"
                prop="manager_name"
                min-width="100"
            ></el-table-column>
            <!-- 联系方式 -->
            <el-table-column
                label="联系方式"
                min-width="150"
            >
                <template #default="scope">
                    <el-tooltip
                        :show-after="200"
                        :hide-after="0"
                        class="box-item"
                        effect="dark"
                        :content="scope.row.manager_email"
                        placement="top"
                    >
                        {{ scope.row.manager_email }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column
                label="设备状态"
                min-width="80"
            >
                <el-tag
                    type="danger"
                    effect="dark"
                    :hit="true"
                >
                    申请中
                </el-tag>
            </el-table-column>
            <!-- 系统管理员操作 -->
            <el-table-column
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
                        @confirm="agree(scope.row.id)"
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
                    <el-popconfirm
                        width="160"
                        confirm-button-text="是"
                        cancel-button-text="否"
                        title="确认拒绝申请吗？"
                        @confirm="refuse(scope.row.id)"
                    >
                        <template #reference>
                            <el-button
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
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script setup>
    import { ref, reactive, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import { Delete, Plus, Edit, Setting, Check, Close } from '@element-plus/icons-vue'
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
        const res = await axios.get(`/admin/equipment/scrap`)
        const result = res.data.data.filter(item => {
            return item.state === 0
        })
        tableList.splice(0, tableList.length, ...result)
        // console.log(tableList)
    }
    // 表格数据
    const tableList = reactive([])
    // 获取列表
    onMounted(() => {
        getTableList()
    })

    // 格式化时间
    const formatTime = timeStamp => {
        const formattedTime = dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss')
        return formattedTime
    }

    //#region 系统管理员
    // 同意申请
    const agree = async id => {
        // console.log(id)
        try {
            const res = await axios.post('/admin/scrap/agree', { id })
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
            const res = await axios.post('/admin/scrap/refuse', { id })
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
</style>
