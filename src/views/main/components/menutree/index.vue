<template>
    <el-menu
        class="left-menu"
        :router="true"
        :collapse="leftMenu.isCollapse"
        background-color="#232323"
        text-color="#ffffff"
        active-text-color="#409EFF"
        :class="[leftMenu.isCollapse ? 'collapsed' : '']"
        :collapse-transition="true"
        @select="menuSelect"
        :default-active="activeMenu.path"
    >
        <div class="main-logo" v-if="!leftMenu.isCollapse">
            <div style="min-width: 200px;">ADMIN UI</div>
        </div>

        <template v-for="item in menus">
            <template v-if="item.isMenu">
                <el-submenu
                    v-if="item.submenu"
                    :index="item.path"
                    :key="item.path + '1'"
                >
                    <template slot="title">
                        <i :class="item.menuIcon"></i>
                        <span slot="title">{{ item.menuName }}</span>
                    </template>

                    <template v-for="item2 in item.submenu">
                        <template v-if="item2.isMenu">
                            <el-submenu
                                v-if="item2.submenu"
                                :index="item2.path"
                                :key="item2.path + '1'"
                            >
                                <template slot="title">
                                    <i :class="item2.menuIcon"></i>
                                    <span slot="title">
                                        {{ item2.menuName }}
                                    </span>
                                </template>

                                <template v-for="item3 in item.submenu">
                                    <template v-if="item3.isMenu">
                                        <el-submenu
                                            v-if="item3.submenu"
                                            :index="item3.path"
                                            :key="item3.path + '1'"
                                        >
                                            <template slot="title">
                                                <i :class="item3.menuIcon"></i>
                                                <span slot="title">
                                                    {{ item3.menuName }}
                                                </span>
                                            </template>
                                        </el-submenu>
                                        <el-menu-item
                                            v-else
                                            :index="item3.path"
                                            :key="item3.path + '2'"
                                        >
                                            <i :class="item3.menuIcon"></i>
                                            <span slot="title">
                                                {{ item3.menuName }}
                                            </span>
                                        </el-menu-item>
                                    </template>
                                </template>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="item2.path"
                                :key="item2.path + '2'"
                            >
                                <i :class="item2.menuIcon"></i>
                                <span slot="title">{{ item2.menuName }}</span>
                            </el-menu-item>
                        </template>
                    </template>
                </el-submenu>

                <el-menu-item v-else :index="item.path" :key="item.path + '2'">
                    <i :class="item.menuIcon"></i>
                    <span slot="title">{{ item.menuName }}</span>
                </el-menu-item>
            </template>
        </template>
    </el-menu>
</template>

<script>
export default {
    name: 'menutree',
    components: {},
    props: ['menus', 'leftMenu', 'activeMenu', 'menuSelect'],
    data() {
        return {};
    },
    methods: {
        select(path) {
            this.menuSelect(path);
        }
    },
    computed: {}
};
</script>

<style lang="scss"></style>
