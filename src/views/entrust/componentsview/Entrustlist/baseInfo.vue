<template>
  <div>
    <div class="basic">
      <span class="basic-title">基本信息</span>
      <div class="basic-form">
        <el-form ref="basicForm" :model="basicForm" :inline="true" size="mini" label-width="100px">
          <div>
            <el-form-item label="检验类型:" :rules="[{required: true, message: '检验类型不能为空'}]">
              <el-select
                v-model="checktypeParentList"
                placeholder="请选择送检类型"
                style="width:143px;"
                @change="changeChecktypeParentList"
                :disabled="taskType === '2'"
              >
                <el-option
                  v-for="(item,index) in baseInfo.checktypeParentList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <el-select
                v-model="checkTypeID"
                placeholder="请选择送检类型"
                style="width:143px;"
                @change="changeChecktypeList2"
                :disabled="taskType === '2'"
              >
                <el-option
                  v-for="item in checktypeList"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.typeName"
                ></el-option>
              </el-select>
              <el-select
                v-model="checkTypeID2"
                placeholder="请选择区域"
                style="width:143px;"
                @change="changeChecktypeList"
                :disabled="taskType === '2'"
              >
                <el-option
                  v-for="item in thirdLevelList"
                  :key="item.id"
                  :label="item.area"
                  :value="item.area"
                ></el-option>
              </el-select>
              <el-select
                v-model="basicForm.inspectType3"
                @change="changeYear"
                placeholder="请选择年份"
                style="width:143px;"
                :disabled="taskType === '2'"
              >
                <el-option v-for="item in years" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <el-select
                v-model="basicForm.inspectType5"
                placeholder="请选择"
                style="width:143px;"
                @change="changeHaoduan"
                :disabled="taskType === '2'"
              >
                <el-option
                  v-for="item in haoduan"
                  :key="item.numberType"
                  :label="item.numberType"
                  :value="item.numberType"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地点:" style="width: 20%; display: none">
              <el-input placeholder style="width:141px;" v-model="tinfo.ifrom" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="主检科室:" :rules="[{required: true}]">
              <el-select v-model="tinfo.orgID" placeholder="请选择科室" style="width:143px;" ref="orgID">
                <el-option
                  v-for="item in orgs"
                  :key="item.id"
                  :label="item.org_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-left:53px" label="任务号:" :rules="[{required: true}]">
              <el-input
                placeholder="请输入任务号"
                style="width:141px;"
                v-model="tinfo.taskCode"
                :disabled="taskType === '2'"
              ></el-input>
              <el-button
                type="primary"
                style="width:116px;"
                @click="getForceCode"
                :disabled="taskType === '2'"
              >强制刷新任务号
              </el-button>
            </el-form-item>

          </div>
          <div v-if="isStaticyear">
            <el-form-item label="统计表日期:">
              <el-date-picker
                v-model="tinfo.staticyear1"
                align="right"
                type="year"
                placeholder="选择统计表日期"
                value-format="yyyy"
                style="width:143px;"
                @blur="dataChange"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="期数" style="margin-left:53px">
              <el-select
                v-model="tinfo.staticmonth1"
                placeholder="请选择期数"
                style="width:143px;"
                @change="staticmonthChange"
              >
                <el-option label="01期" value="01"></el-option>
                <el-option label="02期" value="02"></el-option>
                <el-option label="03期" value="03"></el-option>
                <el-option label="04期" value="04"></el-option>
                <el-option label="05期" value="05"></el-option>
                <el-option label="06期" value="06"></el-option>
                <el-option label="07期" value="07"></el-option>
                <el-option label="08期" value="08"></el-option>
                <el-option label="09期" value="09"></el-option>
                <el-option label="10期" value="10"></el-option>
                <el-option label="11期" value="11"></el-option>
                <el-option label="12期" value="12"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="display:none">
            <el-form-item label="公章:">
              <el-select v-model="tinfo.cachetTypeId" placeholder="请选择公章类型" style="width:143px;">
                <el-option
                  v-for="item in cachettype"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div v-if="isStatCode">
            <el-form-item label="统计表号:">
              <el-input style="width:141px;" v-model="tinfo.statCode"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="类型:">
              <el-select v-model="tinfo.wttype" placeholder="请选择类型" style="width:143px;">
                <el-option
                  v-for="item in carTypeList2"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.typeName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="营运车辆类型" style="margin-left:53px">
              <el-select v-model="tinfo.cvType" placeholder="请选择营运车辆类型" style="width:143px;">
                <el-option label="客车类型" value="K"></el-option>
                <el-option label="货车类型" value="H"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="申报批次:" :rules="[{required: true}]">
              <el-radio v-model="basicForm.report" label="1" @change="changeMonth">申报公告</el-radio>
              <el-input style="width:143px;" v-model.trim="infor.month" :disabled="monthDisabled"></el-input>
              <span>月份(若检验类型为QA或ZD,则为必填)</span>
              <el-radio v-model="basicForm.report" label="2" @change="changeMonth">其它</el-radio>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="申报性质:" :rules="[{required: true}]">
              <el-radio-group v-model="infor.proType">
                <el-radio label="new">新产品</el-radio>
                <el-radio label="gzkz">扩展变更</el-radio>
                <el-radio label="zgcx">整改</el-radio>
                <el-radio label="zr">准入</el-radio>
                <el-radio label="other">其它</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <el-form-item label="车辆类型:" :rules="[{required: true}]">
            <el-radio-group v-model="tinfo.carType">
              <el-radio v-for="item in carTypeList1" :key="item.id" :label="item.typeName"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="enterprise">
      <span class="basic-title">企业信息</span>
      <div class="basic-form">
        <el-form :inline="true" size="mini" label-width="130px">
          <el-form-item label="受检单位:" :rules="[{required: true}]">
            <el-input
              type="text"
              placeholder="请输入"
              v-model="tinfo.companyCheck"
              style="width:222px;"
              ref="companyCheck"
            ></el-input>
            <el-checkbox
              label="委托单位同受检单位"
              name="type"
              @change="consignorTocompanyCheck"
              :value="isChecked"
            ></el-checkbox>
            <el-button type="primary" @click="showCompany">浏览</el-button>
          </el-form-item>
          <el-form-item label="委托单位:" v-if="wtdw">
            <el-input type="text" placeholder="请输入" v-model="tinfo.consignor" style="width:222px;"></el-input>
          </el-form-item>
          <div>
            <el-form-item label="受检单位传真:">
              <el-input placeholder="请输入" style="width:223px;" v-model.trim="infor.companyCheckFax"></el-input>
            </el-form-item>
            <el-form-item label="受检单位邮编:">
              <el-input
                placeholder="请输入"
                style="width:223px;"
                v-model.trim="infor.companyCheckPostalCode"
              ></el-input>
            </el-form-item>
            <el-form-item label="受检单位地址:" :rules="[{required: true}]">
              <el-input
                placeholder="请输入"
                v-model.trim="infor.companyCheckAddress"
                style="width:222px;"
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="受检单位电话:" :rules="[{required: true}]">
              <el-input placeholder="请输入" v-model.trim="infor.companyCheckTel" style="width:223px;"></el-input>
            </el-form-item>
            <el-form-item label="受检单位委托人:" :rules="[{required: true}]">
              <el-input placeholder="请输入" v-model.trim="infor.principal" style="width:223px;"></el-input>
            </el-form-item>
            <el-form-item label="生产单位:" :rules="[{required: true}]">
              <el-input placeholder="请输入" v-model.trim="infor.produceCompany" style="width:222px;"></el-input>
              <el-checkbox label="同受检" name="type" @change="produceCheck"></el-checkbox>
              <el-button type="primary" @click="showCompany">浏览</el-button>
            </el-form-item>
          </div>
          <div></div>
          <div>
            <el-form-item label="生产单位地址:">
              <el-input
                placeholder="请输入"
                style="width:222px;"
                v-model.trim="infor.produceCompanyAddress"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item label="生产单位电话:">
            <el-input placeholder="请输入" style="width:222px;" v-model.trim="infor.produceCompanyTel"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="sample">
      <p class="basic-title">样品信息</p>
      <el-form ref="form" label-width="130px" size="mini">
        <div class="sample_qi">
          <div class="sample_formA">
            <el-form-item label="样品名称 :" :rules="[{required: true}]">
              <el-input
                type="text"
                placeholder="请输入"
                v-model.trim="tinfo.sampleName"
                style="width:222px;"
                ref="sampleName"
              ></el-input>
            </el-form-item>
            <el-form-item label="生产日期 :">
              <el-date-picker
                v-model.trim="tinfo.produceDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="sample_formB">
            <el-form-item label="规格型号 :" :rules="[{required: true}]">
              <el-input
                type="text"
                placeholder="请输入"
                v-model.trim="tinfo.sampleType"
                style="width:222px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="送样日期 :" :rules="[{required: true}]">
              <el-date-picker
                v-model.trim="tinfo.sampleDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="sample_formC">
            <el-form-item label="商标 :" :rules="[{required: true}]">
              <el-input v-model.trim="tinfo.sampleTrademark" style="width:354px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="检验说明 :">
              <el-input type="textarea" v-model.trim="infor.checkRemark" style="width:354px;"></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="备注 :" placeholder="请输入" style="width:100%;">
          <el-input type="textarea" v-model.trim="infor.checkRemark2" style="width:224px;"></el-input>
        </el-form-item>
        <el-form-item label="发动机类型 :" placeholder="请输入">
          <el-radio-group v-model.trim="tinfo.engineType">
            <el-radio v-for="item in carTypeList3" :key="item.id" :label="item.typeName"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="样品来源 :" style="width:100%;">
          <el-radio-group v-model="tinfo.musterType" @change="changeResources">
            <el-radio label="1">送样</el-radio>
            <el-radio label="2">抽样</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量 :" :rules="[{required: true}]">
          <el-input v-model.trim="tinfo.musterNum" style="width:224px;" ref="musterNum"></el-input>
          <el-button type="primary" @click="tongbu">同步</el-button>
        </el-form-item>
        <el-form-item label="申报性质 :" style="width:100%;">
          <el-radio-group v-model="tinfo.reporting">
            <el-radio :label="1">新产品</el-radio>
            <el-radio :label="2">拓展/勘误</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="样品处理意见 :" style="width:100%;">
          <el-radio-group v-model="tinfo.sampleIdel">
            <el-radio label="back">退回</el-radio>
            <el-radio label="save">留样</el-radio>
            <el-radio label="process">无害处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否带底盘 :" style="width:100%;">
          <el-radio-group v-model="tinfo.hasBatholith">
            <el-radio label="t">是</el-radio>
            <el-radio label="f">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="制造单位 :" style="width:100%;">
          <el-input v-model.trim="infor.makeCompany" style="width:616px;" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="制造单位地址 :" style="width:100%;">
          <el-input v-model.trim="infor.makeCompanAddress" style="width:616px;" placeholder="请输入"></el-input>
          <el-checkbox label="同受检" name="type" @change="produceCheck2"></el-checkbox>
        </el-form-item>
      </el-form>
    </div>

    <!-- 浏览企业信息弹出页 -->
    <div class="choice_statistics" v-if="companyShow">
      <div class="el_dialog">
        <div class="el_dialog__header">
          <span>查看</span>
          <el-button type="text" class="el_dialog_btnclose" @click="companyShow=false">
              <i class="el-icon-close"></i>
          </el-button>
        </div>

        <div class="el_dialog__body">
            <taskManage1 type="1" @copyMessage="copyMessage"></taskManage1>
        </div>
        <div class="el_dialog__footer"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import taskManage1 from '@/components/Taskmanage.vue'

  export default {
    props: ['infor', 'tinfo', 'taskId', 'taskType', 'iscyear', 'iscode'],
    data() {
      let years = []
      const myDate = new Date();
      let thisYear = myDate.getFullYear();
      let Section = thisYear - 2019;
      for (let i = 0; i <= Section; i++) {
        let _thisYear = thisYear--;
        years.push(_thisYear);
      }
      return {
        isStaticyear: false,
        isStatCode: false,
        isChecked: true,
        companyShow: false,
        years: years,
        baseInfo: {},
        checktypeParentList: '',
        checkTypeID: '',
        checkTypeID2: '',
        basicForm: {
          inspectType3: '',
          inspectType4: '',
          inspectType5: '',
          inspectType6: '',
          report: '2',
          area: ''
        },
        checktypeList: [],
        thirdLevelMap: {},
        thirdLevelList: [],
        orgs: [],
        haoduan: [],
        cachettype: [],
        wtdw: false,
        carTypeList1: [],
        carTypeList2: [],
        carTypeList3: [],
        regionLabel: '',
        monthDisabled: true
      }
    },
    components: {
      taskManage1
    },
    computed: {
      newName() {
        if (this.tinfo.staticyear) return this.tinfo.staticyear;
      },
      newName1() {
        if (this.tinfo.paramPath) return this.tinfo.paramPath;
      },
      month() {
        return this.infor.month;
      },
      newName2() {
        return this.tinfo.companyCheck;
      }
    },
    watch: {
      newName(val) {
        let staticyear = val;
        let staticy_years = this.getNowFormatDate();
        let staticy_year = '';
        let staticy_month = 0;
        let staticy_day = 0;
        if (staticyear && staticyear.length == 0) {
          staticy_year = staticy_years.substring(0, 4);
          staticy_month = staticy_years.substring(4, 6) * 1;
          staticy_day = staticy_years.substring(6);
          if (staticy_day > 10) {
            if ((staticy_month + 1) > 12) {
              staticy_month = "01";
              staticy_year = staticy_years.substring(0, 4) * 1 + 1;
            } else {
              staticy_month += 1;
            }
          }
        }//if
        else {
          staticy_year = staticyear.substring(0, 4);
          staticy_month = staticyear.substring(4);
        }//else
        staticy_month = "00" + staticy_month;
        staticy_month = staticy_month.substring(staticy_month.length - 2);

        this.tinfo.staticyear1 = staticy_year;
        this.tinfo.staticmonth1 = staticy_month
      },
      newName1(val) {
        let arr = val.split("-");
        this.checktypeParentList = arr[0];
        this.checkTypeID = arr[1];
        this.checkTypeID2 = arr[2];
        this.basicForm.inspectType3 = arr[3];
        this.basicForm.inspectType5 = arr[4];
      },
      month(val) {
        if (/^[ \t]*$/.test(val) || val == null) {

        } else {
          this.basicForm.report = '1';
          this.monthDisabled = false;
        }
      },
      newName2(val) {
        if (this.isChecked) {
          this.tinfo.consignor = val;
        }
      },
      iscyear(val) {

        this.isStaticyear = val;
      },
      iscode(val) {
        this.isStatCode = val;
      }


    },
    created() {
      let that = this;
      this.$api.entrust.getBaseInfo().then(resp => {
        that.baseInfo = resp.data.data;
        that.carTypeList1 = resp.data.data.pt.list.filter(function (currentValue, index, arr) {
          return currentValue.typeflag === 0;
        })
        if (that.tinfo.carType === '') {
          that.tinfo.carType = that.carTypeList1[0].typeName;
        }
        that.carTypeList2 = resp.data.data.pt.list.filter(function (currentValue, index, arr) {
          return currentValue.typeflag === 2;
        })
        that.carTypeList3 = resp.data.data.pt.list.filter(function (currentValue, index, arr) {
          return currentValue.typeflag === 3;
        })
        if (that.tinfo.engineType === '') {
          that.tinfo.engineType = that.carTypeList3[0].typeName;
        }
        let reg = RegExp(/-/)
        let strArr = []
        strArr = that.baseInfo.checktypeParentList.split(",")
        strArr.forEach((item, index) => {
          if (reg.test(item)) {
            strArr.splice(index, 1)
          }
        });
        that.baseInfo.checktypeParentList = strArr;
      }).catch(error => {
        this.$message.error({
          message: error.data.message,
          duration: 1500
        });
      })
      this.getDepartment();
      this.getCachetType();
    },
    methods: {
      changeChecktypeParentList(value) {
        this.thirdLevelMap = {};
        this.thirdLevelList = [];
        this.checktypeList = [];
        this.haoduan = [];
        this.baseInfo.checktypeList.forEach((item) => {

          if (item.parentName === value) {
            if (this.thirdLevelMap[item.typeName]) {
              this.thirdLevelMap[item.typeName].push(item);
            } else {
              this.checktypeList.push(item);
              this.thirdLevelMap[item.typeName] = [];
              this.thirdLevelMap[item.typeName].push(item);
            }
          }
        });
        this.tinfo.checkTypeID = '';
        this.basicForm.inspectType3 = '';
        this.basicForm.inspectType5 = '';
        this.checkTypeID = '';
        this.checkTypeID2 = '';
        // this.tinfo.checkTypeID = this.checktypeList[0] ? this.checktypeList[0].typeABC : "";
        // this.getHaoduan();
      },
      changeChecktypeList2(value) {

        for (let key in this.thirdLevelMap) {
          if (value === key) {
            this.thirdLevelList = this.thirdLevelMap[key];
          }
        }
        this.tinfo.checkTypeID = '';
        this.basicForm.inspectType3 = '';
        this.basicForm.inspectType5 = '';
        this.checkTypeID2 = '';
      },
      changeChecktypeList(value) {

        this.getHaoduan();
        this.basicForm.inspectType3 = '';
        this.basicForm.inspectType5 = '';
        if (this.thirdLevelList.length > 0) {
          for (let i = 0; i < this.thirdLevelList.length; i++) {
            if (value === this.thirdLevelList[i].area) {
              this.tinfo.checkTypeID = this.thirdLevelList[i].typeABC;
              break;
            }
          }
        }
        if (this.tinfo.checkTypeID === 'QA') {
          this.basicForm.report = '1';
          this.monthDisabled = false;
        } else {
          this.basicForm.report = '2';
          this.infor.month = '';
          this.monthDisabled = true;
        }

        if (this.tinfo.checkTypeID === 'QA' || this.tinfo.checkTypeID === 'ZD') {

          this.isStaticyear = true;
          this.isStatCode = true;
        } else {
          this.isStaticyear = this.iscyear;
          this.isStatCode = this.iscode;
        }

        this.$emit("changeType", this.tinfo.checkTypeID)
      },
      changeYear() {
        this.getHaoduan();
        this.basicForm.inspectType5 = '';
      },
      changeHaoduan(value) {
        let that = this;
        this.$api.entrust.getAddrAndTaskId(value, this.tinfo.checkTypeID, this.basicForm.inspectType3).then(resp => {
          if (resp.data.data === null) {
            this.$message.error({
              message: '无任务号',
              duration: 1500
            });
            that.tinfo.taskCode = "";
            that.tinfo.ifrom = "";
          } else {
            that.tinfo.taskCode = resp.data.data.taskCode;
            
            that.tinfo.ifrom = resp.data.data.typeArea;
            that.$emit("updateItemsCode")
          }
        }).catch(error => {
          this.$message.error({
            message: error.data.message,
            duration: 1500
          });
        })
      },
      changeResources(value) {
        this.$emit('sampleShow', this.tinfo.musterType)
      },
      getDepartment() {
        let that = this;
        this.$api.entrust.getDepartment().then(resp => {
          let officeList = [];
          for (let i = 0; i < resp.data.data.length; i++) {
            officeList.push(resp.data.data[i]);
          }
          that.orgs = officeList;
        }).catch(error => {
          this.$message.error({
            message: error.data.message,
            duration: 1500
          });
        })
      },
      getHaoduan() {
        let that = this;
        this.$api.entrust.getHaoduan(this.tinfo.checkTypeID, this.basicForm.inspectType3).then(resp => {
          that.haoduan = resp.data.data.list;
        }).catch(error => {
          this.$message.error({
            message: error.data.message,
            duration: 1500
          });
        })
      },
      getCachetType() {
        let that = this;
        this.$api.entrust.getCachetType().then(resp => {
          that.cachettype = resp.data.data;
        }).catch(error => {
          this.$message.error({
            message: error.data.message,
            duration: 1500
          });
        })
      },
      showCompany() {
        this.companyShow = true;
      },
      copyMessage(data) {
        this.companyShow = false;
        // this.taskId.id 父组件的数据,在这里直接修改
        this.taskId.id = data.id;
      },
      getForceCode() {
        let that = this;
        this.$api.entrust.getAddrAndTaskId(this.basicForm.inspectType5, this.tinfo.checkTypeID, this.basicForm.inspectType3).then(resp => {
          if (resp.data.data === null) {
            this.$message.error("无任务号");
            that.tinfo.taskCode = "";
            that.tinfo.ifrom = "";
          } else {
            that.tinfo.taskCode = resp.data.data.taskCode;
            that.tinfo.ifrom = resp.data.data.typeArea;
            that.$emit("updateItemsCode")
          }
        }).catch(error => {
          this.$message.error({
            message: error.data.message,
            duration: 1500
          });
        })
      },
      consignorTocompanyCheck(value) {
        if (value) {
          this.tinfo.consignor = this.tinfo.companyCheck;
          this.wtdw = false;
          this.isChecked = true;
        } else {
          this.tinfo.consignor = '';
          this.wtdw = true;
          this.isChecked = false;
        }
      },
      produceCheck(value) {
        if (value) {
          this.infor.produceCompany = this.tinfo.companyCheck;
          this.infor.produceCompanyAddress = this.infor.companyCheckAddress;
          this.infor.produceCompanyTel = this.infor.companyCheckTel;
        } else {
          this.infor.produceCompany = '';
          this.infor.produceCompanyAddress = '';
          this.infor.produceCompanyTel = '';
        }
      },
      produceCheck2(value) {
        if (value) {
          this.infor.makeCompany = this.tinfo.companyCheck;
          this.infor.makeCompanAddress = this.infor.companyCheckAddress;
        } else {
          this.infor.makeCompany = "";
          this.infor.makeCompanAddress = "";
        }
      },
      tongbu() {
        this.$emit('tongbu', "itemsItemSamplesVolume", "musterNum")
      },
      getNowFormatDate() {
        let date = new Date();
        let seperator1 = "";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      },
      changeMonth(val) {
        if (val === '1') {
          this.monthDisabled = false;
        } else if (val === '2') {
          this.monthDisabled = true;
        }
      },
      staticmonthChange() {

        this.$forceUpdate();
      },
      dataChange() {

        this.$forceUpdate();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .div {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #eee;
    padding: 10px;
  }

  .basic,
  .enterprise {
    width: 100%;
    padding: 0 10px;
    border-bottom: 1px solid #ddd;
  }

  .basic-title {
    display: block;
    font-size: 16px;
    color: rgba(50, 175, 240, 1);
    margin: 22px 0;
  }

  .el-select,
  .el-select--mini {
    height: 28px;
  }

  .el-form-item__content {
    width: 123px;
    height: 28px;
    display: flex;
  }

  .el-input,
  .el-input--mini {
    height: 28px;
  }

  .sample {
    width: 100%;
    padding: 0 10px;
    overflow: hidden;
  }

  .sample .el-form .el-form-item .el-select .el-input--mini {
    height: 28px;
  }

  .sample_p {
    width: 100%;
    height: 50px;
    color: #32aff0;
    /* padding: 0 10px; */
    line-height: 50px;
  }

  .sample_qi {
    width: 100%;
    display: flex;
  }

  .sample_formA {
    width: 30%;
    display: flex;
    flex-direction: column;
    align-content: flex-end;
  }

  .sample_formB {
    width: 31%;
  }

  .sample_formC {
    flex: 1;
  }

  .el-button {
    width: 56px;
    height: 28px;
    border-radius: 2px;
    padding: 0;
  }

  .el-input {
    width: 223px;
  }

  /deep/ .el-textarea .el-textarea__inner {
    resize: none;
  }

  /deep/ .el-dialog__body {
    height: calc(100% - 54px);
  }
  .choice_statistics {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  overflow: hidden;
  z-index: 2002;
}

.choice_statistics .el_dialog {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.choice_statistics .el_dialog .el_dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 18px;
    color: #303133;
  }
  .el_dialog_btnclose {
    padding: 0;
    margin: 0;
    width: 14px !important;
    height: 14px !important;
    i{
      font-size: 14px;
      color: #909399;
    }
  }
}

.choice_statistics .el_dialog .el_dialog__body {
  flex: 1;
  padding: 20px;
  overflow: hidden;
}
// .choice_statistics .el_dialog .el_dialog__footer {
//   padding: 20px;
// }
</style>
