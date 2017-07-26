<template>
    <yb-layout-main>
        <span slot="title">红包管理</span>

        <div slot="main">
            <Form ref="form" :model="item" :rules="rule" :label-width="80">

                <Form-item label="类型">
                  <Select  v-model="item.type" placeholder="请选择">
                      <Option v-for="(val, index) of typeText" :key="index" :value="index">{{ val }}</Option>
                  </Select>
                </Form-item>

                <Form-item label="总金额(元)" prop="name">
                    <Input v-model="item.total_amount" placeholder="请输入总金额"></Input>
                </Form-item>

                <Form-item label="红包数量" prop="name">
                    <Input v-model="item.total_num" placeholder="请输入总红包数量"></Input>
                </Form-item>

                <Form-item label="金额随机">
                    <i-switch v-model="item.is_random_for_each_one" size="large">
                        <span slot="open">开启</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </Form-item>

                <Form-item>
                    <i-button type="primary" @click="handleSubmit">提交</i-button>
                    <router-link to="/redpacket">
                        <i-button type="ghost" style="margin-left: 8px">取消</i-button>
                    </router-link>
                </Form-item>
            </Form>
        </div>
    </yb-layout-main>
</template>

<script>
    export default {
        data() {
            return {
                item: {
                    "total_amount" : '',
                    "total_num": '',
                    "is_random_for_each_one": false,
                    "type": '1'
                },
                typeText: window.CONST.RED_PACKET_TYPE_TEXT,
                rule: {
                    total_amount: [
                        {
                            required: true,
                            message: '请输入总金额'
                        }
                    ],
                    total_num: [
                        {
                            required: true,
                            message: '请输入总红包数量'
                        }
                    ]
                }
            }
        },
        methods: {
            handleSubmit() {
                this.$refs.form.validate(function(valid) {
                    if (valid) {
                        const {total_amount, total_num, is_random_for_each_one, type} = this.item;
                        const item = {
                            total_amount: Number(total_amount) * 100,
                            total_num: Number(total_num),
                            is_random_for_each_one: is_random_for_each_one ? 1 : 0,
                            type: Number(type)
                        }
                        this.$http({
                            method: 'post',
                            url: '/admin_api/lucky_money',
                            data: item
                        }).then(function(result) {
                            if (result.data.status == 0) {
                                this.$Message.success('成功创建红包');
                                this.$router.push({
                                    path: '/redpacket'
                                });
                            } else {
                                this.$Message.error(result.data.desc);
                            }
                        }.bind(this));
                    }
                }.bind(this));
            }
        },
        created() {
        }
    }
</script>