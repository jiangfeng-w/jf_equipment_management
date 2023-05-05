<template>
    <div class="equipment">
        <div class="left">
            <div class="image-container">
                <img
                    :src="info.pic"
                    :alt="info.name"
                />
            </div>
        </div>
        <div class="info-container">
            <div class="name">{{ `(${info.id.toString().padStart(8, '0')}) ${info.name}` }}</div>
            <ul>
                <li class="info-row">
                    <span class="info-key">安置地点：</span>
                    <span class="info-value">{{ info.place }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">所属单位：</span>
                    <span class="info-value">{{ info.unit }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">设备负责人：</span>
                    <span class="info-value">{{ info.manager_name }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">电子邮箱：</span>
                    <span class="info-value">{{ info.manager_email }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">联系电话：</span>
                    <span class="info-value">{{ info.manager_phone_number }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">设备国别：</span>
                    <span class="info-value">{{ info.country }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">生产厂商：</span>
                    <span class="info-value">{{ info.manufacturer }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">购置日期：</span>
                    <span class="info-value">{{ formatTime(info.buy_time) }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">设备总价</span>
                    <span class="info-value">{{ info.price }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">设备分类：</span>
                    <span class="info-value">{{ info.classification }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">学科分类：</span>
                    <span class="info-value">{{ info.discipline_classification }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">管理分类：</span>
                    <span class="info-value">{{ info.manage_classification }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">设备型号：</span>
                    <span class="info-value">{{ info.model }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">设备规格：</span>
                    <span class="info-value">{{ info.specification }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">功能应用范围：</span>
                    <span class="info-value">{{ info.function_range }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">主要技术指标：</span>
                    <span class="info-value">{{ info.technical_indicators }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
    import dayjs from 'dayjs'

    const props = defineProps({
        info: Object,
    })

    // 格式化时间
    const formatTime = timeStamp => {
        const formattedTime = dayjs(Number(timeStamp)).format('YYYY-MM-DD')
        return formattedTime
    }
</script>

<style lang="scss" scoped>
    .equipment {
        display: flex;
        align-items: flex-start;
        width: 100%;
        padding: 16px;
    }

    .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 430px;

        .image-container {
            margin-right: 16px;
            width: 400px;
            height: 255px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px dashed #dbdbdb;

            img {
                max-width: 400px;
                max-height: 255px;
            }
        }
    }

    .info-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        border-bottom: 1px solid #e7eaec;
        .name {
            margin-top: -5px;
            margin-bottom: 10px;
            font-size: 25px;
            font-weight: bold;
            text-align: center;
        }
        ul {
            width: 100%;
            .info-row {
                line-height: 35px;
                list-style: none;
                display: flex;
                width: 100%;
                border-top: 1px solid #e7eaec;
                .info-key {
                    min-width: 110px;
                    font-weight: bold;
                }
                .info-value {
                    max-width: 650px;
                }
            }
        }
    }
</style>
