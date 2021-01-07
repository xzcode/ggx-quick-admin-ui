<template>
    <div class="dashboard">
        <div class="panel">
            <counting-card
                :countEndVal="onlineUsers"
                title="在线用户"
                icon="el-icon-s-flag"
                color="#f9eb44"
            ></counting-card>
            <counting-card
                :countEndVal="activeUsers"
                title="活跃用户"
                icon="el-icon-star-on"
                color="#67C23A"
            ></counting-card>
            <counting-card
                :countEndVal="newUsers"
                title="总用户"
                icon="el-icon-user-solid"
                color="#409EFF"
            ></counting-card>
        </div>
    </div>
</template>

<script>
import countingCard from './components/counting-card';
export default {
    name: 'dashboard',
    components: {
        'counting-card': countingCard
    },
    data() {
        return {
            newUsers: 123450000,
            activeUsers: 6688541,
            onlineUsers: 188688
        };
    },
    created() {},
    methods: {}
};
</script>

<style lang="scss">
.dashboard {
    display: flex;
    flex-direction: column;
    height: 100%;

    .panel {
        display: flex;
        padding: 10px 0px;

        margin: 5px 0px;
        flex-wrap: wrap;
    }
}
</style>
