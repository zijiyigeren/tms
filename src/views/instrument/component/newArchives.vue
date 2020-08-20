<template>
  <!-- 设备列表 -->
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
          <el-button type="primary" @click="onClickQuery(1,10)">查询</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table_box">
        <div v-loading="loading" class="table_content">
          <ul class="table_coneter_header">
              <li class="table_coneter_item">
                <el-checkbox v-model="checkedAll" @change="checkAllChange"></el-checkbox>
              </li>
              <li class="table_coneter_item">编号</li>
              <li class="table_coneter_item">型号</li>
              <li class="table_coneter_item">名称</li>
              <li class="table_coneter_item">检定项目</li>
              <li class="table_coneter_item">有效期</li>
              <li class="table_coneter_item">状态</li>
              <li class="table_coneter_item">使用单位</li>
              <li class="table_coneter_item">操作</li>
          </ul>
          <!-- 一级列表 -->
          <div v-if="tablelist.length < 1" class="table_body_coneter_not">暂无数据</div>
          <div class="table_body_coneter" v-for="(item,index) in tablelist" :key="index">
            <ul class="table_body_coneter_list">
                <li class="table_coneter_item">
                  <input type="checkbox" @change="checkItemChange(item.id, item)" :id="item.id+'l'" class="item_checked"/>
                  <label :for="item.id+'l'"></label>
                </li>
                <li class="table_coneter_item"><span>{{item.code}}</span></li>
                <li class="table_coneter_item"><span>{{item.model}}</span></li>
                <li class="table_coneter_item"><span>{{item.name}}</span></li>
                <li class="table_coneter_item"><span v-if="item.list && item.list.length > 0">{{item.list[0].checkItem}}</span></li>
                <li class="table_coneter_item"><span v-if="item.list && item.list.length > 0">{{item.list[0].checkdate3}}</span></li>
                <li class="table_coneter_item"><span>{{item.bz}}</span></li>
                <li class="table_coneter_item"><span>{{item.useCompany}}</span></li>
                <li class="table_coneter_item">
                  <el-button type="text" class="operation_btn" @click="onClickCopy(item)">复制</el-button>
                </li>
            </ul>
          </div>
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

  </div>
</template>
<script>
export default {
  name: 'newArchives',
  components: {},
  props: ['flag'],
  watch: {
    flag(val) {
      this.formQuery = { // 查询表单数据
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
      };
      this.onClickQuery(1, 10);
    }
  },
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      total: 0,
      show: false, // 收起/展开--状态
      showbut: 1, // 收起/展开--内容
      loading: false, // 加载状态
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
      delAllData: [], // 选择数据
      checkedAll: false, // 全选
    }
  },
  mounted() {
    this.getApiGetTbase();
    this.getDataList();
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
    // 获取列表数据
    getDataList() {
      this.onClickQuery(1, 10);
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
          this.tablelist = res.data.data.terminal.list;
          this.loading = false;
          if(res.data.data.terminal.total > 0){
            this.total = res.data.data.terminal.total;
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
    // 表格全选选择时
    checkAllChange(val) {
      if(val){
        this.tablelist.forEach(item => {
          item.checkbox_item = true;
          let checkredent = document.getElementById(item.id + 'l');
          checkredent.checked = true;
          checkredent.className = 'item_checked is-checked';
        });
        this.delAllData = this.tablelist;
      }else{
        this.tablelist.forEach(item => {
          item.checkbox_item = false;
          let checkredent = document.getElementById(item.id + 'l');
          checkredent.checked = false;
          checkredent.className = 'item_checked';
        });
        this.delAllData = [];
      }
      this.checkedAll = val;
    },
    // 表格子项选择时
    checkItemChange(id, row) {
      let checkredent = document.getElementById(id + 'l');
      if(checkredent){
        if (checkredent.checked) {
          row.checkbox_item = true;
          checkredent.className = 'item_checked is-checked';
        } else {
          row.checkbox_item = false;
          checkredent.className = 'item_checked';
        }
      }
      let ifend = this.tablelist.filter(item => item.checkbox_item == true);
      if(ifend.length == this.tablelist.length){
        this.checkedAll = true;
      }else{
        this.checkedAll = false;
      }
      this.delAllData = ifend;
    },
    // 点击复制
    onClickCopy(row) {
      this.$emit('close', row);
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
  border: 1px solid #EBEEF5;
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
  justify-content: flex-end;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.operation_btn {
  color: #32AFF0;
  margin: 0;
  padding: 0;
  margin-right: 10px;
}

.table_coneter_header {
    width: 100%;
    background-color: rgb(243, 246, 253);
    height: auto;
    display: flex;
    border-bottom: 1px solid #EBEEF5;
    li {
        line-height: 55px;
        box-sizing: border-box;
        border-right: 1px solid #EBEEF5;
        list-style: none;
        text-align: center;
        color: rgb(96, 98, 102);
        font-weight: 600;
        &:last-child {
            border-right: none;
        }
    }
}

.table_body_coneter_not {
    text-align: center;
    line-height: 60px;
    color: #909399;
}
.table_body_coneter {
    width: 100%;
    height: auto;
    border-bottom: 1px solid #EBEEF5;
    &:nth-child(even) {
        background: #FAFAFA;
    }
    &:last-child {
        border-bottom: none;
    }
    .table_body_coneter_list {
        width: 100%;
        height: auto;
        display: flex;
        overflow: hidden;
        min-width: 0;
        li {
            box-sizing: border-box;
            border-right: 1px solid #EBEEF5;
            list-style: none;
            color: rgb(96, 98, 102);
            &:last-child {
                border-right: none;
            }
        }
    }
}
.table_coneter_item {
    width: 12.5%;
    overflow: hidden;
    padding: 0 10px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
        flex: 1;
        min-width: 0;
        padding: 18px 0;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.item_checked[type=checkbox]{
	display: none;
}
.item_checked+label{
    display: inline-block;
    position: relative;
    border: 1px solid #DCDFE6;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #FFF;
}
.item_checked.is-checked+label{
    background-color: #409EFF;
    border-color: #409EFF;
}
.item_checked:checked + label::before{
    box-sizing: content-box;
    content: "";
    border: 1px solid #FFF;
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 4px;
    position: absolute;
    top: 1px;
    width: 3px;
    transition: transform .15s ease-in .05s,-webkit-transform .15s ease-in .05s;
    transform-origin: center;
    transform: rotate(45deg) scaleY(1);
}
</style>