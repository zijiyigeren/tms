<template>
  <section class="sectlxt">
    <div class="sectlxtBg">
    <div class="inBoxs">
      <div class="inBoxsleft">
        <div class="incoupt">
          <label>单位地址：</label>
          <el-input placeholder="请输入内容" v-model="unitaddress"  size="small" clearable name="clearInputValue" @keyup.enter.native="queryselect(true)"></el-input>
        </div>
        <div class="incoupt">
          <label>收件人：</label>
          <el-input placeholder="请输入内容" v-model="addressee"  size="small" clearable name="clearInputValue" @keyup.enter.native="queryselect(true)"></el-input>
        </div>
         <div class="incoupt">
          <label>收件人电话：</label>
          <el-input placeholder="请输入内容" v-model="telephonenumber" clearable  size="small" name="clearInputValue" @keyup.enter.native="queryselect(true)"></el-input>
        </div>
        <div class="incoupt">
          <label>发票号：</label>
          <el-input placeholder="请输入内容" v-model="Invoiceno" clearable  size="small" name="clearInputValue" @keyup.enter.native="queryselect(true)"></el-input>
        </div>
        <div class="incoupt">
            <label>发票类型：</label>
            <el-select v-model="invoicetype" placeholder="请选择"  size="small">
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
      <el-button type="primary" class="bespoke" @click="newinvoice()">新增发票</el-button>
      <el-button type="primary" class="bespoke" @click="queryselect(true)">查询</el-button>
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
      <invoicestable
        :querydataChild=querydata
        :mypagesize=mysize
        :myStyle=myStyle
        ref="mychild"
        @cpage="getCpage"
        @displayed="getDist">
      </invoicestable>
    </div>
    </div>
  </section>
</template>
<script>
import invoicestable from './invoicestable'
  
  export default {
    name: 'confirmation',
    data() {
      return {
        unitaddress:'',// 单位地址：
        addressee:'',//收件人
        telephonenumber:'',//收件人电话
        Invoiceno:'',//发票号
        invoicetype:'',//发票类型
        invoicetypedata:[],//发票类型数据
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
            "billType": this.invoicetype, //发票类型
            "companyadr": this.unitaddress, //单位地址：
            "people": this.addressee,//收件人
            "tel": this.telephonenumber,//收件人电话
            "code": this.Invoiceno,//发票号
            'currentPage': this.currentPage,// 当前页数  分页
            'pageSize': this.pageSize,//每页显示条数 分页
        };
        console.log(data)
        this.falg = true
        
        this.$api.financial.getfapiaoList(data).then(res => {
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
      newinvoice(){ //新增发票
        this.$refs.mychild.prainvoice();
      },
      getbillType(){ //发票管理数据
      this.$api.financial.getbillType().then(res => {
        this.invoicetypedata = [{value:'',label:'全部'}];
        this.invoicetype = ''
        res.data.data.forEach(item => {
            this.invoicetypedata.push({value:item.dicTypeCode,label:item.dicTypeName})
        });
        console.log(this.invoicetypedata)
        //this.invoicetype = this.invoicetypedata
        console.log(res)
      }).catch(res => {
          this.$alert(res.data.message, '信息提示', {
              dangerouslyUseHTMLString: true
          });
      })
    },
  
   
    },
    mounted() {
      this.parentheight();
      this.getbillType();
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
      invoicestable
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
    text-align: right;
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
