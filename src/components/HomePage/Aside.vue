<template>
    <el-aside :width="store.state.isCollapse ? '64px' : '200px'">
        <p
            class="siteTitle"
            @click="goHome"
        >
            <img
                src="../../assets/logo.png"
                alt=""
            />
            <span v-show="!store.state.isCollapse">大精设备管理系统</span>
        </p>
        <!-- 导航菜单 -->
        <el-menu
            :collapse="store.state.isCollapse"
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
            <el-sub-menu
                index="/usermanage"
                v-if="store.state.userInfo.role === 1"
            >
                <template #title>
                    <el-icon><UserFilled /></el-icon>
                    <span v-show="!store.state.isCollapse">用户管理</span>
                </template>
                <!-- 学生管理 -->
                <el-menu-item index="/usermanage/student">
                    <el-icon><Menu /></el-icon>
                    <span v-show="!store.state.isCollapse">学生管理</span>
                </el-menu-item>
                <!-- 老师管理 -->
                <el-menu-item index="/usermanage/teacher">
                    <el-icon><Menu /></el-icon>
                    <span v-show="!store.state.isCollapse">老师管理</span>
                </el-menu-item>
                <!-- 设备管理员 -->
                <el-menu-item index="/usermanage/deviceadmin">
                    <el-icon><Menu /></el-icon>
                    <span v-show="!store.state.isCollapse">设备管理员</span>
                </el-menu-item>
            </el-sub-menu>
            <!-- 设备管理 -->
            <el-sub-menu index="/equipment">
                <template #title>
                    <el-icon><Management /></el-icon>
                    <span v-show="!store.state.isCollapse">设备管理</span>
                </template>
                <!-- 设备列表 -->
                <el-menu-item index="/equipment/equipmentlist">
                    <el-icon><Menu /></el-icon>
                    <span v-show="!store.state.isCollapse">设备列表</span>
                </el-menu-item>
                <!-- 维修申请 -->
                <el-menu-item
                    index="/equipment/equipmentrepair"
                    v-if="store.state.userInfo.role === 2"
                >
                    <el-icon><Menu /></el-icon>
                    <span v-show="!store.state.isCollapse">设备维修</span>
                </el-menu-item>
                <!-- 报废申请 -->
                <el-menu-item
                    index="/equipment/equipmentscrap"
                    v-if="store.state.userInfo.role === 2"
                >
                    <el-icon><Menu /></el-icon>
                    <span v-show="!store.state.isCollapse">设备报废</span>
                </el-menu-item>
                <!-- 维修审批 -->
                <el-menu-item
                    index="/equipment/repairapproval"
                    v-if="store.state.userInfo.role === 1"
                >
                    <el-icon><Menu /></el-icon>
                    <span v-show="!store.state.isCollapse">维修审批</span>
                </el-menu-item>
                <!-- 报废审批 -->
                <el-menu-item
                    index="/equipment/scrapapproval"
                    v-if="store.state.userInfo.role === 1"
                >
                    <el-icon><Menu /></el-icon>
                    <span v-show="!store.state.isCollapse">报废审批</span>
                </el-menu-item>
            </el-sub-menu>
            <!-- 设备使用 -->
            <el-sub-menu index="/equipmentuse">
                <template #title>
                    <el-icon><TrendCharts /></el-icon>
                    <span v-show="!store.state.isCollapse">设备使用</span>
                </template>
                <!-- 设备培训 -->
                <el-menu-item index="/equipmentuse/traincourses">
                    <el-icon><Menu /></el-icon>
                    <span v-show="!store.state.isCollapse">培训课程</span>
                </el-menu-item>
                <!-- 设备列表 -->
                <el-menu-item index="/equipmentuse/equipmentbook">
                    <el-icon><Menu /></el-icon>
                    <span v-show="!store.state.isCollapse">设备预约</span>
                </el-menu-item>
                <!-- 成果列表 -->
                <el-menu-item index="/equipmentuse/useresults">
                    <el-icon><Menu /></el-icon>
                    <span v-show="!store.state.isCollapse">产出成果</span>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>
<script setup>
    import { HomeFilled, Management, UserFilled, TrendCharts, Menu } from '@element-plus/icons-vue'
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
            white-space: nowrap;
            text-overflow: ellipsis;
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
