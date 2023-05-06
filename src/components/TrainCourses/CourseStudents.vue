<template>
    <el-dialog
        width="70%"
        @open="assignData()"
        @closed="closeDialog()"
        align-center
        draggable
        destroy-on-close
    >
        <template #header>
            <span class="header">课程学生</span>
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
            <!-- 学生学号 -->
            <el-table-column
                label="学生学号"
                prop="student_number"
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
            <!-- 当前状态 -->
            <el-table-column
                label="当前状态"
                prop="state"
                sortable
            >
                <template #default="scope">
                    {{ getState(scope.row) }}
                </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
                v-if="store.state.userInfo.role === 2"
                label="操作"
                width="90"
                fixed="right"
            >
                <template #default="scope">
                    <!-- 已完成培训 -->
                    <el-button
                        v-if="scope.row.state === 4"
                        type="primary"
                        size="small"
                        link
                        @click="loseFocus()"
                    >
                        已完成培训
                    </el-button>
                    <!-- 完成培训按钮 -->
                    <el-popconfirm
                        v-else
                        width="245"
                        confirm-button-text="是"
                        cancel-button-text="否"
                        :title="completedTitle"
                        @confirm="completed(scope.row)"
                    >
                        <template #reference>
                            <el-button
                                type="primary"
                                size="small"
                                link
                                :icon="Check"
                                @click="loseFocus()"
                            >
                                完成培训
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
        courseStudentsID: Number,
        courseNmae: String,
    })
    // 注册emit
    const emit = defineEmits(['closeDialog', 'getTableList'])
    // 完成培训按钮的弹出框
    const completedTitle = ref()

    // 获取课程学生列表
    const assignData = async () => {
        const res = await axios.get(`/admin/train/courseStudents/${props.courseStudentsID}`)
        tableList.splice(0, tableList.length, ...res.data.data)
        Date.now() > tableList[0].train_end
            ? (completedTitle.value = '确认此学生已完成全部培训吗？')
            : (completedTitle.value = '确认提前结束此学生的培训吗？')
        // console.log(tableList)
    }
    // 表格数据
    const tableList = reactive([])
    // 格式化时间
    const getState = data => {
        const states = ['等待培训', '正在培训', '培训完成']
        return states[data.state - 2]
    }
    // 关闭对话框
    const closeDialog = () => {
        emit('closeDialog')
    }

    // 完成培训
    const completed = async data => {
        const ids = [data.id]
        // console.log(data)
        try {
            const res = await axios.post('/admin/train/completed', { ids })
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
