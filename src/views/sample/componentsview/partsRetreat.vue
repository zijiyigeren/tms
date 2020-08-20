<template>
    <!-- 零部件-退样列表 -->
    <div class="partsRetreat">
        <div class="partsRetreat_con">
            <!-- 查询 -->
            <div class="query_modular">
                <div class="query_complex">
                    <el-form :inline="true" :model="queryForm" class="query_form" label-width="80px">
                        <el-form-item label="送样人：">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                                placeholder="请输入送样人" v-model.trim="queryForm.contractor">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="送样公司：" >
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                                placeholder="请输入送样公司" v-model.trim="queryForm.comeCompany">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="名称：">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                                placeholder="请输入名称" v-model.trim="queryForm.sampleName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="型号：">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                                placeholder="请输入型号" v-model.trim="queryForm.sampleType">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="退样日期：" v-show="showState">
                            <el-date-picker
                                v-model="tyrqDate"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyyMMdd">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>

                    <!-- 展开/收起 -->
                    <div class="query_show">
                        <el-button v-if="showbut!=0" @click="onClickShow(0)" type="text" class="query_showBtn">
                            收起 <i class="el-icon-arrow-up"></i>
                        </el-button>
                        <el-button v-else-if="showbut==0" @click="onClickShow(1)" type="text" class="query_showBtn">
                            展开 <i class="el-icon-arrow-down"></i>
                        </el-button>
                    </div>
                </div>
                <!-- 查询按钮 -->
                <div class="query_btn">
                    <p>
                        <!-- <el-button type="primary" @click="batchDelete">批量删除</el-button>
                        <el-button type="primary" @click="batchRetreatKind">批量退样</el-button>
                        <el-button type="primary" @click="batchCancelRetreat">批量取消退样</el-button> -->
                    </p>
                    <p>
                        <el-button type="primary" @click="onQuery(1,10)">查询</el-button>
                        <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button>
                    </p>
                </div>
            </div>

            <!-- 表格/分页 -->
            <div class="tablePagination_modular" v-loading="loading" >
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table ref="table" border stripe :data="tableData"
                        :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}"
                        @selection-change="handleSelectionChange">
                        <el-table-column align="center" :resizable="false" width="60" type="selection"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="contractor" label="送样人"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="comeCompany" label="送样公司"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="sampleName" label="名称"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="sampleType" label="型号"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="comeDate" label="到样日期"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="tyrq" label="退样日期"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="typeNumber" label="数量"></el-table-column>
                        <el-table-column align="center" :resizable="false" label="操作" width="260">
                            <template slot-scope="scope">
                                <el-button type="text" @click="onDetailed(scope.row)">详细</el-button>
                                <el-button type="text" @click="onRetreatKind(scope.row)">确认退样</el-button>
                                <el-button type="text" @click="onCancelRetreat(scope.row)">取消退样</el-button>
                                <el-button type="text" @click="onFlowTurn(scope.row)">流转</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                 <!-- 分页 -->
                <el-pagination
                    class="pagination_modular"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    :current-page="current"
                    :page-size="pageSize"
                    :page-sizes="[10,20,30]"
                    @current-change="currentChange"
                    @size-change="pageSizeChange">
                </el-pagination>
            </div>

        </div>

        <!-- 新建/编辑 -->
        <spareparts-edit
            :newEditRow="newEditRow"
            :newEditTitle="newEditTitle"
            :newEditVisible="newEditVisible"
            @newEditClose="onNewEditClose"
        />
        <!-- 流转 -->
        <el-dialog title="零部件-流转" width="80%" class="dialog_flowTurn" 
            :visible.sync="flowTurnVisible" :before-close="flowTurnClose"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <spareflowturn v-bind="{
                'flowTurnVisible': flowTurnVisible,
                'flowTurnRow': flowTurnRow,
            }"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="flowTurnClose">取 消</el-button>
                <el-button type="primary" @click="flowTurnClose">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 退样 -->
        <retreat-kind
            v-bind="{
                'retreatVisible': retreatVisible,
                'retreatKindRow': retreatKindRow,
                'currentDate': currentDate
            }"
            @retreatKindClose="retreatKindClose"
        ></retreat-kind>

    </div>
</template>
<script>
import base from '@/api/base.js';
import sparepartsEdit from '../components/sparepartsEdit'; // 详细
import spareflowturn from '../components/spareFlowTurn'; // 流转
import retreatKind from '../components/partsRetreatKind'; // 退样
export default {
    name: '', // partsRetreat
    components: {sparepartsEdit, spareflowturn, retreatKind},
    props: [],
    watch: {},
    data() {
        return {
            currentDate: '', // 当前日期
            loading: false, // 加载状态
            showbut: 0, // 展开/收起-状态
            showState: false, // 查询框显示状态
            total: 0, // 总数
            current: 1, // 页数
            pageSize: 10, // 条数
            multipleSelection: [], // 表格选中数据
            tableData: [], // 表格数据
            tyrqDate: '', // 退样日期
            queryForm: { // 查询数据
                status: 4, // 状态
                contractor: '', // 送样人
                comeCompany: '', // 送样单位
                sampleName: '', // 名称
                sampleType: '', // 型号
                tyrqStart: '', // 退样日期
                tyrqEnd: '', // 退样日期
            },

            newEditRow: {}, // 新建/编辑-当前数据
            newEditTitle: '', // 新建/编辑-标题
            newEditVisible: false, // 新建/编辑-显示状态

            flowTurnVisible: false, // 流转-显示状态
            flowTurnRow: {}, // 流转-样品数据

            retreatVisible: false, // 退样-显示状态
            retreatKindRow: {}, // 退样-确定零部件数据
        }
    },
    created() {},
    mounted() {
        this.onQuery(1, 10);
        this.getDate(); // 获取当前日期
    },
    methods: {
        // 获取当前日期
        getDate() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            this.currentDate = year + "-" + month + "-" + day;
        },
        // 展开/收起_点击
        onClickShow(val) {
            this.showbut = val
            this.showState = !this.showState
        },
        // 页数
        currentChange(val) {
            this.current = val;
            this.onQuery(this.current, this.pageSize);
        },
        // 条数
        pageSizeChange(val) {
            this.pageSize = val;
            this.onQuery(this.current, this.pageSize);
        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 查询
        onQuery(current, pageSize) {
            this.loading = true;
            let params = this.queryForm;
            params.currentPage = current;
            params.pageSize = pageSize;
            if(this.tyrqDate && Array.isArray(this.tyrqDate)){
                params.tyrqStart = this.tyrqDate[0]; // 退样日期
                params.tyrqEnd = this.tyrqDate[1]; // 退样日期
            }
            this.$api.spareparts.queryData(params).then(res => {
                // console.log(res, '查询数据成功');
                this.loading = false;
                let data = res.data.data;
                if( Array.isArray(data) && data.length > 0 ) {
                    this.tableData = data;
                    if(data[0].total > 0){
                        this.total = data[0].total;
                        this.current = current;
                        this.pageSize = pageSize;
                    }else{
                        this.total = 0;
                        this.current = 1;
                        this.pageSize = 10;
                    }
                } else {
                    this.tableData = [];
                    this.total = 0;
                    this.current = 1;
                    this.pageSize = 10;
                }
            }).catch(error => {
                console.log(error, '查询数据失败');
                this.tableData = [];
                this.loading = false;
                this.total = 0;
                this.current = 1;
                this.pageSize = 10;
            });
        },
        // 回车查询
        enterQuery(e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode == 13) {
                this.onQuery(1, 10);
            }
        },
        // 重置
        onReset() {
            this.onQuery(1, 10);
            this.tyrqDate = ''; // 退样日期
            this.queryForm = { // 查询数据
                status: 4, // 状态
                contractor: '', // 送样人
                comeCompany: '', // 送样单位
                sampleName: '', // 名称
                sampleType: '', // 型号
                tyrqStart: '', // 退样日期
                tyrqEnd: '', // 退样日期
            };
        },
        // 详细
        onDetailed(row) {
            this.newEditRow = row;
            this.newEditTitle = '详细';
            this.newEditVisible = true;
        },
        // 关闭-新建/编辑-对话框
        onNewEditClose(val) {
            this.newEditVisible = false;
            if(val == 0) {
                this.onQuery(1,10);
            }else {
                this.onQuery(this.current,this.pageSize);
            }
        },
        // 流转
        onFlowTurn(row) {
            this.flowTurnVisible = true;
            this.flowTurnRow = row;
        },
        // 流转-关闭
        flowTurnClose() {
            this.flowTurnVisible = false;
            this.flowTurnRow = {};
            this.onQuery(this.current, this.pageSize);
        },
        
        // 退样
        onRetreatKind(row) {
            this.retreatVisible = true;
            this.retreatKindRow = row;
        },
        // 退样-关闭弹框
        retreatKindClose() {
            this.retreatVisible = false;
            this.retreatKindRow = {};
            this.onQuery(this.current, this.pageSize);
        },
        // 取消退样
        onCancelRetreat(row) {
            this.$confirm('确认要取消退样吗？', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.$api.spareparts.cancelCarBack({id: row.id}).then(res => {
                    // console.log(res, '取消退样成功');
                    this.$message.success('取消退样成功！');
                    this.onQuery(this.current, this.pageSize);
                }).catch((error) => {
                    console.log(error, '取消退样失败！');
                    this.$message.error('取消退样失败！');
                    this.onQuery(this.current, this.pageSize);
                });
            }).catch(error => {
                this.$message.info('已取消该操作！');
            });
        },

        // 批量删除
        batchDelete() {
            if(this.multipleSelection.length > 0) {
                this.$confirm('确认要批量删除吗？', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    let idList = '';
                    this.multipleSelection.forEach(item => {
                        idList += item.id + ',';
                    });
                    idList = idList.substring(0, idList.length-1);
                    this.$api.spareparts.batchDelete({idList}).then(res => {
                        // console.log(res, '删除成功res');
                        this.$message.success('批量删除成功！');
                        this.onQuery(1, 10);
                    }).catch((error) => {
                        console.log(error, '删除失败error');
                        this.$message.error(error.data.message);
                        this.onQuery(1, 10);
                    });
                }).catch(error => {
                    this.$message.info('已取消该操作！');
                });
            } else {
                this.$message.warning('请先选择整车信息，再进行该操作！')
            }
            
        },
        // 批量退样
        batchRetreatKind() {
            if(this.multipleSelection.length > 0) {
                this.retreatVisible = true;
                this.retreatFile = [];
                let idList = '';
                this.multipleSelection.forEach(item => {
                    idList += item.id + ',';
                });
                idList = idList.substring(0, idList.length-1);
                this.retreatForm = { // 退样-数据
                    cpartId: '', // id
                    creator: JSON.parse(localStorage.getItem("userInfo")).username, // 当前登录人
                    bk: '', // 备注
                    backdate: this.currentDate, // 退样日期
                    backtype: '未知', // 退样类型
                    filenName: '', // 文件-回显名称
                    filePath: '',  // 文件-回显路径
                    upload: null, // 上传文件
                    idList: idList, // 批量退样
                };
            } else {
                this.$message.warning('请先选择整车信息，再进行该操作！')
            }
        },
        // 批量取消退样
        batchCancelRetreat() {
            if(this.multipleSelection.length > 0) {
                this.$confirm('确认要批量取消退样吗？', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    let idList = '';
                    this.multipleSelection.forEach(item => {
                        idList += item.id + ',';
                    });
                    idList = idList.substring(0, idList.length-1);
                    this.$api.spareparts.batchCancelRetreat({idList}).then(res => {
                        // console.log(res, '批量取消退样成功');
                        this.$message.success('批量取消退样成功！');
                        this.onQuery(this.current, this.pageSize);
                    }).catch((error) => {
                        console.log(error, '批量取消退样失败');
                        this.$message.error('批量取消退样失败！');
                        this.onQuery(this.current, this.pageSize);
                    });
                }).catch(error => {
                    this.$message.info('已取消该操作！');
                });
            } else {
                this.$message.warning('请先选择整车信息，再进行该操作！')
            }
        },
    },
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
// 重置
.reset_btn {
    margin: 0 !important;
    margin-left: 10px !important;
    background: #909399 !important;
    border-color: #909399 !important;
}

.partsRetreat {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}
/deep/ .partsRetreat_con {
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
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #32AFF0;
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
            padding-right: 20px;
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

// 查看任务
/deep/ .dialog_seeTask {
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
            padding: 0 !important;
            overflow: hidden;
        }
    }
}

// 退样
/deep/ .dialog_retreat {
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
        height: 60% !important;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            padding: 20px;
            overflow-y: auto;
        }
    }
}
</style>