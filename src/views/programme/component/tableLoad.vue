<template>
  <!-- 绑定页面 -->
  <div class="tableload_box">
    <!-- 查询 -->
      <div class="query">
        <div class="query_search">
          <el-form :inline="true" ref="formQuery" :model="formQuery" label-width="90px" style="flex:1;">
            <div class="query_Search_input">
              <el-form-item label="企业名称：" style="margin-bottom: 0;">
                <el-input v-model.trim="formQuery.entName" clearable @keyup.enter.native="enterQuery" name="clearInputValue"></el-input>
              </el-form-item>
              <el-form-item label="产品型号：" style="margin-bottom: 0;">
                <el-input v-model.trim="formQuery.model" clearable @keyup.enter.native="enterQuery" name="clearInputValue"></el-input>
              </el-form-item>
              <el-form-item label="产品名称：" style="margin-bottom: 0;">
                <el-input v-model.trim="formQuery.name" clearable @keyup.enter.native="enterQuery" name="clearInputValue"></el-input>
              </el-form-item>
              <el-form-item label="产品商标：" style="margin-bottom: 0;">
                <el-input v-model.trim="formQuery.brand" clearable @keyup.enter.native="enterQuery" name="clearInputValue"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>

        <!-- 查询按钮 -->
        <div class="query_search_btn">
          <el-button type="primary" @click="onClickQuery(1,10)">查询</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table_box">
        <div class="table_content">
          <el-table
            ref="table"
            border
            stripe
            v-loading="loading"
            :data="tablelist"
            :header-cell-style="{
                'background-color': 'rgba(243,246,253,1)',
                'color': '#606266',
                'padding': '10px 0'
            }"
            class="table_datalist">
            <el-table-column prop="taskCode" label="任务号" align="center" :resizable="false"></el-table-column>
            <el-table-column prop="entName" label="企业名称" align="center" :show-overflow-tooltip="true" :resizable="false"></el-table-column>
            <el-table-column label="产品型号" align="center" :show-overflow-tooltip="true" :resizable="false">
                <template slot-scope="scope"> 
                    <span v-if="scope.row.gzd==3">{{scope.row.proType}}</span>
                    <span>{{scope.row.model}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="产品名称" align="center" :show-overflow-tooltip="true" :resizable="false"></el-table-column>
            <el-table-column prop="brand" label="产品商标" align="center" :resizable="false"></el-table-column>
            <el-table-column label="产品类别" align="center" :resizable="false">
                <template slot-scope="scope"> 
                    <span v-if="scope.row.proType == 'new'">新产品</span>
                    <p v-else>
                        <span v-if="scope.row.zgsign == 1">整车整改</span>
                        <span v-else>扩展</span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" :resizable="false">
              <template slot-scope="scope">
                <el-button type="text" class="operation_btn" @click="onClickBinding(scope.row)">绑定</el-button>
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
</template>

<script>
export default {
    props: ['tableloadData'],
    components: {},
    watch: { 
      tableloadData(val) {
        this.formQuery = val;
        this.onClickQuery();
      }
    },
    data() {
        return {
            currentPage: 1, // 当前页
            pageSize: 10, // 每页的条数
            total: 0, // 总条数
            loading: false, // 加载状态
            tablelist: [], // 一级table数据
            formQuery: { // 查询表单数据
                entName: this.tableloadData.entName ? this.tableloadData.entName : '', // 企业名称
                model: this.tableloadData.model ? this.tableloadData.model : '',  // 产品型号
                name: this.tableloadData.name ? this.tableloadData.name : '', // 产品名称
                brand: this.tableloadData.brand ? this.tableloadData.brand : '', // 产品商标
                taskid: this.tableloadData.taskid ? this.tableloadData.taskid : '',
            },
        }
    },
    created() {
      this.onClickQuery();
    },
    mounted() {
      
    },
    methods: {
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
          this.loading = true;
          this.formQuery.currentPage = currentPage;
          this.formQuery.pageSize = pageSize;
          this.$api.download.apiBindzjSearch(this.formQuery).then(res => {
            let data = res.data.data;
            if(data.list){
                this.tablelist = data.list;
                this.loading = false;
                if(data.total > 0){
                  this.total = data.total;
                  this.currentPage = currentPage;
                  this.pageSize = pageSize;
                }else{
                  this.total = 0;
                  this.currentPage = 1;
                  this.pageSize = 10;
                }
            }
          }).catch((error) => {
            this.$message({type: 'error', message: error.data.message, duration: 1500});
            this.loading = false;
            this.total = 0;
            this.currentPage = 1;
            this.pageSize = 10;
          })
        },
        // 回车查询
        enterQuery(e) {
          var keyCode = window.event ? e.keyCode : e.which;
          if (keyCode == 13) {
              this.onClickQuery(1, 10);
          }
        },
        // 点击绑定
        onClickBinding(row) {
          let params  = {
            id: row.id,
            taskid: this.formQuery.taskid
          };
          this.$api.download.apiBindzj(params).then(res => {
            this.$message({ type: 'success', message: res.data.data, duration: 1500 });
            this.$emit('closeBindingVisible', row, this.formQuery.taskid);
          }).catch(error => {
            this.$message({type: 'error', message: error.data.message, duration: 1500});
            let data = error.data.data.list;
            this.tablelist = data;
            this.formQuery = { // 查询表单数据
                entName: data[0].entName, // 企业名称
                model: data[0].model,  // 产品型号
                name: data[0].name, // 产品名称
                brand: data[0].brand, // 产品商标
                taskid: data[0].taskid, 
            };
          })
        },
    },
}
</script>

<style lang="scss" scoped>
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

.tableload_box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.query {
    margin-bottom: 20px;
}
.table_box {
    flex: 1;
    overflow: hidden;
}
.pagingdevice {
    margin-top: 20px;
}
.table_content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
.query_Search_input {
    display: flex;
}
.query_Search_input .el-form-item {
    flex: 1;
    margin: 0;
    display: flex;
}
.query_Search_input .el-form-item:not(:first-child){
    margin-left: 20px;
}
/deep/ .query_Search_input .el-form-item  .el-form-item__label {
    white-space:nowrap !important;
}
.query_search_btn {
    margin-top: 20px;
    text-align: right;
}
</style>
