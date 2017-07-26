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
            </div>

            <baidu-map
                    ref="map"
                    :center="center"
                    :zoom="16"
                    :scroll-wheel-zoom="true"
                    :mapClick="false"
                    @ready="baiduMapReady"
                    v-bind:style="{width: '100%', height: '500px'}"
                    >
                <bm-polyline :path="path" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="false"></bm-polyline>

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
            journey: {
                track: []
            }
        };
    },
    created() {
    },
    computed: {
        path() {
            const path = this.journey.track.map((item) =>{
                return {lat: item.lat, lng: item.lng}
            });
            console.log(path);
            if (path.length >0) {
                this.center = path[Math.floor(path.length/2)];
            }
            return path;
        }
    },
    methods: {
        baiduMapReady() {
            this.refresh();
        },
        refresh() {
            var id = this.$route.params.id;
            this.$http.get(`/admin_api/journey/${id}`).then(function(result) {
                this.journey = result.data;
            }.bind(this));
        }
    }
}
</script>