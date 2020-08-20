<template>
  <!-- 任务草稿 -->
  <div class="box_cont">
    <div class="top">
      <div class="left">
        <el-form
          ref="form"
          :model="sizeForm" size="small"
          :inline="true" style="width: 100%;"
        >
          <div style="width:calc(100% - 55px);display:flex;justify-content: space-between;">
            <el-form-item style="width:19%;display: flex;">
              <span slot="label" class="myLabel">任务号 :</span>
              <el-input placeholder="请输入任务号" v-model="sizeForm.taskCode" clearable name="clearInputValue"
                        @keyup.enter.native="searchEnterFun"></el-input>
            </el-form-item>
            <el-form-item style="width:19%;display: flex;">
              <span slot="label" class="myLabel">受检单位 :</span>
              <el-input placeholder="请输入受检单位" v-model="sizeForm.companyCheck" clearable name="clearInputValue"
                        @keyup.enter.native="searchEnterFun"></el-input>
            </el-form-item>
            <el-form-item style="width:19%;display: flex;">
              <span slot="label" class="myLabel">样品名称 :</span>
              <el-input placeholder="请输入样品名称" v-model="sizeForm.sampleName" clearable name="clearInputValue"
                        @keyup.enter.native="searchEnterFun"></el-input>
            </el-form-item>
            <el-form-item style="width:19%;display: flex;">
              <span slot="label" class="myLabel">规格型号 :</span>
              <el-input placeholder="请输入规格型号" v-model="sizeForm.sampleType" clearable name="clearInputValue"
                        @keyup.enter.native="searchEnterFun"></el-input>
            </el-form-item>
            <el-form-item style="width:19%;display: flex;">
              <span slot="label" class="myLabel">下达人 :</span>
              <el-input placeholder="请输入下达人" v-model="sizeForm.commiterId" clearable name="clearInputValue"
                        @keyup.enter.native="searchEnterFun"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="right">
      <el-row>
        <el-button
          type="primary"
          size="mini"
          @click="batch"
          style="
            height: 30px;
            padding: 0 20px;
            margin: 0;
            background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
            color:#fff;">
          批量删除
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="findName(1,5)"
          style="
            height: 30px;
            padding: 0 20px;
            margin: 0;
            background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
            color:#fff;">
          查询
        </el-button>
      </el-row>
    </div>
    <div class="bottom">
      <div class="bottom-table">
        <el-table
          border
          v-loading="loading"
          stripe
          :data="tabllist"
          @selection-change="dataSelect"
          style="width: 100%"
          :header-cell-style="{
            'background-color': 'rgba(243,246,253,1)',
            'color': '#606266',
            'padding': '10px 0'}">
          <el-table-column type="selection" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="taskCode" align="center" label="草稿任务号" :resizable="false"></el-table-column>
          <el-table-column prop="companyCheck" label="受检单位" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="sampleName" align="center" label="样品名称" :resizable="false"></el-table-column>
          <el-table-column prop="sampleType" align="center" label="样品规格型号" :resizable="false"></el-table-column>
          <el-table-column prop="createdate" align="center" label="保存时间" :resizable="false"></el-table-column>
          <el-table-column prop="name" align="center" label="操作人" :resizable="false"></el-table-column>
          <el-table-column align="center" style="width:400px;" label="操作" :resizable="false">
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
    <div class="block">
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
    <!-- 详情 -->
    <el-dialog
      :title="dialogFormTitle"
      :visible.sync="dialogFormVisible"
      v-if="dialogFormVisible"
      :before-close="handleClose"
      v-bind="{
        modal: false,
        width:'99.9%',
        top:'0',
      }"
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
  // import taskDetail from '@/views/entrust/componentsview/Entrustlist.vue'
  import taskDetail from '@/views/taskdelegation/componentstask/acceptance.vue'

  export default {
    name: 'Entrustdraft',
    data() {
      return {
        loading: false,
        checked: true,
        tabllist: [],
        bind: [],
        dialogFormTitle: '编辑',
        Binding: '绑定',
        bindid: '',
        currentPage: 1,
        pageSize: 5,
        currentPage4s: 1,
        pageSizes: 5,
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
        //
        TaskId: ''
      }
    },
    components: {
      taskDetail
    },
    methods: {
      handleClose() {
        this.findName(this.currentPage, this.pageSize);
        this.dialogFormVisible = false
      },
      //回车
      searchEnterFun(e) {
        var keyCode = window.event ? e.keyCode : e.which;
        if (keyCode == 13) {
          this.findName(this.currentPage, this.pageSize)
        }
      },
      //批量删除
      batch() {
        if (this.minili.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择后删除!',
            duration: 2500
          });
        } else {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let strs = this.str;
            this.$api.draft.deleteIndextaskList(strs).then(res => {
              this.findName(this.currentPage, this.pageSize)
            });
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 1500
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
              duration: 1500
            });
          });
        }
      },
      submitFormVisible() {
        this.dialogFormVisible = false
      },
      //点击绑定显示
      handle(row, currentPage4s, pageSizes) {
        this.currentPage4s = currentPage4s;
        this.pageSizes = pageSizes;
        this.duix = row;
        this.bindid = row.id;
        this.dialogBinding = true;
        let prs = {
          id: row.id,
        };
        this.$api.draft.bindzdList(prs).then(res => {
          this.bind = res.data.data.list
          if (res.data.data.pageSize > 50) {
            this.bind.splice(50, this.bind.length)
          }
        })
      },
      //点击绑定
      bindings() {
        if (this.multipleSelection.length != 0) {
        } else {
          this.$message.info({
            message: '请选择',
            duration: 2500
          });
          return
        }
        let obj = {
          taskid: this.bindid,
          inspectID: this.arr
        };
        this.$api.draft.bindTask(obj).then(res => {
          if (res.data.respCode == 0) {
            this.$message({
              type: 'success',
              message: '绑定成功!',
              duration: 1500
            });
          } else {
            this.$message({
              type: 'success',
              message: '绑定失败!',
              duration: 1500
            });
          }
          this.dialogBinding = false
        })
      },
      // 查询
      findName(currentPage, pageSize) {
        this.loading = true
        this.currentPage = currentPage
        this.pageSize = pageSize
        let obj = {
          taskCode: this.sizeForm.taskCode,
          companyCheck: this.sizeForm.companyCheck,
          sampleName: this.sizeForm.sampleName,
          sampleType: this.sizeForm.sampleType,
          commiterId: this.sizeForm.commiterId,
          currentPage: currentPage,
          pageSize: pageSize
        }
        this.$api.draft.findList(obj).then(res => {
          this.tabllist = res.data.data.list
          if (res.data.respCode == '0') {
            this.loading = false
          }
          if (this.tabllist.length > 0) {
            this.total = res.data.data.total
          }
        })
      },
      //删除多选
      dataSelect(val) {
        this.minili = val
        this.multipleSelection = [];
        // 这是一个数组 将选中的值进行重新赋值然后将里面的id进行保存
        val.map(item => {
          this.multipleSelection.push(item.id)
        })
        this.str = this.multipleSelection.join(',')
      },
      //绑定多选
      Selectbind(val) {
        this.multipleSelection = [];
        val.map(item => {
          this.multipleSelection.push(item.id)
        })
        this.str = this.multipleSelection.join(',')
        this.arr = this.str.split(",")
      },
      handleDetails(index, row) {
        this.dialogFormVisible = true;
        this.TaskId = row.id
      },
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.draft.delete(row.id).then(res => {
            this.findName()
          })
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 1500
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1500
          });
        });
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.findName(this.currentPage, this.pageSize)
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.findName(this.currentPage, this.pageSize)
      },
      handleSizeChanges(val) {
        this.pageSizes = val
        this.handle(this.duix, this.currentPage4s, this.pageSizes)
      },
      handleCurrentChanges(val) {
        this.currentPage4s = val
        this.handle(this.duix, this.currentPage4s, this.pageSizes)
      }
    },
    created() {

    }
  }
</script>
<style lang="scss" scoped>
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
  }

  .bottom .bottom-table {
    width: 100%;
    height: 100%;
    overflow-y: auto;
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
  }

  .divs {
    height: 70%;
  }

  .myLabel{
    display: inline-block;
    min-width: 76px;
  }

  .box_cont .right .el-row {
    width: 100%;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    // display: flex;
    // justify-content: space-between;
  }

  .right .el-row .el-button:nth-child(1) {
    float: left;
  }

  .right .el-row .el-button:nth-child(2) {
    float: right;
  }

  .block {
    width: 100%;
    display: flex;
    align-items: center;
    background: #fff;
    padding: 20px;
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
  /deep/ .taskDetail_dialog1 {
    min-height: 100% !important;
    margin: 0 auto !important;
  }
</style>

