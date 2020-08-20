<template>
    <!-- 数据字典 -->
    <div class="datadictionary_border">
        <div class="datadictionary_con">
            <!-- 查询 -->
            <div class="query_modular">
                <el-form :inline="true" :model="queryForm" class="query_form">
                    <el-form-item label="字典名称：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                            placeholder="请输入字典名称" v-model.trim="queryForm.dicName"></el-input>
                    </el-form-item>
                    <el-form-item label="字典编号：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                            placeholder="请输入字典编号" v-model.trim="queryForm.dicCode"></el-input>
                    </el-form-item>
                </el-form>
                <div class="query_btn">
                    <el-button type="primary" @click="onNewAdd">新建</el-button>
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
                        :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">
                        <el-table-column align="center" :resizable="false" type="index" width="60"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="dictionaryName" label="字典名称"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="dictionaryCode" label="字典编号"></el-table-column>
                        <el-table-column align="center" :resizable="false" label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
                                <el-button type="text" @click="onConfigure(scope.row)">字典配置</el-button>
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
                <el-form-item label="字典名称：" prop="dictionaryName">
                    <el-input clearable placeholder="请输入字典名称" v-model.trim="newEditForm.dictionaryName"></el-input>
                </el-form-item>
                <el-form-item label="字典编号：" prop="dictionaryCode">
                    <el-input clearable placeholder="请输入字典编号" v-model.trim="newEditForm.dictionaryCode"></el-input>
                </el-form-item>
                <el-form-item label="排序：" prop="orderby">
                    <el-input clearable placeholder="请输入排序" v-model.trim="newEditForm.orderby"></el-input>
                </el-form-item>
                <el-form-item label="描述：" prop="dicDescribe">
                    <el-input clearable placeholder="请输入描述" v-model.trim="newEditForm.dicDescribe"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" :center="true" width="100%">
                <el-button @click="onNewEditClose">取 消</el-button>
                <el-button type="primary" @click="onNewEditOk">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 字典配置-右侧抽屉 -->
        <el-drawer title="字典列表" size="40%" class="dict_conf"
            :visible.sync="dictConfVisible" :wrapperClosable="false">
            <dic-configure :drawerConf="drawerConf" />
        </el-drawer>
        
    </div>
</template>
<script>
import dicConfigure from './components/dicConfigure.vue'
export default {
    name: 'datadictionary',
    props: [],
    components: {dicConfigure},
    data() {
        return {
            loading: false,
            total: 0, // 总数
            current: 1, // 页数
            pageSize: 10, // 条数
            tableList: [], // 表格数据
            queryForm: {
                dicName: '',
                dicCode: '',
            }, // 查询数据
            newEditTitle: '', // 新建/编辑-标题
            newEditVisible: false, // 新建/编辑-显示状态
            newEditForm: { // 新建/编辑-表单数据
                id: '',
                dictionaryName: '', // 字典名称
                dictionaryCode: '', // 字典编号
                orderby: '0', // 排序
                dicDescribe: '', // 描述
            },
            newEditRules: { // 新建/编辑-校验
                dictionaryName: [{required: true, message: '字典名称不能为空', trigger: 'blur'},],
                dictionaryCode: [{required: true, message: '字典编号不能为空', trigger: 'blur'},],
                orderby: [
                    {required:false,trigger:'blur'},
                    {pattern: /^[0-9]+$/, message: '排序值必须为数字', trigger: 'blur' },
                ],
            },
            dictConfVisible: false, // 字典配置-展示状态
            drawerConf: '', // 字典配置-数据
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
        // 查询
        onQuery(current,pageSize) {
            this.loading = true;
            let params = this.queryForm;
            params.pageNo = current; 
            params.pageSize = pageSize;
            this.$api.datadic.sysDictionary(params).then(res => {
                // console.log(res, '查询成功res');
                this.loading = false;
                if(res.data.data.count > 0){
                    this.total = res.data.data.count;
                    this.current = res.data.data.pageNo;
                    this.pageSize = res.data.data.pageSize;
                }else{
                    this.total = 0;
                    this.current = 1;
                    this.pageSize = 10;
                }
                this.tableList = res.data.data.list;
            }).catch((error) => {
                console.log(error, '查询失败error');
                this.$message.error(error.data.message);
                this.loading = false;
                this.total = 0;
                this.current = 1;
                this.pageSize = 10;
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
                dicName: '',
                dicCode: '',
            };
            this.onQuery(1,10);
        },
        // 新建
        onNewAdd() {
            this.newEditForm = {
                id: '',
                dictionaryName: '', // 字典名称
                dictionaryCode: '', // 字典编号
                orderby: '0', // 排序
                dicDescribe: '', // 描述
            };
            this.newEditTitle = '新建';
            this.newEditVisible = true;
        },
        // 编辑
        onEdit(row) {
            console.log(row,'编辑当前数据');
            this.$api.datadic.editDetails(row.id).then(res => {
                console.log(res, '编辑详情成功res');
                this.newEditForm = {
                    id: res.data.data.id,
                    dictionaryName: res.data.data.dictionaryName, // 字典名称
                    dictionaryCode: res.data.data.dictionaryCode, // 字典编号
                    orderby: res.data.data.orderby?res.data.data.orderby:0, // 排序
                    dicDescribe: res.data.data.dicDescribe, // 描述
                };
            }).catch((error) => {
                console.log(error, '编辑详情失败error');
            });
            this.newEditTitle = '编辑';
            this.newEditVisible = true;
        },
        // 保存-新建/编辑-对话框
        onNewEditOk() {
            this.$refs.neweditform.validate((valid) => {
                if (valid) {
                    let params = this.newEditForm;
                    console.log(params, '新建/编辑-表单数据');
                    if(this.newEditTitle=='新建') {
                        this.$api.datadic.newlyAdded(params).then(res => {
                            console.log(res, '新增成功res');
                            this.$message.success('新增字典数据成功！');
                            this.newEditVisible = false;
                            this.onQuery(1,10);
                        }).catch((error) => {
                            console.log(error, '新增失败error');
                            this.$message.error('新增字典数据失败');
                            this.newEditVisible = false;
                            this.onQuery(1,10);
                        })
                    }else if(this.newEditTitle=='编辑'){
                        this.$api.datadic.editModify(params).then(res => {
                            console.log(res, '编辑成功res');
                            this.$message.success('修改字典数据成功！');
                            this.newEditVisible = false;
                            this.onQuery(this.current,this.pageSize);
                        }).catch((error) => {
                            console.log(error, '编辑失败error');
                            this.$message.error('修改字典数据失败');
                            this.newEditVisible = false;
                            this.onQuery(this.current,this.pageSize);
                        })
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
            this.$api.datadic.dictionaryDelete(row.id).then(res => {
                console.log(res, '删除成功res');
                this.$message.success('删除字典数据成功！');
                this.onQuery(this.current,this.pageSize);
            }).catch((error) => {
                console.log(error, '删除失败error');
                this.$message.error(error.data.message);
                this.onQuery(this.current,this.pageSize);
            })
        },
        // 字典配置
        onConfigure(row) {
            this.dictConfVisible = true;
            this.drawerConf = row;
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

/deep/ .newedit_form {
    margin: 0;
    padding: 0;
    .el-form-item{
        margin: 0;
        padding: 0;
        padding-bottom: 20px;
        display: flex;
        align-items: center;
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
// 新建/编辑-对话框
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
        height: 40%;
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
// 右侧抽屉
/deep/ .dict_conf {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0;
    height: 100%;
    overflow: hidden;
    .el-drawer__header {
        margin: 0;
        padding: 10px 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        span {
            &:focus {
                outline:0;
            }
            color: rgba(0, 0, 0, 0.85);
            font-weight: bold;
            font-size: 16px;
            line-height: 30px;
        }
        .el-drawer__close-btn{
            &:focus {
                outline:0;
            }
            .el-icon {
                color: rgba(0, 0, 0, 0.85);
                font-weight: bold;
                font-size: 16px;
                line-height: 30px;
            }
        }
    }
    .el-drawer__body {
        overflow: hidden;
    }
}
.datadictionary_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}
/deep/ .datadictionary_con {
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