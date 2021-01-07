<template>
    <div class="main-inner-content">
        <el-container class="custom-list-container" v-loading="loading">
            <div class="list-search-bar">
                <el-form label-width="80px" :inline="true">
                    <el-form-item label="名称">
                        <el-input
                            v-model="queryData.couponName"
                            size="mini"
                            class="input"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item label="优惠类型">
                        <el-select
                            size="mini"
                            v-model="queryData.offerType"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option label="折扣" value="1"></el-option>
                            <el-option label="满减" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="券类型">
                        <el-select
                            size="mini"
                            v-model="queryData.couponType"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option label="新用户" value="0"></el-option>
                            <el-option label="全网点" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select
                            size="mini"
                            v-model="queryData.status"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option label="下架" value="0"></el-option>
                            <el-option label="上架" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="起始时间">
                        <el-date-picker
                            v-model="queryData.startDate"
                            type="datetime"
                            placeholder="选择起始时间"
                            size="mini"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="12:00:00"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="到期时间">
                        <el-date-picker
                            v-model="queryData.expireDate"
                            type="datetime"
                            placeholder="选择到期时间"
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
                    <!--                    <el-table-column prop="uid" label="id" />-->
                    <el-table-column prop="couponName" label="优惠券名称" />
                    <el-table-column prop="couponType" label="优惠券类型">
                        <template slot-scope="scope">
                            <template v-if="scope.row.couponType === 0">
                                新用户
                            </template>
                            <template v-else>
                                全网点
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="offerType" label="优惠类型">
                        <template slot-scope="scope">
                            <template v-if="scope.row.offerType === 0">
                                满减
                            </template>
                            <template v-else>
                                折扣
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="validityType" label="有效期类型">
                        <template slot-scope="scope">
                            <template v-if="scope.row.validityType === 0">
                                固定日期
                            </template>
                            <template v-else>
                                固定周期
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column prop="startDate" label="有效期开始时间">
                        <template slot-scope="scope">
                            {{
                                scope.row.validityType === 0
                                    ? scope.row.startDate
                                    : '/'
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="expireDate" label="有效期到期时间">
                        <template slot-scope="scope">
                            {{
                                scope.row.validityType === 0
                                    ? scope.row.expireDate
                                    : '/'
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="validPeriod" label="有效期">
                        <template slot-scope="scope">
                            {{
                                scope.row.validityType === 0
                                    ? '/'
                                    : scope.row.validPeriod
                            }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status === 1">
                                <el-tag
                                    type="success"
                                    effect="dark"
                                    size="mini"
                                >
                                    上架
                                </el-tag>
                            </template>
                            <template v-else-if="scope.row.status === 0">
                                <el-tag type="danger" effect="dark" size="mini">
                                    下架
                                </el-tag>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="collectionMethod" label="领取方式">
                        <template slot-scope="scope">
                            <template v-if="scope.row.collectionMethod === 0">
                                主动发放
                            </template>
                            <template v-else>
                                手动领取
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="target" label="目标金额">
                        <template slot-scope="scope">
                            {{
                                scope.row.offerType === 0
                                    ? scope.row.target / 10000
                                    : '/'
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="deductionAmount"
                        label="抵扣金额/百分比"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.offerType === 0
                                    ? scope.row.deductionAmount / 10000
                                    : scope.row.deductionAmount + '%'
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="rulesOfUse" label="规则描述">
                        <template slot-scope="scope">
                            <el-popover
                                placement="top-start"
                                width="200"
                                trigger="hover"
                                :content="scope.row.rulesOfUse"
                            >
                                <el-button slot="reference" type="text">
                                    规则描述
                                </el-button>
                            </el-popover>
                        </template>
                    </el-table-column>
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
                                @click="edit(scope.row)"
                                icon="el-icon-edit"
                                type="primary"
                                size="mini"
                            >
                                编辑
                            </el-button>

                            <!--                            <el-popconfirm-->
                            <!--                                v-if="!scope.row.superAdmin"-->
                            <!--                                title="确定删除本记录吗？"-->
                            <!--                                @confirm="deleteRow(scope.row)"-->
                            <!--                            >-->
                            <!--                                <el-button-->
                            <!--                                    class="row-edit-btn"-->
                            <!--                                    icon="el-icon-delete"-->
                            <!--                                    type="danger"-->
                            <!--                                    size="mini"-->
                            <!--                                    slot="reference"-->
                            <!--                                >-->
                            <!--                                    删除-->
                            <!--                                </el-button>-->
                            <!--                            </el-popconfirm>-->
                            <!--                            <el-popconfirm-->
                            <!--                                v-if="scope.row.couponType !== 0"-->
                            <!--                                title="确定发放该优惠券吗？"-->
                            <!--                                @confirm="sendCoupon(scope.row)"-->
                            <!--                            >-->
                            <!--                                <el-button-->
                            <!--                                    class="row-edit-btn"-->
                            <!--                                    icon="el-icon-s-promotion"-->
                            <!--                                    type="info"-->
                            <!--                                    size="mini"-->
                            <!--                                    slot="reference"-->
                            <!--                                >-->
                            <!--                                    发送-->
                            <!--                                </el-button>-->
                            <!--                            </el-popconfirm>-->
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
                label-width="120px"
                size="mini"
            >
                <el-form-item
                    label="优惠券名称"
                    prop="couponName"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-input v-model="editForm.couponName"></el-input>
                </el-form-item>
                <el-form-item
                    label="优惠类型"
                    prop="offerType"
                    :rules="[{ required: true }]"
                >
                    <el-select
                        v-model="editForm.offerType"
                        placeholder="请选类型"
                    >
                        <el-option label="折扣" :value="1"></el-option>
                        <el-option label="满减" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="优惠券类型"
                    prop="couponType"
                    :rules="[{ required: true }]"
                >
                    <el-select
                        v-model="editForm.couponType"
                        placeholder="请选类型"
                    >
                        <el-option label="全网点" :value="1"></el-option>
                        <el-option label="新用户" :value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    v-if="editForm.offerType === 0"
                    label="目标条件金额"
                    prop="target"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        },
                        {
                            pattern: /^[0-9]+([.][0-9]+)?$/,
                            message: '不能输入负数'
                        }
                    ]"
                >
                    <el-input
                        v-model="editForm.target"
                        type="number"
                        min="0"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="折扣百分比"
                    v-if="editForm.offerType === 1"
                    prop="deductionAmount"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        },
                        { pattern: /^\d+$/, message: '不能输入负数和小数' }
                    ]"
                >
                    <el-input
                        v-model="editForm.deductionAmount"
                        type="number"
                        min="0"
                        max="100"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    v-else
                    label="折扣金额"
                    prop="deductionAmount"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        },
                        {
                            pattern: /^[0-9]+([.][0-9]+)?$/,
                            message: '不能输入负数'
                        }
                    ]"
                >
                    <el-input
                        v-model="editForm.deductionAmount"
                        type="number"
                        min="0"
                        max="100"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="有效期类型"
                    prop="validityType"
                    :rules="[{ required: true }]"
                >
                    <el-select
                        v-model="editForm.validityType"
                        placeholder="请选类型"
                    >
                        <el-option label="固定周期" :value="1"></el-option>
                        <el-option label="固定日期" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="起始时间"
                    v-if="editForm.validityType === 0"
                >
                    <el-date-picker
                        v-model="editForm.startDate"
                        type="datetime"
                        placeholder="选择起始时间"
                        size="mini"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        default-time="12:00:00"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    label="到期时间"
                    v-if="editForm.validityType === 0"
                >
                    <el-date-picker
                        v-model="editForm.expireDate"
                        type="datetime"
                        placeholder="选择到期时间"
                        size="mini"
                        default-time="12:00:00"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <!--                <el-form-item-->
                <!--                    v-if="editForm.validityType === 0"-->
                <!--                    label="有效期起始时间"-->
                <!--                    :rules="[-->
                <!--                        {-->
                <!--                            required: true,-->
                <!--                            message: '该项不能空'-->
                <!--                        }-->
                <!--                    ]"-->
                <!--                >-->
                <!--                    <el-date-picker-->
                <!--                        v-model="editForm.startDate"-->
                <!--                        type="datetime"-->
                <!--                        placeholder="选择开始时间"-->
                <!--                        size="mini"-->
                <!--                        value-format="yyyy-MM-dd HH:mm:ss"-->
                <!--                        default-time="12:00:00"-->
                <!--                    ></el-date-picker>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item-->
                <!--                    v-if="editForm.validityType === 0"-->
                <!--                    label="有效期结束时间"-->
                <!--                    :rules="[-->
                <!--                        {-->
                <!--                            required: true,-->
                <!--                            message: '该项不能空'-->
                <!--                        }-->
                <!--                    ]"-->
                <!--                >-->
                <!--                    <el-date-picker-->
                <!--                        v-model="editForm.expireDate"-->
                <!--                        type="datetime"-->
                <!--                        placeholder="选择结束时间"-->
                <!--                        size="mini"-->
                <!--                        default-time="12:00:00"-->
                <!--                        value-format="yyyy-MM-dd HH:mm:ss"-->
                <!--                    ></el-date-picker>-->
                <!--                </el-form-item>-->
                <el-form-item
                    v-show="editForm.validityType === 1"
                    label="有效期(天)"
                    prop="validPeriod"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        },
                        { pattern: /^\d+$/, message: '不能输入负数和小数' }
                    ]"
                >
                    <el-input
                        v-model="editForm.validPeriod"
                        type="number"
                        min="0"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="使用规则描述"
                    prop="rulesOfUse"
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
                        placeholder="请输入规则"
                        v-model="editForm.rulesOfUse"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="领取方式"
                    prop="collectionMethod"
                    :rules="[{ required: true }]"
                >
                    <el-select
                        v-model="editForm.collectionMethod"
                        placeholder="请选方式"
                    >
                        <el-option label="手动领取" :value="1"></el-option>
                        <el-option label="主动发放" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="状态"
                    prop="status"
                    :rules="[{ required: true }]"
                >
                    <el-select v-model="editForm.status" placeholder="请选状态">
                        <el-option label="上架" :value="1"></el-option>
                        <el-option label="下架" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <!--                        -->
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
    startDate: null,
    expireDate: null
};
const defaultEditForm = {
    id: '',
    couponName: '',
    couponType: 0,
    target: 0,
    deductionAmount: 0,
    validityType: 0,
    startDate: null,
    expireDate: null,
    validPeriod: 0,
    rulesOfUse: '',
    collectionMethod: 0,
    status: 0,
    offerType: 0
};
export default {
    name: 'coupon',
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
            HttpClient.post('/coupon/getCoupon', this.queryData)
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
        editFormClosed(e) {},
        add() {
            this.editMode = false;
            this.clearValidate();
            this.showEditForm();
        },
        edit(data) {
            this.editMode = true;
            HttpClient.post('/coupon/getOneCoupon', { uid: data.id })
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
                        if (this.editForm.offerType === 0) {
                            this.editForm.target = this.editForm.target / 10000;
                            this.editForm.deductionAmount =
                                this.editForm.deductionAmount / 10000;
                        }
                        this.showEditForm();
                    }
                });
        },

        editSubmit() {
            if (this.editFormPwdChanged) {
                this.editForm.password = md5(this.editForm.password);
                this.editFormPwdChanged = false;
            }
            const data = {
                id: this.editForm.id,
                couponName: this.editForm.couponName,
                couponType: this.editForm.couponType,
                target: this.editForm.target * 10000,
                deductionAmount:
                    this.editForm.offerType === 0
                        ? this.editForm.deductionAmount * 10000
                        : this.editForm.deductionAmount,
                validityType: this.editForm.validityType,
                startDate: this.editForm.startDate,
                expireDate: this.editForm.expireDate,
                validPeriod: this.editForm.validityType,
                rulesOfUse: this.editForm.rulesOfUse,
                collectionMethod: this.editForm.collectionMethod,
                status: this.editForm.status,
                offerType: this.editForm.offerType
            };
            HttpClient.post('/coupon/editCoupon', data)
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
            const data = {
                id: this.editForm.id,
                couponName: this.editForm.couponName,
                couponType: this.editForm.couponType,
                target: this.editForm.target * 10000,
                deductionAmount:
                    this.editForm.offerType === 0
                        ? this.editForm.deductionAmount * 10000
                        : this.editForm.deductionAmount,
                validityType: this.editForm.validityType,
                startDate: this.editForm.startDate,
                expireDate: this.editForm.expireDate,
                validPeriod: this.editForm.validityType,
                rulesOfUse: this.editForm.rulesOfUse,
                collectionMethod: this.editForm.collectionMethod,
                status: this.editForm.status,
                offerType: this.editForm.offerType
            };
            HttpClient.post('/coupon/addCoupon', data)
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
        // deleteRow(row) {
        //     HttpClient.post('/coupon/delCoupon', { uids: [row.id] })
        //         .onstart(e => {
        //             this.loading = true;
        //         })
        //         .onend(e => {
        //             this.loading = false;
        //         })
        //         .then(response => {
        //             const resp = response.data;
        //             if (resp.success) {
        //                 this.$message({
        //                     message: '删除成功',
        //                     type: 'success'
        //                 });
        //                 this.search();
        //             }
        //         });
        // },
        sendCoupon(row) {
            HttpClient.post('/coupon/issueCoupons', { uid: row.id })
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
                            message: '发送成功',
                            type: 'success'
                        });
                        // this.search();
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
