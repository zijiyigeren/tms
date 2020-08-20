<template>
  <!-- 任务受理 - 样品信息 -->
  <div>
    <p style="margin: 0;">
      <el-button
        size="mini"
        type="primary"
        @click="selectAddSampleType"
      >
        新增样品
      </el-button>
      <el-button
        size="mini"
        @click="handleDeleteBatch"
      >
        批量删除
      </el-button>
    </p>

    <div style="width: 100%;padding-top: 10px;" class="m-target">
      <el-table
        ref="sampleInfoList"
        v-bind="{
           
           data: dataSource,
           border: true,
           size: 'mini',
           'default-sort':{
              // prop: 'barcode',
              // order: 'descending'
            },
        }"
        class="sampleInfo-table"
        :header-cell-style="{ background:'#F3F6FD',color:'#606266' }"
        @selection-change="selectionChange"
        >
        <el-table-column
          type="expand"
          v-bind="{
            width:1,
            resizable:false,
          }"
        >
          <template slot-scope="{ row }">
            <div class="config_infor" style="margin: 0;">
              <!--<div class="m-sampleType">
                <span class="span1">样品 :</span>
                <input type="text" class="m-InputClass" v-model.lazy="row.sampleCode" readonly>
              </div>-->
              <div class="m-sampleConfig-Info">
                <template v-for="(item2 ,index2) in row['CONFIGINOFR_list']">
                  <div :key="index2" class="m-sampleConfig-Info-item">
                    <span class="span2">{{item2.configName}} :</span>
                    <input type="text" class="m-InputClass" v-model.lazy="item2.configDetails"
                           @focus="INPUT_removeClass"
                           @blur="INPUT_addClass"
                    >
                    <span class="span3 subtract-span"
                          v-if="row['CONFIGINOFR_list'].length !== 1"
                          @click="subtractHandle(row['CONFIGINOFR_list'],index2)"
                    ></span>
                    <span class="span4 add-span"
                          v-if="index2 == row['CONFIGINOFR_list'].length - 1"
                          @click="addHandle(row['CONFIGINOFR_list'])"
                    ></span>
                    <!--ID:{{item2.id}}-->
                  </div>
                </template>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          type="index"
          v-bind="{
            label: '序号',
            resizable: false,
            width: 55,
            align: 'center',
          }"
          :index="i => i + 1"
        /><!--序号-->

        <el-table-column
          type="selection"
          v-bind="{
            resizable: false,
            width: 55,
            align: 'center',
          }"
          :selectable="selectableFn1"
        />

        <!-- 操作 -->
        <el-table-column
          label="操作"
          v-bind="{
              resizable: false,
              width: 150,
              align:'center'
          }"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="handleOpenEdit(scope.row)">查看</el-button>
            <!--<el-button type="text" @click="watchSampleInfo(scope.row)">查看</el-button>-->
            <!--原:<el-button type="text" @click="handleOpenDelete(scope.row.id)">删除</el-button>-->
            <!--现-->
            <el-button type="text"
                       style="color:red;"
                       v-if="selectableFn1(scope.row)"
                       @click="handleOpenDelete(scope.$index)"
            >删除
            </el-button>
            <el-button type="text" @click="openConfig(scope.row)">配置</el-button>
          </template>
        </el-table-column>

        <el-table-column
          v-bind="{
            property: 'stype',
            label: '样品类别',
            resizable: false,
            width: '110',
            formatter: (row,column,cellValue,index) => {
              switch (cellValue) {
                case 'carLoad':
                  return '整车'
                  break
                case 'componentPart':
                  return '零部件'
                  break
                default:
                  return ''
              }
            }
          }"
        /><!-- 样品类别 -->

        <el-table-column
          prop="ssname"
          v-bind="{
            label: '样品名称',
            resizable: false,
            width: '220',
          }"
        /><!-- 样品名称 -->

        <el-table-column
          prop="ssmodel"
          v-bind="{
            label: '产品型号',
            'resizable': false,
            'width': '180',
          }"
        /><!-- 产品型号 -->

        <el-table-column
          prop="sampleCode"
          v-bind="{
            label: '样品编号',
            resizable: false,
            width: '200',
            // sortable:true,
          }"
        /><!-- 样品编号 -->

        <!-- 车架号(VIN码) -->
        <!--<el-table-column
          label="车架号(VIN码)"
          prop="vin"
          v-bind="{
            'resizable': false,
            'width': '160',
          }"
        />-->


        <el-table-column
          label="产品商标"
          prop=""
          v-bind="{
            'resizable': false,
            'width': '120',
          }"
        /><!-- 产品商标 -->

        <el-table-column
          label="受检单位"
          prop=""
          v-bind="{
            'resizable': false,
            // 'width': '200',
            'min-width': 200,
          }"
        /><!-- 受检单位 -->

        <el-table-column
          label="来样方式"
          prop="sourceSampleWay"
          v-bind="{
            'resizable': false,
            'width': '100',
          }"
        /><!-- 来样方式 -->

        <el-table-column
          prop="" label="到样时间"
          v-bind="{
            'resizable': false,
            'width': '120',
          }"
        /><!-- 到样时间 -->

        <el-table-column
          label="收样时间" prop=""
          v-bind="{
            'resizable': false,
            'width': '120',
          }"
        /><!-- 收样时间 -->
      </el-table>
    </div>

    <!-- 选择样品类型 -->
    <el-dialog
      :visible.sync="show_selectAddSampleType"
      v-bind="{
        title: '选择样品类型',
        center: true,
        modal: false,
        width: '300px',
        'close-on-click-modal': false,
        'close-on-press-escape': false,
      }">
      <div style="text-align: center;padding: 20px 0">
        <i class="el-icon-warning" style="color:orange;font-size: 24px;"/>
        &nbsp;&nbsp;&nbsp;请选择添加整车还是零部件 ?
      </div>
      <div slot="footer">
        <el-button size="mini" @click="()=>{ sampleVla1 = '整车'; show = true; show_selectAddSampleType = false }">&nbsp;整车&nbsp;</el-button>
        <el-button size="mini" @click="()=>{ sampleVla1 = '零部件'; show = true; show_selectAddSampleType = false }">零部件
        </el-button>
      </div>
    </el-dialog>

    <!-- 新增样品 -->
    <el-dialog
      :visible.sync="show"
      v-if="show"
      custom-class="Fixed-el-dialog_body"
      v-bind="{
        title,
        fullscreen: true,
        modal: false,
        'close-on-press-escape': false,
        'close-on-click-modal': false,
      }"
      @open="handleOpen"
    >
      <!-- 原需求 -->
      <!--<SampleSelection
        ref="SampleSelection"
        :edit-data-prop="currentRoweData"
        :default-add-data-prop="{}"
      >
        <template slot-scope="{ formData }">
          {{ getSlotData('sample_information', formData) }}
        </template>
      </SampleSelection>-->

      <!-- 2020.05 新需求 -->
      <template v-if="sampleVla1 === '整车'">
        <!-- 整车列表组件 -->
        <Vehicle
          ref="Vehicle_1"
          :operationDisplay="false"
          v-bind="{
            'can-add': false,
          }"
          @GET_selectData="getSelectData1"
        />

        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="show = false">取消</el-button>
          <!-- 原 -->
          <!--<el-button size="mini" type="primary" @click="handleAddEdit(title)">确定</el-button>-->
          <!-- 现在 -->
          <el-button size="mini" type="primary" @click="addSampleHandle">确定</el-button>
        </span>
      </template>
      <template v-if="sampleVla1 === '零部件'">
        <!-- 零部件列表组件 -->
        <Spareparts
          ref="Spareparts_1"
          :operationDisplay="false"
          :whetherDisplay="1"
          v-bind="{
            'can-add': false,
          }"
        />
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="show = false">取消</el-button>
          <el-button size="mini" type="primary" @click="addPartsHandle">确定</el-button>
        </div>
      </template>

    </el-dialog>

    <!-- 查看样品 -->
    <el-dialog
      title="样品详细信息"
      :visible.sync="show2"
      v-if="show2"
      custom-class="Fixed-el-dialog_body"
      v-bind="{
        modal: false,
        'close-on-press-escape': false,
        'close-on-click-modal': false,
        fullscreen: true,
      }"
      @close="()=>{ currentRoweData = {} }"
    >
      <!--<SampleSelection
        ref="SampleSelection"
        :edit-data-prop="currentRoweData"
        :all-disable="true"
      />-->
      <SampleDetail
        ref="SampleDetail_1"
        :edit-data-prop="currentRoweData"
      />
      <div slot="footer">
        <el-button size="mini" @click="show2 = false">取消</el-button>
        <el-button size="mini" @click="restDatamly">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  /* 原需求:允许预先送样 */
  // 样品信息回显
  import SampleSelection from '../AmodelComponents/sample_selection'
  /***************************************************************************/
  /* 2020.05新需求 */
  // 整车列表
  import Vehicle from '@/views/sample/componentsview/vehicle.vue'
  // 零部件列表(2020.06.05)
  import Spareparts from '@/views/sample/componentsview/spareparts.vue'
  // 样品信息回显组件
  import SampleDetail from '../AmodelComponents/sample_detail'

  export default {
    name: 'sampleInfor',
    props: [
      'tinfoDataProp',
      'inforDataProp',
    ],
    components: {
      SampleSelection,
      Vehicle,
      Spareparts,
      SampleDetail,
    },
    data () {
      return {
        show_selectAddSampleType: false,
        currentRoweData: null,
        show: false,
        show2: false,
        dataSource: [],// 样品信息列表
        dataSourceIdList: [],// 样品信息id 列表
        sample_information: {},
        title: '新增样品',
        sampleVla1: '整车',
        selected: [],
        //
        activeDel: '',
        //

      }
    },
    watch: {
      dataSource: {
        deep: true,
        handler: function (value) {
          console.log('触发了样品列表信息 更新')
          let zARR = []
          for (let key in value) {
            for (let i in value[key].CONFIGINOFR_list) {
              let temp = value[key].CONFIGINOFR_list[i]
              if (temp.configDetails == '' || temp.configDetails == null){
                continue
              } else {
                zARR.push({
                  'label': `${value[key].sampleCode} ${temp.configName}`,
                  'value': temp.id,
                })
              }
            }
          }
          this.$emit('CHANGE_inspecteItems_sampleinfor', value,zARR)
          // this.$emit('CHANGE_configInfor_sampleinfor', this.dataSource)
          this.dataSourceIdList = value.map((item, index) => {
            item.kkey = `0${index}`
            return item.ssid
            // return item.sampleCode
          })
        }
      }
    },
    computed: {},
    methods: {
      /*
      * 判断 是否启用 删除
      * */
      selectableFn1 (row, index) {
        // 草稿箱 开放删除功能
        if (this.activeDel == 'draft') {
          return true
        }
        //
        else {
          if (!row.id) {
            return true
          } else {
            return false
          }
        }
      },

      /*
      * 代入 整车样品信息
      * */
      addSampleHandle () {
        let arr = this.$refs['Vehicle_1'].multipleSelection.slice(0)
        console.log(arr, '整车代入信息')
        for (let i = 0; i < arr.length; i++) {
          // if (this.dataSourceIdList.indexOf(arr[i].vin) == -1) {
          if (this.dataSourceIdList.indexOf(arr[i].id) == -1) {
            let obj = {
              stype: 'carLoad',// 样品类别
              ssid: arr[i].id,
              sampleCode: arr[i].vin,// 样品编码
              ssname: '',// 样品名称
              ssmodel: '',// 样品型号
              /**/
              samplingCode: '',// 抽样单号
              samplingTime: '',// 抽样时间
              samplingAddress: '',// 抽样地点
              samplingWay: '',// 抽样方式
              samplingBase: '',// 抽样基数
              samplingPeople: '',// 抽样人
              packingPeople: '',// 封样人
              packingState: '',// 封样状态
              /* 新功能: 配置信息(2020.07.10)
              * 变更(2020.07.19): 检验项目信息中不再绑定样品sampleCode,而是绑定配置信息
              *  */
              CONFIGINOFR_list: [
                {'id': new Date().getTime() + i + '', 'configName': '配置1', 'configDetails': ''},
              ],
            }
            this.dataSource.push(obj)
          } else {
            continue
          }
        }
        this.$nextTick(() => {
          this.show = false
        })
      },

      /*
      * 代入 零部件样品信息
      * */
      addPartsHandle () {
        let arr = this.$refs['Spareparts_1'].multipleSelection.slice(0)
        console.log(arr, '零部件代入信息')
        for (let i = 0; i < arr.length; i++) {
          // if (this.dataSourceIdList.indexOf(arr[i].vin) == -1) {
          if (this.dataSourceIdList.indexOf(arr[i].id) == -1) {
            let obj = {
              stype: 'componentPart',// 样品类别
              ssid: arr[i].id,
              sampleCode: arr[i].code,// 样品编号
              ssname: '',// 样品名称
              ssmodel: '',// 样品型号
              /**/
              samplingCode: '',
              samplingTime: '',
              samplingAddress: '',
              samplingWay: '',
              samplingBase: '',
              samplingPeople: '',
              packingPeople: '',
              packingState: '',
              /* 新功能: 配置信息(2020.07.10)
              * 变更(2020.07.19): 检验项目信息中不再绑定样品sampleCode,而是绑定配置信息
              * */
              CONFIGINOFR_list: [
                {'id': new Date().getTime() + i + '', 'configName': '配置1', 'configDetails': ''},
              ],
            }
            this.dataSource.push(obj)
          } else {
            continue
          }
        }
        this.$nextTick(() => {
          this.show = false
        })
      },

      /*
      * 打开 查看样品信息 弹框
      * */
      watchSampleInfo (data) {
        this.show2 = true
        this.$nextTick(() => {
          this.currentRoweData = data
        })
      },

      /*
      * 从整车样品中获取选中的样品数据
      * 2020.05 新需求
      * */
      getSelectData1 (data) {
        // console.log(JSON.parse(JSON.stringify(data)), '1_______?')
      },

      /*
      * 新增样品之前 询问样品类型
      * */
      selectAddSampleType () {
        this.currentRoweData = null
        this.title = '新增样品'
        this.show_selectAddSampleType = true
      },

      handleOpen () {
        console.log('打开新增/编辑样品')
      },

      /*
      * (取消了)
      * */
      getSlotData (key, data) {
        this[key] = data
      },

      /*
      * (取消了)
      * */
      findData () {
        let params = {
          pageSize: 100,
          pageNo: 1,
        }
        params['taskCode'] = this.tinfoDataProp['taskCode']
        this.$api.mly.taskSample_list(params)
          .then(res => {
            /* 原 */
            // this.dataSource = JSON.parse(JSON.stringify(res.data.result.records))
            // this.dataSourceIdList = res.data.result.records.map(item => {
            //   return item.vin
            // })
            /* 现 */
            this.dataSource = JSON.parse(JSON.stringify(res.data.data))
            // this.dataSourceIdList = res.data.data.map(item => {
            //   return item.vin
            // })
          })
          .catch(err => {
          })
      },

      /*
      * 打开查看 弹框
      * */
      handleOpenEdit (data) {
        /* 原 */
        // this.title = '编辑样品'
        // this.show = true
        // this.$nextTick(() => {
        //   this.currentRoweData = JSON.parse(JSON.stringify(data))
        // })
        /* 现 */
        this.show2 = true
        this.$nextTick(() => {
          this.currentRoweData = JSON.parse(JSON.stringify(data))
        })
      },

      /*
      * 查看样品信息  弹框 关闭前
      * */
      restDatamly () {
        let parm = this.$refs['SampleDetail_1'].formData
        for (let u in this.dataSource) {
          if (this.dataSource[u].ssid === parm.ssid) {
            this.dataSource[u] = JSON.parse(JSON.stringify(parm))
            this.dataSource = JSON.parse(JSON.stringify(this.dataSource))
          } else {
            continue
          }
        }
        this.show2 = false
      },

      handleAddEdit (value) {
        /*let params = JSON.parse(JSON.stringify(this.sample_information))
        params['taskCode'] = this.tinfoDataProp['taskCode']
        this.$refs['SampleSelection'].$refs['form_a']
          .validate((res, object) => {
            if (res) {
              switch (value) {
                case '新增样品':
                  /!* ******************************************** *!/
                  this.$api.mly.taskSample_add(params)
                    .then(res => {
                      if (res.data.success) {
                        this.$message.success({
                          message: res.data.message,
                          showClose: true,
                          duration: 3000,
                        })
                        this.findData()
                        this.show = false
                      } else {
                        this.$message.warning({
                          message: res.data.message,
                          showClose: true,
                          duration: 3000,
                        })
                      }
                    })
                    .catch(() => {
                      this.$message.warning({
                        message: '保存样品信息失败! 请检查',
                        showClose: true,
                        duration: 3000,
                      })
                    })
                  break
                case '编辑样品':
                  params['id'] = this.currentRoweData.id
                  // params['imgPath'] = encodeURIComponent(this.currentRoweData['imgPath'])
                  params['imgPath'] = this.currentRoweData['imgPath']
                  this.$api.mly.taskSample_edit(params)
                    .then(res => {
                      if (res.data.success) {
                        this.$message.success({
                          message: res.data.message,
                          showClose: true,
                          duration: 3000,
                        })
                        this.findData()
                        this.show = false
                      } else {
                        this.$message.warning({
                          message: res.data.message,
                          showClose: true,
                          duration: 3000,
                        })
                      }
                    })
                    .catch((err) => {
                      this.$message.error({
                        message: err.data.message,
                        showClose: true,
                        duration: 3000,
                      })
                    })
                    .then(() => {
                      // this.show = false
                      // this.$nextTick(()=>{
                      //   this.findData()
                      // })
                    })
                  break
              }
            } else {
              this.$message.warning({
                showClose: true,
                message: '存在错误的填写,请重新填写必填项!',
                duration: 3000,
              })
              return false
            }
          })*/
      },

      /*
      * 删除
      * */
      handleOpenDelete (index) {
        this.$confirm('确认要删除吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            /* 现 */
            this.dataSource.splice(index, 1)
            /* 原 */
            // this.$api.mly.taskSample_delete(value)
            //   .then(res => {
            //     this.$message.success({
            //       message: res.data.message,
            //       duration: 3000,
            //       showClose: true,
            //     })
            //     this.findData()
            //   })
            //   .catch(() => {
            //     this.$message.error({
            //       message: `删除失败`,
            //       duration: 3000,
            //       showClose: true,
            //     })
            //   })
          })
          .catch(() => {
          })
      },

      /*
      * 批量删除
      * */
      handleDeleteBatch () {
        if (this.selected.length === 0) {
          this.$message.warning({
            message: '请至少选择一条数据 !',
            showClose: true,
            duration: 3500,
          })
          return
        } else {
          this.$confirm('确认要删除这些数据吗？', '提示', {
            type: 'warning'
          })
            .then(() => {
              /* 现 */
              let this2 = this
              this.dataSource = this.dataSource.filter(item => {
                return !this2.selected.includes(item.kkey)
              })
            })
            .catch(() => {
            })

          /* 原 */
          // this.$api.mly.taskSample_deleteBatch({
          //   ids: ids.toString()
          // }).then(res => {
          //   this.findData()
          // }).catch(() => {
          // })
        }
      },

      selectionChange (selection) {
        // let arr = []
        // arr.push(...selection)
        // this.selected = arr
        this.selected = selection.map((item, index) => {
          return item.kkey
        })
      },

      /* ************************************************** */
      /*
      * 打开 配置信息
      * */
      openConfig (data) {
        let $table = this.$refs['sampleInfoList']
        $table.toggleRowExpansion(data)
      },

      /*
      * 减 配置信息
      * */
      subtractHandle (data, index) {
        data.splice(index, 1)
        data.forEach((item, index) => {
          item.configName = `配置${index + 1}`
        })
      },

      /*
      * 加 配置信息
      * */
      addHandle (data) {
        let $flg = false
        let target = event.target
        let $targetDIV = $(target).closest('.m-sampleConfig-Info').find('input[class*=m-InputClass]')
        for (let i = 0; i < $targetDIV.length; i++) {
          if ($($targetDIV[i]).val() == '') {
            $($targetDIV[i]).addClass('warningINPUT')
            $flg = true
          }
        }
        if ($flg) return
        data.push({
          'id': (new Date()).valueOf() + '',
          configDetails: ''
        })
        data.forEach((item, index) => {
          item.configName = `配置${index + 1}`
        })
      },

      /*
      * 失焦添加警告样式
      * */
      INPUT_addClass () {
        let target = event.target
        if ($(target).val() == '') {
          $(target).addClass('warningINPUT')
          return
        }
        $(target).removeClass('warningINPUT')
      },

      /*
      * 聚焦清除警告样式
      * */
      INPUT_removeClass () {
        let target = event.target
        $(target).removeClass('warningINPUT')
      },
    }
  }
</script>
<style scoped lang="less">

  @import "../style/config_infor";

  /deep/ .Fixed-el-dialog_body {
    display: flex;
    flex-direction: column;

    .el-dialog__body {
      flex: 1;
      overflow-y: auto;
    }
  }

  /deep/ .sampleInfo-table {
    .el-table__expand-icon > .el-icon {
      display: none;
    }
  }

</style>
