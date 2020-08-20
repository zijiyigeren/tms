<template>
    <!-- 受理组任务 -->
    <div class="suffergroup_border">
        <div class="suffergroup_con">
            <!-- 查询 -->
            <div class="query_modular">
                <div class="query_form">
                    任务名称：
                    <el-input class="query_input" v-model.trim="taskName" placeholder="请输入任务名称" 
                    clearable name="clearInputValue" @keyup.enter.native="enterQuery" />
                </div>
                
                <!-- 查询按钮 -->
                <div class="query_btn">
                    <el-button type="primary" @click="onQuery(1,10)" style="margin:0 10px;">查询</el-button>
                    <el-button type="primary" class="reset_btn" @click="onReset">重置</el-button>
                </div>
            </div>

            <!-- 表格/分页 -->
            <div class="tablePagination_modular" v-loading="loading" >
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table border stripe ref="table" :data="tableData"
                        :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">
                        <el-table-column align="center" :resizable="false" label=" " type="index" width="50"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="name" label="任务名称"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="createTimeStr" label="任务创建时间"></el-table-column>
                        <el-table-column align="center" :resizable="false" label="操作" width="240">
                            <template slot-scope="scope">
                                <el-button type="text" @click="onApplyTask(scope.row)">申领任务</el-button>
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
    </div>
</template>
<script>
import base from '@/api/base.js';
export default {
    name: 'suffergroup',
    components: {},
    props: [],
    watch: {},
    data() {
        return {
            loading: false, // 加载状态
            total: 0, // 总数
            current: 1, // 页数
            pageSize: 10, // 条数
            taskName: '', // 流程名称
            tableData: [], // 表格数据
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
                pageNo: current,
                pageSize: pageSize,
                assignee: JSON.parse(localStorage.getItem("userInfo")).loginName  
            };
            // id loginName
            if(this.taskName){
                params.taskName = this.taskName;
            }
            this.$api.flowcheng.suffergroupTableData(params).then(res => {
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
                this.$message.error(error.data.message);
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
            this.taskName = '';
            this.onQuery(1, 10);
        },
        // 申领任务
        onApplyTask(row) {
            this.$confirm('确定申领任务：' + row.name + ' 吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    id: row.id,
                    usid: JSON.parse(localStorage.getItem("userInfo")).id 
                }
                this.$api.flowcheng.applyTask(params).then(res => {
                    this.$message.success('申领任务成功！');
                    this.onQuery(1, 10);
                }).catch(error => {
                    console.log(error, '申领任务失败');
                    this.$message.error('申领任务失败：' + error.data.message);
                });
            }).catch(() => {
                this.$message.info('已取消申领任务');          
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

.suffergroup_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}
/deep/ .suffergroup_con {
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
        justify-content: space-between;
        align-items: center; 
        .query_form {
            white-space:nowrap;
            .query_input {
                width: 300px;
            }
        }
        .query_btn {
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

</style>