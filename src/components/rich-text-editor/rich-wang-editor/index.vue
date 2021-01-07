<template>
    <div class="rich-wang-editor" :style="{ width: width, height: height }">
        <div id="wang-editor"></div>
    </div>
</template>

<script>
import { HttpClient } from '@/net';
import GlobalConfig from '@/config';
import WangEditor from 'wangeditor';
export default {
    name: 'rich-wang-editor',
    components: {},
    props: {
        initContent: String,
        onChange: Function,
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '100%'
        }
    },
    data() {
        return {
            editor: null,
            content: null
        };
    },
    watch: {},
    mounted() {
        const editor = new WangEditor(`#wang-editor`);

        // 配置 onchange 回调函数，将数据同步到 vue 中
        editor.config.onchange = newHtml => {
            this.onChange && this.onChange(newHtml);
        };

        editor.config.customUploadImg = (resultFiles, insertImgFn) => {
            const file = resultFiles[0];
            let suffix = '';
            if (file.type) {
                suffix = '.' + file.type.split('/')[1];
            }
            // 前后端提交post异步请求获取签名信息
            HttpClient.get(GlobalConfig.fileServerUrl + '/aliyun/oss/sign', {
                suffix
            }).then(resp => {
                const data = resp.data.data;
                HttpClient.postFormData(
                    data.host,
                    { ...data, file: resultFiles[0] },
                    {
                        ignoreGolbalParams: true,
                        ignoreGolbalHeaders: true
                    }
                ).then(resp => {
                    insertImgFn(data.fileUrl);
                });
            });
        };

        // 创建编辑器
        editor.create();
        this.editor = editor;

        this.initContent && this.editor.txt.html(this.initContent);
    },
    destroyed() {
        // 调用销毁 API 对当前编辑器实例进行销毁
        this.editor.destroy();
        this.editor = null;
    },
    updated() {},
    methods: {
        setContent(html) {
            this.editor.txt.html(html);
        },
        getContent() {
            // 通过代码获取编辑器内容
            return this.editor.txt.html();
        },
        reset() {
            this.editor.txt.html('');
        }
    }
};
</script>

<style scoped lang="scss">
@import '@/css/common.scss';
.rich-wang-editor {
    width: 100%;
    height: 100%;
}
</style>
