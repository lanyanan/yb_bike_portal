<template>
    <yb-layout-main>
        <span slot="title">历史行程</span>
    
        <Form slot="filter" class="filter-form" ref="filterForm" :model="filter"  inline>
            <Form-item class="select order-by" label="" :label-width="0" style="width:200px">
              <Select  v-model="filter._type" placeholder="请选择">
                  <Option value="user_id">按用户编号查询</Option>
                  <Option value="bike_id">按单车编号查询</Option>
                  <Option value="start_time">按开始时间查询</Option>
                  <Option value="duration">按时长查询</Option>
                  <Option value="cost">按金额查询</Option>
              </Select>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'user_id'">
                <Row>
                    <Col span="11">
                        <Input v-model="filter.user_id_gte">
                            <span slot="prepend">开始编号</span>
                        </Input>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <Input v-model="filter.user_id_lte">
                            <span slot="prepend">结束编号</span>
                        </Input>
                    </Col>
                </Row>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'duration'">
                <Row>
                    <Col span="11">
                        <Input v-model="filter.duration.start">
                            <span slot="append">分钟</span>
                        </Input>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <Input v-model="filter.duration.end">
                            <span slot="append">分钟</span>
                        </Input>
                    </Col>
                </Row>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'cost'">
                <Row>
                    <Col span="11">
                        <Input v-model="filter.cost.start">
                            <span slot="prepend">￥</span>
                        </Input>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <Input v-model="filter.cost.end">
                            <span slot="prepend">￥</span>
                        </Input>
                    </Col>
                </Row>
            </Form-item>


            <Form-item label="" :label-width="0" v-if="filter._type == 'start_time'">
                <Date-picker type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 250px" v-model="filter.start_time"></Date-picker>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'bike_id'">
                <Row>
                    <Col span="11">
                        <Input v-model="filter.bike_id_gte">
                            <span slot="prepend">开始编号</span>
                        </Input>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <Input v-model="filter.bike_id_lte">
                            <span slot="prepend">结束编号</span>
                        </Input>
                    </Col>
                </Row>
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
        </Form>
        
        <div slot="main">
            <div v-if="!items">
                加载中...
            </div>
            <div v-else-if="items.length > 0">
                <Table bordered :columns="columns" :data="items" @on-sort-change="sortChange"></Table>
                <pagination @page-info-change="this.fetchData" :total="pagination.rows.total" :current="pagination.pages.current_page" :page-size="pagination.pages.rows_per_page"></pagination>
            </div>
            <div v-else>
                没有数据
            </div>
        </div>
    </yb-layout-main>
</template>

<script>
function getDefaultFilter() {
    return {
        _type: 'user_id',
        user_id_lte: '',
        user_id_gte: '',
        bike_id_lte: '',
        bike_id_gte: '',
        distance_gte: '',
        distance_lte: '',
        duration: {
            start: '',
            end: ''
        },
        cost: {
            start: '',
            end: ''
        },
        start_time: []
    }
}

export default {
    data() {
        return {
            self: this,
            items: null,
            filter: getDefaultFilter(),
            pagination: {
            },
            columns: [
                {
                    title: '行程编号',
                    key: 'session_id'
                },
                {
                    title: '用户编号',
                    key: 'user_uid'
                },
                {
                    title: '单车编号',
                    key: 'bike_id'
                },
                {
                    title: '开始时间',
                    key: 'start_time',
                    render: function(row) {
                       return Vue.filter('time-format')(row.start_time);
                    }
                },
                {
                    title: '时长',
                    key: 'duration',
                    sortable: 'custom',
                    render(row) {
                        return Math.floor(row.duration/60) + '分钟';
                    }
                },
                {
                    title: '金额',
                    key: 'cost',
                    sortable: 'custom',
                    render (row, column, index) {
                        return util.accurateNumber(row.cost/100) + '元';
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render(row){
                        return `<a href="#/journey/${row.session_id}">查看轨迹</a>`;
                    }
                }
            ]
        }
    },
    methods:{
        fetchData() {
            const query = {...this.$route.query};
            if (query.cost_gte !== undefined) {
                query.cost_gte = query.cost_gte * 100;
            }
            if (query.cost_gte !== undefined) {
                query.cost_lte = query.cost_lte * 100;
            }

            if (query.duration_gte !== undefined) {
                query.duration_gte = query.duration_gte * 60;
            }

            if (query.duration_lte !== undefined) {
                query.duration_lte = query.duration_lte * 60;
            }


            this.$http.get('/admin_api/journey', {
                params:query
            }).then(function(result) {
                this.items = result.data.items;
                this.pagination = result.data.pagination;
            }.bind(this));
        },
        sortChange(options) {
            const {key: orderBy, order: orderType} = options;
            const {$router, $route} = this;
            const query = Object.assign({}, $route.query);
            if (orderType == 'normal') {
                delete query.orderBy;
                delete query.orderType;
            } else {
                query.orderBy = orderBy;
                query.orderType = orderType;
            }

            $router.push({
                path: $route.path,
                params: $route.params,
                query: query
            });
            this.fetchData();
        },
        handleFilter() {
            const filter = this.filter;
            const {$router, $route} = this;
            const query = {};
            const {
                _type,
                start_time,
                user_id_lte,
                user_id_gte,
                bike_id_lte,
                bike_id_gte,
                duration,
                cost
            } = filter;

            function date2Second(d) {
                return parseInt(+new Date(d)/1000);
            }

            switch(_type) {
                case 'start_time':
                    query.start_time_gte = date2Second(start_time[0]);
                    query.start_time_lte = date2Second(start_time[1]);
                    break;
                case 'user_id':
                    query.user_id_lte = user_id_lte;
                    query.user_id_gte = user_id_gte;
                    break;
                case 'bike_id':
                    query.bike_id_lte = bike_id_lte;
                    query.bike_id_gte = bike_id_gte;
                    break;
                case 'duration':
                    query.duration_gte = duration.start;
                    query.duration_lte = duration.end;
                    break;
                case 'cost':
                    query.cost_gte = cost.start;
                    query.cost_lte = cost.end;
                    break;
            }


            $router.push({
                path: $route.path,
                params: $route.params,
                query: query
            });
            this.fetchData();
        },
        clearFilter() {
            this.filter = getDefaultFilter();
            const { $router, $route } = this;
            $router.push({
                path: $route.path,
                params: $route.params
            });
            this.fetchData();
        }
    },
    created() {
        this.fetchData();
    }
}
</script>