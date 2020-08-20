<template>
  <!-- 任务受理 -->
  <div class="div">
    <div class="wrap"
         v-loading="mLoading"
    >
      <div style="margin:10px 0">
        <template v-if="saveType !== '2' && saveType !== '3'">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisable"
            :loading="btn_loading1"
            @click="handleTempSave('tempsave')">任务保存
          </el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisable"
            :loading="btn_loading2"
            @click="handleTempSave('')">任务下达
          </el-button>
        </template>
        <!--v-if="saveType !== '2' && iaction === '3' && taskrole === 1"-->
        <template v-if="forceSaveFlag">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisable"
            :loading="btn_loading3"
            @click="handleForceSave('')">强制保存
          </el-button>
        </template>
      </div>
      <!---->
      <el-tabs
        class="m-tabs"
        v-bind="{
          value: defaultActiveValue,
          type: 'card',
          beforeLeave: handleBeforeLeave,
        }"
      >
        <el-tab-pane label="登记信息" name="RegisterInfor">
          <RegisterInfor
            class="m-RegisterInfor"
            ref="RegisterInfor"
            :is-disable-flag="is_disable"
            :key= RegisterInforKey
            :orgs="orgs"
            @changeDefault00_itemsCode="changeDefault00_itemsCode"
          >
            <template slot-scope="{ formData }">
              {{ getSlotData('box', formData) }}
            </template>
          </RegisterInfor>
        </el-tab-pane>
        <el-tab-pane label="样品信息" name="SampleInfor">
          <SampleInfor
            class="m-SampleInfor"
            ref="SampleInfor"
            :key= SampleInforKey
            :tinfo-data-prop="tinfo"
            :infor-data-prop="infor"
            @CHANGE_inspecteItems_sampleinfor="pushDataFn1"
            @CHANGE_configInfor_sampleinfor="pushDataFn2"
          />
        </el-tab-pane>
        <!--<el-tab-pane label="配置信息" name="ConfigInfor">
          <ConfigInfor ref="ConfigInfor"/>
        </el-tab-pane>-->
        <el-tab-pane label="检验项目" name="InspecteItems">
          <!-- 登记信息: djxx -->
          <InspecteItems
            class="m-InspecteItems"
            ref="InspecteItems"
            :key= InspecteItemsKey
            :djxx="box"
            :orgs="orgs"
            :orgs-id-list="orgsIdList"
            @GET_sampleConfigInfoVOS="GET_sampleConfigInfoVOS"
          >
            <template slot-scope="{ dataSource }">
              {{ getSlotData('box2', dataSource) }}
            </template>
          </InspecteItems>
        </el-tab-pane>
        <el-tab-pane label="流转信息" name="ProcessInfor">
          <ProcessInfor class="m-ProcessInfor" ref="ProcessInfor" :key= ProcessInforKey />
        </el-tab-pane>
        <!--<el-tab-pane label="设备使用记录" name="EquipmentUseRecord">
          <EquipmentUseRecord/>
        </el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>

<script>
  // 登记信息
  import RegisterInfor from './components/register_Infor'
  // 样品信息
  import SampleInfor from './components/sample_infor'
  // 配置信息 (已取消),整合在样品信息页中
  import ConfigInfor from './components/config_infor'
  // 检验项目
  import InspecteItems from './components/inspecteItems'
  // 流转信息
  import ProcessInfor from './components/process_infor'
  // 设备使用记录 (已取消)
  import EquipmentUseRecord from './components/equipment_use_record'

  export default {
    name: 'acceptance',
    props: {
      /*
      * 控制强制保存显示的属性
      * */
      'saveType': {
        type: String,
        default: ''
      },
      'showForceSave': {
        type: [String, Number],
        default: 0
      },
      /*
      * 草稿箱查看详情所需要的id
      * */
      'draftTaskid': {
        type: String,
        default: ''
      },
      /*
      * 其他模块查看详情所需要的查询条件
      * */
      'otherTaskinfor': {
        type: Object,
        default: function () {
          return null
        }
      }
    },
    components: {
      RegisterInfor,
      SampleInfor,
      ConfigInfor,
      InspecteItems,
      ProcessInfor,
      EquipmentUseRecord,
    },
    data () {
      return {
        mLoading: false,
        defaultActiveValue: 'RegisterInfor',
        // defaultActiveValue: 'InspecteItems',
        box: {},// 存放登记信息
        tinfo: {},// 存放登记信息tinfo
        infor: {},// 存放登记信息infor
        //
        box2: [],// 存放检验项目
        //
        isCame_in_SampleInfor: 0,// 是否触发过查询该任务下的样品信息系列表
        isCame_in_InspecteItems: 0,// 是否触发过请求默认项
        //
        SpecialItems: [],
        //
        iaction: '',// 用于控制强制保存显示隐藏的
        taskrole: '',// 用于控制强制保存显示隐藏的
        //
        isDisable: false,// 下达成功任务后禁用保存和下达按钮
        //
        btn_loading1: false,
        btn_loading2: false,
        btn_loading3: false,
        //
        taskId: {
          id: ''
        },
        //
        orgs: [],
        orgsIdList: [],
        orgList: {},
        // 记录00项的indexid,做联动
        onlyOne_indexid:'',
        RegisterInforKey:0, //登记信息  Key
        SampleInforKey:0, //样品信息  Key
        InspecteItemsKey:0, //检验项目  Key
        ProcessInforKey:0, //流转信息  Key
      }
    },
    computed: {
      /*
      * 当存在引用了任务下达组件,需要显示强制保存按钮的时候,会触发禁用刷新报告编号的按钮
      * */
      is_disable () {
        if (this.showForceSave == 1) {
          return 1
        } else {
          return 0
        }
      },
      forceSaveFlag () {
        if (this.saveType === '2' && this.iaction === '3' && this.taskrole === 1) {
          this.$refs['InspecteItems'].showDeleteBTN = false
          return true
        } else {
          return false
        }
      },
    },
    watch: {
      /* ***** */
      'box.tinfo': {
        deep: true,
        handler (value) {
          this.tinfo = JSON.parse(JSON.stringify(value))
        },
      },
      'box.infor': {
        deep: true,
        handler (value) {
          this.infor = JSON.parse(JSON.stringify(value))
        },
      },
      /* ***** */
    },
    created () {
      this.getDepartment()
    },
    beforeMount(){
      this.getDefault00_again()
    },
    mounted () {
      //
      if (this.draftTaskid == '') {
        if (this.otherTaskinfor != null) {
          //
          if (this.otherTaskinfor.otherFrom == 'other1') {
            this.getInfo_in_other1(this.otherTaskinfor.params)
          }
          //
          else if (this.otherTaskinfor.otherFrom == 'other2') {
            this.getInfo_in_other2(this.otherTaskinfor.params)
          }
        }
      }
      // 回显操作:在任务草稿箱时this.draftTaskid 不为 ''
      else {
        this.getInfo_in_draft(this.draftTaskid)
      }
    },
    methods: {
      /*
      * 草稿箱 数据回显
      * */
      getInfo_in_draft (id) {
        this.mLoading = true
        this.$api.draft.getDetail(id)
          .then(res => {
            this.mLoading = false
            let resp = res.data.data
            this.$nextTick(() => {
              this.$refs['RegisterInfor'].formData['enterpriseCatalog'] = resp['entCatalog']
              this.$refs['RegisterInfor'].formData['taskCode2'] = resp.tinfo['taskCode'] ? resp.tinfo['taskCode'] : ''
              /* ******* */
              let tinfo = this.$refs['RegisterInfor'].formData['tinfo'] //  登记信息组件: formData.tinfo 字段
              for (let key in tinfo) {
                tinfo[key] = resp.tinfo[key] ? resp.tinfo[key] : ''
                // 若需要一些字段的值为特殊内容,则在此处进行二次赋值
                switch (key) {
                  case 'carType':
                    tinfo[key] = resp.tinfo['carType'] ? resp.tinfo['carType'] : '其它'
                    break
                }
              }
              this.$refs['RegisterInfor'].valFileName = tinfo['taskSheetName'] // 登记信息 -- 基本信息:委托单文件名
              /* ******* */
              let infor = this.$refs['RegisterInfor'].formData['infor'] //  登记信息组件: formData.infor 字段
              for (let key in infor) {
                infor[key] = resp.infor[key] ? resp.infor[key] : ''
                // 若需要一些字段的值为特殊内容,则在此处进行二次赋值
                switch (key) {
                  case 'timeRequirement':
                    infor[key] = resp.infor[key] ? resp.infor[key] : '1'
                    break
                  case 'getReportType':
                    infor[key] = resp.infor[key] ? resp.infor[key] + '' : ''
                    break
                }
              }
              /* ******* */
              let sampleConfigInfoVOS = resp['sampleConfigInfoVOS']// 所有的样品配置信息
              this.$refs['SampleInfor'].dataSource = resp['taskSampleVos'].map((item, index) => {
                if (sampleConfigInfoVOS.length != 0) {
                  for (let i in sampleConfigInfoVOS) {
                    if (sampleConfigInfoVOS[i].sampleCode == item.sampleCode) {
                      item['CONFIGINOFR_list'] = JSON.parse(JSON.stringify(sampleConfigInfoVOS[i].list))
                      break
                    }
                  }
                } else {
                  item['CONFIGINOFR_list'] = [
                    {
                      'id': new Date().getTime() + index + '',
                      'configName': '配置1',
                      'configDetails': ''
                    }
                  ]
                }
                return item
              })
              this.$refs['SampleInfor'].activeDel = 'draft'
              /* ******* */
              this.$refs['InspecteItems'].dataSource = resp['inspectContentList'].map(item => {
                /* +++++++++ */
                if (!item.samplesBinding) {
                  item.samplesBinding = []
                } else {
                  let strArr = item.samplesBinding.split(',')
                  item.samplesBinding = [...strArr]
                }
                /* +++++++++ */
                item.testRoom = item.testRoom * 1
                if (this.$store.state.officeIdList.indexOf(item.testRoom) == -1) {
                  item.testRoom = ''
                }
                item.editable = false
                item.checkcur = false
                return item
              }) // 检验项目组件: 原有的检验项目信息
              this.$refs['InspecteItems'].showPrintBTN = true
              this.isCame_in_InspecteItems = 1// 如果不将其置 1 ,就会再次触发获取默认00检验项目的逻辑,从而会替代掉原本回显数据中的检验项目
              /* ******* */
              this.iaction = resp['iaction'] // 用来控制强制保存按钮
              this.taskrole = resp['taskrole'] // 用来控制强制保存按钮
              /* ******* */
              this.$refs['ProcessInfor'].getItemsWorkLogs(id)

            })
          })
          .catch(err => {
          })
      },

      /*
      * 任务管理(src/views/task/componentsview/Taskmanage.vue)
      * 任务分配(src/views/taskinspection/componentstask/allocation.vue)  数据回显
      * */
      getInfo_in_other1 (params) {
        this.mLoading = true
        this.$api.taskmanage.apiEditTaskInfo(params)
          .then(res => {
            if (res.data.ok) {
              this.mLoading = false
              let resp = res.data.data
              this.$nextTick(() => {

                this.$refs['RegisterInfor'].formData['enterpriseCatalog'] = resp['entCatalog']
                this.$refs['RegisterInfor'].formData['taskCode2'] = resp.tinfo['taskCode'] ? resp.tinfo['taskCode'] : ''
                /* ******* */
                let tinfo = this.$refs['RegisterInfor'].formData['tinfo'] //  登记信息组件: formData.tinfo 字段
                for (let key in tinfo) {
                  tinfo[key] = resp.tinfo[key] ? resp.tinfo[key] : ''

                  // 若需要一些字段的值为特殊内容,则在此处进行二次赋值
                  switch (key) {
                    case 'carType':
                      tinfo[key] = resp.tinfo['carType'] ? resp.tinfo['carType'] : '其它'
                      break
                  }
                }
                this.$refs['RegisterInfor'].valFileName = tinfo['taskSheetName'] // 登记信息 -- 基本信息:委托单文件名
                /* ******* */
                let infor = this.$refs['RegisterInfor'].formData['infor'] //  登记信息组件: formData.infor 字段
                for (let key in infor) {
                  infor[key] = resp.infor[key] ? resp.infor[key] : ''

                  // 若需要一些字段的值为特殊内容,则在此处进行二次赋值
                  switch (key) {
                    case 'timeRequirement':
                      infor[key] = resp.infor[key] ? resp.infor[key] : '1'
                      break
                    case 'getReportType':
                      infor[key] = resp.infor[key] ? resp.infor[key] + '' : ''
                      break
                  }
                }
                /* ******* */
                this.$refs['RegisterInfor'].show_downloadFile_btn = true // 显示下载委托单按钮
                /* ******* */
                let sampleConfigInfoVOS = resp['sampleConfigInfoVOS']
                this.$refs['SampleInfor'].dataSource = resp['taskSampleVos'].map(item => {
                  if (sampleConfigInfoVOS.length != 0) {
                    for (let i in sampleConfigInfoVOS) {
                      if (sampleConfigInfoVOS[i].sampleCode == item.sampleCode) {
                        item['CONFIGINOFR_list'] = sampleConfigInfoVOS[i].list
                        break
                      }
                    }
                  } else {
                    item['CONFIGINOFR_list'] = [{'configName': '配置1', 'configDetails': ''}]
                  }
                  return item
                })
                /* ******* */
                this.$refs['InspecteItems'].dataSource = resp['inspectContentList'].map(item => {
                  /* +++++++++ */
                  if (!item.samplesBinding) {
                    item.samplesBinding = []
                  } else {
                    let strArr = item.samplesBinding.split(',')
                    item.samplesBinding = [...strArr]
                  }
                  /* +++++++++ */
                  // 2020.06.01需求:详情检验项目行内试验科室字段替换
                  item.testRoom = item.testRoom * 1
                  if (this.$store.state.officeIdList.indexOf(item.testRoom) == -1) {
                    item.testRoom = ''
                  }
                  item.isModify = '2'
                  item.editable = false
                  item.checkcur = false
                  return item
                })
                this.$refs['InspecteItems'].showPrintBTN = true
                this.isCame_in_InspecteItems = 1// 如果将其置 1 ,就会再次触发获取默认00检验项目的逻辑,从而会替代掉本身的检验项目
                /* ******* */
                this.iaction = resp['iaction'] // 用来控制强制保存按钮
                this.taskrole = resp['taskrole']  // 用来控制强制保存按钮
                /* ******* */
                this.$refs['ProcessInfor'].getItemsWorkLogs(params.taskid)

              })
            }
          })
          .catch(err => {
            this.$message({type: 'error', message: err.data.message, duration: 3000})
          })
      },

      /*
      * 报告审核(src/views/survey/componentsview/Surveyaudit/audit.vue)  数据回显
      * */
      getInfo_in_other2 (params) {
        this.mLoading = true
        this.$api.lxtinitial.detailed(params.taskid, params.searchdate, params.processInstanceId)
          .then(res => {
            this.mLoading = false
            let resp = res.data.data
            this.$nextTick(() => {
              this.$refs['RegisterInfor'].formData['enterpriseCatalog'] = resp['entCatalog']
              this.$refs['RegisterInfor'].formData['taskCode2'] = resp.tinfo['taskCode'] ? resp.tinfo['taskCode'] : ''
              /* ******* */
              let tinfo = this.$refs['RegisterInfor'].formData['tinfo'] //  登记信息组件: formData.tinfo 字段
              for (let key in tinfo) {
                tinfo[key] = resp.tinfo[key] ? resp.tinfo[key] : ''

                // 若需要一些字段的值为特殊内容,则在此处进行二次赋值
                switch (key) {
                  case 'carType':
                    tinfo[key] = resp.tinfo['carType'] ? resp.tinfo['carType'] : '其它'
                    break
                }
              }
              this.$refs['RegisterInfor'].valFileName = tinfo['taskSheetName'] // 登记信息 -- 基本信息:委托单文件名
              /* ******* */
              let infor = this.$refs['RegisterInfor'].formData['infor'] //  登记信息组件: formData.infor 字段
              for (let key in infor) {
                infor[key] = resp.infor[key] ? resp.infor[key] : ''

                // 若需要一些字段的值为特殊内容,则在此处进行二次赋值
                switch (key) {
                  case 'timeRequirement':
                    infor[key] = resp.infor[key] ? resp.infor[key] : '1'
                    break
                  case 'getReportType':
                    infor[key] = resp.infor[key] ? resp.infor[key] + '' : ''
                    break
                }
              }
              /* ******* */
              this.$refs['RegisterInfor'].show_downloadFile_btn = true // 显示下载委托单按钮
              /* ******* */
              let sampleConfigInfoVOS = resp['sampleConfigInfoVOS']
              this.$refs['SampleInfor'].dataSource = resp['taskSampleVos'].map(item => {
                if (sampleConfigInfoVOS.length != 0) {
                  for (let i in sampleConfigInfoVOS) {
                    if (sampleConfigInfoVOS[i].sampleCode == item.sampleCode) {
                      item['CONFIGINOFR_list'] = sampleConfigInfoVOS[i].list
                      break
                    }
                  }
                } else {
                  item['CONFIGINOFR_list'] = [{'configName': '配置1', 'configDetails': ''}]
                }
                return item
              })
              /* ******* */
              this.$refs['InspecteItems'].dataSource = resp['inspectContentList'].map(item => {
                /* +++++++++ */
                if (!item.samplesBinding) {
                  item.samplesBinding = []
                } else {
                  let strArr = item.samplesBinding.split(',')
                  item.samplesBinding = [...strArr]
                }
                /* +++++++++ */
                // 2020.06.01需求:详情检验项目行内试验科室字段替换
                item.testRoom = item.testRoom * 1
                if (this.$store.state.officeIdList.indexOf(item.testRoom) == -1) {
                  item.testRoom = ''
                }
                item.isModify = '2'
                item.editable = false
                item.checkcur = false
                return item
              }) // 检验项目组件: 原有的检验项目信息
              this.$refs['InspecteItems'].showPrintBTN = true
              this.isCame_in_InspecteItems = 1// 如果将其置 1 ,就会再次触发获取默认00检验项目的逻辑,从而会替代掉本身的检验项目
              /* ******* */
              this.iaction = resp['iaction'] // 用来控制强制保存按钮
              this.taskrole = resp['taskrole']  // 用来控制强制保存按钮
              /* ******* */
              this.$refs['ProcessInfor'].getItemsWorkLogs(params.taskid)

            })
          })
          .catch(err => {
            this.$message.error({message: err.data.message, duration: 1500})
          })
      },

      /*
      * 请求检验项目00 项
      * */
      getDefault00_again () {
        this.$api.mly.item_findSpecialItems()
          .then((res) => {
            if (
              res.data &&
              res.data.data &&
              res.data.data.data &&
              res.data.data.data.length != 0
            ) {
              this.onlyOne_indexid = res.data.data.data[0].indexid
            }
          })
          .catch(err => {
          })
      },
      /*
      * 登记信息-报告编号 与 检验项目中00项报告编号联动
      * */
      changeDefault00_itemsCode(value){
        let _this = this
        this.$nextTick(()=>{
          let temp = _this.$refs['InspecteItems'].dataSource
          if (temp.length != 0){
            for (let item in temp) {
              if(_this.onlyOne_indexid == temp[item].indexid){
                temp[item].itemsCode = value
                break
              }
            }
          }
        })
      },

      /*
      * 监听样品信息变化时更新检验项目
      * */
      pushDataFn1 (data, zARR) {// data:样品信息,zARR:
        let arrNULL = []
        /* 原: 检验项目绑定样品 */
        // this.$refs['InspecteItems'].mySempleInforList = data.map(item => {
        //   arrNULL.push(item['ssid'])
        //   return {
        //     stype: item['stype'],
        //     ssid: item['ssid'],
        //     sampleCode: item['sampleCode']
        //   }
        // })
        // this.$refs['InspecteItems'].dataSource.forEach(item => {
        //   item.samplesBinding = item.samplesBinding.filter((item, index) => {
        //     return arrNULL.includes(item)
        //   })
        // })
        /*****************************************/
        /* 现(2020.07.19): 检验项目绑定样品中的配置信息 */
        this.$refs['InspecteItems'].mySampleConfigInforList = zARR.map(item => {
          arrNULL.push(item['value'])
          return JSON.parse(JSON.stringify(item))
        })
        this.$refs['InspecteItems'].dataSource.forEach(item => {
          item.samplesBinding = item.samplesBinding.filter((item, index) => {
            return arrNULL.includes(item)
          })
        })
      },

      /*
      * 监听样品信息变化时更新配置信息(取消了)
      * */
      pushDataFn2 (data) {
      },

      /*
      * 获取部门信息:用于检验项目更改 试验科室
      * */
      getDepartment () {
        let that = this
        this.$api.entrust.getDepartment()
          .then(resp => {
            let officeList = []
            let officeIdList = []
            for (let i = 0; i < resp.data.data.length; i++) {
              officeList.push(resp.data.data[i])
              officeIdList.push(resp.data.data[i].id)
            }
            that.orgs = officeList
            that.orgsIdList = officeIdList
            // this.$emit('Get_orgsIdList',that.orgsIdList)
          })
          .catch(error => {
            this.$message.error({
              message: error.data.message,
              duration: 1500
            })
          })
      },

      /*
      * 页签切换
      * */
      handleBeforeLeave (activeName, oldActiveName) {
        console.log(`${oldActiveName}  --->  ${activeName}`)

        /* 是否请求样品信息的 */
        // var this2 = this
        // if (activeName === 'SampleInfor') {
        //   if (this.tinfo.taskCode === '') {
        //     this.$message.error({
        //       message: '未生成报告编号 !',
        //       showClose: true,
        //     })
        //     this.$refs['RegisterInfor'].$refs['ruleForm_b'].validateField('tinfo.taskCode')
        //     return false
        //     // return true
        //   } else {
        //     let prom2 = new Promise((resolve, reject) => {
        //       if (this.isCame_in_SampleInfor === 0) {
        //         this.isCame_in_SampleInfor = 1
        //       }
        //       resolve()
        //     })
        //     return prom2
        //   }
        // }

        /* 代入默认检验项目的 */
        if (activeName === 'InspecteItems') {
          if (this.tinfo.taskCode === '') {
            this.$message.error({
              message: '未生成报告编号 !',
              showClose: true,
            })
            this.$refs['RegisterInfor'].$refs['ruleForm_b'].validateField('tinfo.taskCode')
            return false
          } else {
            if (this.isCame_in_InspecteItems === 0) {
              let prom1 = new Promise((resolve, reject) => {
                console.log('触发了请求默认00项')
                this.$api.mly.item_findSpecialItems()
                  .then((res) => {
                    this.$message.success({
                      message: '获取默认00项完成'
                    })
                    let
                      tinfo = this.tinfo,
                      infor = this.infor
                    let
                      arr = res.data.data.data.map((item) => {
                        return {
                          onlyOne: true,
                          'key': '00',
                          'itemsCode': tinfo.taskCode,// 报告编号
                          'itemsItemCode': item['items_item_code'],
                          'itemsName': item['items_itme_name'],
                          'samplesSpecifications': tinfo.sampleType,
                          'itemId': item['itemId'],
                          'indexid': item['indexid'],
                          'samplesName': tinfo.sampleName,
                          'samplesCode': item['samplesCode'],// 批次号
                          'testRoom': parseInt(item['items_test_room']),
                          'chargesStandard': item['chargesStandard'],
                          'testNumber': item['testNumber'] ? item['testNumber'] : 0,// 检测次数
                          'charges': item['items_charges'],
                          'samplesProperty': tinfo.sampleTrademark,
                          'itemsItemSamplesVolume': item['itemsItemSamplesVolume'],
                          'itemsFrederickItme': item['itemsFrederickItme'],
                          'samplesManufacturers': infor.produceCompany,
                          'itemsSampleDate': tinfo.sampleDate,
                          'itemsItemIssuanceDate': item['itemsItemIssuanceDate'],// 签发日期
                          'itemsBasis': item['items_test_basis'],
                          'remarks': item['itemNote'],
                          'cvItemsCode': item['cvItemsCode'],
                          'sampleComeDate': item['sampleComeDate'],// 到样时间
                          'needReport': item['needReport'],// 是否出报告
                          'needTest': item['needTest'],// 是否做测试
                          // 'inUse': item['inUse'],// 状态
                          editable: false,
                          isModify: '2',
                        }
                      })
                    this.$store.commit({
                      type: 'saveDefaultItem_00',
                      defaultItem: arr
                    })
                    this.isCame_in_InspecteItems = 1
                    resolve()
                  })
                  .catch(err => {
                    reject(err)
                  })
              })
              return prom1
            }
          }
        }
      },

      /*
      * 保存、下达
      * */
      handleTempSave (type) {
        delete this.box['enterpriseCatalog']
        let tinfo = JSON.parse(JSON.stringify(this.box['tinfo']))
        let infor = JSON.parse(JSON.stringify(this.box['infor']))
        let taskCode2 = this.box['taskCode2'] // 用来记录改变前的报告编号
        let taskSamples = this.$refs['SampleInfor'].dataSource.slice(0)
        let inspectContentList = this.box2.map(item => {
          if (!item.samplesBinding) {
            item.samplesBinding = []
          }// 默认00项不绑定样品就没有 samplesBinding
          item.samplesBinding = item.samplesBinding.toString()
          if (item.onlyOne) {
            item.itemsCode = tinfo.taskCode
          }
          return item
        })
        tinfo.partitiondate = new Date().getFullYear()
        /* 2020.07.08 新功能:配置信息页数据 */
        let sampleConfigInfoVOS = this.$refs['SampleInfor'].dataSource.map(item => {
          return {
            'sampleCode': item.sampleCode,
            'list': item.CONFIGINOFR_list,
          }
        })
        /*******************************************************************/
        let params = {
          'formaction': type,
          taskCode2,
          tinfo,
          infor,
          taskSamples,
          sampleConfigInfoVOS,
          inspectContentList,
        }
        if (this.box2.length == 0) {
          this.$confirm('监测到未添加任何检验项目,无法保存!', '提示', {
            type: 'warning',
            center: true
          }).then(() => {
          }).catch(() => {
          })
          return
        }
        /* 保存任务 */
        if (type === 'tempsave') {
          this.$refs['RegisterInfor'].$refs['ruleForm_b']
            .validate((valid, object) => {
              if (valid) {
                this.isDisable = true
                this.btn_loading1 = true
                /* ***2020.07.09 <--- */
                if (this.$refs['RegisterInfor'].objFileObject) {
                  /* 上传委托单 */
                  let params3 = new FormData()
                  params3.append('file', this.$refs['RegisterInfor'].objFileObject)
                  this.$api.mly.uploadOrders(params3)
                    .then((res) => {
                      let temp2 = res.data.data
                      params.tinfo.taskSheet = temp2.fileId
                      params.tinfo.taskSheetName = temp2.fileName + '.' + temp2.fileType
                      this.templateFn0(type, params)
                    })
                }
                //
                else {
                  this.templateFn0(type, params)
                }
                /* 保存任务时委托单不是必传 -->*** */
              }
              //
              else {
                this.$message.warning({
                  message: `仍存在必填项未填写字段,请查验`,
                  duration: 3000,
                })
                return false
              }
            })
        }
        /* 下达任务 */
        else if (type === '') {
          console.log(this.$refs['RegisterInfor'].objFileObject)
          // if (!this.$refs['RegisterInfor'].objFileObject) { // <-- 下达任务时委托单是必传
          //   if (
          //     this.$refs['RegisterInfor'].formData['tinfo'].taskSheetName == '' ||
          //     this.$refs['RegisterInfor'].formData['tinfo'].taskSheetName == null
          //   ) {
          //     console.log('没文件不能下达')
          //     $('#fileName').addClass('errClass')
          //     this.$message.warning({
          //       message: '请在登记信息页签中上传委托单',
          //       duration: 4000,
          //     })
          //     return
          //   }
          //   //
          //   else {

          //     this.templateFn1(type, params)
          //   }
            
          // }
          // //
          // else {
            
          // }
          this.$refs['RegisterInfor'].$refs['ruleForm_b']
              .validate((valid, object) => {
                if (valid) {
                  this.$confirm(`确定下达任务吗?`, '提示', {
                    type: 'warning',
                    center: true,
                  })
                    .then(() => {
                      this.isDisable = true
                      this.btn_loading2 = true
                      /*上传委托单*/
                      if (!this.$refs['RegisterInfor'].objFileObject){
                        this.templateFn1(type, params)
                      }else{
                        let params2 = new FormData()
                        params2.append('file', this.$refs['RegisterInfor'].objFileObject)
                        this.$api.mly.uploadOrders(params2)
                          .then((res) => {
                            let temp2 = res.data.data
                            params.tinfo.taskSheet = temp2.fileId
                            params.tinfo.taskSheetName = temp2.fileName + '.' + temp2.fileType
                            this.templateFn1(type, params)
                          })
                      }
                      
                    })
                    .catch(() => {
                    })
                }
                //
                else {
                  this.$message.warning({
                    message: `仍存在必填项未填写字段,请查验!`,
                    duration: 3000,
                  })
                  return false
                }
              })
        }
      },

      /*
      * 强制保存
      * */
      handleForceSave () {
        delete this.box['enterpriseCatalog']
        let tinfo = JSON.parse(JSON.stringify(this.box['tinfo'])),
          infor = JSON.parse(JSON.stringify(this.box['infor'])),
          taskCode2 = this.box['taskCode2'], // 用来记录改变前的报告编号
          taskSamples = this.$refs['SampleInfor'].dataSource.slice(0),
          inspectContentList = this.box2.map(item => {
            if (!item.samplesBinding) {
              item.samplesBinding = []
            }// 默认00项不绑定样品就没有 samplesBinding
            item.samplesBinding = item.samplesBinding.toString()
            if (item.onlyOne) {
              item.itemsCode = tinfo.taskCode
            }
            return item
          })
        tinfo.partitiondate = new Date().getFullYear()
        let sampleConfigInfoVOS = this.$refs['SampleInfor'].dataSource.map(item => {
          return {
            'sampleCode': item.sampleCode,
            'list': item.CONFIGINOFR_list,
          }
        })
        let params = {
          'formaction': 'forcesave',
          inspectContentList,
          taskCode2,
          tinfo,
          infor,
          taskSamples,
          sampleConfigInfoVOS,
        }
        this.$refs['RegisterInfor'].$refs['ruleForm_b'].validate((valid, object) => {
          if (valid) {
            this.isDisable = true
            this.btn_loading3 = true
            this.$api.mly.forceSave(params)
              .then(res => {
                if (res.data.ok) {
                  this.$message.success({
                    message: res.data.data.message,
                    duration: 3000,
                    showClose: true,
                  })
                  this.$nextTick(() => {
                    /* ******** */
                    this.$refs['RegisterInfor'].formData.tinfo.id = res.data.data.id
                    this.$refs['RegisterInfor'].formData.taskCode2 = this.$refs['RegisterInfor'].formData.tinfo.taskCode
                    /* **** 样品信息 **** */
                    let sampleConfigInfoVOS = res.data.data['sampleConfigInfoVOS']// 所有的样品配置信息
                    this.$refs['SampleInfor'].dataSource = res.data.data['taskSampleVos'].map((item, v) => {
                      if (sampleConfigInfoVOS.length != 0) {
                        for (let i in sampleConfigInfoVOS) {
                          if (sampleConfigInfoVOS[i].sampleCode == item.sampleCode) {
                            item['CONFIGINOFR_list'] = JSON.parse(JSON.stringify(sampleConfigInfoVOS[i].list))
                            break
                          }
                        }
                      } else {
                        item['CONFIGINOFR_list'] = [
                          {
                            'id': new Date().getTime() + v + '',
                            'configName': '配置1',
                            'configDetails': ''
                          }
                        ]
                      }
                      return item
                    })
                    /* ******** */
                    this.$refs['InspecteItems'].dataSource = res.data.data['itemList'].map(item => {
                      /* +++++++++ */
                      if (!item.samplesBinding) {
                        item.samplesBinding = []
                      } else {
                        let strArr = item.samplesBinding.split(',')
                        item.samplesBinding = [...strArr]
                      }
                      /* +++++++++ */
                      item.testRoom = item.testRoom * 1
                      if (this.$store.state.officeIdList.indexOf(item.testRoom) == -1) {
                        item.testRoom = ''
                      }
                      item.isModify = '2'
                      item.editable = false
                      return item
                    })
                  })
                } else {
                  this.$message.error({
                    message: res.data.data.message
                  })
                }
                this.isDisable = false
                this.btn_loading3 = false
              })
              .catch(err => {
                this.$message.error({
                  message: err.data.message
                })
                this.isDisable = false
                this.btn_loading3 = false
              })
          } else {
            // console.log(object, '???')
            this.$message.warning({
              message: `仍存在必填项未填写字段,请查验`,
              duration: 3000,
            })
            return false
          }
        })
      },

      templateFn0 (type, params) {
        /* 保存 */
        this.$api.mly.tempSave(params)
          .then(res => {
            if (res.data.ok) {
              this.$message.success({
                message: res.data.data.message,
                duration: 3000,
                showClose: true,
              })
              this.isDisable = false
              this.btn_loading1 = false
              this.$nextTick(() => {
                /* ******** */
                this.$refs['RegisterInfor'].formData.tinfo.id = res.data.data.id
                this.$refs['RegisterInfor'].formData.tinfo.taskCode = res.data.data.taskCode
                this.$refs['RegisterInfor'].formData.taskCode2 = res.data.data.taskCode
                /* **** 样品信息 **** */
                let sampleConfigInfoVOS = res.data.data['sampleConfigInfoVOS']// 所有的样品配置信息
                this.$refs['SampleInfor'].dataSource = res.data.data['taskSampleVos'].map((item, v) => {
                  if (sampleConfigInfoVOS.length != 0) {
                    for (let i in sampleConfigInfoVOS) {
                      if (sampleConfigInfoVOS[i].sampleCode == item.sampleCode) {
                        item['CONFIGINOFR_list'] = JSON.parse(JSON.stringify(sampleConfigInfoVOS[i].list))
                        break
                      }
                    }
                  } else {
                    item['CONFIGINOFR_list'] = [
                      {
                        'id': new Date().getTime() + v + '',
                        'configName': '配置1',
                        'configDetails': ''
                      }
                    ]
                  }
                  return item
                })
                /* **** 检验项目信息 **** */
                this.$refs['InspecteItems'].dataSource = res.data.data['itemList'].map(item => {
                  /* +++++++++ */
                  if (!item.samplesBinding) {
                    item.samplesBinding = []
                  } else {
                    let strArr = item.samplesBinding.split(',')
                    item.samplesBinding = [...strArr]
                  }
                  /* +++++++++ */
                  item.testRoom = item.testRoom * 1
                  if (this.$store.state.officeIdList.indexOf(item.testRoom) == -1) {
                    item.testRoom = ''
                  }
                  item.isModify = '2'
                  item.editable = false
                  return item
                })
              })
            } else {
              this.$message.warning({
                message: res.data.data.message,
                duration: 3000,
                showClose: true,
              })
              this.isDisable = false
              this.btn_loading1 = false
            }
          })
          .catch(err => {
            this.$message.error({
              message: err.data.message,
              duration: 3000,
              showClose: true,
            })
            this.isDisable = false
            this.btn_loading1 = false
          })
      },
      templateFn1 (type, params) {
        /* 下达 */
        // RegisterInforKey:0, //登记信息  Key
        // SampleInforKey:0, //样品信息  Key
        // InspecteItemsKey:0, //检验项目  Key
        // ProcessInforKey:0, //流转信息  Key
        this.isDisable = true
        this.$api.mly.tempSave(params)
          .then(res => {
            if (type === '' && res.data.ok) {
              this.$message.success({
                message: res.data.data.message,
                duration: 3000,
              })
              this.isDisable = false
              this.btn_loading2 = false
              this.RegisterInforKey++; //登记信息  Key
              this.SampleInforKey++; //样品信息  Key
              this.InspecteItemsKey++; //检验项目  Key
              this.ProcessInforKey++; //流转信息  Key

              // this.$nextTick(() => {
              //   this.$refs['RegisterInfor'].formData.tinfo.id = res.data.data.id
              //   this.$refs['RegisterInfor'].formData.tinfo.taskCode = res.data.data.taskCode
              //   this.$refs['RegisterInfor'].formData.taskCode2 = res.data.data.taskCode
              // })

            } else {
              this.$message.warning({
                message: res.data.message,
                duration: 3000,
              })
              this.isDisable = false
              this.btn_loading2 = false
            }
          })
          .catch(err => {
            this.$message.error({
              message: err.data.message,
              duration: 3000,
            })
            this.isDisable = false
            this.btn_loading2 = false
          })
      },

      /*
      *
      * */
      GET_sampleConfigInfoVOS () {
        this.$refs['InspecteItems'].sampleConfigInfoVOS = this.$refs['SampleInfor'].dataSource.map(item => {
          return {
            'sampleCode': item.sampleCode,
            'list': item.CONFIGINOFR_list,
          }
        })
      },

      /*
      * 作用域插槽取值
      * */
      getSlotData (key, data) {
        this[key] = JSON.parse(JSON.stringify(data))
      },
    },
  }
</script>

<style scoped lang="less">
  .div {
    width: 100%;
    height: 100%;
    overflow: hidden;
    /*background: #eee;*/
    /*padding: 10px;*/
  }

  .wrap {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: #fff;
    padding: 0 10px;
    /*overflow: hidden;
    display: flex;
    flex-direction: column;*/

    /*.m-tabs {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .el-tabs__content {
        flex: 1;
        overflow: hidden;

        .el-tab-pane {
          height: 100%;
          overflow: auto;
        }
      }
    }*/
  }
</style>
