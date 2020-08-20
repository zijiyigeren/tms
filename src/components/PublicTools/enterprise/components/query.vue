<template>
  <!-- 查询 -->
  <div class="query_box">
    <div class="simple_query_data">
      <el-form :inline="true" size="small" :model="queryForm" class="query_form" label-width="82px">

        <el-form-item label="企业名称：">
          <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                    v-model.trim="queryForm.entName"></el-input>

        </el-form-item>


        <el-form-item label="企业ID：">
          <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                    v-model.trim="queryForm.entId"/>

        </el-form-item>


        <el-form-item label="企业等级：">
          <template-method
            :type="'select'"
            :dicCode="'entLevel'"
            v-model="queryForm.entLevel"/>

        </el-form-item>


        <el-form-item label="区域：">
          <template-method
            :type="'select'"
            :dicCode="'entArea'"
            v-model="queryForm.entArea"
            @GET_originData="GET_originData"
          />

        </el-form-item>


        <el-form-item label="计划员：" v-show="showState">
          <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                    v-model.trim="queryForm.entPlanner"></el-input>

        </el-form-item>


        <el-form-item label="企业目录：" v-show="showState">
          <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                    v-model.trim="queryForm.entCatalog"></el-input>

        </el-form-item>

      </el-form>

      <!-- 展开/收起 -->
      <div class="query_show">
        <el-button v-if="showbut!=0" @click="onClickShow(0)" type="text"
                   style="color:#32AFF0;padding: 10px 0;border: none;">
          收起 <i class="el-icon-arrow-up"></i>
        </el-button>
        <el-button v-else-if="showbut==0" @click="onClickShow(1)" type="text"
                   style="color:#32AFF0;padding: 10px 0;border: none;">
          展开 <i class="el-icon-arrow-down"></i>
        </el-button>
      </div>
    </div>

    <!-- 查询按钮 -->
    <div class="query_btn">
      <p class="query_btn_left">
        <template v-if="showButton">
          <el-button type="primary" @click="onNewAdd">新建</el-button>
          <el-upload
            ref="upload"
            accept=".xlsx"
            action="1"
            :limit="1"
            :file-list="filelist"
            :http-request="uploadChange">
            <el-button size="small" type="primary">导入</el-button>
          </el-upload>
          <el-button type="primary" @click="onExport">导出</el-button>
        </template>
      </p>
      <p class="query_btn_right">
        <el-button type="primary" @click="onQuery(1,10)">查询</el-button>
        <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button>
      </p>
    </div>

    <!-- 新增 -->
    <Addoredit
      ref="Addoredit"
      :dialogTitle="dialogTitle"
      :dialogVisible="dialogVisible"
      :dialogRecord="dialogRecord"
      @dialogCancel="onDialogCancel"
    />
  </div>
</template>
<script>
  import base from '@/api/base.js'
  import TemplateMethod from '@/components/TemplateMethod'
  import Addoredit from './addoredit.vue'

  export default {
    components: {Addoredit, TemplateMethod},
    props: ['multipleSelection','queryForm'],
    watch: {
      multipleSelection: {
        immediate:true,
        handler (val) {
          if (val.length > 0) {
            const arr = []
            val.forEach(item => {
              arr.push(item.id)
            })
            this.exportList = arr
          } else {
            this.exportList = []
          }
        },
      },
      queryForm: {
        immediate:true,
        handler(val) { 
          this.formData = val;
        }
      },
    },
    data () {
      return {
        showState: false, // 查询框显示状态
        showbut: 0, // 展开/收起-状态
        filelist: [], // 上传列表
        exportList: [], // 导出-表格选中数据
        dialogTitle: '', // 对话框标题
        dialogVisible: false, // 对话框-展示状态
        dialogRecord: {}, // 对话框-数据
        formData: {},
        url: {
          exportXls: base.baseUrl + '/enterprise/enterprise/exportXls',
          importExcelUrl: base.baseUrl + '/enterprise/enterprise/importExcel',
        },
        /***************** 完善代码生成的文件业务逻辑的变量: *******************/
        showButton:true,
      }
    },
    created () {

    },
    mounted () {
      this.onQuery(1, 10)
    },
    methods: {
      // 导入
      uploadChange (params) {
        this.filelist = []
        console.log(params.file, 'params')
        let name = (params.file.name).substring((params.file.name).lastIndexOf('.') + 1, (params.file.name).length)
        if (name != 'xlsx') {
          this.$message.error('上传失败，格式错误，请选择xlsx格式文件！')
        } else {
          let par = new FormData()
          par.append('imageFile', params.file ? params.file : '')
          this.$api.tempaxios.getAdd(this.url.importExcelUrl, par).then(res => {
            console.log(res.data, '导入成功res')
            if (res.data.success && (res.data.code == 200)) {
              this.$message.success(params.file.name + '文件导入成功')
            } else {
              this.$message.error(res.data.message)
            }
            this.onQuery(1, 10)
          }).catch((error) => {
            console.log(error, '导入失败error')
            this.$message.error(params.file.name + '文件导入失败')
          })
        }
      },
      // 导出
      onExport () {
        let selections = ''
        if (this.exportList && this.exportList.length > 0) {
          this.exportList.forEach(item => [
            selections = selections + item + ','
          ])
        }
        selections = (selections.slice(selections.length - 1) == ',') ? selections.slice(0, -1) : selections
        if (selections) {
          const a = document.createElement('a')
          a.setAttribute('download', '')
          a.setAttribute('href', this.url.exportXls + '?selections=' + selections)
          a.click()
        } else {
          const a = document.createElement('a')
          a.setAttribute('download', '')
          a.setAttribute('href', this.url.exportXls)
          a.click()
        }
      },
      // 展开/收起_点击
      onClickShow (val) {
        this.showState = !this.showState
        this.showbut = val
      },
      // 点击查询
      onQuery (current, pageSize) {
        this.$emit('Query', current, pageSize, true);
      },
      // 回车事件
      onPressEnter (e) {
        if (e.keyCode && e.keyCode == 13) {
          this.onQuery(1, 10)
        }
      },
      // 点击重置
      onReset () {
        this.$emit('Query', 1, 10, false);
      },
      // 新增
      onNewAdd () {
        this.dialogTitle = '新增'
        this.dialogVisible = true
        this.dialogRecord = {}
        this.$refs['Addoredit'].$refs['dialogform'].clearValidate()
      },
      // 对话框_遮罩层/右上角叉/取消按钮
      onDialogCancel () {
        this.dialogTitle = ''
        this.dialogVisible = false
        this.$nextTick(()=>{
          Object.assign(this.$refs['Addoredit'].$data, this.$refs['Addoredit'].$options.data())
        })
        this.dialogRecord = {}
        this.onQuery(1, 10)
      },
      /***************** 完善代码生成的文件业务逻辑的方法: *******************/
      //
      GET_originData(value){
        this.$store.commit({
          type: 'save_originData_entArea',
          data: value
        })
      },
    },
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

  .reset_btn {
    margin: 0 !important;
    margin-left: 10px !important;
    background: #909399 !important;
    border-color: #909399 !important;
  }

  .el-divider--vertical {
    margin: 0;
  }

  .el-divider {
    background-color: rgb(50, 175, 240);
  }

  /deep/ .query_form {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;

    .el-form-item {
      margin: 0;
      padding: 0 10px 20px 0;
      width: 25%;
      display: flex;
      align-items: center;
      overflow: hidden;

      .el-form-item__label {
        white-space: nowrap;
      }

      .el-form-item__content {
        flex: 1;

        .el-select, .el-input, .el-date-editor {
          width: 100% !important;
        }

        .el-date-editor {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .el-input__icon {
            width: 25px;
          }

          .el-range-input {
            flex: 1;
          }

          .el-range-separator {
            width: 25px;
            padding: 0 !important;
          }
        }
      }
    }
  }

  .query_box {
    width: 100%;
    height: auto;
    overflow: hidden;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .simple_query_data {
      width: 100%;
      display: flex;

      .query_form {
        width: 100%;
      }
    }

    .complex_query_data {
      width: 100%;
      display: flex;

      .query_form {
        flex: 1;
      }
    }

    .query_btn {
      display: flex;
      justify-content: space-between;
      align-items: center;

      p {
        margin: 0;
        padding: 0;
        overflow: hidden;
      }

      .query_btn_left {
        display: flex;

        .el-button {
          margin-right: 10px;
        }
      }
    }
  }

  /deep/ .el-dialog__wrapper {
    padding: 8% 0;
    overflow: hidden;

    .el-dialog {
      height: 100%;
      overflow: hidden;
      margin: 0 auto !important;
      padding: 0 !important;
      display: flex;
      flex-direction: column;

      .el-dialog__body {
        flex: 1 !important;
        padding: 20px;
        overflow-y: auto;
      }
    }
  }
</style>
