<template>
  <!-- 任务受理 - 流转信息 -->
  <div id="processInfor-box">
    <div ref="EChartsRoom"
         id="EChartsRoom"
         class="EChartsRoom"
         :style="{
            'max-height': '500px',
            overflow: 'auto'
         }"
    >
      <!-- 方案1：单线多行 -->
      <div
        style="margin-bottom: 30px;"
        v-for="(item1,index1) in dataSource"
        :key="item1.itemsCode">
        <p>{{item1.itemsCode}}:<template v-if="item1.workFlowNodeInfoVOList ? false : true">&nbsp;<i style="font-weight: bold;">暂无流转信息</i></template></p>
        <ul style="display: flex;">
          <template v-for="(item,index) in item1.workFlowNodeInfoVOList">
            <li style="position: relative">
              <p style="position: relative;min-width: 150px;min-height: 50px;">
              <span
                class="mly-ball"
                :style="{
                  'background-color': item.isPass==1 ? 'deepskyblue' : '#e2e3e3',
                }"
              >
                <i
                  v-if="index != item1.workFlowNodeInfoVOList.length-1"
                  :style="{
                    'background-color': item.isPass==1 && item.isCurrent!=1 ? 'skyblue' : '#e2e3e3',
                  }"
                ></i>
              </span>
                <span
                  :style="{
                    display: 'inline-block',
                    width:'100%',
                    position: 'absolute',
                    bottom: 0,
                    'text-align': 'center',
                    'font-weight': item.isPass == 1 ? item.isCurrent==1 ? '600' : '400' : '300'
                  }"
                >{{item.name}}</span>
              </p>
              <p style="text-align: center;cursor: default;">
                <span>{{item.assigneeName ? item.assigneeName : ''}}</span>
                <template v-if="item.isCurrent == 1">
                  <img src="/static/image/cui1.png" alt="" height="15" width="15"/><br>
                  <span
                    style="display: block;color: deepskyblue;cursor: pointer;"
                    @click="hurryUp({
                      'assignee': item.assignee,
                      'inspectid': item1.inspectid,
                      'process_instance_id': item1.process_instance_id,
                      'groupId': item.groupId
                    })"
                  >催一下
                </span>
                </template>
                <template v-else>
                  <span style="display: block;white-space: nowrap;">{{item.end_date ? item.end_date : ''}}</span>
                </template>
              </p>
            </li>
          </template>
        </ul>
      </div>
    </div>

    <ul style="max-height: 50px;display: flex" id="tab-class1">
      <li
        style="line-height: 50px;margin-right: 10px;cursor: pointer"
        v-for="(item,index) in dataSource"
        :class="{activeClass_1: activeFlg == index}"
        :key="item.itemsCode"
        @click="handleChange_tableSourceData(item.itemsCode,index)">
        {{item.itemsCode}}
      </li>
    </ul>

    <el-row>
      <el-col :span="24">
        <el-table
          v-bind="{
            height: 500,
            data: tableDataSource,
            border: true,
            stripe: true,
          }"
        >
          <el-table-column
            prop="flowname"
            v-bind="{
          label:'节点名称',
          width:'',
          resizable:false,
        }"/>
          <el-table-column
            prop="create_date"
            v-bind="{
          label:'开始时间',
          width:'',
          resizable:false,
        }"/>
          <el-table-column
            prop="end_date"
            v-bind="{
          label:'结束时间',
          width:'',
          resizable:false,
        }"/>
          <el-table-column
            prop="name"
            v-bind="{
          label:'负责人',
          width:'',
          resizable:false,
        }"/>
          <el-table-column
            prop="flowname"
            v-bind="{
          label:'状态',
          width:'',
          resizable:false,
        }"/>
          <el-table-column
            prop="result"
            v-bind="{
          label:'处理结果',
          width:'',
          resizable:false,
        }">
            <template slot-scope="{ row }">
              <span class="result-class1" v-if="row['end_date']!=null && row['end_date']!==''"><i style="background-color: green"></i>完成</span>
              <span class="result-class1" v-else><i style="background-color: red"></i>未完成</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            v-bind="{
          label:'处理意见',
          width:'',
          resizable:false,
        }"/>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  export default {
    name: 'processInfor',
    // props:['taskIdProp'],
    data () {
      return {
        defaultActiveValue: 'a',
        dataSource: [],
        tableDataSource: [],
        activeFlg: 0,

        // forceChart: {},
      }
    },
    methods: {
      // 催一下
      hurryUp (data) {
        let params = {...data}
        this.$api.mly.hurryUp(params)
          .then((res) => {
            if (res.data.ok) {
              this.$message.success({
                message:res.data.data,
                duration:5000,
                showClose:true
              })
            }
          })
          .catch((err) => {
            this.$message.error({
              message: err.data.message,
              duration: 5000,
              showClose: true
            })
          })
      },

      handleChange_tableSourceData (value, index) {
        this.activeFlg = index
        this.dataSource.forEach((item) => {
          if (item.itemsCode === value) {
            this.tableDataSource = item.workLogVOList
          }
        })
      },
      getItemsWorkLogs (id) {
        this.$api.mly.getItemsWorkLogs(id)
          .then((res) => {
            /* 方案1: */
            this.dataSource = res.data.data
            this.tableDataSource = this.dataSource[0].workLogVOList
            /* 方案2: */
            // this.dataSource = res.data.data.itemsWorkLogVOS
            // this.rand(res.data.data.objects)
            // this.tableDataSource = this.dataSource[0].workLogVOList

          })
          .catch(() => {
          })
      },
      /**/
      // rand (data) {
      //   $('#EChartsRoom').css({
      //     'display': 'flex'
      //   }).empty()
      //   console.log(data, '??????????')
      //   // console.log($('#EChartsRoom'))
      //   for (let i in data) {
      //     if (data[i] instanceof Array) {
      //       let div1 = $(`<div></div>`)
      //       this.xunhua1(div1, data[i], 'div')
      //       div1.appendTo($('#EChartsRoom'))
      //     } else {
      //       let div1 = $(`<div>${data[i].name}</div>`)
      //       div1.appendTo($('#EChartsRoom'))
      //     }
      //   }
      // },
      /**/
      // xunhua1 (node, data, str) {
      //   for (let i in data) {
      //     let li1 = $(`<${str}>${data[i].name ? data[i].name : ''}</${str}>`)
      //     if (data[i] instanceof Array) {
      //       this.xunhua1(li1, data[i], 'span')
      //     }
      //     li1.appendTo(node)
      //   }
      // },
    },
    created () {
      // this.$nextTick(() => {
      //   this.dataSource = json2.data
      // })
    },
    mounted () {
      // this.forceChart = echarts.init(this.$refs['EChartsRoom'])
      // forceChart.resize()
      // window.addEventListener('resize', this.forceChart.resize)
      // this.$EventBus.$on('GET_procssInfo', (id) => {
      //   this.$api.mly.getItemsWorkLogs(id)
      //     .then((res) => {
      //       this.dataSource = res.data.data
      //     })
      //     .catch(() => {
      //     })
      // })

      // this.getItemsWorkLogs(`BB78A6B07A194927899E73CB03D86FAA`)

      // var res = {
      //   "respCode": "0",
      //   "data": [
      //     {
      //       "itemsCode": "1588923865268",
      //       "workLogVOList": [
      //         {
      //           "inspectid": 2400076,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 15:45:02",
      //           "end_date": "2020-05-08 15:46:05",
      //           "reason": "",
      //           "flowname": "任务草稿",
      //           "flowid": "p_1",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400076,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 15:46:05",
      //           "end_date": "2020-05-08 15:48:32",
      //           "reason": "",
      //           "flowname": "任务信息审核",
      //           "flowid": "p_10",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400076,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 15:48:32",
      //           "end_date": "2020-05-08 16:09:46",
      //           "reason": "",
      //           "flowname": "计划科分配科室",
      //           "flowid": "p_11",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400076,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:09:46",
      //           "end_date": "2020-05-08 16:10:05",
      //           "reason": "",
      //           "flowname": "科室主任分配",
      //           "flowid": "p_2",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400076,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:10:05",
      //           "end_date": "2020-05-08 16:10:34",
      //           "reason": "",
      //           "flowname": "主检分配",
      //           "flowid": "p_12",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400076,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:10:34",
      //           "end_date": "2020-05-08 16:12:11",
      //           "reason": "",
      //           "flowname": "上传原始记录",
      //           "flowid": "p_13",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400076,
      //           "updator": "zcfp",
      //           "create_date": "2020-05-08 16:12:11",
      //           "end_date": "2020-05-08 16:44:25",
      //           "reason": "数据缺失",
      //           "flowname": "原始记录审核",
      //           "flowid": "p_14",
      //           "name": "zcfp"
      //         },
      //         {
      //           "inspectid": 2400076,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:44:25",
      //           "end_date": "2020-05-08 16:51:07",
      //           "reason": "",
      //           "flowname": "上传原始记录",
      //           "flowid": "p_13",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400076,
      //           "updator": "zj",
      //           "create_date": "2020-05-08 16:51:07",
      //           "end_date": "2020-05-11 16:18:12",
      //           "reason": "20.5.11测试查看图片问题，回退上传",
      //           "flowname": "原始记录审核",
      //           "flowid": "p_14",
      //           "name": "zj"
      //         },
      //         {
      //           "inspectid": 2400076,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-11 16:18:12",
      //           "end_date": "2020-05-11 16:20:58",
      //           "reason": "",
      //           "flowname": "上传原始记录",
      //           "flowid": "p_13",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400076,
      //           "updator": "zj",
      //           "create_date": "2020-05-11 16:20:58",
      //           "end_date": "2020-05-11 16:28:16",
      //           "reason": "20.5.11测试查看图片问题，回退上传2",
      //           "flowname": "原始记录审核",
      //           "flowid": "p_14",
      //           "name": "zj"
      //         },
      //         {
      //           "inspectid": 2400076,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-11 16:28:16",
      //           "end_date": "2020-05-11 16:29:24",
      //           "reason": "",
      //           "flowname": "上传原始记录",
      //           "flowid": "p_13",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400076,
      //           "updator": "zj",
      //           "create_date": "2020-05-11 16:29:24",
      //           "end_date": "",
      //           "reason": "",
      //           "flowname": "原始记录审核",
      //           "flowid": "p_14",
      //           "name": "zj"
      //         }
      //       ],
      //       "workFlowNodeInfoVOList": [
      //         {
      //           "id": "p_10",
      //           "name": "任务信息审核",
      //           "documentation": "{\"process_instance_id\":\"10\",\"is_jump\":\"0\",\"seq\":\"2\"}",
      //           "sort": 2,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": "xtqx",
      //           "assigneeName": "系统权限",
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_11",
      //           "name": "计划科分配科室",
      //           "documentation": "{\"process_instance_id\":\"11\",\"is_jump\":\"0\",\"seq\":\"3\"}",
      //           "sort": 3,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": "xtqx",
      //           "assigneeName": "系统权限",
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_2",
      //           "name": "科室主任分配",
      //           "documentation": "{\"process_instance_id\":\"2\",\"is_jump\":\"1\",\"seq\":\"4\"}",
      //           "sort": 4,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": "xtqx",
      //           "assigneeName": "系统权限",
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_12",
      //           "name": "主检分配",
      //           "documentation": "{\"process_instance_id\":\"12\",\"is_jump\":\"1\",\"seq\":\"5\"}",
      //           "sort": 5,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": "xtqx",
      //           "assigneeName": "系统权限",
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_13",
      //           "name": "上传原始记录",
      //           "documentation": "{\"process_instance_id\":\"13\",\"is_jump\":\"1\",\"seq\":\"6\"}",
      //           "sort": 6,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": "xtqx",
      //           "assigneeName": "系统权限",
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_14",
      //           "name": "原始记录审核",
      //           "documentation": "{\"process_instance_id\":\"14\",\"is_jump\":\"1\",\"seq\":\"7\"}",
      //           "sort": 7,
      //           "isCurrent": 1,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": "zj",
      //           "assigneeName": "zj",
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_3",
      //           "name": "报告编辑",
      //           "documentation": "{\"process_instance_id\":\"3\",\"is_jump\":\"1\",\"seq\":\"8\"}",
      //           "sort": 8,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_4",
      //           "name": "报告校核",
      //           "documentation": "{\"process_instance_id\":\"4\",\"is_jump\":\"1\",\"seq\":\"9\"}",
      //           "sort": 9,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_5",
      //           "name": "报告审核",
      //           "documentation": "{\"process_instance_id\":\"5\",\"is_jump\":\"1\",\"seq\":\"10\"}",
      //           "sort": 10,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_6",
      //           "name": "报告批准",
      //           "documentation": "{\"process_instance_id\":\"6\",\"is_jump\":\"1\",\"seq\":\"11\"}",
      //           "sort": 11,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_7",
      //           "name": "报告归档",
      //           "documentation": "{\"process_instance_id\":\"7\",\"is_jump\":\"1\",\"seq\":\"12\"}",
      //           "sort": 12,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_15",
      //           "name": "等待报告归档",
      //           "documentation": "{\"process_instance_id\":\"15\",\"is_jump\":\"0\",\"seq\":\"13\"}",
      //           "sort": 13,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         }
      //       ],
      //       "nodeVOList": [
      //         {
      //           "id": "p_1",
      //           "name": "任务草稿",
      //           "documentation": "{\"process_instance_id\":\"1\",\"is_jump\":\"0\",\"seq\":\"1\"}",
      //           "sort": 1
      //         },
      //         {
      //           "id": "p_10",
      //           "name": "任务信息审核",
      //           "documentation": "{\"process_instance_id\":\"10\",\"is_jump\":\"0\",\"seq\":\"2\"}",
      //           "sort": 2
      //         },
      //         {
      //           "id": "p_11",
      //           "name": "计划科分配科室",
      //           "documentation": "{\"process_instance_id\":\"11\",\"is_jump\":\"0\",\"seq\":\"3\"}",
      //           "sort": 3
      //         },
      //         {
      //           "id": "p_2",
      //           "name": "科室主任分配",
      //           "documentation": "{\"process_instance_id\":\"2\",\"is_jump\":\"1\",\"seq\":\"4\"}",
      //           "sort": 4
      //         },
      //         {
      //           "id": "p_12",
      //           "name": "主检分配",
      //           "documentation": "{\"process_instance_id\":\"12\",\"is_jump\":\"1\",\"seq\":\"5\"}",
      //           "sort": 5
      //         },
      //         {
      //           "id": "p_13",
      //           "name": "上传原始记录",
      //           "documentation": "{\"process_instance_id\":\"13\",\"is_jump\":\"1\",\"seq\":\"6\"}",
      //           "sort": 6
      //         },
      //         {
      //           "id": "p_14",
      //           "name": "原始记录审核",
      //           "documentation": "{\"process_instance_id\":\"14\",\"is_jump\":\"1\",\"seq\":\"7\"}",
      //           "sort": 7
      //         },
      //         {
      //           "id": "p_3",
      //           "name": "报告编辑",
      //           "documentation": "{\"process_instance_id\":\"3\",\"is_jump\":\"1\",\"seq\":\"8\"}",
      //           "sort": 8
      //         },
      //         {
      //           "id": "p_4",
      //           "name": "报告校核",
      //           "documentation": "{\"process_instance_id\":\"4\",\"is_jump\":\"1\",\"seq\":\"9\"}",
      //           "sort": 9
      //         },
      //         {
      //           "id": "p_5",
      //           "name": "报告审核",
      //           "documentation": "{\"process_instance_id\":\"5\",\"is_jump\":\"1\",\"seq\":\"10\"}",
      //           "sort": 10
      //         },
      //         {
      //           "id": "p_6",
      //           "name": "报告批准",
      //           "documentation": "{\"process_instance_id\":\"6\",\"is_jump\":\"1\",\"seq\":\"11\"}",
      //           "sort": 11
      //         },
      //         {
      //           "id": "p_7",
      //           "name": "报告归档",
      //           "documentation": "{\"process_instance_id\":\"7\",\"is_jump\":\"1\",\"seq\":\"12\"}",
      //           "sort": 12
      //         },
      //         {
      //           "id": "p_15",
      //           "name": "等待报告归档",
      //           "documentation": "{\"process_instance_id\":\"15\",\"is_jump\":\"0\",\"seq\":\"13\"}",
      //           "sort": 13
      //         }
      //       ],
      //       "seq": 7,
      //       "process_instance_id": 14,
      //       "inspectid": 2400076
      //     },
      //     {
      //       "itemsCode": "1588923865269",
      //       "workLogVOList": [
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 15:45:03",
      //           "end_date": "2020-05-08 15:46:05",
      //           "reason": "",
      //           "flowname": "任务草稿",
      //           "flowid": "p_1",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 15:46:05",
      //           "end_date": "2020-05-08 15:48:33",
      //           "reason": "",
      //           "flowname": "任务信息审核",
      //           "flowid": "p_10",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 15:48:33",
      //           "end_date": "2020-05-08 15:49:41",
      //           "reason": "错误",
      //           "flowname": "计划科分配科室",
      //           "flowid": "p_11",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 15:49:41",
      //           "end_date": "2020-05-08 16:01:52",
      //           "reason": "",
      //           "flowname": "任务信息审核",
      //           "flowid": "p_10",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:01:52",
      //           "end_date": "2020-05-08 16:09:46",
      //           "reason": "",
      //           "flowname": "计划科分配科室",
      //           "flowid": "p_11",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:09:46",
      //           "end_date": "2020-05-08 16:10:11",
      //           "reason": "",
      //           "flowname": "科室主任分配",
      //           "flowid": "p_2",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:10:11",
      //           "end_date": "2020-05-08 16:10:34",
      //           "reason": "",
      //           "flowname": "主检分配",
      //           "flowid": "p_12",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:10:34",
      //           "end_date": "2020-05-08 16:12:11",
      //           "reason": "",
      //           "flowname": "上传原始记录",
      //           "flowid": "p_13",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "zcfp",
      //           "create_date": "2020-05-08 16:12:11",
      //           "end_date": "2020-05-08 16:23:36",
      //           "reason": "未上传原始记录",
      //           "flowname": "原始记录审核",
      //           "flowid": "p_14",
      //           "name": "zcfp"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:23:36",
      //           "end_date": "2020-05-08 16:24:50",
      //           "reason": "",
      //           "flowname": "上传原始记录",
      //           "flowid": "p_13",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "zj",
      //           "create_date": "2020-05-08 16:24:50",
      //           "end_date": "2020-05-08 16:29:36",
      //           "reason": "记录缺失",
      //           "flowname": "原始记录审核",
      //           "flowid": "p_14",
      //           "name": "zj"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:29:36",
      //           "end_date": "2020-05-08 16:35:32",
      //           "reason": "",
      //           "flowname": "上传原始记录",
      //           "flowid": "p_13",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "zcfp",
      //           "create_date": "2020-05-08 16:35:32",
      //           "end_date": "2020-05-08 16:42:54",
      //           "reason": "",
      //           "flowname": "原始记录审核",
      //           "flowid": "p_14",
      //           "name": "zcfp"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:42:54",
      //           "end_date": "2020-05-08 16:49:02",
      //           "reason": "",
      //           "flowname": "报告编辑",
      //           "flowid": "p_3",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:49:02",
      //           "end_date": "2020-05-08 17:32:39",
      //           "reason": "",
      //           "flowname": "报告校核",
      //           "flowid": "p_4",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 17:32:39",
      //           "end_date": "2020-05-08 17:33:35",
      //           "reason": "回退",
      //           "flowname": "报告审核",
      //           "flowid": "p_5",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 17:33:35",
      //           "end_date": "2020-05-08 17:34:03",
      //           "reason": "",
      //           "flowname": "报告校核",
      //           "flowid": "p_4",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "shbg",
      //           "create_date": "2020-05-08 17:34:03",
      //           "end_date": "2020-05-08 17:34:38",
      //           "reason": "",
      //           "flowname": "报告审核",
      //           "flowid": "p_5",
      //           "name": "shbg"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 17:34:38",
      //           "end_date": "2020-05-08 17:35:36",
      //           "reason": "",
      //           "flowname": "报告批准",
      //           "flowid": "p_6",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 17:35:36",
      //           "end_date": "2020-05-09 16:41:37",
      //           "reason": "22222222",
      //           "flowname": "报告归档",
      //           "flowid": "p_7",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400077,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-09 16:41:37",
      //           "end_date": "",
      //           "reason": "",
      //           "flowname": "任务信息审核",
      //           "flowid": "p_10",
      //           "name": "系统权限"
      //         }
      //       ],
      //       "workFlowNodeInfoVOList": [
      //         {
      //           "id": "p_10",
      //           "name": "任务信息审核",
      //           "documentation": "{\"process_instance_id\":\"10\",\"is_jump\":\"0\",\"seq\":\"2\"}",
      //           "sort": 2,
      //           "isCurrent": 1,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": "xtqx",
      //           "assigneeName": "系统权限",
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_11",
      //           "name": "计划科分配科室",
      //           "documentation": "{\"process_instance_id\":\"11\",\"is_jump\":\"0\",\"seq\":\"3\"}",
      //           "sort": 3,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_2",
      //           "name": "科室主任分配",
      //           "documentation": "{\"process_instance_id\":\"2\",\"is_jump\":\"1\",\"seq\":\"4\"}",
      //           "sort": 4,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_12",
      //           "name": "主检分配",
      //           "documentation": "{\"process_instance_id\":\"12\",\"is_jump\":\"1\",\"seq\":\"5\"}",
      //           "sort": 5,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_13",
      //           "name": "上传原始记录",
      //           "documentation": "{\"process_instance_id\":\"13\",\"is_jump\":\"1\",\"seq\":\"6\"}",
      //           "sort": 6,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_14",
      //           "name": "原始记录审核",
      //           "documentation": "{\"process_instance_id\":\"14\",\"is_jump\":\"1\",\"seq\":\"7\"}",
      //           "sort": 7,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_3",
      //           "name": "报告编辑",
      //           "documentation": "{\"process_instance_id\":\"3\",\"is_jump\":\"1\",\"seq\":\"8\"}",
      //           "sort": 8,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_4",
      //           "name": "报告校核",
      //           "documentation": "{\"process_instance_id\":\"4\",\"is_jump\":\"1\",\"seq\":\"9\"}",
      //           "sort": 9,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_5",
      //           "name": "报告审核",
      //           "documentation": "{\"process_instance_id\":\"5\",\"is_jump\":\"1\",\"seq\":\"10\"}",
      //           "sort": 10,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_6",
      //           "name": "报告批准",
      //           "documentation": "{\"process_instance_id\":\"6\",\"is_jump\":\"1\",\"seq\":\"11\"}",
      //           "sort": 11,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_7",
      //           "name": "报告归档",
      //           "documentation": "{\"process_instance_id\":\"7\",\"is_jump\":\"1\",\"seq\":\"12\"}",
      //           "sort": 12,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_15",
      //           "name": "等待报告归档",
      //           "documentation": "{\"process_instance_id\":\"15\",\"is_jump\":\"0\",\"seq\":\"13\"}",
      //           "sort": 13,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         }
      //       ],
      //       "nodeVOList": [
      //         {
      //           "id": "p_1",
      //           "name": "任务草稿",
      //           "documentation": "{\"process_instance_id\":\"1\",\"is_jump\":\"0\",\"seq\":\"1\"}",
      //           "sort": 1
      //         },
      //         {
      //           "id": "p_10",
      //           "name": "任务信息审核",
      //           "documentation": "{\"process_instance_id\":\"10\",\"is_jump\":\"0\",\"seq\":\"2\"}",
      //           "sort": 2
      //         },
      //         {
      //           "id": "p_11",
      //           "name": "计划科分配科室",
      //           "documentation": "{\"process_instance_id\":\"11\",\"is_jump\":\"0\",\"seq\":\"3\"}",
      //           "sort": 3
      //         },
      //         {
      //           "id": "p_2",
      //           "name": "科室主任分配",
      //           "documentation": "{\"process_instance_id\":\"2\",\"is_jump\":\"1\",\"seq\":\"4\"}",
      //           "sort": 4
      //         },
      //         {
      //           "id": "p_12",
      //           "name": "主检分配",
      //           "documentation": "{\"process_instance_id\":\"12\",\"is_jump\":\"1\",\"seq\":\"5\"}",
      //           "sort": 5
      //         },
      //         {
      //           "id": "p_13",
      //           "name": "上传原始记录",
      //           "documentation": "{\"process_instance_id\":\"13\",\"is_jump\":\"1\",\"seq\":\"6\"}",
      //           "sort": 6
      //         },
      //         {
      //           "id": "p_14",
      //           "name": "原始记录审核",
      //           "documentation": "{\"process_instance_id\":\"14\",\"is_jump\":\"1\",\"seq\":\"7\"}",
      //           "sort": 7
      //         },
      //         {
      //           "id": "p_3",
      //           "name": "报告编辑",
      //           "documentation": "{\"process_instance_id\":\"3\",\"is_jump\":\"1\",\"seq\":\"8\"}",
      //           "sort": 8
      //         },
      //         {
      //           "id": "p_4",
      //           "name": "报告校核",
      //           "documentation": "{\"process_instance_id\":\"4\",\"is_jump\":\"1\",\"seq\":\"9\"}",
      //           "sort": 9
      //         },
      //         {
      //           "id": "p_5",
      //           "name": "报告审核",
      //           "documentation": "{\"process_instance_id\":\"5\",\"is_jump\":\"1\",\"seq\":\"10\"}",
      //           "sort": 10
      //         },
      //         {
      //           "id": "p_6",
      //           "name": "报告批准",
      //           "documentation": "{\"process_instance_id\":\"6\",\"is_jump\":\"1\",\"seq\":\"11\"}",
      //           "sort": 11
      //         },
      //         {
      //           "id": "p_7",
      //           "name": "报告归档",
      //           "documentation": "{\"process_instance_id\":\"7\",\"is_jump\":\"1\",\"seq\":\"12\"}",
      //           "sort": 12
      //         },
      //         {
      //           "id": "p_15",
      //           "name": "等待报告归档",
      //           "documentation": "{\"process_instance_id\":\"15\",\"is_jump\":\"0\",\"seq\":\"13\"}",
      //           "sort": 13
      //         }
      //       ],
      //       "seq": 2,
      //       "process_instance_id": 10,
      //       "inspectid": 2400077
      //     },
      //     {
      //       "itemsCode": "1588923893036",
      //       "workLogVOList": [
      //         {
      //           "inspectid": 2400078,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 15:45:03",
      //           "end_date": "2020-05-08 15:46:05",
      //           "reason": "",
      //           "flowname": "任务草稿",
      //           "flowid": "p_1",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400078,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 15:46:05",
      //           "end_date": "2020-05-08 15:48:33",
      //           "reason": "",
      //           "flowname": "任务信息审核",
      //           "flowid": "p_10",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400078,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 15:48:33",
      //           "end_date": "2020-05-08 16:09:47",
      //           "reason": "",
      //           "flowname": "计划科分配科室",
      //           "flowid": "p_11",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400078,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:09:47",
      //           "end_date": "2020-05-08 16:10:05",
      //           "reason": "",
      //           "flowname": "科室主任分配",
      //           "flowid": "p_2",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400078,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:10:05",
      //           "end_date": "2020-05-08 16:10:34",
      //           "reason": "",
      //           "flowname": "主检分配",
      //           "flowid": "p_12",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400078,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:10:34",
      //           "end_date": "2020-05-08 16:12:11",
      //           "reason": "",
      //           "flowname": "上传原始记录",
      //           "flowid": "p_13",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400078,
      //           "updator": "zcfp",
      //           "create_date": "2020-05-08 16:12:11",
      //           "end_date": "2020-05-08 16:26:32",
      //           "reason": "",
      //           "flowname": "原始记录审核",
      //           "flowid": "p_14",
      //           "name": "zcfp"
      //         },
      //         {
      //           "inspectid": 2400078,
      //           "updator": "jcbg",
      //           "create_date": "2020-05-08 16:26:32",
      //           "end_date": "2020-05-08 16:27:34",
      //           "reason": "未上传",
      //           "flowname": "报告编辑",
      //           "flowid": "p_3",
      //           "name": "jcbg"
      //         },
      //         {
      //           "inspectid": 2400078,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 16:27:34",
      //           "end_date": "2020-05-08 16:35:32",
      //           "reason": "",
      //           "flowname": "上传原始记录",
      //           "flowid": "p_13",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400078,
      //           "updator": "jcbg",
      //           "create_date": "2020-05-08 16:35:32",
      //           "end_date": "2020-05-10 08:32:32",
      //           "reason": "22222",
      //           "flowname": "报告编辑",
      //           "flowid": "p_3",
      //           "name": "jcbg"
      //         },
      //         {
      //           "inspectid": 2400078,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-10 08:32:32",
      //           "end_date": "",
      //           "reason": "",
      //           "flowname": "任务信息审核",
      //           "flowid": "p_10",
      //           "name": "系统权限"
      //         }
      //       ],
      //       "workFlowNodeInfoVOList": [
      //         {
      //           "id": "p_10",
      //           "name": "任务信息审核",
      //           "documentation": "{\"process_instance_id\":\"10\",\"is_jump\":\"0\",\"seq\":\"2\"}",
      //           "sort": 2,
      //           "isCurrent": 1,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": "xtqx",
      //           "assigneeName": "系统权限",
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_11",
      //           "name": "计划科分配科室",
      //           "documentation": "{\"process_instance_id\":\"11\",\"is_jump\":\"0\",\"seq\":\"3\"}",
      //           "sort": 3,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_2",
      //           "name": "科室主任分配",
      //           "documentation": "{\"process_instance_id\":\"2\",\"is_jump\":\"1\",\"seq\":\"4\"}",
      //           "sort": 4,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_12",
      //           "name": "主检分配",
      //           "documentation": "{\"process_instance_id\":\"12\",\"is_jump\":\"1\",\"seq\":\"5\"}",
      //           "sort": 5,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_13",
      //           "name": "上传原始记录",
      //           "documentation": "{\"process_instance_id\":\"13\",\"is_jump\":\"1\",\"seq\":\"6\"}",
      //           "sort": 6,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_14",
      //           "name": "原始记录审核",
      //           "documentation": "{\"process_instance_id\":\"14\",\"is_jump\":\"1\",\"seq\":\"7\"}",
      //           "sort": 7,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_3",
      //           "name": "报告编辑",
      //           "documentation": "{\"process_instance_id\":\"3\",\"is_jump\":\"1\",\"seq\":\"8\"}",
      //           "sort": 8,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_4",
      //           "name": "报告校核",
      //           "documentation": "{\"process_instance_id\":\"4\",\"is_jump\":\"1\",\"seq\":\"9\"}",
      //           "sort": 9,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_5",
      //           "name": "报告审核",
      //           "documentation": "{\"process_instance_id\":\"5\",\"is_jump\":\"1\",\"seq\":\"10\"}",
      //           "sort": 10,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_6",
      //           "name": "报告批准",
      //           "documentation": "{\"process_instance_id\":\"6\",\"is_jump\":\"1\",\"seq\":\"11\"}",
      //           "sort": 11,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_7",
      //           "name": "报告归档",
      //           "documentation": "{\"process_instance_id\":\"7\",\"is_jump\":\"1\",\"seq\":\"12\"}",
      //           "sort": 12,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_15",
      //           "name": "等待报告归档",
      //           "documentation": "{\"process_instance_id\":\"15\",\"is_jump\":\"0\",\"seq\":\"13\"}",
      //           "sort": 13,
      //           "isCurrent": 0,
      //           "isPass": 0,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         }
      //       ],
      //       "nodeVOList": [
      //         {
      //           "id": "p_1",
      //           "name": "任务草稿",
      //           "documentation": "{\"process_instance_id\":\"1\",\"is_jump\":\"0\",\"seq\":\"1\"}",
      //           "sort": 1
      //         },
      //         {
      //           "id": "p_10",
      //           "name": "任务信息审核",
      //           "documentation": "{\"process_instance_id\":\"10\",\"is_jump\":\"0\",\"seq\":\"2\"}",
      //           "sort": 2
      //         },
      //         {
      //           "id": "p_11",
      //           "name": "计划科分配科室",
      //           "documentation": "{\"process_instance_id\":\"11\",\"is_jump\":\"0\",\"seq\":\"3\"}",
      //           "sort": 3
      //         },
      //         {
      //           "id": "p_2",
      //           "name": "科室主任分配",
      //           "documentation": "{\"process_instance_id\":\"2\",\"is_jump\":\"1\",\"seq\":\"4\"}",
      //           "sort": 4
      //         },
      //         {
      //           "id": "p_12",
      //           "name": "主检分配",
      //           "documentation": "{\"process_instance_id\":\"12\",\"is_jump\":\"1\",\"seq\":\"5\"}",
      //           "sort": 5
      //         },
      //         {
      //           "id": "p_13",
      //           "name": "上传原始记录",
      //           "documentation": "{\"process_instance_id\":\"13\",\"is_jump\":\"1\",\"seq\":\"6\"}",
      //           "sort": 6
      //         },
      //         {
      //           "id": "p_14",
      //           "name": "原始记录审核",
      //           "documentation": "{\"process_instance_id\":\"14\",\"is_jump\":\"1\",\"seq\":\"7\"}",
      //           "sort": 7
      //         },
      //         {
      //           "id": "p_3",
      //           "name": "报告编辑",
      //           "documentation": "{\"process_instance_id\":\"3\",\"is_jump\":\"1\",\"seq\":\"8\"}",
      //           "sort": 8
      //         },
      //         {
      //           "id": "p_4",
      //           "name": "报告校核",
      //           "documentation": "{\"process_instance_id\":\"4\",\"is_jump\":\"1\",\"seq\":\"9\"}",
      //           "sort": 9
      //         },
      //         {
      //           "id": "p_5",
      //           "name": "报告审核",
      //           "documentation": "{\"process_instance_id\":\"5\",\"is_jump\":\"1\",\"seq\":\"10\"}",
      //           "sort": 10
      //         },
      //         {
      //           "id": "p_6",
      //           "name": "报告批准",
      //           "documentation": "{\"process_instance_id\":\"6\",\"is_jump\":\"1\",\"seq\":\"11\"}",
      //           "sort": 11
      //         },
      //         {
      //           "id": "p_7",
      //           "name": "报告归档",
      //           "documentation": "{\"process_instance_id\":\"7\",\"is_jump\":\"1\",\"seq\":\"12\"}",
      //           "sort": 12
      //         },
      //         {
      //           "id": "p_15",
      //           "name": "等待报告归档",
      //           "documentation": "{\"process_instance_id\":\"15\",\"is_jump\":\"0\",\"seq\":\"13\"}",
      //           "sort": 13
      //         }
      //       ],
      //       "seq": 2,
      //       "process_instance_id": 10,
      //       "inspectid": 2400078
      //     },
      //     {
      //       "itemsCode": "MT20DEV1A081A",
      //       "workLogVOList": [
      //         {
      //           "inspectid": 2400075,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 15:45:02",
      //           "end_date": "2020-05-08 15:46:05",
      //           "reason": "",
      //           "flowname": "任务草稿",
      //           "flowid": "p_1",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400075,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 15:46:05",
      //           "end_date": "2020-05-08 15:48:32",
      //           "reason": "",
      //           "flowname": "任务信息审核",
      //           "flowid": "p_10",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400075,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 15:48:32",
      //           "end_date": "2020-05-08 15:49:09",
      //           "reason": "错误报告",
      //           "flowname": "计划科分配科室",
      //           "flowid": "p_11",
      //           "name": "系统权限"
      //         },
      //         {
      //           "inspectid": 2400075,
      //           "updator": "xtqx",
      //           "create_date": "2020-05-08 15:49:09",
      //           "end_date": "",
      //           "reason": "",
      //           "flowname": "任务草稿",
      //           "flowid": "p_1",
      //           "name": "系统权限"
      //         }
      //       ],
      //       "workFlowNodeInfoVOList": [
      //         {
      //           "id": "p_10",
      //           "name": "任务信息审核",
      //           "documentation": "{\"process_instance_id\":\"10\",\"is_jump\":\"0\",\"seq\":\"2\"}",
      //           "sort": 2,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": "xtqx",
      //           "assigneeName": "系统权限",
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_11",
      //           "name": "计划科分配科室",
      //           "documentation": "{\"process_instance_id\":\"11\",\"is_jump\":\"0\",\"seq\":\"3\"}",
      //           "sort": 3,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": "xtqx",
      //           "assigneeName": "系统权限",
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_2",
      //           "name": "科室主任分配",
      //           "documentation": "{\"process_instance_id\":\"2\",\"is_jump\":\"1\",\"seq\":\"4\"}",
      //           "sort": 4,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_12",
      //           "name": "主检分配",
      //           "documentation": "{\"process_instance_id\":\"12\",\"is_jump\":\"1\",\"seq\":\"5\"}",
      //           "sort": 5,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_13",
      //           "name": "上传原始记录",
      //           "documentation": "{\"process_instance_id\":\"13\",\"is_jump\":\"1\",\"seq\":\"6\"}",
      //           "sort": 6,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_14",
      //           "name": "原始记录审核",
      //           "documentation": "{\"process_instance_id\":\"14\",\"is_jump\":\"1\",\"seq\":\"7\"}",
      //           "sort": 7,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_3",
      //           "name": "报告编辑",
      //           "documentation": "{\"process_instance_id\":\"3\",\"is_jump\":\"1\",\"seq\":\"8\"}",
      //           "sort": 8,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_4",
      //           "name": "报告校核",
      //           "documentation": "{\"process_instance_id\":\"4\",\"is_jump\":\"1\",\"seq\":\"9\"}",
      //           "sort": 9,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_5",
      //           "name": "报告审核",
      //           "documentation": "{\"process_instance_id\":\"5\",\"is_jump\":\"1\",\"seq\":\"10\"}",
      //           "sort": 10,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_6",
      //           "name": "报告批准",
      //           "documentation": "{\"process_instance_id\":\"6\",\"is_jump\":\"1\",\"seq\":\"11\"}",
      //           "sort": 11,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_7",
      //           "name": "报告归档",
      //           "documentation": "{\"process_instance_id\":\"7\",\"is_jump\":\"1\",\"seq\":\"12\"}",
      //           "sort": 12,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         },
      //         {
      //           "id": "p_15",
      //           "name": "等待报告归档",
      //           "documentation": "{\"process_instance_id\":\"15\",\"is_jump\":\"0\",\"seq\":\"13\"}",
      //           "sort": 13,
      //           "isCurrent": 0,
      //           "isPass": 1,
      //           "isShow": 1,
      //           "assignee": null,
      //           "assigneeName": null,
      //           "end_date": null
      //         }
      //       ],
      //       "nodeVOList": [
      //         {
      //           "id": "p_1",
      //           "name": "任务草稿",
      //           "documentation": "{\"process_instance_id\":\"1\",\"is_jump\":\"0\",\"seq\":\"1\"}",
      //           "sort": 1
      //         },
      //         {
      //           "id": "p_10",
      //           "name": "任务信息审核",
      //           "documentation": "{\"process_instance_id\":\"10\",\"is_jump\":\"0\",\"seq\":\"2\"}",
      //           "sort": 2
      //         },
      //         {
      //           "id": "p_11",
      //           "name": "计划科分配科室",
      //           "documentation": "{\"process_instance_id\":\"11\",\"is_jump\":\"0\",\"seq\":\"3\"}",
      //           "sort": 3
      //         },
      //         {
      //           "id": "p_2",
      //           "name": "科室主任分配",
      //           "documentation": "{\"process_instance_id\":\"2\",\"is_jump\":\"1\",\"seq\":\"4\"}",
      //           "sort": 4
      //         },
      //         {
      //           "id": "p_12",
      //           "name": "主检分配",
      //           "documentation": "{\"process_instance_id\":\"12\",\"is_jump\":\"1\",\"seq\":\"5\"}",
      //           "sort": 5
      //         },
      //         {
      //           "id": "p_13",
      //           "name": "上传原始记录",
      //           "documentation": "{\"process_instance_id\":\"13\",\"is_jump\":\"1\",\"seq\":\"6\"}",
      //           "sort": 6
      //         },
      //         {
      //           "id": "p_14",
      //           "name": "原始记录审核",
      //           "documentation": "{\"process_instance_id\":\"14\",\"is_jump\":\"1\",\"seq\":\"7\"}",
      //           "sort": 7
      //         },
      //         {
      //           "id": "p_3",
      //           "name": "报告编辑",
      //           "documentation": "{\"process_instance_id\":\"3\",\"is_jump\":\"1\",\"seq\":\"8\"}",
      //           "sort": 8
      //         },
      //         {
      //           "id": "p_4",
      //           "name": "报告校核",
      //           "documentation": "{\"process_instance_id\":\"4\",\"is_jump\":\"1\",\"seq\":\"9\"}",
      //           "sort": 9
      //         },
      //         {
      //           "id": "p_5",
      //           "name": "报告审核",
      //           "documentation": "{\"process_instance_id\":\"5\",\"is_jump\":\"1\",\"seq\":\"10\"}",
      //           "sort": 10
      //         },
      //         {
      //           "id": "p_6",
      //           "name": "报告批准",
      //           "documentation": "{\"process_instance_id\":\"6\",\"is_jump\":\"1\",\"seq\":\"11\"}",
      //           "sort": 11
      //         },
      //         {
      //           "id": "p_7",
      //           "name": "报告归档",
      //           "documentation": "{\"process_instance_id\":\"7\",\"is_jump\":\"1\",\"seq\":\"12\"}",
      //           "sort": 12
      //         },
      //         {
      //           "id": "p_15",
      //           "name": "等待报告归档",
      //           "documentation": "{\"process_instance_id\":\"15\",\"is_jump\":\"0\",\"seq\":\"13\"}",
      //           "sort": 13
      //         }
      //       ],
      //       "seq": 0,
      //       "process_instance_id": null,
      //       "inspectid": 2400075
      //     }
      //   ],
      //   "ok": true,
      //   "message": ""
      // }
      // this.dataSource = res.data
    },
    beforeDestroy () {
      // this.$EventBus.$off('GET_procssInfo')
    }
  }
</script>

<style lang="less">
  #processInfor-box {
    #tab-class1 {
      li:hover {
        color: #409EFF;
        cursor: pointer;
      }
    }

    .EChartsRoom {
      .mly-ball {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #e2e3e3;
        display: inline-block;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        /*cursor: pointer;*/
        cursor: default;

        i {
          cursor: default;
          display: inline-block;
          position: absolute;
          left: 12px;
          width: 136px;
          height: 6px;
          margin-top: 2px;
          background-color: skyblue;
          /*opacity: 0.3;*/
        }
      }
    }

    .result-class1{
      i{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }
  }

  /*  .processInfor-box{*/
  /*    .tab-class1{*/
  /*      li:hover{*/
  /*        color: #409EFF;*/
  /*        cursor: pointer;*/
  /*      }*/
  /*    }*/
  /*  }*/
  .activeClass_1 {
    color: #409EFF;
  }
</style>
