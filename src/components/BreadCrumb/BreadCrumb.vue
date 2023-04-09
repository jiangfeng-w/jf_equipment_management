<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item
            v-for="(crumb, index) in crumbs"
            :key="index"
        >
            {{ crumb }}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script setup>
    import { useStore } from 'vuex'
    import { computed } from 'vue'

    const store = useStore()
    const crumbs = computed(() => {
        return store.state.BreadCrumb
    })
</script>
