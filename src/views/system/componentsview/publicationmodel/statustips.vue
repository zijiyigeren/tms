<template>
  <section class="lxt_bgcolor class_statusTips">
    <div class="lxt_status" ref="box">
      <div class="lxt_statusModel" style="display: block">

        <div class="lxt_statusModelTitle">
          <span class="lxt_params">设备标定提醒
            <!--<em v-if="task_notification.length!=0">( {{task_notification.length | maxNumber}} )</em>--></span>
          <!-- <a href="javascript:;" class="lxt_more" @click="">更多</a> -->
          <el-button type="text">
            更多
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>

        <div class="lxt_xmcTitle">
          <p><span>设备编号</span><span>设备名称</span><span>标定日期</span></p>
        </div>

        <div class="lxt_statusModelcontent">
          <ul v-if="false">
            <li v-for="(item,index) in overdue_dataList.slice(0,5)" :key="index">
              <span>{{item.taskCode}}</span>
              <span>{{item.finishDate}}</span>
              <span style="overflow: hidden;white-space: nowrap;"
                    :title="item.companyCheck">{{item.companyCheck}}</span>
            </li>
          </ul>
          <ul v-else>
            <li class="li_item_nodate">暂无数据</li>
          </ul>
        </div>

      </div>

      <div class="lxt_statusModel" style="display: block">

        <div class="lxt_statusModelTitle">
          <span class="lxt_params">车辆到达通知
            <em v-if="vehicle_arrival_dataList.length != 0">( {{vehicle_arrival_dataList.length | maxNumber}} )</em>
          </span>
          <ul class="lxt_stlist" style="margin: 0">
            <el-input
              style="max-width:170px;" class="lxt_stlist-input1"
              name="clearInputValue"
              autocomplete="off" placeholder="VIN码"
              size="mini"
              v-model="vin_value" clearable
            >
              <template slot="append">
                <i class="el-icon-search"
                   @click="findCarLoadByVin({
                      vin: vin_value
                   })"
                ></i>
              </template>
            </el-input>
          </ul>
          <!-- <a href="javascript:;" class="lxt_more" @click="more('kb.vehicleArrive')">更多</a> -->
          <el-button type="text" @click="more('kb.vehicleArrive')">
            更多
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>

        <div class="lxt_xmcTitle">
          <p><span>VIN</span><span>摩托车型号</span><span>入库时间</span></p>
        </div>

        <div class="lxt_statusModelcontent">
          <ul v-if="vehicle_arrival_dataList.length != 0">
            <li v-for="(item,index) in vehicle_arrival_dataList.slice(0,5)" :key="index"
                style="display: flex;cursor: default;"
            >
              <span
                class="code_class3"
                :title="item.vin"
              >{{item.vin}}
              </span>
              <span
                style="flex: 1;overflow: hidden;text-overflow: ellipsis;"
                :title="item.model"
              >{{item.model}}
              </span>
              <span
                style="flex: 1;overflow: hidden;text-overflow: ellipsis;"
                :title="item.comeDate"
              >{{item.comeDate}}</span>
            </li>
          </ul>
          <ul v-else>
            <li class="li_item_nodate">暂无数据</li>
          </ul>
        </div>

      </div>

      <div class="lxt_statusModel" style="display: block">

        <div class="lxt_statusModelTitle">
          <span class="lxt_params">零部件到达通知
            <em v-if="parts_arrival_dataList.length != 0">( {{parts_arrival_dataList.length | maxNumber}} )</em>
          </span>
          <ul class="lxt_stlist" style="margin: 0">
            <el-input
              style="max-width:170px;" class="lxt_stlist-input1"
              name="clearInputValue"
              autocomplete="off" placeholder="公司名称/产品名称/入库时间"
              size="mini"
              v-model="LBJ_value" clearable
            >
              <template slot="append">
                <i class="el-icon-search"
                   @click="findComponentPartByCondition({
                              condition: LBJ_value,
                           })"
                ></i>
              </template>
            </el-input>
          </ul>
          <!-- <a href="javascript:;" class="lxt_more" @click="more('kb.partsArrive')">更多</a> -->
          <el-button type="text" @click="more('kb.partsArrive')">
            更多
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>

        <div class="lxt_xmcTitle">
          <p><span>公司名称</span><span>产品名称</span><span>入库时间</span></p>
        </div>

        <div class="lxt_statusModelcontent">
          <ul v-if="parts_arrival_dataList.length != 0">
            <li v-for="(item,index) in parts_arrival_dataList.slice(0,5)" :key="index">
              <span class="code_class3">{{item.comeCompany}}</span>
              <span>{{item.sampleName}}</span>
              <span style="overflow: hidden;white-space: nowrap;"
                    :title="item.comeDate">{{item.comeDate}}</span>
            </li>
          </ul>
          <ul v-else>
            <li class="li_item_nodate">暂无数据</li>
          </ul>
        </div>

      </div>

      <div :style="{display:this.KbRole.includes('kb.questnotice') ? 'block' : 'none'}"
           class="lxt_statusModel">
        <div class="lxt_statusModelTitle">
          <span class="lxt_params">任务通知 <em v-if="task_notification.length!=0">( {{task_notification.length | maxNumber}} )</em></span>
          <ul class="lxt_stlist">
            <li @click="unfinished" :class="{'on': falg == true}">超期 <em v-if="overdue_dataList.length!=0">(
              {{overdue_dataList.length | maxNumber}} )</em></li>
            <li @click="overdue" :class="{'on': falg == false}">未完成 <em v-if="unfinished_dataList.length!=0">(
              {{unfinished_dataList.length | maxNumber}} )</em></li>
          </ul>
          <!-- <a href="javascript:;" class="lxt_more" @click="more('kb.questnotice')">更多</a> -->
          <el-button type="text" @click="more('kb.questnotice')">
            更多
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
        <div class="lxt_xmcTitle">
          <p><span>任务号</span><span>商定完成时间</span><span>受检单位</span></p>
        </div>
        <div v-if="falg" class="lxt_statusModelcontent">
          <ul v-if="overdue_dataList.length != 0">
            <li v-for="(item,index) in overdue_dataList.slice(0,5)" :key="index">
              <span class="code_class1" @click="taskDetail({
                taskid:item.id,
                searchdate:item.partitiondate,
                processInstanceId:3
              })">{{item.taskCode}}</span>
              <span>{{item.finishDate}}</span>
              <span style="overflow: hidden;white-space: nowrap;"
                    :title="item.companyCheck">{{item.companyCheck}}</span>
            </li>
          </ul>
          <ul v-else>
            <li class="li_item_nodate">暂无数据</li>
          </ul>
        </div>
        <div v-else class="lxt_statusModelcontent">
          <ul v-if="unfinished_dataList.length != 0">
            <li v-for="(item,index) in unfinished_dataList.slice(0,5)" :key="index">
              <span
                class="code_class1"
                @click="taskDetail({
                  taskid: item.id,
                  searchdate: item.partitiondate,
                  processInstanceId:3
                })"
              >{{item.taskCode}}</span>
              <span>{{item.finishDate}}</span>
              <span
                style="overflow: hidden;white-space: nowrap;"
                :title="item.companyCheck">{{item.companyCheck}}</span>
            </li>
          </ul>
          <ul v-else>
            <li class="li_item_nodate">暂无数据</li>
          </ul>
        </div>
      </div>

      <div :style="{display:this.KbRole.includes('kb.assignedTask') ? 'block' : 'none'}"
           class="lxt_statusModel">
        <div class="lxt_statusModelTitle">
          <span class="lxt_params">待分配任务 <em v-if="unassigned_tasks.length!=0">( {{unassigned_tasks.length | maxNumber}} )</em></span>

          <!-- <a href="javascript:;" class="lxt_more" @click="more('kb.assignedTask')">更多</a> -->
          <el-button type="text" @click="more('kb.assignedTask')">
            更多
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
        <div class="lxt_xmcTitle">
          <p style="display: flex;">
            <span style="flex: 1;">任务号</span>
            <span style="flex: 1;">商定完成时间</span>
            <span style="flex: 1;">受检单位</span>
          </p>
        </div>
        <div class="lxt_statusModelcontent">
          <ul v-if="unassigned_tasks.length != 0">
            <li v-for="(item,index) in unassigned_tasks.slice(0,5)" :key="index">
              <span class="code_class1"
                    :title="item.taskCode"
                    @click="taskDetail({
                      taskid: item.id,
                      searchdate: item.partitiondate,
                      processInstanceId:3
                    })"
              >{{item.taskCode}}</span>
              <span>{{item.finishDate}}</span>
              <span style=" overflow: hidden;white-space: nowrap;"
                    :title="item.companyCheck">{{item.companyCheck}}</span>
            </li>
          </ul>
          <ul v-else>
            <li class="li_item_nodate">暂无数据</li>
          </ul>
        </div>
      </div>

      <div :style="{display:this.KbRole.includes('kb.vettingReport') ? 'block' : 'none'}"
           class="lxt_statusModel">
        <div class="lxt_statusModelTitle">
          <span class="lxt_params">报告审批 <em v-if="report_status_dataList.length!=0">( {{report_status_dataList.length | maxNumber}} )</em></span>
          <ul class="lxt_stlist">
            <li @click="status" :class="{'on': falgtow == true}">
              审批状态 <em
              v-if="loading_dataList.length!=0">( {{loading_dataList.length | maxNumber}} )</em>
            </li>
            <li @click="approval" :class="{'on': falgtow == false}">
              审批完成 <em
              v-if="audited_dataList.length!=0">( {{audited_dataList.length | maxNumber}} )</em>
            </li>
          </ul>
          <!-- <a href="javascript:;" class="lxt_more" @click="more('kb.vettingReport')">更多</a> -->
          <el-button type="text" @click="more('kb.vettingReport')">
            更多
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
        <div class="lxt_xmcTitle">
          <p><span>报告编号</span><span>提交日期</span><span>审批状态</span></p>
        </div>
        <div class="lxt_statusModelcontent">
          <ul v-if="falgtow">
            <ul v-if="review_list.length != 0">
              <li v-for="(item,index) in review_list.slice(0,5)" :key="index">
                <span :title="item.itemsCode" class="code_class2">{{item.itemsCode}}</span>
                <span>{{item.submitDate}}</span>
                <!--<span>审批中</span>-->
                <span :title="item.myTitle">{{item.myTitle}}</span>
              </li>
            </ul>
            <ul v-else>
              <li class="li_item_nodate">暂无数据</li>
            </ul>
          </ul>
          <ul v-else>
            <ul v-if="audited_dataList.length != 0">
              <li v-for="(item,index) in audited_dataList.slice(0,5)" :key="index">
                <span :title="item.itemsCode" class="code_class2">{{item.itemsCode}}</span>
                <span>{{item.submitDate}}</span>
                <span>已审批</span>
              </li>
            </ul>
            <ul v-else>
              <li class="li_item_nodate">暂无数据</li>
            </ul>
          </ul>
        </div>
      </div>

      <div :style="{display:this.KbRole.includes('kb.pendingReview') ? 'block' : 'none'}"
           class="lxt_statusModel">
        <div class="lxt_statusModelTitle">
          <span class="lxt_params">待审核报告通知 <em v-if="check_pending_dataList">( {{check_pending_dataList.length | maxNumber}} )</em></span>
          <!-- <a href="javascript:;" class="lxt_more" @click="more('kb.pendingReview')">更多</a> -->
          <el-button type="text" @click="more('kb.pendingReview')">
            更多
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
        <div class="lxt_xmcTitle">
          <p><span>报告编号</span><span>提交日期</span><span>审批状态</span></p>
        </div>
        <div class="lxt_statusModelcontent">
          <ul v-if="check_pending_dataList.length != 0">
            <li v-for="(item,index) in check_pending_dataList.slice(0,5)" :key="index">
              <span :title="item.itemsCode" class="code_class2">{{item.itemsCode}}</span>
              <span>{{item.submitDate}}</span>
              <span title="待审核">待审核</span>
              <!-- <span :title="item.myTitle">{{item.myTitle}}</span>-->
            </li>
          </ul>
          <ul v-else>
            <li class="li_item_nodate">暂无数据</li>
          </ul>
        </div>
      </div>

      <div :style="{display:this.KbRole.includes('kb.pendingApproval') ? 'block' : 'none'}"
           class="lxt_statusModel">
        <div class="lxt_statusModelTitle">
          <span class="lxt_params">待批准报告通知 <em v-if="pending_approval_dataList">( {{pending_approval_dataList.length | maxNumber}} )</em></span>

          <!-- <a href="javascript:;" class="lxt_more" @click="more('kb.pendingApproval')">更多</a> -->
          <el-button type="text" @click="more('kb.pendingApproval')">
            更多
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
        <div class="lxt_xmcTitle">
          <p><span>报告编号</span><span>提交日期</span><span>审批状态</span></p>
        </div>
        <div class="lxt_statusModelcontent">
          <ul>
            <ul v-if="pending_approval_dataList.length != 0">
              <li v-for="(item,index) in pending_approval_dataList.slice(0,5)" :key="index">
                <span :title="item.itemsCode" class="code_class2">{{item.itemsCode}}</span>
                <span>{{item.submitDate}}</span>
                <span title="待批准">待批准</span>
              </li>
            </ul>
            <ul v-else>
              <li class="li_item_nodate">暂无数据</li>
            </ul>
          </ul>
        </div>
      </div>

      <div :style="{visibility:this.KbRole.includes('kb.monthlyStatistics') ? 'visible' : 'hidden'}"
           class="lxt_statusModel">
        <!--<div :style="{display:this.KbRole.includes('kb.pendingApproval') ? 'block' : 'none'}"
             class="lxt_statusModel">-->
        <div class="lxt_statusModelTitle">
          <span class="lxt_params">月度统计表</span>
          <div style="text-align: right">
            <span style="margin-right: 0.5vw">统计类型</span>
            <el-select v-model="select_option" placeholder="请选择" class="lxt_yers" @change="mao">
              <el-option
                v-for="item in optionData" :key="item.optionType"
                :label="item.label"
                :value="item.optionType">
              </el-option>
            </el-select>
          </div>

        </div>
        <div id="lxt_myboll" style="min-height: 200px"></div>
      </div>
    </div>

    <!-- 编辑 -->
    <el-dialog
      title="查看" v-if="dialogFormVisible"
      :visible.sync="dialogFormVisible"
      v-bind="{
          modal: false,
          width:'99.9%',
          top:'0',
        }"
      :custom-class="'taskDetail_dialog1'"
    >
      <taskDetail
        ref="taskDetail"
        saveType="3"
      />
    </el-dialog>

  </section>
</template>
<script>
  import echarts from 'echarts'
  // 任务详情弹框
  import taskDetail from '@/views/taskdelegation/componentstask/acceptance.vue'

  var rememberThis = {
    myEcharts: {
      resize: function () {
      }
    },
  }
  window.addEventListener('resize', function () {
    rememberThis.myEcharts.resize()
  })

  var year // 获取当前年
  var month // 获取当前月
  var date // 获取当前日
  export default {
    name: 'statustips',
    data () {
      return {
        optionData: [
          {
            optionType: '1',
            label: '报告提交'
          },
          {
            optionType: '2',
            label: '审核报告'
          },
          {
            optionType: '4',
            label: '批准报告'
          },
          {
            optionType: '3',
            label: '分配任务'
          }
        ],
        select_option: '',
        falg: true,
        falgtow: true,
        task_notification: [],// 任务通知
        overdue_dataList: [],// 任务通知 _ 已完成
        unfinished_dataList: [],// 任务通知 _ 未完成
        unassigned_tasks: [],// 待分配任务

        report_status_dataList: [],// 报告的审批相关数据
        loading_dataList: [],// 审核状态
        audited_dataList: [],// 审批完成

        check_pending_dataList: [],// 待审核
        check_pending_dataList_Total: '',// 待审核_总数
        pending_approval_dataList: [],// 待批准
        pending_approval_dataList_Total: '',// 待批准_总数

        vehicle_arrival_dataList: [],// 车辆到达通知
        parts_arrival_dataList: [],// 零件到达通知

        barData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],// 图形的初始数据
        approvalR: [],// 批准
        assigningTask: [],// 分配任务
        auditR: [],// 审核
        submitR: [],// 提交报告echarts数据

        KbRole: [],// 权限数组
        myEcharts: null,// echarts实例

        // 查看任务详情弹框
        dialogFormVisible: false,

        review_list: [],

        // 车辆到达通知的查询内容
        vin_value: '',
        // 零部件到达通知的查询内容
        LBJ_value: '',
      }
    },
    components: {
      taskDetail
    },
    methods: {
      /*
      * 功能: 车辆到达通知
      * */
      findCarLoadByVin (params) {
        this.$api.systemPublicationpage.findCarLoadByVin(params)
          .then(res => {
            if (res.data.data) {

              if (res.data.data.length == 0) {
                // this.$message.warning({
                //   message: `车辆到达通知暂无数据`,
                //   duration: 3000,
                // })
              } else {
                this.vehicle_arrival_dataList = JSON.parse(JSON.stringify(res.data.data))
              }

            } else {
              this.$message.warning({
                message: `车辆到达通知数据异常`,
                duration: 3000,
              })
            }
          })
          .catch(err => {
            this.$message.error({
              message: err.data.message,
              duration: 3000,
            })
          })
      },
      /*
      * 功能: 零部件到达通知
      * */
      findComponentPartByCondition (params) {
        this.$api.systemPublicationpage.findComponentPartByCondition(params)
          .then(res => {
            if (res.data.data) {

              if (res.data.data.length == 0) {
                // this.$message.warning({
                //   message: `零部件到达通知暂无数据`,
                //   duration: 3000,
                // })
              } else {
                this.parts_arrival_dataList = JSON.parse(JSON.stringify(res.data.data))
              }

            } else {
              this.$message.warning({
                message: `零部件到达通知数据异常`,
                duration: 3000,
              })
            }
          })
          .catch(err => {
            this.$message.error({
              message: err.data.message,
              duration: 3000,
            })
          })
      },
      /*
      * 功能: 点击更多 跳转相对应的路由
      * */
      more (value) {
        switch (value) {
          case 'kb.pendingReview':
            this.$EventBus.$emit('Crumbs', {
              cache: true,
              children: null,
              component: '/views/task/componentsview/Taskmanage.vue',
              hidden: false,
              name: 'surveyaudit',
              path: '/surveyreport/audit',
              redirect: null,
              title: '报告审核'
            })
            break
          case 'kb.pendingApproval':
            this.$EventBus.$emit('Crumbs', {
              cache: true,
              children: null,
              component: '/views/task/componentsview/Taskmanage.vue',
              hidden: false,
              name: 'surveyratify',
              path: '/surveyreport/ratify',
              redirect: null,
              title: '报告批准'
            })
            break
          case 'kb.vettingReport':
            this.$EventBus.$emit('Crumbs', {
              cache: true,
              children: null,
              component: '/views/task/componentsview/Taskmanage.vue',
              hidden: false,
              name: 'report',
              path: '/report',
              redirect: null,
              title: '我的报告'
            })
            break
          case 'kb.assignedTask':
            this.$EventBus.$emit('Crumbs', {
              cache: true,
              children: null,
              component: '/views/taskinspection/componentstask/allocation.vue',
              hidden: false,
              name: 'allocation',
              path: '/inspectiontask/allocation',
              redirect: null,
              title: '任务分配',
            })
            break
          case 'kb.questnotice':
            this.$EventBus.$emit('Crumbs', {
              cache: true,
              children: null,
              component: '/views/pigeonhole/Pigeonhole.vue',
              hidden: false,
              name: 'surveyredact',
              path: '/surveyreport/redact',
              redirect: null,
              title: '报告编辑'
            })
            break
          case 'kb.vehicleArrive':
            this.$EventBus.$emit('Crumbs', {
              cache: true,
              children: null,
              component: '/views/sample/componentsview/vehicle.vue',
              hidden: false,
              name: 'vehicle',
              path: '/sample/vehicle',
              redirect: null,
              title: '整车列表'
            })
            break
          case 'kb.partsArrive':
            this.$EventBus.$emit('Crumbs', {
              cache: true,
              children: null,
              component: '/views/sample/componentsview/spareparts.vue',
              hidden: false,
              name: 'spareparts',
              path: '/sample/spareparts',
              redirect: null,
              title: '零部件列表'
            })
            break
        }
      },

      unfinished () {
        this.falg = true
      },

      overdue () {
        this.falg = false
      },

      status () {
        this.falgtow = true
      },

      approval () {
        this.falgtow = false
      },

      init_Echarts () {
        this.myEcharts = echarts.init(document.getElementById('lxt_myboll'))
        var option = {
          title: {
            text: year + '年完成实验报告数量阅读分布图',
            x: 'center',
            textStyle: {
              color: '#636363',
              // fontWeight: ''
            },
            top: 10
          },
          'backgroundColor': 'rgb(255, 255, 255)',
          'color': ['#4670C4'],
          'tooltip': {},
          'grid': {
            // "containLabel": true,
            'left': 70,
            // "top": 90,
            // "bottom": 10,
            // "right": 10,
          },
          'xAxis': [{
            'type': 'category',
            'data': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            'axisTick': {
              'alignWithLabel': true,
              'show': false
            },
            'nameTextStyle': {
              'color': '#82b0ec'
            },
            'axisLine': {
              'lineStyle': {
                'color': '#'
              }
            },
            'axisLabel': {
              'textStyle': {
                'color': '#000'
              }
            }
          }],
          'yAxis': [{
            'type': 'value',
            name: '报告数量',
            nameLocation: 'middle',
            nameGap: 30,
            nameTextStyle: {
              color: '#636363',
              fontSize: 18,
            },
            // "min": 0,
            // "max": 99,
            // "splitNumber": 5,
            // 刻度线
            'axisTick': {
              'show': false
            },
            'axisLabel': {
              'textStyle': {
                'color': '#000'
              },
              'formatter': '{value}'
            },
            'splitLine': {
              'lineStyle': {
                'color': '#e0e0e0'
              }
            },
            'axisLine': {
              'show': false
            }
          }],
          'series': [{
            'type': 'bar',
            'itemStyle': {
              'normal': {
                'opacity': 1
              }
            },
            'barWidth': '15',
            label: {
              show: true,
              position: 'top',
              color: '#000000',
              formatter: function (data) {
                return data.data == 0 ? '' : data.data
              }
            },
            'data': this.barData,
          }]
        }
        this.myEcharts.setOption(option)
      },

      mao () {
        switch (this.select_option) {
          case '1':
            this.barData = this.submitR
            break
          case '2':
            this.barData = this.auditR
            break
          case '3':
            this.barData = this.assigningTask
            break
          case '4':
            this.barData = this.approvalR
        }
        this.init_Echarts()
      },

      /**
       * 功能:状态提示 _ 获取 _ 任务通知模块 / 待分配任务模块
       * 参数:process_instance_id = 3,任务通知模块
       *      process_instance_id = 2,待分配任务模块
       * */
      questNotice (params) {
        this.$api.systemPublicationpage.questNotice(params).then(res => {
          if (res.data.ok && res.data.data) {
            if (params.process_instance_id == '3') {
              this.overdue_dataList = res.data.data.overdue
              var aa1 = res.data.data.overdue
              this.unfinished_dataList = res.data.data.unfinished
              var aa2 = res.data.data.unfinished
              this.task_notification = aa1.concat(aa2)
              // this.$store.state['surveyredact'] = this.task_notification.length
            }
            if (params.process_instance_id == '2') {
              this.unassigned_tasks = res.data.data.assignedTask
              // this.$store.state['allocation'] = this.unassigned_tasks.length
            }
          }
        }).catch(err => {
          console.log(err, 'error')
          this.$message({
            type: 'error',
            message: err.data.message
          })
        })
      },

      /**
       * 功能:状态提示 _ 获取 _ 报告审批模块 / 待审核报告通知模块 / 待批准报告通知模块
       *      res.data[i].process_instance_id = 5 待审核
       *      res.data[i].process_instance_id = 6 待批准
       *      res.data[i].process_instance_id = 7 已审批
       * */
      vettingReport (params) {
        this.$api.systemPublicationpage.vettingReport(params).then(res => {
          if (res.data.ok && res.data.data) {
            var temp = res.data.data
            this.audited_dataList = temp.audited// 已审批
            var a1 = temp.audited
            var a2 = temp.pendingApproval
            var a3 = temp.pendingReview

            this.review_list = temp.review// 审批中
            this.review_list.slice(0, 5).forEach((item, index) => {
              if (item.process_instance_id == 5) {
                item.myTitle = '审核中'
              }
              if (item.process_instance_id == 6) {
                item.myTitle = '批准中'
              }
            })
            var a4 = a2.concat(a3)
            this.loading_dataList = a4

            this.report_status_dataList = a1.concat(a4)
          }
        }).catch(err => {
          console.log(err, 'error')
          this.$message({
            type: 'error',
            message: err.data.message
          })
        })
      },

      /*
      * 功能:状态提示 _ 获取 _ 月度统计表(echarts)数据
      * */
      monthlyStatisticsInit () {
        this.$api.systemPublicationpage.monthlyStatisticsInit().then(res => {
          if (res.data.ok) {
            this.approvalR = res.data.data.approvalR
            this.assigningTask = res.data.data.assigningTask
            this.auditR = res.data.data.auditR
            this.submitR = res.data.data.submitR
            // 默认显示 提交报告数据图
            this.barData = res.data.data.submitR
          }
        }).catch(err => {
          console.log(err, 'error')
          this.$message({
            type: 'error',
            message: err.data.message
          })
        })
      },

      /*
      * 功能:状态提示 _ 获取 _ 当前登陆用户拥有的看板页相关权限
      * */
      getKbRole () {
        this.$api.systemPublicationpage.getKbRole()
          .then(res => {
            if (res.data.ok && res.data.data) {
              res.data.data.forEach((item, index) => {
                this.KbRole.push(item.rolecode)
              })
            }
          })
          .catch(err => {
            // console.log(err, 'error')
            this.$message({
              type: 'error',
              message: err.data.message
            })
          })
      },

      /*
      * 功能:状态提示 _ 获取 _ /待审核报告 /待批准报告 数据
      *      process_instance_id = 5 待审核
      *      process_instance_id = 6 待批准
      * */
      vettingReport2 (params) {
        this.$api.systemPublicationpage.vettingReport2(params).then(res => {
          if (res.data.ok && res.data.data && res.data.data.length != 0) {
            var temp = res.data.data
            if (params.process_instance_id == 5) {
              this.check_pending_dataList = temp// 待审批
              // this.$store.state['surveyaudit'] = this.check_pending_dataList.length
              // this.check_pending_dataList_Total = String(temp[0].total);// 待审批_总数
              return
            }
            if (params.process_instance_id == 6) {
              this.pending_approval_dataList = temp// 待批准
              // this.$store.state['surveyratify'] = this.pending_approval_dataList.length
              // this.pending_approval_dataList_Total = String(temp[0].total);// 待批准_总数
              return
            }
            this.$message.success({message: res.data.message})
          }
        }).catch(err => {
          console.log(err, 'error')
          this.$message.error({message: err.data.message})
        })
      },

      /*
      * 功能:状态提示 _ 查看 _ 任务详情
      * */
      taskDetail (params) {
        var that = this
        that.dialogFormVisible = true
        this.$api.systemPublicationpage.taskDetail(params)
          .then(res => {
            if (res.data.ok && res.data.data) {

              let resp = res.data.data
              this.$nextTick(() => {
                this.$refs['taskDetail'].$refs['RegisterInfor'].formData['enterpriseCatalog'] = resp['entCatalog']
                this.$refs['taskDetail'].$refs['RegisterInfor'].formData['taskCode2'] = resp.tinfo['taskCode'] ? resp.tinfo['taskCode'] : ''
                /* ******* */
                let tinfo = this.$refs['taskDetail'].$refs['RegisterInfor'].formData['tinfo'] //  登记信息组件: formData.tinfo 字段
                for (let key in tinfo) {
                  tinfo[key] = resp.tinfo[key] ? resp.tinfo[key] : ''
                  // 若需要一些字段的值为特殊内容,则在此处进行二次赋值
                  // switch (key) {
                  //   case 'taskCode2':
                  //     tinfo[key] = resp.tinfo['taskCode'] ? resp.tinfo['taskCode'] : ''
                  //     break
                  // }
                }
                /* ******* */
                let infor = this.$refs['taskDetail'].$refs['RegisterInfor'].formData['infor'] //  登记信息组件: formData.infor 字段
                for (let key in infor) {
                  infor[key] = resp.infor[key] ? resp.infor[key] : ''

                  // 若需要一些字段的值为特殊内容,则在此处进行二次赋值
                  switch (key) {
                    case 'timeRequirement':
                      infor[key] = resp.infor[key] ? resp.infor[key] : '1'
                      break
                  }
                }
                this.$refs['taskDetail'].$refs['RegisterInfor'].valFileName = infor['ordersName'] // 登记信息 -- 基本信息:委托单文件名
                /* ******* */
                let sampleConfigInfoVOS = resp['sampleConfigInfoVOS']
                this.$refs['taskDetail'].$refs['SampleInfor'].dataSource = resp['taskSampleVos'].map(item => {
                  for (let i in sampleConfigInfoVOS) {
                    if (sampleConfigInfoVOS[i].sampleCode == item.sampleCode) {
                      item['CONFIGINOFR_list'] = sampleConfigInfoVOS[i].list
                      break
                    }
                  }
                  return item
                })
                this.$refs['taskDetail'].$refs['SampleInfor'].activeDel = 'draft'
                /* ******* */
                this.$refs['taskDetail'].$refs['taskDetail'].$refs['InspecteItems'].dataSource = resp['inspectContentList'].map(item => {
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
                  item.checkcur = false
                  return item
                }) // 检验项目组件: 原有的检验项目信息
                this.$refs['taskDetail'].isCame_in_InspecteItems = 1// 如果将其置 1 ,就会再次触发获取默认00检验项目的逻辑,从而会替代掉本身的检验项目
                /* ******* */
                this.$refs['taskDetail'].iaction = resp['iaction'] // 用来控制强制保存按钮
                this.$refs['taskDetail'].taskrole = resp['taskrole']  // 用来控制强制保存按钮
                /* ******* */
                this.$refs['taskDetail'].$refs['ProcessInfor'].getItemsWorkLogs(params.taskid)

              })
            } else {
              this.$message.info({message: res.data.message})
            }
          })
          .catch(err => {
            console.log(err, 'error')
            this.$message.error({message: err.data.message})
          })
      },
    },
    filters: {
      maxNumber (value) {
        if (value >= 99) {
          return '99+'
        } else {
          return value
        }
      }
    },
    created () {
      var nowDate = new Date()
      year = nowDate.getFullYear() // 获取当前年

      this.getKbRole()
      this.questNotice({
        process_instance_id: '3'
      })
      this.questNotice({
        process_instance_id: '2'
      })
      this.vettingReport({
        data: {
          currentPage: '1'
        }
      })

      // 待审核报告通知
      this.vettingReport2({
        process_instance_id: 5,
        searchdate: '',
        currentPage: 1,
        // pageSize: 5
      })

      // 待批准报告通知
      this.vettingReport2({
        process_instance_id: 6,
        searchdate: '',
        currentPage: 1,
        // pageSize: 5
      })

      // 车辆到达通知
      this.findCarLoadByVin({
        vin: '',
      })
      // 零部件到达通知
      this.findComponentPartByCondition({
        condition: '',
      })
    },
    beforeMount () {
      rememberThis = this
    },
    mounted () {
      this.monthlyStatisticsInit()
      this.init_Echarts()
    },
  }
</script>
<style scoped lang="less">
  .lxt_statusTips {
    width: 100%;
    height: auto;
    padding: 1%;
    font-size: 16px;
    border: solid 1px #ccc;
    margin-top: 1vw;
    background: #fff
  }

  .lxt_status {
    width: 100%;
    height: auto;
    padding: 1%;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .lxt_statusModel {
    display: none;
    width: 32%;
    min-height: 400px;
    padding: 1vw;
    margin-bottom: 1vw;
    border: #e8e8e8 solid 1px;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
  }

  .lxt_statusModel:last-child {
    display: block;
  }

  .lxt_statusModel:hover {
    box-shadow: 0 0 8px 1px rgb(149, 202, 255);
  }

  .lxt_statusModelTitle {
    width: 100%;
    min-height: 48px;
    padding-bottom: .5vw;
    border-bottom: #ccc solid 1px;
    display: flex;
    display: -webkit-flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .lxt_params {
    font-size: 18px;
    font-weight: 900;
    border-left: 2px solid #4CDAFF;
    /*margin-left: 1vw;*/
    /*transform: translateX(10px);*/
    text-indent: .5vw;
    line-height: 18px;
    white-space: nowrap;
  }

  .lxt_params em {
    font-style: normal;
    font-size: 18px;
    color: red;
  }

  .lxt_more {
    color: #34ABFF;
    float: right;
    padding-right: 1vw;
    /*margin-right: 1vw;*/
    background-image: url('../../../../assets/images/rightmore.png');
    background-repeat: no-repeat;
    background-size: 20%;
    background-position: 2vw center;
  }

  .lxt_more:hover {
    color: #34ABFF;
    /*background-position: 2.3vw center;*/
  }

  .lxt_stlist {
    width: auto;
    margin: 0;
    .lxt_stlist-input1 {
      /deep/ .el-input-group__append {
        padding: 0 10px;

        i {
          cursor: pointer;
        }
      }
    }
  }

  .lxt_stlist em {
    font-style: normal;
    font-size: 12px;
  }

  .lxt_stlist li {
    float: left;
    margin-right: 1vw;
    border-bottom: #fff solid 3px;
    cursor: pointer;
    font-size: 12px;
  }

  .lxt_stlist li.on {
    border-bottom: rgb(149, 202, 255) solid 3px;
  }

  .lxt_xmcTitle {
    width: 100%;
    height: auto;
    background: #eee;
  }

  .lxt_xmcTitle p {
    padding: 0;
    margin: 0;
    display: flex;
  }

  .lxt_xmcTitle p span {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    text-align: center;
    padding: 1vw 0;
  }

  .lxt_statusModelcontent {
    width: 100%;
    height: auto;
    border: 1px solid #eee;
  }

  .lxt_statusModelcontent ul {
    padding: 0;
    margin: 0;
  }

  .lxt_statusModelcontent ul li {
    padding: 0;
    display: flex;
    justify-content: space-around;
  }
  .lxt_statusModelcontent ul li:nth-child(even) {
    background: #f5f5f5;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }

  .lxt_statusModelcontent ul li span {
    display: inline-block;
    text-align: center;
    flex: 1;
    box-sizing: border-box;
    padding: 15px;
    text-overflow: ellipsis;
  }
  .lxt_statusModelcontent ul li span:not(:last-child) {
    border-right: 1px solid #eee;
  }
  .li_item_nodate {
    padding: 15px 0 !important;
  }

  .code_class1 {
    cursor: pointer;
    color: #34ABFF;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .code_class2 {
    color: #34ABFF;
    font-weight: 700;
    overflow: hidden;
    white-space: nowrap;
  }

  .code_class3 {
    /*cursor: pointer;*/
    color: #34ABFF;
    font-weight: 700;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #lxt_myboll {
    width: 100%;
    height: 100%;
  }

  .lxt_yers {
    max-width: 40%;
    margin-right: 1vw;
  }

  /deep/ .taskDetail_dialog1 {
    min-height: 100% !important;
    margin: 0 auto !important;
  }
</style>
