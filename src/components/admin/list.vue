<template>
    <yb-layout-main>
        <span slot="title">子账号管理</span>
        <div slot="tool">
            <router-link to="/admin/upsert">
                <i-button type="primary">创建子账号</i-button>
            </router-link>
        </div>
        <Form slot="filter" class="filter-form" ref="filterForm" :model="filter"  inline>
            <Form-item class="select order-by" label="" :label-width="0" style="width:200px">
              <Select  v-model="filter._type" placeholder="请选择">
                  <Option value="id">按编号查询</Option>
              </Select>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'id'">
                <Input v-model="filter.id" placeholder="请输入用户编号"></Input>
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
function getDefaultFilter() {
    return {
        _type: 'id',
        id: ''
    }
}
export default {
    data() {
        return {
            self: this,
            items: null,
            filter: getDefaultFilter(),
            pagination: {
            },
            area: {

            },
            columns: [
                {
                    title: '管理员编号',
                    key: 'id'
                },
                {
                    title: '名称',
                    key: 'name'
                },
                {
                    title: '区域',
                    key: 'area_id',
                    render(row) {
                        return `<span>{{area[${row.area_id}]}}</span>`
                    }
                },
                {
                    title: '创建时间',
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
            this.$http.get('/admin_api/admin', {
                params: this.$route.query
            }).then(function(result) {
                this.items = result.data.items;
                this.pagination = result.data.pagination;
            }.bind(this));
        },
        handleFilter() {
            const { $router, $route } = this;
            const { _type, id } = this.filter;
            const query = {};
            if (_type == 'id' && id) {
                query.id = id;
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
        this.$http({
            url: '/admin_api/area'
        }).then(function(result) {
            let area = {};
            result.data.items.forEach(function(item) {
                area[item.id]=item.name;
            });
            this.area = area;
        }.bind(this));
    }
}
</script>