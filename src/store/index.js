import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
    state: {
        // 面包屑导航
        BreadCrumb: [],
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
    },
    actions: {},
    modules: {},
    // plugins: [
    //     createPersistedState({
    //         paths: ['BreadCrumb'], //控制是否持久化
    //     }),
    // ],
})
