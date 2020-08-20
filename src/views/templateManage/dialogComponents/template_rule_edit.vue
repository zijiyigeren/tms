<template>
    <!-- 编辑 模板生成规则 -->
    <div>
        (新建/编辑)模板生成规则
        <el-form
            ref="form1"
            v-bind="{
                model: orderTemplateRule,
                labelWidth: '35%',
                labelSuffix: ' :',
                size: 'mini',
                rules: ruleData
            }"
        >
            <el-form-item label="模板生成总规则名称" prop="ruleName">
                <div style="width: 65%;">
                    <el-input v-model.trim="orderTemplateRule.ruleName"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="检验类型" prop="checkType">
                <div style="width: 65%;">
                    <el-input v-model.trim="orderTemplateRule.checkType"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="子模板规则" prop="subRuleNames">
                <div style="width: 65%;position: relative;">
                    <el-input
                        type="textarea"
                        v-model.trim="orderTemplateRule.subRuleNames"
                        :readonly="true"
                        :autosize="{ minRows: 7, maxRows: 7 }"
                        resize="none"
                        maxlength="500"
                    />
                    <el-button type="text" style="position: absolute;bottom: 0;right: -50px;"
                               @click="goBind(orderTemplateRule.id)">[选择]
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="创建时间">
                <div style="width: 65%;">
                    <el-date-picker v-model="orderTemplateRule.createDate" :disabled="true"/>
                </div>
            </el-form-item>
            <el-form-item label="创建人">
                <div style="width: 65%;">
                    <el-input v-model="orderTemplateRule.creator" :readonly="true"></el-input>
                </div>
            </el-form-item>
        </el-form>
        <p style="text-align: right;">
            <el-button
                type="primary"
                size="mini"
                :loading="btnLoading1"
                :disabled="btnLoading1"
                @click="goAdd"
            >保存
            </el-button>
        </p>

        <!-- 绑定子模板规则 -->
        <el-dialog
            :visible.sync="show1"
            v-bind="{
                title: '绑定子模板规则',
                width:'80%',
                top: '7vh',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                modal: false,
            }"
            @close="closeFn"
        >
            <subTemplateRuleBind
                ref="subTemplateRuleBind"
                @GETfn1_bindIds="GETfn1_bindIds"
            />
        </el-dialog>
    </div>
</template>

<script>
    import subTemplateRuleBind from './dialogComponents/subtemplate_rule_bind'

    let _creator = window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).loginName : ''
    let _orderTemplateRule =
        {
            ruleName: '',
            checkType: '',
            subRuleNames: '',
            createDate: '',
            creator: _creator,
            id: '',
            subRuleIds: '',
        }
    let _ruleData =
        {
            'ruleName': [
                {required: true, message: '请填写', trigger: 'blur'}
            ],
            'checkType': [
                {required: true, message: '请填写', trigger: 'blur'}
            ],
            'subRuleNames': [
                {required: true, message: '请填写', trigger: 'blur'}
            ],
        }
    export default {
        name: 'templateRuleEdit',
        components: {
            subTemplateRuleBind,// 绑定子模板规则
        },
        props: {
            editData: {
                type: Object,
                default: function () {
                    return null
                }
            },
        },
        data () {
            return {
                //
                orderTemplateRule: JSON.parse(JSON.stringify(_orderTemplateRule)),
                ruleData: JSON.parse(JSON.stringify(_ruleData)),
                // 绑定子模板规则
                show1: false,
                //
                btnLoading1: false,
            }
        },
        watch: {
            editData (val) {
                if (!val) {
                    this.orderTemplateRule = JSON.parse(JSON.stringify(_orderTemplateRule))
                } else {
                    this.orderTemplateRule = val
                }
            }
        },
        methods: {
            /*
            * 子模板规则[选择]
            * 打开 绑定子模板规则弹框
            * */
            goBind (id) {
                this.show1 = true
                this.$nextTick(() => {
                    if (this.orderTemplateRule.subRuleIds !== '') {
                        this.$refs['subTemplateRuleBind'].bindIds = this.orderTemplateRule.subRuleIds.split(',')
                    }
                    this.$refs['subTemplateRuleBind'].goNextPage('1')
                })
            },
            /*
            * 根据改变的子模板规则ids请求子模板名字
            * */
            GETfn1_bindIds (data) {
                if (data.length !== 0) {
                    this.orderTemplateRule.subRuleIds = data.toString()
                    let params = {
                        SubIds: data.toString()
                    }
                    this.$api.templateRule.getSubRuleNames(params)
                        .then(res => {
                            this.orderTemplateRule.subRuleNames = res.data.data + ''
                        })
                        .catch()
                } else {
                }
                this.show1 = false
            },
            /*
            * 绑定子模板规则弹框 关闭时
            * */
            closeFn () {
                Object.assign(
                    this.$refs['subTemplateRuleBind'].$data,
                    this.$refs['subTemplateRuleBind'].$options.data()
                )
            },
            goAdd () {
                this.$refs['form1'].validate(valid => {
                    if (valid) {
                        this.btnLoading1 = true
                        let data = JSON.parse(JSON.stringify(this.orderTemplateRule))
                        this.$emit('closeDialog_Fn1', data)
                    } else {
                        return false
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
