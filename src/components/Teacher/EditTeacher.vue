<template>
    <el-dialog
        title="修改教师信息"
        width="45%"
        @open="getTeacherInfo()"
        @closed="closeDialog()"
    >
        <el-form
            v-if="editForm"
            :inline="true"
            :model="editForm"
            ref="editFormRef"
            :rules="editFormRules"
        >
            <!-- 学工号 -->
            <el-form-item
                label="学工号"
                prop="number"
                type="number"
            >
                <el-input
                    v-model.number="editForm.number"
                    placeholder="请输入学工号"
                />
            </el-form-item>
            <!-- 密码 -->
            <el-form-item
                label="密码"
                prop="password"
            >
                <el-input
                    v-model="editForm.password"
                    placeholder="请输入重置后的密码"
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
            <!-- 所属实验室 -->
            <el-form-item
                label="实验室"
                prop="lab"
            >
                <el-cascader
                    v-model="editForm.lab"
                    :options="labs"
                    :props="options"
                    placeholder="请选择实验室"
                    :show-all-levels="false"
                    @change="labChange"
                />
            </el-form-item>
            <!-- 电话号码 -->
            <el-form-item
                label="手机号"
                prop="phone_number"
            >
                <el-input
                    v-model="editForm.phone_number"
                    placeholder="请输入手机号"
                />
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item
                label="邮箱"
                prop="email"
            >
                <el-input
                    v-model="editForm.email"
                    placeholder="请输入邮箱"
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
    import { ref, reactive, watch, toRaw } from 'vue'
    import axios from 'axios'

    const props = defineProps({
        editID: String,
    })

    // 表单
    const editFormRef = ref()
    const editForm = reactive({})
    let initEditForm
    // 获取学生信息
    const getTeacherInfo = async () => {
        const res = await axios.get(`/admin/teacher/list/${props.editID}`)
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

    // 校验规则
    const editFormRules = reactive({
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
        password: [{ min: 6, message: '密码至少为6位', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        lab: [{ required: true, message: '请选择所属实验室', trigger: 'blur' }],
    })
    // 检测学工号长度
    watch(
        () => editForm.number,
        (newValue, oldValue) => {
            if (editForm.number && editForm.number.toString().length >= 13) {
                editForm.number = oldValue
            }
        }
    )

    //#region 两个级联选择器
    const options = {
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
    //#endregion
    const labChange = value => {
        // console.log(value)
        editForm.academy = value[0]
        editForm.lab = value[1]
    }

    const editConfirm = () => {
        editFormRef.value.validate(async isValid => {
            // 表单数据改变了
            if (!(JSON.stringify(initEditForm) === JSON.stringify(editForm))) {
                // 验证通过
                if (isValid) {
                    // console.log(editForm)
                    try {
                        const res = await axios.post('/admin/teacher/changeInfo', editForm)

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
        width: 70px;
    }
</style>
