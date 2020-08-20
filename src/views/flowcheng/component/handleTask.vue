<template>
    <!-- 处理任务 -->
    <div class="handletask_border">
        <div class="con_left">
            <!-- 表单区域 -->
            <div class="form_modular">
               <div class="form_btn">
                    <span>受理人：{{handleTaskRow.assigneeName}} 任务创建时间：{{handleTaskRow.createTimeStr}}
                        <el-button type="text" @click="depVisible = true">部门</el-button>
                    </span>
                    <p>
                        <el-button type="text" @click="detailLogVisible = true"><i class="el-icon-date">明细日志</i></el-button>
                        <el-button type="text" @click="submitState = true">
                            <i class="el-icon-d-arrow-left" v-show="!submitState"></i>
                        </el-button>
                    </p>
               </div>
               <el-tabs type="border-card" class="form_card" v-model="activeName">
                    <el-tab-pane label="正文" name="text" id="task_html"></el-tab-pane>
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
                                <span class="opinion_itemConTitle">{{item.assigneeName}} 已处理 {{item.finishTimeStr}}</span>
                                <span class="opinion_itemConInfo">{{item.comment ? item.comment : '暂无意见'}}</span>
                            </p>
                        </li>
                    </ul>
                </el-collapse-transition>
            </div>
        </div>
        <!-- 右侧-意见反馈-提交 -->
        <el-collapse-transition>
            <div class="con_right" v-show="submitState">
                <el-button type="text" @click="submitState = false">
                    <i class="el-icon-d-arrow-right">协同</i>
                </el-button>
                <div>
                    <!-- 操作按钮 -->
                    <el-button type="text" @click="transferVisible = true">转办</el-button>
                    <el-button type="text" @click="onSpecifyFallback">指定回退</el-button>
                </div>
                <!-- 编辑-意见反馈区 -->
                <div class="feedback_modular">
                    <el-radio-group v-model="choiceRadio" class="feedback_choice">
                        <el-radio v-for="(item,i) in choiceList" :key="i" :label="item.code">{{item.name}}</el-radio>
                    </el-radio-group>
                    <el-dropdown trigger="click" placement="bottom" @command="val => feedbackInp = val">
                        <el-button type="text" style="color:#606266;" class="feedback_btn">常用语</el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item,i) in wordsList" :key="i" :command="item">{{item}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-input type="textarea" :rows="8" v-model.trim="feedbackInp" placeholder="请输入意见反馈" class="feedback_inp"></el-input>
                    <el-button type="primary" class="feedback_btn" @click="onSubmit">提交</el-button>
                </div>
            </div>
        </el-collapse-transition>


        <!-- 明细日志 -->
        <el-dialog :modal="false" width="90%" title="明细日志" class="dialog_detailLog"
            :visible.sync="detailLogVisible" 
            :close-on-click-modal="false" :close-on-press-escape="false" >
            <detaillog :detailLogVisible="detailLogVisible" :taskRow="taskRow"/>
        </el-dialog>

        <!-- 转办 -->
        <el-dialog :modal="false" width="30%" title="转办" class="dialog_transfer"
            :visible.sync="transferVisible" :before-close="transferClose"
            :close-on-click-modal="false" :close-on-press-escape="false" >
            <div class="transfer_con">
                请选择人员：
                <div class="transfer_div" @click.stop="peopleVisible = true">
                    <el-input v-model="transferInput" class="transfer_input" placeholder="点击选择人员"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="transferClose">取 消</el-button>
                <el-button type="primary" @click="transferOk">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 指定回退 -->
        <el-dialog :modal="false" width="90%" title="跳转节点选择" class="dialog_fallback"
            :visible.sync="fallbackVisible" :before-close="onFallbackClose"
            :close-on-click-modal="false" :close-on-press-escape="false" >
            <div class="fallback_con">
               <el-table border stripe ref="table" :data="fallbackData" @current-change="onFallbackRadio"
                    :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">
                    <el-table-column align="center" :resizable="false" width="60" label="#">
                        <template slot-scope="scope">
                            <el-radio v-model="fallbackRadio" :label="scope.row"><i></i></el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :resizable="false" label="序号" type="index" width="100"></el-table-column>
                    <el-table-column :resizable="false" prop="name" label="节点名称"></el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="onFallbackClose">取 消</el-button>
                <el-button type="primary" @click="onFallbackOk">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 选择用户 -->
        <personnelrole v-bind="{
            'modal': false, 'width': '80%',
            'flag': transferVisible,
            'peopleVisible': peopleVisible
        }" @userDetermine="onUserDetermine"/>

        <!-- 选择部门 -->
        <department v-bind="{
            'modal': false, 'width': '80%',
            'flag': depVisible,
            'depVisible': depVisible
        }" @depClose="onDepClose"/>


    </div>
</template>

<script>
import '@/assets/css/pending_tasks.css';
import detaillog from './detailLog';
import personnelrole from '@/components/personnelRole';
import department from '@/components/department';
import FormHandle from '@/assets/js/FormHandle.js';
export default {
    name: 'handletask',
    components: {detaillog,personnelrole, department},
    props: ['handleTaskVisible', 'handleTaskRow'],
    watch: {
        handleTaskVisible: {
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
            activeName: 'text', // 默认显示页面
            taskRow: {}, // 待办任务
            opinionState: true, // 处理人意见区-显示状态
            opinionList: [], // 处理人意见区-列表数据
            submitState: true, // 右侧-意见处理提交-显示状态
            choiceRadio: '', // 选择意见-默认值
            choiceList: [], // 选择意见-数据
            wordsList: ['同意','同意，按规定办理','按流程办理','交相关部门处理','按单位相关规章制度办理'], // 常用语
            feedbackInp: '', // 意见反馈-input
            detailLogVisible: false, // 明细日志-显示状态
            transferVisible: false, // 转办-显示状态
            transferInput: '', // 转办-绑定数据
            transferInputId: '', // 转办-绑定数据-id
            fallbackVisible: false, // 指定回退-显示状态
            fallbackData: [], // 指定回退-表格数据
            fallbackRadio: '', // 指定回退-表格单选选中数据
            peopleVisible: false, // 用户人员角色-显示状态

            depVisible: false,
        }
    },
    created() {},
    mounted() {
        
    },
    methods: {
        onDepClose(val) {
            console.log(val, 'val');
            this.depVisible = false;
        },


        // 获取数据
        obtainData() {
            this.activeName = 'text'; // 默认显示页面
            this.taskRow = this.handleTaskRow; // 待办任务
            this.choiceRadio = ''; // 选择意见-默认值
            this.feedbackInp = ''; // 意见反馈-input
            this.transferVisible = false; // 转办-显示状态
            this.transferInput = ''; // 转办-绑定数据
            this.transferInputId = ''; // 转办-绑定数据-id
            this.peopleVisible = false; // 用户人员角色-显示状态

            this.choiceList = []; // 选择意见-数据
            $('#task_html').html(''); // 获取-正文
            $('#flow_html').html(''); // 获取-流程
            this.opinionList = []; // 获取-处理人意见区-列表数据


            let rowData = this.handleTaskRow;
            if(rowData.id) {
                // 获取-操作选择数据
                this.$api.flowcheng.stayOperations(rowData.id).then(res => {
                    // console.log(res,'res');
                    this.choiceList = res.data.data;
                }).catch(error => {
                    console.log(error,'error');
                    this.choiceList = []; // 选择意见-数据
                });

                // 获取-正文
                if (rowData.hasOwnProperty('formKey') && rowData.formKey!=null && rowData.formKey.indexOf('.html') > 0) {
                    // 动态加载 正文表格内容
                    $("#task_html").load(rowData.formKey);
                } else {
                    this.$api.flowcheng.stayText(rowData.id).then(res => {
                        // console.log(res,'res');
                        // 先将表单结构填入容器
                        $('#task_html').html(FormHandle.formatHtml(res.data.data.structure));
                        FormHandle.expandHtmlViewer('#task_html', JSON.parse(res.data.data.data));
                        // 获取权限信息
                        FormHandle.formatPriv('#task_html', JSON.parse(res.data.data.privilege));
                        // 填入数据
                        FormHandle.formdataUpdate('#task_html', JSON.parse(res.data.data.data), JSON.parse(res.data.data.privilege));
                    }).catch(error => {
                        console.log(error,'error');
                        this.$message.error('待办任务正文加载失败：'+error.data.message);
                        $('#task_html').html('');
                    });
                }




                // 获取-流程
                let flowParams = {
                    processInstanceId: rowData.processInstanceId
                }
                this.$api.flowcheng.progressImageData(flowParams).then(res => {
                    // console.log(res,'res');
                    let timelineData = res.data.data;
                    let timelineHtml = '<ul class="task-timeline">';
                    if (timelineData.length > 0) {
                        timelineData.reverse();
                    }
                    // 将流程制作为 HTML
                    for (var i = 0; i < timelineData.length; i++) {
                        let row = timelineData[i];
                        let ccTaskItems = row.ccTaskItems;
                        let tmpDealTime = '';
                        if (ccTaskItems.length === 1) {
                            // 简单串行流程
                            // 处理时间
                            let item = ccTaskItems[0];
                            let regular = /^[1-9]\d{3}-(0[1-9]|1[0-2]|[1-9])-(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
                            // 对日期时间字符串做格式校验
                            tmpDealTime = regular.test(item.dealTime) ? item.dealTime.split(' ') : (row.status === 1 ? ['', '<span style="color: #F14E10;">处理中</span>'] : ['', '尚未处理']);
                            // 处理人姓名
                            let tmpAssigneeRealName = item.assigneeRealName ? item.assigneeRealName : '【未指定】'; 
                            // 备注，处理意见
                            let tmpRemark = item.remark ? item.remark : '暂无处理意见'; 
                            // 状态
                            let tmpStatus = row.status; 
                            // 任务名
                            let tmpTaskDefName = item.taskDefName;
                            timelineHtml += 
                                '<li class="task-timeline-item task-timeline-status' 
                                + tmpStatus + 
                                '"><div class="task-timeline-time"><h1>' 
                                + tmpDealTime[0] + 
                                '</h1><h5>' 
                                + tmpDealTime[1] + 
                                '</h5></div><div class="task-timeline-axis"><span>' 
                                + (i + 1) + 
                                '</span></div><div class="task-timeline-content"><div class="task-timeline-header">' 
                                + tmpTaskDefName + ' - ' 
                                + tmpAssigneeRealName +
                                '</div><div class="task-timeline-body">' 
                                + tmpRemark +
                                '</div></div></li>';
                        } else if (ccTaskItems.length > 1) {
                            // 并行流程
                            let arrDealTime = [];
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
                            let regular = /^[1-9]\d{3}-(0[1-9]|1[0-2]|[1-9])-(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
                            tmpDealTime = regular.test(arrDealTime[0]) ? arrDealTime[0].split(' ') : (row.status === 1 ? ['', '<span style="color: #F14E10;">处理中</span>'] : ['', '尚未处理']);
                            timelineHtml += 
                                '<li class="task-timeline-item task-timeline-status' 
                                + row.status + 
                                '"><div class="task-timeline-time"><h1>' 
                                + tmpDealTime[0] + 
                                '</h1><h5>' 
                                + tmpDealTime[1] +
                                '</h5></div><div class="task-timeline-axis"><span>' 
                                + (i + 1) +
                                '</span></div><div class="task-timeline-content">';
                            for (var j = 0; j < ccTaskItems.length; j++) {
                                let item = ccTaskItems[j];
                                // 处理人姓名
                                let tmpAssigneeRealName = item.assigneeRealName ? item.assigneeRealName : '【未指定】';
                                // 备注，处理意见
                                let tmpRemark = item.remark ? item.remark : '暂无处理意见';
                                // 状态
                                let tmpStatus = item.status;
                                // 任务名
                                let tmpTaskDefName = item.taskDefName;
                                timelineHtml += 
                                    '<div class="task-timeline-status' 
                                    + tmpStatus +
                                    '-important"><div class="task-timeline-header">' 
                                    + tmpTaskDefName + ' - ' 
                                    + tmpAssigneeRealName +
                                    '</div><div class="task-timeline-body">'
                                    + tmpRemark +
                                    '</div></div>';
                            }
                            timelineHtml += '</div></li>';
                        }
                    }

                    timelineHtml += '</ul>';
                    $('#flow_html').html(timelineHtml);
                }).catch(error => {
                    console.log(error,'error');
                    this.$message.error('待办任务流程加载失败！');
                    $('#flow_html').html('');
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
                    this.$message.error('待办任务处理人意见加载失败！');
                    this.opinionList = [];
                    this.opinionState = true;
                });
            }
        },
        // 转办-关闭
        transferClose() {
            this.transferVisible = false;
            this.transferInput = '';
            this.transferInputId = '';
        },
        // 转办-确定
        transferOk() {
            if(this.transferInput && this.transferInputId) {
                if (this.transferInput.indexOf(',') >= 0) {
                    this.$message.warning('转办只可选择一个人员！');
                } else {
                    let params = {
                        taskId: this.handleTaskRow.id,
                        assignee: this.transferInputId,
                        orignalAssignee: this.handleTaskRow.assignee
                    };
                    this.$api.flowcheng.transfer(params).then(res => {
                        // console.log(res,'转办');
                        this.$emit('handleTaskClose');
                        this.$message.success('转办成功！');
                        this.transferVisible = false;
                        this.transferInput = '';
                        this.transferInputId = '';
                    }).catch(error => {
                        console.log(error,'error');
                        this.$message.error(error.data.message);
                        this.transferVisible = false;
                        this.transferInput = '';
                        this.transferInputId = '';
                    });
                }
            } else {
                this.$message.warning('请选择人员！');
            }
        },
        // 选择用户-确定
        onUserDetermine(val) {
            this.peopleVisible = false;
            this.transferInput = '';
            this.transferInputId = '';
            if(val.length > 0) {
                val.forEach(item => {
                    this.transferInput += item.usname + ',';
                    this.transferInputId += item.usid + ',';
                });
                this.transferInput = this.transferInput.slice(0,this.transferInput.length-1);
                this.transferInputId = this.transferInputId.slice(0,this.transferInputId.length-1);
            }
        },
        // 指定回退-获取表格数据
        onSpecifyFallback() {
            this.fallbackVisible = true;
            this.$api.flowcheng.stayFallbackData(this.handleTaskRow.id).then(res => {
                // console.log(res,'跳转节点数据加载成功');
                this.fallbackData = res.data.data;
            }).catch(error => {
                console.log(error,'跳转节点数据加载失败');
                this.$message.error('跳转节点数据加载失败：'+error.data.message);
            });
        },
        // 指定回退-表格单选
        onFallbackRadio (val) {
            this.fallbackRadio = val;
        },
        // 指定回退-关闭
        onFallbackClose() {
            this.fallbackVisible = false;
            this.fallbackData = [];
            this.fallbackRadio = '';
        },
        // 指定回退-确定
        onFallbackOk() {
            if(this.fallbackRadio) {
                this.$confirm('确认要回退至节点 '+this.fallbackRadio.name+' 吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(this.fallbackRadio,'回退节点数据');
                    // this.fallbackRadio.id
                    // this.$api.flowcheng.starupDelete(row.modelId).then(res => {
                    //     console.log(res, '');
                    // }).catch(error => {
                    //     console.log(error, '');
                    // });
                }).catch(() => {
                    this.$message.info('已取消回退节点');          
                });
            } else {
                this.$message.warning('请先选择跳转节点！');
            }
        },
        // 提交
        onSubmit() {
            if(!this.feedbackInp) {
                this.$message.warning('请填写意见反馈内容！');
            } else {
                if(!this.choiceRadio) {
                    this.$message.warning('请选择操作类型！');
                } else {
                    let formData = '';
                    if (this.handleTaskRow.hasOwnProperty('formKey') && this.handleTaskRow.formKey && this.handleTaskRow.formKey.indexOf('.html') < 0) {
                        let data = {};
                        $("#task_html input,#task_html textarea").each(function(){
                            data[$(this).attr("name")] = $(this).val();
                        });
                        formData = FormHandle.formdataGet('#task_html', data);
                    }
                    let params = {
                        comment: this.feedbackInp,
                        formContent: encodeURIComponent(JSON.stringify(formData)),
                        taskId: this.handleTaskRow.id,
                        variables: {
                            approve: this.choiceRadio
                        }
                    };
                    this.$api.flowcheng.complete(params).then(res => {
                        // console.log(res,'res');
                        this.$message.success('处理任务成功！');
                        this.$emit('handleTaskClose');
                    }).catch(error => {
                        console.log(error,'error');
                        this.$message.error('处理任务失败：'+this.handleTaskRow.name);
                        this.$emit('handleTaskClose');
                    });
                }
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
.handletask_border {
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
// 右侧-提交
.con_right {
    width: 30%;
    padding: 20px;
    background-color: #F9FCFF;
    .el-icon-d-arrow-right:before {
        margin-right: 5px;
        font-size: 18px;
    }
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
            .el-tab-pane {
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
// 意见反馈
.feedback_modular {
    margin-top: 10px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    .feedback_choice {
        display: block;
        margin: 20px 0 10px 0;
    }
    .feedback_btn {
        float: right;
    }
    .feedback_inp {
        margin-bottom: 20px;
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
// 转办
/deep/ .dialog_transfer {
    overflow: hidden;
    .el-dialog {
        margin:0 !important;
        padding: 0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        height: 200px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            padding: 20px !important;
            overflow: auto;
            .transfer_con {
                display: flex;
                align-items: center;
                white-space: nowrap;
                .transfer_div {
                    flex: 1;
                    height: 40px;
                }
                .transfer_input {
                    width: 100%;
                    height: 40px;
                    text-align: inherit;
                }
            }
        }
    }
}

// 指定回退
/deep/ .dialog_fallback {
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
            overflow: auto;
            .fallback_con {
                width: 100%;
                height: 100%;
                overflow-y: auto;
                .el-radio__label {
                    padding: 0;
                }
            }
        }
    }
}

// 用户
/deep/ .dialog_people {
    overflow: hidden;
    .el-dialog {
        margin:0 !important;
        padding: 0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        height: 100%;
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

// 部门
/deep/ .dialog_dep {
    overflow: hidden;
    .el-dialog {
        margin:0 !important;
        padding: 0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        height: 80%;
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