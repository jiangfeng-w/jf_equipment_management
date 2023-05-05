<template>
    <div class="equipment">
        <!-- <div class="left">
            <div class="image-container">
                <img
                    :src="info.now_pic"
                    :alt="info.name"
                />
            </div>
        </div> -->
        <div class="info-container">
            <ul>
                <li class="info-row">
                    <span class="info-key">设备名称：</span>
                    <span class="info-value">{{ info.equip_name }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">项目名称：</span>
                    <span class="info-value">{{ info.project_name }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">培训内容：</span>
                    <span class="info-value">{{ info.train_content || '*' }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">指导教师：</span>
                    <span class="info-value">{{ info.manager_name }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">联系方式：</span>
                    <span class="info-value">{{ info.manager_email }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">培训人数：</span>
                    <span class="info-value">{{ `${info.train_total_count} 人` }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">报名人数：</span>
                    <span class="info-value">{{ `${info.signup_count} 人` }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">报名截止：</span>
                    <span class="info-value">{{ formatTime(info.signup_deadline) }}</span>
                </li>
                <li class="info-row">
                    <span class="info-key">培训时间：</span>
                    <span class="info-value">
                        {{ `${formatTime(info.train_start)} ~ ${formatTime(info.train_end)}` }}
                    </span>
                </li>
                <li class="info-row">
                    <span class="info-key">申请状态：</span>
                    <span class="info-value">
                        <el-tag
                            :type="getType(info)"
                            effect="dark"
                        >
                            {{ getState(info) }}
                        </el-tag>
                    </span>
                </li>
                <li class="info-row">
                    <span class="info-key">补充说明：</span>
                    <span class="info-value">{{ info.tips || '*' }}</span>
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
    // 获取设备状态
    const getType = data => {
        const colors = ['success', '', 'info']
        return colors[data.state]
    }
    const getState = data => {
        const states = ['报名中', '培训中', '已结束']
        return states[data.state]
    }

    // 格式化时间
    const formatTime = timeStamp => {
        const formattedTime = dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss')
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

    .info-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        // border-bottom: 1px solid #e7eaec;

        ul {
            width: 100%;
            .info-row {
                line-height: 35px;
                list-style: none;
                display: flex;
                width: 100%;
                // border-top: 1px solid #e7eaec;
                .info-key {
                    min-width: 110px;
                    font-weight: bold;
                    display: flex;
                    justify-content: flex-end;
                }
                .info-value {
                    max-width: 650px;
                }
            }
        }
    }
</style>
