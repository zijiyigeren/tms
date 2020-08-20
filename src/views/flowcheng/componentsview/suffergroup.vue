<template>
    <!-- 受理组任务 -->
    <div class="suffergroup">
        <iframe :src=src ref="iframe" class="iframe" width="100%" height="100%"></iframe>
    </div>
</template>
<script>
import base from '@/api/base.js';
import Handletask from '../component/handleTask.vue'
export default {
    name: 'suffergroup',
    components: {Handletask},
    props: [],
    watch: {},
    data() {
        return {
            src:'static/flowcheng/components/process/mine_candidate_group.html'
        }
    },
    created() {},
    mounted() {},
    methods: {},
}
</script>
<style scoped lang="less">
.el-button--default {
  height: 30px;
  background: #fff;
  padding: 0 20px;
  margin: 0;
}
.el-button--primary {
    height: 30px;
    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
    padding: 0 20px;
    margin: 0;
}
.query_search_reset {
    background: #909399 !important;
    border-color: #909399 !important;
}
.operation_btn {
    color: #32AFF0;
    margin: 0;
    padding: 0;
    margin-right: 10px;
}
.operation_lastbtn {
    color: red;
    margin: 0;
    padding: 0;
}
.suffergroup {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: #eee;
    padding: 10px;
    overflow: hidden;
}
.warp {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.query {
    width: 100%;
    overflow: hidden;
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    white-space:nowrap;
    .query_input {
        width: 20%;
    }
}
.table_box {
    flex: 1;
    overflow: hidden;
    padding-top: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.table_content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
.pagingdevice {
    margin-top: 20px;
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