<template>
    <div class="main-inner-content">
        <el-container class="custom-list-container" v-loading="loading">
            <div class="list-search-bar">
                <el-form label-width="80px" :inline="true">
                    <!--                    <el-form-item label="名称">-->
                    <!--                        <el-input-->
                    <!--                            v-model="queryData.title"-->
                    <!--                            size="mini"-->
                    <!--                            class="input"-->
                    <!--                            placeholder=""-->
                    <!--                        />-->
                    <!--                    </el-form-item>-->
                    <!--                    <el-form-item label="状态">-->
                    <!--                        <el-select-->
                    <!--                            size="mini"-->
                    <!--                            v-model="queryData.enabled"-->
                    <!--                            placeholder="请选择"-->
                    <!--                        >-->
                    <!--                            <el-option label="启用" value="1"></el-option>-->
                    <!--                            <el-option label="关闭" value="0"></el-option>-->
                    <!--                        </el-select>-->
                    <!--                    </el-form-item>-->
                    <!--                    <el-form-item label="起始时间">-->
                    <!--                        <el-date-picker-->
                    <!--                            v-model="queryData.startDate"-->
                    <!--                            type="datetime"-->
                    <!--                            placeholder="选择开始时间"-->
                    <!--                            size="mini"-->
                    <!--                            value-format="yyyy-MM-dd HH:mm:ss"-->
                    <!--                            default-time="12:00:00"-->
                    <!--                        ></el-date-picker>-->
                    <!--                    </el-form-item>-->
                    <!--                    <el-form-item label="结束时间">-->
                    <!--                        <el-date-picker-->
                    <!--                            v-model="queryData.endDate"-->
                    <!--                            type="datetime"-->
                    <!--                            placeholder="选择结束时间"-->
                    <!--                            size="mini"-->
                    <!--                            default-time="12:00:00"-->
                    <!--                            value-format="yyyy-MM-dd HH:mm:ss"-->
                    <!--                        ></el-date-picker>-->
                    <!--                    </el-form-item>-->

                    <el-form-item>
                        <!--                        <el-button-->
                        <!--                            class="search-btn"-->
                        <!--                            icon="el-icon-search"-->
                        <!--                            type="primary"-->
                        <!--                            size="mini"-->
                        <!--                            @click="search"-->
                        <!--                        >-->
                        <!--                            搜索-->
                        <!--                        </el-button>-->
                        <!--                        <el-button-->
                        <!--                            class="search-btn"-->
                        <!--                            icon="el-icon-zoom-out"-->
                        <!--                            size="mini"-->
                        <!--                            @click="resetSearch"-->
                        <!--                        >-->
                        <!--                            重置-->
                        <!--                        </el-button>-->
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
                    <el-table-column prop="title" label="标题" />
                    <el-table-column prop="content" label="内容" />
                    <el-table-column prop="type" label="消息类型">
                        <template slot-scope="scope">
                            <template v-if="scope.row.type === 0">
                                系统公告
                            </template>
                            <template v-else>
                                玩家相关消息
                            </template>
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

                            <el-button
                                v-if="!scope.row.superAdmin"
                                class="row-edit-btn"
                                @click="sendNews(scope.row)"
                                icon="el-icon-s-promotion"
                                type="info"
                                size="mini"
                            >
                                发送
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
                    label="内容"
                    prop="content"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                        v-model="editForm.content"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="消息类型"
                    prop="type"
                    :rules="[{ required: true }]"
                >
                    <el-select v-model="editForm.type" placeholder="请选状态">
                        <el-option label="系统公告" :value="0"></el-option>
                        <el-option label="玩家相关消息" :value="1"></el-option>
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
        <!--发送消息弹框-->
        <el-dialog
            title="发送消息"
            :modal-append-to-body="false"
            :append-to-body="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :center="true"
            :visible.sync="sendFormVisible"
            @closed="sendFormClosed"
            :show-close="!sendFormLoading"
            style="min-width:600px"
        >
            <el-form
                ref="sendForm"
                :model="sendForm"
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
                    <el-input v-model="sendForm.title"></el-input>
                </el-form-item>
                <el-form-item
                    label="内容"
                    prop="content"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                        v-model="sendForm.content"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="消息类型"
                    prop="type"
                    :rules="[{ required: true }]"
                >
                    <el-select v-model="sendForm.type" placeholder="请选状态">
                        <el-option label="系统公告" :value="0"></el-option>
                        <el-option label="玩家相关消息" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="广播对象"
                    prop="radioBroadcastUser"
                    :rules="[{ required: true, message: '对象不能空' }]"
                >
                    <el-select
                        v-model="sendForm.radioBroadcastUser"
                        placeholder="请选对象"
                    >
                        <el-option label="全部用户" :value="0"></el-option>
                        <el-option label="单个用户" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="sendForm.radioBroadcastUser === 1"
                    label="手机号"
                    prop="mobile"
                    :rules="[
                        {
                            required: sendForm.radioBroadcastUser === 1,
                            message: '手机不能空'
                        }
                    ]"
                >
                    <el-input v-model="sendForm.mobile"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        :loading="sendFormLoading"
                        type="primary"
                        @click="submitSendForm"
                    >
                        发送
                    </el-button>
                    <el-button :loading="sendFormLoading" @click="hideSendForm">
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
    title: null
};
const defaultEditForm = {
    uid: '',
    type: 0,
    content: ''
};
const defaultSendForm = {
    uid: '',
    type: 0,
    radioBroadcastUser: 0,
    content: ''
};
export default {
    name: 'news',
    components: {},
    props: {},
    data() {
        return {
            loading: false,
            editFormLoading: false,
            sendFormLoading: false,
            pageData: defaultPageData(),
            queryData: { ...defaultQueryData },
            editForm: { ...defaultEditForm },
            sendForm: { ...defaultSendForm },
            editFormVisible: false,
            sendFormVisible: false,
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
            HttpClient.post('/news/getNewsList', this.queryData)
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
        submitSendForm() {
            this.$refs.sendForm.validate(valid => {
                if (!valid) {
                    return false;
                }
                this.sendSubmit();
            });
        },
        clearValidate() {
            if (this.$refs.editForm) {
                this.$refs.editForm.clearValidate();
            }
            if (this.$refs.sendForm) {
                this.$refs.sendForm.clearValidate();
            }
        },

        hideEditForm() {
            this.editFormVisible = false;
        },
        hideSendForm() {
            this.sendFormVisible = false;
        },
        showEditForm() {
            if (!this.editMode) {
                this.editForm = { ...defaultEditForm };
                this.clearValidate();
            }
            this.editFormVisible = true;
        },
        showSendForm() {
            this.sendFormVisible = true;
        },
        editFormClosed(e) {
            if (this.$refs.editForm) {
                this.$refs.editForm.resetFields();
            }
        },
        sendFormClosed(e) {},
        add() {
            this.editMode = false;
            this.clearValidate();
            this.showEditForm();
        },
        edit(data) {
            this.editMode = true;
            HttpClient.post('/news/getOneNews', { uid: data.uid })
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
        sendNews(data) {
            HttpClient.post('/news/getOneNews', { uid: data.uid })
                .onstart(e => {
                    this.sendFormLoading = true;
                })
                .onend(e => {
                    this.sendFormLoading = false;
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.sendForm = Object.assign(resp.data, {
                            radioBroadcastUser: 0
                        });
                        this.showSendForm();
                    }
                });
        },
        editSubmit() {
            HttpClient.post('/news/editNews', this.editForm)
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
        sendSubmit() {
            HttpClient.post('/news/sendNews', this.sendForm)
                .onstart(e => {
                    this.sendFormLoading = true;
                })
                .onend(e => {
                    this.sendFormLoading = false;
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.hideSendForm();
                        this.$message({
                            message: '发送成功',
                            type: 'success'
                        });
                    }
                });
        },
        addSubmit() {
            HttpClient.post('/news/addNews', this.editForm)
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
            HttpClient.post('/news/delNews', { uids: [row.uid] })
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
