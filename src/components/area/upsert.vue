<template>
    <Form ref="form" :model="item" :rules="rule" :label-width="80">
        <Form-item label="名称" prop="name">
            <Input v-model="item.name" placeholder="请输入区域名称"></Input>
        </Form-item>

        <Form-item>
            <i-button type="primary" @click="handleSubmit">提交</i-button>
            <router-link to="/area">
                <i-button type="ghost" style="margin-left: 8px">取消</i-button>
            </router-link>
        </Form-item>
    </Form>
</template>

<script>
    export default {
        data() {
            return {
                item: {
                    id: '',
                    name: ''
                },
                rule: {
                    name: [
                        {
                            required: true,
                            message: '请输入区域名称'
                        }
                    ]
                }
            }
        },
        methods: {
            handleSubmit() {
                this.$refs.form.validate(function(valid) {
                    if (valid) {
                        if (this.item.id) {
                            this.$http({
                                method: 'put',
                                url: `/admin_api/area/${this.item.id}`,
                                data: this.item
                            }).then(function(result) {
                                this.$Message.success('成功修改区域');
                                this.$router.push({
                                    path: '/area'
                                });
                            }.bind(this));
                        } else {
                            this.$http({
                                method: 'post',
                                url: '/admin_api/area',
                                data: this.item
                            }).then(function(result) {
                                this.$Message.success('成功创建区域');
                                this.$router.push({
                                    path: '/area'
                                });
                            }.bind(this));
                        }
                    }
                }.bind(this));
            }
        },
        created() {
            const id = this.$route.params.id;
            if (id) {
                this.$http({
                    url: `/admin_api/area/${id}`
                }).then(function(result) {
                    const {id, name} = result.data;
                    this.item.id = id;
                    this.item.name = name;
                }.bind(this));
            }
        }
    }
</script>