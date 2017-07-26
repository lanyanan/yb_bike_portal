<template>
    <div class="pagination-wraper">
        <Page class="pagination" :total="total" :current="current" @on-change="changePage" @on-page-size-change="changePageSize" :show-total="showTotal" :simple="simple" :page-size-opts="pageSizeOpts" :page-size="pageSize" :show-sizer="showSizer"></Page>
    </div>
</template>
<script>
    export default {
        props: ['total','current','size','isShowTotal', 'showTotal', 'simple', 'pageSizeOpts', 'showSizer','pageSize'],
        data() {
            return {
            }
        },
        methods: {
            changePage(page) {
                this.changePageInfo(page, this.$route.query.rows_per_page || this.$props.pageSize);
            },
            changePageSize(pageSize) {
                this.changePageInfo(this.$props.current, pageSize);
            },
            changePageInfo(page, pageSize) {
                const $route = this.$route;
                const $router = this.$router;
                $router.push({
                    path: $route.path,
                    query: Object.assign({}, $route.query, {
                        page: page,
                        rows_per_page: pageSize
                    }),
                    params: $route.params
                });
                this.$emit('page-info-change');
            }
        },
        watch: {
            pageSize: function(val) {
            }
        },
        created() {
        }
    }
</script>
<style scoped>
    .pagination-wraper {
        overflow: hidden;
    }
    .pagination {
        float: right;
        margin: 10px 0;
    }
</style>