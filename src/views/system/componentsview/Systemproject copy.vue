<template>

  <!-- 检测项目管理 -->
  <div class="box">
    <div class="wrap">
      <el-container>
        <el-aside>
          <div class="aside_select_box">
            <div style="lineHeight:32px;width:90px;marginRight:10px;" v-if="type == '1'">车辆类型:</div>
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

            <el-select
              v-if="type !== '1'"
              size="small"
              v-model="value2"
              collapse-tags
              placeholder="请选择"
              style="margin-left: 10px;"
              class="section">
              <el-option
                v-for="item in optionsRight"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="aside_el_tree_box">
            <el-row>
              <el-col :span="24">
                <el-tree
                  ref="tree"
                  @current-change="currentChange"
                  highlight-current
                  :default-checked-keys="[1]"
                  node-key="id"
                  :data="data"
                  :props="{label:'productName'}"
                  @node-click="handleNodeClick"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
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
              <el-form :inline="true" ref="formQuery" :model="formQuery" label-width="84px" size="small" style="flex:1;" class="query_search">
                  <el-form-item label="项目代码：">
                      <el-input v-model.trim="formQuery.items_item_code" @keyup.enter.native="enterQuery" name="clearInputValue" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="项目名称：">
                      <el-input v-model.trim="formQuery.items_itme_name" @keyup.enter.native="enterQuery" name="clearInputValue" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="实验项目：">
                      <el-input v-model.trim="formQuery.itemsFrederickItme" @keyup.enter.native="enterQuery" name="clearInputValue" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="检验依据：">
                      <el-input v-model.trim="formQuery.items_test_basis" @keyup.enter.native="enterQuery" name="clearInputValue" clearable></el-input>
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
                    <el-button v-if="type === '1'" size="medium" @click="selectPro">选择</el-button>
                    <el-button
                      v-if="type !== '1'"
                      size="medium"
                      icon="el-icon-plus"
                      @click="addsDatas()">新建
                    </el-button>
                    <el-button
                      v-if="type !== '1'"
                      @click="delAll"
                      size="medium"
                      icon="el-icon-delete"
                      style="width:100px;">批量删除
                    </el-button>
                    <el-button
                      v-if="type !== '1'"
                      size="medium"
                      icon="el-icon-upload2"
                      @click="returnDatas()">导出
                    </el-button>
                  </div>
                  <div>
                    <el-button type="primary" @click="tableLocation(1,10)">查询</el-button>
                    <el-button type="primary" @click="onClickReset" class="reset_btn">重置</el-button>
                  </div>
              </div>
          </div>
          <!-- 表格 -->
          <div class="el_main_table_box" ref="el_main_table_box">
            <el-row>
              <el-col :span="24">
                <el-table
                  v-loading="loading"
                  :max-height="tableHeight"
                  :header-cell-style="{'background-color': 'rgba(243,246,253,1)','color': '#606266','padding': '10px 0','text-align':'center'}"
                  :cell-style="cellStyle"
                  :data="tableData"
                  border
                  ref="table1"
                  @selection-change="handleSelectionChange"
                  @select-all="dialogCheck"
                  @select="dialogCheck">
                  <el-table-column type="selection" :resizable="false"></el-table-column>
                  <el-table-column prop="items_item_code" label="项目代码" :resizable="false">
                    <template slot-scope="scope">
                      <span>{{scope.row.items_item_code == null?"--":scope.row.items_item_code}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="indexid" label="indexId" :resizable="false" v-if="indexIdFlag"></el-table-column>
                  <el-table-column prop="items_itme_name" label="项目名称" :show-overflow-tooltip="true"
                                  :resizable="false"></el-table-column>
                  <el-table-column prop="itemsFrederickItme" label="实验项目" :show-overflow-tooltip="true" :resizable="false">
                    <template slot-scope="scope">
                      <span>{{scope.row.itemsFrederickItme == null?"--":scope.row.itemsFrederickItme}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="items_test_basis" label="检验依据" :show-overflow-tooltip="true" :resizable="false">
                    <template slot-scope="scope">
                      <span>{{scope.row.items_test_basis == null?"--":scope.row.items_test_basis}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="roomname" label="检验科室" :resizable="false">
                    <template slot-scope="scope">
                      <span>{{scope.row.roomname == null?"--":scope.row.roomname}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="itemsItemSamplesVolume" label="样品数量" :resizable="false" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <span>{{scope.row.itemsItemSamplesVolume == null?"--":scope.row.itemsItemSamplesVolume}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="items_cover_logo1" label="封面标识" :resizable="false">
                    <template slot-scope="scope">
                      <span>{{scope.row.items_cover_logo1 == null?"--":scope.row.items_cover_logo1}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="items_charges" label="收费" :resizable="false"></el-table-column>
                  <el-table-column prop="inUse" label="状态" :resizable="false">
                    <template slot-scope="scope">
                      <span v-if="scope.row.inUse == 0">--</span>
                      <span v-else-if="scope.row.inUse == 2">未使用</span>
                      <span v-else-if="scope.row.inUse == 1">已使用</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="property" v-if="type === '1'" label="检验次数" :resizable="false">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.property" @input="change(scope)" size="mini"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="160" v-if="type !== '1'" fixed="right" :resizable="false">
                    <template slot-scope="scope">
                      <el-button type="text"
                                style="color:#32AFF0;marginLeft:6px;"
                                @click="handleEditor(scope.$index, scope.row)"
                                size="mini">编辑
                      </el-button>
                      <el-button type="text"
                                @click="handleView(scope.$index, scope.row)"
                                size="mini"
                                style="color:#32AFF0;marginLeft:6px;">查看
                      </el-button>
                      <el-button type="text"
                                @click="handleDelete(scope.$index, scope.row)"
                                size="mini"
                                style="color:red;marginLeft:6px;">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>

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
          <!--新建的对话框-->
          <el-dialog
            @close="closeDialog('ruleForm')"
            title="新建"
            :visible.sync="dialogFormVisible"
            width="80%"
            :close-on-click-modal="false">
            <el-form
              size="mini"
              :inline="true"
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="130px"
              class="demo-ruleForm"
            >
              <el-form-item label="项目名称" prop="items_itme_name">
                <el-input
                  :maxlength="200"
                  type="text"
                  v-model="ruleForm.items_itme_name"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目检验依据" prop="items_test_basis">
                <el-input
                  :maxlength="1000"
                  type="text"
                  v-model="ruleForm.items_test_basis"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目代码" prop="items_item_code">
                <el-input :maxlength="4" type="text" v-model="ruleForm.items_item_code"></el-input>
              </el-form-item>
              <el-form-item label="实验项目" prop="itemsFrederickItme">
                <el-input :maxlength="1000" type="text" v-model="ruleForm.itemsFrederickItme"></el-input>
              </el-form-item>
              <el-form-item label="样品名称">
                <el-input :maxlength="45" v-model="ruleForm.items_item_samples_name"></el-input>
              </el-form-item>
              <el-form-item label="样品数量" prop="itemsItemSamplesVolume">
                <el-input :maxlength="200" v-model="ruleForm.itemsItemSamplesVolume"></el-input>
              </el-form-item>
              <el-form-item label="是否出报告">
                <el-radio-group v-model="ruleForm.needReport">
                  <el-radio :label="'0'">否</el-radio>
                  <el-radio :label="'1'">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否做实验">
                <el-radio-group v-model="ruleForm.needTest">
                  <el-radio :label="'0'">否</el-radio>
                  <el-radio :label="'1'">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="封面标识">
                <el-input :maxlength="125" v-model="ruleForm.items_cover_logo1"></el-input>
              </el-form-item>
              <el-form-item label="检验类别">
                <el-input :maxlength="4" v-model="ruleForm.items_test_type"></el-input>
              </el-form-item>
              <el-form-item label="收费" prop="items_charges">
                <el-input v-model.trim="ruleForm.items_charges"></el-input>
              </el-form-item>
              <el-form-item label="检验科室" prop="items_test_room">
                <el-select v-model="ruleForm.items_test_room" placeholder="请选择检验科室">
                  <el-option
                    :key="items.id"
                    v-for="items in idsroomName"
                    :label="items.org_name"
                    :value="items.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属类型" prop="itemCatalogId">
                <el-select v-model="ruleForm.itemCatalogId" placeholder="请选择所属类型">
                  <el-option
                    :key="i.id"
                    v-for="i in idsProduct"
                    :label="i.productName"
                    :value="i.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备选科室">
                <el-select v-model="ruleForm.items_test_room1" placeholder="请选择备选科室">
                  <el-option
                    :key="items.id"
                    v-for="items in idsroomName"
                    :label="items.org_name"
                    :value="items.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="中机项目ID">
                <el-input :maxlength="8" v-model="ruleForm.itemId"></el-input>
              </el-form-item>
              <el-form-item label="排序号" prop="orderby">
                <el-input v-model.trim="ruleForm.orderby"></el-input>
              </el-form-item>
              <el-form-item label="型号">
                <el-input :maxlength="30" v-model="ruleForm.sign1"></el-input>
              </el-form-item>
              <el-form-item label="厂家">
                <el-input :maxlength="30" v-model="ruleForm.sign2"></el-input>
              </el-form-item>
              <el-form-item label="数量">
                <el-input :maxlength="30" v-model="ruleForm.sign3"></el-input>
              </el-form-item>
              <el-form-item label="样品名称">
                <el-input :maxlength="30" v-model="ruleForm.sign4"></el-input>
              </el-form-item>
              <el-form-item label="商标">
                <el-input :maxlength="30" v-model="ruleForm.sign5"></el-input>
              </el-form-item>
              <el-form-item label="是否使用：">
                <el-select v-model="ruleForm.inUse" placeholder="请选择是否使用">
                  <el-option label="未使用" value="2"></el-option>
                  <el-option label="已使用" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目名称标记">
                <el-input v-model="ruleForm.itemSign"></el-input>
              </el-form-item>
              <el-form-item label="检验项目标记">
                <el-input v-model="ruleForm.standardSign"></el-input>
              </el-form-item>
              <el-form-item label="项目解释">
                <el-input type="textarea" v-model="ruleForm.itemNote" style="width: 362px;"></el-input>
              </el-form-item>
              <el-form-item label="符合车辆类型">
                <el-checkbox-group v-model="ruleForm.itemCarType">
                  <el-checkbox
                    v-for="(item,index) in options"
                    v-model="item.typeName"
                    :key="index"
                    :label="item.typeName"
                  >{{item.typeName}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="拷贝到">
                <el-select v-model="ruleForm.copyItemCatalogId" placeholder="请选择所属类型">
                  <el-option
                    :key="i.id"
                    v-for="i in idsProduct"
                    :label="i.productName"
                    :value="i.id"
                  ></el-option>
                </el-select>
                <el-select v-model="ruleForm.copyitems_test_room" placeholder="请选择检验科室">
                  <el-option
                    :key="items.id"
                    v-for="items in idsroomName"
                    :label="items.org_name"
                    :value="items.id"
                  ></el-option>
                </el-select>
                <el-button type="primary" @click="copyData('ruleForm')">拷贝</el-button>
              </el-form-item>
            </el-form>
            <hr/>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="adds">保存</el-button>
              <el-button @click="closeBtnClick('ruleForm', 1, 10)">取 消</el-button>
            </div>
          </el-dialog>
          <!--编辑的对话框-->
          <el-dialog
            @close="closeDialog('ruleForm1')"
            title="编辑"
            :visible.sync="dialogFormVisible1"
            width="80%"
            :close-on-click-modal="false">
            <el-form
              size="mini"
              :inline="true"
              :model="ruleForm1"
              :rules="rules"
              ref="ruleForm1"
              label-width="130px"
              class="demo-ruleForm"
            >
              <el-form-item label="项目名称" prop="items_itme_name">
                <el-input
                  :maxlength="200"
                  type="text"
                  v-model="ruleForm1.items_itme_name"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目检验依据" prop="items_test_basis">
                <el-input
                  :maxlength="1000"
                  type="text"
                  v-model="ruleForm1.items_test_basis"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目代码" prop="items_item_code">
                <el-input :maxlength="4" type="text" v-model="ruleForm1.items_item_code"></el-input>
              </el-form-item>
              <el-form-item label="实验项目" prop="itemsFrederickItme">
                <el-input :maxlength="1000" type="text" v-model="ruleForm1.itemsFrederickItme"></el-input>
              </el-form-item>
              <el-form-item label="样品名称">
                <el-input :maxlength="45" v-model="ruleForm1.items_item_samples_name"></el-input>
              </el-form-item>
              <el-form-item label="样品数量" prop="itemsItemSamplesVolume">
                <el-input :maxlength="200" v-model="ruleForm1.itemsItemSamplesVolume"></el-input>
              </el-form-item>
              <el-form-item label="是否出报告">
                <el-radio-group v-model="ruleForm1.needReport">
                  <el-radio :label="'0'">否</el-radio>
                  <el-radio :label="'1'">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否做实验">
                <el-radio-group v-model="ruleForm1.needTest">
                  <el-radio :label="'0'">否</el-radio>
                  <el-radio :label="'1'">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="封面标识">
                <el-input :maxlength="125" v-model="ruleForm1.items_cover_logo1"></el-input>
              </el-form-item>
              <el-form-item label="检验类别">
                <el-input :maxlength="4" v-model="ruleForm1.items_test_type"></el-input>
              </el-form-item>
              <el-form-item label="收费" prop="items_charges">
                <el-input v-model="ruleForm1.items_charges"></el-input>
              </el-form-item>
              <el-form-item label="检验科室" prop="items_test_room">
                <el-select v-model="ruleForm1.items_test_room" placeholder="请选择检验科室">
                  <el-option
                    :key="items.id"
                    v-for="items in idsroomName"
                    :label="items.org_name"
                    :value="items.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属类型" prop="itemCatalogId">
                <el-select v-model="ruleForm1.itemCatalogId" placeholder="请选择所属类型">
                  <el-option
                    :key="i.id"
                    v-for="i in idsProduct"
                    :label="i.productName"
                    :value="i.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备选科室">
                <el-select v-model="ruleForm1.items_test_room1" placeholder="请选择备选科室">
                  <el-option
                    :key="i.id"
                    v-for="i in idsroomName"
                    :label="i.org_name"
                    :value="i.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="中机项目ID">
                <el-input :maxlength="8" v-model="ruleForm1.itemId"></el-input>
              </el-form-item>
              <el-form-item label="排序号" prop="orderby">
                <el-input v-model="ruleForm1.orderby"></el-input>
              </el-form-item>
              <el-form-item label="型号">
                <el-input :maxlength="30" v-model="ruleForm1.sign1"></el-input>
              </el-form-item>
              <el-form-item label="厂家">
                <el-input :maxlength="30" v-model="ruleForm1.sign2"></el-input>
              </el-form-item>
              <el-form-item label="数量">
                <el-input :maxlength="30" v-model="ruleForm1.sign3"></el-input>
              </el-form-item>
              <el-form-item label="样品名称">
                <el-input :maxlength="30" v-model="ruleForm1.sign4"></el-input>
              </el-form-item>
              <el-form-item label="商标">
                <el-input :maxlength="30" v-model="ruleForm1.sign5"></el-input>
              </el-form-item>
              <el-form-item label="是否使用">
                <el-select v-model="ruleForm1.inUse" placeholder="请选择是否使用">
                  <el-option label="已使用" value="1"></el-option>
                  <el-option label="未使用" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目名称标记">
                <el-input v-model="ruleForm1.itemSign"></el-input>
              </el-form-item>
              <el-form-item label="检验项目标记">
                <el-input v-model="ruleForm1.standardSign"></el-input>
              </el-form-item>
              <el-form-item label="项目解释">
                <el-input type="textarea" v-model="ruleForm1.itemNote" style="width: 362px;"></el-input>
              </el-form-item>
              <el-form-item label="符合车辆类型">
                <el-checkbox-group v-model="ruleForm1.itemCarType">
                  <el-checkbox
                    v-for="(item,index) in options"
                    v-model="item.typeName"
                    :key="index"
                    :label="item.typeName"
                  >{{item.typeName}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="拷贝到">
                <el-select v-model="ruleForm1.copyItemCatalogId" placeholder="请选择所属类型">
                  <el-option
                    :key="i.id"
                    v-for="i in idsProduct"
                    :label="i.productName"
                    :value="i.id"
                  >{{i.productName}}
                  </el-option>
                </el-select>
                <el-select v-model="ruleForm1.copyitems_test_room" placeholder="请选择检验科室">
                  <el-option
                    :key="items.id"
                    v-for="items in idsroomName"
                    :label="items.org_name"
                    :value="items.id"
                  >{{items.org_name}}
                  </el-option>
                </el-select>
                <el-button type="primary" @click="copyData('ruleForm1')">拷贝</el-button>
              </el-form-item>
            </el-form>
            <hr/>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="edits">保存</el-button>
              <el-button @click="closeBtnClick('ruleForm1',TableCurrentPage,TablePageSize)">取 消</el-button>
            </div>
          </el-dialog>
          <!--查看的对话框-->
          <el-dialog
            title="查看"
            :visible.sync="dialogFormVisible2"
            width="80%"
            :close-on-click-modal="false">
            <el-form
              :disabled="true"
              size="mini"
              :inline="true"
              :model="ruleForm2"
              label-width="130px"
              class="demo-ruleForm"
            >
              <el-form-item label="项目名称" prop="items_itme_name">
                <el-input
                  :maxlength="200"
                  type="text"
                  v-model="ruleForm2.items_itme_name"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目检验依据">
                <el-input
                  :maxlength="1000"
                  type="text"
                  v-model="ruleForm2.items_test_basis"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目代码" prop="items_item_code">
                <el-input :maxlength="4" type="text" v-model="ruleForm2.items_item_code"></el-input>
              </el-form-item>
              <el-form-item label="实验项目">
                <el-input :maxlength="1000" type="text" v-model="ruleForm2.itemsFrederickItme"></el-input>
              </el-form-item>
              <el-form-item label="样品名称">
                <el-input :maxlength="45" v-model="ruleForm2.items_item_samples_name"></el-input>
              </el-form-item>
              <el-form-item label="样品数量">
                <el-input :maxlength="200" v-model="ruleForm2.itemsItemSamplesVolume"></el-input>
              </el-form-item>
              <el-form-item label="是否出报告">
                <el-radio-group v-model="ruleForm2.needReport">
                  <el-radio :label="'0'">否</el-radio>
                  <el-radio :label="'1'">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否做实验">
                <el-radio-group v-model="ruleForm2.needTest">
                  <el-radio :label="'0'">否</el-radio>
                  <el-radio :label="'1'">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="封面标识">
                <el-input :maxlength="125" v-model="ruleForm2.items_cover_logo1"></el-input>
              </el-form-item>
              <el-form-item label="检验类别">
                <el-input :maxlength="4" v-model="ruleForm2.items_test_type"></el-input>
              </el-form-item>
              <el-form-item label="收费" prop="items_charges">
                <el-input v-model="ruleForm2.items_charges"></el-input>
              </el-form-item>
              <el-form-item label="检验科室" prop="items_test_room">
                <el-select v-model="ruleForm2.items_test_room" placeholder="请选择检验科室">
                  <el-option
                    :key="items.id"
                    v-for="items in idsroomName"
                    :label="items.org_name"
                    :value="items.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属类型">
                <el-select v-model="ruleForm2.itemCatalogId" placeholder="请选择所属类型">
                  <el-option
                    :key="i.id"
                    v-for="i in idsProduct"
                    :label="i.productName"
                    :value="i.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备选科室">
                <el-select v-model="ruleForm2.items_test_room1" placeholder="请选择备选科室">
                  <el-option
                    :key="items.id"
                    v-for="items in idsroomName"
                    :label="items.org_name"
                    :value="items.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="中机项目ID">
                <el-input :maxlength="8" v-model="ruleForm2.itemId"></el-input>
              </el-form-item>
              <el-form-item label="排序号">
                <el-input :maxlength="4" v-model="ruleForm2.orderby"></el-input>
              </el-form-item>
              <el-form-item label="型号">
                <el-input :maxlength="30" v-model="ruleForm2.sign1"></el-input>
              </el-form-item>
              <el-form-item label="厂家">
                <el-input :maxlength="30" v-model="ruleForm2.sign2"></el-input>
              </el-form-item>
              <el-form-item label="数量">
                <el-input :maxlength="30" v-model="ruleForm2.sign3"></el-input>
              </el-form-item>
              <el-form-item label="样品名称">
                <el-input :maxlength="30" v-model="ruleForm2.sign4"></el-input>
              </el-form-item>
              <el-form-item label="商标">
                <el-input :maxlength="30" v-model="ruleForm2.sign5"></el-input>
              </el-form-item>
              <el-form-item label="是否使用">
                <el-select v-model="ruleForm2.inUse" placeholder="请选择是否使用">
                  <el-option label="未使用" value="1"></el-option>
                  <el-option label="已使用" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目名称标记">
                <el-input v-model="ruleForm2.itemSign"></el-input>
              </el-form-item>
              <el-form-item label="检验项目标记">
                <el-input v-model="ruleForm2.standardSign"></el-input>
              </el-form-item>
              <el-form-item label="项目解释">
                <el-input type="textarea" v-model="ruleForm2.itemNote" style="width: 362px;"></el-input>
              </el-form-item>
              <el-form-item label="符合车辆类型">
                <el-checkbox-group v-model="ruleForm2.itemCarType">
                  <el-checkbox
                    v-for="(item,index) in options"
                    v-model="item.typeName"
                    :key="index"
                    :label="item.typeName"
                    true-label
                  >{{item.typeName}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="拷贝到">
                <el-select v-model="ruleForm2.copyItemCatalogId" placeholder="请选择所属类型">
                  <el-option
                    :key="i.id"
                    v-for="i in idsProduct"
                    :label="i.productName"
                    :value="i.id"
                  ></el-option>
                </el-select>
                <el-select v-model="ruleForm2.copyitems_test_room" placeholder="请选择检验科室">
                  <el-option
                    :key="items.id"
                    v-for="items in idsroomName"
                    :label="items.org_name"
                    :value="items.id"
                  ></el-option>
                </el-select>
                <el-button type="primary" @click="copyData">拷贝</el-button>
              </el-form-item>
            </el-form>
            <hr/>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible2 = false">取 消</el-button>
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
  import base from '../../../api/base'

  export default {
    name: 'systemproject',
    props: ["type"],
    data() {
      var itemsCharges = (rule, value, callback) => {
        if (value) {
          setTimeout(() => {
            if (!Number.isInteger(+value)) {
              callback(new Error('收费必须为整数'))
            } else {
              if (value.toString().length > 9) {
                callback(new Error('收费输入最大值为9位数'))
              } else {
                callback()
              }
            }
          }, 100)
        } else {
          callback()
        }
      };
      return {
        TableCurrentPage: 1, // 列表-当前页
        TablePageSize: 10, // 列表-每页的条数
        TableTotal: 0, // 总条数
        tableHeight: 0,
        editIdss: '', /*编辑id*/
        selectioned: null,
        saveMsId: '',
        rejectReport: '',
        reportIds: '',
        treeData: '',
        delAllData: "", /*全部删除*/
        checked: false,
        options: [], /*左边下拉框数据*/
        optionsRight: [
          {
            value: '0',
            label: '全部'
          }, {
            value: '1',
            label: '已使用'
          }, {
            value: '2',
            label: '未使用'
          }
        ], /*下拉框数据右*/
        value1: '',
        value2: '0',
        data: [], /*树形控件数据*/
        tableData: [], /*表格数据*/
        dialogFormVisible: false, /*新建*/
        dialogFormVisible1: false, /*编辑*/
        dialogFormVisible2: false, /*查看*/
        dialogTableVisible: false,
        idsProduct: [], /*所属类型*/
        idsroomName: [], /*科室*/
        ruleForm: {
          items_itme_name: '',
          items_test_basis: '',
          items_item_code: '',
          itemsFrederickItme: '',
          items_item_samples_name: '',
          itemsItemSamplesVolume: '',
          needReport: '0',
          needTest: '1',
          items_cover_logo1: '',
          items_test_type: '',
          items_charges: '0',
          items_test_room: '', /*检验科室*/
          itemCatalogId: '', /*所属类型*/
          items_test_room1: '', /*备选科室*/
          itemId: '',
          orderby: '',
          sign1: '',
          sign2: '',
          sign3: '',
          sign4: '',
          sign5: '',
          inUse: 2, /*是否*/
          itemSign: '',
          standardSign: '',
          itemNote: '',
          itemCarType: [], /*多选框*/
          copyitems_test_room: '', /*拷贝到select*/
          copyItemCatalogId: ''/*拷贝到select*/
        }, /*新增表单数据*/
        ruleForm1: {
          inUse: '', /*是否*/
          items_test_room: '', /*检验科室*/
          itemCatalogId: '', /*所属类型*/
          items_test_room1: '', /*备选科室*/
          itemCarType: [], /*多选框*/
        }, /*编辑表单数据*/
        ruleForm2: {
          inUse: '', /*是否*/
          itemCarType: [], /*多选框*/
          items_test_room: '', /*检验科室*/
          itemCatalogId: '', /*所属类型*/
          items_test_room1: '', /*备选科室*/
        }, /*查看表单数据*/
        rules: {
          items_itme_name: [
            {required: true, message: '请输入项目名称', trigger: 'blur'}
          ],
          items_item_code: [
            {required: true, message: '请输入项目代码', trigger: 'blur'}
          ],
          items_test_basis: [
            {required: true, message: '请输入检验项目依据', trigger: 'blur'}
          ],
          itemsFrederickItme: [
            {required: true, message: '请输入实验项目', trigger: 'blur'}
          ],
          items_test_room: [
            {required: true, message: '请选择检验科室', trigger: 'change'}
          ],
          itemCatalogId: [
            {required: true, message: '请选择所属类型', trigger: 'change'}
          ],
          itemsItemSamplesVolume: [
            {required: true, message: '请输入样品数量', trigger: 'blur'}
          ],
          orderby: [
            {required: true, message: '顺序号不能为空', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                if (/^[0-9]\d*$/.test(value) == false) {
                  callback(new Error("顺序号必须为整数"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            },
            {
              validator: (rule, value, callback) => {
                if (value.toString().length > 4) {
                  callback(new Error("顺序号输入最大值为4位数"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            },
          ],
          items_charges: [
            {required: false, validator: itemsCharges, trigger: 'blur'},
          ]
        }, /*表单校检*/
        loading: false,
        indexIdFlag: false, // indexId列的展示状态
        formQuery: { // 查询数据
          items_item_code: '',  // 项目代码
          items_itme_name: '', // 项目名称
          itemsFrederickItme: '', // 实验项目
          items_test_basis: '', // 检验依据
          items_test_room: '' // 检验科室
        },
      }
    },
    methods: {
      // 重置-查询条件
      onClickReset() {
        this.formQuery = { // 查询数据
          items_item_code: '',  // 项目代码
          items_itme_name: '', // 项目名称
          itemsFrederickItme: '', // 实验项目
          items_test_basis: '', // 检验依据
          items_test_room: '' // 检验科室
        };
      },
      // 列表-分页器-设置每条的页数
      TableHandleSizeChange(val) {
        this.TablePageSize = val;
        this.tableLocation(this.TableCurrentPage,this.TablePageSize);
      },
      // 列表-分页器-当前页发生改变时
      TableHandleCurrentChange(val) {
        this.TableCurrentPage = val;
        this.tableLocation(this.TableCurrentPage,this.TablePageSize);
      },
      //点击批量删除
      handleSelectionChange(data) {
        this.delAllData = data;
      },
      //批量删除
      delAll() {
        if (this.delAllData.length == 0) {
          this.$message({type: 'waring', message: '请选择至少一条数据', duration: 1500});
        } else {
          var id = this.delAllData.map(v => v.id);
          this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.systemProject.deleteProject(id).then(res => {
              this.$message({type: 'success', message: '删除成功', duration: 1500});
              this.tableLocation(this.TableCurrentPage,this.TablePageSize);
            }).catch(error => {
              this.$message({type: 'error', message: error.data.message, duration: 1500});
            })
          }).catch(err => {
            this.$message({type: 'info', message: '已取消删除', duration: 1500});
          })
        }
      },
      //点击导出
      returnDatas() {
        var a = document.createElement('a')
        // a.href = 'http://60.247.58.105:19608/api/item/export'
        a.href = `${base.baseUrl}/item/export`
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      /*打开新增窗口*/
      addsDatas() {
        this.rejectReport = '';
        this.ruleForm = {
          items_itme_name: '',
          items_test_basis: '',
          items_item_code: '',
          itemsFrederickItme: '',
          items_item_samples_name: '',
          itemsItemSamplesVolume: '',
          needReport: '0',
          needTest: '1',
          items_cover_logo1: '',
          items_test_type: '',
          items_charges: '0',
          items_test_room: '', /*检验科室*/
          itemCatalogId: '', /*所属类型*/
          items_test_room1: '', /*备选科室*/
          itemId: '',
          orderby: '',
          sign1: '',
          sign2: '',
          sign3: '',
          sign4: '',
          sign5: '',
          inUse: '2', /*是否*/
          itemSign: '',
          standardSign: '',
          itemNote: '',
          itemCarType: [], /*多选框*/
          copyitems_test_room: '', /*拷贝到select*/
          copyItemCatalogId: ''/*拷贝到select*/
        }
        this.options.shift()
        this.dialogFormVisible = true;
        if (this.saveMsId) {
          this.ruleForm.itemCatalogId = this.saveMsId
        } else {
          return
        }

        this.ruleForm.items_test_room = this.idsroomName[0].org_name
        if (this.value2 == 2) {
          this.ruleForm.inUse = '未使用'
        }
        if (this.value2 == 1) {
          this.ruleForm.inUse = '已使用'
        }

      },
      //新增点击保存(新增)
      adds() {
        this.addDataFun()
      },
      //新增保存数据的封装
      addDataFun() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            var data = this.ruleForm;
            if (data.inUse == '未使用') {
              data.inUse = 2
              Number(data.inUse)
            }
            if (data.inUse == '已使用') {
              data.inUse = 1
              Number(data.inUse)
            }
            if (data.itemCarType) {
              data.itemCarType = data.itemCarType.join(',');
            }
            this.idsProduct.forEach(item => {
              if (item.productName == data.itemCatalogId) {
                data.itemCatalogId = item.id
              }
            })
            this.idsroomName.forEach(item => {
              if (item.org_name == data.items_test_room) {
                data.items_test_room = item.id.toString()
              }
              if (item.org_name == data.items_test_room1) {
                data.items_test_room1 = item.id.toString()
              }
            })
            this.rejectReport = data
            this.$api.systemProject.addProject(data).then(res => {
              this.$message({type: 'success', message: '添加成功', duration: 1500});
              this.rejectReport.id = res.data.data;
              this.funAll(this.ruleForm)
              this.idsroomName.forEach(item => {
                if (item.id == this.ruleForm.items_test_room) {
                  this.ruleForm.items_test_room = item.org_name
                }
              })
              this.dialogFormVisible = false;
            }).catch(err => {
              this.$message({type: 'error', message: '添加失败', duration: 1500});
              this.idsroomName.forEach(item => {
                if (item.id == this.ruleForm.items_test_room) {
                  this.ruleForm.items_test_room = item.org_name
                }
              })
            })
          }
        })
      },
      //公用封装
      funAll(ruleFormNumber) {
        ruleFormNumber.itemCarType = ruleFormNumber.itemCarType.split(',')
      },
      //关闭对话框
      closeDialog(formName) {
        this.$nextTick(() => {
          this.$refs[formName].resetFields();
        });
        this.tableLocation(this.TableCurrentPage,this.TablePageSize);
        this.funreadCarProject()
      },
      //点击拷贝
      copyData(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.$confirm('确认要拷贝信息吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.rejectReport) {
                if (this.rejectReport.items_test_room || this.rejectReport.items_test_room1) {
                  this.idsroomName.forEach(items => {
                    if (items.org_name == this.idsroomName.items_test_room) {
                      this.idsroomName.items_test_room = items.id;
                    } else if (items.id == this.idsroomName.items_test_room) {
                      this.idsroomName.items_test_room = items.id;
                    }

                    if (items.org_name == this.idsroomName.items_test_room1) {
                      this.idsroomName.items_test_room1 = items.id;
                    } else if (items.id == this.idsroomName.items_test_room1) {
                      this.idsroomName.items_test_room1 = items.id;
                    }
                  })
                }
                if (this.rejectReport.itemCatalogId) {
                  this.idsProduct.forEach(items => {
                    if (items.productName == this.idsroomName.itemCatalogId) {
                      this.idsroomName.itemCatalogId = items.id;
                    } else if (items.id == this.idsroomName.itemCatalogId) {
                      this.idsroomName.itemCatalogId = items.id;
                    }
                  })
                }
                if (this.rejectReport.inUse == '已使用') {
                  this.rejectReport.inUse = 1
                }
                if (this.rejectReport.inUse == '未使用') {
                  this.rejectReport.inUse = 2
                }
                if (this.rejectReport.inUse == '') {
                  this.rejectReport.inUse = 0
                }
                if (this.rejectReport.itemCarType.length > 0) {
                  this.rejectReport.itemCarType = this.rejectReport.itemCarType.join(',');
                } else {
                  this.rejectReport.itemCarType = '';
                }
                this.$api.systemProject.copyProject(this.rejectReport).then(res => {
                  this.$message({type: 'success', message: '拷贝成功', duration: 1500});
                  this.ruleForm1.inUse == 2 ? this.ruleForm1.inUse = '未使用' : this.ruleForm1.inUse = '已使用';
                  this.funAll(this.rejectReport);
                }).catch(error => {
                  this.ruleForm1.inUse == 2 ? this.ruleForm1.inUse = '未使用' : this.ruleForm1.inUse = '已使用';
                  this.$message({type: 'error', message: error.data.message, duration: 1500});
                  this.funAll(this.rejectReport);
                })

              } else {
                this.$message({type: 'info', message: '请先点击保存', duration: 1500})
              }
            }).catch(error => {
              this.$message({type: 'info', message: '已取消拷贝', duration: 1500});
            })
          }
        })

      },
      //加载树形菜单
      getCate() {
        this.$api.systemProject.readProjectTree().then(res => {
          this.data = res.data.data;
          this.saveMsId = this.data[0].id;
          JSON.parse(localStorage.getItem("userInfo")).loginName == 'xtqx' ? this.indexIdFlag = true : this.indexIdFlag = false;
          this.tableLocation(1,10)
        });
      },
      //编辑保存数据的封装
      addUpdateFun() {
        this.$refs['ruleForm1'].validate((valid) => {
          if (valid) {
            let data = this.ruleForm1;
            if (data.inUse == '未使用') {
              data.inUse = 2
            }
            if (data.inUse == '已使用') {
              data.inUse = 1
            }
            if (data.itemCarType) {
              data.itemCarType = this.ruleForm1.itemCarType.join(',');
            }
            if (this.ruleForm1.items_test_room1) {
              data.items_test_room1 = this.ruleForm1.items_test_room1.toString()
            } else {
              data.items_test_room1 = ''
            }
            this.rejectReport = data;
            this.$api.systemProject.addProject(data).then(res => {
              this.$message({type: 'success', message: '修改成功', duration: 1500});
              this.ruleForm1.inUse == 2 ? this.ruleForm1.inUse = '未使用' : this.ruleForm1.inUse = '已使用';
              this.funAll(this.ruleForm1);
              this.dialogFormVisible1 = false;
            }).catch(err => {
              this.$message({type: 'error', message: '修改失败', duration: 1500});
              this.ruleForm1.inUse == 2 ? this.ruleForm1.inUse = '未使用' : this.ruleForm1.inUse = '已使用';
            })
          }
        })
      },
      //编辑点击保存（编辑）
      edits() {
        this.addUpdateFun()
      },
      //点击编辑
      handleEditor(index, row) {
        this.options.shift()
        this.dialogFormVisible1 = true;
        this.ruleForm1 = {
          id: row.id,
          items_itme_name: row.items_itme_name,
          items_test_basis: row.items_test_basis,
          items_item_code: row.items_item_code,
          itemsFrederickItme: row.itemsFrederickItme,
          items_item_samples_name: row.items_item_samples_name,
          itemsItemSamplesVolume: row.itemsItemSamplesVolume,
          needReport: row.needReport?row.needReport:'0',
          needTest: row.needTest?row.needTest:'1',
          items_cover_logo1: row.items_cover_logo1,
          items_test_type: row.items_test_type,name: 'systemproject',
          items_charges: row.items_charges,
          items_test_room: '', /*检验科室*/
          itemCatalogId: '', /*所属类型*/
          items_test_room1: '', /*备选科室*/
          itemId: row.itemId,
          orderby: row.orderby,
          sign1: row.sign1,
          sign2: row.sign2,
          sign3: row.sign3,
          sign4: row.sign4,
          sign5: row.sign5,
          inUse: '2', /*是否*/
          itemSign: row.itemSign,
          standardSign: row.standardSign,
          itemNote: row.itemNote,
          itemCarType: [], /*多选框*/
          copyitems_test_room: row.copyitems_test_room ? row.copyitems_test_room : '', /*拷贝到select*/
          copyItemCatalogId: row.copyItemCatalogId ? row.copyItemCatalogId : ''/*拷贝到select*/
        }
        this.idsroomName.forEach(items => {
          items.id = items.id.toString()
          row.items_test_room = row.items_test_room.toString()
          if (row.items_test_room1) {
            row.items_test_room1 = row.items_test_room1.toString()
          } else {
            row.items_test_room1 = ''
          }
          if (items.id == row.items_test_room) {
            this.ruleForm1.items_test_room = row.items_test_room;
          }
          if (items.id == row.items_test_room1) {
            this.ruleForm1.items_test_room1 = row.items_test_room1;
          }
        });
        this.ruleForm1.itemCatalogId = row.itemcatalog.id;
        if (row.itemCarType != null) {
          var arrC = []
          var arrchick = row.itemCarType.split(',')
          this.options.forEach(item => {
            arrchick.forEach(it => {
              if (item.typeName === it) {
                arrC.push(item.typeName)

              }
            })
          })
          for (var i = 0; i < arrC.length; i++) {
            for (var j = i + 1; j < arrC.length; j++) {
              if (arrC[i] == arrC[j]) {
                arrC.splice(j, 1);
                j--;
              }
            }
          }
          this.ruleForm1.itemCarType = arrC
        } else {
          this.ruleForm1.itemCarType = []
        }
        if (row.inUse == 0) {
          this.ruleForm1.inUse = ''
        }
        if (row.inUse == 1) {
          this.ruleForm1.inUse = '已使用'
        }
        if (row.inUse == 2) {
          this.ruleForm1.inUse = '未使用'
        }
        this.rejectReport = this.ruleForm1;
      },
      //查看
      handleView(index, row) {
        this.options.shift()
        this.dialogFormVisible2 = true;
        this.ruleForm2 = {
          id: row.id,
          items_itme_name: row.items_itme_name,
          items_test_basis: row.items_test_basis,
          items_item_code: row.items_item_code,
          itemsFrederickItme: row.itemsFrederickItme,
          items_item_samples_name: row.items_item_samples_name,
          itemsItemSamplesVolume: row.itemsItemSamplesVolume,
          needReport: row.needReport?row.needReport:'0',
          needTest: row.needTest?row.needTest:'1',
          items_cover_logo1: row.items_cover_logo1,
          items_test_type: row.items_test_type,
          items_charges: row.items_charges,
          items_test_room: '', /*检验科室*/
          itemCatalogId: '', /*所属类型*/
          items_test_room1: '', /*备选科室*/
          itemId: row.itemId,
          orderby: row.orderby,
          sign1: row.sign1,
          sign2: row.sign2,
          sign3: row.sign3,
          sign4: row.sign4,
          sign5: row.sign5,
          inUse: '2', /*是否*/
          itemSign: row.itemSign,
          standardSign: row.standardSign,
          itemNote: row.itemNote,
          itemCarType: [], /*多选框*/
        }
        this.idsroomName.forEach(items => {
          items.id = items.id.toString()
          row.items_test_room = row.items_test_room.toString()
          if (row.items_test_room1) {
            row.items_test_room1 = row.items_test_room1.toString()
          } else {
            row.items_test_room1 = ''
          }

          if (items.id == row.items_test_room) {
            this.ruleForm2.items_test_room = row.items_test_room;
          }
          if (items.id == row.items_test_room1) {
            this.ruleForm2.items_test_room1 = row.items_test_room1;
          }
        });
        this.ruleForm2.itemCatalogId = row.itemcatalog.id;
        if (row.itemCarType != null) {
          var arrC = []
          var arrchick = row.itemCarType.split(',')
          this.options.forEach(item => {
            arrchick.forEach(it => {
              if (item.typeName === it) {
                arrC.push(item.typeName)

              }
            })
          })
          for (var i = 0; i < arrC.length; i++) {
            for (var j = i + 1; j < arrC.length; j++) {
              if (arrC[i] == arrC[j]) {
                arrC.splice(j, 1);
                j--;
              }
            }
          }
          this.ruleForm2.itemCarType = arrC
        } else {
          this.ruleForm2.itemCarType = []
        }
        if (row.inUse == 0) {
          this.ruleForm2.inUse = ''
        }
        if (row.inUse == 1) {
          this.ruleForm2.inUse = '已使用'
        }
        if (row.inUse == 2) {
          this.ruleForm2.inUse = '未使用'
        }
      },
      //删除
      handleDelete(index, row) {
        this.$confirm('确认要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.systemProject.deleteProject(row.ids).then(res => {
            this.$message({type: 'success', message: '删除成功', duration: 1500});
            this.tableLocation(this.TableCurrentPage,this.TablePageSize);
          }).catch(err => {
            this.$message({type: 'error', message: '删除失败', duration: 1500});
          })
        }).catch(err => {
          this.$message({type: 'info', message: '已取消删除', duration: 1500});
        })
      },

      handleCopy(index, row) {

      },
      handlePour(index, row) {
      },
      handleParameter(index, row) {
      },
      //获取表单所属类型和科室
      funshuKe() {
        //获取所属类型
        this.$api.systemProject.readProjectItem().then(res => {
          this.idsProduct = res.data.data;
        }).catch(error => {
          this.$message({type: 'error', message: '所属类型数据获取失败', duration: 1500});
        })
        //获取科室
        this.$api.systemProject.readProject().then(res => {
          this.idsroomName = res.data.data;
        }).catch(err => {
          this.$message({type: 'error', message: '检验科室数据获取失败', duration: 1500});
        })
      },
      //获取车辆类型
      funreadCarProject() {
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
      handleNodeClick(data) {
        this.saveMsId = data.id
        this.tableLocation(1,10)
      },
      currentChange(node) {
      },
      cellStyle({row, column, rowIndex, columnIndex}) {
        return "text-align:center"
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //分页
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.currentPage4 = val;
      },
      //点击取消
      closeBtnClick(formName, TableCurrentPage, TablePageSize) {
        this.dialogFormVisible = false;
        this.dialogFormVisible1 = false;
        this.$refs[formName].resetFields();
        this.tableLocation(TableCurrentPage,TablePageSize);
      },
      currentChange(node) {
      },
      cellStyle({row, column, rowIndex, columnIndex}) {
        return "text-align:center"
      },
      //分页
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.currentPage4 = val;
      },
      //表格重载封装
      tableLocation(TableCurrentPage,TablePageSize) {
        this.loading = true;
        let value1 = '';
        if (this.type === '1') {
          this.value2 = '1';
        }
        if (this.value1 == '全部') {
          value1 = ''
        } else {
          value1 = this.value1;
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
          console.log(res, 'res')
          this.tableData = res.data.data.data;
          this.loading = false;
          if(res.data.data.total > 0){
            this.TableTotal = res.data.data.total;
          }else{
            this.TableTotal = 0;
            this.TableCurrentPage = 1;
            this.TablePageSize = 10;
          }
          if (this.tableData.length == 0) {
            return
          } else {
            this.ruleForm.itemCatalogId = this.tableData[0].itemcatalog.productName
          }
          this.tableData.forEach(item => {
            item.property = 1;
            item.itemsItemIssuanceDate = ""
            item.itemsSampleDate = ""
            item.samplesSpecifications = ""
            item.samplesManufacturers = ""
            item.samplesProperty = ""
            item.samplesCode = ""
            item.sampleComeDate = ""
          })
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500});
          this.loading = false;
        })
      },
      // 回车查询
      enterQuery(e) {
        var keyCode = window.event ? e.keyCode : e.which;
        if (keyCode == 13) {
          this.tableLocation(1, 10);
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //分页
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.currentPage4 = val;
      },
      change(scope) {
        this.tableData = this.tableData.slice(0);
        setTimeout(() => {
          this.selectioned.forEach(row => {
            this.$refs.table1.toggleRowSelection(row);
          });
        }, 0)
        // this.$forceUpdate();
      },
      selectPro() {
        if (this.delAllData.length <= 0) {
          return this.$message({type: 'warning', message: '请选择检验项目！', duration: 1500});
        } else {
          this.$emit("updateTable", this.delAllData);
        }
      },
      //新增限制长度
      changeNum: function (e) {
        if (this.ruleForm.orderby.length > 4) {
          this.ruleForm.orderby = this.ruleForm.orderby.slice(0, 4)
        }
        if (this.ruleForm.items_charges.length > 9) {
          this.ruleForm.items_charges = this.ruleForm.items_charges.slice(0, 9)
        }
      },
      //编辑限制长度
      changeNumEdit() {
        if (this.ruleForm1.orderby.length > 4) {
          this.ruleForm1.orderby = this.ruleForm1.orderby.slice(0, 4)
        }
        if (this.ruleForm1.items_charges.length > 9) {
          this.ruleForm1.items_charges = this.ruleForm1.items_charges.slice(0, 9)
        }
      },
      dialogCheck(selection, row) {
        this.selectioned = selection;
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.tableHeight = this.$refs.el_main_table_box.offsetHeight;
      })
      this.funreadCarProject()
      this.funshuKe()
      this.getCate();
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

/deep/  .el-aside {
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
        overflow: hidden;
        .el-col {
          height: 100%;
          overflow: hidden;
        }
      }
    }

    .el-tree {
      height: 100%;
      overflow-y: auto;
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

  .top b {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    position: absolute;
    right: 0;
    top: 0;
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
      overflow: hidden;
    }

    hr {
      width: 90%;
      margin: 0 auto;
      border: 0;
      border-bottom: 1px solid rgba(0, 0, 0, .1);
    }

    .el-form-item {
      .el-input,
      .el-select,
      .el-radio-group {
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

  body > .el-container .el-aside .el-select .el-input__inner {
    position: absolute;
    top: 5px;
  }

  .el-aside .el-input__inner {
    position: absolute;
    top: 5px;
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
  .query_search .el-form-item{
      width: 18%;
      margin: 0;
      display: flex;
  }
  /deep/ .query_search .el-form-item__content {
      flex: 1;
  }
  /deep/ .query_search .el-select , .query_search .el-input{
      width: 100% !important;
  }
  .reset_btn {
    margin: 0 !important;
    margin-left: 10px !important;
    background: #909399 !important;
    border-color: #909399 !important;
  }
</style>
