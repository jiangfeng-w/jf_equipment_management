<template>
    <!-- 筛选搜索 -->
    <el-form
        :inline="true"
        :model="searchForm"
        ref="searchFormRef"
        @keyup.enter="search"
    >
        <!-- 姓名 -->
        <el-form-item label="学生姓名">
            <el-input
                clearable
                v-model="searchForm.name"
                placeholder="搜索学生姓名"
            ></el-input>
        </el-form-item>
        <!-- 专业 -->
        <el-form-item label="学生专业">
            <el-cascader
                clearable
                filterable
                v-model="searchForm.major"
                :options="majors"
                :props="props"
                placeholder="请选择学院专业(可多选)"
                @change="changeMajor"
            />
        </el-form-item>
        <!-- 年级 -->
        <el-form-item label="学生年级">
            <el-cascader
                clearable
                filterable
                v-model="searchForm.grade"
                :options="grades"
                :props="props"
                placeholder="请选择年级(可多选)"
                @change="changeGrade"
            />
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btn">
            <el-button
                type="primary"
                :icon="Search"
                @click="search"
            >
                搜索
            </el-button>
            <el-button
                :icon="Refresh"
                @click="resetSearchForm"
            >
                重置
            </el-button>
        </el-form-item>
    </el-form>
    <!-- 操作区 -->
    <el-row class="operate">
        <el-col>
            <el-button
                type="primary"
                :icon="Plus"
                @click="showAddDialog()"
            >
                新增
            </el-button>
        </el-col>
        <el-col>
            <el-button
                type="danger"
                :icon="Delete"
                :disabled="delDisabled"
                @click="deleteStudents()"
            >
                删除
            </el-button>
        </el-col>
    </el-row>

    <el-card>
        <template #header>
            <div class="card-header">
                <span>学生列表</span>
                <el-tooltip
                    :show-after="200"
                    :hide-after="0"
                    class="box-item"
                    effect="dark"
                    content="刷新列表"
                    placement="top"
                >
                    <el-button
                        circle
                        :icon="Refresh"
                        @click="refresh()"
                    ></el-button>
                </el-tooltip>
            </div>
        </template>
        <!-- 表格 -->
        <el-table
            ref="tableRef"
            :data="tableList"
            style="width: 100%"
            table-layout="fixed"
            @selection-change="selectionLineChangeHandle"
            border
        >
            <el-table-column
                type="selection"
                fixed
            ></el-table-column>
            <el-table-column
                type="index"
                label="序号"
                width="60"
                fixed
            ></el-table-column>
            <el-table-column
                sortable
                prop="number"
                label="学号"
                width="130"
                fixed
            ></el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="100"
            ></el-table-column>
            <el-table-column label="手机号">
                <template #default="scope">
                    <el-tooltip
                        :show-after="200"
                        :hide-after="0"
                        class="box-item"
                        effect="dark"
                        :content="scope.row.phone_number"
                        placement="top"
                    >
                        {{ scope.row.phone_number }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="邮箱">
                <template #default="scope">
                    <el-tooltip
                        :show-after="200"
                        :hide-after="0"
                        class="box-item"
                        effect="dark"
                        :content="scope.row.email"
                        placement="top"
                    >
                        {{ scope.row.email }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="学院">
                <template #default="scope">
                    <el-tooltip
                        :show-after="200"
                        :hide-after="0"
                        class="box-item"
                        effect="dark"
                        :content="scope.row.academy"
                        placement="top"
                    >
                        {{ scope.row.academy }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="专业">
                <template #default="scope">
                    <el-tooltip
                        :show-after="200"
                        :hide-after="0"
                        class="box-item"
                        effect="dark"
                        :content="scope.row.major"
                        placement="top"
                    >
                        {{ scope.row.major }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                sortable
                prop="grade"
                label="年级"
            ></el-table-column>
            <!-- 操作 -->
            <el-table-column
                label="操作"
                width="130"
                fixed="right"
            >
                <template #default="scope">
                    <!-- 编辑按钮 -->
                    <el-button
                        type="primary"
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
                                type="primary"
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
    </el-card>

    <!-- 分页 -->
    <el-pagination
        v-if="listLength"
        v-model:current-page="searchForm.currentPage"
        v-model:page-size="searchForm.pageSize"
        :page-sizes="[5, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listLength"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />

    <!-- 添加学生对话框 -->
    <AddStudent
        v-model="addDalogVisible"
        @closeAddDialog="closeAddDialog()"
        @getTableList="getTableList()"
    />
    <!-- 编辑学生对话框 -->
    <EditStudent
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
    import { Edit, Delete, Plus, Refresh, Search } from '@element-plus/icons-vue'
    import AddStudent from '@/components/Student/AddStudent.vue'
    import EditStudent from '@/components/Student/EditStudent.vue'
    import loseFocus from '@/util/loseFocus'
    import axios from 'axios'

    //#region 面包屑导航数据
    const route = useRoute()
    const store = useStore()
    const zhNames = route.meta.zh_name
    store.commit('changeBreadCrumb', zhNames)
    //#endregion

    //#region
    // 筛选搜索
    const searchFormRef = ref()
    const searchForm = reactive({
        name: '',
        major: [],
        grade: [],
        pageSize: 5,
        currentPage: 1,
    })
    const majors = reactive([])
    const grades = reactive([])
    const props = {
        expandTrigger: 'hover',
        multiple: true,
    }

    // 改变专业
    const changeMajor = value => {
        searchForm.major = value.filter(subArr => subArr.length > 0).map(subArr => subArr[subArr.length - 1])
    }
    // 改变年级
    const changeGrade = value => {
        searchForm.grade = value.filter(subArr => subArr.length > 0).map(subArr => subArr[subArr.length - 1])
    }
    // 搜索
    const search = () => {
        loseFocus()
        getLength()
        getTableList()
    }
    // 重置
    const resetSearchForm = () => {
        loseFocus()
        searchForm.name = ''
        searchForm.major = []
        searchForm.grade = []
        getLength()
        getTableList()
    }

    // 分页
    const handleSizeChange = val => {
        getLength()
        getTableList()
    }
    const handleCurrentChange = val => {
        getLength()
        getTableList()
    }
    // 获取长度
    const listLength = ref()

    //#endregion

    // 获取列表
    const getTableList = async () => {
        const res = await axios.post('/admin/student/list', searchForm)
        tableList.splice(0, tableList.length, ...res.data.data)
        // console.log(tableList)
    }
    // 获取列表长度
    const getLength = async () => {
        const res = await axios.post('/admin/student/listLength', searchForm)
        listLength.value = res.data.data
    }
    // 获取专业和年级
    const getMajors = async () => {
        const res = await axios.get('/admin/student/major')
        Object.assign(majors, res.data.data.majors)
        Object.assign(grades, res.data.data.grades)
    }
    // 表格数据
    const tableList = reactive([])
    // 获取列表
    onMounted(() => {
        getLength()
        getTableList()
        getMajors()
    })

    // 刷新
    const refresh = () => {
        loseFocus()
        getLength()
        getTableList()
    }

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

    // 表格的ref
    const tableRef = ref()
    // 控制删除按钮是否禁用
    const delDisabled = ref(true)
    // 批量删除学生
    const deleteStudents = async () => {
        loseFocus()
        // 把选中的id取出来
        const ids = selectLine.map(item => {
            return item.id
        })
        // console.log(ids)
        try {
            await ElMessageBox.confirm('确认删除这几个学生的数据吗', '系统提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning',
            })
            try {
                const res = await axios.post('/admin/student/delete', { ids })
                if (res.status === 200) {
                    getTableList()
                }
            } catch (error) {
                ElMessage.error(error.response.data.error)
                getTableList()
            }
        } catch (error) {
            tableRef.value.clearSelection()
        }
    }
    // 删除单个学生
    const deleteConfirm = async data => {
        const ids = [data.id]
        // console.log(ids)
        try {
            const res = await axios.post('/admin/student/delete', { ids })
            if (res.status === 200) {
                getTableList()
            }
        } catch (error) {
            ElMessage.error(error.response.data.error)
            getTableList()
        }
    }
</script>
<style lang="scss" scoped>
    .operate {
        width: 92px;
        margin-bottom: 20px;
        display: flex;
        flex-wrap: nowrap;
    }
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    // 表格不能换行
    :deep(.cell) {
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    :deep(.el-cascader) {
        width: 100%;
    }
    :deep(.el-form-item:not(:last-child)) {
        width: 49%;
        margin-right: 10px !important;
    }
    // 选择倒数第二个框
    :deep(.el-form-item:nth-last-child(2)) {
        width: 84%;
        margin-right: 10px !important;
    }
    :deep(.el-form-item__content) {
        width: 100%;
        // padding-left: 80px;
    }
    :deep(.el-select),
    :deep(.el-input_inner) {
        width: 100%;
    }
    .btn {
        margin-right: 0;
    }
    .el-pagination {
        margin-top: 15px;
    }
</style>
