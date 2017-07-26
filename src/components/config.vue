<template>
    <yb-layout-main>
        <span slot="title">设置</span>
        
        <div slot="tool">
            
        </div>

        <div slot="main">
          <Form ref="form" :model="config" :rules="rule" :label-width="80">
              <Form-item label="押金" prop="deposit">
                  <Input v-model="config.deposit" placeholder="请输入押金">
                    <span slot="append">元</span>
                  </Input>
              </Form-item>

              <Form-item label="骑行单价" prop="price" style="display:inline-block;width: 200px;">
                  <Input v-model="config.price" size="small" placeholder="">
                    <span slot="append">元</span>
                  </Input>
              </Form-item>
              <Form-item style="display:inline-block;">每</Form-item>
              <Form-item prop="billing_cycle" style="display:inline-block;width: 200px;">
                  <Input v-model="config.billing_cycle" size="small" placeholder="">
                    <span slot="append">分钟</span>
                  </Input>
              </Form-item>

              <Form-item>
                  <i-button type="primary" @click="handleSubmit">保存</i-button>
              </Form-item>
          </Form>
        </div>
    </yb-layout-main>
</template>

<script>
    export default {
        data() {
            return {
                config: {
                    deposit: undefined,
                    price: undefined,
                    billing_cycle: undefined
                },
                rule: {
                    deposit: [
                        {
                            required: true,
                            message: '请输入押金'
                        },
                        {
                          validator: (rule, value, callback) => {
                            const v = parseFloat(value);
                            if (isNaN(v) || (v != value)) {
                              callback(new Error('请输入数字'))
                            } else {
                              callback();
                            }
                          }
                        }
                    ],
                    price: [
                        {
                            required: true,
                            message: '请输入骑行单价'
                        },
                        {
                          validator: (rule, value, callback) => {
                            const v = parseFloat(value);
                            if (isNaN(v) || (v != value)) {
                              callback(new Error('请输入数字'))
                            } else {
                              callback();
                            }
                          }
                        }
                    ],
                    billing_cycle: [
                        {
                            required: true,
                            message: '请输入计费周期'
                        },
                        {
                          validator: (rule, value, callback) => {
                            const v = parseFloat(value);
                            if (isNaN(v) || (v != value)) {
                              callback(new Error('请输入数字'))
                            } else {
                              callback();
                            }
                          }
                        }
                    ]
                }
            }
        },
        methods: {
            parseDataAfterGet(data) {
              return {
                deposit: util.accurateNumber(data.deposit/100),
                price: util.accurateNumber(data.price/100),
                billing_cycle: data.billing_cycle
              }
            },
            parseDataBeforePost(data) {
              return {
                deposit: String(util.accurateNumber(data.deposit * 100)),
                price: String(util.accurateNumber(data.price * 100)),
                billing_cycle: String(data.billing_cycle)
              }
            },
            handleSubmit() {
                this.$refs.form.validate(function(valid) {
                    if (valid) {
                      const data = this.parseDataBeforePost(this.config);
                      this.$http({
                          method: 'post',
                          url: '/admin_api/config',
                          data: data
                      }).then((result) => {
                        if (result.data.status == 0) {
                          this.$Message.success('保存成功');
                        } else {
                          this.$Message.error(result.data.desc);
                        }
                      });
                    }
                }.bind(this));
            }
        },
        created() {
          this.$http({
              url: `/admin_api/config`
          }).then((result) => {
              if (result.data.status === 0) {
                const { price, billing_cycle, deposit } = this.parseDataAfterGet(result.data);
                this.config.deposit = deposit;
                this.config.price = price;
                this.config.billing_cycle = billing_cycle;
              }
          });
        }
    }
</script>