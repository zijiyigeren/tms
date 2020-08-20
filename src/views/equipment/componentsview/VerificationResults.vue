<template>
    <!-- 校准结果科室确认 -->
  <div class="verification-results">
    <div class="verification-results_con" style="height: 100%;display: flex;flex-direction: column;">
      <el-form
        v-bind="{
            size:'mini',
            labelWidth:'90px',
            model: formData,
            labelSuffix:' :'
        }"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="设备编号">
              <el-input v-model="formData.code" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-input v-model="formData.name" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="">
              <div style="text-align: right">
                <el-button type="primary" @click="active_queryFn1">查询</el-button>
                <el-button type="info">重置</el-button>
              </div>
            </el-form-item>

          </el-col>
        </el-row>


      </el-form>
      <div style="flex: 1;">
        <el-table
          v-bind="{
                    height: 'calc(100% - 15px)',
                    data: tableData,
                    border: true,
                    headerCellStyle:{ background:'#F3F6FD',color:'#606266' }
                }"
        >
          <el-table-column :resizable="false" property="code" label="编号"/>
          <el-table-column :resizable="false" property="name" label="设备名称"/>
          <el-table-column :resizable="false" property="useCompany" label="使用单位"/>
          <el-table-column :resizable="false" label="检定单位">
            <template slot-scope="{ row }">
              {{filter_checkCompany(row.tchecking.checkCompany)}}
            </template>
          </el-table-column>
          <el-table-column :resizable="false" property="" label="证书类别">
            <template slot-scope="{ row }">
              <p style="margin: 0;padding: 0">查看证书:
                <span style="color: #409EFF;cursor: pointer;"
                      @click="certificateView(row.id)"
                >{{filter_certificateType(row.tchecking.certificateType)}}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column :resizable="false" property="" label="检定方式">
            <template slot-scope="{ row }">
              {{filter_checkModel(row.tchecking.checkModel )}}
            </template>
          </el-table-column>
          <el-table-column :resizable="false" property="" label="检定日期">
            <template slot-scope="{ row }">
              {{row.tchecking.checkdate2}}
            </template>
          </el-table-column>
          <el-table-column :resizable="false" property="" label="操作">
            <template slot-scope="{ row }">
              <el-button type="text" @click="approvalCompleted(row.id)">确定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        layout="total, ->, prev, pager, next, jumper"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="currentChange"
      />
    </div>
    <!---->
    <el-dialog
      :visible.sync="viewVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-bind="{
                title:'查看证书',
                modal: false,
                // top: '5vh',
                width: '500px'
            }"
      @close="closeFn_"
    >
      <view-certificate
        style="height: 500px;"
        ref="view1"
        v-bind="{
                    certificateData: fileList,
                }"
        @closeFn1="closeFn1"
      />
    </el-dialog>
  </div>

</template>

<script>
  import base from '@/api/base.js'
    import viewCertificate from '../component/ViewCertificate.vue'

    let _formData = {
        code: '',
        name: ''
    }
    export default {
        name: 'verificationresults',
        components: {
            viewCertificate,
        },
        data () {
            return {
                formData: {..._formData},
                /* ************* */
                tableData: [],
                /* ******* 字典源数据 ****** */
                checkCompanyList: null,
                certificateTypeList: null,
                checkModelList: null,
                /* ************* */
                total: 0,
                currentPage: 1,
                pageSize: 15,
                /* ************* */
                viewTitle: '查看证书',
                viewVisible: false,
                viewRow: null,
                /* ************* */
                fileList: []
            }
        },
      created () {
        this.get_checkCompany()
        this.get_certificateType()
        this.get_checkModel()
      },
      mounted () {
        this.queryFn1(this.current, this.pageSize)
      },
        methods: {
          /*
            * 数据字典: 检定单位
            * */
          get_checkCompany () {
            this.$api.tempaxios.getList(base.baseUrl + '/sys/dictype/list/', {dicCode: 'checkCompany'})
              .then(res => {
                this.checkCompanyList = [...res.data.data]
              })
              .catch((error) => {
              })
          },
          /*
            * 数据字典: 证书类别
            * */
          get_certificateType () {
            this.$api.tempaxios.getList(base.baseUrl + '/sys/dictype/list/', {dicCode: 'certificateType'})
              .then(res => {
                this.certificateTypeList = [...res.data.data]
              })
              .catch((error) => {
              })
          },
          /*
            * 数据字典: 检定方式
            * */
          get_checkModel () {
            this.$api.tempaxios.getList(base.baseUrl + '/sys/dictype/list/', {dicCode: 'checkModel'})
              .then(res => {
                this.checkModelList = [...res.data.data]
              })
              .catch((error) => {
              })
          },
          active_queryFn1(){
            this.current = 1
            this.queryFn1(this.current, this.pageSize)
          },
            /*
            * 查询
            * */
            queryFn1 (currentPage, pageSize) {
                let params = {
                    ...this.formData,
                    currentPage,
                    pageSize,
                }
                this.$api.VerificationResults.approval(params)
                    .then((resp) => {
                        let temp = resp.data.data
                        this.tableData = temp.list.slice(0)
                        this.total = temp.total
                    })
                    .catch(() => {
                    })
            },
            /* *************************** */
            /*
            * 查看证书
            * */
            certificateView (id) {
                let params = {
                    checkingId: id,
                }
                this.$api.VerificationResults.certificateView(params)
                    .then((res) => {
                        let temp = res.data.data
                        this.viewVisible = true
                        this.$nextTick(() => {
                            this.fileList = temp['certificateFileList'].slice(0)
                            this.$refs['view1'].checkingId = id
                            if (!temp['terminalFile']) {
                                this.$refs['view1'].fileName = ''
                            } else {
                                this.$refs['view1'].fileName = temp['terminalFile'].fileName
                            }
                        })
                    })
                    .catch(() => {
                    })
            },
            /*
            * 关闭查看弹框前
            * */
            closeFn1 () {
                this.viewVisible = false
            },
            /*
            * 关闭时
            * */
            closeFn_ () {
                Object.assign(this.$refs['view1'].$data, this.$refs['view1'].$options.data())
                this.queryFn1(this.current, this.pageSize)
            },
            /* *************************** */
            /*
            *  科室确认
            * */
            approvalCompleted (id) {
                let params = {
                    id,
                }
                this.$api.VerificationResults.approvalCompleted(params)
                    .then((resp) => {
                        this.queryFn1(this.current, this.pageSize)
                    })
                    .catch(err => {
                        this.$message.error({
                            message: err.data.message,
                            duration: 3500,
                        })
                    })
            },

            /* *************************** */

            filter_checkCompany(originVal){
              let str = originVal + ''
              let question = ''
              let _this = this
              // 防止数据字典接口出问题引起的表而过数据回显不正确
              if (!_this.checkCompanyList) {
                return originVal
              }
              for (let i in _this.checkCompanyList) {
                if (str == _this.checkCompanyList[i].dicTypeCode) {
                  question = _this.checkCompanyList[i].dicTypeName
                  break
                }
              }
              if (question != ''){
                return question
              } else{
                return originVal
              }
            },
            filter_certificateType(originVal){
              let str = originVal + ''
              let question = ''
              let _this = this
              // 防止数据字典接口出问题引起的表而过数据回显不正确
              if (!_this.certificateTypeList) {
                return originVal
              }
              for (let i in _this.certificateTypeList) {
                if (str == _this.certificateTypeList[i].dicTypeCode) {
                  question = _this.certificateTypeList[i].dicTypeName
                  break
                }
              }
              if (question != ''){
                return question
              } else{
                return originVal
              }
            },
            filter_checkModel(originVal){
              let str = originVal + ''
              let question = ''
              let _this = this
              // 防止数据字典接口出问题引起的表而过数据回显不正确
              if (!_this.checkModelList) {
                return originVal
              }
              for (let i in _this.checkModelList) {
                if (str == _this.checkModelList[i].dicTypeCode) {
                  question = _this.checkModelList[i].dicTypeName
                  break
                }
              }
              if (question != ''){
                return question
              } else{
                return originVal
              }
            },

            /* *************************** */
            currentChange (val) {
                this.current = val
            },
        },

    }
</script>

<style scoped lang="less">

  .el-button--primary {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    span {
      line-height: 30px;
    }
    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
    border-radius: 4px;
  }
  .el-button--info, .el-button--default {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    span {
      line-height: 30px;
    }
    border-radius: 4px;
  }

.verification-results{
  width: 100%;
  height: 100%;
  background: #eee;
  margin: 0;
  padding: 10px;
  overflow: hidden;

  .verification-results_con{
    padding: 20px;
    width: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
  }
}
</style>
