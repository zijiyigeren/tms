<template>
  <div>
    <div class="pull-right" style="display:none">
      <el-select size="mini" v-model="copySelect">
        <el-option label="项目样品规格型号" value="samplesSpecifications"></el-option>
        <el-option label="项目样品名称" value="samplesName"></el-option>
        <el-option label="项目样品商标" value="samplesProperty"></el-option>
        <el-option label="送样日期" value="itemsSampleDate"></el-option>
        <el-option label="项目样品生产厂家" value="samplesManufacturers"></el-option>
        <el-option label="项目签发日期" value="itemsItemIssuanceDate"></el-option>
      </el-select>
      <el-input style="width:auto" size="mini" v-model="modifyInfo"></el-input>
      <el-button type="primary" style="width: 100px" @click="modifyColumn">修改项目信息</el-button>
    </div>
    <el-button v-popover:popover4 icon="el-icon-more" style="float:right"></el-button>
    <div style="margin-bottom:10px">
      <el-button type="primary" style="width: 100px" @click="openTree">新增</el-button>
      <el-button type="primary" style="width: 100px" @click="aaa">打印</el-button>
    </div>
    <el-popover ref="popover4" placement="right" width="466" trigger="click">
      <div style="float:right">
        <el-form label-width="80px">
          <el-form-item label>
            <el-checkbox-group v-model="columnShow" @change="changeColumn">
              <el-checkbox style="width:150px" label="项目样品规格型号"></el-checkbox>
              <el-checkbox style="width:150px" label="样品批次号"></el-checkbox>
              <el-checkbox style="width:150px" label="收费标准"></el-checkbox>
              <el-checkbox style="width:150px" label="项目样品商标"></el-checkbox>
              <el-checkbox style="width:150px" label="项目检验依据"></el-checkbox>
              <el-checkbox style="width:150px" label="项目备注"></el-checkbox>
              <el-checkbox style="width:150px" label="实检项目"></el-checkbox>
              <el-checkbox style="width:150px" label="项目样品生产厂家"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
    </el-popover>

    <el-table :data="tableData" border>
      <el-table-column
        label="项目代码" prop="itemsItemCode"
        align="center" :resizable="false"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemsItemCode" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemsName"
        label="项目名称"
        align="center" :resizable="false"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemsName" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="项目样品规格型号"
        prop="samplesSpecifications"
        align="center" :resizable="false"
        v-if="samplesSpecificationsShow"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.samplesSpecifications" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="项目样品名称"
        prop="samplesName"
        align="center" :resizable="false"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.samplesName" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="报告编号"
        prop="itemsCode"
        align="center" :resizable="false"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemsCode" size="mini" :disabled="scope.row.isModify == '2'"></el-input>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="samplesCode" label="项目样品批次号" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.samplesCode" size="mini"></el-input>
        </template>
      </el-table-column>-->
      <el-table-column
        label="试验科室"
        prop="itemsRoom"
        align="center" :resizable="false"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-select ref="orgID"
                     v-model="scope.row.itemsRoom"
                     placeholder="请选择科室"
                     size="mini"
                     @change="genAllItemsId"
                     :disabled="scope.row.isModify == '2'"
          >
            <el-option v-for="item in orgs" :key="item.id" :label="item.org_name" :value="item.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="samplesCode"
        label="样品批次号"
        align="center" :resizable="false"
        v-if="samplesCodeShow"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.samplesCode" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="charges"
        label="收费标准"
        align="center" :resizable="false"
        v-if="chargesShow"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.charges" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="testNumber"
        label="检测次数"
        align="center" :resizable="false"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.testNumber" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="samplesProperty"
        label="项目样品商标"
        align="center" :resizable="false"
        v-if="samplesPropertyShow"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.samplesProperty" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemsBasis"
        label="项目检验依据"
        align="center" :resizable="false"
        v-if="itemsBasisShow"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemsBasis" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="remarks"
        label="项目备注"
        align="center" :resizable="false"
        v-if="remarksShow"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.remarks" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemsItemSamplesVolume"
        label="样品数量"
        align="center" :resizable="false"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemsItemSamplesVolume" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemsFrederickItme"
        label="实检项目"
        align="center" :resizable="false"
        v-if="itemsFrederickItmeShow"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemsFrederickItme" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="samplesManufacturers"
        label="项目样品生产厂家"
        align="center" :resizable="false"
        v-if="samplesManufacturersShow"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.samplesManufacturers" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemsSampleDate"
        label="送样日期"
        align="center" :resizable="false"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemsSampleDate" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemsItemIssuanceDate"
        label="项目签发日期"
        align="center" :resizable="false"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemsItemIssuanceDate" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="到样时间"
                       prop="sampleComeDate" align="center" :resizable="false"
                       :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.sampleComeDate" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center" fixed="left" :resizable="false"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <div style="display: flex;justify-content: space-around;max-width: 83px;margin: 0 auto;">
            <span @click="copyRow(scope.row)"
                  style="cursor: pointer;color: #409EFF;"
            >复制</span>
            <span @click="deleteRow(scope.$index,scope.row)"
                  style="cursor: pointer;color: #409EFF;"
            >删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-dialog
      title="选择项目"
      :visible.sync="modalShow"
      v-if="modalShow"
      center
      :fullscreen="true"
      append-to-body
    >
      <project type="1" ref="project" @updateTable="updateTable"></project>
    </el-dialog> -->

    <div class="choice_statistics" v-if="modalShow">
      <div class="el_dialog">
        <div class="el_dialog__header">
          <span>选择项目</span>
          <el-button type="text" class="el_dialog_btnclose" @click="modalShow=false">
              <i class="el-icon-close"></i>
          </el-button>
        </div>

        <div class="el_dialog__body">
            <project type="1" ref="project" @updateTable="updateTable"></project>
        </div>
        <div class="el_dialog__footer"></div>
      </div>
    </div>

    <!-- <itemAllList :modal-show.sync="modalShow"></itemAllList> -->
  </div>
</template>
<script>
  import project from '@/components/Systemproject.vue'

  export default {
    data() {
      return {
        modalShow: false,
        tableData: [],
        reportObj: {},
        copySelect: '',
        modifyInfo: '',
        columnShow: [],
        samplesSpecificationsShow: false,
        samplesCodeShow: false,
        chargesShow: false,
        itemsBasisShow: false,
        samplesPropertyShow: false,
        remarksShow: false,
        itemsFrederickItmeShow: false,
        samplesManufacturersShow: false,
        columnShowObj: {
          "项目样品规格型号": "samplesSpecificationsShow",
          "样品批次号": "samplesCodeShow",
          "收费标准": "chargesShow",
          "项目样品商标": "samplesPropertyShow",
          "项目检验依据": "itemsBasisShow",
          "项目备注": "remarksShow",
          "实检项目": "itemsFrederickItmeShow",
          "项目样品生产厂家": "samplesManufacturersShow",
        }
      }
    },
    props: ['taskCode', 'inspectType', 'orgList', 'orgs', 'numberMap', 'carType', 'tinfo', 'infor', 'muster'],
    components: {
      project
    },

    methods: {
      aaa() {
        let objj = {
          tinfo: this.tinfo,
          infor: this.infor,
          muster: this.muster,
          inspectContentList: this.tableData,
          formaction: 'printxls'
        };
        window.sessionStorage.setItem('printData', JSON.stringify(objj));
        let routeData = this.$router.resolve({
          name: "print",
          // query: params,
          // params:{catId:params.catId}
        });
        window.open(routeData.href, '_blank');
      },
      openTree() {
        this.modalShow = true;
        setTimeout(() => {
          this.$refs.project.value1 = this.carType;
        }, 0)
      },
      updateTable(data) {
        for (let i = 0; i < data.length; i++) {
          let length;
          if (data[i].property !== null && data[i].property !== undefined) {
            length = parseInt(data[i].property)
          } else {
            length = 1;
          }
          for (let j = 0; j < length; j++) {
            let new_obj = JSON.parse(JSON.stringify(data[i]));
            delete new_obj.id;
            delete new_obj.ids;
            let new_obj1 = {};

            new_obj1.itemsCode = new_obj.itemsCode;
            new_obj1.itemsName = new_obj.items_itme_name;
            new_obj1.samplesSpecifications = this.tinfo.sampleType;
            new_obj1.itemId = new_obj.itemId;
            new_obj1.indexid = new_obj.indexid;
            new_obj1.samplesName = this.tinfo.sampleName;
            new_obj1.samplesCode = new_obj.samplesCode;
            new_obj1.itemsRoom = parseInt(new_obj.items_test_room);
            new_obj1.chargesStandard = new_obj.chargesStandard;
            new_obj1.testNumber = new_obj.testNumber;
            new_obj1.charges = new_obj.items_charges;
            new_obj1.samplesProperty = this.tinfo.sampleTrademark;
            new_obj1.itemsItemSamplesVolume = new_obj.itemsItemSamplesVolume;
            new_obj1.itemsFrederickItme = new_obj.itemsFrederickItme;
            new_obj1.samplesManufacturers = this.infor.produceCompany;
            new_obj1.itemsSampleDate = this.tinfo.sampleDate;
            new_obj1.itemsItemIssuanceDate = new_obj.itemsItemIssuanceDate;
            new_obj1.itemsItemCode = new_obj.items_item_code;
            new_obj1.itemsBasis = new_obj.items_test_basis;
            new_obj1.remarks = new_obj.itemNote;
            new_obj1.cvItemsCode = new_obj.cvItemsCode;
            new_obj1.sampleComeDate = new_obj.sampleComeDate;

            this.tableData.push(new_obj1)
            this.genAllItemsId2(this.tableData[this.tableData.length - 1]);
          }
        }
        this.modalShow = false;
        console.log(this.orgList)
      },
      genAllItemsId2(obj) {
        let that = this;
        let itemCode = obj.itemsItemCode;
        //表示新增加检验项目的报告序号
        let itemNum = 0;
        let orgID = '';
        let taskId = this.taskCode;
        let id = '';
        if (this.reportObj[itemCode]) {
          if (itemCode.length == 3 && this.reportObj[itemCode] + "" == "NaN") {
            this.reportObj[itemCode] = 65;
            itemNum = 65;
          } else {
            this.reportObj[itemCode] = parseInt(this.reportObj[itemCode]) + 1;
            itemNum = parseInt(this.reportObj[itemCode]);
          }
          // 之前没有下达过这个项目序号的任务
        } else {
          itemNum = 0;
          this.reportObj[itemCode] = 0;
          this.tableData.forEach(function (item, idx, array) {
            let itemCodes = "";
            try {
              itemCodes = item.itemsItemCode;

            } catch (Exception) {
              itemCodes = "";
            }
            if (itemCodes != "") {
              try {
                // 从MakeTaskInfo.items找到和当前行检验项目序号相同的行
                if (itemCodes == itemCode) {
                  if (that.reportObj[itemCodes] !== undefined) {
                    if (itemCode.length == 3
                      && (parseInt(that.reportObj[itemCodes]) == 0 || that.reportObj[itemCode] + "" == "NaN" || that.reportObj[itemCode] + "" == "undefined")) {
                      that.reportObj[itemCodes] = 65;
                    } else {
                      let num = 0;
                      if (isNaN(parseInt(item.itemsCode.substring(6, 7)))) {
                        num = parseInt(item.itemsCode.substring(6, 7).charCodeAt(0))
                      } else {
                        num = parseInt(item.itemsCode.substring(6, 7))
                      }

                      let itemCodeNumber = 0;
                      if (num >= that.reportObj[itemCodes]) {
                        itemCodeNumber = num + 1;
                      } else {
                        itemCodeNumber = that.reportObj[itemCodes];
                      }
                      // let itemCodeNumber = parseInt(that.reportObj[itemCodes]) + 1;
                      if (itemCodeNumber == 18 || itemCodeNumber == 24) {
                        itemCodeNumber = itemCodeNumber + 1;
                      }
                      that.reportObj[itemCodes] = itemCodeNumber;
                    }
                  } else {
                    if (itemCode.length == 3)
                      that.reportObj[itemCodes] = 65;
                    else
                      that.reportObj[itemCodes] = 1;
                  }
                }
              }// try
              catch (Exception) {
                that.reportObj[itemCodes] = 1;
              }
            }// if (itemCodes!="")
          })
          itemNum = parseInt(this.reportObj[itemCode]);
        }

        let temp = 0;
        let inspectType = this.inspectType;
        let fromgz = this.tinfo.ifrom;
        console.log(fromgz)
        console.log(inspectType)
        if (inspectType.length > 0) {
          let yearCode = taskId.substring(inspectType.length, inspectType.length + 2);
          let sn = taskId.substring(inspectType.length + 2);
          let joinWord = (inspectType == 'QA') ? '' : '-';
          let orgABC = '';

          this.tableData.forEach(function (item, idx, array) {
            if (that.tableData.length == (idx + 1)) {
              orgID = item.itemsRoom;
              // 2018-01-15天津所需求 整车部分成四个科室 零部件分成三个科室 默认都是用原来分科室之前的部门编号
              if ((",161,12,").indexOf("," + orgID + ",") != -1) {
                orgID = 13;
              }
              if ((",1161,1162,21,").indexOf("," + orgID + ",") != -1) {
                orgID = 20;
              }
              orgABC = that.orgList[orgID];
            }
            if (orgABC) {
              // 原系统 id直 id=#1+#2+#3+#4+#5+#6 HuangCS 2004-04-24
              // #1 inspectType =类型 例如 WT
              // #2 yearCode = 年份    HCR19L01ZW0021
              // #3 sn = 任务号
              // #4 numbers = 同一部门检验项目个数
              // #5 orgABC = 部门第一个汉语拼音
              // #6 同一部门检验项目个数
              // #6 同一部门检验项目个数排序 从1开始
              // 新取号规则变更,见需求文档 (通知需求)

              // 新取号规则 id = id=#1+#2+#3+#4+#5+#6+#7+#8
              // #1 Q
              // #2 A
              // #3 年份(2位)
              // #4 检测项目代码号(2位) 原系统的直已经取到 itemCode
              // #5 同一检测项目检测报告序号 原系统
              // #6 科室代码 原系统的直已经取到 orgABC
              // #7 类别及流水号 见通知需求
              // #8 报告版次(1位) 永远是1

              // 2007-04-24 新取号 HuangCS
              let use =  JSON.parse(window.localStorage.getItem("userInfo"))
              if( use.region == 'gz'){

                  if(fromgz == 'GZ' || fromgz == '广州'){

                    if (inspectType) {
                      if(inspectType.length>=3){
                         inspectType = inspectType.substr(0,2)
                      }
                      id = inspectType + yearCode + itemCode;//+numbers+orgABC;
                    }
                  }else{
                    if (inspectType == 'KM') {
                      id = "KM" + yearCode + itemCode;//+numbers+orgABC;
                    }
                    else{
                      id = "QA" + yearCode + itemCode;//+numbers+orgABC;
                    }
                  }
                }
                if(use.region != 'gz'){
                    if (inspectType == 'KM') {
                      id = "KM" + yearCode + itemCode;//+numbers+orgABC;
                    }
                    else{
                      id = "QA" + yearCode + itemCode;//+numbers+orgABC;
                    }
                }
              //id = "QA" + yearCode + itemCode;// +numbers+orgABC;
              // 报告序号
              temp = itemNum;
              if (itemCode.length == 2) {
                if (temp > 9) {
                  if (temp >= 65) {
                    if (temp == 73 || temp == 79) {
                      temp = temp + 1;
                    }
                    that.reportObj[itemCode] = temp;
                    id = id + String.fromCharCode(temp);
                  } else {
                    if (temp == 10) {
                      id = id + "A";
                      that.reportObj[itemCode] = 65;
                    } else {
                      temp = 65 + temp - 10;
                      let scode = String.fromCharCode(temp)
                      id = id + scode;
                      that.reportObj[itemCode] = temp;
                    }

                  }
                } else {
                  id = id + temp;
                }
              }
              // 科室代码
              id = id + orgABC;

              // 类别及流水号 #7
              let m_sn1 = sn.substring(0, 1);
              let m_sn2 = sn.substring(1);
              let m_num;
              if (parseInt(yearCode) > 10) {
                m_num = m_sn1 + m_sn2;
              }// else

              id = id + m_num;
              // 报告版次
              if (itemCode.length == 2)
                id = id + "1";
              //2019年9月8日 如果检验项目的长度是3 也就是52F这种最后一位是报告的序号 而不是版次号
              else {

                id = id + String.fromCharCode(parseInt(temp));
              }
              if (inspectType == 'SJ' || inspectType == 'SZ' || inspectType == 'SR' || inspectType == 'SD' || inspectType == 'SL') {
                // id = 'C-058-' +id;
                id = '04901-' + id;
              }
              that.tableData[that.tableData.length - 1].itemsCode = id;

              // id2 = 'QA' + yearCode + itemCode;
              // if (!dojo.lang.isUndefined(itemCodeNum2.entry(itemCode))) {
              //   itemCodeNum2.add(itemCode, parseInt(itemCodeNum2.entry(itemCode)) + 1);
              //   id2 = id2 + itemCodeNum2.entry(itemCode);
              // } else {
              //   id2 = id2 + '1';
              //   itemCodeNum2.add(itemCode, 1);
              // }
            }
          })
        }// 判断有没有任务号
      },
      genAllItemsId() {
        var that = this;
        var saction = 0;
        if (this.tableData.length == 0) {
          return;
        }
        var taskId = this.taskCode;
        var id = '';
        var id2 = '';
        // initOrgsNum();
        var orgID = '';
        var itemNum = 0;
        var orgABC = '';
        this.tableData.forEach(function (item, idx, array) {
          if (item.isModify !== '2') {
            orgABC = item.itemsRoom;

            if ((",161,12,").indexOf("," + orgABC + ",") != -1) // 整车室分出来的KBU分配报告号时候用Q
            {
              orgABC = 13;
            }
            if ((",1161,1162,21,").indexOf("," + orgABC + ",") != -1) // 零部件分出来的YW分配报告号用L
            {
              orgABC = 20;
            }
            // that.orgList[orgABC] = that.orgList[orgABC] + 1;
            itemNum++;
          }
        })

        // 生成文档编号id和公告编号id2
        var itemCode = '';
        // var itemCodeNum = new dojo.collections.Dictionary();
        // var itemCodeNum2 = new dojo.collections.Dictionary();
        // var orgNum = new dojo.collections.Dictionary();
        // var m_inspectType_num = new dojo.collections.Dictionary();

        var numbers = (itemNum > 9) ? itemNum : '0' + itemNum;
        var item_Num = {} // 存储的是<项目序号，当前项目序号的编号>
        var temp = 0;
        var inspectType = this.inspectType;
        let fromgz = this.tinfo.ifrom;
        if (inspectType.length > 0) {
          var yearCode = taskId.substring(inspectType.length, inspectType.length + 2); // 年份两位数字
          // 16
          // 17
          var sn = taskId.substring(inspectType.length + 2); // 任务流水号
          // QA16A111
          // A111就是这个流水号
          var joinWord = (inspectType == 'QA') ? '' : '-';
          var orgABC = '';

          this.tableData.forEach(function (item, idx, array) {
            // if (item.isModify !== '2') {
            var repotCode = item.itemsCode;// 从上一个页面获取报告编号
            if (repotCode) {
              itemCode = item.itemsItemCode;
              ;

              if (item_Num[itemCode] !== null && item_Num[itemCode] !== undefined && item_Num[itemCode] !== '') {
                var temp1 = parseInt(item_Num[itemCode]);
                if (repotCode.substring(0, 5) == "04901") {
                  if (temp1 > parseInt(repotCode.substring(12, 13))) {
                    item_Num[itemCode] = parseInt(repotCode.substring(12, 13)) - 1;
                    // item_Num.add(itemCode, parseInt(repotCode.substring(12, 13)) - 1);
                  }
                } else {
                  if (temp1 > parseInt(repotCode.substring(6, 7))) {
                    item_Num[itemCode] = parseInt(repotCode.substring(6, 7)) - 1 + that.numberMap[itemCode] ? that.numberMap[itemCode] : 0;
                    // item_Num.add(itemCode, parseInt(repotCode.substring(6, 7)) - 1 + numberMap[itemCode] ? numberMap[itemCode] : 0);
                  } else {
                    if (item.isModify === '2') {
                      if (isNaN(parseInt(repotCode.substring(6, 7)))) {
                        item_Num[itemCode] = parseInt(repotCode.substring(6, 7).charCodeAt(0))
                      } else {
                        item_Num[itemCode] = parseInt(repotCode.substring(6, 7))
                      }
                    }
                  }
                }

              } else {
                if (repotCode.substring(0, 5) == "04901") {
                  item_Num[itemCode] = parseInt(repotCode.substring(12, 13)) - 1;
                  // item_Num.add(itemCode, parseInt(repotCode.substring(12, 13)) - 1);
                } else {
                  item_Num[itemCode] = parseInt(repotCode.substring(6, 7)) - 1 + that.numberMap[itemCode] ? that.numberMap[itemCode] : 0;
                  // item_Num.add(itemCode, parseInt(repotCode.substring(6, 7)) - 1 + numberMap[itemCode] ? numberMap[itemCode] : 0);
                }
              }

            }
            // }
          });
          this.reportObj = item_Num;
          this.tableData.forEach(function (item, idx, array) {
            if (item.isModify !== '2') {
              itemCode = item.itemsItemCode;
              orgID = item.itemsRoom;

              if (orgID == 161 || orgID == 12) {
                orgID = 13;
              }
              if (orgID == 1161 || orgID == 1162 || orgID == 21) {
                orgID = 20;
              }
              orgABC = that.orgList[orgID];

              if (orgABC) {

                // 新取号规则 id = id=#1+#2+#3+#4+#5+#6+#7+#8
                // #1 Q
                // #2 A
                // #3 年份(2位)
                // #4 检测项目代码号(2位) 原系统的直已经取到 itemCode
                // #5 同一检测项目检测报告序号 原系统
                // #6 科室代码 原系统的直已经取到 orgABC
                // #7 类别及流水号 见通知需求
                // #8 报告版次(1位) 永远是1
                let use =  JSON.parse(window.localStorage.getItem("userInfo"))

                if( use.region == 'gz'){

                  if(fromgz == 'GZ' || fromgz == '广州'){

                    if (inspectType) {

                      if(inspectType.length>=3){
                         inspectType = inspectType.substr(0,2)
                      }

                      id = inspectType + yearCode + itemCode;//+numbers+orgABC;
                    }
                  }else{
                    if (inspectType == 'KM') {

                      id = "KM" + yearCode + itemCode;//+numbers+orgABC;
                    }
                    else{

                      id = "QA" + yearCode + itemCode;//+numbers+orgABC;
                    }
                  }
                }
                if(use.region != 'gz'){
                    if (inspectType == 'KM') {

                      id = "KM" + yearCode + itemCode;//+numbers+orgABC;
                    }
                    else{
                      id = "QA" + yearCode + itemCode;//+numbers+orgABC;
                    }
                }
                //id = "QA" + yearCode + itemCode;// +numbers+orgABC;
                // 报告序号
                if (null !== item_Num[itemCode] && undefined !== item_Num[itemCode] && "" !== item_Num[itemCode]) {
                  if (itemCode.length == 3 && item_Num[itemCode] + "" == "NaN") {
                    item_Num[itemCode] = 65;
                    temp = 65;
                  } else {
                    item_Num[itemCode] = parseInt(item_Num[itemCode]) + 1
                    // item_Num.add(itemCode, parseInt(item_Num.entry(itemCode)) + 1);
                    temp = parseInt(item_Num[itemCode]);
                  }
                  // alert(itemCode+" "+temp);
                } else {
                  if (itemCode.length == 3)
                    temp = 65;
                  else
                    temp = 1;
                  item_Num[itemCode] = temp;
                  // item_Num.add(itemCode, temp);
                }
                if (itemCode.length == 2) {
                  if (temp > 9) {
                    if (temp >= 65) {
                      if (temp == 73 || temp == 79) {
                        temp = temp + 1;
                      }
                      item_Num[itemCode] = temp;
                      // item_Num.add(itemCode, temp);
                      id = id + String.fromCharCode(temp);
                    } else {
                      id = id + "A";
                      item_Num[itemCode] = 65;
                      // item_Num.add(itemCode, 65);
                    }
                  } else {
                    id = id + temp;// QA17H12
                  }
                }
                // 科室代码
                id = id + orgABC;// /QA17H12Q


                if (parseInt(yearCode) > 10) {

                }
                var m_sn1 = sn.substring(0, 1);// 7 流水号的第一位
                var m_sn2 = sn.substring(1);// 001 流水号的后三位
                var m_num;
                if (parseInt(yearCode) > 10) {
                  m_num = m_sn1 + m_sn2;
                }// if


                id = id + m_num;
                // 报告版次
                if (itemCode.length == 2)
                  id = id + "1";
                else {
                  id = id + String.fromCharCode(parseInt(temp));
                }

                if (inspectType == 'SJ' || inspectType == 'SZ' || inspectType == 'SR' || inspectType == 'SD' || inspectType == 'SL') {
                  // id = 'C-058-' +id;
                  id = '04901-' + id;
                }
                item.itemsCode = id;
                // $("#" + MakeTaskInfo.reportPrefix + idx).val(id);
                // id2 = 'QA' + yearCode + itemCode;
                // if (!dojo.lang.isUndefined(itemCodeNum2.entry(itemCode))) {
                //   itemCodeNum2.add(itemCode, parseInt(itemCodeNum2.entry(itemCode)) + 1);
                //   id2 = id2 + itemCodeNum2.entry(itemCode);
                // } else {
                //   id2 = id2 + '1';
                //   itemCodeNum2.add(itemCode, 1);
                // }

              }
            }
          })
        }// 判断有没有任务号
      },
      copyRow(row) {
        let data = JSON.parse(JSON.stringify(row));
        delete data.isModify;
        delete data.id;
        delete data.ids;
        data.itemsCode = '';
        // data.samplesManufacturers = this.infor.produceCompany;
        // data.samplesProperty = this.tinfo.sampleTrademark;
        // data.samplesSpecifications = this.tinfo.sampleType;
        this.tableData.push(data);
        this.genAllItemsId2(this.tableData[this.tableData.length - 1]);
        // this.genAllItemsId();
      },
      deleteRow(index, row) {
        this.tableData.splice(index, 1);
        this.genAllItemsId();
      },
      modifyColumn() {
        let copySelect = this.copySelect;
        let modifyInfo = this.modifyInfo;
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i][copySelect] = modifyInfo;
        }
        this.$forceUpdate();
      },
      changeColumn(value) {
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  .pull-right {
    text-align: right;
  }

  .el-button {
    width: 56px;
    height: 28px;
    border-radius: 2px;
    padding: 0;
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
  z-index: 2001;
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
