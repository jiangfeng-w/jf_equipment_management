<template>
    <el-dialog
        title="修改学生信息"
        width="45%"
        @open="getStudentInfo()"
        @closed="closeDialog()"
    >
        <el-form
            :inline="true"
            :model="editForm"
            ref="editFormRef"
            :rules="editFormRules"
            label-position="right"
        >
            <!-- 学号 -->
            <el-form-item
                label="学号"
                prop="number"
                type="number"
            >
                <el-input
                    v-model.number="editForm.number"
                    placeholder="请输入学号"
                />
            </el-form-item>
            <!-- 密码 -->
            <el-form-item
                label="密码"
                prop="password"
            >
                <el-input
                    v-model="editForm.password"
                    placeholder="请输入修改的密码"
                    type="password"
                    show-password
                />
            </el-form-item>
            <!-- 姓名 -->
            <el-form-item
                label="姓名"
                prop="name"
            >
                <el-input
                    v-model="editForm.name"
                    placeholder="请输入姓名"
                />
            </el-form-item>
            <!-- 年级 -->
            <el-form-item
                label="年级"
                prop="grade"
            >
                <el-cascader
                    v-model="editForm.grade"
                    :options="grades"
                    :props="options"
                    placeholder="请选择年级"
                    @change="gradeChange"
                />
            </el-form-item>
            <!-- 专业 -->
            <el-form-item
                label="专业"
                prop="major"
            >
                <el-cascader
                    v-model="editForm.major"
                    :options="majors"
                    :props="options"
                    placeholder="请选择专业"
                    :show-all-levels="false"
                    @change="majorChange"
                />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button
                    type="primary"
                    @click="editConfirm()"
                >
                    确认
                </el-button>
                <el-button @click="closeDialog()">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
    import { ref, reactive, toRaw } from 'vue'
    import axios from 'axios'

    const props = defineProps({
        editID: String,
    })
    // 获取学生信息
    const getStudentInfo = async () => {
        const res = await axios.get(`/admin/student/list/${props.editID}`)
        if (res.status === 200) {
            Object.assign(editForm, res.data.data)
            editForm.number = Number(editForm.number)
            editForm.password = undefined
            // console.log(editForm)

            // 保存原始数据
            initEditForm = JSON.parse(JSON.stringify(toRaw(editForm)))
        }
    }

    // 注册emit
    const emit = defineEmits(['closeEditDialog', 'getTableList'])

    // 表单
    const editFormRef = ref()
    const editForm = reactive({})
    let initEditForm
    // 校验规则
    const editFormRules = reactive({
        // 学号
        number: [
            { required: true, message: '请输入学号' },
            {
                validator: (rule, value, callback) => {
                    if (typeof value !== 'number') {
                        callback(new Error('学号必须为数字'))
                    } else if (value.toString().length !== 12) {
                        callback(new Error('学号长度为12位'))
                    }
                    callback()
                },
            },
        ],
        password: [{ min: 6, message: '密码至少为6位', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        major: [{ required: true, message: '请选择专业', trigger: 'blur' }],
        grade: [{ required: true, message: '请选择年级', trigger: 'blur' }],
    })

    const options = {
        expandTrigger: 'hover',
    }
    //#region 两个级联选择器
    // 专业分类
    const majors = [
        {
            value: '计算机科学学院',
            label: '计算机科学学院',
            children: [
                {
                    value: '软件工程',
                    label: '软件工程',
                },
                {
                    value: '网络空间安全',
                    label: '网络空间安全',
                },
                {
                    value: '计算机科学与技术',
                    label: '计算机科学与技术',
                },
                {
                    value: '物联网工程',
                    label: '物联网工程',
                },
                {
                    value: '数据科学与大数据技术',
                    label: '数据科学与大数据技术',
                },
            ],
        },
        {
            value: '石油与天然气工程学院',
            label: '石油与天然气工程学院',
            children: [
                {
                    value: '石油工程',
                    label: '石油工程',
                },
                {
                    value: '油气储运工程',
                    label: '油气储运工程',
                },
                {
                    value: '海洋油气工程',
                    label: '海洋油气工程',
                },
                {
                    value: '化学工程与工艺',
                    label: '化学工程与工艺',
                },
                {
                    value: '新能源科学与工程',
                    label: '新能源科学与工程',
                },
            ],
        },
    ]
    const now = new Date()
    const year = now.getFullYear()
    // 年级分类
    const grades = [
        {
            value: '本科生',
            label: '本科生',
            children: [
                {
                    value: `${year - 4}级`,
                    label: `${year - 4}级`,
                },
                {
                    value: `${year - 3}级`,
                    label: `${year - 3}级`,
                },
                {
                    value: `${year - 2}级`,
                    label: `${year - 2}级`,
                },
                {
                    value: `${year - 1}级`,
                    label: `${year - 1}级`,
                },
            ],
        },
        {
            value: '研究生',
            label: '研究生',
            children: [
                {
                    value: `${year - 3}级`,
                    label: `${year - 3}级`,
                },
                {
                    value: `${year - 2}级`,
                    label: `${year - 2}级`,
                },
                {
                    value: `${year - 1}级`,
                    label: `${year - 1}级`,
                },
            ],
        },
    ]
    //#endregion
    const majorChange = value => {
        // console.log(value)
        editForm.academy = value[0]
        editForm.major = value[1]
    }
    const gradeChange = value => {
        // console.log(value)
        editForm.degree = value[0]
        editForm.grade = value[1]
    }

    const editConfirm = () => {
        editFormRef.value.validate(async isValid => {
            // 表单数据改变了
            if (!(JSON.stringify(initEditForm) === JSON.stringify(editForm))) {
                // 验证通过
                if (isValid) {
                    // console.log(editForm)
                    try {
                        const res = await axios.post('/admin/student/changeInfo', editForm)

                        if (res.status === 200) {
                            ElMessage.success(res.data.message)
                            closeDialog()
                            emit('getTableList')
                        }
                    } catch (error) {
                        ElMessage.error(error.response.data.error)
                        getTableData()
                    }
                }
            } else {
                ElMessage.info('请修改后再提交')
            }
        })
    }

    const closeDialog = () => {
        editFormRef.value.resetFields()
        emit('closeEditDialog')
    }
</script>
<style lang="scss" scoped>
    :deep(.el-cascader) {
        width: 100%;
    }
    :deep(.el-form-item__content) {
        max-width: 190px;
    }
    :deep(.el-form-item__label) {
        width: 51px;
    }
</style>
