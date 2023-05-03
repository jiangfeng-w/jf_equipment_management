import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store/index'
import axios from 'axios'
// 顶上的进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 配置
NProgress.configure({ showSpinner: false }) // 去掉右边的旋转加载提示

const routes = [
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/NotFound/NotFound.vue'),
    },
    {
        path: '/notfound',
        name: '/notfound',
        component: () => import('@/views/NotFound/NotFound.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
    },
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/homepage',
        name: 'homepage',
        component: () => import('@/views/HomePage.vue'),
        children: [
            // 首页
            {
                path: '/home',
                name: 'home',
                component: () => import('@/views/Home/Home.vue'),
            },
            // 个人中心
            {
                path: '/center',
                name: 'center',
                meta: {
                    zh_name: ['个人中心'],
                },
                component: () => import('@/views/Center/Center.vue'),
            },
            // 用户管理
            {
                path: '/usermanage',
                name: 'usermanage',
                children: [
                    // 学生管理
                    {
                        path: '/usermanage/student',
                        name: 'student',
                        meta: {
                            role: 1,
                            zh_name: ['用户管理', '学生数据'],
                        },
                        component: () => import('@/views/UserManage/Student.vue'),
                    },
                    // 老师管理
                    {
                        path: '/usermanage/teacher',
                        name: 'teacher',
                        meta: {
                            role: 1,
                            zh_name: ['用户管理', '老师数据'],
                        },
                        component: () => import('@/views/UserManage/Teacher.vue'),
                    },
                    // 设备管理员管理
                    {
                        path: '/usermanage/deviceadmin',
                        name: 'deviceadmin',
                        meta: {
                            role: 1,
                            zh_name: ['用户管理', '设备管理员数据'],
                        },
                        component: () => import('@/views/UserManage/DeviceAdmin.vue'),
                    },
                ],
            },
            // 设备管理
            {
                path: '/equipment',
                name: 'equipment',
                children: [
                    // 添加设备
                    {
                        path: '/equipment/equipmentadd',
                        name: 'equipmentadd',
                        meta: {
                            role: 2,
                            zh_name: ['设备管理', '添加设备'],
                        },
                        component: () => import('@/views/EquipmentManage/EquipmentAdd.vue'),
                    },
                    // 编辑设备
                    {
                        path: '/equipment/equipmentedit/:id',
                        name: 'equipmentedit',
                        meta: {
                            role: 2,
                            zh_name: ['设备管理', '编辑设备'],
                        },
                        component: () => import('@/views/EquipmentManage/EquipmentEdit.vue'),
                    },
                    // 设备列表
                    {
                        path: '/equipment/equipmentlist',
                        name: 'equipmentlist',
                        meta: {
                            zh_name: ['设备管理', '设备列表'],
                        },
                        component: () => import('@/views/EquipmentManage/EquipmentList.vue'),
                    },
                    // 维修申请
                    {
                        path: '/equipment/equipmentrepair',
                        name: 'equipmentrepair',
                        meta: {
                            role: 2,
                            zh_name: ['设备管理', '设备维修'],
                        },
                        component: () => import('@/views/EquipmentManage/EquipmentRepair.vue'),
                    },
                    // 报废申请
                    {
                        path: '/equipment/equipmentscrap',
                        name: 'equipmentscrap',
                        meta: {
                            role: 2,
                            zh_name: ['设备管理', '设备报废'],
                        },
                        component: () => import('@/views/EquipmentManage/EquipmentScrap.vue'),
                    },
                    // 维修审批
                    {
                        path: '/equipment/repairapproval',
                        name: 'repairapproval',
                        meta: {
                            role: 1,
                            zh_name: ['设备管理', '维修审批'],
                        },
                        component: () => import('@/views/EquipmentManage/RepairApproval.vue'),
                    },
                    // 报废审批
                    {
                        path: '/equipment/scrapapproval',
                        name: 'scrapapproval',
                        meta: {
                            role: 1,
                            zh_name: ['设备管理', '报废审批'],
                        },
                        component: () => import('@/views/EquipmentManage/ScrapApproval.vue'),
                    },
                ],
            },
            // 设备使用
            {
                path: '/equipmentuse',
                name: 'equipmentuse',
                children: [
                    // 设备预约列表
                    {
                        path: '/equipmentuse/equipmentbook',
                        name: 'equipmentbook',
                        meta: {
                            zh_name: ['设备使用', '设备预约'],
                        },
                        component: () => import('@/views/EquipmentUse/EquipmentBook.vue'),
                    },
                    // 使用成果列表
                    {
                        path: '/equipmentuse/useresults',
                        name: 'useresults',
                        meta: {
                            zh_name: ['设备使用', '设备预约'],
                        },
                        component: () => import('@/views/EquipmentUse/UseResults.vue'),
                    },
                ],
            },
        ],
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
    // 打开进度条
    NProgress.start()
    // 跳转到登录
    if (to.path === '/login') {
        next()
    } else {
        if (!localStorage.getItem('token')) {
            // 没有token，跳转到登录
            next('/login')
        } else {
            // 检查token是否过期
            const token = localStorage.getItem('token')
            try {
                const res = await axios.get('/admin/checkToken')
                if (res.status === 200) {
                    // 权限判断
                    if (to.meta.role) {
                        if (to.meta.role === store.state.userInfo.role) {
                            next()
                        } else {
                            // 如果用户没有权限，重定向到404页面
                            next('/notfound')
                        }
                    } else {
                        next()
                    }
                }
            } catch (error) {
                ElMessage.error('身份验证过期，请重新登录')
                next('/login')
            }
        }
    }
})

router.afterEach((to, from, next) => {
    // 关闭进度条
    NProgress.done()
})

export default router
