<template>
  <!-- 再次分配 -->
  <div class="taskallot_box" :style="{ padding: isComing != 0 ? '10px':'0'}">
    <div class="allot" :style="{
      display: isComing != 0 ? 'flex':'block'
    }">
      <div class="allot_top" v-if="isComing != 0">
        <div style="display: flex;align-items: center;">
          <el-form :inline="true" :model="formLabelAlign"
                   class="allot_form" size="small">
            <div style="display: flex;justify-content: space-between;">
              <el-form-item style="width:19%">
                <span slot="label" class="myLabel">报告编号 :</span>
                <el-input v-model="formLabelAlign.name" @keyup.enter.native="searchEnterFun" name="clearInputValue"></el-input>
              </el-form-item>
              <el-form-item style="width:19%">
                <span slot="label" class="myLabel">受检单位 :</span>
                <el-input v-model="formLabelAlign.unit" @keyup.enter.native="searchEnterFun" name="clearInputValue"></el-input>
              </el-form-item>
              <el-form-item style="width:19%">
                <span slot="label" class="myLabel">样品名称 :</span>
                <el-input v-model="formLabelAlign.sample_name" @keyup.enter.native="searchEnterFun" name="clearInputValue"></el-input>
              </el-form-item>
              <el-form-item style="width:19%">
                <span slot="label" class="myLabel">规格型号 :</span>
                <el-input v-model="formLabelAlign.specifications" @keyup.enter.native="searchEnterFun" name="clearInputValue"></el-input>
              </el-form-item>
              <el-form-item style="width:19%">
                <span slot="label" class="myLabel">商标 :</span>
               <el-input v-model="formLabelAlign.trademark" @keyup.enter.native="searchEnterFun" name="clearInputValue"></el-input>
              </el-form-item>
            </div>
          </el-form>

        </div>
        <div class="allot_form_but">
          <el-button type="primary" class="bespoke" @click="resetForm(formLabelAlign,1,1)">查询</el-button>
        </div>
        <!-- 下面的table仅展示表头 -->
        <el-table ref="table" v-loading="isLoading" class="copyStyle" v-if="isfoot"
                    border
                    :cell-style="cellStyle"
                    :header-cell-style="{
                              'background-color': '#F3F6FD',
                              'color': '#606266',
                              'padding': '10px 0'
                          }">
            <el-table-column type="index" align="center" label="序号" width="70%" :resizable="false"></el-table-column>
            <el-table-column  label="任务号" align="center" :resizable="false"></el-table-column>
            <el-table-column  label="受检单位" align="center" :resizable="false"></el-table-column>
            <el-table-column  label="样品名称" align="center" :resizable="false"></el-table-column>
            <el-table-column  label="规格型号" align="center" :resizable="false"></el-table-column>
            <el-table-column  label="商标" align="center" :resizable="false"></el-table-column>
            <el-table-column label="操作" align="center" width="200" :resizable="false"></el-table-column>
        </el-table>
      </div>

      <!-- 表格 -->
      <div class="roughly_tabel" :style="{
        paddingBottom: isComing != 0 ? '0' : '20px',
        marginTop: isComing != 0 ? '-60px' : '0'
      }">
        <div class="table-box">
          <el-table ref="table" v-loading="isLoading"
                    border :data="tableData"
                    :cell-style="cellStyle"
                    :show-header="isnetfoot"
                    :header-cell-style="{
                              'background-color': '#F3F6FD',
                              'color': '#606266',
                              'padding': '10px 0'
                          }">
            <el-table-column type="index" align="center" label="序号" width="70%" :resizable="false"></el-table-column>
            <el-table-column prop="taskCode" label="任务号" align="center" :resizable="false"></el-table-column>
            <el-table-column prop="companyCheck" label="受检单位" align="center" :resizable="false"></el-table-column>
            <el-table-column prop="sampleName" label="样品名称" align="center" :resizable="false"></el-table-column>
            <el-table-column prop="sampleType" label="规格型号" align="center" :resizable="false"></el-table-column>
            <el-table-column prop="sampleTrademark" label="商标" align="center" :resizable="false"></el-table-column>
            <el-table-column label="操作" align="center" width="200" :resizable="false">
              <template slot-scope="scope">
                <el-button type="text" style="color:#32AFF0;marginLeft:6px;"
                           @click="toogleExpand(scope.row)">浏览
                </el-button>
                <el-button type="text" style="color:#32AFF0;marginLeft:6px;"
                           @click="toogleDetails(scope.row)">详情
                </el-button>
              </template>
            </el-table-column>

            <el-table-column type="expand" width="1" :resizable="false">
              <template slot-scope="scope">
                <!-- 二级弹出 -->
                <div class="lxt_title" style="margin-bottom:10px;">
                  <el-button type="primary" @click="onClickXgdReport(scope.row)" style="
                                          height: 30px;
                                          padding: 5px 20px;
                                          margin: 0;
                                          background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
                                          color:#fff;
                                      ">任务分配
                  </el-button>
                  <el-button type="primary" @click="onClickfallback(scope.row)" style="
                                          height: 30px;
                                          padding: 5px 20px;
                                          margin: 0;
                                          background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
                                          color:#fff;
                                      ">回退
                  </el-button>
                </div>
                <div>
                  <el-table ref="Table2" border v-loading="loading2"
                            @selection-change="dataSelect"
                            :data="tableData2"
                            :cell-style="tableRowStyle"
                            :header-cell-style="{
                                              'background-color': 'rgba(243,246,253,1)',
                                              'color': '#606266',
                                              'padding': '10px 0'
                                          }">
                    <el-table-column type="index" align="center" label="序号" width="70%" :resizable="false"></el-table-column>
                    <el-table-column type="selection" align="center" :resizable="false"></el-table-column>
                    <el-table-column prop="itemsName" label="检验项目" align="center" :resizable="false"></el-table-column>
                    <el-table-column prop="itemsBasis" label="检验依据" align="center" :resizable="false"></el-table-column>
                    <el-table-column prop="itemsFrederickItme" label="检验方法" align="center" :resizable="false"></el-table-column>


                    <el-table-column prop="testRoomName" label="检验科室" align="center" :resizable="false" >
                        <template slot-scope="scope">
                            <span v-if="tableData2[scope.$index].needTest == 0 ? false : true">{{tableData2[scope.$index].testRoomName}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="assignee" label="检验员" align="center" :resizable="false">
                      <template slot-scope="scope">
                        <el-select
                          size="mini"
                          style="width:80%;"
                          v-model="tableData2[scope.$index].assignee"
                          v-if="tableData2[scope.$index].needTest == 0 ? false : true"
                          @change="currentSel(tableData2[scope.$index].id,scope.row,scope.$index)">
                          <el-option v-for="(item,i) in tableData2[scope.$index].jianYanYuanList" :key="i" :label="item.loginName+'_'+item.name"
                                     :value="item.loginName">
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>


                    <el-table-column prop="orgName" label="报告编辑科室" align="center" :resizable="false" >
                        <template slot-scope="scope">
                            <span v-if="tableData2[scope.$index].needReport == 0 ? false : true">{{tableData2[scope.$index].orgName}}</span>
                        </template>

                    </el-table-column>
                    <el-table-column prop="itemsUpdator" label="报告编辑人" align="center" :resizable="false" >
                        <template slot-scope="scope">
                            <span v-if="tableData2[scope.$index].needReport == 0 ? false : true">{{tableData2[scope.$index].itemsUpdator}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="checkTypeID" label="流转信息" align="center" style="color:#32AFF0;" :resizable="false">
                      <template slot-scope="scope">
                        <el-button type="text" style="color:#32AFF0;marginLeft:6px;"
                                   @click="clickFindWorkLog(scope.row)">
                          流转
                        </el-button>
                      </template>
                    </el-table-column>

                    <el-table-column type="expand" width="1" :resizable="false">
                      <template>
                        <!-- 三级弹出 -->
                        <el-table border :data="tableData3" v-loading="loading3" style="width: 100%"
                                  :header-cell-style="{
                                              'background-color': 'rgba(243,246,253,1)',
                                              'color': '#606266',
                                              'padding': '10px 0'
                                          }">
                          <el-table-column type="index" prop="flowtid" align="center" label="序号"
                                           width="70%" :resizable="false"></el-table-column>
                          <el-table-column align="center" label="节点名称" :resizable="false">
                            <template slot-scope="scope">
                              <span :class="tableData3[scope.$index].reason != null && tableData3[scope.$index].reason.length > 0 ? 'active' : ''">{{scope.row.flowname}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="create_date" align="center" label="开始时间"
                                           :resizable="false"></el-table-column>
                          <el-table-column prop="end_date" align="center" label="结束时间"
                                           :resizable="false"></el-table-column>
                          <el-table-column prop="name" align="center" label="负责人" :resizable="false"></el-table-column>
                          <el-table-column prop="reason" align="center" label="处理意见"
                                           :resizable="false"></el-table-column>
                        </el-table>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 分页器 -->
      <div class="lxt_block" v-if="isComing != 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5,10,15]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>

      <!-- 回退 -->
      <el-dialog :title="title" :visible.sync="dialogBinding" @open="restFn"
                 class="binding" style="overflow:hidden;width:100%;">
        <div v-if="dialogBinding" class="bottom">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="选择节点 :">
              <el-select size="mini" style="width:140px;" v-model="ruleshi" :clearable="true">
                <el-option v-for="(item,i) in fallback" :key="i"
                           :label="item.activityName" :value="item.activityId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="原因 :"
                          prop="textarea"
                          :rules="[
                  { required: true, message: '原因不能为空'},
                  { min:1,max:200, required: true, message: '长度不能大于二百'}
              ]"
            >
              <el-input type="textarea" :rows="4" placeholder="请输入内容"
              maxlength="200"
                  show-word-limit
                        style="width:80%;" v-model="ruleForm.textarea">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button @click="sadsd">取 消</el-button>
          <el-button type="primary" @click="dialogBindings">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 详情 -->
      <el-dialog
        :title="dialogFormTitle"
        :visible.sync="dialogFormVisible"
        v-if="dialogFormVisible"
        v-bind="{
          modal: false,
          width:'99.9%',
          top:'0',
        }"
        :custom-class="'taskDetail_dialog1'"
        @close="closeFn"
      >
        <taskDetail
          ref="taskDetail"
          saveType="2"
          showForceSave="1"
          :other-taskinfor="mlyTaskinfor"
        />
      </el-dialog>

    </div>
  </div>
</template>
<script>
import taskDetail from '@/views/taskdelegation/componentstask/acceptance.vue'
import { setAuthentication } from '@/authenticationDocument/authenticationDocument.js'
  export default {
    name: 'redistribution',
    props: ['myComing', 'myTableData_2', 'myLoading', 'querydata'],
    watch: {
      myComing(value) {
        this.isComing = value;
      },
      myTableData_2(value) {
        this.tableData = value;
      },
      myLoading(value) {
        this.isLoading = value;
      },
      querydata(value) {
        this.myQuerydata = value;
      }
    },
    data() {
      return {
        isComing: 1,// 当此模块用于看板页显示时候,不显示表单查询部分
        isLoading: false,
        loading2: false,
        loading3: false,
        myQuerydata: null,

        dialogFormTitle: '详情',
        dialogBinding: false,
        dialogFormVisible: false,
        title: '回退',
        inspectids: [],  // id
        musterbs: [],    // 主检人
        report_type: '',
        processInstanceIdName:'',
        loginName: '',
        ruleForm: {
          name: '',
          textarea: ''
        },
        formLabelAlign: {
          name: '',
          unit: '',
          names: '',
          sample_name: '',
          specifications: '',
          report_type: '',
          year: '',
          inspection_type: '',
          date1: '',
          trademark:'',//商标
        },
        reporType: [], //报告类型
        findCheckType: [], //检验类型
        arrs: [],
        ruleshi: '',

        yearlist: [
          {
            year: '全部',
            value: ''
          }
        ],

        tableData: [],
        tableData2: [],
        tableData3: [],
        fallback: [],//回退
        multipleSelection: [],  //全选
        currentPage: 1, // 当前页数  分页
        pageSize: 5,   //每页显示条数 分页
        total: 0,
        ids: null,
        str: '',
        strs: '',
        multi: [],
        numb: 0,
        numb2: 0,
        numb3: '',
        selVal: '',
        multipleSelections: [],
        aaa: [],
        ars: '',
        ind: '',
        bb: '',
        findOffice : [], //报告编辑科室  数据
        findOfficeitem:'',//报告编辑科室默认
        findOfficeStr : [], //报告编辑科室  id
        findOfficeStrdata:'',//存储报告编辑科室所有id

        finditing : [], //报告编辑人  数据
        finditingitem : '', //报告编辑人默认
        finditingstr : [], //报告编辑人  id
        finditingdata:'',//存储报告编辑人所有id

        selone : 0,  //判断提交的报告中是否存在 不需要显示的 科室主任和检验部科室
        selone1 : 0,  //判断提交的报告中是否存在 需要显示的 科室主任和检验部科室
        authenticationField:{ //鉴权字段
          manu:false,
        },
        isfoot:true,
        isnetfoot:false,

        mlyTaskinfor:null,
      }
    },
    components: {
      taskDetail
    },
    updated() {
    },
    methods: {
      /*
      * 功能: 刷新弹框内的数据
      * */
     closeFn(){
        if (this.myComing == 0){
          // console.log('首页引用时的查询')
          this.initdata_2()
        } else {
          console.log('这个页面的查询调用')
          this.resetForm()
        }
      },
      restFn() {
        this.ruleForm = {
          name: '',
          textarea: ''
        }
      },

      /*
      * 功能:当前可选年份范围
      * */
      yearDate() {
        // 遍历年份 从2007开始到当前年份
        const myDate = new Date();
        var thisYear = myDate.getFullYear();
        var Section = thisYear - 2007;
        for (var i = 0; i <= Section; i++) {
          var _thisYear = thisYear--;
          var obj = {value: _thisYear, year: _thisYear};
          this.yearlist.push(obj);
        }
        // this.formLabelAlign.year = this.yearlist[0].year;
      },


      //回车
      searchEnterFun(e) {
        var keyCode = window.event ? e.keyCode : e.which;
        if (keyCode == 13) {
          this.resetForm(this.formLabelAlign, 1, 5)
        }
      },
      /*
      * 功能: 读取父组件传入的自定义属性
      * */
      initProps() {
        this.isComing = this.myComing;
        this.tableData = this.myTableData_2;
        this.isLoading = this.myLoading;
        this.myQuerydata = this.querydata;
      },
      //下拉框改变
      currentSel(selVal, row, index) {  //检验部科室主任
        this.selVal = selVal;
        let bbw = []
        this.ars = row.assignee
        this.ind = row.id
        let shu = 0
        shu = this.tableData2.length
        this.tableData2.slice(index, shu).map(item => {
          item.assignee = this.ars
        })

        if (this.multi.length > 0) {
          this.multi[index].assignee = this.ars
          bbw = this.multi
          console.log(bbw)
          this.dataSelect(bbw)
        }
      },

      cellStyle({row, column, rowIndex, columnIndex}) {
        // console.log(row.flowStatus);
        if (columnIndex === 1) { //指定坐标
          if (row.flowStatus === 1) {
            return 'background:pink'
          } else if (row.flowStatus === 2) {
            return 'background:yellow'
          } else {
            return ''
          }
        } else {
          return ''
        }
      },
      tableRowStyle({row, rowIndex}) {
        if (row.flowStatus === 1) {
          return 'background-color: pink'
        } else if (row.flowStatus === 2) {
          return 'background-color: yellow'
        } else {
          return ''
        }
      },
      // 详情
      toogleDetails(row) {
        let that = this;
        that.dialogFormVisible = true;
        this.mlyTaskinfor = {
          'otherFrom': 'other1',
          'params': {
            'taskid': row.id,
            'processInstanceId': this.report_type
          }
        }
        // this.$api.taskmanage.apiEditTaskInfo
      },

      initdata() {
        //  this.resetForm(this.formLabelAlign,this.currentPage,this.pageSize);
        let obj = {
          companyCheck: this.formLabelAlign.unit,
          process_instance_id: this.report_type,
          processInstanceIdName:this.processInstanceIdName,
          sampleName: this.formLabelAlign.sample_name,
          sampleType: this.formLabelAlign.specifications,
          searchdate: this.formLabelAlign.year,
          searchdate2: this.formLabelAlign.date1,
          taskCode: this.formLabelAlign.name,
          wttype: this.formLabelAlign.inspection_type,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          sampleTrademark:this.formLabelAlign.trademark,
        };
        this.$api.allot.findtasklist(obj).then(res => {
          this.tableData = res.data.data;
          let that = this;
          this.tableData.map(item => {
            that.numb = item.flowStatus
          });
          if (this.tableData.length > 0) {
            this.total = this.tableData[0].total;
          }
        })
      },

      /*
      * 功能: 看板页下的表格 回退/提交二级表格 时的数据请求回调
      * */
      initdata_2() {
        console.log('看板页专用');
        this.$api.systemPublicationpage.findTaskList(this.myQuerydata).then(res => {
          if (res.data.ok && res.data.data && res.data.data.length != 0) {
            this.tableData = res.data.data;
            this.total = res.data.data[0].total;
          } else {
            this.$message.warning({message: res.data.message, duration: 1500});
          }
        }).catch(err => {
          console.log(err);
          this.$message.error({message: err.data.message, duration: 1500});
        })
      },

      // 提交多选
      dataSelect(val) {

        this.multi = val;
        this.multipleSelections = []
        this.selone = 0;
        this.selone1 = 0;
        let multipleSelection = [];
        let bainjike = []
        let bainjiren = []
        // let multipleSelections = [];
        this.multi.map(item => {
            multipleSelection.push(item.id)
            bainjike.push(item.orgName)
            bainjiren.push(item.itemsUpdator)
        });
        this.str = multipleSelection.join(',');
        console.log(this.str);
        console.log(val);
        val.map(items => {
          if (items.assignee == '') {
            this.strs = ''
          } else {
            this.multipleSelections.push(items.assignee)
            if (this.multipleSelections > 1) {
              this.strs = this.multipleSelections.join(',');

            }
            this.strs = this.multipleSelections.join();
          }
          if(items.needTest == 0){
            this.selone ++
          }
          if(items.needTest != 0){
            this.selone1 ++
          }
        });



        this.findOfficeStrdata = bainjike.toString()
        this.finditingdata = bainjiren.toString()

        console.log(this.strs)
        console.log(this.findOfficeStrdata)
        console.log(this.finditingdata)

      },
      //校验
      check(inspectids, musterbs) {
        let inspectidArry = this.toArry(inspectids)
        let musterbArry = this.toArry(musterbs)
        if (inspectidArry.length == musterbArry.length) {
          return true
        } else {
          return false
        }
      },
      //字符串转数组
      toArry(params) {
        let lzyarry = []
        let lzyRet = []
        if (params) {
          lzyarry = params.split(',')
        }
        lzyarry.map(item => {
          if (item != '') {
            lzyRet.push(item)
          }
        })
        return lzyRet
      },

      // 提交
      onClickXgdReport(row) {
      let that = this
        let obj = {
          batchflag: "0",   //0提交下一步，2 是从检验报告状态提交到无发票号码，3 是从检验报告状态提交到无整改证明
          inspectids: this.str,    //检验项目id,多个‘,’分割
          testPerson : this.strs,   //主检人登录人，多个‘,’分割
          musters: this.finditingdata,  //编辑人，多个‘,’分割
          orgtype: this.findOfficeStrdata,     //编辑科室，多个‘,’分割
          searchdate: this.formLabelAlign.year,  //查询日期
          toFinish: "0",    //完成情况 0未完成 1直接完成
          zhangs: "",   //公章信息，传value,多个‘,’分割
          process_instance_id: this.report_type,
          processInstanceIdName:this.processInstanceIdName,

        };
        console.log(this.ars.length, this.multi)
        console.log(obj)
        if (this.multi.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择后提交!',
            duration: 1500
          });
        }
        // else if(this.selone1 > 0){
        //     if (this.ars == '') {
        //       this.$message.error({message: `请选择科室主任再提交!`, duration: 1500});
        //     }else{
        //        if (!that.check(obj.inspectids, obj.testPerson)) {
        //           that.$message.error({message: `所选数据科室主任为必填项!`, duration: 1500});
        //           return
        //         }
        //       submission()
        //     }
        // }
        else {
          // if(this.multi.length < this.ars.length)
          submission()
        }

        function submission(){

          that.$confirm('确定提交吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            that.$api.allot.taskToDoNext(obj).then(res => {
              if (res.data.respCode == '0') {
                that.$message.success({message: '提交成功!', duration: 1500});
                if (that.tableData2.length - that.multi.length == 0) {
                  that.isComing != 0 ? that.initdata() : that.initdata_2()
                } else {
                  let objs = {
                    companyCheck: that.formLabelAlign.unit,
                    process_instance_id: that.report_type,
                    processInstanceIdName:that.processInstanceIdName,
                    sampleName: that.formLabelAlign.sample_name,
                    sampleType: that.formLabelAlign.specifications,
                    searchdate: that.formLabelAlign.year,
                    searchdate2: that.formLabelAlign.date1,
                    taskCode: that.formLabelAlign.name,
                    wttype: that.formLabelAlign.inspection_type,
                    iddd: row.id
                  };
                  that.obss(objs)
                  that.$forceUpdate()
                }
              } else {
                that.$message.error({message: `任务分配${res.data.message}!,`, duration: 1500});
              }
            }).catch(error => {
              that.$message.error(error.data.message);
            });
            that.strs = '';
            /*
            * 功能:
            *   that.isComing = 0 表示看板页 的表格
            *   that.isComing = 1 表示任务分配页 的表格
            * */
            that.isComing != 0 ? that.initdata() : that.initdata_2()
          }).catch(() => {
          });
        }
      },
      // 回退
      onClickfallback(row) {
        this.bb = row.id;
        let businessKey = this.str;
        let isShowMainNode = false;
        if (this.multi.length === 0) {
          this.$message.error({message: '请选择后回退!', duration: 1500});
        } else {
          this.dialogBinding = true;
          this.$api.allot.findBackFlow(businessKey,isShowMainNode).then(res => {
            this.fallback = res.data.data;
            this.ruleshi =res.data.data[0].activityId;
          })
        }
      },
      //回退取消
      sadsd() {
        this.dialogBinding = false;
        this.ruleForm.textarea = '';
      },
      //回退确定
      dialogBindings() {
        let params = {
          backprocessinstance: this.ruleshi,   //当前进度实例id 2-任务分配 3-报告检测 4-校验报告 5-报告审核 6-报告批准 7-报告归档 8-初次校对
          inspectids: this.str,  //检测项目id
          process_instance_id: this.report_type,
          processInstanceIdName:this.processInstanceIdName,
          reason: this.ruleForm.textarea,  //回退原因
        };
        console.log(params)
        this.$api.allot.goBack(params).then(res => {
          if (res.status == 200) {
            this.$message.success({message: '回退成功!', duration: 1500});
            this.dialogBinding = false
            this.ruleForm.textarea = ''
            if (this.tableData2.length - this.multi.length == 0) {
              this.isComing != 0 ? this.initdata() : this.initdata_2()
            } else {
              let objs = {
                companyCheck: this.formLabelAlign.unit,
                process_instance_id: this.report_type,
                processInstanceIdName:this.processInstanceIdName,
                sampleName: this.formLabelAlign.sample_name,
                sampleType: this.formLabelAlign.specifications,
                searchdate: this.formLabelAlign.year,
                searchdate2: this.formLabelAlign.date1,
                taskCode: this.formLabelAlign.name,
                wttype: this.formLabelAlign.inspection_type,
                iddd: this.bb
              };
              this.obss(objs)
              this.$forceUpdate()
            }
          } else {
            this.$message.error({message: '回退失败!', duration: 1500});
          }
          /*
            * 功能:
            *   this.isComing = 0 表示看板页 的表格
            *   this.isComing = 1 表示任务分配页 的表格
            * */
          this.isComing != 0 ? this.initdata() : this.initdata_2()
          this.strs = ''

        }).catch(error => {
          this.$message.error(error.data.message);
        })
      },

      // 查询
      resetForm(formLabelAlign, currentPage, pageSize) {
        var issueyear;
        if (this.formLabelAlign.date1) {
          issueyear = this.formLabelAlign.date1.replace(/-/g, ""); //下达日期 正则去掉‘-’
        } else {
          issueyear = '';
        }
        let obj = {
          companyCheck: this.formLabelAlign.unit,
          process_instance_id: this.report_type,
          processInstanceIdName:this.processInstanceIdName,
          sampleName: this.formLabelAlign.sample_name,
          sampleType: this.formLabelAlign.specifications,
          searchdate: this.formLabelAlign.year,
          searchdate2: issueyear.replace(/\”/g, ""),
          taskCode: this.formLabelAlign.name,
          wttype: this.formLabelAlign.inspection_type,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          sampleTrademark:this.formLabelAlign.trademark,

        };
        // console.log(obj);
        this.$api.allot.findtasklist(obj).then(res => {
          if (res.data.ok && res.data.data) {
            this.tableData = res.data.data;
            if (this.tableData.length > 0) {
              this.total = this.tableData[0].total;
            } else {
              this.currentPage = 1;
              this.pageSize = 5;
              this.total = 0;
            }
          } else {
            this.$message.error({message: res.data.message, duration: 1500});
          }
        }).catch(err => {
          console.log(err);
          this.$message.error({message: err.data.message, duration: 1500});
        })
      },
      handleDetailed(index, row) {//详细
        this.dialogFormVisible = true;
        console.log(index, row);
      },
      handleExport(index, row) {  //导出
        console.log(index, row);
      },
      toogleExpand(row) {  // 第一个弹出层
        this.findOfficeMode();
        this.multi = []
        this.loading2 = true;
        let obj = {
          companyCheck: this.formLabelAlign.unit,
          process_instance_id: this.report_type,
           processInstanceIdName:this.processInstanceIdName,
          sampleName: this.formLabelAlign.sample_name,
          sampleType: this.formLabelAlign.specifications,
          searchdate: this.formLabelAlign.year,
          searchdate2: this.formLabelAlign.date1,
          taskCode: this.formLabelAlign.name,
          wttype: this.formLabelAlign.inspection_type,
          iddd: row.id
        };
        this.obss(obj);
        let $table = this.$refs.table;
        this.tableData.map((item) => {
          if (row.id != item.id) {
            $table.toggleRowExpansion(item, false)
          }
        });
        $table.toggleRowExpansion(row);
        this.strs = ''
      },
      obss(obj) {
        this.$api.allot.findJobContent(obj).then(res => {
          this.tableData2 = res.data.data.list;
          this.arrs = res.data.data.mlist;
          let content;
          let that = this;
          this.tableData2.map(item => {
            that.numb2 = item.flowStatus;
            if (item.cvItemsCode != null && item.cvItemsCode.length == 10) {
              content = item.cvItemsCode + "(" + item.itemsCode + ")";
            } else {
              content = item.itemsCode;
            }

            if(item.needReport == 0){
                this.baogaoflag = false
            }

             if(item.jianYanYuanList[0]){
              item.assignee = item.jianYanYuanList[0].loginName
            }

          });
          that.loading2 = false;
        }).catch(err => {
          console.log(err);
          this.$message.error({message: err.data.message, duration: 1500});
          this.loading2 = false;
        });
      },
      clickFindWorkLog(row) { // 第二个弹出层
        this.loading3 = true;
        let id = row.id;
        // this.ids = row.id
        var that = this;
        this.$api.allot.findWorkLog(id).then(res => {
           that.tableData3 = res.data.data;
          that.tableData3.map(item => {
            that.numb3 = item.reason
          });
          $table2.toggleRowExpansion(row);
          this.loading3 = false;
        }).catch(err => {
          console.log(err);
          this.$message.error({message: err.data.message, duration: 1500});
          this.loading3 = false;
        });

        this.tableData3.map(item => {
          that.numb3 = item.reason
        });
        let $table2 = this.$refs.Table2;
        this.tableData2.map((item) => {
          if (row.id != item.id) {
            $table2.toggleRowExpansion(item, false)
          }
        });
        this.strs = ''
      },
      handleSelectionChange(val) { //全选
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.pageSize = val; // 每页展示的条数
        this.resetForm(this.formLabelAlign, this.currentPage, this.pageSize);
      },
      handleCurrentChange(val) {
        this.currentPage = val; // 当前展示的第几页
        this.resetForm(this.formLabelAlign, this.currentPage, this.pageSize);
      },
      //新增接口
      getMode(){
        // let mode = 'ZJFPJYY';
        // this.$api.lxtinitial.getdicName(mode).then(res => {
        //   if (res.data.respCode == 0) {
        //     this.report_type = res.data.data.dicTypeCode
        //     this.processInstanceIdName = res.data.data.dicTypeName
        //   }
        // }).then(()=>{

        // }).catch(res => {
        //   this.$alert(res.data.message, '信息提示', {
        //     dangerouslyUseHTMLString: true
        //   });
        // })
        this.report_type = '12'
        this.processInstanceIdName = 'ZJFPJYY'
        this.yearDate();
          this.initProps();
          //this.initdata();
          // 看板页模块的表格,一些操作不处理
          if (this.isComing != 0) {
            this.initdata();
            // 报告类型
            this.$api.allot.findworkflow().then(res => {
              this.reporType = res.data.data
            });
            // 检验类型
            this.$api.allot.findCheckType().then(res => {
              if (res.data.ok && res.data.data && res.data.data.length != 0) {
                this.findCheckType = res.data.data;
              } else {
                this.$notify.error({
                  title: '异常',
                  message: '检验类型未查到相关数据',
                  showClose: false
                });
              }
            }).catch(err => {
              console.log(err);
            });
          }
      },
      findOfficeMode(){
        this.$api.allot.findOfficeMode().then(res => {
          console.log(res)
          this.findOffice = res.data.data;
          this.findOfficeitem = res.data.data[0].id
        }).catch(err => {
          this.$message.error({message: err.data.message, duration: 1500});
        });
      }
    },
    created() {
      this.getMode()
    },
    mounted() {
      setAuthentication(this.$route.name,this.authenticationField);
      //鉴权操作  需传入两个值 1 this.$route.name：当前路由name 2 this.authenticationField：鉴权字段
      if (this.myComing == 0){
        this.isfoot=false;
        this.isnetfoot=true;
      }
    },
  }
</script>
<style lang="scss" scoped>
  .taskallot_box {
    background: #eee;
    padding: 10px;
    overflow: hidden;
  }

  .allot {
    width: 100%;
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }

  .allot_top {
    padding: 20px 20px 0 20px;
    overflow: hidden;
  }

  .allot_top .el-form .el-form-item {
    margin: 0;
  }

  /deep/ .allot_top .el-form-item__content {
    width: 60% !important;
  }

  /deep/ .allot_top .el-form-item__content .el-date-editor, .allot_top .el-form-item__content .el-input, .allot_top .el-form-item__content .el-input__inner, .allot_top .el-form-item__content .el-select {
    width: 100% !important;
  }

  .allot_form {
    flex: 1;
  }

  .allot_form .allot_form_show {
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
  }

  .allot_form_but {
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    padding-bottom: 20px;
  }

  /deep/ .allot_form_but .el-form-item__content {
    width: auto !important;
    display: flex !important;
  }

  .allot .lxt_block {
    padding: 20px;
  }

  .allot .roughly_tabel {
    flex: 1;
    padding: 0px 20px 0 20px;
    overflow: hidden;
    z-index: 10;
  }

  .allot .roughly_tabel .table-box {
    height: 100%;
    overflow-y: auto;
  }

  /deep/ .el-table__expanded-cell .el-table .el-table__header-wrapper table {
    width: 100% !important;
    overflow: hidden;
  }

  /deep/ .el-table__expanded-cell .el-table .el-table__body-wrapper table {
    width: 100% !important;
    overflow: hidden;
  }

  .active {
    color: red;
  }

  .myLabel {
    display: inline-block;
    min-width: 76px;
  }
  /deep/ .taskDetail_dialog1 {
    min-height: 100% !important;
    margin: 0 auto !important;
  }
  /deep/ .copyStyle{ margin-top: 20px;}
</style>
