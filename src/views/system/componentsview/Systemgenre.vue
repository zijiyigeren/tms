<template>
  <!-- 检验类型管理 -->
  <div class="systemgenre">
    <div class="warp">
      <div class="operate">
        <div>
          <span style="width: 82px;display: inline-block;text-align: right;padding-right: 12px;">类别 :</span>
          <el-select
            v-model="typeId"
            size="small"
            @change="selectTypeId(typeId)"
          >
            <el-option label="检验类别" :value="0"></el-option>
            <el-option label="修改单类别" :value="1"></el-option>
          </el-select>
        </div>
        <el-button type="primary" @click="addItemscatalog('new')" style="min-width: 68px;">新建</el-button>
      </div>

      <div class="table-box">
        <div class="table-content">
          <el-table
            border
            stripe
            style="width:100%"
            v-loading="loading"
            :data="tablelist"
            :header-cell-style="{
                'background-color': 'rgba(243,246,253,1)',
                'color': '#606266',
                'padding': '10px 0'
            }">
            <el-table-column
              prop="typeid"
              label="类别"
              align="center"
              :resizable="false">
              <template>
                <span v-if="typeId == 0">检验类别</span>
                <span v-if="typeId == 1">修改单类别</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="productName"
              label="名称"
              align="center"
              :resizable="false">
            </el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              align="center"
              :resizable="false">
            </el-table-column>
            <el-table-column
              prop="parentID"
              label="父ID"
              align="center"
              :resizable="false">
            </el-table-column>
            <!-- <el-table-column
              prop="orderID"
              label="顺序"
              align="center">
            </el-table-column> -->
            <el-table-column label="操作" align="center" :resizable="false">
              <template slot-scope="scope">
                <el-button type="text" style="color:#32AFF0;marginRight:6px;" @click="editItemscatalog('redact', scope.$index, scope.row)">编辑</el-button>
                <el-button type="text" style="color:red;marginLeft:6px;" @click="deleteItemscatalog(scope.$index, scope.row)" >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
    </div>

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" :before-close="handleDialogClose">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="类别：" prop="typeid">
          <el-select v-model="form.typeid" style="width:320px;" size="medium" :disabled="disabled">
            <el-option label="检验类别" :value="0"></el-option>
            <el-option label="修改单类别" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ID：" prop="id">
          <el-input size="medium" style="width:320px" v-model.trim="form.id" placeholder="请输入id" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="名称：" prop="productName">
          <el-input size="medium" style="width:320px" v-model.trim="form.productName" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="父ID：" prop="parentID">
          <el-input size="medium" style="width:320px" v-model.trim="form.parentID" placeholder="请输入父id"></el-input>
        </el-form-item>
        <el-form-item label="顺序：" prop="orderID">
          <el-input size="medium" style="width:320px" v-model.trim="form.orderID" placeholder="请输入顺序"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clickShutDialog">取 消</el-button>
        <el-button type="primary" @click="submitFormVisible('form', form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { log } from 'util';
export default {
  name: 'systemgenre',
  data() {
    return {
      typeId: 0, // 类别ID
      tablelist: [], // table数据
      dialogFormTitle: '', // 弹窗标题
      dialogFormVisible: false, // 控制弹窗显示隐藏
      form: {}, // 编辑新建弹窗
      formTitle: '',
      formLabelWidth: '120px',
      rules: {
        typeid: [
          { required: true, message: '类别不能为空', trigger: 'blur' },
        ],
        id: [
          { required: true, message: 'id不能为空', trigger: 'blur' },
          { min: 1, max: 16, message: '最大输入值为16个字符', trigger: 'blur' }
        ],
        productName: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '最大输入值为20个字符', trigger: 'blur' }
        ],
        parentID: [
          { required: false, message: '父级ID不能为空', trigger: 'blur' },
          { min: 0, max: 16, message: '最大输入值为16个字符', trigger: 'blur' }
        ],
        orderID: [
            { required: true, message: '顺序不能为空', trigger: 'blur' },
            {
                validator: (rule, value, callback) => {
                    if (/^[0-9]\d*$/.test(value) == false) {
                        callback(new Error("顺序必须为整数"));
                    } else {
                        callback();
                    }
                }, trigger: 'blur'
            },
            {
                validator: (rule, value, callback) => {
                    if(value.toString().length > 4){
                        callback(new Error("顺序输入最大值为4位数"));
                    }else {
                        callback();
                    }
                }, trigger: 'blur'
            },
        ],
      },
      disabled: false,
      loading: false,
    }
  },
  mounted() {
    this.findItemscatalogs();
  },
  methods: {
    findItemscatalogs() { // 获取列表数据
      this.loading = true;
      let params = {
        typeId: this.typeId
      }
      this.$api.systemgenre.apiFindItemscatalogs(params).then(res => {
        this.tablelist = res.data.data
        this.loading = false;
      }).catch((error) => {
          this.$message({ type: 'error', message: error.data.message, duration: 1500 });
          this.loading = false;
      })
    },
    selectTypeId(typeId) { // 通过类别查询
      this.loading = true;
      let params = {
        typeId: typeId
      }
      this.$api.systemgenre.apiFindItemscatalogs(params).then(res => {
        this.tablelist = res.data.data;
        this.loading = false;
      }).catch((error) => {
          this.$message({ type: 'error', message: error.data.message, duration: 1500 });
          this.loading = false;
      })
    },
    deleteItemscatalog(index, row) { // 点击删除
      this.$confirm('确认要删除吗？', '信息', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        let params = {
          id: row.id
        }
        this.$api.systemgenre.apiDeleteItemscatalog(params).then(res => {
          this.$message({ type: 'success', message: res.data.data, duration: 1500 });
          this.findItemscatalogs();
        }).catch((error) => {
          this.$message({ type: 'error', message: error.data.message, duration: 1500 });
        });
      })
    },
    addItemscatalog(title) { // 点击新建
      this.disabled = false;
      this.dialogFormVisible = true;
      this.dialogFormTitle = '新建';
      this.form = {
        copyids: '',
        currentPage: '',
        id: '',
        ids: '',
        list: [],
        orderID: '',
        page: '',
        pageHtml: '',
        pageSize: '',
        parentID: '',
        productName: '',
        total: '',
        typeid: '',
        version: ''
      };
      this.formTitle = title;
    },
    editItemscatalog(title, index, row) { // 点击编辑
      if(row.id){
        row.id = row.id.trim();
      }
      if(row.parentID){
        row.parentID = row.parentID.trim();
      }
      this.disabled = true;
      this.dialogFormVisible = true;
      this.dialogFormTitle = '编辑';
      this.form = row;
      this.formTitle = title;
    },
    handleDialogClose() { // 点击对话框右上角的X
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.findItemscatalogs();
    },
    clickShutDialog() { // 关闭对话框
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.findItemscatalogs();
    },
    submitFormVisible(form1, form2) { // 点击弹窗的确定
      this.$refs[form1].validate((valid) => {
        if (valid) {
          let itemcatalog = {
            typeid: form2.typeid,
            productName: form2.productName,
            id: form2.id,
            parentID: form2.parentID,
            orderID: form2.orderID
          };
          if (this.formTitle == 'redact') { // 编辑
            this.$api.systemgenre.apiDeditItemscatalog(itemcatalog).then(res => {
              this.$message({ type: 'success', message: res.data.data, duration: 1500 });
              this.dialogFormVisible = false;
              this.findItemscatalogs();
              this.$refs.form.resetFields();
            }).catch((error) => {
              this.$message({ type: 'error', message: error.data.message, duration: 1500 });
              this.dialogFormVisible = false;
              this.findItemscatalogs();
              this.$refs.form.resetFields();
            });
          } else if (this.formTitle == 'new') { // 新建
            this.$api.systemgenre.apiAddItemscatalog(itemcatalog).then(res => {
                this.$message({ type: 'success', message: res.data.data, duration: 1500 });
              this.dialogFormVisible = false;
              this.findItemscatalogs();
            }).catch((error) => {
              this.$message({ type: 'error', message: error.data.message, duration: 1500 });
              this.dialogFormVisible = false;
              this.findItemscatalogs();
            });
          }
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.systemgenre {
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
  padding: 20px;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.operate {
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}
.table-box {
  flex: 1;
  overflow: hidden;
  padding-top: 20px;
}
.table-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.el-button--default {
  width: 56px;
  height: 30px;
  border-radius: 2px;
  padding: 0;
  margin: 0;
}
.el-button--primary {
  width: 56px;
  height: 30px;
  background: linear-gradient(
    90deg,
    rgba(96, 157, 248, 1),
    rgba(84, 183, 235, 1)
  );
  border-radius: 2px;
  padding: 0;
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
</style>
