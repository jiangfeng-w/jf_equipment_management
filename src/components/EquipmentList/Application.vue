<template>
    <el-dialog
        :title="title"
        width="45%"
        class="addDialog"
        @open="assignData()"
        @closed="closeDialog()"
    >
        <div class="container">
            <div class="content">
                <!-- 图片 -->
                <!-- <div class="image">
                    <img :src="applicationEquip.pic" />
                </div> -->
                <div class="form">
                    <el-form
                        ref="formDataRef"
                        :model="formData"
                        :rules="formDataRules"
                    >
                        <el-form-item label="设备名称">
                            <el-input
                                v-model="applicationEquip.name"
                                disabled
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="所属单位">
                            <el-input
                                v-model="applicationEquip.unit"
                                disabled
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="安置地点">
                            <el-input
                                v-model="applicationEquip.place"
                                disabled
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="维修公司"
                            prop="repair_person"
                            v-if="applicationType === 1"
                        >
                            <el-input
                                placeholder="填写维修负责公司"
                                v-model="formData.repair_person"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            :label="applicationType === 1 ? '维修原因' : '报废原因'"
                            prop="reason_application"
                        >
                            <el-input
                                type="textarea"
                                :rows="3"
                                :autosize="{ minRows: 3, maxRows: 6 }"
                                :placeholder="applicationType === 1 ? '输入维修原因' : '输入报废原因'"
                                v-model="formData.reason_application"
                            ></el-input>
                        </el-form-item>
                        <!-- 设备图片 -->
                        <el-form-item
                            label="设备现状"
                            prop="pic"
                        >
                            <UploadImage
                                :image="formData.pic"
                                @fileChange="handleChange"
                                :max_height="'255px'"
                                :max_width="'400px'"
                            />
                        </el-form-item>
                    </el-form>
                </div>
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
    import UploadImage from '@/components/UploadImage/UploadImage.vue'
    import uploadFile from '@/util/uploadFile'

    const props = defineProps({
        applicationType: Number,
        title: String,
        applicationEquip: Object,
    })
    const assignData = () => {
        Object.assign(formData, props.applicationEquip)
        formData.pic = null
        formData.state = props.applicationType
        // console.log(formData)
    }

    // 表单
    const formDataRef = ref()
    const formData = reactive({
        reason_application: '',
        repair_person: '',
    })
    // 验证规则
    const formDataRules = reactive({
        reason_application: [{ required: true, message: '请输入申请理由', trigger: 'blur' }],
        repair_person: [{ required: true, message: '请填写维修负责公司', trigger: 'blur' }],
        pic: [{ required: true, message: '请选择设备照片', trigger: 'blur' }],
    })

    // 选择图片
    const handleChange = file => {
        // console.log(file)
        formData.pic = URL.createObjectURL(file)
        formData.file = file
    }

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
                    const res = await uploadFile('/admin/equipment/application', formData)
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

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
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
