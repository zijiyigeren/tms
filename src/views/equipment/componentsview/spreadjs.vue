<template>
    <!-- 零部件列表 -->
    <div class="spareparts_border">
        <div class="spareparts_con">
            <!-- 查询 -->
            <div class="query_modular">
                <div class="query_complex">
                    <el-form :inline="true" :model="queryForm" class="query_form" label-width="80px">
                        <el-form-item label="任务号：">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                placeholder="请输入任务号" v-model.trim="queryForm.taskCode"></el-input>
                        </el-form-item>
                        <el-form-item label="名称：">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                placeholder="请输入名称" v-model.trim="queryForm.sampleName"></el-input>
                        </el-form-item>
                        <el-form-item label="型号：">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                placeholder="请输入型号" v-model.trim="queryForm.sampleType"></el-input>
                        </el-form-item>
                        <el-form-item label="状态：" >
                            <template-method 
                                :type="'select'"
                                :dicCode="'zeroStatus'"
                                v-model="queryForm.status"/>
                        </el-form-item>
                        <el-form-item label="快递单号：" v-show="showState">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                placeholder="请输入快递单号" v-model.trim="queryForm.courierNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="送样人：" v-show="showState">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                placeholder="请输入送样人" v-model.trim="queryForm.contractor"></el-input>
                        </el-form-item>
                        <el-form-item label="送样公司：" v-show="showState">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                placeholder="请输入送样公司" v-model.trim="queryForm.comeCompany"></el-input>
                        </el-form-item>
                        <el-form-item label="到样日期：" v-show="showState">
                            <el-date-picker clearable v-model="queryForm.comeDate" type="date" 
                            placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="样品批号：" v-show="showState">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                placeholder="请输入样品批号" v-model.trim="queryForm.code"></el-input>
                        </el-form-item>
                        <el-form-item label="检验类型：" v-show="showState">
                            <template-method 
                                :type="'select'"
                                :dicCode="'zeroCheckType'"
                                :defaultVal="'全部'"
                                v-model="queryForm.checkType"/>
                        </el-form-item>
                        <el-form-item label="处理方式：" v-show="showState">
                            <template-method 
                                :type="'select'"
                                :dicCode="'zeroBackway'"
                                :defaultVal="'全部'"
                                v-model="queryForm.backway"/>
                        </el-form-item>
                        <el-form-item label="主检：" v-show="showState">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                placeholder="请输入主检" v-model.trim="queryForm.master"></el-input>
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
                        <el-button type="primary" @click="onNewAdd">新建</el-button>
                        <el-button type="primary" @click="batchDelete">批量删除</el-button>
                        <el-button type="primary" @click="excel">Excel</el-button>
                    </p>
                    <p class="query_rightbtn">
                        <el-button type="primary" @click="onQuery(1,10)">查询</el-button>
                        <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button>
                    </p>
                </div>
            </div>
            <div v-loading="loading" class="tablePagination_modular">
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table ref="table" border stripe :data="tableList"
                        :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}"
                        @selection-change="handleSelectionChange">
                        <el-table-column align="center" :resizable="false" width="60" type="selection"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="taskCode" label="任务号"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="sampleName" label="名称"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="sampleType" label="型号"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="status" label="状态">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status==0">待检</span>
                                <span v-else-if="scope.row.status==1">在检</span>
                                <span v-else-if="scope.row.status==2">完检</span>
                                <span v-else-if="scope.row.status==4">退样</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="courierNumber" label="运单号"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="contractor" label="送样人"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="comeCompany" label="送样公司"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="comeDate" label="到样日期"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="code" label="样品批号"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="checkType" label="检验类型"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="typeNumber" label="数量"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="bgcount" label="相关报告数">
                            <template slot-scope="scope">
                                <span>{{scope.row.bgcount}}份；已完成{{scope.row.countover}}份</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column align="center" :resizable="false" prop="onlinenumber" label="在架"></el-table-column> -->
                        <el-table-column align="center" :resizable="false" prop="backway" label="处理方式"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="master" label="主检"></el-table-column>
                        <el-table-column v-if="whetherDisplay!=1" align="center" :resizable="false" label="操作" width="240">
                            <template slot-scope="scope">
                                <el-button type="text" @click="onDetailed(scope.row)">详细</el-button>
                                <el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
                                <el-button type="text" @click="onFlowTurn(scope.row)">流转</el-button>
                                <el-button type="text" @click="onRetreatKind(scope.row)">退样</el-button>
                                <!-- <el-button v-if="scope.row.status!=1" type="text" @click="onRetreatKind(scope.row)">退样</el-button> -->
                                <el-popconfirm title="确认要删除吗？" cancelButtonType="" @onConfirm="onDelete(scope.row)">
                                    <el-button type="text" slot="reference" style="color:red;margin: 0 10px;">删除</el-button>
                                </el-popconfirm>
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

        <slot :selectedData="multipleSelection"></slot>
        
    </div>
</template>
<script>
import TemplateMethod from '@/components/TemplateMethod';
export default {
    name: '', // spareparts
    props: ['whetherDisplay'],
    components: {TemplateMethod,},
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
            tableList: [], // 表格数据
            queryForm: { // 查询数据
                taskCode: '',
                sampleName: '',
                sampleType: '',
                courierNumber: '',
                comeDate: '',
                comeCompany: '',
                checkType: '',
                master: '',
                contractor: '', // 送样人
                code: '',
                backway: '',
                status: '-1',
            }, 
            newEditRow: {}, // 新建/编辑-当前数据
            newEditTitle: '', // 新建/编辑-标题
            newEditVisible: false, // 新建/编辑-显示状态

            flowTurnVisible: false, // 流转-显示状态
            flowTurnRow: {}, // 流转-样品数据

            retreatVisible: false, // 退样-显示状态
            retreatFile: [], // 退样-绑定数据
            retreatForm: { // 退样-数据
                cpartId: '', // id
                creator: '', // 当前登录人
                bk: '', // 备注
                backdate: '', // 退样日期
                backtype: '退回', // 退样类型
                filenName: '', // 文件-回显名称
                filePath: '',  // 文件-回显路径
                upload: null, // 上传文件
            },
        }
    },
    created() {

    },
    mounted() {
        this.onQuery(1,10);
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
            this.showbut = val;
            this.showState = !this.showState;
        },
        // 分页器-页数改变
        currentChange(val) {
            this.current = val;
            this.onQuery(this.current, this.pageSize);
        },
        // 分页器-条数改变
        pageSizeChange(val) {
            this.pageSize = val;
            this.onQuery(this.current, this.pageSize);
        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 查询
        onQuery(current,pageSize) {
            this.loading = true;
            let params = {};
            for (let i in this.queryForm) {
                params[i] = this.queryForm[i];
            }
            if(Array.isArray(this.queryForm.comeDate)){
                params.comeDate = this.queryForm.comeDate[0];
                params.comeDateEnd = this.queryForm.comeDate[1];
            }
            params.currentPage = current;
            params.pageSize = pageSize;
            //console.log(params, '查询数据');
            this.$api.spareparts.search(params).then(res => {
                //console.log(res, '查询成功res');
                this.loading = false;
                if(res.data.data.length>0 && res.data.data[0].total > 0){
                    this.current = current;
                    this.pageSize = pageSize;
                    this.total = res.data.data[0].total;
                }else{
                    this.current = 1;
                    this.pageSize = 10;
                    this.total = 0;
                }
                this.tableList = res.data.data;
            }).catch((error) => {
                //console.log(error, '查询失败error');
                this.loading = true;
                this.current = 1;
                this.pageSize = 10;
                this.total = 0;
            });
        },
        // 回车查询
        onPressEnter(e){
            if( e.keyCode && e.keyCode == 13 ){
                this.onQuery(1,10);
            }
        },
        // 重置
        onReset() {
            this.queryForm = {
                taskCode: '',
                sampleName: '',
                sampleType: '',
                courierNumber: '',
                comeDate: '',
                comeCompany: '',
                checkType: '',
                master: '',
                contractor: '', // 送样人
                code: '',
                backway: '',
                status: '-1',
            };
            this.onQuery(1,10);
        },
        // 删除
        onDelete(row) {
            //console.log(row,'删除当前数据');
            this.loading = true;
            this.$api.spareparts.del({id: row.id}).then(res => {
                //console.log(res, '删除成功res');
                this.$message.success('删除成功');
                this.onQuery(this.current,this.pageSize);
            }).catch((error) => {
                //console.log(error, '删除失败error');
                this.$message.error('删除失败');
                this.onQuery(this.current,this.pageSize);
            })
        },
        excel() {
            let than = this;
            window.open('static/spreadjs/index.html', 'excel');
            window.dealData = function (data) {
                console.log(data,'data');
                than.onQuery(than.current, than.pageSize);
            }
        },
        // 新建
        onNewAdd() {
            this.newEditTitle = '新建';
            this.newEditVisible = true;
        },
        // 编辑
        onEdit(row) {
            //console.log(row,'编辑当前数据');
            this.newEditRow = row;
            this.newEditTitle = '编辑';
            this.newEditVisible = true;
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
            this.retreatFile = [];
            this.retreatForm = { // 退样-数据
                cpartId: '', // id
                creator: '', // 当前登录人
                bk: '', // 备注
                backdate: '', // 退样日期
                backtype: '退回', // 退样类型
                filenName: '', // 文件-回显名称
                filePath: '',  // 文件-回显路径
                upload: null, // 上传文件
            };
            this.retreatVisible = true;
            this.$api.spareparts.obtainRetreat({id: row.id}).then(res => {
                // console.log(res, '获取退样数据');
                let data = res.data.data;
                if(data.constructor === Object) {
                    this.retreatForm = data;
                    for(var i in this.retreatForm){
                        if(this.retreatForm[i] == null) this.retreatForm[i] = '';
                    }
                } else if(data) {
                    this.$message.warning(data);
                }
                this.retreatForm.upload = null;
                this.retreatForm.cpartId ? this.retreatForm.cpartId : this.retreatForm.cpartId = row.id;
                this.retreatForm.creator ? this.retreatForm.creator : this.retreatForm.creator = JSON.parse(localStorage.getItem("userInfo")).username;
                this.retreatForm.backdate ? this.retreatForm.backdate : this.retreatForm.backdate = this.currentDate;
                if(this.retreatForm.filenName && this.retreatForm.filePath) {
                    this.retreatFile = [{
                        name: this.retreatForm.filenName,
                        url: this.retreatForm.filePath
                    }];
                } else {
                    this.retreatFile = [];
                }
                // console.log(this.retreatForm, '退样回显数据');
            }).catch((error) => {
                console.log(error, '获取退样数据失败');
                this.$message.error('获取退样数据失败！');
            });
        },
        // 退样-删除
        uploadRemove() {
            this.retreatForm.filenName = '';
            this.retreatForm.filePath = '';
            this.retreatForm.upload = null;
        },
        // 退样-超出上传数量
        uploadExceed(files, fileList) {
            this.$message.warning('只允许上传一个文件，请先删除再上传！');
        },
        // 退样-上传
        uploadChange(params) {
            // console.log(params,'退样-上传');
            let file = params.file;
            let type = file.name.substring((file.name.lastIndexOf("\.")) + 1, file.name.length);
            if (type != 'xls' && type != 'xlsx' && type != 'doc' && type != 'docx') {
                this.retreatFile = [];
                this.retreatForm.upload = null;
                this.$message.error('上传文件格式不正确，请重新上传!');
            }else{
                this.retreatForm.upload = file;
            }
        },
        // 退样-确定
        onRetreatOk() {
            let params = new FormData();
            for(var i in this.retreatForm){
                params.append(i, this.retreatForm[i]);
            }
            this.$api.spareparts.retreatPreserve(params).then(res => {
                // console.log(res, '退样成功');
                this.$message.success('退样成功');
                this.retreatInitialVal();
            }).catch((error) => {
                console.log(error, '退样失败');
                this.$message.error(error.data.message);
                this.retreatInitialVal();
            });
        },
        // 退样-设置初始值
        retreatInitialVal() {
            this.retreatFile = [];
            this.retreatVisible = false;
            this.retreatForm = { // 退样-数据
                cpartId: '', // id
                creator: '', // 当前登录人
                bk: '', // 备注
                backdate: '', // 退样日期
                backtype: '退回', // 退样类型
                filenName: '', // 文件-回显名称
                filePath: '',  // 文件-回显路径
                upload: null, // 上传文件
            };
            this.onQuery(this.current, this.pageSize);
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
                        this.onQuery(this.current, this.pageSize);
                    }).catch((error) => {
                        console.log(error, '删除失败error');
                        this.$message.error('批量删除失败！');
                        this.onQuery(this.current, this.pageSize);
                    });
                }).catch(error => {
                    this.$message.info('已取消该操作！');
                });
            } else {
                this.$message.warning('请先选择整车信息，再进行该操作！')
            }
            
        },
    }
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
// 表单
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

// 新建/编辑
/deep/ .dialog_newedit {
    height: 100%;
    overflow: hidden;
    .el-dialog {
        margin: 0 !important;
        padding: 0 !important;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
        flex: 1 !important;
        padding: 20px;
        overflow-y: auto;
        }
        .el-dialog__footer {
            padding: 20px;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
    }
}

// 流转
/deep/ .dialog_flowTurn {
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
            padding: 0;
            overflow: hidden;
        }
    }
}

// 退样-表单
/deep/ .retreat_form {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
        width: 100%;
        margin: 0;
        padding-bottom: 20px;
        overflow: hidden;
        display: flex;
        .el-form-item__label {
            width: 20% !important;
            white-space: nowrap;
        }
        .el-form-item__content {
            flex: 1;
            padding-right: 10%;
            overflow: hidden;
            .el-select, .el-input, .el-date-editor {
                width: 100% !important;
            }
        }
    }
    // 上传
    .upload_demo {
        width: 100%;
        display: flex;
        flex-direction: row-reverse;
        .el-upload-list {
            flex: 1;
            height: 40px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            margin-right: 10px;
            overflow: hidden;
        }
    }
}

.spareparts_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}
/deep/ .spareparts_con {
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

</style>
