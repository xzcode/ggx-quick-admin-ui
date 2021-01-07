<template>
    <div class="main-inner-content">
        <el-container class="custom-list-container" v-loading="loading">
            <div class="list-content">
                <el-table
                    class="table"
                    :data="pageData.items"
                    size="small"
                    border
                    stripe
                    height="100%"
                >
                    <el-table-column prop="remark" label="名称" />
                    <el-table-column prop="value" label="配置值">
                        <template slot-scope="scope">
                            {{ scope.row.value / 10000 }}
                        </template>
                    </el-table-column>
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
                    label="配置值"
                    prop="value"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-input v-model="editForm.value"></el-input>
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

const defaultQueryData = {
    pageSize: 10,
    pageNo: 1
};
const defaultEditForm = {
    value: 0
};
export default {
    name: 'costConfig',
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
            businessTimeEnd: null
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
            HttpClient.post('/costConfig/get-cost-config')
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
            HttpClient.post('/costConfig/get-one-config', {
                id: data.id,
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
                        this.editForm.value = resp.data.value / 10000;
                        this.showEditForm();
                    }
                });
        },

        editSubmit() {
            const data = {
                id: this.editForm.id,
                value: this.editForm.value * 10000
            };
            HttpClient.post('/costConfig/edit-cost-config', data)
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
        // addSubmit() {
        //     // 省市区
        //     const leaf = this.$refs.province.getCheckedNodes()[0];
        //     console.log(leaf.parent.parent.label);
        //     console.log(leaf.parent.label);
        //     console.log(leaf.label);
        //
        //     const data = {
        //         branchName: this.editForm.branchName,
        //         branchMobile: this.editForm.branchMobile,
        //         branchAddr: this.editForm.branchAddr,
        //         businessTimeStart: this.dateFormat(
        //             this.editForm.businessTimeStart
        //         ),
        //         businessTimeEnd: this.dateFormat(this.editForm.businessTimeEnd),
        //         provinceCode: leaf.parent.parent.value,
        //         cityCode: leaf.parent.value,
        //         districtCode: leaf.value
        //     };
        //     HttpClient.post('/branch/addBranch', data)
        //         .onstart(e => {
        //             this.editFormLoading = true;
        //         })
        //         .onend(e => {
        //             this.editFormLoading = false;
        //         })
        //         .then(response => {
        //             const resp = response.data;
        //             if (resp.success) {
        //                 this.hideEditForm();
        //                 this.$message({
        //                     message: '添加成功',
        //                     type: 'success'
        //                 });
        //                 this.search();
        //             }
        //         });
        // },
        changeFormPwd(input) {
            this.editFormPwdChanged = true;
        },
        bannerUploadSuccess(fileUrl) {
            this.editForm.url = fileUrl;
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
