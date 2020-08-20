<template>
  <!-- 报告初校 - 查询内容 -->
  <section class="dislogBox" :style="{
    padding:myStyle ? '20px 20px 0 20px':'0',
  }">
    <div class="dislogBox_content" :style="{
      overflowY: myStyle ? 'visible':'auto'
    }">
      <div class="componentBoxs">
        <!-- 一级头部 -->
        <ul class="cB_listTitle">
          <li class="tasknumber">任务号</li>
          <li class="inspected">受检单位</li>
          <li class="sample">样品名称</li>
          <li class="specification">规格型号</li>
          <li class="trademark">商标</li>
          <li class="operation">操作</li>
        </ul>
        <!-- 一级列表 -->
        <div class="Interone" ref="interone" v-show="dataList.length==0?false:true">
          <!-- 一级列表 -->
          <div class="cB_assembly" v-for="(item,index) in dataList" :key="index">
            <ul class="cB_listcenter">
              <li class="tasknumber" :style="flowColor(item.flowStatus)">{{item.tasknumber}}</li>
              <li class="inspected" :title="item.inspected">{{item.inspected}}</li>
              <li class="sample">{{item.sample}}</li>
              <li class="specification">{{item.specification}}</li>
              <li class="trademark">{{item.trademark}}</li>
              <li class="operation">
                <span class="spanclass" @click="browse(item)">浏览</span>
                <i>&nbsp;</i>
                <span class="spanclass" @click="taskDetail(item)">详细</span>
                <!-- <button class="primary">方案</button> -->
              </li>
            </ul>
            <div class="oneFirstFloor" id="oneFirstFloor" v-if="item.ckenck == true">
              <!-- 二级功能区 -->
              <div class="buttons">
                <el-button type="primary" plain @click="gotoNext">提交</el-button>
                <el-button type="danger" plain @click="regression">回退</el-button>
                <!-- <button class="danger" @click="gotoNext">提交</button>
                <button class="primary" @click="regression">回退</button> -->

              </div>
              <div class="pot">
                <div class="el-loading-mask" v-if="falgtow">
                  <div class="el-loading-spinner">
                    <svg viewBox="25 25 50 50" class="circular">
                      <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                    </svg>
                  </div>
                </div>
                <!-- 二级头部 -->
                <ul class="cB_listTitle">
                  <li class="tasknumber2">
                    <el-checkbox v-model="checkAll" ref="mychenga" class="checkboxleft"
                                 @change="handleCheckAllChange"></el-checkbox>
                  </li>
                  <li class="inspected2">序号</li>
                  <li class="sample2">报告编号</li>
                  <li class="specification2">项目名称</li>
                  <li class="trademark2">主检人</li>
                  <li class="operation2">操作</li>
                </ul>
                <!-- 二级列表 -->
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" class="bordeLine">
                  <div class="cB_theCirculation" v-for="(item) in dataListTwo" :key="item.id">
                    <ul class="onecB_listcenter" :style="flowColor(item.flowStatus)">
                      <li class="tasknumber2">
                        <el-checkbox v-model=item.checked :label="item" @change="inspectids(item)"
                                     class="checkboxleft"></el-checkbox>
                      </li>
                      <li class="inspected2">{{item.serialNumber}}</li>
                      <li class="sample2">{{item.sample}}</li>
                      <li class="specification2" :title=item.specification>{{item.specification}}</li>
                      <li class="trademark2">{{item.trademark}}</li>
                      <li class="operation2">
                        <span class="spanclass" @click="circulation(item)">流转</span>
                        <i>&nbsp;</i>
                        <span class="spanclass" @click="look(item)">查看</span>
                        <!-- @click="goUpload(item)" -->
                      </li>
                    </ul>
                    <!-- 三级列表 -->
                    <div class="twoFirstFloor" v-if="item.ckenck == true">
                      <div class="el-loading-mask" v-if="falgthree">
                        <div class="el-loading-spinner">
                          <svg viewBox="25 25 50 50" class="circular">
                            <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                          </svg>
                        </div>
                      </div>
                      <ul class="cB_listTitle">
                        <li class="tasknumber">序号</li>
                        <li class="sample">节点名称</li>
                        <li class="trademark">开始时间</li>
                        <li class="operation">结束时间</li>
                        <li class="specification">负责人</li>
                        <li class="inspected">处理意见</li>
                      </ul>
                      <ul class="onecB_listcenter" v-for="(item,index) in dataListThree" :key="index">
                        <li class="tasknumber">{{item.flowtid}}</li>
                        <li class="sample" :style="flowColorThree(item.reason)">{{item.sample}}</li>
                        <li class="trademark">{{item.trademark}}</li>
                        <li class="operation">{{item.trademarktwo}}</li>
                        <li class="specification">{{item.specification}}</li>
                        <li class="inspected">{{item.reason}}</li>
                      </ul>
                    </div>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
        <!-- 暂无数据 -->
        <div v-show="dataList.length==0?true:false"
             style="line-height:60px;text-align: center;border: 1px solid #EBEEF5;border-top:none;">
          <span style="color: #909399 !important;">暂无数据</span>
        </div>
      </div>
      <!-- 分页器 -->
      <div :class="{'lxt_block':myStyles==false}" :style="{
        paddingTop: myStyle ? '10px' : '0'
      }">
        <el-pagination v-if="myStyles==false"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[10,20,30]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total=total>
        </el-pagination>
        <el-pagination v-if="myStyles==true"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[5,7,11]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total=total>
        </el-pagination>
      </div>
    </div>

    <el-dialog title="回退" :visible.sync="dialogTableVisible" :before-close='closedialog'>
      <div class="regseep">
        <b class="on">选择节点</b>
        <el-select v-model="regvalue" placeholder="请选择">
          <el-option
            v-for="item in reg"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="regseep">
        <b>回退原因</b>
        <el-input class="textareawidth"
                  type="textarea"
                  :rows="5"
                  maxlength="200"
                  show-word-limit
                  placeholder="请输入内容"
                  v-model="textarea">
        </el-input>
      </div>
      <div class="regBtn">
        <el-button type="primary" @click="regBtnok">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="查看"
      :visible.sync="dialogFormVisible2"
      v-if="dialogFormVisible2"
      v-bind="{
          modal: false,
          width:'99.9%',
          top:'0',
        }"
      :custom-class="'taskDetail_dialog1'"
    >
      <!-- 任务下达模块引入 -->
      <taskDetail
        ref="taskDetail"
        saveType="3"
        :other-taskinfor="mlyTaskinfor"
      />
    </el-dialog>
    <!--下载word-pdf-查看调用对象-->
    <object id="WO3Word2" classid="clsid:561C5A99-71C8-48d4-A3E2-16FC4F9880BF"
            width="0" height="0" style="visibility:hidden;">
    </object>

  </section>
</template>
<script>
  // import taskDetail from '@/views/entrust/componentsview/Entrustlist.vue'
  import taskDetail from '@/views/taskdelegation/componentstask/acceptance.vue'
  import base from "@/api/base.js"

  export default {
    name: 'survetable',
    data() {
      return {
        dataList: [],  //一级列表展示
        dataListTwo: [],  //二级列表展示
        //checked:false,//二级全选按钮 中的一个
        dataListThree: [],   //三级列表展示
        currentPage: 1, // 当前页数  分页
        pageSize: 2,   //每页显示条数 分页
        total: 0,  // 总条数
        //xqoptionBox:[],//存公章的循环数组 下拉框
        //xqoptions: [],
        inBox: [],//存二级列表的选中id和存公章的循环数组的值 下拉框
        xqidBox: [], //存二级选中得数据id
        xqvalueBox: [], //存公章的循环数组的值 下拉框
        checkAll: false, //二级全选按钮
        valTwomun: '',// 二级列队当前选中的id
        checkedCities: [],
        cityOptions: [],
        dialogFormVisible: false, //上传
        upitmeid: '',
        dialogTableVisible: false, // 回退弹出
        reg: [],// 回退弹出  选择节点列队
        regvalue: '',//回退弹出  选择节点选择的节点
        textarea: '',//回退弹出  回退原因
        itemValues: [], //存储选中的报告的id
        tofinish: 0,  //  提交下一步  直接完成
        statusbox: [],//存储回退的数据
        dialogTableVisible2: false, // 提交下一步中出现回退信息的弹框
        textarea2: '',//提交下一步中出现回退信息的弹框的内容
        uidName: '', // 获取登陆者id
        deptid: '', // 获取科室id
        towCurItem: '', // 存储点击二级列表当前项
        threeCurItem: '', // 存储点击三级列表当前项
        dialogFormVisible2: false, // 弹出层的配置
        myStyles: this.myStyle,//分页样式选择
        falgtow: false,// 查询动画 二级
        falgthree: false,// 查询动画 三级
        //
        mlyTaskinfor:null,
      }
    },
    methods: {
      taskDetail(item) {
        this.dialogFormVisible2 = true;
        this.mlyTaskinfor = {
          'otherFrom': 'other2',
          'params': {
            taskid: item.mid,
            searchdate: this.queryTypeChild.searchdate,
            processInstanceId: this.queryTypeChild.process_instance_id
          }
        }
        // this.$api.lxtinitial.detailed
      },
      flowColor(vlau) {  // 一级 二级 判断回退 和提交 单元格的颜色
        if (vlau == 1) {
          return {
            background: 'pink'
          }
        } else if (vlau == 2) {
          return {
            background: 'yellow'
          }
        } else if (vlau == undefined) {
          return {
            background: ''
          }
        } else {
          return {
            background: ''
          }
        }
      },
      flowColorThree(vlau) { // 三级 判断颜色
        if (vlau == null) {
          return {
            color: ''
          }
        }
        if (vlau.length > 0) {
          return {
            color: 'red'
          }
        } else {
          return {
            color: ''
          }
        }
      },
      dataListData() {//一级列表展示数据
        this.dataList = [];
        if (this.querydataChild.length == 0) {
          if (this.currentPage == 1) {
            this.currentPage = 1; // 当前页数分页
            this.mypagesize ? this.pageSize = this.mypagesize : this.pageSize = 10; //每页显示条数分页
            this.total = 0;  // 总条数
          } else {
            this.currentPage = this.currentPage - 1;
            this.$emit('cpage', this.currentPage);
            this.translate();
            this.$parent.queryselect();
          }
        } else {
          this.currentPage = this.querydataChild[0].currentPage; // 当前页数分页
          this.mypagesize ? this.pageSize = this.mypagesize : this.pageSize = this.querydataChild[0].pageSize; //每页显示条数分页
          this.total = this.querydataChild[0].total;  // 总条数
        }
        this.querydataChild.forEach(item => {
          let obj = {
            ckenck: false,
            tasknumber: item.taskCode,  //任务号
            inspected: item.companyCheck,//受检单位
            sample: item.sampleName,//样品名称
            specification: item.sampleType,//规格型号
            trademark: item.sampleTrademark, //商标
            mid: item.id,//id
            flowStatus: item.flowStatus //根据返回的值选颜色
          }
          this.dataList.push(obj)
        });
        console.log(this.dataList)
      },
      translate() { // 隔行换色
        let oInterone = this.$refs.interone
        let list = oInterone.children;
        for (let i = 0; i < list.length; i++) {
          if (i % 2) {
            let _ul = list[i].children[0];
            _ul.style.background = "#FAFAFA"
          }
          list[i].onmousemove = function () {
            let _ul = this.children[0];
            _ul.style.background = "#f5f7fb"
          };
          list[i].onmouseout = function () {
            let _ul = this.children[0];
            if (i % 2) {
              _ul.style.background = "#FAFAFA"
            } else {
              _ul.style.background = ""
            }
          };
        }
      },
      browse(item) { //二级显示隐藏
        this.checkAll = false;
        this.towCurItem = item
        if (item.ckenck == true) {
          item.ckenck = false;
          this.dataListTwo = [];
          this.dataListThree = [];
        } else {
          this.dataList.forEach((item, index) => {
            item.ckenck = false;
          });
          item.ckenck = true;
          this.towListFn()
        }
      },
      towListFn() {
        let item = this.towCurItem
        this.valTwomun = item
        this.inBox = [];
        this.checkedCities = [];
        this.itemValues = [];
        const data = {
          "companyCheck": this.queryTypeChild.companyCheck,   //受检单位
          "process_instance_id": this.queryTypeChild.process_instance_id,  //报告类型，进度实例id 2-任务分配 3-报告检测 4-校验报告 5-报告审核 6-报告批准 7-报告归档 8-初次校对
          "sampleName": this.queryTypeChild.sampleName,  //样品名称
          "sampleType": this.queryTypeChild.sampleType,      //规格型号
          "searchdate": this.queryTypeChild.searchdate,    //查询年月
          "searchdate2": this.queryTypeChild.searchdate2,   //下达日期
          "taskCode": item.tasknumber,   //任务号
          "wttype": this.queryTypeChild.wttype   //检验类型编码
        };
        this.falgtow = true
        //二级列表展示数据
        this.$api.lxtinitial.getwomuntow(this.valTwomun.mid, data).then(res => {
          this.falgtow = false
          let data = res.data.data.list;
          // console.log(data)
          if (data.length == 0) {
            this.$parent.queryselect();  //获取父级的方法
          } else {
            let arr = [];
            data.forEach((item, index) => {
              let content;
              if (item.cvItemsCode != null && item.cvItemsCode.length == 10) {
                content = item.cvItemsCode + "(" + item.itemsCode + ")";
              } else {
                content = item.itemsCode;
              }
              let obj = {
                id: item.id,
                checked: false,
                ckenck: false,
                clist: item.clist,
                serialNumber: index + 1,
                sample: content,
                specification: item.itemsName,
                trademark: item.master,
                selvalue: "",
                flowStatus: item.flowStatus, // 上色
              }
              arr.push(obj)
            });

            this.dataListTwo = arr
            this.cityOptions = arr
          }
        }).catch(res => {
          this.falgtow = false
          this.$alert(res.data.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      circulation(item) {//三级显示隐藏
        this.threeCurItem = item;
        if (item.ckenck == true) {
          item.ckenck = false;
          this.dataListThree = [];
        } else {
          this.dataListTwo.forEach((item, index) => {
            item.ckenck = false;
          });
          item.ckenck = true;
          this.threeListFn()
        }
      },
      threeListFn() {
        let item = this.threeCurItem;
        const data = {
          "id": item.id
        }
        this.falgthree = true;
        this.$api.lxtinitial.getwomunthree(data).then(res => {
          this.falgthree = false;
          let data = res.data.data.list;
          let arr = [];
          data.forEach((item, index) => {
            let obj = {
              flowtid: index + 1, //序号
              sample: item.flowname,//节点名称
              checked: false,//负责人
              specification: item.name,//负责人
              trademark: item.create_date, //开始时间
              trademarktwo: item.end_date, //结束时间
              reason: item.reason, // 判断颜色
            }
            arr.push(obj);
          });
          this.dataListThree = arr
        }).catch(res => {
          this.falgthree = false;
          this.$alert(res.data.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      handleSizeChange(val) {
        this.pageSize = val  // 每页展示的条数
        this.$emit('displayed', val);
        this.$nextTick(res => {
          this.translate();
          this.$parent.queryselect();
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val // 当前展示的第几页
        this.$emit('cpage', val);
        this.$nextTick(res => {
          this.translate();
          this.$parent.queryselect();
        })
      },
      handleCheckAllChange(val) {  //全选
        let arrTowList = this.dataListTwo;
        if (val) {
          this.checkedCities = val ? this.cityOptions : [];
          const arr = [];
          this.itemValues = [];
          arrTowList.forEach((item, index) => {
            item.checked = true;
            this.itemValues.push(item.id)
            let obj = {"id": item.id, "value": item.selvalue};
            arr.push(obj)
          });
          this.inBox = arr; //重新赋值
        } else {
          this.checkedCities = val ? this.cityOptions : [];
          arrTowList.forEach((item, index) => {
            item.checked = false;
          });
          this.inBox = []; //重新赋值
          this.itemValues = [];
        }
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length / 2;
        this.checkAll = checkedCount === this.dataListTwo.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataListTwo.length;

      },
      inspectids(item) { //统计所有选中数据
        if (item.checked == false) {
          this.itemValues.push(item.id)
          this.inBox.push({id: item.id, value: item.selvalue})
          this.checkedCities.push(item)
          item.checked = true;
        } else {
          item.checked = false;
          let filters = this.inBox.filter((val, i) => {
            return val.id != item.id;
          })
          this.inBox = filters;
          let filterstwo = this.checkedCities.filter((val, i) => {
            return val.id != item.id;
          })
          this.checkedCities = filterstwo;
          let filtersthree = this.itemValues.filter((val, i) => {
            return val != item.id;
          })
          this.itemValues = filtersthree;
        }
      },
      gotoNext() { //提交下一步
        if (this.inBox.length == 0) {
          this.$alert("请先选择报告", '信息提示', {
            dangerouslyUseHTMLString: true
          });
          return;
        }
        let munarr = '';
        let _munarr = '';
        this.xqidBox = [];

        this.inBox.forEach(copyitem => {
          this.xqidBox.push(copyitem.id);
        });
        _munarr = [...new Set(this.xqidBox)]
        munarr = _munarr.join(","); //检验项目id,多个‘,’分割
        const data = {
          "batchflag": "0",   //0提交下一步，2 是从检验报告状态提交到无发票号码，3 是从检验报告状态提交到无整改证明
          "inspectids": munarr,    //检验项目id,多个‘,’分割
          "processinstance": this.queryTypeChild.process_instance_id,  //进度实例id 2-任务分配 3-报告检测 4-校验报告 5-报告审核 6-报告批准 7-报告归档 8-初次校对
          "toFinish": "0",    //完成情况 0未完成 1直接完成
          "searchdate": this.queryTypeChild.searchdate,  //查询日期
        };
        this.$confirm('您确定要提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$api.lxtinitial.gotonext(data).then(res => {
            this.inBox = [];
            let data = res.data
            if (data.respCode == 0) {
              this.$alert('提交成功', '信息提示', {
                dangerouslyUseHTMLString: true
              });
              this.towListFn()
              this.itemValues = [];
            }
          }).catch(res => {
            let data = res.data;
            this.$alert(data.message, '信息提示', {
              dangerouslyUseHTMLString: true
            });
            //this.itemValues = [];
            this.xqidBox = []
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
            duration: 1500
          });
          this.textarea = '';
        });
      },
      regression() { //回退按钮  弹出

        if (this.itemValues.length > 0) {
          this.dialogTableVisible = true;
          this.reg = [];
          let processinstance = this.queryTypeChild.process_instance_id;
          this.$api.lxtinitial.flow(processinstance).then(res => {  //  回退节点
            let data = res.data.data;
            data.forEach((item, index) => {
              let obj = {value: item.id, label: item.name};
              this.reg.push(obj)
            });
            this.regvalue = this.reg[0].label
          }).catch(res => {
            this.$alert(res.data.message, '信息提示', {
              dangerouslyUseHTMLString: true
            });
          })
        } else {
          this.$alert('请选择要回退的信息', '信息提示', {
            dangerouslyUseHTMLString: true
          });
        }
      },
      regBtnok() {//弹出 您确定要回退吗
        if (this.regvalue == this.reg[0].label) {
          this.regvalue = this.reg[0].value
        }
        if (this.textarea.trim() == "") {
          this.$alert('请选择要描述的信息', '信息提示', {
            dangerouslyUseHTMLString: true
          });
          return;
        }
        let beStr = '';
        let ivSet = [...new Set(this.itemValues)]
        beStr = ivSet.join(",");
        const data = {
          "backprocessinstance": this.regvalue,   //要回退进度实例id 2-任务分配 3-报告检测 4-校验报告 5-报告审核 6-报告批准 7-报告归档 8-初次校对
          "inspectids": beStr,  //检测项目id
          "processinstance": this.queryTypeChild.process_instance_id,  //当前的进度示例id 2-任务分配 3-报告检测 4-校验报告 5-报告审核 6-报告批准 7-报告归档 8-初次校对
          "reason": this.textarea,  //回退原因
          "searchdate": this.queryTypeChild.searchdate  //搜查年月
        };
        this.$confirm('您确定要回退吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          //let id = _this.upitmeid;
          this.dialogTableVisible = false;
          this.$api.lxtinitial.goBack(data).then(res => {
            if (res.data.respCode == 0) {
              this.$message({
                type: 'success',
                message: '回退成功!',
                duration: 2500
              });

              this.towListFn();
              this.itemValues = [];
              this.textarea = '';
              this.regvalue = '';
              /*
              * 功能: 在主页调用此模块时候,触发主页的搜索并且重新渲染
              * */
              if (this.myStyle) {
                this.$EventBus.$emit('Search_Again');
              }
            }
          }).catch(res => {
            this.$message({
              type: 'error',
              message: res.data.message,
              duration: 1500
            });
            this.textarea = '';
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
            duration: 1500
          });
          this.textarea = '';
        });
      },
      getUid() { //获取登陆者id
        this.$api.lxtinitial.uid().then(res => {
          this.uidName = res.data.data.loginName
        }).catch(res => {
          this.$alert(res.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      getdeptid() { //获取科室id
        this.$api.lxtinitial.uid().then(res => {

          this.deptid = res.data.data.departmentid
        }).catch(res => {
          this.$alert(res.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      closedialog() {
        this.textarea = '';
        this.dialogTableVisible = false
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      look(item) {  //查看报告
        const row = {
          id: item.id,
          process_instance_id: this.queryTypeChild.process_instance_id,
          taskid: item.sample
        }
        this.clickOpenReport(row)
      },
      clickOpenReport(row) { // 查看-打开报告
        let params = {
          instanceId: row.id,
          provessinstanceId: row.process_instance_id,
          taskId: row.taskid
        }
        if (row.process_instance_id == "5" || row.process_instance_id == "6") {
          this.$api.taskmanage.apiGoOpenWordForTask(params).then(res => {
            if (!res.data.data) {
              this.goOpenWord(row.id, row.itemsCode, row.process_instance_id);
            } else {
              this.$message.error(res.data.data);
            }
          })
        } else {
          this.goOpenWord(row.id, row.itemsCode, row.process_instance_id);
        }
      },
      goOpenWord(instanceID, report_no, process) {
        let loginName = this.uidName;
        let obj = document.getElementById("WO3Word2");
        if (loginName) {
          this.$api.surveyissue.apiSetSession(instanceID).then(res => {
            if (res.data.data == "1") {
              try {
                obj.setUid(loginName);
                obj.setFileId(instanceID);
                obj.setReportNo(report_no);
                obj.setProcess(process);

                obj.setRemoteIp(base.baseImgTable);
                obj.ActiveStart();
              } catch (error) {
                if (confirm("您确认没有安装Word控件吗? 点确定您将下载setup.zip 解压后运行setup.exe即可")) {
                  window.open(base.baseImgTable + "/api/file/resources/donet/setup.zip");
                }
              }
            } else if (res.data.data == "2") {
              this.$message.error('该小批量报告 已经被打开，或打开没有正常关闭');
            } else {
              this.$message.error('已经超时，请重新登录');
            }
          }).catch(error => {
            this.$message.error(error);
          });
        }
      },
      myWindow(parentSel,parentQuery){
        let oHeaderHeight = 95;
        let oBody = document.documentElement.scrollHeight || document.body.scrollHeight
        let oDisLogBox = document.querySelector('.dislogBox');
        let oLxtBlock = document.querySelector('.lxt_block');
        oDisLogBox.style.height = oBody-oHeaderHeight - parentSel - parentQuery - oLxtBlock.offsetHeight  + 'px'
        oLxtBlock.style.width = "98%"
        oLxtBlock.style.position = "fixed";
        oLxtBlock.style.left = '1%';
        oLxtBlock.style.bottom = 15 + 'px'
      }
    },
    watch: {
      querydataChild() {
        this.dataListData()
        this.$nextTick(res => {
          this.translate();
        })
      },
      pageSize() {
        this.$nextTick(res => {
          this.translate();
        })
      },
      uidName(name) {
        this.uidName = name
      }
    },
    props: [
      'querydataChild', 'queryTypeChild', 'mypagesize', 'myStyle'
    ],
    mounted() {
      this.getUid();
      //this.getdeptid();
      if(!this.myStyle){
        this.myWindow();
      }
      window.onresize = () => {
        if(!this.myStyle){
          console.log('21');
          this.myWindow();
        }
      }
    },
    components: {
      taskDetail
    }
  }
</script>
<style lang="scss" scoped>

  /* 自定义表格列with */
  .tasknumber {
    width: 10%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .inspected {
    width: 15%;
    padding-right: 1%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sample {
    width: 15%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .specification {
    width: 25%;
    padding-right: 1%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trademark {
    width: 15%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .operation {
    width: 20%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 自定义表格列with */

  /* 二级弹出表格样式 */
  .tasknumber2 {
    width: 4%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .inspected2 {
    width: 5%;
    padding-right: 1%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sample2 {
    width: 18%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .specification2 {
    width: 28%;
    padding-right: 1%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trademark2 {
    width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .operation2 {
    width: 20%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 二级弹出表格样式 */

  /* 按钮公共样式 */
  button {
    width: auto;
    padding: .6vw;
    margin: 0;
    font-size: 14px;
    display: inline-block;
   
    cursor: pointer;
    border-radius: 4px;
    border: none;
    -webkit-box-direction: normal;
  }

  button:hover {
    filter: alpha(opacity=90);
    opacity: 0.9;
  }

  /* 按钮公共样式 */

  /* 自定义按钮颜色 */
  .info {
    color: #FFF;
    background-color: #909399;
    border-color: #909399;
  }

  .success {
    color: #FFF;
    background-color: #67C23A;
    border-color: #67C23A;
  }

  .primary {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
  }

  .warning {
    color: #FFF;
    background-color: #E6A23C;
    border-color: #E6A23C;
  }

  .danger {
    color: #FFF;
    background-color: #F56C6C;
    border-color: #F56C6C;
  }

  /* 自定义按钮颜色 */

  .dislogBox{
    display: flex;

    .dislogBox_content{
      flex:1;
      -webkit-box-flex: 1;
      /*flex-direction: column;*/
      overflow-y: auto;
      height: calc(100% - 50px);
    }
  }

  .componentBoxs {
    width: 100%;
    /*flex:1;*/
    /*margin-bottom: 8vh;*/
    /*overflow: auto;*/
  }

  .Interone{
    border-left:1px solid #EBEEF5;
    border-right:1px solid #EBEEF5;
    border-bottom:1px solid #EBEEF5;
  }

  .cB_listTitle {
    width: 100%;
    background-color: rgb(243, 246, 253);
    height: auto;
    display: flex;
    border-top: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    margin-bottom: 0;
  }

  .cB_listTitle li {
    line-height: 3vw;
    box-sizing: border-box;
    border-right: 1px solid #EBEEF5;
    list-style: none;
    text-align: center;
    color: #909399;
  }

  .cB_assembly {
    width: 100%;
    height: auto;
  }

  .cB_listcenter {
    width: 100%;
    height: auto;
    display: flex;
    border-bottom: 1px solid #EBEEF5;
    border-top: 1px solid #EBEEF5;
  }

  .cB_listcenter li {
    line-height: 3vw;
    box-sizing: border-box;
    border-right: 1px solid #EBEEF5;
    list-style: none;
    text-align: center;
    color: #909399;
  }

  .cB_listcenter li:last-child {
    border-right: none
  }

  .cB_listcenter li button {
    text-indent: 0;
  }

  .buttons {
    text-align: left;
    padding-bottom: .8vw;
    padding-top: .8vw;
    padding-left: .5vw;
    border-top: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;

    .is-plain {
      min-width: 68px;
    }
  }

  /* 第一次弹出 */
  .oneFirstFloor {
    width: 95%;
    clear: both;
    margin: 1vw auto;
  }

  .onecB_listcenter {
    width: 100%;
    height: auto;
    display: flex;
    border: 1px solid #EBEEF5;
  }

  .onecB_listcenter li {
    line-height: 3vw;
    box-sizing: border-box;
    border-right: 1px solid #EBEEF5;
    list-style: none;
    text-align: center;
    color: #909399;
  }

  .onecB_listcenter li:last-child {
    border-right: none
  }

  .onecB_listcenter li button {
    text-indent: 0;
  }

  /* 第二次弹出 */
  .twoFirstFloor {
    width: 90%;
    clear: both;
    margin: 1vw auto;
    position: relative;
  }

  /* 上传样式 */
  .uptest {
    width: 100%;
    height: auto;
    margin-bottom: 1vw
  }

  .upsize {
    width: 100%;
    height: auto;
    margin-bottom: 1vw
  }

  .regseep {
    margin-bottom: 20px;
    display: flex;
  }

  .regseep b {
    margin-right: 5px;
    margin-top: 5px;
    font-weight: normal
  }

  .regseep b.on {
    margin-top: 10px;
  }

  .textareawidth {
    width: 90%;
  }

  .textareawidth2 {
    width: 70%;
  }

  .regBtn {
    text-align: right;
  }

  .regBtn2 {
    text-align: right;
    width: 90%;
  }

  /* 分页样式 */
  .lxt_block {
    height: 50px;
    width: 100%;
    background: #fff;
    display: flex
  }

  .lxt_block .el-pagination {
    height: 50px;
    display: flex;
    align-items: center;
  }

  .lxt_block .el-pagination .el-pager {
    display: flex;
    align-items: center;
  }

  .incolde {
    width: 45%;
    text-indent: 0;
  }

  .spanclass {
    color: rgb(50, 175, 240);
    cursor: pointer
  }


  .operation i {
    font-style: normal;
    color: rgb(50, 175, 240);
  }

  .operation2 i {
    font-style: normal;
    color: rgb(50, 175, 240);
  }

  .selwidth {
    width: 10vw;
  }

  .checkboxleft {
    position: relative;
    left: 0;
  }

  .bordeLine {
    border: 1px solid #EBEEF5;
    border-top: none;
  }

  .pot {
    position: relative;
  }

  /deep/ .el-loading-spinner {
    width: 100%;
    margin-top: -21px;
    text-align: center;

  }

  /* 处理ie11下字号太小问题 */
  @media screen and (min-width: 0 \0
  ) {
    button {
      font-size: 14px;
    }
  }

  /deep/ #oneFirstFloor .el-checkbox-group .cB_theCirculation .onecB_listcenter .tasknumber2 .el-checkbox .el-checkbox__label {
    display: none
  }
  /deep/ .taskDetail_dialog1 {
    min-height: 100% !important;
    margin: 0 auto !important;
  }
</style>


