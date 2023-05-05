<template>
    <!-- 页头 -->
    <el-page-header
        @back="goBack"
        :icon="ArrowLeft"
    >
        <template #content>
            <span>修改设备信息</span>
        </template>
    </el-page-header>

    <!-- 填写表单 -->
    <el-form
        :inline="true"
        ref="addTrainCourseRef"
        :model="addTrainCourse"
        :rules="addTrainCourseRules"
    >
        <!-- 设备名称 -->
        <el-form-item label="培训设备">
            <el-input
                v-model="showEquipName"
                disabled
            />
        </el-form-item>
        <!-- 项目名称 -->
        <el-form-item
            label="项目名称"
            prop="project_name"
        >
            <el-input v-model="addTrainCourse.project_name" />
        </el-form-item>
        <!-- 培训内容 -->
        <el-form-item label="培训内容">
            <el-input v-model="addTrainCourse.train_content" />
        </el-form-item>
        <!-- 培训人数 -->
        <el-form-item
            label="培训人数"
            prop="train_total_count"
        >
            <el-input v-model.number="addTrainCourse.train_total_count" />
        </el-form-item>
        <!-- 培训地点 -->
        <el-form-item
            label="培训地点"
            prop="train_place"
        >
            <el-input v-model="addTrainCourse.train_place" />
        </el-form-item>
        <!-- 报名截止 -->
        <el-form-item
            label="报名截止"
            prop="signup_deadline"
        >
            <el-date-picker
                v-model="addTrainCourse.signup_deadline"
                type="datetime"
                placeholder="请选择报名截止时间"
            ></el-date-picker>
        </el-form-item>
        <!-- 培训期限 -->
        <el-form-item
            label="培训时间"
            prop="train_time"
        >
            <el-date-picker
                v-model="addTrainCourse.train_time"
                type="datetimerange"
                range-separator="~"
                start-placeholder="培训开始"
                end-placeholder="培训截止"
                @change="formatTimeStamp"
            />
        </el-form-item>
        <!-- 补充说明 -->
        <el-form-item label="补充说明">
            <el-input
                v-model="addTrainCourse.tips"
                placeholder="请输入补充说明"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 6 }"
            />
        </el-form-item>
        <!-- 按钮 -->
        <div class="button">
            <!-- 提交按钮 -->
            <el-form-item class="submit">
                <el-button
                    type="primary"
                    @click="submitForm()"
                    size="large"
                >
                    保存
                </el-button>
            </el-form-item>
            <!-- 提交按钮 -->
            <el-form-item class="submit">
                <el-button
                    @click="goBack()"
                    size="large"
                >
                    取消
                </el-button>
            </el-form-item>
        </div>
    </el-form>
</template>
<script setup>
    import { ref, reactive, computed, onMounted, toRaw } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import axios from 'axios'
    import { ArrowLeft } from '@element-plus/icons-vue'
    import UploadImage from '@/components/UploadImage/UploadImage.vue'
    import uploadFile from '@/util/uploadFile'
    import dayjs from 'dayjs'
    import loseFocus from '@/util/loseFocus'

    //#region 面包屑导航数据
    const route = useRoute()
    const store = useStore()
    const zhNames = route.meta.zh_name
    store.commit('changeBreadCrumb', zhNames)
    //#endregion

    const router = useRouter()
    // 回到设备列表
    const goBack = () => {
        router.push('/equipment/equipmentlist')
    }

    // 用id获取设备信息
    onMounted(async () => {
        const res = await axios.get(`/admin/equipment/list/${route.params.id}`)
        // console.log(res.data.data)
        addTrainCourse.equip_id = res.data.data.id
        addTrainCourse.equip_name = res.data.data.name
        addTrainCourse.manager_number = res.data.data.manager_number
        addTrainCourse.manager_name = res.data.data.manager_name
        addTrainCourse.manager_email = res.data.data.manager_email
        showEquipName.value = `(${res.data.data.id.toString().padStart(8, '0')}) ${res.data.data.name}`
    })

    // 添加课程表单
    const showEquipName = ref()

    const addTrainCourseRef = ref()
    const addTrainCourse = reactive({
        // 培训项目名称
        project_name: '',
        // 培训内容
        train_content: '',
        // 培训总人数
        train_total_count: '',
        // 培训地点
        train_place: null,
        // 报名截止时间
        signup_deadline: '',
        // 培训时间
        train_time: null,
        // 培训开始时间
        train_start: null,
        // 培训结束时间
        train_end: null,
        // 补充说明
        tips: '',
    })
    // 校验规则
    const addTrainCourseRules = reactive({
        project_name: [{ required: true, message: '请输入培训项目名称', trigger: 'blur' }],
        train_total_count: [
            { required: true, message: '请输入培训课程人数', trigger: 'blur' },
            { type: 'number', message: '培训人数需为数字' },
        ],
        train_place: [{ required: true, message: '请输入培训地点', trigger: 'blur' }],
        signup_deadline: [{ required: true, message: '请选择报名截止时间', trigger: 'blur' }],
        train_time: [{ required: true, message: '请选择培训时间', trigger: 'blur' }],
    })

    // 选择时间后格式化
    const formatTimeStamp = value => {
        if (value) {
            addTrainCourse.train_time = value.map(item => {
                return dayjs(item).valueOf()
            })
            addTrainCourse.train_start = addTrainCourse.train_time[0]
            addTrainCourse.train_end = addTrainCourse.train_time[1]
        } else {
            addTrainCourse.train_time = null
            addTrainCourse.train_start = null
            addTrainCourse.train_end = null
        }
    }

    // 提交表单
    const submitForm = async () => {
        loseFocus()
        await ElMessageBox.confirm('是否确认添加此培训课程？', {
            confirmButtonText: '添加',
            cancelButtonText: '取消',
            type: 'warning',
        })

        addTrainCourseRef.value.validate(async isValid => {
            addTrainCourse.signup_deadline = dayjs(addTrainCourse.signup_deadline).valueOf()
            // console.log(addTrainCourse)
            if (isValid) {
                try {
                    const res = await axios.post('/admin/train/addCourse', addTrainCourse)
                    if (res.status === 201) {
                        ElMessage.success(res.data.message)
                        router.push('/equipmentuse/traincourses')
                    }
                } catch (error) {
                    ElMessage.error(error.response.data.error)
                }
            }
        })
    }
</script>
<style lang="scss" scoped>
    .el-page-header {
        margin-bottom: 40px;
    }
    :deep(.el-form-item__label) {
        width: 80px;
    }
    :deep(.el-form-item) {
        // width: 33.3333%;
        width: 50%;
        margin-right: 0 !important;
    }
    :deep(.el-form-item:nth-last-child(-n + 3)) {
        width: 100%;
    }
    :deep(.el-select),
    :deep(.el-input_inner),
    :deep(.el-input) {
        width: 100% !important;
    }

    .button {
        display: flex;
        justify-content: flex-start;
        margin-left: 12px;
        .el-form-item {
            width: 80px;
        }
    }
</style>
