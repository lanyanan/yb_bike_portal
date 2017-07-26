import Vue from 'vue';
import Router from 'vue-router';
// views
import main from '@/views/main';
import login from '@/views/login';

// components
import dashboard from '@/components/dashboard';
import bikeList from '@/components/bike/list';
import bikeDetail from '@/components/bike/detail';
import bikeEdit from '@/components/bike/edit';
// import breakdownBikeList from '@/components/bike/breakdown';

import userList from '@/components/user/list';
import userDetail from '@/components/user/detail';

import journeyList from '@/components/journey/list';
import journeyDetail from '@/components/journey/detail';

import journeyNotFinishedList from '@/components/journeyNotFinished/list';

import balanceLogList from '@/components/balanceLog/list';

import payLogList from '@/components/payLog/list';

import depositList from '@/components/deposit/list';

import customServiceList from '@/components/customService/list';

import adminList from '@/components/admin/list';
import adminUpsert from '@/components/admin/upsert';

import areaList from '@/components/area/list';
import areaUpsert from '@/components/area/upsert';

import creditList from '@/components/credit/list';

import messageList from '@/components/message/list';
import messageUpsert from '@/components/message/upsert'


import articleList from '@/components/article/list';
import articleUpsert from '@/components/article/upsert';

import redpacketList from '@/components/redpacket/list';
import redpacketUpsert from '@/components/redpacket/upsert';

import equipmentList from '@/components/equipment/list';
import addImei from '@/components/equipment/addImei';
import lockManage from '@/components/equipment/lock';

import config from '@/components/config';

// common
import pagination from '@/components/common/pagination';
Vue.component('pagination', pagination);

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
      beforeEnter: (to, from, next) => {
        if (window.IS_LOGIN) {
            return next({path: '/'})
        }
        next();
      }
    },
    {
        path: '/logout',
        name: 'logout',
        component: login,
        beforeEnter: (to, from, next) => {
            window.IS_LOGIN = false;
            localStorage.removeItem(USER_CACHE_KEY);
            return next({path: '/login'});
        }
    },
    {
        path: '/',
        name: 'main',
        component: main,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: dashboard
            },
            {
                path: 'bike',
                name: 'bikeList',
                component: bikeList
            },
            // {
            //     path: 'breakdown-bike',
            //     name: 'breakdownBikeList',
            //     component: breakdownBikeList
            // },
            {
                path: 'bike/:id',
                name: 'bikeDetail',
                component: bikeDetail
            },
            {
                path: 'bike/:id/edit',
                name: 'bikeEdit',
                component: bikeEdit
            },

            {
                path: 'user',
                name: 'userList',
                component: userList
            },
            {
                path: 'user/:id',
                name: 'userDetail',
                component: userDetail
            },
            {
                path: 'journey',
                name: 'journeyList',
                component: journeyList
            },
            {
                path: 'journey/:id',
                name: 'journeyDetail',
                component: journeyDetail
            },
            {
                path: 'journey-not-finished',
                name: 'journeyNotFinishedList',
                component: journeyNotFinishedList
            },
            {
                path: 'balance_log',
                name: 'balanceLogList',
                component: balanceLogList
            },
            {
                path: 'deposit',
                name: 'depositList',
                component: depositList
            },
            {
                path: 'pay_log',
                name: 'payLogList',
                component: payLogList
            },
            {
                path: 'custom_service',
                name: 'customServiceList',
                component: customServiceList
            },
            {
                path: 'admin',
                name: 'adminList',
                component: adminList
            },
            {
                path: 'admin/upsert',
                name: 'adminUpsert',
                component: adminUpsert
            },
            {
                path: 'area',
                name: 'areaList',
                component: areaList
            },
            {
                path: 'area/create',
                name: 'areaList',
                component: areaUpsert
            }, {
                path: 'area/:id/edit',
                name: 'areaList',
                component: areaUpsert
            }, {
                path: 'message',
                name: 'messageList',
                component: messageList
            },{
                path: 'message/create',
                name: 'messageUpsert',
                component: messageUpsert
            }, {
                path: 'message/:id/edit',
                name: 'messageUpsert',
                component: messageUpsert
            },{
                path: 'credit',
                name: 'creditList',
                component: creditList
            }, {
                path: 'article',
                name: 'articleList',
                component: articleList
            }, {
                path: 'article/:id/edit',
                name: 'articleUpsert',
                component: articleUpsert
            }, {
                path: 'article/create',
                name: 'articleUpsert',
                component: articleUpsert
            }, {
                path: 'redpacket',
                name: 'redpacketList',
                component: redpacketList
            }, {
                path: 'redpacket/create',
                name: 'redpacketUpsert',
                component: redpacketUpsert
            }, {
                path: 'equipment',
                name: 'equipmentList',
                component: equipmentList
            }, {
                path: 'equipment/imei',
                name: 'addImei',
                component: addImei
            }, {
                path: 'equipment/lock',
                name: 'lockManage',
                component: lockManage
            }, {
                path: 'config',
                name: 'config',
                component: config
            }
        ],
        beforeEnter: (to, from ,next) =>{
            if (!window.IS_LOGIN) {
                return next({path: '/login'})
            }
            next();
        }
    }
  ],
});
