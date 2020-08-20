<template>
    <div>
        <el-form
            ref="form1"
            v-bind="{
                model: paramRule,
                labelWidth: '35%',
                labelSuffix: ' :',
                size: 'mini',
                rules: ruleData
            }"
        >
            <el-form-item label="模板数据填写规则名称" prop="ruleName">
                <div style="width: 65%;">
                    <el-input v-model.trim="paramRule.ruleName"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="检测类型" prop="checkType">
                <div style="width: 65%;">
                    <el-input v-model.trim="paramRule.checkType"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="模板类型" prop="templateType">
                <div style="width: 65%;">
                    <el-select
                        style="width: 100%;"
                        v-model="paramRule.templateType"
                    >
                        <el-option label="主模板" value="0"/>
                        <el-option label="子模板" value="1"/>
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item label="单数据填写规则" prop="paramSubRuleNames">
                <div style="width: 65%;position: relative;">
                    <el-input
                        type="textarea"
                        v-model.trim="paramRule.paramSubRuleNames"
                        :readonly="true"
                        maxlength="500"
                        :autosize="{ minRows: 7, maxRows: 7 }"
                        resize="none"
                    />
                    <input type="hidden" v-model="paramRule.paramSubRuleIds">
                    <el-button type="text" style="position: absolute;bottom: 0;right: -50px;"
                               @click="goBind">[选择]
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="创建人" prop="creator">
                <div style="width: 65%;">
                    <el-input v-model="paramRule.creator" :readonly="true"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="创建时间">
                <div style="width: 65%;">
                    <el-date-picker
                        style="width: 100%;"
                        v-model="paramRule.createDate"
                        :disabled="true"
                    />
                </div>
            </el-form-item>
        </el-form>
        <p style="text-align: right;">
            <el-button
                type="primary"
                size="mini"
                @click="goAdd"
            >保存
            </el-button>
        </p>
        <!-- 绑定单数据填写规则 -->
        <el-dialog
            :visible.sync="show1"
            v-bind="{
                title: '绑定单数据填写规则',
                width:'80%',
                top: '10vh',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                modal: false,
            }"
            @close="close_show1"
        >
            <ParamSubRuleBind
                style="height: 600px;"
                ref="ParamSubRuleBind"
                @closeDialogFn1_1="closeDialogFn1_1"
            />
        </el-dialog>
    </div>
</template>

<script>
    import ParamSubRuleBind from './dialogComponents/param_sub_rule_bind'

    let _creator = window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).loginName : ''
    let _paramRule =
        {
            ruleName: '',
            checkType: '',
            templateType: '0',
            createDate: '',
            creator: _creator,
            id: '',
            paramSubRuleIds: '',
            paramSubRuleNames: '',
        }
    let _ruleData =
        {
            'ruleName': [
                {required: true, message: '请填写', trigger: 'blur'}
            ],
            'checkType': [
                {required: true, message: '请填写', trigger: 'blur'}
            ],
            'templateType': [
                {required: true, message: '请选择', trigger: 'change'}
            ],
            'paramSubRuleNames': [
                {required: true, message: '请选择', trigger: ['blur','input']},
            ],
            'creator': [
                {required: true, message: '请选择', trigger: 'blur'}
            ],
        }
    export default {
        name: 'param_rule_edit',
        components: {
            ParamSubRuleBind,
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
                paramRule: JSON.parse(JSON.stringify(_paramRule)),
                ruleData: JSON.parse(JSON.stringify(_ruleData)),
                // 绑定单数据填写规则
                show1: false
            }
        },
        watch: {
            editData (val) {
                if (!val) {
                    this.paramRule = JSON.parse(JSON.stringify(_paramRule))
                } else {
                    this.paramRule = val
                }
            }
        },
        methods: {
            /*
            * 打开单数据填写规则 弹框
            * */
            goBind (id) {
                this.show1 = true
                this.$nextTick(() => {
                    if (this.paramRule.paramSubRuleIds !== '') {
                        this.$refs['ParamSubRuleBind'].bindIds = this.paramRule.paramSubRuleIds.split(',').filter(item => {
                            return item != ''
                        })
                        this.$refs['ParamSubRuleBind'].bindNames = this.paramRule.paramSubRuleNames.split('\n').filter(item => {
                            return item != ''
                        })
                    }
                    this.$refs['ParamSubRuleBind'].goNextPage('1')
                })
            },
            /*
            * 单数据填写规则 弹框 关闭前
            * */
            closeDialogFn1_1 (data, data2) {
                if (data.length !== 0) {
                    this.paramRule.paramSubRuleIds = data.toString()
                    this.paramRule.paramSubRuleNames = data2.join('\n')
                }
                this.show1 = false
            },
            /*
            * 单数据填写规则 弹框 关闭时
            * */
            close_show1 () {
                Object.assign(
                    this.$refs['ParamSubRuleBind'].$data,
                    this.$refs['ParamSubRuleBind'].$options.data()
                )
            },

            goAdd () {
                this.$refs['form1'].validate((valid, object) => {
                    if (valid) {
                        this.$emit('closeDialog_Fn1', this.paramRule)
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
