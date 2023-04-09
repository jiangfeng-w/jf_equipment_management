<template>Student</template>
<script setup>
    import { useRoute } from 'vue-router'
    import { useStore } from 'vuex'

    const route = useRoute()
    const store = useStore()

    const zhNames = route.meta.zh_name
    store.commit('changeBreadCrumb', zhNames)
</script>
<style lang="scss" scoped></style>
