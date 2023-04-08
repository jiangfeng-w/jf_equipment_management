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
            // 主页
            {
                path: '/home',
                name: 'home',
                component: () => import('@/views/Home/Home.vue'),
            },
            // 个人中心
            {
                path: '/center',
                name: 'center',
                component: () => import('@/views/Center/Center.vue'),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
