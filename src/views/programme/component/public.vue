<template>
  <!-- 上传公共组件 -->
  <div class="publicBox">
    <template>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="a">
          <publicInformation :basic = basicData ></publicInformation>
        </el-tab-pane>
        <el-tab-pane label="强检统计表" name="b" >
          <publicStatistics :resData = resData></publicStatistics>
        </el-tab-pane>
        <el-tab-pane label="新能源统计表" name="c" >
          <publicNewEnergy :resData = resData ></publicNewEnergy>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>
<script>
  import publicInformation from '@/views/programme/component/publicInformation.vue';
  import publicStatistics from '@/views/programme/component/publicStatistics.vue';
  import publicNewEnergy from '@/views/programme/component/publicNewEnergy.vue';
  var bb;
  export default {
    name: 'public',
    components: {
      publicInformation,
      publicStatistics,
      publicNewEnergy
    },
    data() {
      return {
        activeName: 'a',
        rouerData: null,
        basicData: null,
        resData:'',
      };
    },
    methods: {
      handleClick(tab, event) {
        
        console.log(tab, event);
      }
    },
    created() {
      /*
      * 获取sessionStorage中的zhongjiData存储的id
      * */
     let id = JSON.parse(window.sessionStorage.getItem('zhongjiData'))
     //let id = 'AEA55D3E4CA34A32995B66F4E60A6C34';
     //let id = '44FE38BEEF85497C8ACA8FB5CC9F3928';
     
     this.$api.tatistical.uploadingMachine(id).then((res)=>{ 
        //console.log(res)
        // this.resData = res;
        // this.basicData = res.data.data;
        this.resData = JSON.stringify(res);
        this.basicData = JSON.stringify(res.data.data);
        //  bb = res.data.data;
        //  console.log(this.resData)
        //  console.log(this.basicData)

     })
    
    },
    mounted(){
    },
  }
</script>

<style lang="scss" scoped>
  .publicBox {
    width: 98%;
    height: 100%;
    margin: 0 auto;

  }

 .publicBox .el-tabs {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /deep/.publicBox .el-tabs__nav-wrap {
    height: 41px;
  }

  .publicBox .el-tabs .el-tabs__content {
    flex: 1;
    overflow: hidden;
  }

  .publicBox .el-tabs .el-tabs__content .el-tab-pane {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }


</style>
