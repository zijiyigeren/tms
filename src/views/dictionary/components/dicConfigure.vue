<template>
    <!-- 字典配置 -->
    <div class="configure_border">
        <div class="configure_con">
            <!-- 查询 -->
            <div class="query_modular">
                <el-form :inline="true" :model="queryForm" class="query_form">
                    <el-form-item label="名称：">
                        <el-input clearable name="clearInputValue"
                            placeholder="请输入名称" v-model.trim="queryForm.dicTypeName"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="字典编号：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                            placeholder="请输入字典编号" v-model.trim="queryForm.dicCode"></el-input>
                    </el-form-item> -->
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
                        <el-table-column align="center" :resizable="false" prop="dicTypeName" label="名称"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="dicTypeCode" label="数据值"></el-table-column>
                        <el-table-column align="center" :resizable="false" label="操作" width="140">
                            <template slot-scope="scope">
                                <el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
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
        <el-dialog width="40%" :modal="false" :title="newEditTitle" class="dialog_newedit"
            :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="newEditVisible" :before-close="onNewEditClose">
            <el-form :model="newEditForm" :rules="newEditRules" ref="neweditform" class="newedit_form">
                <el-form-item label="名称：" prop="dicTypeName">
                    <el-input clearable placeholder="请输入名称" v-model.trim="newEditForm.dicTypeName"></el-input>
                </el-form-item>
                <el-form-item label="数据值：" prop="dicTypeCode">
                    <el-input clearable placeholder="请输入数据值" v-model.trim="newEditForm.dicTypeCode"></el-input>
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

    </div>
</template>
<script>
export default {
    name: '',
    components: {},
    props: ['drawerConf'],
    watch: {
        drawerConf: {
            immediate:true,
            handler(val) {
                this.onQuery(1,10);
            },
        },
    },
    data() {
        return {
            loading: false,
            total: 0, // 总数
            current: 1, // 页数
            pageSize: 10, // 条数
            tableList: [], // 表格数据
            queryForm: {
                dicTypeName: '',
            }, // 查询数据
            newEditTitle: '', // 新建/编辑-标题
            newEditVisible: false, // 新建/编辑-显示状态
            newEditForm: { // 新建/编辑-表单数据
                id: '',
                dicTypeName: '', // 名称
                dicTypeCode: '', // 数据值
                orderby: '0', // 排序
                dicDescribe: '', // 描述
            },
            newEditRules: { // 新建/编辑-校验
                dicTypeName: [{required: true, message: '名称不能为空', trigger: 'blur'},],
                dicTypeCode: [{required: true, message: '数据值不能为空', trigger: 'blur'},],
                orderby: [
                    {required:false,trigger:'blur'},
                    {pattern: /^[0-9]+$/, message: '排序值必须为数字', trigger: 'blur' },
                ],
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
            params.dicId = this.drawerConf.id,
            params.pageNo = current;
            params.pageSize = pageSize;
            this.$api.datadic.dictypePage(params).then(res => {
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
                dicTypeName: '',
            };
            this.onQuery(1,10);
        },
        // 新建
        onNewAdd() {
            this.newEditForm = {
                id: '',
                dicTypeName: '', // 名称
                dicTypeCode: '', // 数据值
                orderby: '0', // 排序
                dicDescribe: '', // 描述
            };
            this.newEditTitle = '新建字典配置';
            this.newEditVisible = true;
        },
        // 编辑
        onEdit(row) {
            console.log(row,'编辑当前数据');
            this.$api.datadic.dictypeEdit(row.id).then(res => {
                console.log(res, '编辑详情成功res');
                this.newEditForm = {
                    id: res.data.data.id,
                    dicTypeName: res.data.data.dicTypeName, // 名称
                    dicTypeCode: res.data.data.dicTypeCode, // 数据值
                    orderby: res.data.data.orderby?res.data.data.orderby:0, // 排序
                    dicDescribe: res.data.data.dicDescribe, // 描述
                };
            }).catch((error) => {
                console.log(error, '编辑详情失败error');
            });
            this.newEditTitle = '编辑字典配置';
            this.newEditVisible = true;
        },
        // 保存-新建/编辑-对话框
        onNewEditOk() {
            this.$refs.neweditform.validate((valid) => {
                if (valid) {
                    let params = this.newEditForm;
                    params.dicId = this.drawerConf.id,
                    console.log(params, '新建/编辑-表单数据');
                    if(this.newEditTitle=='新建字典配置') {
                        this.$api.datadic.dictypeNewlyAdded(params).then(res => {
                            console.log(res, '新增成功res');
                            this.$message.success('新建字典配置成功！');
                            this.newEditVisible = false;
                            this.onQuery(1,10);
                        }).catch((error) => {
                            console.log(error, '新增失败error');
                            this.$message.error('新建字典配置失败！');
                            this.newEditVisible = false;
                            this.onQuery(1,10);
                        })
                    }else if(this.newEditTitle=='编辑字典配置'){
                        this.$api.datadic.dictypeEditModify(params).then(res => {
                            console.log(res, '编辑成功res');
                            this.$message.success('编辑字典配置成功！');
                            this.newEditVisible = false;
                            this.onQuery(this.current,this.pageSize);
                        }).catch((error) => {
                            console.log(error, '编辑失败error');
                            this.$message.error('编辑字典配置失败！');
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
            this.$api.datadic.dictypeDelete(row.id).then(res => {
                console.log(res, '删除成功res');
                this.$message.success('删除字典配置成功！');
                this.onQuery(this.current,this.pageSize);
            }).catch((error) => {
                console.log(error, '删除失败error');
                this.$message.error('删除字典配置失败！');
                this.onQuery(this.current,this.pageSize);
            })
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
        width: 70%;
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
.configure_border {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
}
/deep/ .configure_con {
    width: 100%;
    height: 100%;
    padding: 0;
    overflow: hidden;
    background: #fff;
    display: flex;
    flex-direction: column;
    .query_modular {
        padding: 20px;
        .query_btn {
            width: 100%;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
        padding: 0 20px 20px 20px;
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
