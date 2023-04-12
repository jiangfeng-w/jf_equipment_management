<template>Center</template>
<script setup>
    import { useRoute } from 'vue-router'
    import { useStore } from 'vuex'
    import { ref, reactive, onMounted } from 'vue'
    // import { Edit, Delete, Plus } from '@element-plus/icons-vue'
    import loseFocus from '@/util/loseFocus'
    import axios from 'axios'

    //#region 面包屑导航数据
    const route = useRoute()
    const store = useStore()
    const zhNames = route.meta.zh_name
    store.commit('changeBreadCrumb', zhNames)
    //#endregion
</script>
<style lang="scss" scoped></style>
