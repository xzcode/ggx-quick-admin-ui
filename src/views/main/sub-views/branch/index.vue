<template>
    <div class="main-inner-content">
        <el-container class="custom-list-container" v-loading="loading">
            <div class="list-search-bar">
                <el-form label-width="130px" :inline="true">
                    <el-form-item label="网点名称">
                        <el-input
                            v-model="queryData.branchName"
                            size="mini"
                            class="input"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item label="网点电话号码">
                        <el-input
                            v-model="queryData.branchMobile"
                            size="mini"
                            class="input"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item label="网点营业时间开始">
                        <el-time-picker
                            v-model="queryData.businessTimeStart"
                            size="mini"
                            format="HH:mm"
                            placeholder="选择网点营业时间开始"
                        ></el-time-picker>
                    </el-form-item>
                    <el-form-item label="网点营业时间结束">
                        <el-time-picker
                            v-model="queryData.businessTimeEnd"
                            size="mini"
                            format="HH:mm"
                            placeholder="选择营业时间结束"
                        ></el-time-picker>
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
                        <el-button
                            class="search-btn"
                            icon="el-icon-circle-plus-outline"
                            type="success"
                            size="mini"
                            @click="add"
                        >
                            新增
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
                    <el-table-column prop="branchName" label="网点名称" />
                    <el-table-column prop="branchMobile" label="网点电话号码" />
                    <el-table-column prop="branchAddr" label="网点地址" />
                    <el-table-column
                        prop="businessTimeStart"
                        label="网点营业时间开始"
                    />
                    <el-table-column
                        prop="businessTimeEnd"
                        label="网点营业时间结束"
                    />
                    <el-table-column prop="province" label="省" />
                    <el-table-column prop="city" label="市" />
                    <el-table-column prop="district" label="区" />
                    <el-table-column prop="createDate" label="创建时间" />
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button
                                v-if="!scope.row.superAdmin"
                                class="row-edit-btn"
                                @click="edit(scope.row)"
                                icon="el-icon-edit"
                                type="primary"
                                size="mini"
                            >
                                编辑
                            </el-button>

                            <el-button
                                v-if="!scope.row.superAdmin"
                                class="row-edit-btn"
                                type="primary"
                                size="mini"
                                @click="
                                    $router.push({
                                        path: '/main/lookCar',
                                        query: { branchId: scope.row.branchId }
                                    })
                                "
                            >
                                查看车辆
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
            :title="editMode ? '编辑' : '新增'"
            :modal-append-to-body="false"
            :append-to-body="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :center="true"
            :visible.sync="editFormVisible"
            @closed="editFormClosed"
            :show-close="!editFormLoading"
            style="min-width:600px"
        >
            <el-form
                ref="editForm"
                :model="editForm"
                label-width="140px"
                size="mini"
            >
                <el-form-item
                    label="网点名称"
                    prop="branchName"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-input v-model="editForm.branchName"></el-input>
                </el-form-item>
                <el-form-item
                    label="网点电话号码"
                    prop="branchMobile"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        },
                        {
                            pattern: /^((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))$/,
                            message: '请输入正确的手机号码'
                        }
                    ]"
                >
                    <el-input v-model="editForm.branchMobile"></el-input>
                </el-form-item>
                <el-form-item
                    label="网点地址"
                    prop="branchAddr"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-input v-model="editForm.branchAddr"></el-input>
                </el-form-item>
                <el-form-item
                    label="网点营业时间开始"
                    prop="businessTimeStart"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-time-picker
                        v-model="editForm.businessTimeStart"
                        size="mini"
                        format="HH:mm"
                        placeholder="选择网点营业时间开始"
                        value-format="HH:mm"
                    ></el-time-picker>
                </el-form-item>
                <el-form-item
                    label="网点营业时间结束"
                    prop="businessTimeEnd"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-time-picker
                        v-model="editForm.businessTimeEnd"
                        size="mini"
                        format="HH:mm"
                        placeholder="选择网点营业时间结束"
                        value-format="HH:mm"
                    ></el-time-picker>
                </el-form-item>
                <el-form-item
                    label="省市区"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-cascader
                        v-if="this.editFormVisible"
                        ref="province"
                        :props="cityprops"
                        clearable
                        v-model="defaultCity"
                        style="width:300px"
                    ></el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button
                        :loading="editFormLoading"
                        type="primary"
                        @click="submitForm"
                    >
                        {{ editMode ? '提交' : '新增' }}
                    </el-button>
                    <el-button :loading="editFormLoading" @click="hideEditForm">
                        取消
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { defaultPageData } from '@/util/page-data';
import { HttpClient } from '@/net';
import moment from 'moment';

const defaultQueryData = {
    pageSize: 10,
    pageNo: 1,
    branchName: '',
    branchMobile: '',
    branchAddr: '',
    businessTimeStart: null,
    businessTimeEnd: null
};
const defaultEditForm = {
    branchId: '',
    provinceCode: 0,
    cityCode: 0,
    districtCode: 0,
    businessTimeStart: null,
    businessTimeEnd: null
};
export default {
    name: 'branch',
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
            businessTimeStart: null,
            businessTimeEnd: null,
            cityprops: {
                lazy: true,
                lazyLoad(node, resolve) {
                    if (node.level === 0) {
                        HttpClient.post('/branch/provinceChoose').then(
                            response => {
                                const resp = response.data;
                                if (resp.success) {
                                    const arr = resp.data.map(e => {
                                        return {
                                            value: e.code,
                                            label: e.areaNamel
                                        };
                                    });
                                    resolve(arr);
                                }
                            }
                        );
                    } else if (node.level === 1) {
                        HttpClient.post('/branch/cityChoose', {
                            provinceCode: node.value
                        }).then(response => {
                            const resp = response.data;
                            if (resp.success) {
                                const arr = resp.data.map(e => {
                                    return {
                                        value: e.code,
                                        label: e.areaNamel
                                    };
                                });
                                resolve(arr);
                            }
                        });
                    } else {
                        HttpClient.post('/branch/districtChoose', {
                            cityCode: node.value
                        }).then(response => {
                            const resp = response.data;
                            if (resp.success) {
                                const arr = resp.data.map(e => {
                                    return {
                                        value: e.code,
                                        label: e.areaNamel,
                                        leaf: true
                                    };
                                });
                                resolve(arr);
                            }
                        });
                    }
                }
            },
            defaultCity: []
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
            const data = {
                pageSize: 10,
                pageNo: 1,
                branchName: this.queryData.branchName,
                branchMobile: this.queryData.branchMobile,
                branchAddr: this.queryData.branchAddr,
                businessTimeStart: this.dateFormat(
                    moment(this.queryData.businessTimeStart).format('HH:mm')
                ),
                businessTimeEnd: this.dateFormat(
                    moment(this.queryData.businessTimeEnd).format('HH:mm')
                )
            };
            HttpClient.post('/branch/branchList', data)
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
        resetSearch() {
            this.queryData = { ...defaultQueryData };
            this.getPageData();
        },

        submitForm() {
            this.$refs.editForm.validate(valid => {
                if (!valid) {
                    return false;
                }
                if (this.editMode) {
                    this.editSubmit();
                } else {
                    this.addSubmit();
                }
            });
        },
        clearValidate() {
            if (this.$refs.editForm) {
                this.$refs.editForm.resetFields();
            }
        },

        hideEditForm() {
            this.editFormVisible = false;
            this.defaultCity = [];
        },
        showEditForm() {
            if (!this.editMode) {
                this.editForm = { ...defaultEditForm };
                this.clearValidate();
            }
            this.editFormVisible = true;
        },
        editFormClosed(e) {
            this.clearValidate();
            // this.$refs.imgUpload.reset();
        },
        add() {
            this.editMode = false;
            this.clearValidate();
            this.showEditForm();
        },
        edit(data) {
            this.editMode = true;
            HttpClient.post('/branch/getBranchById', {
                branchId: data.branchId
            })
                .onstart(e => {
                    this.editFormLoading = true;
                })
                .onend(e => {
                    this.editFormLoading = false;
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.editForm = resp.data;
                        this.defaultCity = [
                            resp.data.provinceCode,
                            resp.data.cityCode,
                            resp.data.districtCode
                        ];
                        this.showEditForm();
                    }
                });
        },

        editSubmit() {
            // 省市区
            const leaf = this.$refs.province.getCheckedNodes()[0];

            const data = {
                branchId: this.editForm.branchId,
                branchName: this.editForm.branchName,
                branchMobile: this.editForm.branchMobile,
                branchAddr: this.editForm.branchAddr,
                businessTimeStart: this.dateFormat(
                    this.editForm.businessTimeStart
                ),
                businessTimeEnd: this.dateFormat(this.editForm.businessTimeEnd),
                provinceCode: leaf.parent.parent.value,
                cityCode: leaf.parent.value,
                districtCode: leaf.value
            };
            HttpClient.post('/branch/editBranch', data)
                .onstart(e => {
                    this.editFormLoading = true;
                })
                .onend(e => {
                    this.editFormLoading = false;
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.hideEditForm();
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        });
                        this.search();
                    }
                });
        },
        addSubmit() {
            // 省市区
            const leaf = this.$refs.province.getCheckedNodes()[0];

            const data = {
                branchName: this.editForm.branchName,
                branchMobile: this.editForm.branchMobile,
                branchAddr: this.editForm.branchAddr,
                businessTimeStart: this.dateFormat(
                    this.editForm.businessTimeStart
                ),
                businessTimeEnd: this.dateFormat(this.editForm.businessTimeEnd),
                provinceCode: leaf.parent.parent.value,
                cityCode: leaf.parent.value,
                districtCode: leaf.value
            };
            HttpClient.post('/branch/addBranch', data)
                .onstart(e => {
                    this.editFormLoading = true;
                })
                .onend(e => {
                    this.editFormLoading = false;
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.hideEditForm();
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.search();
                    }
                });
        },
        changeFormPwd(input) {
            this.editFormPwdChanged = true;
        },
        bannerUploadSuccess(fileUrl) {
            this.editForm.url = fileUrl;
        },
        dateFormat(data) {
            const str = data.toString().split(':');
            return parseInt(str[0]) * 60 + parseInt(str[1]);
        }
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
