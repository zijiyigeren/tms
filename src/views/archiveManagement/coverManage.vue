<template>
    <!-- 封面管理 -->
    <div class="cover_manage">
        <div class="cover_con">
            <!-- 查询 -->
            <div class="query_modular">
                <el-form
                    class="query_form"
                    v-bind="{
            model:queryForm,
            size: 'mini',
            labelWidth: '110px',
            labelSuffix: ' :',
          }"
                >
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="任务号一">
                                <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                          placeholder="请输入任务号一" v-model.trim="queryForm.test_code1"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="任务号二">
                                <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                          placeholder="请输入任务号二" v-model.trim="queryForm.test_code2"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="任务号三">
                                <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                          placeholder="请输入任务号三" v-model.trim="queryForm.test_code3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!-- 查询按钮 -->
                <div class="query_btn">
                    <el-button type="primary" style="float:left;">批量打印</el-button>
                    <p style="float:right;">
                        <el-button type="primary" @click="onQuery(1,10)">查询</el-button>
                        <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button>
                    </p>
                </div>
            </div>
            <div v-loading="loading" class="tablePagination_modular">
                <!-- 表格 -->
                <div class="table_modular">
                    <el-table ref="table"
                              height="calc(100% - 1px)"
                              :data="tableData"
                              border stripe
                              :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}"
                              @selection-change="onTableSelectionChange"
                    >
                        <el-table-column align="center" :resizable="false" type="selection"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="任务号" width="240"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="受检单位" min-width="240"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="样品规格号" width="240"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="样品名称" width="240"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="完成日期" width="240"></el-table-column>
                        <el-table-column align="center" :resizable="false" prop="" label="默认封面" width="240"></el-table-column>
                        <el-table-column align="center" :resizable="false" label="操作" width="120">
                            <template slot-scope="{ row }">
                                <el-button type="text" @click="onPrintCover(row)">打印封面</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
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

        <!-- 打印封面 -->
        <el-dialog title="打印封面"
                   width="450px"
                   :visible.sync="printCoverVisible"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
        >
            <div class="print_cover">
                <el-button type="primary" class="printCover_btn" style="marginBottom:20px;">生成国检封面</el-button>
                <el-button type="primary" class="printCover_btn">生成中公高远封面</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    const queryForm = {
        test_code1: '',
        test_code2: '',
        test_code3: '',
    }
    export default {
        name: 'covermanage',
        components: {},
        props: [],
        watch: {},
        data () {
            return {
                loading: false, // 加载状态
                total: 0, // 总数
                current: 1, // 页数
                pageSize: 10, // 条数
                tableData: [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},], // 表格数据
                multipleSelection: [], // 表格选中数据

                queryForm: JSON.parse(JSON.stringify(queryForm)),// 查询数据
                printCoverVisible: false, // 打印封面-显示状态
            }
        },
        created () {
        },
        mounted () {
            this.onQuery(1, 10)
        },
        methods: {
            // 表格选中时
            onTableSelectionChange (val) {
                this.multipleSelection = val
            },
            // 页数
            currentChange (val) {
                this.current = val
                this.onQuery(this.current, this.pageSize)
            },
            // 条数
            pageSizeChange (val) {
                this.pageSize = val
                this.onQuery(this.current, this.pageSize)
            },
            // 查询
            onQuery (current, pageSize) {
                // this.loading = true;
                // let params = {};
                // this.$api.flowcheng.alreadydoTableData(params).then(res => {
                //     this.tableData = res.data.data.list;
                //     this.loading = false;
                //     if(res.data.data.count > 0){
                //         this.total = res.data.data.count;
                //         this.current = current;
                //         this.pageSize = pageSize;
                //     }else{
                //         this.total = 0;
                //         this.current = 1;
                //         this.pageSize = 10;
                //     }
                // }).catch(error => {
                //     console.log(error, '查询失败');
                //     this.$message.error(error.data.message);
                //     this.loading = false;
                //     this.total = 0;
                //     this.current = 1;
                //     this.pageSize = 10;
                // });
            },
            // 回车查询
            enterQuery (e) {
                var keyCode = window.event ? e.keyCode : e.which
                if (keyCode == 13) {
                    this.onQuery(1, 10)
                }
            },
            // 重置
            onReset () {
                this.onQuery(1, 10)
            },
            // 打印封面
            onPrintCover (row) {
                this.printCoverVisible = true
            },
        },
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

    // 打印封面
    .print_cover {
        .printCover_btn {
            display: block;
            width: 200px;
            height: 30px;
            margin: 0 auto;
        }
    }

    // 表单
    /*/deep/ .query_form {
      margin: 0;
      padding: 0;
      display: flex;

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

          .el-select, .el-input {
            width: 100% !important;
          }
        }
      }
    }*/

    .cover_manage {
        width: 100%;
        height: 100%;
        background: #eee;
        margin: 0;
        padding: 10px;
        overflow: hidden;
    }

    /deep/ .cover_con {
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

            .query_form {
                flex: 1;
            }

            .query_btn {
                p {
                    padding: 0;
                    margin: 0;
                }
            }
        }

        .tablePagination_modular {
            flex: 1;
            overflow: hidden;
            /*display: flex;*/
            /*flex-direction: column;*/

            .table_modular {
                height: 100%;
                /*flex: 1;*/
                /*overflow-y: auto;*/

                .el-radio__label {
                    padding: 0;
                }
            }

            .pagination_modular {
                /*margin-top: 20px;*/
                /*padding: 0;*/
            }
        }
    }
</style>
