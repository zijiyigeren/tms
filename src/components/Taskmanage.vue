<template>
  <!-- 任务管理 -->
  <div class="taskmanage">
    <div class="warp">
      <div class="form-search">
        <div style="display: flex;align-items: center;">
          <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline" label-width="82px">
            <div class="query-input">
              <el-form-item label="任务号 :" style="width:19%">
                <el-input v-model.trim="formInline.taskCode" @keyup.enter.native="searchEnterFun" clearable name="clearInputValue"></el-input>
              </el-form-item>
              <el-form-item label="受检单位 :" style="width:19%">
                <el-input v-model.trim="formInline.companyCheck" @keyup.enter.native="searchEnterFun" name="clearInputValue"
                          clearable></el-input>
              </el-form-item>
              <el-form-item label="样品名称 :" style="width:19%">
                <el-input v-model.trim="formInline.sampleName" @keyup.enter.native="searchEnterFun" clearable name="clearInputValue"></el-input>
              </el-form-item>
              <el-form-item label="规格型号 :" style="width:19%">
                <el-input v-model.trim="formInline.sampleType" @keyup.enter.native="searchEnterFun" clearable name="clearInputValue"></el-input>
              </el-form-item>
              <el-form-item label="主检科室 :" style="width:19%">
                <el-select v-model="formInline.deptid">
                  <el-option v-for="(item,i) in deptidList" :key="i" :label="item.org_name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-collapse-transition>
              <div v-show="show">
                <div class="query-input-show" style="padding-top: 20px">
                  <el-form-item label="查询年份 :" style="width:19%">
                    <el-select v-model="formInline.searchdate">
                      <el-option v-for="item in dateList" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="完成状态 :" style="width:19%">
                    <el-select v-model="formInline.task_status">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="已完成" value="1"></el-option>
                      <el-option label="未完成" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="归档状态 :" style="width:19%">
                    <el-select v-model="formInline.docStatus">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="报告未归档" value="0"></el-option>
                      <el-option label="报告已归档" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <div style="width:19%"><!-- 补位 --></div>
                  <div style="width:19%"><!-- 补位 --></div>
                </div>
              </div>
            </el-collapse-transition>
          </el-form>
          <div style="min-width: 55px;">
            <el-button v-if="showbut==0" @click="clickshowbut(1)" type="text" style="color:#32AFF0;padding: 10px 0;border: none;">
              收起 <i class="el-icon-arrow-up"></i>
            </el-button>
            <el-button v-if="showbut!=0" @click="clickshowbut(0)" type="text" style="color:#32AFF0;padding: 10px 0;border: none;">
              展开 <i class="el-icon-arrow-down"></i>
            </el-button>
          </div>
        </div>
        <div class="demo-form-inline-but">
          <el-button type="primary" @click="onClickInquire(formInline, 1, 10)">查询</el-button>
        </div>
      </div>

      <div class="table-pagingdevice">
        <div class="table-box">
          <Taskmanagetable :loading="loading" :tablelist="tablelist" :type="type" @copyMessage="oncopyMessage"/>
        </div>

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
    </div>
  </div>
</template>
<script>
  import Taskmanagetable from './taskmanageTable.vue'
  export default {
    name: 'taskmanage',
    components: {Taskmanagetable},
    props: ['type'],
    data() {
      return {
        arrDate: [{id: '', title: '全部'}], // 默认年份数据
        dateList: [], // 年份数据
        currentPage: 1, // 当前页
        pageSize: 10, // 每页的条数
        total: 0, // 总条数
        searchdate: '', // 年份
        formInline: { // 查询form数据
          taskCode: '',	// 任务号
          companyCheck: '',	// 受检单位
          sampleName: '',	// 样品名称
          sampleType: '', // 规格型号
          deptid: '', // 主检科室
          searchdate: '', // 查询年份
          task_status: '', // 状态：1已完成，2未完成
          docStatus: '', // 归档状态：0报告未归档，1报告已归档
          currentPage: '',
          pageSize: ''
        },
        task_status: '', // 状态
        deptidList: [], // 主检科室数据
        tablelist: [], // 一级table数据
        show: false,
        showbut: 1,
        loading: false,
      }
    },
    created() {
      this.obtainDateList();
      this.acquireSearchDep();
    },
    mounted() {
      this.getDataList();
    },
    methods: {
      // 获取查询年份数据
      obtainDateList() {
        var myDate = new Date();
        var currentYearTitle = myDate.getFullYear();
        var currentYearId = myDate.getFullYear();
        var decadeYear = currentYearTitle - 9;
        var Section = currentYearTitle - decadeYear;
        for (var i = 0; i <= Section; i++) {
          myDate = {id: currentYearId--, title: currentYearTitle--};
          this.arrDate.push(myDate);
        }
        this.dateList = this.arrDate;
      },
      // 获取主检科室数据
      acquireSearchDep() {
        this.$api.taskmanage.apiSearchDep().then(res => {
          res ? this.deptidList = res.data.data.list : '';
          if (this.deptidList.length > 0) {
            this.formInline.deptid = this.deptidList[0].id;
          }
        })
      },
      // 获取列表数据
      getDataList() {
        this.onClickInquire(this.formInline, 1, 10)
      },
      // 分页器-设置每条的页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.onClickInquire(this.formInline, this.currentPage, this.pageSize)
      },
      // 分页器-当前页发生改变时
      handleCurrentChange(val) {
        this.currentPage = val;
        this.onClickInquire(this.formInline, this.currentPage, this.pageSize)
      },
      // 点击查询
      onClickInquire(formInline, currentPage, pageSize) {
        this.loading = true;
        this.currentPage = currentPage, // 当前页
        this.pageSize = pageSize; // 每页的条数
        formInline.currentPage = this.currentPage;
        formInline.pageSize = this.pageSize;
        this.$api.taskmanage.apiSearchTaskInfo(formInline).then(res => {
          res ? this.tablelist = res.data.data.list : '';
          res ? this.total = res.data.data.total : 0;
          this.task_status = formInline.task_status;
          this.loading = false;
        }).catch((error) => {
          this.$message({type: 'error', message: error.data.message, duration: 1500});
          this.loading = false;
        })
      },
      // 输入框回车事件
      searchEnterFun(e) {
        var keyCode = window.event ? e.keyCode : e.which;
        if (keyCode == 13) {
          this.onClickInquire(this.formInline, 1, 10)
        }
      },
      // 点击收起/展开
      clickshowbut(num) {
        this.show = !this.show;
        this.showbut = num;
      },
      oncopyMessage(row) {
        this.$emit('copyMessage', row)
      },
    }
  }
</script>
<style lang="less" scoped>
  .taskmanage {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 10px;
    background: #eee;
  }

  .warp {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .el-col {
      border-radius: 2px;
      padding: 11px;
      box-sizing: border-box;

      img {
        width: 337px;
      }
    }
  }

  .form-search {
    width: 100%;
    background: #fff;
    padding: 20px 20px 0 20px;

    .query-input{
      display: flex;
      justify-content: space-between;
    }
    .query-input-show{
      display: flex;
      justify-content: space-between;
    }
  }

  .demo-form-inline{
    flex: 1;
  }

  .demo-form-inline-but {
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    /*margin-top: 20px;*/
    padding: 20px 0;
    .el-button--primary{
      padding: 0 20px;
      height: 30px;
    }
  }

  .form-search .el-form-item--mini.el-form-item, .form-search .el-form-item--small.el-form-item {
    margin: 0;
  }

  .table-pagingdevice {
    flex: 1;
    background: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .table-box {
    flex: 1;
    margin-bottom: 10px;
    overflow-y: auto;
  }

  .el-button--default {
    height: 30px;
    background: #fff;
    border-radius: 2px;
    padding: 0 10px;
    margin: 0;
  }

  .el-button--primary {
    height: 30px;
    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
    border-radius: 2px;
    padding: 0 10px;
    margin: 0;
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

  /deep/ .demo-form-inline .el-form-item__content {
    width: 60% !important;
  }

  /deep/ .demo-form-inline .el-form-item__content .el-date-editor, .demo-form-inline .el-form-item__content .el-input__inner, .demo-form-inline .el-form-item__content .el-select {
    width: 100% !important;
  }

  .form-search .el-form--inline .el-form-item {
    margin: 0;
  }
</style>
