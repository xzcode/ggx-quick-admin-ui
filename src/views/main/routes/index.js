export default {
    parentPath: '/',
    path: '/main',
    redirect: '/main/dashboard',
    menuName: '首页',
    menuIcon: 'el-icon-odometer',
    isMenu: true,
    component: () => import('../')
};
