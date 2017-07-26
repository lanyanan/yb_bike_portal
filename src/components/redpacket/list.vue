<template>
    <yb-layout-main>
        <span slot="title">红包管理</span>
        
        <Form slot="filter" class="filter-form" ref="filterForm" :model="filter"  inline>
            <Form-item class="select order-by" label="" :label-width="0" style="width:200px">
              <Select  v-model="filter._type" placeholder="请选择">
                  <Option value="phone">按用户手机</Option>
                  <Option value="account_id">按用户编号</Option>
              </Select>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'account_id'">
                <Input v-model="filter.account_id"></Input>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'phone'">
                <Input v-model="filter.phone"></Input>
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

        <div slot="tool">
            <router-link to="/redpacket/create">
                <i-button type="primary">创建红包</i-button>
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
function getDefaultFilter() {
    return {
        _type: 'account_id',
        account_id: '',
        phone: ''
    }
}

export default {
    data() {
        return {
            self: this,
            items: null,
            pagination: {
            },
            filter: getDefaultFilter(),
            columns: [
                {
                    title: "编号",
                    key: 'id'
                },{
                    title: '用户编号',
                    key: 'account_id'
                },{
                    title: '已发放',
                    key: 'account_id',
                    render (row) {
                        return row.account_id ? '是' : '否';
                    }
                },{
                    title: '类型',
                    key: 'type',
                    render(row) {
                        return window.CONST.RED_PACKET_TYPE_TEXT[row.type];
                    }
                },{
                    title: '金额',
                    key: 'amount',
                    render(row) {
                        return util.accurateNumber(row.amount/100);
                    }
                }

            ]
        }
    },
    methods:{
        fetchData() {
            this.$http.get('/admin_api/lucky_money', {
                params: this.$route.query
            }).then(function(result) {
                this.items = result.data.items;
                this.pagination = result.data.pagination;
            }.bind(this));
        },
        handleFilter() {
            const {$router, $route} = this;
            const {_type, account_id, phone} = this.filter;
            const query = {};
            switch(_type) {
                case 'account_id':
                    if (account_id) {
                        query.account_id = account_id;
                    }
                    break;
                case 'phone':
                    if (phone) {
                        query.phone = phone;
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
            const filter = {
                _type: 'account_id',
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