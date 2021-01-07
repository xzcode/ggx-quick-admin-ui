<template>
    <el-container class="main-container">
        <el-aside class="main-left-side" width="auto">
            <menutree
                :menus="menus"
                :leftMenu="leftMenu"
                :activeMenu="activeMenu"
                :menuSelect="menuSelect"
            />
        </el-aside>

        <el-container class="main-right-side">
            <el-header class="main-header" style="height: 40px;">
                <div class="sfold" @click="menuCollapse">
                    <i
                        :class="
                            leftMenu.isCollapse
                                ? 'el-icon-s-unfold'
                                : 'el-icon-s-fold'
                        "
                    ></i>
                </div>
                <el-breadcrumb separator="/" class="breadcrumb">
                    <transition-group name="breadcrumb">
                        <el-breadcrumb-item
                            v-for="item in selectedTab.fullnames"
                            :key="item"
                        >
                            <b>{{ item }}</b>
                        </el-breadcrumb-item>
                    </transition-group>
                </el-breadcrumb>

                <usermenu />

                <div class="tool-bar">
                    <el-button @click="triggerFullscreen">
                        <i class="el-icon-rank"></i>
                    </el-button>
                </div>
            </el-header>

            <tabbar :tabClick="tabClick" :tabRemove="tabRemove" :tabs="tabs" />

            <el-main v-loading="loading" class="main-content">
                <transition name="fade" mode="out-in">
                    <keep-alive :include="keepAliveInclude">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </el-main>

            <el-footer class="main-footer">Footer</el-footer>
        </el-container>
    </el-container>
</template>

<script>
import menutree from './components/menutree';
import tabbar from './components/tab-bar';
import usermenu from './components/user-menu';
import store from '@/store';
import router, { routeModules } from '@/router';
import screenfull from 'screenfull';
import { HttpClient } from '@/net';
import { createNamespacedHelpers } from 'vuex';

const dashboardPath = '/main/dashboard';

const loginStoreHelper = createNamespacedHelpers('login');

function matchMenu(path, menus) {
    for (let i = 0; i < menus.length; i++) {
        const m = menus[i];
        if (m.path === path) {
            return m;
        }
        if (m.submenu) {
            const cm = matchMenu(path, m.submenu);
            if (cm) {
                return cm;
            }
        }
    }
}

function makeFullname(pMenus = [], fullnames = []) {
    for (let i = 0; i < pMenus.length; i++) {
        const m = pMenus[i];
        m.fullnames = [...fullnames];
        m.fullnames.push(m.menuName);
        if (m.submenu) {
            makeFullname(m.submenu, [...m.fullnames]);
        }
    }
}

function makeMenuTree(
    data = [],
    parentPath,
    permissions,
    checkPermission = false
) {
    const tree = [];
    if (checkPermission && permissions.length > 0 && parentPath === '/main') {
        data = data.filter(per =>
            permissions.some(e => e === per.meta.permission)
        );
    }
    for (let i = 0; i < data.length; i++) {
        const per = data[i];
        if (per.parentPath === parentPath) {
            const { component, children, ...menu } = per;
            tree.push(menu);
            data.splice(i--, 1);
        }
    }
    tree.sort((a, b) => a.menuOrder - b.menuOrder);
    for (let i = 0; i < tree.length; i++) {
        const arr = makeMenuTree(
            data,
            tree[i].path,
            permissions,
            checkPermission
        );
        if (arr.length > 0) {
            tree[i].submenu = arr;
        }
    }
    return tree;
}

function checkRoutePermission(to, from, next) {
    if (
        !store.state.login.loginInfo.superAdmin &&
        store.state.login.loginInfo.permissions &&
        !store.state.login.loginInfo.permissions.some(
            e => e === to.meta.permission
        )
    ) {
        if (from.path !== dashboardPath || to.path !== dashboardPath) {
            next(dashboardPath);
        }
        return false;
    }
    return true;
}

export default {
    components: {
        menutree,
        tabbar,
        usermenu
    },
    data() {
        return {
            loading: false,
            menus: [],
            leftMenu: {
                isCollapse: false
            },
            activeMenu: undefined,
            tabs: [],
            isFullscreen: false
        };
    },
    beforeCreate() {},
    created() {
        this.initMenus();
        this.initTabs();
    },
    beforeRouteEnter(to, from, next) {
        if (!checkRoutePermission(to, from, next)) {
            return;
        }
        next();
    },
    beforeRouteUpdate(to, from, next) {
        if (!checkRoutePermission(to, from, next)) {
            return;
        }
        next();
    },
    computed: {
        ...loginStoreHelper.mapState(['authed', 'loginInfo']),
        selectedTab() {
            const filterTabs = this.tabs.filter((e, i) => e.active);
            return filterTabs.length > 0 && filterTabs[0];
        },
        keepAliveInclude() {
            return this.tabs.map(e => e.routeName);
        }
    },
    methods: {
        initMenus() {
            const permissions = this.loginInfo.permissions || [];
            const menuTree = makeMenuTree(
                [...routeModules],
                '/',
                permissions,
                !this.loginInfo.superAdmin
            );
            const menus = menuTree.filter(e => {
                return e.isMenu && e.path === '/main';
            })[0].submenu;
            makeFullname(menus);
            this.menus = menus;
            this.activeMenu = this.menus[0].path;
            if (this.tabs.length > 1) {
                this.tabRemoveAll();
            }
        },
        menuCollapse() {
            this.leftMenu.isCollapse = !this.leftMenu.isCollapse;
        },
        menuSelect(path) {
            if (
                !this.loginInfo.superAdmin &&
                !this.loginInfo.permissions.some(e => e === path)
            ) {
                return;
            }
            const menu = matchMenu(path, this.menus);
            if (!menu) {
                this.$router.push(dashboardPath);
                return;
            }
            this.activeMenu = menu;
            let selectedTab = null;
            for (const tab of this.tabs) {
                if (tab.path === path) {
                    selectedTab = tab;
                } else {
                    tab.active = false;
                }
            }
            if (selectedTab) {
                selectedTab.active = true;
                return;
            }

            const closeable = this.menus[0].path !== menu.path;

            selectedTab = {
                name: menu.menuName,
                routeName: menu.name,
                path: menu.path,
                fullnames: menu.fullnames,
                closeable,
                active: true
            };
            this.tabs.push({ ...selectedTab });
        },
        tabRemove(path, e) {
            let index = 0;

            this.tabs.forEach((e, i) => {
                if (path === e.path) {
                    index = i;
                }
            });
            this.tabs.splice(index, 1);
            if (this.tabs.some(e => e.active)) {
                return;
            }
            const tab = this.tabs[index - 1];
            if (tab) {
                tab.active = true;
            }
            this.menuSelect(tab.path);
            router.currentRoute.path !== tab.path && router.push(tab.path);
        },
        tabClick(path) {
            this.menuSelect(path);
            router.currentRoute.path !== path && router.push(path);
        },
        hasTab(state, tabName) {
            for (const tab of this.tabs) {
                if (tab.name === tabName) {
                    return tab;
                }
            }
        },
        tabRemoveCurrent() {
            let index = 0;
            if (this.tabs.length === 1) {
                return;
            }
            this.tabs = this.tabs.filter((e, i) => {
                if (e.active) {
                    index = i;
                }
                return !e.active;
            });

            const selectedTab = this.tabs[index - 1];
            if (selectedTab) {
                this.menuSelect(selectedTab.path);
                router.currentRoute.path !== selectedTab.path &&
                    router.push(selectedTab.path);
            }
        },
        tabRemoveLeft() {
            let index = 0;
            let currentTab;
            this.tabs.every((e, i) => {
                if (e.active) {
                    index = i;
                    currentTab = e;
                    return false;
                }
                return true;
            });
            this.tabs = this.tabs.filter((e, i) => {
                const result = i === 0 || i >= index;
                return result;
            });
            const path = currentTab.path;
            this.menuSelect(path);
            router.currentRoute.path !== path && router.push(path);
        },
        tabRemoveRight() {
            let index = 0;
            let currentTab = null;
            this.tabs.every((e, i) => {
                if (e.active) {
                    index = i;
                    currentTab = e;
                    return false;
                }
                return true;
            });
            this.tabs = this.tabs.filter((e, i) => {
                const result = i <= index;
                return result;
            });
            const path = currentTab.path;
            this.menuSelect(path);
            router.currentRoute.path !== path && router.push(path);
        },
        tabRemoveAll() {
            this.tabs = [this.tabs[0]];
            const path = this.tabs[0].path;
            this.menuSelect(path);
            router.currentRoute.path !== path && router.push(path);
        },
        initTabs() {
            const menu = this.menus[0];
            const firstTabs = this.tabs.filter(e => e.path === menu.path);
            if (firstTabs && firstTabs.length > 0) {
                return;
            }
            this.activeMenu = menu;
            const tab = {
                name: menu.menuName,
                routeName: menu.name,
                path: menu.path,
                fullnames: menu.fullnames,
                closeable: false,
                active: true
            };
            this.tabs.push(tab);

            const initPath = this.$router.currentRoute.path;

            if (initPath && initPath !== '') {
                this.menuSelect(initPath);
            }
        },
        triggerFullscreen() {
            this.isFullscreen = true;
            screenfull.toggle();
        }
    }
};
</script>

<style lang="scss">
@import '@/css/common.scss';

.main-logo {
    color: white;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    height: 40px;
    overflow: hidden;
}

.main-container {
    height: 100%;
    background: #f3f4f7;

    .main-left-side {
        height: 100%;

        @mixin clean-scrollbar {
            border: none;
            width: 5px;
            margin: 0px;
            padding: 0px;
        }

        &::-webkit-scrollbar-track {
            /* 定义滚动条轨道  */
            background-color: $color-dark;
            @include clean-scrollbar;
        }

        &::-webkit-scrollbar {
            /*滚动条整体样式*/
            @include clean-scrollbar;
        }

        &::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            background-color: $color-info;
            @include clean-scrollbar;
        }

        .left-menu {
            height: 100%;
            border: none;
        }

        .left-menu:not(.el-menu--collapse) {
            width: 200px;
        }
    }

    .main-right-side {
        $header-height: 40px;
        .el-header {
            height: $header-height;
        }
        .main-header {
            height: $header-height;
            background: #ffffff;
            /*  margin-bottom: 5px;
      border-bottom: 1px solid #b7b7b7;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.38), 0 0 6px 0 rgba(0, 0, 0, 0.08); */

            .sfold {
                height: $header-height;
                width: $header-height;
                line-height: $header-height;
                float: left;
                font-size: 28px;
                cursor: pointer;
            }

            .breadcrumb {
                height: $header-height;
                line-height: $header-height;
                float: left;
            }

            .tool-bar {
                height: $header-height;
                line-height: $header-height;
                float: right;
                margin-right: 10px;
                display: flex;
                align-items: center;

                button {
                    margin: 0px 5px;
                    border: none;
                    font-size: 22px;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }

        .main-content {
            padding: 8px;
            overflow: hidden;
        }

        .main-footer {
            display: none;
        }
    }
}
</style>
