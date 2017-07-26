<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-left{
        width: 200px;
        overflow-x: hidden;
        background: #464c5b;
    }
    .layout-left .layout-text {
        margin-left: 5px;
    }
    .layout-right {
        flex: 1;
        overflow-x: hidden;
    }
    .layout-header{
        height: 60px;
        line-height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 200px;
        height: 60px;
        margin: 0px auto;
        text-indent: 23px;
        line-height: 60px;
        background: #fff;
        overflow: hidden;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-hide-text .layout-left {
        width: 57px;
    }
    .layout-hide-text .layout-text{
        display: none;
    }
    .layout-logo-left .short {
        position: relative;
        top: 19px;
        left: 12px;
        display: none;
    }
    .layout-logo-left .long {
        display: block;
    }
    .layout-hide-text .short {
        display: block;
    }
    .layout-hide-text .long {
        display: none;
    }
    .layout-logo-left,
    .ivu-col{
        transition: width .2s ease-in-out;
    }
    .user-info {
        height: 60px;
        display: inline-block;
        margin-right: 30px;
        float: right;
    }
    .user-info .name {
        text-align: right;
        font-size: 14px;
        line-height: 60px;
        color: #30b5f0;
    }
    .user-info .name i {
        margin-left: 10px;
    }

    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), 
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):hover, 
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu), 
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu):hover {
        background: #30b5f0;
        color: #fff;
        border-right: none;
    }
    .layout-hide-text .ivu-menu-item,
    .layout-hide-text .layout-logo-left{
        width: 57px;
    }
    .ivu-menu-item {
        height: 58px;
        padding: 18px;
        white-space: nowrap;
    }

    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item, 
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title{
        border-bottom: 1px solid #58566b;
    }
</style>
<template>
    <div class="layout" :class="{'layout-hide-text': isHideMenu}">
        <Row type="flex">
            <i-col class="layout-left">
                <Menu :active-name="activeName" theme="dark" width="auto">
                    <div class="layout-logo-left">
                        <router-link to="/">
                            <span class="long">共享单车</span>
                            <img class="short" src="../assets/topbar/gd_icon_bike.png" />
                        </router-link>
                    </div>
                    <router-link to="/">
                        <Menu-item name="dashboard">
<!--                             <Icon type="android-color-palette" :size="iconSize"></Icon> -->
                            <yb-icon name="dashboard"></yb-icon>
                            <span class="layout-text">系统总览</span>
                        </Menu-item>
                    </router-link>
                    <router-link to="/bike">
                        <Menu-item name="bikeList">
                            <!-- <Icon type="android-bicycle" :size="iconSize"></Icon> -->
                            <yb-icon name="bike"></yb-icon>
                            <span class="layout-text">单车</span>
                        </Menu-item>
                    </router-link>
                    <!--
                    <router-link to="/breakdown-bike?status=1,2,3">
                        <Menu-item name="breakdownBikeList">
                            <Icon type="android-bicycle" :size="iconSize"></Icon>
                            <yb-icon name="broken"></yb-icon>
                            <span class="layout-text">故障单车</span>
                        </Menu-item>
                    </router-link> 
                    -->
                    <router-link to="/user">
                        <Menu-item name="userList">
                            <!-- <Icon type="person-stalker" :size="iconSize"></Icon> -->
                            <yb-icon name="user"></yb-icon>
                            <span class="layout-text">用户</span>
                        </Menu-item>
                    </router-link>
                    <router-link to="/journey-not-finished">
                        <Menu-item name="journeyNotFinishedList">
                            <!-- <Icon type="android-map" :size="iconSize"></Icon> -->
                            <yb-icon name="journey"></yb-icon>
                            <span class="layout-text">正在进行的行程</span>
                        </Menu-item>
                    </router-link>
                    <router-link to="/journey">
                        <Menu-item name="journeyList">
                            <!-- <Icon type="android-map" :size="iconSize"></Icon> -->
                            <yb-icon name="journey"></yb-icon>
                            <span class="layout-text">历史行程</span>
                        </Menu-item>
                    </router-link>
                    <!-- <router-link to="/deposit">
                        <Menu-item name="depositList">
                            <yb-icon name="cash-pledge"></yb-icon>
                            <span class="layout-text">押金</span>
                        </Menu-item>
                    </router-link>
                    <router-link to="/balance_log">
                        <Menu-item name="balanceLogList">
                            <yb-icon name="finance"></yb-icon>
                            <span class="layout-text">财务</span>
                        </Menu-item>
                    </router-link> -->
                    <router-link to="/pay_log">
                        <Menu-item name="payLogList">
                            <!-- <Icon type="social-yen" :size="iconSize"></Icon> -->
                            <yb-icon name="pay"></yb-icon>
                            <span class="layout-text">充值消费</span>
                        </Menu-item>
                    </router-link>
                    <router-link to="/credit">
                        <Menu-item name="creditList">
                            <!-- <Icon type="ios-navigate" :size="iconSize"></Icon> -->
                            <yb-icon name="credit"></yb-icon>
                            <span class="layout-text">信用管理</span>
                        </Menu-item>
                    </router-link>
                    <router-link to="/message">
                        <Menu-item name="messageList">
                            <!-- <Icon type="ios-navigate" :size="iconSize"></Icon> -->
                            <yb-icon name="advertisement"></yb-icon>
                            <span class="layout-text">广告消息</span>
                        </Menu-item>
                    </router-link>
                    <router-link to="/redpacket">
                        <Menu-item name="redpacketList">
                            <!-- <Icon type="ios-navigate" :size="iconSize"></Icon> -->
                            <yb-icon name="redpacket"></yb-icon>
                            <span class="layout-text">红包管理</span>
                        </Menu-item>
                    </router-link>
                    <router-link to="/article">
                        <Menu-item name="articleList">
                            <!-- <Icon type="ios-navigate" :size="iconSize"></Icon> -->
                            <yb-icon name="content"></yb-icon>
                            <span class="layout-text">内容管理</span>
                        </Menu-item>
                    </router-link>
                    <router-link to="/custom_service">
                        <Menu-item name="customServiceList">
                            <!-- <Icon type="ios-navigate" :size="iconSize"></Icon> -->
                            <yb-icon name="customer-service"></yb-icon>
                            <span class="layout-text">客户服务</span>
                        </Menu-item>
                    </router-link>
                    <router-link to="/area" v-if="hasAccess('post@/admin_api/area')">
                        <Menu-item name="areaList">
                            <!-- <Icon type="ios-navigate" :size="iconSize"></Icon> -->
                            <yb-icon name="area"></yb-icon>
                            <span class="layout-text">区域管理</span>
                        </Menu-item>
                    </router-link>
                    <router-link to="/admin" v-if="hasAccess('post@/admin_api/admin')">
                        <Menu-item name="adminList">
                            <!-- <Icon type="ios-navigate" :size="iconSize"></Icon> -->
                            <yb-icon name="user"></yb-icon>
                            <span class="layout-text">子账号管理</span>
                        </Menu-item>
                    </router-link>
                    <router-link to="/equipment" v-if="hasAccess('post@/admin_api/admin')">
                        <Menu-item name="equipment">
                            <!-- <Icon type="ios-navigate" :size="iconSize"></Icon> -->
                            <yb-icon name="equipment"></yb-icon>
                            <span class="layout-text">设备管理</span>
                        </Menu-item>
                    </router-link>
                    <router-link to="/config" v-if="hasAccess('post@/admin_api/admin')">
                        <Menu-item name="config">
                            <Icon type="gear-a" :size="iconSize"></Icon>
                            <span class="layout-text">设置</span>
                        </Menu-item>
                    </router-link>
                </Menu>
            </i-col>
            <i-col class="layout-right">
                <div class="layout-header" ref="header">
                    <i-button type="text" @click="toggleLeftBar">
                        <Icon type="navicon" size="32"></Icon>
                    </i-button>
                    <div v-if="userInfo" class="user-info">
                        <Dropdown placement="bottom-end">
                            <a class="name" href="javascript:void(0)">
                                {{userInfo.name}}
                                <Icon type="arrow-down-b"></Icon>
                            </a>
                            <Dropdown-menu slot="list">
                                <router-link to="/logout">
                                    <Dropdown-item name="logout">
                                        退出登录
                                    </Dropdown-item>
                                </router-link>
                            </Dropdown-menu>
                        </Dropdown>
                    </div>
                </div>
<!--                 <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb-item href="#">首页</Breadcrumb-item>
                        <Breadcrumb-item href="#">应用中心</Breadcrumb-item>
                        <Breadcrumb-item>某应用</Breadcrumb-item>
                    </Breadcrumb>
                </div> -->
                <div v-if="$route.name!='dashboard'" class="layout-content" ref="content">
                    <div class="layout-content-main">
                        <router-view></router-view>
                    </div>
                </div>
                <template v-else>
                    <router-view></router-view>
                </template>
            </i-col>
        </Row>
    </div>
</template>
<script type="text/javascript">
import icon from '@/components/common/icon';
export default {
    data () {
        return {
            userInfo: null,
            isHideMenu: localStorage.getItem('isHideMenu') == "true"
        }
    },
    computed: {
        activeName() {
            return this.$route.name;
        },
        iconSize () {
            return this.isHideMenu === 4 ? 14 : 24;
        }
    },
    methods: {
        toggleLeftBar () {
            this.isHideMenu = !this.isHideMenu;
            localStorage.setItem('isHideMenu', this.isHideMenu);
            setTimeout(function() {
                window.dispatchEvent(new Event('resize'));
            }, 1000);
        },
        fetchData() {
            this.$http({
                url: '/admin_api/info'
            }).then(function(result) {
                this.userInfo = result.data;
            }.bind(this));
        },
        hasAccess(id) {
            const userInfo = this.userInfo;
            return userInfo && (userInfo.access === 'all' || userInfo.access.indexOf(id) > -1);
        }
    },
    created() {
      this.fetchData();
    },
    mounted() {
        function setHeight() {
            const $el = this.$el;
            var w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                windowWidth = w.innerWidth || e.clientWidth || g.clientWidth,
                windowHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;
            const menuEl = $el.getElementsByClassName('layout-left')[0];
            menuEl.style['min-height'] = windowHeight - menuEl.offsetTop + 'px';

        }
        window.addEventListener('resize', setHeight.bind(this));
        setHeight.call(this);
    },
    components: { 
        'yb-icon': icon
    }
}
</script>
