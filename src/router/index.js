import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import store from '@/store';

NProgress.configure({ showSpinner: false });

Vue.use(VueRouter);

const modulesFiles = require.context('../views/', true, /routes\/index.js$/);
const keys = modulesFiles.keys();
const modules = [];
let mainModule;
for (let i = 0; i < keys.length; i++) {
    const modulePath = keys[i];
    const value = modulesFiles(modulePath);
    const module = value.default;
    if (!module.name) {
        const pathArr = module.path.split('/');
        module.name = pathArr[pathArr.length - 1];
    }
    if (!module.meta) {
        module.meta = {};
    }
    if (!module.meta.permission) {
        module.meta.permission = module.name;
    }
    if (module.path === '/main') {
        mainModule = module;
    }
    modules.push(module);
}
export const routeModules = modules;

function makeStaticRoutes(data = []) {
    const root = [];
    for (let i = 0; i < data.length; i++) {
        const per = data[i];
        if (per.parentPath === '/') {
            root.push(per);
            data.splice(i--, 1);
        }
    }
    root.sort((a, b) => a.menuOrder - b.menuOrder);
    return root;
}

const staticRoutes = makeStaticRoutes([...modules]);
staticRoutes.sort((a, b) => a.menuOrder - b.menuOrder);

export const dynamicRoutes = modules.filter(
    e => !staticRoutes.some(e2 => e2.path === e.path)
);
dynamicRoutes.sort((a, b) => a.menuOrder - b.menuOrder);

mainModule.children = dynamicRoutes;

export const mainRoute = mainModule;

export const routes = [
    {
        name: 'default',
        path: '/',
        redirect: '/login'
    },
    ...staticRoutes
];

export const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});
// 路由前置过滤
router.beforeEach((to, from, next) => {
    // 使用加载进度条工具
    NProgress.start();
    // 继续路由
    next();
});

// 路由后置处理
router.afterEach((to, from) => {
    // 结束加载进度条
    NProgress.done();
});

export default router;
