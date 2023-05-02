<template>
    <el-dialog
        title="拒绝申请"
        width="45%"
        class="addDialog"
        @open="assignData()"
        @closed="closeDialog()"
        align-center
        draggable
        destroy-on-close
    >
        <div class="container">
            <div class="form">
                <el-form
                    ref="formDataRef"
                    :model="formData"
                    :rules="formDataRules"
                    @keyup.enter="submitConfirm()"
                >
                    <!-- 预约编号 -->
                    <el-form-item label="预约编号">
                        <el-input
                            disabled
                            v-model="formData.id"
                        ></el-input>
                    </el-form-item>
                    <!-- 拒绝原因 -->
                    <el-form-item
                        label="拒绝原因"
                        prop="refuse_reason"
                    >
                        <el-input
                            type="textarea"
                            :rows="3"
                            :autosize="{ minRows: 3, maxRows: 6 }"
                            placeholder="请输入拒绝原因"
                            v-model="formData.refuse_reason"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>

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
    import { ref, reactive, onMounted } from 'vue'
    import axios from 'axios'
    import loseFocus from '@/util/loseFocus'
    import uploadFile from '@/util/uploadFile'

    const props = defineProps({
        applicationBook: Object,
    })
    const assignData = () => {
        Object.assign(formData, props.applicationBook)
        // console.log(formData)
    }

    // 表单
    const formDataRef = ref()
    const formData = reactive({
        refuse_reason: '',
    })
    // 验证规则
    const formDataRules = reactive({
        refuse_reason: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }],
    })

    // 注册emit
    const emit = defineEmits(['closeDialog', 'getTableList'])

    // 关闭对话框
    const closeDialog = () => {
        formDataRef.value.resetFields()
        emit('closeDialog')
    }
    // 提交
    const submitConfirm = () => {
        loseFocus()
        formDataRef.value.validate(async isValid => {
            if (isValid) {
                // console.log(formData)
                try {
                    const res = await axios.post('/admin/book/refuse', {
                        id: formData.id,
                        refuse_reason: formData.refuse_reason,
                    })
                    if (res.status === 201) {
                        ElMessage.success(res.data.message)
                        closeDialog()
                        emit('getTableList')
                    }
                } catch (error) {
                    ElMessage.error(error.response.data.error)
                }
            }
        })
    }
</script>
<style lang="scss" scoped>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .image {
        display: flex;
        margin-bottom: 20px;
        img {
            max-width: 400px;
            max-height: 255px;
        }
    }

    .form {
        width: 100%;
    }
    :deep(.el-form-item__label) {
        width: 80px;
    }
</style>
