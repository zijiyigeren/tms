<template>
    <!-- 流程定义 -->
    <div class="startup">
        <iframe :src=src class="startupif" ref="startupif" width="100%" height="100%"></iframe>
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
            src:'static/flowcheng/components/process/manage_process_defination.html'
        }
    },
    created() {},
    mounted() {
        window.addEventListener('message', this.handleMessage);
    },
    methods: {
        handleMessage (event) {
            let data = event.data;
            // console.log('跳转数据',data);
            if(data.data) {
                this.$EventBus.$emit('Crumbs', {
                    cache: true,
                    children: null,
                    component: data.data.component,
                    hidden: false,
                    name: data.data.name,
                    path: data.data.path,
                    redirect: null,
                    title: data.data.title
                })
            }
        },
    },
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
}
.startupif {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 20px;
    border: none;
    overflow: hidden;
}
</style>