<template>
    <div>
        <div class="header">
            <div class="title">
                <slot name="title"></slot>
            </div>
            <div class="tool">
                <slot name="tool"></slot>
            </div>
        </div>
        <div class="main">
            <slot name="filter"></slot>
            <slot name="main"></slot>
        </div>
    </div>

</template>

<script>
    export default {


    }
</script>

<style type="text/css" scoped>
.header {
    padding: 0px 0px;
    height: 50px;
    line-height: 45px;
    font-size: 16px;
    border-bottom: 1px solid #efefef;
    margin-bottom: 20px;
}
.header .title {
    display: inline-block;
}
.header .tool {
    float:  right;
}
</style>