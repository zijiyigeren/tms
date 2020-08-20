<template>
  <!-- 检测项目管理 -->
  <div class="box">
    <div class="wrap">
      <el-container>
        <el-aside>
          <div class="aside_select_box">
            <div style="lineHeight:32px;width:90px;marginRight:10px;">车辆类型:</div>
            <el-select
              size="small"
              v-model="value1"
              placeholder="请选择"
              class="section">
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.typeName"
                :value="item.typeName"
              ></el-option>
            </el-select>
          </div>
          <div class="aside_el_tree_box">
            <el-row>
              <el-col :span="24">
                <el-tree
                  ref="tree"
                  highlight-current
                  :default-checked-keys="[1]"
                  node-key="id"
                  :data="data"
                  :props="{label:'productName'}"
                  @node-click="handleNodeClick"
                >
                  <span class="custom-tree-node" slot-scope="{ node }">
                    <span>
                      <i class="iconfont icon-yijicaidan"></i>
                    </span>
                    <span>{{ node.label }}</span>
                  </span>
                </el-tree>
              </el-col>
            </el-row>
          </div>
        </el-aside>
        <el-main>
          <!-- 查询 -->
          <div class="query">
            <el-form :inline="true" ref="formQuery" :model="formQuery" label-width="84px" size="small" style="flex:1;"
                     class="query_search">
              <el-form-item label="项目代码：">
                <el-input v-model.trim="formQuery.items_item_code" @keyup.enter.native="enterQuery"
                          name="clearInputValue" clearable></el-input>
              </el-form-item>
              <el-form-item label="项目名称：">
                <el-input v-model.trim="formQuery.items_itme_name" @keyup.enter.native="enterQuery"
                          name="clearInputValue" clearable></el-input>
              </el-form-item>
              <el-form-item label="实验项目：">
                <el-input v-model.trim="formQuery.itemsFrederickItme" @keyup.enter.native="enterQuery"
                          name="clearInputValue" clearable></el-input>
              </el-form-item>
              <el-form-item label="检验依据：">
                <el-input v-model.trim="formQuery.items_test_basis" @keyup.enter.native="enterQuery"
                          name="clearInputValue" clearable></el-input>
              </el-form-item>
              <el-form-item label="检验科室：">
                <el-select v-model="formQuery.items_test_room" placeholder="请选择检验科室" clearable>
                  <el-option
                    v-for="items in idsroomName"
                    :key="items.id"
                    :label="items.org_name"
                    :value="items.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>

            <!-- 按钮 -->
            <div class="btn_l">
              <div>
                <el-button size="medium" @click="selectPro">选择</el-button>
              </div>
              <div>
                <el-button type="primary" @click="tableLocation(1,10)">查询</el-button>
                <el-button type="primary" @click="onClickReset" class="reset_btn">重置</el-button>
              </div>
            </div>
          </div>
          <!-- 表格 -->
          <div class="el_main_table_box">
            <div v-loading="loading" class="table_box_coneter">
              <ul class="table_coneter_header">
                <li class="table_coneter_item" style="width:60px">
                  <el-checkbox v-model="checkedAll" @change="checkAllChange"></el-checkbox>
                </li>
                <li class="table_coneter_item" style="width:120px">项目代码</li>
                <li class="table_coneter_item" v-if="indexIdFlag">indexId</li>
                <li class="table_coneter_item">项目名称</li>
                <li class="table_coneter_item">实验项目</li>
                <li class="table_coneter_item">检验依据</li>
                <li class="table_coneter_item" style="width:140px">检验科室</li>
                <li class="table_coneter_item" style="width:120px">样品数量</li>
                <li class="table_coneter_item" style="width:120px">封面标识</li>
                <li class="table_coneter_item" style="width:120px">收费</li>
                <li class="table_coneter_item" style="width:120px">状态</li>
                <li class="table_coneter_item" style="width:140px">是否出报告</li>
                <li class="table_coneter_item" style="width:140px">是否做测试</li>
                <li class="table_coneter_item" style="width:170px">检验次数</li>
              </ul>
              <!-- 一级列表 -->
              <div v-if="tableData.length < 1" class="table_body_coneter_not">暂无数据</div>
              <div class="table_body_coneter" v-for="(item,index) in tableData" :key="index">
                <ul class="table_body_coneter_list">
                  <li class="table_coneter_item" style="width:60px">
                    <!-- <el-checkbox v-model="item.checkbox_item" @change="checkItemChange(item.checkbox_item, item)"></el-checkbox> -->
                    <input type="checkbox" @change="checkItemChange(item.id, item)" :id="item.id+'l'"
                           class="item_checked"/>
                    <label :for="item.id+'l'"></label>
                  </li>
                  <li class="table_coneter_item" style="width:120px"><span>{{item.items_item_code == null ? '--' : item.items_item_code}}</span>
                  </li>
                  <li class="table_coneter_item" v-if="indexIdFlag"><span>{{item.indexid}}</span></li>
                  <li class="table_coneter_item"><span>{{item.items_itme_name}}</span></li>
                  <li class="table_coneter_item"><span>{{item.itemsFrederickItme == null ? '--' : item.itemsFrederickItme}}</span>
                  </li>
                  <li class="table_coneter_item">
                    <span>{{item.items_test_basis == null ? '--' : item.items_test_basis}}</span></li>
                  <li class="table_coneter_item" style="width:140px"><span>{{item.roomname == null ? '--' : item.roomname}}</span></li>
                  <li class="table_coneter_item" style="width:120px"><span>{{item.itemsItemSamplesVolume == null ? '--' : item.itemsItemSamplesVolume}}</span>
                  </li>
                  <li class="table_coneter_item" style="width:120px"><span>{{item.items_cover_logo1 == null ? '--' : item.items_cover_logo1}}</span>
                  </li>
                  <li class="table_coneter_item" style="width:120px"><span>{{item.items_charges}}</span></li>
                  <li class="table_coneter_item" style="width:120px">
                    <span v-if="item.inUse == 0">--</span>
                    <span v-else-if="item.inUse == 2">未使用</span>
                    <span v-else-if="item.inUse == 1">已使用</span>
                  </li>
                  <li class="table_coneter_item" style="width:140px">
                    <el-switch
                      v-model="item['needReport']"
                      active-value="1"
                      inactive-value="0"
                    />
                  </li>
                  <li class="table_coneter_item" style="width:140px">
                    <el-switch
                      v-model="item['needTest']"
                      active-value="1"
                      inactive-value="0"
                    />
                  </li>
                  <li class="table_coneter_item" style="width:170px">
                    <el-input v-model.number="item.currentPage" @input="inputChange(item)"></el-input>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 分页器 -->
          <div class="pagingdevice">
            <el-pagination
              @size-change="TableHandleSizeChange"
              @current-change="TableHandleCurrentChange"
              :current-page="TableCurrentPage"
              :page-sizes="[10,20,30]"
              :page-size="TablePageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="TableTotal">
            </el-pagination>
          </div>
        </el-main>
      </el-container>
    </div>
    <slot :selectedData="delAllData"></slot>
  </div>
</template>
<script>
  import base from '@/api/base'

  export default {
    name: 'systemprojecttable',
    props: ['type','singlechoice'],
    data () {
      return {
        TableCurrentPage: 1, // 列表-当前页
        TablePageSize: 10, // 列表-每页的条数
        TableTotal: 0, // 总条数
        tableHeight: 0,
        saveMsId: '',
        delAllData: '', /*全部删除*/
        options: [], /*左边下拉框数据*/
        value1: '',
        value2: '0',
        data: [], /*树形控件数据*/
        tableData: [], /*表格数据*/
        idsroomName: [], /*科室*/
        loading: false,
        indexIdFlag: false, // indexId列的展示状态
        formQuery: { // 查询数据
          items_item_code: '',  // 项目代码
          items_itme_name: '', // 项目名称
          itemsFrederickItme: '', // 实验项目
          items_test_basis: '', // 检验依据
          items_test_room: '' // 检验科室
        },
        checkedAll: false,
      }
    },
    methods: {
      // 重置-查询条件
      onClickReset () {
        this.formQuery = { // 查询数据
          items_item_code: '',  // 项目代码
          items_itme_name: '', // 项目名称
          itemsFrederickItme: '', // 实验项目
          items_test_basis: '', // 检验依据
          items_test_room: '' // 检验科室
        }
      },
      // 列表-分页器-设置每条的页数
      TableHandleSizeChange (val) {
        this.TablePageSize = val
        this.tableLocation(this.TableCurrentPage, this.TablePageSize)
      },
      // 列表-分页器-当前页发生改变时
      TableHandleCurrentChange (val) {
        this.TableCurrentPage = val
        this.tableLocation(this.TableCurrentPage, this.TablePageSize)
      },
      // 表格全选选择时
      checkAllChange (val) {
        if (val) {
          this.tableData.forEach(item => {
            item.checkbox_item = true
            let checkredent = document.getElementById(item.id + 'l')
            checkredent.checked = true
            checkredent.className = 'item_checked is-checked'
          })
          this.delAllData = this.tableData
        } else {
          this.tableData.forEach(item => {
            item.checkbox_item = false
            let checkredent = document.getElementById(item.id + 'l')
            checkredent.checked = false
            checkredent.className = 'item_checked'
          })
          this.delAllData = []
        }
        this.checkedAll = val
      },
      // 表格子项选择时
      checkItemChange (id, row) {
        let checkredent = document.getElementById(id + 'l')
        if (checkredent) {
          if (checkredent.checked) {
            row.checkbox_item = true
            checkredent.className = 'item_checked is-checked'
          } else {
            row.checkbox_item = false
            checkredent.className = 'item_checked'
          }
        }
        let ifend = this.tableData.filter(item => item.checkbox_item == true)
        if (ifend.length == this.tableData.length) {
          this.checkedAll = true
        } else {
          this.checkedAll = false
        }
        this.delAllData = ifend
      },
      //公用封装
      funAll (ruleFormNumber) {
        ruleFormNumber.itemCarType = ruleFormNumber.itemCarType.split(',')
      },
      //加载树形菜单
      getCate () {
        this.$api.systemProject.readProjectTree().then(res => {
          this.data = res.data.data
          this.saveMsId = this.data[0].id
          JSON.parse(localStorage.getItem('userInfo')).loginName == 'xtqx' ? this.indexIdFlag = true : this.indexIdFlag = false
          this.tableLocation(1, 10)
        })
      },
      //获取科室
      funshuKe () {
        this.$api.systemProject.readProject().then(res => {
          this.idsroomName = res.data.data
        }).catch(err => {
          this.$message({type: 'error', message: '检验科室数据获取失败', duration: 1500})
        })
      },
      //获取车辆类型
      funreadCarProject () {
        this.$api.systemProject.readCarProject(0).then(res => {
          this.options = res.data.data
          this.options.unshift({id: '', typeName: '全部'})
          if (!this.value1) {
            this.options.forEach(c => {
              if (c.id == '') {
                this.value1 = c.typeName
              }
            })
          }
        })
      },
      //点击树形控件导航加载表格
      handleNodeClick (data) {
        this.saveMsId = data.id
        this.tableLocation(1, 10)
      },
      // 获取表格数据
      tableLocation (TableCurrentPage, TablePageSize) {
        this.loading = true
        this.checkedAll = false
        let value1 = ''
        if (this.type === '1') {
          this.value2 = '1'
        }
        if (this.value1 == '全部') {
          value1 = ''
        } else {
          value1 = this.value1
        }
        let params = {
          catalogId: this.saveMsId,
          inUse: this.value2,
          cartype: value1,
          currentPage: TableCurrentPage,
          pageSize: TablePageSize,
          items_item_code: this.formQuery.items_item_code ? this.formQuery.items_item_code : '',  // 项目代码
          items_itme_name: this.formQuery.items_itme_name ? this.formQuery.items_itme_name : '', // 项目名称
          itemsFrederickItme: this.formQuery.itemsFrederickItme ? this.formQuery.itemsFrederickItme : '', // 实验项目
          items_test_basis: this.formQuery.items_test_basis ? this.formQuery.items_test_basis : '', // 检验依据
          items_test_room: this.formQuery.items_test_room ? this.formQuery.items_test_room : '' // 检验科室
        }
        this.$api.systemProject.readProjectTable(params).then(res => {
          if (res.data.data.data.length > 0) {
            res.data.data.data.forEach(item => {

            })
          }
          this.tableData = res.data.data.data
          this.loading = false
          if (res.data.data.total > 0) {
            this.TableTotal = res.data.data.total
            this.TableCurrentPage = res.data.data.currentPage
            this.TablePageSize = res.data.data.pageSize
          } else {
            this.TableTotal = 0
            this.TableCurrentPage = 1
            this.TablePageSize = 10
          }
          if (this.tableData.length > 0) {
            this.tableData.map(item => {
              item.checkbox_item = false
              item.itemsItemIssuanceDate = ''
              item.itemsSampleDate = ''
              item.samplesSpecifications = ''
              item.samplesManufacturers = ''
              item.samplesProperty = ''
              item.samplesCode = ''
              item.sampleComeDate = ''
            })
          }
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500})
          this.loading = false
        })
      },
      // 回车查询
      enterQuery (e) {
        var keyCode = window.event ? e.keyCode : e.which
        if (keyCode == 13) {
          this.tableLocation(1, 10)
        }
      },
      // 检验次数
      inputChange (row) {
        if (row.currentPage > 0 && parseFloat(row.currentPage).toString() != 'NaN') {
          row.checkbox_item = true
          let checkredent = document.getElementById(row.id + 'l')
          checkredent.checked = true
          checkredent.className = 'item_checked is-checked'
          let flag = true
          if (this.delAllData.length > 0) {
            this.delAllData.forEach(item => {
              if (item.id == row.id) {
                flag = false
              }
            })
            if (flag) {

              this.checkItemChange(row.id, row)
            }
          } else {
            
            this.delAllData = [row]
          }
        } else {
          row.checkbox_item = false
          this.$message({type: 'warning', message: '输入值不能为空，大于0，为数字！', duration: 1500})
          let checkredent = document.getElementById(row.id + 'l')
          checkredent.checked = false
          checkredent.className = 'item_checked'
          this.checkItemChange(row.id, row)
        }
      },
      // 点击选择
      selectPro () {
        if (this.delAllData.length <= 0) {
          return this.$message({type: 'warning', message: '请选择检验项目！', duration: 1500})
        } else {
          let arr = []
          this.delAllData.forEach(item => {
            if (item.currentPage == 1) {
              arr.push(item)
            } else if (item.currentPage > 1) {
              for (var i = 0; i < item.currentPage; i++) {
                arr.push(item)
              }
            }
          })
          if(this.singlechoice){ //为true 表示此组件被原始记录模板调用了 
            if(arr.length == 1){
               this.$emit('sendId', arr)
            }else{
              this.$alert('每个原始记录模板只可绑定一个单一的检验项目', '信息提示', {
                dangerouslyUseHTMLString: true
              });
            }
            return false
          }
          this.$emit('updateTable', arr)
        }
      },
    },
    mounted () {
      this.funreadCarProject()
      this.funshuKe()
      this.getCate()
    },
  }
</script>
<style scoped lang="less">
  /deep/ input::-webkit-outer-spin-button, /deep/
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }

  .el-checkbox-group {
    width: 1000px !important;
  }

  .el-button--default {
    height: 30px;
    padding: 0 20px;
  }

  .el-button--primary {
    height: 30px;
    padding: 0 20px;
    margin: 0;
    background: linear-gradient(90deg,
    rgba(96, 157, 248, 1),
    rgba(84, 183, 235, 1));
  }

  .el-divider--vertical {
    margin: 0;
  }

  .el-divider {
    background-color: rgb(50, 175, 240);
  }

  .el-container {
    width: 100%;
    height: 100%;
  }

  .box {
    width: 100%;
    height: 100%;
    background: #eee;
    overflow: hidden;
    padding: 10px;

    .wrap {
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
    }
  }

  .el-header {
    background-color: #fff;
    color: #333;
    /* text-align: center; */
    line-height: 60px;
    margin-bottom: 10px;
    display: flex;
  }

  .el-aside {
    width: 240px !important;
    height: 100%;
    color: #333;
    text-align: center;
    background-color: #fff;
    padding: 20px 10px;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .aside_select_box {
      display: flex;
      justify-content: space-between;
    }

    .aside_el_tree_box {
      flex: 1;
      overflow: hidden;
      margin-top: 20px;

      .el-row {
        height: 100%;
        overflow-y: auto;
      }
    }
  }

  .el-header .top {
    width: 119px;
    height: 100%;
    background: linear-gradient(90deg,
    rgba(96, 157, 248, 1),
    rgba(84, 183, 235, 1));
    text-align: center;
    color: #fff;
    position: relative;
  }

  .el-main {
    background-color: #fff;
    color: #333;
    margin-left: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .el_main_table_box {
      flex: 1;
      /*overflow: hidden;*/
      overflow: auto;
      position: relative;
    }

    hr {
      width: 90%;
      margin: 0 auto;
      border: 0;
      border-bottom: 1px solid rgba(0, 0, 0, .1);
    }

    .el-form-item {
      .el-input,
      .el-select {
        width: 362px;
      }
    }

    .dialog-footer {
      display: flex;
      justify-content: center;
    }
  }

  body > .el-container {
    margin-bottom: 40px;
    display: flex;
  }

  .btn_l {
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  body > .el-container .el-aside .el-select {
    position: relative;
    display: none;
  }

  .el-aside .el-select {
    position: relative;
  }

  .el-aside .el-input.el-input--suffix {
    height: 50px;
  }

  .pagingdevice {
    margin-top: 20px;
  }

  .query_search {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    overflow: hidden;
  }

  .query_search .el-form-item {
    width: 18%;
    margin: 0;
    display: flex;
  }

  /deep/ .query_search .el-form-item__content {
    flex: 1;
  }

  /deep/ .query_search .el-select, .query_search .el-input {
    width: 100% !important;
  }

  .reset_btn {
    margin: 0 !important;
    margin-left: 10px !important;
    background: #909399 !important;
    border-color: #909399 !important;
  }

  .table_box_coneter {
    width: 150%;
    /*height: 500px;*/
    border: 1px solid #EBEEF5;
    /*overflow-y: auto;*/
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
    /*width: 12.5%;*/
    width: 18%;
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
      word-wrap: break-word;
    }
  }

  .table_coneter_item_task {
    width: 12.5%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .table_coneter_item_task_p {
      height: 55px;
      text-align: center;
      line-height: 55px;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .item_checked[type=checkbox] {
    display: none;
  }

  .item_checked + label {
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

  .item_checked.is-checked + label {
    background-color: #409EFF;
    border-color: #409EFF;
  }

  .item_checked:checked + label::before {
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
    transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
    transform-origin: center;
    transform: rotate(45deg) scaleY(1);
  }

  /deep/ .table_coneter_header, .table_body_coneter_list {
    margin-bottom: 0 !important;
  }
</style>
