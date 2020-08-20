<template>
  <div class="div">
    <div class="wrap">
      <div style="margin:10px 0">
        <el-button
          type="primary"
          v-if="saveType !== '2' && saveType !== '3'"
          @click="saveTask(0)"
          size="mini"
          :disabled="disabled"
        >保存
        </el-button>
        <el-button
          type="primary"
          v-if="saveType !== '2' && saveType !== '3'"
          @click="saveTask(1)"
          size="mini"
          :loading="loading"
          :disabled="disabled"
        >下达
        </el-button>
        <el-button
          type="primary"
          size="mini"
          v-if="taskId.id != ''"
          @click="copyCompany"
          :disabled="disabled"
        >复制企业信息
        </el-button>
        <el-button
          type="primary"
          size="mini"
          v-if="taskId.id != ''"
          @click="copyProject"
          :disabled="disabled"
        >复制检验项目
        </el-button>
        <el-button
          type="primary"
          size="mini"
          v-if="saveType === '2' && information.iaction==='3' && information.taskrole===1"
          @click="saveTask(2)"
        >强制保存
        </el-button>
      </div>

      <el-tabs v-model="activeName" type="card" :before-leave="changeTab">
        <el-tab-pane label="基本信息" name="first">
          <baseInfo
            @sampleShow="sampleShow"
            @tongbu="copyG04"
            @updateItemsCode="updateItemsCode"
            @changeType="changeType"
            ref="baseInfo"
            :infor="information.infor"
            :tinfo="information.tinfo"
            :taskId="taskId"
            :taskType="saveType"
            :iscyear='isStaticyear'
            :iscode='isStatCode'
          ></baseInfo>
        </el-tab-pane>
        <el-tab-pane label="任务单信息" name="second">
          <taskInfo
            :taskCode="information.tinfo.taskCode"
            :infor="information.infor"
            :tinfo="information.tinfo"
            @goAmountTotal="goAmountTotal"
          ></taskInfo>
        </el-tab-pane>
        <el-tab-pane label="检验项目信息" name="third">
          <projectInfo
            :taskCode="information.tinfo.taskCode"
            :inspectType="inspectType"
            :orgList="orgList"
            :orgs="orgs"
            :numberMap="numberMap"
            :carType="information.tinfo.carType"
            :tinfo="information.tinfo"
            :infor="information.infor"
            :muster="information.muster"
            ref="projectInfo"
          ></projectInfo>
        </el-tab-pane>
        <el-tab-pane label="抽样信息" name="fourth" v-if="sampleIsShow">
          <sampleInfo :muster="information.muster"></sampleInfo>
        </el-tab-pane>
        <el-tab-pane label="流转信息" name="fivth">
          <circulationInfo ref="circulationInfo"></circulationInfo>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import baseInfo from "./Entrustlist/baseInfo.vue"
  import taskInfo from "./Entrustlist/taskInfo.vue"
  import projectInfo from "./Entrustlist/projectInfo.vue"
  import circulationInfo from "./Entrustlist/circulationInfo.vue"
  import priceInfo from "./Entrustlist/priceInfo.vue"
  import sampleInfo from "./Entrustlist/sampleInfo.vue"

  export default {
    name: 'entrustlist',
    props: ["saveType"],
    data() {
      return {
        disabled: false,
        loading: false,
        inspectType: '',
        orgList: {},
        orgs: [],
        sampleIsShow: false,
        isStaticyear: false,
        isStatCode: false,
        information: {
          formaction: '',
          infor: {
            month: '',
            proType: 'new',
            report: '',
            companyCheckAddress: '',
            companyCheckTel: '',
            principal: '',
            produceCompany: '',
            produceCompanyAddress: '',
            produceCompanyTel: '',
            companyCheckFax: '',
            companyCheckPostalCode: '',
            checkRemark: '',
            makeCompany: '',
            makeCompanAddress: '',
            getReportType: '',
            trust: '',
            finishDate: '',
            doDate: '',
            fee: '',
            taskExplain: '',
            otherFee: '',
            discount: '',
            realFee: '',
            amounttotal: ''
          },
          tinfo: {
            sampleTrademark: '',
            sampleDate: '',
            taskCode: '',
            companyCheck: '',
            sampleName: '',
            orgID: '',
            musterNum: '',
            checkTypeID: '',
            cachetTypeId: '',
            staticyear: '',
            staticyear1: '',
            staticmonth1: '',
            statCode: '',
            wttype: '',
            cvType: '',
            carType: '',
            produceDate: '',
            engineType: '',
            musterType: '1',
            reporting: 1,
            sampleIdel: 'back',
            sampleType: '',
            hasBatholith: 't',
            partitiondate: '0',
            ifrom: '',
            consignor: '',
            ids: '',
            id: '',
            version: '',
            taskSheetStatus: '',
            taskSheet: ''
          },
          muster: {
            musterCount: '',
            musterBase: '',
            musterMusterAddress: '',
            musterClosureFunction: '',
            musterFactoryCode: '',
            musterMusterFunction: '',
            musterDate: '',
            musterSendAddress: '',
            musterSendUnits: '',
            musterSendFunction: '',
            musterSendMember: '',
            musterMusterMember: ''
          },
          inspectContentList: [],
          fitem: [],
          taskCode2: '',
          iaction: '',
          taskrole: ''
          // itemsCode: ['123']
        },
        operatelist: [
          {
            'id': 1,
            'img': require('@/assets/img/baocun-3(1).png'),
            'name': '保存'
          }, {
            'id': 2,
            'img': require('@/assets/img/renwuxiada-2.png'),
            'name': '下达'
          }, {
            'id': 3,
            'img': require('@/assets/img/daochuquxiaoshenhe.png'),
            'name': '导入'
          }, {
            'id': 4,
            'img': require('@/assets/img/fuzhi.png'),
            'name': '复制'
          }
        ],
        activeName: 'first',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        numberMap: {},
        taskId: {
          id: ''
        }
      };
    },
    components: {
      baseInfo,
      taskInfo,
      projectInfo,
      circulationInfo,
      priceInfo,
      sampleInfo
    },
    computed: {
      chouYang() {
        return this.information.tinfo.musterType;
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      onClickLi(id) {
        let arr = '';
        let arrlist = [];
        this.operatelist.forEach((item) => {
          if (item.id == id) {
            arr = item;
          } else {
            arrlist.push(item);
          }
        });
        if (arr.id == 1) {
          arr.img = require('@/assets/img/baocun-3.png');
          arrlist[0].img = require('@/assets/img/renwuxiada-2.png');
          arrlist[1].img = require('@/assets/img/daochuquxiaoshenhe.png');
          arrlist[2].img = require('@/assets/img/fuzhi.png');
        } else if (arr.id == 2) {
          arr.img = require('@/assets/img/renwuxiada-2(1).png');
          arrlist[0].img = require('@/assets/img/baocun-3(1).png');
          arrlist[1].img = require('@/assets/img/daochuquxiaoshenhe.png');
          arrlist[2].img = require('@/assets/img/fuzhi.png');
        } else if (arr.id == 3) {
          arr.img = require('@/assets/img/daochuquxiaoshenhe(1).png');
          arrlist[0].img = require('@/assets/img/baocun-3(1).png');
          arrlist[1].img = require('@/assets/img/renwuxiada-2.png');
          arrlist[2].img = require('@/assets/img/fuzhi.png');
        } else if (arr.id == 4) {
          arr.img = require('@/assets/img/fuzhi(1).png');
          arrlist[0].img = require('@/assets/img/baocun-3(1).png');
          arrlist[1].img = require('@/assets/img/renwuxiada-2.png');
          arrlist[2].img = require('@/assets/img/daochuquxiaoshenhe.png');
        }
      },
      sampleShow(data) {
        if (data === "2") {
          this.sampleIsShow = true;
        } else {
          this.sampleIsShow = false;
        }
      },
      getTaskContentCodeNum() {
        this.$api.entrust.getTaskContentCodeNum(this.information.tinfo.taskCode).then(resp => {
          this.numberMap = resp.data.data;
        }).catch(error => {

          this.$message.error({message: error.data.message, duration: 1500});
        })
      },
      changeTab(obj) {
        if (obj !== 'first') {
          if (!this.information.tinfo.taskCode) {
            this.$message.error({message: "没有任务号,请先选择任务", duration: 1500});
            return false;
          }
          if (!this.information.tinfo.companyCheck) {
            this.$message.error({message: "受检单位不能是空", duration: 1500});
            this.$refs.baseInfo.$refs.companyCheck.focus();
            return false;
          }
          if (!this.information.tinfo.sampleName) {
            this.$message.error({message: "请填写样品名称", duration: 1500});
            this.$refs.baseInfo.$refs.sampleName.focus();
            return false;
          }
          if (!this.information.tinfo.musterNum) {
            this.$message.error({message: "请填写样品数量", duration: 1500});
            this.$refs.baseInfo.$refs.musterNum.focus();
            return false;
          }
          if (!this.information.tinfo.orgID) {
            this.$message.error({message: "主检科室不能是空", duration: 1500});
            this.$refs.baseInfo.$refs.orgID.focus();
            return false;
          }
        }
        // this.taskCode = this.$refs.baseInfo.tinfo.taskCode;
        if (obj === 'third') {
          // let index = this.information.tinfo.checkTypeID.indexOf("_");
          // if (index !== -1) {
          //   this.inspectType = this.information.tinfo.checkTypeID.substring(0, index);
          // } else {
          this.inspectType = this.information.tinfo.checkTypeID;
          // }

          let obj = {};
          for (let i = 0; i < this.$refs.baseInfo.orgs.length; i++) {
            obj[this.$refs.baseInfo.orgs[i].id] = this.$refs.baseInfo.orgs[i].org_abc;
          }
          this.orgList = obj;
          this.orgs = this.$refs.baseInfo.orgs;
          this.getTaskContentCodeNum();
        } else if (obj === 'sixth') {
          this.$refs.priceInfo.changeTableData();
        } else if (obj === 'fivth') {
          this.$refs.circulationInfo.rowspan();
        }
      },

      saveTask(itype) {
        let that = this;
        //获取当前用户
        console.log(localStorage.getItem("userInfo"))
        var loginName = JSON.parse(localStorage.getItem("userInfo")).loginName;
        var users = "zhoujia,fsq,lwy,wanghan,sn,dj,wyy,wangying,wxj";
        if (users.match(loginName)) {
          if ((/^[ \t]*$/.test(this.information.infor.month) || this.information.infor.month == "null") && this.information.infor.report == "1") {
            return this.$message({
              message: "请填写申报批次",
              type: "warning",
              duration: 1500
            });
          }
          if (/^[ \t]*$/.test(this.information.infor.proType) || this.information.infor.proType == "null") {
            return this.$message({
              message: "请选择申报性质",
              type: "warning",
              duration: 1500
            });
          }
          if (/^[ \t]*$/.test(this.information.tinfo.carType) || this.information.tinfo.carType == "null") {
            return this.$message({
              message: "请选择车辆类型",
              type: "warning",
              duration: 1500
            });
          }

        }
        if (this.$refs.baseInfo.basicForm.report === '1') {
          if (/^[ \t]*$/.test(this.information.infor.month) || this.information.infor.month == "null") {
            return this.$message({
              message: "请填写月份",
              type: "warning",
              duration: 1500
            });
          }
        }
        // 验证  必填项填的是空格、tap、或者null都拦截
        if (/^[ \t]*$/.test(this.information.infor.companyCheckAddress) || this.information.infor.companyCheckAddress == "null") {
          return this.$message({
            message: "请填写地址",
            type: "warning",
            duration: 1500
          });
        }
        if (/^[ \t]*$/.test(this.information.infor.companyCheckTel) || this.information.infor.companyCheckTel == "null") {
          return this.$message({
            message: "请填写电话",
            type: "warning",
            duration: 1500
          });
        }
        if (/^[ \t]*$/.test(this.information.infor.principal) || this.information.infor.principal == "null") {
          return this.$message({
            message: "请填写委托人",
            type: "warning",
            duration: 1500
          });
        }
        if (/^[ \t]*$/.test(this.information.infor.produceCompany) || this.information.infor.produceCompany == "null") {
          return this.$message({
            message: "请填写生产单位",
            type: "warning",
            duration: 1500
          });
        }
        if (/^[ \t]*$/.test(this.information.tinfo.sampleType) || this.information.tinfo.sampleType == "null") {
          return this.$message({
            message: "请填写规格型号",
            type: "warning",
            duration: 1500
          });
        }
        if (/^[ \t]*$/.test(this.information.tinfo.sampleTrademark) || this.information.tinfo.sampleTrademark == "null") {
          return this.$message({
            message: "请填写商标",
            type: "warning",
            duration: 1500
          });
        }
        if (/^[ \t]*$/.test(this.information.tinfo.sampleDate) || this.information.tinfo.sampleDate == "null") {
          return this.$message({
            message: "请填写送样日期",
            type: "warning",
            duration: 1500
          });
        }
        if (/^[ \t]*$/.test(this.information.tinfo.taskCode) || this.information.tinfo.taskCode == "null") {
          return this.$message({
            message: "没有任务号,请先选择任务",
            type: "warning",
            duration: 1500
          });
        }

        if ((this.information.tinfo.checkTypeID == 'YY' || this.information.tinfo.checkTypeID == 'JK' || this.information.tinfo.checkTypeID == 'JH') && this.information.tinfo.cvType.length <= 0) {
          return this.$message({
            message: "没有选择营运车辆任务类型，请重新选择",
            type: "warning",
            duration: 1500
          });
        }

        if (itype == 1 && (this.information.tinfo.checkTypeID == 'YY' || this.information.tinfo.checkTypeID == 'JK' || this.information.tinfo.checkTypeID == 'JH') && this.information.tinfo.cvType.length > 0) {
          let check = false;
          let itemsCodesForCheck = JSON.parse(JSON.stringify(this.$refs.projectInfo.tableData));
          if (itemsCodesForCheck == null || itemsCodesForCheck.length <= 0) {
            return this.$message({
              message: "请选择检验项目",
              type: "warning",
              duration: 1500
            });
          }
          let ids = "";
          for (let i = 0; i < itemsCodesForCheck.length; i++) {
            ids += itemsCodesForCheck[i].itemsCode + ",";
          }
          if (this.information.tinfo.taskCode.substr(0, 2) != 'XG') {
            this.$api.entrust.checkCvItemsCode(this.information.tinfo.taskCode, ids, this.information.tinfo.cvType, this.information.tinfo.checkTypeID).then(resp => {
              if (resp.data.data != 'success') {
                this.$message({
                  message: resp.data.data,
                  type: "warning",
                  duration: 1500
                });
              } else {
                check = true;
              }
            }).catch(error => {

              this.$message.error({
                message: error.data.message,
                duration: 1500
              });
            })
          }
          if (!check) {
            return;
          }

        }

        let task_code_prefix = this.information.tinfo.taskCode.substring(0, 2);
        if (task_code_prefix == "AT" || task_code_prefix == "AZ") {
          if (itype == 0) {

          } else {
            return this.$message({
              message: "请修改任务单号",
              type: "warning",
              duration: 1500
            });
          }

        }

        if (this.$refs.projectInfo.tableData.length < 1) {
          return this.$message({
            message: "没有试验项目",
            type: "warning",
            duration: 1500
          });
        }

        if (/^[ \t]*$/.test(this.information.tinfo.companyCheck) || this.information.tinfo.companyCheck == "null") {
          return this.$message({
            message: "受检单位不能是空",
            type: "warning",
            duration: 1500
          });
        }

        if (!this.information.tinfo.sampleName) {
          this.$refs.baseInfo.$refs.sampleName.focus();
          return this.$message({
            message: "请填写样品名称",
            type: "warning",
            duration: 1500
          });
        }
        if (!this.information.tinfo.musterNum) {
          this.$refs.baseInfo.$refs.musterNum.focus();
          return this.$message({
            message: "请填写样品数量",
            type: "warning",
            duration: 1500
          });
        }
        //样品数量正则判断
        let itemsCodesForCheck = JSON.parse(JSON.stringify(this.$refs.projectInfo.tableData));
        // let cssArr = [];
        // for (let i = 0; i < itemsCodesForCheck.length; i++) {
        //   cssArr.push(itemsCodesForCheck[i].itemsItemSamplesVolume);
        // }
        let errorStr = this.checkSampleSize(itemsCodesForCheck);
        if (errorStr != '') {
          return this.$message({
            message: "报告编号：" + errorStr + "的样品数量格式不正确，正确格式必须包含：'数字'+'单位',或者包含'见原报告'。",
            type: "warning",
            duration: 1500
          });
        }

        // 报告编号校验
        for (let n = 0; n < itemsCodesForCheck.length; n++) {
          let char = itemsCodesForCheck[n].itemsCode.substring(6, 7);
          if (char.charCodeAt() > 90) {
            return this.$message({
              message: "报告编号有误",
              type: "warning",
              duration: 1500
            });
          }
        }
        if (!this.information.tinfo.orgID) {
          this.$refs.baseInfo.$refs.orgID.focus();
          return this.$message({
            message: "主检科室不能是空",
            type: "warning",
            duration: 1500
          });
        }

        // 任务单信息校验  委托日期
        if (this.information.infor.trust == '' || this.information.infor.trust == null) {
          return this.$message({
            message: "委托日期不能为空",
            type: "warning",
            duration: 1500
          });
        }
        // 任务单信息校验  商定完成时间
        if (this.information.infor.finishDate == '' || this.information.infor.finishDate == null) {
          return this.$message({
            message: "商定完成时间不能为空",
            type: "warning",
            duration: 1500
          });
        }
        // 任务单信息校验  下达日期
        if (this.information.infor.doDate == '' || this.information.infor.doDate == null) {
          return this.$message({
            message: "下达日期不能为空",
            type: "warning",
            duration: 1500
          });
        }


        if (itype == 0) {
          if (itype == 2) {

          } else {
            // 保存
            if (itype === 0) {
              this.information.formaction = "tempsave";
            } else {
              this.information.formaction = "";
            }
            this.information.infor.taskExplain = decodeURIComponent(this.information.infor.taskExplain)
            this.information.infor.taskExplain = encodeURIComponent(this.information.infor.taskExplain)
            this.information.tinfo.staticyear = this.information.tinfo.staticyear1 + this.information.tinfo.staticmonth1;
            this.information.tinfo.paramPath = this.$refs.baseInfo.checktypeParentList + "-" + this.$refs.baseInfo.checkTypeID + "-" + this.$refs.baseInfo.checkTypeID2 + "-" + this.$refs.baseInfo.basicForm.inspectType3 + "-" + this.$refs.baseInfo.basicForm.inspectType5;
            this.information.inspectContentList = JSON.parse(JSON.stringify(this.$refs.projectInfo.tableData));
            let paramsSend = JSON.parse(JSON.stringify(this.information))
            delete paramsSend.fitem;
            this.$api.entrust.tempSave(paramsSend).then(resp => {
              if (resp.data.data && resp.data.data.message.indexOf("保存成功") !== -1) {
                this.$message({
                  message: resp.data.data.message,
                  type: "success",
                  duration: 1500
                });
                this.information.tinfo.id = resp.data.data.id;
                this.information.tinfo.taskCode = resp.data.data.taskCode;
                this.information.taskCode2 = JSON.parse(JSON.stringify(this.information.tinfo.taskCode));
              } else {

                this.$message.error({
                  message: resp.data.data.message,
                  duration: 1500
                });
              }
            }).catch(error => {

              this.$message.error({
                message: error.data.message,
                duration: 1500
              });
            })
          }

        } else if (itype == 2) {

          this.information.formaction = "forcesave";
          this.information.infor.taskExplain = decodeURIComponent(this.information.infor.taskExplain)

          this.information.infor.taskExplain = encodeURIComponent(this.information.infor.taskExplain)

          this.information.tinfo.staticyear = this.information.tinfo.staticyear1 + this.information.tinfo.staticmonth1;
          this.information.inspectContentList = JSON.parse(JSON.stringify(this.$refs.projectInfo.tableData));
          this.information.tinfo.paramPath = this.$refs.baseInfo.checktypeParentList + "-" + this.$refs.baseInfo.checkTypeID + "-" + this.$refs.baseInfo.checkTypeID2 + "-" + this.$refs.baseInfo.basicForm.inspectType3 + "-" + this.$refs.baseInfo.basicForm.inspectType5;
          let paramsSend = JSON.parse(JSON.stringify(this.information))
          console.log(paramsSend)
          delete paramsSend.fitem;
          this.$api.entrust.forceSave(paramsSend).then(resp => {

            this.$message({
              message: resp.data.data.message,
              type: "success",
              duration: 1500
            });

            this.information.tinfo.id = resp.data.data.id;
            // this.information.tinfo.taskCode = resp.data.data.taskCode;
            this.information.taskCode2 = JSON.parse(JSON.stringify(this.information.tinfo.taskCode));
          }).catch(error => {

            this.$message.error({
              message: error.data.message,
              duration: 1500
            });
          })
        } else {

          let message = "";
          let isLackEnterprise = this.checkLackEnterprise();
          let sampleName = this.information.tinfo.sampleName;
          let sampleType = this.information.tinfo.sampleType;
          let sampleTrademark = this.information.tinfo.sampleTrademark;
          let produceCompany = this.information.infor.produceCompany;
          let itemsCodesForCheck = this.$refs.projectInfo.tableData;
          let newDatas = [];
          let h = this.$createElement
          for (let i = 0; i < itemsCodesForCheck.length; i++) {
            if (sampleType != itemsCodesForCheck[i].samplesSpecifications) {
              newDatas.push(h('p', null, itemsCodesForCheck[i].itemsCode + " 规格型号前后不一致 \n "))
            }
            if (sampleName != itemsCodesForCheck[i].samplesName) {
              newDatas.push(h('p', null, itemsCodesForCheck[i].itemsCode + " 样品名称前后不一致 \n "))
            }
            if (sampleTrademark != itemsCodesForCheck[i].samplesProperty) {
              newDatas.push(h('p', null, itemsCodesForCheck[i].itemsCode + " 商标前后不一致 \n "))
            }
            if (produceCompany != itemsCodesForCheck[i].samplesManufacturers) {
              newDatas.push(h('p', null, itemsCodesForCheck[i].itemsCode + " 生产厂家前后不一致 \n "))
            }
          }
          if (this.information.tinfo.staticyear1) {
            if (!this.information.tinfo.staticmonth1) {
              alert("请填写期数");
              return;
            }
          }
          if (this.information.tinfo.staticmonth1) {
            if (!this.information.tinfo.staticyear1) {
              alert("请填写统计表日期");
              return;
            }
          }


          if (isLackEnterprise) {
            //message="欠费企业 "+message;
            alert("欠费企业，如果需要下达任务请联系管理员");
            return;
          }
          newDatas.push(h('p', null, " 确认一定要下达任务吗? "))
          if (newDatas.length == 0) {
            newDatas = ["确认要下达任务吗?"]
          }

          this.$confirm(h('div', null, newDatas), "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            customClass: 'saveConfirm'
          }).then(() => {
            // 保存
            if (itype === 0) {
              this.information.formaction = "tempsave";
            } else {
              this.information.formaction = "";
            }
            this.loading = true;
            this.information.infor.taskExplain = decodeURIComponent(this.information.infor.taskExplain)
            this.information.infor.taskExplain = encodeURIComponent(this.information.infor.taskExplain)

            this.information.tinfo.staticyear = this.information.tinfo.staticyear1 + this.information.tinfo.staticmonth1;
            this.information.inspectContentList = JSON.parse(JSON.stringify(this.$refs.projectInfo.tableData));
            this.information.tinfo.paramPath = this.$refs.baseInfo.checktypeParentList + "-" + this.$refs.baseInfo.checkTypeID + "-" + this.$refs.baseInfo.checkTypeID2 + "-" + this.$refs.baseInfo.basicForm.inspectType3 + "-" + this.$refs.baseInfo.basicForm.inspectType5;
            let paramsSend = JSON.parse(JSON.stringify(this.information))
            delete paramsSend.fitem;
            this.$api.entrust.tempSave(paramsSend).then(resp => {

              if (resp.data.data && resp.data.data.message.indexOf("保存成功") !== -1) {
                this.$message({
                  message: resp.data.data.message,
                  type: "success",
                  duration: 1500
                });

                this.disabled = true;
                this.information.tinfo.id = resp.data.data.id;
                this.information.tinfo.taskCode = resp.data.data.taskCode;
                this.information.taskCode2 = JSON.parse(JSON.stringify(this.information.tinfo.taskCode));
              } else {
                this.$message.error({
                  message: resp.data.data.message,
                  duration: 1500
                });
              }
              this.loading = false;
            }).catch(error => {
              this.loading = false;
              this.$message.error({
                message: error.data.message,
                duration: 1500
              });
            })
          }).catch(() => {
          });
        }
      },
      /*
      * 功能: 复制企业信息
      * */
      copyCompany() {
        let that = this;
        this.$api.entrust.getCopyMessage(this.taskId.id).then(resp => {
          let tinfo = resp.data.data[0];
          tinfo.taskSheet = null;
          tinfo.taskSheetStatus = null;
          let infor = resp.data.data[1];

          let paramArr = [];
          let white_list = [];
          paramArr = [
            'checkTypeID',
            'orgID',
            'taskCode',
            'staticyear1',
            'staticmonth1',
            'staticyear',
            'staticmonth',
            'cachetTypeId',
            'statCode',
            'cvType',
            'carType',
            'proType',
            'month',
            'id',
            'ids',
            'wttype',
            'cvType',
            'ifrom'
          ];

          white_list = [
            'companyCheckFax',
            'companyCheckPostalCode',
            'companyCheckAddress',
            'companyCheckTel',
            'principal',
            'produceCompany',
            'produceCompanyAddress',
            'produceCompanyTel',
            'checkRemark',
            'makeCompanAddress',
            'makeCompany',
            'produceDate'
          ];


          if (tinfo !== null) {
            for (let key in tinfo) {
              //if (that.information.tinfo[key] !== null && that.information.tinfo[key] !== undefined && paramArr.indexOf(key) === -1) {
              if (that.testProject2.tinfo[key] !== undefined && paramArr.indexOf(key) === -1) {
                that.testProject2.tinfo[key] = tinfo[key];

              }
            }
          }
          if (infor !== null) {
            for (let key in infor) {
              if (that.testProject2.infor[key] !== undefined && paramArr.indexOf(key) === -1) {
                if (white_list.indexOf(key) != -1) {
                  that.testProject2.infor[key] = infor[key];
                }
              }
            }

          }
          that.testProject2.tinfo.checkRemark2 = infor.checkRemark2;
        }).catch(error => {
          this.$message.error({
            message: error.data.message,
            duration: 1500
          });
        })
      },
      copyProject() {
        let that = this;
        this.$api.entrust.getItemsByTaskId(this.taskId.id).then(resp => {

          that.$refs.projectInfo.updateTable(resp.data.data.list)
        }).catch(error => {
          this.$message.error({message: error.data.message, duration: 1500});
        })
      },
      copyGO3(copy_select, id_name) {
        copyGO2(copy_select, id_name);
        var copy_value = document.getElementById("" + id_name).value;
        if (copy_value != '见原报告') {
          document.getElementById("infor.trust").value = copy_value;
        }
        //同步下达日期后，更新商定完成日期
        var finishDate = document.getElementById("infor.finishDate").value
        if (id_name == 'tinfo.sampleDate') {
          taskAjax.changeFinishDateJ(copy_value, finishDate, {
            callback: function (data) {
              document.getElementById("infor.finishDate").value = data;
            }
          });
        }
        if (document.getElementById("infor.doDate").value.length <= 0)
          document.getElementById("infor.doDate").value = copy_value;
      },
      copyGO2(copy_select, id_name) {
        let copy_value = this.information.tinfo[id_name];
        let m_count = this.$refs.projectInfo.tableData;
        for (let m_i = 0; m_i < m_count.length; m_i++) {
          if ("itemsSampleDate" == copy_select && m_count[m_i].itemsItemSamplesVolume == "见原报告") {
          } else {
            m_count[m_i].itemsItemSamplesVolume = copy_value;
          }
        }//for
      },
      checkLackEnterprise() {
        var entName = this.information.tinfo.companyCheck
        //var tradeRemark = document.form1.elements["tinfo.sampleTrademark"].value;
        var isBlack = false;
        if (entName != "") {
          this.$api.entrust.checkIsLackEnterprise(entName).then(resp => {
            if (resp.data.data == 'true') {
              isBlack = true;
            }
          }).catch(error => {
            this.$message.error({message: error.data.message, duration: 1500});
          })
        }
        return isBlack;
      },
      copyG04(arr, userDefined) {
        this.copyGO2(arr, userDefined)
      },
      checkSampleSize(cssArr) {
        let id = this.information.tinfo.id;
        let flag = true;
        let itemCodes = '';
        if (flag) {
          //样品数量添加正则校验
          let reg = /([1-9][0-9]*)[\u4e00-\u9fa5a-zA-Z].*/;
          for (let i = 0; i < cssArr.length; i++) {
            if (cssArr[i].itemsItemSamplesVolume !== null) {
              if (!reg.test(cssArr[i].itemsItemSamplesVolume) && !(cssArr[i].itemsItemSamplesVolume.indexOf('见原报告') != -1)) {
                itemCodes += "[" + cssArr[i].itemsCode + "]、";
              }
            } else {
              itemCodes += "[" + cssArr[i].itemsCode + "]、";
            }
          }
          itemCodes = itemCodes.substring(0, itemCodes.length - 1);
        }
        return itemCodes;
      },
      goAmountTotal() {
        let discount = this.information.infor.discount;
        let otherFee = this.information.infor.otherFee;
        let tfee = this.information.infor.fee;
        let itemmoney = this.countchargesluru();


        let d1 = Number(discount);
        if (d1 > 1) d1 = 1;
        if (d1 == 0) d1 = 1;

        document.getElementById("infor.fee").value = itemmoney;

        itemmoney = itemmoney * d1 + Number(otherFee);
        if ((itemmoney + "").indexOf(".") != -1) {
          document.getElementById("infor.amounttotal").value = (itemmoney + "").substring(0, (itemmoney + "").indexOf("."));
        } else {
          document.getElementById("infor.amounttotal").value = itemmoney;
        }
      },
      countchargesluru() {
        let trs = JSON.parse(JSON.stringify(this.$refs.projectInfo.tableData));
        let index = 0;
        let itemmoney = 0;
        for (i in trs) {
          let tr = trs[i];
          let td1 = dojo.dom.firstElement(tr, 'td');
          let td2 = dojo.dom.nextElement(td1, 'td');
          let itemsTestNumber = 0;
          let itemsChargesStandard = 0;
          index = 0;
          while (td2 != null) {
            if (td2.name == "chargesStandard") {
              itemsChargesStandard = dojo.dom.firstElement(td2, 'input').value;
              index++;
            }
            if (td2.name == "testNumber") {
              itemsTestNumber = dojo.dom.firstElement(td2, 'input').value;
              index++;
            }
            if (td2.name == "charges") {
              dojo.dom.firstElement(td2, 'input').value = itemsChargesStandard * itemsTestNumber;
              itemmoney += itemsChargesStandard * itemsTestNumber;
              break;
            }
            td2 = dojo.dom.nextElement(td2, 'td');
          }
        }// for

        return itemmoney;
      },
      updateItemsCode() {
        this.$refs.projectInfo.taskCode = this.information.tinfo.taskCode;
        // this.$forceUpdate();
        this.$refs.projectInfo.genAllItemsId();
      },
      changeType(val) {
        this.inspectType = val;
        let obj = {};
        for (let i = 0; i < this.$refs.baseInfo.orgs.length; i++) {
          obj[this.$refs.baseInfo.orgs[i].id] = this.$refs.baseInfo.orgs[i].org_abc;
        }
        this.orgList = obj;
        this.orgs = this.$refs.baseInfo.orgs;
      }
    },
    watch: {
      chouYang(val) {
        if (val === '1') {
          this.sampleIsShow = false;
        } else {
          this.sampleIsShow = true;
        }
      },
      isStaticyear(val) {
        this.isStaticyear = val
      },
      isStatCode(val) {
        this.isStatCode = val
      },

    },
    updated() {
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

  .operate-list {
    position: fixed;
    top: 195px;
    right: 0;
    z-index: 999;
    background: #fff;
    box-shadow: 0px 0px 16px 0px rgba(199, 151, 249, 0.21);
  }

  .operate-list li {
    width: 60px;
    height: 76px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .operate-list li:not(:first-child) {
    border-top: 1px solid #ddd;
  }

  .operate-list li img {
    display: block;
    width: 32px;
    height: 32px;
    border: 1px dashed #000;
    margin-bottom: 4px;
  }

  .wrap {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: #fff;
    padding: 0 10px;
  }
</style>
