<template>
    <div class="count-card" :style="{ color: color }">
        <div class="count-card-icon" :style="{ color: color }" shape="square">
            <i :class="icon"></i>
        </div>
        <div class="count-card-content">
            <div class="item">
                <div class="item-content item-content-title">{{ title }}</div>
            </div>
            <div class="item">
                <count-to class="item-content item-content-number" :startVal="0" :endVal="countEndVal" :duration="2000"></count-to>
            </div>
        </div>
    </div>
</template>

<script>
import countTo from 'vue-count-to';
export default {
    components: {
        'count-to': countTo
    },
    props: {
        title: { type: String, default: 'NEW CARD' },
        icon: { type: String, default: 'el-icon-question' },
        color: { type: String, default: '#ccc' },
        countStartVal: { type: Number, default: 0 },
        countEndVal: { type: Number, default: 0 },
        countDuration: { type: Number, default: 2000 }
    },
    data() {
        return {};
    },
    created() {},
    methods: {}
};
</script>

<style lang="scss">
$height: 60px;
.count-card {
    padding: 5px 20px;
    margin: 5px 40px 5px 0px;
    background-color: #fff;
    min-width: 200px;
    height: $height;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .count-card-icon {
        margin-right: 10px;
        width: $height;
        height: $height;
        display: flex;
        font-size: $height;
        float: left;
    }
    .count-card-content {
        height: $height;
        float: right;
        display: flex;
        flex-direction: column;
        justify-items: center;

        .item {
            height: $height/ 2;
            flex-grow: 1;
            display: flex;
            justify-content: center;
            justify-items: center;
            flex-direction: column;

            .item-content {
                height: 20px;
                font-size: 16px;
                line-height: 20px;

                text-align: right;
                &.item-content-title {
                    color: #ccc;
                }
                &.item-content-number {
                    font-weight: bold;
                    color: #666;
                }
            }
        }
    }
}
</style>
