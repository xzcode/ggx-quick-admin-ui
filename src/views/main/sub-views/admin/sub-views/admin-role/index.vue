<template>
    <div class="main-inner-content">
        <el-container class="custom-list-container" v-loading="loading">
            <div class="list-search-bar">
                <el-form
                    label-width="80px"
                    :inline="true"
                    label-position="right"
                >
                    <el-form-item label="角色编码">
                        <el-input
                            v-model="queryData.role"
                            size="mini"
                            class="input"
                            placeholder="请输入"
                            style="width: 160px;"
                        />
                    </el-form-item>
                    <el-form-item label="角色说明">
                        <el-input
                            v-model="queryData.description"
                            size="mini"
                            class="input"
                            placeholder="请输入"
                            style="width: 160px;"
                        />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select
                            size="mini"
                            v-model="queryData.status"
                            placeholder="请选择"
                            style="width: 100px;"
                        >
                            <el-option label="全部" :value="null"></el-option>
                            <el-option label="正常" :value="1"></el-option>
                            <el-option label="禁用" :value="2"></el-option>
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
                    <el-table-column prop="role" label="角色" />
                    <el-table-column prop="description" label="角色说明" />
                    <el-table-column prop="orderNum" label="序号" />
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
                    <el-table-column prop="createDate" label="创建日期">
                        <template slot-scope="scope">
                            {{ scope.row.createDate | datetime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="120">
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
                label-width="100px"
                size="mini"
            >
                <el-form-item
                    label="角色"
                    prop="role"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能为空',
                            trigger: 'blur'
                        }
                    ]"
                >
                    <el-input v-model="editForm.role"></el-input>
                </el-form-item>
                <el-form-item
                    label="角色说明"
                    prop="description"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能为空',
                            trigger: 'blur'
                        }
                    ]"
                >
                    <el-input v-model="editForm.description"></el-input>
                </el-form-item>
                <el-form-item
                    label="序号"
                    prop="orderNum"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能为空',
                            trigger: 'blur'
                        }
                    ]"
                >
                    <el-input
                        v-model="editForm.orderNum"
                        type="number"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="状态"
                    prop="status"
                    :rules="[{ required: true, trigger: 'blur' }]"
                >
                    <el-select v-model="editForm.status" placeholder="请选择">
                        <el-option label="正常" :value="1"></el-option>
                        <el-option label="禁用" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="权限控制"
                    prop="permissions"
                    :rules="[{ required: false, trigger: 'blur' }]"
                >
                    <el-tree
                        :data="allPermissions"
                        show-checkbox
                        node-key="uid"
                        ref="permissionTree"
                        :default-expand-all="true"
                        v-loading="editFormLoading"
                    ></el-tree>
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
    pageNo: 1,
    role: null,
    description: null,
    uri: null,
    status: null
};
const defaultEditForm = {
    status: 1,
    orderNum: 1
};
export default {
    name: 'admin-role',
    components: {},
    props: {},
    data() {
        return {
            loading: false,
            editFormLoading: false,
            queryData: { ...defaultQueryData },
            pageData: defaultPageData(),
            editForm: { ...defaultEditForm },
            editFormVisible: false,
            editMode: true, // 是否编辑模式
            allPermissions: []
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
            HttpClient.post('/quick/adminrole/page', this.queryData)
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
            const checkedKeys = this.$refs.permissionTree.getCheckedKeys();
            this.editForm.permissions = checkedKeys.filter(e => e !== '/');
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
            this.getAllPermissions();
        },
        editFormClosed(e) {
            this.allPermissions = [];
        },
        add() {
            this.editMode = false;
            this.clearValidate();
            this.showEditForm();
        },
        edit(data) {
            this.editMode = true;
            HttpClient.post('/quick/adminrole/edit', { uid: data.uid })
                .onstart(e => {
                    this.loading = true;
                })
                .onend(e => {
                    this.loading = false;
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        if (resp.data) {
                            this.editForm = resp.data;
                            this.showEditForm();
                        }
                    }
                });
        },

        editSubmit() {
            HttpClient.post('/quick/adminrole/edit/submit', this.editForm)
                .onstart(e => {
                    this.editFormLoading = true;
                })
                .onend(e => {
                    this.editFormLoading = false;
                    this.search();
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.hideEditForm();
                    }
                });
        },
        addSubmit() {
            HttpClient.post('/quick/adminrole/add/submit', this.editForm)
                .onstart(e => {
                    this.editFormLoading = true;
                })
                .onend(e => {
                    this.editFormLoading = false;
                    this.search();
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.hideEditForm();
                    }
                });
        },
        deleteRow(row) {
            HttpClient.post('/quick/adminrole/delete/rows', { uids: [row.uid] })
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
        getAllPermissions() {
            HttpClient.get('/quick/adminpermission/all/permissions')
                .onstart(e => {
                    this.editFormLoading = true;
                })
                .onend(e => {
                    this.editFormLoading = false;
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        if (resp.data) {
                            const tree = this.makePermissionsTree(
                                resp.data,
                                'root'
                            );
                            const root = {
                                permission: '/',
                                label: '根目录',
                                children: tree
                            };
                            this.allPermissions = [root];
                            this.$refs.permissionTree.setCheckedKeys(
                                this.editForm.permissions || []
                            );
                        }
                    }
                });
        },
        makePermissionsTree(data = [], root) {
            const tree = [];
            for (let i = 0; i < data.length; i++) {
                const per = data[i];
                if (per.parent === root) {
                    tree.push(this.makePermissionNode(per));
                    data.slice(i, 1);
                }
            }
            for (let i = 0; i < tree.length; i++) {
                const arr = this.makePermissionsTree(data, tree[i].permission);
                tree[i].children = arr;
            }
            return tree;
        },
        makePermissionNode(per) {
            return {
                uid: per.uid,
                parent: per.parent,
                permission: per.permission,
                label: per.description,
                children: [],
                disabled: per.status !== 1,
                isLeaf: false
            };
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
