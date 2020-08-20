<template>
  <!-- 仪器设备查询 -->
  <div class="instrumentunit_box">
    <div class="warp">
      <!-- 查询 -->
      <div class="query">
        <div class="query_search">
          <el-form :inline="true" ref="formQuery" :model="formQuery" size="small" label-width="90px" style="flex:1;">
            <div class="query_search_formItem">
              <el-form-item label="设备编号：">
                <el-input v-model.trim="formQuery.code" @keyup.enter.native="enterQuery"
                          name="clearInputValue" clearable />
              </el-form-item>
              <el-form-item label="设备型号：">
                <el-input v-model.trim="formQuery.model" @keyup.enter.native="enterQuery"
                          name="clearInputValue" clearable />
              </el-form-item>
              <el-form-item label="设备名称：">
                <el-input v-model.trim="formQuery.name" @keyup.enter.native="enterQuery"
                          name="clearInputValue" clearable />
              </el-form-item>
              <el-form-item label="档案状态：">
                <el-select v-model="formQuery.fileStatus">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="(item,i) in queryList" :key="i" v-show="item.itype==0" 
                      :label="item.code+'_'+item.descript"
                      :value="item.descript">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-collapse-transition>
              <div v-show="show">
                <div class="query_search_formItem" style="margin: 20px 0;">
                  <el-form-item label="使用单位：">
                    <el-select v-model="formQuery.useCompany">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="(item,i) in queryList" :key="i" v-show="item.itype==1" 
                          :label="item.code+'_'+item.descript"
                          :value="item.descript">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="设备状态：">
                    <el-select v-model="formQuery.bz">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="(item,i) in queryList" :key="i" v-show="item.itype==8" 
                          :label="item.code+'_'+item.descript"
                          :value="item.descript">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="排序：">
                    <el-select v-model="formQuery.orderby">
                      <el-option label="设备编号" value="code"></el-option>
                      <el-option label="名称" value="name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="距过期：">
                    <el-select v-model="formQuery.limitTime">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="距过期20天" value="20"></el-option>
                      <el-option label="距过期30天" value="30"></el-option>
                      <el-option label="距过期45天" value="45"></el-option>
                      <el-option label="已经过期" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="query_search_formItem">
                  <el-form-item label="下次检定月">
                    <el-input v-model.trim="formQuery.checkdate3" placeholder="YYYY-MM" @keyup.enter.native="enterQuery"
                              name="clearInputValue" clearable />
                  </el-form-item>
                  <el-form-item label="检定方式：">
                    <el-select v-model="formQuery.checkModel">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="(item,i) in queryList" :key="i" v-show="item.itype==2" 
                          :label="item.code+'_'+item.descript"
                          :value="item.descript">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item></el-form-item>
                  <el-form-item></el-form-item>
                </div>
              </div>
            </el-collapse-transition>
          </el-form>
          <!-- 展开/收起 -->
          <div class="show_style">
            <el-button v-if="showbut==0" @click="clickshowbut(1)" type="text" style="color:#32AFF0;padding: 0;">
              收起 <i class="el-icon-arrow-up"></i>
            </el-button>
            <el-button v-if="showbut!=0" @click="clickshowbut(0)" type="text" style="color:#32AFF0;padding: 0;">
              展开 <i class="el-icon-arrow-down"></i>
            </el-button>
          </div>
        </div>

        <!-- 查询按钮 -->
        <div class="query_btn">
          <div>
            <el-button type="primary" style="marginRight:5px;" @click="onClickNewlyBuild">新建</el-button>
            <el-button type="primary" style="marginRight:5px;" @click="onClickTestPlan">检定计划</el-button>
            <el-button type="primary" style="marginRight:5px;" @click="onClickExcel">EXCEL</el-button>
            <el-button type="primary" style="marginRight:5px;" @click="onClickGocheck">待检</el-button>
            <el-button type="primary" style="marginRight:5px;" @click="onClickBarCode">批量打印条形码</el-button>
            <el-button type="primary" style="marginRight:5px;" v-if="canDelete == 1" @click="onClickAllDelete">删除全部</el-button>
            <el-button type="primary" v-if="canDelete == 1" @click="onClickExport">模板导出</el-button>
          </div>
          <el-button type="primary" @click="onClickQuery(1,10)">查询</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table_box">
        <div class="table_content">
          <el-table
            border
            stripe
            ref="table"
            v-loading="loading"
            :data="tablelist"
            :header-cell-style="{
                'background-color': 'rgba(243,246,253,1)',
                'color': '#606266',
                'padding': '10px 0'
            }"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" :resizable="false"></el-table-column>
            <el-table-column prop="code" label="编号" align="center" :resizable="false"></el-table-column>
            <el-table-column prop="model" label="型号" align="center" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="name" label="名称" align="center" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="检定项目" align="center" :resizable="false">
              <template slot-scope="scope">
                <span v-if="scope.row.list && scope.row.list.length > 0">{{scope.row.list[0].checkItem}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="checkdate3" label="有效期" align="center" :resizable="false">
              <template slot-scope="scope">
                <el-button v-if="scope.row.list && scope.row.list.length > 0" 
                    type="text" 
                    class="operation_btn" 
                    @click="onClickCheckDate(scope.row.list[0])">
                  {{scope.row.list[0].checkdate3}}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="bz" label="状态" align="center" :resizable="false"></el-table-column>
            <el-table-column prop="useCompany" label="使用单位" align="center" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" align="center" :resizable="false" width="240">
              <template slot-scope="scope">
                <el-button type="text" class="operation_btn" @click="onClickSee(scope.row)">查看</el-button>
                <el-button type="text" class="operation_btn" v-if="canDelete == 1" style="color:red;" @click="onClickDelete(scope.row)">删除</el-button>
                <el-button type="text" class="operation_btn" @click="onClickFindLend(scope.row)">档案借阅</el-button>
                <el-button type="text" class="operation_lastbtn" @click="onClickFindcheckdate(scope.row)">检定日期</el-button>
              </template>
            </el-table-column>
            <!-- 二级弹出 -->
            <el-table-column type="expand" width="1" :resizable="false">
              <template>
                <div v-if="towTableList.length<=0">
                  <span v-if="borrowFlag == 'borrowFlag'">没有借出历史</span>
                  <span v-if="dateFlag == 'dateFlag'">没有数据</span>
                </div>
                <el-table
                  v-else
                  ref="towTableList"
                  border
                  stripe
                  :data="towTableList"
                  :header-cell-style="{
                      'background-color': 'rgba(243,246,253,1)',
                      'color': '#606266',
                      'padding': '10px 0'
                  }">
                    <el-table-column prop="borrow" label="借出人" align="center" :resizable="false" v-if="borrowFlag == 'borrowFlag'"></el-table-column>
                    <el-table-column prop="borrowdate" label="借出日期" align="center" :resizable="false" v-if="borrowFlag == 'borrowFlag'"></el-table-column>
                    <el-table-column prop="returndate" label="归还日期" align="center" :resizable="false" v-if="borrowFlag == 'borrowFlag'"></el-table-column>
                    <el-table-column prop="checkItem" label="检定项目" align="center" :resizable="false" v-if="dateFlag == 'dateFlag'"></el-table-column>
                    <el-table-column prop="checkdate1" label="上一次检定日期" align="center" :resizable="false" v-if="dateFlag == 'dateFlag'"></el-table-column>
                    <el-table-column prop="okdate" label="检定周期" align="center" :resizable="false" v-if="dateFlag == 'dateFlag'"></el-table-column>
                    <el-table-column prop="checkdate2" label="检定有效期" align="center" :resizable="false" v-if="dateFlag == 'dateFlag'"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 分页器 -->
      <div class="pagingdevice">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10,20,30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 新建/查看--仪器设备档案 -->
    <el-dialog
      :title="archivesTitle"
      :visible.sync="archivesVisible"
      :before-close="archivesDialogClose"
      class="archives_dialog" width="90%">
      <Archives 
        :pagetype="0"
        :tbaseData="tbase"
        :terminalData="terminal"
        :terminalFileData="terminalFile"
        :terminalFileMapData="terminalFileMap"
        :archivesVisible="archivesVisible"
        @closeDialog="archivesDialogClose"
      />
    </el-dialog>

    <!-- 证书录入 -->
    <el-dialog
      title="证书录入"
      :visible.sync="checkDateVisible"
      :before-close="checkDateDialogClose"
      class="checkDate_dialog" width="70%">
      <Termofvalidity 
        :checkDateList="checkDateList" 
        :flag="checkDateVisible" 
        :checkid="checkid"
      />
    </el-dialog>

    <!-- 批量打印条形码 -->
    <el-dialog
      title="条形码"
      :visible.sync="barCodeVisible"
      class="barCode_dialog">
      <div v-if="multipleSelection.length>0" class="barCode_content">
        <p class="printOrder" v-for="(item,i) in multipleSelection" :key="i">
          <barcode :value="item.code" :options="barcode_option" tag="svg" ></barcode>
        </p>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import base from '@/api/base.js';
import Archives from '../component/archives.vue'; // 仪器设备档案
import Termofvalidity from '../component/termOfValidity.vue'; // 证书录入
import Flowchart from '../component/flowChart.vue'
export default {
  name: 'instrumentunit',
  components: {Archives,Termofvalidity,Flowchart},
  props: [],
  watch: {},
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      total: 0,
      show: false, // 收起/展开--状态
      showbut: 1, // 收起/展开--内容
      loading: false, // 加载状态
      canDelete: 0, // // 操作按钮-删除/导出-展示状态
      tablelist: [], // table数据
      queryList: [], // 查询-下拉数据
      formQuery: { // 查询表单数据
        code: '',
        model: '',
        name: '',
        fileStatus: '',
        useCompany: '',
        bz: '',
        orderby: 'code',
        limitTime: '',
        checkdate3: '',
        checkModel: ''
      },
      multipleSelection: [], // 列表选择数据
      archivesTitle: '', // 新建/查看--仪器设备档案-对话框标题
      archivesVisible: false, // 新建/查看--仪器设备档案-对话框状态
      tbase: {}, // 新建/查看--仪器设备档案-下拉框数据
      terminal: {}, // 新建/查看--仪器设备档案-基本数据
      terminalFile: {}, // 新建/查看--仪器设备档案-证书数据
      terminalFileMap: {}, // 新建/查看--仪器设备档案-按钮数据
      checkDateVisible: false, // 有效期-证书录入-对话框状态
      checkDateList: [], // 有效期-证书录入-列表数据
      checkid: '', // 有效期-id
      towTableList: [], // 二级表格-数据
      borrowFlag: null, // 档案借阅-二级表格显示状态 
      dateFlag: null, // 检定日期--二级表格-显示状态 
      barCodeVisible: false,
      barCodeList: [],
      barcode_option:{
        displayValue: true, //是否默认显示条形码数据
        background: '#fff', //条形码背景颜色
        width:'2px',//单个条形码的宽度
        height: '55px',
        fontSize: '18px' //字体大小
      },
    }
  },
  mounted() {
    this.getApiGetTbase();
    this.onClickQuery(1, 10);
  },
  methods: {
    // 获取查询-下拉数据
    getApiGetTbase() {
      this.$api.instrumentunit.apiGetTbase().then(res => {
        this.queryList = res.data.data.list;
      }).catch(error => {
        this.$message({type: 'error', message: error.data.message, duration: 1500});
      })
    },
    // 分页器-设置每条的页数
    handleSizeChange(val) {
      this.pageSize = val;
      this.onClickQuery(this.currentPage, this.pageSize);
    },
    // 分页器-当前页发生改变时
    handleCurrentChange(val) {
      this.currentPage = val;
      this.onClickQuery(this.currentPage, this.pageSize);
    },
    // 点击查询
    onClickQuery(currentPage, pageSize) {
      let flag = true;
      this.loading = true;
      this.formQuery.currentPage = currentPage;
      this.formQuery.pageSize = pageSize;
      // 对输入的日期进行判断
      if(this.formQuery.checkdate3){
        flag = false;
        let dateArray = this.formQuery.checkdate3.match(/^(\d{4})-(\d{2})$/); 
        if(dateArray == null){
          this.$message({type: 'warning', message: '日期格式不正确，请修改！', duration: 1500});
        }else{
          let year = dateArray[1],
          month = dateArray[2],  
          day = dateArray[3]; 
          if (1900 > year) {  
            this.$message({type: 'warning', message: '年值不能小于1900年，请修改！', duration: 1500});
          }else if (month < 1 || month > 12) {
            this.$message({type: 'warning', message: '月份应为1到12的整数，请修改！', duration: 1500});
          }else if ((month==4 || month==6 || month==9 || month==11) && day==31) {
            this.$message({type: 'warning', message: month+'月不存在31号，请修改！', duration: 1500});
          }else if (month==2) {
            var isleap=(year % 4==0 && (year % 100 !=0 || year % 400==0));  
            if (day > 29) {
              this.$message({type: 'warning', message: '2月最多有29天，请修改！', duration: 1500});
            }else if ((day==29) && (!isleap)){
              this.$message({type: 'warning', message: '闰年2月才有29天，请修改！', duration: 1500});
            }
          }else if (day < 1 || day > 31) {
            this.$message({type: 'warning', message: '每个月的天数应该为1到31的整数，请修改！', duration: 1500});
          }else{
            flag = true;
          }
        }
      }
      if(flag){
        this.$api.instrumentunit.apiSearchTerminal(this.formQuery).then(res => {
          // console.log(res.data.data,'查询数据');
          this.canDelete = res.data.data.canDelete;
          this.tablelist = res.data.data.terminal.list;
          this.loading = false;
          if(res.data.data.terminal.total > 0){
            this.total = res.data.data.terminal.total;
            this.currentPage = currentPage;
            this.pageSize = pageSize;
          }else{
            this.total = 0;
            this.currentPage = 1;
            this.pageSize = 10;
          }
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500});
          this.loading = false;
          this.total = 0;
          this.currentPage = 1;
          this.pageSize = 10;
        })
      }
    },
    // 回车查询
    enterQuery(e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        this.onClickQuery(1, 10);
      }
    },
    // 点击收起/展开
    clickshowbut(num) {
      this.show = !this.show;
      this.showbut = num;
    },
    // 列表选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击查看
    onClickSee(row) {
      this.archivesTitle = '查看';
      let params = {
        id: row.id
      }
      this.$api.instrumentunit.apiDetail(params).then(res => {
        let archivesData = res.data.data;
        this.tbase = archivesData ? archivesData.tbase : {};
        this.terminal = archivesData ? archivesData.terminal : {};
        this.terminalFile = archivesData ? archivesData.terminalFile : {};
        this.terminalFileMap = archivesData ? archivesData.terminalFileMap : {};
        this.archivesVisible = true;
      }).catch(error => {
        this.$message({type: 'error', message: error.data.message, duration: 1500});
      })
    },
    // 关闭档案对话框
    archivesDialogClose() {
      this.tbase = {};
      this.terminal = {};
      this.terminalFile = {};
      this.terminalFileMap = {};
      this.archivesVisible = false;
      this.onClickQuery(this.currentPage, this.pageSize);
    },
    // 点击列表删除
    onClickDelete(row) {
      let params = {
        id: row.id
      };
      this.$api.instrumentunit.apiDelete(params).then(res => {
        this.$message({type: 'success', message: res.data.data, duration: 1500});
        this.onClickQuery(this.currentPage, this.pageSize);
      }).catch(error => {
        this.$message({type: 'error', message: error.data.message, duration: 1500});
      })
    },
    // 点击-档案借阅
    onClickFindLend(row) {
      this.dateFlag = null; // 检定日期--二级表格-显示状态 
      let $table = this.$refs.table;
      let params = {
        id: row.id
      };
      this.$api.instrumentunit.apiFindLend(params).then(res => {
        let data = res.data.data.list;
        if(data.length > 0) {
          this.borrowFlag = 'borrowFlag'; // 档案借阅-二级表格显示状态 
          this.towTableList = data; // 档案借阅--二级表格-数据
          $table.toggleRowExpansion(row)
        }else{
          this.borrowFlag = 'borrowFlag'; // 档案借阅-二级表格显示状态 
          this.towTableList = []; // 档案借阅--二级表格-数据
          $table.toggleRowExpansion(row)
        }
      }).catch(error => {
        this.$message({type: 'error', message: error.data.message, duration: 1500});
      })
      this.tablelist.map(item => {
        if (row.id != item.id) {
          $table.toggleRowExpansion(item, false)
        }
      })
    },
    // 点击-检定日期
    onClickFindcheckdate(row) {
      this.borrowFlag = null; // 档案借阅-二级表格显示状态 
      let $table = this.$refs.table;
      let params = {
        id: row.id
      };
      this.$api.instrumentunit.apiFindcheckdate(params).then(res => {
        let data = res.data.data.list;
        if(data.length > 0) {
          this.dateFlag = 'dateFlag'; // 检定日期-二级表格显示状态 
          this.towTableList = data; // 检定日期--二级表格-数据
          $table.toggleRowExpansion(row)
        }else{
          this.dateFlag = 'dateFlag'; // 检定日期-二级表格显示状态 
          this.towTableList = []; // 检定日期--二级表格-数据
          $table.toggleRowExpansion(row)
        }
      }).catch(error => {
        this.$message({type: 'error', message: error.data.message, duration: 1500});
      })
      this.tablelist.map(item => {
        if (row.id != item.id) {
          $table.toggleRowExpansion(item, false)
        }
      })
    },
    // 点击-有效期-证书录入
    onClickCheckDate(row) {
      this.checkid = row.id;
      let params = {
        checkid: row.id
      }
      this.$api.instrumentunit.apiView2(params).then(res => {
        this.checkDateList = res.data.data.list;
        if(this.checkDateList) {
          this.checkDateVisible = true;
        }
      }).catch(error => {
        this.$message({type: 'error', message: error.data.message, duration: 1500});
      })
    },
    // 关闭-证书录入
    checkDateDialogClose() {
      this.checkDateVisible = false;
    },
    // 点击新建
    onClickNewlyBuild() {
      this.archivesTitle = '新建';
      this.tbase = {list: this.queryList};
      this.terminal = {};
      this.terminalFile = {};
      this.terminalFileMap = {};
      this.archivesVisible = true;
    },
    // 点击-检定计划
    onClickTestPlan() {
      let flag = true;
      // 对输入的日期进行判断
      if(this.formQuery.checkdate3){
        flag = false;
        let dateArray = this.formQuery.checkdate3.match(/^(\d{4})-(\d{2})$/); 
        if(dateArray == null){
          this.$message({type: 'warning', message: '日期格式不正确，请修改！', duration: 1500});
        }else{
          let year = dateArray[1],
          month = dateArray[2],  
          day = dateArray[3]; 
          if (1900 > year) {  
            this.$message({type: 'warning', message: '年值不能小于1900年，请修改！', duration: 1500});
          }else if (month < 1 || month > 12) {
            this.$message({type: 'warning', message: '月份应为1到12的整数，请修改！', duration: 1500});
          }else if ((month==4 || month==6 || month==9 || month==11) && day==31) {
            this.$message({type: 'warning', message: month+'月不存在31号，请修改！', duration: 1500});
          }else if (month==2) {
            var isleap=(year % 4==0 && (year % 100 !=0 || year % 400==0));  
            if (day > 29) {
              this.$message({type: 'warning', message: '2月最多有29天，请修改！', duration: 1500});
            }else if ((day==29) && (!isleap)){
              this.$message({type: 'warning', message: '闰年2月才有29天，请修改！', duration: 1500});
            }
          }else if (day < 1 || day > 31) {
            this.$message({type: 'warning', message: '每个月的天数应该为1到31的整数，请修改！', duration: 1500});
          }else{
            flag = true;
          }
        }
      }
      if(flag){
        let formEle = document.createElement('form');
            formEle.setAttribute('id', 'formId')
            formEle.setAttribute('method', 'POST');
            formEle.setAttribute('action', base.entrustamend+'/Termianl/xlsy');
            document.body ? document.body.appendChild(formEle) : '';
            
        let input = document.createElement('input');
          input.setAttribute('type', 'hidden');
          input.setAttribute('name', 'terminal');
          input.setAttribute('value', JSON.stringify(this.formQuery));
          formEle ? formEle.appendChild(input) : '';

        let formId = document.getElementById('formId');
        formId.submit();
        document.body.removeChild(formEle);
      }
    },
    // 点击-EXCEL
    onClickExcel() {
      let flag = true;
      // 对输入的日期进行判断
      if(this.formQuery.checkdate3){
        flag = false;
        let dateArray = this.formQuery.checkdate3.match(/^(\d{4})-(\d{2})$/); 
        if(dateArray == null){
          this.$message({type: 'warning', message: '日期格式不正确，请修改！', duration: 1500});
        }else{
          let year = dateArray[1],
          month = dateArray[2],  
          day = dateArray[3]; 
          if (1900 > year) {  
            this.$message({type: 'warning', message: '年值不能小于1900年，请修改！', duration: 1500});
          }else if (month < 1 || month > 12) {
            this.$message({type: 'warning', message: '月份应为1到12的整数，请修改！', duration: 1500});
          }else if ((month==4 || month==6 || month==9 || month==11) && day==31) {
            this.$message({type: 'warning', message: month+'月不存在31号，请修改！', duration: 1500});
          }else if (month==2) {
            var isleap=(year % 4==0 && (year % 100 !=0 || year % 400==0));  
            if (day > 29) {
              this.$message({type: 'warning', message: '2月最多有29天，请修改！', duration: 1500});
            }else if ((day==29) && (!isleap)){
              this.$message({type: 'warning', message: '闰年2月才有29天，请修改！', duration: 1500});
            }
          }else if (day < 1 || day > 31) {
            this.$message({type: 'warning', message: '每个月的天数应该为1到31的整数，请修改！', duration: 1500});
          }else{
            flag = true;
          }
        }
      }
      if(flag){
        let formEle = document.createElement('form');
            formEle.setAttribute('id', 'formId')
            formEle.setAttribute('method', 'POST');
            formEle.setAttribute('action', base.entrustamend+'/Termianl/xls');
            document.body ? document.body.appendChild(formEle) : '';
            
        let input = document.createElement('input');
          input.setAttribute('type', 'hidden');
          input.setAttribute('name', 'terminal');
          input.setAttribute('value', JSON.stringify(this.formQuery));
          formEle ? formEle.appendChild(input) : '';

        let formId = document.getElementById('formId');
        formId.submit();
        document.body.removeChild(formEle);
      }
    },
    // 待检
    onClickGocheck() {
      if(this.multipleSelection.length <= 0){
        this.$message({ type: 'warning', message: '请先选择设备，再进行该操作！', duration: 1500 });
      } else { 
        let codes = '';
        this.multipleSelection.forEach(item => codes = codes + (item.list.length > 0 ? item.list[0].id : null) +',');
        codes = codes.slice(0,codes.length-1);
        let params = {
          codes
        };
        this.$api.instrumentunit.apiGocheck(params).then(res => {
          this.$message({type: 'success', message: res.data.data, duration: 1500});
          this.onClickQuery(this.currentPage, this.pageSize);
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500});
        })
      }
    },
    // 批量打印条形码
    onClickBarCode() {
      if(this.multipleSelection.length <= 0){
        this.$message({ type: 'warning', message: '请先选择设备，再进行该操作！', duration: 1500 });
      } else {
        this.barCodeVisible = true;
      }
    },
    // 删除全部
    onClickAllDelete() {
      if(this.multipleSelection.length <= 0){
        this.$message({ type: 'warning', message: '请先选择设备，再进行该操作！', duration: 1500 });
      } else {
        let id = '';
        this.multipleSelection.forEach(item => id = id+item.id+';');
        id = id.slice(0,id.length-1);
        let params = {
          id
        };
        this.$api.instrumentunit.apiDeleteAll(params).then(res => {
          this.$message({type: 'success', message: res.data.data, duration: 1500});
          this.onClickQuery(this.currentPage, this.pageSize);
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500});
        })
      }
      
    },
    // 模板导出
    onClickExport() {
      if(this.multipleSelection.length <= 0){
        this.$message({ type: 'warning', message: '请先选择设备，再进行该操作！', duration: 1500 });
      } else { 
        let code = '';
        this.multipleSelection.forEach(item => code = code+item.code+','+item.barcode+','+item.name+','+item.model+','+item.productCompany+','+item.useCompany+';');
        code = code.slice(0,code.length-1);
        console.log(code, 'code')
        let params = {
          code
        };
        this.$api.instrumentunit.apiExport(params).then(res => {
          console.log(res, 'res')
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500});
        })
      }
    },
  }
}
</script>
<style scoped lang="less">
.instrumentunit_box {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #eee;
  padding: 10px;
  overflow: hidden;
}
.warp {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.query {
  width: 100%;
  margin-bottom: 20px;
  overflow: hidden;
}
.table_box {
  flex: 1;
  overflow: hidden;
}
.table_content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.pagingdevice {
  margin-top: 20px;
}

.el-button--default {
  height: 30px;
  background: #fff;
  padding: 0 20px;
  margin: 0;
}

.el-button--primary {
  height: 30px;
  background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
  padding: 0 20px;
  margin: 0;
}

.query_search {
  width: 100%;
  display: flex;
}

.query_search_formItem {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.query_search_formItem .el-form-item {
  flex: 1;
  margin: 0;
}
/deep/ .query_search .el-form-item__content {
  width: 60% !important;
}

/deep/ .query_search .el-select, .query_search .el-input {
  width: 100% !important;
}
.show_style {
  width: 55px;
  text-align: right;
  display: flex;
  align-items: center;
}
.query_btn {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.operation_btn {
  color: #32AFF0;
  margin: 0;
  padding: 0;
  margin-right: 10px;
}
.operation_lastbtn {
  color: #32AFF0;
  margin: 0;
  padding: 0;
}

// 仪器设备档案
.archives_dialog {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 5% 0;
}
// 仪器设备档案
/deep/ .archives_dialog .el-dialog {
  height: 100% !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  backface-visibility:hidden;
}
// 仪器设备档案
/deep/ .archives_dialog .el-dialog .el-dialog__body {
  flex: 1 !important;
  overflow: hidden !important;
  padding: 20px;
}

// 证书录入
.checkDate_dialog {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 10% 0;
}
// 证书录入
/deep/ .checkDate_dialog .el-dialog {
  height: 100% !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  backface-visibility:hidden;
}
// 证书录入
/deep/ .checkDate_dialog .el-dialog .el-dialog__body {
  flex: 1 !important;
  overflow: hidden !important;
  padding: 20px;
}

// 条形码
.barCode_dialog {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 10% 0;
}
// 条形码
/deep/ .barCode_dialog .el-dialog {
  height: 100% !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  backface-visibility:hidden;
}
// 条形码
/deep/ .barCode_dialog .el-dialog .el-dialog__body {
  flex: 1 !important;
  overflow: hidden !important;
  padding: 20px;
}
// 条形码
.barCode_content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  p {
    padding-left: 10%;
  }
}

// 流程图
.flowchart_dialog {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
// 流程图
/deep/ .flowchart_dialog .el-dialog {
  height: 100% !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  backface-visibility:hidden;
}
// 流程图
/deep/ .flowchart_dialog .el-dialog .el-dialog__body {
  flex: 1 !important;
  overflow: hidden !important;
  padding: 20px;
}
</style>