<template>
    <div>
    <yb-layout-main>
        <span slot="title">用户管理</span>
        <!-- filter -->
        <Form slot="filter" class="filter-form" ref="filterForm" :model="filter"  inline>
            <Form-item class="select order-by" label="" :label-width="0" style="width:200px">
              <Select  v-model="filter._type" placeholder="请选择">
                  <Option value="id">按编号查询</Option>
                  <Option value="mobile">按手机查询</Option>
                  <Option value="name">按姓名查询</Option>
                  <Option value="deposit">按押金查询</Option>
                  <Option value="balance">按余额查询</Option>
                  <Option value="create_at">按注册时间查询</Option>
              </Select>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'id'">
                <Input v-model="filter.id"></Input>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'mobile'">
                <Input v-model="filter.mobile"></Input>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'name'">
                <Input v-model="filter.name"></Input>
            </Form-item>


            <Form-item label="" :label-width="0" v-if="filter._type == 'balance'">
                <Row>
                    <Col span="11">
                        <Input v-model="filter.balance_gte">
                            <span slot="prepend">￥</span>
                        </Input>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <Input v-model="filter.balance_lte">
                            <span slot="prepend">￥</span>
                        </Input>
                    </Col>
                </Row>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'deposit'">
                <Row>
                    <Col span="11">
                        <Input v-model="filter.deposit_gte">
                            <span slot="prepend">￥</span>
                        </Input>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <Input v-model="filter.deposit_lte">
                            <span slot="prepend">￥</span>
                        </Input>
                    </Col>
                </Row>
            </Form-item>

            <Form-item label="" :label-width="0" v-if="filter._type == 'create_at'">
                <Date-picker type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 250px" v-model="filter.create_at"></Date-picker>
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
                <i-table bordered :context="self" :columns="columns" :data="items"></i-table>
                <pagination @page-info-change="this.fetchData" :total="pagination.rows.total" :current="pagination.pages.current_page" :page-size="pagination.pages.rows_per_page"></pagination>
            </div>

            <div v-else>
                没有数据
            </div>
        </div>
        
    </yb-layout-main>
    <Modal  v-model="modal1State"
            title="修改剩余金额"
            @on-ok="ok"
            @on-cancel="cancel">
            <template v-if="modal1State">
                <Form>
                    <Form-item label="请输入金额">
                        <i-input v-model="number_input" type="input" placeholder="请输入密码"></i-input>
                    </Form-item>
                </Form>
            </template>
        </Modal>
    </div>
</template>

<script>
function getDefaultFilter() {
    return {
        _type: 'id',
        mobile: '',
        name: '',
        deposit_gte: '',
        deposit_lte: '',
        balance_gte: '',
        balance_lte: '',
        create_at: [],
        create_at_lte: '',
        create_at_gte: ''
    }
}
export default {
    data() {
        return {
            self: this,
            items: null,
            pagination: {
            },
            modal1State:false,
            number_inp:null,
            paramsId:'',
            filter: getDefaultFilter(),
            columns: [
                {
                    title: "编号",
                    key: 'id'
                },
                {
                    title: "姓名",
                    key: 'name'
                },
                {
                    title: '身份证',
                    key: 'id_num'
                },
                {
                    title: '手机',
                    key: 'mobile'
                },
                {
                    title: '押金',
                    key: 'deposit',
                    render (row, column, index) {
                        return row.deposit/100 + '元';
                    }
                },
                {
                    title: '余额',
                    key: 'balance',
                    render (row, column, index) {
                        return row.balance/100 + '元';
                    }
                },
                {
                    title: '注册时间',
                    key: 'create_at',
                    render(row) {
                        return Vue.filter('time-format')(row.create_at * 1000);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render(row){
                        return `<a href="#" @click.prevent="show(${row.id})">修改用户金额</a>`
                    }
                }
            ]
        }
    },
    methods:{
        toCent(obj = {}, attrs = []) {
            attrs.forEach(function(item) {
                if (obj[item] !== void(0)) {
                    obj[item] = obj[item] * 100;
                }
            });

            return obj;
        },
        fetchData() {
            const query = this.toCent({...this.$route.query}, ['balance_gte', 'balance_lte', 'deposit_gte', 'deposit_lte']);
            this.$http.get('/admin_api/user', {
                params: query
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
                case 'id':
                    if (id) {
                        query.id = id;
                    }
                    break;
                case 'mobile': 
                    if (mobile) {
                        query.mobile = mobile;
                    }
                    break;
                case 'name':
                    if (name) {
                        query.name = name;
                    }
                    break;
                case 'balance':
                    if (balance_gte !== "") {
                        query.balance_gte = balance_gte;
                    }
                    if (balance_lte !== "") {
                        query.balance_lte = balance_lte
                    }
                    break;
                case 'deposit':
                    if (deposit_gte !== "") {
                        query.deposit_gte = deposit_gte;
                    }
                    if (deposit_lte !== "") {
                        query.deposit_lte = deposit_lte;
                    }
                    break;
                case 'create_at':
                    const start_date = create_at[0];
                    const end_date = create_at[1];
                    if (start_date && end_date) {
                        query.create_at_gte = parseInt(+new Date(start_date)/1000);
                        query.create_at_lte = parseInt(+new Date(end_date)/1000);
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
            this.filter = getDefaultFilter();
            const { $router, $route } = this;
            $router.push({
                path: $route.path,
                params: $route.params
            });
            this.fetchData();
        },
        show(id) {
            this.paramsId = id;
            this.number_input = '';
            this.modal1State = true;
        },
        ok () {
            let _this = this;
            this.$http.post('/admin_api/finace?appkey=' + window.APP_KEY, {
                'uid': _this.paramsId,
                'balance': _this.number_input * 100
            }).then(function(result) {
                alert('修改成功')
            }.bind(this));
        },
        cancel () {
            this.$Message.info('点击了取消');
        }
    },
    created() {
        this.fetchData();
    }
}
</script>
