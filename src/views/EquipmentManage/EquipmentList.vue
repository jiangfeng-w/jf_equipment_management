<template>
    <!-- 筛选搜索 -->
    <el-form
        :inline="true"
        :model="searchForm"
        ref="searchFormRef"
        @keyup.enter="search"
    >
        <!-- 设备名称 -->
        <el-form-item label="设备名称">
            <el-input
                v-model="searchForm.name"
                placeholder="搜索设备名称"
            />
        </el-form-item>
        <!-- 功能范围 -->
        <el-form-item label="功能范围">
            <el-input
                v-model="searchForm.function_range"
                placeholder="搜索功能范围"
            />
        </el-form-item>
        <!-- 设备分类 -->
        <el-form-item label="学科分类">
            <el-select
                v-model="searchForm.classification"
                clearable
                filterable
                multiple
                placeholder="请选择学科分类"
            >
                <el-option
                    v-for="item in options.classifications"
                    :key="item"
                    :label="item"
                    :value="item"
                />
            </el-select>
        </el-form-item>
        <!-- 学科分类 -->
        <el-form-item label="学科分类">
            <el-select
                v-model="searchForm.discipline_classification"
                clearable
                filterable
                multiple
                placeholder="请选择学科分类"
            >
                <el-option
                    v-for="item in options.discipline_classifications"
                    :key="item"
                    :label="item"
                    :value="item"
                />
            </el-select>
        </el-form-item>
        <!-- 所属单位 -->
        <el-form-item label="所属单位">
            <el-select
                v-model="searchForm.unit"
                clearable
                filterable
                multiple
                placeholder="请选择所属单位"
            >
                <el-option
                    v-for="item in options.units"
                    :key="item"
                    :label="item"
                    :value="item"
                />
            </el-select>
        </el-form-item>
        <!-- 生产国家 -->
        <el-form-item label="生产国家">
            <el-select
                v-model="searchForm.country"
                clearable
                filterable
                multiple
                placeholder="请选择生产国家"
            >
                <el-option
                    v-for="item in options.countrys"
                    :key="item"
                    :label="item"
                    :value="item"
                />
            </el-select>
        </el-form-item>
        <!-- 价格区间 -->
        <el-form-item label="价格区间">
            <el-select
                v-model="searchForm.price_range"
                clearable
                filterable
                multiple
                placeholder="请选择价格区间"
            >
                <el-option
                    v-for="item in options.price_range"
                    :key="item"
                    :label="item"
                    :value="item"
                />
            </el-select>
        </el-form-item>
        <!-- 设备状态 -->
        <el-form-item label="设备状态">
            <el-select
                v-model="searchForm.state"
                clearable
                filterable
                multiple
                placeholder="请选择设备状态"
            >
                <el-option
                    v-for="item in states"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
        </el-form-item>
        <!-- 购置时间 -->
        <el-form-item
            label="购置时间"
            class="time"
        >
            <el-date-picker
                v-model="searchForm.buy_time"
                type="daterange"
                :shortcuts="shortcuts"
                range-separator="~"
                start-placeholder="购置开始"
                end-placeholder="购置截止"
                @change="formatTimeStamp"
            />
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
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
                prop="id"
                label="设备名称"
                min-width="300"
                fixed
                sortable
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
                        {{ `(${scope.row.id.toString().padStart(8, '0')}) ${scope.row.name}` }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- 购置日期 -->
            <el-table-column
                prop="buy_time"
                label="购置日期"
                width="110"
                sortable
            >
                <template #default="scope">
                    {{ formatTime(scope.row.buy_time) }}
                </template>
            </el-table-column>
            <!-- 学科分类 -->
            <el-table-column
                label="学科分类"
                min-width="100"
            >
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
                prop="state"
                label="设备状态"
                min-width="100"
                sortable
            >
                <template #default="scope">
                    <el-tag
                        :type="getType(scope.row.state)"
                        :effect="getEffect(scope.row.state)"
                        :hit="true"
                    >
                        {{ getState(scope.row.state) }}
                    </el-tag>
                </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column
                label="操作"
                width="250"
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
                    <!-- 设备培训 -->
                    <el-button
                        type="primary"
                        size="small"
                        link
                        :icon="Plus"
                        @click="addTrainCourse(scope.row.id)"
                    >
                        设备培训
                    </el-button>
                    <!-- 更多 -->
                    <el-popover
                        placement="bottom-start"
                        :width="180"
                        trigger="hover"
                    >
                        <template #reference>
                            <el-button
                                type="primary"
                                size="small"
                                link
                                :icon="DArrowRight"
                                @click="loseFocus"
                            >
                                更多
                            </el-button>
                        </template>

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
                    </el-popover>
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
    import { Delete, Plus, Edit, DArrowRight, Setting, Search, Refresh } from '@element-plus/icons-vue'
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

    //#region 筛选搜索
    const searchFormRef = ref()
    const searchForm = reactive({
        name: '',
        function_range: '',
        classification: [],
        discipline_classification: [],
        unit: [],
        country: [],
        price_range: [],
        buy_time: [],
        state: [],
        pageSize: 5,
        currentPage: 1,
    })

    // 搜索
    const search = async () => {
        loseFocus()
        getLength()
        getTableList()
    }
    // 重置
    const resetSearchForm = () => {
        loseFocus()
        searchForm.name = ''
        searchForm.function_range = ''
        searchForm.classification = []
        searchForm.discipline_classification = []
        searchForm.unit = []
        searchForm.country = []
        searchForm.price_range = []
        searchForm.buy_time = []
        searchForm.state = []
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
    // 获取列表长度
    const getLength = async () => {
        let res
        if (store.state.userInfo.role === 1) {
            res = await axios.post('/admin/equipment/listLength', searchForm)
        } else {
            searchForm.iden = store.state.userInfo.number
            res = await axios.post('/admin/equipment/listLength', searchForm)
        }
        listLength.value = res.data.data
    }

    //#region 选择器的数据
    // 从数据库获取数据，更改el-select的options
    const getOptions = async () => {
        const res = await axios.get('/admin/equipment/options')
        if (options) {
            for (const i in res.data.data) {
                // console.log(options[i])
                options[i] = Array.from(new Set([...options[i], ...res.data.data[i]]))
                // 去掉空项
                options[i] = options[i].filter(item => item !== '')
            }
        }
    }

    const options = reactive({
        // 生产国家
        countrys: ['美国', '英国', '日本', '法国', '德国', '中国'],
        // 生产厂商
        manufacturers: ['卡尔蔡司显微图像有限公司', '瑞士梅特勒-托利多', 'FEI Czech Republic S.r.o'],
        // 设备分类
        classifications: [
            '分析仪器',
            '地球探测仪器',
            '计量仪器',
            '电子测量仪器',
            '海洋仪器',
            '地球探测仪器',
            '大气探测仪器',
            '医学诊断仪器',
            '核仪器',
            '特种检测仪器',
            '工艺实验设备',
            '计算机及其配套设备',
            '激光器',
            '其他仪器',
            '未分类',
        ],
        // 学科分类
        discipline_classifications: [
            '经济学',
            '信息科学与系统科学',
            '力学',
            '工程与技术科学基础学科',
            '矿山工程技术',
            '能源科学技术',
            '地球科学',
            '材料科学',
            '电子与通信技术',
            '化学',
            '动力与电气工程',
            '农学',
            '环境科学技术及资源科学技术',
            '自然科学相关工程与技术',
            '冶金工程技术',
            '机械工程',
            '物理学',
            '测绘科学技术',
            '信息与系统科学相关工程与技术',
            '安全科学技术',
            '中医学与中药学',
            '化学工程',
            '管理学',
            '产品应用相关工程与技术',
            '计算机科学技术',
            '土木建筑工程',
            '生物学',
            '体育科学',
        ],
        // 管理分类
        manage_classifications: ['公共服务类', '教学类', '学术方向类', '科研经费购置类'],
        // 所属单位
        units: [
            '南充校区',
            '石油与天然气工程学院',
            '地球科学与技术学院',
            '机电工程学院',
            '化学化工学院',
            '新能源与材料学院',
            '计算机科学学院',
            '电气信息学院',
            '土木工程与测绘学院',
            '理学院',
            '体育学院（体育工作委员会）',
            '实验室与设备管理处',
            '油气藏地质及开发工程国家重点实验室',
            '工程训练中心',
            '光伏产业技术研究院',
            '海洋天然气水合物研究院',
            '工程学院',
            '信息学院',
            '财经学院',
            '新能源和非常规油气研究院',
        ],
        // 价格区间
        price_range: ['10万-20万', '20万-50万', '50万-100万', '500万-1000万', '1000万以上'],
    })

    // 设备状态
    const states = [
        {
            label: '正常状态',
            value: 0,
        },
        {
            label: '维修申请状态',
            value: 1,
        },
        {
            label: '维修申请失败',
            value: 2,
        },
        {
            label: '维修中',
            value: 3,
        },
        {
            label: '报废申请状态',
            value: 4,
        },
        {
            label: '报废申请失败',
            value: 5,
        },
        {
            label: '已报废',
            value: 7,
        },
    ]
    //#endregion

    // 时间选择
    const shortcuts = [
        {
            text: '1年内',
            value: () => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
                return [start, end]
            },
        },
        {
            text: '1-3年',
            value: () => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 3)
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 365 * 1)
                return [start, end]
            },
        },
        {
            text: '3-5年',
            value: () => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 5)
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 365 * 3)
                return [start, end]
            },
        },
        {
            text: '5-7年',
            value: () => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 7)
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 365 * 5)
                return [start, end]
            },
        },
        {
            text: '7-10年',
            value: () => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 10)
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 365 * 7)
                return [start, end]
            },
        },
        {
            text: '10年以上',
            value: () => {
                const end = new Date()
                const start = new Date(1958, 0, 1, 0, 0, 0)
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 365 * 10)
                return [start, end]
            },
        },
    ]

    //#region 选择时间后格式化
    const formatTimeStamp = value => {
        searchForm.buy_time = value.map(item => {
            return dayjs(item).valueOf()
        })
    }
    //#endregion
    //#endregion

    // 获取列表
    const getTableList = async () => {
        let res
        if (store.state.userInfo.role === 1) {
            res = await axios.post(`/admin/equipment/list`, searchForm)
        } else {
            searchForm.iden = store.state.userInfo.number
            res = await axios.post(`/admin/equipment/list`, searchForm)
        }

        tableList.splice(0, tableList.length, ...res.data.data)
    }
    // 表格数据
    const tableList = reactive([])
    // 获取列表
    onMounted(() => {
        getLength()
        getTableList()
        getOptions()
    })
    // 刷新
    const refresh = () => {
        loseFocus()
        getLength()
        getTableList()
    }

    // 获取设备状态
    const getType = state => {
        const colors = ['', 'warning', 'warning', 'warning', 'danger', 'danger', 'danger']
        return colors[state]
    }
    const getEffect = state => {
        const effects = ['dark', 'light', 'plain', 'dark', 'light', 'plain', 'dark']
        return effects[state]
    }
    // 获取设备状态
    const getState = state => {
        const stateArr = ['正常状态', '维修申请中', '维修申请失败', '维修中', '报废申请中', '报废申请失败', '已报废']
        return stateArr[state]
    }
    // 格式化时间
    const formatTime = timeStamp => {
        const formattedTime = dayjs(Number(timeStamp)).format('YYYY-MM-DD')
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

    // 设备培训课程
    const addTrainCourse = id => {
        router.push({
            name: 'addtraincourse',
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
            ElMessage.warning('该设备目前不可申请维修')
        }
    }
    // 申请报废
    const scrap = data => {
        loseFocus()
        if (data.state === 0) {
            applicationTitle.value = '报废申请'
            applicationType.value = 4
            applicationEquip.value = data
            applicationDialog.value = true
        } else {
            ElMessage.warning('该设备目前不可申请报废')
        }
    }
    // 关闭申请对话框
    const closeDialog = params => {
        applicationDialog.value = false
        trainDialog.value = false
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
    // 选择最后两个，按钮和时间选择器
    :deep(.el-form-item:nth-last-child(-n + 2)) {
        width: 99%;
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
    .el-pagination {
        margin-top: 15px;
    }
</style>
