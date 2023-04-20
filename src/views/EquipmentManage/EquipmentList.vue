<template>
    <!-- 操作区 -->
    <el-row
        class="operate"
        v-if="store.state.userInfo.role === 2"
    >
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

    <el-card>
        <template #header>
            <div class="card-header">
                <span>设备列表</span>
            </div>
        </template>
        <!-- 表格 -->
        <el-table
            ref="tableRef"
            :data="tableList"
            style="width: 100%"
            table-layout="fixed"
            border
        >
            <!-- 展开行 -->
            <el-table-column
                type="expand"
                label="详细信息"
                width="100"
                fixed
            >
                <template #default="scope">
                    <ExpandInfo :info="scope.row" />
                </template>
            </el-table-column>
            <!-- 设备名称 -->
            <el-table-column
                label="设备名称"
                width="200"
                fixed
            >
                <template #default="scope">
                    <el-tooltip
                        :show-after="200"
                        :hide-after="0"
                        class="box-item"
                        effect="dark"
                        :content="scope.row.name"
                        placement="top"
                    >
                        {{ scope.row.name }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- 购置日期 -->
            <el-table-column
                label="购置日期"
                width="110"
            >
                <template #default="scope">
                    {{ formatTime(scope.row.buy_time) }}
                </template>
            </el-table-column>
            <!-- 学科分类 -->
            <el-table-column label="学科分类">
                <template #default="scope">
                    <el-tooltip
                        :show-after="200"
                        :hide-after="0"
                        class="box-item"
                        effect="dark"
                        :content="scope.row.discipline_classification"
                        placement="top"
                    >
                        {{ scope.row.discipline_classification }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- 管理分类 -->
            <el-table-column
                prop="manage_classification"
                label="管理分类"
                min-width="100"
            ></el-table-column>
            <!-- 负责人 -->
            <el-table-column
                prop="manager_name"
                label="负责人"
                v-if="store.state.userInfo.role === 1"
            ></el-table-column>
            <!-- 负责人邮箱 -->
            <el-table-column
                label="负责人邮箱"
                min-width="110"
                v-if="store.state.userInfo.role === 1"
            >
                <template #default="scope">
                    <el-tooltip
                        :show-after="200"
                        :hide-after="0"
                        class="box-item"
                        effect="dark"
                        :content="scope.row.manager_email"
                        placement="top"
                    >
                        {{ scope.row.manager_email }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column
                label="设备状态"
                min-width="80"
            >
                <template #default="scope">
                    <el-tag
                        :type="getType(scope.row.state)"
                        effect="dark"
                        :hit="true"
                    >
                        {{ getState(scope.row.state) }}
                    </el-tag>
                </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column
                label="操作"
                width="280"
                fixed="right"
                v-if="store.state.userInfo.role === 2"
            >
                <template #default="scope">
                    <!-- 编辑设备 -->
                    <el-button
                        type="primary"
                        size="small"
                        link
                        :icon="Edit"
                        @click="goToEdit(scope.row.id)"
                    >
                        编辑设备
                    </el-button>
                    <!-- 维修申请 -->
                    <el-button
                        type="primary"
                        size="small"
                        link
                        :icon="Setting"
                        @click="repair(scope.row)"
                    >
                        维修申请
                    </el-button>
                    <!-- 删除按钮 -->
                    <el-button
                        type="primary"
                        size="small"
                        link
                        :icon="Delete"
                        @click="scrap(scope.row)"
                    >
                        报废申请
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- 申请界面 -->
    <Application
        v-model="applicationDialog"
        :title="applicationTitle"
        :applicationType="applicationType"
        :applicationEquip="applicationEquip"
        @closeDialog="closeDialog"
        @getTableList="getTableList"
    />
</template>

<script setup>
    import { ref, reactive, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import { Delete, Plus, Edit, Setting } from '@element-plus/icons-vue'
    import dayjs from 'dayjs'
    import axios from 'axios'
    import loseFocus from '@/util/loseFocus'
    import ExpandInfo from '@/components/EquipmentList/ExpandInfo.vue'
    import Application from '@/components/EquipmentList/Application.vue'

    //#region 面包屑导航数据
    const route = useRoute()
    const store = useStore()
    const zhNames = route.meta.zh_name
    store.commit('changeBreadCrumb', zhNames)
    //#endregion

    // 获取列表
    const getTableList = async () => {
        let res
        if (store.state.userInfo.role === 1) {
            res = await axios.get(`/admin/equipment/list`)
        } else {
            res = await axios.get(`/admin/equipment/list/${store.state.userInfo.number}`)
        }

        tableList.splice(0, tableList.length, ...res.data.data)
        // console.log(tableList)
    }
    // 表格数据
    const tableList = reactive([])
    // 获取列表
    onMounted(() => {
        getTableList()
    })
    // 获取设备状态
    const getType = state => {
        const colors = ['', 'success', 'warning', 'danger', 'info']
        return colors[state]
    }
    // 获取设备状态
    const getState = state => {
        const stateArr = ['正常状态', '维修申请', '维修状态', '报废申请', '报废状态']
        return stateArr[state]
    }
    // 格式化时间
    const formatTime = timeStamp => {
        const formattedTime = dayjs(timeStamp).format('YYYY-MM-DD')
        return formattedTime
    }

    // 跳转到设备添加页面
    const router = useRouter()
    const goToAdd = () => {
        router.push('/equipment/equipmentadd')
    }
    // 跳转到设备编辑页面
    const goToEdit = id => {
        router.push({
            name: 'equipmentedit',
            params: { id },
        })
    }

    // 申请对话框
    const applicationDialog = ref(false)
    const applicationEquip = ref()
    const applicationType = ref()
    const applicationTitle = ref()
    // 申请维修
    const repair = data => {
        loseFocus()
        if (data.state === 0) {
            applicationTitle.value = '维修申请'
            applicationType.value = 1
            applicationEquip.value = data
            applicationDialog.value = true
        } else {
            ElMessage.info('该设备目前不可申请维修')
        }
    }
    // 申请报废
    const scrap = data => {
        loseFocus()
        if (data.state === 0) {
            applicationTitle.value = '报废申请'
            applicationType.value = 3
            applicationEquip.value = data
            applicationDialog.value = true
        } else {
            ElMessage.info('该设备目前不可申请报废')
        }
    }
    // 关闭申请对话框
    const closeDialog = params => {
        applicationDialog.value = false
    }
</script>
<style lang="scss" scoped>
    .operate {
        width: 100px;
        margin: 20px 0;
        display: flex;
        flex-wrap: nowrap;
    }
    :deep(.el-table__cell .cell) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
<style lang="css">
    .el-popper {
        max-width: 500px;
    }
</style>
