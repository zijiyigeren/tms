<template>
  <div class="box_border">
    <div class="box_content">

      <!--查询 -->
      <Query
        ref="Query"
        @Query="onQuery"
        :queryForm="queryForm"
        :multipleSelection="multipleSelection"
      />

      <!-- 表格 -->
      <div class="table_and_pagination" v-loading="loading">
        <el-table
          ref="table"
          border
          stripe
          :data="tablelist"
          v-bind="{
            'header-cell-class-name': 'm-tableHeaderClass',
            height:'calc(100% - 10px)',
          }"
          @selection-change="onTableSelectionChange">
          <el-table-column align="center" width="50" label="" :resizable="false" v-if="showRadio" fixed="left">
            <template slot-scope="scope">   
              <el-radio v-model="currentRadio" :label="scope.row"><i></i></el-radio>
            </template>
          </el-table-column>
          <el-table-column align="center" :resizable="false" type="selection" fixed="left" v-else/>
          <el-table-column width="150" align="center" :resizable="false" prop="entName" label="企业名称"/>
          <el-table-column width="150" align="center" :resizable="false" prop="entId" label="企业ID"/>
          <el-table-column width="" align="center" :resizable="false" prop="entLevel" label="企业等级"/>
          <el-table-column width="120" align="center" :resizable="false" prop="entIsfocus" label="是否为重点企业"
                           :formatter="formatter_entIsfocus"/>
          <el-table-column width="" align="center" :resizable="false" prop="entContact" label="联系人"/>
          <el-table-column width="150" align="center" :resizable="false" prop="entPhone" label="电话"/>
          <el-table-column width="" align="center" :resizable="false" prop="entArea" label="区域"
                           :formatter="formatter_entArea"/>
          <el-table-column width="" align="center" :resizable="false" prop="entPlanner" label="计划员"/>
          <!-- 计划员: 与这个企业的对接人 -->
          <el-table-column width="" align="center" :resizable="false" prop="entCatalog" label="企业目录"/>
          <el-table-column width="200" align="center" :resizable="false" prop="entAddress" label="地址"/>
          <el-table-column width="170" align="center" :resizable="false" prop="entEmail" label="邮箱"/>
          <el-table-column width="150" align="center" :resizable="false" prop="entFax" label="传真"/>
          <el-table-column width="180" align="center" :resizable="false" prop="entBranch" label="分支机构"/>
          <el-table-column width="110" align="center" :resizable="false" label="操作" fixed="right" v-if="!showRadio">
            <template slot-scope="scope">
              <el-button
                style="color:#32AFF0;marginRight:6px;"
                type="text"
                @click="onEdit(scope.row)"
              >编辑
              </el-button>
              <el-button
                style="color:red;"
                type="text"
                @click="onDelete(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页器 -->
      <el-pagination
        @size-change="onPageSize"
        @current-change="onCurrent"
        :current-page="current"
        :page-sizes="[10,20,30]"
        :page-size="pageSize"
        layout=" total, sizes,->, prev, pager, next, jumper"
        :total="total"
      />

    </div>

    <!-- 编辑 -->
    <Addoredit
      :dialogTitle="dialogTitle"
      :dialogVisible="dialogVisible"
      :dialogRecord="dialogRecord"
      @dialogCancel="onDialogCancel"
    />

    <slot :currentRadio="currentRadio"></slot>
  </div>
</template>
<script>
  import base from '@/api/base.js'
  import Query from './components/query.vue'
  import Addoredit from './components/addoredit.vue'

  export default {
    name: 'enterprise',
    props: {
      showRadio: { // 0 或 1
        type: Number,
        default: 0,
      }
    },
    watch: {
      showRadio: {
        immediate: true,
        handler (val) {
          if (val == 1) {
            this.$nextTick(() => {
              this.$refs['Query'].showButton = false
            })
          }
        }
      }
    },
    components: {Query, Addoredit},
    data () {
      return {
        currentRadio: {},
        current: 1, // 页数
        pageSize: 10, // 条数
        total: 0, // 总数
        loading: false,
        tablelist: [], // 表格绑定数据
        multipleSelection: [], // 表格选中数据
        dialogTitle: '', // 对话框标题
        dialogVisible: false, // 对话框-展示状态
        dialogRecord: {}, // 对话框-数据
        queryForm: {
          entName: '',
          entId: '',
          entLevel: '',
          entIsfocus: '',
          entPhone: '',
          entArea: '',
          entPlanner: '',
          entCatalog: '',
          entAddress: '',
          entEmail: '',
          entFax: '',
          entBranch: '',
        }, // 查询表单
        url: {
          list: base.baseUrl + '/enterprise/enterprise/list',
          delete: base.baseUrl + '/enterprise/enterprise/delete'
        },
        /***************** 完善代码生成的文件业务逻辑的变量: *******************/

      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
      // 页数
      onCurrent (val) {
        this.current = val
        this.onQuery(this.current, this.pageSize, true);
      },
      // 条数
      onPageSize (val) {
        this.pageSize = val
        this.onQuery(this.current, this.pageSize, true);
      },
      // 表格选中时
      onTableSelectionChange (val) {
        this.multipleSelection = val
      },
      // 查询
      onQuery (current, pageSize, flag) {
        this.loading = true;
        let params = {};
        if(flag) {
          for (let i in this.queryForm) {
            if (i && this.queryForm[i]) {
              if (Array.isArray(this.queryForm[i])) {
                params[i + '_begin'] = '*' + this.queryForm[i][0]+'*'
                params[i + '_end'] = '*' + this.queryForm[i][1]+'*'
              } else {
                params[i] = '*' + this.queryForm[i]+'*'
              }
            }
          }
        } else {
          this.queryForm = {
            entName: '',
            entId: '',
            entLevel: '',
            entIsfocus: '',
            entPhone: '',
            entArea: '',
            entPlanner: '',
            entCatalog: '',
            entAddress: '',
            entEmail: '',
            entFax: '',
            entBranch: '',
          }
        }
        params.pageNo = current
        params.pageSize = pageSize
        // console.log(params, '查询条件')
        this.$api.tempaxios.getList(this.url.list, params)
          .then(res => {
            // console.log(res, '查询成功res')
            this.loading = false
            if (res.data.result.total > 0) {
              this.current = res.data.result.current
              this.pageSize = res.data.result.size
              this.total = res.data.result.total
            } else {
              this.current = 1
              this.pageSize = 10
              this.total = 0
            }
            this.currentRadio = {}// 若不重置,则在选中数据后再次查询,查询出的数据无法再被选中
            this.tablelist = res.data.result.records
          })
          .catch((error) => {
            // console.log(error, '查询失败error')
            this.loading = true
            this.current = 1
            this.pageSize = 10
            this.total = 0
          })
      },
      // 删除
      onDelete (record) {
        // console.log(record, '删除record');
        let params = {
          id: record.id,
          foreignKeys: record.sysOrgCode
        }
        this.$confirm('确认要删除吗？', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.$api.tempaxios.getDelete(this.url.delete, params).then(res => {
            // console.log(res, '删除成功res');
            this.$message.success(res.data.message);
            this.onQuery(this.current, this.pageSize, true);
          }).catch((error) => {
            // console.log(error, '删除失败error');
            this.$message.error(error.data.message);
            this.onQuery(this.current, this.pageSize, true);
          });
        }).catch(error => {
          this.$message.info('已取消删除');
        });
      },
      // 编辑
      onEdit (record) {
        console.log(record, '编辑')
        this.dialogTitle = '编辑'
        this.dialogVisible = true
        this.dialogRecord = record
        this.$refs['Addoredit'].$refs['dialogform'].clearValidate()
      },
      // 对话框_遮罩层/右上角叉/取消按钮
      onDialogCancel () {
        this.dialogTitle = ''
        this.dialogVisible = false
        this.dialogRecord = {}
        this.onQuery(this.current, this.pageSize, true)
      },
      /***************** 完善代码生成的文件业务逻辑的方法: *******************/

      //
      formatter_entIsfocus (row, column, cellValue, index) {
        if (cellValue == 0) {
          return '否'
        } else if (cellValue == 1) {
          return '是'
        } else {
          return ''
        }
      },
      //
      formatter_entArea (row, column, cellValue, index) {
        let list = this.$store.state['LIST_entArea']
        let str = ''
        for (let i = 0; i < list.length; i++) {
          if (list[i]['dicTypeCode'] == cellValue) {
            str = list[i]['dicTypeName']
            break
          }
        }
        return str
      },
    }
  }
</script>
<style lang="less" scoped>
  * {
    box-sizing: border-box;
  }

  .box_border {
    margin: 0;
    padding: 10px;
    width: 100%;
    height: 100%;
    background: #eee;
    overflow: hidden;

  }

  /deep/ .box_content {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 20px 20px 10px 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /deep/ .table_and_pagination {
    flex: 1;
    overflow: hidden;

    .m-tableHeaderClass {
      background: rgb(243, 246, 253);
      color: #606266;
      /*padding: 10px 0;*/
    }
  }

  /deep/ .el-dialog__wrapper {
    padding: 10% 0;
    overflow: hidden;

    .el-dialog {
      height: 100%;
      overflow: hidden;
      margin: 0 auto !important;
      padding: 0 !important;
      display: flex;
      flex-direction: column;

      .el-dialog__body {
        flex: 1 !important;
        padding: 20px;
        overflow-y: auto;
      }
    }
  }
</style>
