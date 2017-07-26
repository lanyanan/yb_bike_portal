<template>
    <div>
        <Form class="filter-form" ref="filterForm" :model="filter"  inline>
            <Form-item class="select order-by" label="" :label-width="0" style="width:200px">
              <Select  v-model="filter._type" placeholder="请选择">
                  <Option value="user_id">按用户编号查询</Option>
                  <Option value="type">按类型查询</Option>
                  <Option value="pay_type">按支付方式查询</Option>
                  <Option value="amount">按金额查询</Option>
                  <Option value="status">按状态查询</Option>
                  <Option value="create_at">按创建时间查询</Option>
              </Select>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'user_id'">
                <Input></Input>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'pay_type'">
                <Select  v-model="filter.pay_type" placeholder="请选择">
                      <Option value="1">支付宝</Option>
                      <Option value="2">微信支付</Option>
                </Select>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'type'">
                <Select  v-model="filter.type" placeholder="请选择">
                      <Option value="4">缴押金</Option>
                      <Option value="5">退押金</Option>
                </Select>
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

            <Form-item label="" :label-width="0" v-if="['create_at', 'last_heartbeat_time', 'last_used_time'].indexOf(filter._type) > -1">
                <Date-picker type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 250px" v-model="filter.timerange"></Date-picker>
            </Form-item>

            <Form-item>
                <Button type="primary" @click="handleFilter">
                    <Icon type="search"></Icon>
                    查询
                </Button>
            </Form-item>
        </Form>

        <div v-if="!items">
            加载中...
        </div>
        <div v-else-if="items.length > 0">
            <Table bordered :columns="columns" :data="items"></Table>
            <pagination @page-info-change="this.fetchData" :total="pagination.rows.total" :current="pagination.pages.current_page" :size="pagination.pages.rows_per_page"></pagination>
        </div>
        <div v-else>
            没有数据
        </div>


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
export default {
    data() {
        return {
            self: this,
            items: null,
            filter: {
                _type: 'user_id',
                type: "4",
                pay_type: "1",
                status: "0"
            },
            modalForChangeStatus: {
                visible: false,
                status: 0,
                loading: false
            },
            modalItem: null,
            statusOpts: ['待处理', '处理中', '已完成'],
            pagination: {
            },
            columns: [
                {
                    title: '编号',
                    key: 'id'
                },
                {
                    title: '用户编号',
                    key: 'account_id'
                },
                {
                    title: '创建时间',
                    key: 'create_at',
                    render(row) {
                        return Vue.filter('time-format')(row.create_at * 1000);
                    }
                },
                {
                    title: '类型',
                    key: 'type',
                    render: function(row) {
                        return (row.type == 4 && '缴押金') || (row.type == 5 && '退押金');
                    }
                },
                {
                    title: '支付方式',
                    key: 'pay_type',
                    render: function(row) {
                        return ['', '支付宝', '微信支付'][row.pay_type];
                    }
                },
                {
                    title: '金额',
                    key: 'amount',
                    render (row, column, index) {
                        return row.amount + '元';
                    }
                },
                {
                    title: '状态',
                    key: 'status',
                    render (row, column, index) {
                        return row.status == void(0) ? '已完成' : ['待处理', '处理中', '已完成'][row.status];
                    }
                },
                {
                    title: '完成时间',
                    key: 'finish_at',
                    render (row, column, index) {
                        return Vue.filter('time-format')(row.finish_at);
                    }
                },
                {
                    title: '备注',
                    key: 'note'
                },
                {
                    title: '操作',
                    key: 'action',
                    render(row, column, index) {
                        return row.type == 5 && row.status != 2 ? `<a href="#" @click.prevent="changeStatus(${index})">修改状态</a>` : '';
                    }
                }
            ]
        }
    },
    methods:{
        fetchData() {
            this.$http.get('/admin_api/deposit_log', {
                params: this.$route.query
            }).then(function(result) {
                this.items = result.data.items;
                this.pagination = result.data.pagination;
            }.bind(this));
        },
        handleFilter() {

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
        vm.$on('page-change', this.fetchData);
    }
}
</script>