<template>
    <div>
        <el-form
            ref="form_show1"
            v-bind="{
                model: orderTemplate,
                labelWidth: '30%',
                labelSuffix: ' :',
                size: 'mini',
                rules: ruleData
              }"
        >
            <el-form-item label="模板名称" prop="templateName">
                <div style="width: 65%;">
                    <el-input
                        maxLength="50"
                        v-model.trim="orderTemplate.templateName"
                    />
                </div>
            </el-form-item>
            <el-form-item label="检测类型" prop="checkType">
                <div style="width: 65%;">
                    <el-input
                        maxLength="50"
                        v-model.trim="orderTemplate.checkType"
                    />
                </div>
            </el-form-item>
            <el-form-item>
                <span slot="label"><i style="color:red;font-style: normal;">*&nbsp;</i>模板类型 :</span>
                <div style="width: 65%;">
                    <el-select v-model.trim="orderTemplate.templateType">
                        <el-option label="主模板" value="0"></el-option>
                        <el-option label="子模板" value="1"></el-option>
                        <el-option label="样品模板" value="2"></el-option>
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item>
                <span slot="label"><i style="color:red;font-style: normal;">*&nbsp;</i>模板上传 :</span>
                <div style="width: 65%;position: relative;">
                    <div class="selectFile">
                        <el-button type="success" @click="selectFile" style="float: left;">选择文件</el-button>
                        <span class="selectFileName">&nbsp;{{fName}}</span>
                    </div>
                    <input type="file" id="ZXfile" @change="fn_fileChange" accept=".docx" style="display: none;">
                    <el-button type="text" style="position: absolute;bottom: 0;right: -50px;"
                               @click="godownload">[下载模板]
                    </el-button>
                </div>
            </el-form-item>
            <template v-if="orderTemplate.templateType == 0">
                <!--{{orderTemplate.judgeInfoNames}}<br>
                {{orderTemplate.judgeInfoIds}}-->
                <el-form-item label="判别信息" prop="judgeInfoNames">
                    <div style="width: 65%;position: relative;">
                        <el-input
                            type="textarea"
                            :readonly="true"
                            v-model.trim="orderTemplate.judgeInfoNames"
                            maxLength="500"
                            :autosize="{ minRows: 6, maxRows: 6 }"
                        />
                        <el-button type="text" style="position: absolute;bottom: 0;right: -50px;"
                                   @click="goBind">[选择]
                        </el-button>
                    </div>
                    <input type="hidden" v-model="orderTemplate.judgeInfoIds">
                </el-form-item>
            </template>
            <el-form-item label="创建时间">
                <div style="width: 65%;">
                    <input type="hidden" v-model="orderTemplate.creator">
                    <el-date-picker
                        v-model="orderTemplate.createDate"
                        :readonly="true"
                    />
                </div>
            </el-form-item>
        </el-form>
        <p style="text-align: right;">
            <el-button type="primary" size="mini" @click="goAdd">保存</el-button>
        </p>

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
            @close="close_show2"
        >
            <JudgeInfoBind
                ref="JudgeInfoBind"
                @GETfn1_bindIds="GETfn1_bindIds"
            />
        </el-dialog>
    </div>
</template>

<script>
    // import TemplateBind from './dialogComponents/template_bind'
    import JudgeInfoBind from './dialogComponents/judge_info_bind'

    let _creator = window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).loginName : ''
    let _orderTemplate = {
        id: '',
        templateName: '',//
        checkType: '',//
        templateType: '0',//
        judgeInfoNames: '',//
        judgeInfoIds: '',//
        creator: _creator,//
        createDate: '',//
    }
    let _ruleData = {
        'templateName': [
            {required: true, message: '请填写', trigger: 'blur'}
        ],
        'checkType': [
            {required: true, message: '请填写', trigger: 'blur'}
        ],
        'judgeInfoNames': [
            {required: true, message: '请选择', trigger: ['input', 'blur']},
        ],
    }

    export default {
        name: 'template_mgmt_edit',
        components: {
            // TemplateBind,
            JudgeInfoBind,
        },
        data () {
            return {
                orderTemplate: JSON.parse(JSON.stringify(_orderTemplate)),
                ruleData: JSON.parse(JSON.stringify(_ruleData)),
                //
                show2: false,
                /**/
                fileName: '',
                fileObject: null,
                /**/
                fName: ''
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
                    this.orderTemplate = JSON.parse(JSON.stringify(_orderTemplate))
                } else {
                    this.orderTemplate = val
                }
            }
        },
        methods: {
            selectFile () {
                $('#ZXfile').click()
            },
            /*
            * 选择文件
            * */
            fn_fileChange () {
                this.fName = event.target.files[0].name
                this.fileName = event.target.files[0].name
                this.fileObject = event.target.files[0]
            },
            /*
            * 保存
            * */
            goAdd () {
                this.$refs['form_show1'].validate(valid => {
                    if (valid) {
                        let params = {
                            ...this.orderTemplate
                        }
                        let data = new FormData()
                        for (let i in _orderTemplate) {
                            data.append(i, params[i])
                        }

                        if (this.fileObject) {
                            data.append('file', this.fileObject)
                        }

                        this.$api.templateMgmt.add(data)
                            .then((res) => {
                                if (res.data.ok) {
                                    this.$emit('closeDialog_Fn1')
                                }
                            })
                            .catch()
                    } else {
                        return false
                    }
                })
            },
            /*
            * 判别信息[选择] 打开弹框
            * */
            goBind () {
                this.show2 = true
                this.$nextTick(() => {
                    if (this.orderTemplate.judgeInfoIds !== '') {
                        this.$refs['JudgeInfoBind'].bindIds = this.orderTemplate.judgeInfoIds.split(',').filter(item => {
                            return item != ''
                        })
                        this.$refs['JudgeInfoBind'].bindNames = this.orderTemplate.judgeInfoNames.split('\n').filter(item => {
                            return item != ''
                        })
                    }
                    this.$refs['JudgeInfoBind'].goNextPage('1')
                })
            },
            /*
            * 判别信息弹框 关闭前
            * */
            GETfn1_bindIds (data, data2) {
                if (data.length !== 0) {
                    this.orderTemplate.judgeInfoIds = data.toString()
                    this.orderTemplate.judgeInfoNames = data2.join('\n')
                }
                this.show2 = false
            },
            /*
            * 判别信息弹框 关闭时
            * */
            close_show2 () {
            },
            /*
            * 下载模板
            * */
            godownload () {
            },
        }
    }
</script>

<style scoped lang="less">
    @import '../style/param_rule';
</style>
