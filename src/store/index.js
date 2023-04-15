import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
    state: {
        // 面包屑导航
        BreadCrumb: [],
        // 用户信息
        userInfo: {},
        // 侧边导航是否折叠
        isCollapse: false,
    },
    getters: {},
    mutations: {
        // 设置面包屑导航的值
        changeBreadCrumb(state, value) {
            state.BreadCrumb = value
        },
        // 清空面包屑导航的值
        clearBreadCrumb(state) {
            state.BreadCrumb = []
        },
        // 保存用户信息
        changeUserInfo(state, value) {
            state.userInfo = {
                ...state.userInfo,
                ...value,
            }
        },
        // 退出清除用户信息
        clearUserInfo(state) {
            state.userInfo = {}
        },
        changeCollapse(state) {
            state.isCollapse = !state.isCollapse
        },
    },
    actions: {},
    modules: {},
    plugins: [
        createPersistedState({
            // paths: ['userInfo'], //控制是否持久化
        }),
    ],
})
