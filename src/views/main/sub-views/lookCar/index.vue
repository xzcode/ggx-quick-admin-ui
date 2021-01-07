<template>
    <div class="main-inner-content">
        <el-container class="custom-list-container" v-loading="loading">
            <div class="list-search-bar">
                <el-form label-width="90px" :inline="true">
                    <el-form-item label="车辆名称">
                        <el-input
                            v-model="queryData.carName"
                            size="mini"
                            class="input"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item label="分组">
                        <el-select
                            v-model="queryData.groupId"
                            filterable
                            placeholder="请选择"
                            size="mini"
                            clearable
                        >
                            <el-option
                                v-for="item in group"
                                :key="item.groupId"
                                :label="item.groupName"
                                :value="item.groupId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌">
                        <el-select
                            v-model="queryData.carBrandId"
                            filterable
                            size="mini"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option
                                v-for="item in carBrand"
                                :key="item.brandId"
                                :label="item.brandName"
                                :value="item.brandId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="变速箱类型">
                        <el-select
                            size="mini"
                            v-model="queryData.gearboxType"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option label="自动" value="1"></el-option>
                            <el-option label="手动" value="2"></el-option>
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
                        <el-button
                            class="search-btn"
                            icon="el-icon-back"
                            type="primary"
                            size="mini"
                            @click="
                                $router.push({
                                    path: '/main/branch'
                                })
                            "
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
                    <el-table-column prop="carName" label="车辆名称" />
                    <el-table-column prop="carNumber" label="车牌号" />
                    <el-table-column prop="groupName" label="车辆类型" />
                    <el-table-column prop="carBrandName" label="品牌名称" />
                    <el-table-column
                        prop="carPictureUrl"
                        label="车辆图片"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <img
                                :src="scope.row.carPictureUrl"
                                width="100"
                                height="50"
                                style="object-fit: contain;"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="gearboxType" label="变速箱类型">
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
                    <el-table-column prop="trunkType" label="后备箱类型">
                        <template slot-scope="scope">
                            <template v-if="scope.row.gearboxType === 1">
                                两厢
                            </template>
                            <template v-else>
                                三厢
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="limitSeats" label="限座" />
                    <el-table-column prop="capacityTank" label="油箱容量" />
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
                            <template v-else-if="scope.row.inletType === 4">
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
                    <el-table-column prop="hot" label="是否热门">
                        <template slot-scope="scope">
                            {{ scope.row.hot ? '是' : '否' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="recommend" label="是否推荐">
                        <template slot-scope="scope">
                            {{ scope.row.recommend ? '是' : '否' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="lease" label="是否租赁中">
                        <template slot-scope="scope">
                            {{ scope.row.lease ? '是' : '否' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" label="日均价">
                        <template slot-scope="scope">
                            {{ scope.row.price / 10000 }}
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
                            <el-button
                                v-if="!scope.row.superAdmin"
                                class="row-edit-btn"
                                type="primary"
                                size="mini"
                                @click="toOrder(scope.row.carId)"
                            >
                                查看订单
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
                label-width="120px"
                size="mini"
            >
                <el-form-item
                    label="车辆名称"
                    prop="carName"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-input v-model="editForm.carName"></el-input>
                </el-form-item>
                <el-form-item
                    label="车牌号"
                    prop="carNumber"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        }
                    ]"
                >
                    <el-input v-model="editForm.carNumber"></el-input>
                </el-form-item>
                <el-form-item
                    label="车辆类型"
                    prop="groupId"
                    :rules="[{ required: true }]"
                >
                    <el-select
                        v-model="editForm.groupId"
                        filterable
                        placeholder="请选分组"
                    >
                        <el-option
                            v-for="item in group"
                            :key="item.groupId"
                            :label="item.groupName"
                            :value="item.groupId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="品牌名称"
                    prop="carBrandId"
                    :rules="[{ required: true }]"
                >
                    <el-select
                        v-model="editForm.carBrandId"
                        filterable
                        placeholder="请选品牌"
                    >
                        <el-option
                            v-for="item in carBrand"
                            :key="item.brandId"
                            :label="item.brandName"
                            :value="item.brandId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="车辆图片"
                    prop="carPictureUrl"
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
                        :current-file-url="editForm.carPictureUrl"
                    />
                </el-form-item>
                <el-form-item
                    label="变速箱类型"
                    prop="gearboxType"
                    :rules="[{ required: true }]"
                >
                    <el-select
                        v-model="editForm.gearboxType"
                        placeholder="请选类型"
                    >
                        <el-option label="自动" :value="1"></el-option>
                        <el-option label="手动" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="排量"
                    prop="displacement"
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
                        v-model="editForm.displacement"
                        type="number"
                        min="0"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="后备箱类型"
                    prop="trunkType"
                    :rules="[{ required: true }]"
                >
                    <el-select
                        v-model="editForm.trunkType"
                        placeholder="请选类型"
                    >
                        <el-option label="两厢" :value="1"></el-option>
                        <el-option label="三厢" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="限座"
                    prop="limitSeats"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        },
                        { pattern: /^\d+$/, message: '不能输入负数和小数' }
                    ]"
                >
                    <el-input
                        v-model="editForm.limitSeats"
                        type="number"
                        min="0"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="油箱容量"
                    prop="capacityTank"
                    :rules="[
                        {
                            required: true,
                            message: '该项不能空'
                        },
                        { pattern: /^\d+$/, message: '不能输入负数和小数' }
                    ]"
                >
                    <el-input
                        v-model="editForm.capacityTank"
                        type="number"
                        min="0"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="进气方式"
                    prop="inletType"
                    :rules="[{ required: true }]"
                >
                    <el-select
                        v-model="editForm.inletType"
                        placeholder="请选方式"
                    >
                        <el-option label="自然吸气" :value="1"></el-option>
                        <el-option label="涡轮增压" :value="2"></el-option>
                        <el-option label="机械增压" :value="3"></el-option>
                        <el-option label="双增压" :value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="是否支持倒车影像"
                    prop="supportBackCamera"
                    :rules="[{ required: true }]"
                >
                    <el-select
                        v-model="editForm.supportBackCamera"
                        placeholder="是否支持"
                    >
                        <el-option label="支持" :value="true"></el-option>
                        <el-option label="不支持" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="是否热门"
                    prop="hot"
                    :rules="[{ required: true }]"
                >
                    <el-select v-model="editForm.hot" placeholder="是否热门">
                        <el-option label="是" :value="true"></el-option>
                        <el-option label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="是否推荐"
                    prop="recommend"
                    :rules="[{ required: true }]"
                >
                    <el-select
                        v-model="editForm.recommend"
                        placeholder="是否推荐"
                    >
                        <el-option label="是" :value="true"></el-option>
                        <el-option label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="日均价"
                    prop="price"
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
                        v-model="editForm.price"
                        type="number"
                        min="0"
                    ></el-input>
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
import { HttpClient } from '@/net';

const defaultQueryData = {
    pageSize: 10,
    pageNo: 1,
    branchId: '',
    carName: ''
};
const defaultEditForm = {
    carId: '',
    branchId: '',
    carName: '',
    carNumber: '',
    groupId: '',
    carBrandId: '',
    carPictureUrl: '',
    gearboxType: 1,
    displacement: 0,
    trunkType: 1,
    limitSeats: 0,
    capacityTank: 0,
    inletType: 1,
    supportBackCamera: true,
    hot: true,
    recommend: true,
    price: 0
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
            editFormPwdChanged: false,
            group: [],
            carBrand: [],
            branchId: ''
        };
    },
    computed: {},
    methods: {
        toOrder(data) {
            this.$router.push({
                path: '/main/order',
                query: {
                    carId: data,
                    branchId: this.branchId
                }
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
            this.queryData.branchId = this.$route.query.branchId;
            this.branchId = this.$route.query.branchId;
            // 分组选择框
            HttpClient.post('/branch/groupChoose')
                .onstart(e => {
                    this.loading = true;
                })
                .onend(e => {
                    this.loading = false;
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.group = resp.data;
                    }
                });
            // 品牌选择框
            HttpClient.post('/branch/brandChoose')
                .onstart(e => {
                    this.loading = true;
                })
                .onend(e => {
                    this.loading = false;
                })
                .then(response => {
                    const resp = response.data;
                    if (resp.success) {
                        this.carBrand = resp.data;
                    }
                });
            HttpClient.post('/branch/branchCarList', this.queryData)
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
            HttpClient.post('/branch/getCarInfoById', { carId: data.carId })
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
                        this.editForm.displacement =
                            this.editForm.displacement / 10000;
                        this.editForm.price = this.editForm.price / 10000;
                        this.showEditForm();
                    }
                });
        },

        editSubmit() {
            const data = {
                carId: this.editForm.carId,
                branchId: this.editForm.branchId,
                carName: this.editForm.carName,
                carNumber: this.editForm.carNumber,
                groupId: this.editForm.groupId,
                carBrandId: this.editForm.carBrandId,
                carPictureUrl: this.editForm.carPictureUrl,
                gearboxType: this.editForm.gearboxType,
                displacement: this.editForm.displacement * 10000,
                trunkType: this.editForm.trunkType,
                limitSeats: this.editForm.limitSeats,
                capacityTank: this.editForm.capacityTank,
                inletType: this.editForm.inletType,
                supportBackCamera: this.editForm.supportBackCamera,
                hot: this.editForm.hot,
                recommend: this.editForm.recommend,
                price: this.editForm.price * 10000
            };
            HttpClient.post('/branch/editCar', data)
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
            this.editForm.branchId = this.$route.query.branchId;
            const data = {
                branchId: this.editForm.branchId,
                carName: this.editForm.carName,
                carNumber: this.editForm.carNumber,
                groupId: this.editForm.groupId,
                carBrandId: this.editForm.carBrandId,
                carPictureUrl: this.editForm.carPictureUrl,
                gearboxType: this.editForm.gearboxType,
                displacement: this.editForm.displacement * 10000,
                trunkType: this.editForm.trunkType,
                limitSeats: this.editForm.limitSeats,
                capacityTank: this.editForm.capacityTank,
                inletType: this.editForm.inletType,
                supportBackCamera: this.editForm.supportBackCamera,
                hot: this.editForm.hot,
                recommend: this.editForm.recommend,
                price: this.editForm.price * 10000
            };

            HttpClient.post('/branch/branchAddCar', data)
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
        // deleteRow(row) {
        //     HttpClient.post('/banner/delBanner', { uids: [row.uid] })
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
        bannerUploadSuccess(fileUrl) {
            this.editForm.carPictureUrl = fileUrl;
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
