<template>
    <yb-layout-main>
        <span slot="title">
            {{ item.id ? '编辑广告' : '创建广告' }}
        </span>
        <div slot="main">
            <Form ref="form" :model="item" :rules="rule" :label-width="80">
                <Form-item label="标题" prop="title">
                    <Input v-model="item.title" placeholder="标题"></Input>
                </Form-item>

                <Form-item label="有效时间" :label-width="0" >
                        <Date-picker type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 350px" v-model="time"></Date-picker>
                </Form-item>
                
                <Form-item label="封面图片">
                    <Upload :action="upload.url" :on-success="uploadSuccess" :show-upload-list="false">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                    </Upload>
                    <img v-if="item.cover" :src="item.cover" />
                </Form-item>

                <Form-item label="内容">
                    <Input v-model="item.brief_intro" type="textarea" :autosize="{minRows: 5}" placeholder="请输入..."></Input>
                </Form-item>

                <Form-item label="链接" prop="content">
                    <Input v-model="item.content" placeholder="链接"></Input>
                </Form-item>

                <Form-item label="弹窗显示">
                    <i-switch v-model="item.show_when_open" size="large">
                        <span slot="open">开启</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </Form-item>

                <Form-item label="弹窗类型">
                    <Radio-group v-model="item.wb_type">
                        <Radio label="static">
                            <span>static</span>
                        </Radio>
                        <Radio label="popup">
                            <span>popup</span>
                        </Radio>
                    </Radio-group>
                </Form-item>  

                <Form-item label="弹窗宽度" v-show="item.wb_type == 'static'">
                    <Input v-model="item.wb_width" placeholder="弹窗宽度" style="width: 350px"></Input>
                </Form-item>  

                <Form-item label="弹窗高度" v-show="item.wb_type == 'static'">
                    <Input v-model="item.wb_height" placeholder="弹窗高度" style="width: 350px"></Input>
                </Form-item> 

                <Form-item label="宽度比例" v-show="item.wb_type == 'static'">
                    <Slider v-model="item.wb_width_weight" :tip-format="sliderFormat"></Slider>
                </Form-item>

                <Form-item label="高度比例" v-show="item.wb_type == 'static'">
                    <Slider v-model="item.wb_height_weight" :tip-format="sliderFormat"></Slider>
                </Form-item>

                <Form-item label="上边距比例" v-show="item.wb_type == 'static'">
                    <Slider v-model="item.wb_top_margin" :tip-format="sliderFormat"></Slider>
                </Form-item>

                <Form-item label="左上角的 x 坐标比例" v-show="item.wb_type == 'static'">
                    <Slider v-model="item.wb_x_weight" :tip-format="sliderFormat"></Slider>
                </Form-item>

                <Form-item label="左上角的 y 坐标比例" v-show="item.wb_type == 'static'">
                    <Slider v-model="item.wb_y_weight" :tip-format="sliderFormat"></Slider>
                </Form-item>

                <Form-item>
                    <i-button type="primary" @click="handleSubmit">提交</i-button>
                    <router-link to="/message">
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
                    id: undefined,
                    title: '',
                    content: '',
                    brief_intro: '',
                    show_when_open: false,
                    begin_at: undefined,
                    expire_at: undefined,
                    cover: undefined,
                    wb_type: 'static',
                    wb_width: undefined,
                    wb_height: undefined,
                    wb_width_weight: 100,
                    wb_height_weight: 100,
                    wb_top_margin: 0,
                    wb_x_weight: 0,
                    wb_y_weight: 0
                },
                time: [],
                upload: {
                    url: window.UPLOAD_URL,
                    baseUrl: window.UPLOAD_BASE_URL
                },
                rule: {
                    title: [
                        {
                            required: true,
                            message: '请输入标题'
                        }
                    ],
                    content: [
                      {
                            required: true,
                            message: '请输入链接'
                      }
                    ]
                }
            }
        },
        methods: {
            sliderFormat(val) {
                return val + '%';
            },
            uploadSuccess(response) {
                this.item.cover = `${this.upload.baseUrl}/${response.path}`;
            },
            handleSubmit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        const item = {...this.item};
                        if (this.time[0] && this.time[1]) {
                            item.begin_at = parseInt(this.time[0]/1000);
                            item.expire_at = parseInt(this.time[1]/1000);
                        }

                        item.show_when_open = item.show_when_open ? 1 : 0;
                        if (item.wb_type === 'static' && item.wb_width && item.wb_height) {
                            item.wb_width = parseInt(item.wb_width);
                            item.wb_height = parseInt(item.wb_height);
                        }

                        if (item.id) {
                            this.$http({
                                method: 'put',
                                url: `/admin_api/advertise_event`,
                                data: item
                            }).then(function(result) {
                                this.$Message.success('成功修改');
                                this.$router.push({
                                    path: '/message'
                                });
                            }.bind(this));
                        } else {
                            this.$http({
                                method: 'post',
                                url: '/admin_api/advertise_event',
                                data: item
                            }).then(function(result) {
                                this.$Message.success('成功创建');
                                this.$router.push({
                                    path: '/message'
                                });
                            }.bind(this));
                        }
                    }
                });
            }
        },
        created() {
            const id = this.$route.params.id;
            if (id) {
                this.$http({
                    url: `/admin_api/advertise_event/${id}`
                }).then(function(result) {
                    const {id, begin_at, brief_intro, content, cover, expire_at, show_when_open, title, wb_type, wb_width, wb_height, wb_width_weight, wb_height_weight, wb_top_margin, wb_x_weight, wb_y_weight} = result.data;
                    this.item.id = id;
                    this.item.brief_intro = brief_intro;
                    this.item.content = content;
                    this.item.cover = cover;
                    this.item.show_when_open = !!show_when_open;
                    this.item.title = title;
                    this.time = [begin_at * 1000, expire_at * 1000];
                    this.item.wb_type = wb_type;
                    this.item.wb_width = wb_width;
                    this.item.wb_height = wb_height;
                    this.item.wb_width_weight = wb_width_weight;
                    this.item.wb_height_weight = wb_height_weight;
                    this.item.wb_top_margin = wb_top_margin;
                    this.item.wb_x_weight = wb_x_weight;
                    this.item.wb_y_weight = wb_y_weight;
                }.bind(this));
            }
        }
    }
</script>