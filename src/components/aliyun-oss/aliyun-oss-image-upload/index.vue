<template>
    <div
        class="aliyun-oss-image-upload-plugin"
        :style="{ width: width + 'px', height: height + 'px' }"
    >
        <el-upload
            class="image-uploader"
            ref="elupload"
            :action="uploadData.host"
            :show-file-list="false"
            :data="uploadData"
            list-type="picture"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :on-success="handleUploadSuccess"
            :on-preview="handlePreview"
        >
            <template v-if="showImage">
                <img v-if="currentUrl" :src="currentUrl" class="image" />
                <img
                    v-else-if="currentFileUrl"
                    :src="currentFileUrl"
                    class="image"
                />
                <i v-else class="el-icon-plus image-uploader-icon"></i>
            </template>
        </el-upload>
    </div>
</template>

<script>
import { HttpClient } from '@/net';
import GlobalConfig from '@/config';
const defaultUploadData = {
    policy: '',
    signature: '',
    key: '',
    ossAccessKeyId: '',
    host: ''
};
export default {
    name: 'aliyun-oss-image-upload',
    props: {
        'on-upload-success': Function,
        'current-file-url': String,
        width: {
            type: Number,
            default: 80
        },
        height: {
            type: Number,
            default: 80
        },
        showImage: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            uploadData: { ...defaultUploadData },
            fileUrl: null,
            currentUrl: null,
            uploadSuccess: false
        };
    },
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
            return new Promise((resolve, reject) => {
                // 前后端提交post异步请求获取签名信息
                HttpClient.get(GlobalConfig.fileServerUrl + '/aliyun/oss/sign')
                    .then(resp => {
                        const data = resp.data.data;
                        this.uploadData.policy = data.policy;
                        this.uploadData.signature = data.signature;
                        this.uploadData.ossAccessKeyId = data.ossAccessKeyId;
                        this.uploadData.key = data.key;
                        this.uploadData.host = data.host;
                        this.fileUrl = data.host + '/' + data.key;
                        resolve(true);
                    })
                    .catch(e => {
                        reject(new Error('Get oss signature fail!'));
                    });
            });
        },
        handleUploadSuccess(res, file) {
            this.uploadSuccess = true;
            this.currentUrl = this.fileUrl;
            this.onUploadSuccess && this.onUploadSuccess(this.fileUrl);
        },
        reset() {
            this.uploadData = { ...defaultUploadData };
            this.fileUrl = null;
            this.currentUrl = null;
            this.uploadSuccess = false;
        },
        triggerFileSelector() {
            this.$refs.elupload.$children[0].$refs.input.click();
        }
    }
};
</script>

<style scoped lang="scss">
@import '@/css/common.scss';
.aliyun-oss-image-upload-plugin {
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
