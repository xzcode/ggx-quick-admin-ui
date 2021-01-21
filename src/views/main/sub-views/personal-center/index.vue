<template>
    <div class="main-inner-content">
        <div class="personal-center">
            <el-card class="box-card personal-info">
                <div slot="header" class="clearfix">
                    <span>个人信息</span>
                </div>
                <div class="center-item">
                    <FSImageUpload
                        :on-upload-success="avatarUploadSuccess"
                        :current-file-url="loginInfo.avatar"
                    />
                </div>
                <div
                    class="center-item"
                    style="font-weight: bold; font-size: 20px; margin-top: 25px;"
                >
                    {{ loginInfo.nickname }}
                </div>
                <div class="center-item">
                    <el-button
                        type="text"
                        @click="changePasswordFormVisible = true"
                    >
                        修改密码
                    </el-button>
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
        <el-dialog
            title="修改密码"
            :modal-append-to-body="false"
            :append-to-body="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :center="true"
            :visible.sync="changePasswordFormVisible"
            @closed="$refs.changePasswordForm.resetFields()"
            :show-close="!changePasswordFormLoading"
            width="400px"
        >
            <el-form
                ref="changePasswordForm"
                :model="changePasswordForm"
                label-width="100px"
                size="mini"
            >
                <el-form-item
                    label="旧密码"
                    prop="oldPassword"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-input
                        type="password"
                        v-model="changePasswordForm.oldPassword"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="新密码"
                    prop="newPassword"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-input
                        type="password"
                        v-model="changePasswordForm.newPassword"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="确认新密码"
                    prop="confirmNewPassword"
                    :rules="[
                        {
                            required: true,
                            validator: confirmNewPasswordValidator
                        }
                    ]"
                >
                    <el-input
                        type="password"
                        v-model="changePasswordForm.confirmNewPassword"
                    ></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button
                        :loading="changePasswordFormLoading"
                        type="primary"
                        @click="submitChangePwdForm"
                    >
                        确定
                    </el-button>
                    <el-button
                        :loading="changePasswordFormLoading"
                        @click="changePasswordFormVisible = false"
                    >
                        取消
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import FSImageUpload from 'quick-admin/components/quick-file-service/quick-file-service-single-image-upload';
import { createNamespacedHelpers } from 'vuex';
import { HttpClient } from '@/net';
import sha from '@/util/sha';
const loginStoreHelper = createNamespacedHelpers('login');

export default {
    components: {
        FSImageUpload
    },
    data() {
        return {
            loading: false,
            changePasswordFormVisible: false,
            changePasswordFormLoading: false,
            changePasswordForm: {}
        };
    },
    computed: {
        ...loginStoreHelper.mapState(['loginInfo'])
    },
    methods: {
        ...loginStoreHelper.mapMutations(['updateAvatar']),
        avatarUploadSuccess(filename, url) {
            HttpClient.post('/quick/personal/change-avatar', { avatar: url })
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
        },
        submitChangePwdForm() {
            this.$refs.changePasswordForm.validate(valid => {
                if (!valid) {
                    return false;
                }
                HttpClient.post('/quick/personal/change-password', {
                    oldPassword: sha.sha256(
                        this.changePasswordForm.oldPassword
                    ),
                    newPassword: sha.sha256(this.changePasswordForm.newPassword)
                })
                    .onstart(e => {
                        this.changePasswordFormLoading = true;
                    })
                    .onend(e => {
                        this.changePasswordFormLoading = false;
                    })
                    .then(response => {
                        console.log(response);
                        const resp = response.data;
                        if (resp.success) {
                            this.changePasswordFormVisible = false;
                            this.$message({
                                message: '密码修改成功',
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: '密码修改失败',
                                type: 'error'
                            });
                        }
                    });
            });
        },
        confirmNewPasswordValidator(rule, value, callback) {
            if (value !== this.changePasswordForm.newPassword) {
                callback(new Error('两次输入的密码不一致'));
            } else {
                callback();
            }
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
