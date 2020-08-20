<template>
  <!-- 组织机构管理 -->
  <div class="systemdepartmentrinquire">
    <div class="warp">
      <div class="inquire">
        <el-form :inline="true" size="small" :model="inquireform" class="demo-form-inline">
          <!-- label-width="105px" -->
          <div style="display: flex;align-items: center;width: calc(100% - 55px);">
            <el-form-item label="组织机构名称 :">
              <el-input v-model.trim="inquireform.org_name" @keyup.enter.native="searchEnterFun" clearable name="clearInputValue"></el-input>
            </el-form-item>
            <el-form-item label="组织机构代码 :">
              <el-input v-model.trim="inquireform.org_abc" @keyup.enter.native="searchEnterFun" clearable name="clearInputValue"></el-input>
            </el-form-item>
          </div>
          <div class="demo-form-inline-but">
            <el-form-item class="leftone">
              <el-button type="primary" @click="clickNewConstruction">新建</el-button>
            </el-form-item>
            <el-form-item class="lefttow">
              <el-button type="primary" @click="clickNewTow">新建(新版)</el-button>
            </el-form-item>
            <el-form-item class="rightone">
              <el-button type="primary" @click="inquirefindDepartmentList(inquireform, 1, 10)">查询</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div class="table-box">
        <el-table
          v-loading="loading" ref="table" border stripe
          :data="findDepartmentList"
          :header-cell-style="{
            'background-color': 'rgba(243,246,253,1)',
            'color': '#606266',
            'padding': '10px 0'
          }"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          @expand-change="expandChange"
          :row-class-name="getRowClass">
          <el-table-column type="expand" :resizable="false">
            <template>
              <!-- 二级弹出 -->
              <div class="towTableClass" >
                <table class="twoTable-box">
                  <tr v-for="(item,i) in getListDepInclude" :key="i" class="twoTable-box-tr">
                    <td class="width-caret-right"><i class="el-icon-caret-right"></i></td>
                    <td class="twoTable-box-tr-td">{{item.org_name}}</td>
                    <td class="twoTable-box-tr-td-three">{{item.org_abc}}</td>
                    <td class="twoTable-box-tr-td">
                      <span v-if="item.type == 0">科室</span>
                      <span v-if="item.type == 1">部门</span>
                    </td>
                    <td class="twoTable-box-tr-td">
                      <el-button type="text" style="color:#32AFF0;marginLeft:6px;" @click="redactSaveDepartment(item)">
                        编辑
                      </el-button>
                      <el-button type="text" style="color:#32AFF0;marginLeft:6px;" @click="examineSaveDepartment(item)">
                        查看
                      </el-button>
                      <el-button type="text" style="color:red;marginLeft:6px;" @click="towDeleteDepartment(item)">
                        删除
                      </el-button>
                    </td>
                  </tr>
                </table>
                <!-- <el-table ref="twoTable" :data="getListDepInclude" :show-header="false">
                    <el-table-column class-name="width-caret-right">
                        <template>
                            <i class="el-icon-caret-right"></i>
                        </template>
                    </el-table-column>
                    <el-table-column prop="org_name"></el-table-column>
                    <el-table-column prop="org_abc"></el-table-column>
                    <el-table-column prop="type">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type == 0">科室</span>
                            <span v-if="scope.row.type == 1">部门</span>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <el-button type="text" style="color:#32AFF0;marginLeft:6px;" @click="redactSaveDepartment(scope.row)">编辑</el-button>
                            <el-button type="text" style="color:#32AFF0;marginLeft:6px;" @click="examineSaveDepartment(scope.row)">查看</el-button>
                            <el-button type="text" style="color:red;marginLeft:6px;" @click="towDeleteDepartment(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table> -->
              </div>

            </template>
          </el-table-column>
          <el-table-column align="left" :resizable="false" prop="org_name" label="组织机构名称"></el-table-column>
          <el-table-column align="center" :resizable="false" prop="org_abc" label="组织机构代码"></el-table-column>
          <el-table-column align="center" :resizable="false" prop="type" label="组织机构类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 0">科室</span>
              <span v-if="scope.row.type == 1">部门</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" :resizable="false" width="200">
            <template slot-scope="scope">
              <el-button type="text" style="color:#32AFF0;marginLeft:6px;" @click="redactSaveDepartment(scope.row)">
                编辑
              </el-button>
              <!-- <el-button type="text" style="color:#32AFF0;marginLeft:6px;" @click="redactSaveDepartment(scope.row)">编辑（新版）</el-button> -->
              <el-button type="text" style="color:#32AFF0;marginLeft:6px;" @click="examineSaveDepartment(scope.row)">
                查看
              </el-button>
              <el-button type="text" style="color:red;marginLeft:6px;" @click="deleteDepartment(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagingdevice">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10,20,30]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 新增/编辑 -->
    <el-dialog :title="redactFormTitle" :visible.sync="redactFormVisible" :before-close="handleDialogClose">
      <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="125px" size="medium"
               class="demo-ruleForm">
        <div style="marginBottom:20px;" class="dialog_form_item_div">
          <el-form-item label="组织机构类型：" prop="type">
            <el-select style="width:160px;" v-model="ruleForm.type" clearable @change="selectTypeId(ruleForm.type)"
                       >
              <el-option 
                v-for="(item) in departmentselection" 
                :label='item.dicTypeName' 
                :value='Number(item.dicTypeCode)' 
                :key="item.dicTypeCode">
              </el-option>
              <!-- <el-option label="科室" :value="0"></el-option>
              <el-option label="部门" :value="1"></el-option> -->


            </el-select>
          </el-form-item>
          <el-form-item
            label="上级组织机构："
            prop="parentId"
            :rules="[
                             { required: parentIdRules, message: '上级组织机构不能为空', trigger: 'change'}
                        ]">
            <el-select style="width:160px;" v-model="ruleForm.parentId" clearable :placeholder='placeholder' :disabled="disabled">
              <el-option v-for="(item,i) in organizationList" :key="i" :label="item.org_name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="marginBottom:20px;" class="dialog_form_item_div">
          <el-form-item label="组织机构名称：" prop="org_name">
            <el-input style="width:160px;" v-model.trim="ruleForm.org_name"></el-input>
          </el-form-item>
          <el-form-item label="组织机构编码：" prop="org_abc">
            <el-input style="width:160px;" v-model.trim="ruleForm.org_abc"></el-input>
          </el-form-item>
        </div>
        <div class="dialog_form_item_div">
          <el-form-item label="报告初校：" prop="jdid">
            <el-select style="width:160px;" v-model.trim="ruleForm.jdid">
              <el-option label="不需要" :value="0"></el-option>
              <el-option label="需要" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报告校验：" prop="audit">
            <el-select style="width:160px;" v-model.trim="audit">
              <el-option label="不需要" :value="0"></el-option>
              <el-option label="需要" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clickShutDialog">关 闭</el-button>
        <el-button type="primary" @click="saveDepartment('ruleForm',ruleForm)">保存</el-button>
      </div>
    </el-dialog>

    <!-- 查看 -->
    <el-dialog title="查看" :visible.sync="examineFormVisible" :before-close="clickShutDialog">
      <el-form :inline="true" :model="ruleForm" label-width="110px" size="medium" class="demo-ruleForm">
        <div style="marginBottom:20px;" class="dialog_form_item_div">
          <el-form-item label="组织机构类型：" prop="type">
            <el-select style="width:160px;" v-model="ruleForm.type" clearable disabled>
              <el-option label="科室" :value="0"></el-option>
              <el-option label="部门" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上级组织机构：" prop="parentId">
            <el-select style="width:160px;" v-model="ruleForm.parentId" clearable disabled :placeholder='placeholder'>
              <el-option v-for="(item,i) in organizationList" :key="i" :label="item.org_name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="marginBottom:20px;" class="dialog_form_item_div">
          <el-form-item label="组织机构名称：" prop="org_name">
            <el-input style="width:160px;" v-model="ruleForm.org_name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="组织机构编码：" prop="org_abc">
            <el-input style="width:160px;" v-model="ruleForm.org_abc" :disabled="true"></el-input>
          </el-form-item>
        </div>
        <div class="dialog_form_item_div">
          <el-form-item label="报告初校：" prop="jdid">
            <el-select style="width:160px;" v-model="ruleForm.jdid" disabled>
              <el-option label="不需要" :value="0"></el-option>
              <el-option label="需要" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报告校验：" prop="audit">
            <el-select style="width:160px;" v-model="audit" disabled>
              <el-option label="不需要" :value="0"></el-option>
              <el-option label="需要" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clickShutDialog">关 闭</el-button>
        <el-button type="primary" @click="clickShutDialog">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增二 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleTow"
      width="60%"
      :before-close="handleClose">
      <el-form :inline="true" :model="ruleFormTow" :rules="rules" ref="ruleFormTow" label-width="125px" size="medium"
               class="demo-ruleForm">
        <div style="marginBottom:20px;" class="dialog_form_item_div">
          <el-form-item label="组织机构类型：" prop="type">
            <el-select style="width:160px;" v-model="ruleFormTow.type" clearable placeholder="请选择组织机构类型" @change="selectTypeId(ruleFormTow.type)"
                      >
              <el-option 
                v-for="(item) in departmentselection" 
                :label='item.dicTypeName' 
                :value='item.dicTypeCode' 
                :key="item.dicTypeCode">
              </el-option>


            </el-select>
          </el-form-item>
          <el-form-item
            label="上级组织机构："
            prop="parentId"
            :rules="[
                      { required: parentIdRules, message: '上级组织机构不能为空', trigger: 'change'}
            ]">
            <SelectTree
              style="width:160px;"
              :props="props"
              :options="list"
              :value="valueId"
              :clearable="isClearable"
              :accordion="isAccordion"
              @getValue="getValue($event)"
            />
          </el-form-item>
           
        </div>
        <div style="marginBottom:20px;" class="dialog_form_item_div">
          <el-form-item label="组织机构名称：" prop="org_name">
            <el-input style="width:160px;" v-model.trim="ruleFormTow.org_name"></el-input>
          </el-form-item>
          <el-form-item label="组织机构编码：" prop="org_abc">
            <el-input style="width:160px;" v-model.trim="ruleFormTow.org_abc"></el-input>
          </el-form-item>
        </div>
        <div class="dialog_form_item_div">
          <el-form-item label="报告初校：" prop="jdid">
            <el-select style="width:160px;" v-model.trim="ruleFormTow.jdid">
              <el-option label="不需要" :value="0"></el-option>
              <el-option label="需要" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报告校验：" prop="audit">
            <el-select style="width:160px;" v-model.trim="audit">
              <el-option label="不需要" :value="0"></el-option>
              <el-option label="需要" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleFormTow')" >取 消</el-button>
        <el-button type="primary"  @click="saveDepartment('ruleFormTow',ruleFormTow)" >保 存</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
   import SelectTree from "./tree.vue";
  export default {
    name: 'systemation',
    data() {
      return {
        showSSS: false,
        currentPage: 1, // 当前页
        pageSize: 10, // 每页的条数
        total: 0,
        findDepartmentList: [], // 列表数据
        redactFormVisible: false, // 控制编辑对话框是否显示
        examineFormVisible: false, // 控制查看对话框是否显示
        redactFormTitle: '', // 编辑对话框标题
        inquireform: { // 查询
          org_name: '',
          org_abc: ''
        },
        bindDeptId: [], // 绑定保存的id数据
        bindingRowId: '', // 当前需要绑定权限的id
        ruleForm: { // 编辑对话框数据
          id: '',
          type: 0,
          parentId: '',
          org_name: '',
          org_abc: '',
          jdid: 0,
        },
        parentName: '', // 上级组织机构默认值
        parentIdRules: true, // 上级组织机构校验
        organizationList: [], // 上级组织机构数据
        audit: 1, // 报告审核
        rules: { // 编辑对话框的校验
          type: [
            {required: true, message: '组织机构类型不能为空', trigger: 'change'}
          ],
          org_name: [
            {required: true, message: '组织机构名称不能为空', trigger: 'change'},
          ],
          org_abc: []
        },
        getListDepInclude: [], // 子表格数据
        flag: true,
        getRowKeys(row) {
          return row.id;
        },
        expands: [],
        expandChangeId: '',
        expandRowId: '',
        childrenId: '',
        disabled: false,
        condition: '',
        org_name: '',
        placeholder: '请选择',
        loading: false,
        // 新增二
        dialogVisibleTow: false,
        ruleFormTow: { // 新增二对话框数据
          id: '',
          type: 0,
          parentId: '',
          org_name: '',
          org_abc: '',
          jdid: 0,
        },
        isClearable: true, // 可清空（可选）
        isAccordion: true, // 可收起（可选）
        valueId: 1, // 初始ID（可选）
        props: {
          // 配置项（必选）
          value: "id",
          label: "org_name",
          children: "children"
          // disabled:true
        },
        // 选项列表（必选）
        list: [],
        // 科室选择
        departmentselection:[],
        
      }
    },
    components: {
      SelectTree
      
    },
    created(){
      this.clickTree();
      this.dictypest();
    },
    mounted() {
      this.getIdcsList();
    },
    methods: {
      getValue(value) {
        this.valueId = value;
        this.ruleFormTow.parentId = value
        console.log(this.ruleFormTow.parentId);
      },
      handleClose() {
        this.dialogVisibleTow = false;
      },
      resetForm(formName) {
        this.dialogVisibleTow = false;
        this.$refs[formName].resetFields();
      },      
      // 分页器-设置每条的页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.inquirefindDepartmentList(this.inquireform, this.currentPage, this.pageSize);
      },
      // 分页器-当前页发生改变的时候
      handleCurrentChange(val) {
        this.currentPage = val;
        this.inquirefindDepartmentList(this.inquireform, this.currentPage, this.pageSize);
      },
      // 获取列表数据
      getIdcsList() {
        this.loading = true;
        this.inquireform.currentPage = this.currentPage;
        this.inquireform.pageSize = this.pageSize;
        let params = {
          org_name: this.inquireform.org_name,
          org_abc: this.inquireform.org_abc,
          currentPage: this.inquireform.currentPage,
          pageSize: this.inquireform.pageSize
        }
        this.$api.systemdepartmentrinquire.apiInquireFindDepartmentList(params).then(res => {
          this.findDepartmentList = res.data.data;
          this.expandChange(this.findDepartmentList[0])
          if (this.findDepartmentList.length > 0) {
            this.total = this.findDepartmentList[0].total;
          } else {
            this.total = 0;
          }
          this.loading = false;
        }).catch((error) => {
          this.$message({type: 'error', message: error.data.message, duration: 1500});
          this.loading = false;
        })
      },
      // 点击查询
      inquirefindDepartmentList(inquireform, currentPage, pageSize) {
        this.loading = true;
        this.currentPage = currentPage, // 当前页
          this.pageSize = pageSize, // 每页的条数
          inquireform.currentPage = this.currentPage;
        inquireform.pageSize = this.pageSize;
        let params = {
          org_name: inquireform.org_name,
          org_abc: inquireform.org_abc,
          currentPage: inquireform.currentPage,
          pageSize: inquireform.pageSize
        }
        this.$api.systemdepartmentrinquire.apiInquireFindDepartmentList(params).then(res => {
          res ? this.findDepartmentList = res.data.data : '';
          if (this.findDepartmentList.length > 0) {
            this.total = this.findDepartmentList[0].total;
          } else {
            this.total = 0;
          }
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
          this.inquirefindDepartmentList(this.inquireform, 1, 10)
        }
      },
      // 点击删除
      deleteDepartment(row) {
        let params = {
          departmentId: row.id
        }
        this.$api.systemdepartmentrinquire.apiGetListDepInclude(params).then(res => {
          if (res.data.data.length > 0) {
            this.$alert('当前部门下存在科室，不允许删除', '系统提示信息', {
              dangerouslyUseHTMLString: true
            }).then().catch(error => {
              this.$message({type: 'info', message: '已取消删除', duration: 1500});
            });
          } else {
            this.$confirm('确认要删除吗？', '信息', {
              cancelButtonText: '取消',
              confirmButtonText: '确定',
            }).then(() => {
              let params = {
                departmentId: row.id
              }
              this.$api.systemdepartmentrinquire.apiDeleteDepartment(params).then(res => {
                this.$message({type: 'success', message: res.data.data, duration: 1500});
                this.inquirefindDepartmentList(this.inquireform, this.currentPage, this.pageSize);
              }).catch((error) => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
              });
            }).catch(error => {
              this.$message({type: 'info', message: '已取消删除', duration: 1500});
            })
          }
        });
      },
      // 二级删除
      towDeleteDepartment(row) {
        this.$confirm('确认要删除吗？', '信息', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(() => {
          let params = {
            departmentId: row.id
          }
          this.$api.systemdepartmentrinquire.apiDeleteDepartment(params).then(res => {
            this.$message({type: 'success', message: res.data.data, duration: 1500});
            this.inquirefindDepartmentList(this.inquireform, this.currentPage, this.pageSize);
            this.expandChangeId = '';
            this.childrenId ? this.expandChange(this.childrenId) : '';
          }).catch((error) => {
            this.$message({type: 'error', message: error.data.message, duration: 1500});
          });
        }).catch(error => {
          this.$message({type: 'info', message: '已取消删除', duration: 1500});
        });
      },
      // 点击新建
      clickNewConstruction() {
        this.redactFormTitle = '新建';
        this.redactFormVisible = true;
        this.disabled = false;
        this.condition = 0;
        this.ruleForm = {
          id: '',
          type: 0,
          parentId: '',
          org_name: '',
          org_abc: '',
          jdid: 0,
        }
        if (this.ruleForm.type == 0) {
          this.placeholder = '请选择';
          this.parentIdRules = true;
          this.findAllDepartment();
          this.rules.org_abc = [
            {required: true, message: '组织机构编码不能为空', trigger: 'change'},
            {
              validator: (rule, value, callback) => {
                if (!value.match(/^[A-Z]$/)) {
                  callback(new Error("只允许输入一位大写字母"));
                } else {
                  callback();
                }
              }, trigger: 'change'
            }

          ]
        } else {
          this.placeholder = '';
          this.parentIdRules = false;
          this.organizationList = [];
          this.rules.org_abc = [
            {required: true, message: '组织机构编码不能为空', trigger: 'change'},
            {
              validator: (rule, value, callback) => {
                if (!value.match(/^[A-Z]{2}$/)) {
                  callback(new Error("只允许输入两位大写字母"));
                } else {
                  callback();
                }
              }, trigger: 'change'
            }

          ]
        }
      },
      // 点击编辑
      redactSaveDepartment(row) {
        this.redactFormTitle = '编辑';
        this.redactFormVisible = true;
        this.disabled = true;
        this.condition = 1;
        let params = new FormData();
        params.append('departmentId', row.id);
        this.$api.systemdepartmentrinquire.apiGetDepartmentData(params).then(res => {
          this.ruleForm = {
            id: res.data.data.id,
            type: res.data.data.type,
            parentId: res.data.data.org_name2,
            org_name: res.data.data.org_name,
            org_abc: res.data.data.org_abc,
            jdid: res.data.data.jdid,
          };
          console.log(this.ruleForm)
          console.log(this.departmentselection)
          this.org_name = res.data.data.org_name;
          this.parentName = res.data.data.ids;
          if (this.ruleForm.type == 0) {
            this.placeholder = '请选择';
            this.parentIdRules = true;
            this.findAllDepartment();
            this.rules.org_abc = [
              {required: true, message: '组织机构编码不能为空', trigger: 'change'},
              {
                validator: (rule, value, callback) => {
                  if (!value.match(/^[A-Z]$/)) {
                    callback(new Error("只允许输入一位大写字母"));
                  } else {
                    callback();
                  }
                }, trigger: 'change'
              }
            ]
          } else {
            this.placeholder = '';
            this.parentIdRules = false;
            this.organizationList = [];
            this.rules.org_abc = [
              {required: true, message: '组织机构编码不能为空', trigger: 'change'},
              {
                validator: (rule, value, callback) => {
                  if (!value.match(/^[A-Z]{2}$/)) {
                    callback(new Error("只允许输入两位大写字母"));
                  } else {
                    callback();
                  }
                }, trigger: 'change'
              }
            ]
          }
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500});
        })
      },
      // 选择上级组织机构数据
      selectTypeId(type) {
        if (type == 0) {
          this.placeholder = '请选择';
          this.parentIdRules = true;
          this.findAllDepartment();
          this.rules.org_abc = [
            {required: true, message: '组织机构编码不能为空', trigger: 'change'},
            {
              validator: (rule, value, callback) => {
                if (!value.match(/^[A-Z]$/)) {
                  callback(new Error("只允许输入一位大写字母"));
                } else {
                  callback();
                }
              }, trigger: 'change'
            }
          ]
        } else {
          this.placeholder = '';
          this.parentIdRules = false;
          this.organizationList = [];
          this.ruleForm.parentId = '';
          this.rules.org_abc = [
            {required: true, message: '组织机构编码不能为空', trigger: 'change'},
            {
              validator: (rule, value, callback) => {
                if (!value.match(/^[A-Z]{2}$/)) {
                  callback(new Error("只允许输入两位大写字母"));
                } else {
                  callback();
                }
              }, trigger: 'change'
            }
          ]
        }
      },
      // 获取上级组织机构数据
      findAllDepartment() {
        this.$api.systemdepartmentrinquire.apiFindAllDepartment().then(res => {
          this.organizationList = res.data.data;
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500});
        })
      },
      // 点击对话框右上角的X
      handleDialogClose() {
        this.redactFormVisible = false;
        this.$refs.ruleForm.resetFields();
      },
      // 关闭对话框
      clickShutDialog() {
        this.redactFormVisible = false;
        this.examineFormVisible = false;
        this.$refs.ruleForm.resetFields();
      },
      // 点击保存
      saveDepartment(ruleForm1, ruleForm2) {
        console.log(ruleForm2)
        this.$refs[ruleForm1].validate((valid) => {
          if (valid) {
            let params = {
              deptName: ruleForm2.org_name
            }
            if (this.condition == 0) {
              this.$api.systemdepartmentrinquire.apiGetDepartmentByName(params).then(res => {
                this.$message({type: 'error', message: res.data.data, duration: 1500});
              }).catch(error => {
                if (isNaN(ruleForm2.parentId)) {
                  ruleForm2.parentId = this.parentName;
                }
                this.$api.systemdepartmentrinquire.apiSaveDepartment(ruleForm2).then(res => {
                  this.$message({type: 'success', message: res.data.data, duration: 1500});
                  this.inquirefindDepartmentList(this.inquireform, 1, 10);
                  this.expands = [];
                  this.$refs[ruleForm1].resetFields();
                  this.redactFormVisible = false;
                }).catch((error) => {
                  this.$message({type: 'error', message: error.data.message, duration: 1500});
                  this.inquirefindDepartmentList(this.inquireform, 1, 10);
                  this.expands = [];
                  this.$refs[ruleForm1].resetFields();
                  this.redactFormVisible = false;
                });
              })
            } else if (this.condition == 1) {
              if (this.org_name == ruleForm2.org_name) {
                if (isNaN(ruleForm2.parentId)) {
                  ruleForm2.parentId = this.parentName;
                }
                this.$api.systemdepartmentrinquire.apiSaveDepartment(ruleForm2).then(res => {
                  this.$message({type: 'success', message: res.data.data, duration: 1500});
                  this.inquirefindDepartmentList(this.inquireform, this.currentPage, this.pageSize);
                  this.$refs[ruleForm1].resetFields();
                  this.redactFormVisible = false;
                  this.expandChangeId = '';
                  this.childrenId ? this.expandChange(this.childrenId) : '';
                }).catch((error) => {
                  this.$message({type: 'error', message: error.data.message, duration: 1500});
                  this.inquirefindDepartmentList(this.inquireform, this.currentPage, this.pageSize);
                  this.$refs[ruleForm1].resetFields();
                  this.redactFormVisible = false;
                  this.expandChangeId = '';
                  this.childrenId ? this.expandChange(this.childrenId) : '';
                });
              } else {
                this.$api.systemdepartmentrinquire.apiGetDepartmentByName(params).then(res => {
                  this.$message({type: 'error', message: res.data.data, duration: 1500});
                }).catch(error => {
                  if (isNaN(ruleForm2.parentId)) {
                    ruleForm2.parentId = this.parentName;
                  }
                  this.$api.systemdepartmentrinquire.apiSaveDepartment(ruleForm2).then(res => {
                    this.$message({type: 'success', message: res.data.data, duration: 1500});
                    this.inquirefindDepartmentList(this.inquireform, this.currentPage, this.pageSize);
                    this.$refs[ruleForm1].resetFields();
                    this.redactFormVisible = false;
                    this.expandChangeId = '';
                    this.childrenId ? this.expandChange(this.childrenId) : '';
                  }).catch((error) => {
                    this.$message({type: 'error', message: error.data.message, duration: 1500});
                    this.inquirefindDepartmentList(this.inquireform, this.currentPage, this.pageSize);
                    this.$refs[ruleForm1].resetFields();
                    this.redactFormVisible = false;
                    this.expandChangeId = '';
                    this.childrenId ? this.expandChange(this.childrenId) : '';
                  });
                })
              }
            }
          }
        })
      },
      // 展开子表格
      expandChange(row) {
        this.childrenId = row;
        this.expands = [];
        let params = {
          departmentId: row.id
        }
        if (!this.expandChangeId) {
          this.$api.systemdepartmentrinquire.apiGetListDepInclude(params).then(res => {
            this.getListDepInclude = res.data.data;
            this.expands.push(row.id);
            this.flag = true;
            this.expandChangeId = row.id;
          }).catch((error) => {
            this.$message({type: 'error', message: error.data.message, duration: 1500});
          });
        } else {
          if (this.expandChangeId != row.id) {
            this.$api.systemdepartmentrinquire.apiGetListDepInclude(params).then(res => {
              this.getListDepInclude = res.data.data;
              this.expands.push(row.id);
              this.flag = true;
              this.expandChangeId = row.id;
            }).catch((error) => {
              this.$message({type: 'error', message: error.data.message, duration: 1500});
            });
          } else {
            this.flag = !this.flag;
            if (this.flag) {
              this.$api.systemdepartmentrinquire.apiGetListDepInclude(params).then(res => {
                this.getListDepInclude = res.data.data;
                this.expands.push(row.id);
              }).catch((error) => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
              });
            } else {
              this.expands = [];
              this.childrenId = '';
            }
          }
        }

      },
      // 判断表格是否有子项，无子项不显示展开按钮
      getRowClass(row, rowIndex) {
        if (!row.row.hasChildren) {
          return 'row-expand-cover'
        }
      },
      // 点击查看
      examineSaveDepartment(row) {
        this.examineFormVisible = true;
        let params = new FormData();
        params.append('departmentId', row.id);
        this.$api.systemdepartmentrinquire.apiGetDepartmentData(params).then(res => {
          this.ruleForm = {
            id: res.data.data.id,
            type: res.data.data.type,
            org_name: res.data.data.org_name,
            org_abc: res.data.data.org_abc,
            jdid: res.data.data.jdid,
          }
          if (res.data.data.type == 0) {
            this.placeholder = '请选择';
            this.ruleForm.parentId = res.data.data.org_name2;
          } else {
            this.placeholder = '';
          }
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500});
        })
      },
      //新建二
      clickNewTow(){
        if(this.list == ''){
           this.$alert('数据暂未加载完成，清稍后重试', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$message({
                  type: 'info',
                  message: `action: ${ action }`
                });
              }
            });
          return false
        }
        this.dialogVisibleTow = true;
      },
      clickTree(){
        this.$api.systemdepartmentrinquire.organizationTreeData().then(res => {
          this.list = res.data.data
        })
      },
      dictypest(){
        this.$api.systemdepartmentrinquire.dictypestData().then(res => {
          console.log(res)
          this.departmentselection = res.data.data;
          this.ruleFormTow.type = res.data.data[0].dicTypeCode;
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .systemdepartmentrinquire {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 10px;
    background: #eee;
  }

  .warp {
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .el-button--default {
    width: 56px;
    height: 30px;
    border-radius: 2px;
    padding: 0;
    margin: 0;
  }

  .el-button--primary {
    background: linear-gradient(90deg, rgb(96, 157, 248), rgb(84, 183, 235));
    border-radius: 2px;
    height: 30px;
    padding: 0 20px;
    margin: 0;
  }

  .pagingdevice {
    margin-top: 20px;
  }

  .table-box {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .el-table .cell {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .Shuttle_left {
    width: 300px;
    height: 300px;
    display: flex;
  }

  .Shuttle_left p {
    width: 60px;
    height: 300px;
    text-align: center;
  }

  .Shuttle_left div {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    border: 1px solid #ccc;
    padding: 0 10px;
    box-sizing: border-box;
    margin-right: 10px;
  }

  .Shuttle_left div span {
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
  }

  .Shuttle_right {
    width: 300px;
    height: 300px;
    display: flex;
  }

  .Shuttle_right p {
    width: 60px;
    height: 300px;
    text-align: center;
  }

  .Shuttle_right div {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    border: 1px solid #ccc;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .Shuttle_right div span {
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
  }

  .demo-form-inline-but {
    
    margin-top: 1%;
    padding-bottom: 20px;
    overflow: hidden;
  }

  .leftone,.lefttow{ float: left}
  .lefttow{ margin-left: 1% !important; }
  .rightone{ float: right}


  /deep/ .el-scrollbar__bar {
    z-index: 999;
  }

  .redactFormDivider {
    margin: 20px 0;
  }

  .redactFormDivider .el-divider[data-v-3b5ab4e8] {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .redactFormDivider .el-divider--horizontal {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  /deep/ .el-table__expanded-cell[class*=cell] {
    padding: 0;
    margin: 0;
    border-bottom: none;

  }

  /deep/ .el-input.is-disabled .el-input__inner {
    border-color: rgba(0, 0, 0, 0.1);
    color: #b5b5b5;
  }

  /deep/ .el-table__expanded-cell .el-table .el-table__header-wrapper table {
    width: 100% !important;
  }

  /deep/ .el-table__expanded-cell .el-table .el-table__body-wrapper table {
    width: 100% !important;
  }

  /deep/ .demo-form-inline .el-form-item__content {
    width: 60% !important;
  }

  /deep/ .demo-form-inline .el-form-item__content .el-date-editor, .demo-form-inline .el-form-item__content .el-input__inner, .demo-form-inline .el-form-item__content .el-select {
    width: 100% !important;
  }

  .el-form--inline .el-form-item {
    margin: 0;
  }

  .towTableClass, .towTableClass .twoTable-box {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }

  .towTableClass .twoTable-box .twoTable-box-tr {
    width: 100%;
  }

  .towTableClass .twoTable-box .twoTable-box-tr td {
    text-align: center;
  }

  .towTableClass .twoTable-box .twoTable-box-tr .width-caret-right {
    width: 48px;
  }

  .dialog_form_item_div {
    display: flex;
    justify-content: center;
  }
  .dialog_form_item_div .el-form-item:nth-child(even) {
    margin-left: 20px;
  }


// 父表格下没有子项时，不显示下箭头
/deep/ .el-table .row-expand-cover .cell .el-table__expand-icon {
	display: none;
}
</style>
