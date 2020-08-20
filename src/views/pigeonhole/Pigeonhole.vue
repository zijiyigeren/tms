<template>
    <!-- 报告归档 -->
    <div class="pigeonhole_border">
        <div class="pigeonhole_con">
            <!-- 查询 -->
            <div class="query_modular">
                <div class="query_complex">
                    <el-form ref="form" :model="sizeForm" label-width="90px" class="query_form">
                        <el-form-item label="任务号：">
                            <el-input
                                clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                v-model.trim="sizeForm.starttask">
                            </el-input>
                            <!-- <div style="display: flex;width: 100%;">
                                <el-input
                                    clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                    v-model.trim="sizeForm.starttask"
                                    style="width:47%;">
                                </el-input>
                                <span style="flex: 1;text-align: center;">-</span>
                                <el-input
                                    clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                    v-model.trim="sizeForm.endtask"
                                    style="width:47%;">
                                </el-input>
                            </div> -->
                        </el-form-item>
                        <el-form-item label="报告编号：">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                                v-model.trim="sizeForm.report">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="归档类型：">
                            <el-select v-model="sizeForm.status" placeholder="请选择" >
                                <el-option v-for="item in archiving_type" :key="item.id"
                                    :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="报告状态：">
                            <el-select v-model="sizeForm.type" placeholder="请选择" @change="fileTypeChange">
                                <el-option v-for="item in typeL" :key="item.id" 
                                    :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="受检单位：" v-show="showState">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                                v-model.trim="sizeForm.companyCheck">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="样品名称：" v-show="showState">
                            <el-input 
                                clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                                v-model.trim="sizeForm.sampleName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="年份：" v-show="showState">
                            <el-select v-model="sizeForm.year" placeholder="请选择" >
                                <el-option v-for="item in yearlist" :key="item.id" 
                                    :label="item.year" :value="item.id">
                            </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="规格型号：" v-show="showState">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                                v-model.trim="sizeForm.sampleType">
                            </el-input>
                        </el-form-item>

                        <!-- <el-form-item label="下达日期：" v-show="showState">
                            <div style="display: flex;width: 100%;">
                                <el-input
                                    clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                                    v-model.trim="sizeForm.one_starttask"
                                    placeholder="YYYY-MM-DD"
                                    style="width:47%;">
                                </el-input>
                                <span style="flex: 1;text-align: center;">-</span>
                                <el-input
                                    clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                                    v-model.trim="sizeForm.two_endtask" 
                                    placeholder="YYYY-MM-DD"
                                    style="width:47%;">
                                </el-input>
                            </div>
                        </el-form-item> -->
                        <!-- <el-form-item label="签发日期：" v-show="showState">
                            <div style="display: flex;width: 100%;">
                                <el-input
                                    clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                    v-model.trim="sizeForm.one_startissue" 
                                    placeholder="YYYY-MM-DD"
                                    style="width:47%;">
                                </el-input>
                                <span style="flex: 1;text-align: center;">-</span>
                                <el-input 
                                    clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                    v-model.trim="sizeForm.two_endissue" 
                                    placeholder="YYYY-MM-DD"
                                    style="width:47%;">
                                </el-input>
                            </div>
                        </el-form-item> -->
                        <!-- <el-form-item label="归档日期：" v-show="showState">
                            <div style="display: flex;width: 100%;">
                                <el-input
                                    clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                    v-model.trim="sizeForm.one_startfile" 
                                    placeholder="YYYY-MM-DD"
                                    style="width:47%;">
                                </el-input>
                                <span style="flex: 1;text-align: center;">-</span>
                                <el-input
                                    clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                    v-model.trim="sizeForm.two_startfile" 
                                    placeholder="YYYY-MM-DD"
                                    style="width:47%;">
                                </el-input>
                            </div>
                        </el-form-item> -->
                        <!-- <el-form-item label="齐全日期：" v-show="showState">
                            <div style="display: flex;width: 100%;">
                                <el-input
                                    clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                    v-model.trim="sizeForm.one_startreadiness" 
                                    placeholder="YYYY-MM-DD"
                                    style="width:47%;">
                                </el-input>
                                <span style="flex: 1;text-align: center;">-</span>
                                <el-input 
                                    clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                    v-model.trim="sizeForm.two_endtreadiness" 
                                    placeholder="YYYY-MM-DD"
                                    style="width:47%;">
                                </el-input>
                            </div>
                        </el-form-item> -->
                        <!-- <el-form-item label="主检：" v-show="showState">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                                v-model.trim="sizeForm.zjian">
                            </el-input>
                        </el-form-item> -->
                        <!-- <el-form-item label="科室：" v-show="showState">
                            <el-select v-model="sizeForm.inspection_type" placeholder="请选择" >
                                <el-option v-for="(item,i) in types" :key="i" 
                                    :label="item.org_name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                        <!-- <el-form-item label="申请编号 :">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                                v-model="sizeForm.application_number">
                            </el-input>
                        </el-form-item> -->
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
                        <el-button type="primary" @click="archiving">归档率 </el-button>
                        <el-button v-show="showSendEmailBTN" type="primary" @click="beforeSendEmail" >
                            发送邮件
                        </el-button>
                    </p>
                    <p class="query_rightbtn">
                        <el-button type="primary" @click="onSubmit(1,10)">查询</el-button>
                        <!-- <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button> -->
                    </p>
                </div>
            </div>

            <!-- 表格与分页 -->
            <div v-loading="loading" class="tablePagination_modular">
                <div class="table_modular">
                    <el-table stripe border 
                        ref="table"
                        :data="tableData"
                        :header-cell-style="{
                            'background-color': 'rgba(243,246,253,1)',
                            'color': '#606266',
                            'padding': '10px 0'}"
                        @selection-change="selectionChangeFn">
                        <el-table-column align="center" :resizable="false" type="selection"></el-table-column>
                        <el-table-column align="center" :resizable="false" type="index" label="序号" width="60">
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="taskCode" label="任务号"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="checkTypeID" label="检验类别">
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="sampleType" label="样品规格型号">
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="sampleName" label="样品名称"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="companyCheck" label="受检单位">
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" label="操作" width="220">
                            <template slot-scope="scope">
                                <el-button type="text" @click="toogleExpand(scope.row)">浏览</el-button>
                                <el-button type="text" @click="TExpand(scope.row)">归档确认</el-button>
                            </template>
                        </el-table-column>

                        <el-table-column :resizable="false" type="expand" width="1">
                            <template slot-scope="scope">
                                <!-- 二级弹出 -->
                                <div class="lxt_title" style="margin-bottom:10px;">
                                    <el-button type="primary" @click="onClickXgdReport(scope.row)"
                                        style="height:30px;padding: 5px 20px;margin:0; color:#fff;
                                            background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));">
                                        下载word
                                    </el-button>
                                    <el-button type="primary" @click="onClickfallback(scope.row)"
                                        style="height:30px;padding: 5px 20px;margin:0; color:#fff;
                                            background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));">
                                        下载PDF
                                    </el-button>
                                </div>
                                <div>
                                    <el-table border stripe ref="Table2"
                                        :data="tableData2"
                                        :header-cell-style="{
                                            'background-color': 'rgba(243,246,253,1)',
                                            'color': '#606266',
                                            'padding': '10px 0'
                                        }"
                                        @selection-change="dataSelect">
                                        <el-table-column align="center" :resizable="false" type="index" label="序号" width="60"> 
                                        </el-table-column>
                                        <el-table-column align="center" :resizable="false" type="selection"></el-table-column>
                                        <el-table-column align="center" :resizable="false" prop="itemsCode" label="报告编号">
                                        </el-table-column>
                                        <el-table-column align="center" :resizable="false" prop="itemsName" label="项目名称">
                                        </el-table-column>
                                        <el-table-column align="center" :resizable="false" prop="orgName" label="科室">
                                        </el-table-column>
                                        <el-table-column align="center" :resizable="false" prop="" label="标记状态">
                                            <template slot-scope="scope">
                                                <span v-if="scope.row.docStatus == '1'" style="color:#00DD00">已归档</span>
                                                <span v-if="scope.row.docStatus == '-1'">已提交归档</span>
                                                <span v-if="scope.row.docStatus == '0'" style="color:red">未提交归档</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" :resizable="false" label="操作" width="200" style="color:#32AFF0;">
                                            <template slot-scope="scope">
                                                <el-button type="text" @click="clickFindWorkLog(scope.row)">流转</el-button>
                                                <el-button type="text" @click="showGoRead(scope.row)">快查</el-button>
                                            </template>
                                        </el-table-column>

                                        <el-table-column :resizable="false" type="expand" width="1">
                                            <template>
                                                <!-- 三级弹出 -->
                                                <el-table border stripe
                                                    :data="tableData3"
                                                    :show-header="false"
                                                    style="width: 100%">
                                                    <el-table-column align="center" :resizable="false" type="index" label="序号" width="70%">
                                                    </el-table-column>
                                                    <el-table-column align="center" :resizable="false" prop="flowname">
                                                    </el-table-column>
                                                    <el-table-column align="center" :resizable="false" prop="name">
                                                    </el-table-column>
                                                    <el-table-column align="center" :resizable="false" prop="create_date">
                                                    </el-table-column>
                                                    <el-table-column align="center" :resizable="false" prop="end_date">
                                                    </el-table-column>
                                                </el-table>
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

        <!-- 发送邮件 -->
        <el-dialog
            class="className-sendEmail"
            v-bind="{
                title:'发送下载',
                customClass:'className-sendEmail-body',
                modal:false,
                top: '5vh',
            }"
            :visible.sync="showSendEmail"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="close_showSendEmail">
            <div style="height: 580px;display: flex;flex-direction: column;">
                <el-form ref="sendMailForm1" :model="sendEmailForm"
                    v-bind="{
                        labelWidth: '130px',
                        labelSuffix: ' :',
                        size:'mini',
                        rules:sendEmailFormRules
                    }">
                    <el-form-item>
                        <span slot="label">
                            <i style="color: red;">* </i>下载的文件类型
                        </span>
                        <el-radio-group v-model="sendEmailForm.colorState">
                            <el-radio :label="0">彩图</el-radio>
                            <el-radio :label="1">扫描图</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否需要骑缝章">
                        <el-checkbox
                            label="骑缝章"
                            v-model="sendEmailForm.pagingSealState"
                            v-bind="{
                                    trueLabel: 1,
                                    falseLabel: 0,
                                }"
                            />
                    </el-form-item>
                </el-form>
                <div style="flex: 1;overflow: hidden;">
                    <el-table border height="calc(100% - 10px)"
                        v-bind="{
                            data: mailList
                        }">
                        <el-table-column
                            v-bind="{
                                label:'任务号',
                                width:'300',
                                prop:'taskCode',
                                resizable:false,
                            }"/>
                        <el-table-column
                            v-bind="{
                                prop:'',
                                label:'报告编号',
                                resizable:false,
                            }">
                            <template slot-scope="{ row }">
                                {{row.list | filterFn1}}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-form
                    :model="sendEmailForm"
                    v-bind="{
                        labelWidth: '130px',
                        labelSuffix: ' :',
                        size:'mini',
                    }">
                    <el-form-item label="备注">
                        <!--<span slot="label"><i style="color: red;">* </i>备注</span>-->
                        <textarea
                            v-model.lazy="sendEmailForm.mailTask.bz"
                            maxlength="300"/>
                    </el-form-item>
                </el-form>
                <div style="text-align: center;">
                    <el-button size="mini" @click="downloadFn1(2)">下载常规报告</el-button>
                    <el-button size="mini" @click="downloadFn1(3)">下载修改报告</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 归档率 -->
        <el-dialog width="80%" :title="title" class="lzylist"
            :visible.sync="dialogBinding">
            <Archiverate
                v-bind="{
                    'list': tableData4,
                    'find': finds
                }"
                @showCityName="select1" @showCityNames="select2">
            </Archiverate>
        </el-dialog>

        <!--快查的对话框-->
        <el-dialog width="80%" title="快速查看" class="dialog_quickly" 
            :close-on-press-escape="false" :close-on-click-modal="false" 
            :visible.sync="dialogQuickly" :before-close="handleDialogQuickly">
            <Quiickready 
                :indexValueId="indexValueId" 
                :percentage="percentage" 
                :productValue="productValue"
                :initialState="initialState"
                :tableDataImg="tableDataImg" 
                :numberData="number" 
                :imgCountPage="imgCountPage"
                :uploadIdList="uploadIdList"
                @selectproductValue="selectproductValue" 
                @nextReportBtn="nextReportBtn">
            </Quiickready>
        </el-dialog>

        <!-- 归档管理 -->
        <el-dialog width="80%" :title="ti" v-if="hackResets"
            class="dialog_report_file" :close-on-click-modal="false"
            :visible.sync="Archivedialog" :before-close="handleClose">
            <Reportfile :tableData2="archiveData" :renwu="renwu"
                :dialogTableVisible="Archivedialog"
                :rows="rows" :permissions="permissionss"
                :tit="2" :bysdj="bysdj" :lengtharr="lengtharr" :lzyobj="lzyobj">
            </Reportfile>
            <!-- <Archive :tableData2="archiveData" :renwu="renwu" :Archivedialog="Archivedialog" :rows="rows"
                    :permissions="permissionss" :tit="3" :bysdj="bysdj" :lengtharr="lengtharr" :lzyobj="lzyobj"
            ></Archive> -->
        </el-dialog>

        <!-- 归档确认 -->
        <el-dialog width="80%" :title="titleFileConfirm" v-if="hackReset"
            class="dialog_report_file" :close-on-click-modal="false"
            :visible.sync="dialogFileConfirm" :before-close="handleCloses" >
            <FileConfirm
                v-bind="{
                    'dialogTableVisible': dialogFileConfirm,
                    'tableData2': archiveData,
                    'permissionss': permissionss,
                    'lengtharr': lengtharr,
                    'renwu': renwu,
                    'rows': rows,
                    'bysdj': bysdj,
                    'lzyobj': lzyobj,
                }">
            </FileConfirm>
        </el-dialog>

        <!-- 打开报告 -->
        <object id="WO3Word2" classid="clsid:561C5A99-71C8-48d4-A3E2-16FC4F9880BF" width="0" height="0" style="display:block"/>
    </div>

</template>
<script>
import base from '@/api/base';
import Archiverate from '@/components/Archiverate';
import Quiickready from '@/components/Quiickready.vue';
import FileConfirm from '@/components/FileConfirm';
import Archive from '@/components/Archive'; // 归档-旧
import Reportfile from '@/components/ReportFile'; // 归档
let _sendEmailForm = {
    colorState: 0,
    pagingSealState: 1,
    mailTask: {
        'mail': '--',
        'bz': ''
    }
}
export default {
    name: 'pigeonhole',
    components: { Archiverate, Quiickready, Archive, FileConfirm, Reportfile },
    data () {
        return {
            loading: false,
            showbut: 0, // 展开/收起-状态
            showState: false, // 查询框显示状态
            total: 0,
            currentPage: 1,
            pageSize: 10,
            lzyobj: {},
            initialState: false,
            dialogQuickly: false,
            indexValueId: 0,
            productValue: '',
            bysdj: '',
            hackReset: false,
            hackResets: false,
            permissionss: 0,
            renwu: '',
            rows: {},
            Archivedialog: false,
            ti: '归档确认',
            dialogFormTitle: '快查',
            dialogFormVisible: false,
            fileList: [
                {
                    name: 'food2.jpeg',
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }
            ],
            radio: '1',
            title: '归档率',
            dialogBinding: false,
            number: [],
            sizeForm: {  //表单
                starttask: '',
                endtask: '',
                application_number: '',
                report: '',
                one_starttask: '',
                two_endtask: '',
                one_startissue: '',
                two_endissue: '',
                one_startfile: '',
                two_startfile: '',
                one_startreadiness: '',
                two_endtreadiness: '',
                year: '',
                zjian: '',
                type: '',
                inspection_type: '',
                companyCheck: '',
                sampleName: '',
                sampleType: '',
                status: '',
            },
            percentageValue: '', /*选择百分比*/
            percentage: [
                {value: '0', label: '40%'},
                {value: '1', label: '70%'},
                {value: '2', label: '90%'},
                {value: '3', label: '100%'},
                {value: '4', label: '130%'},
                {value: '5', label: '150%'}
            ], /*选择百分比*/
            imgCountPage: '', /*图片页数*/
            tableDataImg: [], /*图片数组*/
            archiving_type: [
                {id: 0, label: '全部', value: ''},
                // {id: 1, label: '报告未归档', value: '0'},
                // {id: 2, label: '报告已归档', value: '1'},
                {id: 1, label: '已归档', value: '1'},
                {id: 3, label: '已提交归档', value: '-1'},
                {id: 2, label: '未提交归档', value: '0'}
            ],
            yearlist: [
                {id: '', year: '全部'}
            ],
            typeL: [
                {id: 0, label: '全部', value: ''},
                {id: 1, label: '未完成', value: '2'},
                {id: 2, label: '已完成', value: '1'}
            ],
            finds: [],
            types: [],
            tableData: [],
            tableData2: [],
            tableData3: [],
            tableData4: [],
            tableData5: [],
            doc: Number,
            formaction: 'tj2',
            wttype: '',
            multipleSelection: [],
            multipleSelections: [],
            str: '',
            titleFileConfirm: '归档确认',
            dialogFileConfirm: false,
            lengtharr: '',
            archiveData: [], // 点击归档后传值
            uploadIdList: [], // 上传中机-快查id\
            /****************************************************/
            showSendEmail: false,
            sendEmailForm: JSON.parse(JSON.stringify(_sendEmailForm)),
            sendEmailFormRules: {
                // 'mailTask.mail': [
                //   {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                //   {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                // ]
            },
            showSendEmailBTN: false,
            selectionList: [],
            mailList: []
        }
    },
    created () {
        this.yearDate();
        this.typebie();
    },
    mounted () {
        this.getDataList();
    },
    filters: {
        filterFn1 (val) {
            let temp = val.map(item => {
                return item['itemsCode'];
            })
            return temp.toString();
        }
    },
    methods: {
        // 点击收起/展开
        clickshowbut (num) {
            this.showState = !this.showState;
            this.showbut = num;
        },
        // 归档状态改变
        fileTypeChange(val) {
             if (val == 1){
                this.showSendEmailBTN = true;
            } else {
                this.showSendEmailBTN = false;
            }
        },
        selectionChangeFn (selection) {
            this.selectionList = JSON.parse(JSON.stringify(selection))
        },
        // 发送下载 点击按钮
        beforeSendEmail () {
            if (this.selectionList.length == 0) {
            this.$message.warning({
                message: '请选择数据 !'
            })
            } else {
            let data = this.selectionList.map(item => {
                return item['taskCode']
            })
            let params = {
                taskcode: data.toString(),
            }
            this.$api.pigeohole.sendMailButton(params)
                .then((res) => {
                this.showSendEmail = true
                this.$nextTick(() => {
                    let temp = res.data.data
                    this.mailList = temp.slice(0)
                })
                })
                .catch()
            }
        },
        // 下载(常规、修改)报告
        downloadFn1 (sendflag) {
            let taskcode = this.mailList.map(item => {
            return item.taskCode
            })
            let params = {
            ...JSON.parse(JSON.stringify(this.sendEmailForm)),
            taskcode: taskcode.toString(),
            sendflag,
            }
            this.$api.pigeohole.sendMail(params)
            .then(() => {
                this.showSendEmail = false
            })
            .catch()
        },
        /*
        * 发送邮件 弹框关闭 时
        * */
        close_showSendEmail () {
            this.sendEmailForm = JSON.parse(JSON.stringify(_sendEmailForm))
            this.$nextTick(() => {
            this.$refs['sendMailForm1'].clearValidate()
            })
            this.mailList = []
        },
        /*******************************************************/
        /*
        * 功能:当前可选年份范围
        * */
        yearDate () {
            // 遍历年份 从2007开始到当前年份
            const myDate = new Date()
            let thisYear = myDate.getFullYear()
            let Section = thisYear - 2007
            for (let i = 0; i <= Section; i++) {
            let _thisYear = thisYear--
            let obj = {id: _thisYear, year: _thisYear}
            this.yearlist.push(obj)
            }
        },
        getDataList () {
            this.onSubmit(1, 10)
        },
        // 归档确认-关闭
        handleCloses (done) {
            this.dialogFileConfirm = false;
            this.hackReset = false//销毁组件
            done();
            // this.onSubmit(this.currentPage, this.pageSize)
        },
        // 归档-关闭
        handleClose (done) {
            this.Archivedialog = false;
            this.hackResets = false;// 销毁组件
            done();
            // this.onSubmit(this.currentPage, this.pageSize)
        },
        //归档管理  计划员 --- 归档员
        TExpand (row) {
            let obj = {
                docStatus: this.sizeForm.status,
                task_status: row.task_status,
                vdeptid: row.deptid,
                partitiondate: row.partitiondate,
                taskId: row.id,
                checkTypeID: row.checkTypeID
            }
            this.$nextTick(() => {
                this.hackReset = true//重建组件
            })
            this.$api.pigeohole.findJobContentByGdAttarch(obj).then(res => {
                if (res.data.data.list.length == 0) {
                    this.lengtharr = '0'
                    this.lzyobj = res.data.data
                    this.rows = row
                    this.archiveData = res.data.data.list
                    this.renwu = row.taskCode
                    if (this.permissionss == 2 || this.permissionss == 3) {
                        if (this.permissionss == 3) {
                            this.dialogFileConfirm = true
                            this.bysdj = '2'
                            this.hackResets = true //重建组件 既是计划员又是计划员  显示上传
                        } else {
                            this.dialogFileConfirm = true //归档确认 报告归档页面
                            this.hackReset = true //重建组件
                        }
                    } else if (this.permissionss == 1) {
                        this.Archivedialog = true
                        this.bysdj = '1'
                        this.hackResets = true//重建组件 我的报告页面
                    } else {
                        this.$message({type: 'error', message: '没有权限', duration: 1500})
                    }
                } else {
                    this.lengtharr = '1'
                    this.lzyobj = res.data.data
                    this.rows = row
                    this.archiveData = res.data.data.list
                    this.renwu = row.taskCode
                    if (this.permissionss == 2 || this.permissionss == 3) {
                        if (this.permissionss == 3) {
                            this.dialogFileConfirm = true
                            this.bysdj = '2'
                            this.hackResets = true//重建组件 既是计划员又是计划员  显示上传
                        } else {
                            this.dialogFileConfirm = true//归档确认 报告归档页面
                            this.hackReset = true//重建组件
                        }
                    } else if (this.permissionss == 1) {
                        this.Archivedialog = true
                        this.bysdj = '1'
                        this.hackResets = true//重建组件 我的报告页面
                    } else {
                        this.$message({type: 'error', message: '没有权限', duration: 1500})
                    }
                }
                //         this.rows = row
                //         this.tableData2 = res.data.data.list;
                //         this.renwu = row.taskCode
                //         console.log(this.permissionss)
                //         if(this.permissionss == 2 || this.permissionss == 3){
                //             if( this.permissionss == 3){
                //                 this.dialogFileConfirm = true;
                //                 this.bysdj = '2'
                //                 this.hackResets = true;//重建组件 既是计划员又是计划员  显示上传
                //             }else{
                //                 this.dialogFileConfirm = true//归档确认 报告归档页面
                //                 this.hackReset = true;//重建组件
                //             }
                //         }else if(this.permissionss == 1){
                //             this.Archivedialog = true;
                //             this.bysdj = '1'
                //             this.hackResets = true;//重建组件 我的报告页面
                //         }else{
                //             this.$message({type: 'error', message: "没有权限",duration: 1500})
                //         }
            }).catch(err => {
                console.log(err, 'error')
            })

        },
        // 回车查询
        onPressEnter (e) {
            let keyCode = window.event ? e.keyCode : e.which;
            if (keyCode == 13) {
                this.onSubmit(1, 10);
            }
        },
        // 上传
        handleRemove (file, fileList) {
            console.log(file, fileList)
        },
        handlePreview (file) {
            console.log(file)
        },
        // 返回值1
        select1 (data) {
            // console.log(data)
            this.wttype = data
            let obj = {
            formaction: this.formaction,
            wttype: this.wttype,
            taskCode: this.sizeForm.starttask,  //开始任务号
            taskCode2: this.sizeForm.endtask,   //结束任务号
            checkYear: this.sizeForm.application_number, //申请编号
            itemscode: this.sizeForm.report, //报告号
            searchdate2: this.sizeForm.one_starttask,//下达日期2
            searchdate3: this.sizeForm.two_endtask,//下达日期3
            itemsItemIssuanceDate1: this.sizeForm.one_startissue,//签发日期1
            itemsItemIssuanceDate2: this.sizeForm.two_endissue,//签发日期2
            attarchDateStart: this.sizeForm.one_startfile,//归档日期
            attarchDateEnd: this.sizeForm.two_startfile,//归档日期1
            completeDateStart: this.sizeForm.one_startreadiness, //齐全日期
            completeDateEnd: this.sizeForm.two_endtreadiness, //齐全日期2
            searchdate: this.sizeForm.year, //年份
            master: this.sizeForm.zjian, //主检
            task_status: this.sizeForm.type, //类别
            deptid: this.sizeForm.inspection_type, //类型
            companyCheck: this.sizeForm.companyCheck, //受检单位
            sampleName: this.sizeForm.sampleName, //样品名称
            sampleType: this.sizeForm.sampleType, //规格型号
            docStatus: this.sizeForm.status, //归档状态
            }
            // console.log(obj);
            this.$api.pigeohole.archivingRate(obj).then(res => {
            this.tableData4 = res.data.data.tinfo.list
            this.tableData5 = res.data.data.tinfo
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

            }
            this.tableData4.push(ar)
            })
        },
        //返回值2
        select2 (data) {
            // console.log(data);
            this.formaction = data
            let obj = {
            formaction: this.formaction,
            wttype: this.wttype,
            taskCode: this.sizeForm.starttask,  //开始任务号
            taskCode2: this.sizeForm.endtask,   //结束任务号
            checkYear: this.sizeForm.application_number, //申请编号
            itemscode: this.sizeForm.report, //报告号
            searchdate2: this.sizeForm.one_starttask,//下达日期2
            searchdate3: this.sizeForm.two_endtask,//下达日期3
            itemsItemIssuanceDate1: this.sizeForm.one_startissue,//签发日期1
            itemsItemIssuanceDate2: this.sizeForm.two_endissue,//签发日期2
            attarchDateStart: this.sizeForm.one_startfile,//归档日期
            attarchDateEnd: this.sizeForm.two_startfile,//归档日期1
            completeDateStart: this.sizeForm.one_startreadiness, //齐全日期
            completeDateEnd: this.sizeForm.two_endtreadiness, //齐全日期2
            searchdate: this.sizeForm.year, //年份
            master: this.sizeForm.zjian, //主检
            task_status: this.sizeForm.type, //类别
            deptid: this.sizeForm.inspection_type, //类型
            companyCheck: this.sizeForm.companyCheck, //受检单位
            sampleName: this.sizeForm.sampleName, //样品名称
            sampleType: this.sizeForm.sampleType, //规格型号
            docStatus: this.sizeForm.status, //归档状态
            }
            this.$api.pigeohole.archivingRate(obj).then(res => {
            this.tableData4 = res.data.data.tinfo.list
            this.tableData4.forEach((item, index) => {
                item.iop = index
            })
            //console.log(this.tableData4)
            this.tableData5 = res.data.data.tinfo
            if (this.tableData4 == []) {
                this.tableData4 = []
            } else {
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
                }
                this.tableData4.push(ar)
            }
            console.log(this.tableData4)
            })
        },
        //选中
        dataSelect (val) {
            this.multipleSelection = val
            this.multipleSelections = []
            val.map(item => {
            this.multipleSelections.push(item.id + ':' + item.itemsCode)
            })
            this.str = this.multipleSelections.join(',')
            // console.log(this.str);
            // console.log(this.multipleSelection);
        },
        //类型
        typebie () {
            let obj = {
            org_name: '全部',
            id: ''
            }
            let bie = []
            let bies = []
            this.$api.pigeohole.getReportBaseInformation().then(res => {
            bies = res.data.data.dept.list
            bie.push(obj)
            this.types = bie.concat(bies)
            })
            this.$api.taskmanage.power().then(res => {
            this.permissionss = res.data.data
            })
        },
        //点击查询
        onSubmit (currentPage, pageSize) {
            this.loading = true
            this.currentPage = currentPage
            this.pageSize = pageSize
            let obj = {
                taskCode: this.sizeForm.starttask,  //开始任务号
                taskCode2: this.sizeForm.endtask,   //结束任务号
                checkYear: this.sizeForm.application_number, //申请编号
                itemscode: this.sizeForm.report, //报告号
                searchdate2: this.sizeForm.one_starttask,//下达日期2
                searchdate3: this.sizeForm.two_endtask,//下达日期3
                itemsItemIssuanceDate1: this.sizeForm.one_startissue,//签发日期1
                itemsItemIssuanceDate2: this.sizeForm.two_endissue,//签发日期2
                attarchDateStart: this.sizeForm.one_startfile,//归档日期
                attarchDateEnd: this.sizeForm.two_startfile,//归档日期1
                completeDateStart: this.sizeForm.one_startreadiness, //齐全日期
                completeDateEnd: this.sizeForm.two_endtreadiness, //齐全日期2
                searchdate: this.sizeForm.year, //年份
                master: this.sizeForm.zjian, //主检
                task_status: this.sizeForm.type, //类别
                deptid: this.sizeForm.inspection_type, //类型
                companyCheck: this.sizeForm.companyCheck, //受检单位
                sampleName: this.sizeForm.sampleName, //样品名称
                sampleType: this.sizeForm.sampleType, //规格型号
                docStatus: this.sizeForm.status, //归档状态
                currentPage: currentPage,
                pageSize: pageSize,
                moduleCode: 1
            }
            this.$api.pigeohole.attarch(obj).then(res => {
                // console.log(res);
                this.tableData = res.data.data.tinfo.list
                if (res.data.respCode == '0') {
                    this.loading = false
                }
                if (this.tableData.length > 0) {
                    this.tableData.map(item => {
                    this.total = item.total
                    })
                } else {
                    this.total = 0
                }
            }).catch(error => {
                this.$message.error(error.data.message)
            })

        },
        //点击归档率
        archiving () {
            this.dialogBinding = true
            let objs = {
            typeName: '全部',
            typeABC: '',
            id: 0
            }
            let fi = []
            let ff = []
            this.$api.pigeohole.findCheckType().then(res => {
            // console.log(res.data.data);
            fi = res.data.data
            ff.push(objs)
            this.finds = ff.concat(fi)
            })
            let obj = {
            formaction: this.formaction,
            wttype: this.wttype,
            taskCode: this.sizeForm.starttask,  //开始任务号
            taskCode2: this.sizeForm.endtask,   //结束任务号
            checkYear: this.sizeForm.application_number, //申请编号
            itemscode: this.sizeForm.report, //报告号
            searchdate2: this.sizeForm.one_starttask,//下达日期2
            searchdate3: this.sizeForm.two_endtask,//下达日期3
            itemsItemIssuanceDate1: this.sizeForm.one_startissue,//签发日期1
            itemsItemIssuanceDate2: this.sizeForm.two_endissue,//签发日期2
            attarchDateStart: this.sizeForm.one_startfile,//归档日期
            attarchDateEnd: this.sizeForm.two_startfile,//归档日期1
            completeDateStart: this.sizeForm.one_startreadiness, //齐全日期
            completeDateEnd: this.sizeForm.two_endtreadiness, //齐全日期2
            searchdate: this.sizeForm.year, //年份
            master: this.sizeForm.zjian, //主检
            task_status: this.sizeForm.type, //类别
            deptid: this.sizeForm.inspection_type, //类型
            companyCheck: this.sizeForm.companyCheck, //受检单位
            sampleName: this.sizeForm.sampleName, //样品名称
            sampleType: this.sizeForm.sampleType, //规格型号
            docStatus: this.sizeForm.status, //归档状态
            }
            this.$api.pigeohole.archivingRate(obj).then(res => {
            this.tableData4 = res.data.data.tinfo.list

            this.tableData5 = res.data.data.tinfo
            // console.log(this.tableData5);
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
            }
            this.tableData4.push(ar)
            })
        },
        //下载word
        onClickXgdReport () {
            this.dialogdata('0')
        },
        //下载PDF
        onClickfallback () {
            this.dialogdata('1')
        },
        dialogdata (url) {
            if (this.multipleSelection.length == 0) {
            this.$message({
                type: 'waring',
                message: '请选择至少一条数据',
                duration: 1500
            })
            } else {
            var arrIDITE = []
            this.multipleSelection.forEach(item => {
                arrIDITE.push(`${item.id}:${item.itemsCode}`)

            })
            //   arrIDITE.join("");
            let sts = '"' + this.str + '"'
            this.$api.myReport.uploadWordTo(arrIDITE).then(res => {
                if (res.data.data == '0') {
                this.$confirm('确认要下载吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var obj = document.getElementById('WO3Word2')
                    try {
                    obj.setExecuteaction(url)
                    obj.setDownType(0)
                    obj.setServerIP(`${base.baseImgUrl}`)
                    obj.setIds(arrIDITE)
                    obj.downStart()
                    } catch (error) {
                    if (confirm('您确认没有安装Word控件吗? 点确定您将下载setup.zip 解压后运行setup.exe即可')) {
                        window.open(base.baseImgUrl + '/api/file/resources/donet/setup.zip')
                    }
                    }
                }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '插件异常,已取消下载',
                    duration: 1500
                    })
                })
                } else {
                this.$message({
                    type: 'info',
                    message: '报告正在处理中',
                    duration: 1500
                })
                }
            })
            }
        },
        // 点击浏览
        toogleExpand (row) {
            let obj = {
            docStatus: this.sizeForm.status,
            task_status: row.task_status,
            vdeptid: row.deptid,
            partitiondate: row.partitiondate,
            taskId: row.id,
            checkTypeID: row.checkTypeID,
            process_instance_id: 7
            }
            this.$api.pigeohole.findJobContentByAttarch(obj).then(res => {
            this.tableData2 = res.data.data.list
            let content
            this.tableData2.map(item => {
                if (item.cvItemsCode != null && item.cvItemsCode.length == 10) {
                content = item.cvItemsCode + '(' + item.itemsCode + ')'
                } else {
                content = item.itemsCode
                }
            })
            $table.toggleRowExpansion(row)
            })
            this.tableData2.map(item => {
            this.doc = item.docStatus

            })
            let $table = this.$refs.table
            this.tableData.map((item) => {
            if (row.id != item.id) {
                $table.toggleRowExpansion(item, false)
            }
            })
        },
        clickFindWorkLog (row) { // 第二个弹出层
            let inspectid = row.id
            var that = this
            this.$api.pigeohole.findWorkLog(inspectid).then(res => {
            that.tableData3 = res.data.data
            $table2.toggleRowExpansion(row)
            })
            // console.log(this.tableData3);
            let $table2 = this.$refs.Table2
            this.tableData2.map((item) => {
            if (row.id != item.id) {
                $table2.toggleRowExpansion(item, false)
            }
            })
        },
        //点击快查
        showGoRead (row) {
            //WT191627
            this.initialState = true
            this.tableDataImg = []
            this.imgCountPage = ''
            var rowItemCode = {itemsCode: row.itemsCode}
            var rowRow = []
            rowRow.push(rowItemCode)
            this.number = rowRow
            this.uploadIdList = [row]
            this.productValue = this.number[0].id
            this.$api.myReport.quicklyQuickly(row.id).then(res => {
            var floder = res.data.data.floder,
                pagecount = res.data.data.pagecount,
                imgDataId = res.data.data.id
            this.imgCountPage = pagecount ? pagecount.toString() : '0'
            if (floder == null || pagecount == null || imgDataId == null) {
                this.$message({type: 'info', message: '暂无生成', duration: 1500})
            } else {
                if (pagecount > 0) {
                for (var imgIndexImg = 1; imgIndexImg <= pagecount; imgIndexImg++) {
                    var objImg = {
                    v: imgIndexImg,
                    url: `${base.baseImgUrl}docs/gif/${floder}/${imgDataId}_${imgIndexImg}.jpg`
                    }
                    this.tableDataImg.push(objImg)
                }
                }
                if (this.imgCountPage < 1 || this.tableDataImg == []) {
                this.$message({type: 'error', message: `${row.itemsCode}暂未生成快查`, duration: 1500})
                return false
                } else {
                this.dialogQuickly = true
                }
            }
            }).catch(err => {
            this.$message({type: 'error', message: '查看失败', duration: 1500})
            })

        },
        //点击下一份报告
        nextReportBtn (data) {
            if (this.number.length == 1) {
            this.$message({type: 'info', message: '当前只有一份报告', duration: 1500})
            } else {
            if (this.indexValueId < this.number.length - 1) {
                let indexValueId = this.indexValueId + 1
                this.number.forEach((val, index) => {
                if (indexValueId === index) {
                    this.productValue = val.id
                }
                this.indexValueId = indexValueId
                })
            } else {
                this.productValue = this.number[0].id
                this.indexValueId = 0
            }
            this.reportQuickt(this.productValue)
            }

        },
        // 快查对话框关闭事件
        handleDialogQuickly () {
            this.initialState = false
            this.dialogQuickly = false
            this.imgCountPage = ''
            this.tableDataImg = []
            this.indexValueId = 0
            if (this.multipleSelection.length > 0) {
            this.productValue = this.multipleSelection[0].id
            }
        },
        //选择报告编号
        selectproductValue (data) {
            this.productValue = data
            this.number.forEach((val, index) => {
            if (this.productValue === val.id) {
                this.indexValueId = index
            }
            })
            this.reportQuickt(this.productValue)
        },
        //快查接口封装
        reportQuickt (idId) {
            this.imgCountPage = ''
            this.tableDataImg = []
            this.$api.myReport.quicklyQuickly(idId).then(res => {
            var floder = res.data.data.floder,
                pagecount = res.data.data.pagecount,
                imgDataId = res.data.data.id
            this.imgCountPage = pagecount ? pagecount.toString() : '0'
            if (floder == null || pagecount == null || imgDataId == null) {
                this.$message({type: 'info', message: '暂无生成', duration: 1500})
            }
            if (pagecount > 0) {
                for (var imgIndexImg = 1; imgIndexImg <= pagecount; imgIndexImg++) {
                var objImg = {
                    v: imgIndexImg,
                    url: `${base.baseImgUrl}docs/gif/${floder}/${imgDataId}_${imgIndexImg}.jpg`
                }
                this.tableDataImg.push(objImg)
                }
            }
            }).catch(err => {
            this.$message({type: 'error', message: '查看失败', duration: 1500})
            })
        },
        handleSizeChange (val) {
            this.pageSize = val
            this.onSubmit(this.currentPage, this.pageSize)
        },
        handleCurrentChange (val) {
            this.currentPage = val
            this.onSubmit(this.currentPage, this.pageSize)
        },
    }
}
</script>
<style lang="scss" scoped>
.active {
    color: green;
}

.actives {
    color: red;
}

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

.pigeonhole_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}

/deep/ .pigeonhole_con {
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
            margin: 0 !important;
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

// 归档
/deep/ .lzylist {
    width: 100%;
    height: 100%;
    padding: 100px 0;
    overflow: hidden;
}

/deep/ .lzylist .el-dialog {
    height: 100% !important;
    overflow: hidden !important;
    margin: 0 auto !important;
    display: flex;
    flex-direction: column;
}

/deep/ .lzylist .el-dialog .el-dialog__body {
    flex: 1 !important;
    overflow: hidden !important;
}

/deep/ .lzylist .el-dialog .el-dialog__body .bottom {
    height: 100% !important;
    overflow: hidden !important;
}

/deep/ .lzylist .el-dialog .el-dialog__body .bottom .archiverate_box {
    height: 100% !important;
    overflow: hidden !important;
    display: flex;
    flex-direction: column;
}

/deep/ .lzylist .el-dialog .el-dialog__body .bottom .roughly_tabel {
    flex: 1;
    overflow-y: auto;
}


// 快查
.dialog_quickly {
    overflow: hidden;
    padding: 50px 0;
}

/deep/ .dialog_quickly .el-dialog {
    height: 100% !important;
    margin: 0 auto !important;
    overflow: hidden !important;
    display: flex;
    flex-direction: column;
}

/deep/ .dialog_quickly .el-dialog .el-dialog__body {
    flex: 1 !important;
    overflow: hidden !important;
    padding: 20px;
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
</style>
