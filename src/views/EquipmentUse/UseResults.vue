<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>产出成果</span>
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
            <!-- 详细信息 -->
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
                width="120"
                prop="book_id"
                fixed
                sortable
            ></el-table-column>
            <!-- 设备名称 -->
            <el-table-column
                prop="name"
                label="设备名称"
                fixed
            ></el-table-column>
            <!-- 预约人 -->
            <el-table-column
                prop="manager_name"
                label="设备负责人"
                width="120"
            ></el-table-column>
            <!-- 申请时间 -->
            <el-table-column
                prop="submit_time"
                label="申请时间"
                width="165"
                sortable
            >
                <template #default="scope">
                    {{ formatTime(scope.row.submit_time) }}
                </template>
            </el-table-column>
            <!-- 预约日期 -->
            <el-table-column
                prop="book_date"
                label="预约日期"
                width="165"
                sortable
            >
                <template #default="scope">
                    {{ formatDate(scope.row.book_date) }}
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>
<script setup>
    import { ref, reactive, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import { Delete, Setting, Check, Refresh } from '@element-plus/icons-vue'
    import axios from 'axios'
    import dayjs from 'dayjs'
    import ExpandInfo from '@/components/UseResults/ExpandInfo.vue'

    //#region 面包屑导航数据
    const route = useRoute()
    const store = useStore()
    const zhNames = route.meta.zh_name
    store.commit('changeBreadCrumb', zhNames)
    //#endregion

    const router = useRouter()
    // 获取成果列表
    const getTableList = async () => {
        let res
        if (store.state.userInfo.role === 1) {
            res = await axios.post('/admin/equipment/getResultList')
        } else {
            res = await axios.post(`/admin/equipment/getResultList/${store.state.userInfo.number}`)
        }

        tableList.splice(0, tableList.length, ...res.data.data)
        // console.log(tableList)
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
