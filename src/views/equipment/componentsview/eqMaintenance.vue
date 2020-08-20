<template>
    <!-- 设备保养 -->
  <div class="eq-maintenance">
    <div class="eq-maintenance_con"  style="height: 100%;display: flex;flex-direction: column;">
        <el-form
            v-bind="{
                size:'mini',
                labelWidth:'110px',
                model: formData,
            }"
        >
            <el-row>
                <el-col :span="6">
                    <el-form-item label="设备编号">
                        <el-input v-model="formData.code" clearable/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="设备型号">
                        <el-input v-model="formData.model" clearable/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="设备名称">
                        <el-input v-model="formData.name" clearable/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="">
                        <div style="text-align: right">
                            <el-button type="primary" @click="getList(1,15)">查询</el-button>
                            <el-button type="info">重置</el-button>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <p>
            <el-button size="mini" type="primary" @click="openFn1">新增保养记录</el-button>
        </p>
        <div style="flex: 1;">
            <el-table
                v-bind="{
                    height:'calc(100% - 15px)',
                    data:tableData,
                    border:true,
                    headerCellStyle:{ background:'#F3F6FD',color:'#606266' }
                }"
            >
                <el-table-column
                    v-bind="{
                        label:'序号',
                        align:'center',
                        resizable:false,
                        width:'55',
                        type:'index',
                        property:'',
                    }"
                    :index="i=>(currentPage-1)*pageSize+i+1"
                />
                <el-table-column :resizable="false" property="code" label="设备编号"/>
                <el-table-column :resizable="false" property="model" label="设备型号"/>
                <el-table-column :resizable="false" property="name" label="设备名称"/>
                <el-table-column :resizable="false" property="productCompany" label="所在科室"/>
                <el-table-column :resizable="false" property="maintenancePersonnel" label="保养人员"/>
                <el-table-column :resizable="false" property="maintenanceTime" label="保养时间"/>
                <el-table-column :resizable="false" property="" label="是否有附件" width="100" align="center">
                    <template slot-scope="{ row }">
                        {{row.maintenanceId ? '是' : '否'}}
                    </template>
                </el-table-column>
                <el-table-column :resizable="false" property="" label="操作" align="center">
                    <template slot-scope="{ row }">
                        <el-button type="text" @click="openFn2(row)">编辑</el-button>
                        <el-button type="text" @click="openFn3(row)">查看</el-button>
                        <el-button type="text" @click="delRecord(row.id)"
                                   style="color: red;"
                        >删除
                        </el-button>
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
          title: comTitle,
          // modal: false,
          top: '5vh',
          width:'1080px',
          // modal:false,
      }"
      @close="cloFN"
    >
      <eq-maintenance-infor
        style="height: 550px;"
        ref="view2"
        v-bind="{}"
        @closeFn2="closeFn2"
        @openInnerFn="openInnerFn"
      />
      <!---->
      <el-dialog
        width="1000px"
        title="设备选择"
        :visible.sync="innerVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        @close="cloFN_c"
        top="6vh"
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
                  <el-input v-model.trim="code_c" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="设备名称">
                  <el-input v-model.trim="name_c" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="设备型号">
                  <el-input v-model.trim="model_c" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <p style="text-align: right;margin: 0;padding: 0;">
                  <el-button type="primary" size="mini" @click="activeOnQuery_c">查询</el-button>
                </p>
              </el-col>
            </el-row>
          </el-form>
          <el-pagination
            style="margin-bottom: 14px;"
            layout="total, ->, prev, pager, next, jumper"
            :total="total_c"
            :current-page="currentPage_c"
            :page-size="pageSize_c"
            @current-change="currentChange_c"
          />
          <el-table
            v-loading="m_tableLoading"
            v-bind="{
                            height:'450px',
                            data:tableData_c,
                            border:true,
                        }"
            :header-cell-style="{ background:'#F3F6FD',color:'#606266' }"
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
                <el-radio v-model="currentEQinfo" :label="row"><i></i></el-radio>
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
          <p style="text-align: center;margin:14px 0 0 0;">
            <el-button size="mini" type="primary" @click="pushDataFn_c">确定</el-button>
            <el-button size="mini" @click="cancelFn1_c">取消</el-button>
          </p>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
    import eqMaintenanceInfor from '../component/eqMaintenanceInfor.vue'

    let _formData = {
        code: '',
        name: '',
        model: '',
    }
    export default {
        name: 'eqmaintenance',
        components: {
            eqMaintenanceInfor,
        },
        data () {
            return {
                formData: {..._formData},
                /* ************* */
                tableData: [],
                /* ************* */
                total: 0,
                currentPage: 1,
                pageSize: 15,
                /* ************* */
                viewTitle: '',
                viewVisible: false,
                viewData: null,
                /* ************* */
                innerVisible: false,
                m_tableLoading: false,
                /* ************* */
                code_c: '',
                name_c: '',
                model_c: '',
                /* ************* */
                total_c: 0,
                currentPage_c: 1,
                pageSize_c: 15,
                /* ************* */
                tableData_c: [],
                /* ************* */
                currentEQinfo: null,
            }
        },
        computed: {
            comTitle () {
                return this.viewTitle + '设备保养记录'
            }
        },
        methods: {
            /*
            * 查询
            * */
            getList (currentPage, pageSize) {
                let params = {
                    ...this.formData,
                    currentPage,
                    pageSize,
                }
                this.$api.eqMaintenance.getList(params)
                    .then((resp) => {
                        let temp = resp.data.data
                        this.tableData = temp.list.slice(0)
                        this.total = temp.total
                    })
                    .catch(() => {
                    })
            },
            /*
            * 打开新增弹框
            * */
            openFn1 () {
                this.viewTitle = '新增'
                this.viewVisible = true
            },
            /*
            * 分页器变化
            * */
            currentChange (val) {
                this.currentPage = val
            },
            /*
            * 打开编辑弹框
            * */
            openFn2 (data) {
                this.viewTitle = '编辑'
                this.viewVisible = true
                this.$nextTick(() => {
                    this.$refs['view2'].maintenanceRecord = JSON.parse(JSON.stringify(data))
                })
            },
            /*
            * 打开查看弹框
            * */
            openFn3 (data) {
                this.viewTitle = '查看'
                this.viewVisible = true
                this.$nextTick(() => {
                  this.$refs['view2'].allReadonly = true
                  this.$refs['view2'].maintenanceRecord = JSON.parse(JSON.stringify(data))
                })
            },
            /* **** 关闭新增弹框 **** */
            closeFn2 () {
                this.viewVisible = false
            },
            cloFN () {
                Object.assign(this.$refs['view2'].$data, this.$refs['view2'].$options.data())
                this.$nextTick(() => {
                    this.getList(this.current, this.pageSize)
                })
            },
            /*
            * 删除
            * */
            delRecord (id) {
              this.$confirm('是否删除此数据吗？','提示', {
                type: 'warning'
              })
                .then(()=>{
                    let params = {
                      id,
                    }
                    this.$api.eqMaintenance.delRecord(params)
                      .then(() => {
                        this.$nextTick(() => {
                          this.getList(this.current, this.pageSize)
                        })
                      })
                      .catch((err) => {
                        this.$message.error({
                          message:err.data.message,
                          duration:5000,
                          showClose:true
                        })
                      })
                })
                .catch(()=>{})
            },
            /* ************************** */
            /*
            * 打开设备选择
            * */
            openInnerFn () {
                this.innerVisible = true
                this.activeOnQuery_c()
            },
            /*
            * 触发查询按钮
            * */
            activeOnQuery_c(){
              this.currentPage_c = 1
              this.pageSize_c = 15
              this.onQuery_c(this.currentPage_c, this.pageSize_c,false)
            },
            onQuery_c (currentPage, pageSize, flag) {// 第三个参数不能删除,防止按钮查询和分页器查询互相影响
              this.m_tableLoading = true
              let params = {}
                if (!flag){
                   params = {
                    code: this.code_c,
                    model: this.model_c,
                    name: this.name_c,
                    currentPage,
                    pageSize,
                  }
                } else{
                   params = {
                    currentPage,
                    pageSize,
                  }
                }

                this.$api.eqManage.searchTerminal(params)
                    .then((resp) => {
                        let temp = resp.data.data
                        this.tableData_c = temp.terminal.list.slice(0)
                        this.total_c = temp.terminal.total
                    })
                    .catch(err => {
                      this.$message.error({
                        message:err.data.message,
                        duration:5000,
                        showClose:true,
                      })
                    })
                  .then(()=>{
                    this.m_tableLoading = false
                  })
            },
            /*
            * 分页器_c 变化
            * */
            currentChange_c (val) {
                this.currentPage_c = val
              if (
                this.code_c == '' ||
                this.model_c == '' ||
                this.name_c == ''
              ) {
                this.onQuery_c(this.currentPage_c, this.pageSize_c,false)
              }else {
                this.onQuery_c(this.currentPage_c, this.pageSize_c,true)
              }
            },
            /*
            * 代入已选中给的设备信息
            * */
            pushDataFn_c () {
                this.innerVisible = false
                if (this.currentEQinfo) {
                    let temp = JSON.parse(JSON.stringify(this.currentEQinfo))
                    this.$refs['view2'].maintenanceRecord['code'] = temp['code']
                    this.$refs['view2'].maintenanceRecord['name'] = temp['name']
                    this.$refs['view2'].maintenanceRecord['model'] = temp['model']
                    this.$refs['view2'].maintenanceRecord['productCompany'] = temp['productCompany']
                    this.$refs['view2'].maintenanceRecord['useCompany'] = temp['useCompany']
                }
            },
            /*
            * 取消代入设备信息
            * */
            cancelFn1_c () {
                this.innerVisible = false
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
                this.currentEQinfo = null
            },
        },
        mounted () {
            this.getList(1, 15)
        }

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
  .eq-maintenance{
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;

    .eq-maintenance_con{
      padding: 20px;
      width: 100%;
      overflow: hidden;
      background-color: #FFFFFF;
    }
  }
</style>
