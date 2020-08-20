<template>
    <!-- 模板生成规则 -->
    <div style="width:100%;height: 100%;display: flex;flex-direction: column;">
        (主)模板生成规则
        <div>
            <el-form
                v-bind="{
                  model: formData,
                  labelWidth: '130px',
                  labelSuffix: ' :',
                  size: 'mini',
                }"
            >
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="报告模板生成总规则" label-width="150px">
                            <el-input v-model="formData.ruleName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="检测类型">
                            <el-select style="width: 100%;" v-model="formData.checkType">
                                <el-option label="全部" value=""/>
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
                        <el-form-item label="创建人">
                            <el-input v-model="formData.creator"></el-input>
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
                           @click="createTemplateRule"
                >新建报告模板生成总规则
                </el-button>
                <el-button size="mini" type="primary" @click="goNextPage('1')">查询</el-button>
                <el-button size="mini" type="info" @click="resetButton">重置</el-button>
            </p>
        </div>
        <div style="flex: 1;overflow: hidden;">
            <el-table
                v-loading="loading2"
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
                    label="报告模板生成总规则"
                    width="300"
                    :resizable="false"
                    property="ruleName"
                />
                <el-table-column
                    label="检测类型"

                    :resizable="false"
                    property="checkType"
                />
                <el-table-column
                    label="上传时间"
                    :formatter="formatter_createDate"
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

                    :resizable="false"
                    property=""
                >
                    <template slot-scope="{ row, $index }">
                        <a-button type="link" style="padding: 0;" @click="goEdit(row)">
                            <a-icon type="edit"/>
                            编辑
                        </a-button>
                        <a-button type="link" style="padding: 0;margin: 0 10px;"
                                  @click="goBindShow(row)">查看子模板规则
                        </a-button>
                        <a-button type="link" style="padding: 0;color: red;" @click="goDelete(row.id)">
                            <a-icon type="delete"/>
                            删除
                        </a-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            :total="total"
            :currentPage="currentPage"
            :pageSize="pageSize"
            v-bind="{
              layout:'total,->, prev, pager, next, jumper'
            }"
            @size-change="(val)=>{
              pageSize = val
            }"
            @current-change="(val)=>{
              currentPage = val
              goNextPage((val+''))
            }"
        />

        <!-- 新建/编辑 报告模板生成总规则 -->
        <el-dialog
            :visible.sync="show1"
            v-bind="{
                top: '5vh',
                width: '60%',
                title: dialogTitle,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                modal: false,
              }"
            @close="close_show1"
        >
            <TemplateRuleEdit
                ref="TemplateRuleEdit"
                :edit-data="editData"
                @closeDialog_Fn1="closeDialogFn1"
            />
        </el-dialog>

        <!-- 查看子模板规则 -->
        <el-dialog
            :visible.sync="show2"
            v-bind="{
                top: '7vh',
                width: '65%',
                title: '子模板规则',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                modal: false,
            }"
            @close="close_show2"
        >
            <SubtemplateRuleBindShowTemplaterule
                ref="SubtemplateRuleBindShowTemplaterule"
                @openFn1_show3="openFn1_show3"
            />

            <!-- 子模板规则 添加 -->
            <el-dialog
                :visible.sync="show3"
                v-bind="{
                    top: '4vh',
                    width: '80%',
                    title: '绑定子模板规则',
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    // modal: false,
                }"
                append-to-body
                @close="close_show3"
            >
                <subTemplateRuleBind
                    ref="subTemplateRuleBind2"
                    @GETfn1_bindIds="GETfn1_bindIds"
                />
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
    import {timestampToTime,} from '@/views/templateManage/js/index.js'
    import TemplateRuleEdit from './dialogComponents/template_rule_edit'
    import SubtemplateRuleBindShowTemplaterule from './dialogComponents/subtemplate_rule_bind_show_templaterule'
    import subTemplateRuleBind from './dialogComponents/dialogComponents/subtemplate_rule_bind.vue'

    let formData = {
        ruleName: '',// 报告模板深生成总规则
        checkType: '',// 检验类型
        creator: '',// 创建人
        fromDate: '',// 上传时间开始
        toDate: '',// 上传时间结束
    }
    export default {
        name: 'templaterule',
        components: {
            TemplateRuleEdit,
            SubtemplateRuleBindShowTemplaterule,
            subTemplateRuleBind,
        },
        data () {
            return {
                //
                checkTypeList: [],
                // 查询条件参数
                formData: JSON.parse(JSON.stringify(formData)),
                dateRangeValue: ['', ''],
                // 分页器参数
                total: 0,
                currentPage: 1,
                pageSize: 15,
                // 表格参数
                tableData: [],
                loading2: false,
                // 弹框状态
                dialogTitle1: '新建',
                // 报告模板生成总规则弹框
                show1: false,
                //
                editData: null,
                //
                show2: false,
                //
                show3: false,
                currentId: '',
            }
        },
        watch: {
            dateRangeValue (value) {
                if (value == null) {
                    this.formData.fromDate = ''
                    this.formData.toDate = ''
                } else {
                    this.formData.fromDate = Date.parse(value[0])
                    this.formData.toDate = Date.parse(value[1])
                }
            },
        },
        computed: {
            dialogTitle () {
                return `${this.dialogTitle1}报告模板生成总规则`
            }
        },
        methods: {
            /*
            * 获取检测类型
            * */
            getCheckType () {
                this.$api.templateRule.getCheckType()
                    .then(resp => {
                        let temp = resp.data.data
                        this.checkTypeList = temp.slice(0)
                    })
                    .catch()
            },
            /*
            * 查询
            * */
            goNextPage (currentPage) {
                this.getCheckType()
                this.loading2 = true
                let params = {
                    ...JSON.parse(JSON.stringify(this.formData)),
                    currentPage,
                }
                this.$api.templateRule.templateRule_list(params)
                    .then(resp => {
                        let temp = resp.data.data
                        this.tableData = temp.slice(0)
                        this.total = temp[0].total
                    })
                    .catch(err => {
                    })
                    .then(() => {
                        this.loading2 = false
                    })
            },
            /*
            * 重置
            * */
            resetButton () {
                this.formData = JSON.parse(JSON.stringify(formData))
                this.goNextPage('1')
            },
            /*
            * 删除
            * */
            goDelete (id) {
                this.$api.templateRule.templateRule_delete(id)
                    .then(res => {
                        this.goNextPage(this.currentPage)
                    })
                    .catch(err => {

                    })
            },
            /*
            * 新建
            * */
            createTemplateRule () {
                this.dialogTitle1 = '新建'
                this.show1 = true
            },
            /*
            * 弹框保存按钮点击时
            * */
            closeDialogFn1 (data) {
                // console.log(data,'保存的数据')
                // return
                this.$api.templateRule.templateRule_add(data)
                    .then(resp => {
                        // let temp = resp.data.data
                        this.$refs['TemplateRuleEdit'].btnLoading1 = false
                        this.show1 = false
                        this.goNextPage(this.currentPage)
                    })
                    .catch()
            },
            /*
            * 关闭新建 / 编辑弹框时
            * */
            close_show1 () {
                this.editData = null
                Object.assign(this.$refs['TemplateRuleEdit'].$data, this.$refs['TemplateRuleEdit'].$options.data())
                this.$nextTick(() => {
                    this.$refs['TemplateRuleEdit'].$refs['form1'].clearValidate()
                })
            },
            /*
            * 编辑
            * */
            goEdit (data) {
                this.dialogTitle1 = '编辑'
                this.show1 = true
                this.$nextTick(() => {
                    let temp = JSON.parse(JSON.stringify(data))
                    let subRuleNames = ''
                    temp.subRules.forEach(item => {
                        subRuleNames += item.subRuleName + '\n'
                    })
                    temp['subRuleNames'] = subRuleNames

                    delete temp.subRules
                    delete temp.list
                    this.editData = temp
                })
            },
            /*
            * 查看子模板规则
            * */
            goBindShow (data) {
                let temp = JSON.parse(JSON.stringify(data))
                this.currentId = temp.id
                this.show2 = true
                this.$nextTick(() => {
                    this.$refs['SubtemplateRuleBindShowTemplaterule'].currentId = temp.id
                    this.$refs['SubtemplateRuleBindShowTemplaterule'].goBindSubRuleShow(temp.id)
                })
            },
            /*
            * 查看子模板规则关闭时
            * */
            close_show2 () {
                Object.assign(
                    this.$refs['SubtemplateRuleBindShowTemplaterule'].$data,
                    this.$refs['SubtemplateRuleBindShowTemplaterule'].$options.data()
                )
                this.goNextPage(this.currentPage)
            },
            /*
            * 查看子模板规则 - 添加
            * */
            openFn1_show3 (data) {
                this.show3 = true
                this.$nextTick(() => {
                    this.$refs['subTemplateRuleBind2'].goNextPage('1')
                    this.$refs['subTemplateRuleBind2'].bindIds = data.slice(0)
                })
            },
            /*
            * 绑定子模板规则弹框关闭 前
            * */
            GETfn1_bindIds (data) {
                let params = {
                    id: this.currentId,
                    subIds: data.toString(),
                }
                let that = this
                this.$api.templateRule.addBindSubRule(params)
                    .then(res => {
                        this.show3 = false
                        that.$refs['SubtemplateRuleBindShowTemplaterule'].goBindSubRuleShow(this.currentId)
                    })
                    .catch()
            },
            /*
            * 绑定子模板规则弹框关闭 时
            * */
            close_show3 () {
                Object.assign(
                    this.$refs['subTemplateRuleBind2'].$data,
                    this.$refs['subTemplateRuleBind2'].$options.data()
                )
            },



            /*
            * 时间戳格式化
            * */
            formatter_createDate (row, column, cellValue, index) {
                return timestampToTime(cellValue)
            },
        },
        mounted () {
            this.goNextPage('1')
        }
    }
</script>

<style scoped lang="less">
    @import './style/template_rule';
    /*.mlyTableClass {*/
    /*    tr {*/
    /*        th, td {*/
    /*            height: 42px;*/
    /*            border: 1px #d0d7e5 solid;*/
    /*        }*/
    /*    }*/
    /*}*/
</style>
