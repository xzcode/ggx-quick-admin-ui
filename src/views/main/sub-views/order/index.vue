<template>
    <div class="main-inner-content">
        <el-container class="custom-list-container" v-loading="loading">
            <div class="list-search-bar">
                <el-form label-width="80px" :inline="true">
                    <el-form-item label="订单状态">
                        <el-select
                            size="mini"
                            v-model="queryData.orderStatus"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option label="待支付" value="0"></el-option>
                            <el-option label="待取车" value="1"></el-option>
                            <el-option label="使用中" value="2"></el-option>
                            <el-option label="已完成" value="3"></el-option>
                            <el-option label="已取消" value="4"></el-option>
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
                            icon="el-icon-back"
                            type="primary"
                            size="mini"
                            @click="toLookCard()"
                        >
                            返回
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
                    <el-table-column prop="orderNo" label="订单编号" />
                    <el-table-column prop="userMobile" label="用户手机号码" />
                    <el-table-column prop="carPrice" label="日均价" />
                    <el-table-column prop="gearboxType" label="变速箱">
                        <template slot-scope="scope">
                            <template v-if="scope.row.gearboxType === 1">
                                自动
                            </template>
                            <template v-else>
                                手动
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="displacement" label="排量">
                        <template slot-scope="scope">
                            {{ scope.row.displacement / 10000 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="trunkType" label="后备箱">
                        <template slot-scope="scope">
                            <template v-if="scope.row.trunkType === 1">
                                两厢
                            </template>
                            <template v-else>
                                三厢
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="limitSeats" label="限座" />
                    <el-table-column prop="capacityTank" label="油箱容量 (L)" />
                    <el-table-column prop="inletType" label="进气方式">
                        <template slot-scope="scope">
                            <template v-if="scope.row.inletType === 1">
                                自然吸气
                            </template>
                            <template v-else-if="scope.row.inletType === 2">
                                涡轮增压
                            </template>
                            <template v-else-if="scope.row.inletType === 3">
                                机械增压
                            </template>
                            <template v-else>
                                双增压
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="supportBackCamera"
                        label="是否支持倒车影像"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.supportBackCamera ? '是' : '否' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderActualPrice" label="订单原价格">
                        <template slot-scope="scope">
                            {{ scope.row.orderActualPrice / 10000 }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="orderOriginalPrice"
                        label="订单实际价格"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.orderOriginalPrice / 10000 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="couponPrice" label="优惠券减免金额">
                        <template slot-scope="scope">
                            {{ scope.row.couponPrice / 10000 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="violationDeposit" label="违章押金">
                        <template slot-scope="scope">
                            {{ scope.row.violationDeposit / 10000 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="vehicleDeposit" label="车辆押金">
                        <template slot-scope="scope">
                            {{ scope.row.vehicleDeposit / 10000 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="commissionPrice" label="手续费">
                        <template slot-scope="scope">
                            {{ scope.row.commissionPrice / 10000 }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="basicGuaranteeServiceFee"
                        label="基本保障服务费价格"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.basicGuaranteeServiceFee / 10000 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="carTotalPrice" label="门店现付价">
                        <template slot-scope="scope">
                            {{ scope.row.carTotalPrice / 10000 }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="orderPickTime"
                        label="订单取车时间"
                    />
                    <el-table-column
                        prop="orderReturnTime"
                        label="订单还车时间"
                    />
                    <el-table-column
                        prop="actualPickTime"
                        label="实际取车时间"
                    />
                    <el-table-column
                        prop="actualReturnTime"
                        label="实际还车时间"
                    />
                    <el-table-column prop="remark" label="备注" />
                    <el-table-column prop="orderStatus" label="订单状态">
                        <template slot-scope="scope">
                            <template v-if="scope.row.orderStatus === 0">
                                待支付
                            </template>
                            <template v-if="scope.row.orderStatus === 1">
                                待取车
                            </template>
                            <template v-if="scope.row.orderStatus === 2">
                                使用中
                            </template>
                            <template v-if="scope.row.orderStatus === 3">
                                已完成
                            </template>
                            <template v-else>
                                已取消
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createDate" label="创建日期" />

                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button
                                v-if="scope.row.orderStatus === 1"
                                class="row-edit-btn"
                                @click="pickCarOrder(scope.row)"
                                icon="el-icon-edit"
                                type="primary"
                                size="mini"
                            >
                                取车
                            </el-button>
                            <el-button
                                v-if="scope.row.orderStatus === 2"
                                class="row-edit-btn"
                                @click="returnCarOrder(scope.row)"
                                icon="el-icon-edit"
                                type="primary"
                                size="mini"
                            >
                                还车
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
    </div>
</template>
<script>
import { defaultPageData } from '@/util/page-data';
import { HttpClient } from '@/net';

const defaultQueryData = {
    pageSize: 10,
    pageNo: 1,
    carId: ''
};
const defaultEditForm = {};
export default {
    name: 'order',
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
            editMode: true, // 是否编辑模式,
            branchId: ''
        };
    },
    computed: {},
    methods: {
        toLookCard() {
            this.$router.push({
                path: '/main/lookCar',
                query: { branchId: this.branchId }
            });
        },
        handleCurrentChange(pageNo) {
            this.queryData.pageNo = pageNo;
            this.getPageData();
        },
        search() {
            this.queryData.pageNo = 1;
            this.getPageData();
        },
        getPageData() {
            this.queryData.carId = this.$route.query.carId;
            this.branchId = this.$route.query.branchId;
            HttpClient.post('/branch/carOrder', this.queryData)
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
        pickCarOrder(data) {
            this.editMode = true;
            HttpClient.post('/branch/pickCarOrder', {
                orderNo: data.orderNo
            }).then(response => {
                const resp = response.data;
                if (resp.success) {
                    this.search();
                }
            });
        },
        returnCarOrder(data) {
            this.editMode = true;
            HttpClient.post('/branch/returnCarOrder', {
                orderNo: data.orderNo
            }).then(response => {
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
