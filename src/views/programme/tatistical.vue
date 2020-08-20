<template>
    <!-- 中机 - 统计表 -->
    <div class="tatistical_border" v-loading.fullscreen="fullScreenLoading" element-loading-text="加载中...">
        <div class="tatistical_con">
            <!-- 查询 -->
            <div class="query_modular">
                <div class="query_complex">
                    <el-form :inline="true" :model="searchData" label-width="120px" class="query_form"
                        @keyup.enter.native="searchEnterFun">
                        <el-form-item label="企业名称：">
                            <el-input v-model="searchData.entName" clearable name="clearInputValue" autocomplete="off"
                                :autofocus="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="产品型号：">
                            <el-input v-model="searchData.model" clearable name="clearInputValue" autocomplete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="产品名称：">
                            <el-input v-model="searchData.name" clearable name="clearInputValue" autocomplete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="产品商标：">
                            <el-input v-model="searchData.brand" clearable name="clearInputValue" autocomplete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="方案状态：" v-show="showState">
                            <el-select v-model="searchData.status">
                                <el-option value="5" label="已下达 - 待上传" title="已下达 - 待上传"></el-option>
                                <el-option value="6" label="已上传" title="已上传"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="产品类型：" v-show="showState">
                            <el-select v-model="searchData.proType">
                                <el-option value="" label="全部"></el-option>
                                <el-option value="new" label="新产品" title="新产品"></el-option>
                                <el-option value="gzkz" label="扩展" title="扩展"></el-option>
                                <el-option value="C" label="整车整改" title="整车整改"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="接受日期>=" v-show="showState">
                            <el-date-picker
                                v-model="searchData.days3"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyyMMdd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="接受日期<="  v-show="showState">
                            <el-date-picker
                                v-model="searchData.days"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyyMMdd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="齐全：" v-show="showState">
                            <el-select v-model="searchData.qibj">
                                <el-option value="-1" label="全部"></el-option>
                                <el-option value="0" label="非齐全"></el-option>
                                <el-option value="1" label="齐全"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="任务号：" v-show="showState">
                            <el-input v-model="searchData.taskcode" clearable name="clearInputValue" autocomplete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="任务说明：" v-show="showState">
                            <el-input v-model="searchData.taskExplain" clearable name="clearInputValue" autocomplete="off">
                            </el-input>
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
                        <el-button type="primary" @click="handleSearchData(searchData,1,10)">查询</el-button>
                        <!-- <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button> -->
                    </p>
                </div>
            </div>

            <!-- 表格与分页 -->
            <div class="tablePagination_modular">
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table stripe border :data="tableData"
                        ref="TableStatistical"
                        :header-cell-style="{
                            'background-color': 'rgb(243,246,253)',
                            'color': '#606266',}">
                        <el-table-column header-align="center" align="center" :resizable="false" :show-overflow-tooltip="true"
                            prop="taskcode" label="任务号"
                            :formatter="function(row, column, cellValue, index) {
                                return cellValue ? cellValue : '暂无'
                            }">
                        </el-table-column>
                        <el-table-column header-align="center" align="center" :resizable="false" :show-overflow-tooltip="true"
                            prop="entName" label="企业名称">
                        </el-table-column>
                        <el-table-column header-align="center" align="center" :resizable="false" :show-overflow-tooltip="true"
                            prop="model" label="产品型号">
                        </el-table-column>
                        <el-table-column header-align="center" align="center" :resizable="false" :show-overflow-tooltip="true"
                            prop="name" label="产品名称">
                        </el-table-column>
                        <el-table-column header-align="center" align="center" :resizable="false" :show-overflow-tooltip="true"
                            prop="brand" label="产品商标">
                        </el-table-column>
                        <el-table-column header-align="center" align="center" :resizable="false" :show-overflow-tooltip="true"
                            prop="" label="产品类别">
                            <template slot-scope="scope">
                                {{scope.row | filterProType}}
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" :resizable="false" :show-overflow-tooltip="true"
                            prop="" label="状态">
                            <template slot-scope="scope">
                                {{scope.row | filterStatus}}
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" :resizable="false" :show-overflow-tooltip="true"
                            prop="changeTime" label="接受日期">
                        </el-table-column>
                        <el-table-column header-align="center" align="center" :resizable="false" :show-overflow-tooltip="true"
                            prop="" label="企业统计表">
                            <template slot-scope="props">
                                <span v-if="props.row.filePath == null || props.row.filePath == ''">未上传</span>
                                <span v-else style="color: #67C23A">已上传</span>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" :resizable="false" :show-overflow-tooltip="true"
                            prop="" label="操作">
                            <template slot-scope="props">
                                <p class="btns-in-row">
                                    <span @click="rowBrowse(props.row)" v-if="props.row.taskid != null">浏览</span>
                                    <span @click="rowBrowse(props.row, props.row.taskidzd)"
                                            v-if="(props.row.taskidzd) && (props.row.taskidzd.length > 0)">浏览ZD</span>
                                    <!---->
                                    <span @click="openDetailed(props.row)">详细</span>
                                    <span @click="newWindowUpload(props.row)">上传</span>
                                    <!---->
                                    <span style="color: red;cursor: default;" v-show="props.row.qibj == 0">非</span>
                                    <span style="color: blue;cursor: default;" v-show="props.row.qibj == 1">齐</span>
                                </p>
                            </template>
                        </el-table-column>

                        <!-- 表格隐藏域 -->
                        <el-table-column :resizable="false" type="expand" width="1">
                            <template slot-scope="props">
                                <p>
                                    <el-button type="primary" @click="downloadPDF">下载PDF</el-button>
                                    <el-button type="primary"
                                        @click="cancelUpload({
                                            'taskid': props.row.taskid,
                                            'sign': 1,
                                            'partitiondate': props.row.partitiondate,
                                            'spage': 5
                                        })">
                                        取消待上传中机
                                    </el-button>
                                    <!--<el-button type="danger" @click="goQuickView(props.row)">快查</el-button>&lt;!&ndash; 原先jsp的逻辑 &ndash;&gt;-->
                                    <el-button type="danger" @click="onSubmitQuick(props.row)">快查</el-button>
                                    <span>共计<b style="color: red;">{{tableData2.length}}</b>个检验项目</span>
                                </p>
                                <el-table border
                                    :data="tableData2" v-loading="loading_in_Table2"
                                    ref="TableStatistical_two"
                                    row-class-name="hover-no-bgcolor"
                                    :header-cell-style="{
                                        backgroundColor: 'rgb(243,246,253)',
                                        color: '#606266',
                                    }"
                                    :row-style="hiddenTable_row_style"
                                    @selection-change="selectionChange">
                                    <el-table-column header-align="center" align="center"
                                        :show-overflow-tooltip="true" :resizable="false"
                                        type="selection">
                                    </el-table-column>
                                    <el-table-column header-align="center" align="center"
                                        :show-overflow-tooltip="true" :resizable="false" width="50"
                                        prop="" label="序号"
                                        type="index">
                                    </el-table-column>
                                    <el-table-column header-align="center" align="center"
                                        :show-overflow-tooltip="true" :resizable="false"
                                        prop="" label="报告编号">
                                        <template slot-scope="props">
                                            <ul style="display: flex;align-items: center;justify-content: center;">
                                                <li>{{props.row.itemsCode}}</li>
                                                <li>
                                                <i class="el-icon-document"
                                                    style="font-size: 18px;margin: 0 5px;line-height:23px;cursor: pointer;"
                                                    title="查看文档"
                                                    @click="browseDocument(props.row)"></i>
                                                </li>
                                            </ul>
                                            <ul style="display: flex;align-items: center;justify-content: center;">
                                                <li>({{props.row.master}}&nbsp;&nbsp;{{props.row.procName}})</li>
                                                <!---->
                                                <li v-html="renderCompareResult2(props.row.compareResult2)"></li>
                                            </ul>
                                        </template>
                                    </el-table-column>
                                    <el-table-column header-align="center" align="center"
                                        :show-overflow-tooltip="true" :resizable="false"
                                        prop="itemsName" label="项目名称">
                                    </el-table-column>
                                    <el-table-column header-align="center" align="center"
                                        :show-overflow-tooltip="true" :resizable="false"
                                        prop="zjsign" label="标记状态"
                                        :formatter="formatter_zjsign">
                                    </el-table-column>
                                    <el-table-column header-align="center" align="center"
                                        :show-overflow-tooltip="true" :resizable="false"
                                        prop="" label="当前状态">
                                        <template slot-scope="props">
                                            {{props.row.procName}}
                                            <!---->
                                            <input type="hidden" :name='"inspectId"+props.row.process_instance_id'
                                                    :value="props.row.id"/>
                                            <input type="hidden" :name='"taskStatus"+props.row.process_instance_id'
                                                    :value="props.row.procName"/>
                                        </template>
                                    </el-table-column>
                                </el-table>
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

        <!-- 统计表 - 详细 -->
        <el-dialog title="详细" class="details_dialog"
            :visible.sync="dialogDetailed" :fullscreen="true"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <programmeDetails ref="refsProgrammeDetails" :detailsDataList="myDetailsDataList"></programmeDetails>
        </el-dialog>

        <!-- 统计表 - 快查 -->
        <el-dialog title="快查" width="80%" class="dialog_quickly"
            :visible.sync="dialogQuickReady"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <quickReady @selectproductValue="selectproductValue" @nextReportBtn="nextReportBtn"
                :indexValueId="indexValueId" :percentage="percentage" :productValue="productValue"
                :initialState="initialState" :tableDataImg="tableDataImg" :numberData="number"
                :imgCountPage="imgCountPage" :uploadIdList="uploadIdList">
            </quickReady>
        </el-dialog>

        <object style="display:block;width: 0;height: 0;" id="WO3Word2"
            classid="clsid:561C5A99-71C8-48d4-A3E2-16FC4F9880BF">
        </object>

        <object style="display:block;width: 0;height: 0;" id="STATICTABLE"
            classid="clsid:0B846D4B-EB6C-4a15-A415-FF0785D39320">
        </object>
    </div>
</template>

<script>
import base from "@/api/base.js";
import programmeDetails from '@/components/Programmedetails.vue';
import quickReady from '@/components/Quiickready';
export default {
    name: 'programmetatistical',
    components: { programmeDetails, quickReady },
    watch: {
        searchData: {
            handler(value, oldValue) {
            },
            deep: true
        }
    },
    data() {
        return {
            showbut: 0, // 展开/收起-状态
            showState: false, // 查询框显示状态
            currentPage: 1,
            pageSize: 10,
            total: 0,
            tableData: [],
            tableData2: [],
            dialogDetailed: false,// 详细 - 对话框开关
            dialogQuickReady: false,// 快查 - 对话框开关
            stopSearch: false,// 阻断查询事件的开关

            /* 条件查询的数据 */
            searchData: {
                entName: '',// 企业名称
                model: '',// 产品型号
                name: '',// 产品名称
                brand: '',// 产品商标
                status: '',// 方案状态
                proType: '',// 产品类型
                days3: '',// 接受日期 开始
                days: '',// 接受日期 结束
                qibj: '-1',// 齐全
                taskcode: '',// 任务号
                taskExplain: '',// 任务说明
            },
            /* 分页器发请求时所需要的上一次的查询条件(通过点击或回车触发的请求时所用到的查询条件) */
            pageSearchData: {},

            /* 查询内容展示表格加载中 */
            loading_in_Table1: false,
            /* 隐藏域表格 - 加载中 */
            loading_in_Table2: false,
            /* 隐藏域表格 - 选中的数据 */
            selection: [],
            /* 当前展开的表格的行数据 */
            currentRow: {},
            /* 详细弹窗 - 数据加载中 */
            fullScreenLoading: false,
            /* 详细弹窗内传递的数据 */
            myDetailsDataList: {},

            // 快查的参数:
            percentage: [ /* 快查选择百分比 */
                {value: '0', label: '40%'},
                {value: '1', label: '70%'},
                {value: '2', label: '90%'},
                {value: '3', label: '100%'},
                {value: '4', label: '130%'},
                {value: '5', label: '150%'}
            ],
            indexValueId: 0, // 快查
            productValue: '', /* 快查我的报告编号 */
            initialState: false, // 快查
            tableDataImg: [], /* 快查图片数组 */
            number: [], /* 快查下拉框 */
            imgCountPage: '', /* 快查图片页数 */
            uploadIdList: [], // 上传中机-快查id
        }
    },
    computed: {
        userName() {
            let loginName = window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).loginName : ''
            if (!loginName) {
                this.$api.lxtinitial.uid().then(res => {
                    loginName = res.data.data.loginName
                }).catch(res => {
                    this.$alert(res.data.message, '信息提示', {
                        dangerouslyUseHTMLString: true
                    });
                    loginName = '';
                });
            }
            return loginName;
        },
    },
    filters: {
        filterProType(value) {
            if (value.proType == 'new') {
                return '新产品'
            } else {
                if (value.zgsign == 1) {
                    return '整车整改'
                } else {
                    return '扩展'
                }
            }
        },
        filterStatus(value) {
            if (value.status == 1) {
                return '已提交'
            }
            if (value.status == 2) {
                return '已下达'
            }
            if (value.status == 3) {
                return '以上传'
            }
        },
    },
    created() {},
    mounted() {
        this.handleSearchData(this.searchData,1,10);
    },
    methods: {
        // 点击收起/展开
        clickshowbut(num) {
            this.showbut = num;
            this.showState = !this.showState;
        },
        /*
        * 功能: 加工隐藏表格的 compareResult2
        * */
        renderCompareResult2(value) {
            switch (value) {
            case 0:
                return `<span>中机</span>`;
                break;
            case 1:
                return `<span style="color: blue;">已比</span>`;
                break;
            case 2:
                return `<span style="color: red;">差异</span>`;
                break;
            case 4:
                return `<span>待处理</span>`;
                break;
            default:
                return '';
            }
        },

        /*
        * 功能: 条件查询
        * */
        handleSearchData(data,currentPage,pageSize) {
            let params = data;
            params.currentPage = currentPage;
            params.pageSize = pageSize;
            this.pageSearchData = params;
            this.loading_in_Table1 = true;
            this.$api.tatistical.findReport(params).then(res => {
            if (res.data.ok && res.data.data.list && res.data.data.list.length) {
                this.tableData = res.data.data.list;
                this.total = res.data.data.total;
                this.currentPage = currentPage;
                this.pageSize = pageSize;
                this.stopSearch = true;
            } else {
                this.$message.warning({
                message: '未检索到符合条件的数据',
                duration: 2500
                });
                this.tableData = [];
                this.resetPage();
                this.stopSearch = false;
            }
            }).catch(err => {
            this.$message.error({
                message: err.data.message,
                duration: 2500
            });
            this.resetPage();
            }).then(() => {
            this.loading_in_Table1 = false;
            });
        },

        /*
        * 功能: 回车触发查询
        * */
        searchEnterFun(e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode == 13) {
                this.handleSearchData(this.searchData,this.currentPage,this.pageSize);
            }
        },

        /*
        * 功能: 浏览行内数据
        * @params:
        * *** row: 这一行的数据
        * *** taskidzd: 这一行的数据中的 taskidzd 字段(只在触发ZD起效)
        * */
        rowBrowse(row, taskidzd) {
            let table_Ele = this.$refs.TableStatistical;
            if (this.currentRow.id == row.id) {
                table_Ele.toggleRowExpansion(row, false);
                this.currentRow = {};
                return
            }
            this.currentRow = {...row};
            this.hiddenRow();
            table_Ele.toggleRowExpansion(row);

            this.loading_in_Table2 = true;
            let params = {
                "taskId": taskidzd ? taskidzd : row.taskid,
                "searchdate": row.partitiondate,
                "detctsign": "",
                "docStatus": "",
                "task_status": "",
                "zjsign": "",
                "muster": "",
            };
            this.$api.tatistical.reportDetails(params).then(res => {
                this.loading_in_Table2 = false;
                if (res.data.data && res.data.data.length > 0 ) {
                    this.tableData2 = res.data.data;
                } else {
                    this.tableData2 = [];
                    this.$message.warning('暂无数据');
                }
            }).catch(err => {
                if(err.data.message) {
                    this.$message.error(err.data.message);
                } else {
                    this.$message.error('暂无数据');
                }
            })
        },

        /*
        * 功能: 合上所有隐藏域
        * */
        hiddenRow() {
            let table_Ele = this.$refs.TableStatistical;
            this.tableData.forEach((item, index) => {
            table_Ele.toggleRowExpansion(item, false);
            });
            this.tableData2 = [];
        },

        /*
        * 功能: 获取表格中选中的数据
        * */
        selectionChange(value) {
            this.selection = value;
        },

        /*
        * 功能: 下载PDF
        * */
        downloadPDF() {
            let params = this.selection.map((item, index) => {
            return item.id + ':' + item.itemsCode
            });
            if (params.length == 0) {
            this.$alert('请至少选择一条数据', '提示');
            return
            }
            this.$api.tatistical.pdfDownload({
            inspectId: params.toString()
            }).then(res => {
            if (res.data.ok) {
                if (res.data.data == "0") {
                try {
                    var obj = document.getElementById("WO3Word2");
                    obj.setExecuteaction("1");
                    obj.setServerIP(base.baseImgTable);
                    obj.setIds(params.toString());
                    obj.downStart();
                } catch (e) {
                    console.log(e);
                }
                } else {
                this.$alert("报告正在处理中", "提示");
                }
            }
            }).catch(err => {
            console.log(err, 'error');
            this.$message.error({
                message: err.data.message,
                duration: 2000
            })
            })
        },

        /*
        * 功能: 取消待上传 - 中机
        * */
        cancelUpload(data) {
            let params = this.selection.map((item, index) => {
            return item.id + ':' + item.itemsCode
            });
            if (params.length == 0) {
            this.$alert('请至少选择一条数据', '提示');
            return
            }
            this.$api.tatistical.goUploadSig({
            "inspectId": params.toString(),
            "searchdate": data.partitiondate,
            "sign": data.sign,
            "spage": data.spage
            }).then(res => {
            if (res.data.ok) {
                this.$message.success({
                message: res.data.data,
                duration: 2500
                })
            } else {
                this.$message.warning({
                message: res.data.data,
                duration: 2500
                })
            }
            }).catch(err => {
            console.log(err, 'error');
            this.$message.error({
                message: err.data.message,
                duration: 2500
            })
            })
        },

        /*
        * 功能: 快查(原jsp逻辑)
        * */
        goQuickView(row) {
            let itemcodes = [], inspectid = [];
            let params = this.selection.map((item, index) => {
            itemcodes.push(item.id);
            inspectid.push(item.itemsCode);
            return item.id + ':' + item.itemsCode
            });
            if (params.length == 0) {
            this.$alert('请至少选择一个检验项目数据', '提示');
            return
            }
            this.fullScreenLoading = true;
            this.$api.tatistical.quickLook({
            inspectid: inspectid.toString(),
            itemcodes: itemcodes.toString(),
            partitiondate: row.partitiondate,
            }).then(res => {
            if (res.data.ok && res.data.data) {

            } else {
                this.$message.warning({
                message: res.data.message,
                duration: 2500
                });
            }
            }).catch(err => {
            this.$message.error({
                message: err.data.message,
                duration: 2500
            });
            }).then(() => {
            this.fullScreenLoading = false;
            this.dialogQuickReady = true;
            })
        },

        /*
        * 功能: 触发详细对话框
        * */
        openDetailed(row) {
            console.log('详细',row);
            this.fullScreenLoading = true;
            let params = {
            d: { id: row.id }
            };
            this.$api.tatistical.detail(params).then(res => {
            if (res.data.ok && res.data.data) {
                this.myDetailsDataList = {...res.data.data};
            } else {
                this.$message.warning({
                message: res.data.message,
                duration: 2500
                });
            }
            }).catch(err => {
            this.$message.error({
                message: err.data.message,
                duration: 2500
            });
            }).then(() => {
            this.fullScreenLoading = false;
            this.dialogDetailed = true;
            });
        },

        /*
        * 功能: 行内触发上传,打开新窗口
        * */
        newWindowUpload(row) {
            window.sessionStorage.removeItem('lzy');
            window.sessionStorage.setItem("zhongjiData", JSON.stringify(row.id));
            window.sessionStorage.setItem("zhongjiTaskid", JSON.stringify(row.taskid));
            let routeData = this.$router.resolve({
            path: "/zhongjiUpload",
            });
            window.open(routeData.href, "_blank");
        },

        /*
        * 功能: 点击 _ 查看文档图标
        * */
        browseDocument(row) {
            let obj = document.getElementById("WO3Word2");
            try {
            // obj.setUid(this.userName);
            obj.setUid(row.loginid);
            obj.setFileId(row.id);
            obj.setReportNo(row.taskid);
            obj.setProcess(row.process_instance_id);
            obj.setRemoteIp(base.baseImgTable);
            obj.ActiveStart();
            } catch (error) {
            if (confirm("您确认没有安装Word控件吗? 点确定您将下载setup.zip 解压后运行setup.exe即可")) {
                window.open(base.baseImgTable + "/api/file/resources/donet/setup.zip");
            }
            }
        },

        /*
        * 功能: 隐藏table,根据行内数据渲染除不同样式
        * */
        hiddenTable_row_style({row, rowIndex}) {
            if (row.zjsign == 0 || row.zjsign == 1 || row.process_instance_id != 7) {
            return {
                'backgroundColor': '#DCBBFD'
            }
            }
        },

        /*
        * 功能: 表格的 标记状态项 _ 内容格式化
        * */
        formatter_zjsign(row, column, cellValue, index) {
            if (cellValue == 0) return '试验员未标记';
            if (cellValue == 1) return '实验员未标记';
            if (cellValue == 2) return '实验员已标记';
            if (cellValue == 3) {
            return '待上传中机';
            } else {
            return cellValue;
            }
        },

        /*
        * 功能: Size改变时触发
        * */
        handleSizeChange(value) {
            this.pageSize = value;
            if (this.stopSearch) this.handleSearchData(this.pageSearchData, this.currentPage, this.pageSize);
        },
        /*
        * 功能: 当前页码改变时触发
        * */
        handleCurrentChange(value) {
            this.currentPage = value;
            if (this.stopSearch) {
            this.handleSearchData(this.pageSearchData, this.currentPage, this.pageSize);
            this.$refs.overflow_table_container.scrollTo(0, 0);
            }
        },
        /*
        * 功能: 重置页码、size
        * */
        resetPage() {
            this.currentPage = 1;
            this.pageSize = 10;
            this.total = 0;
        },

        // 点击全局快查
        onSubmitQuick() {
            this.initialState = true;
            this.indexValueId = 0;
            if (this.selection.length == 0) {
            this.$alert('请先选择报告', '系统提示信息');
            } else {
            this.uploadIdList = this.selection;
            this.productValue = this.selection[0].id;
            this.tableDataImg = [];
            this.imgCountPage = '';

            var itemsCodes = this.selection.map(v => v.itemsCode);
            this.selection.forEach(item => {
                if (itemsCodes.includes(item.itemsCode)) {
                this.number = this.selection
                }
            });
            this.fullScreenLoading = true;
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
                    this.dialogQuickReady = true;
                }
                }
            }).catch(err => {
                this.$message({type: 'error', message: "查看失败", duration: 2500})
            }).then(() => {
                this.fullScreenLoading = false;
            })
            }
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
            // this.dialogQuickReady = false;
            this.imgCountPage = '';
            this.tableDataImg = [];
            this.indexValueId = 0;
            if (this.selection.length > 0) {
            this.productValue = this.selection[0].id;
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

.tatistical_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}

/deep/ .tatistical_con {
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

// 列表-操作按钮样式
.btns-in-row {
    color: #0c79b1;
    span {
        cursor: pointer;
        &:hover {
            color: red !important;
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

// 详情对话框
/deep/ .details_dialog {
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
