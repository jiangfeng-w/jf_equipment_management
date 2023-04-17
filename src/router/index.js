import { createRouter, createWebHashHistory } from 'vue-router'
import axios from 'axios'

const routes = [
    {
        path: '/:pathMatch(.*)*',
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
                            zh_name: ['用户管理', '学生数据'],
                        },
                        component: () => import('@/views/UserManage/Student.vue'),
                    },
                    // 老师管理
                    {
                        path: '/usermanage/teacher',
                        name: 'teacher',
                        meta: {
                            zh_name: ['用户管理', '老师数据'],
                        },
                        component: () => import('@/views/UserManage/Teacher.vue'),
                    },
                    // 设备管理员管理
                    {
                        path: '/usermanage/deviceadmin',
                        name: 'deviceadmin',
                        meta: {
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
                            zh_name: ['设备管理', '添加设备'],
                        },
                        component: () => import('@/views/EquipmentManage/EquipmentAdd.vue'),
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
                            zh_name: ['设备管理', '维修申请'],
                        },
                        component: () => import('@/views/EquipmentManage/EquipmentRepair.vue'),
                    },
                    // 报废申请
                    {
                        path: '/equipment/equipmentscrap',
                        name: 'equipmentscrap',
                        meta: {
                            zh_name: ['设备管理', '报废申请'],
                        },
                        component: () => import('@/views/EquipmentManage/EquipmentScrap.vue'),
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

router.beforeEach(async (to, from, next) => {
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
                    next()
                }
            } catch (error) {
                next('/login')
            }
        }
    }
})

export default router
