<template>
    <el-dialog
        title="添加设备管理员"
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
            <!-- 学工号 -->
            <el-form-item
                label="学工号"
                prop="number"
            >
                <el-input
                    v-model.number="addForm.number"
                    placeholder="请输入学工号"
                />
            </el-form-item>
            <!-- 密码 -->
            <el-form-item
                label="密码"
                prop="password"
            >
                <el-input
                    v-model="addForm.password"
                    placeholder="密码默认为学工号后六位"
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
            <!-- 所属实验室 -->
            <el-form-item
                label="实验室"
                prop="lab"
            >
                <el-cascader
                    v-model="addForm.lab"
                    :options="labs"
                    :props="props"
                    placeholder="请选择实验室"
                    @change="labChange"
                    :show-all-levels="false"
                />
            </el-form-item>
            <!-- 电话号码 -->
            <el-form-item
                label="手机号码"
                prop="phone_number"
            >
                <el-input
                    v-model="addForm.phone_number"
                    placeholder="请输入手机号"
                />
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item
                label="电子邮箱"
                prop="email"
            >
                <el-input
                    v-model="addForm.email"
                    placeholder="请输入邮箱"
                />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button
                    type="primary"
                    @click="addConfirm()"
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

    // 注册emit
    const emit = defineEmits(['closeAddDialog', 'getTableList'])

    // 表单

    const addFormRef = ref()
    const addForm = reactive({
        number: '',
        password: '',
        name: '',
        phone_number: '',
        email: '',
        academy: '',
        lab: '',
    })
    // 校验规则
    const addFormRules = reactive({
        // 学工号
        number: [
            { required: true, message: '请输入学工号', trigger: blur },
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
        phone_number: [
            { required: true, message: '请输入手机号' },
            {
                validator: (rule, value, callback) => {
                    const reg = /^[1][3-9][0-9]{9}$/
                    if (!reg.test(value)) {
                        callback(new Error('请输入正确的手机号'))
                    }
                    callback()
                },
                trigger: 'blur',
            },
        ],
        email: [
            { required: true, message: '请输入邮箱地址' },
            {
                validator: (rule, value, callback) => {
                    const emailRegex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                    if (!emailRegex.test(value)) {
                        callback(new Error('请输入正确的邮箱地址'))
                    }
                    callback()
                },
                trigger: 'blur',
            },
        ],

        lab: [{ required: true, message: '请选择所属实验室', trigger: 'blur' }],

        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码至少为6位', trigger: 'blur' },
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
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
    // 手机号长度
    watch(
        () => addForm.phone_number,
        (newValue, oldValue) => {
            if (addForm.phone_number.toString().length >= 12) {
                addForm.phone_number = oldValue
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
    // 实验室
    const labs = [
        {
            value: '计算机科学学院',
            label: '计算机科学学院',
            children: [
                {
                    value: '计科院_实验室A',
                    label: '计科院_实验室A',
                },
                {
                    value: '计科院_实验室B',
                    label: '计科院_实验室B',
                },
                {
                    value: '计科院_实验室C',
                    label: '计科院_实验室C',
                },
            ],
        },
        {
            value: '石油与天然气工程学院',
            label: '石油与天然气工程学院',
            children: [
                {
                    value: '石工院_实验室A',
                    label: '石工院_实验室A',
                },
                {
                    value: '石工院_实验室B',
                    label: '石工院_实验室B',
                },
                {
                    value: '石工院_实验室C',
                    label: '石工院_实验室C',
                },
            ],
        },
    ]
    // 选择实验室
    const labChange = value => {
        // console.log(value)
        addForm.academy = value[0]
        addForm.lab = value[1]
    }
    //#endregion

    const addConfirm = () => {
        addFormRef.value.validate(async isValid => {
            // 验证通过
            if (isValid) {
                // console.log(addForm)
                try {
                    const res = await axios.post('/admin/admin/add', addForm)
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
    :deep(.el-form-item__label) {
        width: 80px;
    }

    :deep(.el-form-item) {
        width: 50%;
        margin-right: 0 !important;
    }
    :deep(.el-form-item__content) {
        width: 100%;
        // padding-left: 80px;
    }
    :deep(.el-select),
    :deep(.el-input_inner) {
        width: 100%;
    }
</style>
