<template>
    <div class="user-menu">
        <el-dropdown trigger="click" @command="handleCommand">
            <el-image
                fit="contain"
                :src="loginInfo.avatar || defaultAvatar"
            ></el-image>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-user-solid">
                    {{ loginInfo.nickname }}
                </el-dropdown-item>
                <el-dropdown-item
                    icon="el-icon-lock"
                    command="personal-center"
                    divided
                >
                    个人中心
                </el-dropdown-item>
                <el-dropdown-item
                    icon="el-icon-warning-outline"
                    command="logout"
                >
                    注销
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { HttpClient } from '@/net';
import defaultAvatar from '@/assets/default-avatar.jpg';
const loginStoreHelper = createNamespacedHelpers('login');
export default {
    name: 'UserMenu',
    props: {},
    data() {
        return {
            defaultAvatar
        };
    },
    computed: {
        ...loginStoreHelper.mapState(['token', 'authed', 'loginInfo'])
    },
    methods: {
        ...loginStoreHelper.mapMutations(['logout']),
        handleCommand(cmd) {
            switch (cmd) {
                case 'logout':
                    if (this.authed) {
                        HttpClient.get('/quick/login/logout').then(e => {
                            this.logout();
                        });
                    }
                    this.$router.push('/login');
                    break;
                case 'personal-center':
                    if (this.$route.path !== '/main/personal-center') {
                        this.$router.push('/main/personal-center');
                    }
                    break;
                default:
                    this.$message('不支持的选项');
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import '@/css/common.scss';
$header-height: 40px;
.user-menu {
    height: $header-height;
    width: $header-height;
    float: right;
    cursor: pointer;
    color: $color-primary;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-dropdown {
        color: $color-primary;

        .el-image {
            height: $header-height * 0.8;
            width: $header-height * 0.8;
            border-radius: 6px;
        }
        .avatar {
            height: 36px;
            width: 36px;
            padding: 5px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            border: 1px solid #ebeef5;

            .default-avatar {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24px;
                color: #ccc;
            }
        }
    }
}
</style>
