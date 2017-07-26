<template>
    <div>
        <h2 style="text-align: center;margin: 30px; color: #39f">共享单车管理后台</h2>
        <Row>
            <Col span="8" offset="8">
                <Form ref="loginForm" :model="formInline" :rules="ruleInline">
                    <Form-item prop="user">
                        <Input type="text" v-model="formInline.name" placeholder="Username" @on-enter="handleSubmit('loginForm')">
                            <Icon type="ios-person-outline" slot="prepend"></Icon>
                        </Input>
                    </Form-item>
                    <Form-item prop="password">
                        <Input ref="password" type="password" v-model="formInline.password" placeholder="Password" @on-enter="handleSubmit('loginForm')">
                            <Icon type="ios-locked-outline" slot="prepend"></Icon>
                        </Input>
                    </Form-item>
                    <Form-item>
                        <Button type="primary"  @click="handleSubmit('loginForm')" long>登录</Button>
                    </Form-item>
                </Form>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                formInline: {
                    name: '',
                    password: ''
                },
                ruleInline: {
                    name: [
                        { 
                            required: true, 
                            message: '请填写用户名',
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        { 
                            required: true, 
                            message: '请填写密码',
                            trigger: 'blur'
                        },{ 
                            type: 'string',
                            min: 6,
                            message: '密码长度不能小于6位',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate(function(valid){
                    if (valid) {
                        this.$http.post('/admin/login', {
                            name: this.formInline.name,
                            password: this.formInline.password,
                            appkey: APP_KEY
                        })
                        .then(function(result) {
                            window.IS_LOGIN = true;
                            localStorage.setItem(USER_CACHE_KEY, result.data.token);
                            this.$router.push({path: '/'});
                        }.bind(this))
                        .catch(function(err) {
                            this.$Message.error(err.response.data.msg);
                            const input = this.$refs.password.$el.querySelector('[type="password"]');
                            input.select();
                            input.focus();
                        }.bind(this));
                    }
                }.bind(this))
            }
        }
    }
</script>