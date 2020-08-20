<template>
  <section class="sectlxt">
    <div class="sectlxtBg">
    <div class="inBoxs">
      <div class="inBoxsleft">
        <div class="incoupt">
          <label>模板名称：</label>
          <el-input placeholder="请输入内容" v-model="unitaddress"  size="small" clearable name="clearInputValue" @keyup.enter.native="queryselect(true)"></el-input>
        </div>
        <div class="incoupt">
          <label>检验项目名称：</label>
          <el-input placeholder="请输入内容" v-model="addressee"  size="small" clearable name="clearInputValue" @keyup.enter.native="queryselect(true)"></el-input>
        </div>
         <div class="incoupt">
          <label>检验依据：</label>
          <el-input placeholder="请输入内容" v-model="telephonenumber" clearable  size="small" name="clearInputValue" @keyup.enter.native="queryselect(true)"></el-input>
        </div>
        <div class="incoupt">
          <label>状态：</label>
           <el-select v-model="statusvalue" placeholder="请选择"  size="small">
            <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
            </el-select>
        </div>
        <div class="incoupt">
            <label>检验科室：</label>
            <el-select v-model="invoicetype" clearable placeholder="请选择"  size="small">
            <el-option
                v-for="item in invoicetypedata"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
            </el-select>
        </div>
      </div>
    </div>
    <div class="lxt_selsctBtn">
      <div class="leftBtn">
        <el-button type="primary" class="bespoke" @click="newlyadded(true)">新增</el-button>
        <el-button type="primary" class="bespoke" @click="excelExport(true)">EXCEL导出</el-button>
        <el-button type="primary" class="bespoke" @click="batchdeletionBtn(true)">批量删除</el-button>
      </div>
      <el-button type="primary" class="bespoke queryRight" @click="queryselect(true)">查询</el-button>
      <!-- <el-button type="info" class="bespoke" @click="resetList">重置</el-button> -->
    </div>

    
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
      <origintable
        :querydataChild=querydata
        :mypagesize=mysize
        :myStyle=myStyle
        ref="mychild"
        @cpage="getCpage"
        @displayed="getDist">
      </origintable>
    </div>
    </div>
  </section>
</template>
<script>
 import origintable from './publicationmodel/origintable'
  
  export default {
    name: 'origin',
    data() {
      return {
        unitaddress:'',// 模板名称
        addressee:'',//检验项目名称
        telephonenumber:'',//检验依据：
        invoicetype:'',//科室
        invoicetypedata:[],//科室数据 
        statusvalue:'',//状态
        status:[//状态数据
            {label:"全部",value:0},
            {label:"正在使用",value:1},
            {label:"未使用",value:2}
        ],

        querydata: [],  //子组件显示的数据
        currentPage: 1, // 当前页数  分页 (默认)
        pageSize: 10,   //每页显示条数 分页(默认)
        mysize: '', //提供刊版页接口  分页显示条数
        myStyle: false, //分页样式选择
        falg: false,// 查询动画
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
        console.log(data)
        this.currentPage = data;
      },
      getDist(data) {
        console.log(data)
        this.pageSize = data;
      },
      queryselect(isreset) {  //查询按钮
        if(isreset){
          this.currentPage = 1
        }
        let issueyear;
        if (this.issue) {
          issueyear = this.issue.replace(/-/g, ""); //下达日期 正则去掉‘-’
        } else {
          issueyear = '';
        }
        const data = {
            "name": this.unitaddress,  //模板名称
            "items_itme_name": this.addressee,  //检验项目名称
            "items_test_basis": this.telephonenumber,  //检验依据
            "status": this.statusvalue,  //状态 =1 已绑定项目 =2 未绑定项目  全部传空
            "items_test_room": this.invoicetype,  //检验科室，传科室id	
            'currentPage': this.currentPage,// 当前页数  分页
            'pageSize': this.pageSize,//每页显示条数 分页
        };
        console.log(data)
        this.falg = true
        this.$api.paramsConfig.originalrecordlist(data).then(res => {
            console.log(res)
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
      getDepartment(){  //获取科室数据
        this.invoicetypedata = []
        this.$api.financial.departmentList().then(res => {
          console.log(res.data.data)
          let orgList = res.data.data;
          orgList.forEach(item => {
            let obj = {value: item.id, label: item.org_name}
            this.invoicetypedata.push(obj)
          });
        })
      },
      batchdeletionBtn(){ // 批量删除
        this.$refs.mychild.batchdeletion();
      },
      newlyadded(){//新增
        this.$refs.mychild.childnewlyadded();
      },
      excelExport(){ //excel导出
        this.$refs.mychild.childrenExcelExport();
      }
    },
    mounted() {
      this.getDepartment();
      this.parentheight();
      setTimeout(()=>{
        this.queryselect(true);
      },1000)
    },
    created() {
      document.onkeydown = (e) => {
        if (window.event === undefined) {
          var key = e.keyCode
        } else {
          // eslint-disable-next-line no-redeclare
          var key = window.event.keyCode
        }
        if (key === 13) {
          this.queryselect(true)
        }
      }
    },
    components: {
        origintable
    },
    watch: {
    //   reportValue() {
    //     if (this.reportValue == 5) {
    //       this.reportValue = this.report[0].label;
    //     }
    //   }
    }
  }
</script>
<style lang="less" scoped>
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

  .incouptbig {
    width: 40%;
    height: 40px;
    line-height: 40px;
    display: flex;
    margin-top: 1%
  }

  .incouptbig label {
    width: 100px;
    text-align: right;
    font-size: 14px;
    color: #606266;
  }

  .incouptbig .el-input {
    width: 41%;
  }

  .el-range-editor.el-input__inner{width: 80%;}

  .lxt_selsctBtn {
    width: 100%;
    overflow: hidden;
    margin-bottom: 1vw;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    padding-bottom: 1vw;
    margin-left: 0;

    .el-button--primary {
      min-width: 68px;
    }

    .el-button--info {
      min-width: 68px;
    }
  }
  .lxt_selsctBtn .leftBtn{
     display: inline-block;
     float: left;
  }
  .queryRight{
    float: right;
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
  }

  .showItem {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .inBoxsleft {
    width: 96%;
    display: flex;
    flex-wrap: wrap;
  }
  .showcont{
    overflow: hidden;
  }

  .inBoxsright {
    width: 4%;
  }

  .inBoxsright button {
    margin-top: 1vw;
  }

  /deep/ .el-loading-spinner {
    width: 100%;
    margin-top: -21px;
    text-align: center;

  }

  

  /deep/ .el-date-editor .el-range-separator{padding:0}





</style>
