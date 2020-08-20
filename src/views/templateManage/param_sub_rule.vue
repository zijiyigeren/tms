<template>
    <!-- 单数据填写规则 -->
    <div style="width:100%;height: 100%;display: flex;flex-direction: column;">
        <div>
            <el-form
                v-bind="{
                  model: paramSubRule,
                  labelWidth: '150px',
                  labelSuffix: ' :',
                  size:'mini',
                }"
            >
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="单数据填写规则">
                            <el-input v-model="paramSubRule.ruleName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="检验类型">
                            <el-select style="width: 100%;" v-model="paramSubRule.checkType">
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
                            <el-select style="width: 100%;" v-model="paramSubRule.templateType">
                                <el-option label="1" value="1"></el-option>
                                <el-option label="2" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="书签名称">
                            <el-input v-model="paramSubRule.bookName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="创建人">
                            <el-input v-model="paramSubRule.creator"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="备注">
                            <el-input v-model="paramSubRule.remark"></el-input>
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
                >新建单数据填写规则
                </el-button>
                <el-button size="mini" type="primary" @click="goNextPage('1')">查询</el-button>
                <el-button size="mini" type="info" @click="resetButton">重置</el-button>
            </p>
        </div>
        <div style="flex: 1;overflow: hidden;" v-loading="load">
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
                    label="单数据填写规则名称"
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
                    label="书签名称"

                    :resizable="false"
                    property="bookName"
                />
                <el-table-column
                    label="公式类型"

                    :resizable="false"
                    property="formulaType"
                />
                <el-table-column
                    label="创建时间"

                    :resizable="false"
                    property="createDate"
                />
                <el-table-column
                    label="创建人"

                    :resizable="false"
                    property="creator"
                />
                <el-table-column
                    label="备注"

                    :resizable="false"
                    property="remark"
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
                        <a-button type="link" style="padding: 0;" @click="goBindShow(row)">判别信息</a-button>
                        <a-button type="link" style="padding: 0;color: red;" @click="goDel(row.id)">删除</a-button>
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

        <!-- 新建/编辑 子模板规则 -->
        <el-dialog
            :visible.sync="show1"
            v-bind="{
                top: '5vh',
                // width: '1130px',
                title: dialogTitle,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                modal: false,
            }"
            @close="close_show1"
        >
            <ParamSubRuleEdit
                ref="SubTemplateRuleEdit"
                :edit-data="editData"
                @closeDialog_Fn1="closeDialog_Fn1"
            />
        </el-dialog>

        <!-- 判别信息 -->
        <el-dialog
            :visible.sync="show2"
            v-bind="{
                title: '判别信息',
                top: '7vh',
                width: '75%',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                modal: false,
            }"
            @close="close_show2"
        >
            <JudgeInfoBindShowParamsubrule
                ref="JudgeInfoBindShowParamsubrule"
                style="height: 600px;"
            />
        </el-dialog>

    </div>
</template>

<script>
    import ParamSubRuleEdit from './dialogComponents/param_sub_rule_edit.vue'
    import JudgeInfoBindShowParamsubrule from './dialogComponents/judge_info_bind_show_paramsubrule'

    let _paramSubRule = {
        ruleName: '',
        checkType: '',
        templateType: '',
        bookName: '',
        creator: '',
        remark: '',
        fromDate: '',
        toDate: ''
    }
    export default {
        name: 'paramsubrule',
        components: {
            ParamSubRuleEdit,
            JudgeInfoBindShowParamsubrule,
        },
        data () {
            return {
                checkTypeList: [],
                paramSubRule: JSON.parse(JSON.stringify(_paramSubRule)),
                dateRangeValue: ['', ''],
                //
                load: false,
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
            }
        },
        watch: {
            dateRangeValue (value) {
                if (value == null) {
                    this.paramSubRule.fromDate = ''
                    this.paramSubRule.toDate = ''
                } else {
                    this.paramSubRule.fromDate = value[0]
                    this.paramSubRule.toDate = value[1]
                }
            },
        },
        computed: {
            dialogTitle () {
                return `${this.dialogTitle1}子模板规则`
            }
        },
        methods: {
            /*
            * 获取检测类型
            * */
            getCheckType () {
                this.$api.paramSubRule.getCheckType()
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
                this.load = true
                this.getCheckType()
                let params = {
                    ...this.paramSubRule,
                    currentPage,
                }
                this.$api.paramSubRule.listSubRule(params)
                    .then(res => {
                        let temp = res.data.data
                        this.tableData = temp.slice(0)
                        this.total = temp[0].total
                    })
                    .catch()
                    .then(() => {
                        this.load = false
                    })
            },
            /*
            * 重置
            * */
            resetButton () {
            },
            /*
            * 新建单数据填写规则
            * */
            goAdd () {
                this.show1 = true
            },
            /*
            * (新建/编辑) 弹框 关闭前
            * */
            closeDialog_Fn1 (data) {
                this.$api.paramSubRule.addParamSubRule(data)
                    .then(res => {
                        this.show1 = false
                    })
                    .catch()
            },
            /*
            * (新建/编辑) 弹框 关闭时
            * */
            close_show1 () {
                this.dialogTitle1 = '新建'
                this.editData = null
                this.$nextTick(() => {
                    this.$refs['SubTemplateRuleEdit'].$refs['form1'].clearValidate()
                })
                Object.assign(
                    this.$refs['SubTemplateRuleEdit'].$data,
                    this.$refs['SubTemplateRuleEdit'].$options.data()
                )
                this.goNextPage(this.currentPage)
            },
            /* ***************************************************************** */
            /*
            * 删除
            * */
            goDel (id) {
                let params = {
                    subRuleId: id,
                }
                this.$api.paramSubRule.checkParamSubRuleBind(params)
                    .then(res => {
                        let temp = res.data.data
                        if (temp === '') {
                            this.$api.paramSubRule.deleteParamSubRule(params)
                                .then(res => {
                                    this.goNextPage(this.currentPage)
                                })
                        } else {
                            let HTMLstr =
                                `<div>
                                    <span style="color: red;">单数据填写规则已经被如下模板数据填写规则绑定，是否确认删除？</span><br>
                                    ${temp}
                                </div>`
                            this.$alert(
                                HTMLstr,
                                '信息',
                                {
                                    dangerouslyUseHTMLString: true,
                                    showCancelButton: true,
                                    showConfirmButton: true,
                                })
                                .then(() => {
                                    this.$api.paramSubRule.deleteParamSubRule(params)
                                        .then(res => {
                                            this.goNextPage(this.currentPage)
                                        })
                                })
                                .catch(() => {
                                })
                        }
                    })

            },
            /*
            * 打开 判别信息弹框
            * */
            goBindShow (data) {
                this.show2 = true
                this.$nextTick(() => {
                    if (data.judgeInfos) {
                        this.$refs['JudgeInfoBindShowParamsubrule'].currentId = data.id
                        this.$refs['JudgeInfoBindShowParamsubrule'].tableData = data.judgeInfos.slice(0)
                        // this.$refs['JudgeInfoBindShowSubTemplateRule'].arr1 = data.judgeInfos.map(item => {
                        //     return item.id
                        // })
                    }
                })
            },
            /*
            * 判别信息弹框 关闭时
            * */
            close_show2 () {
                Object.assign(
                    this.$refs['JudgeInfoBindShowParamsubrule'].$data,
                    this.$refs['JudgeInfoBindShowParamsubrule'].$options.data()
                )
                this.goNextPage(this.currentPage)
            },
            /*
            * 编辑
            * */
            goEdit (data) {
                this.dialogTitle1 = '修改'
                this.show1 = true
                this.$nextTick(() => {
                    this.editData = JSON.parse(JSON.stringify(data))
                })
            },
        },
        mounted () {
            this.goNextPage(1)
        }
    }
</script>

<style scoped lang="less">

</style>
