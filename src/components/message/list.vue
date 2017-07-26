<template>
    <yb-layout-main>
        <span slot="title">广告消息</span>

        <div slot="tool">
            <router-link to="/message/create">
                <i-button type="primary">创建广告</i-button>
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
                    title: "弹窗显示",
                    key: 'show_when_open',
                    render(row) {
                        return row.show_when_open ? '是' : '否';
                    }
                },
                {
                    title: '封面',
                    key: 'cover',
                    render(row) {
                        return row.cover ? `<img style="display: block;height: 100px;margin: 5px;" src="${row.cover}" />` : ''
                    }
                },
                {
                    title: '标题',
                    key: 'title'
                },
                {
                    title: '简介',
                    key: 'brief_intro'
                },
                {
                    title: "内容链接",
                    key: 'content'
                },
                {
                    title: '开始时间',
                    key: 'begin_at',
                    render(row) {
                        return Vue.filter('time-format')(row.begin_at * 1000)
                    }
                },
                {
                    title: '结束时间',
                    key: 'expire_at',
                    render(row) {
                        return Vue.filter('time-format')(row.expire_at * 1000);
                    }
                },
                {
                    title: '类型',
                    key: 'wb_type'
                },
                {
                    title: '尺寸',
                    key: ['wb_width', 'wb_height'],
                    render(row, column, index) {
                         return `<div>宽: ${row.wb_width | ''}</div><div>高: ${row.wb_height | ''}</div>`;
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render(row, column, index) {
                         return `<a href="#/message/${row.id}/edit">编辑</a>`;
                    }
                }
            ]
        }
    },
    methods:{
        fetchData() {
            this.$http.get('/admin_api/advertise_event', {
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
            this.fetchData();
        }
    },
    created() {
        this.fetchData();
    }
}
</script>