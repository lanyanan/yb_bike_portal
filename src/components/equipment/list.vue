<template>
    <yb-layout-main>
        <span slot="title">设备管理</span>
        
        <div slot="tool">
            <router-link to="/equipment/lock">
                <i-button type="primary">锁管理</i-button>
            </router-link>
            <router-link to="/equipment/imei">
                <i-button type="primary">添加 IMEI</i-button>
            </router-link>
        </div>

        <div slot="main">
            <div v-if="!items">
                加载中...
            </div>
            <div v-else-if="items.length > 0">
                <Table bordered :context="self" :columns="columns" :data="items"></Table>
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
            lockId: '',
            self: this,
            items: null,
            pagination: {
            },
            columns: [
                {
                    title: 'IMEI',
                    key: 'imei'
                },
                // {
                //     title: '查看详情',
                //     key: 'detail',
                //     render(row) {
                //         return `<a href="#/equipment/${row.imei}/detail">查看</a>`;
                //     }
                // }
            ]
        }
    },
    methods:{
        fetchData() {
            this.$http.get('/admin_api/register_imei', {
                params: {
                  'appkey': window.APP_KEY
                }
            }).then(function(result) {
                this.items = result.data.register_imei.map((item) => {
                    return {
                      imei: item
                    }
                });
                this.pagination = result.data.pagination;
            }.bind(this));
        }
    },
    created() {
        this.fetchData();
    }
}
</script>