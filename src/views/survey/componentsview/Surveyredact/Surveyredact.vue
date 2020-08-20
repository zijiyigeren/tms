<template>
  <!-- 报告编辑 -->
  <section class="sectlxt">
    <div class="sectlxtBg">
      <div class="inBoxs">
        <div class="inBoxsleft">
         <div class="incoupt">
            <label>报告编号：</label>
            <el-input placeholder="请输入内容" v-model="tasknumber" clearable @keyup.enter.native="queryselect" name="clearInputValue"  size="small"></el-input>
          </div>
          <div class="incoupt">
            <label>受检单位：</label>
            <el-input placeholder="请输入内容" v-model="examination" clearable @keyup.enter.native="queryselect" name="clearInputValue" size="small"></el-input>
          </div>
          <div class="incoupt">
            <label>样品名称：</label>
            <el-input placeholder="请输入内容" v-model="samplename" clearable  size="small" @keyup.enter.native="queryselect" name="clearInputValue"></el-input>
          </div>
          <div class="incoupt">
              <label>规格型号：</label>
              <el-input placeholder="请输入内容" v-model="specification" clearable  size="small" name="clearInputValue" @keyup.enter.native="queryselect"></el-input>
          </div>
          
          <div class="incoupt">
              <label>商标：</label>
              <el-input placeholder="请输入内容" v-model="trademarkmode" clearable  size="small" name="clearInputValue" @keyup.enter.native="queryselect"></el-input>
          </div>
        </div>
        
      </div>
      <div class="lxt_selsctBtn">
          <el-button type="primary" class="bespoke" @click="queryselect" >查询</el-button>
           <!-- <el-button type="primary" class="bespoke" @click="queryselect" v-if="authenticationField.manu">查询</el-button> -->
      </div>
      
      <ul class="cB_listTitle">
          <li class="tasknumber">报告编号</li>
          <li class="inspected">受检单位</li>
          <li class="sample">样品名称</li>
          <li class="specification">规格型号</li>
          <li class="trademark">商标</li>
          <li class="operation">操作</li>
      </ul>



      <!-- 查询结果 -->
      <div class="selsctop">
        <!-- 查询动画 -->
        <div class="el-loading-mask" v-if="falg">
          <div class="el-loading-spinner">
            <svg viewBox="25 25 50 50" class="circular">
            <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
            </svg>
          </div>
        </div>

        <survetable
          :querydataChild=querydata
          :queryTypeChild=queryType
          :mypagesize=mysize
          :myStyle=myStyle
          ref="mychild"
          @cpage="getCpage"
          @displayed="getDist">
        </survetable>
      </div>
    </div>
  </section>
</template>
<script>
  import survetable from './survetable'
  import {type} from 'os'
  import { watch } from 'fs'
  import { setAuthentication } from '@/authenticationDocument/authenticationDocument.js'
  export default {
    name: 'surveyredact',
    data() {
      return {
        fale: false,
        trademarkmode:'',// 商标
        samplename: '',
        tasknumber: '',
        examination: '',
        specification: '',
        arrYear: [{value: '', label: '全部'}],
        num: 3, // 模块选择
        querydata: [],  //子组件显示的数据
        queryType: {}, //父组件的查询条件
        currentPage: 1, // 当前页数  分页 (默认)
        pageSize: 10,   //每页显示条数 分页(默认)
        mysize: '', //提供刊版页接口  分页显示条数
        myStyle: false, //分页样式选择
        falg:false,// 查询动画
        
        processInstanceIdName : '',
        process_instance_id : '',
        authenticationField:{ //鉴权字段
          manu:false,
          lhb:false
        }, 
      }
    },
    methods: {
      parentheight(){
        let oLxtSelsctBtn = document.querySelector('.lxt_selsctBtn').offsetHeight
        if(this.show){
            this.$refs.mychild.myWindow(117,oLxtSelsctBtn)
        }else{
          this.$refs.mychild.myWindow(65,oLxtSelsctBtn)
        }
      },
      getCpage(data) {
        this.currentPage = data
      },
      getDist(data) {
        this.pageSize = data
      },
      queryselect() { //查询按钮
        const data = {
          'process_instance_id':this.process_instance_id,
          'processInstanceIdName':this.processInstanceIdName,
          'companyCheck': this.examination, //受检单位
          'sampleName': this.samplename, //样品名称
          'sampleType': this.specification, //规格型号
          'taskCode': this.tasknumber,//报告编号
          'sampleTrademark': this.trademarkmode,//商标
          'currentPage': this.currentPage,// 当前页数  分页
          'pageSize': this.pageSize,//每页显示条数 分页
        }
        this.falg = true
        this.queryType = data;
       
        this.$api.lxtinitial.queryselect(data).then(res => {
          
          if (res.data.respCode == 0) {
            this.falg = false
            let data = res.data.data;
            this.querydata = data;
          }
        }).catch(res => {
          this.falg = false
          this.$alert(res.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      // reportingType() { //报告类型
      //   this.$api.lxtinitial.lxtreport(this.num).then(res => {
      //     if (res.data.respCode == 0) {
      //       let data = res.data.data;
      //       data.forEach(item => {
      //         let obj = {value: item.typeABC, label: item.typeName};
      //         this.report.push(obj);
      //       });
      //       this.reportValue = this.report[0].label
      //     } else {
      //       this.$alert(res.data.message, '信息提示', {
      //         dangerouslyUseHTMLString: true
      //       });
      //     }
      //   })
      // },
      getMode(){
        // let mode = 'JCBG';
        // this.$api.lxtinitial.getdicName(mode).then(res => {
        //   if (res.data.respCode == 0) {
        //     this.process_instance_id = res.data.data.dicTypeCode
        //     this.processInstanceIdName = res.data.data.dicTypeName
        //   }
        // }).then(()=>{
        //   this.queryselect();
        // }).catch(res => {
        //   this.$alert(res.data.message, '信息提示', {
        //     dangerouslyUseHTMLString: true
        //   });
        // })
        this.process_instance_id = '3'
        this.processInstanceIdName = 'JCBG'
        this.queryselect();
      },
    },
    created() {
      
    },
    mounted(){
      this.parentheight();
      //this.getAuthentication();
      setAuthentication(this.$route.name,this.authenticationField); //鉴权操作  需传入两个值 1 this.$route.name：当前路由name 2 this.authenticationField：鉴权字段
      setTimeout(()=>{
        this.getMode();
      },1000)
    },
    components: {
      survetable
    },
  }
</script>
<style  lang="less" scoped>
  .inBoxs {
    width: 98.8%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    background-color: #fff;
    margin: 5px auto 0;
    padding-bottom: 10px;
  }

  .incoupt {
    width: 20%;
    height: 40px;
    line-height: 40px;
    display: flex;
    margin-top: 1%
  }

  .incoupt label {
    width: 100px;
    text-align: right;
    font-size: 14px;
    color: #606266;
  }

  .incoupt .el-input {
    width: 60%;
  }

  .incoupt .el-select {
    width: 60%;
  }

  .incoupt .el-select .el-input {
    width: 100%;
  }

  .lxt_selsctBtn {
    width: 100%;
    text-align: right;
    margin-bottom: 1vw;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    padding-bottom: 1vw;
    margin-left: 0;
    .el-button--primary{
      min-width: 68px;
    }
    .el-button--info{
      min-width: 68px;
    }
  }

  .sectlxt {
    background-color: #eee;
     .sectlxtBg{
        width: 98.8%;
        height: 97%;
        background-color: #fff;
        margin: 10px auto 0;
        padding: 1px 10px 10px 10px;
        overflow: hidden;
     }
  }

  .selsctop {
    width: 100%;
    flex-wrap: wrap;
    position: relative;
    margin-bottom: 60px;
  }


  .showItem {
    width: 100%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
  }

  .inBoxsleft {
    width: 96%;
    display: flex;
    flex-wrap: wrap;
  }

  .inBoxsright {
    width: 4%;
  }

  .inBoxsright button {
    margin-top: 1vw;
  }

  .showcont{
    overflow: hidden;
  }

  /deep/.el-loading-spinner{
   width: 100%;
   margin-top: -21px;
   text-align: center;

  }


  .cB_listTitle {
    width: 100%;
    background-color: rgb(243, 246, 253);
    height: auto;
    display: flex;
    border-top: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    margin-bottom: 0;
  }
  .cB_listTitle li {
    line-height: 3vw;
    box-sizing: border-box;
    border-right: 1px solid #EBEEF5;
    list-style: none;
    text-align: center;
    color: #909399;
  }
  /* 自定义表格列width */
  .tasknumber {
    width: 10%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .inspected {
    width: 15%;
    padding-right: 1%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sample {
    width: 15%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .specification {
    width: 25%;
    padding-right: 1%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trademark {
    width: 15%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .operation {
    width: 20%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }


</style>
