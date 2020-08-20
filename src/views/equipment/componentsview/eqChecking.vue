<template>
    <!-- 检定(中) / 校准设备 -->
    <div class="test_box">
        <div class="test_con">
            <!-- 查询 -->
            <div class="query_modular">
                <el-form
                    class="query_form"
                    label-width="80px"
                    v-bind="{
                        inline: true,
                        size: 'mini',
                        model: queryForm,
                    }"
                >
                    <el-form-item label="设备编号：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                  placeholder="请输入" v-model.trim="queryForm.code"/>
                    </el-form-item>
                    <el-form-item label="设备型号：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                  placeholder="请输入" v-model.trim="queryForm.model"/>
                    </el-form-item>
                    <el-form-item label="设备名称：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                  placeholder="请输入" v-model.trim="queryForm.name"/>
                    </el-form-item>
                </el-form>
                <!-- 查询按钮 -->
                <div class="query_btn">
                    <el-button type="primary" @click="onQuery(1,15)">查询</el-button>
                    <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button>
                </div>
            </div>
            <!-- 表格与分页 -->
            <div v-loading="loading" class="tablePagination_modular">
                <!-- 表格 -->
                <div class="table_modular">
                    <table class="t-table" cellpadding="0" border="0" cellspacing="0">
                        <tr>
                            <th style="width: 65px;">
                                <input type="checkbox" @change="handleSelectAll" name="SelectAll">
                            </th>
                            <th style="width: 120px">编号</th>
                            <th style="width: 150px">型号</th>
                            <th style="width: 150px">设备名称</th>
                            <th style="min-width: 450px;">
                                <div class="t-table--th--div">
                                    <div class="jdxm--class">
                                        <i>检定项目</i>
                                    </div>
                                    <div class="zt--class" style="width: 80px;">
                                        <i style="width: 90%;">状态</i>
                                    </div>
                                    <div class="zt--class" style="width: 240px;">
                                        <i>检定单位</i>
                                    </div>
                                    <div class="zt--class" style="width: 120px;">
                                        <i style="width: 95%">预计检定日期</i>
                                    </div>
                                    <div class="zt--class" style="width: 100px;">
                                        <i>操作</i>
                                    </div>
                                </div>
                            </th>
                        </tr>
                        <template v-for="(item,index) in tableData">
                            <tr
                                :key="'tr'+ index"
                                class="trClass"
                            >
                                <td>
                                    <input type="checkbox" @change="chBoxChangeFn1(item)" name="aaaChkox"/>
                                </td>
                                <td :title="item.code">
                                    <p
                                        class="text-ellipsis"
                                        style="margin: 0 auto;width: 140px;"
                                    >{{item.code}}
                                    </p>
                                </td>
                                <td :title="item.model">
                                    <p
                                        class="text-ellipsis"
                                        style="margin: 0 auto;width: 140px;"
                                    >{{item.model}}
                                    </p>
                                </td>
                                <td :title="item.name">
                                    <p
                                        class="text-ellipsis"
                                        style="margin: 0 auto;width: 140px;"
                                    >{{item.name}}
                                    </p>
                                </td>
                                <td class="tdClass">
                                    <template v-for="item2 in item.list">
                                        <div class="t-table--td--div">
                                            <div class="jdxm--class" style="padding:10px 0;">
                                                <input
                                                    type="checkbox"
                                                    class="childCheckbox"
                                                    :data-rowData="item2.id"
                                                    @change="chBoxChildChangeFn1"
                                                >
                                              <span style="margin-left: 5px;max-width: 80%;text-overflow: ellipsis;overflow: hidden;">{{item2.checkItem}}</span>
                                            </div>
                                            <div class="zt--class" style="width: 80px;" :title="item.terminalStatus">
                                                <i style="width: 90%;">{{change_filter1(item2.terminalStatus)}}</i>
                                            </div>
                                            <div class="zt--class" style="width: 240px" :title="item.useCompany">
                                                <i style="width: 98%;" class="text-ellipsis">{{item.useCompany}}</i>
                                            </div>
                                            <div class="zt--class" style="width: 120px;" :title="item.checkdate3">
                                                <i style="width: 95%">{{item2.checkdate3}}</i>
                                            </div>
                                            <div class="zt--class" style="width: 100px;">
                                                <i style="display: inline-block;width: 90px;">
                                                    <el-button type="text"
                                                               @click="onTest(item2.id)">校准</el-button>
                                                    <el-button type="text"
                                                               @click="onCancel(item.id,item2.id)">取消
                                                    </el-button>
                                                </i>
                                            </div>
                                        </div>
                                    </template>
                                </td>
                            </tr>
                        </template>

                        <tr v-if="tableData.length==0">
                            <td colspan="5" style="height: 45px;">暂无数据</td>
                        </tr>
                    </table>
                </div>
                <!-- 分页 -->
                <el-pagination
                    class="pagination_modular"
                    layout="total, ->, prev, pager, next, jumper"
                    :total="total"
                    :current-page="current"
                    :page-size="pageSize"
                    @current-change="currentChange"
                    @size-change="pageSizeChange">
                </el-pagination>
            </div>
        </div>

        <!-- 检定信息 -->
        <test-information
            v-bind="{
                'informationVisible': informationVisible,
                'informationRow': informationRow
            }"
            @informationClose="onInformationClose"
        />

    </div>
</template>
<script>
    import base from '@/api/base.js'
    import TestInformation from '../component/testInformation'

    let _queryForm = {
        code: '',// 设备编号
        model: '',// 设备型号
        name: '',// 设备名称
    }

    export default {
        name: 'eqchecking',
        components: {
            TestInformation,
        },
        props: [],
        watch: {},
        data () {
            return {
                // 数据字典: 检定项目状态
                terminalStatusList: null,
                /* 条件查询数据 */
                queryForm: JSON.parse(JSON.stringify(_queryForm)),
                loading: false, // 加载状态
                /* 表格数据 */
                tableData: [],

                total: 0, // 总数
                current: 1, // 页数
                pageSize: 15, // 条数

                multipleSelection: [], // 表格选中数据

                informationVisible: false, // 检定信息-显示状态
                informationRow: null, // 检定信息-设备数据
            }
        },
        created () {
            this.get_terminalStatus()
        },
        mounted () {
            this.onQuery(1, 15)
        },
        methods: {
          /*
          * 全选、取消全选
          * 2020.07.27
          * */
          handleSelectAll () {
            let trCheck = $('input[name=aaaChkox]')
            let tdCheck = $('input[class=childCheckbox]')

            if (event.target.checked) {
              for (let i = 0; i < trCheck.length; i++) {
                trCheck[i].checked = true
              }
              for (let i = 0; i < tdCheck.length; i++) {
                tdCheck[i].checked = true
              }
            } else {
              for (let i = 0; i < trCheck.length; i++) {
                trCheck[i].checked = false
              }
              for (let i = 0; i < tdCheck.length; i++) {
                tdCheck[i].checked = false
              }
            }
          },
            /*
            * 数据字典: 检定项目状态
            * */
            get_terminalStatus () {
                this.$api.tempaxios.getList(base.baseUrl + '/sys/dictype/list/', {dicCode: 'terminalStatus'})
                    .then(res => {
                        this.terminalStatusList = [...res.data.data]
                    })
                    .catch((error) => {
                    })
            },
            /*
            * 查询
            * */
            onQuery (current, pageSize) {
              this.clearCheckedFn()
                this.loading = true
                let params = {
                    ...this.queryForm,
                    currentPage: current,
                    pageSize,
                }
                this.$api.eqChecking.getCheckingTerminal(params)
                    .then(resp => {
                        let temp = resp.data.data
                        this.tableData = temp.list.slice(0)
                        this.total = temp.total
                        // let temp = res.data.data
                        // this.tableData = temp.list
                        // this.loading = false
                        // if (res.data.data.count > 0) {
                        //     this.total = res.data.data.count
                        //     this.current = current
                        //     this.pageSize = pageSize
                        // } else {
                        //     this.total = 0
                        //     this.current = 1
                        //     this.pageSize = 10
                        // }
                    })
                    .catch(error => {
                        console.log('查询失败');
                        this.$message.error({message:error.data.message})
                        // this.loading = false
                        // this.total = 0
                        // this.current = 1
                        // this.pageSize = 10
                    })
                    .then(() => {
                        this.loading = false
                    })
            },
            /*
            * 表单查询回车事件
            * */
            onPressEnter () {
            },
            /*
            * 格式转化表格:(状态)字段回显的内容
            * */
            change_filter1 (originVal) {
                let str = originVal + ''
                let question = ''
                let _this = this
                // 防止数据字典接口出问题引起的表而过数据回显不正确
                if (!_this.terminalStatusList) {
                    return originVal
                }
                for (let i in _this.terminalStatusList) {
                    if (str == _this.terminalStatusList[i].dicTypeCode) {
                        question = _this.terminalStatusList[i].dicTypeName
                        break
                    }
                }
                return question
            },
            chBoxChangeFn1 () {
                let selectedTR = $(event.target).closest('.trClass')// 当前选中的这一行
                let selectedTrCheckBox = $(selectedTR).find('.childCheckbox')

                if (event.target.checked) {
                    for (let i = 0; i < selectedTrCheckBox.length; i++) {
                        selectedTrCheckBox[i].checked = true
                    }
                } else {
                    for (let i = 0; i < selectedTrCheckBox.length; i++) {
                        selectedTrCheckBox[i].checked = false
                    }
                }
            },
            chBoxChildChangeFn1 () {
                let selectedTrCheckBox = $(event.target).closest('.trClass').find('input[name*=aaaChkox]')
                let currentTd_checkbox = $(event.target).closest('.tdClass').find('input[type=checkbox][class*=childCheckbox]')
                let count = 0
                for (let i = 0; i < currentTd_checkbox.length; i++) {
                    if (currentTd_checkbox[i].checked == true) {
                        count += 1
                    }
                }
                if (count <= currentTd_checkbox.length && count != 0) {
                    selectedTrCheckBox[0].checked = true
                } else {
                    selectedTrCheckBox[0].checked = false
                }
            },
            /*
            * 检定
            * */
            onTest (rowId) {
                let params = {
                    checkIds: rowId
                }
                this.$api.eqChecking.getCheckingTerminalInfo(params)
                    .then(resp => {
                        let temp = resp.data.data
                        this.informationVisible = true
                        this.$nextTick(() => {
                            this.informationRow = temp
                        })
                    })
                    .catch()
            },

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
                //     this.pageSize = val
                //     this.onQuery(this.current, this.pageSize)
            },

            // 回车查询
            enterQuery (e) {
                var keyCode = window.event ? e.keyCode : e.which
                if (keyCode == 13) {
                    this.onQuery(1, 15)
                }
            },
            // 重置
            onReset () {
                this.onQuery(1, 15)
            },
            // 检定-关闭
            onInformationClose () {
                this.informationVisible = false
                this.informationRow = null
                this.onQuery(this.current, this.pageSize)
            },
            /*
            *
            * */
            clearCheckedFn () {
                let checks = $('input[type=checkbox][name*=aaaChkox]')
                let checks2 = $('input[type=checkbox][class*=childCheckbox]')
                checks.each((index, element) => {
                    element.checked = false
                })
                checks2.each((index, element) => {
                    element.checked = false
                })
              $('input[name*=SelectAll]').each((index, element) => {
                element.checked = false
              })
                // this.multipleSelection = []
                // this.ids = []
            },
            // 取消
            onCancel (terminalId, tCheckingId) {
                this.$confirm('确认要取消该设备的检定吗?', '提示', {
                    // confirmButtonText: '确定',
                    // cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        let params = {
                            terminalId,
                            tCheckingId
                        }
                        this.$api.eqChecking.deleteCheck(params)
                            .then((res) => {
                                this.onQuery(this.current, this.pageSize)
                                this.clearCheckedFn()
                            })
                            .catch()
                    })
                    .catch(() => {
                        this.$message.info('已取消该操作！')
                    })
            },
        },
    }
</script>
<style lang="less" scoped>
    @import './style/mlyStyle.less';

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

    // 查询-表单
    /deep/ .query_form {
        margin: 0;
        padding: 0;
        display: flex;

        .el-form-item {
            width: 25%;
            padding: 0;
            margin: 0;
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
    }

    .test_box {
        width: 100%;
        height: 100%;
        background: #eee;
        margin: 0;
        padding: 10px;
        overflow: hidden;
    }

    /deep/ .test_con {
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
            display: flex;
            align-items: center;

            .query_form {
                flex: 1;
            }

            .query_btn {
                float: right;
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
                overflow-x: hidden;

                .el-radio__label {
                    padding: 0;
                }
            }

            .pagination_modular {
                margin-top: 20px;
                padding: 0;
            }
        }
    }

    /deep/ .dialog_information {
        overflow: hidden;

        .el-dialog {
            margin: 0 !important;
            padding: 0 !important;
            position: absolute;
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;

            .el-dialog__body {
                flex: 1 !important;
                padding: 0;
                overflow: hidden;
            }

            .el-dialog__footer {
                padding: 20px;
                border-top: 1px solid rgba(0, 0, 0, 0.1);
            }
        }
    }
</style>
