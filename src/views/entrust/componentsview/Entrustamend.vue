<template>
  <!-- 修改单管理 -->
  <div class="entrustamend">
    <div class="warp">
      <div class="form-search">
        <el-form :inline="true" size="small" :model="formInline"
                 class="demo-form-inline"
                 label-width="82px">
          <div class="demo-form-inline-input">
            <el-form-item label="修改单号 :">
              <el-input v-model.trim="formInline.code" @keyup.enter.native="searchEnterFun" clearable
                        name="clearInputValue"/>
            </el-form-item>
            <el-form-item label="委托单位 :">
              <el-input v-model.trim="formInline.companyCheck" @keyup.enter.native="searchEnterFun"
                        name="clearInputValue"
                        clearable/>
            </el-form-item>
            <el-form-item label="负责部门 :">
              <el-input v-model.trim="formInline.dept" @keyup.enter.native="searchEnterFun" clearable
                        name="clearInputValue"/>
            </el-form-item>
            <el-form-item label="报告单号 :">
              <el-input v-model.trim="formInline.itemscode" @keyup.enter.native="searchEnterFun" clearable
                        name="clearInputValue"/>
            </el-form-item>
            <el-form-item label="下达日期 :">
              <el-date-picker
                placeholder="请选择日期"
                v-model="formInline.senddate"
                type="date"
              />
            </el-form-item>
          </div>
          <div class="demo-form-inline-but">
            <el-form-item>
              <el-button type="primary" class="bespoke" @click="clickXgdAddXgd('new')">新建</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="bespoke" @click="clickInquire(formInline,1,10)">查询</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div class="table-pagingdevice">
        <div class="table-box">
          <el-table
            ref="table"
            border
            stripe
            v-loading="loading"
            :data="tablelist"
            :header-cell-style="{
                'background-color': 'rgba(243,246,253,1)',
                'color': '#606266',
                'padding': '10px 0'
            }">
            <el-table-column
              prop="code"
              label="修改单号"
              align="center"
              :resizable="false">
            </el-table-column>
            <el-table-column
              prop="companyCheck"
              label="委托单位"
              align="center"
              :show-overflow-tooltip="true"
              :resizable="false">
            </el-table-column>
            <el-table-column
              prop="senddate"
              label="下达日期"
              align="center"
              :resizable="false">
            </el-table-column>
            <!--<el-table-column
              prop="type0"
              label="类别"
              align="center"
              :resizable="false"
            />-->
            <el-table-column
              label="负责部门"
              align="center"
              class="responsible-department"
              :resizable="false">
              <template slot-scope="scope">
                <p v-html="scope.row.dept"></p>
              </template>
            </el-table-column>
            <el-table-column
              prop="addReason"
              label="修改原因"
              align="center"
              :resizable="false">
            </el-table-column>
            <el-table-column
              prop="addContent"
              label="补充内容"
              align="center"
              :show-overflow-tooltip="false"
              :resizable="false">
            </el-table-column>
            <el-table-column
              prop="departDetail"
              label="相关说明"
              align="center"
              :resizable="false">
            </el-table-column>
            <el-table-column label="操作" align="center" width="200" :resizable="false">
              <template slot-scope="scope">
                <el-button type="text" style="color:#32AFF0;marginLeft:6px;" @click="clickXgdajaxGetxgl(scope.row)">浏览
                </el-button>
                <el-button type="text" style="color:#32AFF0;marginRight:6px;"
                           @click="clickXgdEditXgd('redact', scope.row)">编辑
                </el-button>
                <el-button type="text" style="color:red;marginLeft:6px;" @click="handleDelete(scope.$index, scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>

            <el-table-column type="expand" width="1">
              <template slot-scope="scope">
                <!-- 二级弹出 -->
                <div class="children-table-box">
                  <div class="lxt_title">
                    <el-button type="text" style="color:red;margin:10px;" @click="onClickXgdReport(scope.row)">删除
                    </el-button>
                    <el-button type="text" style="color:red;margin:10px;" @click="onClickXgdSendReport">下达任务</el-button>
                  </div>
                  <div v-for="(item,i) in xgdajaxGetxglList" :key="i">
                    <div class="children-table-thead">
                      <input type="checkbox" @change="handleCheckAllChange(item.xlist2, item)" :id="item.id+'a'"/>
                      <span style="margin:0 20px;">{{item.dept}}</span>
                      报告数量{{item.xlist2.length}}
                    </div>
                    <div class="children-table-tbode-td">
                      <div v-for="(em,i) in item.xlist2" :key="i">
                        <input type="checkbox" @change="onChangeCheckbox(em.id, item)" :id="em.id+'a'"/>
                        <span class="children-table-tbody-reportCode">{{em.report}}</span>
                        <span>费用：{{em.trade}}</span>
                      </div>
                    </div>
                  </div>


                </div>
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
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>

      <el-dialog
        :title="dialogFormTitle"
        :visible.sync="dialogFormVisible"
        :before-close="handleDialogClose"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <el-form
          :model="formRedact"
          :inline="true"
          size="medium"
          label-position
          label-width="140px"
          class="formRedact-style"
          ref="formRedact"
        >
          <div>
            <div>
              <el-form-item
                label="修改单号："
                :rules="[{ required: true, message: '修改单号不能为空, 请选择', trigger: 'change'}]"
              >
                <el-input
                  v-model.trim="formRedact.code"
                  size="medium"
                  style="width:300px;"
                  :disabled="true"
                />
              </el-form-item>
            </div>
            <div>
              <el-form-item label="下达日期：">
                <el-date-picker
                  v-model="formRedact.senddate"
                  placeholder="请选择时间"
                  type="date"
                  size="medium"
                  style="width:300px">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="商定完成时间：">
                <el-date-picker
                  v-model="formRedact.finishdate"
                  placeholder="请选择时间"
                  type="date"
                  size="medium"
                  style="width:300px">
                </el-date-picker>
              </el-form-item>
            </div>
            <el-form-item label="委托单位名称：">
              <el-input v-model.trim="formRedact.companyCheck" type="textarea" :rows="2" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="委托单位地址：">
              <el-input v-model.trim="formRedact.companyCheckAddress" size="medium" style="width:300px"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <div>
              <el-form-item label="委托单位电话：">
                <el-input v-model.trim="formRedact.companyCheckTel" size="medium" style="width:300px"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="联系人：">
                <el-input v-model.trim="formRedact.companyContact" size="medium" style="width:300px"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="委托单位邮编：">
                <el-input v-model.trim="formRedact.companyCheckPostalCode" size="medium" style="width:300px"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="传真/邮编：">
                <el-input v-model.trim="formRedact.companyCheckFax" size="medium" style="width:300px"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="修改补充原因：">
              <el-input v-model.trim="formRedact.addReason" size="medium" style="width:300px"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="修改补充内容：">
              <el-input v-model.trim="formRedact.addContent" size="medium" style="width:300px"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="其他科室相关说明：">
              <el-input v-model.trim="formRedact.departDetail" size="medium" style="width:300px"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
          </div>

          <div class="divider">
            <el-form-item label="任务号：">
              <el-input v-model.trim="taskCode" size="medium" style="width:300px" placeholder="请输入内容"/>
              <el-button type="primary"
                         style=" width:56px;border-radius:4px;marginLeft:20px;"
                         @click="findTaskContentByTaskCode(taskCode)"
              >搜索
              </el-button>
              <el-button type="primary"
                         style=" border-radius:4px; marginLeft:20px;"
                         @click="findTaskInfoByCode(taskCode)"
              >带入基本信息
              </el-button>
            </el-form-item>
            <div>
              <el-form-item label="搜索结果：">
                <div class='search-results'>
                  <span v-for="(item,i) in searchResult" :key="i" class="search-results-item"
                        @dblclick="clickDepInclude(item)">{{item}}
                  </span>
                </div>
              </el-form-item>
              <el-form-item label="选中结果：">
                <div class="search-results-box">
                  <div class='search-results'>
                    <span v-for="(item,i) in selectedResults" :key="i" class="search-results-item"
                          @dblclick="clickDepExclude(item)">{{item}}
                    </span>
                  </div>
                  <el-button type="primary"
                             style=" width:56px;border-radius:4px;margin-left:20px;"
                             @click="newlyIncreased(selectedResults)"
                  >新增
                  </el-button>
                </div>
              </el-form-item>
            </div>
          </div>

          <div v-if="reportNumber.length > 0">
            <div class="divider" v-for="(item, i) in reportNumber" :key="i">
              <div>
                <el-form-item label="">
                  <el-select v-model="item.departmentId" style="width:150px;marginLeft:138px;" size="medium">
                    <el-option v-for="item in departmentList"
                               :key="item.id"
                               :label="item.org_name"
                               :value="item.org_name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="报告数量：">
                  <el-input v-model.trim="item.children.length" size="medium" style="width:150px"
                            :disabled="true"></el-input>
                  <el-button type="danger"
                             style=" border-radius:4px;marginLeft:20px;"
                             @click="deleteReport(item.id)"
                  >删除
                  </el-button>
                </el-form-item>
              </div>
              <div v-for="(em,i) in item.children" :key="i">
                <el-form-item label="报告编号：">
                  <el-input v-model.trim="em.reportCode" size="medium" style="width:150px"
                            placeholder="请输入内容"/>
                </el-form-item>
                <el-form-item label="费用：">
                  <el-input v-model.trim="em.reportCost" size="medium" style="width:150px" placeholder="500"/>
                </el-form-item>
              </div>
            </div>
          </div>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="clickShutDialog">取 消</el-button>
          <el-button type="primary" @click="submitFormVisible(formRedact)">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    name: 'entrustamend',
    data () {
      return {
        currentPage: 1, // 当前页
        pageSize: 10, // 每页的条数
        total: 0,
        tablelist: [], // 列表数据
        dialogFormVisible: false, // 控制弹窗是否显示
        dialogFormTitle: '', // 弹窗title
        formLabelWidth: '120px', // 表单标签的宽
        formInline: { // 查询表单数据
          code: '',
          companyCheck: '',
          dept: '',
          itemscode: '',
          senddate: '',
          currentPage: 1,
          pageSize: 10,
        },
        formRedact: { // 编辑表单数据
          addContent: '',
          addReason: '',
          code: '', // 修改单号
          companyCheck: '',
          companyCheckAddress: '',
          companyCheckFax: '',
          companyCheckPostalCode: '',
          companyCheckTel: '',
          companyContact: '',
          departDetail: '',
          deptname: [],
          finishdate: '',
          id1: [],
          id2: [],
          loginid: '',
          report: [],
          reportCount: [],
          senddate: '',
          sign: 0,
          times: '',
          trade: [],
          type0: '',
          v1: [],
          v2: [],
          version: 0
        },
        putinStatus: '', // 提交表单时的状态
        departmentList: [], // 科室数据
        list: [], // 修改单号数据-今年
        listBeforeYear: [], // 修改单号数据-前年
        listLastYear: [], // 修改单号数据-去年
        typelist: [], // 类别数据
        code1: '', // 修改单号下拉数据1
        code2: '', // 修改单号下拉数据2
        code3: '', // 修改单号下拉数据3
        taskCode: '', // 任务号
        searchResult: [], // 搜索结果
        selectedResults: [], // 选中结果
        reportNumber: [], // 创建报告编号
        ids: 0,
        xgdajaxGetxglList: [], // 预览数据
        codeFlag: false, // 控制修改单号的下拉框是否显示
        checkboxAll: [], // 复选框全选
        loading: false,
        iscb: true, //判断 当前是 创建还是编辑
      }
    },
    computed: mapState({
      name: function (state) {
        if (state.user.name === '') {
          this.freshUserInfo()
        }
        return state.user.name
      }
    }),
    mounted () {
      this.findList()
    },
    methods: {
      ...mapActions({
        userLogout: 'logout',
        freshUserInfo: 'fresh'
      }),
      // 分页器-设置每条的页数
      handleSizeChange (val) {
        this.pageSize = val
        this.clickInquire(this.formInline, this.currentPage, this.pageSize)
      },
      // 分页器-当前页发生改变的时候
      handleCurrentChange (val) {
        this.currentPage = val
        this.clickInquire(this.formInline, this.currentPage, this.pageSize)
      },
      // 获取列表数据
      findList () {
        this.clickInquire(this.formInline, this.currentPage, this.pageSize)
      },
      // 点击查询
      clickInquire (formInline, currentPage, pageSize) {
        this.loading = true
        this.currentPage = currentPage
        this.pageSize = pageSize
        formInline.currentPage = currentPage
        formInline.pageSize = pageSize
        if (formInline.senddate) {
          let now = new Date(formInline.senddate)
          let y = now.getFullYear()
          let m = now.getMonth() + 1
          let d = now.getDate()
          let date = y + '-'
          if (m < 10) date += '0'
          date += m + '-'
          if (d < 10) date += '0'
          date += d + ''
          formInline.senddate = date
        }
        let params = {
          code: formInline.code,
          companyCheck: formInline.companyCheck,
          dept: formInline.dept,
          itemscode: formInline.itemscode,
          senddate: formInline.senddate,
          currentPage: formInline.currentPage,
          pageSize: formInline.pageSize
        }
        this.$api.entrustamend.apiClickInquire(params).then(res => {
          this.tablelist = res.data.data
          if (this.tablelist.length > 0) {
            this.total = this.tablelist[0].total
          } else {
            this.total = 0
          }
          this.loading = false
        })
      },
      // 输入框回车事件
      searchEnterFun (e) {
        var keyCode = window.event ? e.keyCode : e.which
        if (keyCode == 13) {
          this.clickInquire(this.formInline, 1, 10)
        }
      },
      // 点击删除
      handleDelete (index, row) {
        this.$confirm('确认要删除吗？', '信息', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(() => {
          this.$api.entrustamend.apiHandleDelete(row.code).then(res => {
            this.$message({type: 'success', message: res.data.data, duration: 1500})
            this.findList()
          }).catch((error) => {
            this.$message({type: 'error', message: error.data.message, duration: 1500})
          })
        })
      },
      // 点击新建
      clickXgdAddXgd (title) {
        this.iscb = true
        this.dialogFormVisible = true
        this.dialogFormTitle = '新建'
        this.codeFlag = true
        this.putinStatus = title
        this.searchResult = []
        this.selectedResults = []
        this.reportNumber = []
        this.taskCode = ''
        this.formRedact.code = ''
        this.code1 = '' // 修改单号下拉数据1
        this.code2 = '' // 修改单号下拉数据2
        this.code3 = ''
        this.formRedact = { // 编辑表单数据
          addContent: '',
          addReason: '',
          code: '',
          companyCheck: '',
          companyCheckAddress: '',
          companyCheckFax: '',
          companyCheckPostalCode: '',
          companyCheckTel: '',
          companyContact: '',
          departDetail: '',
          deptname: [],
          finishdate: '',
          id1: [],
          id2: [],
          loginid: '',
          report: [],
          reportCount: [],
          senddate: '',
          sign: 0,
          times: '',
          trade: [],
          type0: '',
          v1: [],
          v2: [],
          version: 0
        }
        this.$api.entrustamend.apiXgdFindOptions().then(res => { // 下拉列表
          if (res.data.ok) {
            this.departmentList = res.data.data.departmentList // 科室数据
            // this.list = res.data.data.list; // 修改单号数据-今年
            // this.listBeforeYear = res.data.data.listBeforeYear; // 修改单号数据-前年
            // this.listLastYear = res.data.data.listLastYear; // 修改单号数据-去年
            this.typelist = res.data.data.typelist // 类别数据
          }
        })
        this.$api.entrustamend.apiXgdFindDate().then(res => { // 下达日期-商定完成日期
          if (res.data.ok) {
            this.formRedact.senddate = res.data.data.senddate
            this.formRedact.finishdate = res.data.data.finishdate
          }
        })
      },
      /* 点击编辑 */
      clickXgdEditXgd (title, row) {
        this.iscb = false
        this.dialogFormVisible = true
        this.dialogFormTitle = '编辑'
        this.codeFlag = false
        this.putinStatus = title
        this.reportNumber = []
        this.taskCode = '' // 任务号
        this.searchResult = [] // 搜索结果
        this.selectedResults = [] // 选中结果
        this.$api.entrustamend.apiXgdFindOptions().then(res => {
          if (res.data.ok) {
            this.departmentList = res.data.data.departmentList // 科室数据
            this.typelist = res.data.data.typelist // 类别数据
          }
        })
        let params = {
          code: row.code
        }
        this.$api.entrustamend.apiXgdFindDetail(params)
          .then(res => {
            if (res.data.ok) {
              let data = res.data.data
              this.formRedact = { // 编辑表单数据
                code: data.code,
                type0: data.type0,
                senddate: data.senddate,
                finishdate: data.finishdate,
                companyCheck: data.companyCheck,
                companyCheckAddress: data.companyCheckAddress,
                companyCheckFax: data.companyCheckFax,
                companyCheckPostalCode: data.companyCheckPostalCode,
                companyCheckTel: data.companyCheckTel,
                companyContact: data.companyContact,
                addReason: data.addReason,
                addContent: data.addContent,
                departDetail: data.departDetail,
                deptname: [],
                id1: [],
                id2: [],
                loginid: '',
                report: [],
                reportCount: [],
                sign: 0,
                times: '',
                trade: [],
                v1: [],
                v2: [],
                version: data.version
              }
              res.data.data.xlist.forEach(item => {
                let codeAndCost = ''
                let params = {
                  id: item.id,
                  ids: item.ids,
                  departmentId: item.dept,
                  reportAmount: item.reportcount,
                  version: item.version,
                  children: []
                }
                item.xlist2.filter(em => {
                  params.children.push(codeAndCost = {
                    reportCode: em.report,
                    reportCost: em.trade,
                    id: em.id,
                    ids: em.ids,
                    times: em.times,
                    version: em.version
                  })
                })
                console.log(params)
                this.reportNumber.push(params)
              })
            }
          })

      },
      /* 修改单号改变时 */
      // selectCode(code, Year) {
      //   let date = new Date().getFullYear();

      //   if (Year == 'list') { // 今年
      //     let params = {
      //       numberType: code,
      //       typeABC: 'XG',
      //       years: date
      //     }
      //     this.$api.entrustamend.apiTaskAjaxFindTaskCodeAndTempLock(params).then(res => {
      //       if (res.data.ok) {
      //         this.formRedact.code = res.data.data ? res.data.data : '';
      //       }
      //     });
      //   } else if (Year == 'listLastYear') { // 去年
      //     let params = {
      //       numberType: code,
      //       typeABC: 'XG',
      //       years: date - 1
      //     }
      //     this.$api.entrustamend.apiTaskAjaxFindTaskCodeAndTempLock(params).then(res => {
      //       if (res.data.ok) {
      //         this.formRedact.code = res.data.data ? res.data.data : '';
      //       }
      //     });
      //   } else if (Year == 'listBeforeYear') { // 前年
      //     let params = {
      //       numberType: code,
      //       typeABC: 'XG',
      //       years: date - 2
      //     }
      //     this.$api.entrustamend.apiTaskAjaxFindTaskCodeAndTempLock(params).then(res => {
      //       if (res.data.ok) {
      //         this.formRedact.code = res.data.data ? res.data.data : '';
      //       }
      //     });
      //   }
      // },

      /* 任务号查询 */
      findTaskContentByTaskCode (taskCode) {
        this.taskCodemasg = taskCode
        let params = {
          taskCode,
        }
        this.$api.entrustamend.apiTaskAjaxFindTaskContentByTaskCode(params)
          .then(res => {
            if (res.data.ok) {
              this.searchResult = res.data.data.slice(0)
            }
          })
      },
      // 搜索结果
      clickDepInclude (result) {
        if (this.selectedResults.length > 0) {
          if (this.selectedResults.find(item => item !== result)) {
            this.selectedResults.push(result)
            this.searchResult = this.searchResult.filter(item => item != result)
          }
        } else {
          this.selectedResults.push(result)
          this.searchResult = this.searchResult.filter(item => item != result)
        }
      },
      // 选中结果
      clickDepExclude (result) {

        if (this.searchResult.length > 0) {

          if (this.searchResult.find(item => item !== result)) {
            this.searchResult.push(result)
            this.selectedResults = this.selectedResults.filter(item => item != result)
          }
        } else {
          this.searchResult.push(result)
          this.selectedResults = this.selectedResults.filter(item => item != result)
        }
      },

      // 带入基本信息
      findTaskInfoByCode (taskCode) {
        this.formRedact.report = []
        this.formRedact.trade = []
        this.formRedact.deptname = []
        this.formRedact.reportCount = []
        if (taskCode) {
          let params = {
            taskCode: taskCode
          }
          this.$api.entrustamend.apiTaskAjaxFindTaskInfoByCode(params)
            .then(res => {
              if (res.data.ok) {
                let data = res.data.data
                this.formRedact.type0 = data.type0 != 'null' ? data.type0 : ''
                this.formRedact.senddate = data.senddate != 'null' ? data.senddate : ''
                this.formRedact.finishdate = data.finishdate != 'null' ? data.finishdate : ''
                this.formRedact.companyCheck = data.companyCheck != 'null' ? data.companyCheck : ''
                this.formRedact.companyCheckAddress = data.companyCheckAddress != 'null' ? data.companyCheckAddress : ''
                this.formRedact.companyCheckFax = data.companyCheckFax != 'null' ? data.companyCheckFax : ''
                this.formRedact.companyCheckPostalCode = data.companyCheckPostalCode != 'null' ? data.companyCheckPostalCode : ''
                this.formRedact.companyCheckTel = data.companyCheckTel != 'null' ? data.companyCheckTel : ''
                this.formRedact.companyContact = data.principal != 'null' ? data.principal : ''
                this.formRedact.addReason = data.addReason != 'null' ? data.addReason : ''
                this.formRedact.addContent = data.addContent != 'null' ? data.addContent : ''
                this.formRedact.departDetail = data.departDetail != 'null' ? data.departDetail : ''
                
              }
            })
            .catch(error => {
              this.$message({type: 'error', message: error.data.message, duration: 1500})
            })
        }
      },
      // 点击新建 - 编号
      newlyIncreased (item) {
        console.log(item, '????????')
        let len = 0
        var p = /[a-z0-9]/i
        if (item.length > 0) {
          item.forEach(item => {
            if (p.test(item)) {
              len++
            }
          })
          if (len <= 0) return false
          //修改单号
          //this.formRedact.code
          if (this.iscb) {
            this.$api.entrustamend.apixgdcode()
              .then(res => { // 获取填充规则
                let result = ''
                if (res.data.ok) {
                  result = JSON.parse(res.data.result)
                  result.taskCode = this.taskCodemasg
                  return result
                }
              })
              .then((result) => {
                this.$api.entrustamend.apigetCode(result)
                  .then(res => {
                    console.log(res, '********')
                    if (res.data.ok) {
                      if (res.data.code == 500) {
                        this.$message.warning({
                          message: res.data.message,
                          duration: 4000
                        })
                        return
                      } else {
                        this.formRedact.code = res.data.message
                      }
                    }
                  })
                  .catch(err=>{
                    this.$message.warning({
                      message: err.data.message,
                      duration: 4000
                    })
                  })
              })
          }
          let codeAndCost = ''
          let params = {
            id: this.ids++,
            departmentId: this.departmentList[0].org_name,
            reportAmount: item.length,
            version: 0,
            children: []
          }
          item.filter(item => {
            params.children.push(codeAndCost = {
              reportCode: item,
              reportCost: 500,
              version: 0,
            })
          })
          this.reportNumber.push(params)
        }
      },

      // 点击删除 - 编号
      deleteReport (id) {
        this.reportNumber = this.reportNumber.filter(item => item.id != id)
      },

      /* 点击确定 */
      submitFormVisible (formRedact) {
        let name = JSON.parse(localStorage.userInfo).loginName
        if (this.putinStatus == 'new') { // 新建
          formRedact.deptname = []
          formRedact.reportCount = []
          if (formRedact.finishdate && typeof formRedact.finishdate != 'string') {
            let now = new Date(formRedact.finishdate)
            let y = now.getFullYear()
            let m = now.getMonth() + 1
            let d = now.getDate()
            let date = y + '-'
            if (m < 10) date += '0'
            date += m + '-'
            if (d < 10) date += '0'
            date += d + ''
            formRedact.finishdate = date
          }
          if (formRedact.senddate && typeof formRedact.senddate != 'string') {
            let now = new Date(formRedact.senddate)
            let y = now.getFullYear()
            let m = now.getMonth() + 1
            let d = now.getDate()
            let date = y + '-'
            if (m < 10) date += '0'
            date += m + '-'
            if (d < 10) date += '0'
            date += d + ''
            formRedact.senddate = date
          }
          if (this.reportNumber.length > 0) {
            this.reportNumber.forEach(item => {
              item.children.forEach(em => {
                if (em.reportCode.indexOf(' ') != -1) {
                  let minArr = em.reportCode.split(' ')
                  em.reportCode = minArr[minArr.length - 1]
                }
                formRedact.report.push(em.reportCode)
                formRedact.trade.push(em.reportCost)
              })
              formRedact.deptname.push(item.departmentId)
              formRedact.reportCount.push(item.reportAmount)
            })
          }
          let params = {
            code: formRedact.code, // 修改单号
            type0: formRedact.type0, // 类别
            senddate: formRedact.senddate, // 下达日期
            finishdate: formRedact.finishdate, // 商定完成时间
            companyCheck: formRedact.companyCheck, // 委托单位名称
            companyCheckAddress: formRedact.companyCheckAddress, // 委托单位地址
            companyCheckTel: formRedact.companyCheckTel, // 委托单位电话
            companyContact: formRedact.companyContact, // 联系人
            companyCheckPostalCode: formRedact.companyCheckPostalCode, // 委托单位邮编
            companyCheckFax: formRedact.companyCheckFax, // 传真/邮编
            addReason: formRedact.addReason, // 修改补充原因
            addContent: formRedact.addContent, // 修改补充内容
            departDetail: formRedact.departDetail, // 其他科室相关说明
            deptname: formRedact.deptname, // 部门
            reportCount: formRedact.reportCount, // 报告数量
            report: formRedact.report, // 报告编号
            trade: formRedact.trade, // 费用
            loginid: name, // 登录人
            sign: 0,
          }
          this.$api.entrustamend.apiXgdAddXgd(params).then(res => {
                this.$message.success(res.data.message)
                this.$refs.formRedact.resetFields()
                this.findList()
                this.taskCode = '' // 任务号
                this.searchResult = [] // 搜索结果
                this.selectedResults = [] // 选中结果
                this.dialogFormVisible = false;
            }).catch((error) => {
              this.$message.error(error.data.message)
              // this.taskCode = '' // 任务号
              // this.searchResult = [] // 搜索结果
              // this.selectedResults = [] // 选中结果
            })
        }
        // 编辑
        else if (this.putinStatus == 'redact') {
          formRedact.deptname = []
          formRedact.reportCount = []
          formRedact.report = []
          formRedact.trade = []
          formRedact.id2 = []
          formRedact.v2 = []
          formRedact.id1 = []
          formRedact.v1 = []
          if (formRedact.finishdate && typeof formRedact.finishdate != 'string') {
            let now = new Date(formRedact.finishdate)
            let y = now.getFullYear()
            let m = now.getMonth() + 1
            let d = now.getDate()
            let date = y + '-'
            if (m < 10) date += '0'
            date += m + '-'
            if (d < 10) date += '0'
            date += d + ''
            formRedact.finishdate = date
          }
          if (formRedact.senddate && typeof formRedact.senddate != 'string') {
            let now = new Date(formRedact.senddate)
            let y = now.getFullYear()
            let m = now.getMonth() + 1
            let d = now.getDate()
            let date = y + '-'
            if (m < 10) date += '0'
            date += m + '-'
            if (d < 10) date += '0'
            date += d + ''
            formRedact.senddate = date
          }
          if (this.reportNumber.length > 0) {
            this.reportNumber.forEach(item => {
              item.children.forEach(em => {
                formRedact.report.push(em.reportCode)
                formRedact.trade.push(em.reportCost)
                formRedact.id2.push(em.id)
                formRedact.v2.push(em.version)
              })
              formRedact.deptname.push(item.departmentId)
              formRedact.reportCount.push(item.children.length)
              formRedact.id1.push(item.id)
              formRedact.v1.push(item.version)
            })
          }
          let params = {
            code: formRedact.code, // 修改单号
            type0: formRedact.type0, // 类别
            senddate: formRedact.senddate, // 下达日期
            finishdate: formRedact.finishdate, // 商定完成时间
            companyCheck: formRedact.companyCheck, // 委托单位名称
            companyCheckAddress: formRedact.companyCheckAddress, // 委托单位地址
            companyCheckTel: formRedact.companyCheckTel, // 委托单位电话
            companyContact: formRedact.companyContact, // 联系人
            companyCheckPostalCode: formRedact.companyCheckPostalCode, // 委托单位邮编
            companyCheckFax: formRedact.companyCheckFax, // 传真/邮编
            addReason: formRedact.addReason, // 修改补充原因
            addContent: formRedact.addContent, // 修改补充内容
            departDetail: formRedact.departDetail, // 其他科室相关说明
            deptname: formRedact.deptname, // 部门
            reportCount: formRedact.reportCount, // 报告数量
            report: formRedact.report, // 报告编号
            trade: formRedact.trade, // 费用
            version: formRedact.version,
            loginid: name, // 登录人
            sign: 0,
            id1: formRedact.id1,
            id2: formRedact.id2,
            v1: formRedact.v1,
            v2: formRedact.v2,
          }
          this.$api.entrustamend.apiXgdEditXgd(params).then(res => {
                this.$message.success(res.data.message);
                this.$refs.formRedact.resetFields()
                this.findList()
                this.taskCode = '' // 任务号
                this.searchResult = [] // 搜索结果
                this.selectedResults = [] // 选中结果
                this.dialogFormVisible = false;
            }).catch((error) => {
              this.$message.error(error.data.message)
            })
        }
      },
      // 点击对话框右上角的X
      handleDialogClose () {
        this.dialogFormVisible = false
        this.$refs.formRedact.resetFields()
      },
      // 关闭对话框
      clickShutDialog () {
        this.dialogFormVisible = false
        this.$refs.formRedact.resetFields()
      },
      // 点击浏览
      clickXgdajaxGetxgl (row) {
        this.checkboxAll = []
        let params = {
          code: row.code
        }
        this.$api.entrustamend.apiXGDAjaxGetXg1(params).then(res => {
          res ? this.xgdajaxGetxglList = res.data.data : ''
          if (this.xgdajaxGetxglList.length > 0) {
            this.$refs.table.toggleRowExpansion(row)
          }
        })
        this.tablelist.map(item => {
          if (item.code != row.code) {
            this.$refs.table.toggleRowExpansion(item, false)
          }
        })
      },
      // 全选复选框
      handleCheckAllChange (val, checkboxid) {
        let checkAll = document.getElementById(checkboxid.id + 'a')
        if (checkAll.checked) {
          val.map(item => {
            this.checkboxAll.push(item.id)
            let checkredent = document.getElementById(item.id + 'a')
            checkredent.checked = true
          })
        } else {
          val.map(em => {
            this.checkboxAll = this.checkboxAll.filter(item => item != em.id)
            let checkredent = document.getElementById(em.id + 'a')
            checkredent.checked = false
          })
        }
      },
      // 复选框选中时
      onChangeCheckbox (id, checkAll) {
        let ifallend = []
        let ifend = []
        let checkredent = document.getElementById(id + 'a')
        if (checkredent.checked) {
          this.checkboxAll.push(id)
        } else {
          this.checkboxAll = this.checkboxAll.filter(item => item != id)
        }
        let checkall = document.getElementById(checkAll.id + 'a')
        checkAll.xlist2.map(item => {
          let checkid = document.getElementById(item.id + 'a')
          ifallend.push(item.id)
          if (checkid.checked) {
            ifend.push(item.id)
          } else {
            checkall.checked = false
          }
        })
        if (ifallend.length == ifend.length) {
          checkall.checked = true
        }
      },
      // 报告删除
      onClickXgdReport (row) {
        let xd2Ids = Array.from(new Set(this.checkboxAll))
        if (xd2Ids.length > 0) {
          if (xd2Ids instanceof Array) {
            xd2Ids = xd2Ids.join(',')
          }
          let params = {
            code: row.code,
            xg2Ids: xd2Ids
          }
          this.$api.entrustamend.apiXgdReport(params)
            .then(res => {
              this.$message({type: 'success', message: res.data.data, duration: 1500})
              this.findList()
              this.clickXgdajaxGetxgl()
            })
            .catch((error) => {
              this.$message({type: 'error', message: error.data.message, duration: 1500})
            })
        } else {
          this.$message({type: 'error', message: '请先选择子项目', duration: 1500})
        }
      },
      // 报告-下达任务
      onClickXgdSendReport (row) {
        let xd2Ids = Array.from(new Set(this.checkboxAll))
        if (xd2Ids.length > 0) {
          if (xd2Ids instanceof Array) {
            xd2Ids = xd2Ids.join(',')
          }
          let params = {
            xd2Ids: xd2Ids
          }
          this.$api.entrustamend.apiXgdSendReport(xd2Ids)
            .then(res => {
              this.$message({type: 'success', message: res.data.data, duration: 1500})
              this.findList()
              this.clickXgdajaxGetxgl()
            })
            .catch((error) => {
              this.$message({type: 'error', message: error.data.message, duration: 1500})
            })
        } else {
          this.$message({type: 'error', message: '请先选择子项目', duration: 1500})
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  .entrustamend {
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
    display: flex;
    flex-direction: column;
  }

  .form-search {
    width: 100%;
    background: #fff;
    padding: 20px 20px 0 20px;
  }

  .form-search .demo-form-inline-input {
    display: flex;
    justify-content: space-between;
    width: calc(100% - 55px);

    .el-form-item {
      width: 19%;
    }
  }

  .form-search .demo-form-inline-but {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 20px 0;
  }

  .form-search .el-form-item--mini.el-form-item, .form-search .el-form-item--small.el-form-item {
    margin: 0;
  }

  .table-pagingdevice {
    flex: 1;
    background: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .table-box {
    flex: 1;
    margin-bottom: 20px;
    overflow-y: auto;
  }

  .el-button--primary {
    height: 30px;
    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
    border-radius: 2px;
    padding: 0 10px;
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

  /deep/ .el-dialog {
    width: 80%;
  }

  /deep/ .el-dialog__body {
    height: 600px;
    overflow-y: auto;
  }

  .formRedact-style {
    padding: 0 20px;
  }

  .formRedact-style .divider {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding-top: 20px;
  }

  .search-results-box {
    display: flex;
    align-items: center;
  }

  .search-results {
    width: 300px;
    height: 120px;
    resize: none;
    overFlow-x: scroll;
    overFlow-y: scroll;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 3px;

    .search-results-item {
      cursor: pointer;

      &:hover {
        color: #409EFF;
      }
    }
  }

  .search-results span {
    display: block;
    text-align: center;
  }

  .children-table-box {
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .lxt_title {
    width: 100%;
    height: 50px;
    background-color: rgba(243, 246, 253, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .lxt_title .lxt_title_btn {
    color: red;
    margin: 10px;
  }

  .children-table {
    width: 100%;
  }

  .children-table-thead {
    width: 100%;
    height: 50px;
    background-color: rgba(243, 246, 253, 1);
    color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .children-table-tbody-reportCode {
    margin: 0 10px;
  }

  /deep/ .el-table__expanded-cell .el-table .el-table__header-wrapper table {
    width: 100% !important;
  }

  /deep/ .el-table__expanded-cell .el-table .el-table__body-wrapper table {
    width: 100% !important;
  }

  .children-table-tbode-td {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .children-table-tbode-td div {
    padding: 0;
    margin: 0;
    width: 33.333333333333336%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }

  .el-button--default {
    width: 56px;
    height: 30px;
    border-radius: 2px;
    padding: 0;
    margin: 0;
  }

  /deep/ .demo-form-inline .el-form-item__content {
    width: 60% !important;
  }

  /deep/ .demo-form-inline .el-form-item__content .el-date-editor, .demo-form-inline .el-form-item__content .el-input__inner, .demo-form-inline .el-form-item__content .el-select {
    width: 100% !important;
  }

  .form-search .el-form--inline .el-form-item {
    margin: 0;
  }
</style>
