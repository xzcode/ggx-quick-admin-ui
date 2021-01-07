<template>
    <div class="tab-bar">
        <div class="tab-bar-container">
            <div class="prev-tab" @click="tabbarScrollLeft">
                <i class="el-icon-arrow-left"></i>
            </div>
            <transition-group
                name="fade"
                mode="out-in"
                class="tab-container"
                id="tab-container"
                @mousewheel.native="tabBarScroll"
                ref="tabContainer"
            >
                <template v-for="item in tabs">
                    <tab
                        :key="item.path"
                        :data="item"
                        :tabClick="tabClick"
                        :tabRemove="tabRemove"
                    />
                </template>
            </transition-group>
            <div class="next-tab" @click="tabbarScrollRight">
                <i class="el-icon-arrow-right"></i>
            </div>
            <el-dropdown
                class="options"
                placement="bottom-start"
                type="button"
                @command="tabMenuCommand"
                trigger="click"
            >
                <i class="el-icon-caret-bottom"></i>
                <el-dropdown-menu slot="dropdown" class="menu">
                    <el-dropdown-item
                        command="close-current"
                        class="menu-item"
                        icon="el-icon-error"
                    >
                        关闭当前
                    </el-dropdown-item>
                    <el-dropdown-item
                        command="close-left"
                        class="menu-item"
                        icon="el-icon-caret-left"
                    >
                        关闭左侧
                    </el-dropdown-item>
                    <el-dropdown-item
                        command="close-right"
                        class="menu-item"
                        icon="el-icon-caret-right"
                    >
                        关闭右侧
                    </el-dropdown-item>
                    <el-dropdown-item
                        command="close-all"
                        class="menu-item"
                        icon="el-icon-info"
                    >
                        关闭所有
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import tab from './component/tab/index.vue';

export default {
    name: 'tabbar',
    props: ['tabs', 'tabClick', 'tabRemove'],
    components: {
        tab
    },
    data() {
        return {};
    },
    mounted() {
        window.addEventListener('scroll', this.tabBarScroll, true);
    },
    destroyed() {
        window.removeEventListener('scroll', this.tabBarScroll, true);
    },
    computed: {},
    watch: {},
    methods: {
        tabBarScroll(e) {
            if (e.type === 'scroll') {
                return;
            }
            const _this = this.$refs.tabContainer.$el;
            var step = 30;
            if (e.deltaY < 0) {
                // 向上滚动鼠标滚轮，屏幕滚动条左移
                _this.scrollLeft -= step;
            } else {
                // 向下滚动鼠标滚轮，屏幕滚动条右移
                _this.scrollLeft += step;
            }
        },
        tabMenuCommand(command) {
            switch (command) {
                case 'close-current':
                    this.tabRemoveCurrent();
                    break;
                case 'close-left':
                    this.tabRemoveLeft();
                    break;
                case 'close-right':
                    this.tabRemoveRight();
                    break;
                case 'close-all':
                    this.tabRemoveAll();
                    break;

                default:
                    break;
            }
        },
        tabbarScrollLeft() {
            const _this = this.$refs.tabContainer.$el;
            var step = 30;
            _this.scrollLeft -= step;
        },
        tabbarScrollRight() {
            const _this = this.$refs.tabContainer.$el;
            var step = 30;
            _this.scrollLeft += step;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '@/css/common.scss';

$tab-bar-height: 34px;

.tab-bar {
    height: $tab-bar-height;
    width: 100%;
    background-color: #ffffff;
    /* border-bottom: 1px solid #b7b7b7; */
    padding-bottom: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.22), 0 0 2px 0 rgba(0, 0, 0, 0);
    /*  border: 1px solid #dcdfe6;
  border-left: none;
  border-right: none;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04); */

    .tab-bar-container {
        position: relative;
        display: flex;
    }

    .tab-container {
        flex-grow: 80;
        overflow-y: hidden;
        overflow-x: auto;
        height: $tab-bar-height;
        display: flex;
        background: #f0f0f0;
        box-shadow: inset 0 0 3px 2px hsla(0, 0%, 39.2%, 0.1);
        &::-webkit-scrollbar-track {
            /* 定义滚动条轨道  内阴影+圆角*/
            border-radius: 5px;
            background-color: #fff;
        }

        &::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 2px;
            height: 2px;
            background-color: #fff;
            border-radius: 5px;
        }

        &::-webkit-scrollbar:hover {
            background-color: $color-primary;
        }

        &::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 5px;
            background-color: #fff;
        }

        &:hover::-webkit-scrollbar-thumb {
            background-color: $color-primary;
        }
    }

    .prev-tab,
    .next-tab,
    .options {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2px 0px;
        border-bottom: 0.1px solid #eee;
        color: #555555;
    }
    .prev-tab,
    .next-tab {
        font-size: 28px;
        width: 30px;
        background: #fff;
        border: 0.1px solid #eee;
        font-size: 18px;
        flex: none;
    }
    .options {
        flex: none;
        width: $tab-bar-height - 4px;
        height: $tab-bar-height - 4px;
        font-size: 16px;
        background: #fff;
        border-top: 0.1px solid #eee;

        .menu-item {
            min-width: 120px;
        }
    }
    .prev-tab:hover,
    .next-tab:hover,
    .options:hover {
        color: $color-primary;
        cursor: pointer;
    }
}
</style>
