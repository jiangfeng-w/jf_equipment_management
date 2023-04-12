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
            <!-- 电话号码 -->
            <el-form-item
                label="手机号"
                prop="phone_number"
            >
                <el-input
                    v-model="addForm.phone_number"
                    placeholder="请输入手机号"
                />
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item
                label="邮箱"
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

    const addConfirm = () => {
        addFormRef.value.validate(async isValid => {
            // 验证通过
            if (isValid) {
                // console.log(addForm)
                try {
                    const res = await axios.post('/admin/admin/add', addForm)
                    // console.log(res)
                    if (res.status === 201) {
                        emit('getTableList')
                        closeDialog()
                        // 通知
                        ElMessage.success(res.data.message)
                    }
                } catch (error) {
                    ElMessage.error(error.response.data.error)
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
