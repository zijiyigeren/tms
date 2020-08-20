<template>
    <div>
        <el-form
            ref="form2"
            v-bind="{
                model: orderTemplateSubRule,
                labelWidth: '30%',
                labelSuffix: ' :',
                size: 'mini',
                rules: ruleData
            }"
        >
            <el-form-item label="规则名称" prop="subRuleName">
                <div style="width: 65%;">
                    <el-input maxLength="50" v-model.trim="orderTemplateSubRule.subRuleName"/>
                </div>
            </el-form-item>
            <el-form-item label="检测类型" prop="checkType">
                <div style="width: 65%;">
                    <el-input maxLength="50" v-model.trim="orderTemplateSubRule.checkType"/>
                </div>
            </el-form-item>
            <el-form-item label="子模板" prop="subTemplateName">
                <div style="width: 65%;position: relative;">
                    <el-input
                        v-model.trim="orderTemplateSubRule.subTemplateName"
                        maxLength="50"
                        :readonly="true"
                    />
                    <input type="hidden" v-model.trim="orderTemplateSubRule.subTemplateId">
                    <el-button type="text"
                               style="position: absolute;bottom: 0;right: -50px;"
                               @click="goBindTemplate">[选择]
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="判别信息">
                <div style="width: 65%;position: relative;">
                    <!--{{orderTemplateSubRule.subRuleJudgeNames}}<br>
                    {{orderTemplateSubRule.subRuleJudgeIds}}-->
                    <el-input
                        type="textarea"
                        v-model.trim="orderTemplateSubRule.subRuleJudgeNames"
                        :readonly="true"
                        :autosize="{ minRows: 7, maxRows: 7 }"
                        resize="none"
                        maxlength="500"
                    />
                    <input type="hidden" v-model.trim="orderTemplateSubRule.subRuleJudgeIds">
                    <el-button type="text" style="position: absolute;bottom: 0;right: -50px;"
                               @click="goBindJudgeInfo">[选择]
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="创建时间">
                <div style="width: 65%;">
                    <el-date-picker v-model="orderTemplateSubRule.createDate" :disabled="true"/>
                </div>
            </el-form-item>
            <el-form-item label="创建人">
                <div style="width: 65%;">
                    <el-input maxLength="50" v-model.trim="orderTemplateSubRule.creator" :readonly="true"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="书签名称">
                <div style="width: 65%;">
                    <el-input maxLength="50" v-model.trim="orderTemplateSubRule.bookName"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="备注">
                <div style="width: 65%;">
                    <el-input maxLength="50" v-model.trim="orderTemplateSubRule.remark"></el-input>
                </div>
            </el-form-item>
        </el-form>
        <p style="text-align: right;">
            <el-button type="primary" size="mini" @click="goAdd">保存</el-button>
        </p>

        <!-- 绑定子模板 -->
        <el-dialog
            :visible.sync="show1"
            v-bind="{
                title: '绑定模板',
                width:'1250px',
                top: '10vh',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                modal: false,
            }"
            @close="close_dialog_show1"
        >
            <TemplateBind
                ref="TemplateBind"
                @getTemplateInfo="getTemplateInfo"
            />
        </el-dialog>

        <!-- 绑定判别信息 -->
        <el-dialog
            :visible.sync="show2"
            v-bind="{
                title: '绑定判别信息',
                width:'1300px',
                top: '10vh',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                modal: false,
            }"
            @close="close_dialog_show2"
        >
            <JudgeInfoBind
                ref="JudgeInfoBind"
                @GETfn1_bindIds="GETfn1_bindIds"
            />
        </el-dialog>
    </div>
</template>

<script>
    import TemplateBind from './dialogComponents/template_bind'
    import JudgeInfoBind from './dialogComponents/judge_info_bind'

    let _creator = window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).loginName : ''
    let _orderTemplateSubRule =
        {
            subRuleName: '',//
            checkType: '',//
            subTemplateName: '',//
            subTemplateId: '',
            //
            subRuleJudgeNames: '',
            subRuleJudgeIds: '',
            //
            createDate: '',//
            creator: _creator,//
            bookName: '',//
            remark: '',//
        }
    let _formRules =
        {
            'subRuleName': [
                {required: true, message: '请填写', trigger: 'blur'}
            ],
            'checkType': [
                {required: true, message: '请填写', trigger: 'blur'}
            ],
            'subTemplateName': [
                {required: true, message: '请填写', trigger: 'blur'}
            ],
        }

    export default {
        name: 'subtemplate_rule_edit',
        components: {
            TemplateBind,
            JudgeInfoBind,
        },
        data () {
            return {
                orderTemplateSubRule: JSON.parse(JSON.stringify(_orderTemplateSubRule)),
                ruleData: JSON.parse(JSON.stringify(_formRules)),
                //
                show1: false,
                //
                show2: false,
            }
        },
        props: {
            editData: {
                type: Object,
                default: function () {
                    return null
                }
            },
        },
        watch: {
            editData (val) {
                if (!val) {
                    this.orderTemplateSubRule = JSON.parse(JSON.stringify(_orderTemplateSubRule))
                } else {
                    this.orderTemplateSubRule = JSON.parse(JSON.stringify(val))
                }
            }
        },
        methods: {
            goAdd () {
                let params = {
                    ...this.orderTemplateSubRule
                }
                this.$api.subtemplateRule.subtemplateRule_add(params)
                    .then((res) => {
                    })
                    .catch(() => {
                    })
                this.$emit('closeDialog_Fn1')
            },
            /*
            * 子模板 选择
            * */
            goBindTemplate () {
                this.show1 = true
                this.$nextTick(() => {
                    this.$refs['TemplateBind'].orderTemplate['templateType'] = '0'
                    this.$refs['TemplateBind'].goNextPage('1')
                })
            },
            /*
            * 子模板 回显
            * */
            getTemplateInfo (data) {
                if (data) {
                    this.orderTemplateSubRule.subTemplateName = data.name
                    this.orderTemplateSubRule.subTemplateId = data.id
                }
                this.show1 = false
            },
            /*
            * 关闭 子模板选择 时
            * */
            close_dialog_show1 () {
                Object.assign(
                    this.$refs['TemplateBind'].$data,
                    this.$refs['TemplateBind'].$options.data()
                )
            },
            /* ********************************************* */
            /*
            * 判别信息 选择
            * */
            goBindJudgeInfo () {
                this.show2 = true
                this.$nextTick(() => {
                    if (this.orderTemplateSubRule.subRuleIds !== '') {
                        this.$refs['JudgeInfoBind'].bindIds = this.orderTemplateSubRule.subRuleJudgeIds.split(',').filter(item=>{
                            return item !=''
                        })
                        this.$refs['JudgeInfoBind'].bindNames = this.orderTemplateSubRule.subRuleJudgeNames.split('\n').filter(item=>{
                            return item !=''
                        })
                    }
                    this.$refs['JudgeInfoBind'].goNextPage('1')
                })
            },
            /*
            * 根据改变的判别信息ids请求判别信息名字
            * */
            GETfn1_bindIds (data,data2) {
                if (data.length !== 0) {
                    this.orderTemplateSubRule.subRuleJudgeIds = data.toString()
                    this.orderTemplateSubRule.subRuleJudgeNames = data2.join('\n')
                }
                this.show2 = false
            },
            /*
            * 关闭 判别信息 时
            * */
            close_dialog_show2 () {
                Object.assign(
                    this.$refs['JudgeInfoBind'].$data,
                    this.$refs['JudgeInfoBind'].$options.data()
                )
            },
        }
    }
</script>

<style scoped>

</style>
