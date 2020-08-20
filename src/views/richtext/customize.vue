<template>
    <!-- 自定义表单 -->
    <div class="startup">
        <iframe :src=src ref="iframe" class="iframe" width="100%" height="100%"></iframe>
    </div>
</template>
<script>
import base from '@/api/base.js';
export default {
    name: 'startup',
    components: {},
    props: [],
    watch: {},
    data() {
        return {
            src:'static/flowcheng/components/dataTemplates/manageTemplates.html'
        }
    },
    created() {},
    mounted() {},
    methods: {},
}
</script>
<style scoped lang="less">
.startup {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: #eee;
    padding: 10px;
    overflow: hidden;
    position: relative;
    z-index: 10;
}
.iframe {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 20px;
    border: none;
    overflow: hidden;
    
}
</style>