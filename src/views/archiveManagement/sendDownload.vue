<template>
  <!-- 发送下载 -->
  <div class="senddownload">
    <div class="senddownload_con">
      <!-- 查询 -->
      <div class="query_modular">
        <el-form
          class="query_form"
          v-bind="{
                        model: mmt,
                        labelSuffix: ' :',
                        size: 'mini',
                        labelWidth:'110px'
                    }"
          ref="form"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="任务号">
                <el-input clearable name="clearInputValue"
                          @keyup.enter.native="onPressEnter"
                          placeholder="请输入任务号"
                          v-model.trim="mmt.taskCode"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="受检单位">
                <el-input clearable name="clearInputValue"
                          @keyup.enter.native="onPressEnter"
                          placeholder="请输入受检单位"
                          v-model.trim="mmt.companyCheck"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <div style="text-align: right;">
                  <el-button type="primary"
                             @click="()=>{
                                                    currentPage = 1
                                                    // pageSize = 15
                                                    onQuery(1,15)
                                               }"
                  >查询
                  </el-button>
                  <el-button type="info"
                             @click="onReset"
                  >重置
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="tablePagination_modular">
        <div class="table_modular">
          <el-table ref="table"
                    border stripe
                    v-loading="loading1"
                    :data="tableData"
                    height="calc(100% - 1px)"
                    :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}"
                    @selection-change="onTableSelectionChange"
          >
            <!--<el-table-column align="center" :resizable="false" type="selection"></el-table-column>-->
            <el-table-column
              v-bind="{
                                property:'senddate',
                                label:'生成日期',
                                align:'center',
                                resizable:false,
                                width:'100',
                            }"
            />
            <el-table-column
              v-bind="{
                                property:'commiterId',
                                label:'生成人',
                                align:'center',
                                resizable:false,
                                width:'110',
                            }"
            />
            <el-table-column
              v-bind="{
                                property:'companyCheck',
                                label:'受检单位',
                                align:'center',
                                resizable:false,
                                width:'',
                            }"
            />
            <el-table-column
              v-bind="{
                                property: '',
                                label:'任务号',
                                align:'center',
                                resizable:false,
                                width:'',
                            }"
            />
            <el-table-column
              v-bind="{
                                property: '',
                                label:'状态',
                                align:'center',
                                resizable:false,
                                width:'80',
                            }"
            >
              <template slot-scope="{ row }">
                <span v-if="row.flag == 0">未生成</span>
                <span style="color: red;" v-else-if="row.flag == 2">生成失败</span>
                <span style="color: blue;" v-else>已生成</span>
              </template>
            </el-table-column>
            <el-table-column
              v-bind="{
                                property: 'bz',
                                label:'备注',
                                align:'center',
                                resizable:false,
                                width:'',
                            }"
            />
            <el-table-column
              v-bind="{
                                property: 'bz',
                                label:'操作',
                                align:'center',
                                resizable:false,
                                width:'200',
                            }"
            >
              <template slot-scope="{ row }">
                <el-button type="text"
                           @click="mailListHistory(row)">详细
                </el-button>
                <el-button type="text" @click="goDownload(row.senddate,row.attarch)">下载</el-button>
                <el-popconfirm
                  v-bind="{
                      title: '确认删除吗?',
                      hideIcon: true,
                      confirmButtonType: 'danger',
                  }"
                  @onConfirm="onDelete(row)"
                >
                  <el-button
                    type="text"
                    slot="reference"
                    style="color:red;margin-left: 10px;">删除
                  </el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        class="pagination_modular"
        v-bind="{
                    total,
                    currentPage,
                    pageSize,
                    // pageSizes: [10,20,30],
                }"
        layout="total, ->, prev, pager, next, jumper"
        @current-change="(val)=>{
                    currentPage = val
                    onQuery(currentPage,pageSize)
                }"
        @size-change="(val)=>{
                    pageSize = val
                    onQuery(currentPage,pageSize)
                }"
      />
    </div>

    <!-- 详细 -- 报告发送历史 -->
    <el-dialog
      :visible.sync="show"
      v-bind="{
                title:'报告发送历史',
                width:'1200px',
                closeOnClickModal:false,
                closeOnPressEscape:false,
            }"
      @close="close_show"
    >
      <div style="height: 500px;" class="c_el-table">
        <el-pagination
          v-bind="{
                        total: total_2,
                        currentPage: currentPage2,
                        pageSize: pageSize2,
                        // pageSizes: [10,20,30],
                    }"
          layout="total, ->, prev, pager, next, jumper"
          @current-change="(val)=>{
                        currentPage2 = val
                    }"
          @size-change="(val)=>{
                        pageSize2 = val
                    }"
        />
        <el-table
          border stripe
          :data="tableList.slice((currentPage2-1)*pageSize2,currentPage2*pageSize2)"
          height="460"
          :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}"
          v-bind="{}"
        >
          <el-table-column
            v-bind="{
                            property: 'taskCode',
                            label: '任务号',
                            align: 'center',
                            resizable: false,
                            minWidth: '120'
                        }"
          />
          <el-table-column
            v-bind="{
                            property: 'itemsCode',
                            label: '报告号',
                            align: 'center',
                            resizable: false,
                            minWidth: '120'
                        }"
          />
          <el-table-column
            v-bind="{
                            property: 'senddate',
                            label: '发送日期',
                            align: 'center',
                            resizable: false,
                            minWidth: '120'
                        }"
          />
          <el-table-column
            v-bind="{
                            property: 'commiterId',
                            label: '发送人',
                            align: 'center',
                            resizable: false,
                            width: '90'
                        }"
          />
          <el-table-column
            v-bind="{
                            property: 'bz',
                            label: '备注',
                            align: 'center',
                            resizable: false,
                            minWidth: '180'
                        }"
          />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import base from '@/api/base.js'

  const mmt = {
    taskCode: '',
    companyCheck: '',
  }
  export default {
    name: 'senddownload',
    components: {},
    props: [],
    watch: {},
    data () {
      return {
        mmt: JSON.parse(JSON.stringify(mmt)),
        /**/
        loading: false, // 加载状态
        /**/
        total: 0, // 总数
        currentPage: 1, // 页数
        pageSize: 15, // 条数
        /**/
        loading1: false, // 加载状态
        tableData: [], // 表格数据
        multipleSelection: [], // 表格选中数据
        /**/
        show: false,
        tableList: [],
        total_2: 0,
        currentPage2: 1,
        pageSize2: 15,
      }
    },
    created () {
    },
    mounted () {
      this.onQuery(this.currentPage, this.pageSize)
    },
    methods: {
      // 表格选中时
      onTableSelectionChange (val) {
        this.multipleSelection = val
      },
      // 页数
      currentChange (val) {
        this.currentPage = val
        this.onQuery(this.currentPage, this.pageSize)
      },
      // 条数
      /*pageSizeChange (val) {
          this.pageSize = val
          this.onQuery(this.current, this.pageSize)
      },*/

      // 查询
      onQuery (current, pageSize) {
        this.loading1 = true
        let params = {
          currentPage: current,
          pageSize
        }
        this.$api.sendDownload.mailDownlist(params)
          .then(res => {
            let temp = res.data.data
            this.tableData = temp.slice(0)
            this.total = temp[0].total
          })
          .catch()
          .then(() => {
            this.loading1 = false
          })
      },
      // 回车查询
      onPressEnter (e) {
        var keyCode = window.event ? e.keyCode : e.which
        if (keyCode == 13) {
          this.onQuery(1, 10)
        }
      },
      // 重置
      onReset () {
        this.$refs['form'].resetFields()
        this.$nextTick(() => {
          this.currentPage = 1
          this.onQuery(1, 15)
        })
      },
      // 删除
      onDelete (row) {
        let param = {
          id: row.id,
        }
        this.$api.sendDownload.mailDelete(param)
          .then(res => {
            let temp = res.data.data,
              message = res.data.message
            this.$message.info({
              message,
              duration: 3000,
            })
            this.onQuery(this.currentPage, this.pageSize)
          })
          .catch()
      },
      // 详情
      mailListHistory (data) {
        let param = {
          id: data.id,
        }
        this.$api.sendDownload.mailListHistory(param)
          .then((res) => {
            let temp = res.data.data
            this.tableList = temp.slice(0)
            this.total_2 = temp.length
            this.show = true
          })
          .catch()
      },
      close_show () {
        this.tableList = []
        this.total_2 = 0
        this.currentPage2 = 1
        this.pageSize2 = 15
        //
        this.onQuery(this.currentPage, this.pageSize)
      },
      // 下载
      goDownload (data1, data2) {
        let param1 = new Date(data1.replace(/-/g,"/")).getFullYear()
        let param2 = new Date(data1.replace(/-/g,"/")).getMonth() + 1;
        if(param2<10){
          param2='0'+param2.toString();
        }
        console.log(param1)
        console.log(param2)
        window.open(`${base.baseUrl}/file/sendmail/${param1 + '' + param2}/${data2}.zip`)
      },
      
    },
  }
</script>
<style lang="less" scoped>
  @import './style/sendDownload';

  /*.el-button--default {*/
  /*    padding: 0 20px;*/
  /*    margin: 0;*/
  /*    height: 30px;*/
  /*    background: #fff;*/
  /*    border-radius: 4px;*/
  /*}*/

  /*.el-button--primary {*/
  /*    padding: 0 20px;*/
  /*    margin: 0;*/
  /*    height: 30px;*/
  /*    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));*/
  /*    border-radius: 4px;*/
  /*}*/

  /*.el-button--text {*/
  /*    color: #32AFF0;*/
  /*}*/

  // 打印封面
  /*.print_cover {
      .printCover_btn {
          display: block;
          width: 200px;
          height: 30px;
          margin: 0 auto;
      }
  }*/

  // 表单
  /*/deep/ .query_form {
    margin: 0;
    padding: 0;
    display: flex;

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

        .el-select, .el-input {
          width: 100% !important;
        }
      }
    }
  }*/

</style>
