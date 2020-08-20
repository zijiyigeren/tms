<template>
    <!-- 我的报告 -->
    <div :class="!myStyles ? 'report_border' : 'home_report_border'">
        <div :class="!myStyles ? 'report_con' : 'home_report_con'">
            <!-- 查询 -->
            <div class="query_modular" v-if="!myStyles">
                <div class="query_complex">
                    <!-- 查询表单 -->
                    <el-form v-if="!isComing" :inline="true" :model="formInline" label-width="100px" class="query_form">
                        <el-form-item label="任务号：">
                            <el-input
                                @keyup.enter.native="searchEnterFun"
                                name="clearInputValue"
                                v-model.trim="formInline.taskCode">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="受检单位：">
                            <el-input
                                @keyup.enter.native="searchEnterFun"
                                name="clearInputValue"
                                v-model.trim="formInline.companyCheck">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="样品名称：">
                            <el-input
                                @keyup.enter.native="searchEnterFun"
                                name="clearInputValue"
                                v-model.trim="formInline.sampleName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="规格型号：">
                            <el-input
                                @keyup.enter.native="searchEnterFun"
                                name="clearInputValue"
                                v-model.trim="formInline.sampleType">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="报告编号：" v-show="show">
                            <el-input
                                @keyup.enter.native="searchEnterFun"
                                name="clearInputValue"
                                v-model.trim="formInline.itemscode"
                                :maxlength="20">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="查询年份：" v-show="show">
                            <el-select
                                    @keyup.enter.native="searchEnterFun"
                                v-model="formInline.searchdate">
                                <el-option v-for="(dataVal,i) in datasDatas" :key="i"
                                    :label="dataVal.date" :value="dataVal.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="报告状态：" v-show="show">
                            <el-select
                                @keyup.enter.native="searchEnterFun"
                                v-model="formInline.zjsign">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已完成" value="1"></el-option>
                                <el-option label="未完成" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="归档状态：" v-show="show">
                            <el-select
                                @keyup.enter.native="searchEnterFun"
                                v-model="formInline.docStatus">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已归档" value="1"></el-option>
                                <el-option label="已提交归档" value="-1"></el-option>
                                <el-option label="未提交归档" value="0"></el-option>
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
                    <p>
                        <el-button type="primary" @click="editClickUp">修改</el-button>
                    </p>
                    <p class="query_rightbtn">
                        <el-button type="primary" @click="onSubmit(formInline,1,10)">查询</el-button>
                        
                    </p>
                </div>
            </div>

            <!-- 表格与分页 -->
            <div v-loading="loadings" class="tablePagination_modular">
                <!--表格-->
                <div class="table_modular">
                    <!-- :height="myComing == 0 ? '500px': 'calc(100% - 1px)'" -->
                    <el-table border stripe highlight-current-row ref="table" class="form1"
                        :row-key="row_key" :cell-style="cellStyle"
                        :data="tableData"
                        :height="!myStyles ? '100%': '500px'"
                        :header-cell-style="{
                            'background-color': 'rgba(243,246,253,1)',
                            'color': '#606266',
                            'padding': '10px 0'
                        }">
                        <el-table-column align="center" :resizable="false" type="selection" v-if="!isComing"></el-table-column>
                        <el-table-column align="center" :resizable="false" type="index" label="序号" width="55"
                            :index="i=>(currentPage4-1)*pageSize+i+1"/>
                        <el-table-column align="center" :resizable="false" prop="taskCode" label="任务号"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="checkTypeID" label="类别"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="companyCheck" label="受检单位"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="sampleName" label="样品名称"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="sampleType" label="样品规格型号">
                            <template slot-scope="scope">
                                <span>{{scope.row.sampleType == null?"--":scope.row.sampleType}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="department" label="科室">
                            <template slot-scope="scope">
                                <span>{{scope.row.department == null?"--":scope.row.department}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" label="操作" width="300">
                            <template slot-scope="scope">
                                <el-button type="text" style="color:#32AFF0;marginLeft:6px;"
                                    @click="showInTable(scope.row)">
                                    浏览
                                </el-button>
                                <el-button type="text" style="color:#32AFF0;marginLeft:6px;"
                                    @click="showInDetails(scope.row)">
                                    详细
                                </el-button>
                                <el-button type="text" style="color:#32AFF0;marginLeft:6px;"
                                    @click="showGoFile(scope.row)">
                                    归档
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column :resizable="false" type="expand" width="1">
                            <!--里面的隐藏表格-->
                            <el-row :gutter="20">
                                <el-col :span="12" style="border: none">
                                    <div class="grid-content bg-purple">
                                        <el-button size="mini" type="primary" @click="uploadFile(0)">下载Word</el-button>
                                        <el-button size="mini" type="primary" @click="uploadFile(1)">下载PDF</el-button>
                                        <el-button size="mini" type="primary" @click="onSubmitQuick()">快查</el-button>
                                        <el-button size="mini" type="primary" @click="onDelete">设为可删除</el-button>
                                        <el-button size="mini" type="primary" @click="onNoDelete">设为不可删除</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-table stripe border :data="tableData2"
                                :cell-style="cellStyle"
                                @selection-change="handleSelectionChange"
                                :header-cell-style="{
                                    'background-color': 'rgba(243,246,253,1)',
                                    'color': '#606266',
                                    'padding': '10px 0',
                                    'text-align':'center'
                                }">
                                <el-table-column align="center" :resizable="false" type="selection"></el-table-column>
                                <el-table-column align="center" :resizable="false" label="序号">
                                    <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
                                </el-table-column>
                                <el-table-column align="center" :resizable="false" prop="itemsCode" label="报告编号"></el-table-column>
                                <el-table-column align="center" :resizable="false" prop="itemsName" label="项目名称"></el-table-column>
                                <el-table-column align="center" :resizable="false" prop="procName" label="当前状态"></el-table-column>
                                <el-table-column align="center" :resizable="false" prop="docStatus" label="归档状态">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.docStatus == '1'" style="color:#00DD00">已归档</span>
                                        <span v-if="scope.row.docStatus == '-1'">已提交归档</span>
                                        <span v-if="scope.row.docStatus == '0'" style="color:red">未提交归档</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" :resizable="false" fixed="right" label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="text" style="color:#32AFF0;marginLeft:6px;"
                                            @click="handleClick(scope.row)">
                                            查看
                                        </el-button>
                                        <el-button type="text" style="color:#32AFF0;marginLeft:6px;"
                                            @click="showGoRead(scope.row)">
                                            快查
                                        </el-button>
                                        <el-button type="text" style="color:#32AFF0;marginLeft:6px;"
                                            @click="showGoQRead(scope.row)">
                                            重新生成快查
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-table-column>
                    </el-table>
                </div>
                <!--分页器-->
                <el-pagination
                    v-if="!isComing"
                    class="pagination_modular"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    :current-page="currentPage4"
                    :page-size="pageSize"
                    :page-sizes="[10,20,30]"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>

        <!--修改的对话框-->
        <el-dialog  width="80%" title="修改" class="edit_dialog"
            :close-on-click-modal="false" :visible.sync="dialogVisibleEdit">
            <div class="edit_dialog_table">
                <el-table border stripe size="mini" ref="twoTable" :data="tabllist"
                    :header-cell-style="{
                        'background-color': 'rgba(243,246,253,1)',
                        'color': '#606266',
                        'padding': '10px 0'
                    }">
                    <el-table-column align="center" :resizable="false" prop="itemsCode" label=" 检验项目编号">
                        <template slot-scope="scope">
                            <el-button type="text" style="color:#000;" @click="clickOpenReport(scope.row)">
                                {{scope.row.itemsCode}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :resizable="false" label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" style="color:#32AFF0;" @click="handleCommit(scope.row)">提交</el-button>
                            <el-button type="text" style="color:#32AFF0;" @click="handleReturn(scope.row)">流转</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column :resizable="false" type="expand" width="1">
                        <template>
                            <!-- 三级弹出 -->
                            <threeFlowTable v-bind:threeTableList="threeTableList"/>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>

        <!--详细的对话框-->
        <!-- <el-dialog :close-on-click-modal="false" width="80%" title="详细" :visible.sync="dialogVisibleDetails">
        <entrustList ref="redactEntrustlist" saveType="3"></entrustList>
        </el-dialog> -->

        <!-- 详情对话框 -->
        <div v-if="dialogVisibleDetails" class="choice_statistics">
            <div class="el_dialog">
                <div class="el_dialog__header">
                    <span>详细</span>
                    <el-button type="text" class="el_dialog_btnclose" @click="dialogVisibleDetails=false">
                        <i class="el-icon-close"></i>
                    </el-button>
                </div>
                <div class="el_dialog__body">
                    <acceptance
                      ref="redactEntrustlist"
                      saveType="2"
                      :other-taskinfor="mlyTaskinfor"
                    />
                </div>
                <div class="el_dialog__footer"></div>
            </div>
        </div>

        <!--归档的对话框-->
        <el-dialog width="80%" title="归档" v-if="hackReset" class="dialog_report_file" 
            :close-on-click-modal="false"
            :visible.sync="dialogTableVisible" :before-close="handleClose">
            <Reportfile :tableData2="tableData2" :renwu="renwu"
                :dialogTableVisible="dialogTableVisible"
                :rows="rows" :permissions="permissions"
                :tit="1" :lengtharr="lengtharr" :lzyobj="lzyobj">
            </Reportfile>
            <!-- <Archive :tableData2="tableData2" :renwu="renwu"
                    :dialogTableVisible="dialogTableVisible"
                    :rows="rows" :permissions="permissions"
                    :tit="2" :lengtharr="lengtharr" :lzyobj="lzyobj"
            ></Archive> -->
        </el-dialog>

        <!--归档率的对话框-->
        <el-dialog width="80%" title="归档率" class="filing_rate"
            :close-on-click-modal="false" :visible.sync="dialogBinding">
            <div class="bottom">
                <Archiverate :list="tableData4" :find="finds" @showCityName="select1" @showCityNames="select2"/>
            </div>
        </el-dialog>

        <!--查看详情的对话框-->
        <el-dialog width="80%" title="归档确认"
            :close-on-click-modal="false" :visible.sync="dialogReadDetaills">
            <el-form label-width="100px" :model="formInline" class="demo-form-inline form_inline">
                <el-form-item label="任务号" size="mini">
                    <el-input v-model.trim="formInline.taskCode" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="企业委托单" size="mini" :inline="true">
                    <el-input v-model.trim="formInline.companyCheck"></el-input>
                    <el-button type="primary" size="mini"><i class="el-icon-search"></i>查看文件</el-button>
                    <el-button type="primary" size="mini"><i class="el-icon-download"></i>下载文件</el-button>
                </el-form-item>
                <el-form-item label="任务单" size="mini" :inline="true">
                    <el-input v-model.trim="formInline.companyCheck"></el-input>
                    <el-button type="primary" size="mini"><i class="el-icon-search"></i>查看文件</el-button>
                    <el-button type="primary" size="mini"><i class="el-icon-download"></i>下载文件</el-button>
                </el-form-item>
                <el-tabs v-model="activeName" type="card" @tab-click="tabsCard">
                    <el-tab-pane label="QA18M12Q11102" name="first">
                        <el-form-item label="当前状态" size="mini">
                            已提交归档
                        </el-form-item>
                        <el-form-item label="试验报告" size="mini" :inline="true">
                            <el-input v-model.trim="formInline.companyCheck"></el-input>
                            <el-button type="primary" size="mini"><i class="el-icon-search"></i>查看文件</el-button>
                            <el-button type="primary" size="mini"><i class="el-icon-download"></i>下载文件</el-button>
                            <span>
                                <el-form-item label="是否纸质归档" size="mini" :inline="true">
                                    <el-radio v-model="radio" label="1">是</el-radio>
                                    <el-button type="primary" size="mini">确认</el-button>
                                </el-form-item>
                            </span>
                        </el-form-item>
                        <el-form-item label="样品登记表" size="mini">
                            <el-input v-model.trim="formInline.companyCheck"></el-input>
                            <el-button type="primary" size="mini"><i class=" el-icon-search"></i>查看文件</el-button>
                            <el-button type="primary" size="mini"><i class=" el-icon-download"></i>下载文件</el-button>
                        </el-form-item>
                        <el-form-item label="样品照片" size="mini">
                            <el-input v-model.trim="formInline.companyCheck"></el-input>
                            <el-radio v-model="radio" label="1">其他归档</el-radio>
                            <el-button type="primary" size="mini">确认</el-button>
                        </el-form-item>
                        <el-form-item label="试验过程照片" size="mini">
                            <el-radio v-model="radio" label="1">无</el-radio>
                        </el-form-item>
                        <el-form-item label="原始记录" size="mini">
                            <el-radio v-model="radio" label="1">纸质归档</el-radio>
                            <el-button type="primary" size="mini">确认</el-button>
                        </el-form-item>
                        <el-form-item label="其他文件" size="mini">
                            <el-radio v-model="radio" label="1">无</el-radio>
                        </el-form-item>
                        <el-button>上一页</el-button>
                        <el-button>下一页</el-button>
                        <el-button>确认归档</el-button>
                        <el-button>取消归档</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="QA1888888888" name="second">配置管理</el-tab-pane>
                    <el-tab-pane label="QA12222222222" name="third">角色管理</el-tab-pane>
                </el-tabs>
            </el-form>
        </el-dialog>

        <!--快查的对话框-->
        <el-dialog width="80%" title="快速查看" class="dialog_quickly"
            :close-on-press-escape="false" :close-on-click-modal="false"
            :visible.sync="dialogQuickly" :before-close="handleDialogQuickly">
            <Quiickready
                v-bind="{
                    'indexValueId': indexValueId,
                    'percentage': percentage,
                    'productValue': productValue,
                    'initialState': initialState,
                    'tableDataImg': tableDataImg,
                    'numberData': number,
                    'imgCountPage': imgCountPage,
                    'uploadIdList': uploadIdList,
                }"
                @selectproductValue="selectproductValue"
                @nextReportBtn="nextReportBtn">
            </Quiickready>
        </el-dialog>

        <!--下载word-pdf-查看调用对象-->
        <object id="WO3Word2" classid="clsid:561C5A99-71C8-48d4-A3E2-16FC4F9880BF"
            Width="0" Height="0" style="display:block">
        </object>
    </div>
</template>

<script>
import acceptance from '@/views/taskdelegation/componentstask/acceptance.vue';
import base from '@/api/base';
// entrustList 全局引用模块
import Archiverate from '@/components/Archiverate';
import Quiickready from '@/components/Quiickready';
import threeFlowTable from '@/components/threeFlowTable';
import Archive from '@/components/Archive';
import Reportfile from '@/components/ReportFile'; // 归档
export default {
    name: 'report',
    components: {Archiverate, Quiickready, threeFlowTable, Archive, acceptance, Reportfile},
    props: ['myComing', 'myTableData_0', 'myLoading', 'myStyle'],
    watch: {
        myComing: {
            immediate:true,
            handler(val) {
                this.isComing = val;
            },
        },
        myTableData_0: {
            immediate:true,
            handler(val) {
                this.tableData = val;
            },
        },
        myLoading: {
            immediate:true,
            handler(val) {
                this.loadings = val;
            },
        },
        myStyle: {
            immediate:true,
            handler(val) {
                this.myStyles = val;
            },
        },
    },
    data() {
        return {
            src:'static/123123.mht',
            lengtharr: '',
            lzyobj: {},
            initialState: false,
            hackReset: false,
            permissions: 0,
            citys: {},
            rows: {},
            renwu: '',/*归档任务号*/
            dialogReadDetaills: false,
            show: false, /*展开收起*/
            showbut: 1, /*展开收起*/
            myStyles: false,
            isComing: false,
            loadings: false,
            loading2: false,
            formClass: '',
            tableClass: '',
            deleteFunBr: '',
            threeTableList: [], // 流转数据
            userName: '',
            tabllist: [], /*修改表数据*/
            tablReturn: [], /*流转数据*/
            indexValueId: 0,
            activeName: 'first', /*归档内选项卡*/
            imgCountPage: '', /*图片页数*/
            radio: '1', /*归档单选*/
            number: [], /*快查下拉框*/
            uploadIdList: [], // 上传中机-快查id
            multipleSelection: [], /*快查多选框*/
            showHidden: false,
            optionsRight: [
                {
                    value: '0',
                    label: '全部'
                }, {
                    value: '1',
                    label: '启用'
                }, {
                    value: '2',
                    label: '未启用'
                }
            ],
            percentageValue: '', /*选择百分比*/
            percentage: [
                {value: '0', label: '40%'}, {value: '1', label: '70%'},
                {value: '2', label: '90%'}, {value: '3', label: '100%'},
                {value: '4', label: '130%'}, {value: '5', label: '150%'}
            ], /*选择百分比*/
            productValue: '', /*快查我的报告编号*/
            dialogTableVisible: false,
            dialogBinding: false,
            dialogQuickly: false,
            dialogVisibleDetails: false, /*详细*/
            dialogVisibleEdit: false, /*修改*/
            currentPage4: 1, /*分页*/
            pageSize: 10,
            total: 0,
            pageSize1: 2, /*快查分页*/
            currentPage3: 1, /*分页*/
            GoFileData: [], /*归档对话框内表格*/
            BorrowFileData: [], /*借档对话框内表格*/
            tableData: [], /*外面表格数据*/
            tableDataImg: [], /*图片数组*/
            tableData2: [], /*内嵌表格数据*/
            tableData4: [], /*详细*/
            tableData5: [],
            finds: [],
            formaction: 'tj2',
            wttype: '',
            /* 条件查询的数据 */
            formInline: {
                taskCode: '',
                companyCheck: '',
                sampleName: '',
                searchdate: '',
                sampleType: '',
                zjsign: '',
                itemscode: '',
                docStatus: '',
            },
            /* 分页器触发查询时所需要的上一次的条件查询数据 */
            pageFormInline: {},
            stopOnSubmit: false,

            datasDatas: [], /*查询年份*/
            arrDate_: [{id: '', date: '全部'}], /*查询年份*/
            ruleForm: {
                items_itme_name: '',
            },
            rules: {
                items_itme_name: [
                    {required: true, message: '请输入项目名称', trigger: 'blur'}
                ]
            }, /*归档表单校检*/
            mlyTaskinfor: null,
        }
    },
    created() {
        this.userMSG();
    },
    mounted() {
        this.getDataList();
        // this.$nextTick(function () {
        //   this.tableHeight10 = window.innerHeight - this.$refs.table.$el.offsetTop - 82;
        //
        //   // 监听窗口大小变化
        //   let self = this;
        //   window.onresize = function() {
        //     self.tableHeight10 = window.innerHeight - self.$refs.table.$el.offsetTop - 82
        //   }
        // })
    },
    methods: {
        // 关闭-归档
        handleClose() {
            this.hackReset = false;// 销毁组件
            this.dialogTableVisible = false;
            // 刷新数据
            this.showInTable(this.rows);
        },
        // 点击收起/展开
        clickshowbut(num) {
            this.show = !this.show;
            this.showbut = num;

            // 固定el-table头
            // this.$nextTick(function () {
            //   if(this.showbut==0 && this.show==true){
            //     this.tableHeight10 = window.innerHeight - this.$refs.table.$el.offsetTop - 143;
            //   }else if (this.showbut==1 && this.show==false) {
            //     this.tableHeight10 = window.innerHeight - this.$refs.table.$el.offsetTop - 28;
            //   }
            //
            //   // 监听窗口大小变化
            //   let self = this;
            //   window.onresize = function() {
            //     self.tableHeight10 = window.innerHeight - self.$refs.table.$el.offsetTop - 143
            //   }
            // })
        },
        //设为可删除
        onDelete() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    type: "waring",
                    message: "请选择至少一条数据",
                    duration: 2500
                })
            } else {
                var idDelete = this.multipleSelection.map(v => v.id);
                var deleteSelect = this.multipleSelection.every(v => v.process_instance_id == '7');
                var partitiondate;
                this.multipleSelection.forEach(it => {
                    partitiondate = it.partitiondate
                });
                if (deleteSelect === true) {
                let params = {
                    inspect_id: idDelete,
                    partitiondate: partitiondate,
                    sign: 0
                };
                this.$api.myReport.setDelete(params).then(res => {
                    if (res.data.ok) {
                        this.$message({type: 'success', message: res.data.data, duration: 2500})
                    } else {
                        this.$message({type: 'error', message: res.data.data, duration: 2500})
                    }
                })
                } else {
                    this.multipleSelection.forEach(it => {
                        if (it.process_instance_id !== '7') {
                            this.$message({type: 'info', message: `${it.itemsCode}报告未完成,请重新选择`, duration: 2500})
                        }
                    });
                    return
                }
            }
        },
        //设为不可删除
        onNoDelete() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    type: "waring",
                    message: "请选择至少一条数据",
                    duration: 2500
                })
            } else {
                var idDelete = this.multipleSelection.map(v => v.id);
                var deleteSelect = this.multipleSelection.every(v => v.process_instance_id !== '7');
                var partitiondate;
                this.multipleSelection.forEach(it => {
                    partitiondate = it.partitiondate
                });
                if (deleteSelect === true) {
                    let params = {
                        inspect_id: idDelete,
                        partitiondate: partitiondate,
                        sign: 1
                    };
                    this.$api.myReport.setDelete(params).then(res => {
                        if (res.data.ok = true) {
                            this.$message({type: 'success', message: res.data.data, duration: 2500})
                        } else {
                            this.$message({type: 'error', message: res.data.data, duration: 2500})
                        }
                    })
                } else {
                    this.multipleSelection.forEach(it => {
                        if (it.process_instance_id === '7') {
                            this.$message({type: 'info', message: `${it.itemsCode}报告已完成,请重新选择`, duration: 2500})
                        }
                    });
                }
            }
        },
        //返回值1
        select1(data) {
            this.wttype = data;
            let obj = {
                formaction: this.formaction,
                wttype: this.wttype
            };
            this.$api.myReport.archivingRate(obj).then(res => {
                this.tableData4 = res.data.data.tinfo.list;
                this.tableData5 = res.data.data.tinfo;
                let ar = {
                    orgName: '合计',
                    attarch1: this.tableData5.attarch1,
                    attarch2: this.tableData5.attarch2,
                    attarch3: this.tableData5.attarch3,
                    attarch4: this.tableData5.attarch4,
                    attarch5: this.tableData5.attarch5,
                    attarch6: this.tableData5.attarch6,
                    attarch7: this.tableData5.attarch7,
                    attarch8: this.tableData5.attarch8,
                    finishAttarch: this.tableData5.finishAttarch,
                    bfb: this.tableData5.bfb,
                };
                this.tableData4.push(ar)
            })
        },
        //返回值2
        select2(data) {
            this.formaction = data;
            let obj = {
                formaction: this.formaction,
                wttype: this.wttype
            };
            this.$api.myReport.archivingRate(obj).then(res => {
                this.tableData4 = res.data.data.tinfo.list;
                this.tableData4.forEach((item, index) => {
                    item.iop = index
                });
                this.tableData5 = res.data.data.tinfo;
                let ar = {
                    orgName: '合计',
                    attarch1: this.tableData5.attarch1,
                    attarch2: this.tableData5.attarch2,
                    attarch3: this.tableData5.attarch3,
                    attarch4: this.tableData5.attarch4,
                    attarch5: this.tableData5.attarch5,
                    attarch6: this.tableData5.attarch6,
                    attarch7: this.tableData5.attarch7,
                    attarch8: this.tableData5.attarch8,
                    loginid: this.tableData5.loginid,
                    name: this.tableData5.name,
                    gdFinishAttarch: this.tableData5.gdFinishAttarch,
                    finishAttarch: this.tableData5.finishAttarch,
                    bfb: this.tableData5.bfb,
                };
                this.tableData4.push(ar)
            })
        },
        //点击归档率
        filingRate() {
            this.dialogBinding = true;
            this.$api.myReport.filingRate().then(res => {
                this.finds = res.data.data
            });
            let obj = {
                formaction: this.formaction,
                wttype: this.wttype,
                taskCode: this.formInline.taskCode,
                companyCheck: this.formInline.companyCheck,
                sampleName: this.formInline.sampleName,
                searchdate: this.formInline.searchdate,
                sampleType: this.formInline.sampleType,
                zjsign: this.formInline.zjsign,
                itemscode: this.formInline.itemscode,
                docStatus: this.formInline.docStatus,
            };
            this.$api.myReport.archivingRate(obj).then(res => {
                this.tableData4 = res.data.data.tinfo.list;
                this.tableData5 = res.data.data.tinfo;
                let ar = {
                    orgName: '合计',
                    attarch1: this.tableData5.attarch1,
                    attarch2: this.tableData5.attarch2,
                    attarch3: this.tableData5.attarch3,
                    attarch4: this.tableData5.attarch4,
                    attarch5: this.tableData5.attarch5,
                    attarch6: this.tableData5.attarch6,
                    attarch7: this.tableData5.attarch7,
                    attarch8: this.tableData5.attarch8,
                    finishAttarch: this.tableData5.finishAttarch,
                    bfb: this.tableData5.bfb,
                };
                this.tableData4.push(ar)
            })
        },
        // 获取列表数据
        getDataList(){
            this.onSubmit(this.formInline, 1, 10);
        },
        // 点击查询
        onSubmit(formInline, currentPage, pageSize) {
            this.pageFormInline = {...formInline};
            this.stopOnSubmit = true;

            this.loadings = true;
            if (this.formInline.zjsign === '全部') {
                this.formInline.zjsign = ''
            }
            this.currentPage4 = currentPage;
            this.pageSize = pageSize;
            formInline.currentPage = this.currentPage4;
            formInline.pageSize = this.pageSize;
            formInline.moduleCode = 2;
            this.$api.myReport.queryProject(formInline).then(res => {
                this.tableData = res.data.data;
                this.tableData.length > 0 ? this.total = this.tableData[0].total : this.total = 0;
                this.loadings = false;
            }).catch(error => {
                this.$message({type: 'error', message: error.data.message, duration: 2500});
                this.loadings = false;
            })
        },
        //回车查询
        searchEnterFun(e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode == 13) {
                this.onSubmit(this.formInline, 1, 10)
            }
        },
        //点击查看
        handleClick(row) {
            var obj = document.getElementById("WO3Word2");
            try {
                obj.setUid(this.userName);
                obj.setFileId(row.id);
                obj.setReportNo(row.itemsCode);
                obj.setProcess("7");
                obj.setRemoteIp(base.baseImgUrl);
                obj.ActiveStart()
            } catch (error) {
                if (confirm("您确认没有安装Word控件吗? 点确定您将下载setup.zip 解压后运行setup.exe即可")) {
                    window.open(base.baseImgUrl + "/api/file/resources/donet/setup.zip");
                }
            }
        },
        //获取用户信息//获取前10年查询年份
        userMSG() {
            //获取前10年年分
            var myDate = new Date();
            var thisYear = myDate.getFullYear();
            var thisYearid = thisYear - 9;
            var Section = thisYear - thisYearid;
            var Yearis = 0;
            for (var i = 0; i <= Section; i++) {
                myDate = {
                    id: Yearis++, date: thisYear--
                };
                this.arrDate_.push(myDate)
            }
            this.datasDatas = this.arrDate_
            //用户信息
            if(JSON.parse(localStorage.getItem("userInfo")).loginName) {
                this.userName = JSON.parse(localStorage.getItem("userInfo")).loginName;
            }
        },
        //点击修改
        editClickUp() {
            this.dialogVisibleEdit = true;
            this.$api.myReport.editReportBtn().then(res => {
                if (res.data.ok == true) {
                    this.tabllist = res.data.data;
                }
            })
        },

        // 分页器Size改变时触发
        handleSizeChange(val) {
            this.pageSize = val;
            if (this.stopOnSubmit) this.onSubmit(this.pageFormInline, this.currentPage4, this.pageSize);
        },
        // 当前页码改变时触发
        handleCurrentChange(val) {
            this.currentPage4 = val;
            this.onSubmit(this.pageFormInline, this.currentPage4, this.pageSize);
        },

        // 修改-点击编号-打开报告
        clickOpenReport(row) {
            // row.process_instance_id
            var obj = document.getElementById("WO3Word2");
            try {
                obj.setUid(this.userName);
                obj.setFileId(row.id);
                obj.setReportNo(row.itemsCode);
                obj.setProcess('3');
                obj.setRemoteIp(base.baseImgUrl);
                obj.ActiveStart()
            } catch (error) {
                if (confirm("您确认没有安装Word控件吗? 点确定您将下载setup.zip 解压后运行setup.exe即可")) {
                    window.open(base.baseImgUrl + "/api/file/resources/donet/setup.zip");
                }
            }
        },
        // 修改 -- 提交
        handleCommit(row) {
            this.$confirm('确认要提交吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = new FormData();
                params.append('cachetype', 'new');
                params.append('inspectids', row.id);
                params.append('operateFlag', 'save');
                this.$api.myReport.editReportRead(params).then(res => {
                if (res.data.ok) {
                    this.$message({type: 'success', message: '提交成功', duration: 2500});
                    this.editClickUp();
                }
                }).catch(error => {
                    this.$message({type: 'error', message: error.data.message, duration: 2500})
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消提交',
                    duration: 2500
                });
            });
        },
        // 修改 -- 流转
        handleReturn(row) {
            let params = {
                id: row.id
            };
            this.$api.taskmanage.apiFindWorkLog(row.id).then(res => {
                this.threeTableList = res.data.data.list;
                $twoTable.toggleRowExpansion(row);
            });
            let $twoTable = this.$refs.twoTable;
            this.tabllist.map(item => {
                if (row.id != item.id) {
                    $twoTable.toggleRowExpansion(item, false)
                }
            })
        },
        // 点击查看详情
        handleClickDetails() {
            this.dialogReadDetaills = true;
        },
        row_key(row) {
            return row.id;
        },
        // 点击浏览
        showInTable(row) {
            this.loading2 = true;
            this.multipleSelection = [];
            // this.deleteFunBr = row.process_instance_id
            let params = new FormData();
            params.append('taskId', row.id);
            params.append('isGd', 1);
            this.$api.myReport.readEveryReport(params)
              .then(res => {
                this.tableData2 = res.data.data.list;
                this.number = res.data.data.list;
                this.loading2 = false;
                $table.toggleRowExpansion(row);
            })
              .catch(err => {
                this.$message({type: 'error', message: '查询失败', duration: 2500});
                this.loading2 = false;
            });
            let $table = this.$refs.table;
            this.tableData.map(item => {
                if (row.id != item.id) {
                    $table.toggleRowExpansion(item, false);
                }
            });
        },
        // 重新生成快查
        showGoQRead(row) {
            this.$api.myReport.againReport(row.id).then(res => {
                if (res.data.ok == true) {
                    this.$message({type: 'success', message: res.data.data, duration: 2500})
                } else {
                    this.$message({type: 'error', message: res.data.data, duration: 2500})
                }
            })
        },
        // 点击详细
        showInDetails(row) {
            let that = this;
            that.dialogVisibleDetails = true;
          this.mlyTaskinfor = {
            'otherFrom': 'other1',
            'params': {
              'taskid': row.id
            }
          }
          // this.$api.taskmanage.apiEditTaskInfo
        },
        // 点击归档
        showGoFile(row) {
            this.$nextTick(() => {
                this.hackReset = true;// 重建组件
            });
            let params = new FormData();
            params.append('taskId', row.id);
            params.append('isGd', 1);
            this.$api.myReport.readEveryReport(params).then(res => {
                if (res.data.data.list.length == 0) {
                    this.lengtharr = '0';
                    this.lzyobj = res.data.data;
                } else {
                    this.lengtharr = '1';
                    this.renwu = row.taskCode;
                    this.lzyobj = res.data.data;
                }
                this.tableData2 = res.data.data.list;
                this.rows = row;
                this.dialogTableVisible = true;
            }).catch(err => {
                console.log(err, 'error');
            });
            this.$api.taskmanage.power(row.id).then(res => {
                this.permissions = res.data.data;
            })
        },
        tabsCard(tab, event) {
            console.log(tab, event);
        },
        // 点击快查
        showGoRead(row) {
            //WT191627
            this.initialState = true;
            this.tableDataImg = [];
            this.imgCountPage = '';
            var rowItemCode = {itemsCode: row.itemsCode};
            var rowRow = [];
            rowRow.push(rowItemCode);
            this.number = rowRow;
            this.uploadIdList = [row];
            this.productValue = this.number[0].id;
            this.$api.myReport.quicklyQuickly(row.id).then(res => {
                var floder = res.data.data.floder,
                pagecount = res.data.data.pagecount,
                imgDataId = res.data.data.id;
                this.imgCountPage = pagecount ? pagecount.toString() : '0';
                if (floder == null || pagecount == null || imgDataId == null) {
                    this.$message({type: 'info', message: '暂无生成', duration: 2500})
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
                        this.$message({type: 'error', message: `${row.itemsCode}暂未生成快查`, duration: 2500});
                        return false
                    } else {
                        this.dialogQuickly = true;
                    }
                }
            }).catch(err => {
                this.$message({type: 'error', message: "查看失败", duration: 2500})
            })
        },
        // 点击下一份报告
        nextReportBtn(data) {
            if (this.number.length == 1) {
                this.$message({type: 'info', message: '当前只有一份报告', duration: 2500})
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
        // 选择报告编号
        selectproductValue(data) {
            this.productValue = data;
            this.number.forEach((val, index) => {
                if (this.productValue === val.id) {
                    this.indexValueId = index;
                }
            });
            this.reportQuickt(this.productValue)
        },
        // 快查接口封装
        reportQuickt(idId) {
            this.imgCountPage = '';
            this.tableDataImg = [];
            this.$api.myReport.quicklyQuickly(idId).then(res => {
                var floder = res.data.data.floder,
                pagecount = res.data.data.pagecount,
                imgDataId = res.data.data.id;
                this.imgCountPage = pagecount ? pagecount.toString() : '0';
                if (floder == null || pagecount == null || imgDataId == null) {
                    this.$message({type: 'info', message: '暂无生成', duration: 2500})
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
                this.$message({type: 'error', message: "查看失败", duration: 2500})
            })
        },
        // 点击全局快查
        onSubmitQuick() {
            this.initialState = true;
            this.indexValueId = 0;
            if (this.multipleSelection.length == 0) {
                this.$message({type: "waring", message: "请选择至少一条数据", duration: 2500})
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
                        this.$message({type: 'info', message: '暂无生成', duration: 2500})
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
                            this.$message({type: 'error', message: `${itemsCodes}暂未生成快查`, duration: 2500});
                            return false
                        } else {
                            this.dialogQuickly = true;
                        }
                    }
                }).catch(err => {
                    this.$message({type: 'error', message: "查看失败", duration: 2500})
                });
            }
        },
        // 全选
        handleSelectionChange(data) {
            this.multipleSelection = data;
        },
        cellStyle({row, column, rowIndex, columnIndex}) {
            return "text-align:center"
        },
        // 下载word / 下载pdf
        uploadFile(url) {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    type: "waring",
                    message: "请选择至少一条数据",
                    duration: 2500
                })
            } else {
                var arrIDITE = [];
                this.multipleSelection.forEach(item => {
                    arrIDITE.push(`${item.id}:${item.itemsCode}`)
                });
                arrIDITE.join("");
                this.$api.myReport.uploadWordTo(arrIDITE).then(res => {
                    if (res.data.data == '0') {
                        this.$confirm('确认要下载吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            var obj = document.getElementById("WO3Word2");
                            try {
                                obj.setExecuteaction(url);
                                obj.setServerIP(`${base.baseImgUrl}`);
                                obj.setIds(arrIDITE);
                                obj.downStart();
                            } catch (error) {
                                if (confirm("您确认没有安装Word控件吗? 点确定您将下载setup.zip 解压后运行setup.exe即可")) {
                                    window.open(base.baseImgUrl + "/api/file/resources/donet/setup.zip");
                                }
                            }
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '插件异常,已取消下载',
                                duration: 2500
                            });
                        });
                    } else {
                        this.$message({
                            type: 'info',
                            message: '报告正在处理中',
                            duration: 2500
                        });
                    }
                });
            }
        },
    },
}
</script>

<style lang="less" scoped>
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

// 我的报告-边框
.report_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    margin-bottom: 10px;
    padding: 10px;
    overflow: hidden;
}

// 首页-我的报告
.home_report_border {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #fff;
}

// 首页-我的报告
/deep/ .home_report_con {
    width: 100%;
    height: 100%;
    padding: 0;
}

/deep/ .report_con {
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
            overflow: hidden;
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
            padding-right: 60px;
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

// 二级表格-内的按钮
.grid-content {
    margin-bottom: 20px;
}

// 快查
.dialog_quickly {
    overflow: hidden;
    padding: 50px 0;
    .el-dialog {
        height: 100% !important;
        margin: 0 auto !important;
        overflow: hidden !important;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            overflow: hidden !important;
            padding: 20px;
        }
    }
}

// 归档率
/deep/ .filing_rate {
    width: 100%;
    height: 100%;
    padding: 100px 0;
    overflow: hidden;
    .el-dialog {
        height: 100% !important;
        overflow: hidden !important;
        margin: 0 auto !important;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            overflow: hidden !important;
            .bottom {
                height: 100% !important;
                overflow: hidden !important;
                .archiverate_box {
                    height: 100% !important;
                    overflow: hidden !important;
                    display: flex;
                    flex-direction: column;
                }
                .roughly_tabel {
                    flex: 1;
                    overflow-y: auto;
                }
            }
        }
    }
}

// 归档
/deep/ .dialog_report_file {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .el-dialog {
        margin: 0 !important;
        padding: 0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        height: 80% !important;
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

// 详情对话框
/deep/ .choice_statistics {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    overflow: hidden;
    z-index: 2000;
    .el_dialog {
        width: 100%;
        height: 100%;
        background: #fff;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el_dialog__header {
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
        .el_dialog__body {
            flex: 1;
            padding: 20px;
            overflow: hidden;
        }
    }
}

// 修改
/deep/ .edit_dialog {
    overflow: hidden;
    padding: 100px 0;
    .el-dialog {
        height: 100% !important;
        margin: 0 auto !important;
        overflow: hidden !important;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            overflow: hidden !important;
            padding: 20px;
        }
        .el-dialog__footer {
            padding: 0 20px 20px 20px;
        }
        .edit_dialog_table {
            height: 100%;
            overflow-y: auto;
        }
    }
}
</style>
