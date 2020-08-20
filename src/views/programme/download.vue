<template>
    <!-- 统计表下载 -->
    <div class="download_border">
        <div class="download_con">
            <!-- 查询 -->
            <div class="query_modular">
                <div class="query_complex">
                    <el-form :inline="true" :model="formQuery" label-width="100px" class="query_form">
                        <el-form-item label="任务号：" >
                            <el-input v-model.trim="formQuery.taskCode" clearable @keyup.enter.native="enterQuery" name="clearInputValue"></el-input>
                        </el-form-item>
                        <el-form-item label="受检单位：" >
                            <el-input v-model.trim="formQuery.companyCheck" clearable @keyup.enter.native="enterQuery" name="clearInputValue"></el-input>
                        </el-form-item>
                        <el-form-item label="样品名称：" >
                            <el-input v-model.trim="formQuery.sampleName" clearable @keyup.enter.native="enterQuery" name="clearInputValue"></el-input>
                        </el-form-item>
                        <el-form-item label="中机状态：" >
                            <el-select v-model="formQuery.zjsign">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已经上传中机" value="7"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="查询年份：" v-show="showState">
                            <el-select v-model="formQuery.searchdate">
                                <el-option v-for="item in dateList" :key="item.id" 
                                    :label="item.title" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="规格型号：" v-show="showState">
                            <el-input v-model.trim="formQuery.sampleType" clearable @keyup.enter.native="enterQuery" name="clearInputValue"></el-input>
                        </el-form-item>
                        <el-form-item label="完成状态：" v-show="showState">
                            <el-select v-model="formQuery.task_status">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="未完成" value="2"></el-option>
                                <el-option label="已完成" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="归档状态：" v-show="showState">
                            <el-select v-model="formQuery.docStatus">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="未归档" value="0"></el-option>
                                <el-option label="已归档" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发送状态：" v-show="showState">
                            <el-select v-model="formQuery.send">
                                <el-option label="全部" value="0"></el-option>
                                <el-option label="未发送" value="1"></el-option>
                                <el-option label="已发送" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>

                    <!-- 展开/收起 -->
                    <div class="query_show">
                        <el-button v-if="showbut!=0" @click="clickshowbut(0)" type="text" class="query_showBtn">
                            收起 <i class="el-icon-arrow-up"></i>
                        </el-button>
                        <el-button v-else-if="showbut==0" @click="clickshowbut(1)" type="text" class="query_showBtn">
                            展开 <i class="el-icon-arrow-down"></i>
                        </el-button>
                    </div>
                </div>

                <!-- 查询按钮 -->
                <div class="query_btn">
                    <p></p>
                    <p class="query_rightbtn">
                        <el-button type="primary" @click="onClickQuery(1,10)">查询</el-button>
                        <!-- <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button> -->
                    </p>
                </div>
            </div>

            <!-- 表格与分页 -->
            <div v-loading="loading" class="tablePagination_modular">
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table ref="table" class="table_datalist"
                        border stripe :data="tablelist"
                        :header-cell-style="{
                            'background-color': 'rgba(243,246,253,1)',
                            'color': '#606266',
                            'padding': '10px 0' }"
                        :row-style="tableRowStyle">
                        <el-table-column align="center" :resizable="false" prop="taskCode" label="任务号" >
                            <template slot-scope="scope">
                                <span v-if="scope.row.tsign == '1'" style="color:red">{{scope.row.taskCode}}</span>
                                <span v-else-if="scope.row.tsign == '2'" style="color:green">{{scope.row.taskCode}}</span>
                                <span v-else>{{scope.row.taskCode}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="taskStatusStyle" label="状态"          
                            class-name="stateTaskStatus">
                            <template slot-scope="scope">
                                <p v-for="(item,i) in scope.row.taskStatusList" :key="i" v-show="item" class="taskStatusStyleclass">{{item}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="orgName" label="科室" ></el-table-column>
                        <el-table-column align="center" :resizable="false" label="类别" >
                            <template slot-scope="scope">
                                <span v-if="scope.row.sampleSign == '1'" style="color:red">{{scope.row.checkTypeID}}</span>
                                <span v-else>{{scope.row.checkTypeID}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="sampleType" label="样品规格型号" ></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="sampleName" label="样品名称"
                            :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="companyCheck" label="受检单位" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column align="center" :resizable="false" v-if="copypageState == 2" label="操作"  width="420">
                            <template slot-scope="scope">
                                <el-button type="text" class="operation_btn" @click="onClickbrowse(scope.row)">浏览</el-button>
                                <el-button type="text" class="operation_btn" @click="onClickdownload(scope.row, 0)">下载统计表</el-button>
                                <el-button type="text" class="operation_btn" @click="onClickCancelBinding(scope.row)">取消绑定</el-button>
                                <el-button type="text" class="operation_btn" @click="onClickdownload(scope.row, 2)">下载完成统计表</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" v-else-if="copypageState == 3" label="操作" >
                            <template slot-scope="scope">
                                <el-button type="text" class="operation_btn" @click="onClickBindingProgramme(scope.row)">绑定到方案</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" v-else label="操作" >
                            <template>
                                <el-button type="text" class="operation_btn">复制信息</el-button>
                            </template>
                        </el-table-column>
                        <!-- 二级弹出 -->
                        <el-table-column :resizable="false" type="expand" width="1">
                            <template>
                                <div class="twoTable_btn">
                                    <el-button type="primary" style="marginLeft:10px;" @click="onSubmitQuick">快查</el-button>
                                    <el-button type="primary" style="marginLeft:10px;" @click="onClickRegressionDraft">退回草稿</el-button>
                                    <el-button type="primary" style="marginLeft:10px;" v-if="task_status == 1" @click="onClickmodifyReport">
                                        允许主检修改报告
                                    </el-button>
                                    <el-button type="primary" style="marginLeft:10px;" v-if="task_status == 1" @click="onClickRegression">回退</el-button>
                                    <!-- <el-button type="primary" style="marginLeft:10px;" @click="clickSearchTaskDoc(scope.row.id)">任务说明</el-button> -->
                                </div>

                                <div>
                                    <el-table ref="twoTable"
                                        border stripe :data="twoTableList"
                                        :header-cell-style="{
                                            'background-color': 'rgba(243,246,253,1)',
                                            'color': '#606266',
                                            'padding': '10px 0'
                                        }"
                                        @selection-change="handleSelectionChange">
                                        <el-table-column align="center" :resizable="false" type="selection" ></el-table-column>
                                        <el-table-column align="center" :resizable="false" prop="itemsCode" label="报告编号" ></el-table-column>
                                        <el-table-column align="center" :resizable="false" prop="itemsName" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
                                        <el-table-column align="center" :resizable="false" prop="master" label="主检人" ></el-table-column>
                                        <el-table-column align="center" :resizable="false" prop="orgName" label="公章类型" >
                                            <template slot-scope="scope">
                                                <div style="display:flex;justifyContent:center;alignItems:center;">
                                                    <el-select size="medium" style="width:160px;" v-model="scope.row.orgName">
                                                        <el-option v-for="(item,i) in scope.row.clist" :key="i" 
                                                        :label="item.name"
                                                        :value="item.id"></el-option>
                                                    </el-select>
                                                    <el-button
                                                        type="primary"
                                                        v-show="task_status == 1"
                                                        @click="onClickModifyOrgName(scope.row, scope.row.orgName)"
                                                        style="fontSize:12px;height:20px;padding:0 5px;marginLeft:5px;">修改
                                                    </el-button>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" :resizable="false" prop="checkTypeID" label="流转信息" ></el-table-column>
                                        <el-table-column align="center" :resizable="false" label="操作" >
                                            <template slot-scope="scope">
                                                <el-button type="text" class="operation_btn" @click="onClickFlow(scope.row)">流转</el-button>
                                            </template>
                                        </el-table-column>
                                        <!-- 三级弹出 -->
                                        <el-table-column :resizable="false" type="expand" width="1">
                                            <template slot-scope="scope">
                                                <threeFlowTable :threeTableList="threeTableList" :scope="scope"/>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 分页 -->
                <el-pagination
                    class="pagination_modular"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :page-sizes="[10,20,30]"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange">
                </el-pagination>
            </div>
            
        
        </div>

        <!-- 绑定页面 -->
        <el-dialog
            :fullscreen="true" :modal="true" center title="绑定" class="choice_model"
            :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="bindingVisible">
            <Tableload :tableloadData="tableloadData" @closeBindingVisible="onCloseBindingVisible"/>
        </el-dialog>

        <!-- 任务退回对话框 -->
        <el-dialog title="任务回退" :visible.sync="returnVisible">
            <el-form :model="returnForm" label-width="auto">
                <el-form-item label="选择节点：">
                <el-select v-model="returnForm.backprocessinstance" size="medium">
                    <el-option v-for="item in draftSelectData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="原因：">
                <el-input
                    v-model.trim="returnForm.reason"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    maxlength="200"
                    show-word-limit>
                </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="returnVisible = false">取 消</el-button>
                <el-button type="primary" @click="onClickReturnDraft">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 任务说明对话框 -->
        <!-- <el-dialog title="任务说明" :visible.sync="searchTaskDocVisible">
            <el-form :model="missionStatementForm" label-width="auto">
                <el-form-item label="任务说明：">
                <el-input
                    v-model.trim="missionStatementForm.taskExplain"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}">
                </el-input>
                </el-form-item>
                <el-form-item label="补充说明：">
                <el-input
                    v-model.trim="additionalExplanation"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}">
                </el-input>
                <el-button type="primary" @click="clickSaveTaskExplain(additionalExplanation)">保存</el-button>
                </el-form-item>
                <el-form-item label="备注：">
                <el-input v-model.trim="missionStatementForm.checkRemark2"></el-input>
                <el-button type="primary" @click="clickSaveCheckRemark(missionStatementForm.checkRemark2)">修改任务单备注dcb专用
                </el-button>
                </el-form-item>
            </el-form>
        </el-dialog> -->

        <!--快查的对话框-->
        <el-dialog :close-on-press-escape="false"
            :close-on-click-modal="false" width="80%" title="快速查看"
            :visible.sync="dialogQuickly"
            :before-close="handleDialogQuickly" class="dialog_quickly">
            <Quiickready @selectproductValue="selectproductValue" @nextReportBtn="nextReportBtn"
            :indexValueId="indexValueId" :percentage="percentage" :productValue="productValue" :initialState="initialState"
            :tableDataImg="tableDataImg" :numberData="number" :imgCountPage="imgCountPage" :uploadIdList="uploadIdList">
            </Quiickready>
        </el-dialog>

        <!-- 统计表下载插件 -->
        <object id="STATICTABLE" classid="clsid:0B846D4B-EB6C-4a15-A415-FF0785D39320" Width="0" Height="0" style="display:block"></object>
    </div>
</template>

<script>
import base from '@/api/base'
import threeFlowTable from '@/components/threeFlowTable'
import Tableload from './component/tableLoad.vue'; // 绑定页面
import Quiickready from '@/components/Quiickready'
export default {
    name: 'download',
    components: {threeFlowTable, Tableload, Quiickready},
    props: ['copypage','rowData','rowStatisticsId'],
    watch: {
        copypage: {
            immediate:true,
            handler(val) {
                val ? this.copypageState = val : this.copypageState = 2;
            },
        },
        rowData: {
            immediate:true,
            handler(val) {
                if(val){
                    this.show = false; // 收起/展开--状态
                    this.showbut = 0; // 收起/展开--内容
                    this.formQuery = { // 查询表单数据
                        taskCode: val.taskCode ? val.taskCode : 'MT', // 任务号
                        companyCheck: val.companyCheck ? val.companyCheck : '', // 受检单位
                        sampleName: val.sampleName ? val.sampleName : '', // 样品名称
                        zjsign: val.zjsign ? val.zjsign : '', // 状态
                        searchdate: val.searchdate ? val.searchdate : this.currentYear, // 查询年份
                        sampleType: val.sampleType ? val.sampleType : '', // 规格型号
                        task_status: val.task_status ? val.task_status : '', // 状态
                        tsign: val.tsign ? val.tsign : '', // 财务
                        docStatus: val.docStatus ? val.docStatus : '', // 报告归档
                        search_field: val.search_field ? val.search_field : '', // 查询其他
                        search_data: val.search_data ? val.search_data : '', // 数据
                        send: val.send ? val.send : '0' // 发送状态
                    };
                }
            },
        },
        rowStatisticsId: {
            immediate:true,
            handler(val) {
                this.tablelist = [];
                this.show = false; // 收起/展开--状态
                this.showbut = 0; // 收起/展开--内容
            },
        },
    },
    data() {
        return {
            currentYear: new Date().getFullYear(), // 当前年
            loading: false, // 加载状态
            showbut: 0, // 展开/收起-状态
            showState: false, // 查询框显示状态
            total: 0, // 总条数
            currentPage: 1, // 页数
            pageSize: 10, // 条数
            tablelist: [], // 一级table数据
            twoTableList: [], // 二级table数据
            threeTableList: [], // 三级table数据
            multipleSelection: [], // 二级table是否选中
            formQuery: { // 查询表单数据
                taskCode: 'MT', // 任务号
                companyCheck: '', // 受检单位
                sampleName: '', // 样品名称
                zjsign: '', // 状态
                // searchdate: new Date().getFullYear(), // 查询年份
                searchdate: '', // 查询年份
                sampleType: '', // 规格型号
                task_status: '', // 状态
                tsign: '', // 财务
                docStatus: '', // 报告归档
                search_field: '', // 查询其他
                search_data: '', // 数据
                send: '0', // 发送状态
            },
            task_status: '', // 状态
            dateList: [], // 查询年份数据
            otherList: [ // 查询-其它
                {title: '选择字段', id: ''},
                {title: '类型', id: 'wttype'},
                {title: '生产单位', id: 'produceCompany'},
                {title: '任务说明', id: 'taskExplain'},
                {title: '委托人', id: 'principal'},
                {title: '下达人', id: 'commiterId'},
                {title: '项目名称', id: 'itemsName'},
                {title: '申请编号', id: 'checkYear'},
                {title: '项目样品规格型号', id: 'samplesSpecifications'},
                {title: '项目样品名称', id: 'samplesName'},
                {title: '项目样品商标', id: 'samplesProperty'},
                {title: '项目样品生产厂家', id: 'samplesManufacturers'},
                {title: '抽样人', id: 'musterMusterMember'}
            ], 

            returnVisible: false, //  // 控制退回对话框的显示隐藏
            returnForm: { // 退回对话框数据
                backprocessinstance: '',
                reason: ''
            },
            draftSelectData: [], // 退回草稿下拉框数据
            processinstance: '', // 退回草稿-当前进度
            copypageState: this.copypage ? this.copypage : 2, // 操作按钮是展示状态
            bindingVisible: false, // 绑定对话框的显示隐藏
            tableloadData: {}, // 绑定页面数据
            taskId: '', // 点击浏览的id
            inspectids: [], // 检验项目
            percentage: [ /* 快查选择百分比 */
                {value: '0', label: '40%'}, {value: '1', label: '70%'},
                {value: '2', label: '90%'}, {value: '3', label: '100%'},
                {value: '4', label: '130%'}, {value: '5', label: '150%'}
            ],
            dialogQuickly: false, // 快查对话框的显示隐藏
            indexValueId: 0, // 快查
            productValue: '', /* 快查我的报告编号 */
            initialState: false, // 快查
            tableDataImg: [], /* 快查图片数组 */
            number: [], /* 快查下拉框 */
            imgCountPage: '', /* 快查图片页数 */
            uploadIdList: [], // 上传中机-快查id
        }
    },
    created() {
        this.obtainDateList();
    },
    mounted() {
        this.onClickQuery(1, 10);
    },
    methods: {
        // 获取查询年份数据
        obtainDateList() {
            let arr = [{id: '', title: '全部'}];
            var myDate = new Date();
            var currentYearTitle = myDate.getFullYear();
            var currentYearId = myDate.getFullYear();
            var decadeYear = currentYearTitle - 9;
            var Section = currentYearTitle - decadeYear;
            for (var i = 0; i <= Section; i++) {
                myDate = {id: currentYearId--, title: currentYearTitle--};
                arr.push(myDate);
            }
            this.dateList = arr;
        },
        // 点击收起/展开
        clickshowbut(num) {
            this.showbut = num;
            this.showState = !this.showState;
        },
        // 分页器-设置每条的页数
        handleSizeChange(val) {
            this.pageSize = val;
            this.onClickQuery(this.currentPage, this.pageSize);
        },
        // 分页器-当前页发生改变时
        handleCurrentChange(val) {
            this.currentPage = val;
            this.onClickQuery(this.currentPage, this.pageSize);
        },
        // 点击查询
        onClickQuery(currentPage, pageSize) {
            this.loading = true;
            this.formQuery.currentPage = currentPage;
            this.formQuery.pageSize = pageSize;
            this.$api.download.apiFindCopy(this.formQuery).then(res => {
                console.log(res.data.data, '查询数据');
                
                let data = res.data.data.list;
                if(data){
                    this.tablelist = data;
                    this.loading = false;
                    if(data.length > 0 && data[0].total){
                    this.total = data[0].total;
                    this.currentPage = currentPage;
                    this.pageSize = pageSize;
                    }else{
                    this.total = 0;
                    this.currentPage = 1;
                    this.pageSize = 10;
                    }
                }
                this.task_status = this.formQuery.task_status;
            }).catch((error) => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
                this.loading = false;
                this.total = 0;
                this.currentPage = 1;
                this.pageSize = 10;
            });
        },
        // 回车查询
        enterQuery(e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode == 13) {
                this.onClickQuery(1, 10);
            }
        },
        // 一级table改变背景颜色
        tableRowStyle({row, rowIndex}) {
            if (row.downflag == 1) {
                return 'background: pink'
            } else {
                return ''
            }
        },
        // 二级table选择
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        // 点击浏览
        onClickbrowse(row) {
            this.multipleSelection = [];
            this.taskId = row;
            let $table = this.$refs.table;
            let params = {
                taskid: row.id,
                taskCondition: {
                    deptid: row.deptid,
                    searchdate: row.partitiondate,
                    task_status: this.task_status,
                    formpage: 2
                }
            };
            this.$api.taskmanage.apiFindJobContent(params).then(res => {
                if (res.data.data.list.length > 0) {
                    res.data.data.list.filter(item => {
                        if (item.clist.length > 0) {
                            item.clist.forEach(em => {
                                if (em.selected) {
                                    item.orgName = em.id
                                }
                            });
                        }
                    });
                }
                this.twoTableList = res.data.data.list;
                $table.toggleRowExpansion(row)
            });
            this.tablelist.map(item => {
                if (row.id != item.id) {
                    $table.toggleRowExpansion(item, false)
                }
            });
        },
        // 点击流转
        onClickFlow(row) {
            let $twoTable = this.$refs.twoTable;
            let params = {
                id: row.id
            };
            this.$api.taskmanage.apiFindWorkLog(params).then(res => {
                $twoTable.toggleRowExpansion(row)
                this.threeTableList = res.data.data.list
            });
            this.twoTableList.map(item => {
                if (row.id != item.id) {
                $twoTable.toggleRowExpansion(item, false)
                }
            });
        },
        // 点击下载统计表
        onClickdownload(row, downtype) {
            let params = {
                downtype: downtype,
                taskid: row.id
            };
            this.$api.download.apiFindDisProductByTaskid(params).then(res => {
                let data = res.data.data;
                if(data == null || data.list.length <= 0){ // 没有绑定-跳转绑定页面
                    let ifparams = {
                        downtype: downtype,
                        d:{ taskid: row.id }
                    };
                    this.$api.download.apiDownStaticxls(ifparams).then(res => {
                        let data = res.data.data;
                        if(data.d){
                            this.tableloadData = {
                                entName: data.d.entName, // 企业名称
                                model: data.d.model,  // 产品型号
                                name: data.d.name, // 产品名称
                                brand: data.d.brand, // 产品商标
                                taskid: row.id, // taskid
                            };
                            this.bindingVisible = true;
                        }
                    }).catch((error) => {
                        this.$message({type: 'error', message: error.data.message, duration: 1500});
                        this.bindingVisible = false;
                    });
                }else{ // 已绑定-下载
                    let data_index = 0;
                    if (data.list.length > 1){
                        data_index = 1;
                        if (confirm("确认：下载底盘，取消：下载整车")){
                            data_index = 2;
                        }else{
                            data_index = 3;
                        }
                    }

                    let datalist = data.list[0];
                    if (data_index > 0){  // 有多个产品绑定这个任务
                        if (data_index == 2){ // 下载底盘
                            data.list[0].name.indexOf("底盘") != -1 ? '' : datalist = data.list[1];
                        }else{ // 下载整车
                            data.list[0].name.indexOf("底盘") != -1 ? datalist = data.list[1] : '';
                        }
                    }
                    this.plugInFun(downtype, row, datalist);
                }
            }).catch((error) => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
                this.bindingVisible = false;
            });
        },
        // 插件封装
        plugInFun(downtype, row, datalist) {
            let dataid = datalist.id.trim();
            if (dataid.length <= 0) {
                this.$message({ type: 'warning', message: '请确认是否下达了该任务', duration: 1500 });
            }else{
                let t_mode = datalist.model;
                t_mode = t_mode.replace("/","");
                var obj = document.getElementById("STATICTABLE");
                try {
                    obj.downstatic0(downtype+'',dataid,base.baseImgTable+base.baseUrl+"/",row.id,datalist.entName,datalist.name,t_mode,datalist.brand);
                } catch (error) {
                    console.log(error, '下载统计表')
                    this.$message({ type: 'warning', message: '请检查插件是否有误，并且是在ie下执行', duration: 1500 });
                } 
            }
        },
        // 关闭绑定页面
        onCloseBindingVisible(row, taskid) {
            this.bindingVisible = false;
            this.onClickQuery(this.currentPage, this.pageSize);
            if(!this.bindingVisible){
                var obj = document.getElementById("STATICTABLE");
                try {
                    obj.downstatic0('0', row.id, base.baseImgTable+base.baseUrl+"/", taskid, row.entName, row.name, row.model, row.brand);
                } catch (error) {
                    console.log(error, '绑定下载')
                    this.$message({ type: 'warning', message: '请检查插件是否有误，并且是在ie下执行', duration: 1500 });
                } 
            }
        },
        // 点击取消绑定
        onClickCancelBinding(row) {
            this.$confirm('确认要取消绑定吗', '信息', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                id: row.id
                }
                this.$api.download.apiCancelBinding(params).then(res => {
                this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                this.onClickQuery(this.currentPage, this.pageSize);
                }).catch(error => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
                this.onClickQuery(this.currentPage, this.pageSize);
                })
            }).catch(() => {
                this.$message({ type: 'info', message: '已取消该操作', duration: 1500 });          
            });
        },
        // 点击绑定到方案
        onClickBindingProgramme(row) {
            let params = {
                id: this.rowStatisticsId.id ? this.rowStatisticsId.id : '',
                taskid: row.id
            };
            this.$api.download.apiZjparamBindNew(params).then(res => {
                this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                this.$emit('closeBindingProgramme', row.id, this.rowStatisticsId);
            }).catch(error => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
            });
        },
        // 点击退回草稿
        onClickRegressionDraft() {
            this.draftSelectData = [];
            this.processinstance = 1;
            this.returnForm = { // 退回对话框数据
                backprocessinstance: '',
                reason: ''
            };
            if (this.multipleSelection.length > 0) {
                this.returnVisible = true;
                let params = {
                    processinstance: 1
                };
                this.$api.taskmanage.apiContentDelete(params).then(res => {
                    this.draftSelectData = res.data.data;
                    if (this.draftSelectData.length > 0) {
                        this.returnForm.backprocessinstance = this.draftSelectData[0].id
                    }
                });
            } else {
                this.$alert('请先选择报告', '系统提示信息', {confirmButtonText: '确定'})
            }
        },
        // 点击回退
        onClickRegression() {
            this.draftSelectData = [];
            this.processinstance = 7;
            this.returnForm = { // 退回对话框数据
                backprocessinstance: '',
                reason: ''
            };
            if (this.multipleSelection.length > 0) {
                this.returnVisible = true;
                this.$api.taskmanage.apiJobTaskFindBackFlow().then(res => {
                    res ? this.draftSelectData = res.data.data : '';
                    if (this.draftSelectData.length > 0) {
                        this.returnForm.backprocessinstance = this.draftSelectData[0].id
                    }
                });
            } else {
                this.$alert('请先选择报告', '系统提示信息', {confirmButtonText: '确定'})
            }
        },
        // 退回草稿对话框-点击完成
        onClickReturnDraft() {
            this.inspectids = [];
            this.multipleSelection.forEach(item => {
                this.inspectids.push(item.id)
            });
            if (this.multipleSelection.length > 0) {
                let searchdate = this.multipleSelection[0].partitiondate;
                let params = {
                    backprocessinstance: this.returnForm.backprocessinstance,
                    inspectids: this.inspectids.join(','),
                    processinstance: this.processinstance,
                    reason: this.returnForm.reason,
                    searchdate: searchdate
                };
                this.$api.taskmanage.apiJobTaskGoBack(params).then(res => {
                    this.$message({type: 'success', message: res.data.message, duration: 1500});
                    this.returnVisible = false;
                    this.onClickQuery(1, 10);
                    this.onClickbrowse(this.taskId)
                }).catch(error => {
                    this.$message({type: 'error', message: error.data.message, duration: 1500});
                    this.returnVisible = false;
                });
            }
        },
        // 点击允许主检修改报告
        onClickmodifyReport() {
            this.inspectids = [];
            if (this.multipleSelection.length > 0) {
                this.multipleSelection.forEach(item => {
                    this.inspectids.push(item.id)
                });
                let searchdate = this.multipleSelection[0].partitiondate;
                let params = {
                    inspectids: this.inspectids.join(','),
                    searchdate: searchdate
                };
                this.$api.taskmanage.apiDocCanSave(params).then(res => {
                    this.$message({type: 'success', message: res.data.data, duration: 1500});
                    this.onClickbrowse(this.taskId)
                }).catch(error => {
                    this.$message({type: 'error', message: error.data.message, duration: 1500});
                });
            } else {
                this.$alert('请先选择报告', '系统提示信息', {confirmButtonText: '确定'})
            }
        },
        // 修改公章类型
        onClickModifyOrgName(row, orgName) {
            let params = {
                id: row.id,
                cachetTypeId: orgName,
                searchdate: row.partitiondate
            };
            this.$api.taskmanage.apiGoUpdateZhang(params).then(res => {
                this.$message({type: 'success', message: res.data.data, duration: 1500});
                this.onClickbrowse(this.taskId)
            }).catch(error => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
            });
        },
        //点击全局快查
        onSubmitQuick() {
            this.initialState = true;
            this.indexValueId = 0;
            if (this.multipleSelection.length == 0) {
                this.$alert('请先选择报告', '系统提示信息', {confirmButtonText: '确定'})
            } else {
                this.uploadIdList = this.multipleSelection;
                this.productValue = this.multipleSelection[0].id;
                this.tableDataImg = [];
                this.imgCountPage = '';

                var itemsCodes = this.multipleSelection.map(v => v.itemsCode);
                this.multipleSelection.forEach(item => {
                    if (itemsCodes.includes(item.itemsCode)) {
                        this.number = this.multipleSelection
                    }

                });
                this.$api.myReport.quicklyQuickly(this.productValue).then(res => {
                    var floder = res.data.data.floder,
                        pagecount = res.data.data.pagecount,
                        imgDataId = res.data.data.id;
                    this.imgCountPage = pagecount ? pagecount.toString() : '0';
                    if (floder == null || pagecount == null || imgDataId == null) {
                        this.$message({type: 'info', message: '暂无生成', duration: 1500})
                    } else {
                        if (pagecount > 0) {
                            for (var imgIndexImg = 1; imgIndexImg <= pagecount; imgIndexImg++) {
                                var objImg = {
                                    v: imgIndexImg,
                                    url: `${base.baseImgUrl}docs/gif/${floder}/${imgDataId}_${imgIndexImg}.jpg`
                                };
                                this.tableDataImg.push(objImg)
                            }
                        }
                        if (this.imgCountPage < 1 || this.tableDataImg == []) {
                            this.$message({type: 'error', message: `${itemsCodes}暂未生成快查`, duration: 1500});
                            return false
                        } else {
                            this.dialogQuickly = true;
                        }
                    }
                }).catch(err => {
                    this.$message({type: 'error', message: "查看失败", duration: 1500})
                });
            }
        },
        //点击下一份报告
        nextReportBtn(data) {
            if (this.number.length == 1) {
                this.$message({type: 'info', message: '当前只有一份报告', duration: 1500})
            } else {
                if (this.indexValueId < this.number.length - 1) {
                    let indexValueId = this.indexValueId + 1;
                    this.number.forEach((val, index) => {
                        if (indexValueId === index) {
                            this.productValue = val.id;
                        }
                        this.indexValueId = indexValueId;
                    });
                } else {
                    this.productValue = this.number[0].id;
                    this.indexValueId = 0;
                }
                this.reportQuickt(this.productValue)
            }

        },
        // 快查对话框关闭事件
        handleDialogQuickly() {
            this.initialState = false;
            this.dialogQuickly = false;
            this.imgCountPage = '';
            this.tableDataImg = [];
            this.indexValueId = 0;
            if (this.multipleSelection.length > 0) {
                this.productValue = this.multipleSelection[0].id;
            }
        },
        //选择报告编号
        selectproductValue(data) {
            this.productValue = data;
            this.number.forEach((val, index) => {
                if (this.productValue === val.id) {
                    this.indexValueId = index;
                }
            });
            this.reportQuickt(this.productValue)
        },
        //快查接口封装
        reportQuickt(idId) {
            this.imgCountPage = '';
            this.tableDataImg = [];
            this.$api.myReport.quicklyQuickly(idId).then(res => {
                var floder = res.data.data.floder,
                pagecount = res.data.data.pagecount,
                imgDataId = res.data.data.id;
                this.imgCountPage = pagecount ? pagecount.toString() : '0';
                if (floder == null || pagecount == null || imgDataId == null) {
                    this.$message({type: 'info', message: '暂无生成', duration: 1500})
                }
                if (pagecount > 0) {
                    for (var imgIndexImg = 1; imgIndexImg <= pagecount; imgIndexImg++) {
                        var objImg = {
                            v: imgIndexImg,
                            url: `${base.baseImgUrl}docs/gif/${floder}/${imgDataId}_${imgIndexImg}.jpg`
                        };
                        this.tableDataImg.push(objImg)
                    }
                }
            }).catch(err => {
                this.$message({type: 'error', message: "查看失败", duration: 1500})
            });
        },
        
    },
}
</script>

<style lang="scss" scoped>
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
// 重置
.reset_btn {
    margin: 0 !important;
    margin-left: 10px !important;
    background: #909399 !important;
    border-color: #909399 !important;
}

.download_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}

/deep/ .download_con {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .query_modular {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
        padding-bottom: 20px;
        .query_complex {
            width: 100%;
            display: flex;
            position: relative;
            .query_form {
                flex: 1;
            }
            .query_show {
                width: 50px;
                position: relative;
                .query_showBtn {
                    position:absolute;
                    top:50%;
                    left:50%;
                    transform:translate(-50%,-50%);
                    color:#32AFF0;
                    padding: 10px 0;
                    border: none;
                }
            }
        }
        .query_btn {
            width: 100%;
            display: flex;
            justify-content: space-between;
            p {
                margin: 0;
                padding: 0;
            }
        }
    }
    .tablePagination_modular {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .table_modular {
            flex: 1;
            overflow-y: auto;
            .el-radio__label {
                padding: 0;
            }
            .el-table th.gutter {
                display: table-cell !important
            }
        }
        .pagination_modular {
            margin-top: 20px;
            padding: 0;
        }
    }
}

// 查询表单
/deep/ .query_form {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
        width: 25%;
        margin: 0;
        padding-bottom: 20px;
        overflow: hidden;
        display: flex;
        align-items: center;
        .el-form-item__label {
            white-space: nowrap;
        }
        .el-form-item__content {
            flex: 1;
            padding-right: 40px;
            .el-select, .el-input, .el-date-editor {
                width: 100% !important;
            }
            .el-date-editor {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .el-input__icon {
                    width: 25px;
                }
                .el-range-input {
                    flex: 1;
                }
                .el-range-separator {
                    width: 25px;
                    padding: 0 !important;
                }
            }
        }
    }
}

// 列表-状态
.taskStatusStyleclass {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    &:last-child {
    border-bottom: none;
    }
}

// 选择整车型号
/deep/ .choice_model {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .el-dialog {
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        backface-visibility:hidden;
        .el-dialog__body {
            flex: 1 !important;
            padding: 20px;
            overflow: hidden;
        }
    }
}

/deep/ .el-table--enable-row-hover .el-table__body .el-table__row:hover > td {
  background-color: rgba(0, 0, 0, 0) !important;
}
/deep/ .el-table--enable-row-hover .el-table__body .el-table__row.el-table__row--striped > td {
  background-color: #FAFAFA !important;
}


// 快查
/deep/ .dialog_quickly {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .el-dialog {
        margin: 0 !important;
        padding: 0 !important;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            padding: 20px;
            overflow: hidden;
        }
    }
}
</style>