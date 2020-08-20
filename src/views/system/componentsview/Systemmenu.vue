<template>
  <!-- 系统菜单管理 -->
  <div class="searchWrap"><!--{{menuList}}-->
    <div class="wrap">
      <el-row class="btnGroup">
        <el-button type="primary" size="mini" @click="open(1)">菜单录入</el-button>
        <el-button type="primary" size="mini" @click="open(2)">修改</el-button>
      </el-row>
      <div style="flex: 1;overflow: auto">
        <el-table
          :header-cell-style="{background:'#F3F6FD'}"
          row-key="menuname"
          :data="menuList"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          border
          style="width: 100%;"
          @select-all="dialogCheck"
          @select="dialogCheck"
        >
          <el-table-column type="selection" align="center" :resizable="false"></el-table-column>
          <el-table-column type="index" label="序号" align="center" :resizable="false" width="60"></el-table-column>
          <el-table-column prop="menuname" label="菜单名称" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="link" label="菜单链接" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="roles" label="权限" align="center" :formatter="rolesFormatter"
                           :resizable="false"></el-table-column>
          <el-table-column prop="isenable" label="是否启用" align="center" :formatter="enableFormatter"
                           :resizable="false"></el-table-column>
          <el-table-column prop="sec" label="顺序" align="center" :resizable="false"></el-table-column>
          <el-table-column label="操作" align="center" :resizable="false">
            <template slot-scope="scope">
              <el-button @click="deleteMenu(scope.row)" type="text" size="small" style="color:red">删除</el-button>
              <el-button
                @click="authSetting(scope.row)"
                type="text"
                size="small"
                v-if="scope.row.menu1"
              >权限设置
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 新增/修改弹框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px" :modal="false"
               :close-on-click-modal="false" :close-on-press-escape="false"
               :before-close="beforeClose1">
      <el-form :model="form" label-width="80px" ref="menuForm" :rules="rules1">
        <!-- 菜单等级 -->
        <el-form-item label="菜单等级" prop="menuLevel">
          <el-select
            :disabled="disabled1"
            placeholder="请选择菜单种类"
            v-model="form.menuLevel"
          >
            <el-option label="一级菜单" value="level1"></el-option>
            <el-option label="二级菜单" value="level2"></el-option>
            <!---->
            <el-option label="按钮" value="level3"></el-option>
          </el-select>
        </el-form-item>
        <!-- 菜单名称 / 按钮名称 -->
        <template v-if="form.menuLevel === 'level1' || form.menuLevel === 'level2'">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input placeholder="菜单名称" v-model="form.menuName"></el-input>
          </el-form-item>
        </template>
        <template v-else-if="form.menuLevel === 'level3'">
          <el-form-item label="按钮名称" prop="menuName">
            <el-input placeholder="请填写按钮名" v-model="form.menuName"></el-input>
          </el-form-item>
        </template>
        <!-- 父级菜单 -->
        <template v-if="form.menuLevel === 'level2'">
          <el-form-item label="父级菜单">
            <el-select v-model="form.parentMenu" placeholder="请选择父级菜单">
              <el-option
                v-for="item in menuList"
                :key="item.id"
                :label="item.menuname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-else-if="form.menuLevel === 'level3'">
          <el-form-item label="所属菜单">
            <!--<el-select v-model="form.parentMenu" placeholder="请选择所属菜单">
              <el-option
                v-for="item in menuList"
                :key="item.id"
                :label="item.menuname"
                :value="item.id"
              ></el-option>
            </el-select>-->
            <elTreeSelect
              :value="form.parentMenu"
              @getValue="getValueFn1"
              :options="menuList2"
              :props="{
                value: 'id',// ID字段名
                label: 'menuname',// 显示名称
                children: 'children',// 子级字段名
              }"
            ></elTreeSelect>
          </el-form-item>
        </template>
        <!--  -->
        <!--<template v-if="form.menuLevel === 'level3'">
          {{form.perms}}
          <el-form-item label="授权标识">
            <el-input v-model="form.perms" placeholder="例如: user:create"/>
          </el-form-item>
        </template>-->
        <!-- 菜单地址 -->
        <el-form-item label="菜单地址" v-if="form.menuLevel === 'level2'" prop="menuAddress">
          <el-input placeholder="菜单地址" v-model="form.menuAddress" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" v-if="form.menuLevel === 'level2'">
          <el-select v-model="form.menuRole" placeholder="请选择菜单权限">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" v-if="form.menuLevel === 'level2'">
          <el-select v-model="form.isEnable" placeholder="请选择启用状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- 菜单顺序 -->
        <el-form-item label="菜单顺序" prop="menuSec">
          <el-input placeholder="菜单顺序" v-model.number="form.menuSec" maxlength="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save('menuForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="权限设置" :visible.sync="dialogMenuVisible" width="640px">
      <el-transfer
        v-model="configValue"
        :data="configData"
        :titles="['不具备权限的角色','已具备权限的角色']"
        :props="{
          key: 'id',
          label: 'rolename'
        }"
        @change="configChange"
      ></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMenuVisible = false">关 闭</el-button>
        <el-button type="primary" @click="saveConfig">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import elTreeSelect from '@/components/PublicTools/elTreeSelect/index.vue'

  export default {
    data () {
      return {
        // 树形菜单列表
        menuList: [],
        menuList2: [],
        // 弹出框显示变量
        dialogFormVisible: false,
        dialogMenuVisible: false,
        // 菜单对象
        form: {
          menuId: '',
          menuName: '',
          menuLevel: '',
          parentMenu: '',
          menuAddress: '',
          menuRole: '',
          isEnable: '',
          menuSec: '',
          //
          perms: ''
        },
        // 新增/编辑弹框标题
        title: '',
        // 选中列表数据
        selectioned: [],
        // 配置数组
        configData: [],
        // 已有权限数组
        configValue: [],
        // 当前弹框所属菜单ID
        menuId: '',
        rules1: {
          menuName: [
            {required: true, message: '请输入菜单名称', trigger: 'blur'},
            {min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur'}
          ],
          menuSec: [
            {required: true, message: '请输入菜单顺序', trigger: 'blur'},
            {type: 'number', message: '菜单顺序需输入整数值', trigger: 'blur'},
            {pattern: /^\d{1,4}$/, message: '长度在 1 到 4 个字符', trigger: 'blur'}
          ],
          menuLevel: [
            {required: true, message: '请选择菜单等级', trigger: 'change'}
          ],
          menuAddress: [
            {required: true, message: '请输入菜单地址', trigger: 'blur'}
          ]
        },
        disabled1:false,// 当按钮时,禁用菜单等级,防止报错
      }
    },
    components: {
      elTreeSelect,
    },
    created () {
      this.findList()
      this.findList2()
    },
    methods: {
      getValueFn1 (value) {
        this.form.parentMenu = value
      },
      beforeClose1 (done) {
        this.form.parentMenu = ''
        this.disabled1 = false
        done()
      },
      // 修改前获取父级菜单
      findList2 () {
        this.$api.menu.getMenuList2()
          .then(resp => {
            var menus = this.build_tree(resp.data.data)
            this.menuList2 = menus
          })
          .catch((error) => {
            // this.$message.error(error.data.message)
          })
      },
      // 查询菜单列表
      findList () {
        this.$api.menu.getMenuList()
          .then(resp => {
            var menus = this.build_tree(resp.data.data)
            this.menuList = menus
          })
          .catch((error) => {
            this.$message.error(error.data.message)
          })
      },
      // 构造树结构
      build_tree (menu) {
        var firstLevelMenu = menu.menu1.list
        var secondLevelMenu = menu.menu2Map
        for (var i = 0; i < firstLevelMenu.length; i++) {
          for (var key in secondLevelMenu) {
            if (firstLevelMenu[i].menuname === key) {
              firstLevelMenu[i].children = secondLevelMenu[key]
              /* 天摩托需求2020.5.19 */
              firstLevelMenu[i].menuLevel = 'level1'
              firstLevelMenu[i].disabled = true
              break
            }
          }
        }
        return firstLevelMenu
      },
      // 格式化表格权限列
      rolesFormatter (row, column) {
        var roles = row.roles
        if (roles === 0) {
          return '否'
        } else if (roles === 1) {
          return '是'
        } else {
          return ''
        }
      },
      // 格式化表格启用状态列
      enableFormatter (row, column) {
        var enable = row.isenable
        if (enable === 0) {
          return '禁用'
        } else if (enable === 1) {
          return '启用'
        } else {
          return ''
        }
      },
      // 打开新增/编辑弹框
      open (type) {
        if (type === 1) {
          this.title = '菜单录入'
          for (var key in this.form) {
            this.form[key] = ''
          }
          this.form.menuLevel = 'level1'
        } else {
          this.title = '修改菜单'
          if (this.selectioned.length === 1) {
            if (this.selectioned[0].menuLevel == 'level3') {
              this.disabled1 = true
            }
            for (var key in this.form) {
              this.form.menuId = this.selectioned[0].id
              this.form.menuName = this.selectioned[0].menuname
              /* 原先回显所需参数 */
              // this.form.menuLevel = this.selectioned[0].menu1 ? 'level2' : 'level1'
              // this.form.parentMenu = this.selectioned[0].menu1 ? this.selectioned[0].menu1.id : ''
              this.form.menuLevel = this.selectioned[0].menuLevel
              this.form.parentMenu = this.selectioned[0].parentId
              this.form.perms = this.selectioned[0].perms ? this.selectioned[0].perms : ''
              this.form.menuAddress = this.selectioned[0].link
              this.form.menuRole = this.selectioned[0].roles === 1 ? '1' : this.selectioned[0].roles === 0 ? '0' : ''
              this.form.isEnable = this.selectioned[0].isenable === 1 ? '1' : this.selectioned[0].isenable === 0 ? '0' : ''
              this.form.menuSec = this.selectioned[0].sec
            }
          } else if (this.selectioned.length === 0) {
            return this.$message({
              message: '请选择要修改的菜单！',
              type: 'warning'
            })
          } else {
            return this.$message({
              message: '只能选择一项进行修改！',
              type: 'warning'
            })
          }
        }
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs.menuForm.clearValidate()
        })
      },
      // 保存更改
      save (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.form.menuAddress = encodeURIComponent(this.form.menuAddress)
            this.form.menuAddress = this.form.menuAddress;
            if (this.form.menuId) {
              this.$api.menu.editMenu(this.form)
                .then(resp => {
                  this.$message({
                    message: resp.data.data,
                    type: 'success'
                  })
                  this.findList()
                })
                .catch((error) => {
                  this.$message.error(error.data.message)
                })
            } else {
              this.$api.menu.addMenu(this.form)
                .then(resp => {
                  this.$message({
                    message: resp.data.data,
                    type: 'success'
                  })
                  this.findList()
                })
                .catch((error) => {
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
      // 删除菜单
      deleteMenu (row) {
        this.$confirm('是否确认删除所选项？', '提示', {
          type:'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            // let menuLevel = row.menuLevel == 'level3' ? row.menuLevel : row.menu1 ? 'level2' : 'level1'
            // console.log(row.menu1)
            // return

            this.$api.menu.deleteMenu({
              menuLevel: row.menuLevel,
              menuId: row.id
            }).then(resp => {
              this.$message({
                message: resp.data.data,
                type: 'success'
              })
              this.findList()
              this.selectioned = []
            }).catch((error) => {
              this.$message.error(error.data.message)
            })
          })
          .catch(() => {
          })
      },
      // 获取二级菜单权限列表
      authSetting (row) {
        let that = this
        // that.value = [];
        that.menuId = row.id
        that.dialogMenuVisible = true
        that.$api.menu.getConfigColumn(row.id).then(resp => {
          that.configData = JSON.parse(resp.data.data.json1).concat(JSON.parse(resp.data.data.json2))
          let json2 = JSON.parse(resp.data.data.json2)
          let arr = []
          for (let i = 0; i < json2.length; i++) {
            arr.push(json2[i].id)
          }
          that.configValue = arr
        }).catch((error) => {
          this.$message.error(error.data.message)
        })
      },
      //
      configChange (value, direction, movedKeys) {
        console.log(this.configValue, direction)
      },
      // 保存二级菜单权限列表
      saveConfig () {
        this.$api.menu.saveConfigColumn({
          menuId: this.menuId,
          rlist: this.configValue
        }).then(resp => {
          this.$message({
            message: resp.data.data,
            type: 'success'
          })
          this.dialogMenuVisible = false
        }).catch(error => {
          this.$message.error(error.data.message)
        })
      },
      // 单选操作，全选按钮失效操作
      dialogCheck: function (selection, row) {
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
  }

  .wrap {
    height: 100%;
    background: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .pull-right {
    float: right;
  }

  .btnGroup {
    margin-bottom: 20px;

    .el-button--primary {
      height: 30px;
      min-width: 68px;
      background: linear-gradient(90deg, rgb(96, 157, 248), rgb(84, 183, 235));
      padding: 0 20px;
    }
  }

  .dialog-footer {
    text-align: center;
  }

  .el-message-box__btns {
    text-align: center;
  }

  /deep/ .el-transfer-panel {
    width: 250px;
    height: 300px;
  }
</style>
