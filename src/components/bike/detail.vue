<template>
    <div class="layout-content-main">
        <Card style="width:100%">
            <p slot="title">
                <a to="#" v-on:click.prevent="$router.go(-1)">
                    <Icon type="chevron-left"></Icon>
                    返回
                </a>
            </p>
            <div slot="extra">
            <a href="#" @click.prevent="refresh">
                <Icon type="ios-loop-strong"></Icon>
                刷新
            </a>
                
            </div>
            <baidu-map 
                :center="center" 
                :zoom="16" 
                :scroll-wheel-zoom="true"
                @ready="baiduMapReady"
                style="width: 100%; height: 500px"
                >
                <bm-marker :position="center" :dragging="true"></bm-marker>
                <bm-info-window :position="center" :show="infoWindow.isOpen" @close="infoWindow.isOpen = false" :offset="infoWindow.offset">
                  <div v-html="infoWindow.content"></div>
                </bm-info-window>
            </baidu-map>
        </Card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            center: {
                lat: 22.542955,
                lng: 114.059688
            },
            infoWindow: {
                isOpen: true,
                content: '',
                offset: {
                  width: 0,
                  height: -25
                }
            },
            bike: {}
        };
    },
    created() {
        
    },
    methods: {
        baiduMapReady() {
            this.refresh();
        },
        refresh() {
            this.$http.get(`/admin_api/bike/${this.$route.params.id}`).then(function(result) {
                this.bike = result.data;
                this.infoWindow.content = `
                    编号: ${this.bike.name}<br />
                    开关状态: ${this.bike.switchStatus}<br />
                    电量: ${this.bike.power}%
                `
            }.bind(this));
        }
    }
}
</script>