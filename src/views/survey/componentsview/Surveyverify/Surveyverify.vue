<template>
  <!-- 报告初校 -->
  <section class="sectlxt">
    <div class="sectlxtBg">
      <div class="inBoxs">
        <div class="inBoxsleft">
          <div class="incoupt">
            <label>查询年份：</label>
            <el-select v-model="selectDateValue" placeholder="请选择" size="small">
              <el-option
                v-for="item in selectDate"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="incoupt">
            <label>检验类型：</label>
            <el-select v-model="inspectionValue" placeholder="请选择" size="small">
              <el-option
                v-for="item in inspection"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="incoupt">
            <label>样品名称：</label>
            <el-input placeholder="请输入内容" v-model="samplename" size="small" clearable @keyup.enter.native="queryselect" name="clearInputValue"></el-input>
          </div>

          <div class="incoupt">
            <label>任务号：</label>
            <el-input placeholder="请输入内容" v-model="tasknumber" clearable size="small" name="clearInputValue"
                      @keyup.enter.native="queryselect"></el-input>
          </div>
          <div class="incoupt">
            <label>受检单位：</label>
            <el-input placeholder="请输入内容" v-model="examination" clearable size="small" name="clearInputValue"
                      @keyup.enter.native="queryselect"></el-input>
          </div>
          <el-collapse-transition>
            <div v-show="show" class="showItem">


              <div class="incoupt">
                <label>规格型号：</label>
                <el-input placeholder="请输入内容" v-model="specification" clearable size="small"  name="clearInputValue"
                          @keyup.enter.native="queryselect"></el-input>
              </div>
              <div class="incoupt">
                <label>下达日期 >= &nbsp;</label>
                <el-date-picker
                  v-model="issue"
                  type="date"
                  size="small"
                  value-format=”yyyy-MM-dd”
                  placeholder="选择日期">
                </el-date-picker>
              </div>
              <div class="incoupt">
                <label>报告类型：</label>
                <el-select v-model="reportValue" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in report"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
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
        <el-button type="primary" @click="queryselect">查询</el-button>
        <el-button type="info" @click="resetList">重置</el-button>
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
        <verify
          :querydataChild=querydata
          :queryTypeChild=queryType
          :mypagesize=mysize
          :myStyle=myStyle
          ref="mychild"
          @cpage="getCpage"
          @displayed="getDist">
        </verify>
      </div>
    </div>
  </section>
</template>
<script>
  import verify from './verify'

  export default {
    name: 'surveyverify',
    data() {
      return {
        selectDate: [],//年份
        selectDateValue: '',
        inspection: [{value: "", label: "全部"}],//检验类型
        inspectionValue: '',
        report: [], //报告类型
        reportValue: '',
        samplename: '',
        tasknumber: '',
        examination: '',
        specification: '',
        issue: '',
        arrYear: [{value: '', label: '全部'}],
        num: 8, // 模块选择
        querydata: [],  //子组件显示的数据
        queryType: {}, //父组件的查询条件
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
        this.parentheight()
      },
      parentheight() {
        let oLxtSelsctBtn = document.querySelector('.lxt_selsctBtn').offsetHeight
        if (this.show) {
          this.$refs.mychild.myWindow(117, oLxtSelsctBtn)
        } else {
          this.$refs.mychild.myWindow(65, oLxtSelsctBtn)
        }
      },
      getCpage(data) {
        this.currentPage = data
      },
      getDist(data) {
        this.pageSize = data
      },
      queryselect() {  //查询按钮
        if (this.reportValue === this.report[0].label) {
          this.reportValue = 8;
        }
        ;
        let issueyear;
        if (this.issue) {
          issueyear = this.issue.replace(/-/g, ""); //下达日期 正则去掉‘-’
        } else {
          issueyear = ''
        }
        const data = {
          'companyCheck': this.examination, //受检单位
          'process_instance_id': this.reportValue, //报告类型
          'sampleName': this.samplename, //样品名称
          'sampleType': this.specification, //规格型号
          'searchdate': this.selectDateValue, //查询年月
          'searchdate2': issueyear.replace(/\”/g, ""),
          'taskCode': this.tasknumber,//任务号
          'wttype': this.inspectionValue,//检验类型编码
          'currentPage': this.currentPage,// 当前页数  分页
          'pageSize': this.pageSize,//每页显示条数 分页
        };
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
      yearDate() { //遍历年份  从2007开始到当前年份
        const myDate = new Date();
        let thisYear = myDate.getFullYear();
        let Section = thisYear - 2007;
        for (let i = 0; i <= Section; i++) {
          let _thisYear = thisYear--;
          let obj = {value: _thisYear, label: _thisYear};
          this.arrYear.push(obj);
        }
        ;
        this.selectDate = this.arrYear;
        this.selectDateValue = this.selectDate[1].label;
      },
      gitTestType() { //检验类型
        this.$api.lxtinitial.gitTestdata().then(res => {
          if (res.data.respCode == 0) {
            let data = res.data.data;
            data.forEach(item => {
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
      reportingType() { //报告类型
        this.$api.lxtinitial.lxtreport(this.num).then(res => {
          //console.log(res)
          if (res.data.respCode == 0) {
            let data = res.data.data;
            data.forEach(item => {
              let obj = {value: item.typeABC, label: item.typeName};
              this.report.push(obj);
            });
            this.reportValue = this.report[0].label
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
        this.specification = '';
        this.issue = '';
      },
    },
    mounted() {
      this.reportingType();
      this.yearDate();
      this.gitTestType();
      this.parentheight()
      //this.departmentType();
      setTimeout(()=>{
        this.queryselect();
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
          this.queryselect()
        }
      }
    },
    components: {
      verify
    },
    watch: {
      reportValue() {
        if (this.reportValue == 8) {
          this.reportValue = this.report[0].label;
        }
      }
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

  .lxt_selsctBtn {
    width: 100%;
    text-align: right;
    margin-bottom: 1vw;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 1vw;
    margin-left: 0;

    .el-button--primary {
      height: 30px;
      padding: 5px 20px;
      background: linear-gradient(90deg, rgb(96, 157, 248), rgb(84, 183, 235))
    }

    .el-button--info {
      height: 30px;
      padding: 5px 20px;
    }
  }

  .sectlxt {
    background-color: #eee;

    .sectlxtBg {
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

  .inBoxsright {
    width: 4%;
  }

  .inBoxsright button {
    margin-top: 1vw;
  }

  .showcont {
    overflow: hidden;
  }

  /deep/ .el-loading-spinner {
    width: 100%;
    margin-top: -21px;
    text-align: center;

  }
</style>
