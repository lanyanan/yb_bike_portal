<template>
    <!-- filter -->
    <!-- body -->
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
    <!-- pagination -->
</template>

<script>
export default {
    data() {
        return {
            self: this,
            items: null,
            pagination: {
            },
            columns: [
                {
                    title: '用户编号',
                    key: 'account_id'
                },
                {
                    title: '时间',
                    key: 'create_at',
                    render(row) {
                        return Vue.filter('time-format')(row.create_at * 1000);
                    }
                },
                {
                    title: '类型',
                    key: 'type',
                    render: function(row) {
                        return ['', '充值', '退款', '消费', '充押金', '退押金'][row.type]
                    }
                },
                {
                    title: '支付方式',
                    key: 'pay_type',
                    render: function(row) {
                        return ['', '支付宝', '微信支付', '余额'][row.pay_type];
                    }
                },
                {
                    title: '金额',
                    key: 'amount',
                    render (row, column, index) {
                        return row.amount + '元';
                    }
                }
            ]
        }
    },
    methods:{
        fetchData() {
            this.$http.get('/admin_api/balance_log', {
                params: this.$route.query
            }).then(function(result) {
                this.items = result.data.items;
                this.pagination = result.data.pagination;
            }.bind(this));
        }
    },
    created() {
        this.fetchData();
    }
}
</script>