// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
const TEST_CONFIG = {
    id: 'demo',
    title: "共享单车",
    appkey: "59193f59f1ae5ffe367131ba",
    baseUrl: 'http://bike.yunba.io:7001',
    uploadUrl: 'https://abj-elogic-test1.yunba.io:4145/file',
    uploadBaseUrl: 'https://abj-elogic-test1.yunba.io:4145',
    ybServerUrl: 'http://abj-rest-test1.yunba.io:5555'
};
try {
    window.APP_CONFIG = JSON.parse(window.APP_CONFIG);
} catch(e) {
    window.APP_CONFIG = TEST_CONFIG;
}
window.APP_KEY = APP_CONFIG.appkey;
window.UPLOAD_URL= APP_CONFIG.uploadUrl;
window.UPLOAD_BASE_URL = APP_CONFIG.uploadBaseUrl;
window.BASE_URL = APP_CONFIG.baseUrl;
window.USER_CACHE_KEY = APP_CONFIG.id + '_ADMIN';

import Vue from 'vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';

import './assets/fontello/css/icons.css';

// import VueI18n from 'vue-i18n'
// Vue.use(VueI18n);
// import messages from './i18n';
// const i18n = new VueI18n({
//   locale: 'zh',
//   messages,
// });

import App from './App';
import LayoutMain from '@/components/common/layout-main';

import router from './router';
import axios from 'axios';

import BaiduMap from 'vue-baidu-map';

import VueHighcharts from 'vue-highcharts';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import util from './util.js';
window.util = util;

import CONST from './const.js';
window.CONST = CONST;

window.IS_LOGIN = !!localStorage.getItem(USER_CACHE_KEY);


// highchart
Vue.use(VueHighcharts);
Vue.prototype.Highcharts.setOptions({
    global: {
        useUTC: false
    }
});


// baidumap
Vue.use(BaiduMap, {
  ak: 'ojXdqa3s9abFTl9zIlZ1w8wIK8sYBj3b'
});

// moment
window.TIME_ZONE = 'Asia/Shanghai';
window.moment = require('moment-timezone');
Vue.filter('time-format', function(timestamp, format, timezone) {
  if (timestamp) {
    let pow = timestamp.toString().length - 13;
    timestamp = timestamp/Math.pow(10, pow);
    format = format || 'YYYY-MM-DD HH:mm:ss';
    timezone = timezone || TIME_ZONE;
    return moment(timestamp).tz(timezone).format(format);
  }
  return '';
});

Vue.filter('cent-to-yuan', function(cent) {
    if (parseFloat(cent)) {
        // 转为12位有效数字的指数记数法，再转为浮点数
        return (parseFloat((cent/100).toPrecision(12)));
    }
    return cent;
});

Vue.filter('accurate', function(val) {
  return util.accurateNumber(val);
});

// iview
Vue.use(iView);

const $http = axios.create({
  baseURL: BASE_URL
    // baseURL: 'http://' + location.hostname + ':7002'
    //baseURL: 'http://' + 'abj-elogic-test1.yunba.io' + ':7002'
});
// nprogress
// Add a request interceptor
$http.interceptors.request.use(function (config) {
  NProgress.start();
  const token = localStorage.getItem(USER_CACHE_KEY);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  //config.params = Object.assign({}, config.params, {appkey: '56a0a88c4407a3cd028ac2fe'});
  return config;
}, function (error) {
  console.error(error);
  return Promise.reject(error);
});

// Add a response interceptor
$http.interceptors.response.use(function (response) {
  NProgress.done();
  return response;
}, function (error) {
  return Promise.reject(error);
});
Vue.prototype.$http = $http;

Vue.config.productionTip = false;

/* eslint-disable no-new */
window.Vue = Vue;
Vue.component('yb-layout-main', LayoutMain);
window.vm = new Vue();
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
        App
    },
});
window.end_ = function(lock_id) {
    $http.get('/admin_api/force_end_session', {
        params: {
            'appkey': window.APP_KEY,
            'lock_id': lock_id
        }
    }).then(function(result) {
        console.log(result.data)
    }.bind(this));
}
