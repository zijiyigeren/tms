<template>
  <!-- 分配检测 -->
  <section class="class_tablePage">

    <div class="flexTable" ref="flexTable">
      <!-- 我的报告表格-->
      <wodeBG v-if="myTableType == 0" :myLoading="loadings"
              :querydata="querydata" :myStyle="true"
              :myTableData_0="tableData" :myComing="true">
      </wodeBG>
      <!-- 任务分配表格 -->
      <fenpeJC v-if="myTableType == 11" :myLoading="loadings" :myTotal="total"
               :querydata="querydata"
               :myTableData_2="tableData" :myComing="0"
      >
      </fenpeJC>
      <!-- 报告编辑表格 -->
      <jianceBG v-if="myTableType == 3" v-loading="loadings"
                :querydataChild="tableData" :queryTypeChild="myqueryType"
                :mypagesize="pageSize" @cpage="getCpage" @displayed="getDist" :myStyle="true"
      ></jianceBG>
      <!-- 报告校验表格 -->
      <jiaoyanBG v-if="myTableType == 4" v-loading="loadings"
                 :querydataChild="tableData" :queryTypeChild="myqueryType"
                 :mypagesize="pageSize" @cpage="getCpage" @displayed="getDist" :myStyle="true"
      ></jiaoyanBG>
      <!-- 报告审核表格 -->
      <shenheBG v-if="myTableType == 5" v-loading="loadings"
                :querydataChild="tableData" :queryTypeChild="myqueryType"
                :mypagesize="pageSize" @cpage="getCpage" @displayed="getDist" :myStyle="true"
      ></shenheBG>
      <!-- 报告批准表格 -->
      <pizhunBG v-if="myTableType == 6" v-loading="loadings"
                :querydataChild="tableData" :queryTypeChild="myqueryType"
                :mypagesize="pageSize" @cpage="getCpage" @displayed="getDist" :myStyle="true"
      ></pizhunBG>
      <!-- ************* 天摩托 *************** -->
      <!-- 二次分配表格 -->
      <ercifenpeiBG v-if="myTableType == 2"
                    :myComing="0"
                    :myLoading="loadings"
                    :querydata="querydata"
                    :myTableData_2="tableData"
      ></ercifenpeiBG>
      <!-- 再次分配表格 -->
      <zaicifenpeiBG v-if="myTableType == 12"
                     :myComing="0"
                     :myLoading="loadings"
                     :querydata="querydata"
                     :myTableData_2="tableData"
      ></zaicifenpeiBG>
      <!-- 原始记录上传表格 -->
      <ysjlshangchuanBG v-if="myTableType == 13"
                        :myComing="0"
                        :myLoading="loadings"
                        :querydata="querydata"
                        :myTableData_2="tableData"
      ></ysjlshangchuanBG>
      <!-- 原始记录审核表格 -->
      <ysjlshenheBG v-if="myTableType == 14"
                    :myComing="0"
                    :myLoading="loadings"
                    :querydata="querydata"
                    :myTableData_2="tableData"
      ></ysjlshenheBG>
    </div>

    <!-- 权限匹配分页器 -->
    <div v-if="myTableType != 3 && myTableType != 4 && myTableType != 5 && myTableType != 6"
         class="lxt_block"
    >
      <el-pagination style="text-align: left;"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[5,7,11]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

    <!-- 弹出 -->
    <el-dialog title="查看"
               :visible.sync="dialogFormVisible"
               v-if="dialogFormVisible"
               :modal="false"
               style="overflow-y:hidden; top:-7vh">
      <el-form :model="form">
        <!-- 任务下达模块引入 -->
        <entrustlist></entrustlist>
      </el-form>
    </el-dialog>

  </section>
</template>
<script>
  // 我的报告表格
  import wodeBG from '@/views/report/Report.vue'
  // 任务分配表格
  import fenpeJC from '@/views/taskinspection/componentstask/allocation.vue'
  // 报告编辑表格
  import jianceBG from '@/views/survey/componentsview/Surveyredact/survetable.vue'
  // 报告校验表格
  import jiaoyanBG from '@/views/survey/componentsview/parity/verify.vue'
  // 报告审核表格
  import shenheBG from '@/views/survey/componentsview/Surveyverify/verify.vue'
  // 报告批准表格
  import pizhunBG from '@/views/survey/componentsview/Surveyratify/approval.vue'

  // 任务下达模块引入
  import entrustlist from '@/views/taskdelegation/componentstask/acceptance.vue'

  /* *************************************** */
  // 二次分配表格
  import ercifenpeiBG from '@/views/taskinspection/componentstask/distribution.vue'
  // 再次分配表格
  import zaicifenpeiBG from '@/views/taskinspection/componentstask/redistribution.vue'
  // 原始记录上传表格
  import ysjlshangchuanBG from '@/views/taskinspection/componentstask/originalrecord.vue'
  // 原始记录审核表格
  import ysjlshenheBG from '@/views/taskinspection/componentstask/revieworiginal.vue'

  export default {
    name: 'tablepage',
    components: {
      fenpeJC,// 分配检测 / 任务分配表格
      wodeBG,// 我的报告表格
      jianceBG,// 检测报告表格
      jiaoyanBG,// 校验报告表格
      shenheBG,// 审核报告表格
      pizhunBG,// 批准报告表格
      entrustlist,
      /* ******* 天摩托 ******** */
      ercifenpeiBG,// 二次分配表格
      zaicifenpeiBG,// 再次分配表格
      ysjlshangchuanBG,// 再次分配表格
      ysjlshenheBG,// 再次分配表格
    },
    data () {
      return {
        tableData: [],
        tableData2: [],
        tableData3: [],
        multipleSelection: [], // 全选
        currentPage: 1, // 当前页数  分页
        pageSize: 5, // 每页显示条数 分页
        total: 0,// 数据总量

        dialogFormVisible: false, // 弹出层的配置
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
        loadings: false,

        myTableType: '',
        searchInput: '',
        selectDateValue: '',

      }
    },
    computed: {
      // 为了能跳过此模块里封装的条件查询功能
      myqueryType () {
        return {
          'companyCheck': '',
          'process_instance_id': this.myTableType,
          'sampleName': '',
          'sampleType': '',
          'searchdate': '',
          'searchdate2': '',
          'taskCode': '',
          'wttype': ''
        }
      },
      /*
      * 功能: 我的报告 组件内部一些操作,需要重新请求接口时,需要的参数
      * */
      wode_querydata () {
        return
      },

      /*
      * 功能: 分配检测表格 组件内部 回退操作时 重新回调数据请求需要的数据
      * */
      querydata () {
        return {
          process_instance_id: this.myTableType,
          usualCondition: this.searchInput,
          searchdate: this.selectDateValue,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
      },
    },
    methods: {
      // 检测报告表格 _ 得到当前页码
      getCpage (data) {
        this.currentPage = data
      },
      // 检测报告表格 _ 得到分页长度
      getDist (data) {
        this.pageSize = data
      },
      /*
      * 功能: 检测报告表格 _ 重新查询
      * */
      queryselect () {
        this.loadings = true
        this.$api.systemPublicationpage.findTaskList({
          process_instance_id: this.myTableType,
          usualCondition: this.searchInput,
          searchdate: this.selectDateValue,
          companyCheck: '',// 受检单位必填,但是此tablepage模块不需要传
          // 真分页
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }).then(res => {
          // console.log(res);
          if (res.data.ok && res.data.data && res.data.data.length != 0) {
            this.tableData = res.data.data
            this.total = res.data.data[0].total
          }
          this.loadings = false
        }).catch(err => {
          console.log(err)
          this.loadings = false
          this.$message({type: 'error', message: err.data.message, duration: 1500})
        })
      },

      /*
      * 功能: 我的报告 _ 重新查询
      * */
      viewMyReportList () {
        this.loadings = true
        this.$api.systemPublicationpage.viewMyReportList({
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          usualCondition: this.searchInput,
          searchdate: this.selectDateValue,
          zjsign: '0'
        }).then(res => {
          if (res.data.ok && res.data.data && res.data.data.length != 0) {
            this.tableData = res.data.data
          } else {
            this.$message.warning({message: '未查询到相关数据', duration: 1500})
          }
          this.loadings = false
        }).catch(err => {
          console.log(err)
          this.loadings = false
          this.$message.warning({message: err.data.message, duration: 1500})
        })
      },

      handleSizeChange (val) {
        // 每页展示的条数
        this.pageSize = val
        // console.log(`每页 ${val} 条`);
        if (this.myTableType == 0) {
          this.viewMyReportList()
        } else if (
          this.myTableType == 2 ||
          this.myTableType == 11 ||
          this.myTableType == 12 ||
          this.myTableType == 13 ||
          this.myTableType == 14
        ) {
          this.queryselect()
        }
      },
      handleCurrentChange (val) {
        // 当前展示的第几页
        this.currentPage = val
        // console.log(`当前页: ${val}`);
        if (this.myTableType == 0) {
          this.viewMyReportList()
        } else if (
          this.myTableType == 2 ||
          this.myTableType == 11 ||
          this.myTableType == 12 ||
          this.myTableType == 13 ||
          this.myTableType == 14
        ) {
          this.queryselect()
        }
      },

      /*
      * 功能: 获取父穿过来的 类目和时间
      * */
      initLop () {
        this.tableData = this.arrsearch
        this.loadings = this.isLoading
        this.myTableType = this.isTableType
        this.currentPage = this.myCurrentPage
        this.pageSize = this.myPageSize
        this.total = this.myTotal

        this.selectDateValue = this.mySelectDate
        this.searchInput = this.mySearchInput
      },

    },
    created () {
    },
    mounted () {
      this.initLop()
    },
    props: [
      'arrsearch',
      'isLoading',
      'isTableType',
      'myCurrentPage',
      'myPageSize',
      'myTotal',
      'mySelectDate',
      'mySearchInput'
    ],
    watch: {
      arrsearch (val) {
        this.tableData = val
        // console.log(this.tableData, '自定义属性数据表');
      },
      isLoading (val) {
        this.loadings = val
      },
      isTableType (val) {
        this.myTableType = val
      },
      myCurrentPage (val) {
        this.currentPage = val
      },
      myPageSize (val) {
        this.pageSize = val
      },
      mySelectDate (val) {
        this.selectDateValue = val
      },
      mySearchInput (val) {
        this.searchInput = val
      },
      myTotal (val) {
        this.total = val
      },
    }
  }
</script>
<style scoped>

  .flexTable {
    width: 100%;
    min-height: 500px;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-table__expanded-cell[class*=cell] {
    padding: 1vw;
  }

  .el-table .hidden-columns {
    width: 100%;
  }

  .el-dialog {
    width: 100%;
  }

  .el-form {
    height: 500px;
  }

  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden
  }

  .el-table .warning-row {
    background: #FAFAFA
  }
</style>
<style lang="less">
  .class_tablePage {
    .el-pagination {
      .el-pagination__total {
        margin-left: 10px;
      }
    }
  }
</style>
