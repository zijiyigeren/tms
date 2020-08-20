<template>
  <!-- 任务管理 -->
  <div class="taskmanage_border">
    <div class="taskmanage_con">
      <!-- 查询 -->
      <div class="query_modular">
        <div class="query_complex">
          <!-- 查询表单 -->
          <el-form :inline="true" :model="formInline" class="query_form" label-width="120px">
            <el-form-item label="任务号：">
              <el-input clearable name="clearInputValue" @keyup.enter.native="searchEnterFun"
                        v-model.trim="formInline.taskCode"></el-input>
            </el-form-item>
            <el-form-item label="受检单位：">
              <el-input clearable name="clearInputValue" @keyup.enter.native="searchEnterFun"
                        v-model.trim="formInline.companyCheck"></el-input>
            </el-form-item>
            <el-form-item label="样品名称：">
              <el-input clearable name="clearInputValue" @keyup.enter.native="searchEnterFun"
                        v-model.trim="formInline.sampleName"></el-input>
            </el-form-item>
            <el-form-item label="规格型号：">
              <el-input clearable name="clearInputValue" @keyup.enter.native="searchEnterFun"
                        v-model.trim="formInline.sampleType"></el-input>
            </el-form-item>
            <el-form-item label="主检科室：" v-show="show">
              <el-select v-model="formInline.deptid">
                <el-option v-for="(item,i) in deptidList" :key="i" :label="item.org_name"
                            :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="查询年份：" v-show="show">
              <el-select v-model="formInline.searchdate" placeholder="请选择年份">
                <el-option v-for="(item,i) in dateList" :key="i" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="完成状态：" v-show="show">
              <el-select v-model="formInline.task_status">
                <el-option label="全部" value=""></el-option>
                <el-option label="已完成" value="1"></el-option>
                <el-option label="未完成" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归档状态：" v-show="show">
              <el-select v-model="formInline.docStatus">
                <el-option label="全部" value=""></el-option>
                <el-option label="报告未归档" value="0"></el-option>
                <el-option label="报告已归档" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <!-- 展开/收起 -->
          <div class="query_show">
              <el-button v-if="showbut!=0" @click="clickshowbut(0)" type="text" class="query_showBtn">
                  收起 <i class="el-icon-arrow-up"></i>
              </el-button>
              <el-button v-else-if="showbut==0" @click="clickshowbut(1)" type="text" class="query_showBtn">
                  展开 <i class="el-icon-arrow-down"></i>
              </el-button>
          </div>

        </div>

        <!-- 查询按钮 -->
        <div class="query_btn">
            <p></p>
            <p>
                <el-button type="primary" @click="onClickInquire(formInline,1,10)">查询</el-button>
                <!-- <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button> -->
            </p>
        </div>
      </div>

      <!-- 表格/分页 -->
      <div v-loading="loading" class="tablePagination_modular">
        <!-- 表格 -->
        <div class="table_modular">
          <el-table ref="table" border stripe  :data="tablelist"
              :header-cell-style="{
                'background-color': 'rgba(243,246,253,1)', 
                'color': '#606266', 
                'padding': '10px 0' }">
            <el-table-column align="center" :resizable="false" type="selection"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="taskCode" label="任务号"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="taskStatusStyle" label="状态"
                             class-name="stateTaskStatus">
              <template slot-scope="scope">
                <p v-for="(item,i) in scope.row.taskStatusList" :key="i" v-show="item" class="taskStatusStyleclass">
                  {{item}}</p>
              </template>
            </el-table-column>
            <el-table-column align="center" :resizable="false" prop="companyCheck" label="受检单位"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="sampleName" label="样品名称"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="sampleType" label="样品规格型号"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="orgName" label="科室"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="checkTypeID" label="类别"></el-table-column>
            <el-table-column align="center" :resizable="false" label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" v-if="type != '1'" style="color:#32AFF0;marginLeft:6px;"
                           @click="clickFindJobContent(scope.row)">浏览
                </el-button>
                <el-button type="text" v-if="type != '1'" style="color:#32AFF0;marginLeft:6px;"
                           @click="clickRedact(scope.row)">详情
                </el-button>
                <el-button type="text" v-if="type === '1'" @click="copyMessage(scope.$index,scope.row)"
                           style="color:#32AFF0;marginLeft:6px;">复制信息
                </el-button>
              </template>
            </el-table-column>

            <!-- 二级弹出 -->
            <el-table-column :resizable="false" type="expand" width="1">
              <template>
                <div class="lxt_title">
                  <el-button type="primary" style="margin:0 10px;" @click="clickContentDelete">退回草稿</el-button>
                  <el-button type="primary" style="margin:0 10px;" v-if="task_status == 1" @click="clickDocCanSave">
                    允许主检修改报告
                  </el-button>
                  <el-button type="primary" style="margin:0 10px;" v-if="task_status == 1"
                             @click="clickJobTaskFindBackFlow">回退
                  </el-button>
                  <!-- <el-button type="primary" style="margin:0 10px;" @click="clickSearchTaskDoc(scope.row.id)">任务说明</el-button> -->
                </div>
                <div>
                  <el-table ref="twoTable" border stripe :data="twoTableList" :row-style="tableRowStyle"
                            :header-cell-style="{'background-color': 'rgba(243,246,253,1)', 'color': '#606266', 'padding': '10px 0'}"
                            @selection-change="handleSelectionChange">
                    <el-table-column align="center" :resizable="false" type="selection"></el-table-column>
                    <el-table-column align="center" :resizable="false" prop="itemsCode" label="报告编号"></el-table-column>
                    <el-table-column align="center" :resizable="false" prop="itemsName" label="项目名称"></el-table-column>
                    <el-table-column align="center" :resizable="false" prop="dectorName" label="主检人"></el-table-column>
                    <el-table-column align="center" :resizable="false" prop="checkTypeID" label="公章类型">
                      <template slot-scope="scope">
                        <div style="display:flex;justifyContent:center;alignItems:center;">
                          <el-select size="medium" style="width:160px;" v-model="scope.row.checkTypeID">
                            <el-option v-for="(item,i) in scope.row.clist" :key="i" :label="item.name"
                                       :value="item.id"></el-option>
                          </el-select>
                          <el-button type="primary" v-show="task_status == 1"
                                     @click="clickGoUpdateZhang(scope.row, scope.row.checkTypeID)"
                                     style="fontSize:12px;height:20px;padding:0 5px;marginLeft:5px;">
                            修改
                          </el-button>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" :resizable="false" label="流转信息" style="color:#32AFF0;">
                      <template slot-scope="scope">
                        <el-button type="text" style="color:#32AFF0;marginLeft:6px;"
                                   @click="clickFindWorkLog(scope.row)">流转
                        </el-button>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" :resizable="false" label="操作" width="200">
                      <template slot-scope="scope">
                        <el-button v-if ="scope.row.needReport == '1' ? true : false"
                        type="text" style="color:#32AFF0;marginLeft:6px;"
                                   @click="clickOpenReport(scope.row)">查看
                        </el-button>
                        <el-button v-if ="scope.row.needReport == '1' ? true : false"
                        type="text" style="color:#32AFF0;marginLeft:6px;"
                                   @click="onClickQuickCheck(scope.row)">快查
                        </el-button>
                        <!--  -->
                        <el-button  v-if ="scope.row.needTest == '1' ? true : false"
                         type="text" style="color:#32AFF0;marginLeft:6px;"
                                   @click="clicklook(scope.row)">查看原始记录
                          <b style="color: #67C23A"
                               v-if="scope.row.isUploadOriginal==0 || scope.row.isUploadOriginal==null ? false : true"
                            >✔</b>
                        </el-button>

                      </template>
                    </el-table-column>

                    <!-- 三级弹出 -->
                    <el-table-column :resizable="false" type="expand" width="1">
                      <template slot-scope="scope">
                        <threeFlowTable v-bind:threeTableList="threeTableList"/>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </el-table-column>

          </el-table>
        </div>

        <!-- 分页 -->
        <el-pagination
          class="pagination_modular"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10,20,30]"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange">
        </el-pagination>
      </div>
    </div>

    <!-- 任务回退对话框 -->
    <el-dialog title="任务回退" :visible.sync="dialogFormVisible">
      <el-form :model="dialogForm" label-width="auto">
        <el-form-item label="选择节点：">
          <el-select v-model="dialogForm.backprocessinstance" size="medium">
            <el-option v-for="item in echoSelectData" :key="item.activityId" :label="item.activityName"
                       :value="item.activityId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因：">
          <el-input type="textarea" maxlength="200" show-word-limit
                    :autosize="{ minRows: 4, maxRows: 6}" v-model.trim="dialogForm.reason">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickJobTaskGoBack">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 任务说明对话框 -->
    <el-dialog title="任务说明" :visible.sync="searchTaskDocVisible">
      <el-form :model="missionStatementForm" label-width="auto">
        <el-form-item label="任务说明：">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"
                    v-model.trim="missionStatementForm.taskExplain">
          </el-input>
        </el-form-item>
        <el-form-item label="补充说明：">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                    v-model.trim="additionalExplanation">
          </el-input>
          <el-button type="primary" @click="clickSaveTaskExplain(additionalExplanation)">保存</el-button>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model.trim="missionStatementForm.checkRemark2"></el-input>
          <el-button type="primary" @click="clickSaveCheckRemark(missionStatementForm.checkRemark2)">修改任务单备注dcb专用
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 详情对话框 -->
    <!--<div class="choice_statistics" v-if="redactFormVisible">
      <div class="el_dialog">
        <div class="el_dialog__header">
          <span>{{redactFormTitle}}</span>
          <el-button type="text" class="el_dialog_btnclose" @click="redactFormVisible=false">
              <i class="el-icon-close"></i>
          </el-button>
        </div>

        <div class="el_dialog__body">
            <entrustList ref="redactEntrustlist" saveType="2"></entrustList>
        </div>

        <div class="el_dialog__footer"></div>
      </div>
    </div>-->
    <el-dialog
      :visible.sync="redactFormVisible"
      v-if="redactFormVisible"
      v-bind="{
       'custom-class': 'taskDetail_dialog1',
        title: redactFormTitle,
        modal: false,
        width: '99.9%',
        top: '0',
      }"
    >
      <entrustList
        ref="redactEntrustlist"
        saveType="2"
        showForceSave="1"
        :other-taskinfor="mlyTaskinfor"
      />
    </el-dialog>

    <!--快查的对话框-->
    <el-dialog width="80%" title="快速查看" class="dialog_quickly"
               :close-on-press-escape="false" :close-on-click-modal="false"
               :visible.sync="dialogQuickly" :before-close="handleDialogQuickly">
      <Quiickready @selectproductValue="selectproductValue" @nextReportBtn="nextReportBtn"
                   :indexValueId="indexValueId" :percentage="percentage" :productValue="productValue"
                   :initialState="initialState" :tableDataImg="tableDataImg" :numberData="number"
                   :imgCountPage="imgCountPage" :uploadIdList="uploadIdList">
      </Quiickready>
    </el-dialog>

    <!--下载word和pdf-->
    <object id="WO3Word2" classid="clsid:561C5A99-71C8-48d4-A3E2-16FC4F9880BF"
            style="display: none;" width="0" height="0"
    ></object>


     <!-- 原始记录查看 -->
      <el-dialog
        title="查看原始记录"
        :visible.sync="dialogrecord"
        width="70%"
        >
        <div class="mybox">
          <!-- <ul>
            <li v-for="(item,index) in regList" :key='index'>
              <span class="cl1">原始记录：</span>
              <span class="cl2"><i @click="lookPresentation(item)">{{item.fileName}}.{{item.fileType}}</i><b @click="delitem(item.fileId)">×</b></span>
              <span class="cl3" @click="onRecordSeeOpen(item.fileId)">查看文件</span>
            </li>
          </ul> -->

          <!-- <el-table
            :data="regList"
            highlight-current-row
            border stripe
            :header-cell-style="{'background-color': 'rgba(243,246,253,1)', 'color': '#606266', 'padding': '10px 0'}"
            style="width: 100%">
            <el-table-column
            align="center"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
            align="center"
              property="name"
              label="原始记录名称"
              >
            </el-table-column>
            <el-table-column
            align="center"
              property="createTime"
              label="创建时间"
              >
              <template slot-scope="scope">
                {{scope.row.createTime | timeFn}}
              </template>
            </el-table-column>
            <el-table-column
            align="center"
              property="type"
              label="类型">
              <template slot-scope="scope">
                {{scope.row.fileType | fileTypeFn}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                 type="text" style="color:#32AFF0;marginLeft:6px;"
                  @click="onRecordSeeOpen(scope.$index, scope.row)">查看</el-button>
                <el-button
                  type="text" style="color:#32AFF0;marginLeft:6px;"
                  @click="lookPresentation(scope.$index, scope.row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table> -->

          <ul ref="myboxList" >
            <li>
              <span class="xuhao">序号</span>
              <span class="yname">原始记录名称</span>
              <span class="ydata">创建时间</span>
              <span class="ytype">类型</span>
              <span class="yoperation">操作</span>
            </li>
            <li v-for="(item,index) in regList" :key='index'>
              <span class="xuhao">{{index+1}}</span>
              <span class="yname" :title="item.name">{{item.name}}</span>
              <span class="ydata">{{item.createTime | timeFn}}</span>
              <span class="ytype">{{item.fileType | fileTypeFn}}</span>
              <span class="yoperation">
                <el-button
                    type="text" style="color:#32AFF0;marginLeft:6px;"
                    @click="onRecordSeeOpen(index, item)">查看</el-button>
                  <el-button
                    type="text" style="color:#32AFF0;marginLeft:6px;"
                    @click="lookPresentation(index, item)">下载</el-button>
              </span>
            </li>
          </ul>









        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogrecord = false">取 消</el-button>
          <el-button type="primary" @click="dialogrecord = false">确 定</el-button>
        </span>

      </el-dialog>

      <!-- 原始记录查看组件 -->
        <el-dialog width="90%" title="原始记录查看" class="dialog_recordSee"
            :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="recordVisible" :before-close="onRecordSeeClose">
            <recordsee v-bind="{
                'originalRecordForm': originalRecordForm,
                'recordVisible': recordVisible,
                'pictureNum': pictureNum,
                'imgListData': imgListData,
            }"/>
        </el-dialog>

  </div>
</template>
<script>
  import entrustList from '@/views/taskdelegation/componentstask/acceptance.vue'
  import base from '@/api/base'
  import threeFlowTable from '@/components/threeFlowTable'
  import Quiickready from '@/components/Quiickready'
  import {mapState, mapActions} from 'vuex'
  import recordsee from '@/components/recordSee';
  // import { saveToLocal } from '@/utils/local-storage'
  // import entrustList from '@/views/entrust/componentsview/Entrustlist.vue'
  export default {
    name: 'taskmanage',
    props: ['type'],
    components: {threeFlowTable, Quiickready, entrustList,recordsee},
    data () {
      return {
        initialState: false,
        loading2: false,
        arrDate: [{id: '', title: '全部'}], // 默认年份数据
        dateList: [], // 年份数据
        currentPage: 1, // 当前页
        pageSize: 10, // 每页的条数
        total: 0, // 总条数
        dialogFormVisible: false, // 控制退回对话框的显示隐藏
        searchTaskDocVisible: false, // 控制任务说明对话框的显示隐藏
        redactFormVisible: false, // 控制编辑对话框的显示隐藏
        dialogQuickly: false, // 控制快查对话框的显示隐藏
        redactFormTitle: '任务编辑', // 编辑对话框标题
        searchdate: '', // 年份
        formInline: { // 查询form数据
          taskCode: '',	// 任务号
          companyCheck: '',	// 受检单位
          sampleName: '',	// 样品名称
          sampleType: '', // 规格型号
          deptid: '', // 主检科室
          searchdate: new Date().getFullYear(), // 查询年份
          task_status: '', // 状态：1已完成，2未完成
          docStatus: '', // 归档状态：0报告未归档，1报告已归档
          currentPage: '',
          pageSize: ''
        },
        task_status: '', // 状态
        orgName: '', // 公章类型
        deptidList: [], // 主检科室数据
        tablelist: [], // 一级table数据
        twoTableList: [], // 二级table数据
        threeTableList: [], // 三级table数据
        multipleSelection: [], // 是否选中报告
        dialogForm: { // 退回对话框数据
          backprocessinstance: '',
          reason: ''
        },
        missionStatementForm: { // 任务说明对话框数据
          taskExplain: '',
          checkRemark2: ''
        },
        echoSelectData: [], // 退回下拉框数据
        processinstance: '', // 退回-当前进度
        inspectids: [], // 检验项目
        additionalExplanation: '', // 补充说明
        taskId: '', // 任务id
        productValue: '', /* 快查我的报告编号 */
        percentageValue: '', /* 选择百分比 */
        percentage: [ /* 选择百分比 */
          {value: '0', label: '40%'}, {value: '1', label: '70%'},
          {value: '2', label: '90%'}, {value: '3', label: '100%'},
          {value: '4', label: '130%'}, {value: '5', label: '150%'}
        ],
        number: [], /* 快查下拉框 */
        uploadIdList: [], // 上传中机-快查id
        tableDataImg: [], /* 图片数组 */
        currentPageQuickCheck: 1, /* 分页 */
        pageSizeQuickCheck: 2, /* 快查分页 */
        imgCountPage: '', /* 图片页数 */
        rowID: '',
        loginName: '',
        indexValueId: 0,
        show: false,
        showbut: 0,
        loading: false,

        mlyTaskinfor: null,
        onetaskContentId:'',//报告id
        onetaskid:'',//任务id
        dialogrecord: false,// 编辑原始记录弹窗
        regList:[],//编辑原始记录list
        originalRecordForm: {}, // 原始记录表单
        recordVisible: false, // 原始记录查看-显示状态
        pictureNum: 0, // 图片数量
        imgListData: [], // 图片路径
        
      }
    },
    computed: mapState({
      name: function (state) {
        if (state.user.name === '') {
          this.freshUserInfo()
        }
        return state.user.name
      }
    }),
    created () {
      this.obtainDateList()
      this.acquireSearchDep()
    },
    mounted () {
      this.getDataList()
    },
    filters:{
      timeFn(val){
        var now = new Date(val),
            y = now.getFullYear(),
            m = now.getMonth() + 1,
            d = now.getDate();
        return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) ;
      },
      fileTypeFn(val){
        switch (val) {
          case "1":
            return "在线编辑"
            break;
          case "2":
            return "本地上传"
            break;
          default:
            break;
        }
      }
    },
    methods: {
      ...mapActions({
        freshUserInfo: 'fresh'
      }),
      // 获取查询年份数据
      obtainDateList () {
        let thisYear = new Date().getFullYear()
        let Section = thisYear - (thisYear - 9)
        for (var i = 0; i <= Section; i++) {
          this.dateList.push(thisYear)
          thisYear--
        }
      },
      // 获取主检科室数据
      acquireSearchDep () {
        this.$api.taskmanage.apiSearchDep().then(res => {
          res ? this.deptidList = res.data.data.list : ''
          if (this.deptidList.length > 0) {
            this.formInline.deptid = this.deptidList[0].id
          }
        })
      },
      // 获取列表数据
      getDataList () {
        this.onClickInquire(this.formInline, 1, 10)
      },
      // 分页器-设置每条的页数
      handleSizeChange (val) {
        this.pageSize = val
        this.onClickInquire(this.formInline, this.currentPage, this.pageSize)
      },
      // 分页器-当前页发生改变时
      handleCurrentChange (val) {
        this.currentPage = val
        this.onClickInquire(this.formInline, this.currentPage, this.pageSize)
      },
      // 点击查询
      onClickInquire (formInline, currentPage, pageSize) {
        this.loading = true
        this.currentPage = currentPage, // 当前页
          this.pageSize = pageSize // 每页的条数
        formInline.currentPage = this.currentPage
        formInline.pageSize = this.pageSize
        this.$api.taskmanage.apiSearchTaskInfo(formInline).then(res => {
          res ? this.tablelist = res.data.data.list : ''
          res ? this.total = res.data.data.total : 0
          this.task_status = formInline.task_status
          this.loading = false
        }).catch((error) => {
          this.$message({type: 'error', message: error.data.message, duration: 1500})
          this.loading = false
        })
      },
      // 输入框回车事件
      searchEnterFun (e) {
        var keyCode = window.event ? e.keyCode : e.which
        if (keyCode == 13) {
          this.onClickInquire(this.formInline, 1, 10)
        }
      },
      // 点击收起/展开
      clickshowbut (num) {
        this.show = !this.show
        this.showbut = num
      },
      // 点击浏览
      clickFindJobContent (row) {
        // let $twoTable = this.$refs.twoTable
        // $table.toggleRowExpansion(row)

        this.onetaskid = row.id;
        console.log(row +'||'+ row.id)
        this.rowID = row
        this.taskId = row
        this.loading2 = true
        this.multipleSelection = []
        this.$api.myReport.readEveryReport(row.id).then(res => {
          this.number = res.data.data.list
        })
        let params = {
          taskid: row.id,
          taskCondition: {
            deptid: row.deptid,
            searchdate: row.partitiondate,
            task_status: this.task_status,
            formpage: 2
          }
        }
        this.$api.taskmanage.apiFindJobContent(params).then(res => {
          let data = res.data.data
          if (data && data.list.length > 0) {
            data.list.filter(item => {
              if (item.clist.length > 0) {
                item.clist.forEach(em => {
                  // 'QA,ZD,JH,JK,BC,YY'.indexOf(item.checkTypeID) < 0
                  if (item.checkTypeID < 0) {
                    item.checkTypeID = ''
                  } else {
                    if (em.selected) {
                      item.checkTypeID = em.id
                    }
                  }
                })
              }
            })
          }
          this.twoTableList = data.list
          $table.toggleRowExpansion(row)
          this.loading2 = false
        }).catch(err => {
          this.loading2 = false
        })
        let $table = this.$refs.table
        this.tablelist.map(item => {
          if (row.id != item.id) {
            $table.toggleRowExpansion(item, false)
          }
        })
      },
      // 点击流转
      clickFindWorkLog (row) {
        let $twoTable = this.$refs.twoTable
        let params = {
          id: row.id
        }
        this.$api.taskmanage.apiFindWorkLog(row.id).then(res => {
          $twoTable.toggleRowExpansion(row)
          this.threeTableList = res.data.data
        })
        this.twoTableList.map(item => {
          if (row.id != item.id) {
            $twoTable.toggleRowExpansion(item, false)
          }
        })
      },
      // 选择报告
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 点击退回草稿
      clickContentDelete () {
        this.echoSelectData = []
        this.processinstance = 1
        this.dialogForm = { // 退回对话框数据
          backprocessinstance: '',
          reason: ''
        }
        if (this.multipleSelection.length > 0) {
          this.dialogFormVisible = true
          let businessKey = ''
          this.multipleSelection.forEach(item => {
            businessKey += item.id + ','
          })
          businessKey = businessKey.slice(0, businessKey.length - 1)
          let params = {
            businessKey: businessKey,
            isShowMainNode: false,
            mark: 1
          }
          this.$api.taskmanage.apiContentDelete(params).then(res => {
            console.log(res)

            this.echoSelectData = res.data.data
            if (this.echoSelectData.length > 0) {
              this.dialogForm.backprocessinstance = this.echoSelectData[0].activityId
            }
          })
        } else {
          this.$alert('请先选择报告', '系统提示信息', {confirmButtonText: '确定'})
        }
      },
      // 点击退回
      clickJobTaskFindBackFlow () {
        this.echoSelectData = []
        this.processinstance = 7
        this.dialogForm = { // 退回对话框数据
          backprocessinstance: '',
          reason: ''
        }
        if (this.multipleSelection.length > 0) {
          this.dialogFormVisible = true
          let businessKey = ''
          this.multipleSelection.forEach(item => {
            businessKey += item.id + ','
          })
          businessKey = businessKey.slice(0, businessKey.length - 1)
          let params = {
            businessKey: businessKey,
            isShowMainNode: false,
            mark: 7
          }
          this.$api.taskmanage.apiJobTaskFindBackFlow(params).then(res => {
            this.echoSelectData = res.data.data
            if (this.echoSelectData.length > 0) {
              this.dialogForm.backprocessinstance = this.echoSelectData[0].activityId
            }
          })
        } else {
          this.$alert('请先选择报告', '系统提示信息', {confirmButtonText: '确定'})
        }
      },
      // 退回完成-点击确定
      clickJobTaskGoBack () {
        this.inspectids = []
        this.multipleSelection.forEach(item => {
          this.inspectids.push(item.id)
        })
        if (this.multipleSelection.length > 0) {
          let searchdate = this.multipleSelection[0].partitiondate
          let params = {
            backprocessinstance: this.dialogForm.backprocessinstance,
            inspectids: this.inspectids.join(','),
            process_instance_id: this.processinstance,
            reason: this.dialogForm.reason,
            searchdate: searchdate
          }
          this.$api.taskmanage.apiJobTaskGoBack(params).then(res => {
            this.$message({type: 'success', message: res.data.message, duration: 1500})
            this.dialogFormVisible = false
            this.onClickInquire(this.formInline, 1, 10)
            this.clickFindJobContent(this.rowID)
          }).catch(error => {
            this.$message({type: 'error', message: error.data.message, duration: 3000})
            this.dialogFormVisible = false
            this.clickFindJobContent(this.rowID)
          })
        }
      },
      // 允许主检修改报告
      clickDocCanSave () {
        this.inspectids = []
        if (this.multipleSelection.length > 0) {
          this.multipleSelection.forEach(item => {
            this.inspectids.push(item.id)
          })
          let searchdate = this.multipleSelection[0].partitiondate
          let params = {
            inspectids: this.inspectids.join(','),
            searchdate: searchdate
          }
          this.$api.taskmanage.apiDocCanSave(params).then(res => {
            this.$message({type: 'success', message: res.data.data, duration: 1500})
            this.clickFindJobContent(this.rowID)
          }).catch(error => {
            this.$message({type: 'error', message: error.data.message, duration: 1500})
          })
        } else {
          this.$alert('请先选择报告', '系统提示信息', {confirmButtonText: '确定'})
        }
      },
      // 任务说明
      clickSearchTaskDoc (row) {
        this.taskId = row
        this.searchTaskDocVisible = true
        this.additionalExplanation = ''
        let params = {
          taskId: row
        }
        this.$api.taskmanage.apiSearchTaskDoc(params).then(res => {
          res.data.ok ? this.missionStatementForm = res.data.data
            : this.$message({type: 'success', message: res.data.message, duration: 1500})
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500})
        })
      },
      // 保存任务说明
      clickSaveTaskExplain (val) {
        var now = new Date()
        var yy = now.getFullYear() // 年
        var mm = now.getMonth() + 1 // 月
        var dd = now.getDate() // 日
        var hh = now.getHours() // 时
        var ii = now.getMinutes() // 分
        var ss = now.getSeconds() // 秒
        var time = yy + '-'
        if (mm < 10) time += '0'
        time += mm + '-'
        if (dd < 10) time += '0'
        time += dd + ' '
        if (hh < 10) time += '0'
        time += hh + ':'
        if (ii < 10) time += '0'
        time += ii + ':'
        if (ss < 10) time += '0'
        time += ss
        let name = JSON.parse(localStorage.userInfo).username
        // let str = '\n' + name + '  ' + time + '\n[' + val + ']';
        let str = val
        // let params = {
        //     taskExplain: str,
        //     taskId: this.taskId
        // };
        let params = new FormData()
        params.append('taskExplain', str)
        params.append('taskId', this.taskId)
        this.$api.taskmanage.apiSaveTaskExplain(params).then(res => {
          this.$message({type: 'success', message: res.data.data, duration: 1500})
          this.clickSearchTaskDoc(this.taskId)
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500})
        })
      },
      // 保存任务单备注
      clickSaveCheckRemark (val) {
        // let params = {
        //     checkRemark2: val,
        //     taskId: this.taskId
        // };
        let params = new FormData()
        params.append('checkRemark2', val)
        params.append('taskId', this.taskId)
        this.$api.taskmanage.apiSaveCheckRemark(params).then(res => {
          this.$message({type: 'success', message: res.data.data, duration: 1500})
          this.clickSearchTaskDoc(this.taskId)
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500})
        })
      },
      // 修改公章类型
      clickGoUpdateZhang (row, checkTypeID) {
        let params = {
          id: row.id,
          cachetTypeId: checkTypeID,
          searchdate: row.partitiondate
        }
        this.$api.taskmanage.apiGoUpdateZhang(params).then(res => {
          this.$message({type: 'success', message: res.data.data, duration: 1500})
          this.clickFindJobContent(this.taskId)
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500})
        })
      },
      // 点击复制信息
      copyMessage (index, row) {
        this.$emit('copyMessage', row)
      },
      // 点击详情
      clickRedact (row) {
        let that = this
        that.redactFormVisible = true
        this.mlyTaskinfor = {
          'otherFrom': 'other1',
          'params': {
            'taskid': row.id
          }
        }
        // this.$api.taskmanage.apiEditTaskInfo()
      },
      // 改变背景颜色
      tableRowStyle ({row, rowIndex}) {
        if (row.flowStatus == 1) {
          return 'background-color: pink'
        } else if (row.flowStatus == 2) {
          return 'background-color: yellow'
        } else {
          return ''
        }
      },
      // 点击快查
      onClickQuickCheck (row) {
        let params = {
          inspectids: row.id
        }
        this.$api.taskmanage.apiCheckViewTaskManager(params).then(res => {
          this.showGoRead(row)
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500})
        })
      },
      // 点击快查
      showGoRead (row) {
        //WT191627
        this.initialState = true
        this.tableDataImg = []
        this.imgCountPage = ''
        var rowItemCode = {itemsCode: row.itemsCode}
        var rowRow = []
        rowRow.push(rowItemCode)
        this.number = rowRow
        this.uploadIdList = [row]
        this.productValue = this.number[0].id
        this.$api.myReport.quicklyQuickly(row.id).then(res => {
          var floder = res.data.data.floder,
            pagecount = res.data.data.pagecount,
            imgDataId = res.data.data.id
          this.imgCountPage = pagecount ? pagecount.toString() : '0'
          if (floder == null || pagecount == null || imgDataId == null) {
            this.$message({type: 'info', message: '暂无生成', duration: 1500})
          } else {
            if (pagecount > 0) {
              for (var imgIndexImg = 1; imgIndexImg <= pagecount; imgIndexImg++) {
                var objImg = {
                  v: imgIndexImg,
                  url: base.baseImgUrl + 'docs/gif/' + floder + '/' + imgDataId + '_' + imgIndexImg + '.jpg',
                  // url: `${base.baseImgUrl}docs/gif/${floder}/${imgDataId}_${imgIndexImg}.jpg`
                }
                this.tableDataImg.push(objImg)
              }
            }
            if (this.imgCountPage < 1 || this.tableDataImg == []) {
              this.$message({type: 'error', message: `${row.itemsCode}暂未生成快查`, duration: 1500})
              return false
            } else {
              this.dialogQuickly = true
            }
          }
        }).catch(err => {
          this.$message({type: 'error', message: '查看失败', duration: 1500})
        })
      },
      //点击下一份报告
      nextReportBtn (data) {
        if (this.number.length == 1) {
          this.$message({type: 'info', message: '当前只有一份报告', duration: 1500})
        } else {
          if (this.indexValueId < this.number.length - 1) {
            let indexValueId = this.indexValueId + 1
            this.number.forEach((val, index) => {
              if (indexValueId === index) {
                this.productValue = val.id
              }
              this.indexValueId = indexValueId
            })
          } else {
            this.productValue = this.number[0].id
            this.indexValueId = 0
          }
          this.reportQuickt(this.productValue)
        }

      },
      // 快查对话框关闭事件
      handleDialogQuickly () {
        this.initialState = false
        this.dialogQuickly = false
        this.imgCountPage = ''
        this.tableDataImg = []
        this.indexValueId = 0
        if (this.multipleSelection.length > 0) {
          this.productValue = this.multipleSelection[0].id
        }
      },
      //选择报告编号
      selectproductValue (data) {
        this.productValue = data
        this.number.forEach((val, index) => {
          if (this.productValue === val.id) {
            this.indexValueId = index
          }
        })
        this.reportQuickt(this.productValue)
      },
      //快查接口封装
      reportQuickt (idId) {
        this.imgCountPage = ''
        this.tableDataImg = []
        this.$api.myReport.quicklyQuickly(idId).then(res => {
          var floder = res.data.data.floder,
            pagecount = res.data.data.pagecount,
            imgDataId = res.data.data.id
          this.imgCountPage = pagecount ? pagecount.toString() : '0'
          if (floder == null || pagecount == null || imgDataId == null) {
            this.$message({type: 'info', message: '暂无生成', duration: 1500})
          }
          if (pagecount > 0) {
            for (var imgIndexImg = 1; imgIndexImg <= pagecount; imgIndexImg++) {
              var objImg = {
                v: imgIndexImg,
                url: `${base.baseImgUrl}docs/gif/${floder}/${imgDataId}_${imgIndexImg}.jpg`
              }
              this.tableDataImg.push(objImg)
            }
          }
        }).catch(err => {
          this.$message({type: 'error', message: '查看失败', duration: 1500})
        })
      },
      // 查看-打开报告
      clickOpenReport (row) {
        let params = {
          instanceId: row.id, // 当前id
          provessinstanceId: row.process_instance_id, // 流程id
          taskId: row.taskid // 报告编号
        }
        if (row.process_instance_id == '5' || row.process_instance_id == '6') {
          this.$api.taskmanage.apiGoOpenWordForTask(params).then(res => {
            if (!res.data.data) {
              this.goOpenWord(row.id, row.itemsCode, row.process_instance_id)
            } else {
              this.$message({type: 'error', message: res.data.data, duration: 1500})
            }
          }).catch(error => {
            this.$message({type: 'error', message: error.data.message, duration: 1500})
          })
        } else {
          this.goOpenWord(row.id, row.itemsCode, row.process_instance_id)
        }
      },
      // 打开报告
      goOpenWord (instanceID, report_no, process) {
        let loginName = '';
        let obj = document.getElementById('WO3Word2');
        if(JSON.parse(localStorage.getItem("userInfo"))) {
          loginName = JSON.parse(localStorage.getItem("userInfo")).loginName;
        }
        if (loginName) {
          this.$api.surveyissue.apiSetSession(instanceID).then(res => {
            if (res.data.data == '1') {
              try {
                obj.setUid(loginName)
                obj.setFileId(instanceID)
                obj.setReportNo(report_no)
                obj.setProcess(process)
                obj.setRemoteIp(base.baseImgTable)
                obj.ActiveStart()

              } catch (error) {
                if (confirm('您确认没有安装Word控件吗? 点确定您将下载setup.zip 解压后运行setup.exe即可')) {
                  window.open(base.baseImgTable + '/api/file/resources/donet/setup.zip')
                }
              }
            } else if (res.data.data == '2') {
              this.$message({type: 'error', message: '该小批量报告 已经被打开，或打开没有正常关闭', duration: 1500})
            } else {
              this.$message({type: 'error', message: '已经超时，请重新登录', duration: 1500})
            }
          }).catch(error => {
            this.$message({type: 'error', message: error, duration: 1500})
          })
        }
      },
      clicklook(row){  //查看原始记录
        this.onetaskContentId = row.id
        let taskContentId = row.id;
        let type = 5;
        this.$api.lxtinitial.getTaskInfoById(taskContentId).then(res => {
          //console.log(res.data.data)
          this.originalRecordForm = res.data.data;
        }).catch(err => {
          this.$message.error({message: '获取失败,请和管理员联系！', duration: 1500});
        });
        this.$api.lxtinitial.getOriginalOnlineId(taskContentId,type).then(res => {
          this.regList = res.data.data;
          return res.data.data
        }).then(res=>{
          if(res == ''){
            this.$message.error({message: '暂无数据', duration: 1500});
          }else{
            this.dialogrecord = true;
          }
        }).then(()=>{
          
          this.getdome();
        }).catch(err => {
          this.$message.error({message: '获取失败,请和管理员联系！', duration: 1500});
        });
      },
       // 原始记录查看
      onRecordSeeOpen(index,row) {
        let params = new FormData();
        // console.log(row);
        params.append('fileId', row.fileId);
        this.$api.login.findOriginalInfo(params).then(res => {
          let data = res.data.data;
          if(data && data.extInfo1>0){
            this.pictureNum = data.extInfo1;
            for (var i = 1; i <= data.extInfo1; i++) {
                let objImg = {
                    url: base.wang +'/file/'+ data.extInfo6 +'/'+ data.fileId +'_'+ i +'.jpg'
                };
                this.imgListData.push(objImg);
            };
            this.recordVisible = true;
          }else if(data && data.fileType &&  (data.fileType.indexOf('png') != -1 || data.fileType.indexOf('jpg') != -1)) {
            this.pictureNum = 1;
            let objImg = {
               url: base.wang +'/file/'+ data.savePath
            };

            this.imgListData.push(objImg);
            this.recordVisible = true;
          }else if(data && data.fileType && (data.fileType.indexOf('png') == -1 || data.fileType.indexOf('jpg') == -1)) {
            this.pictureNum = 0;
            this.imgListData = [];
            this.recordVisible = true;
            // const url = base.wang +'/file/'+ data.savePath;
            // const a = document.createElement('a');
            // a.setAttribute('download', data.fileName+'.'+data.fileType);
            // a.setAttribute('href', url);
            // a.click();
          }else {
            this.$message.info('暂无数据');
          }
        }).catch((error) => {
            console.log(error, '原始记录数据获取失败error');
        });
      },
      onRecordSeeClose () {
          this.originalRecordForm = {},
          this.recordVisible = false;
          this.pictureNum = 0;
          this.imgListData = [];
      },
      lookPresentation(index,item){
        let params = {
            fileId: item.fileId,   //要下载的文件名
            pathFolder: '',   //文件夹名称，来源为 |我的报告|归档|信息回显
            taskContentId: this.onetaskContentId,  //报告任务id
            taskId : this.onetaskid,
            type: 5,
          }
          this.$api.lxtinitial.download(params).then(res => {
            console.log(res)
            if(res.data.respCode == 0){
              const url = base.wang +'/file'+ res.data.data;
              const a = document.createElement('a');
              a.setAttribute('href', url);
              a.click();
            }else{
              this.$message.error({message: res.data.message, duration: 1500});
            }
          }).then(res =>{
            // let fileName = res.data.data.fileName
            // let filePath = encodeURI(res.data.data.filePath)
            // var formEle = document.createElement('form');
            // formEle.setAttribute('id', 'formId')
            // formEle.setAttribute('method', 'GET');
            // formEle.setAttribute('action', this.$api.lxtinitial.getdownloadpath());
            // document.body.appendChild(formEle);
            // //input元素
            // var input1 = document.createElement('input');
            // input1.setAttribute('type', 'hidden');
            // input1.setAttribute('name', 'fileName');
            // input1.setAttribute('value', fileName);
            // formEle.appendChild(input1);
            // var input2 = document.createElement('input');
            // input2.setAttribute('type', 'hidden');
            // input2.setAttribute('name', 'filePath');
            // input2.setAttribute('value', filePath);
            // formEle.appendChild(input2);
            // var formId = document.getElementById('formId');
            // formId.submit();
            // document.body.removeChild(formEle);

          }).catch(err => {
            this.$message.error({message: res.data.message, duration: 1500});
          });
      },
      getdome(){
        let oInterone = this.$refs.myboxList
        let list = oInterone.getElementsByTagName('li')
        console.log(list)
        for (let i = 1; i < list.length; i++) {
          if (i % 2) {
          }else{
            list[i].style.background = '#FAFAFA'
          }
          list[i].onmousemove = function () {
            this.style.background = '#f5f7fb'
          }
          list[i].onmouseout = function () {
            if (i % 2) {
              list[i].style.background = '#fff'
            } else {
              list[i].style.background = '#FAFAFA'
            }
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.el-button--default {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    background: #fff;
    border-radius: 4px;
}

.el-button--primary {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
    border-radius: 4px;
}

.el-button--text {
    color: #32AFF0;
}

.taskmanage_border {
  width: 100%;
  height: 100%;
  background: #eee;
  margin: 0;
  padding: 10px;
  overflow: hidden;
}

/deep/ .taskmanage_con {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .query_modular {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    padding-bottom: 20px;
    .query_complex {
        width: 100%;
        display: flex;
        position: relative;
        .query_form {
            flex: 1;
        }
        .query_show {
            width: 50px;
            position: relative;
            .query_showBtn {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #32AFF0;
                padding: 10px 0;
                border: none;
            }
        }
    }
    .query_btn {
        width: 100%;
        display: flex;
        justify-content: space-between;
        p {
            margin: 0;
            padding: 0;
        }
    }
  }
  .tablePagination_modular {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .table_modular {
        flex: 1;
        overflow-y: auto;
        .el-radio__label {
            padding: 0;
        }
        .el-table th.gutter {
            display: table-cell !important
        }
    }
    .pagination_modular {
        margin-top: 20px;
        padding: 0;
    }
  }
}

// 表单
/deep/ .query_form {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
        width: 25%;
        margin: 0;
        padding-bottom: 20px;
        overflow: hidden;
        display: flex;
        align-items: center;
        .el-form-item__label {
            white-space: nowrap;
        }
        .el-form-item__content {
            flex: 1;
            padding-right: 40px;
            .el-select, .el-input, .el-date-editor {
                width: 100% !important;
            }
            .el-date-editor {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .el-input__icon {
                    width: 25px;
                }
                .el-range-input {
                    flex: 1;
                }
                .el-range-separator {
                    width: 25px;
                    padding: 0 !important;
                }
            }
        }
    }
}


.el-divider--vertical {
  margin: 0;
}

.el-divider {
  background-color: rgb(50, 175, 240);
}

/deep/ .el-scrollbar__bar {
  z-index: 999;
}


.lxt_title {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  border-top: 1px solid #eee;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}

/deep/ .el-table__expanded-cell .el-table .el-table__header-wrapper table {
  width: 100% !important;
}

/deep/ .el-table__expanded-cell .el-table .el-table__body-wrapper table {
  width: 100% !important;
}

/deep/ .state-taskStatus .stateTaskStatus.is-center {
  margin: 0 !important;
  padding: 0 !important;
}

/deep/ .state-taskStatus .stateTaskStatus.is-center .cell {
  margin: 0 !important;
  padding: 0 !important;
}

.taskStatusStyleclass {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.taskStatusStyleclass:last-child {
  border-bottom: none;
}


.dialog_quickly {
  overflow: hidden;
  padding: 50px 0;
}


/deep/ .taskDetail_dialog1 {
  min-height: 100% !important;
  margin: 0 auto !important;
}

/deep/ .dialog_quickly .el-dialog {
  height: 100% !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
}

/deep/ .dialog_quickly .el-dialog .el-dialog__body {
  flex: 1 !important;
  overflow: hidden !important;
  padding: 20px;
}

.choice_statistics {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 2000;
}

.choice_statistics .el_dialog {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.choice_statistics .el_dialog .el_dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: 18px;
    color: #303133;
  }

  .el_dialog_btnclose {
    padding: 0;
    margin: 0;
    width: 14px !important;
    height: 14px !important;

    i {
      font-size: 14px;
      color: #909399;
    }
  }
}

.choice_statistics .el_dialog .el_dialog__body {
  flex: 1;
  padding: 20px;
  overflow: hidden;
}

//
// .choice_statistics .el_dialog .el_dialog__footer {
//   padding: 20px;
// }

/deep/ .dialog_recordSee {
    overflow: hidden;
    .el-dialog {
        margin:0 !important;
        padding: 0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        height: 90%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            padding: 20px;
            overflow: hidden;
        }
    }
}
// 新增
  .mybox {
    width: 100%;
    height: auto;
    overflow: hidden;    
  }
  .mybox ul li{ border: 1px solid  rgb(235,238,245); border-bottom:none; overflow: hidden; height: 45px; line-height: 45px;}
  .mybox ul li span{ width: 100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:block; float: left; text-align: center; height: 45px; line-height: 45px; border-right: 1px solid  rgb(235,238,245);}
  .mybox ul li span.xuhao{ width: 10%;}
  .mybox ul li span.yname{ width: 30%;}
  .mybox ul li span.ydata{ width: 20%;}
  .mybox ul li span.ytype{ width: 20%;}
  .mybox ul li span.yoperation{ width: 20%; border-right:none; }
  .mybox ul li:last-child{border-bottom: 1px solid  rgb(235,238,245);}
  .mybox ul li:nth-child(1){ background: rgb(243,246,253);}
</style>
