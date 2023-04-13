<template>
    <el-dialog
        title="添加学生"
        width="45%"
        class="addDialog"
        @closed="closeDialog()"
    >
        <el-form
            :inline="true"
            :model="addForm"
            ref="addFormRef"
            :rules="addFormRules"
        >
            <!-- 学号 -->
            <el-form-item
                label="学号"
                prop="number"
                type="number"
            >
                <el-input
                    v-model.number="addForm.number"
                    placeholder="请输入学号"
                />
            </el-form-item>
            <!-- 密码 -->
            <el-form-item
                label="密码"
                prop="password"
            >
                <el-input
                    v-model="addForm.password"
                    placeholder="密码默认为学号后六位"
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
                    v-model="addForm.name"
                    placeholder="请输入姓名"
                />
            </el-form-item>
            <!-- 年级 -->
            <el-form-item
                label="年级"
                prop="grade"
            >
                <el-cascader
                    v-model="addForm.grade"
                    :options="grades"
                    :props="props"
                    placeholder="请选择年级"
                    @change="gradeChange"
                />
            </el-form-item>
            <!-- 专业 -->
            <el-form-item
                label="专业"
                prop="major"
                class="major"
            >
                <el-cascader
                    v-model="addForm.major"
                    :options="majors"
                    :props="props"
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
                    @click="submitConfirm()"
                >
                    确认
                </el-button>
                <el-button @click="closeDialog()">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
    import { ref, reactive, watch } from 'vue'
    import axios from 'axios'

    // const props=defineProps({
    //     visible:Boolean
    // })

    // 注册emit
    const emit = defineEmits(['closeAddDialog', 'getTableList'])

    // 表单

    const addFormRef = ref()
    const addForm = reactive({
        number: '',
        password: '',
        name: '',
        academy: '',
        major: '',
        grade: '',
        degree: '',
    })
    // 校验规则
    const addFormRules = reactive({
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
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码至少为6位', trigger: 'blur' },
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        major: [{ required: true, message: '请选择专业', trigger: 'blur' }],
        grade: [{ required: true, message: '请选择年级', trigger: 'blur' }],
    })

    // 检测学工号长度
    watch(
        () => addForm.number,
        (newValue, oldValue) => {
            if (addForm.number.toString().length >= 13) {
                addForm.number = oldValue
            }
        }
    )

    // 检测学号变化自动输入密码
    watch(
        () => addForm.number,
        (newVal, oldVal) => {
            if (addForm.number.toString().length === 12 && typeof addForm.number === 'number') {
                addForm.password = addForm.number.toString().slice(-6)
            } else {
                addForm.password = ''
            }
        }
    )

    //#region
    const props = {
        expandTrigger: 'hover',
    }
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
                    value: `本${year - 4}级`,
                    label: `本${year - 4}级`,
                },
                {
                    value: `本${year - 3}级`,
                    label: `本${year - 3}级`,
                },
                {
                    value: `本${year - 2}级`,
                    label: `本${year - 2}级`,
                },
                {
                    value: `本${year - 1}级`,
                    label: `本${year - 1}级`,
                },
            ],
        },
        {
            value: '研究生',
            label: '研究生',
            children: [
                {
                    value: `研${year - 3}级`,
                    label: `研${year - 3}级`,
                },
                {
                    value: `研${year - 2}级`,
                    label: `研${year - 2}级`,
                },
                {
                    value: `研${year - 1}级`,
                    label: `研${year - 1}级`,
                },
            ],
        },
    ]
    //#endregion
    const majorChange = value => {
        // console.log(value)
        addForm.academy = value[0]
        addForm.major = value[1]
    }
    const gradeChange = value => {
        // console.log(value)
        addForm.degree = value[0]
        addForm.grade = value[1]
    }

    const submitConfirm = () => {
        addFormRef.value.validate(async isValid => {
            // 验证通过
            if (isValid) {
                // console.log(addForm)
                try {
                    const res = await axios.post('/admin/student/add', addForm)
                    // console.log(res.data)
                    if (res.status === 201) {
                        // 通知
                        ElMessage.success(res.data.message)
                        closeDialog()
                        emit('getTableList')
                    }
                } catch (error) {
                    ElMessage.error(error.response.data.error)
                    closeDialog()
                    emit('getTableList')
                }
            }
        })
    }

    const closeDialog = () => {
        addFormRef.value.resetFields()
        emit('closeAddDialog')
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
        width: 70px;
    }
</style>
