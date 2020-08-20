<template>
    <!-- 上传公共组件 -->
  <div class="box">
    <div class="fromBox">
      <div class="fromtop">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            >
            <el-table-column prop="itemsItemCode" label="代码" ></el-table-column>
            <el-table-column prop="itemsName" label="名称"></el-table-column>
            <el-table-column prop="itemId" label="依据"></el-table-column>
            <el-table-column prop="itemsBasis" label="ID"></el-table-column>
            <el-table-column prop="videoStatus" label="视频状态"></el-table-column>
            <el-table-column prop="videoFilename" label="视频名称"></el-table-column>
            <el-table-column prop="itemsCode" label="报告编号"></el-table-column>
          </el-table>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    name: 'viewvideos',
    props:['viewvideosdata'],
    components: {},
    data() {
      return {
         tableData: [
            // {
            //   itemsItemCode: '53= fa462',
            //   itemsName: '汽车外廓尺寸',
            //   itemId: '⚪',
            //   itemsBasis:'1',
            //   videoStatus:'GB7258-2017,GB30509-2014',
            //   videoFilename:'ss',
            //   itemsCode:'ss',
            // }
          ],
        }
    },
    methods: {
    },
    created() {
     
    },
    mounted() {
    
    },
    watch:{
      viewvideosdata(val){
        this.viewvideosdata = val;
        this.viewvideosdata.forEach(item => {
           this.tableData.push(item)
        });

      }
    }
}
</script>

<style lang="scss" scoped>
.box{
    width: 100%;
    height:100%;
    overflow: hidden;
    .fromBox{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
        .boxtitle{
          margin-left: 0;
          font-size: 14px;
          color: #606266;
          line-height: 40px;
          span{
            margin: 0 5px;
          }
        }
        .fromtop{
          width: 100%;
          height: 100%;
          margin-top: 10px;
          overflow: auto;
        }
    }
}
</style>
