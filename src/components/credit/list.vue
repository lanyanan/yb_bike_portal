<template>
    <yb-layout-main>
        <span slot="title">信用管理</span>
        
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
</template>

<script>
export default {
    data() {
        return {
            self: this,
            items: null,
            pagination: {
            },
            filter: {
                _type: 'id',
            },
            columns: [
                {
                    title: "编号",
                    key: 'id'
                },
                {
                    title: '用户编号',
                    key: 'account_id'
                },
                {
                    title: '类型',
                    key: 'type',
                    render (row, column, index) {
                        return [
                            '',
                            '骑行完成',
                            '新用户注册',
                            '成功邀请用户',
                            '上报故障',
                            '举报违停',
                            '违停一次',
                            '违反交通'
                        ][row.type]
                    }
                },
                {
                    title: "变动值",
                    key: 'amount'
                },
                {
                    title: '时间',
                    key: 'create_at',
                    render(row) {
                        return Vue.filter('time-format')(row.create_at * 1000);
                    }
                }
            ]
        }
    },
    methods:{
        fetchData() {
            this.$http.get('/admin_api/credit_log', {
                params: this.$route.query
            }).then(function(result) {
                this.items = result.data.items;
                this.pagination = result.data.pagination;
            }.bind(this));
        },
        handleFilter() {
            const {$router, $route} = this;
            const {_type, id, mobile, name, balance_gte, balance_lte, deposit_gte, deposit_lte, create_at} = this.filter;
            const query = {};
            switch(_type) {
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
                _type: 'id',
            }

            this.filter = {...filter};
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