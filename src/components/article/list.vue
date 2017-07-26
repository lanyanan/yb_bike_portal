<template>
    <yb-layout-main>
        <span slot="title">内容管理</span>

        <div slot="tool">
            <router-link to="/article/create">
                <i-button type="primary">创建内容</i-button>
            </router-link>
        </div>
        
        <div slot="main">
            <div v-if="!items">
                加载中...
            </div>
            <div v-else-if="items.length > 0">
                <Table bordered :columns="columns" :data="items"></Table>
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
                    title: "显示",
                    key: 'should_show',
                    render(row) {
                        return row.should_show ? '是' : '否';
                    }
                },{
                    title: '标题',
                    key: 'title'
                },{
                    title: '操作',
                    key: 'action',
                    render(row, column, index) {
                         return `<a href="#/article/${row.id}/edit">编辑</a>`;
                    }
                }
            ]
        }
    },
    methods:{
        fetchData() {
            this.$http.get('/admin_api/content', {
                params: this.$route.query
            }).then(function(result) {
                this.items = result.data.items;
                this.pagination = result.data.pagination;
            }.bind(this));
        },
        handleFilter() {
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