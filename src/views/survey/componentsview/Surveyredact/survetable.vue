<template>
  <!-- 报告编辑 - 查询内容展示 -->
  <section class="dislogBox" :style="{
    padding: myStyle ? '20px 20px 0 20px' : '0'
  }">

    <div class="dislogBox_content" :style="{
      overflowY: myStyle ? 'visible':'auto'
     }">
      <div class="componentBoxs">
        <!-- 一级头部 -->
        <ul class="cB_listTitle" v-if=" myStyle ? true : false">
          <li class="tasknumber">报告编号</li>
          <li class="inspected">受检单位</li>
          <li class="sample">样品名称</li>
          <li class="specification">规格型号</li>
          <li class="trademark">商标</li>
          <li class="operation">操作</li>
        </ul>

        <!-- 一级列表 -->
        <div class="Interone" ref="interone" v-show="dataList.length==0?false:true">
          <div class="cB_assembly" v-for="(item,index) in dataList" :key="index">
            <ul class="cB_listcenter">
              <li class="tasknumber" :title="item.tasknumber"
                  :style="flowColor(item.flowStatus)">{{item.tasknumber}}
              </li>
              <li class="inspected" :title="item.inspected">{{item.inspected}}</li>
              <li class="sample" :title="item.sample">{{item.sample}}</li>
              <li class="specification" :title="item.specification">{{item.specification}}</li>
              <li class="trademark" :title="item.trademark">{{item.trademark}}</li>
              <li class="operation">
                <span class="spanclass" @click="browse(item)">浏览</span>
                <i>&nbsp;</i>
                <span class="spanclass" @click="taskDetail(item)">详情</span>
                <i>&nbsp;</i>
                <!-- <span class="spanclass" @click="viewreport(item)">查看</span>
                <i>&nbsp;</i> -->
                <!-- <button class="primary">方案</button> -->
                <!-- <span class="spanclass" @click="goUploadParam(item)">上传参数</span> -->
              </li>
            </ul>
            <div class="oneFirstFloor" id="oneFirstFloor" v-if="item.ckenck == true">
              <!-- 一级功能区 -->
              <div class="buttons">
                <el-button type="primary" class="btnsPrimary" plain @click="gotoNext(0)">提交报告</el-button>
                <el-button type="danger" class="btnsPrimary" plain @click="regression">退回</el-button>
                <!-- <el-button type="success" class="btnsPrimary" plain @click="gotoNext(1)">直接完成</el-button>
                <el-button type="info" class="btnsPrimary" plain @click="bulkDownReport">批量下载报告</el-button> -->
                <!-- 需求变更: 取消了批量上传报告的按钮
                <el-button type="warning" class="btnsPrimary" plain @click="bulkuploadReport">批量上传报告</el-button>
                -->
              </div>
              <div class="pot">
                <div class="el-loading-mask" v-if="falgtow">
                  <div class="el-loading-spinner">
                    <svg viewBox="25 25 50 50" class="circular">
                      <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                    </svg>
                  </div>
                </div>
                <!-- 二级头部 -->
                <ul class="cB_listTitle">
                  <li class="tasknumber2">
                    <el-checkbox v-model="checkAll" ref="mychenga" class="checkboxleft"
                                 @change="handleCheckAllChange"></el-checkbox>
                  </li>
                  <li class="inspected2">序号</li>
                  <li class="sample2">检验项目</li>
                  <li class="trademark2_1">检验依据</li>

                  <!-- <li class="trademark2_1">检验方法</li> -->
                  <li class="specification2">检验科室</li>
                  <li class="trademark2_4">报告校核人</li>
                  <li class="trademark2_3">公章类型</li>
                  <li class="operation2">操作</li>
                </ul>
                <!-- 二级列表 -->
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" class="bordeLine">
                  <div class="cB_theCirculation" v-for="(item,index) in dataListTwo" :key="item.id">
                    <ul class="onecB_listcenter" :style="flowColor(item.flowStatus)">
                      <li class="tasknumber2">
                        <el-checkbox v-model=item.checked :label="item" @change="inspectids(item)"
                          v-if="item.process_instance_id != 3 || item.isCurrentPower  == 0 ? false : true"
                                     class="checkboxleft"></el-checkbox>
                      </li>
                      <li class="inspected2">{{item.serialNumber}}</li>
                      <li class="sample2">{{item.sample}}</li>
                      <li class="trademark2_1" :title=item.specification>{{item.specification}}</li>
                      <li class="specification2">{{item.orgName}}</li>
                      <li class="trademark2_4">

                           <SelectTree
                              v-if="item.process_instance_id != 3 || item.isCurrentPower  == 0 ? false : true"
                              class="selectTree"
                              :props="props"
                              :options="item.listTree"
                              :value="item.valueId"
                              :itemId="item.id"
                              :clearable="isClearable"
                              :accordion="isAccordion"
                              @getValue="getValue($event)"
                            />


                          <!-- <el-select v-model="item.inspecopval" placeholder="请选择" class="incolde selwidth"
                            v-if="item.process_instance_id != 3 ? false : true"
                                   @change="inspectlist(item.id,item.inspecopval)">
                            <el-option
                              v-for="itemthree in inspectBox[index]"
                              :key="itemthree.id"
                              :label="itemthree.name"
                              :value="itemthree.loginName">
                            </el-option>
                          </el-select> -->

                      </li>
                      <li class="trademark2_3">
                          <el-select v-model="item.selvalue" placeholder="请选择" class="incolde selwidth"
                            v-if="item.process_instance_id != 3 || item.isCurrentPower  == 0 ? false : true"
                                   @change="slvuel(item.id,item.selvalue)">
                            <el-option
                              v-for="itemtow in xqoptionBox[index]"
                              :key="itemtow.id"
                              :label="itemtow.name"
                              :value="itemtow.id">
                            </el-option>
                          </el-select>
                      </li>
                      <li class="operation2">
                        <span class="spanclass" @click="goUpload(item)" v-if ="item.needReport == '1' ? true : false">报告生成
                            <b style="color: #67C23A"
                               v-if="item.isUploadReport==0 || item.isUploadReport==null ? false : true"
                            >✔</b>
                        </span>
                        <i>&nbsp;</i>
                        <span class="spanclass" @click="look(item)" v-if ="item.needReport == '1' ? true : false">查看报告</span>
                        <i>&nbsp;</i>
                        <span class="spanclass" v-if ="item.needTest == '1' ? true : false" @click="clicklook(item)">查看原始记录
                          <b style="color: #67C23A"
                               v-if="item.isUploadOriginal==0 || item.isUploadOriginal==null ? false : true"
                            >✔</b>
                        </span>
                        <i>&nbsp;</i>
                         <span class="spanclass" @click="circulation(item)">流转</span>
                      </li>
                    </ul>
                    <!-- 三级列表 -->
                    <div class="twoFirstFloor" v-if="item.ckenck == true">
                      <div class="el-loading-mask" v-if="falgthree">
                        <div class="el-loading-spinner">
                          <svg viewBox="25 25 50 50" class="circular">
                            <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                          </svg>
                        </div>
                      </div>
                      <ul class="cB_listTitle">
                        <li class="tasknumber">序号</li>
                        <li class="sample">节点名称</li>
                        <li class="trademark">开始时间</li>
                        <li class="operation">结束时间</li>
                        <li class="specification">负责人</li>
                        <li class="inspected">处理意见</li>
                      </ul>
                      <ul class="onecB_listcenter" v-for="(item,index) in dataListThree" :key="index">
                        <li class="tasknumber">{{item.flowtid}}</li>
                        <li class="sample" :style="flowColorThree(item.reason)">{{item.sample}}</li>
                        <li class="trademark">{{item.trademark}}</li>
                        <li class="operation">{{item.trademarktwo}}</li>
                        <li class="specification">{{item.specification}}</li>
                        <li class="inspected">{{item.reason}}</li>
                      </ul>
                    </div>

                  </div>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
        <!-- 暂无数据 -->
        <div v-show="dataList.length==0?true:false"
             style="line-height:60px;text-align: center;border: 1px solid #EBEEF5;border-top:none;">
          <span style="color: #909399 !important;">暂无数据</span>
        </div>
      </div>
      <!-- 分页器 -->
      <div class="zhanwei"></div>
      <div :class="{'lxt_block':myStyles==false}" :style="{
        paddingTop: myStyle ? '10px' : '0'
       }">
        <!-- 报告编辑页显示的分页器 -->
        <el-pagination v-if="myStyles==false"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[10,20,30]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total=total>
        </el-pagination>
        <!-- 首页显示的分页器 -->
        <el-pagination v-if="myStyles==true"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[5,7,11]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total=total>
        </el-pagination>
      </div>
    </div>
    <!-- 报告生成 -->
    <el-dialog title="报告生成" :visible.sync="dialogFormVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :destroy-on-close="true"
               width="60%">
      <section class="upData">
        <p>方式1：</p>
        <div>
          报告自动填充：<el-button type="primary">报告自动生成</el-button>
        </div>
        <p>方式2：</p>
        <div class="pszet" v-if="falg">
          <div class="prevtersize">上传试验报告：</div>
          <div class="prevter"></div>
          <el-upload
            class="upload-demo"
            ref="upload"
            action="1"
            style="width:30%;float: left; margin-left: 10px; position: relative;"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :limit="100"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取本地文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
          </el-upload>
        </div>
        <p>方式3：</p>
        <div class="uptest">
          <div class="uptest-item">
            <label>检验类型 :&nbsp;&nbsp;</label>
            <el-select v-model="upvalue" placeholder="请选择" @change="testType(upvalue)" size="small" class="selteWidth">
              <el-option
                v-for="item in uplists"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="uptest-item">
            <label>已有模板 :&nbsp;&nbsp;</label>
            <el-select v-model="covalue" placeholder="请选择" size="small" class="selteWidth2">
              <el-option
                v-for="item in colists"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="success" @click="sureplace">替换</el-button>
          </div>
        </div>
        <!-- <el-button type="danger" @click="fileRestore">CQC文件还原</el-button> -->
      </section>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"
                   style="height: 32px;padding: 0 20px;"
        >取 消
        </el-button>
        <el-button type="primary" @click="uploadok"
                   style="height: 32px;padding: 0 20px;"
        >确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="回退" :visible.sync="dialogTableVisible"
               :before-close='closedialog'>
      <div class="regseep">
        <b class="on">选择节点</b>
        <el-select v-model="regvalue" placeholder="请选择">
          <el-option
            v-for="item in reg"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="regseep">
        <b>回退原因</b>
        <el-input class="textareawidth"
                  type="textarea"
                  :rows="5"
                  maxlength="200"
                  show-word-limit
                  placeholder="请输入内容"
                  v-model="textarea">
        </el-input>
      </div>
      <div class="regBtn">
        <el-button type="primary" @click="regBtnok">确定</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog title="信息" :visible.sync="dialogTableVisible2">
      <div class="regseep">
        <b>针对修改内容做情况说明</b>
        <el-input class="textareawidth2"
                  type="textarea"
                  :rows="5"
                   maxlength="200"
                  show-word-limit
                  placeholder="请输入内容"
                  v-model="textarea2">
        </el-input>
      </div>
      <div class="regBtn2">
        <el-button type="primary" @click="regBtnok2">确定</el-button>
      </div>
    </el-dialog> -->
    <!-- 弹出 -->
    <el-dialog
      title="查看"
      :visible.sync="dialogFormVisible2"
      v-if="dialogFormVisible2"
      v-bind="{
          modal: false,
          width:'99.9%',
          top:'0',
        }"
      :custom-class="'taskDetail_dialog1'"
    >
      <!-- 任务下达模块引入 -->
      <taskDetail
        ref="taskDetail"
        saveType="3"
        :other-taskinfor="mlyTaskinfor"
      />
    </el-dialog>
    <!--下载word-pdf-查看调用对象-->
    <object id="WO3Word2" classid="clsid:561C5A99-71C8-48d4-A3E2-16FC4F9880BF"
            width="0" height="0" style="visibility:hidden;">
    </object>
    <!-- 新增 -->
     <!-- 原始记录查看 -->
      <el-dialog
        title="查看原始记录"
        :visible.sync="dialogrecord"
        width="70%"
        :before-close="handleClose">
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


  </section>
</template>

<script>
  //import taskDetail from '@/views/entrust/componentsview/Entrustlist.vue'
  import SelectTree from '../../soltall2.vue'
  import taskDetail from '@/views/taskdelegation/componentstask/acceptance.vue'
  import recordsee from '@/components/recordSee';
  import base from "@/api/base.js"
  export default {
    name: 'survetable',
    data() {
      return {
        dataList: [],  //一级列表展示
        dataListTwo: [],  //二级列表展示
        dataListThree:[],//三级列表展示
        currentPage: 1, // 当前页数  分页
        pageSize: 2,   //每页显示条数 分页
        total: 0,  // 总条数
        xqoptionBox: [],//存公章的循环数组 下拉框
        //xqoptions: [],
        inBox: [],//存二级列表的选中id和存公章的循环数组的值 下拉框  /*重要字段 */
        xqidBox: [], //存二级选中得数据id
        xqvalueBox: [], //存公章的循环数组的值 下拉框
        checkAll: false, //二级全选按钮
        valTwomun: '',// 二级列队当前选中的id
        checkedCities: [],
        cityOptions: [],
        dialogFormVisible: false, //上传
        upitmeid: '',
        fileList: [],//上传文件存储
        uplists: [],  //检验类型的列队
        upvalue: '', //检验类型绑定的值
        colists: [],  //已有模板的列队
        covalue: '',//已有模板绑定的值
        dialogTableVisible: false, // 回退弹出
        reg: [],// 回退弹出  选择节点列队
        regvalue: '',//回退弹出  选择节点选择的节点
        textarea: '',//回退弹出  回退原因
        itemValues: [], //存储选中的报告的id
        tofinish: 0,  //  提交下一步  直接完成
        statusbox: [],//存储回退的数据
        dialogTableVisible2: false, // 提交下一步中出现回退信息的弹框
        // textarea2: '',//提交下一步中出现回退信息的弹框的内容
        uidName: '', // 获取登陆者id
        deptid: '', // 获取科室id
        towCurItem: '', // 存储点击二级列表当前项
        threeCurItem: '', // 存储点击三级列表当前项
        dialogFormVisible2: false, // 弹出层的配置
        falvalue: '', // 存储刷新后的公章id
        falg: false, //更新上传组件
        myStyles: this.myStyle,//分页样式选择
        falgtow: false,// 查询动画 二级
        //新增


        inspectBox: [],//存报告审核人的循环数组 下拉框
        xqinspectBox: [], //存告审核人的循环数组的值 下拉框

        dialogrecord: false,// 编辑原始记录弹窗
        regList:[],//编辑原始记录list
        //原始记录查看传组件的数据
        originalRecordForm: {}, // 原始记录表单
        recordVisible: false, // 原始记录查看-显示状态
        pictureNum: 0, // 图片数量
        imgListData: [], // 图片路径
        //原始记录查看传组件的数据
        onetaskContentId:'',//报告id
        onetaskid:'',//任务id
        rowdata:'',//存储当前查看的原始记录任务



        //树形下拉选择
        isClearable: true, // 可清空（可选）
        isAccordion: true, // 可收起（可选）
        valueId: null, // 初始ID（可选）
        props: {
          // 配置项（必选）
          value: "value",
          label: "name",
          children: "list"
          // disabled:true
        },
        // 选项列表（必选）
        listTree: [],
        //
        mlyTaskinfor:null,




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

    methods: {
      taskDetail(item) {  //详情的组件传值
        let that = this;
        that.dialogFormVisible2 = true;
        this.mlyTaskinfor = {
          'otherFrom': 'other2',
          'params': {
            taskid: item.mid,
            searchdate: this.queryTypeChild.searchdate,
            processInstanceId: this.queryTypeChild.process_instance_id
          }
        }
        // this.$api.lxtinitial.detailed
      },

      flowColor(vlau) {  // 一级 二级 判断回退 和提交 单元格的颜色
        if (vlau == 1) {
          return {
            background: 'pink'
          }
        } else if (vlau == 2) {
          return {
            background: 'yellow'
          }
        } else if (vlau == undefined) {
          return {
            background: ''
          }
        } else {
          return {
            background: ''
          }
        }
      },
      flowColorThree(vlau) { // 三级 判断颜色
        if (vlau == null) {
          return {
            color: ''
          }
        }
        if (vlau.length > 0) {
          return {
            color: 'red'
          }
        } else {
          return {
            color: ''
          }
        }
      },
      dataListData() {//一级列表展示数据
        this.dataList = [];
        if (this.querydataChild.length == 0) {
          if (this.currentPage == 1) {
            this.currentPage = 1; // 当前页数分页
            this.mypagesize ? this.pageSize = this.mypagesize : this.pageSize = 10; //每页显示条数分页
            this.total = 0;  // 总条数
          } else {
            this.currentPage = this.currentPage - 1;
            this.$emit('cpage', this.currentPage);
            this.translate();
            this.$parent.queryselect();
          }
        } else {
          this.currentPage = this.querydataChild[0].currentPage; // 当前页数分页
          this.mypagesize ? this.pageSize = this.mypagesize : this.pageSize = this.querydataChild[0].pageSize; //每页显示条数分页
          this.total = this.querydataChild[0].total;  // 总条数
        }
        this.querydataChild.forEach(item => {
          let obj = {
            ckenck: false,
            tasknumber: item.taskCode,  //任务号
            inspected: item.companyCheck,//受检单位
            sample: item.sampleName,//样品名称
            specification: item.sampleType,//规格型号
            trademark: item.sampleTrademark, //商标
            mid: item.id,//id
            flowStatus: item.flowStatus, //根据返回的值选颜色
            examineName:item.examineName,
          }
          this.dataList.push(obj)
        });
      },
      translate() { // 隔行换色 一级
        let oInterone = this.$refs.interone
        let list = oInterone.children;
        for (let i = 0; i < list.length; i++) {
          if (i % 2) {
            let _ul = list[i].children[0];
            _ul.style.background = "#FAFAFA"
          }
          list[i].onmousemove = function () {
            let _ul = this.children[0];
            _ul.style.background = "#f5f7fb"
          };
          list[i].onmouseout = function () {
            let _ul = this.children[0];
            if (i % 2) {
              _ul.style.background = "#FAFAFA"
            } else {
              _ul.style.background = ""
            }
          };
        }
      },
      browse(item) { //二级显示隐藏
        this.statusbox = [];
        this.checkAll = false;
        this.towCurItem = item;
        this.onetaskid = item.mid;

        if (item.ckenck == true) {
          item.ckenck = false;
          this.dataListTwo = [];

        } else {
          this.dataList.forEach((item, index) => {
            item.ckenck = false;
          });
          item.ckenck = true;
          this.towListFn()
        }
      },
      /*
      * 功能: 查询二级数据
      * */
      towListFn() {
        let item = this.towCurItem;
        this.valTwomun = item;
        this.inBox = [];
        this.checkedCities = [];
        this.itemValues = [];
        this.getDeptUserList();// 调取 下拉树形数据   人！！！
        const data = {
          "companyCheck": this.queryTypeChild.companyCheck,   //受检单位
          "process_instance_id": this.queryTypeChild.process_instance_id,  //报告类型，进度实例id 2-任务分配 3-报告检测 4-校验报告 5-报告审核 6-报告批准 7-报告归档 8-初次校对
          "sampleName": this.queryTypeChild.sampleName,  //样品名称
          "sampleType": this.queryTypeChild.sampleType,      //规格型号
          "searchdate": this.queryTypeChild.searchdate,    //查询年月
          "searchdate2": this.queryTypeChild.searchdate2,   //下达日期
          "taskCode": item.tasknumber,   //报告编号
          'trademarkmode': this.trademarkmode,//商标
          'processInstanceIdName':this.queryTypeChild.processInstanceIdName
        };
        //二级列表展示数据
        this.falgtow = true;
        this.$api.lxtinitial.getwomuntow(this.valTwomun.mid, data).then(res => {
          //console.log(res)
          this.falgtow = false;
          let data = res.data.data.list;

          if (data.length == 0) {
            this.dataListTwo = [];
            this.cityOptions = [];
            this.$parent.queryselect();  //获取父级的方法
            return;
          } else {
            let arr = [];
            this.inspectBox = [];
            this.xqoptionBox = [];
            data.forEach((item, index) => {
              this.xqoptionBox.push(item.clist); //图章下拉列表
              this.inspectBox.push(item.jiaoHeList); //报告校核人下拉列表
              let content;
              let obj;
              let opval = ''; //下拉框默认值
              let clistID = '';//下拉框默认值的id



              if (item.cvItemsCode != null && item.cvItemsCode.length == 10) {
                content = item.cvItemsCode + "(" + item.itemsCode + ")";
              } else {
                content = item.itemsCode;
              }
              //console.log(opval)
              item.clist.forEach(item => {
                if (item.selected) {
                  opval = item.name;
                  clistID = item.id;
                }
              });
              //console.log(item)
              obj = {
                id: item.id,
                checked: false,
                ckenck: false,
                clist: item.clist, //图章
                mlist:item.jiaoHeList, //报告校核人
                serialNumber: index + 1,
                //sample: content,itemsName
                sample: item.itemsName,
                specification: item.itemsBasis,
                trademark: item.master,
                selvalue: opval, //下拉框默认值
                selvalid: clistID, //下拉框默认值的id
                inspecopval : '', //报告审核人默认值
                inspeclistID : '',//报告审核人默认值的id
                flowStatus: item.flowStatus, // 上色
                isUploadReport: item.isUploadReport, // 上传过文件的数据,上传后面有个绿色的对勾
                testmethod :item.itemsFrederickItme, //检验方法
                needReport: item.needReport,  // 是否出报告    为1时候 报告生成和查看报告
                needTest:item.needTest,  // 是否做实验    为1时候 显示查看原始记录
                orgName:item.orgName,//检验科室
                process_instance_id:item.process_instance_id,
                isUploadOriginal : item.isUploadOriginal,// 上传过原始记录的数据,上传后面有个绿色的对勾
                listTree : this.listTree, // 树形下拉选择框
                valueId : '', // 树形下拉选择框选中的值
                isCurrentPower : item.isCurrentPower
              };
             // console.log(obj.selvalue)
              arr.push(obj)
            });
            //console.log(arr);
            this.dataListTwo = arr;
            this.cityOptions = arr;
          }
        }).catch(res => {
          this.falgtow = false;
          this.$alert(res.data.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      circulation(item) {//三级显示隐藏
        this.threeCurItem = item;
        if (item.ckenck == true) {
          item.ckenck = false;
          this.dataListThree = [];
        } else {
          this.dataListTwo.forEach((item, index) => {
            item.ckenck = false;
          });
          item.ckenck = true;
          this.threeListFn()
        }
      },
      threeListFn() {
        let item = this.threeCurItem;
        const data = item.id
        this.falgthree = true;
        this.$api.lxtinitial.getwomunthree(data).then(res => {
          this.falgthree = false;
          let data = res.data.data;
          if (data.length == 0) {
            this.dataListThree = [];
            return;
          }
          let arr = [];

          data.forEach((item, index) => {
            let obj = {
              flowtid: index + 1, //序号
              sample: item.flowname,//节点名称
              checked: false,//负责人
              specification: item.name,//负责人
              trademark: item.create_date, //开始时间
              trademarktwo: item.end_date, //结束时间
              reason: item.reason, // 判断颜色
            };
            arr.push(obj);
          });

          this.dataListThree = arr
        }).catch(res => {
          this.falgthree = false;
          this.$alert(res.data.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },

      handleSizeChange(val) {
        this.pageSize = val; // 每页展示的条数
        this.$emit('displayed', val);
        this.$nextTick(res => {
          this.translate();
          this.$parent.queryselect();
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val; // 当前展示的第几页
        this.$emit('cpage', val);
        this.$nextTick(res => {
          this.translate();
          this.$parent.queryselect();
        })
        //this.itemValues=[];
      },
      handleCheckAllChange(val) {  //全选
        let arrTowList = this.dataListTwo;
        console.log(this.dataListTwo)
        let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");//?????
        if (val) {
          console.log(val)

          this.checkedCities = val ? this.cityOptions : [];
          const arr = [];
          this.itemValues = [];
          this.statusbox = [];
          arrTowList.forEach((item, index) => {
            item.checked = true;
            this.statusbox.push({id: item.id, flowStatus: item.flowStatus});
            if (reg.test(item.selvalue)) {//?????
              item.selvalue = item.selvalid;
            }
            if (reg.test(item.inspecopval)) {//?????
              item.inspecopval = item.inspeclistID
            }
            if(item.process_instance_id == 3 && item.isCurrentPower != 0){
              let obj = {"id": item.id, "value": item.selvalue,"value1":item.valueId};//?????
              arr.push(obj)
              this.itemValues.push(item.id);
            }
          });
          console.log(arr)
          this.inBox = arr; //重新赋值
          this.checkAll = true;

        } else {
          arrTowList.forEach((item, index) => {
            item.checked = false;
          });
          this.checkedCities = val ? this.cityOptions : [];
          this.inBox = []; //重新赋值
          this.checkAll = false;
          this.statusbox = [];
          this.itemValues = [];
        }
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length / 2;
        this.checkAll = checkedCount === this.dataListTwo.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataListTwo.length;
      },
      inspectids(item) { //选中的数据
        console.log(item)
        this.upitmeid = item.id;
        let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        console.log(item.checked)
        if (item.checked == false) {
          this.itemValues.push(item.id);
          if (reg.test(item.selvalue)) {
            item.selvalue = item.selvalid
          }
          if (reg.test(item.inspecopval)) {
              item.inspecopval = item.inspeclistID
            }

          this.inBox.push({id: item.id, value: item.selvalue, value1:item.valueId});
          console.log(this.inBox)
          this.checkedCities.push(item);
          this.statusbox.push({id: item.id, flowStatus: item.flowStatus});
          item.checked = true;

        } else {
          item.checked = false;
          let flows = this.statusbox.filter((val, i) => {
            return val.id != item.id;
          });
          this.statusbox = flows;

          let filters = this.inBox.filter((val, i) => {
            return val.id != item.id;
          });
          this.inBox = filters;
          let filterstwo = this.checkedCities.filter((val, i) => {
            return val.id != item.id;
          });
          this.checkedCities = filterstwo;
          let filtersthree = this.itemValues.filter((val, i) => {
            return val != item.id;
          });
          this.itemValues = filtersthree;
        }
      },
      gotoNext(tofinish) { //提交下一步  直接完成
        this.tofinish = tofinish;
        let munarr = '';
        let _munarr = '';
        let official = '';
        let offinspect = '';
        this.xqidBox = [];
        this.xqvalueBox = [];
        this.xqinspectBox = []
        let arrinBox = this.inBox;
        let _list = arrinBox.filter(item => {
          return item.value == '';
        });
        let _list1 = arrinBox.filter(item => {
          return item.value1 == '';
        });
        console.log(arrinBox)
        if (this.inBox.length == 0) {
          this.$alert("请先选择报告", '信息提示', {
            dangerouslyUseHTMLString: true
          });
          return;
        }
        console.log(arrinBox)
        if (_list.length == 0 && _list1.length==0) {
          this.inBox.forEach(copyitem => {
            this.xqidBox.push(copyitem.id);
            this.xqvalueBox.push(copyitem.value)
            this.xqinspectBox.push(copyitem.value1)
          });
          _munarr = [...new Set(this.xqidBox)]
          munarr = _munarr.join(","); //检验项目id,多个‘,’分割
          official = this.xqvalueBox.join(",");  //公章信息，传value,多个‘,’分割
          offinspect = this.xqinspectBox.join(",");  //报告校核人信息，传value,多个‘,’分割
          let _flowid = [];// 存在回退任务的id
          this.statusbox.forEach(item => {
            if (item.flowStatus != 0) {
              _flowid.push(item.id)
            }
          });
          let flowid = _flowid.join(","); //回退任务id,多个‘,’分割
          const data = {
            "batchflag": "0",   //0提交下一步，2 是从检验报告状态提交到无发票号码，3 是从检验报告状态提交到无整改证明
            "inspectids": munarr,    //检验项目id,多个‘,’分割
            "process_instance_id": this.queryTypeChild.process_instance_id,//进度实例id 2-任务分配 3-报告检测 4-校验报告 5-报告审核 6-报告批准 7-报告归档 8-初次校对
            "toFinish": this.tofinish,    //完成情况 0未完成 1直接完成
            "zhangs": official,   //公章信息，传value,多个‘,’分割
            "searchdate": this.queryTypeChild.searchdate,  //查询日期
            "assignee":offinspect,
            'processInstanceIdName':this.queryTypeChild.processInstanceIdName,
          };
            this.$confirm('您确定要提交吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
              }).then(() => {
                this.$api.lxtinitial.gotonext(data).then(res => {
                  this.inBox = [];

                  let data = res.data;
                  if (data.respCode == 0) {
                    this.$alert('提交成功', '信息提示', {
                      dangerouslyUseHTMLString: true
                    });
                    this.itemValues = [];
                    this.xqidBox = [];
                    this.towListFn();
                  }
                }).catch(res => {
                  let data = res.data;
                  this.$alert(data.message, '信息提示', {
                    dangerouslyUseHTMLString: true
                  });
                  //this.itemValues = [];
                  this.xqidBox = [];
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消操作',
                  duration: 1500
                });
              });

        } else {
          this.$alert('请先确认选择了当前选中的公章信息与报告校核人', '信息提示', {
            dangerouslyUseHTMLString: true
          });
        }
      },
      // regBtnok2() {   //  提交下一步 有回退信息的时候
      //   let munarr = '';
      //   let _munarr = '';
      //   let official = '';
      //   let offinspect = '';
      //   this.xqidBox = [];
      //   this.xqvalueBox = [];
      //   this.xqinspectBox = []
      //   this.dialogTableVisible2 = false;
      //   this.inBox.forEach(copyitem => {
      //     this.xqidBox.push(copyitem.id);
      //     this.xqvalueBox.push(copyitem.value);
      //     this.xqinspectBox.push(copyitem.value1);
      //   });
      //   _munarr = [...new Set(this.xqidBox)];
      //   munarr = _munarr.join(","); //检验项目id,多个‘,’分割
      //   official = this.xqvalueBox.join(",");  //公章信息，传value,多个‘,’分割
      //   offinspect = this.xqinspectBox.join(",");  //审核人信息，传value,多个‘,’分割
      //   let _flowid = [];// 存在回退任务的id
      //   this.statusbox.forEach(item => {
      //     if (item.flowStatus != 0) {
      //       _flowid.push(item.id)
      //     }
      //   });

      //   let flowid = _flowid.join(","); //回退任务id,多个‘,’分割
      //   if (this.textarea2.trim() == '') {
      //     this.$alert('信息不能为空', '信息提示', {
      //       dangerouslyUseHTMLString: true
      //     });
      //     return
      //   }
      //   const data2 = {
      //     "batchflag": "0",   //0提交下一步，2 是从检验报告状态提交到无发票号码，3 是从检验报告状态提交到无整改证明
      //     "inspectids": munarr,    //检验项目id,多个‘,’分割
      //     "processinstance": this.queryTypeChild.process_instance_id,  //进度实例id 2-任务分配 3-报告检测 4-校验报告 5-报告审核 6-报告批准 7-报告归档 8-初次校对
      //     "toFinish": this.tofinish,    //完成情况 0未完成 1直接完成
      //     "zhangs": official,   //公章信息，传value,多个‘,’分割
      //     "searchdate": this.queryTypeChild.searchdate,  //查询日期
      //     "backMessage": this.textarea2,  //针对修改内容做情况说明
      //     "backInspectIds": flowid,   //被回退过的检验项目id,多个‘,’分割
      //     "continuenext": 0,  //传0
      //     "assignee":offinspect,
      //     'processInstanceIdName':this.queryTypeChild.processInstanceIdName
      //   };
      //   this.$api.lxtinitial.gotonext2(data2).then(res => {
      //     this.inBox = [];
      //     let data = res.data;
      //     if (data.respCode == 0) {
      //       this.$alert('提交成功', '信息提示', {
      //         dangerouslyUseHTMLString: true
      //       });
      //       this.itemValues = [];
      //       this.xqidBox = [];
      //       this.textarea2 = [];
      //       this.towListFn();
      //     }
      //   }).catch(res => {
      //     let data = res.data;
      //     this.$alert(data.message, '信息提示', {
      //       dangerouslyUseHTMLString: true
      //     });
      //     this.textarea2 = '';
      //     //this.itemValues = [];
      //     this.xqidBox = []
      //   })
      // },
      goUpload(item) { //上传按钮
        this.dialogFormVisible = true;
        this.falg = true;
        this.upitmeid = item.id;
        this.fileList=[];
        this.uplists = []; //清空数组
        this.colists = [];//清空数组
        this.information();
        // v-if="item.isUploadReport==0 || item.isUploadReport==null ? false : true"
        if(!item.isUploadReport==0 || !item.isUploadReport==null){
          let name = item.id+'.doc'
          console.log(name)
          this.fileList=[{name:name}]
        }
      },
      submitUpload(file) {//上传按钮
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      beforeUpload(file) {//上传按钮
       //  this.fileList=[];
       //  this.fileList.push({name: file.name})
        let data = {
          "file": file
        };
        let fd = new FormData();
        fd.append("inspectid", this.upitmeid);
        fd.append("file", file);
        this.$api.lxtinitial.goupload(fd).then(res => {
          let data = res.data;
          if (data.respCode == 0) {
            this.$alert(res.data.message, '信息提示', {
              dangerouslyUseHTMLString: true
            });
          }
        }).catch(res => {
          let data = res.data;
          this.$alert(res.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
        // this.$refs.upload.clearFiles()
        // this.$refs.name.clearFiles()
      },
      handleExceed(files, fileList) {
        this.$message.warning(`请先删除当前文件在进行选择！`);
      },
      uploadok() {
        this.dialogFormVisible = false;
        this.falg = false;
        this.browse(this.towCurItem);
      },
      information() {  //检验类型数据展示
        let mid = this.upitmeid;
        this.$api.lxtinitial.infortion(mid).then(res => {

          let data = res.data.data;
          data.forEach(item => {
            //{value: '选项1',label: '黄金糕'}
            let obj = {value: item.typeABC + 'wang', label: item.typeABC};
            this.uplists.push(obj)

          });
        }).catch(res => {
          this.$alert(res.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      testType(val) {//通过检验类型下拉选中的值 来请求 已有模板 的数据展示
        let type = val.match(/(\S*)wang/)[1];
        this.colists = [];
        this.covalue = '';
        this.$api.lxtinitial.testop(type).then(res => {
          let data = res.data.data;
          data.forEach(item => {
            let obj = {value: item + 'wang', label: item};
            this.colists.push(obj)
          });
        }).catch(res => {
          this.$alert(res.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      sureplace() { //替换按钮
        let type = this.upvalue.match(/(\S*)wang/)[1];
        let typeFile = this.covalue.match(/(\S*)wang/)[1];
        const data = {
          "inspectid": this.upitmeid,  //检测项目id
          "typeABC": type,   //检验类型编码，/api/job/task/findTemplate/{inspectid} 返回信息
          "templatefile": typeFile,    //模板文件，/api/job/task/findTemplateName/{typeABC} 返回信息
        };
        this.$api.lxtinitial.replace(data).then(res => {
          let data = res.data;
          if (data.respCode == 0) {
            this.$alert(res.data.message, '信息提示', {
              dangerouslyUseHTMLString: true
            });
            this.colists = [];
            this.covalue = '';//已有模板绑定的值
            this.upvalue = ''; //检验类型绑定的值
          }
        }).catch(res => {
          let data = res.data;
          this.$alert(res.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      // fileRestore(){  // CQC文件还原
      //     let _this = this;
      //     this.$confirm('您修改的CQC文件将被原始文件覆盖,是否继续?', '提示', {
      //         confirmButtonText: '确定',
      //         cancelButtonText: '取消',
      //         type: 'warning',
      //         center: true
      //     }).then(() => {
      //         let id = _this.upitmeid;
      //         _this.$api.lxtinitial.cqcrestore(id).then(res => {
      //             if(res.data.data.respCode == 0){
      //                 this.$message({
      //                     type: 'success',
      //                     message: '覆盖成功!'
      //                 });
      //             }else{
      //                 this.$message({
      //                     type: 'success',
      //                     message: res.data.data.message
      //                 });
      //             }

      //         })
      //     }).catch(() => {
      //     this.$message({
      //         type: 'info',
      //         message: '已取消操作'
      //     });
      //     });
      // },
      regression() { //回退按钮  弹出

        console.log(this.itemValues)


        if (this.itemValues.length > 0) {
          
          this.dialogTableVisible = true;
          this.reg = [];

          let beStr = '';
          let ivSet = [...new Set(this.itemValues)]
          beStr = ivSet.join(",");
          //let processinstance = this.queryTypeChild.process_instance_id;
          let businessKey = beStr;
          let isShowMainNode = false;
          this.$api.lxtinitial.flow(businessKey,isShowMainNode).then(res => {  //  回退节点
            let data = res.data.data;
            // console.log(res.data);
            data.forEach((item, index) => {
              let obj = {value: item.activityId, label: item.activityName};
              this.reg.push(obj)
            });
            this.regvalue = this.reg[0].label
          }).catch(res => {
            this.$alert(res.data.message, '信息提示', {
              dangerouslyUseHTMLString: true
            });
          })

        } else {
          this.$alert('请选择要回退的信息', '信息提示', {
            dangerouslyUseHTMLString: true
          });
        }
      },
      regBtnok() {//弹出 您确定要回退吗
        if (this.regvalue == this.reg[0].label) {
          this.regvalue = this.reg[0].value
        }
        if (this.textarea.trim() == "") {
          this.$alert('请选择要描述的信息', '信息提示', {
            dangerouslyUseHTMLString: true
          });
          return;
        }
        let beStr = '';
        let ivSet = [...new Set(this.itemValues)]
        beStr = ivSet.join(",");
        // console.log(this.regvalue);
        const data = {
          "backprocessinstance": this.regvalue,   //要回退进度实例id 2-任务分配 3-报告检测 4-校验报告 5-报告审核 6-报告批准 7-报告归档 8-初次校对
          "inspectids": beStr,  //检测项目id
          "process_instance_id": this.queryTypeChild.process_instance_id,  //当前的进度示例id 2-任务分配 3-报告检测 4-校验报告 5-报告审核 6-报告批准 7-报告归档 8-初次校对
          "reason": this.textarea,  //回退原因
          "searchdate": this.queryTypeChild.searchdate,  //搜查年月
          'processInstanceIdName':this.queryTypeChild.processInstanceIdName,
        };

        this.$confirm('您确定要回退吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          //let id = _this.upitmeid;
          this.dialogTableVisible = false;
          this.$api.lxtinitial.goBack(data).then(res => {
            if (res.data.respCode == 0) {
              this.$message({
                type: 'success',
                message: '回退成功!',
                duration: 1500
              });

              this.towListFn();
              this.itemValues = [];
              this.textarea = '';
              this.regvalue = '';
              /*
              * 功能: 在主页调用此模块时候,触发主页的搜索并且重新渲染
              * */
              if (this.myStyle) {
                this.$EventBus.$emit('Search_Again');
              }
            }
          }).catch(res => {
            this.$message({
              type: 'error',
              message: res.data.message,
              duration: 1500
            });
            this.textarea = '';
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
            duration: 1500
          });
          this.textarea = '';
        });
      },
      splicing() { // 批量下载报告  //批量上传报告  拼接字符串的公共方法
        let munarr = '';
        let _munarr = '';
        this.xqidBox = [];
        //this.itemValues = [];
        this.dialogTableVisible2 = false;
        this.inBox.forEach(copyitem => {
          this.xqidBox.push(copyitem.id);
        });
        _munarr = [...new Set(this.xqidBox)]

        return munarr = _munarr.join(","); //检验项目id,多个‘,’分割
      },
      bulkDownReport() { //批量下载报告
        if (this.inBox.length <= 0) {
          this.$alert('未选择任何报告', '信息提示', {
            dangerouslyUseHTMLString: true
          });
          return;
        }
        this.$api.lxtinitial.downReport(this.splicing()).then(res => {
          if (res.data.data == 0) {
            this.$alert('没有文件', '信息提示', {
              dangerouslyUseHTMLString: true
            });
          } else if (res.data.data == 2) {
            this.$alert('请稍后，服务器正在处理文件', '信息提示', {
              dangerouslyUseHTMLString: true
            });
          } else {

            this.downfile(res.data.data)
          }
        }).catch(res => {
          this.$alert("下载失败", '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      bulkuploadReport() {//批量上传报告
        if (this.inBox.length <= 0) {
          this.$alert('未选择任何报告', '信息提示', {
            dangerouslyUseHTMLString: true
          });
          return;
        }
        // console.log(this.splicing());
        this.$api.lxtinitial.uploadReport(this.splicing()).then(res => {
          if (res.data.data == 2 || res.data.data == 3) {
            this.$alert('系统错误', '信息提示', {
              dangerouslyUseHTMLString: true
            });
          } else {
            let data = res.data.data.substring(0, res.data.data.length - 1)
            this.uploadfile(data)
          }
        }).catch(res => {
          // console.log(res);
          this.$alert("上传失败", '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      // goUploadParam(item) { // 上传参数
      //   var date = new Date();
      //   var seperator1 = "-";
      //   var year = date.getFullYear();
      //   var month = date.getMonth() + 1;
      //   var strDate = date.getDate();
      //   if (month >= 1 && month <= 9) {
      //     month = "0" + month;
      //   }
      //   if (strDate >= 0 && strDate <= 9) {
      //     strDate = "0" + strDate;
      //   }
      //   var currentdate = year.toString() + month.toString();
      //   // console.log(currentdate);
      //   var taskid = item.mid;
      //   var uid = this.uidName;
      //   var deptid = this.deptid;
      //   var remoteip = base.baseImgTable;
      //   var floder = currentdate;
      //   var obj = document.getElementById("WO3Word2");
      //   obj.uploadParam(taskid, uid, deptid, remoteip, floder);
      // },
      //批量下载
      downfile(data) {
        // console.log(this.splicing());
        var obj = document.getElementById("WO3Word2");
        obj.setDownType("1");
        obj.setExecuteaction("0");
        obj.setServerIP(base.baseImgTable);
        obj.setIds(data);
        obj.downStart();
      },
      // 批量上传
      uploadfile(data) {
        var obj = document.getElementById("WO3Word2");
        obj.uploadLocal(data, base.baseImgTable, this.uidName);
      },
      getUid() { //获取登陆者id
        this.$api.lxtinitial.uid().then(res => {
          this.uidName = res.data.data.loginName
        }).catch(res => {
          this.$alert(res.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      getdeptid() { //获取科室id
        this.$api.lxtinitial.uid().then(res => {
          this.deptid = res.data.data.departmentid
        }).catch(res => {
          this.$alert(res.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      closedialog() { // 关闭清空留言信息
        this.textarea = '';
        this.dialogTableVisible = false
      },

      look(item) { // 查看报告
        const row = {
          id: item.id,
          process_instance_id: this.queryTypeChild.process_instance_id,
          taskid: item.sample
        };
        this.clickOpenReport(row);
      },

      clickOpenReport(row) { // 查看-打开报告
        let params = {
          instanceId: row.id,
          provessinstanceId: row.process_instance_id,
          taskId: row.taskid
        };
        if (row.process_instance_id == "5" || row.process_instance_id == "6") {
          this.$api.taskmanage.apiGoOpenWordForTask(params).then(res => {
            if (!res.data.data) {
              this.goOpenWord(row.id, row.taskid, row.process_instance_id);
            } else {
              this.$message.error(res.data.data);
            }
          })
        } else {
          this.goOpenWord(row.id, row.taskid, row.process_instance_id);
        }
      },
      goOpenWord(instanceID, report_no, process) {
        let loginName = this.uidName;
        let obj = document.getElementById("WO3Word2");
        if (loginName) {
          this.$api.surveyissue.apiSetSession(instanceID).then(res => {
            if (res.data.data == "1") {
              try {
                obj.setUid(loginName);
                obj.setFileId(instanceID);
                obj.setReportNo(report_no);
                obj.setProcess(process);
                obj.setRemoteIp(base.baseImgTable);
                obj.ActiveStart();
              } catch (error) {
                if (confirm("您确认没有安装Word控件吗? 点确定您将下载setup.zip 解压后运行setup.exe即可")) {
                  window.open(base.baseImgTable + "/api/file/resources/donet/setup.zip");
                }
              }
            } else if (res.data.data == "2") {
              this.$message.error('该小批量报告 已经被打开，或打开没有正常关闭');
            } else {
              this.$message.error('已经超时，请重新登录');
            }
          }).catch(error => {
            this.$message.error(error);
          });
        }
      },
      myWindow(parentSel, parentQuery) {
        let oHeaderHeight = 95;
        let oBody = document.documentElement.scrollHeight || document.body.scrollHeight
        let oDisLogBox = document.querySelector('.dislogBox');
        let oLxtBlock = document.querySelector('.lxt_block');
        oDisLogBox.style.height = oBody - oHeaderHeight - parentSel - parentQuery - oLxtBlock.offsetHeight + 'px';

        oLxtBlock.style.width = "98%";
        oLxtBlock.style.position = "fixed";
        oLxtBlock.style.left = '1%';
        oLxtBlock.style.bottom = .6 + 'vw'
      },
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////新增

      inspectlist(listval, selval) {  // 报告校核人的字段  如果当前的数据被选中了，更新数据中 value的值
       console.log(listval)
       console.log(selval)
       this.inBox.forEach(item => {
          if (item.id == listval) {
            console.log(item.id )
            item.value1 = selval;
          }
        });
      },
      slvuel(listval, selval) {  // 公章选中的字段  如果当前的数据被选中了，更新数据中 value的值
       console.log(listval)
       console.log(selval)
        this.inBox.forEach(item => {
          if (item.id == listval) {
            item.value = selval;
          }
        });
      },
      ///
       // 新增
      clicklook(row){
        this.rowdata  = row
        this.onetaskContentId = row.id
        let taskContentId = row.id;
        let type = 5;
        this.$api.lxtinitial.getTaskInfoById(this.onetaskContentId).then(res => {
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
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      // 原始记录查看
      onRecordSeeOpen(index,row) {
        let params = new FormData();
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
      // 关闭-原始记录查看-对话框
      onRecordSeeClose () {
          this.originalRecordForm = {},
          this.recordVisible = false;
          this.pictureNum = 0;
          this.imgListData = [];
      },
      //原始记录删除报告
      delitem(fileId){
        let data = {
            "fileId": fileId,
            "pathFolder": "",
            "taskContentId": this.onetaskContentId,
            "taskId": this.onetaskid,
            "type": 0
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.lxtinitial.originaldel(data).then(res => {
            console.log(res)
          if(res.data.ok == true){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.clicklook(this.rowdata)
          }
          }).catch(err => {
            this.$message.error({message: err.data.message, duration: 1500});
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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

          }).catch((err)=>{
            this.$message.error({message: err.data.message, duration: 1500});
          })
      },
      // getValue(data) { // 检验部科室
      //     console.log(data)
      // },
      getValue(data) {
        this.valueId = data.valueId;
        console.log(data)
        this.inBox.forEach(item => {
          if (item.id == data.itemId) {
            item.value1 = data.valueId;
          }
        });
        
        this.dataListTwo.forEach(item => {
          if (item.id == data.itemId) {
            item.valueId = data.valueId;
          }
        });
        console.log(this.dataListTwo)
        console.log(this.inBox)
      },
      getDeptUserList(){//获取树形人员数据
        // console.log(this.towCurItem)
        this.$api.lxtinitial.getDeptUserList(this.queryTypeChild.process_instance_id,this.towCurItem.examineName).then(res => {
          this.listTree = res.data.data
          console.log(this.listTree)
        })
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
    watch: {
      querydataChild(val) {
        this.dataListData();
        this.$nextTick(res => {
          this.translate();
        })
      },
      pageSize() {
        this.$nextTick(res => {
          this.translate();
        })
      },
      uidName(name) {
        this.uidName = name
      },
      myStyle(value) {
        this.myStyle = value;
      },
    },
    mounted() {

      this.getUid();
      this.threeListFn()
      /*
      * 首页调用此模块时,不触发这个方法
      * */
      if (!this.myStyle) {
        this.myWindow();
      }
    },
    props: [
      'querydataChild', 'queryTypeChild', 'mypagesize', 'myStyle'
    ],
    components: {
      taskDetail,
      recordsee,
      SelectTree
    }
  }
</script>
<style lang="scss" scoped>
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

  /* 自定义表格列with */

  /* 二级弹出表格样式 */
  .tasknumber2 {
    width: 4%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .inspected2 {
    width: 5%;
    padding-right: 1%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sample2 {
    width: 18%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .specification2 {
    width: 15%;
    padding-right: 1%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trademark2 {
    width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trademark2_1 {
    width: 12%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trademark2_4 {
    width: 16%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trademark2_2 {
    width: 10%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trademark2_3 {
    width: 16%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .operation2 {
    width: 30%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 二级弹出表格样式 */


  /* 按钮公共样式 */
  button {
    width: auto;
    padding: .6vw;
    margin: 0;
    font-size: 14px;
    display: inline-block;
  
    cursor: pointer;
    border-radius: 4px;
    border: none;
    -webkit-box-direction: normal;
  }

  button:hover {
    filter: alpha(opacity=90);
    opacity: 0.9;
  }

  /* 按钮公共样式 */

  /* 自定义按钮颜色 */
  .info {
    color: #FFF;
    background-color: #909399;
    border-color: #909399;
  }

  .success {
    color: #FFF;
    background-color: #67C23A;
    border-color: #67C23A;
  }

  .primary {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
  }

  .warning {
    color: #FFF;
    background-color: #E6A23C;
    border-color: #E6A23C;
  }

  .danger {
    color: #FFF;
    background-color: #F56C6C;
    border-color: #F56C6C;
  }

  /* 自定义按钮颜色 */

  .dislogBox {
    display: flex;

    .dislogBox_content {
      flex: 1;
      -webkit-box-flex: 1;
      overflow-y: auto;

      height: calc(100% - 50px);
    }
  }

  .componentBoxs {
    width: 100%;
  }

  .Interone {
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
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

  .cB_assembly {
    width: 100%;
    height: auto;
  }

  .cB_listcenter {
    width: 100%;
    height: auto;
    display: flex;
    border-bottom: 1px solid #EBEEF5;
    border-top: 1px solid #EBEEF5;
    margin-bottom: 0 !important;
  }

  .cB_listcenter li {
    line-height: 3vw;
    box-sizing: border-box;
    border-right: 1px solid #EBEEF5;
    list-style: none;
    text-align: center;
    color: #909399;
  }

  .cB_listcenter li:last-child {
    border-right: none
  }

  .cB_listcenter li button {
    text-indent: 0;
  }

  .buttons {
    text-align: left;
    padding-bottom: .8vw;
    padding-top: .8vw;
    padding-left: .5vw;
    border-top: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;

    .btnsPrimary {
      min-width: 68px;
    }
  }

  /* 第一次弹出 */
  .oneFirstFloor {
    width: 95%;
    clear: both;
    margin: 1vw auto;
  }

  .onecB_listcenter {
    width: 100%;
    height: auto;
    display: flex;
    border: 1px solid #EBEEF5;
    margin-bottom: 0 ;
  }

  .onecB_listcenter li {
    line-height: 3vw;
    box-sizing: border-box;
    border-right: 1px solid #EBEEF5;
    list-style: none;
    text-align: center;
    color: #909399;
  }

  .onecB_listcenter li:last-child {
    border-right: none
  }

  .onecB_listcenter li button {
    text-indent: 0;
  }

  /* 第二次弹出 */
  .twoFirstFloor {
    width: 90%;
    clear: both;
    margin: 1vw auto;
    position: relative;
  }

  /* 上传样式 */
  .uptest {
    width: 100%;
    height: auto;

    .uptest-item {
      text-align: left;

      .el-button--success {
        width: 15%;
        height: 33px;
        padding: 5px 20px;
      }

      .selteWidth {
        width: 75%;
      }

      .selteWidth2 {
        width: 60%;
        margin-top: 1.5vw;
      }
    }
  }

  .upData {
    width: 90%;
    margin: 0 auto;
  }

  .upsize {
    width: 100%;
    height: auto;
    margin: 1vw auto;
    text-align: left;

    .el-button--primary {
      height: 32px;
      padding: 0 10px;
    }

    .el-button--success {
      width: 15%;
      height: 32px;
      padding: 0 20px;
    }
  }

  .regseep {
    margin-bottom: 20px;
    display: flex;
  }

  .regseep b {
    margin-right: 5px;
    margin-top: 5px;
    font-weight: normal
  }

  .regseep b.on {
    margin-top: 10px;
  }

  .textareawidth {
    width: 90%;
  }

  .textareawidth2 {
    width: 70%;
  }

  .regBtn {
    text-align: right;
  }

  .regBtn2 {
    text-align: right;
    width: 90%;
  }


  /* 分页样式 */
  .lxt_block {
    height: 50px;
    width: 100%;
    background: #fff;
    display: flex;
  }

  .lxt_block .el-pagination {
    height: 50px;
    display: flex;
    align-items: center;
  }

  .lxt_block .el-pagination .el-pager {
    display: flex;
    align-items: center;
  }

  .incolde {
    width: 45%;
    text-indent: 0;
  }

  .spanclass {
    color: rgb(50, 175, 240);
    cursor: pointer
  }

  .operation i {
    font-style: normal;
    color: rgb(50, 175, 240);
  }

  .operation2 i {
    font-style: normal;
    color: rgb(50, 175, 240);
  }

  .selwidth {
    width: 10vw;
  }

  .checkboxleft {
    position: relative;
    left: 0;
  }

  .bordeLine {
    border: 1px solid #EBEEF5;
    border-top: none;
  }

  .pot {
    position: relative;
  }

  /deep/ .el-loading-spinner {
    width: 100%;
    margin-top: -21px;
    text-align: center;

  }


  // 新增
  .pszet{
    width: 100%;
    height: auto;
    line-height: 42px;
    overflow: hidden;
  }
  .prevtersize{
    width: auto;
    height: auto;
    float: left;
    }
  .prevter{
    width: 50%;
    height: auto;
    padding: 20px;
    border-bottom: 1px solid #ccc;

    float: left;
    margin-left: 10px;
  }
  /deep/.upload-demo .el-upload-list {
    position: absolute;
    left: -26vw;
    top: -4px;
  }

  /* 处理ie11下字号太小问题 */
  @media screen and (min-width: 0 \0
  ) {
    button {
      font-size: 14px;
    }
  }

  /deep/ #oneFirstFloor .el-checkbox-group .cB_theCirculation .onecB_listcenter .tasknumber2 .el-checkbox .el-checkbox__label {
    display: none
  }
  // 新增
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
  /deep/ .taskDetail_dialog1 {
    min-height: 100% !important;
    margin: 0 auto !important;
  }

  .zhanwei{width: 100%; height: 60px;}
  .selectTree{ width: 80%;}


</style>
