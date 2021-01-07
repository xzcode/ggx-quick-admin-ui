import rootStore from '@/store';
import { defaultPageData } from '@/util/page-data';
import router from '@/router';
import { createNamespacedHelpers } from 'vuex';

export const currentStoreModule = 'main/admin/admin-user';

export function commit(mutation, data) {
    rootStore.commit(currentStoreModule + '/' + mutation, data);
}
export function dispatch(action, data) {
    rootStore.commit(currentStoreModule + action, data);
}

export const currentStoreHelper = createNamespacedHelpers(currentStoreModule);
const store = {
    namespaced: true,
    state: {
        pageData: defaultPageData()
    },
    mutations: {
        updatePageData(state, data) {
            state.pageData = data;
        }
    },
    actions: {}
};

export default store;
