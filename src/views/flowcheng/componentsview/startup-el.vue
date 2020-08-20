<template>
    <!-- 流程定义 -->
    <div class="startup_border">
        <div class="startup_con">
            <!-- 查询 -->
            <div class="query_modular">
                <div class="query_form">
                    流程名称：<el-input class="query_input" v-model.trim="flowName" placeholder="请输入流程名称" 
                        clearable name="clearInputValue" @keyup.enter.native="enterQuery"/>
                </div>

                <!-- 查询按钮 -->
                <div class="query_btn">
                    <el-button type="primary" @click="onNewFlow">新增流程</el-button>
                    <p>
                        <el-button type="primary" @click="onQuery(1,10)" style="margin:0 10px;">查询</el-button>
                        <el-button type="primary" class="reset_btn" @click="onReset">重置</el-button>
                    </p>
                </div>
            </div>

            <!-- 表格/分页 -->
            <div class="tablePagination_modular" v-loading="loading" >
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table border stripe ref="table" :data="tableData"
                        :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">
                        <el-table-column align="center" :resizable="false" prop="processName" label="流程名称"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="processKey" label="流程标识"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="processVersion" label="版本号"></el-table-column>
                        <el-table-column align="center" :resizable="false" label="发布状态">
                            <template slot-scope="scope">
                                <span v-if="scope.row.publishStatus=='1'">已发布</span>
                                <span v-else>未发布</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="publishTime" label="发布时间"></el-table-column>
                        <el-table-column align="center" :resizable="false" label="操作" width="240">
                            <template slot-scope="scope">
                                <el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
                                <el-button type="text" @click="onRelease(scope.row)">发布</el-button>
                                <el-button type="text" @click="onStartUp(scope.row)">启动</el-button>
                                <el-button type="text" @click="onDelete(scope.row)" style="color:red;">删除</el-button>
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

        <!-- 新增流程 -->
        <el-dialog title="新增流程" class="dialog_newFlow"
            :visible.sync="newFlowVisible" :before-close="onNewFlowClose"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form :inline="true" ref="newform" :model="newForm" :rules="rules">
                <el-form-item label="流程名称：" prop="processName">
                    <el-input v-model.trim="newForm.processName"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="onNewFlowClose">取 消</el-button>
                <el-button type="primary" @click="onNewFlowOk">保 存</el-button>
            </div>
        </el-dialog>

        <!-- 启动流程 -->
        <Startupform v-bind="{
            'startUpVisible': startUpVisible,
            'startUpRow': startUpRow,
            'startUpFormData': startUpFormData,
        }" @startUpClose="startUpClose" />

    </div>
</template>
<script>
import base from '@/api/base.js';
import Startupform from '../component/startUpForm.vue'
export default {
    name: 'startup',
    components: {Startupform},
    props: [],
    watch: {},
    data() {
        return {
            loading: false, // 加载状态
            total: 0, // 总数
            current: 1, // 页数
            pageSize: 10, // 条数
            flowName: '', // 流程名称
            tableData: [], // 表格数据
            newFlowVisible: false, // 新增流程-对话框-显示状态
            newForm: { // 新增流程-数据
                processName: ''
            },
            rules: { // 新增流程-校验
                processName: [
                    { required: true, message: '流程名称不能为空', trigger: 'blur' }
                ]
            },
            startUpRow: '', // 启动流程-该流程数据
            startUpFormData: '', // 启动流程-该流程-表单数据
            startUpVisible: false, // 启动流程-对话框-显示状态
        }
    },
    created() {},
    mounted() {
        this.onQuery(1, 10);
    },
    methods: {
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
        // 查询
        onQuery(current, pageSize) {
            this.loading = true;
            let params = {
                name: this.flowName,
                pageNo: current,
                pageSize: pageSize
            };
            this.$api.flowcheng.starupTableData(params).then(res => {
                this.tableData = res.data.data.list;
                this.loading = false;
                if(res.data.data.count > 0){
                    this.total = res.data.data.count;
                    this.current = current;
                    this.pageSize = pageSize;
                }else{
                    this.total = 0;
                    this.current = 1;
                    this.pageSize = 10;
                }
            }).catch(error => {
                console.log(error,'查询失败');
                this.$message.error(error.data.message);
                this.loading = false;
                this.total = 0;
                this.current = 1;
                this.pageSize = 10;
            })
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
            this.flowName = '';
            this.onQuery(1, 10);
        },
        // 新增流程
        onNewFlow() {
            this.newForm.processName = '';
            this.newFlowVisible = true;
        },
        // 保存-新增流程
        onNewFlowOk() {
            this.$refs.newform.validate((valid) => {
                if(valid) {
                    let params = {
                        processName: this.newForm.processName
                    }
                    this.$api.flowcheng.starupNewFlow(params).then(res => {
                        // console.log(res.data.data.modelId, 'res');
                        this.newFlowVisible = false;
                        let modelId = res.data.data.modelId;
                        window.open('static/modeler.html?modelId=' + modelId);
                        this.onQuery(this.current, this.pageSize);
                    }).catch(error => {
                        console.log(error, '新增流程失败error');
                        this.$message.error(error.data.message);
                        this.newFlowVisible = false;
                        this.onQuery(this.current, this.pageSize);
                    })
                }
            });
        },
        // 关闭-新增流程
        onNewFlowClose() {
            this.newFlowVisible = false;
            this.$refs.newform.resetFields();
        },
        // 编辑
        onEdit(row) {
            // console.log(row,'row');
            window.open('static/modeler.html?modelId=' + row.modelId);
        },
        // 发布
        onRelease(row) {
            this.$confirm('确认要发布该流程？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$api.flowcheng.starupRelease(row.modelId).then(res => {
                    console.log(res, '流程发布成功');
                }).catch(error => {
                    console.log(error,'流程发布失败');
                    if(error.data.status){
                        this.$message.success('流程发布成功');
                    }else{
                        this.$message.error(error.data.reason);
                    }
                    this.loading = false;
                    this.onQuery(this.current, this.pageSize);
                });
            }).catch(() => {
                this.$message.info('已取消发布');          
            });
        },
        // 启动
        onStartUp(row) {
            this.startUpRow = row;
            if(row.publishStatus == 1) {
                let params = {
                    processDefinitionId: row.processId
                }
                this.$api.flowcheng.flowStartUp(params).then(res => {
                    let data = res.data.data;
                    // console.log(data, '判断是什么形式-流程表单');
                    if(data.id.indexOf('.html') > 0) {
                        console.log('外部表单流程');
                    } else {
                        console.log('正常流程');
                        this.startUpFormData = data;
                        this.startUpVisible = true;
                    }
                }).catch(error => {
                    this.$message.info(row.processName+'--暂无表单数据');
                })
            }else{
                this.$message.warning('请先发布，再进行启动！');
            }
        },
        // 关闭启动流程
        startUpClose() {
            this.startUpRow = {};
            this.startUpFormData = {};
            this.startUpVisible = false;
            this.onQuery(this.current, this.pageSize);
        },
        // 删除
        onDelete(row) {
            this.$confirm('确认要删除该流程?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$api.flowcheng.starupDelete(row.modelId).then(res => {
                    console.log(res, '删除流程成功');
                }).catch(error => {
                    console.log(error, '删除流程失败');
                    if(error.data.status){
                        this.$message.success('删除流程成功');
                    }else{
                        this.$message.error(error.data.reason);
                    }
                    this.onQuery(this.current, this.pageSize);
                    this.loading = false;
                })
            }).catch(() => {
                this.$message({type: 'info', message: '已取消删除', duration: 1500});          
            });
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
p {
    padding: 0;
    margin: 0;
}
.startup_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}
.startup_con {
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
        display: flex;
        flex-direction: column;
        .query_form {
            white-space:nowrap;
            .query_input {
                width: 300px;
            }
        }
        .query_btn {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
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
        }
        .pagination_modular {
            margin-top: 20px;
            padding: 0;
        }
    }
}

// 新增流程
.dialog_newFlow {
    /deep/ .el-form {
        .el-form-item{
            margin: 0;
            padding-bottom: 20px;
            display: flex;
            align-items: center;
            overflow: hidden;
            .el-form-item__label {
                white-space: nowrap;
            }
            .el-form-item__content {
                flex: 1;
                .el-select, .el-input, .el-date-editor {
                    width: 100% !important;
                }
            }
        }
    }
}

// 启动流程
/deep/ .dialog_startUp {
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
</style>