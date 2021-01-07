<template>
    <div class="main-inner-content">
        <el-container class="custom-list-container" v-loading="loading">
            <div class="list-search-bar">
                <el-form label-width="80px" :inline="true">
                    <el-form-item label="品牌名称">
                        <el-input
                            v-model="queryData.brandName"
                            size="mini"
                            class="input"
                            placeholder=""
                        />
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
                    <el-table-column prop="carBrandName" label="品牌名称" />
                    <el-table-column
                        prop="carBrandUrl"
                        label="品牌图片"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <img
                                :src="scope.row.carBrandUrl"
                                width="100"
                                height="50"
                                style="object-fit: contain;"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="createDate" label="创建日期">
                        <template slot-scope="scope">
                            {{ scope.row.createDate | datetime }}
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
                label-width="80px"
                size="mini"
            >
                <el-form-item
                    label="品牌名称"
                    prop="carBrandName"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-input v-model="editForm.carBrandName"></el-input>
                </el-form-item>
                <el-form-item
                    label="品牌图片"
                    prop="carBrandUrl"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <aliyun-oss-image-upload
                        ref="imgUpload"
                        :on-upload-success="bannerUploadSuccess"
                        :current-file-url="editForm.carBrandUrl"
                    />
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
import AliyunOssImageUpload from '@/components/aliyun-oss/aliyun-oss-image-upload';
import md5 from 'md5';
import { HttpClient } from '@/net';

const defaultQueryData = {
    pageSize: 10,
    pageNo: 1,
    brandName: ''
};
const defaultEditForm = {
    carBrandName: '',
    carBrandUrl: ''
};
export default {
    name: 'banner',
    components: {
        'aliyun-oss-image-upload': AliyunOssImageUpload
    },
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
            editFormPwdChanged: false
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
            HttpClient.post('/carBrand/brandListVm', this.queryData)
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
            this.$refs.imgUpload.reset();
        },
        add() {
            this.editMode = false;
            this.clearValidate();
            this.showEditForm();
        },
        edit(data) {
            this.editMode = true;
            HttpClient.post('/carBrand/getBrandById', { brandId: data.brandId })
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
                        this.showEditForm();
                    }
                });
        },

        editSubmit() {
            HttpClient.post('/carBrand/editBrand', this.editForm)
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
            HttpClient.post('/carBrand/addBrand', this.editForm)
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
            this.editForm.carBrandUrl = fileUrl;
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
