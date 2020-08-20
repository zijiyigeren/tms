<template>
    <!-- 批量打印 -->
    <div class="batchplt_border">
        <div class="batchplt_con">
            <!-- 查询 -->
            <div class="query_modular">
                <el-form :inline="true" :model="queryForm" class="query_form">
                    <el-form-item label="状态：">
                        <el-select v-model="queryForm.flag" placeholder="请选择状态">
                            <el-option label="未打印" :value="'0'"></el-option>
                            <el-option label="已打印" :value="'1'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年份：">
                        <el-select v-model="queryForm.syear" placeholder="请选择年份">
                            <el-option
                                v-for="(item,i) in syearList" :key="i"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="query_btn">
                    <p class="query_leftbtn">
                        生成数量：
                        <el-input clearable name="clearInputValue" v-model.trim="icount" @blur="icountRules($event)"></el-input>
                        <el-button type="primary" @click="onGenerate" style="margin: 0 10px;">生成</el-button>
                        <el-button type="primary" @click="onBatchPrinting">批量选择打印</el-button>
                    </p>
                    <p class="query_rightbtn">
                        <el-button type="primary" @click="onQuery(1,10)">查询</el-button>
                        <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button>
                    </p>
                </div>
            </div>
            <div v-loading="loading" class="tablePagination_modular">
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table ref="table" border stripe :data="tableList"
                        :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}"
                        @selection-change="onTableSelectionChange">
                        <el-table-column align="center" :resizable="false" type="selection"></el-table-column>

                        <el-table-column align="center" :resizable="false" label="类别">
                            <template slot-scope="scope">
                                <span v-if="scope.row.icatalog==0">整车</span>
                                <span v-else>设备</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" label="类型">
                            <template slot-scope="scope">
                                <span v-if="scope.row.itype==0">整车</span>
                                <span v-else>零部件</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="syear" label="年份"></el-table-column>
                        <el-table-column align="center" :resizable="false" label="地点">
                            <template slot-scope="scope">
                                <span v-if="scope.row.iplace==0">天津</span>
                                <span v-else>其他</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="scode" label="编码"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="vin" label="VIN"></el-table-column>
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

        <!-- 批量打印条形码 -->
        <el-dialog title="条形码" class="barCode_dialog" :visible.sync="barCodeVisible"
            :close-on-click-modal="false" :close-on-press-escape="false"
            :before-close="onBarCodeClose">
            <div class="barCode_con" v-show="multipleSelection.length>0">
                <p v-for="(item,i) in multipleSelection" :key="i" class="barCode_item">
                    <barcode :value="item.scode" :options="barcode_option" tag="svg" class="barCode_itemCon"></barcode>
                </p>
            </div>
            <span slot="footer" class="dialog-footer" :center="true" width="100%">
                <el-button @click="onBarCodeClose">关 闭</el-button>
                <el-button type="primary" @click="onPrinting">打 印</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'batchplt',
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
            icountFlag: false, // 生成数量-校验状态
            icount: '', // 生成数量
            syearList: [], // 年份
            queryForm: {
                flag: '0',
                syear: (''+new Date().getFullYear()).substring((''+new Date().getFullYear()).length-2),
            }, // 查询数据
            barcode_option:{
                displayValue: true, //是否默认显示条形码数据
                background: '#fff', //条形码背景颜色
                width:'2px',//单个条形码的宽度
                height: '55px',
                fontSize: '18px' //字体大小
            },
            barCodeVisible: false,
        }
    },
    created() {
        
    },
    mounted() {
        this.obtainSyear();
        this.onQuery(1,10);
    },
    methods: {
        // 获取前10年年份
        obtainSyear() {
            let thisYear = new Date().getFullYear();
            let Section = thisYear - (thisYear - 9);
            for (var i = 0; i <= Section; i++) {
                var str = thisYear+'';
                str = str.substring(str.length-2);
                thisYear = thisYear*1;
                thisYear--;
                this.syearList.push(str);
            }
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
        // 表格选中时
        onTableSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 查询
        onQuery(current,pageSize) {
            this.loading = true;
            let params = this.queryForm;
            params.currentPage = current; 
            params.pageSize = pageSize;
            console.log(params, '查询数据');
            this.$api.batchplt.print(params).then(res => {
                console.log(res, '查询成功res');
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
                console.log(error, '查询失败error');
                this.loading = true;
                this.current = 1;
                this.pageSize = 10;
                this.total = 0;
            })
        },
        // 重置
        onReset() {
            this.queryForm = {
                flag: '0',
                syear: (''+new Date().getFullYear()).substring((''+new Date().getFullYear()).length-2),
            };
            this.onQuery(1,10);
        },
        // 生成数量-校验
        icountRules(e) {
            // console.log(e.target.value, '生成数量值');
            let flag = new RegExp("^[1-9]([0-9])*$").test(e.target.value);
            // console.log(flag,'输入是否正确');
            if(flag){
                this.icountFlag = true;
            }else{
                this.icountFlag = false;
            }
        },
        // 生成
        onGenerate() {
            if(this.icountFlag) {
                let params = {
                    icount: this.icount,
                    syear: this.queryForm.syear,
                };
                this.$api.batchplt.createone(params).then(res => {
                    console.log(res, '生成成功res');
                    this.$message.success('生成成功');
                    this.onQuery(1,10);
                }).catch((error) => {
                    console.log(error, '生成失败error');
                    this.$message.error('生成失败');
                    this.onQuery(1,10);
                })
            }else{
                this.$message.error('生成数量必须是数字，请重新输入！');
            }
        },
        // 批量选择打印
        onBatchPrinting() {
            if(this.multipleSelection.length>0){
                this.barCodeVisible = true;
            }else{
                this.$message.warning('请先选择数据再进行打印！');
            }
        },
        // 关闭-批量选择打印
        onBarCodeClose() {
            this.barCodeVisible = false;
        },
        // 打印
        onPrinting() {
            let codeList = '';
            this.multipleSelection.forEach(item => {
                codeList += item.scode + ',';
            });
            codeList = codeList.slice(0,codeList.length-1);
            let params = new FormData();
            params.append('code', codeList);
            this.$api.batchplt.vinAjax(params).then(res => {
                console.log(res, '打印成功res');
                let data = res.data.data;
                if(data == 0) {
                    this.$message.success('打印成功');
                }else if(Array.isArray(data)) {
                    let str = '';
                    data.forEach(item => {
                        str += item+'_已经打印过了！   ';
                    });
                    this.$message(str);
                }
                this.onQuery(1,10);
                this.barCodeVisible = false;
            }).catch((error) => {
                console.log(error, '打印失败error');
                this.$message.error('打印失败');
                this.onQuery(1,10);
                this.barCodeVisible = false;
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
/deep/ .query_form {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    .el-form-item{
        margin: 0;
        padding: 0 10px 20px 0;
        width: 30%;
        display: flex;
        align-items: center;
        overflow: hidden;
        .el-form-item__label {
            white-space: nowrap;
        }
        .el-form-item__content {
            flex: 1;
            padding-right: 20px;
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

/deep/ .barCode_dialog {
    overflow: hidden;
    .el-dialog {
        margin:0 !important;
        padding: 0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        max-height:calc(100% - 20%);
        max-width:calc(100% - 30px);
        height: 60%;
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

.barCode_item {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
}

.batchplt_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}
/deep/ .batchplt_con {
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
            align-items: center;
            p {
                margin: 0;
                padding: 0;
            }
            .query_leftbtn {
                white-space: nowrap;
                display: flex;
                align-items: center;
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

</style>