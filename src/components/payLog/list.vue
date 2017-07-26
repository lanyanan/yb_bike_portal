<template>
    <div>
        <yb-layout-main>
            <span slot="title">充值消费</span>
            <Form slot="filter" class="filter-form" ref="filterForm" :model="filter"  inline>
                <Form-item class="select order-by" label="" :label-width="0" style="width:200px">
                  <Select  v-model="filter._type" placeholder="请选择">
                      <Option value="account_id">按用户编号查询</Option>
                      <Option value="type">按业务类型查询</Option>
                      <Option value="pay_type">按支付方式查询</Option>
                      <Option value="amount">按金额查询</Option>
                      <Option value="status">按状态查询</Option>
                      <Option value="create_at">按创建时间查询</Option>
                  </Select>
                </Form-item>

                <Form-item label="" :label-width="0" v-if="filter._type == 'account_id'">
                    <Input v-model="filter.account_id" placeholder="请输入用户编号"></Input>
                </Form-item>

                <Form-item label="" :label-width="0" v-if="filter._type == 'pay_type'">
                    <Select  v-model="filter.pay_type" placeholder="请选择" style="width: 150px">
                          <i-option v-for="(item, index) in payTypeText" :value="index" :key="index">{{ item }}</i-option>
                    </Select>
                </Form-item>

                <Form-item label="" :label-width="0" v-if="filter._type == 'type'">
                    <Select  v-model="filter.type" placeholder="请选择">
                        <i-option v-for="(item, index) in payForTypeText" :value="index" :key="index">{{item}}</i-option>
                    </Select>
                </Form-item>

                <Form-item label="" :label-width="0" v-if="filter._type == 'status'">
                    <i-select v-model="filter.status" placeholder="请选择">
                        <i-option v-for="(item, index) in statusOpts" :value="index" :key="index">{{item}}</i-option>
                    </i-select>
                </Form-item>


                <Form-item label="" :label-width="0" v-if="['amount'].indexOf(filter._type) > -1">
                    <Row>
                        <Col span="11">
                            <Input v-model="filter.amount.start">
                                <span slot="prepend">￥</span>
                            </Input>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                            <Input v-model="filter.amount.end">
                                <span slot="prepend">￥</span>
                            </Input>
                        </Col>
                    </Row>
                </Form-item>

                <Form-item label="" :label-width="0" v-if="filter._type == 'create_at'">
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
                    <Table bordered :context="self" :columns="columns" :data="items"></Table>
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
                <i-select v-model="modalForChangeStatus.status">
                    <i-option v-for="(item, index) in statusOpts" :value="index" :key="index">{{item}}</i-option>
                </i-select>
            </template>
            
        </Modal>
    </div>
</template>

<script>
function getDefaultFilter() {
    return {
        _type: 'account_id',
        account_id: '',
        type: "1",
        pay_type: "1",
        amount: {
            start: "",
            end: ""
        },
        status: "0",
        timerange: []
    }
}

export default {
    data() {
        return {
            self: this,
            filter: getDefaultFilter(),
            payTypeText: CONST.PAY_TYPE_TEXT,
            payForTypeText: CONST.PAY_FOR_TYPE_TEXT,
            modalForChangeStatus: {
                visible: false,
                status: 0,
                loading: false
            },
            modalItem: null,
            statusOpts: CONST.PAY_STATUS_TEXT,
            items: null,
            pagination: {
            },
            columns: [
                {
                    title: '商户ID',
                    key: 'id'
                },
                {
                    title: '用户编号',
                    key: 'account_id'
                },
                {
                    title: '时间',
                    key: 'create_at',
                    render(row) {
                        return Vue.filter('time-format')(row.create_at);
                    }
                },
                {
                    title: '类型',
                    key: 'type',
                    render: function(row) {
                        if(row.type ==1) {
                            return row.amount >= 0 ? '充押金' : '退押金';
                        } else if(row.type == 2) {
                            return row.amount >= 0 ? '充值' : '退余额';
                        } else if (row.type == 3) {
                            return '消费';
                        }
                    }
                },
                {
                    title: '状态',
                    key: 'status',
                    render (row, column, index) {
                        return CONST.PAY_STATUS_TEXT[row.status];
                    }
                },
                {
                    title: '支付方式',
                    key: 'pay_type',
                    render: function(row) {
                        return CONST.PAY_TYPE_TEXT[row.pay_type];
                    }
                },
                {
                    title: '金额',
                    key: 'amount',
                    render (row, column, index) {
                        return row.amount/100 + '元';
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render(row, column, index) {
                        return row.type == 1 && row.status != 3 ? `<a href="#" @click.prevent="changeStatus(${index})">修改状态</a>` : '';
                    }
                }
            ]
        }
    },
    methods:{
        fetchData() {
            const query = {...this.$route.query};
            if (query.amount_gte) {
                query.amount_gte = query.amount_gte * 100;
            }
            if (query.amount_lte) {
                query.amount_lte = query.amount_lte * 100;
            }
            this.$http.get('/admin_api/pay_log', {
                params: query
            }).then(function(result) {
                this.items = result.data.items;
                this.pagination = result.data.pagination;
            }.bind(this));
        },
        handleFilter() {
            const {$router, $route} = this;
            const {account_id, type, pay_type, amount, status, timerange, _type} = this.filter;
            const query = {};
            switch(_type) {
                case 'account_id':
                    if (account_id) {
                        query.account_id = account_id;
                    }
                    break;
                case 'type': 
                    if (type) {
                        query.type = type;
                    }
                    break;
                case 'pay_type':
                    if (pay_type) {
                        query.pay_type = pay_type;
                    }
                    break;
                case 'amount':
                    if (amount.start !== "") {
                        query.amount_gte = amount.start;
                    }
                    if (amount.end !== "") {
                        query.amount_lte = amount.end
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
        },
        changeStatus(index) {
            this.modalItem = this.items[index];
            window.modalItem = this.modalItem;
            this.modalForChangeStatus.status = this.modalItem.status;
            this.modalForChangeStatus.visible = true;
        },
        doChangeStatus() {
            if (this.modalForChangeStatus.status != this.modalItem.status) {
                let currentItem = this.modalItem;
                this.modalForChangeStatus.loading = true;
                this.$http({
                    method: 'post',
                    url: `/admin_api/deposit_log`,
                    data: {
                        id: this.modalItem.id,
                        status: this.modalForChangeStatus.status,
                        note: ''
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function(result) {
                    const { note, status } = result.data;
                    currentItem.status = status;
                    currentItem.note = note;
                    this.modalForChangeStatus.loading = false;
                    this.modalForChangeStatus.visible = false;
                    this.$Message.success('成功修改状态');
                }.bind(this))
                .catch(function() {
                    this.modalForChangeStatus.loading = false;
                    this.$Message.error('发生错误');
                });
            }
        }
    },
    created() {
        this.fetchData();
    }
}
</script>
