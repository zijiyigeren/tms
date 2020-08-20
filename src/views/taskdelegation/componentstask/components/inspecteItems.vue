<template>
  <!-- 任务受理 - 检验项目 -->
  <div>{{getDefaultItem}}<!--触发获取默认00项的-->
    <p style="margin: 0;">
      <el-button size="mini" type="primary" @click="show = true">新增检验项目</el-button>
      <template v-if="showDeleteBTN">
        <el-button size="mini" @click="handleBulkDlete">批量删除</el-button>
      </template>
      <template v-if="showPrintBTN">
        <el-button size="mini" type="primary" @click="goPrint">打印任务单</el-button>
      </template>
      <!--<button @click="chakan">查看检验项目列表</button>-->
      <el-button v-popover:popover4 icon="el-icon-more" size="mini" style="float:right"></el-button>

      <!-- 表格隐藏列 -->
      <el-popover ref="popover4" placement="right" width="466" trigger="click">
        <div style="float:right">
          <el-form label-width="80px">
            <el-form-item label>
              <el-checkbox-group v-model="columnShow" @change="changeColumn">
                <!--<el-checkbox style="width:150px" label="检验依据"/>
                <el-checkbox style="width:150px" label="收费标准"/>-->
                <el-checkbox style="width:150px" label="实检项目" @change="syxm"></el-checkbox>
                <!--<el-checkbox style="width:150px" label="报告编号" @change="bgbh"/>-->
                <!--<el-checkbox style="width:150px" label="项目代码"/>-->
                <el-checkbox style="width:150px" label="项目样品规格型号" @change="xmypggxh"></el-checkbox>
                <el-checkbox style="width:150px" label="样品批次号" @change="yppch"></el-checkbox>
                <el-checkbox style="width:150px" label="项目样品商标" @change="xmypsb"></el-checkbox>
                <el-checkbox style="width:150px" label="项目备注" @change="xmbz"></el-checkbox>
                <el-checkbox style="width:150px" label="项目样品生产厂家" @change="xmypsccj"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </el-popover>
    </p>


    <div class="tabBox m-target">
      <table border="1" class="fexlBox">
        <tr class="fexlBoxTitle">
          <th class="m_fb1">序号</th>
          <th style="width: 30px;">
            <!--<input type="checkbox" v-model="checkAllfb" @change="selectionChange()">-->
            <el-checkbox v-model="checkAllfb" @change="selectionChange"/>
          </th>
          <th class="m_fb2">操作</th>
          <th class="m_fb3">是否出报告</th>
          <th class="m_fb4">是否做测试</th>
          <th class="m_fb5">项目代码</th>
          <th class="m_fb15" v-if='fb15'>报告编号</th>
          <th class="m_fb6">检验项目</th>
          <th class="m_fb7">检验依据</th>
          <th style="width: 240px;">绑定样品</th>
          <th class="m_fb8">试验科室</th>
          <th class="m_fb9">样品名称</th>
          <th class="m_fb10">样品数量</th>
          <th class="m_fb11">单次收费</th>
          <th class="m_fb12">检验次数</th>
          <!--<th class="m_fb13">状态</th>-->
          <th class="m_fb14" v-if='fb14'>实检项目</th>
          <th class="m_fb16" v-if='fb16'>规格型号</th>
          <th class="m_fb17" v-if='fb17'>样品批次号</th>
          <th class="m_fb18" v-if='fb18'>项目样品商标</th>
          <th class="m_fb19" v-if='fb19'>项目备注</th>
          <th class="m_fb20" v-if='fb20'>项目样品生产厂家</th>
          <th class="m_fb21">送样日期</th>
          <th class="m_fb22">项目签发日期</th>
          <th class="m_fb23">到样时间</th>
        </tr>
        <tr
          class="fexlBoxrow" v-for="(row,index) in dataSource"
          :key="index"
          @click.stop="handleRowClick(row)"
        >
          <td>{{ index + 1 }}</td>
          <td class="m_fb1" @click.stop>
            <el-checkbox
              v-model="row.checkcur"
              @change="handleCurChange(row)"
            />
          </td>
          <td class="m_fb2">
            <!--{{row.key}}-->
            <el-button type="text"
                       @click.stop="copyRow(row)">复制
            </el-button>
            <el-button type="text" style="color: red;"
                       v-if="showDeleteBTN"
                       @click.stop="deleteRow(index)">删除
            </el-button>
          </td>
          <td class="m_fb3">
            <el-switch
              v-model="row.needReport"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
            />
          </td>
          <td class="m_fb4">
            <el-switch
              v-model="row.needTest"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
            />
          </td>
          <td class="m_fb5">
            <input type="text" class="inputClass" v-if="row.editable" v-model.lazy="row.itemsItemCode">
            <template v-else>{{row.itemsItemCode}}</template>
          </td>
          <td class="m_fb15" v-if='fb15'>{{row.itemsCode}}</td>
          <td class="m_fb6" >
            <input type="text" class="inputClass" v-if="row.editable" v-model.lazy="row.itemsName">
            <template v-else>{{row.itemsName}}</template>
          </td>
          <td class="m_fb7">
            <input type="text" class="inputClass" v-if="row.editable" v-model.lazy="row.itemsBasis">
            <template v-else>{{row.itemsBasis}}</template>
          </td>
          <td>
            <!-- 新(2020.07.20): -->
            <el-select
              v-model="row.samplesBinding"
              v-bind="{
                size:'mini',
                multiple:true,
              }"
              placeholder="请选想绑定的配置信息"
              style="width:100%;"
            >
              <el-option
                v-for="(item,index) in mySampleConfigInforList"
                :key="'index'+index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </td>
          <td class="m_fb8">
            <el-select
              ref="orgID"
              v-model="row.testRoom"
              placeholder="请选择科室"
              size="mini"
              :disabled="row.isModify == '2'"
            >
              <el-option
                v-for="item in orgs"
                :key="item.id"
                :label="item.org_name"
                :value="item.id"
              />
            </el-select>
          </td>
          <td class="m_fb9">
            <input type="text" class="inputClass" v-if="row.editable" v-model.lazy="row.samplesName">
            <template v-else>{{row.samplesName}}</template>
          </td>
          <td class="m_fb10">
            <el-input-number
              style="width: 90%;"
              size="mini" :min="0"
              v-if="row.editable"
              v-model="row.itemsItemSamplesVolume"
            />
            <template v-else>{{row.itemsItemSamplesVolume}}</template>
          </td>
          <td class="m_fb11">
            <input type="text" class="inputClass" v-if="row.editable" v-model.lazy="row.charges">
            <template v-else>{{row.charges}}</template>
          </td>
          <td class="m_fb12">
            <el-input-number
              style="width: 90%;"
              size="mini" :min="1"
              v-if="row.editable"
              v-model="row.testNumber"
            />
            <template v-else>{{row.testNumber}}</template>
          </td>
          <!--<td class="m_fb13">1</td>-->
          <td class="m_fb14" v-if='fb14'>
            <input type="text" class="inputClass" v-if="row.editable" v-model.lazy="row.itemsFrederickItme">
            <template v-else>{{row.itemsFrederickItme}}</template>
          </td>
          <td class="m_fb16" v-if='fb16'>
            <input type="text" class="inputClass" v-if="row.editable" v-model.lazy="row.samplesSpecifications">
            <template v-else>{{row.samplesSpecifications}}</template>
          </td>
          <td class="m_fb17" v-if='fb17'>{{row.samplesCode}}</td>
          <td class="m_fb18" v-if='fb18'>
            <input type="text" class="inputClass" v-if="row.editable" v-model.lazy="row.samplesPropertyShow">
            <template v-else>{{row.samplesPropertyShow}}</template>
          </td>
          <td class="m_fb19" v-if='fb19'>
            <input type="text" class="inputClass" v-if="row.editable" v-model.lazy="row.remarks">
            <template v-else>{{row.remarks}}</template>
          </td>
          <td class="m_fb20" v-if='fb20'>
            <input type="text" class="inputClass" v-if="row.editable" v-model.lazy="row.samplesManufacturers">
            <template v-else>{{row.samplesManufacturers}}</template>
          </td>
          <td class="m_fb21">
            <el-date-picker
              style="width: 100%;"
              v-if="row.editable"
              v-model="row.itemsSampleDate"
              value-format="yyyy-MM-dd"
              size="mini"
            />
            <template v-else>{{row.itemsSampleDate}}</template>
          </td>
          <td class="m_fb22">
            <el-date-picker
              style="width: 100%;"
              v-if="row.editable"
              v-model="row.itemsItemIssuanceDate"
              value-format="yyyy-MM-dd"
              size="mini"
            />
            <template v-else>{{row.itemsItemIssuanceDate}}</template>
          </td>
          <td class="m_fb23">
            <el-date-picker
              style="width: 100%;"
              v-if="row.editable"
              v-model="row.sampleComeDate"
              value-format="yyyy-MM-dd"
              size="mini"
            />
            <template v-else>{{row.sampleComeDate}}</template>
          </td>
        </tr>
      </table>
      <div v-if="dataSource.length == 0" class="nothing_data">
        暂无数据
      </div>
    </div>

    <!-- 新增检验项目 -->
    <el-dialog
      :visible.sync="show"
      v-if="show"
      v-bind="{
        title: '新增检验项目',
        // width: '90%',
        fullscreen: true,
        modal: false,
        // 'destroy-on-close': true,
        'close-on-press-escape': false,
        // 'close-on-click-modal': false,
      }"
      class="dialog_directories"
    >
      <InspecteItemInfor @updateTable="updateTable"/>
    </el-dialog>

    <slot :dataSource="dataSource"></slot>
  </div>
</template>

<script>
  import InspecteItemInfor from '@/components/Systemproject.vue'

  export default {
    name: 'inspecteItems',
    components: {InspecteItemInfor,},
    props: ['djxx', 'orgs', 'orgsIdList'],
    watch: {
      dataSource: {
        // deep: true,
        handler: function (value) {
          console.log('触发了检验项目信息列表 更新')
          for (let i in value) {
            if (i < 10) {
              value[i].key = `0${i}`
            } else {
              value[i].key = `${i}`
            }
          }
        }
      },
    },
    data () {
      return {
        // tableSource: [],
        fb14: false,// 实检项目(列)
        fb15: true,// 报告编号(列)
        fb16: false,// 规格型号(列)
        fb17: false,// 样品批次号(列)
        fb18: false,// 项目样品商标(列)
        fb19: false,// 项目备注(列)
        fb20: false,// 项目样品生产厂家(列)

        checkAllfb: false,// 全选
        curfbbox: [],

        show: false,
        aaaa: [],
        dataSource: [],
        isEdit: false,
        selectionData: [],

        /* 控制table隐藏列 */
        columnShow: [],
        columnShowObj: {
          // '检验依据': 'itemsBasisShow',
          // '收费标准': 'chargesShow',
          '实检项目': 'itemsFrederickItmeShow',
          // '报告编号': 'itemsCodeShow',
          // '项目代码': 'itemsItemCodeShow',
          '项目样品规格型号': 'samplesSpecificationsShow',
          '样品批次号': 'samplesCodeShow',
          '项目样品商标': 'samplesPropertyShow',
          '项目备注': 'remarksShow',
          '项目样品生产厂家': 'samplesManufacturersShow',
        },
        /**/
        // itemsBasisShow: !true,// 检验依据
        // chargesShow: !true,// 单次收费
        itemsFrederickItmeShow: !true,// 实检项目
        // itemsCodeShow: !true,// 报告编号
        itemsItemCodeShow: true,// 项目代码
        samplesSpecificationsShow: !true,//项目样品规格型号
        samplesCodeShow: !true,// 样品批次号
        samplesPropertyShow: !true,// 项目样品商标
        remarksShow: !true,// 项目备注
        samplesManufacturersShow: !true,// 项目样品生产厂家
        /**/
        showDeleteBTN: true,
        showPrintBTN: false,
        /**/
        mySempleInforList: [],
        my_list: '',
        mySampleConfigInforList: [],
        /**/
        sampleConfigInfoVOS: [],
      }
    },
    computed: {
      getDefaultItem () {
        this.dataSource = JSON.parse(JSON.stringify(this.$store.state.defaultItem))
      },
    },
    methods: {
      // chakan(){
      //   console.log(this.dataSource)
      // },
      /*
      * 单击行 激活编辑状态
      * */
      handleRowClick (row) {
        for (let index in this.dataSource) {
          this.dataSource[index].editable = false
        }
        row.editable = true
      },

      /*
      * 获取子组件往父组件内传的值
      * */
      getSlotData (key, data) {
        this[key] = JSON.parse(JSON.stringify(data))
      },

      /*
      * 复用新增检验项目
      * */
      updateTable (data) {
        let
          tinfo = this.djxx['tinfo'],
          infor = this.djxx['infor']
        for (let i = 0; i < data.length; i++) {
          let length
          if (data[i].property !== null && data[i].property !== undefined) {
            length = parseInt(data[i].property)
          } else {
            length = 1
          }
          for (let j = 0; j < length; j++) {
            let new_obj = JSON.parse(JSON.stringify(data[i]))
            delete new_obj.id
            delete new_obj.ids
            let new_obj1 = {}

            new_obj1.itemsCode = new Date().getTime() + j + i /* 摩托所新需求,需要调用生成报告编号接口获得<登记信息页> */
            new_obj1.itemsName = new_obj.items_itme_name
            new_obj1.samplesSpecifications = tinfo.sampleType
            new_obj1.itemId = new_obj.itemId
            new_obj1.indexid = new_obj.indexid
            new_obj1.samplesName = tinfo.sampleName
            new_obj1.samplesCode = new_obj.samplesCode
            // new_obj1.itemsRoom = parseInt(new_obj.items_test_room)
            // new_obj1.itemsRoom = this.orgsIdList.filter(item => item == new_obj.items_test_room)[0]
            new_obj1.testRoom = this.orgsIdList.filter(item => item == new_obj.items_test_room)[0]
            new_obj1.chargesStandard = new_obj.chargesStandard
            new_obj1.testNumber = new_obj.testNumber ? new_obj.testNumber : 1
            new_obj1.charges = new_obj.items_charges
            new_obj1.samplesProperty = tinfo.sampleTrademark
            new_obj1.itemsItemSamplesVolume = new_obj.itemsItemSamplesVolume
            new_obj1.itemsFrederickItme = new_obj.itemsFrederickItme
            new_obj1.samplesManufacturers = infor.produceCompany
            new_obj1.itemsSampleDate = tinfo.sampleDate
            new_obj1.itemsItemIssuanceDate = new_obj.itemsItemIssuanceDate
            new_obj1.itemsItemCode = new_obj.items_item_code
            new_obj1.itemsBasis = new_obj.items_test_basis
            new_obj1.remarks = new_obj.itemNote
            new_obj1.cvItemsCode = new_obj.cvItemsCode
            new_obj1.sampleComeDate = new_obj.sampleComeDate
            new_obj1.inUse = new_obj.inUse// 状态
            new_obj1.needReport = new_obj.needReport
            new_obj1.needTest = new_obj.needTest
            new_obj1.editable = false
            new_obj1.checkcur = false
            new_obj1.samplesBinding = []
            this.dataSource.push(new_obj1)
          }
        }
        this.show = false
      },

      /*
      * 删除行
      * */
      deleteRow (index) {
        this.dataSource.splice(index, 1)
      },

      /*
      * 复制行
      * */
      copyRow (row) {
        let data = JSON.parse(JSON.stringify(row))
        delete data.onlyOne // 不删除就会影响序号列内容
        delete data.isModify
        delete data.id
        delete data.ids
        data.itemsCode = new Date().getTime()
        data.editable = false
        data.checkcur = false
        data.samplesBinding = [] /* 2020.06 新需求 检验项目中绑定的样品字段 */
        this.dataSource.push(data)
      },

      /*
      * 批量删除
      * */
      handleBulkDlete () {
        if (this.selectionData.length === 0) {
          this.$message.error({
            message: `请选择删除项`,
            duration: 3000
          })
          return
        } else {
          this.$confirm(`确定删除已选项?`, `提示`, {
            type: 'warning',
            center: true
          }).then(() => {
            let this2 = this
            this.dataSource = this.dataSource.filter(item => {
              console.log(!this2.selectionData.includes(item.key))
              return !this2.selectionData.includes(item.key)
            })
          }).catch(() => {
          })
        }
      },

      /*
      * 触发多选
      * */
      selectionChange () {
        let selection = []
        // if(this.checkAllfb){
        //   this.checkAllfb = false;
        // }else{
        //   this.checkAllfb = true;
        // }
        if (this.checkAllfb) {
          selection = this.dataSource.map(item => {
            item.checkcur = true
            return item.key
          })
          this.selectionData = selection
          // this.selectionData = selection.map(item => {
          //   return item.key
          // })
        } else {
          this.selectionData = []
          this.dataSource.map(item => {
            item.checkcur = false
          })
        }

      },

      /*
      * 单选
      * */
      handleCurChange (row) {
        this.curfbbox.push(row)
        let arr = [...new Set(this.curfbbox)]
        this.selectionData = arr.map(item => {
          return item.key
        })
      },

      /*
      * 进入打印界面
      * */
      goPrint () {
        this.$emit('GET_sampleConfigInfoVOS')
        let sampleConfigInfoVOS = this.sampleConfigInfoVOS
        let tinfo = JSON.parse(JSON.stringify(this.djxx['tinfo'])),
          infor = JSON.parse(JSON.stringify(this.djxx['infor'])),
          inspectContentList = JSON.parse(JSON.stringify(this.dataSource)).map(item => {
            if (!item.samplesBinding) {
              item.samplesBinding = []
            }// 默认00项不绑定样品就没有 samplesBinding
            item.samplesBinding = item.samplesBinding.toString()
            if (item.onlyOne) {
              item.itemsCode = tinfo.taskCode
            }
            return item
          })
        let params = {
          tinfo: tinfo,
          infor: infor,
          inspectContentList,
          formaction: 'printxls',
          sampleConfigInfoVOS,
        }
        window.sessionStorage.setItem('printData', JSON.stringify(params))
        let routeData = this.$router.resolve({
          name: 'print',
        })
        window.open(routeData.href, '_blank')
      },

      /*
      * 控制表格隐藏列
      * */
      changeColumn (value) {
        if (value.length > 0) {
          for (let key in this.columnShowObj) {
            if (value.indexOf(key) !== -1) {
              this[this.columnShowObj[key]] = true
            } else {
              this[this.columnShowObj[key]] = false
            }
          }
        } else {
          for (let key in this.columnShowObj) {
            this[this.columnShowObj[key]] = false
          }
        }
      },

      //
      syxm () { //实检项目
        this.fb14 = !this.fb14
      },
      // bgbh () { //报告编号
      //   this.fb15 = !this.fb15
      // },
      xmypggxh () { //项目样品规格型号
        this.fb16 = !this.fb16
      },
      yppch () { //样品批次号
        this.fb17 = !this.fb17
      },
      xmypsb () { //项目样品商标
        this.fb18 = !this.fb18
      },
      xmbz () { //项目备注
        this.fb19 = !this.fb19
      },
      xmypsccj () { //项目样品生产厂家
        this.fb20 = !this.fb20
      },
    },
  }
</script>

<style scoped lang="less">
  @import "../style/inspecteItems.less";

</style>
