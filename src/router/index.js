import { createRouter, createWebHashHistory } from 'vue-router'

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
            // 学生管理
            {
                path: '/usermanage/student',
                name: 'student',
                meta: {
                    zh_name: ['用户管理', '学生管理'],
                },
                component: () => import('@/views/UserManage/Student.vue'),
            },
            // 老师管理
            {
                path: '/usermanage/teacher',
                name: 'teacher',
                meta: {
                    zh_name: ['用户管理', '老师管理'],
                },
                component: () => import('@/views/UserManage/Teacher.vue'),
            },
            // 设备管理员管理
            {
                path: '/usermanage/deviceadmin',
                name: 'deviceadmin',
                meta: {
                    zh_name: ['用户管理', '设备管理员管理'],
                },
                component: () => import('@/views/UserManage/DeviceAdmin.vue'),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    // 跳转到登录
    if (to.path === '/login') {
        next()
    } else {
        if (!localStorage.getItem('token')) {
            // 没有token，跳转到登录
            next('/login')
        } else {
            next()
        }
    }
})

export default router
