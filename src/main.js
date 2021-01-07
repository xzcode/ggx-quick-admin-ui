import Vue from 'vue';
import app from './app.vue';
import router from './router';
import store from './store';
import './plugins/element';
import moment from 'moment';

Vue.config.productionTip = false;

Vue.use(require('vue-moment'));

// 定义全局时间戳过滤器
Vue.filter('datetime', function(value) {
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
});

Vue.filter('datetimeNotHour', function(value) {
    return moment(value).format('YYYY-MM-DD');
});

new Vue({
    router,
    store,
    moment,
    render: h => h(app)
}).$mount('#app');
