<template>
    <div class="main-inner-content">
        <el-container class="custom-list-container" v-loading="loading">
            <div class="list-search-bar">
                <el-form label-width="80px" :inline="true">
                    <el-form-item label="名称">
                        <el-input
                            v-model="queryData.title"
                            size="mini"
                            class="input"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select
                            size="mini"
                            v-model="queryData.enabled"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option label="启用" value="1"></el-option>
                            <el-option label="关闭" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="起始时间">
                        <el-date-picker
                            v-model="queryData.startDate"
                            type="datetime"
                            placeholder="选择开始时间"
                            size="mini"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="12:00:00"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker
                            v-model="queryData.endDate"
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
                    <el-table-column prop="uid" label="id" />
                    <el-table-column prop="title" label="标题" />
                    <el-table-column prop="url" label="图片" align="center">
                        <template slot-scope="scope">
                            <img
                                :src="scope.row.url"
                                width="100"
                                height="50"
                                style="object-fit: contain;"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="weight" label="权重" />
                    <el-table-column prop="type" label="跳转类型">
                        <template slot-scope="scope">
                            <template v-if="scope.row.type === 0">
                                可跳转
                            </template>
                            <template v-else>
                                不可跳转
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="jumpUrl" label="跳转url" />
                    <el-table-column prop="enabled" label="状态">
                        <template slot-scope="scope">
                            <template v-if="scope.row.enabled === 1">
                                <el-tag
                                    type="success"
                                    effect="dark"
                                    size="mini"
                                >
                                    启用
                                </el-tag>
                            </template>
                            <template v-else-if="scope.row.enabled === 0">
                                <el-tag type="danger" effect="dark" size="mini">
                                    关闭
                                </el-tag>
                            </template>
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

                            <el-popconfirm
                                v-if="!scope.row.superAdmin"
                                title="确定删除本记录吗？"
                                @confirm="deleteRow(scope.row)"
                            >
                                <el-button
                                    class="row-edit-btn"
                                    icon="el-icon-delete"
                                    type="danger"
                                    size="mini"
                                    slot="reference"
                                >
                                    删除
                                </el-button>
                            </el-popconfirm>
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
                    label="标题"
                    prop="title"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-input v-model="editForm.title"></el-input>
                </el-form-item>
                <el-form-item
                    label="图片路径"
                    prop="url"
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
                        :current-file-url="editForm.url"
                    />
                </el-form-item>
                <el-form-item
                    label="权重"
                    prop="weight"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-input v-model="editForm.weight"></el-input>
                </el-form-item>
                <el-form-item
                    label="状态"
                    prop="enabled"
                    :rules="[{ required: true }]"
                >
                    <el-select
                        v-model="editForm.enabled"
                        placeholder="请选状态"
                    >
                        <el-option label="启用" :value="1"></el-option>
                        <el-option label="禁用" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="跳转类型"
                    prop="type"
                    :rules="[{ required: true }]"
                >
                    <el-select v-model="editForm.type" placeholder="请选状态">
                        <el-option label="可跳转" :value="0"></el-option>
                        <el-option label="不可跳转" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-show="editForm.type === 0"
                    label="跳转路径"
                    prop="jumpUrl"
                    :rules="[
                        {
                            required: editForm.type === 0,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-input v-model="editForm.jumpUrl"></el-input>
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
    title: null,
    enabled: '',
    startDate: null,
    endDate: null
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
            editMode: true // 是否编辑模式
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
            HttpClient.post('/banner/getBanner', this.queryData)
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
            HttpClient.post('/banner/getOneBanner', { uid: data.uid })
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
            HttpClient.post('/banner/editBanner', this.editForm)
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
            HttpClient.post('/banner/addBanner', this.editForm)
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
        deleteRow(row) {
            HttpClient.post('/banner/delBanner', { uids: [row.uid] })
                .onstart(e => {
                    this.loading = true;
                })
                .onend(e => {
                    this.loading = false;
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.search();
                    }
                });
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
