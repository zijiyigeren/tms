<template>
  <!-- 任务受理 - 登记信息 -->
  <div class="register-infor">
    <el-form
      ref="ruleForm_b"
      class="register-infor-el-form"
      v-bind="{
        model: formData,
        size: 'mini',
        labelWidth: '115px',
        labelSuffix: ' :',
        rules: rules,
      }"
    >
      <div>
        <!-- ****** 基本信息 ****** -->
        <div>
          <div class="card-header">基本信息</div>
          <el-row>
            <el-col :span="6">
              <el-form-item label="检测机构" prop="tinfo.institution">
                <templateMethod
                  v-model="formData.tinfo.institution"
                  v-bind="{
                    'type': 'select',
                    'dicCode': 'testingOrganization',
                  }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="报告编号" prop="tinfo.taskCode">
                <el-input v-model.trim="formData.tinfo.taskCode"
                          :disabled="is_disable_taskCode" name="clearInputValue"
                          @blur="bulr_send_inspecteItems(formData.tinfo.taskCode)"
                >
                  <el-button slot="append" :icon="btnIcon_1"
                             class="m-btn-default"
                             :disabled="is_disable_taskCode"
                             @click="createTaskCode"
                             ref="createTaskCodeBTN"
                  />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="检验类别" prop="tinfo.wttype">
                <el-select
                  v-model="formData.tinfo.wttype"
                  style="width:100%;"
                  @change="change_Tinfo_CheckTypeID"
                >
                  <el-option
                    v-for="(item,index) in checkTypeIDLIST"
                    :key="index"
                    :label="item['typeName']"
                    :value="item.typeABC"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="任务类别" prop="tinfo.checkTypeID">
                <el-select
                  v-model="formData.tinfo.checkTypeID"
                  style="width:100%;"
                >
                  <el-option
                    v-for="(item,index) in wttypeLIST"
                    :key="index"
                    :label="item['typeName']"
                    :value="item.typeABC"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="检验项目名称" prop="tinfo.examineName">
                <el-select
                  v-model="formData.tinfo.examineName"
                  style="width:100%;"
                  v-bind="{
                    multiple:false,
                  }"
                >
                  <el-option-group
                    v-for="(group,index0) in carTypeList"
                    :key="index0"
                    :label="group.label">
                    <el-option
                      v-for="(item,index1) in group.options"
                      :key="index1"
                      :label="item.name"
                      :value="item.code">
                      <span style="float: left">{{ item.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.code }}
                      </span>
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="机构" prop="tinfo.organization">
                <templateMethod
                  v-model="formData.tinfo.organization"
                  v-bind="{
                    'type': 'select',
                    'dicCode': 'organization',
                    'clearable': true
                  }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="报告类型" prop="tinfo.reporttype">
                <templateMethod
                  v-model="formData.tinfo.reporttype"
                  v-bind="{
                    'type': 'select',
                    'dicCode': 'reportType',
                    'clearable': true
                  }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="主检科室" prop="tinfo.orgID">
                <el-select clearable v-model="formData.tinfo.orgID" placeholder="请选择科室" style="width:100%;">
                  <el-option
                    v-for="(item,index) in orgs"
                    :key="index"
                    :label="item.org_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="申请编号">
                <el-input v-model="formData.tinfo.checkYear" maxlength="30" name="clearInputValue"/>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="申请类型" prop="infor.proType">
                <templateMethod
                  v-model="formData.infor.proType"
                  v-bind="{
                    'type': 'select',
                    'dicCode': 'applyType',
                    'clearable': true
                  }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="委托单">
                <div style="display: flex;">
                  <input type="text" id="fileName" class="m-inputClass"
                         style="flex: 1;" readonly
                         v-model="valFileName"
                         @focus="handleRemoveClass"
                  >
                  <el-button type="text" @click="choseFile" style="margin-left: 10px;">选择文件</el-button>
                  <template v-if="show_downloadFile_btn">
                    <el-button type="text" @click="downloadFile" style="margin-left: 10px;">下载文件</el-button>
                  </template>
                </div>
                <input type="file" style="display: none;" id="file-WTD"
                       @change="changeFile">
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- ****** 委托单位信息 ****** -->
        <div>
          <!-- 原 受检单位 -->
          <div class="card-header">委托单位信息</div>
          <el-row>
            <el-col :span="6">
              <el-form-item label="委托单位" prop="tinfo.companyCheck">
                <el-input placeholder="请选择委托单位" v-model="formData.tinfo.companyCheck" :readonly="true"
                          name="clearInputValue">
                  <el-button slot="append" icon="el-icon-search" @click="show1 = true"/>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="委托人">
                <el-input v-model="formData.infor.principal" maxlength="30" name="clearInputValue"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话">
                <el-input v-model="formData.infor.companyCheckTel" maxlength="30"
                          name="clearInputValue"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="分支机构">
                <el-input v-model="formData.infor.branch" maxlength="30" name="clearInputValue"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="电子邮箱">
                <el-input v-model="formData.infor.companyCheckMail" maxlength="30"
                          name="clearInputValue"/>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="传真号码">
                <el-input v-model="formData.infor.companyCheckFax" maxlength="30"
                          name="clearInputValue"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="地址">
                <el-input type="textarea" v-model="formData.infor.companyCheckAddress" maxlength="30"
                          name="clearInputValue"
                          :autosize="{ minRows: 1, maxRows: 2 }"/>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 委托企业名录 -->
          <el-dialog
            :visible.sync="show1"
            v-if="show1"
            v-bind="{
              title: '企业名录',
              width: '90%',
              modal: false,
              // 'destroy-on-close': true,
              'close-on-press-escape': false,
              'close-on-click-modal': false,
              // 'before-close': handleBeforeClose
            }"
          >
            <BusinessLists :show-radio="1" style="height: 600px;">
              <template slot-scope="{ currentRadio }">
                {{ getSlotData('selectedRadioData', currentRadio) }}
              </template>
            </BusinessLists>
            <div slot="footer" class="dialog-footer">
              <el-button size="mini" @click="show1 = false">取消</el-button>
              <el-button size="mini" type="primary" @click="pushData('委托企业名录')">确定</el-button>
            </div>
          </el-dialog>

        </div>
        <!-- ****** 生成企业信息 ****** -->
        <div>
          <!-- 原 生产单位 -->
          <div class="card-header">生产企业信息</div>
          <el-row>
            <el-col :span="6">
              <el-form-item label="生产者">
                <el-input v-model="formData.infor.makeCompany" maxlength="30"
                          placeholder="请选择生产企业信息"
                          :readonly="true" name="clearInputValue">
                  <el-button slot="append" icon="el-icon-search" @click="show2 = true"/>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产者地址">
                <el-input type="textarea" v-model="formData.infor.makeCompanAddress" maxlength="30"
                          :autosize="{ minRows: 1, maxRows: 2 }" name="clearInputValue"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="生产单位">
                <el-input v-model="formData.infor.produceCompany" maxlength="30" :readonly="true"
                          placeholder="请选择生成单位信息"
                          name="clearInputValue">
                  <el-button slot="append" icon="el-icon-search" @click="show3 = true"/>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产单位地址">
                <el-input type="textarea" v-model="formData.infor.produceCompanyAddress" maxlength="30"
                          :autosize="{ minRows: 1, maxRows: 2 }" name="clearInputValue"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="联系人">
                <el-input v-model="formData.infor.producePeo" maxlength="30" name="clearInputValue"/>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系电话">
                <el-input v-model="formData.infor.produceCompanyTel" maxlength="30" name="clearInputValue"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="邮箱">
                <el-input v-model="formData.infor.produceMail" maxlength="30" name="clearInputValue"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="传真">
                <el-input v-model="formData.infor.produceFax" maxlength="30" name="clearInputValue"/>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 生产者名录 -->
          <el-dialog
            :visible.sync="show2"
            v-if="show2"
            v-bind="{
              title: '企业名录',
              width: '92%',
              modal: false,
              'close-on-press-escape': false,
              'close-on-click-modal': false,
            }"
          >
            <BusinessLists :show-radio="1" style="height: 600px;">
              <template slot-scope="{ currentRadio }">
                {{ getSlotData('selectedRadioData', currentRadio) }}
              </template>
            </BusinessLists>
            <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="show2 = false">取消</el-button>
            <el-button size="mini" type="primary" @click="pushData('生产者名录')">确定</el-button>
          </span>
          </el-dialog>

          <!-- 生产单位名录 -->
          <el-dialog
            :visible.sync="show3"
            v-if="show3"
            v-bind="{
              title: '企业名录',
              width: '88%',
              modal: false,
              'close-on-press-escape': false,
              'close-on-click-modal': false,
            }"
          >
            <BusinessLists :show-radio="1" style="height: 600px;">
              <template slot-scope="{ currentRadio }">
                {{ getSlotData('selectedRadioData', currentRadio) }}
              </template>
            </BusinessLists>
            <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="show3 = false">取消</el-button>
            <el-button size="mini" type="primary" @click="pushData('生产单位名录')">确定</el-button>
          </span>
          </el-dialog>

        </div>
        <!-- ****** 任务要求 ****** -->
        <div>
          <div class="card-header">任务要求</div>
          <el-row>
            <el-col :span="6">
              <el-form-item label="时间要求">
                <el-radio-group v-model="formData.infor.timeRequirement">
                  <el-radio :label="'1'">普通</el-radio>
                  <el-radio :label="'2'">加急</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="登记日期">
                <el-date-picker
                  placeholder="选择日期"
                  v-model="formData.infor.trust"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="任务来源">
                <el-input v-model="formData.infor.taskSource" maxlength="30" name="clearInputValue"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户类型">
                <templateMethod
                  v-model="formData.infor.userType"
                  v-bind="{
                  'type': 'select',
                  'dicCode': 'userType',
                  'clearable': true
                }"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="取报告方式">
                <el-select clearable v-model="formData.infor.getReportType">
                  <el-option value="1" label="邮寄"/>
                  <el-option value="2" label="其他"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="客户要求完成时间" label-width="150px">
                <el-date-picker
                  placeholder="选择日期"
                  v-model="formData.infor.finishDate"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="任务要求完成时间" label-width="150px">
                <el-date-picker
                  placeholder="选择日期"
                  v-model="formData.infor.taskFinishDate"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- ****** 产品信息 ****** -->
        <div>
          <div class="card-header">产品信息</div>
          <el-row>
            <el-col :span="6">
              <el-form-item label="产品类型">
                <el-select
                  v-model="formData.tinfo.carType"
                  style="width:100%;"
                  @change="change_Tinfo_CarType"
                >
                  <el-option
                    v-for="(item,index) in carType_LIST"
                    :key="index"
                    :label="item.dicTypeName"
                    :value="item.dicTypeCode"
                  />
                  <el-option label="其它" value="其它"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="产品名称" prop="tinfo.sampleName">
                <el-input
                  v-if="formData.tinfo.carType == '其它'"
                  v-model="formData.tinfo.sampleName"
                  maxLength="30"
                  name="clearInputValue"
                />
                <!-- *********************************** -->
                <el-select
                  v-else
                  v-model="formData.tinfo.sampleName"
                  style="width:100%;"
                  filterable
                >
                  <el-option
                    v-for="(item,index) in sampleName_LIST"
                    :key="index"
                    :label="item.dicTypeName"
                    :value="item.dicTypeCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="产品型号">
                <el-input v-model="formData.tinfo.sampleType" maxLength="30" name="clearInputValue"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="商标">
                <el-input v-model="formData.tinfo.sampleTrademark" maxLength="30" name="clearInputValue"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="关联报告编号">
                <el-input v-model="formData.tinfo.relationItemsCode" maxLength="30" name="clearInputValue"/>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="动力类型" prop="tinfo.engineType">
                <templateMethod
                  v-model="formData.tinfo.engineType"
                  v-bind="{
                  'type': 'select',
                  'dicCode': 'powerType',
                }"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- ****** 其它信息 ****** -->
        <div>
          <div class="card-header">其它信息</div>
          <el-row>
            <el-col :span="13">
              <el-form-item label="备注">
                <textarea
                  class="m-textarea"
                  v-model.lazy.trim="formData.infor.checkRemark2"
                  maxlength="200"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

    </el-form>
    <!-- -->
    <slot :formData="formData"></slot>
  </div>
</template>

<script>
  import base from '@/api/base.js'
  /* 组件: 数据字典 */
  import templateMethod from '@/components/TemplateMethod.vue'
  /* 组件: 企业名录 */
  import BusinessLists from '@/components/PublicTools/enterprise/index.vue'

  const formData =
    {
      taskCode2: '',// 基本信息: 报告编号,当走编辑逻辑时若触发了生成报告编号的字段就会发生变化。这个字段用来记录变化前的报告编号(原报告编号)
      tinfo: {
        id: '',
        institution: '',// 基本信息: 检测机构
        taskCode: '',// 基本信息: 报告编号
        wttype: '',// 基本信息: 检验类别
        checkTypeID: '',// 基本信息: 任务类别
        checkYear: '',// 基本信息: 申请编号
        reporttype: '',// 基本信息: 报告类型
        // delegateMode: '',// 基本信息: 委托方式(取消了)
        orgID: '',// 基本信息: 主检科室
        examineName: '',// 基本信息: 检验项目名称
        organization: '',// 基本信息: 机构
        taskSheet: '',// 基本信息: 委托单文件ID
        taskSheetName: '',// 基本信息: 委托单文件名
        /* *** */
        companyCheck: '',// 委托单位信息: 委托单位
        /* *** */
        carType: '其它',// 产品信息: 产品类型
        sampleName: '',// 产品信息: 产品名称
        sampleType: '',// 产品信息: 产品型号
        sampleTrademark: '',// 产品信息: 商标
        relationItemsCode: '',// 产品信息: 关联报告编号
        engineType: '',// 产品信息: 动力类型
      },
      infor: {
        proType: '',// 基本信息: 申请类型
        ordersId: '',// 基本信息: 委托单ID
        ordersName: '',// 基本信息: 委托单文件名
        /* *** */
        principal: '',// 委托单位信息: 委托人
        companyCheckTel: '',// 委托单位信息: 联系电话
        branch: '',// 委托单位信息: 分支机构
        companyCheckMail: '',// 委托单位信息: 电子邮箱
        companyCheckFax: '',// 委托单位信息: 传真号码
        companyCheckAddress: '',// 委托单位信息: 地址
        /* *** */
        makeCompany: '',// 生成企业信息: 生产者
        makeCompanAddress: '',// 生成企业信息: 生产者地址
        produceCompany: '',// 生成企业信息: 生成单位
        produceCompanyAddress: '',// 生成企业信息: 生成单位地址
        producePeo: '',// 生成企业信息: 联系人
        produceCompanyTel: '',// 生成企业信息: 联系电话
        produceMail: '',// 生成企业信息: 邮箱
        produceFax: '',// 生成企业信息: 传真
        /* *** */
        timeRequirement: '1',// 任务要求: 时间要求
        trust: '',// 任务要求: 登记日期
        finishDate: '',// 任务要求: 客户要求完成时间
        taskFinishDate: '',// 任务要求: 任务要求完成时间
        taskSource: '',// 任务要求: 任务来源
        userType: '',// 任务要求: 用户类型
        getReportType: '',// 任务要求: 取报告方式
        /* *** */
        checkRemark2: '',// 其它信息: 备注
      },
      enterpriseCatalog: ''
    }
  const _rules =
    {
      'tinfo.institution': [
        {required: true, message: '请选择检测机构', trigger: 'change'}
      ],
      'tinfo.taskCode': [
        {required: true, message: '请点击生成报告编号', trigger: 'blur'},
        {required: true, message: '请点击生成报告编号', trigger: 'change'},
      ],
      'tinfo.wttype': [
        {required: true, message: '请选择检验类别', trigger: 'change'}
      ],
      'tinfo.checkTypeID': [
        {required: true, message: '请选择任务类别', trigger: 'change'}
      ],
      // 'tinfo.orgID': [
      //   {required: true, message: '请选择主检科室', trigger: 'change'}
      // ],
      'tinfo.examineName': [
        {required: true, message: '请选择检验项目名称', trigger: 'change'}
      ],
      'tinfo.companyCheck': [
        {required: true, message: '请选择委托单位', trigger: 'change'},
      ],
      'tinfo.sampleName': [
        {required: true, message: '请填写产品名称', trigger: 'blur'},
      ],
      'tinfo.engineType': [
        {required: true, message: '请选择发动机类型', trigger: 'change'},
      ],
    }
  import carTypeList from '../data/carTypeList'

  export default {
    name: 'registerInfor',
    components: {
      templateMethod,// 数据字典
      /* *** */
      BusinessLists, // 委托企业名录、生产者名录、生产单位名录
    },
    props: ['isDisableFlag', 'orgs'],
    computed: {
      /*
      * 接受 是否禁用报告编号按钮
      * */
      is_disable_taskCode () {
        if (this.isDisableFlag == 1) {
          return true
        } else {
          return false
        }
      }
    },
    watch: {
      'formData.tinfo': {
        deep: true,
        handler: function (value) {
          // console.log(value)
          this.$store.commit({
            type: 'handleChange_tinfo',
            tinfo: JSON.parse(JSON.stringify(value)),
          })
        }
      },
      'formData.tinfo.wttype': {
        // deep: true,
        handler: function (value1) {
          this.wttypeLIST = this.checkTypeIDLIST.filter(item => {
            if (item.typeABC === value1) {
              return item
            }
          })[0].list.slice(0)
        }
      },
      'formData.infor': {
        deep: true,
        handler: function (value) {
          this.$store.commit({
            type: 'handleChange_infor',
            infor: JSON.parse(JSON.stringify(value)),
          })
        }
      },
      'formData.tinfo.carType': {
        handler: function (value) {
          if (value != '其它') {
            this.$refs['ruleForm_b'].clearValidate('tinfo.sampleName')
            this.sampleName_LIST = this.carType_LIST.filter(item => {
              if (item.dicTypeCode === value) {
                return item
              }
            })[0].dicTypeEOS.slice(0)
          }
        }
      },
    },
    data () {
      let validate_reporttype = (rule, value, callback) => {
        callback(new Error('1'))
      }
      let validate_organization = (rule, value, callback) => {
        callback(new Error('2'))
      }
      /*************************************************/
      return {
        formData: JSON.parse(JSON.stringify(formData)),
        rules: {
          ...JSON.parse(JSON.stringify(_rules)),
          // 'tinfo.reporttype': [
          //   {validator: validate_reporttype, trigger: 'change'}
          // ],
          // 'tinfo.organization': [
          //   {validator: validate_organization, trigger: 'change'}
          // ],
        },
        btnIcon_1: 'el-icon-search',
        /* ***** */
        checkTypeIDLIST: [],// 检验类别 选项
        wttypeLIST: [],// 任务类别 选项
        carType_LIST: [],// 产品类型 选项
        sampleName_LIST: [],// 产品名称 选项
        /* ****** */
        carTypeList: JSON.parse(JSON.stringify(carTypeList)),// 检验项目名称 选项
        /* ****** */
        show_downloadFile_btn: false,// 下达新任务时不显示现在文件按钮
        /* ***** */
        valFileName: '',
        objFileObject: null,
        /* ***** */
        show1: false,
        selectedRadioData: {},
        show2: false,
        show3: false,
        // 生成报告编号需要的参数
        ruleParamsStr: {},

        value: 2,
        /* ****** */
        isLoading: true,
      }
    },
    beforeCreate () {
      this.$api.mly.getRuleParam()
        .then((res) => {
          if (res.data.ok) {
            this.ruleParamsStr = JSON.parse(res.data.result)
          } else {
            this.$message(res.data.message)
          }
        })
        .catch((res) => {
          this.$message(res.data.message)
        })
    },
    created () {
      let that = this
      /* 获取 基本信息--检验类型 选项 */
      this.$api.mly.findParentCheckCartTypes()
        .then(res => {
          let temp = res.data.data
          that.checkTypeIDLIST = temp.slice(0)
        })
      /* 获取 产品信息--产品类型 选项 */
      this.$api.mly.DicTypeTree({dicCode: 'productName',})
        .then(res => {
          let temp = res.data.data
          that.carType_LIST = temp.slice(0)
        })
    },
    mounted () {
      this.newDataFn();
    },
    beforeDestroy () {
      // console.log('销毁了组件:登记信息')
      this.$store.commit({
        type: 'handleChange_infor',
        infor: {},
      })
      this.$store.commit({
        type: 'handleChange_tinfo',
        tinfo: {},
      })
    },
    methods: {
      bulr_send_inspecteItems (val) {
        if (val != '') {
          this.$emit('changeDefault00_itemsCode', val)
        }
      },

      /*
      * 基本信息--检验类别、任务类别 联动
      * */
      change_Tinfo_CheckTypeID () {
        this.formData.tinfo.checkTypeID = ''
        // 转 监听器watch
      },

      /*
      * 基本信息--产品类型、产品名称 联动
      * */
      change_Tinfo_CarType () {
        this.formData.tinfo.sampleName = ''
        // 转 监听器watch
      },

      /*
      * 通过企业名录组件带入 委托单位信息、生成企业信息
      * */
      pushData (str) {
        var data = JSON.parse(JSON.stringify(this.selectedRadioData))
        if (JSON.stringify(data) === '{}') {
          // 当未选择企业时,阻断对话框关闭
          return
        }
        var tinfo = this.formData['tinfo']
        var infor = this.formData['infor']
        switch (str) {
          case '委托企业名录':
            tinfo['companyCheck'] = data['entName']
            /* *************************************** */
            infor['companyCheckTel'] = data['entPhone']
            infor['companyCheckFax'] = data['entFax']
            infor['companyCheckAddress'] = data['entAddress']
            infor['companyCheckMail'] = data['entEmail']
            infor['branch'] = data['entBranch']
            infor['principal'] = data['entPlanner']
            this.formData['enterpriseCatalog'] = data['entCatalog']
            this.show1 = false
            break
          case '生产者名录':
            infor['makeCompany'] = data['entName']
            infor['makeCompanAddress'] = data['entAddress']
            this.show2 = false
            break
          case '生产单位名录':
            infor['produceCompany'] = data['entName']
            infor['produceCompanyAddress'] = data['entAddress']
            infor['producePeo'] = data['entPlanner']
            infor['produceCompanyTel'] = data['entPhone']
            infor['produceMail'] = data['entEmail']
            infor['produceFax'] = data['entFax']
            this.show3 = false
            break
        }

      },

      /*
      * 根据报告编号生成所需的参数,前端做填值操作,再返还跟后端
      * */
      createTaskCode () {
        let flg = true,
          params = {}
        for (let key in this.ruleParamsStr) {
          switch (key) {
            case 'wttype':
              if (this.formData['tinfo'].wttype === '') {
                this.$refs['ruleForm_b'].validateField('tinfo.wttype')
                flg = false
              } else {
                this.ruleParamsStr[key] = this.formData['tinfo'].wttype
              }
              break
            case 'checkTypeID':
              if (this.formData['tinfo'].checkTypeID === '') {
                this.$refs['ruleForm_b'].validateField('tinfo.checkTypeID')
                flg = false
              } else {
                this.ruleParamsStr[key] = this.formData['tinfo'].checkTypeID
              }
              break
            case 'reporttype':
              // if (this.formData['tinfo'].reporttype === '') {
              //   this.$refs['ruleForm_b'].validateField('tinfo.reporttype')
              //   flg = false
              // } else {
              this.ruleParamsStr[key] = this.formData['tinfo'].reporttype
              // }
              break
            case 'organization':
              // if (this.formData['tinfo'].organization === '') {
              //   this.$refs['ruleForm_b'].validateField('tinfo.organization')
              //   flg = false
              // } else {
              this.ruleParamsStr[key] = this.formData['tinfo'].organization
              // }
              break
            case 'institution':
              if (this.formData['tinfo'].institution === '') {
                this.$refs['ruleForm_b'].validateField('tinfo.institution')
                flg = false
              } else {
                this.ruleParamsStr[key] = this.formData['tinfo'].institution
              }
              break
            case 'examineName':
              if (this.formData['tinfo'].examineName === '') {
                this.$refs['ruleForm_b'].validateField('tinfo.examineName')
                flg = false
              } else {
                this.ruleParamsStr[key] = this.formData['tinfo'].examineName
              }
              break
            case 'enterpriseCatalog':
              if (this.formData['enterpriseCatalog'] === '') {
                this.$refs['ruleForm_b'].validateField('tinfo.companyCheck')
                flg = false
              } else {
                this.ruleParamsStr[key] = this.formData['enterpriseCatalog']
              }
              break
          }
        }
        if (flg) {
          let that = this
          this.btnIcon_1 = 'el-icon-loading'
          let target = this.$refs['createTaskCodeBTN'].$el
          target.style.pointerEvents = 'none'
          params = JSON.parse(JSON.stringify(this.ruleParamsStr))
          this.$api.mly.getReportCode(params)
            .then(res => {
              if (res.data.success) {
                this.formData.tinfo['taskCode'] = res.data.message
                this.bulr_send_inspecteItems(res.data.message)
              } else {
                this.$message.error({
                  message: res.data.message,
                  showClose: true,
                  duration: 5000
                })
              }
            })
            .catch(err => {
            })
            .then(() => {
              that.btnIcon_1 = 'el-icon-search'
              target.style.pointerEvents = 'auto'
            })
        }
      },

      /**********************************************************/
      choseFile () {
        $('#file-WTD').click()
        this.handleRemoveClass()
      },
      changeFile () {
        try {
          this.objFileObject = event.target.files[0]
          this.valFileName = event.target.files[0].name
        } catch (e) {
        }
      },
      /*
      * 下载委托单
      * */
      downloadFile () {
        let fileId = this.formData.tinfo.taskSheet
        if (fileId && fileId != '') {
          window.open(`${base.baseUrl}/sys/lims/file/${fileId}/download`)
        }
      },
      /**********************************************************/
      handleRemoveClass () {
        $('#fileName').removeClass('errClass')
      },

      /*
      * 获取插槽数据
      * */
      getSlotData (key, data) {
        this[key] = JSON.parse(JSON.stringify(data))
      }, 
      newDataFn(){ // 获取当前日期
        let date=new Date();
        let year=date.getFullYear();
        let month=date.getMonth()+1;
        let day=date.getDate();
        if(month<10){
          month = '0'+month.toString()
        }
        if(day<10){
          day = '0'+day.toString()
        }
        let rq=year+"-"+month+"-"+day;
        this.formData.infor.trust = rq;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../style/register_Infor.less";

</style>
