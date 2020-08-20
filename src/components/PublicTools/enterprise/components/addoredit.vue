<template>
  <!-- 新建对话框 -->
  <el-dialog
    width="50%"
    :modal="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :before-close="onDialogCancel" class="dialog_box">
    <el-form :model="dialogForm" ref="dialogform" :rules="dialogRules" class="dialog_form" size="mini">
      <el-form-item label="企业名称：" prop="entName">
        <el-input clearable v-model.trim="dialogForm.entName"></el-input>

      </el-form-item>
      <el-form-item label="企业ID：" prop="entId">
        <el-input clearable v-model.trim="dialogForm.entId"></el-input>

      </el-form-item>
      <el-form-item label="企业等级：" prop="entLevel">
        <template-method
          :type="'select'"
          :dicCode="'entLevel'"
          v-model="dialogForm.entLevel"/>

      </el-form-item>
      <el-form-item label="是否为重点企业：" prop="entIsfocus">
        <template-method
          :type="'radio'"
          :dicCode="'yesOrNo'"
          v-model="dialogForm.entIsfocus"/>

      </el-form-item>
      <el-form-item label="联系人：" prop="entContact">
        <el-input clearable v-model.trim="dialogForm.entContact"/>

      </el-form-item>
      <el-form-item label="电话：" prop="entPhone">
        <el-input clearable v-model.trim="dialogForm.entPhone"></el-input>

      </el-form-item>
      <el-form-item label="区域：" prop="entArea">
        <template-method
          :type="'select'"
          :dicCode="'entArea'"
          v-model="dialogForm.entArea"
        />

      </el-form-item>
      <el-form-item label="计划员：" prop="entPlanner">
        <el-input clearable v-model.trim="dialogForm.entPlanner"></el-input>

      </el-form-item>
      <el-form-item label="企业目录：" prop="entCatalog">
        <el-input clearable v-model.trim="dialogForm.entCatalog" maxlength="4"/>

      </el-form-item>
      <el-form-item label="地址：" prop="entAddress">
        <el-input
          clearable
          v-model.trim="dialogForm.entAddress"
          type="textarea"
          v-bind="{
            autosize: false,
          }"
          maxLength="500"
        />

      </el-form-item>
      <el-form-item label="邮箱：" prop="entEmail">
        <el-input
          clearable
          v-model.trim="dialogForm.entEmail"
        />

      </el-form-item>
      <el-form-item label="传真：" prop="entFax">
        <el-input clearable v-model.trim="dialogForm.entFax"></el-input>

      </el-form-item>
      <el-form-item label="分支机构：" prop="entBranch">
        <el-input clearable v-model.trim="dialogForm.entBranch"></el-input>

      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" :center="true" width="100%">
      <el-button @click="onDialogCancel">取 消</el-button>
      <el-button type="primary" @click="onDialogOk">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import base from '@/api/base.js'
  import TemplateMethod from '@/components/TemplateMethod'

  let _entPlanner = window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).loginName : ''
  let _dialogForm = {
    entName: '',
    entId: '',
    entLevel: '',
    entIsfocus: '0',
    entContact: '',
    entPhone: '',
    entArea: '',
    entPlanner: _entPlanner,
    entCatalog: '',
    entAddress: '',
    entEmail: '',
    entFax: '',
    entBranch: '',
  }

  export default {
    components: {TemplateMethod},
    props: ['dialogTitle', 'dialogVisible', 'dialogRecord'],
    watch: {
      dialogRecord: {
        handler (val) {
          for (let i in val) {
            if (i && val[i]) {
              this.dialogForm[i] = val[i]
            }
          }
        },
      },
    },
    data () {
      // 唯一-校验
      var onlyRules = (tableName, fieldName, rule, value, callback) => {
        if (rule.required && value) {
          const params = {
            tableName: tableName,
            fieldName: fieldName,
            fieldVal: value,
          }
          if (this.dialogRecord && this.dialogRecord.id) {
            params.dataId = this.dialogRecord.id
          }
          this.$api.tempaxios.getList(this.url.only, params)
            .then(res => {
              console.log(res, '校验成功res')
              callback()
            })
            .catch((error) => {
              console.log(error, '校验失败error')
              callback(new Error(error.data.message))
            })
        } else if (!rule.required && value) {
          const params = {
            tableName: tableName,
            fieldName: fieldName,
            fieldVal: value,
          }
          if (this.dialogRecord && this.dialogRecord.id) {
            params.dataId = this.dialogRecord.id
          }
          this.$api.tempaxios.getList(this.url.only, params)
            .then(res => {
              console.log(res, '校验成功res')
              callback()
            })
            .catch((error) => {
              console.log(error, '校验失败error')
              callback(error.data.message)
            })
        } else if (rule.required && !value) {
          callback('不能为空，请重新输入！')
        } else if (!rule.required && !value) {
          callback()
        }
      }
      // 6-16位数字-校验
      var numberRules = (rule, value, callback) => {
        if (rule.required && value) {
          var regu = '^[0-9]{6,16}$'
          var re = new RegExp(regu)
          if (re.test(value)) {
            callback()
          } else {
            callback('格式错误，请输入6-16纯数字')
          }
        } else if (!rule.required && value) {
          var regu = '^[0-9]{6,16}$'
          var re = new RegExp(regu)
          if (re.test(value)) {
            callback()
          } else {
            callback('格式错误，请输入6-16纯数字')
          }
        } else if (rule.required && !value) {
          callback('不能为空，请重新输入！')
        } else if (!rule.required && !value) {
          callback()
        }
      }
      // url网址-校验
      var urlRules = (rule, value, callback) => {
        if (rule.required && value) {
          var re = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
          if (re.test(value)) {
            callback()
          } else {
            callback('url网址格式错误，请重新输入！')
          }
        } else if (!rule.required && value) {
          var re = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
          if (re.test(value)) {
            callback()
          } else {
            callback('url网址格式错误，请重新输入！')
          }
        } else if (rule.required && !value) {
          callback('不能为空，请重新输入！')
        } else if (!rule.required && !value) {
          callback()
        }
      }
      // 手机号-校验
      var cellphoneRules = (rule, value, callback) => {
        if (rule.required && value) {
          var re = /^1[3|4|5|6|7|8]\d{9}$/
          if (re.test(value)) {
            callback()
          } else {
            callback('手机号格式错误，请重新输入！')
          }
        } else if (!rule.required && value) {
          var re = /^1[3|4|5|6|7|8]\d{9}$/
          if (re.test(value)) {
            callback()
          } else {
            callback('手机号格式错误，请重新输入！')
          }
        } else if (rule.required && !value) {
          callback('不能为空，请重新输入！')
        } else if (!rule.required && !value) {
          callback()
        }
      }
      return {
        dialogForm: JSON.parse(JSON.stringify(_dialogForm)), // 新增/编辑-表单
        dialogRules: {
          entName: [
            {
              required: true,
              message: '不能为空，请重新输入!',
              trigger: 'blur',
            },
          ],
          entId: [
            {
              required: true,
              message: '不能为空，请重新输入!',
              trigger: 'blur',
            },
          ],
          entLevel: [
            {},
          ],
          entContact: [
            {
              required: true,
              message: '请填写联系人',
              trigger: 'blur',
            },
          ],
          entIsfocus: [
            {},
          ],
          entPhone: [
            {},
          ],
          entArea: [
            {},
          ],
          entPlanner: [
            {
              required: true,
              message: '不能为空，请重新输入!',
              trigger: 'blur',
            },
          ],
          entCatalog: [
            {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => onlyRules('enterprise', 'ent_Catalog', rule, value, callback)
            },
          ],
          entAddress: [
            {},
          ],
          entEmail: [
            {
              required: false,
              type: 'email',
              message: '格式错误，请输入正确邮箱！',
              trigger: 'blur',
            },
          ],
          entFax: [
            {},
          ],
          entBranch: [
            {},
          ],
        },
        url: {
          add: base.baseUrl + '/enterprise/enterprise/add',
          edit: base.baseUrl + '/enterprise/enterprise/edit',
          only: base.baseUrl + '/sys/duplicate/check',
        },
      }
    },
    mounted () {

    },
    methods: {
      // 新增/编辑_点击确认
      onDialogOk () {
        this.$refs.dialogform.validate((valid) => {
          if (valid) {
            let params = {}
            for (let i in this.dialogForm) {
              if (Array.isArray(this.dialogForm[i])) {
                params[i + '_begin'] = this.dialogForm[i][0]
                params[i + '_end'] = this.dialogForm[i][1]
              } else {
                params[i] = this.dialogForm[i]
              }
            }
            // console.log(params, '对话框数据')
            if (this.dialogTitle == '新增') {
              this.$api.tempaxios.getAdd(this.url.add, params)
                .then(res => {
                  console.log(res, '新增成功res')
                  if (!res.data.ok) {
                    this.$message.warning(res.data.message)
                    return
                  }
                  this.$message.success(res.data.message)
                  this.$emit('dialogCancel', 1, 10)
                  this.dialogForm = JSON.parse(JSON.stringify(_dialogForm))
                })
                .catch((error) => {
                  console.log(error, '新增失败error')
                  this.$message.error(error.data.message)
                  this.$emit('dialogCancel', 1, 10)
                  this.dialogForm = JSON.parse(JSON.stringify(_dialogForm))
                })
            } else if (this.dialogTitle == '编辑') {
              this.$api.tempaxios.getEdit(this.url.edit, params).then(res => {
                console.log(res, '编辑成功res')
                this.$message.success(res.data.message)
                this.$emit('dialogCancel')
                this.dialogForm = JSON.parse(JSON.stringify(_dialogForm))
              }).catch((error) => {
                console.log(error, '编辑失败error')
                this.$message.error(error.data.message)
                this.$emit('dialogCancel')
                this.dialogForm = JSON.parse(JSON.stringify(_dialogForm))
              })
            }
          }
        })
      },
      // 新增/编辑_遮罩层/右上角叉/取消按钮
      onDialogCancel () {
        this.dialogForm = JSON.parse(JSON.stringify(_dialogForm))
        this.$refs.dialogform.resetFields()
        this.$emit('dialogCancel')
      },
    }

  }
</script>
<style lang="less" scoped>
  .el-button--default {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    background: #fff;
    border-radius: 4px;
  }

  .el-button--primary {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
    border-radius: 4px;
  }

  /deep/ .dialog_form {
    margin: 0;
    padding: 0;

    .el-form-item {
      margin: 0;
      padding: 0;
      padding-bottom: 20px;
      display: flex;
      align-items: center;
      overflow: hidden;

      .el-form-item__label {
        width: 25% !important;
      }

      .el-form-item__content {
        margin: 0 !important;
        padding: 0 !important;
        width: 60% !important;

        .el-select, .query_form .el-input {
          width: 100% !important;
        }
      }
    }
  }
</style>
