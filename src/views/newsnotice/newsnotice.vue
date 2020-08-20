<template>
    <!-- 消息通知-列表 -->
    <div class="news_notice">
        <div class="newsnotice_con">
            <!-- 查询 -->
            <div class="query_modular">
                <el-form :inline="true" :model="queryForm" class="query_form">
                    <el-form-item label="发布者：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                            placeholder="请输入发布者" v-model.trim="queryForm.publishor"></el-input>
                    </el-form-item>
                    <el-form-item label="发布日期：" class="form_item_startTime">
                        <el-date-picker
                            v-model="queryForm.startTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="状态：">
                        <el-select v-model="queryForm.status" placeholder="请选择状态">
                            <el-option label="全部" value="2"></el-option>
                            <el-option label="已读" value="1"></el-option>
                            <el-option label="未读" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型：">
                        <el-select v-model="queryForm.type" placeholder="请选择类型">
                            <el-option label="全部" value="2"></el-option>
                            <el-option label="待办" value="1"></el-option>
                            <el-option label="通知" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="query_btn">
                    <p>
                        <el-button type="primary" @click="onAlreadyRead" v-if="queryForm.status==0">批量已读</el-button>
                    </p>
                    <p>
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
                        <el-table-column align="center" :resizable="false" type="selection" width="60"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="publishor" label="发布者" width="180"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="createtime" label="发布日期" width="180"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="content" label="消息内容"></el-table-column>
                        <el-table-column align="center" :resizable="false" label="操作" width="160">
                            <template slot-scope="scope">
                                <el-button type="text" @click="onDetails(scope.row)">详情</el-button>
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
                    :page-size="pageSize"
                    :page-sizes="[10,20,30]"
                    @current-change="currentChange"
                    @size-change="pageSizeChange">
                </el-pagination>
            </div>
        </div>

        <!-- 详情-对话框 -->
        <el-dialog width="60%" title="详情" class="dialog_newsnotice"
            :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="newsNoticeVisible">
            <el-form :model="newsNoticeForm" class="newsnotice_form">
                <el-form-item label="发布者：">
                    <el-input v-model="newsNoticeForm.publishor" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="发布日期：">
                    <el-input v-model="newsNoticeForm.createtime" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="消息内容：">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="newsNoticeForm.content" :disabled="true">
                    </el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'newsnotice',
    props: [],
    components: {},
    data() {
        return {
            loading: false,
            total: 0, // 总数
            current: 1, // 页数
            pageSize: 10, // 条数
            tableList: [], // 表格数据
            multipleSelection: [], // 表格选中数据
            queryForm: { // 查询数据
                publishor: '',
                startTime: '',
                endTime: '',
                status: '0',
                type: '2',
            }, 
            newsNoticeVisible: false, // 详情-显示状态
            newsNoticeForm: { // 详情-表单数据
                publishor: '',
                createtime: '',
                content: '',
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
        // 表格选择
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 查询
        onQuery(current,pageSize) {
            this.loading = true;
            let params = {}
            for(var i in this.queryForm) {
                params[i] = this.queryForm[i];
            }
            if (this.queryForm.startTime && Array.isArray(this.queryForm.startTime)) {
                params.endTime = this.queryForm.startTime[1];
                params.startTime = this.queryForm.startTime[0];
            };
            params.currentPage = current; 
            params.pageSize = pageSize;
            // console.log(params, '查询数据');
            this.$api.newsnotice.findMessage(params).then(res => {
                // console.log(res, '查询成功res');
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
                console.log('查询失败',error);
                this.$message.error('查询失败');
                this.tableList = [];
                this.loading = false;
                this.total = 0;
                this.current = 1;
                this.pageSize = 10;
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
                publishor: '',
                startTime: '',
                endTime: '',
                status: '0',
                type: '2',
            };
            this.onQuery(1,10);
        },
        // 批量已读
        onAlreadyRead() {
            let mlist = '';
            if(this.multipleSelection.length > 0) {
                this.loading = true;
                this.multipleSelection.forEach(item => {
                    mlist += item.id + ',';
                });
                mlist = mlist.slice(0,mlist.length-1);
                this.$api.newsnotice.setIsRead({mlist}).then(res => {
                    // console.log(res, '批量已读成功res');
                    this.$message.success('设置成功');
                    this.onQuery(1,10);
                }).catch((error) => {
                    console.log(error, '批量已读失败error');
                    this.$message.error('设置失败');
                    this.onQuery(1,10);
                });
            } else {
                this.$message.warning('请先选择需要处理的消息，再进行该操作！')
            }
            
        },
        // 详情
        onDetails(row) {
            for (let i in this.newsNoticeForm) {
                this.newsNoticeForm[i] = row[i];
            }
            this.newsNoticeVisible = true;
        },
        // 删除
        onDelete(row) {
            this.loading = true;
            this.$api.newsnotice.delMessage({id: row.id}).then(res => {
                // console.log(res, '删除成功res');
                this.$message.success('删除成功');
                this.onQuery(this.current,this.pageSize);
            }).catch((error) => {
                console.log(error, '删除失败error');
                this.$message.error('删除失败');
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

.news_notice {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}

/deep/ .newsnotice_con {
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
        width: 20%;
        display: flex;
        align-items: center;
        overflow: hidden;
        .el-form-item__label {
            white-space: nowrap;
        }
        .el-form-item__content {
            flex: 1;
            padding-right: 40px;
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
    .form_item_startTime {
        width: 40%;
    }
}

// 详情对话框
/deep/ .dialog_newsnotice {
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

// 详情
/deep/ .newsnotice_form {
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
            .el-select, .el-input, .el-date-editor{
                width: 100% !important;
            }
            .el-input__inner, .el-textarea__inner {
                color: #8a8a8a;
            }
        }
    }
}
</style>