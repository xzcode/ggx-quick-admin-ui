import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const modulesFiles = require.context('../views/', true, /store\/index.js$/);
const keys = modulesFiles.keys();

const modules = [];
for (let i = 0; i < keys.length; i++) {
    const modulePath = keys[i];
    const value = modulesFiles(modulePath);
    const moduleName = modulePath
        .replace(/.\//, '')
        .replace(/\/sub-views/g, '')
        .replace(/\/store\/index.js/g, '');
    const module = value.default;
    const moduleNameArr = moduleName.split('/');
    module.moduleName = moduleNameArr[moduleNameArr.length - 1];

    if (moduleNameArr.length > 1) {
        module.parentModuleName = moduleNameArr[moduleNameArr.length - 2];
    } else {
        module.parentModuleName = '';
    }
    modules.push(value.default);
}

function makeTree(data = [], parentModuleName) {
    const tree = {};
    for (let i = 0; i < data.length; i++) {
        const per = data[i];
        if (per.parentModuleName === parentModuleName) {
            tree[per.moduleName] = per;
            data.slice(i, 1);
        }
    }
    for (const key in tree) {
        const mo = makeTree(data, tree[key].moduleName);
        tree[key].modules = { ...mo };
    }
    return tree;
}

const modulesTree = makeTree(modules, '');

export default new Vuex.Store({
    state: {
        loading: false
    },
    mutations: {
        updateLoading(state, data) {
            this.loading = data;
        }
    },
    actions: {},
    modules: {
        ...modulesTree
    }
});
