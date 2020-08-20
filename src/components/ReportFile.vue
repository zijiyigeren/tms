<template>
    <!-- 归档 -->
    <div class="file_page" v-loading="loading">
        <el-form :model="formInline" class="form_inline">
            <el-form-item label="任务号：">
                <el-input v-model="formInline.taskCode" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="企业委托单：">
                <!-- upBtnDis1 -->
                <el-upload
                    action="#" :limit="1" :disabled="true"
                    class="upload_demo"
                    :file-list="upFileList1"
                    :on-exceed="upExceedTaskSheet"
                    :before-remove="upBefRemove"
                    :before-upload="file => beforeUpload(file,'upBtnDis1',upFileList1,taskRowDate.id,1,'')"
                    :http-request="() => {}">
                    <el-button type="primary" :disabled="true">点击上传</el-button>
                </el-upload>
                <!-- radio1BtnDis -->
                <el-radio-group class="form_item_radio" v-model="radio1" :disabled="true" @change="radioTaskSheet">
                    <el-radio label="1">电子归档</el-radio>
                    <el-radio label="2">纸质归档</el-radio>
                    <el-radio label="3">其他归档</el-radio>
                </el-radio-group>
                <!-- <i class="el-icon-warning" v-if="iconArry.icons6.warning"></i>
                <i class="el-icon-success" v-if="iconArry.icons6.success"></i> -->
            </el-form-item>
            <el-form-item label="任务单：" class="form_item_task">
                <div>任务单.docx</div>
            </el-form-item>

            <el-tabs type="card" v-if="isShowFlag" v-model="tabsActive" class="form_item_card">
                <div class="card_tab">
                    <span v-for="(item,i) in reportData" :key="i" @click="switchTab(i)" :class="i === tabIndex ? 'active' : ''">
                        {{item.itemsCode}}
                    </span>
                </div>
                <el-form-item label="当前状态：" class="form_item_currentState">
                    <span class="current_State">{{currentState}}</span>
                </el-form-item>
                <el-form-item v-show="needReport == '1'" label="实验报告：" class="form_item_test_report">
                    <div class="test_report">实验报告.docx</div>
                    <span class="test_report_span">是否纸质归档</span>
                    <el-radio-group class="form_item_radio" v-model="radiox" :disabled="radioAllDis" @change="radioTestReport">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 样品登记表 -->
                <el-form-item label="样品登记表：">
                    <!-- :disabled="upBtnDis2" -->
                    <el-upload
                        action="#" multiple :limit="100" :disabled="true"
                        class="upload_demo"
                        :file-list="upFileList2"
                        :on-exceed="uploadExceed"
                        :before-remove="upBefRemove"
                        :before-upload="file => beforeUpload(file,'upBtnDis2',upFileList2,'',2,'currentData')"
                        :http-request="() => {}">
                        <el-button type="primary" :disabled="true">点击上传</el-button>
                    </el-upload>
                    <el-radio-group class="form_item_radio" v-model="radio2" :disabled="radioAllDis" 
                        @change="radioChangVal(radio2,'radio2','upBtnDis2',currentData.sampleRegistrationList,'upFileList2')">
                        <el-radio label="1">电子归档</el-radio>
                        <el-radio label="2">纸质归档</el-radio>
                        <el-radio label="3">其他归档</el-radio>
                        <el-radio label="4">无</el-radio>
                    </el-radio-group>
                    <i class="el-icon-warning" v-if="iconArry.icons1.warning"></i>
                    <i class="el-icon-success" v-if="iconArry.icons1.success"></i>
                </el-form-item>
                <!-- 样品照片 sample-->
                <el-form-item label="样品照片：">
                    <!-- :disabled="upBtnDis3" -->
                    <el-upload
                        action="#" multiple :limit="100" :disabled="true"
                        class="upload_demo"
                        :file-list="upFileList3"
                        :on-exceed="uploadExceed"
                        :before-remove="upBefRemove"
                        :before-upload="file => beforeUpload(file,'upBtnDis3',upFileList3,'',3,currentData.pathFolder)"
                        :http-request="() => {}">
                        <el-button type="primary" :disabled="true">点击上传</el-button>
                    </el-upload>
                    <el-radio-group class="form_item_radio" v-model="radio3" :disabled="radioAllDis" 
                        @change="radioChangVal(radio3,'radio3','upBtnDis3',currentData.samplePicList,'upFileList3')">
                        <el-radio label="1">电子归档</el-radio>
                        <el-radio label="2">纸质归档</el-radio>
                        <el-radio label="3">其他归档</el-radio>
                        <el-radio label="4">无</el-radio>
                    </el-radio-group>
                    <i class="el-icon-warning" v-if="iconArry.icons2.warning"></i>
                    <i class="el-icon-success" v-if="iconArry.icons2.success"></i>
                </el-form-item>
                <!-- 试验过程照片experiment -->
                <el-form-item label="试验过程照片：">
                    <el-upload
                        action="#" multiple :limit="100" :disabled="upBtnDis4"
                        class="upload_demo"
                        :file-list="upFileList4"
                        :on-exceed="uploadExceed"
                        :before-remove="upBefRemove"
                        :before-upload="file => beforeUpload(file,'upBtnDis4',upFileList4,'',4,currentData.pathFolder)"
                        :http-request="() => {}">
                        <el-button type="primary" :disabled="upBtnDis4">点击上传</el-button>
                    </el-upload>
                    <el-radio-group class="form_item_radio" v-model="radio4" :disabled="radioAllDis" 
                        @change="radioChangVal(radio4,'radio4','upBtnDis4',currentData.processPicList,'upFileList4')">
                        <el-radio label="1">电子归档</el-radio>
                        <el-radio label="2">纸质归档</el-radio>
                        <el-radio label="3">其他归档</el-radio>
                        <el-radio label="4">无</el-radio>
                    </el-radio-group>
                    <i class="el-icon-warning" v-if="iconArry.icons3.warning"></i>
                    <i class="el-icon-success" v-if="iconArry.icons3.success"></i>
                </el-form-item>
                <!-- 原始记录 original-->
                <el-form-item label="原始记录：">
                    <el-upload
                        action="#" multiple :limit="100" :disabled="upBtnDis5"
                        class="upload_demo"
                        :file-list="upFileList5"
                        :on-exceed="uploadExceed"
                        :before-remove="upBefRemove"
                        :before-upload="file => beforeUpload(file,'upBtnDis4',upFileList5,'',5,currentData.pathFolder)"
                        :http-request="() => {}">
                        <el-button type="primary" :disabled="upBtnDis5">点击上传</el-button>
                    </el-upload>
                    <el-radio-group class="form_item_radio" v-model="radio5" :disabled="radioAllDis" 
                        @change="radioChangVal(radio5,'radio5','upBtnDis5',currentData.originalRecordList,'upFileList5')">
                        <el-radio label="1">电子归档</el-radio>
                        <el-radio label="2">纸质归档</el-radio>
                        <el-radio label="3">其他归档</el-radio>
                        <el-radio label="4">无</el-radio>
                    </el-radio-group>
                    <i class="el-icon-warning" v-if="iconArry.icons4.warning"></i>
                    <i class="el-icon-success" v-if="iconArry.icons4.success"></i>
                </el-form-item>
                <!-- 其他文件 other -->
                <el-form-item label="其他文件：">
                    <el-upload
                        action="#" multiple :limit="100" :disabled="upBtnDis6"
                        class="upload_demo"
                        :file-list="upFileList6"
                        :on-exceed="uploadExceed"
                        :before-remove="upBefRemove"
                        :before-upload="file => beforeUpload(file,'upBtnDis4',upFileList6,'',6,currentData.pathFolder)"
                        :http-request="() => {}">
                        <el-button type="primary" :disabled="upBtnDis6">点击上传</el-button>
                    </el-upload>
                    <el-radio-group class="form_item_radio" v-model="radio6" :disabled="radioAllDis" 
                        @change="radioChangVal(radio6,'radio6','upBtnDis6',currentData.otherFilesList,'upFileList6')">
                        <el-radio label="1">电子归档</el-radio>
                        <el-radio label="2">纸质归档</el-radio>
                        <el-radio label="3">其他归档</el-radio>
                        <el-radio label="4">无</el-radio>
                    </el-radio-group>
                    <i class="el-icon-warning" v-if="iconArry.icons5.warning"></i>
                    <i class="el-icon-success" v-if="iconArry.icons5.success"></i>
                </el-form-item>
            </el-tabs>

            <!-- 暂无数据 -->
            <div v-else class="form_item_noData">
                <img src="static/image/noData2.png" alt="暂无数据" class="noDataImg">
                <span>暂无数据</span>
            </div>
        </el-form>

        <!-- 操作按钮 -->
        <div class="form_oper_btn">
            <el-button @click="onPrev()" v-if="isShowFlag" :disabled="prevDis">上一页</el-button>
            <el-button @click="onNext()" v-if="isShowFlag" :disabled="nextDis">下一页</el-button>
            <el-button @click="onSubmitFile('1')" v-if="isSubmitFile" :disabled="operBtnDis">提交归档</el-button>
            <el-button @click="onPreDraft('2')" v-if="isPreDraft" :disabled="operBtnDis">保存草稿</el-button>
            <el-button @click="batchFile('1', 'batchSubmitGd')" v-if="isSubmitFile" :disabled="operBtnDis">批量提交归档</el-button>

            <!-- 列表无数据时 -->
            <el-button @click="noDataSubmitFile('1')" v-if="isNoDataFile">提交归档</el-button>
            <el-button @click="noDataSubmitFile('2')" v-if="isNoDataDraft">保存草稿</el-button>
            <el-button @click="batchFile('', 'batchConfirmGd')" v-if="isNoDataFile">批量确认归档</el-button>
        </div>
    </div>
</template>
<script>
var m = 0;
var n = 0;
export default {
    props: ['tableData2', 'renwu', 'dialogTableVisible', 'rows', 'permissions', 'tit', 'bysdj', 'lengtharr', 'lzyobj'],
    components: {},
    watch: {
        fileDialogVis: {
            immediate:true,
            handler(val) { 
                if(val) {
                    this.loading = true;
                    if(this.tableData2.length > 0) {
                        this.currentId = this.tableData2[0].id;
                        this.needReport = this.tableData2[0].needReport;
                    }
                    this.operBtnShow(); // 操作按钮-显示处理
                    this.showHandle(); // 显示处理
                    // this.uploadFileEcho(); // 上传文件回显
                    this.businessOrder(); // 上传-企业委托单-回显
                }
            }
        }
    },
    data() {
        return {
            loading: false, // 状态
            fileDialogVis: this.dialogTableVisible, // 当前归档-弹框显示状态
            taskCode: this.renwu, // 任务号
            taskRowDate: this.rows, // 任务-数据
            userPermis: this.permissions,  // 人员权限
            taskTitle: this.tit, // 任务-处理权限（1-我的报告/2-报告归档）
            upAllBtnDis: this.bysdj, // 上传按钮-是否允许操作状态
            reportDataLength: this.lengtharr, // 任务-所有报告数据的长度
            reportData: this.tableData2, // 任务-归档所有报告列表数据
            taskFileData: this.lzyobj, // 任务-归档的全部数据
            
            currentId: '', // 当前页面-id
            currentData: {}, // 当前页面-数据
            currentState: '', // 当前状态-值
            needReport: '',  // 实验报告-是否显示-=1显示

            radiox: '1', // 归档类型-试验报告
            radio1: '1', // 归档类型-企业委托单
            radio2: '1', // 归档类型-样品登记表
            radio3: '1', // 归档类型-样品照片
            radio4: '1', // 归档类型-试验过程照片
            radio5: '1', // 归档类型-原始记录
            radio6: '1', // 归档类型-其他文件
            radio1BtnDis: true, // 归档类型-企业委托单-禁用状态
            radioAllDis: true, // 归档类型-（除企业委托单）-禁用状态

            upBtnDis1: true, // 上传-禁用状态-企业委托单
            upBtnDis2: true, // 上传-禁用状态-样品登记表
            upBtnDis3: true, // 上传-禁用状态-样品照片
            upBtnDis4: true, // 上传-禁用状态-试验过程照片
            upBtnDis5: true, // 上传-禁用状态-原始记录
            upBtnDis6: true, // 上传-禁用状态-其他文件

            prevDis: false, // 上一页-禁用状态
            nextDis: false, // 下一页-禁用状态
            isShowFlag: true, // 页面/上一页/下一页-显示-开关
            isSubmitFile: true, // 提交归档-显示
            isNoDataFile: true, // 提交归档-列表无数据-显示
            isPreDraft: true, // 保存草稿-显示
            isNoDataDraft: true, // 保存草稿-列表无数据-显示
            operBtnDis: true, // 操作按钮-提交归档/保存草稿-禁用状态

            upFileList1: [], // 上传文件列表-企业委托单
            upFileList2: [], // 上传文件列表-样品登记表
            upFileList3: [], // 上传文件列表-样品照片
            upFileList4: [], // 上传文件列表-试验过程照片
            upFileList5: [], // 上传文件列表-原始记录
            upFileList6: [], // 上传文件列表-其他文件

            upSucNum: 0, // 上传文件-成功个数-用于判断全部上传
            upErrorCon: '', // // 上传文件-失败内容

            formInline: { // 表单
                taskCode: '',
                companyCheck: '',
                sampleName: '',
                searchdate: '',
                sampleType: '',
                zjsign: '',
                itemscode: '',
                docStatus: '',
            },
            iconArry: {
                icons1: {
                    warning: false,
                    success: false
                },
                icons2: {
                    warning: false,
                    success: false
                },
                icons3: {
                    warning: false,
                    success: false
                },
                icons4: {
                    warning: false,
                    success: false
                },
                icons5: {
                    warning: false,
                    success: false
                },
                icons6: {
                    warning: false,
                    success: false
                }
            },


            
            tabsActive: "0", // 页签-展示页的标识
            curTabId: 0, // 切换页签时-当前页签id
            tabIndex: 0, // 切换页签时-当前页签下标
            change_number: 0,//监听
            
        }
    },
    computed: {},
    mounted() { },
    // 提交类型：1提交归档; 2保存草稿; 3自动保存
    methods: {
        // 操作按钮-显示处理
        operBtnShow() {
            this.formInline.taskCode = this.taskCode; // 任务号
            this.prevDis = true;
            if (this.reportData.length == 1) {
                this.prevDis = true;
                this.nextDis = true;
            }
            if (this.reportDataLength == '0') {
                this.isShowFlag = false;  // 页面/上一页/下一页-显示-开关
                this.isSubmitFile = false; // 提交归档
                this.isPreDraft = false; // 保存草稿
                this.isNoDataFile = true; // 提交归档-列表无数据
                this.isNoDataDraft = true; // 保存草稿-列表无数据
            } else {
                this.isShowFlag = true;  // 页面/上一页/下一页-显示-开关
                this.isSubmitFile = true; // 提交归档
                this.isPreDraft = true; // 保存草稿
                this.isNoDataFile = false; // 提交归档-列表无数据
                this.isNoDataDraft = false; // 保存草稿-列表无数据
            }
        },
        // 显示处理
        showHandle(upfileState1) {
            // upfileState1  判断是否渲染企业委托单
            if (this.reportDataLength == '0') {
                return;
            }
            if (this.taskTitle == 1) { // 我的报告
                // 人员权限判断
                if (this.userPermis == 1 || this.userPermis == 3) {
                    this.radio1BtnDis = false;
                } else {
                    this.radio1BtnDis = true;
                }
                this.radioAllDis = false;
                this.radio1 == "1" ? this.upBtnDis1 = false : this.upBtnDis1 = true;
                this.radio2 == '1' ? this.upBtnDis2 = false : this.upBtnDis2 = true;
                this.radio3 == '1' ? this.upBtnDis3 = false : this.upBtnDis3 = true;
                this.radio4 == '1' ? this.upBtnDis4 = false : this.upBtnDis4 = true;
                this.radio5 == '1' ? this.upBtnDis5 = false : this.upBtnDis5 = true;
                this.radio6 == '1' ? this.upBtnDis6 = false : this.upBtnDis6 = true;
            } else if(this.taskTitle == 2) { //报告归档
                this.isPreDraft = false; // 保存草稿
                this.isNoDataDraft = false; // 保存草稿-列表无数据
                if (this.upAllBtnDis == '1') {
                    this.upBtnDis1 = false;
                    this.radio1BtnDis = false;
                    this.radioAllDis = true;
                } else {
                    this.upBtnDis1 = true;
                    this.radio1BtnDis = true;
                    this.radioAllDis = false;
                }
                this.radio2=='1' ? (this.upAllBtnDis=='1' ? this.upBtnDis2=true : this.upBtnDis2=false) : this.upBtnDis2=true;
                this.radio3=='1' ? (this.upAllBtnDis=='1' ? this.upBtnDis3=true : this.upBtnDis3=false) : this.upBtnDis3=true;
                this.radio4=='1' ? (this.upAllBtnDis=='1' ? this.upBtnDis4=true : this.upBtnDis4=false) : this.upBtnDis4=true;
                this.radio5=='1' ? (this.upAllBtnDis=='1' ? this.upBtnDis5=true : this.upBtnDis5=false) : this.upBtnDis5=true;
                this.radio6=='1' ? (this.upAllBtnDis=='1' ? this.upBtnDis6=true : this.upBtnDis6=false) : this.upBtnDis6=true;
            }
            this.$api.taskmanage.TaskReport(this.currentId).then(res => {
                this.loading = false;
                this.currentData = res.data.data; // 当前页面数据
                if (this.currentData.docStatus == '1') {
                    this.currentState = '已归档';
                    this.operBtnDis = true;
                } else if (this.currentData.docStatus == '-1') {
                    this.currentState = '已提交归档';
                    this.operBtnDis = false;
                } else {
                    this.currentState = '未提交归档';
                    this.operBtnDis = false;
                }

                if (this.upAllBtnDis != '1') {
                    if (this.change_number != 0) {
                        radioChangVal(this.radio2, 'radio2', 'upBtnDis2');
                        radioChangVal(this.radio3, 'radio3', 'upBtnDis3');
                        radioChangVal(this.radio4, 'radio4', 'upBtnDis4');
                        radioChangVal(this.radio5, 'radio5', 'upBtnDis5');
                        radioChangVal(this.radio6, 'radio6', 'upBtnDis6');
                    }
                }
                this.radioUploadDis(); // 单选/上传-禁用状态
                this.uploadFileEcho(upfileState1); // 上传文件回显
            }).catch((error) => {
                this.loading = false;
                this.currentData = [];
                this.$message.error('获取数据失败！');
            }); 
        },
        // 单选/上传-禁用状态-回显
        radioUploadDis() {
            // 企业委托单
            if(this.userPermis == 0) {
                this.upBtnDis1 = true;
            }else{
                if (this.currentData.taskSheetStatus == null) {
                    this.radio1 = '1';
                    this.upBtnDis1 = false;
                } else {
                    this.radio1 = JSON.stringify(this.currentData.taskSheetStatus);
                    this.currentData.taskSheetStatus == "1" ? this.upBtnDis1 = false : this.upBtnDis1 = true;
                }
            }
            // 实验报告
            if (this.currentData.testReportStatus == null || this.currentData.testReportStatus == "1") {
                this.radiox = '1';
            } else {
                this.radiox = JSON.stringify(this.currentData.testReportStatus);
            }
            // 样品登记表
            if (this.currentData.sampleRegistrationStatus == null || this.currentData.sampleRegistrationStatus == "1") {
                this.radio2 = '1';
                this.upAllBtnDis == '1' ? this.upBtnDis2 = true : this.upBtnDis2 = false;
            } else {
                this.radio2 = JSON.stringify(this.currentData.sampleRegistrationStatus);
                this.upBtnDis2 = true;
            }
            // 样品照片
            if (this.currentData.samplePicStatus == null || this.currentData.samplePicStatus == "1") {
                this.radio3 = '1';
                this.upAllBtnDis == '1' ? this.upBtnDis3 = true : this.upBtnDis3 = false;
            } else {
                this.radio3 = JSON.stringify(this.currentData.samplePicStatus);
                this.upBtnDis3 = true;
            }
            // 过程照片确认
            if (this.currentData.processPicStatus == null || this.currentData.processPicStatus == "1") {
                this.radio4 = '1';
                this.upAllBtnDis == '1' ? this.upBtnDis4 = true : this.upBtnDis4 = false;
            } else {
                this.radio4 = JSON.stringify(this.currentData.processPicStatus);
                this.upBtnDis4 = true;
            } 
            // 原始记录确认
            if (this.currentData.originalRecordStatus == null || this.currentData.originalRecordStatus == "1") {
                this.radio5 = '1';
                this.upAllBtnDis == '1' ? this.upBtnDis5 = true : this.upBtnDis5 = false;
            } else {
                this.radio5 = JSON.stringify(this.currentData.originalRecordStatus);
                this.upBtnDis5 = true;
            }
            // 其他文件确认
            if (this.currentData.otherFilesStatus == null || this.currentData.otherFilesStatus == "1") {
                this.radio6 = '1';
                this.upAllBtnDis == '1' ? this.upBtnDis6 = true : this.upBtnDis6 = false;
            } else {
                this.radio6 = JSON.stringify(this.currentData.otherFilesStatus);
                this.upBtnDis6 = true;
            }
        },
        // 上传文件-回显
        uploadFileEcho(upfileState1) {
            // upfileState1  判断是否渲染企业委托单
            this.upFileList2 = [];
            this.upFileList3 = [];
            this.upFileList4 = [];
            this.upFileList5 = [];
            this.upFileList6 = [];
            if(this.currentData) {
                if (upfileState1 != 1) {
                    // 上传文件列表-企业委托单
                    this.upFileList1 = [];
                    if (this.currentData.taskSheet && this.currentData.taskSheetFile) {
                        this.upFileList1 = [{
                            name: this.currentData.taskSheetFile.fileName + '.' + this.currentData.taskSheetFile.fileType, id: this.currentData.taskSheetFile.fileId
                        }];
                    }
                }

                // 上传文件列表-样品登记表
                if (this.currentData.sampleRegistrationList) {
                    let fileData2 = this.currentData.sampleRegistrationList;
                    fileData2.map(item => {
                        this.upFileList2.push({name: item.fileName+'.'+item.fileType, id: item.fileId});
                    });
                } else {
                    this.upFileList2 = [];
                }

                // 上传文件列表-样品照片
                if (this.currentData.samplePicList) {
                    let fileData3 = this.currentData.samplePicList;
                    fileData3.map(item => {
                        this.upFileList3.push({name: item.fileName+'.'+item.fileType, id: item.fileId});
                    });
                } else {
                    this.upFileList3 = [];
                }

                // 上传文件列表-试验过程照片
                if (this.currentData.processPicList) {
                    let fileData4 = this.currentData.processPicList;
                    fileData4.map(item => {
                        this.upFileList4.push({name: item.fileName+'.'+item.fileType, id: item.fileId});
                    });
                } else {
                    this.upFileList4 = [];
                }

                // 上传文件列表-原始记录
                if (this.currentData.originalRecordList) {
                    let fileData5 = this.currentData.originalRecordList;
                    fileData5.map(item => {
                        this.upFileList5.push({name: item.fileName+'.'+item.fileType, id: item.fileId});
                    });
                } else {
                    this.upFileList5 = [];
                }

                // 上传文件列表-其他文件
                if (this.currentData.otherFilesList) {
                    let fileData6 = this.currentData.otherFilesList;
                    fileData6.map(item => {
                        this.upFileList6.push({name: item.fileName+'.'+item.fileType, id: item.fileId});
                    });
                } else {
                    this.upFileList6 = [];
                }
            }
        },
        // 上传文件列表-企业委托单-回显
        businessOrder() {
            if(this.userPermis == 0){
                this.upBtnDis1 = true;
                if (this.taskFileData.taskSheetStatus == null || this.taskFileData.taskSheetStatus == "1") { 
                    this.radio1 = '1';
                }else{
                    this.radio1 = JSON.stringify(this.taskFileData.taskSheetStatus);
                }
            }else{
                if (this.taskFileData.taskSheetStatus == null || this.taskFileData.taskSheetStatus == "1") {
                    this.radio1 = '1';
                    this.upBtnDis1 = false;
                } else {
                    this.radio1 = JSON.stringify(this.taskFileData.taskSheetStatus);
                    this.upBtnDis1 = true;
                }
            }
            if (this.taskFileData.taskSheet && this.taskFileData.taskSheetFile) {
                this.upFileList1 = [{
                    name: this.taskFileData.taskSheetFile.fileName + '.' + this.taskFileData.taskSheetFile.fileType, 
                    id: this.taskFileData.taskSheetFile.fileId
                }];
                // let divone6 = document.querySelector(".div6");
                // let uploadLlist6 = document.querySelector(".enterprise .el-upload-list");
                // uploadLlist6 ? uploadLlist6.style.width = divone6.offsetWidth + 'px' : '';
            }
        },
        // 单选-改变时-企业委托单
        radioTaskSheet(value) {
            this.radio1 = value;
            if(this.userPermis == 0){
                this.upBtnDis1 = true;
            }else{
                if (this.radio1 != '1') {
                    this.upBtnDis1 = true;
                } else {
                    this.upBtnDis1 = false;
                }
            }
        },
        // 单选-改变时-试验报告
        radioTestReport(value) {
            this.radiox = value;
            this.change_number++;
        },
        // 单选-改变时--赋值/上传-禁用状态
        radioChangVal(val, radioVal, upDisVal, fileData, upFileList) {
            this[radioVal] = val;
            this.change_number++;
            if (val != '1') {
                this[upDisVal] = true;
                this[upFileList] = [];
            } else {
                this[upDisVal] = false;
                this[upFileList] = [];
                fileData.map(item => {
                    this[upFileList].push({name: item.fileName+'.'+item.fileType, id: item.fileId});
                });
            }
        },
        // 上传-超出上传数量-企业委托单
        upExceedTaskSheet(files, fileList) {
            this.$message.warning('企业委托单只允许上传一个文件，去删除后再上传！');
        },
        // 上传-超出上传数量
        uploadExceed(files, fileList) {
            this.$message.warning('次选择了'+files.length+'个文件，最多可上传100张图片');
        },
        // 上传-删除前的判断
        upBefRemove(file, fileList) {
            if(file && file.status==="success") {
                if (this.currentState == '已归档') {
                    this.$message.warning('已经提交归档不可以删除文件');
                    return false;
                } else {
                    this.$confirm('确定删除'+file.name+'吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params = {
                            taskContentId: this.currentId,
                            fileId: file.id,
                            pathFolder: this.currentData.pathFolder,
                            type: 3
                        };
                        this.uploadRemove(params);
                        this.change_number++;
                        return false;
                    }).catch(() => {
                        this.$message.info('已取消删除');
                        return false;        
                    });
                    return false; 
                }
            }
        },
        // 上传-删除
        uploadRemove(params) {
            this.loading = true;
            this.$api.taskmanage.delAttach(params).then(res => {
                this.$message.success(res.data.message);
                this.change_number = 0;
                this.showHandle(1);
            }).catch(res => {
                this.$message.success(res.data.message);
                this.loading = false;
            })
        },
        // 上传-前的判断
        beforeUpload(file,upDis,fileList,fileId,fileType,pathFolder) {
            this.upSucNum = 0; // 上传文件-成功个数-用于判断全部上传
            this.upErrorCon = '';
            this[upDis] = true;
            let flag = fileList.filter(item => {
                return file.name == item.name;
            }).length;
            if (flag != 0) {
                this.$message.warning('请勿上传相同文件!');
                return false;
            }
            if (this.currentState == '已归档') {
                this.$message.warning(`已经提交归档不可以上传文件`);
                return false;
            } else {
                fileList.push({name: file.name});
                let params = new FormData();
                if(fileId) {
                    params.append("taskId", fileId);
                } else {
                    params.append("taskContentId", this.currentId);
                }
                if(pathFolder) {
                    params.append("pathFolder", this[pathFolder].pathFolder);
                }
                params.append("file", file);
                params.append("type", fileType);
                this.$api.taskmanage.uploadAttach(params).then(res => {
                    this.upSucNum++;
                    if(this.upSucNum == fileList.length) {
                        this.preserveFileState(fileType,fileId,pathFolder);
                    }
                }).catch(error => {
                    // this.$message.error(error.data.message)
                    this.upErrorCon += error.data.message + '   ';
                });
            }
        },
        // 上传完后-保存归档状态
        preserveFileState(fileType,fileId,pathFolder) {
            this.$message.success('上传成功');
            if(this.upErrorCon) {
                this.$message.error(this.upErrorCon)
            }
            let params = {
                type: fileType
            }
            if(fileId) {
                params.taskId = fileId;
            } else {
                params.taskContentId = this.currentId
            }
            if(pathFolder) {
                params.pathFolder =  this[pathFolder].pathFolder;
            }
            // 上传附件后改变状态以便批量上传时修改状态表数据不触发乐观锁
            this.$api.taskmanage.saveUploadAttachStatus(params).then(res => {
                this.$message.success('保存归档状态成功');
                this.change_number = 0;
                this.showHandle(1);
            }).catch(error => {
                this.$message.error(error.data.message);
                this.change_number = 0;
                this.showHandle(1);
            });
        },
        // 处理-企业委托单id
        handleTaskSheetId(dataList) {
            let taskSheet = null;
            if (dataList.length == 0) {
                taskSheet = null;
            } else {
                taskSheet = dataList[0].id;
            }
            return taskSheet;
        },
        // 处理上传文件
        handleFileList(data) {
            let uploadFile = '';
            if (data.length == 0) {
                return uploadFile
            } else {
                data.map(item => {
                    uploadFile += item.id + ',';
                });
                uploadFile = uploadFile.substring(0, uploadFile.length-1);
                return uploadFile;
            }
        },
        // 页面数据改变时-自动保存数据
        saveData(state, flag) {
            // state // 提交类型：1提交归档; 2保存草稿; 3自动保存
            // flag 是否调用回显接口
            let params = {
                submitType: state, // 提交类型
                taskId: this.taskRowDate.id,              // 任务id
                taskContentId: this.currentId,            // 任务报告id(主键，唯一)
                testReportStatus: this.radiox,            // 试验报告，是否为纸质归档 0 否 1是

                taskSheetStatus: this.radio1,             // 企业委托单-状态  1电子归档 2纸质归档 3其他归档 4 无
                sampleRegistrationStatus: this.radio2,    // 样品登记表-状态  1电子归档 2纸质归档 3其他归档 4 无
                samplePicStatus: this.radio3,             // 样品照片-状态    1电子归档 2纸质归档 3其他归档 4 无
                processPicStatus: this.radio4,            // 过程照片-状态    1电子归档 2纸质归档 3其他归档 4 无
                originalRecordStatus: this.radio5,        // 原始记录表-状态  1电子归档 2纸质归档 3其他归档 4 无
                otherFilesStatus: this.radio6,            // 其他文件-状态    1电子归档 2纸质归档 3其他归档 4 无

                taskSheet: this.handleTaskSheetId(this.upFileList1),                      // 企业委托单-上传
                sampleRegistration: this.handleFileList(this.upFileList2),   // 样品登记表-上传，数组类型，
                samplePic: this.handleFileList(this.upFileList3),            // 样品照片-上传，数组类型，
                processPic: this.handleFileList(this.upFileList4),           // 过程照片-上传，数组类型，
                originalRecord: this.handleFileList(this.upFileList5),       // 原始文件表-上传息，数组类型，
                otherFiles: this.handleFileList(this.upFileList6),           // 其他文件-上传，数组类型，下面有字符串类型
            }
            this.$api.taskmanage.submitGd(params).then(res => {
                this.change_number = 0;
                if(flag) {
                    this.showHandle(1);
                }
                return true;
            }).catch(error => {
                this.$message.error(error.data.message);
                this.change_number = 0;
                if(flag) {
                    this.showHandle(1);
                }
                return false;
            });
        },
        // 提交归档/保存草稿-列表无数据时
        noDataSubmitFile(state) {
            this.loading = true;
            let params = {
                submitType: state, // 提交类型：1提交归档; 2保存草稿; 3自动保存
                taskId: this.taskRowDate.id, //任务id
                // taskSheetStatus: this.radio1, // 企业委托单-状态  1电子归档 2纸质归档 3其他归档 4 无
                // taskSheet: this.upFileList1[0].id, // 上传-企业委托单id
            }
            // if (this.upFileList1.length == 0 && this.radio1 == 1) {
            //     this.iconArry.icons6.warning = true;
            //     this.iconArry.icons6.success = false;
            // } else if (this.radio1 != 1) {
            //     this.iconArry.icons6.warning = false;
            //     this.iconArry.icons6.success = false
            // } else {
            //     this.iconArry.icons6.warning = false;
            //     this.iconArry.icons6.success = true
            // }
            // if(this.radio1 == 1 && this.upFileList1.length == 0){
            //     this.$alert('请上传所有信息', {
            //         dangerouslyUseHTMLString: true
            //     });
            //     return;
            // } else { }
            this.$api.taskmanage.submitGd(params).then(res => {
                this.loading = false;
                this.$message.success(res.data.message);
                // this.iconArry.icons6.warning = false;
                // this.iconArry.icons6.success = true;
                this.taskFileData = res.data.data;
                this.upFileList1 = [];
                // this.businessOrder(); // 上传-企业委托单-回显
            }).catch(error => {
                this.loading = false;
                this.$message.error(error.data.message);
                // this.iconArry.icons6.warning = true;
                // this.iconArry.icons6.success = false;
            });
        },
        // 提交归档
        onSubmitFile(state) {
            this.loading = true;
            let params = {
                taskId: this.taskRowDate.id,   // 任务id
                submitType: state,
                taskContentId: this.currentId,            //任务报告id(主键，唯一)
                
                testReportStatus: this.radiox,            // 试验报告  是否为纸质归档 0 否 1是
                // taskSheetStatus: this.radio1,             // 企业委托单-状态  1电子归档 2纸质归档 3其他归档 4 无
                sampleRegistrationStatus: this.radio2,    // 样品登记表-状态  1电子归档 2纸质归档 3其他归档 4 无
                samplePicStatus: this.radio3,             // 样品照片-状态    1电子归档 2纸质归档 3其他归档 4 无
                processPicStatus: this.radio4,            // 过程照片-状态    1电子归档 2纸质归档 3其他归档 4 无
                originalRecordStatus: this.radio5,        // 原始记录表-状态  1电子归档 2纸质归档 3其他归档 4 无
                otherFilesStatus: this.radio6,            // 其他文件-状态    1电子归档 2纸质归档 3其他归档 4 无

                // taskSheet: this.handleTaskSheetId(this.upFileList1),         // 上传-企业委托单
                sampleRegistration: this.handleFileList(this.upFileList2),   // 上传-样品登记表
                samplePic: this.handleFileList(this.upFileList3),            // 上传-样品照片
                processPic: this.handleFileList(this.upFileList4),           // 上传-过程照片
                originalRecord: this.handleFileList(this.upFileList5),       // 上传-原始文件
                otherFiles: this.handleFileList(this.upFileList6),           // 上传-其他文件
            
            }
            // // 报告归档
            // if (this.upAllBtnDis == '1') {
            //     if (this.upFileList1.length == 0 && this.radio1 == 1) {
            //         this.iconArry.icons6.warning = true;
            //         this.iconArry.icons6.success = false;
            //     } else if (this.radio1 != 1) {
            //         this.iconArry.icons6.warning = false;
            //         this.iconArry.icons6.success = false
            //     } else {
            //         this.iconArry.icons6.warning = false;
            //         this.iconArry.icons6.success = true;
            //     }
            //     if (this.radio1 == 1 && this.upFileList1.length != 0) {
            //         m++;
            //     }
            //     if (this.radio1 == 1) {
            //         n++;
            //     }
            // } else { // 我的报告
            //     if (this.userPermis == 1 || this.userPermis == 3) {
            //         // 判断企业委托单上传的文件信息是否存在
            //         if (this.upFileList1.length == 0 && this.radio1 == 1) {
            //             this.iconArry.icons6.warning = true;
            //             this.iconArry.icons6.success = false;
            //         } else if (this.radio1 != 1) {
            //             this.iconArry.icons6.warning = false;
            //             this.iconArry.icons6.success = false
            //         } else {
            //             this.iconArry.icons6.warning = false;
            //             this.iconArry.icons6.success = true;
            //         }
            //         if (this.radio1 == 1 && this.upFileList1.length != 0) {
            //             m++;
            //         }
            //         if (this.radio1 == 1) {
            //             n++;
            //         }
            //         this.upIconState();
            //     } else {
            //         this.upIconState();
            //     }
            // }
            // if (m != n) {
            //     this.$alert('请上传所有信息', {
            //         dangerouslyUseHTMLString: true
            //     });
            //     m = 0;
            //     n = 0;
            //     return;
            // }
            this.$api.taskmanage.submitGd(params).then(res => {
                this.$message.success(res.data.message);
                this.showHandle(1);
                this.change_number = 0;
            }).catch(error => {
                this.$message.error(error.data.message);
                this.loading = false;
            })
        },
        // 保存草稿
        onPreDraft(state) {
            this.loading = true;
            let params = {
                taskId: this.taskRowDate.id,   // 任务id
                submitType: state,
                taskContentId: this.currentId,            //任务报告id(主键，唯一)
                
                testReportStatus: this.radiox,            // 试验报告  是否为纸质归档 0 否 1是
                // taskSheetStatus: this.radio1,             // 企业委托单-状态  1电子归档 2纸质归档 3其他归档 4 无
                sampleRegistrationStatus: this.radio2,    // 样品登记表-状态  1电子归档 2纸质归档 3其他归档 4 无
                samplePicStatus: this.radio3,             // 样品照片-状态    1电子归档 2纸质归档 3其他归档 4 无
                processPicStatus: this.radio4,            // 过程照片-状态    1电子归档 2纸质归档 3其他归档 4 无
                originalRecordStatus: this.radio5,        // 原始记录表-状态  1电子归档 2纸质归档 3其他归档 4 无
                otherFilesStatus: this.radio6,            // 其他文件-状态    1电子归档 2纸质归档 3其他归档 4 无

                // taskSheet: this.handleTaskSheetId(this.upFileList1),         // 上传-企业委托单
                sampleRegistration: this.handleFileList(this.upFileList2),   // 上传-样品登记表
                samplePic: this.handleFileList(this.upFileList3),            // 上传-样品照片
                processPic: this.handleFileList(this.upFileList4),           // 上传-过程照片
                originalRecord: this.handleFileList(this.upFileList5),       // 上传-原始文件
                otherFiles: this.handleFileList(this.upFileList6),           // 上传-其他文件
            
            }
            this.$api.taskmanage.submitGd(params).then(res => {
                this.$message.success(res.data.message);
                this.iconArry.icons1.warning = false;
                this.iconArry.icons1.success = true;
                this.iconArry.icons2.warning = false;
                this.iconArry.icons2.success = true;
                this.iconArry.icons3.warning = false;
                this.iconArry.icons3.success = true;
                this.iconArry.icons4.warning = false;
                this.iconArry.icons4.success = true;
                this.iconArry.icons5.warning = false;
                this.iconArry.icons5.success = true;
                this.iconArry.icons6.warning = false;
                this.iconArry.icons6.success = true;
                this.change_number = 0;
                this.showHandle(1);
            }).catch(error => {
                this.$message.error(error.data.message);
                this.loading = false;
            })
        },
        // 上传-icon图标状态
        upIconState() {
            if (this.upFileList2.length == 0 && this.radio2 == 1) {
                this.iconArry.icons1.warning = true;
                this.iconArry.icons1.success = false;
            } else if (this.radio2 != 1) {
                this.iconArry.icons1.warning = false;
                this.iconArry.icons1.success = false
            } else {
                this.iconArry.icons1.warning = false;
                this.iconArry.icons1.success = true;
            }
            // 样品照片-上传文件-信息是否存在
            if (this.upFileList3.length == 0 && this.radio3 == 1) {
                this.iconArry.icons2.warning = true;
                this.iconArry.icons2.success = false;
            } else if (this.radio3 != 1) {
                this.iconArry.icons2.warning = false;
                this.iconArry.icons2.success = false
            } else {
                this.iconArry.icons2.warning = false;
                this.iconArry.icons2.success = true;
            }
            // 过程照片-上传文件-信息是否存在
            if (this.upFileList4.length == 0 && this.radio4 == 1) {
                this.iconArry.icons3.warning = true;
                this.iconArry.icons3.success = false;
            } else if (this.radio4 != 1) {
                this.iconArry.icons3.warning = false;
                this.iconArry.icons3.success = false
            } else {
                this.iconArry.icons3.warning = false;
                this.iconArry.icons3.success = true;
            }
            // 原始文件表-上传文件-信息是否存在
            if (this.upFileList5.length == 0 && this.radio5 == 1) {
                this.iconArry.icons4.warning = true;
                this.iconArry.icons4.success = false;
            } else if (this.radio5 != 1) {
                this.iconArry.icons4.warning = false;
                this.iconArry.icons4.success = false;
            } else {
                this.iconArry.icons4.warning = false;
                this.iconArry.icons4.success = true;
            }
            // 其他文件-上传文件-信息是否存在
            if (this.upFileList6.length == 0 && this.radio6 == 1) {
                this.iconArry.icons5.warning = true;
                this.iconArry.icons5.success = false;
            } else if (this.radio6 != 1) {
                this.iconArry.icons5.warning = false;
                this.iconArry.icons5.success = false;
            } else {
                this.iconArry.icons5.warning = false;
                this.iconArry.icons5.success = true;
            }

            if (this.radio2 == 1 && this.upFileList2.length != 0) {
                m++;
            }
            if (this.radio3 == 1 && this.upFileList3.length != 0) {
                m++;
            }
            if (this.radio4 == 1 && this.upFileList4.length != 0) {
                m++;
            }
            if (this.radio5 == 1 && this.upFileList5.length != 0) {
                m++;
            }
            if (this.radio6 == 1 && this.upFileList6.length != 0) {
                m++;
            }

            if (this.radio2 == 1) {
                n++;
            }
            if (this.radio3 == 1) {
                n++;
            }
            if (this.radio4 == 1) {
                n++;
            }
            if (this.radio5 == 1) {
                n++;
            }
            if (this.radio6 == 1) {
                n++;
            }
        },
        // 切换页签时
        switchTab(i) {
            this.loading = true;
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
            this.change_number = 0;
            this.saveData('3', true);
            this.currentId = this.reportData[this.tabIndex].id;
            this.needReport = this.reportData[this.tabIndex].needReport;
        },
        // 上一页
        onPrev() {
            this.loading = true;
            this.change_number = 0;
            this.saveData('3', true);
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
            } else {
                this.tabIndex = 0;
            }
            this.iconState();
        },
        //下一页
        onNext() {
            this.loading = true;
            this.change_number = 0;
            this.saveData('3', true);
            this.change_number = 0;
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
            } else {
                this.tabIndex = this.reportData.length - 1;
            }
            this.iconState();
        },
        // 成功/失败-图标显示状态
        iconState() {
            this.iconArry.icons1.warning = false;
            this.iconArry.icons1.success = false;
            this.iconArry.icons2.warning = false;
            this.iconArry.icons2.success = false;
            this.iconArry.icons3.warning = false;
            this.iconArry.icons3.success = false;
            this.iconArry.icons4.warning = false;
            this.iconArry.icons4.success = false;
            this.iconArry.icons5.warning = false;
            this.iconArry.icons5.success = false;
            this.iconArry.icons6.warning = false;
            this.iconArry.icons6.success = false;
        },
        // 批量提交归档/批量确认归档
        batchFile(state, Interface) {
            // state 提交类型：1提交归档; 2保存草稿; 3自动保存
            this.loading = true;
            this.saveData(3, false);
            let params = {
                taskId: this.taskRowDate.id, // 任务id
                // taskSheetStatus: this.radio1,  // 企业委托单-状态  1电子归档 2纸质归档 3其他归档 4 无
                // taskSheet: this.handleTaskSheetId(this.upFileList1), // 上传-企业委托单
            };
            if(state) {
                params.submitType = state;
            }
            // // 报告归档
            // if (this.upAllBtnDis == '1') {
            //     if (this.upFileList1.length == 0 && this.radio1 == 1) {
            //         this.iconArry.icons6.warning = true;
            //         this.iconArry.icons6.success = false;
            //     } else if (this.radio1 != 1) {
            //         this.iconArry.icons6.warning = false;
            //         this.iconArry.icons6.success = false
            //     } else {
            //         this.iconArry.icons6.warning = false;
            //         this.iconArry.icons6.success = true;
            //     }
            //     if (this.radio1 == 1 && this.upFileList1.length != 0) {
            //         m++;
            //     }
            //     if (this.radio1 == 1) {
            //         n++;
            //     }
            // } else { // 我的报告
            //     if (this.userPermis == 1 || this.userPermis == 3) {
            //         // 判断企业委托单上传的文件信息是否存在
            //         if (this.upFileList1.length == 0 && this.radio1 == 1) {
            //             this.iconArry.icons6.warning = true;
            //             this.iconArry.icons6.success = false;
            //         } else if (this.radio1 != 1) {
            //             this.iconArry.icons6.warning = false;
            //             this.iconArry.icons6.success = false
            //         } else {
            //             this.iconArry.icons6.warning = false;
            //             this.iconArry.icons6.success = true;
            //         }
            //         if (this.radio1 == 1 && this.upFileList1.length != 0) {
            //             m++;
            //         }
            //         if (this.radio1 == 1) {
            //             n++;
            //         }
            //         this.upIconState();
            //     } else {
            //         this.upIconState();
            //     }
            // }
            // if (m != n) {
            //     this.$alert('请上传所有信息', {
            //         dangerouslyUseHTMLString: true
            //     });
            //     m = 0;
            //     n = 0;
            //     return;
            // }
            this.$api.myReport[Interface](params).then(res => {
                this.$message.success(res.data.data);
                this.showHandle(1);
                this.change_number = 0;
            }).catch(error => {
                this.$message.error(error.data.message);
                this.loading = false;
            });
        },
    },
    created() { }
}
</script>

<style scoped lang="scss">
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
