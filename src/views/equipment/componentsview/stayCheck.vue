<template>
    <!-- 待检设备 -->
    <div class="stay_checke">
        <div class="stayCheck_con">
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
                                  placeholder="请输入" v-model.trim="queryForm.code "/>
                    </el-form-item>
                    <el-form-item label="设备型号：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                  placeholder="请输入" v-model.trim="queryForm.model "/>
                    </el-form-item>
                    <el-form-item label="设备名称：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                  placeholder="请输入" v-model.trim="queryForm.name "/>
                    </el-form-item>
                    <el-form-item label="使用单位：">
                        <el-input clearable name="clearInputValue" @keyup.enter.native="onPressEnter"
                                  placeholder="请输入" v-model.trim="queryForm.useCompany "/>
                    </el-form-item>
                </el-form>
                <!-- 查询按钮 -->
                <div class="query_btn">
                    <p>
                        <el-button type="primary" @click="onSubmitTest">提交检定</el-button>
                        <el-button type="primary" style="" @click="onCancelStayTest">取消待检定</el-button>
                    </p>
                    <p style="float:right;">
                        <el-button type="primary" @click="onQuery(1,15)">查询</el-button>
                        <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button>
                    </p>
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
                            <th style="width: 150px">编号</th>
                            <th style="width: 150px">型号</th>
                            <th style="width: 200px">设备名称</th>
                            <th style="width: 450px;">
                                <div class="t-table--th--div">
                                    <div class="jdxm--class">
                                        <i>检定项目</i>
                                    </div>
                                    <div class="zt--class">
                                        <i>状态</i>
                                    </div>
                                </div>
                            </th>
                            <th>使用部门</th>
                            <!--<th style="width: 250px;">操作</th>-->
                        </tr>
                        <tr v-if="tableData.length==0">
                            <td colspan="8" style="height: 45px;">暂无数据</td>
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
                                <td class="tdClass"
                                    :style="{
                                      height: item.list.length == 0 ? '45px': 'auto'
                                    }"
                                >
                                    <template v-for="item2 in item.list">
                                        <div class="t-table--td--div">
                                            <div class="jdxm--class"
                                                 style="padding: 10px 0;display: flex;align-items: center;justify-content: center;">
                                                <input
                                                    type="checkbox"
                                                    class="childCheckbox"
                                                    :data-rowData="item2.id"
                                                    @change="chBoxChildChangeFn1"
                                                >
                                              <span style="margin-left: 5px;max-width: 80%;text-overflow: ellipsis;overflow: hidden;">{{item2.checkItem}}</span>
                                            </div>
                                            <div class="zt--class">
                                                <i>{{change_filter1(item2.terminalStatus)}}</i>
                                            </div>
                                        </div>
                                    </template>
                                </td>
                                <td :title="item.useDepartment">
                                    <p
                                        class="text-ellipsis"
                                        style="margin: 0 auto;max-width: 250px;"
                                    ><!--{{item.useCompany}}-->{{filter_officeList(item.useDepartment)}}
                                    </p>
                                </td>
                                <!-- <td>
                                     <el-button type="text" @click="onEdit(item)">查看</el-button>
                                     <el-button type="text" @click="onEdit(item)">编辑</el-button>
                                     <el-button type="text" @click="onTestDate(item)">检定日期</el-button>
                                     &lt;!&ndash;<el-button type="text" @click="openFn1(item)">档案借阅</el-button>&ndash;&gt;
                                     <el-button type="text" @click="openFn1(item,index)">档案借阅</el-button>
                                 </td>-->
                            </tr>
                            <tr v-show="item.tiggle">
                                <td colspan="6">
                                    <div style="height: 500px;overflow: auto;background-color: grey"></div>
                                </td>
                            </tr>
                        </template>
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
                >
                </el-pagination>
            </div>
        </div>

    </div>
</template>
<script>
    import base from '@/api/base.js'

    let _queryForm = {
        code: '',// 设备编号
        model: '',// 设备型号
        name: '',// 设备名称
        useCompany: '',// 使用单位
    }
    export default {
        name: 'staycheck',
        components: {},
        props: [],
        watch: {},
        data () {
            return {
                terminalStatusList: null,
                loading: false, // 加载状态
                total: 0, // 总数
                current: 1, // 页数
                pageSize: 15, // 条数
                tableData: [], // 表格数据
                multipleSelection: [], // 表格选中数据
                // 查询数据
                queryForm: JSON.parse(JSON.stringify(_queryForm)),
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
            // 查询
            onQuery (current, pageSize) {
              this.clearCheckedFn()
                this.loading = true
                let params = {
                    ...this.queryForm,
                    currentPage: current,
                    pageSize: pageSize,
                }
                this.$api.stayCheck.getWaitingTermina(params)
                    .then(res => {
                        let temp = res.data.data
                        this.tableData = temp.list.slice(0)
                        this.total = temp.total
                    })
                    .catch(error => {
                        console.log('查询失败')
                        this.$message.error(error.data.message)
                    })
                    .then(() => {
                        this.loading = false
                    })
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
          /*
          * 格式转化表格:(使用部门)字段回显的内容
          * */
          filter_officeList (originVal) {
            let str = originVal + ''
            let question = ''
            let _this = this
            let temp =_this.$store.state.officeList
            // 防止数据字典接口出问题引起的表而过数据回显不正确
            if (!temp) {
              return originVal
            }
            for (let i in temp) {
              if (str == temp[i].id) {
                question = temp[i].org_name
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
            * 回车
            * */
            onPressEnter () {

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
                this.pageSize = val
                this.onQuery(this.current, this.pageSize)
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

            /**/
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

            // 提交检定
            onSubmitTest () {
                let ids = []
                $(`input[type=checkbox][class*=childCheckbox]`).each((index, element) => {
                    if (element.checked) {
                        let id = $(element).attr('data-rowData')
                        if (!ids.includes(id)) {
                            ids.push(id)
                        }
                    }
                })
                let _this = this
                if (ids.length !== 0) {
                    let param = {
                        checkIds: ids.toString()
                    }
                    this.$confirm('确认要提交检定吗?', '提示', {
                        // confirmButtonText: '确定',
                        // cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            _this.$api.stayCheck.gochecking(param)
                                .then(res => {
                                    this.onQuery(this.current, this.pageSize)
                                    this.clearCheckedFn()
                                })
                                .catch(err=>{
                                    this.$message.error({
                                        message:err.data.message,
                                        duration:5000,
                                        showClose:true,
                                    })
                                })
                        })
                        .catch(() => {
                            this.$message.info('已取消该操作！')
                        })
                } else {
                    this.$message.warning('请先选择设备，再进行该操作！')
                }
            },

            /*
            * 取消待检定
            * */
            onCancelStayTest () {
                let ids = []
                let _this = this
                $(`input[type=checkbox][class*=childCheckbox]`).each((index, element) => {
                    if (element.checked) {
                        let id = $(element).attr('data-rowData')
                        if (!ids.includes(id)) {
                            ids.push(id)
                        }
                    }
                })
                if (ids.length !== 0) {
                    let parma = {
                        checkIds: ids.toString()
                    }

                    this.$confirm('确认要取消待检定吗?', '提示', {
                        // confirmButtonText: '确定',
                        // cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            _this.$api.stayCheck.cancelWaitingStatus(parma)
                                .then(res => {
                                    this.onQuery(this.current, this.pageSize)
                                    this.clearCheckedFn()
                                })
                                .catch()
                        })
                        .catch(() => {
                            this.$message.info('已取消该操作！')
                        })
                }
                //
                else {
                    this.$message.warning('请选数据')
                }

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
    /deep/ .query_form {
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
    }

    .stay_checke {
        width: 100%;
        height: 100%;
        background: #eee;
        margin: 0;
        padding: 10px;
        overflow: hidden;
    }

    /deep/ .stayCheck_con {
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
                display: flex;
                justify-content: space-between;

                p {
                    padding: 0;
                    margin: 0;
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
            }

            .pagination_modular {
                margin-top: 20px;
                padding: 0;
            }
        }
    }
</style>
