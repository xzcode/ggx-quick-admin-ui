<template>
    <div class="page-login">
        <el-card class="login-form" shadow="always">
            <div slot="header">
                <span class="form-title">管理系统</span>
            </div>
            <el-input
                placeholder="请输入用户名"
                v-model="username"
                @keyup.enter.native="validateForm"
            >
                <template slot="prepend">
                    <i class="el-icon-user"></i>
                </template>
            </el-input>
            <div class="divider"></div>
            <el-input
                placeholder="请输入密码"
                type="password"
                v-model="password"
                @keyup.enter.native="validateForm"
            >
                <template slot="prepend">
                    <i class="el-icon-lock"></i>
                </template>
            </el-input>
            <div class="divider"></div>
            <el-button
                type="primary"
                style="width: 100%;"
                @click="validateForm"
                :loading="loading"
                @keyup.enter.native="validateForm"
                :disabled="authed"
            >
                登陆
            </el-button>
            <div class="divider"></div>
            <a href="#" style="float: right;">忘记密码</a>
        </el-card>

        <BgBlock />
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import sha from '@/util/sha';
import { HttpClient } from '@/net';
import BgBlock from '@/components/bg-blocks/index.vue';
const loginStoreHelper = createNamespacedHelpers('login');

export default {
    components: {
        BgBlock
    },
    data() {
        return {
            loading: false,
            username: '',
            password: ''
        };
    },
    created() {},
    computed: {
        ...loginStoreHelper.mapState(['authed']),
        yearString() {
            return new Date().getFullYear();
        }
    },
    methods: {
        ...loginStoreHelper.mapMutations(['submitLogin', 'updateLoginStore']),
        validateForm() {
            if (!this.username) {
                this.$message.error('用户名不能为空');
                return;
            }
            if (!this.password) {
                this.$message.error('密码不能为空');
                return;
            }

            if (this.loading) {
                return;
            }

            HttpClient.post('/quick/login/submit', {
                username: this.username,
                password: sha.sha256(this.password)
            })
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
                        this.$router.push('main/dashboard');
                    } else {
                        this.$message({
                            type: 'error',
                            message: resp.message
                        });
                    }
                    this.loading = false;
                });
        }
    }
};
</script>

<style scoped lang="scss">
@import '@/css/common.scss';

.page-login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    .copyright {
        z-index: -100;
        position: absolute;
        bottom: 10px;
        color: $color-info;
    }

    a {
        color: $color-primary;
        text-decoration: none;
    }
}

.login-form {
    background-color: rgba($color: #ffffff, $alpha: 0.5);
    width: 300px;
    padding: 20px 20px 50px 20px;

    .form-title {
        font-weight: bold;
        font-size: 22px;
    }

    .divider {
        height: 20px;
    }
}
</style>
