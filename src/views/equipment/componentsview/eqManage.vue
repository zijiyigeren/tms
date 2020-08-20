<template>
  <!-- 设备管理 -->
  <div class="eqmanage">
    <div class="eqmanage_con">
      <!-- 查询 -->
      <div class="query_modular">
        <div class="query_complex">
          <el-form
            class="query_form"
            :model="queryForm"
            :inline="true"
            label-width="80px"
            v-bind="{
                size:'mini',
            }"
          >
            <el-form-item label="设备编号：">
              <el-input clearable name="clearInputValue" @keyup.enter.native="enterQuery"
                        placeholder="请输入设备编号" v-model.trim="queryForm.code"/>
            </el-form-item>
            <el-form-item label="设备型号：">
              <el-input clearable name="clearInputValue" @keyup.enter.native="enterQuery"
                        placeholder="请输入设备型号" v-model.trim="queryForm.model"/>
            </el-form-item>
            <el-form-item label="设备名称：">
              <el-input clearable name="clearInputValue" @keyup.enter.native="enterQuery"
                        placeholder="请输入设备名称" v-model.trim="queryForm.name"/>
            </el-form-item>
            <el-form-item label="档案状态：">
              <templateMethod
                v-model="queryForm.fileStatus"
                v-bind="{
                  type: 'select',
                  dicCode: 'fileStatus',
                  clearable: true
                }"
                @GET_originData="GET_originData2"
              />
            </el-form-item>
            <el-form-item label="使用部门：" v-show="showState">
              <el-select clearable v-model="queryForm.useDepartment" style="width:100%;">
                <el-option
                  v-for="(item,index) in $store.state.officeList"
                  :key="index"
                  :label="item.org_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设备状态：" v-show="showState">
              <templateMethod
                v-model="queryForm.terminalStatus"
                v-bind="{
                  type: 'select',
                  dicCode: 'terminalStatus',
                  clearable: true
                }"
                @GET_originData="GET_originData1"
              />
            </el-form-item>
            <el-form-item label="排序：" v-show="showState">
              <el-select v-model="queryForm.orderby">
                <el-option label="设备编号" value="code"/>
                <el-option label="设备名称" value="name"/>
              </el-select>
            </el-form-item>
            <el-form-item label="距过期：" v-show="showState">
              <el-input v-model="queryForm.limitTime" style="width: 88% !important;"/>
              <span style="display: inline-block;width: 10%;text-align: center;">天</span>
            </el-form-item>
            <el-form-item label="下达日期：" v-show="showState">
              <el-date-picker
                v-model="queryForm.checkdate3"
                type="month"
                placeholder="下次检定月"
                value-format="yyyy-MM"
              />
            </el-form-item>
            <el-form-item label="检定方式：" v-show="showState">
              <templateMethod
                v-model="queryForm.checkModel"
                v-bind="{
                  type: 'select',
                  dicCode: 'checkModel',
                  clearable: true
                }"
                @GET_originData="GET_originData3"
              />
            </el-form-item>
          </el-form>
          <!-- 展开/收起 -->
          <div class="query_show">
            <el-button v-if="showbut!=0" @click="onClickShow(0)" type="text" class="query_showBtn">
              收起 <i class="el-icon-arrow-up"></i>
            </el-button>
            <el-button v-else-if="showbut==0" @click="onClickShow(1)" type="text" class="query_showBtn">
              展开 <i class="el-icon-arrow-down"></i>
            </el-button>
          </div>
        </div>
        <!-- 查询按钮 -->
        <div class="query_btn">
          <p>
            <el-button type="primary" @click="onNewBuilt">新建设备</el-button>
            <el-button @click="batchImport = true">批量导入</el-button>
            <el-button @click="onStayCheck">待检</el-button>
          </p>
          <p class="query_rightbtn">
            <el-button type="primary" @click="onQuery(1,10)">查询</el-button>
            <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button>
          </p>
        </div>
      </div>
      <!-- 表格与分页 -->
      <div class="tablePagination_modular" v-loading="loading">
        <!-- 表格 -->
        <div class="table_modular">
          <table class="t-table" cellpadding="0" border="0" cellspacing="0">
            <tr>
              <th style="width: 65px;">
                <input type="checkbox" @change="handleSelectAll" name="SelectAll">
              </th>
              <th style="width: 150px">编号</th>
              <th style="width: 150px">型号</th>
              <th style="width: 150px">设备名称</th>
              <th style="width: 450px;">
                <div class="t-table--th--div">
                  <div class="jdxm--class">
                    <i>检定项目</i>
                  </div>
                  <div class="zt--class">
                    <i>状态</i>
                  </div>
                </div>
              </th>
              <th>使用部门</th>
              <th style="width: 250px;">操作</th>
            </tr>
            <tr v-if="tableData.length==0">
              <td colspan="8" style="height: 45px;">暂无数据</td>
            </tr>
            <template v-for="(item,index) in tableData">
              <tr
                @click="handleClick"
                :key="'tr'+ index"
                class="trClass"
              >
                <td>
                  <input type="checkbox" @change="chBoxChangeFn1(item)" name="aaaChkox"/>
                </td>
                <td :title="item.code">
                  <p
                    class="text-ellipsis"
                    style="margin: 0 auto;width: 140px;"
                  >{{item.code}}
                  </p>
                </td>
                <td :title="item.model">
                  <p
                    class="text-ellipsis"
                    style="margin: 0 auto;width: 140px;"
                  >{{item.model}}
                  </p>
                </td>
                <td :title="item.name">
                  <p
                    class="text-ellipsis"
                    style="margin: 0 auto;width: 140px;"
                  >
                    {{item.name}}
                  </p>
                </td>
                <td class="tdClass"
                    :style="{
                              height: item.list.length == 0 ? '45px': 'auto'
                            }"
                >
                  <template v-for="item2 in item.list">
                    <div class="t-table--td--div">
                      <div class="jdxm--class"
                           style="padding: 10px 0;display: flex;align-items: center;justify-content:center;">
                        <input
                          type="checkbox"
                          class="childCheckbox"
                          :data-rowData="item2.id"
                          @change="chBoxChildChangeFn1"
                        >
                        <span style="margin-left: 5px;max-width: 80%;text-overflow: ellipsis;overflow: hidden;">{{item2.checkItem}}</span>
                      </div>
                      <div class="zt--class">
                        <i>{{change_filter1(item2.terminalStatus)}}</i>
                      </div>
                    </div>
                  </template>
                </td>
                <td :title="item.useDepartment">
                  <p
                    class="text-ellipsis"
                    style="margin: 0 auto;max-width: 250px;"
                  ><!--{{item.useDepartment}}-->{{filter_officeList(item.useDepartment)}}
                  </p>
                </td>
                <td>
                  <el-button type="text" @click="onDetail(item)">查看</el-button>
                  <el-button type="text" @click="onEdit(item)">编辑</el-button>
                  <el-button type="text" @click="onTestDate(item)">校准日期</el-button>
                  <!--<el-button type="text" @click="openFn1(item,index)">档案借阅</el-button>-->
                </td>
              </tr>
              <tr v-show="item.tiggle">
                <td colspan="7">
                  <div style="height: 500px;overflow: auto;background-color: grey">内容</div>
                </td>
              </tr>
            </template>
          </table>
        </div>
        <!-- 分页 -->
        <el-pagination
          class="pagination_modular"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page="current"
          :page-size="pageSize"
          :page-sizes="[10,20,30]"
          @current-change="currentChange"
          @size-change="sizeChange"
        />
      </div>
    </div>

    <!-- 新增/编辑 -->
    <Device
      ref="Device"
      v-bind="{
          'deviceTitle': deviceTitle,
          'deviceVisible': deviceVisible,
          'deviceRow': deviceRow
      }"
      @deviceClose="onDeviceClose"
    />

    <!-- 查看校准日期 -->
    <a-drawer
      title="查看校准日期"
      width="50%" placement="right"
      :visible.sync="visibleConfig"
      v-bind="{
                maskClosable: false,
              }"
      :drawerStyle="{
              display: 'flex',
              flexDirection:'column'
            }"
      :bodyStyle="{
              flex: 1,
              overflow: 'hidden'
            }"
      @close="closeFn_visibleConfig"
    >
      <div style="height: 100%;overflow: auto">
        <table class="t-table" style="word-break:break-all;table-layout: fixed;">
          <tr>
            <th>检定项目</th>
            <th>上一次检定日期</th>
            <th>检定周期</th>
            <th>检定有效期</th>
          </tr>
          <tr
            v-for="item in testDateTable"
            :key="'tr'+item.id"
          >
            <td style="height: 45px;">{{item.checkItem}}</td>
            <td>{{item.checkdate2}}</td>
            <td>{{item.checkdate1}}</td>
            <td>{{item.checkdate3}}</td>
          </tr>
          <tr v-if="testDateTable.length ===0">
            <td colspan="4" style="height: 45px;">暂无数据</td>
          </tr>
        </table>
      </div>
    </a-drawer>

    <!-- 批量导入 -->
    <el-dialog
      :visible.sync="batchImport"
      v-bind="{
        title:'导入文件',
        customClass:'m-dialog',
        // top:'5vh',
        // closeOnClickModal:false,
        closeOnPressEscape:false,
      }"
      @close="close_batchImport"
    >
      <div style="text-align: center;">
        <div style="width: 50%;display: flex;height: 30px;margin: 0 auto;">
          <input type="text" readonly="true" class="m-input" v-model="fileName">
          <el-button @click="selectFile_handle">选择文件</el-button>
        </div>
        <input type="file" id="eqSelectFile" style="display: none;"
               @change="fileChange"
        >
      </div>
      <!--<h1>导入结果</h1>
      <div style="min-height: 150px;max-height: 470px;background-color: orange;"></div>-->
      <div slot="footer">
        <el-button type="primary" @click="excelUpload">确定</el-button>
        <el-button @click="batchImport = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import base from '@/api/base.js'
  /* 组件: 数据字典 */
  import templateMethod from '@/components/TemplateMethod.vue'
  import Device from '../component/device' // 设备管理-新增/编辑

  let _queryForm = {
    code: '',// 设备编号
    model: '',// 设备型号
    name: '',// 设备名称
    fileStatus: '',// 档案状态
    useDepartment: '',// 使用部门
    terminalStatus: '',// 设备状态
    orderby: 'code',// 排序
    limitTime: '',// 距过期(还有多少天)
    checkdate3: '',// 下达日期
    checkModel: '',// 检定方式
  }
  export default {
    name: 'eqmanage',
    components: {
      templateMethod,// 数据字典
      Device,
    },
    props: [],
    data () {
      return {
        orgs: [],
        // 数据字典: 检定项目状态
        terminalStatusList: null,
        // 查询数据
        queryForm: JSON.parse(JSON.stringify(_queryForm)),
        // 展开/收起-状态
        showbut: 0,
        showState: false, // 查询框显示状态
        loading: false, // 加载状态
        total: 0, // 总数
        current: 1, // 页数
        pageSize: 10, // 条数
        tableData: [], // 表格数据

        testDateTable: [], // 检定日期-表格
        visibleConfig: false,

        multipleSelection: [], // 表格选中数据

        deviceTitle: '', // 新增/编辑-标题
        deviceVisible: false, // 新增/编辑-显示状态
        deviceRow: null, // // 新增/编辑-数据

        idLis: [],
        curBox: [],
        /* ***** */
        ids: [],
        /* ***** */
        batchImport: false,// 导入弹框
        fileName: '',
        fileObj: null,
      }
    },
    created () {
    },
    mounted () {
      this.onQuery(1, 10)
    },
    methods: {
      /*
      * 全选、取消全选
      * 2020.07.22
      * */
      handleSelectAll () {
        let trCheck = $('input[name=aaaChkox]')
        let tdCheck = $('input[class=childCheckbox]')

        if (event.target.checked) {
          for (let i = 0; i < trCheck.length; i++) {
            trCheck[i].checked = true
          }
          for (let i = 0; i < tdCheck.length; i++) {
            tdCheck[i].checked = true
          }
        } else {
          for (let i = 0; i < trCheck.length; i++) {
            trCheck[i].checked = false
          }
          for (let i = 0; i < tdCheck.length; i++) {
            tdCheck[i].checked = false
          }
        }
      },
      /*
      * 获取数字字典(档案状态)源数据
      * 2020.07.23
      * */
      GET_originData2 (val) {
        this.$store.state['fileStatusLIST'] = val
      },
      /*
      * 获取数字字典(设备状态)源数据
      * 2020.07.23
      * */
      GET_originData1 (val) {
        this.terminalStatusList = val
        this.$store.state['terminalStatusLIST'] = val
      },
      /*
      * 获取数字字典(检定方式)源数据
      * 2020.07.23
      * */
      GET_originData3 (val) {
        this.$store.state['checkModelLIST'] = val
      },
      /**********/
      selectFile_handle () {
        $('#eqSelectFile').click()
      },
      /*
      * 选择文件
      * */
      fileChange () {
        let that = this
        try {
          that.fileName = event.target.files[0].name
          that.fileObj = event.target.files[0]
        } catch (e) {
          // that.fileName = ''
        }
      },
      /*
      * 上传文件
      * */
      excelUpload () {
        let that = this
        let params = new FormData()
        params.append('file', that.fileObj)
        that.$api.eqManage.excelupload(params)
          .then(resp => {
            if (resp.data.ok) {
              this.$message.success({
                message: resp.data.data
              })
              this.batchImport = false
            } else {
              this.$message.warning({
                message: resp.data.data
              })
            }
          })
          .catch()
      },
      /*
      * 批量导入弹框关闭 时
      * */
      close_batchImport () {
        this.fileName = ''
        this.fileObj = null
        this.onQuery(this.current, this.pageSize)
      },

      // 查询
      onQuery (current, pageSize) {
        this.clearCheckedFn();
        this.loading = true;
        let params = {
          ...JSON.parse(JSON.stringify(this.queryForm)),
          currentPage: current,
          pageSize,
        }
        this.$api.eqManage.searchTerminal(params).then((resp) => {
          this.loading = false;
          let temp = resp.data.data
          this.tableData = temp.terminal.list.slice(0)
          this.idLis = this.tableData.map(item => {
            item.tiggle = false
            return item.id
          });
          if(temp.terminal.total > 0) {
            this.total = temp.terminal.total;
            this.current = current;
            this.pageSize = pageSize;
          } else {
            this.total = 0;
            this.current = 1;
            this.pageSize = 10;
          }
            
          }).catch(err => {
            console.log('查询失败',err);
            this.total = 0;
            this.current = 1;
            this.pageSize = 10;
            this.loading = false;
          });
      },

      /*
      * 格式转化表格:(状态)字段回显的内容
      * */
      change_filter1 (originVal) {
        let str = originVal + ''
        let question = ''
        let _this = this
        // 防止数据字典接口出问题引起的表而过数据回显不正确
        if (!_this.terminalStatusList) {
          return originVal
        }
        for (let i in _this.terminalStatusList) {
          if (str == _this.terminalStatusList[i].dicTypeCode) {
            question = _this.terminalStatusList[i].dicTypeName
            break
          }
        }
        return question
      },
      /*
      * 格式转化表格:(使用部门)字段回显的内容
      * */
      filter_officeList (originVal) {
        let str = originVal + ''
        let question = ''
        let _this = this
        let temp =_this.$store.state.officeList
        // 防止数据字典接口出问题引起的表而过数据回显不正确
        if (!temp) {
          return originVal
        }
        for (let i in temp) {
          if (str == temp[i].id) {
            question = temp[i].org_name
            break
          }
        }
        return question
      },

      /**/
      chBoxChangeFn1 (value) {
        let selectedTR = $(event.target).closest('.trClass')// 当前选中的这一行
        let selectedTrCheckBox = $(selectedTR).find('.childCheckbox')

        if (event.target.checked) {
          for (let i = 0; i < selectedTrCheckBox.length; i++) {
            selectedTrCheckBox[i].checked = true
          }
        } else {
          for (let i = 0; i < selectedTrCheckBox.length; i++) {
            selectedTrCheckBox[i].checked = false
          }
        }
        // if (this.ids.includes(value.id)) {
        //     this.multipleSelection = this.multipleSelection.filter(item => {
        //         return item.id !== value.id
        //     })
        //     this.ids = this.ids.filter(item => {
        //         return item !== value.id
        //     })
        // } else {
        //     this.ids.push(value.id)
        //     this.multipleSelection.push(value)
        // }
      },
      /**/
      chBoxChildChangeFn1 () {
        let selectedTrCheckBox = $(event.target).closest('.trClass').find('input[name*=aaaChkox]')
        let currentTd_checkbox = $(event.target).closest('.tdClass').find('input[type=checkbox][class*=childCheckbox]')
        let count = 0
        for (let i = 0; i < currentTd_checkbox.length; i++) {
          if (currentTd_checkbox[i].checked == true) {
            count += 1
          }
        }
        if (count <= currentTd_checkbox.length && count != 0) {
          selectedTrCheckBox[0].checked = true
        } else {
          selectedTrCheckBox[0].checked = false
        }
      },

      /*
      * 测试: 事件委托
      * */
      handleClick (e) {
        // console.log(e.target)
        // if (e.target.nodeName.toLowerCase() === 'span') {
        //     const index = parseInt(e.target.dataset.index)
        //     // 获得引索后，只需要修改data数据就能改变UI了
        //     // this.doSomething(index)
        // }
      },
      // 展开 / 收起
      onClickShow (val) {
        this.showbut = val
        this.showState = !this.showState
      },
      // 页数
      currentChange (val) {
        this.current = val;
        this.onQuery(this.current, this.pageSize);
      },
      // 条数
      sizeChange (val) {
        this.pageSize = val;
        this.onQuery(this.current, this.pageSize);
      },
      /*
      *
      * */
      clearCheckedFn () {
        let checks = $('input[type=checkbox][name*=aaaChkox]')
        let checks2 = $('input[type=checkbox][class*=childCheckbox]')
        checks.each((index, element) => {
          element.checked = false
        })
        checks2.each((index, element) => {
          element.checked = false
        })
        $('input[name*=SelectAll]').each((index, element) => {
          element.checked = false
        })
        // this.multipleSelection = []
        // this.ids = []
      },
      // 回车查询
      enterQuery (e) {
        var keyCode = window.event ? e.keyCode : e.which
        if (keyCode === 13) {
          this.onQuery(1, 10)
        }
      },
      // 重置
      onReset () {
        this.queryForm = {
          code: '',// 设备编号
          model: '',// 设备型号
          name: '',// 设备名称
          fileStatus: '',// 档案状态
          useDepartment: '',// 使用部门
          terminalStatus: '',// 设备状态
          orderby: 'code',// 排序
          limitTime: '',// 距过期(还有多少天)
          checkdate3: '',// 下达日期
          checkModel: '',// 检定方式
        };
        this.onQuery(1, 10);
      },
      // 待检
      onStayCheck () {
        let ids = []
        $(`input[type=checkbox][class*=childCheckbox]`).each((index, element) => {
          if (element.checked) {
            let id = $(element).attr('data-rowData')
            if (!ids.includes(id)) {
              ids.push(id)
            }
          }
        })
        if (ids.length !== 0) {
          let parma = {
            ids: ids.toString()
          }
          this.$api.eqManage.gocheckTerminal(parma)
            .then(res => {
              this.onQuery(this.current, this.pageSize)
              this.clearCheckedFn()
            })
            .catch()
        }
        //
        else {
          this.$message.warning('请选数据')
        }
      },
      // 新建设备
      onNewBuilt () {
        this.deviceTitle = '新建设备' // 新增/编辑-标题
        this.deviceVisible = true // 新增/编辑-显示状态
        this.deviceRow = null // // 新增/编辑-数据
      },
      // 编辑设备
      onEdit (row) {
        this.deviceTitle = '编辑设备' // 新增/编辑-标题
        let params = {
          id: row.id
        }
        this.$api.eqManage.detailTerminal(params)
          .then(resp => {
            let temp = resp.data.data
            this.deviceVisible = true // 新增/编辑-显示状态
            this.$nextTick(() => {
              this.deviceRow = temp
            })
          })
          .catch()
      },
      // 新增/编辑-关闭
      onDeviceClose () {
        this.deviceTitle = '' // 新增/编辑-标题
        this.deviceVisible = false // 新增/编辑-显示状态
        this.deviceRow = null // 新增/编辑-数据
        this.onQuery(this.current, this.pageSize)
      },
      // 查看设备
      onDetail(row){
        this.deviceTitle = '查看设备' // 新增/编辑-标题
        let params = {
          id: row.id
        }
        this.$api.eqManage.detailTerminal(params)
          .then(resp => {
            let temp = resp.data.data
            this.deviceVisible = true // 新增/编辑-显示状态
            this.$nextTick(() => {
              this.deviceRow = temp
              this.$refs['Device'].showFooter = false
            })
          })
          .catch()
      },
      // 校准日期
      onTestDate (row) {
        let params = {
          id: row.id,
        }
        this.$api.eqManage.findcheckdate(params)
          .then(res => {
            let temp = res.data.data
            this.testDateTable = temp.list.slice(0)
            this.visibleConfig = true
          })
          .catch()
      },
      closeFn_visibleConfig () {
        this.visibleConfig = false
        this.$nextTick(() => {
          this.testDateTable = []
        })
      },
      /* ************** 需求变更(取消的) ***************** */
      // 条数
      // pageSizeChange (val) {
      //     this.pageSize = val
      //     this.onQuery(this.current, this.pageSize)
      // },
      /*
      * 控制隐藏表格域
      * */
      openFn1 (row, index) {
        let copy = JSON.parse(JSON.stringify(row))
        // 情景1: 点击同一条表格数据时
        if (row.tiggle) {
          copy.tiggle = false
          this.tableData.splice(index, 1, copy)
          return
        }
        // 情景2: 点击不同的表格数据时
        this.tableData.forEach(item => {
          item.tiggle = false // 收起其他的表格扩展列
        })
        copy.tiggle = !copy.tiggle
        this.tableData.splice(index, 1, copy)

      },
    },
  }
</script>

<style lang="less" scoped>
  @import './style/mlyStyle.less';

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

  // 重置
  .reset_btn {
    margin: 0 !important;
    margin-left: 10px !important;
    background: #909399 !important;
    border-color: #909399 !important;
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
        padding-right: 20px;

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

  .eqmanage {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
  }

  /deep/ .eqmanage_con {
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
      }

      .pagination_modular {
        margin-top: 20px;
        padding: 0;
      }
    }
  }

</style>
