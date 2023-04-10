import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 请求拦截
import '@/util/axiosConfig'

createApp(App).use(store).use(router).mount('#app')
