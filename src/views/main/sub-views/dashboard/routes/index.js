export default {
    name: 'dashboard',
    parentPath: '/main',
    path: '/main/dashboard',
    menuName: '首页',
    menuIcon: 'el-icon-odometer',
    isMenu: true,
    menuOrder: 0,
    component: () => import('../')
};
