<template>
    <div>
        <el-form
            ref="form1"
            v-bind="{
                model: paramSubRule,
                labelWidth: '35%',
                labelSuffix: ' :',
                size: 'mini',
                rules: ruleData
            }"
        >
            <el-form-item label="单数据填写规则" prop="ruleName">
                <div style="width: 65%;">
                    <el-input v-model.trim="paramSubRule.ruleName"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="书签名称" prop="bookName">
                <div style="width: 65%;">
                    <el-input v-model.trim="paramSubRule.bookName"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="检测类型" prop="checkType">
                <div style="width: 65%;">
                    <el-input v-model.trim="paramSubRule.checkType"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="模板类型" prop="templateType">
                <div style="width: 65%;">
                    <el-select
                        style="width: 100%;"
                        v-model="paramSubRule.templateType"
                    >
                        <el-option label="主模板" value="0"/>
                        <el-option label="子模板" value="1"/>
                    </el-select>
                </div>
            </el-form-item>
            <!-- **************************************************** -->
            <el-form-item label="公式类型" prop="formulaType">
                <div style="width: 65%;">
                    <el-select
                        style="width: 100%;"
                        v-model="paramSubRule.formulaType"
                    >
                        <el-option label="Excel公式" value="0"/>
                        <el-option label="照片" value="1"/>
                        <el-option label="文本" value="2"/>
                        <el-option label="最大值" value="3"/>
                        <el-option label="坐标" value="4"/>
                    </el-select>
                </div>
            </el-form-item>
            <!-- Excel公式 -->
            <div v-show="paramSubRule.formulaType==0 || paramSubRule.formulaType==null"
                 style="border:2px rgb(219,219,219) dashed">
                <el-form-item label="数据源数量">
                    <div style="width: 65%;">
                        <el-input-number
                            style="width: 100%;"
                            v-model="num"
                            controls-position="right"
                            :min="1"
                            @change="handleChange_fn1"
                        />
                        <!-- paramSubRule.dataResourceList  paramSubRule.dataResource -->
                    </div>
                </el-form-item>
                <template v-for="(item,index) in numList">
                    <el-form-item>
                        <span slot="label"><i style="color: red;font-style: normal;">* </i>数据文件{{index+1}} :</span>
                        <div style="width: 65%;">
                            <input type="text" class="m-InputClass" v-model.lazy="item.datafile">
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <span slot="label"><i style="color: red;font-style: normal;">* </i>sheet页 :</span>
                        <div style="width: 65%;">
                            <input type="text" class="m-InputClass" v-model.lazy="item.sheetNum">
                        </div>
                    </el-form-item>
                </template>
                <el-form-item>
                    <span slot="label"><i style="color: red;font-style: normal;">* </i>EXCEL公式 :</span>
                    <div style="width: 65%;" class="box-contentInfo">
                        <textarea v-model.trim.lazy="paramSubRule.content"></textarea>
                    </div>
                </el-form-item>
            </div>
            <!-- 照片 -->
            <div v-show="paramSubRule.formulaType==1">
                <el-form-item prop="picName">
                    <span slot="label"><i style="color: red;font-style: normal;">* </i>图片名称 :</span>
                    <div style="width: 65%;">
                        <el-input
                            style="width: 100%;"
                            v-model="paramSubRule.picMap.picName"
                        />
                    </div>
                </el-form-item>
                <el-form-item label="图片大小">
                    <div style="width: 65%;margin-bottom: 5px;" class="box-sizeInfor">
                        <span class="box-sizeInfo-label"><i>* </i>宽度 :</span>
                        <el-input
                            v-model="paramSubRule.picMap.picWidth"
                        />
                        <span class="box-sizeInfo-after">像素</span>
                    </div>
                    <div style="width: 65%;" class="box-sizeInfor">
                        <span class="box-sizeInfo-label"><i>* </i>高度 :</span>
                        <el-input
                            v-model="paramSubRule.picMap.picHeight"
                        />
                        <span class="box-sizeInfo-after">像素</span>
                    </div>
                </el-form-item>
            </div>
            <!-- 文本 -->
            <div v-show="paramSubRule.formulaType==2">
                <el-form-item prop="content">
                    <span slot="label"><i style="color: red;font-style: normal;">* </i>内容 :</span>
                    <div style="width: 65%;" class="box-contentInfo">
                        <textarea v-model.lazy.trim="paramSubRule.content"/>
                    </div>
                </el-form-item>
            </div>
            <!-- 最大值 / 坐标 -->
            <div v-show="paramSubRule.formulaType==3 || paramSubRule.formulaType==4">
                <el-form-item>
                    <span slot="label"><i style="color: red;font-style: normal;">* </i>文件名称 (分号';'分割) :</span>
                    <div style="width: 65%;" class="box-contentInfo">
                        <textarea v-model.lazy.trim="paramSubRule.content"/>
                    </div>
                </el-form-item>
            </div>
            <!-- **************************************************** -->
            <el-form-item label="备注" prop="remark">
                <div style="width: 65%;" class="">
                    <el-input v-model.trim="paramSubRule.remark"></el-input>
                    <!--<textarea v-model.lazy.trim="paramSubRule.remark"/>-->
                </div>
            </el-form-item>
            <el-form-item label="创建人" prop="creator">
                <div style="width: 65%;">
                    <el-input v-model="paramSubRule.creator" :readonly="true"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="创建时间">
                <div style="width: 65%;">
                    <el-date-picker
                        style="width: 100%;"
                        v-model="paramSubRule.createDate"
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
        <!--  -->
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
        >
            <ParamSubRuleBind
                style="height: 600px;"
                ref="ParamSubRuleBind"
                @closeDialog_Fn1_1="closeDialogFn1_1"
            />
        </el-dialog>
    </div>
</template>

<script>
    import ParamSubRuleBind from './dialogComponents/param_sub_rule_bind'

    let _creator = window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).loginName : ''
    let _paramSubRule =
        {
            id: '',
            ruleName: '', //单数据填写规则
            bookName: '',//书签名称
            checkType: '',// 检测类型
            templateType: '',//公式类型
            //
            formulaType: '0',// 公式类型
            //
            dataResourceList: [],
            /* dataResource:[], */
            /* 图片 */
            picMap: {
                picName: '',
                picWidth: '0',
                picHeight: '0',
            },
            //
            remark: '',// 备注
            content: '',
            //
            createDate: '',
            creator: _creator,
        }
    let _ruleData =
        {
            'ruleName': [
                {required: true, message: '请填写', trigger: 'blur'}
            ],
            'bookName': [
                {required: true, message: '请填写', trigger: 'blur'}
            ],
            'checkType': [
                {required: true, message: '请填写', trigger: 'blur'}
            ],
            'templateType': [
                {required: true, message: '请选择', trigger: 'change'}
            ],
            'remark': [
                {required: true, message: '请选择', trigger: ['blur', 'change']},
            ],
            // 'picName': [
            //     {required: true, message: '请选择', trigger: 'blur'}
            // ],
            // 'content': [
            //     {required: true, message: '请选择', trigger: 'blur'}
            // ],
        }
    export default {
        name: 'param_sub_rule_edit',
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
                paramSubRule: JSON.parse(JSON.stringify(_paramSubRule)),
                ruleData: JSON.parse(JSON.stringify(_ruleData)),
                //
                num: 0,
                numList: [
                    {
                        datafile: '',
                        sheetNum: '',
                    }
                ],
                // 绑定子模板规则
                show1: false
            }
        },
        watch: {
            editData (val) {
                if (!val) {
                    this.paramSubRule = JSON.parse(JSON.stringify(_paramSubRule))
                } else {
                    let temp = JSON.parse(JSON.stringify(val))
                    if (temp.formulaType != 1) {
                        temp.picMap = {
                            picName: '',
                            picWidth: '0',
                            picHeight: '0',
                        }
                    }
                    if (temp.formulaType == 0) {
                        this.numList = temp.dataResourceList.map(item => {
                            return item
                        })
                    }
                    let obj = {}
                    for (let i in _paramSubRule) {
                        obj[i] = temp[i]
                    }
                    this.paramSubRule = obj
                }
            },
            'paramSubRule.dataResourceList': {
                handler: (value) => {
                    if (!value) {
                        this.num = 1
                    } else if (value.length == 0) {
                        this.num = 1
                    } else {
                        this.num = value.length
                    }
                }
            }
        },
        methods: {
            handleChange_fn1 (currentValue, oldValue) {
                if (currentValue > oldValue) {
                    this.numList.push({
                        datafile: '',
                        sheetNum: '',
                    })
                }
                //
                else if (oldValue > currentValue) {
                    this.numList.splice(this.numList.length - 1)
                }
            },
            closeDialogFn1_1 (data) {
                this.paramSubRule.paramSubRuleIds = data
            },
            goBind (id) {
                this.show1 = true
            },
            goAdd () {
                this.$refs['form1'].validate((valid, object) => {
                    if (valid) {
                        let params = JSON.parse(JSON.stringify(this.paramSubRule))
                        delete params.dataResourceList
                        params.resourceFile = this.numList.map(item => {
                            return item.datafile
                        })
                        params.resourceSheet = this.numList.map(item => {
                            return item.sheetNum
                        })
                        this.$emit('closeDialog_Fn1', params)
                    }
                })
            },
        }
    }
</script>

<style scoped lang="less">
    @import '../style/param_sub_rule';
</style>
