<template>
    <!-- 零部件列表 -->
    <div class="noticehistory_border">
        <div class="noticehistory_con">
            <!-- 查询 -->
            <div class="query_modular">
                <div class="query_complex">
                    <el-form :inline="true" :model="queryForm" class="query_form" label-width="100px">
                        <el-form-item label="企业名称：">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                placeholder="请输入企业名称" v-model.trim="queryForm.entName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="产品商标：">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                placeholder="请输入产品商标" v-model.trim="queryForm.brand">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="产品型号：">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                placeholder="请输入产品型号" v-model.trim="queryForm.model">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="产品名称：">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                placeholder="请输入产品名称" v-model.trim="queryForm.name">
                            </el-input>
                        </el-form-item>
                        <!-- <el-form-item label="方案状态：" v-show="showState">
                            <el-select v-model="queryForm.status">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已提交" value="1"></el-option>
                                <el-option label="已下达" value="2"></el-option>
                                <el-option label="已上传" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="任务状态：" v-show="showState">
                            <el-select v-model="queryForm.taskid">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已下达" value="1"></el-option>
                                <el-option label="未下达" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="产品类型：" v-show="showState">
                            <el-select v-model="queryForm.proType">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="new" value="新产品"></el-option>
                                <el-option label="gzkz" value="扩展"></el-option>
                                <el-option label="C" value="整车整改"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="地区：" v-show="showState">
                            <el-select v-model="queryForm.ifrom2">
                                <el-option v-for="(item,i) in regionList"
                                            :key="i"
                                            :label="item.title"
                                            :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="接受日期>=" v-show="showState">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter" 
                                placeholder="YYYYMMDD" v-model.trim="queryForm.days3">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="接受日期<=" v-show="showState">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                placeholder="YYYYMMDD" v-model.trim="queryForm.days4">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="计划员：" v-show="showState">
                            <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                placeholder="请输入计划员" v-model.trim="queryForm.heador">
                            </el-input>
                        </el-form-item> -->
                    </el-form>

                    <!-- 展开/收起 -->
                    <!-- <div class="query_show">
                        <el-button v-if="showbut!=0" @click="onClickShow(0)" type="text" class="query_showBtn">
                            收起 <i class="el-icon-arrow-up"></i>
                        </el-button>
                        <el-button v-else-if="showbut==0" @click="onClickShow(1)" type="text" class="query_showBtn">
                            展开 <i class="el-icon-arrow-down"></i>
                        </el-button>
                    </div> -->
                </div>
                <!-- 查询按钮 -->
                <div class="query_btn">
                    <p>
                        
                    </p>
                    <p class="query_rightbtn">
                        <el-button type="primary" @click="onQuery(1,10)">查询</el-button>
                        <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button>
                    </p>
                </div>
            </div>
            <!-- 表格与分页 -->
            <div v-loading="loading" class="tablePagination_modular">
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table 
                        border stripe 
                        ref="table" :data="tableList"
                        :header-cell-style="{
                        'background-color': 'rgba(243,246,253,1)',
                        'color': '#606266',
                        'padding': '10px 0'}">
                        <el-table-column align="center" :resizable="false" label="任务地区">
                            <template slot-scope="scope">
                                <span v-if="scope.row.ifrom3 == 1 || scope.row.ifrom3 == 0 || scope.row.ifrom3 == null">不确定</span>
                                <span v-if="scope.row.ifrom3 == 2">天津</span>
                                <span v-if="scope.row.ifrom3 == 3">宁波</span>
                                <span v-if="scope.row.ifrom3 == 4">天津&宁波</span>
                                <span v-if="scope.row.ifrom3 == 5">河北</span>
                                <span v-if="scope.row.ifrom3 == 6">汉阳</span>
                                <span v-if="scope.row.ifrom3 == 7">济南</span>
                                <span v-if="scope.row.ifrom3 == 8">广西</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="taskCode" label="任务号"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="entName" label="企业名称"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="model" label="产品型号"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="name" label="产品名称"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="brand" label="产品商标"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="proType" label="产品类别"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="status" label="状态">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status == '2'">已下达</span>
                                <span v-if="scope.row.status == '1'">已提交</span>
                                <span v-if="scope.row.status == '3'">已上传</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="changeTime" label="接受日期"></el-table-column>
                        <el-table-column align="center" :resizable="false" label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button type="text" class="operation_btn" @click="onDetails(scope.row)">详情</el-button>
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

        <!-- 详情对话框 -->
        <el-dialog
            :title="dialogDetailsTitle"
            :visible.sync="detailsVisible"
            :fullscreen="true"
            class="details_dialog">
            <Programmedetails :detailsDataList="detailsDataList"></Programmedetails>
        </el-dialog>
    </div>
</template>
<script>
import base from "@/api/base.js";
import Programmedetails from '@/components/Programmedetails.vue'; // 详情
export default {
    name: '',
    props: { },
    components: {Programmedetails,},
    data() {
        return {
            currentDate: '', // 当前日期
            loading: false, // 加载状态
            showbut: 0, // 展开/收起-状态
            showState: false, // 查询框显示状态
            total: 0, // 总数
            current: 1, // 页数
            pageSize: 10, // 条数
            multipleSelection: [], // 表格选中数据
            tableList: [], // 表格数据
            queryForm: { // 查询数据
                entName: '', // 企业名称
                brand: '', // 产品商标
                model: '', // 产品型号
                name: '', // 产品名称
                // status: '', // 方案状态
                // taskid: '', // 任务状态
                // proType: '', // 产品类型
                // ifrom2: '', // 地区
                // days3: '', // 接受日期 >=
                // days4: '', // 接受日期 <=
                // heador: '', // 计划员
            },
            regionList: [ // 查询-地区
                {title: '全部', id: 0},
                {title: '不确定', id: 1},
                {title: '天津', id: 2},
                {title: '宁波', id: 3},
                {title: '天津&宁波', id: 4},
                {title: '河北', id: 5},
                {title: '汉阳', id: 6},
                {title: '济南', id: 7},
                {title: '广西', id: 8}
            ],
            dialogDetailsTitle: '新产品公告历史详情', // 详情对话框标题
            detailsVisible: false, // 详情对话框的显示隐藏
            detailsDataList: [], // 详情页面数据
        }
    },
    created() {

    },
    mounted() {
        this.onQuery(1,10);
        this.getDate(); // 获取当前日期
    },
    methods: {
        // 获取当前日期
        getDate() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            this.currentDate = year + "-" + month + "-" + day;
        },
        // 展开/收起_点击
        onClickShow(val) {
            this.showbut = val;
            this.showState = !this.showState;
        },
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
            let params = this.queryForm;
            params.currentPage = current;
            params.pageSize = pageSize;
            //console.log(params, '查询数据');
            this.$api.notice.gethistoryList(params).then(res => {
                // console.log(res, '查询成功res');
                this.loading = false;
                if(res.data.data.length > 0 && res.data.data[0].total > 0){
                    this.tableList = res.data.data;
                    this.current = current;
                    this.pageSize = pageSize;
                    this.total = res.data.data[0].total;
                }else{
                    this.tableList = [];
                    this.current = 1;
                    this.pageSize = 10;
                    this.total = 0;
                }
            }).catch((error) => {
                //console.log(error, '查询失败error');
                this.$message.error(error.data.message);
                this.loading = false;
                this.tableList = [];
                this.current = 1;
                this.pageSize = 10;
                this.total = 0;
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
                entName: '', // 企业名称
                brand: '', // 产品商标
                model: '', // 产品型号
                name: '', // 产品名称
                // status: '', // 方案状态
                // taskid: '', // 任务状态
                // proType: '', // 产品类型
                // ifrom2: '', // 地区
                // days3: '', // 接受日期 >=
                // days4: '', // 接受日期 <=
                // heador: '', // 计划员
            };
            this.onQuery(1,10);
        },
        // 详情
        onDetails(row) {
            this.loading = true;
            let params = {
                downtype: 2,
                d: {id: row.id},
            }
            this.$api.notice.apiZjparamDetail(params).then(res => {
                this.loading = false;
                this.detailsVisible = true;
                this.detailsDataList = res.data.data;
            }).catch((error) => {
                this.loading = false;
                this.$message.error('error.data.message');
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

.noticehistory_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}

/deep/ .noticehistory_con {
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
        .query_complex {
            width: 100%;
            display: flex;
            position: relative;
            .query_form {
                flex: 1;
            }
            .query_show {
                width: 50px;
                position: relative;
                .query_showBtn {
                    position:absolute;
                    top:50%;
                    left:50%;
                    transform:translate(-50%,-50%);
                    color:#32AFF0;
                    padding: 10px 0;
                    border: none;
                }
            }
        }
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
            padding-right: 60px;
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

// 详情对话框
/deep/ .details_dialog {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .el-dialog {
        margin: 0 !important;
        padding: 0 !important;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            padding: 0;
            overflow: hidden;
        }
    }
}

</style>
