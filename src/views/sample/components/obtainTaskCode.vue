<template>
    <!-- 任务单号-对话框 -->
    <el-dialog width="90%" title="任务单号" class="dialog_taskCode"
        :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="visible">
        <div class="dialog_taskCodeCon">
            <!-- 查询 -->
            <div class="query_modular">
                <el-form :inline="true" :model="queryForm" class="query_form">
                    <el-form-item label="任务号：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                            placeholder="请输入任务号" v-model.trim="queryForm.taskcode"></el-input>
                    </el-form-item>
                    <el-form-item label="产品型号：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                            placeholder="请输入产品型号" v-model.trim="queryForm.sampleType"></el-input>
                    </el-form-item>
                    <el-form-item label="受检单位：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                            placeholder="请输入受检单位" v-model.trim="queryForm.companyCheck"></el-input>
                    </el-form-item>
                    <el-form-item label="生产单位：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                            placeholder="请输入生产单位" v-model.trim="queryForm.makeCompany"></el-input>
                    </el-form-item>
                </el-form>
                <div class="query_btn">
                    <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button>
                    <el-button type="primary" @click="onQuery(1,10)">查询</el-button>
                </div>
            </div>
            <div v-loading="loading" class="tablePagination_modular">
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table ref="table" border stripe :data="tableList"
                        :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">
                        <el-table-column align="center" :resizable="false" prop="taskcode" label="任务号">
                            <template slot-scope="scope">
                                <el-button type="text" @click="onTaskCode(scope.row.taskcode)">{{scope.row.taskcode}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="sampleType" label="产品型号"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="companyCheck" label="受检单位"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="makeCompany" label="生产单位"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="createdate" label="下达时间"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="flow" label="状态"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="orgID" label="科室"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="type" label="类别"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="sampleName" label="样品名称"></el-table-column>
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
    </el-dialog>
</template>
<script>
export default {
    name: '',
    components: {},
    props: ['taskCodeVisible'],
    watch: {
        taskCodeVisible: {
            immediate:true,
            handler(val) {
                if(val){
                    this.visible = true;
                    this.onQuery(1,10);
                }else{
                    this.visible = false;
                }
            },
        },
    },
    data() {
        return {
            visible: false, // 对话框显示状态
            loading: false,
            total: 0, // 总数
            current: 1, // 页数
            pageSize: 10, // 条数
            tableList: [], // 表格数据
            queryForm: { // 查询数据
                taskcode: '',
                sampleType: '',
                companyCheck: '',
                makeCompany: '',
            }, 
        }
    },
    created() {
        
    },
    mounted() {
        
    },
    methods: {
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
        // 查询
        onQuery(current,pageSize) {
            this.loading = true;
            let params = this.queryForm;
            params.currentPage = current; 
            params.pageSize = pageSize;
            // console.log(params, '查询数据');
            this.$api.spareparts.getTaskCode(params).then(res => {
                // console.log(res, '查询成功res');
                this.loading = false;
                if(res.data.data[0].total > 0){
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
                console.log(error, '查询失败error');
                this.$message.error('查询失败');
                this.loading = false;
                this.current = 1;
                this.pageSize = 10;
                this.total = 0;
            })
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
                taskcode: '',
                sampleType: '',
                companyCheck: '',
                makeCompany: '',
            };
            this.onQuery(1,10);
        },
        // 点击任务号
        onTaskCode(taskCode) {
            this.visible = false;
            this.$emit('taskCodeClose', taskCode);
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
/deep/ .dialog_taskCodeCon {
    width: 100%;
    height: 100%;
    padding: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .query_modular {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
        padding-bottom: 20px;
        .query_btn {
            margin-top: 20px;
            width: 100%;
            .el-button--primary {
                float: right;
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
/deep/ .query_form {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    .el-form-item{
        margin: 0;
        padding: 0;
        overflow: hidden;
        width: 25%;
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
        }
    }
}
</style>