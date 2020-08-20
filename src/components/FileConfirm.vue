<template>
    <!-- 归档确认 -->
    <div class="file_page" v-loading="loading">
        <el-form class="form_inline">
            <!-- 任务号 -->
            <el-form-item label="任务号：">
                <el-input v-model="taskCode" :disabled="true"></el-input>
            </el-form-item>
            <!-- 企业委托单 -->
            <el-form-item label="企业委托单：">
                <el-upload
                    class="upload_demo"
                    action="#" :limit="1" 
                    :file-list="upFileList1"
                    :disabled="true">
                    <!-- upBtnDis1 -->
                    <el-button type="primary" :disabled="true">上传文件</el-button>
                </el-upload>
                <el-button type="primary" @click="onDownFile(upFileList1,1)" style="margin: 5px 0;">下载文件</el-button>
                <el-radio-group v-model="radio1" @change="radioChangeOrder" :disabled="true" class="form_item_radio">
                    <el-radio label="1">电子归档</el-radio>
                    <el-radio label="2">纸质归档</el-radio>
                    <el-radio label="3">其他归档</el-radio>
                </el-radio-group>
                <!-- <i class="el-icon-warning" v-if="iconArry.icons6.warning"></i>
                <i class="el-icon-success" v-if="iconArry.icons6.success"></i> -->
            </el-form-item>
            <!-- 任务单 -->
            <el-form-item label="任务单：" class="form_item_task">
                <p>任务单.docx</p>
                <el-button type="primary" @click="seeTaskFile" style="marginLeft:10px;">查看文件</el-button>
            </el-form-item>

            <el-tabs type="card" v-if="isShowFlag" v-model="tabsActive" class="form_item_card">
                <div class="card_tab">
                    <span v-for="(item,i) in reportData" :key="i" @click="switchTab(i)" :class="i === tabIndex ? 'active' : ''">
                        {{item.itemsCode}}
                    </span>
                </div>
                <!-- 当前状态 -->
                <el-form-item label="当前状态：" class="form_item_currentState">
                    <span class="current_State">{{currentState}}</span>
                </el-form-item>
                <!-- 实验报告 -->
                <el-form-item v-show="needReport == '1'" label="实验报告：" class="form_item_test_report">
                    <div class="test_report">实验报告.docx</div>
                    <el-button type="primary" @click="seeTestReport">查看文件</el-button>
                    <el-button type="primary" @click="downTestReport" style="marginLeft:10px;">下载文件</el-button>
                    <span class="test_report_span">是否纸质归档</span>
                    <el-radio-group v-model="radiox" @change="radioChangeTestReport" class="form_item_radio">
                        <el-radio :label="radiox">{{radioValx}}</el-radio>
                    </el-radio-group>
                    <el-button v-if="confirmShow1" type="primary" @click="onClickConfirm('testReportConfirm',7)">
                        {{confirm1}}
                    </el-button>
                </el-form-item>

                <!-- 样品登记表 -->
                <el-form-item v-if="showContent2 == true" label="样品登记表：">
                    <div class="div1"></div>
                    <el-upload
                        class="upload_demo"
                        action="#" :limit="100" 
                        :file-list="upFileList2"
                        :disabled="true"
                        :multiple="true">
                    </el-upload>
                    <el-button type="primary" @click="onDownFile(upFileList2,2)">点击下载</el-button>
                </el-form-item>
                <el-form-item v-else label="样品登记表：">
                    <el-radio-group class="form_item_radio" v-model="radio2">
                        <el-radio :label="radio2">{{radioVal2}}</el-radio>
                    </el-radio-group>
                    <el-button type="primary" v-if="confirmShow2" @click="onClickConfirm('sampleRegistrationConfirm',2)">
                        {{confirm2}}
                    </el-button>
                </el-form-item>
                <!-- 样品登记表 -->

                <!-- 样品照片 -->
                <el-form-item v-if="showContent3 == true" label="样品照片：">
                    <div class="div2"></div>
                    <el-upload
                        class="upload_demo"
                        action="#" :limit="100" 
                        :file-list="upFileList3"
                        :disabled="true"
                        :multiple="true">
                    </el-upload>
                    <el-button type="primary" @click="onDownFile(upFileList3,3)">点击下载</el-button>
                </el-form-item>
                <el-form-item v-else label="样品照片：">
                    <el-radio-group class="form_item_radio" v-model="radio3">
                        <el-radio :label="radio3">{{radioVal3}}</el-radio>
                    </el-radio-group>
                    <el-button type="primary" v-if="confirmShow3" @click="onClickConfirm('samplePicConfirm',3)">
                        {{confirm3}}
                    </el-button>
                </el-form-item>
                <!-- 样品照片 -->

                <!-- 试验过程照片 -->
                <el-form-item v-if="showContent4 == true" label="试验过程照片：">
                    <div class="div3"></div>
                    <el-upload
                        class="upload_demo"
                        action="#" :limit="100"
                        :file-list="upFileList4" 
                        :disabled="true"
                        :multiple="true">
                    </el-upload>
                    <el-button type="primary" @click="onDownFile(upFileList4,4)">点击下载</el-button>
                </el-form-item>
                <el-form-item v-else label="试验过程照片：">
                    <el-radio-group class="form_item_radio" v-model="radio4">
                        <el-radio :label="radio4">{{radioVal4}}</el-radio>
                    </el-radio-group>
                    <el-button type="primary" v-if="confirmShow4" @click="onClickConfirm('processPicConfirm',4)">
                        {{confirm4}}
                    </el-button>
                </el-form-item>
                <!-- 试验过程照片 -->

                <!-- 原始记录 -->
                <el-form-item v-if="showContent5 == true" label="原始记录：">
                    <div class="div4"></div>
                    <el-upload
                        class="upload_demo"
                        action="#" :limit="100" 
                        :file-list="upFileList5"
                        :disabled="true"
                        :multiple="true">
                    </el-upload>
                    <el-button type="primary" @click="onDownFile(upFileList5,5)">点击下载</el-button>
                </el-form-item>
                <el-form-item v-else label="原始记录 :">
                    <el-radio-group class="form_item_radio" v-model="radio5">
                        <el-radio :label="radio5">{{radioVal5}}</el-radio>
                    </el-radio-group>
                    <el-button type="primary" v-if="confirmShow5" @click="onClickConfirm('originalRecordConfirm',5)">
                        {{confirm5}}
                    </el-button>
                </el-form-item>
                <!-- 原始记录 -->

                <!-- 其他文件 -->
                <el-form-item v-if="showContent6 == true" label="其他文件：">
                    <div class="div5"></div>
                    <el-upload
                        class="upload_demo"
                        action="#" :limit="100" 
                        :file-list="upFileList6"
                        :disabled="true"
                        :multiple="true">
                    </el-upload>
                    <el-button type="primary" @click="onDownFile(upFileList6,6)">点击下载</el-button>
                </el-form-item>
                <el-form-item v-else label="其他文件：">
                    <el-radio-group class="form_item_radio" v-model="radio6">
                        <el-radio :label="radio6">{{radioVal6}}</el-radio>
                    </el-radio-group>
                    <el-button type="primary" v-if="confirmShow6" @click="onClickConfirm('otherFilesConfirm',6)">
                        {{confirm6}}
                    </el-button>
                </el-form-item>
                <!-- 其他文件 -->
            </el-tabs>

            <!-- 暂无数据 -->
            <div v-else class="form_item_noData">
                <img src="static/image/noData2.png" alt="暂无数据" class="noDataImg">
                <span>暂无数据</span>
            </div>
        </el-form>

        <!-- 操作按钮 -->
        <div class="form_oper_btn">
            <el-button @click="onPrev()" :disabled="prevDis" v-if="isShowFlag">上一页</el-button>
            <el-button @click="onNext()" :disabled="nextDis" v-if="isShowFlag">下一页</el-button>
            <el-button @click="onConfrimFile()" v-if="isShowFlag && isSubmitFile">确认归档</el-button>
            <el-button @click="batchFile" v-if="isShowFlag && isSubmitFile">
                批量确认归档
            </el-button>
            
            <!-- 无数据 -->
            <el-button @click="noDataConfrimFile()" v-if="isNoDataFile && isSubmitFile">确认归档</el-button>
            <el-button @click="batchFile" v-if="isNoDataFile && isSubmitFile">
                批量确认归档
            </el-button>

            <!-- <el-button @click="onConfrimFile('2')" v-if="isShowFlag">保存草稿</el-button> -->
            <!-- <el-button @click="cancelFile()" v-if="isShowFlag && isSubmitFile">取消归档</el-button> -->
            <!-- <el-button @click="noDataConfrimFile('2')" v-if="isNoDataFile">保存草稿</el-button> -->
        </div>

        <object id="WO3Word2" classid="clsid:561C5A99-71C8-48d4-A3E2-16FC4F9880BF" Width="0" Height="0"
                style="display:block">
        </object>
    </div>
</template>

<script>
var m = 0;
var n = 0;
import base from "@/api/base.js"

export default {
    props: ['dialogTableVisible', 'tableData2', 'renwu', 'rows', 'permissionss', 'bysdj', 'lengtharr', 'lzyobj'],
    watch: {
        fileDialogVis: {
            immediate:true,
            handler(val) { 
                if(val) {
                    if(this.lengtharr != '0') {
                        this.currentId = this.tableData2[0].id; // 当前页面-id
                    }
                    this.operBtnShow(); // 操作按钮-显示处理
                    this.obtainDate('1'); // 获取数据
                    this.obtainOrderForm(); // 上传文件-获取企业委托单
                    // 获取用户信息
                    if(JSON.parse(localStorage.getItem("userInfo")).loginName) {
                        this.loginName = JSON.parse(localStorage.getItem("userInfo")).loginName;
                    } else {
                        this.loginName = '';
                    }
                }
            }
        }
    },
    data() {
        return {
            loading: false, // 加载-状态
            loginName: '', // 获取用户信息
            fileDialogVis: this.dialogTableVisible, // 当前归档-弹框显示状态
            reportData: this.tableData2, // 任务-归档所有报告列表数据
            taskCode: this.renwu, // 任务号
            taskRowDate: this.rows, // 任务-数据
            userPermis: this.permissions,  // 人员权限
            upAllBtnDis: this.bysdj, // 上传按钮-是否允许操作状态
            reportDataLength: this.lengtharr, // 任务-所有报告数据的长度
            taskFileData: this.lzyobj, // 任务-归档的全部数据

            currentId: '', // 当前页面-id
            currentData: {}, // 当前页面-数据
            currentState: '', // 当前状态-值
            needReport: '',  // 实验报告-是否显示-=1显示

            upFileList1: [], // 上传文件列表-企业委托单
            upFileList2: [], // 上传文件列表-样品登记表
            upFileList3: [], // 上传文件列表-样品照片
            upFileList4: [], // 上传文件列表-试验过程照片
            upFileList5: [], // 上传文件列表-原始记录
            upFileList6: [], // 上传文件列表-其他文件

            prevDis: false, // 上一页-禁用状态
            nextDis: false, // 下一页-禁用状态
            isShowFlag: true, // 页面/上一页/下一页-显示-开关
            isSubmitFile: true,  // 确认归档-显示
            isNoDataFile: true, // 确认归档-列表无数据-显示
            
            radiox: '1', // 归档类型-实验报告
            radio1: '1', // 归档类型-企业委托单
            radio2: '1', // 归档类型-样品登记表
            radio3: '1', // 归档类型-样品照片
            radio4: '1', // 归档类型-试验过程照片
            radio5: '1', // 归档类型-原始记录
            radio6: '1', // 归档类型-其他文件

            radioValx: '1', // 归档值-实验报告
            radioVal2: '', // 归档值-样品登记表
            radioVal3: '', // 归档值-样品照片
            radioVal4: '', // 归档值-试验过程照片
            radioVal5: '', // 归档值-原始记录
            radioVal6: '', // 归档值-其他文件

            confirm1: '', // 确认/取消确认-实验报告
            confirm2: '', // 确认/取消确认-样品登记表
            confirm3: '', // 确认/取消确认-样品照片
            confirm4: '', // 确认/取消确认-试验过程照片
            confirm5: '', // 确认/取消确认-原始记录
            confirm6: '', // 确认/取消确认-其他文件
            confirm1State: 0, // 确认/取消确认-状态-实验报告
            confirm2State: 0, // 确认/取消确认-状态-样品登记表
            confirm3State: 0, // 确认/取消确认-状态-样品照片
            confirm4State: 0, // 确认/取消确认-状态-试验过程照片
            confirm5State: 0, // 确认/取消确认-状态-原始记录
            confirm6State: 0, // 确认/取消确认-状态-其他文件

            upBtnDis1: true, // 上传-禁用状态-企业委托单
            showContent2: true, // 显示内容-样品登记表
            showContent3: true, // 显示内容-样品照片
            showContent4: true, // 显示内容-试验过程照片
            showContent5: true, // 显示内容-原始记录
            showContent6: true, // 显示内容-其他文件
            
            confirmShow1: true, // 按钮显示状态-确认/取消确认-实验报告
            confirmShow2: true, // 按钮显示状态-确认/取消确认-样品登记表
            confirmShow3: true, // 按钮显示状态-确认/取消确认-样品照片
            confirmShow4: true, // 按钮显示状态-确认/取消确认-试验过程照片
            confirmShow5: true, // 按钮显示状态-确认/取消确认-原始记录
            confirmShow6: true, // 按钮显示状态-确认/取消确认-其他文件

            tabsActive: "0", // 页签-展示页的标识
            curTabId: 0, // 切换页签时-当前页签id
            tabIndex: 0, // 切换页签时-当前页签下标
            pathFolder: '', // 文件夹名称

            ti: '查看',
            iconArry: {
                icons6: {
                    warning: false,
                    success: false
                }
            },
            
        }
    },
    created() {},
    mounted() {},
    methods: {
        // 操作按钮-显示处理
        operBtnShow() {
            this.prevDis = true;
            if (this.reportData.length == 1) {
                this.prevDis = true;
                this.nextDis = true;
            }
            if (this.reportDataLength == '0') {
                this.isShowFlag = false; // 页面/上一页/下一页-显示-开关
                this.isNoDataFile = true; // 确认归档-列表无数据-显示
            } else {
                this.isShowFlag = true; // 页面/上一页/下一页-显示-开关
                this.isSubmitFile = true; // 确认归档-显示
                this.isNoDataFile = false; // 确认归档-列表无数据-显示
                this.needReport = this.reportData[0].needReport; // 实验报告-是否显示-=1显示
            }
        },
        // 获取数据
        obtainDate(upfileState1) {
            if(this.currentId) {
                this.$api.taskmanage.TaskReport(this.currentId).then(res => {
                    this.loading = false;
                    this.currentData = res.data.data;
                    this.pathFolder = res.data.data.pathFolder;
                    if (this.currentData.docStatus == '1') {
                        this.currentState = '已归档';
                    } else if (this.currentData.docStatus == '-1') {
                        this.currentState = '已提交归档';
                    } else {
                        this.currentState = '未提交归档';
                        this.confirmShow1 = false;
                        this.confirmShow2 = false;
                        this.confirmShow3 = false;
                        this.confirmShow4 = false;
                        this.confirmShow5 = false;
                        this.confirmShow6 = false;
                    }
                    this.echoHandle(); // 回显处理 归档状态显示；页面显示内容；确认按钮显示状态;
                    this.uploadFileEcho(upfileState1); // 上传文件-回显
                    this.confirmCon(); // 初始化-确认/取消确认-按钮内容
                }).catch(error => {
                    console.log('获取数据失败',error);
                    this.loading = false;
                    this.$message.error(error.data.message);
                });
            };
        },
        // 回显处理-归档状态显示；页面显示内容；确认按钮显示状态;
        echoHandle() {
            // 实验报告
            if (this.currentData.testReportStatus === null || this.currentData.testReportStatus == '1') {
                this.radiox = '1';
                this.radioValx = '是';
            } else {
                this.radiox = '2';
                this.radioValx = '否';
            }

            // 企业委托单
            if (this.currentData.taskSheetStatus == null || this.currentData.taskSheetStatus == "1") {
                this.radio1 = '1';
                if (this.permissionss == 0) {
                    this.upBtnDis1 = true;
                } else {
                    this.upBtnDis1 = false;
                }
            } else {
                this.radio1 = JSON.stringify(this.currentData.taskSheetStatus);
                this.upBtnDis1 = true;
            }

            // 样品登记表
            if (this.currentData.sampleRegistrationStatus === null || this.currentData.sampleRegistrationStatus == '1') {
                this.showContent2 = true;
            } else {
                this.showContent2 = false;
                if (this.currentData.sampleRegistrationStatus == '2') {
                    this.radio2 = '2';
                    this.radioVal2 = '纸质归档'
                    this.currentData.docStatus == 0 ? this.confirmShow2 = false : this.confirmShow2 = true;
                } else if (this.currentData.sampleRegistrationStatus == '3') {
                    this.radio2 = '3';
                    this.radioVal2 = '其他归档'
                    this.currentData.docStatus == 0 ? this.confirmShow2 = false : this.confirmShow2 = true;
                } else {
                    this.confirmShow2 = false;
                    this.radio2 = '4';
                    this.radioVal2 = '无'
                }
            }

            // 样品照片
            if (this.currentData.samplePicStatus === null || this.currentData.samplePicStatus == '1') {
                this.showContent3 = true;
            } else {
                this.showContent3 = false;
                if (this.currentData.samplePicStatus == '2') {
                    this.radio3 = '2';
                    this.radioVal3 = '纸质归档';
                    this.currentData.docStatus == 0 ? this.confirmShow3 = false : this.confirmShow3 = true;
                } else if (this.currentData.samplePicStatus == '3') {
                    this.radio3 = '3';
                    this.radioVal3 = '其他归档';
                    this.currentData.docStatus == 0 ? this.confirmShow3 = false : this.confirmShow3 = true;
                } else {
                    this.radio3 = '4';
                    this.radioVal3 = '无';
                    this.confirmShow3 = false;
                }
            }

            // 试验过程照片
            if (this.currentData.processPicStatus === null || this.currentData.processPicStatus == '1') {
                this.showContent4 = true
            } else {
                this.showContent4 = false;
                if (this.currentData.processPicStatus == '2') {
                    this.radio4 = '3';
                    this.radioVal4 = '纸质归档';
                    this.currentData.docStatus == 0 ? this.confirmShow4 = false : this.confirmShow4 = true;
                } else if (this.currentData.processPicStatus == '3') {
                    this.radio4 = '3';
                    this.radioVal4 = '其他归档';
                    this.currentData.docStatus == 0 ? this.confirmShow4 = false : this.confirmShow4 = true;
                } else {
                    this.radio4 = '4';
                    this.radioVal4 = '无';
                    this.confirmShow4 = false;
                }
            }

            // 原始记录
            if (this.currentData.originalRecordStatus === null || this.currentData.originalRecordStatus == '1') {
                this.showContent5 = true
            } else {
                this.showContent5 = false;
                if (this.currentData.originalRecordStatus == '2') {
                    this.radio5 = '2';
                    this.radioVal5 = '纸质归档';
                    this.currentData.docStatus == 0 ? this.confirmShow5 = false : this.confirmShow5 = true;
                } else if (this.currentData.originalRecordStatus == '3') {
                    this.radio5 = '3';
                    this.radioVal5 = '其他归档';
                    this.currentData.docStatus == 0 ? this.confirmShow5 = false : this.confirmShow5 = true;
                } else {
                    this.radio5 = '4';
                    this.radioVal5 = '无';
                    this.confirmShow5 = false;
                }
            }

            // 其他文件
            if (this.currentData.otherFilesStatus === null || this.currentData.otherFilesStatus == '1') {
                this.showContent6 = true;
            } else {
                this.showContent6 = false;
                if (this.currentData.otherFilesStatus == '2') {
                    this.radio6 = '2';
                    this.radioVal6 = '纸质归档';
                    this.currentData.docStatus == 0 ? this.confirmShow6 = false : this.confirmShow6 = true;
                } else if (this.currentData.otherFilesStatus == '3') {
                    this.radio6 = '3';
                    this.radioVal6 = '其他归档';
                    this.currentData.docStatus == 0 ? this.confirmShow6 = false : this.confirmShow6 = true;
                } else {
                    this.radio6 = '4';
                    this.radioVal6 = '无';
                    this.confirmShow6 = false;
                }
            }
        },
        // 上传文件-回显
        uploadFileEcho(upfileState1) {
            this.upFileList2 = [];
            this.upFileList3 = [];
            this.upFileList4 = [];
            this.upFileList5 = [];
            this.upFileList6 = [];
            if(this.currentData) {
                if(upfileState1 == '1') {
                    this.upFileList1 = [];
                    // 企业委托单
                    if (this.currentData.taskSheet && this.currentData.taskSheetFile) {
                        this.upFileList1 = [{
                            name:  this.currentData.taskSheetFile.fileName + '.' +  this.currentData.taskSheetFile.fileType, 
                            id:  this.currentData.taskSheetFile.fileId
                        }];
                    }
                }
                // 上传文件列表-样品登记表
                if (this.currentData.sampleRegistrationList) {
                    let fileData2 = this.currentData.sampleRegistrationList;
                    fileData2.map(item => {
                        this.upFileList2.push({name: item.fileName+'.'+item.fileType, id: item.fileId});
                    });
                }

                // 上传文件列表-样品照片
                if (this.currentData.samplePicList) {
                    let fileData3 = this.currentData.samplePicList;
                    fileData3.map(item => {
                        this.upFileList3.push({name: item.fileName+'.'+item.fileType, id: item.fileId});
                    });
                }

                // 上传文件列表-试验过程照片
                if (this.currentData.processPicList) {
                    let fileData4 = this.currentData.processPicList;
                    fileData4.map(item => {
                        this.upFileList4.push({name: item.fileName+'.'+item.fileType, id: item.fileId});
                    });
                }

                // 上传文件列表-原始记录
                if (this.currentData.originalRecordList) {
                    let fileData5 = this.currentData.originalRecordList;
                    fileData5.map(item => {
                        this.upFileList5.push({name: item.fileName+'.'+item.fileType, id: item.fileId});
                    });
                }

                // 上传文件列表-其他文件
                if (this.currentData.otherFilesList) {
                    let fileData6 = this.currentData.otherFilesList;
                    fileData6.map(item => {
                        this.upFileList6.push({name: item.fileName+'.'+item.fileType, id: item.fileId});
                    });
                }
            }
        },
        // 初始化-确认/取消确认-按钮内容
        confirmCon() {
            // 企业委托单
            if (this.lengtharr == '0') {
                // taskSheetStatus  企业委托单-状态  1电子归档 2纸质归档 3其他归档 4 无
                if (this.taskFileData.taskSheetStatus == null || this.taskFileData.taskSheetStatus == "1") {
                    this.radio1 = '1';
                    this.upBtnDis1 = false;
                } else {
                    this.radio1 = JSON.stringify(this.taskFileData.taskSheetStatus);
                    this.upBtnDis1 = true;
                }
            } else {
                if (this.currentData.taskSheetStatus == null || this.currentData.taskSheetStatus == "1") {
                    this.radio1 = '1';;
                    this.upBtnDis1 = false;
                } else {
                    this.radio1 = JSON.stringify(this.currentData.taskSheetStatus);
                    this.upBtnDis1 = true;
                }
            }
            // 实验报告
            if (this.currentData.testReportConfirm == null || this.currentData.testReportConfirm == 0) {
                this.confirm1 = '确认';
                this.confirm1State = 0;
            } else {
                this.confirm1 = '取消确认';
                this.confirm1State = 1;
            }
            // 样品登记表
            if (this.currentData.sampleRegistrationConfirm == null || this.currentData.sampleRegistrationConfirm == 0) {
                this.confirm2 = '确认';
                this.confirm2State = 0;
            } else {
                this.confirm2 = '取消确认';
                this.confirm2State = 1
            }
            // 样品照片
            if (this.currentData.samplePicConfirm == null || this.currentData.samplePicConfirm == 0) {
                this.confirm3 = '确认';
                this.confirm3State = 0;
            } else {
                this.confirm3 = '取消确认';
                this.confirm3State = 1;
            }
            // 试验过程照片
            if (this.currentData.processPicConfirm == null || this.currentData.processPicConfirm == 0) {
                this.confirm4 = '确认';
                this.confirm4State = 0;
            } else {
                this.confirm4 = '取消确认';
                this.confirm4State = 1;
            }
            // 原始记录
            if (this.currentData.originalRecordConfirm == null || this.currentData.originalRecordConfirm == 0) {
                this.confirm5 = '确认';
                this.confirm5State = 0;
            } else {
                this.confirm5 = '取消确认';
                this.confirm5State = 1;
            }
            // 其他文件
            if (this.currentData.otherFilesConfirm == null || this.currentData.otherFilesConfirm == 0) {
                this.confirm6 = '确认';
                this.confirm6State = 0;
            } else {
                this.confirm6 = '取消确认';
                this.confirm6State = 1;
            }
        },
        // 上传文件-获取企业委托单
        obtainOrderForm() {
            this.upFileList1 = [];
            if(this.currentData) {
                if (this.currentData.taskSheet && this.currentData.taskSheetFile) {
                    this.upFileList1 = [{
                        name:  this.currentData.taskSheetFile.fileName + '.' +  this.currentData.taskSheetFile.fileType, 
                        id:  this.currentData.taskSheetFile.fileId
                    }];
                }
            } else {
                if (this.taskFileData.taskSheet && this.taskFileData.taskSheetFile) {
                    this.upFileList1 = [{
                        name: this.taskFileData.taskSheetFile.fileName + '.' + this.taskFileData.taskSheetFile.fileType, 
                        id: this.taskFileData.taskSheetFile.fileId
                    }];
                }
            }
            this.loading = false;
        },
        // 单选-选择-企业委托单
        radioChangeOrder(value) {
            this.radio1 = value;
            if (this.radio1 != '1') {
                this.upBtnDis1 = true;
            } else {
                this.upBtnDis1 = false;
            }
        },
        // 单选-选择-实验报告
        radioChangeTestReport(value) {
            this.radiox = value;
        },
        // 点击确认
        onClickConfirm(val, type) {
            this.loading = true;
            let isCon = this.currentData[val];
            if (isCon == null || isCon == 0) {
                isCon = 1;
            } else if (isCon == 1) {
                isCon = 0;
            }
            let params = {
                isConfirm: isCon,
                taskContentId: this.currentId,
                taskId: this.taskRowDate.id,
                type: type
            }
            this.$api.taskmanage.confirmOrCancel(params).then(res => {
                this.obtainDate();
                this.$message.success(res.data.message);
            }).catch(error => {
                this.$message.error(error.data.message);
                this.loading = false;
            });
        },
        // 任务单-查看文件
        seeTaskFile() {
            this.loading = true;
            this.$api.taskmanage.printXlsByTaskId(this.taskRowDate.id).then(res => {
                this.loading = false;
                if (res.data.data && Object.keys(res.data.data).length != 0) {
                    let objj = JSON.stringify(res.data.data);
                    // 由于IE浏览器url传参长度有限制,所以使用sessionStorage做跨窗体传值/
                    window.sessionStorage.setItem('printData', objj);
                    let routeData = this.$router.resolve({
                        path: "/print",
                    });
                    window.open(routeData.href, '_blank');
                }
            }).catch(error => {
                this.loading = false;
                this.$message.error(error.data.message);
            })
        },
        // 实验报告-查看文件
        seeTestReport() { 
            let taskId = this.reportData[this.tabIndex].itemsCode;
            this.goOpenWord(this.currentId, taskId, '7');
        },
        // 打开报告
        goOpenWord(instanceID, report_no, process) {
            let obj = document.getElementById("WO3Word2");
            if (this.loginName) {
                this.$api.surveyissue.apiSetSession(instanceID).then(res => {
                    if (res.data.data == "1") {
                        try {
                            obj.setUid(this.loginName);
                            obj.setFileId(instanceID);
                            obj.setReportNo(report_no);
                            obj.setProcess(process);
                            obj.setRemoteIp(base.baseImgTable);
                            obj.ActiveStart();
                        } catch (error) {
                            if (confirm("您确认没有安装Word控件吗? 点确定您将下载setup.zip 解压后运行setup.exe即可")) {
                                window.open(base.baseImgTable + "/resources/donet/setup.zip");
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
        // 实验报告-下载文件
        downTestReport() {
            this.$api.lxtinitial.downReport(this.currentId).then(res => {
                if (res.data.data == 0) {
                    this.$alert('没有文件', '信息提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else if (res.data.data == 2) {
                    this.$alert('请稍后，服务器正在处理文件', '信息提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    let obj = document.getElementById("WO3Word2");
                    obj.setDownType("1");
                    obj.setExecuteaction("0");
                    obj.setServerIP(base.baseImgTable);
                    obj.setIds(res.data.data);
                    obj.downStart();
                }
            }).catch(error => {
                this.$alert("下载失败", '信息提示', {
                    dangerouslyUseHTMLString: true
                });
            })
        },
        // 点击-下载文件
        onDownFile(data, type) {
            if (data.length == 0) {
                this.$alert('请上传文件后下载', '提示', {
                    dangerouslyUseHTMLString: true
                });
            } else if (data.length == 1) {
                let params = {
                    fileId: this.handleFileId(data),   // 要下载的文件名
                    pathFolder: this.pathFolder,   // 文件夹名称，来源为 |我的报告|归档|信息回显
                    taskContentId: this.currentId,  //报告任务id
                    type: type,
                }
                this.downFileFun(params);
            } else {
                let params = {
                    fileId: '',
                    pathFolder: this.pathFolder,   // 文件夹名称，来源为 |我的报告|归档|信息回显
                    taskContentId: this.currentId,  //报告任务id
                    type: type,
                }
                this.downFileFun(params);
            }
        },
        // 下载-方法
        downFileFun(params) {
            let obj = {
                fileId: params.fileId,
                pathFolder: params.pathFolder,
                taskContentId: params.taskContentId,
                type: params.type,
                taskId: this.taskRowDate.id
            }
            this.$api.pigeohole.apiTaskReportDownloadCheck(obj).then(res => {
                let data = res.data.data;
                var formEle = document.createElement('form');
                formEle.setAttribute('id', 'formId')
                formEle.setAttribute('method', 'GET');
                formEle.setAttribute('action', this.$api.taskmanage.getdownloadpath());
                document.body.appendChild(formEle);

                //input元素
                var input1 = document.createElement('input');
                input1.setAttribute('type', 'hidden');
                input1.setAttribute('name', 'fileName');
                input1.setAttribute('value', data.fileName);
                formEle.appendChild(input1);

                var input2 = document.createElement('input');
                input2.setAttribute('type', 'hidden');
                input2.setAttribute('name', 'filePath');
                input2.setAttribute('value', encodeURI(data.filePath));
                formEle.appendChild(input2);

                var formId = document.getElementById('formId');
                formId.submit();
                document.body.removeChild(formEle);
            }).catch(error => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
            });
        },
        // 处理-下载文件id
        handleFileId(dataList) {
            let fileId = null;
            if (dataList.length == 0) {
                fileId = null;
            } else {
                fileId = dataList[0].id;
            }
            return fileId;
        },
        // 列表无数据-确认归档
        noDataConfrimFile() {
            this.loading = true;
            let params = {
                taskId: this.taskRowDate.id,   //任务id
                // taskSheetStatus: this.radio1,  // 企业委托单-状态  1电子归档 2纸质归档 3其他归档 4 无
                // taskSheet: this.handleFileId(this.upFileList1) // 企业委托单-上传
            }
            this.$api.taskmanage.confirmGd(params).then(res => {
                this.$message.success(res.data.message);
                this.taskFileData = res.data.data;
                this.obtainOrderForm();
            }).catch(error => {
                this.loading = false;
                this.$message.error(error.data.message);
            });
        },
        // 确认归档
        onConfrimFile() {
            this.loading = true;
            let params = {
                taskId: this.taskRowDate.id,   //任务id
                taskContentId: this.currentId,          //任务报告id(主键，唯一)
                testReportStatus: this.radiox,          // 实验报告，是否为纸质归档 0 否 1是

                // taskSheetStatus: this.radio1,           // 企业委托单-状态  1电子归档 2纸质归档 3其他归档 4 无
                sampleRegistrationStatus: this.radio2,  // 样品登记表-状态 1电子归档 2纸质归档 3其他归档 4 无
                samplePicStatus: this.radio3,           // 样品照片-状态    1电子归档 2纸质归档 3其他归档 4 无
                processPicStatus: this.radio4,          // 试验过程照片-状态    1电子归档 2纸质归档 3其他归档 4 无
                originalRecordStatus: this.radio5,      // 原始记录表-状态  1电子归档 2纸质归档 3其他归档 4 无
                otherFilesStatus: this.radio6,          // 其他文件-状态    1电子归档 2纸质归档 3其他归档 4 无

                // taskSheet: this.handleFileId(this.upFileList1),         // 企业委托单-上传
                sampleRegistration: this.fileIdList(this.upFileList2),  // 样品登记表-上传，数组类型，
                samplePic: this.fileIdList(this.upFileList3),           // 样品照片-上传，数组类型，
                processPic: this.fileIdList(this.upFileList4),          // 试验过程照片-上传，数组类型，
                originalRecord: this.fileIdList(this.upFileList5),      // 原始文件表-上传息，数组类型，
                otherFiles: this.fileIdList(this.upFileList6),          // 其他文件-上传，数组类型，下面有字符串类型
            }

            
            this.$api.taskmanage.confirmGd(params).then(res => {
                this.$message.success(res.data.message);
                this.obtainDate();
            }).catch(error => {
                this.$message.error(error.data.message);
                this.loading = false;
            })
        },
        // 处理-上传文件id集合
        fileIdList(upFileList) {
            let fileIdList = '';
            if (upFileList.length == 0) {
                return fileIdList;
            } else {
                upFileList.map(item => {
                    fileIdList += item.id + ',';
                });
                fileIdList = fileIdList.substring(0, fileIdList.length-1);
                return fileIdList;
            }
        },
        // 取消归档
        cancelFile() {
            this.loading = true;
            this.$api.taskmanage.cancelGd(this.currentId).then(res => {
                this.$message.success(res.data.message);
                this.obtainDate();
            }).catch(error => {
                this.loading = false;
                this.$message.error(error.data.message);
            })
        },
        // 切换页签时
        switchTab(i) {
            // this.loading = true;
            let num = this.reportData.length - 1;
            if (i === num * 1) {
                this.prevDis = false;
                this.nextDis = true;
            } else if (i === 0) {
                this.prevDis = true;
                this.nextDis = false;
            } else {
                this.prevDis = false;
                this.nextDis = false;
            }
            this.curTabId = i;
            this.tabIndex = this.curTabId;
            this.currentId = this.reportData[this.tabIndex].id;
            this.needReport = this.reportData[this.tabIndex].needReport;
            this.obtainDate();
        },
        // 上一页
        onPrev() {
            this.loading = true;
            let curIndex = this.tabIndex * 1;
            if (curIndex - 1 === 0) {
                this.prevDis = true;
                this.nextDis = false;
            } else {
                this.prevDis = false;
                this.nextDis = false;
            }
            if (curIndex > 0) {
                this.currentId = this.reportData[curIndex - 1].id;
                this.needReport = this.reportData[curIndex - 1].needReport;
                curIndex - 1;
                this.tabIndex = this.tabIndex - 1;
                this.tabsActive = JSON.stringify(Number(this.tabsActive - 1));
                this.obtainDate();
            } else {
                this.loading = false;
                this.tabIndex = 0;
            }
        },
        //下一页
        onNext() {
            this.loading = true;
            let curIndex = this.tabIndex * 1;
            let num = 1;
            let strnum = Number(this.tabsActive) + num;
            if (curIndex + 1 === this.reportData.length - 1) {
                this.prevDis = false;
                this.nextDis = true;
            } else {
                this.prevDis = false;
                this.nextDis = false;
            }
            if (curIndex < this.reportData.length - 1) {
                this.currentId = this.reportData[curIndex + 1].id;
                this.needReport = this.reportData[curIndex + 1].needReport;
                curIndex + 1;
                this.tabIndex = this.tabIndex + 1;
                this.tabsActive = strnum.toString();
                this.obtainDate();
            } else {
                this.loading = false;
                this.tabIndex = this.reportData.length - 1;
            }
        },
        // 批量确认归档
        batchFile() {
            // state 提交类型：1提交归档; 2保存草稿; 3自动保存
            this.loading = true;
            let params = {
                taskId: this.taskRowDate.id, // 任务id
                // taskSheetStatus: this.radio1,  // 企业委托单-状态  1电子归档 2纸质归档 3其他归档 4 无
                // taskSheet: this.handleTaskSheetId(this.upFileList1), // 上传-企业委托单
            };
            this.$api.myReport.batchConfirmGd(params).then(res => {
                this.$message.success(res.data.data);
                this.obtainDate();
            }).catch(error => {
                this.$message.error(error.data.message);
                this.loading = false;
            });
        },
    },
}
</script>

<style scoped lang="scss">
p {
    padding: 0;
    margin: 0;
}
// 解决-按钮不居中
/deep/ .el-button {
    line-height: 0px !important;
}
.el-button--primary {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
    border-radius: 4px;
}
/deep/ .el-button--primary.is-disabled {
    background: #a0cfff !important; 
    border-color: #a0cfff !important;
}
.el-icon-warning {
    color: red;
    font-size: 20px;
    position: relative;
    top: 0;
    left: 5px;
}
.el-icon-success {
    color: #67c23a;
    font-size: 20px;
    position: relative;
    top: 0;
    left: 5px;
}
.file_page {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
// 表单
/deep/ .form_inline {
    flex: 1;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    .el-form-item{
        width: 100%;
        margin: 0;
        padding: 0 0 20px 0;
        overflow: hidden;
        display: flex;
        .el-form-item__label {
            width: 10% !important;
            white-space: nowrap;
        }
        .el-form-item__content {
            flex: 1;
            display: flex;
            .el-select, .el-input{
                width: 40% !important;
            }
            .el-icon-warning, .el-icon-success {
                line-height: 40px;
            }
            .test_report {
                width: 20%;
            }
            .test_report_span {
                margin: 0 10px;
            }
        }
    }
    // 任务单
    .form_item_task {
        padding-bottom: 10px;
        .el-form-item__content {
            align-items: center;
        }
    }
    // 当前状态
    .form_item_currentState {
        background:#eee;
        font-weight:bold;
        margin: 0;
        padding: 0;
        margin-bottom: 20px;
        .current_State{
            font-weight:normal;
        }
    }
    .form_item_test_report {
        padding-bottom: 20px;
        .el-form-item__content {
            align-items: center;
        }
    }
}

// 上传
/deep/ .upload_demo {
    width: 40%;
    display: flex;
    flex-direction: row-reverse;
    .el-upload--text {
        margin: 0 10px;
        line-height: 40px;
    }
    .el-upload-list {
        flex: 1;
        max-height: 200px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 3px;
        overflow: auto;
    }
}
// 单选-归档类型
/deep/ .form_item_radio {
    height: 40px;
    margin: 0 10px;
    display: flex;
    align-items: center;
    .el-radio {
        margin-right: 20px;
        &:last-child {
            margin: 0;
        }
    }
}
// 页签
/deep/ .form_item_card {
    .el-tabs__header {
        margin: 0;
    }
    .el-tabs__content {
        margin-top: 20px;
    }
    .card_tab {
        width: 100%;
        height: auto;
        display: flex;
        align-items: center;
        overflow-x: auto;
        span {
            height: 100%;
            padding: 15px 15px;
            flex-shrink: 0;
            text-align: center;
            border: 1px solid #eee;
        }
    }
    .card_tab span:hover {
        cursor: pointer
    }
    .active {
        color: blue;
        background: #fff;
    }
}

// 无数据时
.form_item_noData {
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #E4E7ED;
    .noDataImg {
        display: block;
        width: 20%;
        height: auto;
    }
}

// 操作按钮
.form_oper_btn {
    text-align: center;
}
</style>