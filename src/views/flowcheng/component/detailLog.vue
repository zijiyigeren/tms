<template>
    <!-- 明细日志 -->
    <el-tabs v-model="tabsDefault" type="card" @tab-click="onTabClick" class="detail_log">
        <el-tab-pane label="处理明细" name="1" v-loading="loading">
            <div v-show="handleData.length<1">处理明细</div>
            <!-- 表格/分页 -->
            <div class="tablePagination_modular" v-show="handleData.length>0">
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table border stripe ref="table" :data="handleData"
                        :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">
                        <el-table-column align="center" :resizable="false" label=" " type="index" width="50"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="name" label="节点名称"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="createTimeStr" label="开始时间"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="finishTimeStr" label="结束时间"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="assigneeName" label="负责人"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="status" label="处理结果">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status == 0" style="color: #F14E10;">处理中</span>
                                <span v-else style="color: #4D9A00;">完成</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="comment" label="处理意见"></el-table-column>
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
        </el-tab-pane>
        <el-tab-pane label="流程日志" name="2" v-loading="loading">
            <div v-show="flowData.length<1">流程日志</div>
            <!-- 表格/分页 -->
            <div class="tablePagination_modular" v-show="flowData.length>0">
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table border stripe ref="table" :data="flowData"
                        :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">
                        <el-table-column align="center" :resizable="false" label=" " type="index" width="50"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="节点名称"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="开始时间"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="结束时间"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="负责人"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="处理结果"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="处理意见"></el-table-column>
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
        </el-tab-pane>
        <el-tab-pane label="催办日志" name="3" v-loading="loading">
            <div v-show="urgingData.length<1">催办日志</div>
            <!-- 表格/分页 -->
            <div class="tablePagination_modular" v-show="urgingData.length>0">
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table border stripe ref="table" :data="urgingData"
                        :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">
                        <el-table-column align="center" :resizable="false" label=" " type="index" width="50"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="节点名称"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="开始时间"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="结束时间"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="负责人"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="处理结果"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="处理意见"></el-table-column>
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
        </el-tab-pane>
    </el-tabs>
</template>

<script>
export default {
    name: 'detaillog',
    props: ['detailLogVisible', 'taskRow'],
    watch: {
        detailLogVisible: {
            immediate:true,
            handler(val) {
                if(val) {
                    this.onTabClick();
                }
            },
        },
    },
    data() {
        return {
            tabsDefault: '1', // 默认页
            loading: false, // 加载状态
            total: 0, // 总数
            current: 1, // 页数
            pageSize: 10, // 条数
            handleData: [], // 处理明细
            flowData: [], // 流程日志
            urgingData: [], // 催办日志
        }
    },
    created() {},
    mounted() {},
    methods: {
        // 获取数据
        onTabClick(tab, event) {
            this.tabsDefault = '1'; // 默认页
            this.loading = false; // 加载状态
            this.total = 0; // 总数
            this.current = 1; // 页数
            this.pageSize = 10; // 条数
            this.handleData = []; // 处理明细
            this.flowData = []; // 流程日志
            this.urgingData = []; // 催办日志
            if(this.taskRow && this.taskRow.processInstanceId) { 
                let params = {
                    processInstanceId: this.taskRow.processInstanceId
                };
                if(tab) {
                    if(tab.label == '处理明细') {
                        this.loading = true;
                        this.$api.flowcheng.processingRecords(params).then(res => {
                            // console.log(res,'res');
                            this.handleData = res.data.data;
                            this.loading = false;
                        }).catch(error => {
                            console.log(error,'error');
                            this.$message.error('待办任务处理明细加载失败！');
                            this.loading = false;
                        });
                    }
                } else {
                    this.loading = true;
                    this.$api.flowcheng.processingRecords(params).then(res => {
                        // console.log(res,'res');
                        this.handleData = res.data.data;
                        this.loading = false;
                    }).catch(error => {
                        console.log(error,'error');
                        this.$message.error('待办任务处理明细加载失败！');
                        this.loading = false;
                    });
                }
            }
        },
        // 页数
        currentChange(val) {
            this.current = val;
            this.onTabClick();
        },
        // 条数
        pageSizeChange(val) {
            this.pageSize = val;
            this.onTabClick();
        },
    }
}
</script>
<style scoped lang="less">
.detail_log {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
/deep/ .el-tabs__content {
    flex: 1;
    .el-tab-pane {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
}
.tablePagination_modular {
    width: 100%;
    height: 100%;
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
</style>