<template>
    <!-- 查看任务 -->
    <div class="seetask_border">
        <div class="con_left">
            <!-- 表单区域 -->
            <div class="form_modular">
               <div class="form_btn">
                    <span>{{seeTaskRow.initiatorName}} {{seeTaskRow.processStartTimeStr}}</span>
                    <p>
                        <el-button type="text" @click="detailLogVisible = true"><i class="el-icon-date">明细日志</i></el-button>
                    </p>
               </div>
               <el-tabs type="border-card" class="form_card" v-model="seeActiveName">
                    <el-tab-pane label="正文" name="text" id="text_html"></el-tab-pane>
                    <el-tab-pane label="流程" name="flow" id="flow_html"></el-tab-pane>
                </el-tabs>
            </div>
            <!-- 处理人意见区 -->
            <div class="opinion_area">
                <p class="opinion_btn">
                    <span class="opinion_btnTitle"><i class="el-icon-chat-dot-square"></i>处理人意见区</span>
                    <el-button type="text" @click="opinionState = !opinionState">
                        <i class="el-icon-arrow-up" v-show="!opinionState"></i>
                        <i class="el-icon-arrow-down" v-show="opinionState"></i>
                    </el-button>
                </p>
                <el-collapse-transition>
                    <ul class="opinion_list" v-show="opinionState">
                        <li v-show="opinionList.length < 1" style="textAlign:center;padding: 15px 0;">暂无数据</li>
                        <li class="opinion_item" v-for="(item,i) in opinionList" :key="i" v-show="item.status != '0'">
                            <img src="@/assets/images/avatar.png" class="opinion_itemImg" />
                            <p class="opinion_itemCon">
                                <span class="opinion_itemConTitle">{{item.assigneeName}} 已阅 {{item.finishTimeStr}}</span>
                                <span class="opinion_itemConInfo">{{item.comment ? item.comment : '暂无意见'}}</span>
                            </p>
                        </li>
                    </ul>
                </el-collapse-transition>
            </div>
        </div>

        <!-- 明细日志 -->
        <el-dialog :modal="false" width="90%" title="明细日志" class="dialog_detailLog"
            :visible.sync="detailLogVisible" 
            :close-on-click-modal="false" :close-on-press-escape="false" >
            <detaillog :detailLogVisible="detailLogVisible" :taskRow="taskRow"/>
        </el-dialog>
    </div>
</template>

<script>
import '@/assets/css/pending_tasks.css';
import detaillog from './detailLog';
import FormHandle from '@/assets/js/FormHandle.js';
export default {
    name: 'seetask',
    components: {detaillog},
    props: ['seeTaskApi', 'seeVal', 'seeTaskVisible', 'seeTaskRow'],
    watch: {
        seeTaskVisible: {
            immediate:true,
            handler(val) {
                if(val) {
                    this.obtainData();
                }
            },
        },
    },
    data() {
        return {
            taskRow: {},
            seeActiveName: 'text', // 默认显示页面
            detailLogVisible: false, // 明细日志-显示状态
            opinionState: true, // 处理人意见区-显示状态
            opinionList: [], // 处理人意见区-列表数据
        }
    },
    created() {},
    mounted() {
        
    },
    methods: {
        // 获取数据
        obtainData() {
            this.taskRow = this.seeTaskRow;
            this.seeActiveName = 'text';
            $('#text_html').html('');
            $('#flow_html').html('');
            this.opinionList = [];

            let rowData = this.seeTaskRow;
            if(rowData[this.seeTaskApi.id]) {
                // 获取待办任务正文表单数据
                if (rowData.hasOwnProperty('formKey') && rowData.formKey!=null && rowData.formKey.indexOf('.html') > 0) {
                    // 动态加载 正文表格内容
                    $("#text_html").load(rowData.formKey);
                } else {
                    this.$api.flowcheng[this.seeTaskApi.api](rowData[this.seeTaskApi.id]).then(res => {
                        // console.log(res,'res');
                        // 先将表单结构填入容器
                        $('#text_html').html(FormHandle.formatHtml(res.data.data.structure));
                        FormHandle.expandHtmlViewer('#text_html', JSON.parse(res.data.data.data));
                        // 获取权限信息
                        FormHandle.formatPrivReadonly('#text_html', JSON.parse(res.data.data.privilege));
                        // 填入数据
                        FormHandle.formdataUpdate('#text_html', JSON.parse(res.data.data.data));
                    }).catch(error => {
                        console.log(error,'error');
                        $('#text_html').html('');
                        this.$message.error(this.seeVal+'任务正文加载失败：'+error.data.message);
                    });
                }


                // 获取-流程
                let flowParams = {
                    processInstanceId: rowData.processInstanceId
                }
                this.$api.flowcheng.progressImageData(flowParams).then(res => {
                    // console.log(res,'流程');
                    var timelineData = res.data.data,
                        timelineHtml = '<ul class="task-timeline">';
                    if (timelineData.length > 0) {
                        timelineData.reverse();
                    }
                    // console.log(timelineData, 'timelineData');
                    // 将流程制作为 HTML
                    for (var i = 0; i < timelineData.length; i++) {
                        var item = timelineData[i],
                            ccTaskItems = item.ccTaskItems;
                        if (ccTaskItems.length === 1) {
                            // 简单串行流程
                            var tmp = ccTaskItems[0],
                                // 处理时间
                                // 对日期时间字符串做格式校验
                                tmpDealTime =
                                /^[1-9]\d{3}-(0[1-9]|1[0-2]|[1-9])-(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/
                                .test(tmp.dealTime) ? tmp.dealTime.split(' ') : item.status === 1 ? [
                                    '', '<span style="color: #F14E10;">处理中</span>'
                                ] : ['', '尚未处理'],
                                // 处理人姓名
                                tmpAssigneeRealName = tmp.assigneeRealName ? tmp.assigneeRealName :
                                '【未指定】',
                                // 备注，处理意见
                                tmpRemark = tmp.remark ? tmp.remark : '暂无处理意见',
                                // 状态
                                tmpStatus = item.status,
                                // 任务名
                                tmpTaskDefName = tmp.taskDefName;
                            timelineHtml += '<li class="task-timeline-item task-timeline-status' +
                                tmpStatus + '"><div class="task-timeline-time"><h1>' + tmpDealTime[
                                    0] + '</h1><h5>' + tmpDealTime[1] +
                                '</h5></div><div class="task-timeline-axis"><span>' + (i + 1) +
                                '</span></div><div class="task-timeline-content"><div class="task-timeline-header">' +
                                tmpTaskDefName + ' - ' + tmpAssigneeRealName +
                                '</div><div class="task-timeline-body">' + tmpRemark +
                                '</div></div></li>';
                        } else if (ccTaskItems.length > 1) {
                            // 并行流程
                            var arrDealTime = [];
                            for (var k = 0; k < ccTaskItems.length; k++) {
                                arrDealTime.push(ccTaskItems[k].dealTime);
                            }
                            // DONE: 将时间排序，时间越晚越靠前
                            // TODO: 兼容 IE
                            arrDealTime.sort(function (a, b) {
                                if (a === '' && b === '') {
                                    return 0;
                                } else if (a === '') {
                                    return 1;
                                } else if (b === '') {
                                    return -1;
                                } else {
                                    a = new Date(a).getTime();
                                    b = new Date(b).getTime();
                                    return b - a;
                                }
                            });
                            tmpDealTime =
                                /^[1-9]\d{3}-(0[1-9]|1[0-2]|[1-9])-(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/
                                .test(arrDealTime[0]) ? arrDealTime[0].split(' ') : item.status === 1 ? [
                                    '', '<span style="color: #F14E10;">处理中</span>'
                                ] : ['', '尚未处理'];
                            timelineHtml += '<li class="task-timeline-item task-timeline-status' +
                                item.status + '"><div class="task-timeline-time"><h1>' +
                                tmpDealTime[0] + '</h1><h5>' + tmpDealTime[1] +
                                '</h5></div><div class="task-timeline-axis"><span>' + (i + 1) +
                                '</span></div><div class="task-timeline-content">';
                            for (var j = 0; j < ccTaskItems.length; j++) {
                                var tmp = ccTaskItems[j],
                                    // 处理人姓名
                                    tmpAssigneeRealName = tmp.assigneeRealName ? tmp.assigneeRealName :
                                    '【未指定】',
                                    // 备注，处理意见
                                    tmpRemark = tmp.remark ? tmp.remark : '暂无处理意见',
                                    // 状态
                                    tmpStatus = tmp.status,
                                    // 任务名
                                    tmpTaskDefName = tmp.taskDefName;
                                timelineHtml += '<div class="task-timeline-status' + tmpStatus +
                                    '-important"><div class="task-timeline-header">' +
                                    tmpTaskDefName +
                                    ' - ' + tmpAssigneeRealName +
                                    '</div><div class="task-timeline-body">' + tmpRemark +
                                    '</div></div>';
                            }
                            timelineHtml += '</div></li>';
                        }
                    }

                    timelineHtml += '</ul>';
                    $('#flow_html').html(timelineHtml);
                }).catch(error => {
                    console.log(error,'error');
                    $('#flow_html').html('');
                    this.$message.error('待办任务处理人意见加载失败！');
                });

                // 获取-处理人意见区-列表数据
                let params = {
                    processInstanceId: rowData.processInstanceId
                }
                this.$api.flowcheng.processingRecords(params).then(res => {
                    // console.log(res,'res');
                    this.opinionList = res.data.data;
                    this.opinionState = true;
                }).catch(error => {
                    console.log(error,'error');
                    this.$message.error(this.seeVal+'任务处理人意见加载失败！');
                    this.opinionList = [];
                    this.opinionState = true;
                });
            }
        },
    }
}
</script>
<style scoped lang="less">
.el-button--default {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    background: #fff;
    border-radius: 4px;
}
.el-button--primary {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
    border-radius: 4px;
}
.el-button--text {
    color: #32AFF0;
}
p {
    padding: 0;
    margin: 0;
}
.seetask_border {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
}
.con_left {
    flex: 1;
    padding: 20px 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}

// 表单区域
.form_modular {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .form_btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-icon-date:before {
            margin-right: 5px;
        }
        .el-icon-d-arrow-left {
            font-size: 18px;
        }
    }
    .form_card {
        flex: 1;
        margin: 20px 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        /deep/ .el-tabs__content {
            flex: 1;
            overflow: hidden;
            padding: 0;
            .el-tab-pane {
                padding: 20px;
                width: 100%;
                height: 100%;
                overflow: auto;
            }
        }
    }
}

// 处理人意见区
.opinion_area {
    .opinion_btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .opinion_btnTitle {
            border: none;
            font-size: 16px;
            line-height: 40px;
            .el-icon-chat-dot-square{
                font-size: 18px;
                margin-right: 5px;
            }
        }
        .el-icon-arrow-up {
            font-size: 18px;
        }
    }
    // 意见列表
    .opinion_list {
        height: 200px;
        overflow-y: auto;
        margin: 0;
        margin-top: 10px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        .opinion_item {
            display: flex;
            padding: 10px;
            .opinion_itemImg {
                display: block;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: #eee;
                margin-right: 10px;
            }
            .opinion_itemCon {
                flex: 1;
                .opinion_itemConTitle {
                    display: block;
                    height: 30px;
                    line-height: 30px;
                }
                .opinion_itemConInfo {
                    display: block;
                    padding-top: 10px;
                }
            }
        }
    }
}

// 明细日志
/deep/ .dialog_detailLog {
    overflow: hidden;
    .el-dialog {
        margin:0 !important;
        padding: 0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        height: 90%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            padding: 20px !important;
            overflow: hidden;
        }
    }
}
</style>