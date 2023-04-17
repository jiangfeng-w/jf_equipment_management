<template>设备列表</template>

<script setup>
    import { useRoute } from 'vue-router'
    import { useStore } from 'vuex'

    //#region 面包屑导航数据
    const route = useRoute()
    const store = useStore()
    const zhNames = route.meta.zh_name
    store.commit('changeBreadCrumb', zhNames)
    //#endregion
</script>
<style lang="scss" scoped></style>
