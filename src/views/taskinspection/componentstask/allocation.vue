<template>
  <!-- 任务分配 - 天摩托 -->
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
          <el-button type="primary" class="piliang" @click="batchBtn">批量分配</el-button>
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
            <el-table-column type="index" align="center"  width="70%" :resizable="false">
              <template>&nbsp;</template>
            </el-table-column>
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
            <el-table-column align="center" width="70%" :resizable="false" v-if="isfoot">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checkCur" @change="batchCurcheck(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
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


                    <el-table-column label="检验科室" align="center" :resizable="false" >
                      <!-- <el-table-column prop="testRoomName" label="检验科室" align="center" :resizable="false" > -->
                        <!-- <template> -->
                          <template slot-scope="scope">
                            <!-- <span v-if="tableData2[scope.$index].needTest == 0 ? false : true">
                              {{tableData2[scope.$index].testRoomName}}
                            </span> -->
                            <!-- <SelectTree
                              :props="props"
                              :options="optionData"
                              :value="valueId"
                              :clearable="isClearable"
                              :accordion="isAccordion"
                              @getValue="getValue($event)"
                            /> -->
<!--  v-if="tableData2[scope.$index].needTest == 0 ? false : true" -->
                            <SelectTree
                            :props="props"
                            :options="tableData2[scope.$index].findlist"
                            :value="tableData2[scope.$index].findlistitem"
                            :clearable="isClearable"
                            :accordion="isAccordion"
                            :tabeindex="scope.$index"
                            :tabedata="tableData2"
                             v-if="tableData2[scope.$index].needTest == 0 ? false : true"
                            @getValue="getValue($event,tableData2[scope.$index])"
                            />

                        </template>
                    </el-table-column>
                    <!-- :disabled ="tableData2[scope.$index].zhuRenList == '' ? true : false" -->
                    <el-table-column prop="assignee" label="检验部科室主任" align="center" :resizable="false">
                      <template slot-scope="scope">
                        <el-select
                          size="mini"
                          style="width:80%;"
                          v-model="tableData2[scope.$index].directoritem"
                          v-if="tableData2[scope.$index].needTest == 0 ? false : true"
                          @change="currentSel(tableData2[scope.$index].id,scope.row,scope.$index)">
                          <el-option
                            v-for="(item,i) in tableData2[scope.$index].directorlist"
                            :key="i"
                            :label="item.loginName+'_'+item.name"
                            :value="item.loginName">
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>



                    <el-table-column prop="orgName" label="报告编辑科室" align="center" :resizable="false" >
                      <!-- @change="currediting(tableData2[scope.$index].id,scope.row,scope.$index)"> -->
                      <template slot-scope="scope">

                         <SelectTreeTow
                          :props="props2"
                          :options="tableData2[scope.$index].findOffice"
                          :value="tableData2[scope.$index].offitem"
                          :clearable="isClearable2"
                          :accordion="isAccordion2"
                          :tabeindex="scope.$index"
                          :tabedata="tableData2"
                          v-if="tableData2[scope.$index].needReport == 0 ? false : true"
                          @getbinaji="getbinaji($event,tableData2[scope.$index])"
                          />

                        <!-- <el-select
                          size="mini"
                          style="width:80%;"
                          v-model="tableData2[scope.$index].offitem"
                          v-if="tableData2[scope.$index].needReport == 0 ? false : true"
                          @change="currediting(tableData2[scope.$index].id,scope.row,scope.$index)">
                          <el-option
                            v-for="(item,i) in tableData2[scope.$index].findOffice"
                            :key="i"
                            :label="item.org_name"
                            :value="item.id"
                          >
                          </el-option>
                        </el-select> -->


                      </template>
                    </el-table-column>

                    <el-table-column prop="orgName" label="报告编辑人" align="center" :resizable="false" >
                      <template slot-scope="scope">
                        <el-select
                          size="mini"
                          style="width:80%;"
                          v-model="tableData2[scope.$index].finditingitem"
                          v-if="tableData2[scope.$index].needReport == 0 ? false : true"
                          @change="ditingFn(tableData2[scope.$index].id,scope.row,scope.$index)">
                          <el-option
                            v-for="(item,i) in tableData2[scope.$index].finditing"
                            :key="i"
                            :label="item.name+'_'+item.loginName"
                            :value="item.loginName"
                            >
                          </el-option>
                        </el-select>
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

      <!-- 批量分配 -->
      <el-dialog
        title="批量分配"
        :visible.sync="batchdelg"
        width="50%"
        :before-close="closebatch">
        <div>
          <el-form ref="form"  label-width="120px">
            <el-form-item label="报告编辑科室">
               <SelectTreethree
                :props="props3"
                :options="list3"
                :value="valueId3"
                :clearable="isClearable3"
                :accordion="isAccordion3"
                @getValue="getValue3($event)"
              />

              <!-- <el-select v-model="bgDepartment" placeholder="请选择报告编辑科室"
                 @change="bgcuuer">
                <el-option
                  v-for="(item,i) in this.bgfindOffice"
                  :key="i"
                  :label="item.org_name"
                  :value="item.id"
                ></el-option>
              </el-select> -->


            </el-form-item>
            <el-form-item label="报告编辑人">
              <el-select v-model="bgPeople" placeholder="请选择报告编辑人">
                <el-option
                  v-for="(item,i) in this.bgfinditing"
                  :key="i"
                  :label="item.name+'_'+item.loginName"
                  :value="item.loginName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="batchdelg = false">取 消</el-button>
          <el-button type="primary" @click="batchdelgFn">确 定</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>
<script>
  //import taskDetail from '@/views/entrust/componentsview/Entrustlist.vue'
import taskDetail from '@/views/taskdelegation/componentstask/acceptance.vue'
import { setAuthentication } from '@/authenticationDocument/authenticationDocument.js'
import SelectTree from './soltall.vue'
import SelectTreeTow from './soltall2.vue'
import SelectTreethree from './soltall3.vue'

  export default {
    name: 'allocation',
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
      },
      list(val){
        this.list = val
      },
      valueId(val){
        this.valueId = val
      },
      directorData(val){
        this.directorData = val
      },
      directoritem(val){
        this.directoritem = val
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
        ruleshi: '草稿箱',

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
        iepartment:[], //检验科室
        ieparars:[],//检验科室主任
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


        seltow : 0,   //判断提交的报告中是否存在 不需要显示的 编辑部门和编辑人
        seltow1 : 0,   //判断提交的报告中是否存在 需要显示的 编辑部门和编辑人

        musterbsnum:0, //统计不可选的主任科室
        offopev: '',
        authenticationField:{ //鉴权字段
          manu:false,
        },
        isfoot:true,
        isnetfoot:false,

        //批量分配
        batchdelg:false,
        batchAllcheck :[],
        bgfindOffice : [], //批量分配报告编辑科室  数据
        bgfinditing : [], //批量分配报告编辑人  数据
        bgDepartment:'', //批量分配中存储报告编辑科室字段
        bgPeople:'',//批量分配中存储报告编辑人字段
        examineNameData:[],//存选中任务的 examineName  字段的值

        mlyTaskinfor: null,
        carType:'',

        isClearable: true, // 可清空（可选）
        isAccordion: true, // 可收起（可选）
        valueId: null, // 初始ID（可选）
        props: {
          // 配置项（必选）
          value: "id",
          label: "org_name",
          children: "children"
          // disabled:true
        },
        // 选项列表（必选）
        list: [],
        directorData:[],//检验部科室主任数据
        directoritem:'',//检验部科室主任选中项
        copyval:[],// 存储选中的任务数据

        //第二个tree

        isClearable2: true, // 可清空（可选）
        isAccordion2: true, // 可收起（可选）
        valueId2: null, // 初始ID（可选）
        props2: {
          // 配置项（必选）
          value: "id",
          label: "org_name",
          children: "children"
          // disabled:true
        },
        // 选项列表（必选）
        list2: [],
        index_updator : null,

         //第三个tree   批量分配
        isClearable3: true, // 可清空（可选）
        isAccordion3: true, // 可收起（可选）
        valueId3: null, // 初始ID（可选）
        props3: {
          // 配置项（必选）
          value: "id",
          label: "org_name",
          children: "children"
          // disabled:true
        },
        // 选项列表（必选）
        list3: [],
        







      
        

      }
    },
    components: {
      taskDetail,
      SelectTree,
      SelectTreeTow,
      SelectTreethree,
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
        this.ars = row.directoritem
        this.ind = row.id
        let shu = 0
        this.musterbsnum = 0;
        shu = this.tableData2.length
        this.tableData2.slice(index, shu).map(item => {
          if(item.needTest != 0){
            item.directorlist.forEach(i => {
              if(i.loginName == this.ars){
                  item.directoritem = this.ars;
              }
            });
          }
        })
        console.log(this.ars)
        console.log(this.multi.length)
        if (this.multi.length > 0) {
          
          this.multi[index].directoritem = this.ars
          bbw = this.multi
          this.dataSelect(bbw)
        }
      },
      currediting(selVal, row, index){ //报告编辑科室
          this.selVal = selVal;
          let bbw = []
          this.offopev = row.offitem
          this.ind = row.id
          let shu = 0
          shu = this.tableData2.length
          this.tableData2.slice(index, shu).map(item => {
              item.findOffice.forEach(i => {
                if(i.id == this.offopev){
                  item.offitem = this.offopev;

                }
              });
              this.cueeedtin(this.offopev,item);
          })
         
          if (this.multi.length > 0) {
            this.multi[index].offopev = this.offopev
            bbw = this.multi
            this.dataSelect(bbw)
          }

          
      },
      // reg  当前 数据
      //isliu 点击详情 true  联动 false
      //index 当前行索引
      cueeedtin(id,teg,isliu,index){
         let bbw = []
        
        
         this.$api.allot.findOfficedepart(id,this.carType,this.report_type).then(res => {
            if(res.data.data){
              this.finditing = res.data.data;
              // this.bgfinditing = res.data.data;
              if(isliu == true){

               this.$set(this.tableData2[index], 'finditing', res.data.data)
                if(res.data.data.length>0){
                  this.$set(this.tableData2[index], 'finditingitem', res.data.data[0].loginName)
                 
                }else{
                    this.$set(this.tableData2[index], 'finditingitem', '')
                }

                // console.log(this.tableData2[index])
                // console.log(res.data.data[index].loginName)
                // this.tableData2[index].finditingitem = this.finditing[0].loginName+'_'+ this.finditing[0].name;
              }
             
            }
            if(isliu == true){

            }else{

              if(teg){
                this.$set(teg, 'finditing', this.finditing)
                if(this.finditing == ''){
                  this.$set(teg, 'finditingitem', '')
                }else{
                  this.$set(teg, 'finditingitem', this.finditing[0].loginName)
                }
              }else{
                // if(this.bgfinditing == ''){
                //   this.bgPeople = ''
                // }else{
                //   this.bgPeople = this.bgfinditing[0].loginName
                // }
              }


              let shu = 0
              let bbw = []
              shu = this.tableData2.length
              console.log(this.index_updator)

              this.tableData2.slice(this.index_updator, shu).forEach((item) => {
                if(item.finditing){

                  //item.finditingitem = this.finditing[0].loginName;

                  if(this.finditing.length > 0 ){

                      item.finditingitem = this.finditing[0].loginName;
                  }else{
                      item.finditingitem = '';
                  }
                  item.finditing = this.finditing;
                }
              });
 
              if(this.copyval.length > 0){ // 当前寻找的的数据
                  bbw = this.copyval
                  console.log(bbw)
                  this.dataSelect(bbw)
                }

            }







        })
      },
      ditingFn(selVal, row, index){ //报告编辑人
          this.selVal = selVal;
          let bbw = []
          this.finditingitem = row.finditingitem
          this.ind = row.id
          let shu = 0
          shu = this.tableData2.length
          this.tableData2.slice(index, shu).map(item => {

            console.log(item)
              item.finditing.forEach(i => {
                if(i.loginName == this.finditingitem){
                  item.finditingitem = this.finditingitem;
                }
              });
          })
          console.log(this.finditingitem)
          if (this.multi.length > 0) {
            this.multi[index].finditingitem = this.finditingitem
            bbw = this.multi
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
        // console.log(row)
        let that = this;
        that.dialogFormVisible = true;
        this.mlyTaskinfor = {
          'otherFrom': 'other1',
          'params': {
            'taskid': row.id,
            'processInstanceId': this.report_type
          }
        }
        // this.$api.taskmanage.apiEditTaskInfo()
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
          sampleTrademark:this.formLabelAlign.trademark,
          wttype: this.formLabelAlign.inspection_type,

          currentPage: this.currentPage,
          pageSize: this.pageSize
        };
        this.$api.allot.findtasklist(obj).then(res => {
          this.tableData = res.data.data;
          let that = this;

          this.tableData.map(item => {
            that.numb = item.flowStatus
            this.$set(item, 'checkCur', false)
          });
           console.log(this.tableData)
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
        console.log(val)
       this.copyval = val
        this.selone = 0;
        this.seltow = 0;
        this.selone1 = 0;
        this.seltow1 = 0;
        this.multi = val;
        this.multipleSelections = [];
        this.iepartment = []; //检验科室
        this.ieparars = []
        
        this.musterbsnum = 0;
        let multipleSelection = [];

        let bainjike = []
        let bainjiren = []

        let partment = [];//检验科室
        let partzhuren = [];//检验科室主任

        this.multi.map(item => {
          multipleSelection.push(item.id)
        });
        this.str = multipleSelection.join(',');
        val.map(items => {
          //  if (items.assignee == '') {
          //     this.strs = ''
          //   } else {
          //     if(items.needTest != 0){ 
          //       this.multipleSelections.push(items.assignee)

          //     }else{
          //       this.multipleSelections.push('')
          //     }

          //     if (this.multipleSelections > 1) {
          //       this.strs = this.multipleSelections.join(',');
          //     }
          //     this.strs = this.multipleSelections.join();
          //   }
            // if (items.offitem == '') {
            //   this.findOfficeStrdata = ''
            // } else {
              
            // }


            if(items.needReport != 0){
                bainjike.push(items.offitem)
              }else{
                bainjike.push('')
              }

              if (this.bainjike > 1) {
                this.findOfficeStrdata = bainjike.join(',');
              }
              this.findOfficeStrdata = bainjike.join();


             if(items.needReport != 0){
                bainjiren.push(items.finditingitem)
              }else{
                bainjiren.push('')
              }
              if (this.bainjike > 1) {
                this.finditingdata = bainjiren.join(',');
              }
              this.finditingdata = bainjiren.join();
            if(items.findlistitem == ''){
               this.iepartment = ''
            }else{
              if(items.needTest != 0){ 
                partment.push(items.findlistitem)
              }else{
                partment.push('')
              }
              if (this.partment > 1) {
                this.iepartment = partment.join(',');
              }
              this.iepartment = partment.join();

            }
            let mt;
              mt = items.directoritem
             
              let index = mt.lastIndexOf("_")
              if(index != -1){
                 mt =mt.substring(0,index);
              }else{
                mt = items.directoritem
              }
             
            if(items.needTest != 0){ 
                partzhuren.push(mt)
              }else{
                partzhuren.push('')
              }
              if (this.partzhuren > 1) {
                this.ieparars = partzhuren.join(',');
              }
              this.ieparars = partzhuren.join();
           console.log(this.strs)
          // console.log(this.findOfficeStrdata)
          // console.log(this.finditingdata)
          if(items.needTest == 0){
            this.selone ++;
          }
          if(items.needTest != 0){
            this.selone1 ++
          }
          if(items.needReport == 0){
            this.seltow ++
          }
          if(items.needReport != 0){
            this.seltow1 ++
          }
        });
      },
      //校验
      check(inspectids, musterbs) {
        let inspectidArry = this.toArry(inspectids)
        let musterbArry = this.toArry(musterbs)
        if (inspectidArry.length - this.musterbsnum == musterbArry.length ) {
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
          // if (item != '') {
          //   lzyRet.push(item)
          // }
          lzyRet.push(item)
        })
        return lzyRet
      },

      // 提交
      onClickXgdReport(row) {
        let that = this
        let obj = {
          batchflag: "0",   //0提交下一步，2 是从检验报告状态提交到无发票号码，3 是从检验报告状态提交到无整改证明
          inspectids: this.str,    //检验项目id,多个‘,’分割
          assignee : this.ieparars,   //检验科室主任，多个‘,’分割
          musters: this.finditingdata,  //编辑人，多个‘,’分割
          orgtype: this.findOfficeStrdata,     //编辑科室，多个‘,’分割
          searchdate: this.formLabelAlign.year,  //查询日期
          toFinish: "0",    //完成情况 0未完成 1直接完成
          zhangs: "",   //公章信息，传value,多个‘,’分割
          testRoom:this.iepartment,//检验科室 id 多个‘,’分割
          process_instance_id: this.report_type,
          processInstanceIdName:this.processInstanceIdName,
        };
        console.log(obj)
        
      
        if (this.multi.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择后提交!',
            duration: 1500
          });
        }
        else {
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
          sampleTrademark:this.formLabelAlign.trademark,
          searchdate: this.formLabelAlign.year,
          searchdate2: issueyear.replace(/\”/g, ""),
          taskCode: this.formLabelAlign.name,
          wttype: this.formLabelAlign.inspection_type,
          currentPage: this.currentPage,
          pageSize: this.pageSize,

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
       console.log(row)
        this.carType = row.examineName //更新 报告编辑人请求数据的参数
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
          
          this.loading2 = false;
          this.tableData2 = res.data.data.list;
          //this.findOffice
          this.arrs = res.data.data.mlist;
          // console.log(arrs)
          
          let content;
          let that = this;
          this.tableData2.map((item,index) => {
           
            this.valueId = item.testRoom // 检验科室 默认回显
            
            this.valueId2 = item.itemsRoom  //报告编辑科室 默认回显
            // console.log(this.valueId)
            // console.log(this.findOfficeitem)
            this.director(0,true,index); // 检验部主任数据


            item.inspectiondepartment = '';
            that.numb2 = item.flowStatus;
            if (item.cvItemsCode != null && item.cvItemsCode.length == 10) {
              content = item.cvItemsCode + "(" + item.itemsCode + ")";
            } else {
              content = item.itemsCode;
            }

            if(item.needReport == 0){
                this.baogaoflag = false
            }
            // if(item.zhuRenList[0]){
            //   item.assignee = item.zhuRenList[0].loginName
            // }

            let omg = {
                findOffice : this.findOffice,
                offitem : ''
            }
            this.$set(item, 'findOffice', this.list2) //报告编辑科室
            this.$set(item, 'offitem',  this.valueId2)

            
            this.cueeedtin(item.itemsRoom,item,true,index); //编辑员
            



            this.$set(item, 'findlist', this.list) //树形 检验科室数据写入item数据中
            this.$set(item, 'findlistitem', this.valueId)
            this.$set(item, 'directorlist', this.directorData) // 检验部科室主任数据写入item数据中
            this.$set(item, 'directoritem', this.directoritem)// 检验部科室主任默认选中值
            
            
          });
          console.log(this.tableData2)
        }).catch(err => {
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
        // let mode = 'JHSFP';
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
        this.report_type = '11'
        this.processInstanceIdName = 'JHSFP'
        this.initProps();
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
      //批量分配关闭
      closebatch(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      // 新增功能批量分配
      batchBtn() {  //显示弹出层
        if(this.batchAllcheck.length == 0){
            this.$message.error({message: '请先选中报告！', duration: 1500});
            return false;
        }
        this.$api.systemdepartmentrinquire.organizationTreeData().then(res => { //获取科室数据
          console.log(res)
          this.list3 = res.data.data;
          // this.findOfficeitem = res.data.data[0].id
          // this.valueId3 = this.list3[0].id
          // return this.list3[0].id;
        }).then(()=>{
           //this.cueeedtin(res)
           this.batchdelg = true;
        }).catch(err => {
          this.$message.error({message: err.data.message, duration: 1500});
        });

      },
      batchdelgFn(){ //批量分配掉接口
        let str = ''
        str = this.batchAllcheck.join(',')
        let data = {
          "taskIds": str,   //选择的任务信息，多个用‘,’分割
          "musters": this.bgPeople,   //做报告的报告编辑人用户名
          "orgType": this.valueId3,  //报告编辑科室id 
          "process_instance_id": 11,   //报告类型，进度实例id 详见响应前注释，主要传注释里面对应模块得数字
        }
        this.$api.allot.batchTaskToDoNext(data).then(res => {
          console.log(res)
          if(res.data.ok == true){
            this.$alert(res.data.data, '信息提示', {
              dangerouslyUseHTMLString: true
            });
            this.list3 = [];
            this.bgfinditing = [];
            this.bgPeople = '';
            this.valueId3 = '';
            this.batchdelg = false;
            this.resetForm(this.formLabelAlign,1,1)
          }
        }).catch((err)=>{
          this.$alert(err.data.message, '信息提示', {
              dangerouslyUseHTMLString: true
            });
        })

      },
      batchCurcheck(val){ //批量分配 复选框事件
        this.batchAllcheck = [];
        this.examineNameData = [];
        console.log(this.tableData)
        this.tableData.forEach((item,index) => {
          if(item.checkCur == true){
            this.batchAllcheck.push(item.id);
            if(item.examineName == null){
              return false;
            }
            this.examineNameData.push(item.examineName)
          }
        });
      },
      // bgcuuer(){//批量分配 编辑科室切换
      //    this.cueeedtin(this.bgDepartment)
      // },
      
      getValue(data,item) { // 检验部科室
         let bbw = []
        this.valueId = data.value;
        item.inspectiondepartment = data.value;
        

        let shu = 0
        shu = this.tableData2.length
        this.tableData2.slice(data.index, shu).map(item => {
            item.findlist.forEach(i => {
              item.findlistitem = this.valueId  
            });
        })
        

        if(this.multi.length <= 0){}else{
           this.multi[data.index].findlistitem = this.valueId
            bbw = this.multi
            this.dataSelect(bbw)
           
        }

        this.director(data.index)// 检验部科室主任
      },
      director(num,isliu,index){ // 检验部科室主任
        console.log(this.valueId)
        this.$api.allot.director(this.valueId,this.carType).then(res => {
         
          this.directorData = res.data.data;
          if(res.data.data.length > 0){

            if(isliu == true){
              this.tableData2[index].directoritem = res.data.data[0].loginName+'_'+ res.data.data[0].name;
              this.tableData2[index].directorlist =  this.directorData
            }else{
              this.directoritem = res.data.data[0].loginName+'_'+ res.data.data[0].name;
            }

          }else{
            this.directoritem = '';
          }
          if(isliu == true){
          }else{
            let shu = 0
            let bbw = []
            shu = this.tableData2.length
            this.tableData2.slice(num, shu).forEach((item,index) => {
              if(item.directorlist){
                item.directoritem = this.directoritem;
                item.directorlist = this.directorData;
              }
            });
            
            if(this.copyval.length > 0){
              bbw = this.copyval
              console.log(bbw)
              this.dataSelect(bbw)
            }
          }
            
          
        })
        
      },

      getbinaji(data,item) { //报告编辑科室
       console.log(item)
       this.index_updator = data.index
        let bbw = []
        this.valueId2 = data.value;
        item.inspectiondepartment = data.value;

        let shu = 0
        shu = this.tableData2.length
        this.tableData2.slice(data.index, shu).map(item => {
            item.findOffice.forEach(i => {
              item.offitem = this.valueId2
            });
        })
        if(this.multi.length <= 0){}else{
          if(this.multi.length > data.index){
            this.multi[data.index].offitem = this.valueId2
            bbw = this.multi
            this.dataSelect(bbw)
          }
           
        }
        console.log(data.value)
        this.cueeedtin(data.value,item) // 报告编辑人
       
      },

      clickTree(){ //树形数据  检验科室
        this.$api.systemdepartmentrinquire.organizationTreeData().then(res => {
          this.list = res.data.data
        })
      },
      biaojikeshi(){ //获取报告编辑科室数据
        // this.$api.allot.findOfficeMode().then(res => {
        this.$api.systemdepartmentrinquire.organizationTreeData().then(res => { //获取科室数据
          //this.findOffice = res.data.data;
          this.list2 = res.data.data
          //this.findOfficeitem = res.data.data[1].id
        })
      },
      getValue3(value) {
        this.valueId3 = value;
        this.$api.allot.findOfficedepart(this.valueId3,this.carType,this.report_type).then(res => {
          this.bgfinditing = res.data.data;
          if(this.bgfinditing == ''){
            this.bgPeople = ''
          }else{
            this.bgPeople = this.bgfinditing[0].loginName
          }
        })
      }

    },
    computed: {
      /* 转树形数据 */
      // optionData() {
      //   let cloneData = JSON.parse(JSON.stringify(this.list)); // 对源数据深度克隆
      //   return cloneData.filter(father => {
      //     // 循环所有项，并添加children属性
      //     let branchArr = cloneData.filter(child => father.id == child.parentId); // 返回每一项的子级数组
      //     branchArr.length > 0 ? (father.children = branchArr) : ""; //给父级添加一个children属性，并赋值
      //     return father.parentId == 0; //返回第一层
      //   });
      // }
    },
    created() {
      this.getMode()
      this.clickTree();
      this.biaojikeshi();
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
    justify-content: space-between;
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
  .piliang{
    height: 30px !important;
    padding: 0 20px !important;
    background: -webkit-gradient(linear, left top, right top, from(#609df8), to(#54b7eb)) !important;
    background: linear-gradient(90deg, #609df8, #54b7eb) !important;
    color: #fff !important;
  }


  




</style>
