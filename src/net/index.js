import config from '@/config';
import store from '@/store';
import router from '@/router';
import message from 'element-ui/lib/message';
import notify from 'element-ui/lib/notification';
import { MessageBox, Loading } from 'element-ui';

import { GGXHttpClient } from 'ggx-http-client/dist/src/GGXHttpClient';

// 添加默认错误提示
export const HttpClient = GGXHttpClient.create()
    .provideGlobalParameters(() => {
        if (store.state.login.loginInfo.token) {
            return {
                token: store.state.login.loginInfo.token
            };
        }
        return {};
    })
    .setGlobalErrorHandler(e => {
        /*  message({
            type: 'error',
            message: '连接超时'
        }); */
    })
    .addCallbackFilter(response => {
        const code = response.code;
        const resp = response.data;
        if (!resp) {
            return true;
        }
        if (code === 0) {
            notify.error({
                title: '连接超时',
                duration: 3000
            });
            return false;
        }
        if (code === 500) {
            message({
                type: 'error',
                message: resp.message
            });
        }
        // 添加登录失效处理器
        if (!resp.success) {
            if (resp.code === 'LOGIN_EXPIRED') {
                MessageBox.alert(resp.message, {
                    confirmButtonText: '确定',
                    callback: action => {
                        store.commit('login/logout');
                        router.push('/login');
                    }
                });
            } else if (resp.code === 'PERMISSION_DENIED403') {
                MessageBox.alert(resp.message, {
                    confirmButtonText: '确定',
                    callback: action => {}
                });
            }

            return false;
        }
        return true;
    })
    .setServerUrl(config.serverUrl);
