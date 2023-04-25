<template>
    <!-- 页头 -->
    <el-page-header
        @back="goBack"
        :icon="ArrowLeft"
    >
        <template #content>
            <span>修改设备信息</span>
        </template>
    </el-page-header>

    <!-- 填写表单 -->
    <el-form
        :inline="true"
        ref="editEquipmentFormRef"
        :model="editEquipmentForm"
        :rules="editEquipmentFormRules"
    >
        <!-- 设备名称 -->
        <el-form-item
            label="设备名称"
            prop="name"
        >
            <el-input
                v-model="editEquipmentForm.name"
                placeholder="请输入设备名称"
            />
        </el-form-item>
        <!-- 设备价格 -->
        <el-form-item
            label="设备总价"
            prop="price"
        >
            <el-input
                v-model="editEquipmentForm.price"
                @focus="removeUnit"
                @blur="plusUnit"
                placeholder="请输入设备总价"
            />
        </el-form-item>
        <!-- 购置时间 -->
        <el-form-item
            label="购置时间"
            prop="buy_time"
        >
            <el-date-picker
                v-model="editEquipmentForm.buy_time"
                type="date"
                placeholder="请选择购置日期"
                @change="formatTimeStamp"
            ></el-date-picker>
        </el-form-item>
        <!-- 设备型号 -->
        <el-form-item
            label="设备型号"
            prop="model"
        >
            <el-input
                v-model="editEquipmentForm.model"
                placeholder="请输入设备型号"
            />
        </el-form-item>
        <!-- 设备规格 -->
        <el-form-item
            label="设备规格"
            prop="specification"
        >
            <el-input
                v-model="editEquipmentForm.specification"
                placeholder="请输入设备规格"
            />
        </el-form-item>
        <!-- 生产国家 -->
        <el-form-item
            label="生产国家"
            prop="country"
        >
            <el-select
                v-model="editEquipmentForm.country"
                clearable
                filterable
                allow-create
                default-first-option
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
        <!-- 生产厂商 -->
        <el-form-item
            label="生产厂商"
            prop="manufacturer"
        >
            <el-select
                v-model="editEquipmentForm.manufacturer"
                clearable
                filterable
                allow-create
                default-first-option
                placeholder="请选择生产厂商"
            >
                <el-option
                    v-for="item in options.manufacturers"
                    :key="item"
                    :label="item"
                    :value="item"
                />
            </el-select>
        </el-form-item>
        <!-- 设备分类 -->
        <el-form-item
            label="设备分类"
            prop="classification"
        >
            <el-select
                v-model="editEquipmentForm.classification"
                clearable
                filterable
                allow-create
                default-first-option
                placeholder="请选择设备分类"
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
        <el-form-item
            label="学科分类"
            prop="discipline_classification"
        >
            <el-select
                v-model="editEquipmentForm.discipline_classification"
                clearable
                filterable
                allow-create
                default-first-option
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
        <!-- 管理分类 -->
        <el-form-item
            label="管理分类"
            prop="manage_classification"
        >
            <el-select
                v-model="editEquipmentForm.manage_classification"
                clearable
                filterable
                allow-create
                default-first-option
                placeholder="请选择管理分类"
            >
                <el-option
                    v-for="item in options.manage_classifications"
                    :key="item"
                    :label="item"
                    :value="item"
                />
            </el-select>
        </el-form-item>
        <!-- 所属单位 -->
        <el-form-item
            label="所属单位"
            prop="unit"
        >
            <el-select
                v-model="editEquipmentForm.unit"
                clearable
                filterable
                allow-create
                default-first-option
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
        <!-- 安置位置 -->
        <el-form-item
            label="安置位置"
            prop="place"
        >
            <el-input
                v-model="editEquipmentForm.place"
                placeholder="请输入安置位置"
            />
        </el-form-item>
        <!-- 功能应用范围 -->
        <el-form-item
            label="功能应用范围"
            class="textarea"
            prop="function_range"
        >
            <el-input
                v-model="editEquipmentForm.function_range"
                placeholder="请输入功能应用范围"
                type="textarea"
                autosize
            />
        </el-form-item>
        <!-- 主要技术指标 -->
        <el-form-item
            label="主要技术指标"
            class="textarea"
            prop="technical_indicators"
        >
            <el-input
                v-model="editEquipmentForm.technical_indicators"
                placeholder="请输入主要技术指标"
                type="textarea"
                autosize
            />
        </el-form-item>
        <!-- 设备图片 -->
        <el-form-item
            label="设备图片"
            prop="pic"
        >
            <UploadImage
                :image="editEquipmentForm.pic"
                @fileChange="handleChange"
                :max_height="'250px'"
                :max_width="'500px'"
            />
        </el-form-item>
        <!-- 按钮 -->
        <div class="button">
            <!-- 提交按钮 -->
            <el-form-item class="submit">
                <el-button
                    type="primary"
                    @click="submitForm()"
                    size="large"
                >
                    保存
                </el-button>
            </el-form-item>
            <!-- 提交按钮 -->
            <el-form-item class="submit">
                <el-button
                    @click="goBack()"
                    size="large"
                >
                    取消
                </el-button>
            </el-form-item>
        </div>
    </el-form>
</template>
<script setup>
    import { ref, reactive, computed, onMounted, toRaw } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import axios from 'axios'
    import { ArrowLeft } from '@element-plus/icons-vue'
    import UploadImage from '@/components/UploadImage/UploadImage.vue'
    import uploadFile from '@/util/uploadFile'
    import dayjs from 'dayjs'
    import loseFocus from '@/util/loseFocus'

    //#region 面包屑导航数据
    const route = useRoute()
    const store = useStore()
    const zhNames = route.meta.zh_name
    store.commit('changeBreadCrumb', zhNames)
    //#endregion

    // 用id获取设备信息
    onMounted(async () => {
        const res = await axios.get(`/admin/equipment/list/${route.params.id}`)
        Object.assign(editEquipmentForm, res.data.data)
        editEquipmentForm.oldPic = editEquipmentForm.pic
        // 保存原始数据
        initEditForm = JSON.parse(JSON.stringify(toRaw(editEquipmentForm)))
        getOptions()
    })

    // 从数据库获取数据，更改el-select的options
    const getOptions = async () => {
        const res = await axios.get('/admin/equipment/options')
        // console.log(res)
        if (options) {
            for (const i in options) {
                options[i] = Array.from(new Set([...options[i], ...res.data.data[i]]))
                // 去掉空项
                options[i] = options[i].filter(item => item !== '')
            }
        }
    }

    const router = useRouter()
    // 回到设备列表
    const goBack = () => {
        router.push('/equipment/equipmentlist')
    }
    // 表单ref
    const editEquipmentFormRef = ref()
    // 原始数据
    let initEditForm
    // 表单数据
    const editEquipmentForm = reactive({
        // 设备名称
        name: '',
        // 价格
        price: '',
        // 价格区间
        price_range: '',
        // 购买日期
        buy_time: '',
        // 设备型号
        model: '',
        // 设备规格
        specification: '',
        // 产地国别
        country: '',
        // 生产厂商
        manufacturer: '',
        // 设备分类
        classification: '',
        // 学科分类
        discipline_classification: '',
        // 管理分类
        manage_classification: '',
        // 所属单位
        unit: '',
        // 安置地点
        place: '',
        // 功能应用范围
        function_range: '',
        // 主要技术指标
        technical_indicators: '',
        // 设备图片
        pic: null,
        // 图片文件
        file: null,
        // 设备负责人学工号
        manager_number: store.state.userInfo.number,
        // 负责人姓名
        manager_name: store.state.userInfo.name,
        // 负责人手机号
        manager_phone_number: store.state.userInfo.phone_number,
        // 负责人邮箱
        manager_email: store.state.userInfo.email,
    })
    // 表单验证规则
    const editEquipmentFormRules = reactive({
        name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        price: [{ required: true, message: '请输入设备总价', trigger: 'blur' }],
        buy_time: [{ required: true, message: '请选择购置日期', trigger: 'blur' }],
        pic: [{ required: true, message: '请选择设备图片', trigger: 'blur' }],
    })

    //#region 计算price的显示框
    // 聚焦时
    const removeUnit = () => {
        if (editEquipmentForm.price) {
            editEquipmentForm.price = editEquipmentForm.price.replace('元', '')
        }
    }
    // 失焦时
    const plusUnit = () => {
        if (editEquipmentForm.price) {
            editEquipmentForm.price = addUnit(editEquipmentForm.price)
        }
    }
    const addUnit = value => {
        if (value.indexOf('.') === -1) {
            // 如果没有小数点，则默认加上“.00”
            return `${value}.00元`
        }
        const [integerPart, decimalPart] = value.split('.')
        if (decimalPart.length === 1) {
            // 如果小数点后只有一位，则在后面补个0
            return `${integerPart}.${decimalPart}0元`
        }
        return `${value}元` // 如果小数点后超过两位，就直接加上“元”
    }
    //#endregion

    //#region 计算price_range
    // 价格列表
    const priceList = reactive([
        { range: '10万-20万', min: 100000, max: 200000 },
        { range: '20万-50万', min: 200000, max: 500000 },
        { range: '50万-100万', min: 500000, max: 1000000 },
        { range: '100万-500万', min: 1000000, max: 5000000 },
        { range: '500万-1000万', min: 5000000, max: 10000000 },
        { range: '1000万以上', min: 10000000, max: Infinity },
    ])
    // 将price转成number类型
    const priceNumber = computed(() => parseFloat(editEquipmentForm.price))
    // 计算price_range
    const price_range = computed(() => {
        const price = priceNumber.value
        for (let i = 0; i < priceList.length; i++) {
            const { range, min, max } = priceList[i]
            if (price >= min && price <= max) {
                return range
            }
        }
        return '小于10万'
    })
    //#endregion

    //#region 选择器的数据
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
    })

    //#endregion

    //#region 选择时间
    const formatTimeStamp = value => {
        editEquipmentForm.buy_time = dayjs(value).valueOf()
    }
    //#endregion

    // 选择图片
    const handleChange = file => {
        // console.log(file)
        editEquipmentForm.pic = URL.createObjectURL(file)
        editEquipmentForm.file = file
    }

    // 提交表单
    const submitForm = () => {
        loseFocus()
        // 数据是否改变
        if (!(JSON.stringify(initEditForm) === JSON.stringify(editEquipmentForm))) {
            // 修改了信息
            ElMessageBox.confirm('您是否确认修改此设备的信息？', {
                confirmButtonText: '修改',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    editEquipmentFormRef.value.validate(async isValid => {
                        // 格式化数据
                        editEquipmentForm.price_range = price_range.value
                        // console.log(editEquipmentForm)
                        if (isValid) {
                            try {
                                const res = await uploadFile('/admin/equipment/edit', editEquipmentForm)
                                if (res.status === 201) {
                                    ElMessage.success(res.data.message)
                                    router.push('/equipment/equipmentlist')
                                }
                            } catch (error) {
                                ElMessage.error(error.response.data.error)
                            }
                        }
                    })
                })
                .catch(() => {})
        } else {
            ElMessage.info('请修改后再提交')
        }
    }
</script>

<style lang="scss" scoped>
    .el-page-header {
        margin-bottom: 40px;
    }
    :deep(.el-form-item__label) {
        width: 96px;
    }
    :deep(.el-form-item) {
        width: 33.3333%;
        // width: 50%;
        margin-right: 0 !important;
    }
    :deep(.el-select),
    :deep(.el-input_inner) {
        width: 100% !important;
    }
    .textarea {
        :deep(.el-textarea__inner) {
            max-height: 150px !important;
            line-height: 2 !important;
        }
        width: 100%;
    }
    .button {
        display: flex;
        justify-content: flex-start;
        margin-left: 96px;
        .el-form-item {
            width: 100px;
        }
    }
</style>
