<template>
    <div
        class="quick-file-service-single-image-upload"
        :style="{ width: width + 'px', height: height + 'px' }"
    >
        <el-upload
            v-loading="loading"
            class="image-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :data="uploadData"
            list-type="picture"
            name="uploadFile"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :on-preview="handlePreview"
        >
            <img v-if="currentUrl" :src="currentUrl" class="image" />
            <img
                v-else-if="currentFilename"
                :src="filesFetchPrefix + currentFilename"
                class="image"
            />
            <img
                v-else-if="currentFileUrl"
                :src="currentFileUrl"
                class="image"
            />
            <i v-else class="el-icon-plus image-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
import GlobalConfig from '@/config';
const defaultUploadData = {
    policy: '',
    signature: '',
    key: '',
    ossAccessKeyId: '',
    host: ''
};
export default {
    props: {
        onUploadSuccess: Function,
        currentFilename: String,
        currentFileUrl: String,
        width: {
            type: Number,
            default: 80
        },
        height: {
            type: Number,
            default: 80
        }
    },
    data() {
        return {
            loading: false,
            uploadData: { ...defaultUploadData },
            uploadUrl: GlobalConfig.quickFileServiceUrl + '/files/upload/file',
            fileUrl: null,
            currentUrl: null,
            uploadSuccess: false,
            filesFetchPrefix: GlobalConfig.quickFilesFetchUrl + '/'
        };
    },
    computed: {},
    mounted() {
        this.currentUrl = null;
    },
    destroyed() {},
    methods: {
        handleRemove(file, fileList) {
            this.emitInput('');
        },
        handlePreview(file) {
            this.dialogVisible = true;
        },
        beforeUpload(file) {
            this.loading = true;
        },
        handleUploadSuccess(res, file) {
            this.loading = false;
            if (!res.success) {
                this.$message.error(res.message);
                return;
            }
            this.fileUrl =
                GlobalConfig.quickFilesFetchUrl + '/' + res.data.filename;
            this.uploadSuccess = true;
            this.currentUrl = this.fileUrl;
            this.onUploadSuccess &&
                this.onUploadSuccess(res.data.filename, this.fileUrl);
        },
        handleUploadError(e) {
            this.loading = false;
        },
        reset() {
            this.uploadData = { ...defaultUploadData };
            this.fileUrl = null;
            this.currentUrl = null;
            this.uploadSuccess = false;
        }
    }
};
</script>

<style scoped lang="scss">
@import '@/css/common.scss';
.quick-file-service-single-image-upload {
    border: 1px dashed #ccc;
    .image-uploader {
        width: 100%;
        height: 100%;
        display: flex;
        .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .el-upload:hover {
            border-color: #409eff;
        }

        .image-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            object-fit: contain;
            width: 80px;
            height: 80px;
            line-height: 80px;
            text-align: center;
        }

        .image {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: contain;
        }
    }
}
</style>
