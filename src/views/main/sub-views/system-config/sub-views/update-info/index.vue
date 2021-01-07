<template>
    <div>
        <!-- 
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>修改头像</span>
            </div>
        </el-card>
        <el-divider></el-divider>
 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>修改密码</span>
            </div>
            <el-form
                status-icon
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item label="旧密码">
                    <el-input type="password" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="新密码">
                    <el-input type="password" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="确认新密码" prop="checkPass">
                    <el-input type="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">提交</el-button>
                    <el-button>重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {},
    methods: {}
};
</script>

<style lang="scss">
@import '@/css/common.scss';
</style>
