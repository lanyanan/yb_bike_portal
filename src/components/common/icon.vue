<template>
    <img :class="name" :src="img(name)" />
</template>
<script>
export default {
    props: ['name'],
    data() {
        return {}
    },
    methods: {
        img(name) {
            return require('../../assets/icon/' + name + '.png');
        }
    }
}
</script>
<style type="text/css" scoped>
    img {
        height: auto;
        width: 18px;
        vertical-align: middle;
    }
    .dashboard {
        width: 16px;
        margin-right: 3px;
    }
    .cash-pledge {

    }
    .journey {
        width: 16px;
    }
    .finance {
        width: 15px;
    }
    .pay {
        width: 13px;
    }
    .customer-service {
        width: 17px;
        margin-right: -3px;
    }

</style>