<template>
    <!-- 模板数据填写规则 -->
    <div style="width:100%;height: 100%;display: flex;flex-direction: column;">
        <div>
            <el-form
                ref="form_1"
                v-bind="{
                    model: paramRule,
                    labelWidth: '150px',
                    labelSuffix: ' :',
                    size:'mini',
                }"
            >
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="模板数据填写规则">
                            <el-input v-model="paramRule.ruleName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="检验类型">
                            <el-select style="width: 100%;" v-model="paramRule.checkType">
                                <el-option label="全部" value=""></el-option>
                                <el-option
                                    v-for="(item,index) in checkTypeList"
                                    :key="'option'+index "
                                    :label="item"
                                    :value="item"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="模板类型">
                            <el-select style="width: 100%;" v-model="paramRule.templateType">
                                <el-option label="主模板" value="0"></el-option>
                                <el-option label="子模板" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="上传时间">
                            <el-date-picker
                                style="width: 100%;"
                                v-model="dateRangeValue"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <p style="overflow: hidden;text-align: right;">
                <el-button size="mini" type="primary" style="float: left;"
                           @click="goAdd"
                >新建模板数据填写规则
                </el-button>
                <el-button size="mini" type="primary"
                           @click="()=>{
                                currentPage = 1
                                goNextPage('1')
                           }">查询
                </el-button>
                <el-button size="mini" type="info" @click="resetButton">重置</el-button>
            </p>
        </div>
        <div style="flex: 1;overflow: hidden;">
            <el-table
                v-loading="Loading1"
                v-bind="{
                  height: 'calc(100% - 10px)',
                  data: tableData,
                  border: true,
                }"
            >
                <el-table-column
                    label="序号"
                    type="index"
                    width="55"
                    align="center"
                    :resizable="false"
                    :index="i => (currentPage - 1) * pageSize + i + 1"
                />
                <el-table-column
                    label="模板数据填写规则名称"
                    width=""
                    :resizable="false"
                    property="ruleName"
                />
                <el-table-column
                    label="检测类型"

                    :resizable="false"
                    property="checkType"
                />
                <el-table-column
                    label="模板类型"

                    :resizable="false"
                    property="templateType"
                />
                <el-table-column
                    label="上传时间"

                    :resizable="false"
                    property="createDate"
                />
                <el-table-column
                    label="创建人"

                    :resizable="false"
                    property="creator"
                />
                <el-table-column
                    label="操作"
                    align="center"
                    :resizable="false"
                    property=""
                    width="230"
                >
                    <template slot-scope="{ row, $index }">
                        <a-button type="link" style="padding: 0;" @click="goEdit(row)">编辑</a-button>
                        <a-button type="link" style="padding: 0;" @click="goBindShow(row)">查看单数据填写规则</a-button>
                        <a-button type="link" style="padding: 0;color: red;" @click="goDelete(row.id)">删除</a-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-pagination
            :total="total"
            :currentPage="currentPage"
            :pageSize="pageSize"
            v-bind="{
                layout: 'total, -> ,prev, pager, next, jumper'
            }"
            @size-change="(val)=>{
                pageSize = val
            }"
            @current-change="(val)=>{
                currentPage = val
                goNextPage((val+''))
            }"
        />

        <!-- 新建/编辑 模板数据填写规则 -->
        <el-dialog
            :visible.sync="show1"
            v-bind="{
                // top: '5vh',
                // width: '60%',
                title: dialogTitle,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                modal: false,
            }"
            @close="close_show1"
        >
            <ParamSubRuleEdit
                ref="ParamSubRuleEdit"
                :edit-data="editData"
                @closeDialog_Fn1="closeDialogFn1"
            />
        </el-dialog>

        <!-- 单数据填写规则 -->
        <el-dialog
            :visible.sync="show2"
            v-bind="{
                 top: '7vh',
                 width: '75%',
                 title: '单数据填写规则',
                 closeOnClickModal: false,
                 closeOnPressEscape: false,
                 modal: false,
            }"
            @close="close_show2"
        >
            <ParamSubRuleBindShow
                style="height: 600px;"
                ref="ParamSubRuleBindShow"
                @closeDialog_Fn2="closeDialogFn2"
                @open_show2_1="open_show2_1"
            />

        </el-dialog>

    </div>
</template>

<script>
    import ParamSubRuleEdit from './dialogComponents/param_rule_edit.vue'
    import ParamSubRuleBindShow from './dialogComponents/param_sub_rule_bind_show.vue'

    let _paramRule = {
        ruleName: '',
        checkType: '',
        templateType: '',
        fromDate: '',
        toDate: ''
    }
    export default {
        name: 'paramrule',
        components: {
            ParamSubRuleEdit,
            ParamSubRuleBindShow,
        },
        data () {
            return {
                checkTypeList: [],
                paramRule: JSON.parse(JSON.stringify(_paramRule)),
                dateRangeValue: ['', ''],
                //
                tableData: [],
                Loading1: false,
                //
                total: 0,
                currentPage: 1,
                pageSize: 15,
                //
                show1: false,
                dialogTitle1: '新建',
                editData: null,
                //
                show2: false,
            }
        },
        watch: {
            dateRangeValue (value) {
                if (value == null) {
                    this.paramRule.fromDate = ''
                    this.paramRule.toDate = ''
                } else {
                    this.paramRule.fromDate = value[0]
                    this.paramRule.toDate = value[1]
                }
            },
        },
        computed: {
            dialogTitle () {
                return `${this.dialogTitle1}模板数据填写规则`
            }
        },
        mounted () {
            this.goNextPage('1')
        },
        methods: {
            /*
            * 获取检测类型
            * */
            getCheckType () {
                this.$api.paramRule.getCheckType()
                    .then((resp) => {
                        let temp = resp.data.data
                        this.checkTypeList = temp.slice(0)
                    })
                    .catch(() => {
                    })
            },
            /*
            * 查询
            * */
            goNextPage (currentPage) {
                this.getCheckType()
                this.Loading1 = true
                let params = {
                    ...JSON.parse(JSON.stringify(this.paramRule)),
                    currentPage,
                    pageSize: this.pageSize,
                }
                this.$api.paramRule.paramrule_search(params)
                    .then(resp => {
                        let temp = resp.data.data
                        this.total = temp[0].total
                        this.tableData = [...temp]
                    })
                    .catch(err => {
                    })
                    .then(() => {
                        this.Loading1 = false
                    })
            },
            /*
            * 重置
            * */
            resetButton () {
                this.paramRule = JSON.parse(JSON.stringify(_paramRule))
                this.goNextPage('1')
            },
            /*
            * 删除
            * */
            goDelete (id) {
                this.$api.paramRule.paramrule_delete(id)
                    .then((resp) => {
                        this.goNextPage(this.currentPage)
                    })
                    .catch(() => {
                    })
            },
            /* ************************************************************ */
            /*
            * 新建单数据填写规则
            * */
            goAdd () {
                this.dialogTitle1 = '新建'
                this.show1 = true
            },
            /*
            * (新建/编辑) 弹框关闭 前
            * */
            closeDialogFn1 (data) {
                let param = JSON.parse(JSON.stringify(data))
                this.$api.paramRule.paramrule_add(param)
                    .then(resp => {
                        this.goNextPage(this.currentPage)
                    })
                    .catch(err => {
                    })
                this.show1 = false
            },
            /*
            * (新建/编辑) 弹框关闭 时
            * */
            close_show1 () {
                this.dialogTitle1 = '新建'
                this.editData = null
                this.$nextTick(() => {
                    this.$refs['ParamSubRuleEdit'].$refs['form1'].clearValidate()
                })
                Object.assign(
                    this.$refs['ParamSubRuleEdit'].$data,
                    this.$refs['ParamSubRuleEdit'].$options.data()
                )
            },
            /*
            * 编辑
            * */
            goEdit (data) {
                this.dialogTitle1 = '编辑'
                this.show1 = true
                this.$nextTick(() => {
                    let temp = JSON.parse(JSON.stringify(data))
                    delete temp['paramSubrules']
                    this.editData = temp
                })
            },
            /* ************************************************************ */
            /*
            * 打开 查看单数据填写规则 弹框
            * */
            goBindShow (data) {
                this.show2 = true
                this.$nextTick(() => {
                    this.$refs['ParamSubRuleBindShow'].rowId = data.id
                    if (data.paramSubrules) {
                        this.$refs['ParamSubRuleBindShow'].tableData = data.paramSubrules.slice(0)
                    }
                })
            },
            /*
            *  查看单数据填写规则 弹框前
            * */
            closeDialogFn2 () {

            },
            /*
            *  查看单数据填写规则 弹框时
            * */
            close_show2 () {
                Object.assign(
                    this.$refs['ParamSubRuleBindShow'].$data,
                    this.$refs['ParamSubRuleBindShow'].$options.data()
                )
                this.goNextPage(this.currentPage)
            },







            open_show2_1 () {
                this.show2_1 = true
            },
            close_show2_1 () {

            },
        }
    }
</script>

<style scoped lang="less">
    @import "./style/param_rule.less";
</style>
