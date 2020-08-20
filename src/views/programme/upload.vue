<template>
    <!-- 报告上传历史 -->
  <div class="upload_box">
      <div class="warp">
            <!-- 查询 -->
            <div class="query">
                <div class="query_search">
                    <el-form :inline="true" ref="formQuery" :model="formQuery" size="small" label-width="90px" style="flex:1;">
                        <div class="query_search_formItem">
                            <el-form-item label="任务号：">
                                <el-input v-model.trim="formQuery.q" @keyup.enter.native="enterQuery" name="clearInputValue"></el-input>
                            </el-form-item>
                            <el-form-item label="受检单位：">
                                <el-input v-model.trim="formQuery.w" @keyup.enter.native="enterQuery" name="clearInputValue"></el-input>
                            </el-form-item>
                            <el-form-item label="样品名称：">
                                <el-input v-model.trim="formQuery.e" @keyup.enter.native="enterQuery" name="clearInputValue"></el-input>
                            </el-form-item>
                            <el-form-item label="年份：">
                                <el-select v-model="formQuery.r">
                                    <el-option v-for="item in dateList" :key="item.id" :label="item.title" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <el-collapse-transition>
                            <div v-show="show">
                                <div class="query_search_formItem">
                                    <el-form-item label="规格型号：">
                                        <el-input v-model.trim="formQuery.t" @keyup.enter.native="enterQuery" name="clearInputValue"></el-input>
                                    </el-form-item>
                                    <el-form-item label="类型：">
                                        <el-select v-model="formQuery.y">
                                            <el-option v-for="(item,i) in typeList" 
                                                :key="i" 
                                                :label="item.name" 
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="报告状态：" class="regionSort">
                                        <el-select v-model="formQuery.u">
                                            <el-option v-for="(item,i) in reportState" 
                                                :key="i" 
                                                :label="item.name" 
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                        <el-input v-model.trim="formQuery.o" @keyup.enter.native="enterQuery" name="clearInputValue"></el-input>
                                    </el-form-item>
                                    <el-form-item label="科室：">
                                        <el-select v-model="formQuery.i">
                                            <el-option v-for="(item,i) in department" 
                                                :key="i" 
                                                :label="item.name" 
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </div>
                        </el-collapse-transition>
                    </el-form>
                    <!-- 展开/收起 -->
                    <div style="min-width: 55px;text-align: right;margin: 1% 0;display: flex;align-items: center">
                        <el-button v-if="showbut==0" @click="clickshowbut(1)" type="text" style="color:#32AFF0;padding: 0;">
                        收起 <i class="el-icon-arrow-up"></i>
                        </el-button>
                        <el-button v-if="showbut!=0" @click="clickshowbut(0)" type="text" style="color:#32AFF0;padding: 0;">
                        展开 <i class="el-icon-arrow-down"></i>
                        </el-button>
                    </div>
                </div>

                <!-- 查询按钮 -->
                <div class="query_btn">
                    <el-button type="primary" @click="onClickQuery(formQuery,1,10)">查询</el-button>
                </div>
            </div>

            <!-- 表格 -->
            <div class="table_box">
                <div class="table-content">
                    <el-table
                        border
                        stripe
                        v-loading="loading"
                        :data="tablelist"
                        :header-cell-style="{
                            'background-color': 'rgba(243,246,253,1)',
                            'color': '#606266',
                            'padding': '10px 0'
                        }">
                        <el-table-column prop="z" label="任务号" align="center" :resizable="false"></el-table-column>
                        <el-table-column prop="x" label="商标" align="center" :resizable="false"></el-table-column>
                        <el-table-column prop="c" label="样品规格型号" align="center" :resizable="false"></el-table-column>
                        <el-table-column prop="v" label="样品名称" align="center" :resizable="false"></el-table-column>
                        <el-table-column prop="b" label="受检单位" align="center" :resizable="false"></el-table-column>
                        <el-table-column label="操作" align="center" :resizable="false">
                            <template>
                                <el-button type="text" class="operation_btn">报告回迁</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <!-- 分页器 -->
            <div class="pagingdevice">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10,20,30]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>
  </div>
</template>

<script>
export default {
    name: 'upload',
    components: {},
    data() {
        return {
            currentPage: 1, // 当前页
            pageSize: 10, // 每页的条数
            total: 0, // 总条数
            tablelist: [
                {
                    z:1,
                    x:2,
                    c:3,
                    v:4,
                    b:5,
                    n:6,
                    m:7,
                    l:8
                }
            ],// table数据
            loading: false, // 加载状态
            formQuery: { // 查询表单数据
                q:'',
                w:'',
                e:'',
                r:'',
                t:'',
                y:'',
                u:'',
                i:'',
                o:'',
                p:'',
                a:'',
                s:'',
                d:''
            },
            arrDate: [{id: '', title: '全部'}], // 默认年份数据
            dateList: [], // 查询年份数据
            typeList: [
                {name: '全部', id: ''},
                {name: '天津', id: 1},
            ], // 查询-类型
            reportState: [
                {name: '全部', id: ''},
                {name: '天津', id: 1},
            ], // 查询-报告状态
            department: [
                {name: '全部', id: ''},
                {name: '天津', id: 1},
            ], // 查询-科室
            show: false, // 收起/展开--状态
            showbut: 1, // 收起/展开--内容
        }
    },
    methods: {
        // 获取查询年份数据
        obtainDateList() {
            var myDate = new Date();
            var currentYearTitle = myDate.getFullYear();
            var currentYearId = myDate.getFullYear();
            var decadeYear = currentYearTitle - 9;
            var Section = currentYearTitle - decadeYear;
            for (var i = 0; i <= Section; i++) {
            myDate = {id: currentYearId--, title: currentYearTitle--};
            this.arrDate.push(myDate);
            }
            this.dateList = this.arrDate;
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
        // 点击查询
        onClickQuery(formQuery, currentPage, pageSize) {

        },
        // 回车查询
        enterQuery() {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode == 13) {
                this.onClickQuery(this.formInline, 1, 10);
            }
        },
        // 点击收起/展开
        clickshowbut(num) {
            this.show = !this.show;
            this.showbut = num;
        },
    },
    created() {
        this.obtainDateList();
    },
    mounted() {

    }
}
</script>

<style lang="scss" scoped>
.upload_box {
    width: 100%;
    height: 100%;
    background: #eee;
    padding: 10px;
    overflow: hidden;
}
.warp {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.query {
    width: 100%;
    margin-bottom: 20px;
}
.table_box {
    flex: 1;
    overflow: hidden;
}
.pagingdevice {
    margin-top: 20px;
}
.table-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
.query_search {
    width: 100%;
    display: flex;
}
.query_search_formItem {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.query_search_formItem .el-form-item{
    flex: 1;
}

.query_btn {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.el-button--default {
    height: 30px;
    background: #fff;
    padding: 0 20px;
    margin: 0;
}

.el-button--primary {
    height: 30px;
    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
    padding: 0 20px;
    margin: 0;
}
/deep/ .query_search .el-form-item__content {
    width: 60% !important;
}
/deep/ .query_search .el-select , .query_search .el-input{
    width: 100% !important;
}
/deep/ .query_search .regionSort {
    display: flex;
}
/deep/ .query_search .regionSort .el-form-item__content{
    display: flex;
}
/deep/ .query_search_formItem .regionSort .el-select {
    margin-right: 10%;
}
/deep/ .query_search_formItem .regionSort .el-select , .query_search_formItem .regionSort .el-input{
    width: 45% !important;
}
.operation_btn {
    color: #32AFF0;
    margin-right: 6px;
}
</style>
