<template>
    <!-- 离线2.0加载 -->
    <div class="load_box">
        <div class="warp">
            <!-- 查询 -->
            <div class="query">
                <el-form :inline="true" ref="formQuery" :model="formQuery" label-width="120px" style="flex:1;" class="query_search">
                    <el-form-item label="企业名称：">
                        <el-input v-model.trim="formQuery.entName" @keyup.enter.native="enterQuery" name="clearInputValue" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="产品型号：">
                        <el-input v-model.trim="formQuery.model" @keyup.enter.native="enterQuery" name="clearInputValue" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="产品名称：">
                        <el-input v-model.trim="formQuery.name" @keyup.enter.native="enterQuery" name="clearInputValue" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="产品商标：">
                        <el-input v-model.trim="formQuery.brand" @keyup.enter.native="enterQuery" name="clearInputValue" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="类型：">
                        <el-select v-model="formQuery.loadType">
                            <el-option label="方案提交" value="3"></el-option>
                            <el-option label="方案下达" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>

                <!-- 查询按钮 -->
                <div class="query_btn">
                    <el-button type="primary" @click="onClickQuery(formQuery, 1)">查询</el-button>
                </div>
            </div>

            <!-- 表格 -->
            <div class="table_box" v-loading="loading">
                <div class="table-content">
                    <el-table
                        border stripe
                        :data="tablelist"
                        :header-cell-style="{
                            'background-color': 'rgba(243,246,253,1)',
                            'color': '#606266',
                            'padding': '10px 0'
                        }">
                        <el-table-column prop="entName" label="企业名称" align="center" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="model" label="产品型号" align="center" :resizable="false"></el-table-column>
                        <el-table-column prop="name" label="产品名称" align="center" :resizable="false"></el-table-column>
                        <el-table-column prop="brand" label="产品商标" align="center" :resizable="false"></el-table-column>
                        <el-table-column label="产品类别" align="center" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.proType == 'new'">新产品</span>
                                <p v-else>
                                    <span v-if="scope.row.aeType == 'C'">整车整改</span>
                                    <span v-else>扩展{{scope.row.aeType}}</span>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" :resizable="false">
                            <template slot-scope="scope">
                                <el-button type="text" class="operation_btn"
                                @click="onClickLoad(scope.row)"
                                :loading="scope.row.loading">
                                加载
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <!-- 分页器 -->
            <div class="pagingdevice">
                <el-button type="primary" class="pagingdevice_span" @click="onClickPager" :disabled="disabledPager">
                    <i class="el-icon el-icon-arrow-left"></i>
                </el-button>
                <span class="pagingdevice_span" style="color:#409EFF;">{{currentPage}}</span>
                <el-button type="primary" class="pagingdevice_span" @click="onClickNext" :disabled="disabledNext">
                    <i class="el-icon el-icon-arrow-right"></i>
                </el-button>

                <span class="pagingdevice_Jump">
                    前往
                    <el-input 
                        type="number"
                        @mousewheel.native.prevent
                        class="pagingdevice_btn" 
                        v-model.trim="currentPageJump" 
                        @change="enterQueryJump" 
                        name="clearInputValue"
                        oninput="this.value=this.value.replace(/[^0-9.]+/g,'');"
                        :disabled="disabledInput">
                    </el-input>
                    页
                </span>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'load',
    components: {},
    data() {
        return {
            currentPage: 1, // 当前页
            pageSize: 10, // 每页的条数
            disabledPager: true, // 上一页按钮状态
            disabledNext: false, // 下一页按钮状态
            disabledInput: false, // 输入框的状态
            currentPageJump: 1, // 跳转页数
            loading: false, // 加载状态
            tablelist: [],// table数据
            formQuery: { // 查询表单数据
                entName: '', // 企业名称
                model: '', // 产品型号
                name: '', // 产品名称
                brand: '', // 产品商标
                loadType: '3', // 类型
            },
        }
    },
    created() {

    },
    mounted() {
        this.getDataList();
    },
    methods: {
        getDataList() {
            this.onClickQuery(this.formQuery, 1);
        },
        // 点击上一页
        onClickPager() {
            this.currentPage > 1 ? this.currentPage = this.currentPage * 1 - 1 : this.currentPage = 1;
            this.currentPage == 1 ? this.disabledPager = true : this.disabledPager = false;
            this.currentPageJump = this.currentPage; 
            this.onClickQuery(this.formQuery, this.currentPage);
        },
        // 点击下一页
        onClickNext() {
            this.currentPage = this.currentPage * 1 + 1;
            this.currentPage == 1 ? this.disabledPager = true : this.disabledPager = false;
            this.currentPageJump = this.currentPage; 
            this.onClickQuery(this.formQuery, this.currentPage);
        },
        // 跳转页数
        enterQueryJump(val) {
            if(val){
                this.currentPage = val;
                this.currentPage == 1 ? this.disabledPager = true : this.disabledPager = false;
                this.onClickQuery(this.formQuery, val);
            }else{
                this.$message({ type: 'warning', message: '请输入前往页数', duration: 1500 });
            }
        },
        // 点击查询
        onClickQuery(formQuery, currentPage) {
            this.loading = true;
            this.disabledPager = true;
            this.disabledNext = true;
            this.disabledInput = true;
            formQuery.currentPage = currentPage;
            formQuery.pageSize = this.pageSize;
            this.currentPage = currentPage;
            this.$api.programload.apiLxFindList(formQuery).then(res => {
                let data = res.data.data.list;
                if(data) {
                    this.tablelist = data;
                    if(this.tablelist && this.tablelist.length < 10){
                        this.disabledNext = true;
                    }else{
                        this.disabledNext = false;
                    }
                    if(this.tablelist.length > 0 ){
                        this.tablelist.forEach(item => {
                            this.$set(item,'loading',false);
                        });
                    } else if(this.tablelist.length == 0 ) {
                        this.$set(this.tablelist[0],'loading',false);
                    }
                    this.loading = false;
                    this.currentPage == 1 ? this.disabledPager = true : this.disabledPager = false;
                    this.disabledInput = false;
                }
            }).catch((error) => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
                this.loading = false;
            })
        },
        // 回车查询
        enterQuery(e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode == 13) {
                this.onClickQuery(this.formQuery, 1);
            }
        },
        // 点击加载
        onClickLoad(row) {
            row.loading = true;
            let params = {
                entName: row.entName,
                model: row.model,
                name: row.name,
                brand: row.brand,
                proType: row.proType,
                aeType: row.aeType
            };
            this.$api.programload.apiLxLoad(params).then(res => {
                row.loading = false;
                this.$message.success(res.data.data);
            }).catch((error) => {
                row.loading = false;
                this.$message.error(error.data.message);
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.load_box {
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
    display: flex;
    align-items: center;
}
/deep/ .table-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .el-table th.gutter {
      display: table-cell !important
    }
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
.operation_btn {
    color: #32AFF0;
    margin-right: 6px;
}
.pagingdevice .pagingdevice_span {
    padding: 0 4px;
    font-size: 13px;
    width: 35.5px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: none !important;
    border: none !important;
}
.pagingdevice .pagingdevice_span .el-icon{
    color: #C0C4CC;
}
.pagingdevice .pagingdevice_Jump{
    margin-left: 24px;
    color: #606266;
    display: flex;
    align-items: center;
    white-space:nowrap;
}
/deep/ .pagingdevice .pagingdevice_btn .el-input__inner {
    padding: 0 4px !important;
    font-size: 13px !important;
    width: 50px !important;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: none !important;
    border-radius: 4px !important;
    border: 1px solid #DCDFE6 !important;
    margin: 0 5px;
}
/deep/ .pagingdevice .pagingdevice_btn .el-input__inner::-webkit-outer-spin-button,
/deep/ .pagingdevice .pagingdevice_btn .el-input__inner::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
/deep/ .pagingdevice .pagingdevice_btn .el-input__inner[type='number'] {
  -moz-appearance: textfield !important;
}

// 查询表单
/deep/ .query_search {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
        width: 20%;
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
</style>
