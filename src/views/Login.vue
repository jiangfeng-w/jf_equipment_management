<template>
    <div class="login_page">
        <!-- 登录表单 -->
        <div class="login">
            <h2>大精设备管理系统</h2>
            <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginRules"
                label-width="0"
                class="loginForm"
            >
                <!-- 用户名 -->
                <el-form-item prop="user_number">
                    <el-input
                        v-model="loginForm.user_number"
                        :prefix-icon="User"
                        placeholder="请输入用户名"
                        @keyup.enter="submitForm()"
                    />
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="user_password">
                    <el-input
                        v-model="loginForm.user_password"
                        type="password"
                        :prefix-icon="Lock"
                        placeholder="请输入密码"
                        show-password
                        @keyup.enter="submitForm()"
                    />
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="submit">
                    <el-button
                        type="primary"
                        @click="submitForm()"
                    >
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
    import { reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { User, Lock } from '@element-plus/icons-vue'
    import axios from 'axios'
    import { useStore } from 'vuex'
    // import loseFocus from '@/util/loseFocus.js'

    //登录表单
    const loginForm = reactive({
        user_number: '201931061460',
        user_password: 'admin1',
    })
    // 表单绑定的响应式对象
    const loginFormRef = ref()
    // 登录表单校验规则
    const loginRules = reactive({
        user_number: [{ required: true, message: '请输入学工号', trigger: 'blur' }],
        user_password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    })

    const router = useRouter()
    const store = useStore()
    // 提交表单
    const submitForm = () => {
        // loseFocus()
        // 表单校验
        loginFormRef.value.validate(async isValid => {
            if (isValid) {
                // console.log(loginForm)
                try {
                    const res = await axios.post('/admin/user/login', loginForm)
                    // console.log(res)
                    if (res.status === 200) {
                        router.push('/home')
                        // 存储用户信息
                        store.commit('changeUserInfo', res.data.data)
                        // store.commit('changeGetterRouter', false)
                    }
                } catch (error) {
                    ElMessage.error(error.response.data.message)
                }
            }
        })
    }
</script>

<style lang="scss" scoped>
    .login_page {
        height: 100%;
        background-image: url('http://vue.ruoyi.vip/static/img/login-background.f9f49138.jpg');
        background-size: cover;
    }
    .login {
        border-radius: 5px;
        width: 400px;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: white;
        color: #7d7d7d;
        text-align: center;
        padding: 20px;
        .el-button {
            width: 100%;
        }
        .loginForm {
            margin-top: 20px;
        }
    }
</style>
