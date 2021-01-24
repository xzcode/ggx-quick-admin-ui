<template>
    <div class="main-inner-content">
        <el-container class="custom-list-container" v-loading="loading">
            <div class="list-search-bar">
                <el-form label-width="80px" :inline="true">
                    <el-form-item label="分组id">
                        <el-input
                            v-model="queryData.groupId"
                            size="mini"
                            class="input"
                            placeholder="请输入"
                        />
                    </el-form-item>
                    <el-form-item label="分组名称">
                        <el-input
                            v-model="queryData.groupName"
                            size="mini"
                            class="input"
                            placeholder="请输入"
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
                    <el-table-column prop="groupId" label="分组id" />
                    <el-table-column prop="groupName" label="分组名称" />
                    <el-table-column prop="createDate" label="创建时间">
                        <template slot-scope="scope">
                            {{ scope.row.createDate | datetime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button
                                v-if="!scope.row.superAdmin"
                                class="row-edit-btn"
                                @click="showDialog(scope.row)"
                                icon="el-icon-edit"
                                type="primary"
                                size="mini"
                            >
                                查看
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
            title="查看"
            :modal-append-to-body="false"
            :append-to-body="true"
            :center="true"
            :visible.sync="dialogVisible"
            @closed="dialogClosed"
            :show-close="!dialogLoading"
            style="min-width:600px"
        >
            <el-tabs v-model="activeName">
                <el-tab-pane label="Proto V2" name="first">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 10 }"
                        :value="showData.protoV2String"
                    ></el-input>
                </el-tab-pane>
                <el-tab-pane label="Proto V3" name="second">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 10 }"
                        :value="showData.protoV3String"
                    ></el-input>
                </el-tab-pane>
                <el-tab-pane label="Proto TypeScript" name="third">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 10 }"
                        :value="showData.protoTypeScriptString"
                    ></el-input>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>
<script>
import { defaultPageData } from '@/util/page-data';
import { HttpClient } from '@/net';
const defaultQueryData = {
    pageSize: 10,
    pageNo: 1,
    groupId: null,
    groupName: null
};
export default {
    components: {},
    props: {},
    data() {
        return {
            loading: false,
            dialogLoading: false,
            pageData: defaultPageData(),
            queryData: { ...defaultQueryData },
            activeName: 'first',
            showData: {},
            dialogVisible: false
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
            HttpClient.post('/quick/developer/proto/list', this.queryData)
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
        hideDialog() {
            this.dialogVisible = false;
        },
        showDialog(row) {
            this.showData = row;
            this.dialogVisible = true;
        },
        dialogClosed(e) {},
        deleteRow(row) {
            HttpClient.post('/quick/developer/proto/delete/rows', {
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
                        this.search();
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
