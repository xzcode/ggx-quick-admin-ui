const loginTokenKey = 'login_token';

export default {
    namespaced: true,
    state: {
        authed: false,
        loginInfo: {}
    },
    mutations: {
        updateLoginStore(state, data) {
            state.loginInfo = data;
            state.authed = true;
            localStorage.setItem(loginTokenKey, data.token);
        },
        logout(state, data) {
            state.authed = false;
            state.loginInfo = {};
            localStorage.removeItem(loginTokenKey);
        },
        getToken() {
            return localStorage.getItem(loginTokenKey);
        }
    }
};
