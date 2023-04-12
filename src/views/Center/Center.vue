<template>
    <el-row :gutter="20">
        <!-- 左边个人信息 -->
        <el-col :span="6">
            <el-card class="userInfo">
                <template #header>
                    <div class="card-header">
                        <span>个人信息</span>
                    </div>
                </template>
                <!-- 头像 -->
                <el-avatar
                    :size="100"
                    :src="store.state.userInfo.avatar"
                />
                <ul class="list-group">
                    <li class="list-group-item">
                        <span>学工号</span>
                        <div class="pull-right">{{ tempUserInfo.number }}</div>
                    </li>
                    <li class="list-group-item">
                        <span>用户姓名</span>
                        <div class="pull-right">{{ tempUserInfo.name }}</div>
                    </li>
                    <li class="list-group-item">
                        <span>手机号码</span>
                        <div class="pull-right">{{ tempUserInfo.phone_number }}</div>
                    </li>
                    <li class="list-group-item">
                        <span>用户邮箱</span>
                        <div class="pull-right">{{ tempUserInfo.email }}</div>
                    </li>
                    <li class="list-group-item">
                        <span>所属角色</span>
                        <div class="pull-right">
                            {{ store.state.userInfo.role === 1 ? '超级管理员' : '设备管理员' }}
                        </div>
                    </li>
                    <li class="list-group-item">
                        <span>创建日期</span>
                        <div class="pull-right">{{ formatTime(tempUserInfo.create_time) }}</div>
                    </li>
                </ul>
            </el-card>
        </el-col>

        <!-- 右边修改信息 -->
        <el-col :span="18">
            <el-card class="basicInfo">
                <template #header>
                    <div class="card-header">
                        <span>修改资料</span>
                    </div>
                </template>

                <el-tabs
                    v-model="activeName"
                    class="tabs"
                >
                    <!-- 修改基本资料 -->
                    <el-tab-pane
                        label="基本资料"
                        name="modifyData"
                    >
                        <!-- 修改基本信息表单 -->
                        <el-form
                            ref="userFormRef"
                            :model="tempUserInfo"
                            :rules="userFormFules"
                            label-width="120px"
                            class="demo-ruleForm"
                        >
                            <!-- 手机号 -->
                            <el-form-item
                                label="手机号码"
                                prop="phone_number"
                            >
                                <el-input v-model="tempUserInfo.phone_number" />
                            </el-form-item>
                            <!-- 电子邮箱 -->
                            <el-form-item
                                label="电子邮箱"
                                prop="email"
                            >
                                <el-input v-model="tempUserInfo.email" />
                            </el-form-item>
                            <!-- 头像 -->
                            <el-form-item
                                label="更换头像"
                                prop="avatar"
                            >
                                <UploadAvatar
                                    :image="tempUserInfo.avatar"
                                    @fileChange="handleChange"
                                />
                            </el-form-item>
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
                                        type="info"
                                        @click="resetForm()"
                                        size="large"
                                    >
                                        重置
                                    </el-button>
                                </el-form-item>
                            </div>
                        </el-form>
                    </el-tab-pane>
                    <!-- 修改密码 -->
                    <el-tab-pane
                        label="修改密码"
                        name="changePassword"
                    >
                        <!-- <el-form
                                ref="userPasswordRef"
                                :model="userPassword"
                                :rules="userPasswordFules"
                                label-width="120px"
                                class="demo-ruleForm"
                                status-icon
                            >
                                <!== 旧密码 ==>
                                <el-form-item
                                    label="旧密码"
                                    prop="oldPassword"
                                >
                                    <el-input
                                        v-model="userPassword.oldPassword"
                                        type="password"
                                    />
                                </el-form-item>
                                <!== 新密码 ==>
                                <el-form-item
                                    label="新密码"
                                    prop="newPassword"
                                >
                                    <el-input
                                        v-model="userPassword.newPassword"
                                        type="password"
                                    />
                                </el-form-item>
                                <!== 确认密码 ==>
                                <el-form-item
                                    label="确认密码"
                                    prop="checkPass"
                                >
                                    <el-input
                                        v-model="userPassword.checkPass"
                                        type="password"
                                    />
                                </el-form-item>

                                <div class="button">
                                    <!== 提交按钮 ==>
                                    <el-form-item class="submit">
                                        <el-button
                                            type="primary"
                                            @click="submitPass()"
                                            size="large"
                                        >
                                            保存
                                        </el-button>
                                    </el-form-item>
                                    <!== 提交按钮 ==>
                                    <el-form-item class="submit">
                                        <el-button
                                            type="info"
                                            @click="resetPass()"
                                            size="large"
                                        >
                                            重置
                                        </el-button>
                                    </el-form-item>
                                </div>
                            </el-form> -->
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </el-col>
    </el-row>
</template>
<script setup>
    import { useRoute } from 'vue-router'
    import { useStore } from 'vuex'
    import { ref, reactive, onMounted, watch, toRaw } from 'vue'
    // import { Edit, Delete, Plus } from '@element-plus/icons-vue'
    import UploadAvatar from '@/components/UploadImage/UploadImage.vue'
    import loseFocus from '@/util/loseFocus'
    import axios from 'axios'
    import dayjs from 'dayjs'
    import uploadFile from '@/util/uploadFile'

    //#region 面包屑导航数据
    const route = useRoute()
    const store = useStore()
    const zhNames = route.meta.zh_name
    store.commit('changeBreadCrumb', zhNames)
    //#endregion

    // 标签页绑定
    const activeName = ref('modifyData')

    // 用户信息
    const userFormRef = ref()
    const tempUserInfo = reactive({})
    let initUserForm
    // 获取用户信息
    const getUserInfo = async () => {
        const res = await axios.get('/admin/user/info')
        // var { number, name, phone_number, email, create_time } = res.data.data

        Object.assign(tempUserInfo, res.data.data)
        tempUserInfo.oldAvatar = store.state.userInfo.avatar
        tempUserInfo.avatar = null
        tempUserInfo.file = null
        // 保存初始信息
        initUserForm = JSON.parse(JSON.stringify(toRaw(tempUserInfo)))
        // console.log(tempUserInfo)
    }
    onMounted(() => {
        getUserInfo()
    })

    // 验证规则
    const userFormFules = reactive({
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
    })

    // 手机号长度
    watch(
        () => tempUserInfo.phone_number,
        (newValue, oldValue) => {
            if (tempUserInfo.phone_number && tempUserInfo.phone_number.toString().length >= 12) {
                tempUserInfo.phone_number = oldValue
            }
        }
    )

    // 格式化时间
    const formatTime = timeStamp => {
        const formattedTime = dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss')
        return formattedTime
    }
    // 选择图片
    const handleChange = file => {
        // console.log(file)
        tempUserInfo.avatar = URL.createObjectURL(file)
        tempUserInfo.file = file
    }

    // 重置表单
    const resetForm = () => {
        loseFocus()
        for (const i in initUserForm) {
            tempUserInfo[i] = initUserForm[i]
        }
        userFormRef.value.clearValidate()
    }
    // 提交表单
    const submitForm = () => {
        loseFocus()
        userFormRef.value.validate(async isValid => {
            // 表单改变了
            if (!(JSON.stringify(initUserForm) === JSON.stringify(tempUserInfo))) {
                // console.log(tempUserInfo)
                // 验证通过
                if (isValid) {
                    try {
                        const res = await uploadFile('/admin/user/changeOwnInfo', tempUserInfo)
                        // console.log(res)
                        if (res.status === 200) {
                            store.commit('changeUserInfo', res.data.data)

                            // 重新给表单赋值
                            tempUserInfo.avatar = null
                            tempUserInfo.oldAvatar = store.state.userInfo.avatar
                            initUserForm = JSON.parse(JSON.stringify(toRaw(tempUserInfo)))
                            // 通知
                            ElMessage.success(res.data.message)
                        }
                    } catch (error) {
                        ElMessage.error(error.response.data.error)
                    }
                }
            } else {
                ElMessage.info('请修改信息后提交')
            }
        })
    }
</script>
<style lang="scss" scoped>
    .userInfo {
        text-align: center;
        .card-header {
            text-align: left;
        }
    }
    .list-group {
        list-style: none;
        .list-group-item {
            display: flex;
            justify-content: space-between;
            border-left: 0;
            border-right: 0;
            border-radius: 0;
            padding-left: 0;
            padding-right: 0;
            border-bottom: 1px solid #e7eaec;
            border-top: 1px solid #e7eaec;
            margin-bottom: -1px;
            padding: 11px 0;
            font-size: 13px;
            text-align: -webkit-match-parent;
        }
    }
    .button {
        display: flex;
        justify-content: flex-start;
        .el-form-item {
            width: 100px;
        }
    }
</style>
