<template>
    <yb-layout-main>
        <span slot="title">锁管理</span>
        <div slot="tool">
            <div key='1' style="display: inline-block;">
                <Input v-model="lockCodeId" placeholder="请输入..." style="width: 330px;">
                    <span slot="prepend">行程编码查询</span>
                    <Button slot="append" icon="ios-search" @click="getLockCodeState">查询</Button>
                </Input>
            </div>
            <div key='2' style="display: inline-block;">
                <Input v-model="lockId" placeholder="请输入..." style="width: 300px;">
                    <span slot="prepend">锁编号</span>
                    <Button slot="append" icon="ios-search" @click="getLockState">查询</Button>
                </Input>
            </div>
        </div>

        <div slot="main">
            <div style="background:#eee;padding: 20px">
                <Card :bordered="false">
                    <p slot="title">查看锁的状态信息</p>
                    <p>最近一次心跳时间: {{lockInfo.lastHeartbeat}}</p>
                    <p>电量: {{lockInfo.battery}}</p>
                    <p>定位信息: {{lockInfo.posiInfo}}</p >
                </Card>
            </div>
            <div style="margin: 20px auto;width: 250px;">
                <Button type="primary" @click="forceEndSession">强制结束</Button>
                <router-link to="/equipment">
                    <i-button type="ghost" style="margin-left: 8px">取消</i-button>
                </router-link>
            </div>
        </div>
    </yb-layout-main>
</template>

<script>
export default {
    data() {
        return {
            lockCodeId:'',
            lockId: '',
            lockInfo: {
              lastHeartbeat: '',
              battery: '',
              posiInfo: ''
            }
        }
    },
    methods:{
        getPosiInfo (params) {
            this.$http.get('http://api.cellocation.com/cell', {
                params: {
                  'mcc': params[0],
                  'mnc': params[1],
                  'lac': params[2],
                  'ci': params[3],
                  'output': 'json'
                }
            }).then(function(result) {
                this.lockInfo.posiInfo = result.data.address;
            }.bind(this));
        },
        getLockState () {
            if (this.lockId === '') {
                return this.$Message.error('锁编号不能为空');
            }
            this.$http.get('/admin_api/specific_device', {
                params: {
                  'appkey': window.APP_KEY,
                  'lock_id': this.lockId
                }
            }).then(function(result) {
                // 最近一次心跳时间
                this.lockInfo.lastHeartbeat = result.data[lockId];
                // 电量
                this.lockInfo.battery = result.data.extra_info.battery;
                // 获取定位信息
                getPosiInfo(result.data.extra_info.cell[0])
            }.bind(this));
        },
        getLockCodeState () {
            if (this.lockCodeId === '') {
                return this.$Message.error('行程编码不能为空');
            }
            this.$http.get('/admin_api/specific_device', {
                params: {
                  'appkey': window.APP_KEY,
                  'lock_id': this.lockCodeId
                }
            }).then(function(result) {
                // 最近一次心跳时间
                this.lockInfo.lastHeartbeat = result.data[lockId];
                // 电量
                this.lockInfo.battery = result.data.extra_info.battery;
                // 获取定位信息
                getPosiInfo(result.data.extra_info.cell[0])
            }.bind(this));
        },
        forceEndSession () {
            if (this.lockId === '') {
                return this.$Message.error('锁编号不能为空');
            }
            this.$http.get('/admin_api/force_end_session', {
                params: {
                  'appkey': window.APP_KEY,
                  'lock_id': this.lockId,
                  'session_id': this.lockCodeId
                }
            }).then(function(result) {
                console.log(result.data)
            }.bind(this));
        }
    }
}
</script>