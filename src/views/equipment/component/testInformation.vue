<template>
    <!-- 检定设备-检定信息 -->
    <el-dialog
        class="dialog_information"
        title="检定信息"
        :visible.sync="informationVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="onInformationClose"
        v-bind="{
            fullscreen:true,
            modal:false,
        }"
        @close="curCloseFn"
    >
        <div class="information_con">
            <el-form
                class=""
                v-bind="{
                    labelWidth:'120px',
                    model: informationForm,
                    size:'mini',
                }"
            >
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="编号：">
                            <el-input :readonly="true" v-model="terminal.code"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="设备名称：">
                            <el-input :readonly="true" v-model="terminal.name"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="规格：">
                            <el-input :readonly="true" v-model="terminal.model"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="测量范围：">
                            <el-input :readonly="true" v-model="terminal.rulerange"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="准确度：">
                            <el-input :readonly="true" v-model="terminal.accuracy"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="购置日期：">
                            <el-date-picker
                                style="width: 100%;"
                                type="date" value-format="yyyy-MM-dd"
                                :readonly="true"
                                v-model="terminal.purchaseDate"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <p class="dividing_line"></p>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="校准项目：">
                          <templateMethod
                            style="width: 100%;"
                            v-model="informationForm.checkItem"
                            v-bind="{
                              type: 'select',
                              dicCode: 'checkItem',
                            }"
                          />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="校准方式：">
                          <templateMethod
                            style="width: 100%;"
                            v-model="informationForm.checkModel"
                            v-bind="{
                              type: 'select',
                              dicCode: 'checkModel',
                            }"
                          />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="证书类别：">
                          <templateMethod
                            style="width: 100%;"
                            v-model="informationForm.certificateType"
                            v-bind="{
                              type: 'select',
                              dicCode: 'certificateType',
                            }"
                          />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="校准单位：">
                          <templateMethod
                            style="width: 100%;"
                            v-model="informationForm.checkCompany"
                            v-bind="{
                              type: 'select',
                              dicCode: 'checkCompany',
                            }"
                          />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="检定周期：">
                          <el-input
                            placeholder="请填写检定周期"
                            style="width: calc(100% - 22px);"
                            v-model.trim="informationForm.checkdate1"
                          /><span style="display: inline-block;width: 20px;text-align: right">月</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="本次检定日期：">
                            <!--<el-date-picker
                            type="month" value-format="yyyy-MM-dd" placeholder=""
                                            style="width: 100%;"
                                            v-model="informationForm.checkdate2"
                                            :readonly="true"
                            />-->
                          <el-input
                            placeholder="请填写本次检定日期"
                            style="width: 100%;"
                            v-model.trim="informationForm.checkdate2"
                          />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 文件  -->
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="检定证书：" class="form_item_up">
                            <!---->
                            证书编号
                            <input type="text" v-model="zzVal"
                                   id="zzVal"
                                   @focus="removeStyleFn1"
                                   style="outline: none;border: 1px #DCDFE6 solid; border-radius: 5px;padding-left: 10px">
                            <span style="color:red;display: inline-block;border-bottom:rgb(220, 223, 230) 1px solid; " id="fileName"></span>
                            <el-button size="mini" @click="choseFn">选择文件</el-button>
                            <el-button size="mini" type="success" @click="uploadCertificate">上传</el-button>
                            <input style="display: none;" type="file" id="file_1" class="" @change="changeFile">
                            <!---->
                            <template v-for="(item,index) in fileList">
                                <div :key="item.id">
                                    <span>证书编号 :</span>
                                    <span style="color: blue;">{{item.certificatecode}}</span>&nbsp;&nbsp;&nbsp;
                                    <span>附件 :</span>
                                    <span class="THIS-fileName"
                                          @click="downloadCertificate(item)">{{item.filename}}</span>&nbsp;&nbsp;&nbsp;
                                    <span style="color: red;" @click="deleteCertificate(item.id)">删除</span>
                                </div>
                            </template>
                            <!--{{informationForm.id}}-->
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button @click="onInformationClose">取 消</el-button>
            <el-button type="primary" @click="onInformationOk">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import base from '@/api/base.js'
    /* 组件: 数据字典 */
    import templateMethod from '@/components/TemplateMethod.vue'
    export default {
        name: '',
        components: {
          templateMethod,
        },
        // props: ['informationVisible', 'informationRow'],
        props: {
            informationVisible: {
                type: Boolean,
                default () {
                    return false
                }
            },
            informationRow: {
                type: Object,
                default () {
                    return null
                }
            }
        },
        watch: {
            informationVisible: {
                immediate: true,
                handler (val) {
                    if (val) {

                    }
                },
            },
            informationRow: {
                handler (val) {
                    if (!val) {
                    } else {
                        this.informationForm = JSON.parse(JSON.stringify(val['termianlChecking']))
                        this.terminal = JSON.parse(JSON.stringify(val['terminal']))
                        this.fileList = JSON.parse(JSON.stringify(val['certificateFileList']))
                        if (val['certificateFileList'].length !== 0) {
                            this.zzVal = JSON.parse(JSON.stringify(val['certificateFileList'][0].certificatecode))
                        }
                    }
                },
            },
            zzVal: {
                handler (val) {
                    // console.log(val, '12312????')
                }
            },
        },
        data () {
            return {
                informationForm: {}, // 检定项目-表单数据
                terminal: {},
                registerFileList: [], // 验收登记单-上传数据
                /* ************* */
                zzVal: '',
                fileBOX: {},
                fileList: [],
            }
        },
        created () {
        },
        mounted () {
        },
        methods: {
            /*
            * 选择文件
            * */
            choseFn () {
                $(`#file_1`).click()
            },
            changeFile () {
                let fileName = event.target.files[0].name
                $('#fileName').html(fileName)
                this.fileBOX = event.target.files[0]
                // this.box['upload' + index] = event.target.files[0]
                // this.fileNameList[`fileName${index}`] = event.target.files[0].name
            },
            /*
            * 上传文件
            * */
            uploadCertificate () {
                if (this.zzVal == '') {
                    this.$message.warning('请填写证书编号')
                    $('#zzVal').addClass('errClass')
                    return
                }
                let params = {
                    certificate: this.zzVal,
                    checkingId: this.informationForm.id,
                }
                let data = new FormData()
                data.append('certificateFile', this.fileBOX)
                data.append('parameter', JSON.stringify(params))
                this.$api.eqChecking.uploadCertificate(data)
                    .then((res) => {
                        let temp = res.data.data
                        this.fileList = JSON.parse(JSON.stringify(temp))
                    })
                    .catch()
            },
            /*
            * 下载文件
            * */
            downloadCertificate (data) {
                window.open(`${base.baseUrl}/sys/lims/file/${data.id}/download`)
            },
            /*
            * 删除文件
            * */
            deleteCertificate (id) {
                let params = {
                    fileId: id,
                    checkingId: this.informationForm.id,
                }
                this.$api.eqChecking.deleteCertificate(params)
                    .then((res) => {
                        let temp = res.data.data
                        this.fileList = JSON.parse(JSON.stringify(temp))
                    })
                    .catch(() => {

                    })
            },
            /* ******************************************* */
            // 检定信息-确定
            onInformationOk () {
                let params = {
                    'termianlChecking': {
                        'id': this.informationForm.id
                    }
                }
                this.$api.eqChecking.checkCompleted(params)
                    .then((res) => {
                        this.$emit('informationClose')
                    })
                    .catch()
            },
            // 检定信息-关闭前
            onInformationClose () {
                this.$emit('informationClose')
            },
            /*
            * 关闭时
            * */
            curCloseFn () {
                $('#fileName').html('')
                Object.assign(this.$data, this.$options.data())
            },

            removeStyleFn1 () {
                let tar = event.target
                $(tar).removeClass('errClass')
            },
        }
    }
</script>
<style lang="less" scoped>
  .information_con{
    padding: 20px 40px 20px 0;
  }
    .errClass {
        border: 1px red solid !important;
    }

    .THIS-fileName {
        &:hover {
            color: #409EFF;
          cursor: pointer;
        }
    }

    .el-button--default {
        padding: 0 20px;
        margin: 0;
        height: 30px;
        background: #fff;
        border-radius: 4px;
    }

    .el-button--primary {
        padding: 0 20px;
        margin: 0;
        height: 30px;
        background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
        border-radius: 4px;
    }

    .el-button--text {
        color: #32AFF0;
    }

    .dividing_line {
        width: 100%;
        height: 1px;
        background: rgba(0, 0, 0, 0.2);
        padding: 0;
        margin: 0;
        margin-bottom: 20px;
    }
</style>
