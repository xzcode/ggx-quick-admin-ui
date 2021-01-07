import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import { makeModules, makeStaticRoutes } from './util';

NProgress.configure({ showSpinner: false });

Vue.use(VueRouter);

const modules = makeModules(
    require.context('../views/', true, /routes\/index.js$/)
);
let mainModule = null;
for (let i = 0; i < modules.length; i++) {
    const module = modules[i];
    if (module.path === '/main') {
        mainModule = module;
    }
}

export const routeModules = modules;

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
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => console.log(err));
};
export const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});
// 路由前置过滤
router.beforeEach((to, from, next) => {
    if (from.path === to.path) {
        return;
    }
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
