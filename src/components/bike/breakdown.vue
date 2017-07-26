<template>
    <yb-layout-main>
        <span slot="title">单车管理</span>
        <!-- filter -->
        <Form slot="filter" class="filter-form" ref="filterForm" :model="filter"  inline>
            <Form-item class="select order-by" label="" :label-width="0" style="width:200px">
              <Select  v-model="filter._type" placeholder="请选择">
                  <Option value="area_id">按区域查询</Option>
                  <Option value="last_heartbeat_time">按最后一次活跃时间查询</Option>
                  <Option value="last_used_time">按最后一次骑行时间查询</Option>
                  <Option value="put_into_time">按投放时间查询</Option>
                  <Option value="lock_uid">按编号查询</Option>
                  <Option value="total_income">按骑行消费额度查询</Option>
                  <Option value="total_used_duration">按累计骑行时间查询</Option>
                  <Option value="battery">按电量查询</Option>
              </Select>
            </Form-item>

            <Form-item :label-width="0" v-if="filter._type == 'area_id'">
                <Select v-model="filter.area_id" placeholder="请选择区域">
                    <i-option v-for="item in areaData" :value="item.id" :key="item.id">{{item.name}}</i-option>
                </Select>
            </Form-item>



            <Form-item label="" :label-width="0" v-if="filter._type == 'lock_uid'">
                <Row>
                    <Col span="11">
                        <Input v-model="filter.lock_uid_gte">
                            <span slot="prepend">开始编号</span>
                        </Input>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <Input v-model="filter.lock_uid_lte">
                            <span slot="prepend">结束编号</span>
                        </Input>
                    </Col>
                </Row>
            </Form-item>


            <Form-item label="" :label-width="0" v-if="filter._type == 'total_income'">
                <Row>
                    <Col span="11">
                        <Input v-model="filter.total_income_gte">
                            <span slot="prepend">￥</span>
                        </Input>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <Input v-model="filter.total_income_lte">
                            <span slot="prepend">￥</span>
                        </Input>
                    </Col>
                </Row>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'total_used_duration'">
                <Row>
                    <Col span="11">
                        <Input v-model="filter.total_used_duration_gte">
                            <span slot="append">分钟</span>
                        </Input>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <Input v-model="filter.total_used_duration_lte">
                            <span slot="append">分钟</span>
                        </Input>
                    </Col>
                </Row>
            </Form-item>


            <Form-item label="" :label-width="0" v-if="filter._type == 'battery'">
                <Row>
                    <Col span="11">
                        <Input v-model="filter.battery_gte">
                        </Input>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <Input v-model="filter.battery_lte">
                        </Input>
                    </Col>
                </Row>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'put_into_time'">
                <Date-picker type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 250px" v-model="filter.put_into_time"></Date-picker>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'last_heartbeat_time'">
                <Date-picker type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 250px" v-model="filter.last_heartbeat_time"></Date-picker>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'last_used_time'">
                <Date-picker type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 250px" v-model="filter.last_used_time"></Date-picker>
            </Form-item>



            <Form-item>
                <Button type="primary" @click="handleFilter">
                    <Icon type="search"></Icon>
                    查询
                </Button>
                <Button type="primary" @click="clearFilter">
                    <Icon type="android-refresh"></Icon>
                    清除
                </Button>
            </Form-item>


            <Form-item style="float: right">
                <Button-group>
                    <Button @click="viewType = 'list'" :type="viewType == 'list' ? undefined : 'ghost' ">
                        <Icon type="ios-list-outline"></Icon>
                        列表
                    </Button>
                    <Button @click="viewType = 'map'" :type="viewType == 'map' ? undefined : 'ghost'">
                        <Icon type="location"></Icon>
                        地图
                    </Button>
                </Button-group>
            </Form-item>

        </Form>

        <div slot="main" class="bike-main" >

            <div class="bike-list-table" v-bind:style="{display: viewType == 'list' ? 'block': 'none'}">
                <div v-if="!items">
                    <Spin size="large" fix></Spin>
                </div>
                <div v-else-if="items.length > 0">
                    <Table bordered :context="self" :columns="columns" :data="items" @on-sort-change="sortChange" :row-class-name="rowClassName">
                    </Table>
                </div>
                <div v-else>
                    没有数据
                </div>
            </div>


            <div class="bike-map" v-bind:style="{height: viewType == 'map' ? 'auto': '0px', overflow: 'hidden'}">
                <baidu-map
                    ref="map"
                    :center="bdMap.center"
                    :zoom="16"
                    :scroll-wheel-zoom="true"
                    :mapClick="false"
                    @ready="baiduMapReady"
                    v-bind:style="{width: bdMap.size.width, height: bdMap.size.height}"
                    >
                    <bm-info-window :position="bdMap.infoWindow.position" :show="bdMap.infoWindow.isOpen" :closeOnClick="true" :offset="bdMap.infoWindow.offset">
                      <div v-html="bdMap.infoWindow.content"></div>
                      <button @click="showTrack">查看最近轨迹</button>
                    </bm-info-window>
                    <bm-polyline :path="polylinePath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="false"></bm-polyline>
                    <bm-marker v-for="(item, index) in items" :key="item._id" :position="{
                            lat: item.latitude,
                            lng: item.longtitude
                        }" :dragging="false" @mouseover="handleMouseoverBikeInMap(index)"></bm-marker>

                    <!-- v for tracks -->

                </baidu-map>
            </div>
            <div v-if="items && items.length > 0">
                <pagination @page-info-change="this.fetchData" :total="pagination.rows.total" :current="pagination.pages.current_page" :page-size="pagination.pages.rows_per_page"></pagination>
            </div>
        </div>
    </yb-layout-main>

</template>

<script>
export default {
    data() {
        return {
            self: this,
            layout:{
                listSpan: 5,
                mapSpan: 17
            },
            activeItemIndex:0,
            listType: 'item',// items, track
            items: null,
            tracks:[],
            bdMap: {
                size: {
                    width: '100%',
                    height: '500px'
                },
                center: {
                    lat: 22.542955,
                    lng: 114.059688
                },
                infoWindow: {
                    itemIndex: 0,
                    isOpen: false,
                    content: '',
                    position:{
                        lat: 22.542955,
                        lng: 114.059688
                    },
                    offset: {
                      width: 0,
                      height: -25
                    }
                }
            },
            filter: {
                _type: 'area_id',
                area_id: '',
                last_heartbeat_time: [],
                last_used_time: [],
                put_into_time: [],
                lock_uid_gte: '',
                lock_uid_lte: '',
                total_used_gte: '',
                total_used_lte: '',
                total_income_gte: '',
                total_income_lte: '',
                total_used_duration_gte: '',
                total_used_duration_lte: '',
                battery_gte: '',
                battery_lte: '',
                order_by: 'put_into_time',
                order_type: 'desc'
            },
            pagination: {
            },
            columns: [
                {
                    title: '编号',
                    key: 'bike_id'
                },
                {
                    title: '车身状态',
                    key: 'status',
                    render (row, column, index) {
                        return ['正常', '故障', '低电量', '故障且低电量'][row.status];
                    },
                    className: 'status'
                },
                {
                    title: '可用状态',
                    key: 'availability',
                    render (row, column, index) {
                        return ['','空闲', '被预约', '被使用中', '其他'][row.availability];
                    },
                },
                {
                    title: '电量',
                    key: 'battery',
                    sortable: 'custom',
                    render (row) {
                        return row.battery + '%';
                    },
                },
                {
                    title: '使用次数',
                    key: 'total_used',
                    sortable: 'custom'
                },
                {
                    title: '累计金额',
                    key: 'total_income',
                    sortable: 'custom',
                    render(row) {
                        return util.accurateNumber(row.total_income/100);
                    }
                },
                {
                    title: '累计时间',
                    key: 'total_used_duration',
                    sortable: 'custom',
                    render(row) {
                        return parseInt(row.total_used_duration/60) + '分钟';
                    }
                },
                {
                    title: '上次活跃',
                    key: 'last_heartbeat_time',
                    render (row) {
                        return Vue.filter('time-format')(row.last_used_time);
                    }
                },
                {
                    title: '上次使用',
                    key: 'last_used_time',
                    render (row) {
                        return Vue.filter('time-format')(row.last_used_time);
                    }
                },
                {
                    title: '区域',
                    key: 'area_id',
                    render(row) {
                        return `<span>{{areaIndexed[${row.area_id}]}}</span>`
                    }
                },
                {
                    title: '地图',
                    key: 'action',
                    render (row, column, index) {
                        return `<a href="#" @click.prevent="showInMap(${index})">查看</a>`;
                    }
                }
            ],
            viewType: 'list',
            areaData: [],
            areaIndexed: {}
        }
    },
    computed: {
        polylinePath() {
            const tracks = this.tracks || [];
            const path = [];
            tracks.forEach(function(track) {
                track.trail.forEach(function(point){
                    path.push({
                        lat: point.lat,
                        lng: point.lng
                    });
                });
            });
            console.log(JSON.stringify(path));
            return path;
        }
    },
    methods:{
        rowClassName(row, index) {
            if (row.status > 0) {
                return 'breakdown';
            }
        },
        fetchTrackDataYunba() {
            const server = this.$route.query.server || ''
            const item = this.items[this.bdMap.infoWindow.itemIndex];
            this.$http.get(`${server}/bike_history_ride`, {
                params:{
                    uid: item.name,
                    from: 0,
                    to: Date.now()
                }
            }).then(function(result) {
                if(result.data.status == 0) {
                    this.tracks = result.data.history.map(function(item) {
                        let trail = item.track.map(function(t) {
                            return {
                                loc:[t.lat, t.long]
                            }
                        });
                        return {
                            trail: trail
                        }
                    });
                } else {
                    this.$Message.error('数据请求失败');
                }
            }.bind(this));
        },
        fetchData() {
            const $route = this.$route;
            this.$http.get('/admin_api/bike', {
                params:this.$route.query
            }).then(function(result) {
                const items = result.data.items;
                this.bdMap.infoWindow.isOpen=false;
                this.items = items;
                if (items.length > 0) {
                    this.center = {
                        lat:items[0].latitude,
                        lng: items[0].longtitude
                    }
                }
                this.pagination = result.data.pagination;
            }.bind(this));
        },
        sortChange(options) {
            const {key: order_by, order: order_type} = options;
            const {$router, $route} = this;
            const query = Object.assign({}, $route.query);
            if (order_type == 'normal') {
                delete query.order_by;
                delete query.order_type;
            } else {
                query.order_by = order_by;
                query.order_type = order_type;
            }
            $router.push({
                path: $route.path,
                params: $route.params,
                query: query
            });
            this.fetchData();
        },
        clearFilter() {
            const filter = {
                _type: 'area_id',
                last_heartbeat_time: [],
                last_used_time: [],
                create_at: [],
                lock_uid_gte: '',
                lock_uid_lte: '',
                total_used_gte: '',
                total_used_lte: '',
                total_income_gte: '',
                total_income_lte: '',
                total_used_duration_gte: '',
                total_used_duration_lte: '',
                battery_gte: '',
                battery_lte: '',
                order_by: 'put_into_time',
                order_type: 'desc'
            };
            this.filter = {...filter};
            const { $router, $route } = this;
            $router.push({
                path: $route.path,
                params: $route.params
            });
            this.fetchData();
        },
        handleFilter() {
            const filter = this.filter;
            const {$router, $route} = this;
            const {
                _type, 
                area_id, 
                last_heartbeat_time,
                last_used_time,
                put_into_time,
                lock_uid_gte, 
                lock_uid_lte,
                total_used_gte,
                total_used_lte,
                total_income_gte,
                total_income_lte,
                total_used_duration_gte,
                total_used_duration_lte,
                battery_gte,
                battery_lte
            } = filter;
            const query = {};

            // order
            if (filter.order_by == 'none') {
                delete query.order_by;
                delete query.order_type;
            } else {
                query.order_by = filter.order_by;
                query.order_type = filter.order_type;
            }

            function date2Second(d) {
                return parseInt(+new Date(d)/1000);
            }
            switch(_type) {
                case 'area_id':
                    if (area_id) {
                        query.area_id = area_id;
                    }
                    break;
                case 'last_heartbeat_time': 
                    if (last_heartbeat_time[0] && last_heartbeat_time[1]) {
                        query.last_heartbeat_time_gte = date2Second(last_heartbeat_time[0]);
                        query.last_heartbeat_time_lte = date2Second(last_heartbeat_time[1]);
                    }
                    break;
                case 'last_used_time': 
                    if (last_used_time[0] && last_used_time[1]) {
                        query.last_used_time_gte = date2Second(last_used_time[0]);
                        query.last_used_time_lte = date2Second(last_used_time[1]);
                    }
                    break;
                case 'put_into_time': 
                    if (put_into_time[0] && put_into_time[1]) {
                        query.put_into_time_gte = date2Second(put_into_time[0]);
                        query.put_into_time_lte = date2Second(put_into_time[1]);
                    }
                    break;
                case 'lock_uid':
                    if (lock_uid_gte !== "") {
                        query.lock_uid_gte = lock_uid_gte;
                    }
                    if (lock_uid_lte !== "") {
                        query.lock_uid_lte = lock_uid_lte
                    }
                    break;
                
                case 'total_used':
                    if (total_used_gte !== "") {
                        query.total_used_gte = total_used_gte;
                    }
                    if (total_used_lte !== "") {
                        query.total_used_lte = total_used_lte
                    }
                    break;

                case 'total_income':
                    if (total_income_gte !== "") {
                        query.total_income_gte = total_income_gte * 100;
                    }
                    if (total_income_lte !== "") {
                        query.total_income_lte = total_income_lte * 100
                    }
                    break;

                case 'total_used_duration':
                    if (total_used_duration_gte !== "") {
                        query.total_used_duration_gte = total_used_duration_gte * 60;
                    }
                    if (total_used_duration_lte !== "") {
                        query.total_used_duration_lte = total_used_duration_lte * 60
                    }
                    break;

                case 'battery':
                    if (battery_gte !== "") {
                        query.battery_gte = battery_gte;
                    }
                    if (battery_lte !== "") {
                        query.battery_lte = battery_lte
                    }
                    break;

            }

            $router.push({
                path: $route.path,
                params: $route.params,
                query: query
            });
            this.fetchData();
        },
        baiduMapReady({BMap, map}) {
            this.fetchData();
        },
        showTrack() {
            // return this.fetchTrackDataYunba();
            const item = this.items[this.bdMap.infoWindow.itemIndex];
            this.$http.get(`/admin_api/bike/${item.lock_uid}/journey`, {
            }).then(function(result) {
                this.tracks = result.data.items;
            }.bind(this));
        },
        showInfoWindow(index) {
            const item = this.items[index];
            this.bdMap.infoWindow.isOpen = false;
            const availabilityText = ['','空闲', '被预约', '被使用中', '其他'];
            this.$nextTick(function(){
                Object.assign(this.bdMap.infoWindow, {
                    itemIndex: index,
                    isOpen: true,
                    position: {
                        lat: item.latitude,
                        lng: item.longtitude
                    },
                    content: `
                        编号: ${item.lock_uid}<br />
                        可用状态: ${availabilityText[item.availability]}<br />
                        电量: ${item.battery}%
                    `
                });
            }.bind(this));

        },
        showInMap(index) {
            this.viewType = 'map';
            window.setTimeout(function() {
                this.activeItemIndex = index;
                const item = this.items[index];
                this.bdMap.center = {
                    lat: item.latitude,
                    lng: item.longtitude
                }
                this.showInfoWindow(index);
            }.bind(this), 200);
        },
        showActiveBikeInList() {
            // this.$nextTick(function() {
            //     const $el = this.$el;
            //     const bikeListEl = $el.querySelector('.bike-list ul');
            //     const activeEl = $el.querySelector('.bike-list .active');
            //     bikeListEl.scrollTop = activeEl.offsetTop - bikeListEl.offsetTop;
            // }.bind(this));
        },
        handleClickBikeInList(index) {
            this.activeItemIndex = index;
            const item = this.items[index];
            this.bdMap.center = {
                lat: item.latitude,
                lng: item.longtitude
            }
            this.showInfoWindow(index);
        },
        handleMouseoverBikeInMap(index) {
            this.activeItemIndex = index;
            this.showInfoWindow(index);
            this.showActiveBikeInList();
        },
        setBdMapSize() {
            var w = window,
                    d = document,
                    e = d.documentElement,
                    g = d.getElementsByTagName('body')[0],
                    windowWidth = w.innerWidth || e.clientWidth || g.clientWidth,
                    windowHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;
            const bdMap = this.bdMap;
            const bikeMapEl = this.$el.getElementsByClassName('bike-map')[0];
            const marginBottom = 150;
            bdMap.display = 'block';
            bdMap.size.width = '100%';
            bdMap.size.height = windowHeight - bikeMapEl.offsetTop - marginBottom + 'px';
        }
    },
    created() {
        const {switchStatus, status, order_by, order_type} = this.$route.query;
        this.filter.switchStatus = switchStatus !== undefined ? Number(switchStatus) : -1;
        this.filter.status = status !== undefined ? Number(status) : -1;
        if (order_type) {
            this.filter.order_type = order_type
        }
        if (order_by) {
            this.filter.order_by = order_by;
        }


        this.$http({
            url: '/admin_api/area'
        }).then(function(result) {
            this.areaData = result.data.items;
            const areaIndexed = {};
            this.areaData.forEach(function(item) {
                areaIndexed[item.id]=item.name;
            });
            this.areaIndexed = areaIndexed;
        }.bind(this));
    },
    mounted() {
        this.$nextTick(this.setBdMapSize.bind(this));
        window.addEventListener('resize', this.setBdMapSize.bind(this));
    }
}
</script>

<style scroped>
    .ivu-switch-disabled.ivu-switch-checked {
        border-color: #39f;
        background-color: #39f;
    }
    .ivu-switch-disabled.ivu-switch-checked .ivu-switch-inner {
        color: #fff
    }
    .ivu-switch-disabled.ivu-switch-checked:after {
        background: #fff
    }
    .select {
        width: 220px;
    }
    .select-area {
        width: 200px;
    }
    .order-by {
        width: 250px;
    }
    .bike-main {
        width: 100%;
        margin: 0 auto;
        position: relative;
    }
    .bike-map {
        position: relative;
    }
    .bike-list-table {
        position: relative;
    }
    .bike-list {
        position: absolute;
        top: 0;
        background: #fff;
        opacity: 1;
        transition: opacity .5s ease-in-out;
        width: 200px;
    }
    .bike-list ul{
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .bike-list .active {
        border-left: red 2px solid;
    }
    .bike-list:hover {
        opacity: 1;
        transition: opacity .5s ease-in-out;
    }
    .bike-list li{
        border-bottom: 1px solid #efefef;
    }
    .pagination {
        position: relative;
    }
    .pagination .ivu-select-dropdown {
        top: -176px !important;
    }
    .ivu-table .breakdown .status{
        color: #f90;
    }
</style>
