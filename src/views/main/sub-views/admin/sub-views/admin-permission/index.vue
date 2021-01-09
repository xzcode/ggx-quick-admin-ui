<template>
    <div class="main-inner-content permission-list">
        <el-tabs
            type="border-card"
            class="content-tabs"
            :value="tabActive"
            @tab-click="tabClick"
        >
            <el-tab-pane class="content-tab-pane" name="listview">
                <span slot="label">
                    <i class="el-icon-date"></i>
                    列表视图
                </span>
                <el-container class="custom-list-container" v-loading="loading">
                    <div class="list-search-bar">
                        <el-form label-width="100px" :inline="true">
                            <el-form-item label="权限编码">
                                <el-input
                                    v-model="queryData.permission"
                                    size="mini"
                                    class="input"
                                    placeholder="请输入"
                                />
                            </el-form-item>
                            <el-form-item label="父权限编码">
                                <el-input
                                    v-model="queryData.parent"
                                    size="mini"
                                    class="input"
                                    placeholder="请输入"
                                />
                            </el-form-item>
                            <el-form-item label="接口uri">
                                <el-input
                                    v-model="queryData.uri"
                                    size="mini"
                                    class="input"
                                    placeholder="请输入"
                                />
                            </el-form-item>
                            <el-form-item label="权限说明">
                                <el-input
                                    v-model="queryData.description"
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
                                    <el-option
                                        label="全部"
                                        :value="null"
                                    ></el-option>
                                    <el-option
                                        label="正常"
                                        :value="1"
                                    ></el-option>
                                    <el-option
                                        label="禁用"
                                        :value="2"
                                    ></el-option>
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
                            <el-table-column prop="parent" label="父权限编码" />
                            <el-table-column
                                prop="permission"
                                label="权限编码"
                            />
                            <el-table-column prop="uri" label="接口uri" />
                            <el-table-column
                                prop="description"
                                label="权限说明"
                            />
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
                                    <template
                                        v-else-if="scope.row.status === 2"
                                    >
                                        <el-tag
                                            type="danger"
                                            effect="dark"
                                            size="mini"
                                        >
                                            禁用
                                        </el-tag>
                                    </template>
                                    <template v-else>
                                        <el-tag
                                            type="info"
                                            effect="dark"
                                            size="mini"
                                        >
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
                            <el-table-column
                                label="操作"
                                fixed="right"
                                width="120"
                            >
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
                                        class="row-edit-btn"
                                        icon="el-icon-delete"
                                        type="danger"
                                        size="mini"
                                        slot="reference"
                                        @click="deleteRow(scope.row)"
                                    >
                                        删除
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
            </el-tab-pane>
            <el-tab-pane class="content-tab-pane" name="treeview">
                <span slot="label">
                    <i class="el-icon-date"></i>
                    树形视图
                </span>
                <el-input
                    placeholder="输入关键字进行过滤"
                    size="mini"
                    v-model="treeFilterText"
                    clearable
                    style="width: 280px;padding: 10px;margin: 0px 10px;"
                ></el-input>
                <el-tree
                    :data="allPermissions"
                    node-key="permission"
                    ref="permissionTree"
                    :default-expand-all="true"
                    :show-checkbox="false"
                    :expand-on-click-node="false"
                    :highlight-current="true"
                    :indent="32"
                    v-loading="loading || editFormLoading"
                    :filter-node-method="treeFilterNode"
                    v-model="treeFilterText"
                >
                    <span style="font-size: 16px;" slot-scope="{ node, data }">
                        <el-button
                            type="text"
                            style="font-weight: bold; color: #000"
                        >
                            {{ node.label }}
                        </el-button>
                        <el-tag
                            v-if="data.permission"
                            size="mini"
                            type="warning"
                            class="permission-tree-tag"
                        >
                            {{ 'permission: ' + data.permission }}
                        </el-tag>
                        <template v-if="data.permission !== 'root'">
                            <el-tag
                                v-if="data.uri"
                                size="mini"
                                type="success"
                                class="permission-tree-tag"
                            >
                                {{ 'uri: ' + data.uri }}
                            </el-tag>
                            <el-button
                                type="primary"
                                size="mini"
                                plain
                                icon="el-icon-edit-outline"
                                class="permission-tree-btn"
                                @click="edit(data)"
                            >
                                编辑
                            </el-button>
                            <el-button
                                type="danger"
                                size="mini"
                                plain
                                icon="el-icon-remove-outline"
                                class="permission-tree-btn"
                                @click="deleteRow(data)"
                            >
                                删除
                            </el-button>
                        </template>
                        <el-button
                            type="success"
                            size="mini"
                            plain
                            icon="el-icon-circle-plus-outline"
                            class="permission-tree-btn"
                            @click="add(data.permission)"
                        >
                            新增
                        </el-button>
                    </span>
                </el-tree>
            </el-tab-pane>
        </el-tabs>

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
                    label="父权限编码"
                    prop="parent"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能为空',
                            trigger: 'blur'
                        }
                    ]"
                >
                    <el-input v-model="editForm.parent"></el-input>
                </el-form-item>
                <el-form-item
                    label="权限编码"
                    prop="permission"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能为空',
                            trigger: 'blur'
                        }
                    ]"
                >
                    <el-input v-model="editForm.permission"></el-input>
                </el-form-item>
                <el-form-item
                    label="接口uri"
                    prop="uri"
                    :rules="[
                        {
                            required: false
                        }
                    ]"
                >
                    <el-input v-model="editForm.uri"></el-input>
                </el-form-item>
                <el-form-item
                    label="说明"
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
                    <el-select v-model="editForm.status" placeholder="请选状态">
                        <el-option label="正常" :value="1"></el-option>
                        <el-option label="禁用" :value="2"></el-option>
                    </el-select>
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
import md5 from 'md5';
import { HttpClient } from '@/net';
const defaultQueryData = {
    pageSize: 10,
    pageNo: 1,
    permission: null,
    parent: null,
    description: null,
    uri: null,
    status: null
};
const defaultEditForm = {
    status: 1,
    parent: 'root',
    orderNum: 0
};
export default {
    name: 'admin-permission',
    components: {},
    props: {},
    data() {
        return {
            loading: false,
            editFormLoading: false,
            queryData: { ...defaultQueryData },
            pageData: defaultPageData(),
            editForm: { ...defaultEditForm },
            allPermissions: [],
            editFormVisible: false,
            editMode: true, // 是否编辑模式
            editFormPwdChanged: false,
            tabActive: 'listview',
            treeFilterText: null
        };
    },
    computed: {},
    watch: {
        treeFilterText(val) {
            this.$refs.permissionTree.filter(val);
        }
    },
    methods: {
        handleCurrentChange(pageNo) {
            this.queryData.pageNo = pageNo;
            this.getPageData();
        },
        search() {
            this.queryData.pageNo = 1;
            this.getPageData();
        },
        tabClick(e) {
            if (e.name === 'treeview') {
                this.getAllPermissions();
            }
            this.tabActive = e.name;
        },
        treeFilterNode(value, data) {
            if (!value) return true;
            return (
                data.label.indexOf(value) !== -1 ||
                data.permission.indexOf(value) !== -1 ||
                (data.uri && data.uri.indexOf(value) !== -1)
            );
        },

        getAllPermissions() {
            HttpClient.get('/quick/adminpermission/all/permissions')
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
                            const tree = this.makePermissionsTree(
                                resp.data,
                                'root'
                            );
                            const root = {
                                permission: 'root',
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
                uri: per.uri,
                label: per.description,
                children: [],
                disabled: per.status !== 1,
                isLeaf: false
            };
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
        },
        editFormClosed(e) {},
        add(parent) {
            this.editMode = false;
            this.clearValidate();
            this.showEditForm();
            if (parent) {
                this.editForm.parent = parent;
            }
        },
        edit(data) {
            this.editMode = true;
            HttpClient.post('/quick/adminpermission/edit', { uid: data.uid })
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
                            this.editForm = resp.data;
                            this.showEditForm();
                        }
                    }
                });
        },

        editSubmit() {
            if (this.editFormPwdChanged) {
                this.editForm.password = md5(this.editForm.password);
                this.editFormPwdChanged = false;
            }
            HttpClient.post('/quick/adminpermission/edit/submit', this.editForm)
                .onstart(e => {
                    this.editFormLoading = true;
                })
                .onend(e => {
                    this.editFormLoading = false;
                    if (this.tabActive === 'listview') {
                        this.search();
                    } else {
                        this.getAllPermissions();
                    }
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.hideEditForm();
                    }
                });
        },
        addSubmit() {
            if (this.editFormPwdChanged) {
                this.editForm.password = md5(this.editForm.password);
                this.editFormPwdChanged = false;
            }
            HttpClient.post('/quick/adminpermission/add/submit', this.editForm)
                .onstart(e => {
                    this.editFormLoading = true;
                })
                .onend(e => {
                    this.editFormLoading = false;
                    if (this.tabActive === 'listview') {
                        this.search();
                    } else {
                        this.getAllPermissions();
                    }
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.hideEditForm();
                    }
                });
        },
        changeFormPwd(input) {
            this.editFormPwdChanged = true;
        },
        deleteRow(row) {
            this.$confirm('删除权限将连同子权限一并删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                HttpClient.post('/quick/adminpermission/delete/rows', {
                    uids: [row.uid]
                })
                    .onstart(e => {
                        this.loading = true;
                    })
                    .onend(e => {
                        this.loading = false;
                    })
                    .then(response => {
                        const resp = response.data;
                        if (resp.success) {
                            if (this.tabActive === 'listview') {
                                this.search();
                            } else {
                                this.getAllPermissions();
                            }
                        }
                    });
            });
        },
        getPageData() {
            HttpClient.post('/quick/adminpermission/page', this.queryData)
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
.permission-list {
    .content-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;
        .el-tabs__content {
            flex-grow: 100;
            padding: 0px;
            display: flex;
            .content-tab-pane {
                height: 100%;
                display: flex;
                width: 100%;
                flex-direction: column;
                .el-tree {
                    width: 100%;
                }

                .permission-tree-tag {
                    margin: 0px 5px;
                }
                .permission-tree-btn {
                    height: 20px;
                    padding: 2px 5px;
                }
            }
        }
    }
}
</style>
