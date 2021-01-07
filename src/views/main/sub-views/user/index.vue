<template>
    <div class="main-inner-content">
        <el-container class="custom-list-container" v-loading="loading">
            <div class="list-search-bar">
                <el-form label-width="110px" :inline="true">
                    <el-form-item label="昵称">
                        <el-input
                            v-model="queryData.nickName"
                            size="mini"
                            class="input"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item label="身份认证状态">
                        <el-select
                            size="mini"
                            v-model="queryData.identityAuthenticationStatus"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option label="未认证" value="0"></el-option>
                            <el-option label="已认证" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="驾驶证认证状态">
                        <el-select
                            size="mini"
                            v-model="queryData.drivingAuthenticationStatus"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option label="未认证" value="0"></el-option>
                            <el-option label="已认证" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="注册起始时间">
                        <el-date-picker
                            v-model="queryData.createDateStart"
                            type="datetime"
                            placeholder="选择开始时间"
                            size="mini"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="12:00:00"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="注册结束时间">
                        <el-date-picker
                            v-model="queryData.createDateEnd"
                            type="datetime"
                            placeholder="选择结束时间"
                            size="mini"
                            default-time="12:00:00"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                    </el-form-item>

                    <el-form-item>
                        <el-button
                            class="search-btn"
                            icon="el-icon-search"
                            type="primary"
                            size="mini"
                            @click="search"
                        >
                            搜索
                        </el-button>
                        <el-button
                            class="search-btn"
                            icon="el-icon-zoom-out"
                            size="mini"
                            @click="resetSearch"
                        >
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="list-content">
                <el-table
                    class="table"
                    :data="pageData.items"
                    size="small"
                    border
                    stripe
                    height="100%"
                >
                    <el-table-column
                        prop="nickName"
                        label="昵称"
                        align="center"
                    />
                    <el-table-column prop="avatar" label="头像" align="center">
                        <template slot-scope="scope">
                            <img
                                :src="scope.row.avatar"
                                width="100"
                                height="50"
                                style="object-fit: contain;"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="mobile"
                        label="手机号码"
                        align="center"
                    />
                    <el-table-column prop="email" label="邮箱" align="center" />
                    <el-table-column
                        prop="integral"
                        label="积分"
                        align="center"
                    />
                    <el-table-column
                        prop="emergencyContactName"
                        label="紧急联系人姓名"
                        align="center"
                    />
                    <el-table-column
                        prop="emergencyContactMobile"
                        label="紧急联系人手机号码"
                        align="center"
                    />
                    <el-table-column
                        prop="emergencyContactAddress"
                        label="紧急联系人地址"
                        align="center"
                    />
                    <el-table-column
                        prop="identityAuthenticationStatus"
                        label="身份认证状态"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <template
                                v-if="
                                    scope.row.identityAuthenticationStatus === 1
                                "
                            >
                                <el-tag
                                    type="success"
                                    effect="dark"
                                    size="mini"
                                >
                                    已认证
                                </el-tag>
                            </template>
                            <template
                                v-else-if="
                                    scope.row.identityAuthenticationStatus === 0
                                "
                            >
                                <el-tag type="danger" effect="dark" size="mini">
                                    未认证
                                </el-tag>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="drivingAuthenticationStatus"
                        label="驾驶证认证状态"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <template
                                v-if="
                                    scope.row.drivingAuthenticationStatus === 1
                                "
                            >
                                <el-tag
                                    type="success"
                                    effect="dark"
                                    size="mini"
                                >
                                    已认证
                                </el-tag>
                            </template>
                            <template
                                v-else-if="
                                    scope.row.drivingAuthenticationStatus === 0
                                "
                            >
                                <el-tag type="danger" effect="dark" size="mini">
                                    未认证
                                </el-tag>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createDate"
                        label="注册时间"
                        align="center"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.createDate | datetime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button
                                class="row-identity-btn"
                                type="primary"
                                size="mini"
                                @click="identityInfo(scope.row)"
                            >
                                身份认证信息
                            </el-button>

                            <el-button
                                class="row-driving-btn"
                                type="primary"
                                size="mini"
                                @click="driveInfo(scope.row)"
                            >
                                驾驶证认证信息
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="list-footer">
                <el-pagination
                    class="pager"
                    background
                    layout="total, prev, pager, next"
                    @current-change="handleCurrentChange"
                    :current-page.sync="queryData.pageNo"
                    :page-size="queryData.pageSize || 10"
                    :total="pageData.total"
                />
            </div>
        </el-container>

        <el-dialog
            title="身份认证信息"
            :modal-append-to-body="false"
            :append-to-body="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :center="true"
            :visible.sync="identityInfoVisibile"
            @closed="editFormClosed"
            :show-close="!editFormLoading"
            style="min-width:600px"
        >
            <el-form>
                <el-form-item label="身份证正面图片">
                    <img
                        :src="idInfo.positiveUrl"
                        width="100"
                        height="50"
                        style="object-fit: contain;"
                    />
                </el-form-item>
                <el-form-item label="身份证反面图片">
                    <img
                        :src="idInfo.reverseUrl"
                        width="100"
                        height="50"
                        style="object-fit: contain;"
                    />
                </el-form-item>
                <el-form-item label="姓名">
                    <div>{{ idInfo.realName }}</div>
                </el-form-item>
                <el-form-item label="身份证号码">
                    <div>{{ idInfo.idCardNum }}</div>
                </el-form-item>
                <el-form-item label="性别">
                    <div>{{ idInfo.sex == 0 ? '男' : '女' }}</div>
                </el-form-item>
                <el-form-item label="身份证所在地">
                    <div>{{ idInfo.area }}</div>
                </el-form-item>
                <el-form-item label="省">
                    <div>{{ idInfo.province }}</div>
                </el-form-item>
                <el-form-item label="市">
                    <div>{{ idInfo.city }}</div>
                </el-form-item>
                <el-form-item label="区县">
                    <div>{{ idInfo.prefecture }}</div>
                </el-form-item>
                <el-form-item label="出生日期">
                    <div>{{ idInfo.birthday | datetimeNotHour }}</div>
                </el-form-item>
                <el-form-item label="地区代码">
                    <div>{{ idInfo.addrCode }}</div>
                </el-form-item>
                <el-form-item label="认证日期">
                    <div>{{ idInfo.createDate | datetimeNotHour }}</div>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog
            title="驾驶证认证信息"
            :modal-append-to-body="false"
            :append-to-body="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :center="true"
            :visible.sync="drivingInfoVisibile"
            @closed="editFormClosed"
            :show-close="!editFormLoading"
            style="min-width:600px"
        >
            <el-form>
                <el-form-item label="身份证正面图片">
                    <img
                        :src="drivingInfo.principalUrl"
                        width="100"
                        height="50"
                        style="object-fit: contain;"
                    />
                </el-form-item>
                <el-form-item label="身份证反面图片">
                    <img
                        :src="drivingInfo.minorUrl"
                        width="100"
                        height="50"
                        style="object-fit: contain;"
                    />
                </el-form-item>
                <el-form-item label="真实姓名">
                    <div>{{ drivingInfo.realName }}</div>
                </el-form-item>
                <el-form-item label="证件号码">
                    <div>{{ drivingInfo.drivingCardNum }}</div>
                </el-form-item>
                <el-form-item label="档案编号">
                    <div>{{ drivingInfo.fileNum }}</div>
                </el-form-item>
                <el-form-item label="省份">
                    <div>{{ drivingInfo.province }}</div>
                </el-form-item>
                <el-form-item label="初次领证日期">
                    <div>
                        {{ drivingInfo.firstLicenseDate | datetimeNotHour }}
                    </div>
                </el-form-item>
                <el-form-item label="有效期起始时间">
                    <div>
                        {{ drivingInfo.validDateStart | datetimeNotHour }}
                    </div>
                </el-form-item>
                <el-form-item label="有效期结束时间">
                    <div>{{ drivingInfo.validDateEnd | datetimeNotHour }}</div>
                </el-form-item>
                <el-form-item label="准驾车型">
                    <div>{{ drivingInfo.leaveModels }}</div>
                </el-form-item>
                <el-form-item label="认证日期">
                    <div>{{ drivingInfo.createDate | datetimeNotHour }}</div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { defaultPageData } from '@/util/page-data';
import AliyunOssImageUpload from '@/components/aliyun-oss/aliyun-oss-image-upload';
import md5 from 'md5';
import { HttpClient } from '@/net';

const defaultQueryData = {
    pageSize: 10,
    pageNo: 1,
    nickName: '',
    identityAuthenticationStatus: null,
    drivingAuthenticationStatus: null,
    createDateStart: null,
    createDateEnd: null
};
const defaultEditForm = {
    uid: '',
    weight: 0,
    enabled: 1,
    type: 0,
    jumpUrl: ''
};
export default {
    name: 'banner',
    components: {},
    props: {},
    data() {
        return {
            loading: false,
            editFormLoading: false,
            pageData: defaultPageData(),
            queryData: { ...defaultQueryData },
            editForm: { ...defaultEditForm },
            editFormVisible: false,
            editMode: true, // 是否编辑模式
            editFormPwdChanged: false,
            identityInfoVisibile: false,
            drivingInfoVisibile: false,
            idInfo: {},
            drivingInfo: {}
        };
    },
    computed: {},
    methods: {
        handleCurrentChange(pageNo) {
            this.queryData.pageNo = pageNo;
            this.getPageData();
        },
        search() {
            this.queryData.pageNo = 1;
            this.getPageData();
        },
        getPageData() {
            HttpClient.post('/user/page', this.queryData)
                .onstart(e => {
                    this.loading = true;
                })
                .onend(e => {
                    this.loading = false;
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.pageData = resp.data;
                    }
                });
        },
        identityInfo(row) {
            HttpClient.post('/user/checkIdentity', { id: row.id }).then(
                response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.idInfo = resp.data;
                        this.identityInfoVisibile = true;
                    }
                }
            );
        },
        driveInfo(row) {
            HttpClient.post('/user/checkDriving', { id: row.id }).then(
                response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.drivingInfo = resp.data;
                        this.drivingInfoVisibile = true;
                    }
                }
            );
        },
        resetSearch() {
            this.queryData = { ...defaultQueryData };
            this.getPageData();
        },

        clearValidate() {
            if (this.$refs.editForm) {
                this.$refs.editForm.clearValidate();
            }
        },

        hideEditForm() {
            this.editFormVisible = false;
        },
        showEditForm() {
            if (!this.editMode) {
                this.editForm = { ...defaultEditForm };
                this.clearValidate();
            }
            this.editFormVisible = true;
        },
        editFormClosed(e) {}
    },
    beforeCreate() {},
    created() {
        this.getPageData();
    },
    activated() {},
    mounted() {},
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {},
    destroyed() {}
};
</script>

<style lang="scss">
@import '@/css/common.scss';
</style>
