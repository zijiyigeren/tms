<template>
    <!-- 选择整车型号 -->
    <div class="choice_model_con">
        <!-- 查询 -->
        <div class="query_modular">
            <div class="query_complex">
                <el-form :inline="true" :model="formQuery" class="query_form">
                    <el-form-item label="企业名称：">
                        <el-input v-model.trim="formQuery.entName" clearable @keyup.enter.native="enterQuery"></el-input>
                    </el-form-item>
                    <el-form-item label="产品型号：">
                        <el-input v-model.trim="formQuery.model" clearable @keyup.enter.native="enterQuery"></el-input>
                    </el-form-item>
                    <el-form-item label="产品名称：">
                        <el-input v-model.trim="formQuery.name" clearable @keyup.enter.native="enterQuery"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 查询按钮 -->
            <div class="query_btn">
                <p>
                    <el-button type="primary" @click="onClickRelease">下达</el-button>  
                </p>
                <p class="query_rightbtn">
                    <el-button type="primary" @click="onClickQuery(1)">查询</el-button>
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
                        'padding': '10px 0' }">
                    <el-table-column align="center" :resizable="false" width="50" class-name="radioStyle">
                        <template slot-scope="scope">
                            <el-radio v-model="scope.row.radio" @change.native="radioChoice(scope.row)"></el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :resizable="false" prop="taskCode" label="任务号"></el-table-column>
                    <el-table-column align="center" :resizable="false" prop="entName" label="企业名称"></el-table-column>
                    <el-table-column align="center" :resizable="false" prop="model" label="产品型号"></el-table-column>
                    <el-table-column align="center" :resizable="false" prop="name" label="产品名称"></el-table-column>
                    <el-table-column align="center" :resizable="false" prop="brand" label="产品商标"></el-table-column>
                </el-table>
            </div>

            <!-- 分页 -->
            <el-pagination
                class="pagination_modular"
                layout="total, prev, pager, next, jumper"
                :total="total"
                :current-page="currentPage"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>

    </div>
</template>

<script>
export default {
    components: {},
    props: ['choiceModelVisible'],
    watch: {
        choiceModelVisible: {
            immediate:true,
            handler(val) {
                if(val) {
                    this.formQuery = { // 查询表单数据
                        entName: '', // 企业名称
                        model: '', // 产品型号
                        name: '', // 产品名称
                    };
                    // this.onClickQuery(this.currentPage);
                }
            },
        },
    },
    data() {
        return {
            loading: false, // 加载状态
            total: 0, // 总条数
            currentPage: 1, // 当前页
            pageSize: 10, // 每页的条数
            tablelist: [], // table数据
            formQuery: { // 查询表单数据
                entName: '', // 企业名称
                model: '', // 产品型号
                name: '', // 产品名称
            },
            radioId: '', // 单选id
        }
    },
    created() {},
    mounted() {},
    methods: {
        // 分页器-当前页发生改变时
        handleCurrentChange(val) {
            this.currentPage = val;
            this.onClickQuery(this.currentPage);
        },
        // 点击查询
        onClickQuery(currentPage) {
            this.loading = true;
            this.radioId = '';
            let params = this.formQuery;
            params.currentPage = currentPage;
            this.$api.notice.apiZjparamToselectmodel(params).then(res => {
                res.data.data.list.forEach(item => {
                    item.radio = item.id;
                });
                if(res.data.data && res.data.data.list.length > 0) {
                    this.loading = false;
                    this.tablelist = res.data.data.list;
                    if(res.data.data.list[0].total > 0){
                        this.total = res.data.data.list[0].total;
                        this.currentPage = currentPage;
                    }else{
                        this.total = 0;
                        this.currentPage = 1;
                    }
                } else {
                    this.total = 0;
                    this.currentPage = 1;
                    this.tablelist = [];
                }
            }).catch(error => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
                this.loading = false;
                this.total = 0;
                this.currentPage = 1;
                this.tablelist = [];
            })
        },
        // 回车查询
        enterQuery(e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode == 13) {
                this.onClickQuery(this.currentPage);
            }
        },
        // 单选选中时
        radioChoice(row) {
            this.radioId = row;
        },
        // 点击下达
        onClickRelease() {
            if(this.radioId){
                if(this.radioId.taskCode.length <= 0){
                    this.$message({ type: 'warning', message: '该任务可能已经被删除，无法下达', duration: 1500 });
                }else{
                    let params = {
                        id: this.radioId.ids,
                        taskid: this.radioId.taskid + ':' + this.radioId.id,
                        proType: this.radioId.proType
                    };
                    this.$api.notice.apiZjparamToTask(params).then(res => {
                        this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                        this.radioId = '';
                        this.tablelist.forEach(item => {
                            item.radio = '';
                        });
                        this.$emit('closeReleaseVisible');
                    }).catch(error => {
                        this.$message({type: 'error', message: error.data.message, duration: 1500});
                        this.radioId = '';
                        this.tablelist.forEach(item => {
                            item.radio = '';
                        });
                    })
                }
            }else{
                this.$message({ type: 'warning', message: '请先选择任务再进行下达', duration: 1500 });
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

.choice_model_con {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
//  查询
.query_modular {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    padding-bottom: 20px;
}
// 查询表单
.query_complex {
    width: 100%;
    display: flex;
    position: relative;
}
.query_complex .query_form {
    flex: 1;
}
.query_complex .query_form .query_show {
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
// 查询按钮
.query_btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    p {
        margin: 0;
        padding: 0;
    }
}
// 表格与分页
.tablePagination_modular {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
// 表格
.tablePagination_modular .table_modular {
    flex: 1;
    overflow-y: auto;
}
/deep/ .tablePagination_modular .table_modular  .el-radio__label {
    padding: 0;
}
// 分页
.tablePagination_modular .pagination_modular {
    margin-top: 20px;
    padding: 0;
}


// 查询表单
.query_form {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
}
/deep/ .query_form .el-form-item {
    width: 25%;
    margin: 0;
    padding-bottom: 20px;
    overflow: hidden;
    display: flex;
    align-items: center;
}
/deep/ .query_form .el-form-item .el-form-item__label {
    white-space: nowrap;
}
/deep/ .query_form .el-form-item .el-form-item__content {
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
.radioStyle .el-radio__label{
    padding: 0 !important;
}

</style>
