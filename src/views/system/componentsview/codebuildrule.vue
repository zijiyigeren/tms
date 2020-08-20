<template>
    <!-- 编码生成规则 -->
    <div class="codebuildrule_border">
        <div class="codebuildrule_con">
            <!-- 查询 -->
            <div class="query_modular">
                <el-form :inline="true" :model="queryForm" class="query_form">
                    <el-form-item label="规则名称：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                            placeholder="请输入规则名称" v-model.trim="queryForm.ruleName"></el-input>
                    </el-form-item>
                    <el-form-item label="规则Code：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                            placeholder="请输入规则Code" v-model.trim="queryForm.ruleCode"></el-input>
                    </el-form-item>
                </el-form>
                <div class="query_btn">
                    <p>
                        <el-button type="primary" @click="onNewAdd">新建</el-button>
                        <el-button type="primary" @click="onBatchDelete">批量删除</el-button>
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
                    <el-table ref="table" border stripe :data="tableList" @selection-change="handleSelectionChange"
                        :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">
                        <el-table-column align="center" :resizable="false" width="60" type="selection"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="ruleName" label="规则名称"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="ruleCode" label="规则Code"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="ruleClass" label="规则实现类"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="ruleParams" label="规则参数"></el-table-column>
                        <el-table-column align="center" :resizable="false" label="操作" width="120">
                            <template slot-scope="scope">
                                <el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
                                <el-button type="text" style="color:red;" @click="onDelete(scope.row)">删除</el-button>
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
                    :page-sizes="[10,20,30]"
                    @current-change="currentChange"
                    @size-change="pageSizeChange">
                </el-pagination>
            </div>
        </div>

        <!-- 新建/编辑-对话框 -->
        <el-dialog width="40%" :title="newEditTitle" class="dialog_newedit"
            :close-on-click-modal="false" :close-on-press-escape="false" 
            :visible.sync="newEditVisible" :before-close="onNewEditClose">
            <el-form :model="newEditForm" :rules="newEditRules" ref="neweditform" class="newedit_form">
                <el-form-item label="规则名称：" prop="ruleName">
                    <el-input clearable placeholder="请输入规则名称" v-model.trim="newEditForm.ruleName"></el-input>
                </el-form-item>
                <el-form-item label="规则Code：" prop="ruleCode">
                    <el-input clearable placeholder="请输入规则Code" v-model.trim="newEditForm.ruleCode"></el-input>
                </el-form-item>
                <el-form-item label="规则实现类：" prop="ruleClass">
                    <el-input clearable placeholder="请输入规则实现类" v-model.trim="newEditForm.ruleClass"></el-input>
                </el-form-item>
                <el-form-item label="规则参数：" prop="ruleParams">
                    <el-input clearable type="textarea" :rows="4" placeholder="请输入规则参数" v-model.trim="newEditForm.ruleParams"></el-input>

                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" :center="true" width="100%">
                <el-button @click="onNewEditClose">取 消</el-button>
                <el-button type="primary" @click="onNewEditOk">确 定</el-button>
            </span>
        </el-dialog>

        
    </div>
</template>
<script>
export default {
    name: 'codebuildrule',
    props: [],
    components: {},
    data() {
        return {
            loading: false,
            total: 0, // 总数
            current: 1, // 页数
            pageSize: 10, // 条数
            multipleSelection: [], // 表格选中数据
            tableList: [{}], // 表格数据
            queryForm: { // 查询数据
                ruleName: '',
                ruleCode: '',
            }, 
            newEditTitle: '', // 新建/编辑-标题
            newEditVisible: false, // 新建/编辑-显示状态
            newEditForm: { // 新建/编辑-表单数据
                id: '',
                ruleName: '',
                ruleCode: '',
                ruleClass: '',
                ruleParams: '',
            },
            newEditRules: { // 新建/编辑-校验
                ruleName: [
                    {required: true, message: '规则名称不能为空', trigger: 'blur'},
                ],
                ruleCode: [
                    {required: true, message: '规则Code不能为空', trigger: 'blur'},
                ],
                ruleClass: [
                    {required: true, message: '规则实现类不能为空', trigger: 'blur'},
                ],
            },
        }
    },
    created() {
        
    },
    mounted() {
        this.onQuery(1,10);
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
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 查询
        onQuery(current,pageSize) {
            this.loading = true;
            let params = {};
            for (let i in this.queryForm) {
                if(i && this.queryForm[i]){
                    params[i] = this.queryForm[i];
                }
            }
            params.pageNo = current;
            params.pageSize = pageSize;
            console.log(params, '查询数据');
            this.$api.codebuildrule.list(params).then(res => {
                console.log(res, '查询成功res');
                this.loading = false;
                this.tableList = res.data.result.records;
            }).catch((error) => {
                console.log(error, '查询失败error');
                this.loading = true;
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
                ruleName: '',
                ruleCode: '',
            };
            this.onQuery(1,10);
        },
        // 新建
        onNewAdd() {
            this.newEditForm = {
                id: '',
                ruleName: '',
                ruleCode: '',
                ruleClass: '',
                ruleParams: '',
            };
            this.newEditTitle = '新建';
            this.newEditVisible = true;
        },
        // 编辑
        onEdit(row) {
            this.$api.codebuildrule.queryById({id: row.id}).then(res => {
                console.log(res, '编辑获取数据成功res');
                let data = res.data.result;
                for (let i in data) {
                    this.newEditForm[i] = data[i];
                }
            }).catch((error) => {
                console.log(error, '编辑获取数据失败error');
            });
            this.newEditTitle = '编辑';
            this.newEditVisible = true;
        },
        // 保存-新建-对话框
        onNewEditOk() {
            this.$refs.neweditform.validate((valid) => {
                if (valid) {
                    let params = this.newEditForm;
                    if(this.newEditTitle == '新建') {
                        this.$api.codebuildrule.add(params).then(res => {
                            console.log(res, '新建成功res');
                            this.newEditVisible = false;
                            this.$message.success('新建成功');
                            this.onQuery(1,10);
                        }).catch((error) => {
                            console.log(error, '新建失败error');
                            this.newEditVisible = false;
                            this.$message.success('新建失败');
                            this.onQuery(1,10);
                        });
                    }else if(this.newEditTitle == '编辑'){
                        this.$api.codebuildrule.edit(params).then(res => {
                            console.log(res, '编辑成功res');
                            this.newEditVisible = false;
                            this.$message.success('编辑成功');
                            this.onQuery(this.current, this.pageSize);
                        }).catch((error) => {
                            console.log(error, '编辑失败error');
                            this.newEditVisible = false;
                            this.$message.success('编辑失败');
                            this.onQuery(this.current, this.pageSize);
                        });
                    }
                }
            });   
        },
        // 关闭-新建/编辑-对话框
        onNewEditClose() {
            this.$refs.neweditform.resetFields();
            this.newEditVisible = false;
        },
        // 删除
        onDelete(row) {
            console.log(row,'删除当前数据');
            this.loading = true;
            this.$api.codebuildrule.delete({id: row.id}).then(res => {
                console.log(res, '删除成功res');
                this.$message.success('删除成功');
                this.onQuery(this.current,this.pageSize);
            }).catch((error) => {
                console.log(error, '删除失败error');
                this.$message.error('删除失败');
                this.onQuery(this.current,this.pageSize);
            })
        },
        // 批量删除
        onBatchDelete() {
            this.loading = true;
            let str = '';
            this.multipleSelection.forEach(item => {
                str += item.id + ',';
            });
            str = str.substring(0, str.length-1);
            this.$api.codebuildrule.deleteBatch({ids: str}).then(res => {
                console.log(res, '删除成功res');
                this.$message.success('批量删除成功');
                this.onQuery(this.current,this.pageSize);
            }).catch((error) => {
                console.log(error, '删除失败error');
                this.$message.error('批量删除失败');
                this.onQuery(this.current,this.pageSize);
            });
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
/deep/ .query_form {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    .el-form-item{
        margin: 0;
        padding: 0 10px 20px 0;
        width: 30%;
        display: flex;
        align-items: center;
        overflow: hidden;
        .el-form-item__label {
            white-space: nowrap;
        }
        .el-form-item__content {
            flex: 1;
            padding-right: 20px;
            .el-select, .el-input, .el-date-editor {
                width: 100% !important;
            }
        }
    }
}

/deep/ .newedit_form {
    margin: 0;
    padding: 0;
    .el-form-item{
        margin: 0;
        padding: 0;
        padding-bottom: 20px;
        display: flex;
        overflow: hidden;
        .el-form-item__label {
            width: 25% !important;
        }
        .el-form-item__content {
            margin: 0 !important;
            padding: 0 !important;
            width: 60% !important;
            .el-select, .el-input{
                width: 100% !important;
            }
        }
    }
}
/deep/ .dialog_newedit {
    overflow: hidden;
    .el-dialog {
        margin:0 !important;
        padding: 0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        max-height:calc(100% - 20%);
        max-width:calc(100% - 20%);
        height: 50%;
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
.codebuildrule_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}
/deep/ .codebuildrule_con {
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