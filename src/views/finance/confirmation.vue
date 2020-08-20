<template>
  <section class="sectlxt">
    <div class="sectlxtBg">
    <div class="inBoxs">
      <div class="inBoxsleft">
        <div class="incoupt">
          <label>任务号：</label>
          <el-input placeholder="请输入内容" v-model="tasknumber"  size="small" clearable name="clearInputValue" @keyup.enter.native="queryselect(true)"></el-input>
        </div>
        <div class="incoupt">
          <label>受检单位：</label>
          <el-input placeholder="请输入内容" v-model="examination"  size="small" clearable name="clearInputValue" @keyup.enter.native="queryselect(true)"></el-input>
        </div>
        <div class="incoupt">
          <label>样品名称：</label>
          <el-input placeholder="请输入内容" v-model="samplename" clearable  size="small" name="clearInputValue" @keyup.enter.native="queryselect(true)"></el-input>
        </div>
        <div class="incoupt">
          <label>查询年份：</label>
          <el-select v-model="selectDateValue" placeholder="请选择"  size="small" @change="yearData">
            <el-option
              v-for="item in selectDate"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        
        <div class="incoupt">
          <label>财务标记状态：</label>
          <el-select v-model="inspectionValue" placeholder="请选择"  size="small">
            <el-option
              v-for="item in inspection"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>  
          </el-select>
        </div>

        <el-collapse-transition>
          <div v-show="show" class="showItem">
            <div class="incoupt">
              <label>状态：</label>
              <el-select v-model="stateValue" placeholder="请选择"  size="small">
                <el-option
                  v-for="item in state"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <!-- <div class="incoupt">
              <label>地区：</label>
              <el-select v-model="regionValue" placeholder="请选择"  size="small">
                <el-option
                  v-for="item in region"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div> -->
            <div class="incoupt">
              <label>科室：</label>
              <el-select v-model="departmentValue" placeholder="请选择"  size="small">
                <el-option
                  v-for="item in department"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class="incouptbig">
               <label>下达日期：</label>
               <el-date-picker
                v-model="releasedate"
                 size="small"
                value-format = 'yyyymmdd'
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="incouptbig">
               <label>上传日期：</label>
               <el-date-picker
                v-model="uploaddate"
                 size="small"
                value-format = 'yyyymmdd'
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="incouptbig">
               <label>任务号区间：</label>
                <el-input placeholder="请输入内容" v-model="sectionstart"  size="small" clearable name="clearInputValue" @keyup.enter.native="queryselect(true)"></el-input>
                &nbsp;-&nbsp;
                <el-input placeholder="请输入内容" v-model="sectionend"  size="small" clearable name="clearInputValue" @keyup.enter.native="queryselect(true)"></el-input>
            </div>
        
          </div>
        </el-collapse-transition>
      </div>
      <div class="inBoxsright">
        <el-button v-if="showbut==0" @click="clickshowbut(1)" type="text" style="color:#32AFF0;marginLeft:6px;">
          收起 <i class="el-icon-arrow-up"></i>
        </el-button>
        <el-button v-if="showbut!=0" @click="clickshowbut(0)" type="text" style="color:#32AFF0;marginLeft:6px;">
          展开 <i class="el-icon-arrow-down"></i>
        </el-button>
      </div>

    </div>
    <div class="lxt_selsctBtn">
      <el-button type="primary" class="bespoke" @click="reminder">生成催款单</el-button>
      <el-button type="primary" class="bespoke" @click="queryselect(true)">查询</el-button>
      <el-button type="info" class="bespoke" @click="resetList">重置</el-button>
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
      <mation
        :querydataChild=querydata
        :mypagesize=mysize
        :myStyle=myStyle
        ref="mychild"
        @cpage="getCpage"
        @displayed="getDist">
      </mation>
    </div>
    </div>
  </section>
</template>
<script>
import mation from './mation'
  
  export default {
    name: 'confirmation',
    data() {
      return {
        selectDate: [],//查询年份
        selectDateValue: '',
        inspection: [
            {value: "0", label: "全部"},
            {value: "1", label: "已标记"},
            {value: "2", label: "财务已催款"},
            {value: "3", label: "未标记"}
        ],//财务标记状态：
        inspectionValue: '',
        state: [
          {value: "3", label: "全部"},
          {value: "1", label: "科室已核实"},
          {value: "2", label: "科室未核实的项目"},

        ], //状态 数组
        stateValue: '3', //状态 回显
        // region:[],//地区
        // regionValue:[],//地区
        department:[],//科室
        departmentValue:'',//科室

        samplename: '',//样品名称
        tasknumber: '',//任务号
        examination: '',//受检单位
        sectionstart:'',//区间号开始
        sectionend:'',//区间号结束
        releasedate:'',//下达日期
        uploaddate:'',//上传日期
        issue: '',//下达日期

        arrYear: [{value: '', label: '全部'}],//年份
        num: 5, // 模块选择
        querydata: [],  //子组件显示的数据
        currentPage: 1, // 当前页数  分页 (默认)
        pageSize: 10,   //每页显示条数 分页(默认)
        mysize: '', //提供刊版页接口  分页显示条数
        show: false, // 筛选条件的显示和隐藏
        showbut: 1, // 展开和收起的切换
        myStyle: false, //分页样式选择
        falg: false,// 查询动画
      }
    },
    methods: {
      clickshowbut(num) { // 筛选条件的显示和隐藏
        this.show = !this.show;
        this.showbut = num;
        this.parentheight();
      },
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
        //alert(this.currentPage)
        // if (this.reportValue === this.report[0].label) {
        //   this.reportValue = 5;
        // }
        let issueyear;
        if (this.issue) {
          issueyear = this.issue.replace(/-/g, ""); //下达日期 正则去掉‘-’
        } else {
          issueyear = '';
        }
        const data = {
          'taskCode': this.tasknumber, //任务号
          'companyCheck': this.examination, //受检单位
          'sampleName': this.samplename, //样品名称
          'searchdate':  this.selectDateValue,//年份
          'tsign': this.inspectionValue,//财务标记状态
          'ifrom': this.regionValue,// 地区
          'deptid': this.departmentValue,//科室
          'accountsign' :  this.stateValue, //状态
          'searchdate2':this.releasedate[0],//下达日期 开始
          'searchdate3' : this.releasedate[1],//下达日期 结束
          'searchdate4':this.uploaddate[0],//上传日期 开始
          'searchdate5' : this.uploaddate[1],//上传日期  结束
          'taskCode2': this.sectionstart,//任务号区间  开始
          'taskCode3': this.sectionend,//任务号区间  结束
          'currentPage': this.currentPage,// 当前页数  分页
          'pageSize': this.pageSize,//每页显示条数 分页
        };
        
        this.falg = true
        this.$api.financial.lxtfinancialList(data).then(res => {
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
      yearDate() { //遍历年份  从2007开始到当前年份
        const myDate = new Date();
        let thisYear = myDate.getFullYear();
        let Section = thisYear - 2007;
        for (let i = 0; i <= Section; i++) {
          let _thisYear = thisYear--;
          let obj = {value: _thisYear, label: _thisYear};
          this.arrYear.push(obj);
        }
        this.selectDate = this.arrYear;
        this.selectDateValue = this.selectDate[1].label;
      },
      yearData(){
        window.sessionStorage.setItem('year',this.selectDateValue)
      },
      reportingType() {
        this.$api.lxtinitial.reportaudit().then(res => {
          if (res.data.respCode == 0) {
            let data = res.data.data.checkroles; //报告类型
            data.forEach(item => {
              let obj = {value: item.typeABC, label: item.typeName};
             // this.report.push(obj);
            });
           // this.reportValue = this.report[0].label;

            let repodata = res.data.data.checktypeList;  //检验类型
            repodata.forEach(item => {
              let obj = {value: item.typeABC, label: item.typeName + '-' + item.area};
              this.inspection.push(obj);
            });

          } else {
            this.$alert(res.data.message, '信息提示', {
              dangerouslyUseHTMLString: true
            });
          }
        })
      },
      resetList() { //重置
        this.selectDateValue = '';
        this.inspectionValue = '';
        this.samplename = '';
        this.tasknumber = '';
        this.examination = '';
        this.issue = '';
      },
      reminder(){ //生产催款单
         this.$refs.mychild.reminderFn()
      },
      
      getDepartment(){  //获取科室数据
        this.department = []
        this.$api.financial.departmentList().then(res => {
          console.log(res.data.data)
          let orgList = res.data.data;
          orgList.forEach(item => {
            let obj = {value: item.id, label: item.org_name}
            this.department.push(obj)
          });
        })
      },
      // getregion(){ //获取地区数据
      //   this.region =[];
      //   this.$api.financial.regionList().then(res => {
      //     console.log(res.data.data)
      //     let orgList = res.data.data;
      //     orgList.forEach(item => {
      //       let obj = {value: item.typeName, label: item.typeName}
      //       this.region.push(obj)
      //     });
      //   })
      // }
    },
    mounted() {
      //this.reportingType();
      this.yearDate();
      this.parentheight();
      this.getDepartment();
      //this.getregion();
      this.yearData()
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
      mation
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
