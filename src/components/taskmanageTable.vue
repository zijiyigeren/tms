<template>
  <!-- 任务管理-表格 -->
  <div v-loading="loading" class="table_box">
    <ul class="table_header">
        <li class="table_item">任务号</li>
        <li class="table_item">状态</li>
        <li class="table_item">受检单位</li>
        <li class="table_item">样品名称</li>
        <li class="table_item">样品规格型号</li>
        <li class="table_item">科室</li>
        <li class="table_item">类别</li>
        <li class="table_item">操作</li>
    </ul>
    <!-- 一级列表 -->
    <div v-if="tablelist.length < 1" class="table_body_not">暂无数据</div>
    <div class="table_body" v-for="(item,index) in tablelist" :key="index">
        <ul class="table_body_list">
            <li class="table_item"><span>{{item.taskCode}}</span></li>
            <li class="table_item_task">
                <p v-for="(em,i) in item.taskStatusList" :key="i" v-show="item" class="table_item_task_p"
                >
                    {{em}}
                </p>
            </li>
            <li class="table_item"><span>{{item.companyCheck}}</span></li>
            <li class="table_item"><span>{{item.sampleName}}</span></li>
            <li class="table_item"><span>{{item.sampleType}}</span></li>
            <li class="table_item"><span>{{item.orgName}}</span></li>
            <li class="table_item"><span>{{item.checkTypeID}}</span></li>
            <li class="table_item">
                <el-button type="text" @click="copyMessage(index,item)" style="color:#32AFF0;marginLeft:6px;">
                    复制信息
                </el-button>
            </li>
        </ul>
    </div>
  </div>
   
    
</template>
<script>
  export default {
    name: 'taskmanagetable',
    props: ['loading', 'tablelist'],
    data() {
      return {}
    },
    created() {
    },
    mounted() {
    },
    methods: {
      // 点击复制信息
      copyMessage(index, row) {
        this.$emit('copyMessage', row)
      },
    }
  }
</script>
<style lang="less" scoped>
.table_box {
    width: 100%;
    border: 1px solid #EBEEF5;
}
.table_header {
    width: 100%;
    background-color: rgb(243, 246, 253);
    height: auto;
    display: flex;
    border-bottom: 1px solid #EBEEF5;
    li {
        line-height: 55px;
        box-sizing: border-box;
        border-right: 1px solid #EBEEF5;
        list-style: none;
        text-align: center;
        color: rgb(96, 98, 102);
        font-weight: 600;
        &:last-child {
            border-right: none;
        }
    }
}

.table_body_not {
    text-align: center;
    line-height: 60px;
    color: #909399;
}
.table_body {
    width: 100%;
    height: auto;
    border-bottom: 1px solid #EBEEF5;
    &:nth-child(even) {
        background: #FAFAFA;
    }
    &:last-child {
        border-bottom: none;
    }
    .table_body_list {
        width: 100%;
        height: auto;
        display: flex;
        overflow: hidden;
        min-width: 0;
        li {
            box-sizing: border-box;
            border-right: 1px solid #EBEEF5;
            list-style: none;
            color: rgb(96, 98, 102);
            &:last-child {
                border-right: none;
            }
        }
    }
}
.table_item {
    width: 12.5%;
    overflow: hidden;
    padding: 0 10px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
        flex: 1;
        min-width: 0;
        padding: 18px 0;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
 .table_item_task {
    width: 12.5%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .table_item_task_p {
        height: 55px;
        text-align: center;
        line-height: 55px;
        border-bottom: 1px solid #eee;
            &:last-child {
            border-bottom: none;
        }
    }
}
/deep/ .table_header, .table_body_list {
  margin-bottom: 0 !important;
}
</style>
