<template>
    <yb-layout-main>
        <span slot="title">区域管理</span>
        
        <div slot="tool">
            <router-link to="/area/create">
                <i-button type="primary">创建区域</i-button>
            </router-link>
        </div>

        <div slot="tool">
            
        </div>

        <div slot="main">
            <div v-if="!items">
                加载中...
            </div>
            <div v-else-if="items.length > 0">
                <Table bordered :context="self" :columns="columns" :data="items"></Table>
                <pagination @page-info-change="this.fetchData" :total="pagination.rows.total" :current="pagination.pages.current_page" :size="pagination.pages.rows_per_page"></pagination>
            </div>
            <div v-else>
                没有数据
            </div>
        </div>
    </yb-layout-main>
</template>
<style type="text/css">

</style>

<script>
export default {
    data() {
        return {
            self: this,
            items: null,
            filter: {
                _type: 'id'
            },
            pagination: {
            },
            columns: [
                {
                    title: '编号',
                    key: 'id'
                },
                {
                    title: '名称',
                    key: 'name'
                },
                {
                    title: '操作',
                    key: 'action',
                    render(row) {
                        return `<a href="#/area/${row.id}/edit">编辑</a>`;
                    }
                }
            ]
        }
    },
    methods:{
        fetchData() {
            this.$http.get('/admin_api/area', {
                params: this.$route.query
            }).then(function(result) {
                this.items = result.data.items;
                this.pagination = result.data.pagination;
            }.bind(this));
        },
        handleFilter() {

        }
    },
    created() {
        this.fetchData();
    }
}
</script>