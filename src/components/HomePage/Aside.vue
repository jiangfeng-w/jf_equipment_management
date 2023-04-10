<template>
    <el-aside :width="'200px'">
        <p
            class="siteTitle"
            @click="goHome"
        >
            <img
                src="../../assets/logo.png"
                alt=""
            />
            <span>企业门户管理</span>
        </p>
        <!-- 导航菜单 -->
        <el-menu
            :router="true"
            text-color="#fff"
            :default-active="route.fullPath"
        >
            <!-- 首页 -->
            <el-menu-item index="/home">
                <el-icon><HomeFilled /></el-icon>
                <span>首页</span>
            </el-menu-item>

            <!-- 用户管理 -->
            <el-sub-menu index="/usermanage">
                <template #title>
                    <el-icon><UserFilled /></el-icon>
                    <span>用户管理</span>
                </template>
                <el-menu-item index="/usermanage/student">
                    <el-icon><Menu /></el-icon>
                    <span>学生管理</span>
                </el-menu-item>
                <el-menu-item index="/usermanage/teacher">
                    <el-icon><Menu /></el-icon>
                    <span>老师管理</span>
                </el-menu-item>
                <el-menu-item index="/usermanage/deviceadmin">
                    <el-icon><Menu /></el-icon>
                    <span>设备管理员</span>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>
<script setup>
    import { HomeFilled, Avatar, UserFilled, TrendCharts, GoodsFilled, Menu, Pointer } from '@element-plus/icons-vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useStore } from 'vuex'

    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    // 点击导航到首页
    const goHome = () => {
        router.push('/home')
    }
</script>
<style lang="scss" scoped>
    // 隐藏滚动条
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
    .el-aside {
        background-color: #304156;
        transition: 0.3s;
        .el-menu {
            background-color: #304156;
            border: #304156;
            height: 100%;
        }
        box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
    }
    .siteTitle {
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
        text-align: center;
        height: 56px;
        line-height: 56px;
        background-color: #304156;
        color: #fff;
        position: sticky;
        top: 0;
        left: 0;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        span {
            margin-left: 10px;
        }
        img {
            width: 20px;
        }
    }
    :deep(.el-sub-menu) .el-menu-item {
        background-color: #1f2d3d;
    }
    :deep(.el-menu-item):hover,
    :deep(.el-sub-menu__title):hover {
        background-color: #2d3d52;
    }
    :deep(.el-sub-menu) .el-menu-item:hover {
        background-color: #001528;
    }
</style>
