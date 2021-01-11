<template>
    <div class="main-inner-content">
        <div class="personal-center">
            <el-card class="box-card personal-info">
                <div slot="header" class="clearfix">
                    <span>个人信息</span>
                </div>
                <div class="center-item">
                    <FSImageUpload :on-upload-success="avatarUploadSuccess" />
                </div>
                <div class="center-item">{{ loginInfo.nickname }}</div>
                <div class="center-item">
                    <el-button type="text">修改密码</el-button>
                </div>
            </el-card>

            <el-card class="box-card activity-info">
                <div slot="header" class="clearfix">
                    <span>动态</span>
                </div>
                <el-image
                    style="width: 100px; height: 100px"
                    fit="contain"
                ></el-image>
            </el-card>
        </div>
    </div>
</template>

<script>
import FSImageUpload from '@/components/quick-file-service/quick-file-service-single-image-upload';
import { createNamespacedHelpers } from 'vuex';
import { HttpClient } from '@/net';
const loginStoreHelper = createNamespacedHelpers('login');

export default {
    components: {
        FSImageUpload
    },
    created() {
        return {
            loading: false
        };
    },
    computed: {
        ...loginStoreHelper.mapState(['loginInfo'])
    },
    methods: {
        ...loginStoreHelper.mapMutations(['updateAvatar']),
        avatarUploadSuccess(filename, url) {
            HttpClient.get('/quick/personal/change-avatar', { avatar: url })
                .onstart(e => {
                    this.loading = true;
                })
                .onend(e => {
                    this.loading = false;
                })
                .then(response => {
                    if (response.data.success) {
                        this.updateAvatar(url);
                    }
                });
        }
    }
};
</script>

<style lang="scss">
@import '@/css/common.scss';

.personal-center {
    display: flex;

    .personal-info {
        width: 300px;
        max-width: 300px;
        margin: 10px;
        flex-grow: 1;

        .center-item {
            display: flex;
            justify-content: center;
            margin: 10px 0px;
        }
    }
    .activity-info {
        margin: 10px;
        flex-grow: 100;
    }
}
</style>
