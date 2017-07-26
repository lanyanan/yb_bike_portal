<template>
    <yb-layout-main>
        <span slot="title">添加IMEI</span>

        <div slot="main">
            <Form ref="form" :model="items" :rules="rule" :label-width="80">
                <Form-item label="IMEI" prop="imei">
                    <Input v-model="items.imei" placeholder="请输入IMEI码, 输入多个用空格隔开"></Input>
                </Form-item>

                <Form-item style="width: 300px;margin: 20px auto;">
                    <i-button type="primary" @click="handleSubmit">提交</i-button>
                    <router-link to="/equipment">
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
                items: {
                    imei: ''
                },
                rule: {
                    imei: [
                        {
                            required: true,
                            message: '请输入IMEI码'
                        }
                    ]
                }
            }
        },
        methods: {
            handleSubmit() {
                this.$refs.form.validate(function(valid) {
                    if (valid) {
                        let data = {
                            appkey: window.APP_KEY,
                            imei: this.items.imei.split(/\s+/)
                        };
                        this.$http({
                            method: 'post',
                            url: '/admin_api/add_imei',
                            data: data 
                        }).then(function(result) {
                            this.$Message.success('成功关联 IMEI');
                            this.$router.push({
                                path: '/equipment'
                            });
                        }.bind(this));
                    }
                }.bind(this));
            }
        }
    }
</script>