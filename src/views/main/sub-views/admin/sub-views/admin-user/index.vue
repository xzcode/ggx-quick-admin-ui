<template>
    <div class="main-inner-content">
        <el-container class="custom-list-container" v-loading="loading">
            <div class="list-search-bar">
                <el-form label-width="60px" :inline="true">
                    <el-form-item label="用户名">
                        <el-input
                            v-model="queryData.username"
                            size="mini"
                            class="input"
                            placeholder="请输入"
                        />
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input
                            v-model="queryData.mobile"
                            size="mini"
                            class="input"
                            placeholder="请输入"
                        />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select
                            size="mini"
                            v-model="queryData.status"
                            placeholder="请选择"
                        >
                            <el-option label="全部" value=""></el-option>
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="禁用" value="2"></el-option>
                        </el-select>
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
                    <el-table-column prop="username" label="用户名" />
                    <el-table-column prop="nickname" label="昵称" />
                    <el-table-column prop="mobile" label="手机号" />
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status === 1">
                                <el-tag
                                    type="success"
                                    effect="dark"
                                    size="mini"
                                >
                                    正常
                                </el-tag>
                            </template>
                            <template v-else-if="scope.row.status === 2">
                                <el-tag type="danger" effect="dark" size="mini">
                                    禁用
                                </el-tag>
                            </template>
                            <template v-else>
                                <el-tag type="info" effect="dark" size="mini">
                                    未设置
                                </el-tag>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createDate" label="注册日期">
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
                    label="用户名"
                    prop="username"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空',
                            trigger: 'blur'
                        }
                    ]"
                >
                    <el-input v-model="editForm.username"></el-input>
                </el-form-item>
                <el-form-item
                    label="昵称"
                    prop="nickname"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空',
                            trigger: 'blur'
                        }
                    ]"
                >
                    <el-input v-model="editForm.nickname"></el-input>
                </el-form-item>
                <el-form-item
                    label="手机号"
                    prop="mobile"
                    :rules="[{ required: false }]"
                >
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
                <el-form-item
                    label="密码"
                    prop="password"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空',
                            trigger: 'blur'
                        }
                    ]"
                >
                    <el-input
                        @input="changeFormPwd"
                        type="password"
                        v-model="editForm.password"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="状态"
                    prop="status"
                    :rules="[{ required: true, trigger: 'blur' }]"
                >
                    <el-select v-model="editForm.status" placeholder="请选状态">
                        <el-option label="正常" :value="1"></el-option>
                        <el-option label="禁用" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="角色授权"
                    prop="roles"
                    :rules="[{ required: false, trigger: 'blur' }]"
                >
                    <el-transfer
                        v-loading="editFormLoading"
                        v-model="editForm.roles"
                        :data="allRoles"
                        :titles="['角色列表', '已授权']"
                        :button-texts="['取消', '授权']"
                    ></el-transfer>
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
import sha from '@/util/sha';
import { HttpClient } from '@/net';
const defaultQueryData = {
    pageSize: 10,
    pageNo: 1,
    username: null,
    mobile: null,
    status: ''
};
const defaultEditForm = {
    status: 1,
    roles: []
};
export default {
    name: 'admin-user',
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
            allRoles: []
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
            HttpClient.post('/quick/adminuser/page', this.queryData)
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
            this.getAllRoles();
        },
        editFormClosed(e) {},
        add() {
            this.editMode = false;
            this.clearValidate();
            this.showEditForm();
        },
        edit(data) {
            this.editMode = true;
            HttpClient.post('/quick/adminuser/edit', { uid: data.uid })
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
                        if (!this.editForm.roles) {
                            this.editForm.roles = [];
                        }
                        this.showEditForm();
                    }
                });
        },

        editSubmit() {
            if (this.editFormPwdChanged) {
                this.editForm.password = sha.sha256(this.editForm.password);
                this.editFormPwdChanged = false;
            }
            HttpClient.post('/quick/adminuser/edit/submit', this.editForm)
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
                        this.search();
                    }
                });
        },
        addSubmit() {
            if (this.editFormPwdChanged) {
                this.editForm.password = sha.sha256(this.editForm.password);
                this.editFormPwdChanged = false;
            }
            HttpClient.post('/quick/adminuser/add/submit', this.editForm)
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
                        this.search();
                    }
                });
        },
        changeFormPwd(input) {
            this.editFormPwdChanged = true;
        },
        deleteRow(row) {
            HttpClient.post('/quick/adminuser/delete/rows', { uids: [row.uid] })
                .onstart(e => {
                    this.loading = true;
                })
                .onend(e => {
                    this.loading = false;
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.search();
                    }
                });
        },
        getAllRoles() {
            HttpClient.get('/quick/adminrole/all/roles')
                .onstart(e => {
                    this.editFormLoading = true;
                })
                .onend(e => {
                    this.editFormLoading = false;
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success && resp.data) {
                        const allRoles = resp.data.map(e => {
                            return { key: e.uid, label: e.description };
                        });
                        this.allRoles = [...allRoles];
                    }
                });
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
