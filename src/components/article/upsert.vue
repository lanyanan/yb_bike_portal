<template>
    <yb-layout-main>
        <span slot="title">
            {{ item.id ? '编辑内容' : '创建内容' }}
        </span>
        <div slot="main">
            <Form ref="form" :model="item" :rules="rule" :label-width="80">
                <Form-item label="标题" prop="title">
                    <Input v-model="item.title" placeholder="标题"></Input>
                </Form-item>
                
<!--                 <Form-item label="类型">
                    <Select v-model="item.type" style="width:200px">
                        <Option v-for="item in typeList" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                </Form-item> -->

                <Form-item label="内容" prop="content">
                    <editor class="editor" @change="(content) => {tempContent = content}" :content="item.content" :height="500"></editor>
                </Form-item>
                
                <Form-item label="标签">
                    <Input v-model="item.tag" placeholder="标签"></Input>
                </Form-item>

                <Form-item label="显示">
                    <i-switch v-model="item.should_show" size="large">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </Form-item>

                <Form-item>
                    <i-button type="primary" @click="handleSubmit">提交</i-button>
                    <router-link to="/article">
                        <i-button type="ghost" style="margin-left: 8px">取消</i-button>
                    </router-link>
                </Form-item>
            </Form>
        </div>
    </yb-layout-main>
</template>

<style type="text/css">
    .editor.vue-html5-editor>.toolbar>ul>li .icon {
        line-height: 1
    }
</style>

<script>
import VueHtml5Editor from 'vue-html5-editor';
const editor = new VueHtml5Editor({
    // 全局组件名称，使用new VueHtml5Editor(options)时该选项无效 
    // global component name
    name: "vue-html5-editor",
    // 是否显示模块名称，开启的话会在工具栏的图标后台直接显示名称
    // if set true,will append module name to toolbar after icon
    showModuleName: false,
    // 自定义各个图标的class，默认使用的是font-awesome提供的图标
    // custom icon class of built-in modules,default using font-awesome
    icons: {
        text: "icon-fa-pencil",
        color: "icon-fa-brush",
        font: "icon-fa-font",
        align: "icon-fa-align-justify",
        list: "icon-fa-list",
        link: "icon-fa-link",
        unlink: "icon-fa-unlink",
        tabulation: "icon-fa-table",
        image: "icon-fa-picture",
        hr: "icon-fa-minus",
        eraser: "icon-fa-eraser",
        undo: "icon-fa-ccw",
        "full-screen": "icon-fa-resize-full-alt",
        info: "icon-fa-info",
    },
    // 配置图片模块
    // config image module
    image: {
        // 文件最大体积，单位字节  max file size
        sizeLimit: 512 * 1024,
        // 上传参数,默认把图片转为base64而不上传
        // upload config,default null and convert image to base64
        upload: {
            get url() {
                return window.UPLOAD_URL;
            },
            headers: {},
            params: {},
            fieldName: 'file'
        },
        // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
        // compression config,default resize image by localResizeIMG (https://github.com/think2011/localResizeIMG)
        // set null to disable compression
        compress: {
            width: 1600,
            height: 1600,
            quality: 80
        },
        // 响应数据处理,最终返回图片链接
        // handle response data，return image url
        uploadHandler(responseText){
            var result = JSON.parse(responseText);
            if (!result.path) {
                alert('上传失败, 请重试');
            } else {
                return `${window.UPLOAD_BASE_URL}/${result.path}`;
            }
        }
    },
    // 语言，内建的有英文（en-us）和中文（zh-cn）
    //default en-us, en-us and zh-cn are built-in
    language: "zh-cn",
    // 自定义语言
    i18n: {
        //specify your language here
        "zh-cn": {
            "align": "对齐方式",
            "image": "图片",
            "list": "列表",
            "link": "链接",
            "unlink": "去除链接",
            "table": "表格",
            "font": "文字",
            "full screen": "全屏",
            "text": "排版",
            "eraser": "格式清除",
            "info": "关于",
            "color": "颜色",
            "please enter a url": "请输入地址",
            "create link": "创建链接",
            "bold": "加粗",
            "italic": "倾斜",
            "underline": "下划线",
            "strike through": "删除线",
            "subscript": "上标",
            "superscript": "下标",
            "heading": "标题",
            "font name": "字体",
            "font size": "文字大小",
            "left justify": "左对齐",
            "center justify": "居中",
            "right justify": "右对齐",
            "ordered list": "有序列表",
            "unordered list": "无序列表",
            "fore color": "前景色",
            "background color": "背景色",
            "row count": "行数",
            "column count": "列数",
            "save": "确定",
            "upload": "上传",
            "progress": "进度",
            "unknown": "未知",
            "please wait": "请稍等",
            "error": "错误",
            "abort": "中断",
            "reset": "重置"
        }
    },
    // 隐藏不想要显示出来的模块
    // the modules you don't want
    hiddenModules: [],
    // 自定义要显示的模块，并控制顺序
    // keep only the modules you want and customize the order.
    // can be used with hiddenModules together
    visibleModules: [
        "text",
        "color",
        "font",
        "align",
        "list",
        "link",
        "unlink",
        "tabulation",
        "image",
        "hr",
        "eraser",
        "undo",
        "full-screen",
        "info",
    ],
    // 扩展模块，具体可以参考examples或查看源码
    // extended modules
    modules: {
        //omit,reference to source code of build-in modules
    }
});

export default {
    components:{
        editor
    },
    data() {
        return {
            tempContent: '',
            item: {
                id: undefined,
                title: '',
                type: undefined,
                content: '',
                should_show: false
            },
            typeList: [
                {
                    value: 1,
                    label: '用户协议'
                },{
                    value: 2,
                    label: '帮助类文章'
                }, {
                    value: 3,
                    label: '普通文章'
                }
            ],
            time: [],
            rule: {
                title: [
                    {
                        required: true,
                        message: '请输入标题'
                    }
                ]
            }
        }
    },
    mounted() {
    },
    methods: {
        uploadSuccess(response) {
            this.item.cover = `${this.upload.baseUrl}/${response.path}`;
        },
        handleSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const item = {...this.item};

                    item.should_show = item.should_show ? 1 : 0;
                    item.content = this.tempContent;
                    item.type = 1;

                    if (item.id) {
                        this.$http({
                            method: 'post',
                            url: '/admin_api/content',
                            data: item
                        }).then(function(result) {
                            this.$Message.success('成功修改');
                            this.$router.push({
                                path: '/article'
                            });
                        }.bind(this));
                    } else {
                        this.$http({
                            method: 'post',
                            url: '/admin_api/content',
                            data: item
                        }).then(function(result) {
                            this.$Message.success('成功创建');
                            this.$router.push({
                                path: '/article'
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
                url: `/admin_api/content/${id}`
            }).then(function(result) {
                const {id, content, type, tag, title, should_show} = result.data;
                this.item.id = id;
                this.item.content = content;
                this.item.type = type;
                this.item.title = title;
                this.item.tag = tag;
                this.item.should_show = !!should_show;
            }.bind(this));
        }
    }
}
</script>