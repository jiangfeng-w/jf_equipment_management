<template>
    <el-dialog
        width="70%"
        class="addDialog"
        @open="assignData()"
        @closed="closeDialog()"
        align-center
        draggable
        destroy-on-close
    >
        <template #header>
            <span class="header">报名列表</span>
            <span>{{ ' —— ' + courseNmae }}</span>
        </template>
        <!-- 表格 -->
        <el-table
            :data="tableList"
            style="width: 100%"
            table-layout="auto"
            border
        >
            <!-- 课程编号 -->
            <el-table-column
                label="课程编号"
                prop="course_id"
                fixed
            ></el-table-column>
            <!-- 学生姓名 -->
            <el-table-column
                label="学生姓名"
                prop="student_name"
            ></el-table-column>
            <!-- 联系方式 -->
            <el-table-column
                label="联系方式"
                prop="student_email"
            ></el-table-column>
            <!-- 所属单位 -->
            <el-table-column
                label="所属单位"
                prop="academy"
            ></el-table-column>
            <!-- 专业年级 -->
            <el-table-column label="专业年级">
                <template #default="scope">
                    {{ `${scope.row.grade} / ${scope.row.major}` }}
                </template>
            </el-table-column>
            <!-- 报名备注 -->
            <el-table-column
                label="报名备注"
                width="200"
            >
                <template #default="scope">
                    <el-tooltip
                        :show-after="200"
                        :hide-after="0"
                        class="box-item"
                        effect="dark"
                        :content="scope.row.tips"
                        placement="top-start"
                    >
                        {{ scope.row.tips }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- 报名时间 -->
            <el-table-column
                prop="create_time"
                label="报名时间"
                sortable
            >
                <template #default="scope">
                    {{ formatTime(scope.row.create_time) }}
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
                    <el-popconfirm
                        width="160"
                        confirm-button-text="是"
                        cancel-button-text="否"
                        title="确认拒绝申请吗？"
                        @confirm="refuse(scope.row)"
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
    </el-dialog>
</template>
<script setup>
    import { ref, reactive, onMounted } from 'vue'
    import { useStore } from 'vuex'
    import axios from 'axios'
    import dayjs from 'dayjs'
    import loseFocus from '@/util/loseFocus'
    import { Check, Close, Refresh } from '@element-plus/icons-vue'

    const store = useStore()
    const props = defineProps({
        signUpListEquipID: Number,
        courseNmae: String,
    })
    // 注册emit
    const emit = defineEmits(['closeDialog', 'getTableList'])

    const assignData = async () => {
        const res = await axios.get(`/admin/train/signUpList/${props.signUpListEquipID}`)
        tableList.splice(0, tableList.length, ...res.data.data)
        // console.log(tableList)
    }
    // 表格数据
    const tableList = reactive([])
    // 格式化时间
    const formatTime = timeStamp => {
        const formattedTime = dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss')
        return formattedTime
    }
    // 关闭对话框
    const closeDialog = () => {
        emit('closeDialog')
    }

    //#region 操作
    // 同意申请
    const agree = async data => {
        // console.log(data)
        try {
            const res = await axios.post('/admin/train/agree', {
                id: data.id,
            })
            if (res.status === 200) {
                ElMessage.success(res.data.message)
                closeDialog()
                emit('getTableList')
            }
        } catch (error) {
            ElMessage.error(error.response.data.error)
            emit('getTableList')
        }
    }
    // 拒绝申请
    const refuse = async data => {
        // console.log(data)
        try {
            const res = await axios.post('/admin/train/refuse', {
                id: data.id,
                course_id: data.course_id,
            })
            if (res.status === 200) {
                ElMessage.success(res.data.message)
                closeDialog()
                emit('getTableList')
            }
        } catch (error) {
            ElMessage.error(error.response.data.error)
            emit('getTableList')
        }
    }
    //#endregion
</script>
<style lang="scss" scoped>
    .header {
        font-size: 18px;
    }
    :deep(.el-table__cell .cell) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
