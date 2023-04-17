<template>
    <!-- 操作区 -->
    <el-row class="operate">
        <el-col>
            <el-button
                type="primary"
                :icon="Plus"
                plain
                @click="goToAdd()"
            >
                新增
            </el-button>
        </el-col>
        <el-col>
            <el-button
                type="danger"
                :icon="Delete"
                plain
            >
                删除
            </el-button>
        </el-col>
    </el-row>
</template>

<script setup>
    import { useRoute, useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import { Delete, Plus } from '@element-plus/icons-vue'

    //#region 面包屑导航数据
    const route = useRoute()
    const store = useStore()
    const zhNames = route.meta.zh_name
    store.commit('changeBreadCrumb', zhNames)
    //#endregion

    // 跳转到设备添加页面
    const router = useRouter()
    const goToAdd = () => {
        router.push('/equipment/equipmentadd')
    }
</script>
<style lang="scss" scoped></style>
