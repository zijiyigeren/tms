<template>
    <!-- 整车停车场 -->
    <div class="carpark_border">
        <div class="carpark_con">
            <!-- 查询 -->
            <div class="query_modular">
                <el-form :inline="true" :model="queryForm" class="query_form">
                    <el-form-item label="车场编号：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                            placeholder="请输入车场编号" v-model.trim="queryForm.areaCode">
                        </el-input>
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
                        <el-table-column align="center" :resizable="false" prop="areaCode" label="车场编号"></el-table-column>
                        <el-table-column align="center" :resizable="false" label="操作" width="400">
                            <template slot-scope="scope">
                                <el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
                                <el-popconfirm title="确认要删除吗？" cancelButtonType="" @onConfirm="onDelete(scope.row)">
                                    <el-button type="text" slot="reference" style="color:red;margin: 0 10px;">删除</el-button>
                                </el-popconfirm>
                                <el-button type="text" @click="onEditDetails(scope.row)">编辑详细</el-button>
                                <el-button type="text" @click="onStockState(scope.row)">库存状态</el-button>
                                <el-button type="text" @click="onStockInit(scope.row)">库存初始化</el-button>
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

        <!-- 新建/编辑-对话框 -->
        <el-dialog width="40%" :title="newEditTitle" class="dialog_newedit"
            :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="newEditVisible" :before-close="onNewEditClose">
            <el-form :model="newEditForm" :rules="newEditRules" ref="neweditform" class="newedit_form">
                <el-form-item label="车场编号：" prop="areaCode">
                    <el-input clearable placeholder="请输入车场编号" v-model.trim="newEditForm.areaCode"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" :center="true" width="100%">
                <el-button @click="onNewEditClose">取 消</el-button>
                <el-button type="primary" @click="onNewEditOk">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑详细-对话框 -->
        <el-dialog width="70%" title="编辑详细" class="edit_details" 
            :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="editDetailsVisible" :before-close="onEditDetailsCancel">
            <edit-details :itype="1" :editDetailsData="editDetailsData" />
        </el-dialog>

        <!-- 库存状态 -->
        <el-dialog title="库存状态" :fullscreen="true" class="dialog_stock"
            :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="stockVisible" :before-close="onStockClose"
            v-loading="stockLoading">
            <table border="1" class="stock_table">
                <tbody class="stock_tbody">
                    <tr class="stock_tbody_tr" v-for="(row,i) in stockTableList" :key="i">
                        <td class="stock_td_line">{{row.line}}</td>
                        <td>
                            <el-button
                                v-show="row.list" 
                                class="stock_td_btn"
                                v-for="(item,i) in row.list" :key="i"
                                @click="onStockDelete(item)">
                                第{{item.linenumber}}位
                            </el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- <el-table ref="table" border stripe :data="stockTableList" :show-header="false" class="stock_table"
                :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">
                <el-table-column align="center" :resizable="false" prop="line" width="100"></el-table-column>
                <el-table-column :resizable="false">
                    <template slot-scope="scope">
                        <el-button v-show="scope.row.list" 
                            v-for="(item,i) in scope.row.list" :key="i"
                            @click="onStockDelete(item.id)">第{{item.linenumber}}位</el-button>
                    </template>
                </el-table-column>
            </el-table> -->
        </el-dialog>
    </div>
</template>
<script>
import editDetails from '../components/editDetails';
export default {
    name: 'carpark',
    props: [],
    components: {editDetails},
    data() {
        return {
            loading: false,
            total: 0, // 总数
            current: 1, // 页数
            pageSize: 10, // 条数
            tableList: [], // 表格数据
            queryForm: {areaCode: '',code: '',}, // 查询数据

            newEditTitle: '', // 新建/编辑-标题
            newEditVisible: false, // 新建/编辑-显示状态
            newEditForm: { // 新建/编辑-表单数据
                id: '',
                itype: 1,
                areaCode: '',
            },
            newEditRules: { // 新建/编辑-校验
                areaCode: [
                    {required: true, message: '车场编号不能为空', trigger: 'blur'},
                    {max: 10, message: '最多可输入10个字符', trigger: 'blur'}
                ],
            },

            editDetailsVisible: false, // 编辑详细-显示状态
            editDetailsData: {}, // 编辑详细-当前数据

            stockVisible: false, // 库存状态-显示状态
            stockLoading: false, // 库存状态-加载状态
            stockTableList: [], // 库存状态-数据
            stockStateData: '',// 库存状态-当前数据
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
            params.itype = 1;
            params.currentPage = current; 
            params.pageSize = pageSize;

            console.log(params, '查询数据');
            
            this.$api.carpark.parts(params).then(res => {
                console.log(res, '查询成功res');
                this.loading = false;
                if(res.data.data.length > 0 && res.data.data[0].total > 0){
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
                this.loading = true;
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
            this.queryForm = {areaCode: '',};
            this.onQuery(1,10);
        },
        // 新建
        onNewAdd() {
            this.newEditForm = {
                id: '',
                itype: 1,
                areaCode: '',
            };
            this.newEditTitle = '新建';
            this.newEditVisible = true;
        },
        // 编辑
        onEdit(row) {
            console.log(row,'编辑');
            this.newEditForm = { 
                id: row.id,
                itype: 1,
                areaCode: row.areaCode,
            },
            this.newEditTitle = '编辑';
            this.newEditVisible = true;
        },
        // 保存-新建/编辑-对话框
        onNewEditOk() {
            this.$refs.neweditform.validate((valid) => {
                if (valid) {
                    let params = this.newEditForm;
                    console.log(params, '新建/编辑-表单数据');
                    this.$api.carpark.partsEdit(params).then(res => {
                        console.log(res, '新建/编辑成功res');
                        this.newEditVisible = false;
                        if(this.newEditTitle == '新建') {
                            this.$message.success('新建成功');
                            this.onQuery(1,10);
                        }else if(this.newEditTitle == '编辑') {
                            this.$message.success('编辑成功');
                            this.onQuery(this.current, this.pageSize);
                        }
                    }).catch((error) => {
                        console.log(error, '新建/编辑失败error');
                        this.newEditVisible = false;
                        if(this.newEditTitle == '新建') {
                            this.$message.error('新建失败');
                            this.onQuery(1,10);
                        }else if(this.newEditTitle == '编辑') {
                            this.$message.error('编辑失败');
                            this.onQuery(this.current, this.pageSize);
                        }
                    })
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
            this.$api.carpark.partsDel({id: row.id}).then(res => {
                console.log(res, '删除成功res');
                this.$message.success('删除成功');
                this.onQuery(this.current,this.pageSize);
            }).catch((error) => {
                console.log(error, '删除失败error');
                this.$message.error('删除失败');
                this.onQuery(this.current,this.pageSize);
            })
        },
        // 点击-编辑详细
        onEditDetails(row) {
            this.editDetailsData = row;
            this.editDetailsVisible = true;
        },
        // 关闭-编辑详细-对话框
        onEditDetailsCancel() {
            this.editDetailsVisible = false;
        },
        // 库存状态-获取数据
        onStockState(row) {
            this.stockLoading = true;
            // console.log(row,'库存状态当前数据');
            this.stockStateData = row;
            this.$api.carpark.detailplace({id: row.id}).then(res => {
                // console.log('库存状态获取数据成功',res);
                this.stockTableList = res.data.data;
                this.stockVisible = true;
                this.stockLoading = false;
            }).catch((error) => {
                console.log('库存状态获取数据失败:',error);
                this.$message.error('库存状态获取数据失败');
                this.stockVisible = false;
                this.stockLoading = false;
            })
        },
        // 关闭库存状态
        onStockClose() {
            this.stockVisible = false;
        },
        // 删除库存状态
        onStockDelete(row) {
            // console.log(id, '删除库存状态');
            this.$confirm('确认要删除吗？', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                // console.log('确定');
                this.stockLoading = true;
                this.$api.carpark.deleteplace({id: row.id}).then(res => {
                    // console.log('库存状态删除成功', res);
                    this.$message.success('库存状态：删除成功');
                    this.onStockState(this.stockStateData);
                    this.stockLoading = false;
                }).catch((error) => {
                    console.log('库存状态删除失败', error);
                    this.$message.error('库存状态：删除失败');
                    this.stockLoading = false;
                });
            }).catch(error => {
                this.$message.info('已取消删除');
            });
        },
        // 库存初始化
        onStockInit(row) {
            this.$confirm('确认要将库存初始化吗？', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.$api.carpark.sampleinit({id: row.id}).then(res => {
                    // console.log('库存初始化成功:',res);
                    this.$message.success('库存初始化成功!');
                }).catch((error) => {
                    console.log('库存初始化失败:',error);
                    this.$message.error(error.data.message);
                });
            }).catch(error => {
                this.$message.info('已取消该操作！');
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

.carpark_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}
/deep/ .carpark_con {
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

// 查询表单
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

// 新建/编辑
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
        height: 20%;
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

// 新建/编辑-表单
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

// 编辑详细
/deep/ .edit_details {
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
        height: 80%;
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

// 库存状态-弹框
/deep/ .dialog_stock {
    overflow: hidden;
    .el-dialog {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            padding: 20px;
            overflow-y: auto;
            // .el-table, .el-table__body-wrapper, .el-table__body {
            //     width: 100% !important;
            // }
        }
    }
}

// 库存状态-表格
.stock_table {
    width: 100%;
    border: 1px solid #E4E7ED;
    .stock_tbody {
        display:block;
        width: 100%;
        .stock_tbody_tr {
            &:nth-child(even) {
                background: #FAFAFA;
            }
        }
        .stock_td_line {
            width: 60px;
            text-align: center;
        }
        .stock_td_btn {
            margin:0 5px;
        }
    }
    tr {
        display:table;
        table-layout: fixed;
        width: 100%;
        height: 60px;
        line-height: 60px;
        th, td {
            border: 1px solid #EBEEF5;
            padding: 0 5px;
        }
    }
}
</style>