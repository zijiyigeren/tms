<template>
    <!-- 日志管理 -->
    <div class="journal_border">
        <div class="journal__con">
            <!-- 查询 -->
            <div class="query_modular">
                <el-form :inline="true" :model="queryForm" class="query_form" label-width="90px">
                    <el-form-item label="操作人：">
                        <el-input 
                            v-model="queryForm.operateName" 
                            placeholder="操作人"
                            clearable
                            name="clearInputValue" 
                            @keyup.enter.native="onPressEnter"></el-input>
                    </el-form-item>
                    <el-form-item label="操作时间：" class="oper_date">
                        <el-date-picker
                            v-model="queryForm.operateTimeStart"
                            type="date"
                            placeholder="开始日期"
                            :picker-options="pickerOptionsStart">
                        </el-date-picker>
                        &nbsp;到&nbsp;
                        <el-date-picker
                            v-model="queryForm.operateTimeEnd"
                            type="date"
                            placeholder="结束日期"
                            :picker-options="pickerOptionsEnd">
                        </el-date-picker>
                    </el-form-item>
                </el-form>

                <!-- 操作按钮 -->
                <div class="query_btn">
                    <el-button type="primary" @click="onQuery(1,10)">查询</el-button>
                </div>

            </div>

            <!-- 表格与分页 -->
            <div class="tablePagination_modular">
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table
                        border stripe
                        :data="tableData"
                        :header-cell-style="{
                            'background-color': 'rgba(243,246,253,1)',
                            'color': '#606266',
                            'padding': '10px 0'}">
                        <el-table-column align="center" :resizable="false" prop="operateName" label="操作人"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="ip" label="登录IP地址"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="browser" label="浏览器"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="operateTime" label="登录时间"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="content" label="操作内容"></el-table-column>
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
import moment from 'moment';
export default {
    name: 'systemlogmanagement',
    data(){
        const than = this;
        return {
            loading: false, // 加载状态
            total: 0, // 总数
            current:1, // 页数
            pageSize:10, // 条数
            tableData: [], // 列表数据
            queryForm: { // 查询菜单
                operateName: '', // 操作人
                operateTimeStart: '', // 开始日期
                operateTimeEnd: '', // 结束日期
                pageNo: '',
                pageSize: ''
            },
            pickerOptionsStart: {
                disabledDate(time) {
                    if(than.queryForm.operateTimeEnd){
                        return time > than.queryForm.operateTimeEnd;
                    }
                }
            },
            pickerOptionsEnd: {
                disabledDate(time) {
                    if(than.queryForm.operateTimeStart){
                        return time < than.queryForm.operateTimeStart;
                    }
                }
            },
        }
    },
    mounted() {
        this.onQuery(this.current, this.pageSize);
    },
    methods:{
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
        // 点击查询
        onQuery(current, pageSize){
            this.loading = true;
            let timeStart = ''; // 开始日期
            let timeEnd = ''; // 结束日期
            if(this.queryForm.operateTimeStart){
                let dates = new Date(this.queryForm.operateTimeStart).toJSON();
                let date = new Date(+new Date(dates) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                timeStart = date;
            }else{
                timeStart = '';
            }
            if(this.queryForm.operateTimeEnd){
                let dates = new Date(this.queryForm.operateTimeEnd).toJSON();
                let date = new Date(+new Date(dates) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                timeEnd = date;
            }else{
                timeEnd = '';
            }
            let params = {
                operateName: this.queryForm.operateName,
                operateTimeStart: timeStart,
                operateTimeEnd: timeEnd,
                pageNo: current,
                pageSize: pageSize
            }
            this.$api.systemcachetimg.apiLog(params).then(res => {
                this.loading = false;
                let data = res.data.data;
                if(data && data.list.length > 0){
                    res.data.data.list.map(item => {
                        item.operateTime = moment(item.operateTime).format('YYYY-MM-DD HH:mm:ss');
                    });
                    this.tableData = data.list;
                }
                if(data && data.count > 0) {
                    this.total = data.count;
                    this.current = current;
                    this.pageSize = pageSize;
                } else {
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
                this.tableData = [];
            })
        },
        // 回车查询
        onPressEnter(e){
            if( e.keyCode && e.keyCode == 13 ){
                this.onQuery(1,10);
            }
        },
    }
}
</script>
<style lang="scss" scoped>
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

.journal_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}

/deep/ .journal__con {
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
        padding: 0;
        display: flex;
        .query_form {
            flex: 1;
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
            padding-right: 40px;
            margin: 0 !important;
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
    .oper_date {
        width: 40%;
        .el-form-item__content  {
            display: flex;
        }
    }
}
</style>
