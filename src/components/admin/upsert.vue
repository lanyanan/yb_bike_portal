<template>
    <Form ref="form" :model="item" :rules="rule" :label-width="80">
        <Form-item label="名称" prop="name">
            <Input v-model="item.name" placeholder="请输入登录名"></Input>
        </Form-item>
        <Form-item label="初始密码" prop="password">
            <Input type="password" v-model="item.password" placeholder="请输入初始密码"></Input>
        </Form-item>
        <Form-item label="选择区域">
            <Select v-model="item.area_id" placeholder="请选择区域">
                <i-option v-for="(item, index) in area" :value="item.id" :key="item.id">{{item.name}}</i-option>
            </Select>
        </Form-item>

        <Form-item>
            <i-button type="primary" @click="handleSubmit">提交</i-button>
            <router-link to="/admin">
                <i-button type="ghost" style="margin-left: 8px">取消</i-button>
            </router-link>
        </Form-item>
    </Form>
</template>

<style type="text/css">
    
</style>

<script>
    export default {
        data() {
            return {
                item: {
                    name: '',
                    password: '',
                    area_id: ''
                },
                area: [

                ],
                rule: {
                    name: [
                        {
                            required: true,
                            message: '请输入登录名'
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请输入初始密码'
                        }
                    ]
                }
            }
        },

        methods: {
            handleSubmit() {
                this.$refs.form.validate(function(valid) {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/admin_api/admin',
                            data: this.item
                        }).then(function(result) {
                            this.$Message.success('成功创建子账号');
                            this.$router.push({
                                path: '/admin'
                            });
                        }.bind(this));
                    }
                }.bind(this));
            }
        },
        created() {
            this.$http({
                url: '/admin_api/area'
            }).then(function(result) {
                this.area = result.data.items;
            }.bind(this));
        }
    }
</script>