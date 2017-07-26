<template>
    <div>
        <yb-layout-main>
            <span slot="title">客户服务</span>
            <Form slot="filter" class="filter-form" ref="filterForm" :model="filter"  inline>
                <Form-item class="select order-by" label="" :label-width="0" style="width:200px">
                  <Select  v-model="filter._type" placeholder="请选择">
                      <Option value="account_id">按用户编号查询</Option>
                      <Option value="bike_id">按单车编号查询</Option>
                      <Option value="journey_id">按行程编号查询</Option>
                      <Option value="status">按状态查询</Option>
                      <Option value="create_at">按创建时间查询</Option>
                  </Select>
                </Form-item>

                <Form-item label="" :label-width="0" v-if="filter._type == 'account_id'">
                    <Input v-model="filter.account_id"></Input>
                </Form-item>

                <Form-item label="" :label-width="0" v-if="filter._type == 'bike_id'">
                    <Input v-model="filter.bike_id"></Input>
                </Form-item>

                <Form-item label="" :label-width="0" v-if="filter._type == 'journey_id'">
                    <Input v-model="filter.journey_id"></Input>
                </Form-item>

                <Form-item label="" :label-width="0" v-if="filter._type == 'status'">
                    <Select  v-model="filter.status" placeholder="请选择">
                          <Option value="0">待处理</Option>
                          <Option value="1">处理中</Option>
                          <Option value="2">已完成</Option>
                    </Select>
                </Form-item>


                <Form-item label="" :label-width="0" v-if="['amount'].indexOf(filter._type) > -1">
                    <Row>
                        <Col span="11">
                            <Input>
                                <span slot="prepend">￥</span>
                            </Input>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                            <Input>
                                <span slot="prepend">￥</span>
                            </Input>
                        </Col>
                    </Row>
                </Form-item>

                <Form-item label="" :label-width="0" v-if="['create_at'].indexOf(filter._type) > -1">
                    <Date-picker type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 250px" v-model="filter.timerange"></Date-picker>
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
                    <i-table bordered :context="self" :columns="columns" :data="items"></i-table>
                    <pagination @page-info-change="this.fetchData" :total="pagination.rows.total" :current="pagination.pages.current_page" :page-size="pagination.pages.rows_per_page"></pagination>
                </div>
                <div v-else>
                    没有数据
                </div>
            </div>
        </yb-layout-main>

        <Modal
            v-model="modalForChangeStatus.visible"
            :loading="modalForChangeStatus.loading"
            title="修改状态" @on-ok="doChangeStatus">
            <template v-if="modalForChangeStatus.visible">
                <Form>
                    <Form-item label="状态">
                        <i-select v-model="modalForChangeStatus.status">
                            <i-option v-for="(item, index) in statusOpts" :value="index" :key="index">{{item}}</i-option>
                        </i-select>
                    </Form-item>
                    <Form-item label="管理员备注">
                        <i-input v-model="modalForChangeStatus.admin_note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></i-input>
                    </Form-item>
                </Form>
            </template>
            
        </Modal>

        <Modal
            v-model="modalForShowImg.visible"
            title="查看图片" :width="modalForShowImg.width">
            <template v-if="modalForShowImg.visible">
                <Slider v-model="modalForShowImg.width" :max="2000" :min="200" :step="50"></Slider>
                <img :style="{width: '100%', height: 'auto'}" :src="'http://abj-elogic-test1.yunba.io:3800/' + modalItem.img" />
            </template>
            <div slot="footer">
                
            </div>
        </Modal>
    </div>

</template>

<script>
function getDefaultFilter() {
    return {
        _type: 'account_id',
        account_id: '',
        journey_id: '',
        bike_id: '',
        timerange: null
    }
}


export default {
    data() {
        return {
            self: this,
            items: null,
            pagination: {
            },
            filter: getDefaultFilter(),
            modalForChangeStatus: {
                visible: false,
                status: 0,
                loading: false,
                admin_note: ''
            },
            modalItem: null,
            modalForShowImg: {
                visible: false,
                width: 600
            },
            statusOpts: ['待处理', '处理中', '已完成'],
            columns: [
                {
                    title: '编号',
                    key: 'id',
                    width: 80
                },
                {
                    title: '类型',
                    key: 'type',
                    render: function(row) {
                        let type = row.type;
                        return  type == 30 ? '' : ['', '行程问题', '开不了锁', '发现单车故障', '举报违停', '退押金', '其他问题'][type]
                    }
                },
                {
                    title: '其它',
                    key: 'info'
                },
                {
                    title: '用户编号',
                    key: 'account_id'
                },
                {
                    title: '单车编号',
                    key: 'bike_id'
                },
                {
                    title: '行程编号',
                    key: 'journey_id'
                },
                {
                    title: '备注',
                    key: 'note'
                },
                {
                    title: '照片',
                    key: 'img',
                    render(row, column, index) {
                        return row.img ? `<a href="#" @click.prevent="showImg(${index})">点击查看</a>` : '';
                    }
                },
                {
                    title: '时间',
                    key: 'create_at',
                    render(row) {
                        return Vue.filter('time-format')(row.create_at * 1000);
                    }
                },
                {
                    title: '管理员备注',
                    key: 'admin_note'
                },
                {
                    title: '状态',
                    key: 'status',
                    render(row) {
                        return ['待处理', '处理中', '已完成'][row.status];
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render(row, column, index) {
                        return `<a href="#" @click.prevent="changeStatus(${index})">修改状态</a>`;
                    }
                }
            ]
        }
    },
    methods:{
        fetchData() {
            this.$http.get('/admin_api/custom_service', {
                params:this.$route.query
            }).then(function(result) {
                this.items = result.data.items;
                this.pagination = result.data.pagination;
            }.bind(this));
        },
        changeStatus(index) {
            this.modalItem = this.items[index];
            this.modalForChangeStatus.status = this.modalItem.status;
            this.modalForChangeStatus.admin_note = this.modalItem.admin_note;
            this.modalForChangeStatus.visible = true;
        },
        doChangeStatus() {
            if (this.modalForChangeStatus.status != this.modalItem.status) {
                let currentItem = this.modalItem;
                this.modalForChangeStatus.loading = true;
                this.$http.put(`/admin_api/custom_service/${this.modalItem.id}`, {
                    status: this.modalForChangeStatus.status,
                    admin_note: this.modalForChangeStatus.admin_note
                }).then(function(result) {
                    const {note, status, admin_note} = result.data
                    currentItem.status = status;
                    currentItem.note = note;
                    currentItem.admin_note = admin_note;
                    this.modalForChangeStatus.loading = false;
                    this.modalForChangeStatus.visible = false;
                    this.$Message.success('成功修改状态');
                }.bind(this))
                .catch(function() {
                    this.modalForChangeStatus.loading = false;
                    this.$Message.error('发生错误');
                });
            }
        },
        showImg(index) {
            this.modalForShowImg.visible = true;
            this.modalItem = this.items[index];
        },
        handleFilter() {
            const {$router, $route} = this;
            const {account_id, bike_id, journey_id, status, timerange, _type} = this.filter;
            const query = {};
            switch(_type) {
                case 'account_id':
                    if (account_id) {
                        query.account_id = account_id;
                    }
                    break;
                case 'bike_id': 
                    if (bike_id) {
                        query.bike_id = bike_id;
                    }
                    break;
                case 'journey_id':
                    if (journey_id) {
                        query.journey_id = journey_id;
                    }
                    break;
                case 'status':
                    if (status != void(0)) {
                        query.status = status;
                    }
                    break;
                case 'create_at':
                    const start_date = timerange[0];
                    const end_date = timerange[1];
                    if (start_date && end_date) {
                        query.start_date = parseInt(+new Date(start_date)/1000);
                        query.end_date = parseInt(+new Date(end_date)/1000);
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

