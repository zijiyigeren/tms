
<template>
    <!-- 新产品公告 -->
    <div class="notice_border">
        <div class="notice_con">
            <!-- 查询 -->
            <div class="query_modular">
                <div class="query_complex">
                    <el-form :inline="true" ref="formQuery" :model="formQuery" label-width="110px" class="query_form">
                        <el-form-item label="企业名称：">
                            <el-input v-model.trim="formQuery.entName" @keyup.enter.native="enterQuery"
                                    name="clearInputValue" clearable />
                        </el-form-item>
                        <el-form-item label="产品型号：">
                            <el-input v-model.trim="formQuery.model" @keyup.enter.native="enterQuery"
                                    name="clearInputValue" clearable />
                        </el-form-item>
                        <el-form-item label="产品名称：">
                            <el-input v-model.trim="formQuery.name" @keyup.enter.native="enterQuery"
                                    name="clearInputValue" clearable />
                        </el-form-item>
                        <el-form-item label="产品商标：">
                            <el-input v-model.trim="formQuery.brand" @keyup.enter.native="enterQuery"
                                    name="clearInputValue" clearable />
                        </el-form-item>
                        <el-form-item label="方案状态：" v-show="showState">
                            <el-select v-model="formQuery.status">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已提交" value="1"></el-option>
                                <el-option label="已下达" value="2"></el-option>
                                <el-option label="已上传" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="任务状态：" v-show="showState">
                            <el-select v-model="formQuery.taskid">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已下达" value="1"></el-option>
                                <el-option label="未下达" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="产品类型：" v-show="showState">
                            <el-select v-model="formQuery.proType">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="新产品" value="new"></el-option>
                                <el-option label="扩展" value="gzkz"></el-option>
                                <el-option label="整车整改" value="C"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="计划员：" v-show="showState">
                            <el-input v-model.trim="formQuery.heador" @keyup.enter.native="enterQuery"
                                    name="clearInputValue" clearable />
                        </el-form-item>
                        <el-form-item label="接受日期 >=" v-show="showState">
                            <el-input v-model.trim="formQuery.days3" placeholder="YYYYMMDD" @keyup.enter.native="enterQuery"
                                    name="clearInputValue" clearable />
                        </el-form-item>
                        <el-form-item label="接受日期 <=" v-show="showState">
                            <el-input v-model.trim="formQuery.days4" placeholder="YYYYMMDD" @keyup.enter.native="enterQuery"
                                    name="clearInputValue" clearable />
                        </el-form-item>
                        <el-form-item label="期号：" v-show="showState">
                            <el-input v-model.trim="formQuery.qh" @keyup.enter.native="enterQuery"
                                    name="clearInputValue" clearable />
                        </el-form-item>
                    </el-form>

                    <!-- 展开/收起 -->
                    <div class="query_show">
                        <el-button v-if="showbut!=0" @click="clickshowbut(0)" type="text" class="query_showBtn">
                            收起 <i class="el-icon-arrow-up"></i>
                        </el-button>
                        <el-button v-else-if="showbut==0" @click="clickshowbut(1)" type="text" class="query_showBtn">
                            展开 <i class="el-icon-arrow-down"></i>
                        </el-button>
                    </div>
                </div>

                <!-- 查询按钮 -->
                <div class="query_btn">
                    <p>
                        <el-button type="primary" @click="batchDownload(10)">批量未完成统计表</el-button>
                        <el-button type="primary" @click="batchDownload(2)">批量已完成统计表</el-button>  
                    </p>
                    <p class="query_rightbtn">
                        <el-button type="primary" @click="onClickQuery(formQuery,1,10)">查询</el-button>
                        <!-- <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button> -->
                    </p>
                </div>

            </div>
            <!-- 表格与分页 -->
            <div v-loading="loading" class="tablePagination_modular">
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table
                        border stripe :data="tablelist"
                        :header-cell-style="{
                        'background-color': 'rgba(243,246,253,1)',
                        'color': '#606266',
                        'padding': '10px 0'}"
                        @selection-change="selectionChange">
                        <el-table-column type="selection" align="center" :resizable="false"></el-table-column>
                        <el-table-column label="任务地区" align="center" :resizable="false">
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
                        <el-table-column prop="taskCode" label="任务号" align="center" :resizable="false"></el-table-column>
                        <el-table-column prop="entName" label="企业名称" align="center" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="model" label="产品型号" align="center" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="name" label="产品名称" align="center" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="brand" label="产品商标" align="center" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="产品类别" align="center" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.proType == 'new'">新产品</span>
                                <p v-else>
                                    <span v-if="scope.row.zgsign == '1'">整车整改</span>
                                    <span v-else>扩展</span>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="center" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status == '2'">已下达</span>
                                <span v-if="scope.row.status == '1'">已提交</span>
                                <span v-if="scope.row.status == '3'">已上传</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="changeTime" label="接受日期" align="center" :resizable="false"></el-table-column>
                        <el-table-column v-if="tableBtn" label="操作" align="center" :resizable="false" width="380">
                            <template slot-scope="scope">
                                <el-button type="text" @click="onClickDetails(scope.row)">详情</el-button>
                                <el-button type="text" @click="onClickRelease(scope.row)">下达</el-button>
                                <el-button type="text" @click="onClickTransfer(scope.row)">迁移</el-button>
                                <!-- 迁移-判断 v-if="scope.row.status == '3' || scope.row.status == '2'" -->
                                <el-button type="text" @click="onClickLoad(scope.row)" :loading="scope.row.loading">加载</el-button>
                                <!-- <el-button type="text" @click="onClickMerge(scope.row)">合并</el-button> -->
                                <el-button type="text" @click="onClickStatistics(scope.row, 0)">下统计</el-button>
                                <el-button type="text" @click="onClickComplete(scope.row, 2)">下完成</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <!-- 分页 -->
                <el-pagination
                    class="pagination_modular"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :page-sizes="[10,20,30]"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange">
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

        <!-- 选择整车型号 -->
        <el-dialog title="选择整车型号" :visible.sync="choiceModelVisible" class="choice_model" width="80%">
            <Choicemodel :choiceModelVisible="choiceModelVisible" @closeReleaseVisible="onCloseReleaseVisible" />
        </el-dialog>

        <!-- 任务下达 -->
        <el-dialog title="任务下达" :visible.sync="taskReleaseVisible" class="choice_model" width="80%">
            <div class="task_release_table">
                <div class="task_release_content">
                    <el-table
                        border
                        stripe
                        v-loading="loading"
                        :data="taskTablelist"
                        :header-cell-style="{
                            'background-color': 'rgba(243,246,253,1)',
                            'color': '#606266',
                            'padding': '10px 0'
                        }">
                        <el-table-column prop="seq" label="项目代码" align="center" :resizable="false"></el-table-column>
                        <el-table-column prop="standard" label="项目依据" align="center" :resizable="false"></el-table-column>
                        <el-table-column label="替换依据" align="center" :resizable="false" class-name="standard_class">
                        <template slot-scope="scope">
                            <div style="display:flex;justifyContent:center;alignItems:center;">
                            <el-select size="medium" style="width:160px;" v-model="scope.row.standards">
                                <el-option v-for="(item,i) in scope.row.list" :key="i"
                                :label="item.items_test_basis+'--'+item.items_itme_name"
                                :value="item.ids+':'+item.items_test_basis"></el-option>
                            </el-select>
                            </div>
                        </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div slot="footer">
                <el-button @click="taskReleaseVisible = false">关 闭</el-button>
                <el-button type="primary" @click="onClickContinueRelease">继续下达</el-button>
            </div>
        </el-dialog>

        <!-- 下统计 -->
        <div class="choice_statistics" v-if="statisticsVisible">
            <div class="el_dialog">
                <div class="el_dialog__header">
                    <span>下统计</span>
                    <el-button type="text" class="el_dialog_btnclose" @click="statisticsVisible=false">
                        <i class="el-icon-close"></i>
                    </el-button>
                </div>
                <div class="el_dialog__body">
                    <load :copypage="3"
                        :rowData="rowData"
                        :rowStatisticsId="rowStatisticsId"
                        @closeBindingProgramme="onCloseBindingProgramme"
                    />
                </div>
                <div class="el_dialog__footer"></div>
            </div>
        </div>

        <!-- 统计表下载--插件 -->
        <object style="display:none" id="STATICTABLE" classid="clsid:0B846D4B-EB6C-4a15-A415-FF0785D39320" Width="0" Height="0"></object>

    </div>
</template>

<script>
import base from '@/api/base'
import Programmedetails from '@/components/Programmedetails.vue'; // 详情
import Choicemodel from './component/choiceModel.vue'; // 选择整车型号
import load from './load.vue'; // 统计表下载
export default {
    name: 'notice',
    components: {Programmedetails, Choicemodel, load},
    data() {
        return {
            total: 0, // 总条数
            currentPage: 1, // 当前页
            pageSize: 10, // 每页的条数
            loading: false, // 加载状态
            tablelist: [], // table数据
            taskTablelist: [], // 任务下达table数据
            tableBtn: false, // table操作按钮列是否展示
            formQuery: { // 查询表单数据
                entName: '', // 企业名称
                model: '', // 产品型号
                name: '', // 产品名称
                brand: '', // 产品商标
                status: '', // 方案状态
                taskid: '', // 任务状态
                proType: '', // 产品类型
                heador: '', // 计划员
                days3: '', // 接受日期>=
                days4: '', // 接受日期<=
                qh: '0' // 期号
            },
            showState: false, // 收起/展开--状态
            showbut: 0, // 收起/展开--内容
            dialogDetailsTitle: '新产品公告详情', // 详情对话框标题
            detailsVisible: false, // 详情对话框的显示隐藏
            detailsDataList: [], // 详情页面数据
            choiceModelVisible: false, // 选择整车型号对话框的显示隐藏
            taskReleaseVisible: false, // 任务下达对话框的显示隐藏
            releaseID: '', // 下达id
            statisticsVisible: false, // 下统计对话框的显示隐藏
            rowData: null, // 下统计传参
            rowStatisticsId: '', // 下统计id
            multipleSelection: [], // 复选框数据
        }
    },
    created() { },
    mounted() {
        this.getListData();
    },
    methods: {
        // 点击收起/展开
        clickshowbut(num) {
            this.showState = !this.showState;
            this.showbut = num;
        },
        // 复选框选中
        selectionChange(val) {
            this.multipleSelection = val
        },
        // 分页器-设置每条的页数
        handleSizeChange(val) {
            this.pageSize = val;
            this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
        },
        // 分页器-当前页发生改变时
        handleCurrentChange(val) {
            this.currentPage = val;
            this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
        },
        // 获取列表数据
        getListData() {
            this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
        },
        // 点击查询
        onClickQuery(formQuery, currentPage, pageSize) {
            let flag = true;
            this.loading = true;
            formQuery.currentPage = currentPage;
            formQuery.pageSize = pageSize;

            if(formQuery.days4){
                flag = false;
                let dateArray = formQuery.days4.match(/^(\d{4})(\d{2})(\d{2})$/);
                if(dateArray == null){
                this.$message({type: 'warning', message: '日期格式不正确，请修改！', duration: 1500});
                }else{
                let year = dateArray[1],
                    month = dateArray[2],
                    day = dateArray[3];
                if (1900 > year) {
                    this.$message({type: 'warning', message: '年值不能小于1900年，请修改！', duration: 1500});
                }else if (month < 1 || month > 12) {
                    this.$message({type: 'warning', message: '月份应为1到12的整数，请修改！', duration: 1500});
                }else if ((month==4 || month==6 || month==9 || month==11) && day==31) {
                    this.$message({type: 'warning', message: month+'月不存在31号，请修改！', duration: 1500});
                }else if (month==2) {
                    var isleap=(year % 4==0 && (year % 100 !=0 || year % 400==0));
                    if (day > 29) {
                    this.$message({type: 'warning', message: '2月最多有29天，请修改！', duration: 1500});
                    }else if ((day==29) && (!isleap)){
                    this.$message({type: 'warning', message: '闰年2月才有29天，请修改！', duration: 1500});
                    }
                }else if (day < 1 || day > 31) {
                    this.$message({type: 'warning', message: '每个月的天数应该为1到31的整数，请修改！', duration: 1500});
                }else{
                    flag = true;
                }
                }
            }
            if(formQuery.days3){
                flag = false;
                let dateArray = formQuery.days3.match(/^(\d{4})(\d{2})(\d{2})$/);
                if(dateArray == null){
                this.$message({type: 'warning', message: '日期格式不正确，请修改！', duration: 1500});
                }else{
                let year = dateArray[1],
                    month = dateArray[2],
                    day = dateArray[3];
                if (1900 > year) {
                    this.$message({type: 'warning', message: '年值不能小于1900年，请修改！', duration: 1500});
                }else if (month < 1 || month > 12) {
                    this.$message({type: 'warning', message: '月份应为1到12的整数，请修改！', duration: 1500});
                }else if ((month==4 || month==6 || month==9 || month==11) && day==31) {
                    this.$message({type: 'warning', message: month+'月不存在31号，请修改！', duration: 1500});
                }else if (month==2) {
                    var isleap=(year % 4==0 && (year % 100 !=0 || year % 400==0));
                    if (day > 29) {
                    this.$message({type: 'warning', message: '2月最多有29天，请修改！', duration: 1500});
                    }else if ((day==29) && (!isleap)){
                    this.$message({type: 'warning', message: '闰年2月才有29天，请修改！', duration: 1500});
                    }
                }else if (day < 1 || day > 31) {
                    this.$message({type: 'warning', message: '每个月的天数应该为1到31的整数，请修改！', duration: 1500});
                }else{
                    flag = true;
                }
                }
            }

            if(flag) {
                this.$api.notice.apiZjparamList(formQuery).then(res => {
                    this.loading = false;
                    let data = res.data.data.list;
                    let message = res.data.message;
                    if(message == '1'){
                        this.tableBtn = true;
                    }else{
                        this.tableBtn = false;
                    }
                    this.tablelist = data;
                    if(this.tablelist.length > 1 ){
                        this.tablelist.forEach(item => {
                            this.$set(item,'loading',false);
                        });
                    } else if(this.tablelist.length == 1 ) {
                        this.$set(this.tablelist[0],'loading',false);
                    }
                    if(data.length > 0){
                        this.total = data[0].total>0 ? data[0].total : 0;
                        this.currentPage = currentPage;
                        this.pageSize = pageSize;
                    }else{
                        this.total = 0;
                        this.currentPage = 1;
                        this.pageSize = 10;
                    }
                }).catch((error) => {
                    console.log('查询错误',error);
                    this.$message.error(error.data.message);
                    this.loading = false;
                    this.total = 0;
                    this.currentPage = 1;
                    this.pageSize = 10;
                })
            }

        },
        // 回车查询
        enterQuery(e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode == 13) {
                this.onClickQuery(this.formQuery, 1, 10);
            }
        },
        // 点击详情
        onClickDetails(row) {
            let params = {
                d:{id: row.id}
            }
            this.$api.notice.apiZjparamDetail(params).then(res => {
                this.detailsVisible = true;
                this.detailsDataList = res.data.data;
            }).catch((error) => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
            });
        },
        // 点击下达-判断是否要选择整车
        onClickRelease(row) {
            if(row.name.indexOf("底盘")!=-1){
                this.$confirm('选择整车型号吗？', '信息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.choiceModelVisible = true;
                }).catch(() => {
                    this.choiceModelVisible = false;
                    this.$confirm('确认要下达吗', '信息', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.taskRelease(row);
                    }).catch(() => {
                        this.$message({ type: 'info', message: '已取消下达', duration: 1500 });
                    });
                });
            }else{
                this.choiceModelVisible = false;
                this.$confirm('确认要下达吗', '信息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.taskRelease(row);
                }).catch(() => {
                    this.$message({ type: 'info', message: '已取消下达', duration: 1500 });
                });
            }
        },
        // 下达接口
        taskRelease(row) {
            this.loading = true;
            this.releaseID = row;
            let params = {
                proType: row.proType,
                taskid: row.taskid,
                id: row.id
            };
            this.$api.notice.apiZjparamToTask(params).then(res => {
                // console.log('下达成功',res);
                let data = res.data.data;
                if(data.ti && data.ti.list && data.ti.list.length > 0){
                    data.ti.list.forEach(item => {
                        if(item.list.length > 0){
                            item.standards = item.list[0].ids+':'+item.list[0].items_test_basis;
                        }
                    });
                    this.taskTablelist = data.ti.list;
                    this.loading = false;
                    this.taskReleaseVisible = true;
                } else {
                    this.$message.success(data);
                    this.taskTablelist = [];
                    this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
                }
            }).catch(error => {
                this.$message({ type: 'error', message: error.data.message , duration: 1500 });
                
                console.log('下达失败',error);
                this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
            });
        },
        // 关闭整车型号对话框
        onCloseReleaseVisible() {
            this.choiceModelVisible = false;
            this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
        },
        // 点击继续下达
        onClickContinueRelease() {
            let arr = this.taskTablelist;
            if(arr.length > 0 && this.releaseID){
                let data = arr.map(item => {
                    let list = item.standards.split(':');
                    let obj = {};
                    obj.itemId = item.itemId;
                    obj.seq = item.seq;
                    obj.standard = item.standard;
                    obj.list = [{
                        ids: list[0],
                        items_test_basis: list[1]
                    }]
                    return obj;
                });
                let params = {
                    d: {
                        id: this.releaseID.id,
                        proType: this.releaseID.proType
                    },
                    ti: {
                        list: data
                    }
                }
                this.$api.notice.apiZjparamEditItems(params).then(res => {
                    this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                    this.taskReleaseVisible = false;
                    this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
                }).catch(error => {
                    this.$message({type: 'error', message: error.data.message, duration: 1500});
                    this.taskReleaseVisible = false;
                    this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
                });
            }
        },
        // 点击迁移
        onClickTransfer(row) {
            this.loading = true;
            let params = {
                id: row.id
            }
            this.$api.notice.apiZjparamTomove(params).then(res => {
                this.$message.success(res.data.data);
                this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
            }).catch(error => {
                this.$message.error(error.data.message);
                this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
            });
        },
        // 点击加载
        onClickLoad(row) {
            row.loading = true;
            let params = {
                id: row.id
            }
            this.$api.notice.apiZjparamUpload(params).then(res => {
                row.loading = false;
                this.$message.success(res.data.data);
                this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
            }).catch(error => {
                row.loading = false;
                this.$message.error(error.data.message);
                this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
            });
        },
        // 点击合并
        onClickMerge(row) {
            this.loading = true;
            let params = {
                id: row.id
            }
            this.$api.notice.apiZjparamBing(params).then(res => {
                this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
            }).catch(error => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
                this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
            });
        },
        // 点击下统计
        onClickStatistics(row, downtype) {
            this.loading = true;
            this.rowStatisticsId = row;
            let params = {
                taskid: row.id,
                downtype: downtype
            }
            this.$api.notice.apiFindDisproductById(params).then(res => {
                let data =  res.data.data;
                if(data == null || data.taskid == null || data.taskid == "") {
                    let getQuery = {
                        id: row.id
                    }
                    this.$api.notice.apiSearchTaskBind(getQuery).then(res => {
                        this.rowData = res.data.data;
                        this.statisticsVisible = true;
                        this.loading = false;
                    }).catch(error => {
                        this.$message.error(error.data.message);
                        this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
                    });
                }else{
                    this.loading = false;
                    let t_mode = data.model;
                    t_mode = t_mode.replace("/","");
                    var obj = document.getElementById("STATICTABLE");
                    try {
                        obj.downstatic0(downtype+'', data.id, base.baseImgTable+base.baseUrl+"/", data.taskid, data.entName, data.name, t_mode, data.brand);
                    } catch (error) {
                        console.log(error, '新产品-下统计')
                        this.$message.warning('请检查插件是否有误，并且是在ie下执行');
                    }
                }
            }).catch(error => {
                this.$message.error(error.data.message);
                this.onClickQuery(this.formQuery, this.currentPage, this.pageSize);
            });
        },
        // 关闭下统计的绑定对话框
        onCloseBindingProgramme(taskid, row) {
            this.statisticsVisible = false;
            this.rowStatisticsId = '';
            var obj = document.getElementById("STATICTABLE");
            try {
                obj.downstatic0('0', row.id, base.baseImgTable+base.baseUrl+"/", taskid, row.entName, row.name, row.model, row.brand);
            } catch (error) {
                console.log(error, '新产品-下统计')
                this.$message({ type: 'warning', message: '请检查插件是否有误，并且是在ie下执行', duration: 1500 });
            }
        },
        // 点击下完成
        onClickComplete(row, downtype) {
            this.onClickStatistics(row, downtype);
        },
        // 批量下载统计表
        batchDownload(downtype) {
            // 10代表未完成统计表 其他非0数字代表已完成统计表
            if(this.multipleSelection.length <= 0){
                this.$message({ type: 'warning', message: '请至少选择一条产品', duration: 1500 });
            }else{
                var obj = document.getElementById("STATICTABLE"); //统计表插件
                this.multipleSelection.forEach((item,i) => {
                    let closeExcel = "n";
                    let protype = '';
                    if(item.protype == 'new'){
                        protype = '新产品';
                    }else if(item.protype == 'zgcx'){
                        protype = '整改车型';
                    }else{
                        protype = '变更扩展';
                    }
                    if(i == this.multipleSelection.length -1){
                        closeExcel = "y";
                    }
                    try {
                        obj.downstatics(downtype, item.id, base.baseImgTable+base.baseUrl+"/", '', item.entName, item.name, item.model, item.brand, protype, closeExcel);
                    } catch (error) {
                        console.log(error, '新产品-批量')
                        this.$message({ type: 'warning', message: '请检查插件是否有误，并且是在ie下执行', duration: 1500 });
                    }
                });
            }
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

.notice_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}

/deep/ .notice_con {
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

// 选择整车型号
/deep/ .choice_model {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .el-dialog {
        margin: 0 !important;
        padding: 0 !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 80%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        backface-visibility: hidden;
        .el-dialog__body {
            flex: 1 !important;
            padding: 20px;
            overflow: hidden;
        }
    }
}

// 统计表下载
.choice_statistics {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  overflow: hidden;
  z-index: 2000;
}
// 统计表下载
.choice_statistics .el_dialog {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
// 统计表下载
.choice_statistics .el_dialog .el_dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 18px;
    color: #303133;
  }
  .el_dialog_btnclose {
    padding: 0;
    margin: 0;
    width: 14px !important;
    height: 14px !important;
    i{
      font-size: 14px;
      color: #909399;
    }
  }
}
// 统计表下载
.choice_statistics .el_dialog .el_dialog__body {
  flex: 1;
  padding: 20px;
  overflow: hidden;
}
// // 统计表下载
// .choice_statistics .el_dialog .el_dialog__footer {
//   padding: 20px;
// }
.task_release_table {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.task_release_content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.standard_class .el-select{
  width: 100% !important;
}
</style>
