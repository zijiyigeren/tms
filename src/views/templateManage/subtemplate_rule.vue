<template>
    <!-- 子模板生成规则 -->
    <div style="width:100%;height: 100%;display: flex;flex-direction: column;">
        子模板生成规则
        <div>
            <el-form
                v-bind="{
                  model: orderTemplateSubRule,
                  labelWidth: '150px',
                  labelSuffix: ' :',
                  size:'mini',
                }"
            >
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="子模板规则名称">
                            <el-input v-model="orderTemplateSubRule.subRuleName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="检测类型">
                            <el-select style="width: 100%;" v-model="orderTemplateSubRule.checkType">
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
                    <el-col :span="8">
                        <el-form-item label="书签名称">
                            <el-input v-model="orderTemplateSubRule.bookName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="创建人">
                            <el-input v-model="orderTemplateSubRule.creator"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
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
                <el-button size="mini" type="primary"
                           style="float: left;"
                           @click="goAdd"
                >新建子模板规则
                </el-button>
                <el-button size="mini" type="primary" @click="goNextPage('1')">查询</el-button>
                <el-button size="mini" type="info" @click="resetButton">重置</el-button>
            </p>
        </div>
        <div style="flex: 1;overflow: hidden;">
            <el-table
                v-loading="loading"
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
                    label="子模板规则名称"
                    width=""
                    :resizable="false"
                    property="subRuleName"
                />
                <el-table-column
                    label="检测类型"

                    :resizable="false"
                    property="checkType"
                />
                <el-table-column
                    label="子模板名称"

                    :resizable="false"
                >
                    <template slot-scope="{ row }">
                        {{row.orderTemplate ? row.orderTemplate.templateName : ''}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="书签名称"

                    :resizable="false"
                    property="bookName"
                />
                <el-table-column
                    label="创建时间"
                    property="createDate"
                    :resizable="false"
                    :formatter="formatter_createDate"
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
                        <a-button type="link" style="padding: 0;" @click="goBindShow(row.id)">查看判别信息</a-button>
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
            layout:'total, -> ,prev, pager, next, jumper'
        }"
            @size-change="(val)=>{
          pageSize = val
        }"
            @current-change="(val)=>{
          currentPage = val
          goNextPage((val+''))
        }"
        />

        <!-- 新建 / 编辑 子模板规则 -->
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
            <SubTemplateRuleEdit
                ref="SubTemplateRuleEdit"
                :edit-data="editData"
                @closeDialog_Fn1="closeDialogFn1"
            />
        </el-dialog>

        <!-- 查看判别信息 -->
        <el-dialog
            :visible.sync="show2"
            v-bind="{
                title: '判别信息',
                // top: '7vh',
                width: '75%',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                modal: false,
            }"
            @close="close_show2"
        >
            <JudgeInfoBindShowSubtemplaterule
                style="height: 600px;"
                ref="JudgeInfoBindShowSubtemplaterule"
                :row-id="current_id"
            />
        </el-dialog>

    </div>
</template>

<script>
    import SubTemplateRuleEdit from './dialogComponents/subtemplate_rule_edit'
    import JudgeInfoBindShowSubtemplaterule from './dialogComponents/judge_info_bind_show_subtemplaterule'
    import {timestampToTime,} from '@/views/templateManage/js/index.js'

    let orderTemplateSubRule = {
        subRuleName: '',
        checkType: '',
        bookName: '',
        creator: '',
        fromDate: '',
        toDate: ''
    }
    export default {
        name: 'subtemplaterule',
        components: {
            SubTemplateRuleEdit,
            JudgeInfoBindShowSubtemplaterule,
        },
        data () {
            return {
                checkTypeList: [],
                orderTemplateSubRule: JSON.parse(JSON.stringify(orderTemplateSubRule)),
                dateRangeValue: ['', ''],
                //
                tableData: [],
                loading: false,
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
                show3: false,
            }
        },
        watch: {
            dateRangeValue (value) {
                if (value == null) {
                    this.orderTemplateSubRule.fromDate = ''
                    this.orderTemplateSubRule.toDate = ''
                } else {
                    this.orderTemplateSubRule.fromDate = value[0]
                    this.orderTemplateSubRule.toDate = value[1]
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
                this.$api.subtemplateRule.getCheckType()
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
                let that = this
                this.loading = true
                let params = {
                    ...JSON.parse(JSON.stringify(this.orderTemplateSubRule)),
                    currentPage
                }
                this.$api.subtemplateRule.subtemplateRule_list(params)
                    .then(res => {
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
            * 重置
            * */
            resetButton () {
            },
            /*
            * 删除
            * */
            goDelete (id) {
                this.$api.subtemplateRule.subtemplateRule_delete(id)
                    .then(res => {
                        this.goNextPage(this.currentPage)
                    })
                    .catch()
            },
            /*
            * 查看判别信息
            * */
            goBindShow (id) {
                this.show2 = true
                this.$nextTick(() => {
                    this.current_id = id
                })
            },
            /*
            * 查看判别信息弹框 关闭时
            * */
            close_show2 () {
                this.current_id = ''
                Object.assign(
                    this.$refs['JudgeInfoBindShowSubtemplaterule'].$data,
                    this.$refs['JudgeInfoBindShowSubtemplaterule'].$options.data()
                )
                this.goNextPage(this.currentPage)
            },
            /*
            * 新建 子模板规则
            * */
            goAdd () {
                this.show1 = true
            },
            /*
            * 编辑 子模板规则
            * */
            goEdit (data) {
                this.dialogTitle1 = '修改'
                this.show1 = true
                this.$nextTick(() => {
                    this.editData = JSON.parse(JSON.stringify(data))
                })
            },
            /*
            * (新增/编辑)子模板规则弹框 关闭前
            * */
            closeDialogFn1 () {
                this.show1 = false
            },
            /*
            * (新增/编辑)子模板规则弹框 关闭时
            * */
            close_show1 () {
                Object.assign(
                    this.$refs['SubTemplateRuleEdit'].$data,
                    this.$refs['SubTemplateRuleEdit'].$options.data()
                )
                this.dialogTitle1 = '新建'
                this.editData = null
                this.$nextTick(()=>{
                    this.$refs['SubTemplateRuleEdit'].$refs['form2'].clearValidate()
                })
                this.goNextPage(this.currentPage)
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

</style>
