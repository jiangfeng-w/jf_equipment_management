<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>培训课程</span>
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
            <!-- 课程编号 -->
            <el-table-column
                label="课程编号"
                width="110"
                prop="id"
                fixed
                sortable
            ></el-table-column>
            <!-- 项目名称 -->
            <el-table-column
                label="项目名称"
                prop="equip_id"
                min-width="300"
                sortable
            >
                <template #default="scope">
                    <el-tooltip
                        :show-after="200"
                        :hide-after="0"
                        class="box-item"
                        effect="dark"
                        :content="scope.row.project_name"
                        placement="top-start"
                    >
                        {{ scope.row.project_name }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- 设备名称 -->
            <el-table-column
                label="设备名称"
                min-width="200"
            >
                <template #default="scope">
                    <el-tooltip
                        :show-after="200"
                        :hide-after="0"
                        class="box-item"
                        effect="dark"
                        :content="scope.row.equip_name"
                        placement="top-start"
                    >
                        {{ scope.row.equip_name }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- 培训人数 -->
            <el-table-column
                label="培训人数"
                width="110"
                prop="train_total_count"
                sortable
            >
                <template #default="scope">
                    {{ `${scope.row.train_total_count} 人` }}
                </template>
            </el-table-column>
            <!-- 报名人数 -->
            <el-table-column
                label="报名人数"
                width="110"
                prop="signup_count"
                sortable
            >
                <template #default="scope">
                    {{ `${scope.row.signup_count} 人` }}
                </template>
            </el-table-column>
            <!-- 报名截止时间 -->
            <el-table-column
                prop="signup_deadline"
                label="报名截止时间"
                width="165"
                sortable
            >
                <template #default="scope">
                    {{ formatTime(scope.row.signup_deadline) }}
                </template>
            </el-table-column>
            <!-- 培训时间 -->
            <el-table-column
                prop="train_start"
                label="培训时间"
                width="320"
                sortable
            >
                <template #default="scope">
                    {{ `${formatTime(scope.row.train_start)} ~ ${formatTime(scope.row.train_end)}` }}
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
                label="操作"
                width="180"
                fixed="right"
            >
                <template #default="scope">
                    <!-- 报名申请 -->
                    <el-button
                        type="primary"
                        size="small"
                        link
                        :icon="View"
                        @click="loseFocus"
                    >
                        报名申请
                    </el-button>
                    <!-- 查看成员 -->
                    <el-button
                        type="primary"
                        size="small"
                        link
                        :icon="User"
                        @click="loseFocus"
                    >
                        课程学员
                    </el-button>
                    <!-- 结束课程 -->
                    <el-button
                        v-if="scope.row.state === 1"
                        type="primary"
                        size="small"
                        link
                        :icon="CircleCheck"
                        @click="loseFocus"
                    >
                        结束课程
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
    import { View, User, Refresh, CircleCheck } from '@element-plus/icons-vue'
    import dayjs from 'dayjs'
    import axios from 'axios'
    import loseFocus from '@/util/loseFocus'
    import ExpandInfo from '@/components/TrainCourses/ExpandInfo.vue'

    //#region 面包屑导航数据
    const route = useRoute()
    const store = useStore()
    const zhNames = route.meta.zh_name
    store.commit('changeBreadCrumb', zhNames)
    //#endregion

    // 获取列表
    const getTableList = async () => {
        let res
        if (store.state.userInfo.role === 1) {
            res = await axios.get(`/admin/train/trainCourseList`)
        } else {
            res = await axios.get(`/admin/train/trainCourseList/${store.state.userInfo.number}`)
        }
        tableList.splice(0, tableList.length, ...res.data.data)
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
    // 获取设备状态
    const getType = data => {
        const colors = ['success', '', 'info']
        return colors[data.state]
    }
    const getState = data => {
        const states = ['报名中', '培训中', '已结束']
        return states[data.state]
    }
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
