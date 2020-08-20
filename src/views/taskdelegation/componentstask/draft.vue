<template>
  <!-- 任务草稿 -->
  <div class="box_cont">
    <!-- 查询区域 -->
    <div class="top">
      <div class="left">
        <el-form
          ref="form"
          :model="sizeForm" size="small"
          :inline="true" style="width: 100%;"
        >
          <div style="width:calc(100% - 55px);display:flex;justify-content: space-between;">
            <el-form-item style="width:19%;display: flex;">
              <span slot="label" class="myLabel">报告编号 :</span>
              <el-input placeholder="请输入报告编号" v-model="sizeForm.taskCode" clearable name="clearInputValue"
                        @keyup.enter.native="searchEnterFun"/>
            </el-form-item>
            <el-form-item style="width:19%;display: flex;">
              <span slot="label" class="myLabel">受检单位 :</span>
              <el-input placeholder="请输入受检单位" v-model="sizeForm.companyCheck" clearable name="clearInputValue"
                        @keyup.enter.native="searchEnterFun"/>
            </el-form-item>
            <el-form-item style="width:19%;display: flex;">
              <span slot="label" class="myLabel">样品名称 :</span>
              <el-input placeholder="请输入样品名称" v-model="sizeForm.sampleName" clearable name="clearInputValue"
                        @keyup.enter.native="searchEnterFun"/>
            </el-form-item>
            <el-form-item style="width:19%;display: flex;">
              <span slot="label" class="myLabel">规格型号 :</span>
              <el-input placeholder="请输入规格型号" v-model="sizeForm.sampleType" clearable name="clearInputValue"
                        @keyup.enter.native="searchEnterFun"/>
            </el-form-item>
            <el-form-item style="width:19%;display: flex;">
              <span slot="label" class="myLabel">下达人 :</span>
              <el-input placeholder="请输入下达人" v-model="sizeForm.commiterId" clearable name="clearInputValue"
                        @keyup.enter.native="searchEnterFun"/>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 按钮区域 -->
    <div class="right">
      <el-row>
        <el-col :span="8">
          <el-button
            class="btn_Group_2"
            type="danger"
            size="mini"
            @click="batch">批量删除
          </el-button>
          <el-button
            class="btn_Group_1"
            size="mini"
            @click="batchSend">批量下达
          </el-button>
          <el-button
            size="mini"
            class="btn_Group_1"
            @click="showUploadDialog = true">批量导入
          </el-button>
          <el-button
            class="btn_Group_1"
            size="mini"
            @click="openDialogCreate"
          >创建草稿
          </el-button>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-button class="btn_Group_1" type="primary" size="mini"
                     @click="findName(1,10)">查询
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 表格区域 -->
    <div class="bottom">
      <div class="bottom-table">
        <el-table
          ref="table66"
          border
          height="calc(100% - 1px)"
          stripe
          v-loading="loading"
          :data="tabllist"
          @selection-change="dataSelect"

          :header-cell-style="{
            'background-color': 'rgba(243,246,253,1)',
            'color': '#606266',
            'padding': '10px 0'
          }">
          <el-table-column type="selection" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="taskCode" align="center" label="报告编号" :resizable="false"></el-table-column>
          <el-table-column prop="companyCheck" label="受检单位" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="sampleName" align="center" label="样品名称" :resizable="false"></el-table-column>
          <el-table-column prop="sampleType" align="center" label="样品规格型号" :resizable="false"></el-table-column>
          <el-table-column prop="createdate" align="center" label="保存时间" :resizable="false"></el-table-column>
          <el-table-column prop="name" align="center" label="操作人" :resizable="false"></el-table-column>
          <el-table-column align="center" width="200" label="操作" :resizable="false">
            <template slot-scope="scope">
              <el-button type="text" @click="handleDetails(scope.$index, scope.row)" size="mini">详情</el-button>
              <el-button type="text" @click="handleDelete(scope.$index, scope.row)" size="mini" style="color:red;">删除
              </el-button>
              <el-button
                type="text"
                @click="handle(scope.row , 1 , 5)"
                size="mini"
                v-if="scope.row.checkTypeID == 'ZD'"
              >绑定
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页器区域 -->
    <el-pagination
      style="background:#FFFFFF; "
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10,20,30]"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes,->, prev, pager, next, jumper"
    />

    <!-- 创建草稿 -->
    <el-dialog
      v-if="dialogCreate"
      :visible.sync="dialogCreate"
      v-bind="{
        modal: false,
        width: '99.9%',
        top: '0',
        title: '创建任务',
        customClass: 'taskDetail_dialog1 m-dialog-full',
        // beforeClose: handleClose_DialogCreate,
      }"
    >
      <taskDetail/>
    </el-dialog>

    <!-- 下达结果 -->
    <el-dialog
      :visible.sync="showBatchSendResponse"
      v-bind="{
          width:'1000px',
          title: '下达结果',
          // showClose:false,
          closeOnPressEscape: false,
          closeOnClickModal: false,
      }"
      @close="closeBatchSendResponse"
    >
      <div style="height: 600px;overflow: auto;">
        <table class="batchSendResponse-table">
          <tr>
            <th>报告编号</th>
            <th>受检单位</th>
            <th>样品名称</th>
            <th>规格型号</th>
            <th>样品商标</th>
            <th>结果</th>
            <th>原因</th>
          </tr>
          <tr v-for="(item,index) in batchSendResponse" :key="index">
            <td>{{item.taskCode}}</td>
            <td>{{item.companyCheck}}</td>
            <td>{{item.sampleName}}</td>
            <td>{{item.sampleType}}</td>
            <td>{{item.sampleTrademark}}</td>
            <td>
              <template v-if="item.mes">
                <span style="color:red;">失败</span>
              </template>
              <template v-else>
                <span style="color:green;">成功</span>
              </template>
            </td>
            <td>{{item.mes}}</td>
          </tr>
        </table>
      </div>
    </el-dialog>

    <!-- 文件导入 -->
    <el-dialog
      :visible.sync="showUploadDialog"
      v-bind="{
          title: '文件导入',
          // showClose:false,
          'close-on-press-escape': false,
          'close-on-click-modal': false,
        }"
    >
      <el-row>
        <el-col :span="6" style="text-align: right">上传文件&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
        <el-col :span="10">
          <el-input :readonly="true" size="mini" style="width: 90%;" v-model="fileName"/>
        </el-col>
        <el-col :span="8">
          <el-upload
            ref="draft_upload"
            v-bind="{
                // action: actionUrl,
                action: '###',
                // 'auto-upload': false,
                'show-file-list': false,
                'before-upload': fileBeforeUpload,
                // 'on-success': fileOnSuccess,
                'http-request': fileHttpRequest
            }">
            <el-button slot="trigger" class="" type="primary" size="mini">选择文件</el-button>
          </el-upload>
        </el-col>
        <el-col
          v-show="progressFlag"
          v-bind="{
              span: 18,
              push: 3,
              pull: 3,
            }">
          <el-progress :percentage="progressPercent"/>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 导入结果 -->
    <el-dialog
      :visible.sync="showUploadResponse"
      v-bind="{
          title: '导入结果',
          // showClose:false,
          fullscreen: true,
          'close-on-press-escape': false,
          // 'close-on-click-modal': false,
          'before-close':beforeClose_UploadResponse
        }"
    >
      <el-table
        v-bind="{
            data: responseAfterUpload_list,
            border: true,
          }">
        <el-table-column prop="name" align="center" label="样品名称" :resizable="false"></el-table-column>
        <el-table-column prop="model" align="center" label="样品编号" :resizable="false"></el-table-column>
        <el-table-column prop="enterprise" align="center" label="生产企业" :resizable="false"></el-table-column>
        <el-table-column prop="trademark" align="center" label="样品商标" :resizable="false"></el-table-column>
        <el-table-column prop="taskCode" align="center" label="项目编号" :resizable="false"></el-table-column>
        <el-table-column prop="" align="center" label="结果" :resizable="false">
          <template slot-scope="{ row }">
            <template v-if="row['taskCode']=='' || row['taskCode'] == null">失败</template>
            <template v-else>成功</template>
          </template>
        </el-table-column>
        <el-table-column
          prop="message"
          v-bind="{
              width:'500',
              align:'center',
              label:'原因',
              resizable: false,
            }"/>
      </el-table>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog
      v-bind="{
        // 'destroy-on-close': true,
        modal: false,
        width:'99.9%',
        top:'0',
      }"
      v-if="dialogFormVisible"
      :title="dialogFormTitle"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      :custom-class="'taskDetail_dialog1'"
    >
      <taskDetail
        ref="taskDetail"
        saveType="1"
        :draft-taskid="TaskId"
      />
    </el-dialog>

    <!-- 绑定 -->
    <el-dialog
      :title="Binding"
      :visible.sync="dialogBinding"
      class="bindingsd">
      <div class="bindingsd-table">
        <el-table :data="bind" border @selection-change="Selectbind" style="width: 100%" stripe
                  :header-cell-style="{
            'background-color': 'rgba(243,246,253,1)',
            'color': '#606266',
            'padding': '10px 0'}">
          <el-table-column type="selection" align="center" label="草稿任务号" :resizable="false"></el-table-column>
          <el-table-column prop="taskCode" align="center" label="草稿任务号" :resizable="false"></el-table-column>
          <el-table-column prop="companyCheck" label="受检单位" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="sampleName" align="center" label="样品名称" :resizable="false"></el-table-column>
          <el-table-column prop="sampleType" align="center" label="样品规格型号" :resizable="false"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindings">绑定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios'
  import base from '@/api/base.js'
  import taskDetail from '@/views/taskdelegation/componentstask/acceptance.vue'

  export default {
    name: 'draft',
    data () {
      return {
        // 批量导入相关 <--
        actionUrl: `${base.baseUrl}/Indextask/batchImportTask`,
        showUploadDialog: false,
        fileName: '',
        progressFlag: false,
        progressPercent: 0,
        showUploadResponse: false,
        responseAfterUpload_list: [],
        // -->
        // 批量下达相关 <--
        showBatchSendResponse: false,
        batchSendResponse: [],
        // -->
        loading: false,
        checked: true,
        tabllist: [],
        bind: [],
        dialogFormTitle: '编辑',
        Binding: '绑定',
        bindid: '',
        currentPage: 1,
        pageSize: 10,
        currentPage4s: 1,
        pageSizes: 10,
        multipleSelection: [],
        dialogFormVisible: false,
        dialogBinding: false,
        idss: [],
        str: '',
        arr: [],
        total: 0,
        totals: 0,
        form: {},
        sizeForm: {
          taskCode: '',
          companyCheck: '',
          sampleName: '',
          sampleType: '',
          commiterId: '',
        },
        minili: [],
        duix: {},

        TaskId: '',
        /* 2020.07.27需求变更 */
        dialogCreate: false,
      }
    },
    components: {
      taskDetail
    },
    methods: {
      /*
      * 条件查询
      * */
      findName (currentPage, pageSize) {
        this.loading = true
        this.currentPage = currentPage
        this.pageSize = pageSize
        let params = {
          taskCode: this.sizeForm.taskCode,
          companyCheck: this.sizeForm.companyCheck,
          sampleName: this.sizeForm.sampleName,
          sampleType: this.sizeForm.sampleType,
          commiterId: this.sizeForm.commiterId,
          entPage: 0,
          currentPage: currentPage,
          pageSize: pageSize,
        }
        this.$api.draft.findList(params).then(res => {
          // console.log('查询成功',res);
          if (res.data && res.data.data) {
            this.tabllist = res.data.data.list
            if (res.data.respCode === '0') {
              this.loading = false
            }
            this.total = res.data.data.total
          }
        }).catch(error => {
          console.log('查询失败：', error)
        })
      },

      /*
      * 回车触发条件查询
      * */
      searchEnterFun (e) {
        var keyCode = window.event ? e.keyCode : e.which
        if (keyCode == 13) {
          this.findName(this.currentPage, this.pageSize)
        }
      },

      /*
      * 打开任务受理弹框
      * */
      openDialogCreate () {
        this.dialogCreate = true
      },

      /*
      * 删除单条数据
      * */
      handleDelete (index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.draft.delete(row.id).then(res => {
            if (res.data.ok) {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 3000
              })
              this.findName(this.currentPage, this.pageSize)
            } else {
              this.$message({
                type: 'warning',
                message: res.data.message,
                // duration: 3000
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 3000
          })
        })
      },

      /*
      * 批量删除
      * */
      batch () {
        if (this.minili.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择后删除!',
            duration: 2500
          })
        } else {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let strs = this.str
            this.$api.draft.deleteIndextaskList(strs).then(res => {
              if (res.data.ok) {
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                  duration: 1500
                })
                this.findName(this.currentPage, this.pageSize)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
              duration: 1500
            })
          })
        }
      },

      /*
      * 批量下达
      * */
      batchSend () {
        let params = []
        params = this.minili.map(item => {
          return item.id
        })
        if (params.length == 0) {
          this.$message.warning({
            message: '请选择数据进行批量下达',
            duration: 3500,
          })
          return
        }
        this.$api.draft.batchSend(params)
          .then((res) => {
            if (res.data.ok) {
              this.batchSendResponse = res.data.data.slice(0)
              this.showBatchSendResponse = true
            }
          })
          .catch(err => {

          })
      },
      /*
      * 关闭批量下达 弹框 时
      * */
      closeBatchSendResponse () {
        this.batchSendResponse = []
        this.findName(this.currentPage, this.pageSize)
      },

      /*
      * 批量导入前
      * */
      fileBeforeUpload (file) {
        this.fileName = file['name']
      },

      /*
      * 自定义上传
      * */
      fileHttpRequest (f) {
        this.progressFlag = true
        let formdata = new FormData()
        formdata.append('file', f.file)
        axios({
          url: this.actionUrl,
          method: 'post',
          data: formdata,
          headers: {'Content-Type': 'multipart/form-data'},
          onUploadProgress: progressEvent => {
            // progressEvent.loaded:已上传文件大小
            // progressEvent.total:被上传文件的总大小
            this.progressPercent = (progressEvent.loaded / progressEvent.total * 100)
          }
        }).then(res => {
          console.log(res)
          if (this.progressPercent === 100) {
            this.progressFlag = false
            this.progressPercent = 0
          }
          if (res.data.respCode == 0) {
            this.responseAfterUpload_list = res.data.data.list

            this.$nextTick(() => {
              this.showUploadDialog = false
              this.fileName = ''
              this.$nextTick(() => {
                this.$message.success({
                  message: `导入成功 !`,
                  duration: 3000,
                })
                this.showUploadResponse = true
              })
            })
          }
        }).catch(error => {
          console.log(error)
        }).then(() => {
          // this.showUploadDialog = false
          // this.fileName = ''
        })
      },
      beforeClose_UploadResponse (done) {
        this.responseAfterUpload_list = []
        done()
      },
      submitFormVisible () {
        this.dialogFormVisible = false
      },
      // 点击绑定显示
      handle (row, currentPage4s, pageSizes) {
        this.currentPage4s = currentPage4s
        this.pageSizes = pageSizes
        this.duix = row
        this.bindid = row.id
        this.dialogBinding = true
        let prs = {
          id: row.id,
        }
        this.$api.draft.bindzdList(prs).then(res => {
          this.bind = res.data.data.list
          if (res.data.data.pageSize > 50) {
            this.bind.splice(50, this.bind.length)
          }
        })
      },
      // 点击绑定
      bindings () {
        if (this.multipleSelection.length !== 0) {
        } else {
          this.$message.info({
            message: '请选择',
            duration: 2500
          })
          return
        }
        let obj = {
          taskid: this.bindid,
          inspectID: this.arr
        }
        this.$api.draft.bindTask(obj).then(res => {
          if (res.data.respCode == 0) {
            this.$message({
              type: 'success',
              message: '绑定成功!',
              duration: 1500
            })
          } else {
            this.$message({
              type: 'success',
              message: '绑定失败!',
              duration: 1500
            })
          }
          this.dialogBinding = false
        })
      },

      // 删除多选
      dataSelect (val) {
        this.minili = val
        this.multipleSelection = []
        // 这是一个数组 将选中的值进行重新赋值然后将里面的id进行保存
        val.map(item => {
          this.multipleSelection.push(item.id)
        })
        this.str = this.multipleSelection.join(',')
      },

      // 绑定多选
      Selectbind (val) {
        this.multipleSelection = []
        val.map(item => {
          this.multipleSelection.push(item.id)
        })
        this.str = this.multipleSelection.join(',')
        this.arr = this.str.split(',')
      },

      /*
      * 打开详情
      * */
      handleDetails (index, row) {
        this.dialogFormVisible = true
        this.TaskId = row.id
      },

      /*
      * 关闭详情前
      * */
      handleClose () {
        this.dialogFormVisible = false
        this.findName(this.currentPage, this.pageSize)
      },

      handleSizeChange (val) {
        this.pageSize = val
        this.findName(this.currentPage, this.pageSize)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.findName(this.currentPage, this.pageSize)
      },
      handleSizeChanges (val) {
        this.pageSizes = val
        this.handle(this.duix, this.currentPage4s, this.pageSizes)
      },
      handleCurrentChanges (val) {
        this.currentPage4s = val
        this.handle(this.duix, this.currentPage4s, this.pageSizes)
      }
    },
    created () {
      this.findName(1, 10)
    },
    mounted () {
    },
  }
</script>
<style lang="less" scoped>
  @import "./style/draft.less";

  .box_cont {
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #eee;
  }

  .el-dialog__wrapper {
    width: 100%;
    height: 100%;
  }

  .binding {
    width: 100%;
    height: 100%;
  }

  .binding .el-dialog {
    width: 100%;
    height: 100%;
  }

  .top {
    width: 100%;
    padding: 20px 20px 0 20px;
    display: flex;
    background: #fff;
  }

  .bottom {
    flex: 1;
    overflow: hidden;
    background: #fff;
    padding: 20px 20px 0 20px;
    /*position: relative;*/
  }

  .bottom .bottom-table {
    height: 100%;
  }

  .box_cont .left {
    width: 100%;
    display: flex;
    box-sizing: border-box;
  }

  .box_cont .left .el-form-item {
    margin: 0;
  }

  .box_cont .right {
    width: 100%;
    padding: 20px 20px 0 20px;
    display: flex;
    box-sizing: border-box;
    background: #fff;

    .btn_Group_1 {
      height: 30px;
      padding: 0 20px;
      background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
      color: #fff;
    }

    .btn_Group_2 {
      height: 30px;
      padding: 0 20px;
      color: #fff;
    }
  }

  .divs {
    height: 70%;
  }

  .myLabel {
    display: inline-block;
    min-width: 100px;
  }

  .box_cont .right .el-row {
    width: 100%;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .right .el-row .el-button:nth-child(1) {
    /*float: left;*/
  }

  .right .el-row .el-button:nth-child(2) {
    /*float: right;*/
  }

  .block {
    /*width: 100%;*/
    /*display: flex;*/
    /*align-items: center;*/
    /*background: #fff;*/
    /*padding: 20px;*/
  }

  .bindingsd {
    overflow: hidden;
    padding: 100px 0;
  }

  /deep/ .bindingsd .el-dialog {
    height: 100% !important;
    margin: 0 auto !important;
    overflow: hidden !important;
    display: flex;
    flex-direction: column;
  }

  /deep/ .bindingsd .el-dialog .el-dialog__body {
    flex: 1 !important;
    overflow: hidden !important;
    padding: 20px;
  }

  /deep/ .bindingsd .el-dialog .el-dialog__footer {
    padding: 0 20px 20px 20px;
  }

  .bindingsd .bindingsd-table {
    height: 100%;
    overflow-y: auto;
  }


  /*/deep/ .taskDetail_dialog1 {
    !* 原: *!
    !*min-height: 100% !important;*!
    !*margin: 0 auto !important;*!
    !* 现在: *!
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .el-dialog__body{
      flex: 1;
      overflow: hidden;

      .div{
        .wrap{
          padding-right: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;

          .m-tabs{
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;

            .el-tabs__content{
              flex: 1;
              overflow: hidden;

              .el-tab-pane{
                height: 100%;
                overflow: auto;

                .m-SampleInfor,.m-InspecteItems{
                  height: 99%;
                  overflow: hidden;
                  display: flex;
                  flex-direction: column;

                  .m-target{
                    flex: 1;
                    overflow: hidden;
                  }
                }
                .m-InspecteItems{
                  .m-target{
                    flex: 1;
                    overflow: auto;
                  }
                }
              }
            }
          }
        }
      }
    }
  }*/


</style>
