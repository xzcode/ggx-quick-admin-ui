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
        ...loginStoreHelper.mapMutations(['updateLoginStore'])
    },
    computed: {
        ...loginStoreHelper.mapState(['authed']),
        yearString() {
            return new Date().getFullYear();
        }
    },
    created() {
        if (!this.authed) {
            const token = localStorage.getItem(loginTokenKey);
            if (!token) {
                this.$router.push('/login');
                return;
            }
            HttpClient.get('/login/info', { token })
                .onstart(e => {
                    this.loading = true;
                })
                .onend(e => {
                    this.loading = false;
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.updateLoginStore(resp.data);
                        this.$router.push('/main/dashboard');
                    } else {
                        this.$message({
                            type: 'error',
                            message: resp.message
                        });
                        this.$router.push('/login');
                    }
                    this.loading = false;
                });
        }
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
