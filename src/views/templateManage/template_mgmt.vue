<template>
    <!-- 模板管理 -->
    <div style="width:100%;height: 100%;display: flex;flex-direction: column;">
        <div>
            <el-form
                ref="form_01"
                v-bind="{
                  model: orderTemplate,
                  labelWidth: '90px',
                  labelSuffix: ' :',
                  size:'mini',
                }"
            >
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="模板名称">
                            <el-input v-model="orderTemplate.templateName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="检验类型">
                            <el-select style="width: 100%;" v-model="orderTemplate.checkType">
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
                            <el-select style="width: 100%;" v-model="orderTemplate.templateType">
                                <el-option label="主模板" value="0"></el-option>
                                <el-option label="子模板" value="1"></el-option>
                                <el-option label="样品模板" value="2"></el-option>
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
                >新建模板
                </el-button>
                <el-button size="mini" type="primary" @click="goNextPage(1)">查询</el-button>
                <el-button size="mini" type="info" @click="resetButton">重置</el-button>
            </p>
        </div>
        <div style="flex: 1;overflow: hidden;" v-loading="loading">
            <el-table
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
                    label="模板名称"
                    width=""
                    :resizable="false"
                    property="templateName"
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
                    label="操作"
                    align="center"
                    :resizable="false"
                    property=""
                    min-width="230"
                >
                    <template slot-scope="{ row, $index }">
                        <a-button type="link" style="padding: 0;" @click="godownload(row.templateId)">下载</a-button>
                        <a-button type="link" style="padding: 0;" @click="goView(row)">查看</a-button>
                        <a-button type="link" style="padding: 0;" @click="goEdit(row)">编辑</a-button>
                        <template v-if="row.templateType == 0">
                            <a-button type="link" style="padding: 0;" @click="goBindShow(row)">查看判别信息</a-button>
                            <a-button type="link" style="padding: 0;" @click="goBindOrdertemplateRule(row)">绑定模板规则
                            </a-button>
                        </template>
                        <a-button type="link" style="padding: 0;color: red;" @click="goDel(row.id)">删除</a-button>
                        <a-button type="link" style="padding: 0;" @click="goBindParamRule(row)">绑定数据填写规则</a-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            :total="total"
            :currentPage="currentPage"
            :pageSize="pageSize"
            v-bind="{
                layout:'total, -> ,prev, pager, next, jumper'
            }"
            @size-change="(val)=>{
              pageSize = val
            }"
            @current-change="(val)=>{
              currentPage = val
            }"
        />

        <!-- 新建/修改/查看 模板 -->
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
            <TemplateMgmtEdit
                ref="TemplateMgmtEdit"
                :edit-data="editData"
                @closeDialog_Fn1="closeDialog_Fn1"
            />
        </el-dialog>

        <!-- 查看判别信息 -->
        <el-dialog
            :visible.sync="show2"
            v-bind="{
                top: '7vh',
                width: '75%',
                title: '判别信息',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                modal: false,
            }"
            @close="close_show2"
        >
            <JudgeInfoBindShow
                ref="JudgeInfoBindShow"
                style="height: 600px;"
                :row-id="current_id"
            />

            <!-- 添加判别信息 -->
            <el-dialog
                :visible.sync="show2_1"
                v-bind="{
          top: '4vh',
          width: '80%',
          title: '绑定判别信息',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          modal: false,
        }"
                append-to-body
            >
                <JudgeInfoBind
                    style="height: 600px;"
                />
            </el-dialog>
        </el-dialog>

        <!-- 绑定数据填写规则 -->
        <el-dialog
            :visible.sync="show3"
            v-bind="{
                top: '7vh',
                width: '75%',
                title: '绑定数据填写规则',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                modal: false,
              }"
            @close="close_show3"
        >
            <ParamRuleBind
                style="height: 700px;"
                ref="ParamRuleBind"
                @beforeClose_show3="beforeClose_show3"
            />
        </el-dialog>

        <!-- 绑定模板规则 -->
        <el-dialog
            :visible.sync="show4"
            v-bind="{
                top: '7vh',
                width: '75%',
                title: '绑定模板规则',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                modal: false,
            }"
            @close="close_show4"
        >
            <TemplateRuleBind
                style="height: 700px;"
                ref="TemplateRuleBind"
                @beforeClose_show4="beforeClose_show4"
            />
        </el-dialog>
    </div>
</template>

<script>
    import base from '@/api/base.js'
    import TemplateMgmtEdit from './dialogComponents/template_mgmt_edit.vue'
    import JudgeInfoBindShow from './dialogComponents/judge_info_bind_show'
    import TemplateRuleBind from './dialogComponents/template_rule_bind.vue'

    //
    import JudgeInfoBind from './dialogComponents/dialogComponents/judge_info_bind.vue'
    import ParamRuleBind from './dialogComponents/param_rule_bind.vue'

    let _orderTemplate = {
        templateName: '',
        checkType: '',
        templateType: '',
        fromDate: '',
        toDate: ''
    }
    export default {
        name: 'templatemgmt',
        components: {
            TemplateMgmtEdit,// (新建/编辑)
            JudgeInfoBindShow,// 绑定信息
            JudgeInfoBind,//
            ParamRuleBind,
            TemplateRuleBind,
        },
        data () {
            return {
                checkTypeList: [],
                //
                orderTemplate: JSON.parse(JSON.stringify(_orderTemplate)),
                dateRangeValue: ['', ''],
                //
                loading: false,
                tableData: [],
                //
                currentPage: 1,
                pageSize: 15,
                total: 0,
                //
                show1: false,
                dialogTitle1: '新建',
                editData: null,
                //
                show2: false,
                current_id: '',
                //
                show2_1: false,
                //
                show3: false,
                //
                show4: false,
            }
        },
        watch: {
            dateRangeValue (value) {
                if (value == null) {
                    this.orderTemplate.fromDate = ''
                    this.orderTemplate.toDate = ''
                } else {
                    this.orderTemplate.fromDate = value[0]
                    this.orderTemplate.toDate = value[1]
                }
            },
        },
        computed: {
            dialogTitle () {
                return `${this.dialogTitle1}模板`
            }
        },
        methods: {
            /*
            * 获取检验类型
            * */
            getCheckType () {
                this.$api.subtemplateRule.getCheckType()
                    .then((resp) => {
                        let temp = resp.data.data
                        this.checkTypeList = temp.slice(0)
                    })
                    .catch(() => {
                    })
            },
            /*
            * 重置
            * */
            resetButton () {
                // this.$refs['form_01'].clear()
            },
            /*
* 查询
* */
            goNextPage (currentPage) {
                this.getCheckType()
                let that = this
                this.loading = true
                let params = {
                    ...JSON.parse(JSON.stringify(this.orderTemplate)),
                    currentPage,
                }
                this.$api.templateMgmt.getLis(params)
                    .then((res) => {
                        let temp = res.data.data
                        this.tableData = temp.slice(0)
                        try {
                            that.total = temp[0].total
                        } catch (e) {
                            that.total = 0
                        }
                    })
                    .catch()
                    .then(() => {
                        this.loading = false
                    })
            },
            /*
            * 删除
            * */
            goDel (id) {
                let params = {
                    id,
                }
                this.$api.templateMgmt.delete(params)
                    .then(() => {
                        this.goNextPage(this.currentPage)
                    })
                    .catch()
            },
            /*
            * (新建/编辑)模板 打开弹框
            * */
            goAdd () {
                this.show1 = true
            },
            /*
            * (新建/编辑)模板弹框 关闭前
            * */
            closeDialog_Fn1 () {
                this.show1 = false
                this.goNextPage(this.currentPage)
            },
            /*
            * (新建/编辑)模板弹框 关闭时
            * */
            close_show1 () {
                Object.assign(
                    this.$refs['TemplateMgmtEdit'].$data,
                    this.$refs['TemplateMgmtEdit'].$options.data()
                )
                this.$nextTick(() => {
                    this.$refs['TemplateMgmtEdit'].$refs['form_show1'].clearValidate()
                })
            },
            /*
            * 下载
            * */
            godownload (fileId) {
                if (fileId) {
                    window.open(`${base.baseUrl}/sys/lims/file/${fileId}/download`)
                }
            },
            /*
            * 查看
            * */
            goView (data) {
                this.dialogTitle1 = '查看'
                this.show1 = true
                this.$nextTick(() => {
                    this.editData = JSON.parse(JSON.stringify(data))
                })
            },
            /*
            * 编辑
            * */
            goEdit (data) {
                this.dialogTitle1 = '修改'
                this.show1 = true
                this.$nextTick(() => {
                    this.editData = JSON.parse(JSON.stringify(data))
                    this.$refs['TemplateMgmtEdit'].fName = 'test.docx'
                })
            },
            /* ***************************************************************** */
            /*
            * 查看判别信息
            * */
            goBindShow (data) {
                this.show2 = true
                this.$nextTick(() => {
                    this.current_id = data.id
                    this.$refs['JudgeInfoBindShow'].tableData = data.judgeInfos.slice(0)
                    this.$refs['JudgeInfoBindShow'].arr1 = data.judgeInfos.map(item => {
                        return item.id
                    })
                })
            },
            /*
            * 查看判别信息弹框 关闭时
            * */
            close_show2 () {
                this.current_id = ''
                Object.assign(
                    this.$refs['JudgeInfoBindShow'].$data,
                    this.$refs['JudgeInfoBindShow'].$options.data()
                )
                this.goNextPage(this.currentPage)
            },
            /* ***************************************************************** */
            /*
            * 打开 绑定模板规则 弹框
            * */
            goBindOrdertemplateRule (data) {
                this.show4 = true
                this.$nextTick(() => {
                    this.$refs['TemplateRuleBind'].goNextPage(1)
                    this.$refs['TemplateRuleBind'].current_id = data.tempalteRuleId
                    this.$refs['TemplateRuleBind'].current_id2 = data.id
                })
            },
            /*
            * 绑定模板规则 弹框 关闭前
            * */
            beforeClose_show4 (data, data2) {
                let params = {
                    templateId: data,// 模版id
                    templateRuleId: data2// 模版总规则id
                }
                this.$api.templateMgmt.templateBindTemplateRule(params)
                    .then(() => {
                        this.show4 = false
                    })
                    .catch()
            },
            /*
            * 绑定模板规则 弹框 关闭时
            * */
            close_show4 () {
                Object.assign(
                    this.$refs['TemplateRuleBind'].$data,
                    this.$refs['TemplateRuleBind'].$options.data()
                )
                this.goNextPage(this.currentPage)
            },
            /* ***************************************************************** */
            /*
            * 打开 绑定数据填写规则 弹框
            * */
            goBindParamRule (data) {
                this.show3 = true
                this.$nextTick(() => {
                    this.$refs['ParamRuleBind'].goNextPage(1)
                    this.$refs['ParamRuleBind'].current_id = data.paramRuleId
                    this.$refs['ParamRuleBind'].current_id2 = data.id
                })
            },
            /*
            * 绑定数据填写规则 弹框前
            * */
            beforeClose_show3 (data, data2) {
                let params = {
                    templateId: data,// 模版id
                    paramRuleId: data2// 数据填写规则id
                }
                this.$api.templateMgmt.templateBindRule(params)
                    .then(() => {
                        this.show3 = false
                    })
                    .catch()
            },
            /*
            * 绑定数据填写规则 弹框时
            * */
            close_show3 () {
                Object.assign(
                    this.$refs['ParamRuleBind'].$data,
                    this.$refs['ParamRuleBind'].$options.data()
                )
                this.goNextPage(this.currentPage)
            },
        },
        mounted () {
            this.goNextPage(1)
        }
    }
</script>

<style scoped lang="less">

</style>
