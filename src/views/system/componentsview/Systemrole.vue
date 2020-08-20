<template>
  <!-- 系统角色管理 -->
  <div class="searchWrap">
    <div class="wrap">
      <el-form :inline="true" size="small"
               class="demo-form-inline"
      >
        <div style="display: flex;align-items: center;width: calc(100% - 55px);">
          <el-form-item label="角色名称 :">
            <el-input v-model.trim="roleVo.rolename" clearable style="width:89%"></el-input>
          </el-form-item>
          <el-form-item label="角色编号 :">
            <el-input v-model.trim="roleVo.rolecode" clearable style="width: 89%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="findList" class="querySelt">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-row class="btnGroup">
        <el-button type="primary" @click="open(1)">新增</el-button>
        <el-button type="primary" @click="open(2)">修改</el-button>
        <el-button type="primary" @click="deleteRole">删除</el-button>
        <el-button type="primary" class="pull-right" @click="exportRole">导出</el-button>
        <el-button type="" @click="empowerRole" size="mini">权限配置</el-button>
      </el-row>
      <div style="flex: 1;overflow: auto;">
        <el-table
          :header-cell-style="{background:'#F3F6FD'}"
          ref="multipleTable"
          :data="roleList"
          border
          style=""
          @selection-change="dialogCheck"
        >
          <el-table-column type="selection" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="rolename" label="角色名称" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="rolecode" label="角色编号" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="orderby" label="序号" align="center" :resizable="false"></el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新增/修改弹框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="30%">
      <el-form :rules="rules" :model="form" label-width="80px" ref="roleForm">
        <el-form-item label="角色名称" prop="rolename">
          <el-input placeholder="角色名称" v-model="form.rolename"></el-input>
        </el-form-item>
        <el-form-item label="角色编号" prop="rolecode">
          <el-input placeholder="角色编号" v-model="form.rolecode"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="orderby">
          <el-input placeholder="序号" v-model.number="form.orderby" maxlength="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save('roleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <a-drawer
      title="角色按钮权限配置"
      width="50%" placement="right"
      :visible.sync="visibleConfig"
      v-bind="{
        // wrapClassName: 'mly-drawer1',
        maskClosable: false,
      }"
      :drawerStyle="{
          display: 'flex',
          flexDirection:'column'
        }"
      :bodyStyle="{
          flex: 1,
          overflow: 'hidden'
        }"
      @close="restDataFn1"
    >
      <div style="height:calc(100% - 30px);overflow: auto;">
        <div>
          <a-tree :treeData="treeData" checkable
                  v-model="checkedConf"
                  v-bind="{
                defaultExpandAll: true,
                // checkStrictly: true,
                replaceFields: {
                  children: 'list',
                  title: 'menuname',
                  key: 'id'
                }
              }"
          />
        </div>
      </div>
      <a-button type="primary" @click="saveMenuRole">保存并关闭</a-button>
    </a-drawer>
  </div>
</template>
<script>
  import base from '@/api/base.js'

  export default {
    data () {
      return {
        roleList: [],
        roleVo: {
          rolename: '',
          rolecode: ''
        },
        dialogFormVisible: false,
        form: {
          id: '',
          rolename: '',
          rolecode: '',
          orderby: ''
        },
        title: '',
        selectioned: [],
        rules: {
          rolename: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur'}
          ],
          rolecode: [
            {required: true, message: '请输入角色编号', trigger: 'blur'},
            {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
          ],
          orderby: [
            {required: true, message: '请输入序号', trigger: 'blur'},
            {type: 'number', message: '序号需输入整数值', trigger: 'blur'}
          ]
        },
        visibleConfig: false,
        roleId: '',
        // 记录修改之前的权限数据
        beforeMenuIds: [],
        // 权限树
        treeData: [],
        // 已选权限
        // checkedConf: {"checked": []},
        checkedConf: [],
      }
    },
    created () {
      // 获取角色列表
      this.findList()
    },
    mounted () {
      this.$api.role.findTreeMenu()
        .then(res => {
          this.treeData = res.data.data
        })
        .catch()
    },
    methods: {
      // 关闭权限配置前的回调
      restDataFn1 () {
        this.visibleConfig = false
        this.beforeMenuIds = []
      },
      /* 角色授权 */
      empowerRole () {
        if (
          this.selectioned instanceof Array &&
          this.selectioned.length == 1
        ) {
          let data = this.selectioned[0]
          this.roleId = data.id
          let params = {
            roleId: data.id
          }
          this.$api.role.getMenuIdByRoleId(params)
            .then(res => {
              this.beforeMenuIds = JSON.parse(JSON.stringify(res.data.data))
              this.visibleConfig = true
              // this.$nextTick(() => {
              this.checkedConf = res.data.data
              // })
            })
        } else {
          this.$message.warning({
            message: '请选择一个角色进行权限配置',
            duration: 3000,
            showClose: true,
          })
          return false
        }

      },
      // 保存角色授权数据
      saveMenuRole () {
        let params = {
          roleid: this.roleId,
          lastMenuIds: this.beforeMenuIds,
          newMenuIds: this.checkedConf
        }

        // this.$confirm('请退出重新登陆生效','提示',{
        //   type: 'warning',
        // }).then(()=>{
        this.$api.role.saveMenuRole(params)
          .then(res => {

            if (res.data.respCode == 0){
              this.$message.success({
                message: res.data.data,
                duration:3000,
              });
              this.visibleConfig = false
            }

            // this.userLogout().then(() => {
            //   this.$router.push('/')
            // }).catch(err => {
            //   console.log(err)
            // })
          })
          .catch(err => {
          })
          .then(() => {
            // this.visibleConfig = false;
            // this.findList()
          })
        // }).catch(()=>{
        // })
      },
      findList () {
        this.$api.role.getRoleList(this.roleVo).then(resp => {
          this.roleList = resp.data.data
        }).catch((error) => {
          this.$message.error(error.data.message)
        })
      },
      open (type) {
        if (type === 1) {
          this.title = '新增角色'
          this.form.id = ''
          this.form.rolename = ''
          this.form.rolecode = ''
          this.form.orderby = ''
        } else {
          this.title = '修改角色'
          if (this.selectioned.length === 1) {
            this.form.id = this.selectioned[0].id
            this.form.rolename = this.selectioned[0].rolename
            this.form.rolecode = this.selectioned[0].rolecode
            this.form.orderby = this.selectioned[0].orderby
          } else if (this.selectioned.length === 0) {
            return this.$message({
              message: '请选择要修改的角色！',
              type: 'warning'
            })
          } else {
            return this.$message({
              message: '只能选择一项进行修改！',
              type: 'warning'
            })
          }
        }
        this.selectioned = []
        this.dialogFormVisible = true
        this.$refs.roleForm.clearValidate()  //不清除实际作用
      },
      save (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.form.id) {
              this.$api.role.editRole(this.form).then(resp => {
                this.$message({
                  message: resp.data.data,
                  type: 'success'
                })
                this.findList()
              }).catch((error) => {
                this.$message.error(error.data.message)
              })
            } else {
              this.$api.role.addRole(this.form).then(resp => {
                this.$message({
                  message: resp.data.data,
                  type: 'success'
                })
                this.findList()
              }).catch((error) => {
                this.$message.error(error.data.message)
              })
            }
            this.dialogFormVisible = false
          } else {
            this.dialogFormVisible = true
            return false
          }
        })
      },

      deleteRole: function () {
        if (this.selectioned.length === 1) {
          this.form.id = this.selectioned[0].id
          this.form.rolename = this.selectioned[0].rolename
          this.form.rolecode = this.selectioned[0].rolecode
          this.form.orderby = this.selectioned[0].orderby
        } else if (this.selectioned.length === 0) {
          return this.$message({
            message: '请选择要删除的角色！',
            type: 'warning'
          })
        }
        var ids = []
        for (var i = 0; i < this.selectioned.length; i++) {
          ids.push(this.selectioned[i].id)
        }
        this.$confirm('是否确认删除所选角色？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.role.deleteRole(ids).then(resp => {
            this.$message({
              message: resp.data.data,
              type: 'success'
            })
            this.findList()
            this.selectioned = []
          }).catch((error) => {
            this.$message.error(error.data.message)
          })
        }).catch(() => {
        })
      },

      // 导出
      exportRole: function () {
        var a = document.createElement('a')
        a.href = `${base.hanlei}/roleManagement/exportRole`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      },

      /**
       *  单选操作，全选按钮失效操作
       */
      dialogCheck: function (selection) {
        this.selectioned = selection
      }
    }
  }
</script>
<style lang="scss" scoped>
  .searchWrap {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #eee;

    .el-button--primary {
      height: 30px;
      padding: 0 20px;
      min-width: 68px;
      background: linear-gradient(90deg, rgb(96, 157, 248), rgb(84, 183, 235));;
    }

    /*.mly-drawer1 .ant-drawer-content-wrapper .ant-drawer-content .ant-drawer-wrapper-body{*/
    /*  display: flex !important;*/
    /*  flex-direction: column !important;*/
    /*  .ant-drawer-body{*/
    /*    flex: 1 !important;*/
    /*    overflow: auto !important;*/
    /*  }*/
    /*}*/
  }

  .wrap {
    background: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;

    .demo-form-inline {
      margin-bottom: 20px;
    }

    .el-form-item {
      margin: 0;
    }
  }

  .pull-right {
    float: right;
  }

  .btnGroup {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e6e6e6;
  }

  .dialog-footer {
    text-align: center;
  }

  .el-message-box__btns {
    text-align: center;
  }

  .querySelt {
    margin-left: 1vw
  }

</style>
