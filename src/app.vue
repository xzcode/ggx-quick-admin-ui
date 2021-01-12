<template>
    <div id="app-container">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { HttpClient } from '@/net';
const loginStoreHelper = createNamespacedHelpers('login');
const loginTokenKey = 'login_token';
export default {
    components: {},
    methods: {
        ...loginStoreHelper.mapMutations(['updateLoginStore']),
        checkLogin() {
            if (!this.authed) {
                const token = localStorage.getItem(loginTokenKey);
                if (!token) {
                    this.$router.push('/login');
                    return;
                }
                let loading = null;
                HttpClient.get('/quick/login/info', { token })
                    .onstart(e => {
                        loading = this.$loading();
                    })
                    .onend(e => {
                        loading && loading.close();
                    })
                    .ontimeout(e => {
                        /* if (this.$route.path === '/login') {
                        localStorage.removeItem(loginTokenKey);
                        this.$router.push('/login');
                    } */
                        if (this.$route.path !== '/login') {
                            this.$confirm(
                                '登录信息校验超时，是否重试？',
                                '提示',
                                {
                                    confirmButtonText: '重试',
                                    cancelButtonText: '重新登录',
                                    type: 'warning'
                                }
                            )
                                .then(() => {
                                    this.checkLogin();
                                })
                                .catch(() => {
                                    localStorage.removeItem(loginTokenKey);
                                    this.$router.push('/login');
                                });
                        }
                    })
                    .then(response => {
                        const resp = response.data;
                        if (resp.success) {
                            this.updateLoginStore(resp.data);
                            if (this.$route.path === '/login') {
                                this.$router.push('/main/dashboard');
                            }
                        } else {
                            localStorage.removeItem(loginTokenKey);
                            this.$router.push('/login');
                        }
                        this.loading = false;
                    });
            }
        }
    },
    computed: {
        ...loginStoreHelper.mapState(['authed']),
        yearString() {
            return new Date().getFullYear();
        }
    },
    created() {
        this.checkLogin();
    }
};
</script>

<style lang="scss">
@import '@/css/common.scss';
html,
body,
#app,
#app-container {
    height: 100%;
    margin: 0px;
    padding: 0px;
    width: 100%;
    overflow: hidden;
    /* min-height: 500px; */
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
        'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
#nprogress .spinner {
    display: block;
    position: fixed;
    z-index: 1031;
    top: 15px;
    left: 15px;
}
</style>
