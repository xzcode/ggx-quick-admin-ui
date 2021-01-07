<template>
    <div
        class="tab"
        :id="data.path"
        :class="data.active ? 'active' : ''"
        @click="tabClick(data.path)"
    >
        <span class="active-point" v-if="data.active"></span>
        <span class="content">{{ data.name }}</span>
        <i
            @click.stop="tabRemove(data.path)"
            class="el-icon-close close-btn"
            v-if="data.path !== '/main/dashboard'"
        ></i>
    </div>
</template>

<script>
export default {
    name: 'tab',
    props: ['data', 'tabClick', 'tabRemove'],
    data() {
        return {};
    },
    methods: {
        focusEl() {
            const targetElement = document.getElementById(this.data.path);
            if (targetElement) {
                document.getElementById('tab-container').scrollLeft =
                    targetElement.offsetLeft;
            }
        }
    },
    watch: {
        dataActive(active) {
            active && this.focusEl();
        }
    },
    computed: {
        dataActive() {
            return this.data.active;
        }
    },
    created() {},
    mounted() {
        this.focusEl();
    }
};
</script>

<style lang="scss" scoped>
@import '@/css/common.scss';

$tab-bar-height: 34px;

.tab {
    display: flex;
    justify-content: center;
    flex: none;
    height: $tab-bar-height - 10px;
    width: fit-content;
    min-width: 40px;
    background-color: #fff;

    border: none;
    border-radius: 5px;

    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    margin: 5px 5px;
    position: relative;

    padding: 0px 12px;
    color: rgb(143, 143, 143);

    cursor: pointer;

    &.active {
        color: #fff;
        background-color: $color-primary;

        .close-btn:hover {
            color: #fff;
        }
    }

    .close-btn:hover {
        color: $color-primary;
    }

    .active-point {
        width: 10px;
        height: 10px;
        border-radius: 100px;
        background: #ccc;
        position: relative;
        left: -6px;
        top: 7px;
        background: #fff;
    }

    .content {
        font-size: 12px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .close-btn {
        position: relative;
        top: 6px;
        right: -8px;
        color: #ddd;
        cursor: pointer;
        display: block;
        font-size: 12px;
        height: 12px;
    }

    &:hover .close-btn.show {
        display: block;
    }
}
</style>
