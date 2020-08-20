<template>
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
                      <el-button type="text"
                                @click="handlebinding(scope.row)"
                                size="mini"
                                style="color:red;marginLeft:6px;">绑定模板
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
              <!-- 新增字段 -->
              <el-form-item label="所需设备" prop="">
                <el-input placeholder="请选择设备"  :readonly="true" v-model="equipmentvalue">
                  <el-button slot="append" icon="el-icon-search" @click="equipmentselection"/>
                </el-input>
              </el-form-item>

            </el-form>
             <hr/>
            <div class="standardCost">
              <h2>标准费用&nbsp;&nbsp;<el-button type="primary" class="bespoke" @click="newData(true)">新增</el-button></h2>
              <table  border="1" cellspacing="0" cellpadding="0">
                <tr>
                  <th>科室代码</th>
                  <th>科室名称</th>
                  <th>试验费用</th>
                  <th>排序号</th>
                  <th>显示编辑按钮</th>
                  <th>启用日期</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                <tr v-for="(item,index) in standardData" :key="index">
                  <td>{{item.orgabc}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.charges2}}</td>
                  <td>{{item.orderby}}</td>
                  <td>{{item.buttonflag | fnbuttonflag}}</td>
                  <td>{{item.startDate}}</td>
                  <td>{{item.taskflag | swhetaskflag}}</td>
                  <td><span class="skbColor" @click="newData(false,item)">编辑</span>&nbsp;&nbsp;<span class="skbColor" @click="delData(item)"> 删除</span></td>
                </tr>
              </table>
            </div>
            <div class="standardCost">
              <h2>辅助费用&nbsp;&nbsp;<el-button type="primary" class="bespoke" @click="newotherexpenses(true)">新增</el-button></h2>
              <table  border="1" cellspacing="0" cellpadding="0">
                <tr>
                  <th>科室</th>
                  <th>名称</th>
                  <th>费用按钮</th>
                  <th>价格</th>
                  <th>公式</th>
                  <th>操作</th>
                </tr>
                <tr v-for="(item,index) in otherexpenses" :key="index">
                  <td>{{item.orgabc}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.buttonflag | ancillary }}</td>
                  <td>{{item.charges3}}</td>
                  <td>{{item.formual}}</td>
                  <td><span class="skbColor" @click="newotherexpenses(false,item)">编辑</span>&nbsp;&nbsp;<span class="skbColor" @click="objdelDat(item)"> 删除</span></td>
                </tr>
              </table>
            </div>
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
              <el-form-item label="所需设备" prop="">
                <el-input placeholder="请选择设备"  :readonly="true" v-model="equipmentvalue">
                  <el-button slot="append" icon="el-icon-search" @click="equipmentselection"/>
                </el-input>
              </el-form-item>
            </el-form>
             <hr/>
            <div class="standardCost">
              <h2>标准费用&nbsp;&nbsp;<el-button type="primary" class="bespoke" @click="newData(true)">新增</el-button></h2>
              <table  border="1" cellspacing="0" cellpadding="0">
                <tr>
                  <th>科室代码</th>
                  <th>科室名称</th>
                  <th>试验费用</th>
                  <th>排序号</th>
                  <th>显示编辑按钮</th>
                  <th>启用日期</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                <tr v-for="(item,index) in standardData" :key="index">
                  <td>{{item.orgabc}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.charges2}}</td>
                  <td>{{item.orderby}}</td>
                  <td>{{item.buttonflag | fnbuttonflag}}</td>
                  <td>{{item.startDate}}</td>
                  <td>{{item.taskflag | swhetaskflag}}</td>
                  <td><span class="skbColor" @click="newData(false,item)">编辑</span>&nbsp;&nbsp;<span class="skbColor" @click="delData(item)"> 删除</span></td>
                </tr>
              </table>
            </div>
            <div class="standardCost">
              <h2>辅助费用&nbsp;&nbsp;<el-button type="primary" class="bespoke" @click="newotherexpenses(true)">新增</el-button></h2>
              <table  border="1" cellspacing="0" cellpadding="0">
                <tr>
                  <th>科室</th>
                  <th>名称</th>
                  <th>费用按钮</th>
                  <th>价格</th>
                  <th>公式</th>
                  <th>操作</th>
                </tr>
                <tr v-for="(item,index) in otherexpenses" :key="index">
                  <td>{{item.orgabc}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.buttonflag | ancillary }}</td>
                  <td>{{item.charges3}}</td>
                  <td>{{item.formual}}</td>
                  <td><span class="skbColor" @click="newotherexpenses(false,item)">编辑</span>&nbsp;&nbsp;<span class="skbColor" @click="objdelDat(item)"> 删除</span></td>
                </tr>
              </table>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" :loading="isstart" @click="edits">保存</el-button>
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
              :disabled= true
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
              <el-form-item label="所需设备" prop="">
                <el-input placeholder="请选择设备"  :readonly="true" v-model="equipmentvalue" disabled>
                  <el-button slot="append" icon="el-icon-search" @click="equipmentselection" disabled/>
                </el-input>
              </el-form-item>
            </el-form>
            <hr/>
            <div class="standardCost sizeclor">
              <h2>标准费用&nbsp;&nbsp;</h2>
              <table  border="1" cellspacing="0" cellpadding="0">
                <tr>
                  <th>科室代码</th>
                  <th>科室名称</th>
                  <th>试验费用</th>
                  <th>排序号</th>
                  <th>显示编辑按钮</th>
                  <th>启用日期</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                <tr v-for="(item,index) in standardData" :key="index">
                  <td>{{item.orgabc}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.charges2}}</td>
                  <td>{{item.orderby}}</td>
                  <td>{{item.buttonflag | fnbuttonflag}}</td>
                  <td>{{item.startDates}}</td>
                  <td>{{item.taskflag | swhetaskflag}}</td>
                  <td><span >编辑</span>&nbsp;||&nbsp;<span > 删除</span></td>
                </tr>
              </table>
            </div>
            <div class="standardCost sizeclor">
              <h2>辅助费用&nbsp;&nbsp;</h2>
              <table  border="1" cellspacing="0" cellpadding="0">
                <tr>
                  <th>科室</th>
                  <th>名称</th>
                  <th>费用按钮</th>
                  <th>价格</th>
                  <th>公式</th>
                  <th>操作</th>
                </tr>
                <tr v-for="(item,index) in otherexpenses" :key="index">
                  <td>{{item.orgabc}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.buttonflag | ancillary }}</td>
                  <td>{{item.charges3}}</td>
                  <td>{{item.formual}}</td>
                  <td><span>编辑</span>&nbsp;&nbsp;<span> 删除</span></td>
                </tr>
              </table>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible2 = false">取 消</el-button>
            </div>
          </el-dialog>
          <!--标准费用新增按钮对话框  -->
          <el-dialog
            title="标准费用"
            :visible.sync="cost"
            width="40%"
            :before-close="costHandleClose">
            <div class="costlayout">
                <el-form ref="costform" :model="costform" label-width="100px">
                  <el-form-item label="费用名称">
                    <el-input v-model="costform.name"></el-input><span class="reds">*</span>
                  </el-form-item>
                  <el-form-item label="试验费用">
                    <el-input v-model="costform.charges2"></el-input><span class="reds">*</span>
                  </el-form-item>
                  <el-form-item label="打折率">
                    <el-input v-model="costform.discount"></el-input><span class="reds">*</span>
                    <br />
                    <span class="red">例如:不打折 100 ,98折填写数据 98</span>
                  </el-form-item>
                  <el-form-item label="显示编辑按钮">
                    <el-switch
                      v-model="costform.buttonflag"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                  </el-form-item>
                  <el-form-item label="排序号">
                    <el-input v-model="costform.orderby"></el-input>
                  </el-form-item>
                  <el-form-item label="对账科室">
                    <el-select v-model="costform.orgabc" placeholder="请选择对账科室">
                      <el-option
                        v-for="item in department"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select><span class="reds">*</span>
                  </el-form-item>
                  <el-form-item label="启用日期">
                    <el-col :span="11">
                      <el-date-picker 
                        type="date" 
                        placeholder="选择日期" 
                        v-model="costform.startDate" 
                        style="width: 100%;"
                      >
                      </el-date-picker>
                    </el-col><span class="reds">*</span>
                  </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="cost = false">取 消</el-button>
              &nbsp;
              <el-button type="primary" @click="costSubmit">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 辅助费用新增按钮对话框 -->
          <el-dialog
            title="辅助费用"
            :visible.sync="otherStandard "
            width="40%"
            :before-close="tandardhandleClose">
              <div class="costlayout">
                <el-form ref="standardform" :model="otherform" label-width="100px">
                  <el-form-item label="科室代码">
                    <el-select v-model="otherform.orgabc" placeholder="请选择对账科室">
                      <el-option
                        v-for="item in ojbment"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="辅助费用名称">
                    <el-input v-model="otherform.name"></el-input><span class="reds">*</span>
                  </el-form-item>

                  <el-form-item label="单价">
                    <el-input v-model="otherform.charges3"></el-input><span class="reds">*</span>
                  </el-form-item>

                  <el-form-item label="复杂公式">
                    <el-input v-model="otherform.formual"></el-input>
                  </el-form-item>

                  <el-form-item label="费用按钮">
                    <el-select v-model="otherform.buttonflag" placeholder="请选择">
                      <el-option
                        v-for="item in objflag"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                </el-form>
              </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="otherStandard = false">取 消</el-button>
              &nbsp;&nbsp;
              <el-button type="primary" @click="outerSubmit">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 所需设备按钮对话框 -->
          <el-dialog
            title="选择设备"
            :visible.sync="equipmentBtn"
            width="90%"
            top="20px"
            append-to-body
            >
            <div style="height: 600px;">
                    <el-form
                        v-bind="{
                            size:'mini',
                            labelWidth:'90px',
                            labelSuffix:' :'
                        }"
                    >
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="设备编号">
                                    <el-input v-model="code_c"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="设备名称">
                                    <el-input v-model="name_c"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="设备型号">
                                    <el-input v-model="model_c"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <p style="text-align: right;margin: 0;padding: 0;">
                                    <el-button type="primary" size="mini" @click="queryequipment" >查询</el-button>
                                </p>
                            </el-col>
                        </el-row>
                    </el-form>
                    
                    <el-table
                        v-bind="{
                            height:'450px',
                            data:tableData_c,
                            border:true,
                        }"
                    >
                        <el-table-column
                            v-bind="{
                                width:'55',
                                label:'',
                                resizable:false,
                                align:'center',
                                property:'',
                            }"
                        >
                            <template slot-scope="{ row }">
                                <el-checkbox v-model="row.checkCur" :label="0" @change="checkedCur(row)"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-bind="{
                                label:'设备编号',
                                resizable:false,
                                align:'center',
                                property:'code',
                            }"
                        >
                        </el-table-column>
                        <el-table-column
                            v-bind="{
                                label:'设备型号',
                                resizable:false,
                                align:'center',
                                property:'model',
                            }"
                        >
                        </el-table-column>
                        <el-table-column
                            v-bind="{
                                label:'设备名称',
                                resizable:false,
                                align:'center',
                                property:'name',
                            }"
                        >
                        </el-table-column>
                        <el-table-column
                            v-bind="{
                                label:'所属科室',
                                resizable:false,
                                align:'center',
                                property:'',
                            }"
                        >
                        </el-table-column>
                    </el-table>
                     <div class="pagingdevice">
                      <el-pagination
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="total_c"
                          :current-page="currentPage_c"
                          :page-size="pageSize_c"
                          @current-change="currentChange_c"
                      />
                     </div>
                    <p style="text-align: center; margin-top: 10px;">
                        <el-button size="mini" type="primary" @click="pushDataFn_c">确定</el-button>
                        <el-button size="mini" @click="cancelFn1_c">取消</el-button>
                    </p>
                </div>
            
          </el-dialog>
          <!-- 绑定模板按钮对话框 -->
          <el-dialog
            title="绑定模板"
            :visible.sync="dialogbinding"
            width="80%"
            top="20px"
            >
            <div>
                  <el-table
                    ref="multipleTable"
                    :data="bindingData"
                    tooltip-effect="dark"
                    style="width: 100%; "
                   >
                    <el-table-column
                      width="55">
                      <template slot-scope="{ row }">
                          <el-checkbox v-model="row.check" :label="0" @change="bindingmoban(row)"></el-checkbox>
                      </template>
                    </el-table-column>
                    <el-table-column
                      type="index"
                      width="50">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="模板名称"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="createTime"
                      label="创建时间"
                      >
                      <template slot-scope="{ row }">
                          {{row.createTime | timeFn}}
                      </template>
                    </el-table-column>
                  </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogbinding = false">取 消</el-button>
              &nbsp;&nbsp;
              <el-button type="primary" @click="bindsave">确 定</el-button>
              &nbsp;&nbsp;
              <el-button type="primary" @click="newlyBuild">新建</el-button>
            </span>
            <div class="pagingdevice">
            <el-pagination
                @size-change="bindingHandleSizeChange"
                @current-change="bindingHandleCurrentChange"
                :current-page="bindingCurrentPage"
                :page-sizes="[10,20,30]"
                :page-size="bindingPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="bindingTotal">
              </el-pagination>
            </div>
          </el-dialog>


        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
  import base from '@/api/base'
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
        // 新增
        standardData:[ //标准费用数据存储
        ],
        cost:false, //控制标准费用新增弹窗显示隐藏
        costform: { //标准费用from
          id:'',
          idst:'',
          itemid:'',
          name: '', //科室名称
          charges2: '',//单价（元）
          discount: '',//打折率
          orderby: '',//排序号
          orgabc : '',//科室代码
          startDate:'',//启用日期
          buttonflag:true, //显示编辑按钮
          taskflag:1, //状态
        },
        department:[],//科室数据
        issendnet:true,// 判断标准费用是点击  新增按钮 还是 编辑按钮 调用的公共组件 
        delitem:[],// 存标准费用删除数据的id
        edititem:[],// 存标准费用编辑数据的id
        otherexpenses:[//辅助费用数据存储
        ],
        otherStandard:false,//控制其他费用新增弹窗显示隐藏
        otherform:{//辅助费用from
          id: "",
          idst:'',
          buttonflag: 0,
          charges3: 0,
          formual: null,
          name: "",
          orgabc: "",
        },
        objflag:[
          {label:'不显示',value:0},
          {label:'显示',value:2},
        ],
        ojbment:[],//科室代码
        objnet:true,// 判断辅助费用是点击  新增按钮 还是 编辑按钮 调用的公共组件 
        objdelitem:[],// 存辅助费用删除数据的id
        objedititem:[],// 存辅助费用编辑数据的id
        oneLength:false,
        equipmentBtn:false,//设备选中对话框
        tableData_c:[],
        total_c: 0,
        currentPage_c: 1,
        pageSize_c: 15,
        code_c: '',
        name_c: '',
        model_c: '',
        saveId_c:[],
        saveName_c:[],
        equipmentvalue:'',// 选中的设备回显
        dialogbinding:false,// 控制模板绑定对话框显示隐藏
        bindingData:[],
        bandSelection: [],//全选
        bindingCurrentPage: 1, // 绑定模板列表-当前页
        bindingPageSize: 10, // 绑定模板列表-每页的条数
        bindingTotal:0,//绑定模板列表-总数
        rowid:'',//检验项目id
        isstart:false,
        src:'static/OriginalRecord/template/template.html'//编辑原始记录模板路径
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
        this.standardData = [];
        this.otherexpenses = [];
        this.equipmentvalue = '';
        this.saveId_c= [];
        this.saveName_c=[];
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
            
            this.rejectReport = data;
            this.auxiliarystandard();
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
              this.otherexpenses = [];
              this.standardData = [];
              this.delitem=[];// 存标准费用删除数据的id
              this.edititem=[];// 存标准费用编辑数据的id
              this.objdelitem = [];// 存辅助费用删除数据的id
              this.objedititem = [];// 存辅助费用编辑数据的id
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
                this.auxiliarystandard();
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
              data.items_test_room1 = '';
            }
            this.rejectReport = data;
            this.standardData.forEach(item => {
              if(item.buttonflag == false){
                item.buttonflag = 0
              }else{
                item.buttonflag = 1
              }
            });
            this.auxiliarystandard(); // 标准费用插入  辅助费用插入
            this.isstart = true;
            this.$api.systemProject.addProject(data).then(res => {
              this.$message({type: 'success', message: '修改成功', duration: 1500});
              this.ruleForm1.inUse == 2 ? this.ruleForm1.inUse = '未使用' : this.ruleForm1.inUse = '已使用';
              this.funAll(this.ruleForm1);
              this.dialogFormVisible1 = false;
              this.isstart = false
              this.delitem=[];// 存标准费用删除数据的id
              this.edititem=[];// 存标准费用编辑数据的id
              this.objdelitem = [];// 存辅助费用删除数据的id
              this.objedititem = [];// 存辅助费用编辑数据的id
            }).catch(err => {
              this.$message({type: 'error', message: '修改失败', duration: 1500});
              this.ruleForm1.inUse == 2 ? this.ruleForm1.inUse = '未使用' : this.ruleForm1.inUse = '已使用';
              this.isstart = false
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
        row.chargeList.forEach(item => {
          item.startDate = item.startDate.toString().replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
        });
        this.standardData = row.chargeList;
        this.otherexpenses = row.objectChargeList;
        console.log(row)
        this.equipmentvalue = '';
        this.saveId_c= [];
        this.saveName_c=[];
        if(row.terminalNames.length == 0){
          this.equipmentvalue = '';
          this.saveName_c=[];
        }else{
          this.equipmentvalue = row.terminalNames;
          this.saveName_c=row.terminalNames.split(",");
        }
        this.saveId_c= row.terminalIds;
        
        
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
        this.standardData = row.chargeList;
        this.otherexpenses = row.objectChargeList
        if(row.terminalNames.length == 0){
          this.equipmentvalue = '';
          this.saveName_c=[];
        }else{
          this.equipmentvalue = row.terminalNames;
          this.saveName_c=row.terminalNames.split(",");
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
      },
      getDepartment(){  //获取科室数据
        this.department = []
        this.$api.financial.departmentList().then(res => {
          let orgList = res.data.data;
          orgList.forEach(item => {
            let obj = {value: item.org_abc, label: item.org_name}
            this.department.push(obj)
          });
        })
      },
      newData(isidentification,item){  //标准费用，新增 编辑
        
        if(isidentification){
          let d = new Date();
          this.costform = { //标准费用from
            id:'',
            idst : d.getTime(),
            itemid:'',
            name: '', //科室名称
            charges2: '',//单价（元）
            discount: '',//打折率
            orderby: '',//排序号
            orgabc : '',//科室代码
            startDate:'',//启用日期
            buttonflag:true, //显示编辑按钮
            taskflag:1, //状态
          }
          this.issendnet = true
        }else{
           if(item.buttonflag == 0){
              item.buttonflag = false
            }else{
              item.buttonflag = true
            }
          this.costform = { //标准费用from
            id:item.id,
            ids:item.id,
            idst:item.idst,
            itemid:item.itemid,
            name: item.name, //科室名称
            charges2: item.charges2,//单价（元）
            discount: item.discount,//打折率
            orderby: item.orderby,//排序号
            orgabc : item.orgabc,//科室代码
            startDate:new Date(item.startDate),//启用日期
            buttonflag:item.buttonflag, //显示编辑按钮
            taskflag:item.taskflag, //状态
          }
           this.issendnet = false
        }
        this.cost = true;
      }, 
      delData(data){ //标准费用，删除按钮
        this.standardData.forEach((item,index) => {
          if(item.id){
            if(item.id == data.id){
              this.standardData.splice(index, 1);
              this.delitem.push(item.id)
            }
          }else{
            if(item.idst == data.idst){
              this.standardData.splice(index, 1);
            }
          }
        });
      },
      costHandleClose(done){ //标准费用关闭
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      tandardhandleClose(){ //其他费用关闭按钮
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      costSubmit(){ //标准费用新增提交按钮   编辑按钮
         
          if(this.costform.name == ''){
            this.$message({type: 'error', message: '请填写科室名称', duration: 1500});
            return false;
          }
          if(this.costform.charges2 == ''){
            this.$message({type: 'error', message: '请填写试验费用', duration: 1500});
            return false;
          }
          let reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^[1-9]$)|(^\d\.[1-9]{1,2}$)|(^\d\.[0]{1}[1-9]{1}$|(^\d\.[1-9]{1}[0]{1}$)$)/;
           if (!reg.exec(this.costform.charges2)) {
              this.$message({type: 'error', message: '试验费用输入错误', duration: 1500});
              return false;
          }
          if(this.costform.discount == ''){
            this.$message({type: 'error', message: '请填写打折率', duration: 1500});
            return false;
          }
          if(this.costform.orgabc == ''){
            this.$message({type: 'error', message: '请填写对账科室', duration: 1500});
            return false;
          }
          if(this.costform.startDate == ''){
            this.$message({type: 'error', message: '请填写启用日期', duration: 1500});
            return false;
          }
          let d = new Date(this.costform.startDate);
          let datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
          let issueyear,issyear;
          if (datetime) {
            issueyear = datetime.replace(/\”/g, ""); //下达日期 正则去掉‘-’

          } else {
            issueyear = ''
          };
          let currentTime = new Date();
          let datems = currentTime.getDate()
          let dattems ;
          if(datems < 10){
            dattems = '0'+ datems
          }else{
            dattems = datems
          }
          let yuer = currentTime.getMonth()+1
          let yers;
          if(yuer < 10){
            yers = '0'+yuer
          }else{
            yers = yuer
          }
          let getDate = currentTime.getFullYear()+'-'+yers+'-'+dattems
          var arrStart = issueyear.split("-");
          var startTime = new Date(arrStart[0], arrStart[1], arrStart[2]);
          var startTimes = startTime.getTime();
          var arrEnd = getDate.split("-");
          var endTime = new Date(arrEnd[0], arrEnd[1], arrEnd[2]);
          var endTimes = endTime.getTime();
          if (endTimes >= startTimes){
            this.$message('启用日期不能小于当前日期');
            return false;
          }
          // console.log(issueyear)
          // console.log(this.costform)
          let yue = d.getMonth() + 1
          let yues;
          if(yue < 10){
            yues = '0'+yue
          }else{
            yues = yue
          }
          let ri = d.getDate()
          let ris;
          if(ri < 10){
            ris = '0'+ri
          }else{
            ris = ri
          }
          issyear = d.getFullYear() + '-' + yues + '-' + ris
          this.costform.startDate = issyear
          if(this.issendnet){  // true 就是新增
            if(this.costform.buttonflag == true){
              this.costform.buttonflag = 1
            }else{
              this.costform.buttonflag = 0
            }
            this.standardData.push(this.costform)
          }else{ //false 就是编辑
            this.standardData.forEach((item,index) => {
                if(item.id){
                  if(item.id == this.costform.id){
                      this.standardData.splice(index,1,this.costform);
                      this.edititem.push(item.id)
                  }
                }else{
                  if(item.idst == this.costform.idst){
                      this.standardData.splice(index,1,this.costform);
                  }
                }
                if(item.buttonflag == 0){
                  item.buttonflag = false
                }else{
                  item.buttonflag = true
                }
            });
          }
          this.cost = false;
      },
      objdelDat(data){//辅助费用，删除按钮
        this.otherexpenses.forEach((item,index) => {
          if(item.id){
            if(item.id == data.id){
              this.otherexpenses.splice(index, 1);
              this.objdelitem.push(item.id)
            }
          }else{
            if(item.idst == data.idst){
              this.otherexpenses.splice(index, 1);
            }
          }
        });
      },
      newotherexpenses(isshow,item){ //辅助费用，新增按钮  编辑按钮 
        this.ojbment = [];
        //吧标准费用列表中的科室代码的集合赋给辅助费用的科室代码
        for(let i=0; i<this.department.length;i++){
            for(let t=0; t<this.standardData.length; t++){
              if(this.department[i].value == this.standardData[t].orgabc){
                this.ojbment.push(this.department[i])
              }
            }
        }
        if(isshow){ //新增
          let d = new Date();
          this.otherform = {//辅助费用from
            id: "",
            idst:d.getTime(),
            buttonflag: 0,
            charges3: '',
            formual: null,
            name: "",
            orgabc: "",
          };
          this.objnet = true
        }else{//编辑
          this.otherform = {//辅助费用from
            id: item.id,
            itemid:item.itemid,
            idst:item.idst,
            buttonflag: item.buttonflag,
            charges3: item.charges3,
            formual: item.formual,
            name: item.name,
            orgabc: item.orgabc,
          };
           this.objnet = false
        }
         this.otherStandard = true;
      },
      outerSubmit(){//辅助费用新增提交按钮   编辑按钮

        if(this.otherform.orgabc == ''){
          this.$message({type: 'error', message: '请填写对账科室', duration: 1500});
          return false;
        }
        if(this.otherform.name == ''){
          this.$message({type: 'error', message: '请填写辅助费用名称', duration: 1500});
          return false;
        }
        if(this.otherform.charges3 == ''){
          this.$message({type: 'error', message: '请填写单价', duration: 1500});
          return false;
        }
        let reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^[1-9]$)|(^\d\.[1-9]{1,2}$)|(^\d\.[0]{1}[1-9]{1}$|(^\d\.[1-9]{1}[0]{1}$)$)/;
        if (!reg.exec(this.otherform.charges3)) {
          this.$message({type: 'error', message: '试验费用输入错误', duration: 1500});
          return false;
        }
        if(this.objnet){
          this.otherexpenses.push(this.otherform)
          console.log(this.otherexpenses)
        }else{
          this.otherexpenses.forEach((item,index) => {
              if(item.id){
                if(item.id == this.otherform.id){
                    this.otherexpenses.splice(index,1,this.otherform);
                    this.objedititem.push(item.id)
                }
              }else{
                if(item.idst == this.otherform.idst){
                    this.otherexpenses.splice(index,1,this.otherform);
                }
              }
          });
           console.log(this.otherexpenses)
        }
        this.otherStandard = false
      },
      auxiliarystandard(){  // 标准费用插入  辅助费用插入  设备选择插入
        // 标准费用插入
            let objString = JSON.stringify(this.standardData);
            let satdata = JSON.parse(objString);
            satdata.forEach((item,index) => {
                item.startDate = item.startDate.replace(/-/g,'')
            });
            this.rejectReport.chargeList = satdata;
            this.edititem = [...new Set(this.edititem)]
            let _edititem=new Set(this.edititem);
            let _delitem=new Set(this.delitem);
            let arr = Array.from(new Set([..._edititem].filter(x => !_delitem.has(x))));
            this.rejectReport.chargeUpdateId = arr.join()
            this.rejectReport.chargeDeleteId = this.delitem.join()
            // 辅助费用插入
            this.objedititem = [...new Set(this.objedititem)]
            let _objdelitem=new Set(this.objdelitem);
            let _objedititem=new Set(this.objedititem);
            let objarr = Array.from(new Set([..._objedititem].filter(x => !_objdelitem.has(x))));
            let otherexpenses_copy = JSON.parse(JSON.stringify(this.otherexpenses))
            otherexpenses_copy.forEach(item => {
              item.charges2 = item.charges3;
            });
            console.log(otherexpenses_copy)
            this.rejectReport.objectChargeList = otherexpenses_copy;
            this.rejectReport.objectChargeUpdateId = objarr.join()
            this.rejectReport.objectChargeDeleteId = this.objdelitem.join();
            //设备选择插入
            this.rejectReport.terminalIds = this.saveId_c; 
      },
      equipmentselection(){ //所需设备
        this.equipmentBtn = true;
        this.onQuery_c(this.currentPage_c, this.pageSize_c)
      },
      onQuery_c (currentPage, pageSize) {
          let params = {
              code: this.code_c,
              model: this.model_c,
              name: this.name_c,
              currentPage,
              pageSize,
          }
          this.$api.eqManage.searchTerminal(params)
              .then((resp) => {
                  let temp = resp.data.data
                  this.tableData_c = temp.terminal.list.slice(0)
                  this.tableData_c.forEach(item => {
                    this.$set(item,'checkCur',false)
                  });
                  this.total_c = temp.terminal.total
              })
              .then(()=>{
                for(let i=0; i<this.tableData_c.length; i++){
                   for(let t=0; t<this.saveId_c.length; t++){
                      if(this.tableData_c[i].id == this.saveId_c[t]){
                        this.tableData_c[i].checkCur = true
                      }
                   }
                }
                //回显
              })
              .catch(err => {
              })
          
      },
      /*
      * 分页器_c 变化
      * */
      currentChange_c (val) {
          this.currentPage_c = val
          this.onQuery_c(this.currentPage_c, this.pageSize_c)
      },
      /*
      * 代入已选中给的设备信息
      * */
      pushDataFn_c () {
        this.equipmentBtn = false
        this.equipmentvalue = this.saveName_c.join()
      },
      cancelFn1_c () {
        this.equipmentBtn = false
      },
      checkedCur(item){ //选中每一个设备的时候，更新saveId_c，saveName_c值
        if(item.checkCur){
          this.saveId_c.push(item.id)
          this.saveName_c.push(item.code)
        }else{
          for(let i=0; i<this.saveId_c.length; i++){
            if(this.saveId_c[i] == item.id){
               this.saveId_c.splice(i,1);
               this.saveName_c.splice(i,1);
            }
          }
        }
      },
      /*
      * 关闭设备选择重置数据
      * */
      cloFN_c () {
        this.code_c = ''
        this.name_c = ''
        this.model_c = ''
        this.currentPage_c = 1
        this.pageSize_c = 15
        this.total_c = 0
        this.tableData_c = []
      },
      handlebinding(row){//绑定模板
        this.rowid = row.id
        this.sendDta(this.rowid,true)
        this.dialogbinding = true;
      },
      sendDta(id,idfulsh){ //绑定模板 数据调取
        let data = {
          "currentPage": this.bindingCurrentPage,  //当前页
          "id": '',  //id信息
          "itemsId": id,  //检验项目id
          "items_itme_name": "",  //检验项目名称
          "items_test_basis": "", //检验依据
          "items_test_room": "",//检验科室，传科室id
          "name": "", //模板名称
          "pageSize": this.bindingPageSize,  //每页条数
          "status": ""  //状态 全部传空 已绑定项目-1 未绑定项目-2
        };
        this.$api.systemProject.getlistByNoItemsId(data).then(res => {
          this.bindingData = res.data.data.list
          this.bindingTotal = res.data.data.total
          for(let i=0; i<this.bindingData.length; i++){
            this.$set(this.bindingData[i],'check',false)
          }
          if(idfulsh){
            this.bandSelection = res.data.data.templateIds
          }
        }).then(()=>{
          for(let i=0; i<this.bindingData.length; i++){
            for(let t=0; t<this.bandSelection.length; t++){
                if(this.bindingData[i].id == this.bandSelection[t]){
                  this.bindingData[i].check = true;
                }
            }
          }
        })
      },
      bindingmoban(item){ //绑定模板 复选框逻辑
        if(item.check){
          this.bandSelection.push(item.id)
        }else{
          for(let i=0; i<this.bandSelection.length; i++){
            if(this.bandSelection[i] == item.id){
               this.bandSelection.splice(i,1);
            }
          }
        }
        console.log(this.bandSelection)
      },
      // 绑定模板-分页器-设置每条的页数
      bindingHandleSizeChange(val) {
        this.bindingPageSize = val;
        this.sendDta(this.rowid,false)
      },
      // 绑定模板-分页器-当前页发生改变时
      bindingHandleCurrentChange(val) {
        this.bindingCurrentPage = val;
        this.sendDta(this.rowid,false)
      },
      bindsave(){ //绑定模板保存按钮
       let data = {
          "itemsId": this.rowid,  //检验项目id
          "templateIds": this.bandSelection.join() //绑定的模板id，逗号分隔
        }
       this.$api.systemProject.bindTemplate(data).then(res => {
          if(res.data.ok == true){
            this.$alert(res.data.data, '信息提示', {
              dangerouslyUseHTMLString: true
            });
          }
          this.bindingCurrentPage = 1;
          this.bindingPageSize = 10;
          this.tableLocation(this.TableCurrentPage,this.TablePageSize);
       })
        this.dialogbinding = false
      },
      newlyBuild(){ //新建模板
        let than = this;
        window.open(this.src, '_blank');
        window.refreshList = (id) =>{
          than.parData(id);
        }
       
      },
      parData(id){  // 新增模板 新增后 刷新绑定列表 并处理勾选逻辑
        this.bandSelection.push(id)
        
        this.sendDta(this.rowid,false)
      },
      queryequipment(){ //设备查询
        this.onQuery_c(1, 15)
      }
    },
    filters:{
      timeFn(val){
        var now = new Date(val),
            y = now.getFullYear(),
            m = now.getMonth() + 1,
            d = now.getDate();
        return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) ;
      },
      swhetaskflag (value) {
        switch (value) {
          case 0:
            return '过期'
            break;
          case 1:
            return '等待启用'
            break;
          case 2:
            return '启用'
            break;
          default:
            break;
        }
      },
      fnbuttonflag(value){
        if(value){
          value = 1
        }else{
          value = 0
        }
        switch (value) {
          case 1:
            return '显示'
            break;
          case 0:
            return '不显示'
            break;
          default:
            break;
        }
      },
      ancillary(value){
        switch (value) {
          case 2:
            return 'Y'
            break;
          case 0:
            return 'N'
            break;
          default:
            break;
        }
      },
      // searchDataFn(value){
      //   // console.log(value)
      //   // let d = new Date(value);
      //   // console.log(d)

      //   // let issyear;
      //   // let yue = d.getMonth() + 1
      //   //   let yues;
      //   //   if(yue < 10){
      //   //     yues = '0'+yue
      //   //   }else{
      //   //     yues = yue
      //   //   }
      //   //   let ri = d.getDate()
      //   //   let ris;
      //   //   if(ri < 10){
      //   //     ris = '0'+ri
      //   //   }else{
      //   //     ris = ri
      //   //   }
      //   //   return issyear = d.getFullYear() + '-' + yues + '-' + ris
      // }
    },
    mounted() {
      this.$nextTick(() => {
        this.tableHeight = this.$refs.el_main_table_box.offsetHeight;
      })
      this.funreadCarProject()
      this.funshuKe()
      this.getCate();
      this.getDepartment();//获取科室数据
    },
  }
</script>
<style scoped lang="less">

.OP{overflow: hidden;}


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
  .standardCost{ width: 90%; height: auto; overflow: hidden; margin: 0 auto;}
  .standardCost h2{ margin: 10px 0;}
  .standardCost table{width: 100%; box-sizing: border-box; border:1px solid #DCDFE6;}
  .standardCost table tr{ height: 30px; line-height: 30px; text-align: center;}
  .costlayout{ width: 90%; height: auto; overflow: hidden; margin: 0 auto;}
  .red{ color: red;}

  .sizeclor{ color:#C0C4CC;}

  .costlayout{ width: 100%; height: auto; overflow: hidden;}
  .costlayout ul li{ border: #999 solid 1px; float: left; width: 14%;}
  .onfloat{float: left;}
  .reds{ color: red; font-size: 18px !important; margin-left: 5px;}
  .skbColor{ cursor:default; color: #409EFF;}





</style>
