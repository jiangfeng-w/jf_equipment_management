<template>
    <!-- 操作区 -->
    <el-row class="operate">
        <el-col>
            <el-button
                type="primary"
                :icon="Plus"
                plain
                @click="showAddDialog()"
            >
                增加
            </el-button>
        </el-col>
        <el-col>
            <el-button
                type="danger"
                :icon="Delete"
                plain
                :disabled="delDisabled"
                @click="deleteTeachers()"
            >
                删除
            </el-button>
        </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
        :data="tableList"
        style="width: 100%"
        table-layout="auto"
        @selection-change="selectionLineChangeHandle"
    >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
            prop="number"
            label="学工号"
        ></el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
        ></el-table-column>
        <el-table-column
            prop="phone_number"
            label="手机号"
        ></el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
        ></el-table-column>
        <el-table-column
            prop="academy"
            label="学院"
            wi
        ></el-table-column>
        <el-table-column
            prop="lab"
            label="实验室"
        ></el-table-column>
        <!-- 操作 -->
        <el-table-column
            label="操作"
            width="250"
        >
            <template #default="scope">
                <!-- 编辑按钮 -->
                <el-button
                    type="success"
                    size="small"
                    link
                    :icon="Edit"
                    @click="showEditDialog(scope.row)"
                >
                    编辑
                </el-button>
                <!-- 删除按钮 -->
                <el-popconfirm
                    width="220"
                    confirm-button-text="确认"
                    cancel-button-text="取消"
                    title="确认删除此学生?"
                    @confirm="deleteConfirm(scope.row)"
                >
                    <template #reference>
                        <el-button
                            type="danger"
                            size="small"
                            link
                            :icon="Delete"
                            @click="loseFocus()"
                        >
                            删除
                        </el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>

    <!-- 添加老师对话框 -->
    <AddTeacher
        v-model="addDalogVisible"
        @closeAddDialog="closeAddDialog()"
        @getTeachers="getTableList()"
    />
    <!-- 编辑老师信息对话框 -->
    <EditTeacher
        v-model="editDalogVisible"
        :editID="editID"
        @closeEditDialog="closeEditDialog()"
        @getTableList="getTableList()"
    />
</template>
<script setup>
    import { useRoute } from 'vue-router'
    import { useStore } from 'vuex'
    import { ref, reactive, onMounted } from 'vue'
    import { Edit, Delete, Plus } from '@element-plus/icons-vue'
    import AddTeacher from '@/components/Teacher/AddTeacher.vue'
    import EditTeacher from '@/components/Teacher/EditTeacher.vue'
    import loseFocus from '@/util/loseFocus'
    import axios from 'axios'

    //#region 面包屑导航数据
    const route = useRoute()
    const store = useStore()
    const zhNames = route.meta.zh_name
    store.commit('changeBreadCrumb', zhNames)
    //#endregion

    // 获取列表
    const getTableList = async () => {
        const res = await axios.get('/admin/teacher/list')
        tableList.splice(0, tableList.length, ...res.data.data)
        // console.log(tableList)
    }
    // 表格数据
    const tableList = reactive([])
    // 获取列表
    onMounted(() => {
        getTableList()
    })

    // 添加对话框
    const addDalogVisible = ref(false)
    const showAddDialog = () => {
        loseFocus()
        addDalogVisible.value = true
    }
    const closeAddDialog = () => {
        addDalogVisible.value = false
    }

    // 编辑对话框
    const editDalogVisible = ref(false)
    // const editForm = reactive({})
    const editID = ref()
    const showEditDialog = data => {
        loseFocus()
        // Object.assign(editForm, data)
        editID.value = data.id
        // console.log(editID)
        editDalogVisible.value = true
    }
    const closeEditDialog = () => {
        editDalogVisible.value = false
    }

    // 选中的列
    const selectLine = reactive([])
    const selectionLineChangeHandle = val => {
        // console.log(val)
        selectLine.splice(0, selectLine.length, ...val)
        if (selectLine.length !== 0) {
            delDisabled.value = false
        } else {
            delDisabled.value = true
        }
    }
    // 控制删除按钮是否禁用
    const delDisabled = ref(true)

    // 批量删除老师
    const deleteTeachers = async () => {
        loseFocus()
        // 把选中的id取出来
        const ids = selectLine.map(item => {
            return item.id
        })
        // console.log(ids)
        try {
            await ElMessageBox.confirm('确认删除这几个老师的数据吗', '系统提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning',
            })
            try {
                const res = await axios.post('/admin/teacher/delete', { ids })
                if (res.status === 200) {
                    getTableList()
                }
            } catch (error) {
                // ElMessage.error(error.response.data.error)
                getTableList()
            }
        } catch (error) {}
    }
    // 删除单个学生
    const deleteConfirm = async data => {
        const ids = [data.id]
        // console.log(ids)
        try {
            const res = await axios.post('/admin/teacher/delete', { ids })
            if (res.status === 200) {
                getTableList()
            }
        } catch (error) {
            console.log(error.response)
            // ElMessage.error(error.response.data.error)
            getTableList()
        }
    }
</script>
<style lang="scss" scoped>
    .operate {
        width: 100px;
        margin: 20px 0;
        display: flex;
        flex-wrap: nowrap;
    }
</style>
