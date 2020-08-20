<template>
    <div style="border-bottom: 1px #d0d7e5 dashed;">
        <!--数据ID: {{terminalChecks.id}}-->
        <el-form
            ref="formComp"
            class="information_form"
            label-width="160px"
            v-bind="{
            model: terminalChecks,
            size:'mini',
            inline:true,
            // 'label-suffix': ' :',
            rules: rules
        }">
            <p class="information_form_title2"><!--检定项目名-->组件ID: {{formCompId}}</p>
            <el-form-item label="检定项目 :" class="form_item_half" prop="checkItem">
                <el-select v-model="terminalChecks.checkItem" placeholder="请选择"
                           @change="formItemChange">
                  <el-option
                    v-for="(item,index) in $store.state.checkItemLIST"
                    :key="index"
                    :label="item.dicTypeName"
                    :value="item.dicTypeCode"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="检定方式 :" prop="checkModel">
                <el-select  v-model="terminalChecks.checkModel" placeholder="请选择"
                           @change="formItemChange">
                  <el-option
                    v-for="(item,index) in $store.state.checkModelLIST"
                    :key="index"
                    :label="item.dicTypeName"
                    :value="item.dicTypeCode"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="证书类别 :" prop="certificateType">
                <el-select  v-model="terminalChecks.certificateType" placeholder="请选择"
                           @change="formItemChange">
                  <el-option
                    v-for="(item,index) in $store.state.certificateTypeLIST"
                    :key="index"
                    :label="item.dicTypeName"
                    :value="item.dicTypeCode"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="检定单位 :" prop="checkCompany">
                <el-select  v-model="terminalChecks.checkCompany" placeholder="请选择" @change="formItemChange">
                  <el-option
                    v-for="(item,index) in $store.state.checkCompanyLIST"
                    :key="index"
                    :label="item.dicTypeName"
                    :value="item.dicTypeCode"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="检定周期 :" prop="checkdate1">
              <el-input
                v-model.trim="terminalChecks.checkdate1"
                maxLength="10"
                style="width: 88%!important;"
                @change="formItemChange"
              /><span style="width: 10%;display: inline-block;text-align: center;">月</span>
            </el-form-item>
            <el-form-item label="上一次检定日期 :" prop="checkdate2">
                <el-date-picker
                    type="date"
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    v-model.trim="terminalChecks.checkdate2"
                    placeholder="选择日期"
                    @change="formItemChange"
                />
            </el-form-item>
            <el-form-item label="检定人 :" prop="checkUser">
                <el-input
                    clearable
                    maxlength="30"
                    placeholder="请输入"
                    v-model.trim="terminalChecks.checkUser"
                    @blur="formItemChange"
                />
            </el-form-item>
            <el-form-item label=" ">
                <!--<el-button type="primary" :disabled="true">编辑</el-button>-->
                <el-button type="danger" @click="deleteFn_FormCopmThis">删除</el-button>
            </el-form-item>
        </el-form>
        <div style="padding-bottom: 20px;">
            <span style="display: inline-block;width: 160px;padding-right: 12px;text-align: right;">证书编号 :</span><input
                  type="text"
                  placeholder="请输入证书编码"
                  :class="classObject"
                  v-model.lazy="certificatecode"
                  @focus="isErrorClass = false"
                >
            <!---->
            <span style="display: inline-block;width: 80px;padding-right: 12px;text-align: right;">文件名 :</span>
            <span style="display: inline-block;width: 160px;border-bottom: 1px #d0d7e5 solid;padding: 0 0 3px 0;"
                  class="" :title="fileName">
                &nbsp;&nbsp;{{fileName}}
            </span>
            <el-button @click="fileClickFn" size="mini">选择证书</el-button>
            <span style="color: #409EFF;cursor: pointer;margin-left: 5px;" @click="fileUpload">上传</span>
        </div>

        <div
            v-for="(item,index) in fileNamelist" :key="index"
            style="padding-bottom: 20px;padding-left: 160px;cursor: default;"
        >
            证书编号 :{{item.certificatecode}}
            &nbsp;&nbsp;{{item.id}}
            &nbsp;&nbsp;{{item.filename}}
            &nbsp;&nbsp;<span style="color: #409EFF;cursor: pointer;" @click="downloadCertificate(item.fileId)">下载</span>
            &nbsp;&nbsp;<span style="color: red;cursor: pointer;" @click="delCertificate(item.id,index)" v-show="!onlyDetail">删除</span>
        </div>
        <input type="file" :id="`file${formCompId}`" class="" @change="fileChangeFn" accept="application/pdf" >
        <!--<slot
            :formComponentThis="formCompThis"
            :formComponentData="terminalChecks"
            :formComponentId="formCompId"
        />-->
    </div>
</template>

<script>
    export default {
        name: 'information_childComp',
        props: {
            value: {
                type: Object,
                default () {
                    return null
                }
            },
          onlyDetail:{
              type:Boolean,
              default: false
          }
        },
        data () {
            return {
                terminalChecks: {},
                rules: {
                  'checkItem': [
                    {required: true, message: '请输入', trigger: 'blur'}
                  ],
                  'checkModel': [
                    {required: true, message: '请输入', trigger: 'blur'}
                  ],
                  'certificateType': [
                    {required: true, message: '请输入', trigger: 'blur'}
                  ],
                  'checkCompany': [
                    {required: true, message: '请输入', trigger: 'blur'}
                  ],
                  'checkdate1': [
                    {required: true, message: '请输入', trigger: 'blur'}
                  ],
                  'checkdate2': [
                    {required: true, message: '请输入', trigger: 'blur'}
                  ],
                  'checkUser': [
                    {required: true, message: '请填写检定人', trigger: 'blur'}
                  ],
                },
                formCompThis: {},
                formCompId: new Date().getTime(),
                certificatecode: '',// 证书编码
                fileName: '',
                fileNamelist: [],
                fileObj: null,
              //
              isErrorClass:false,
            }
        },
      computed:{
        classObject(){
          return {
            'm-inputClass':true,
            'm-errorInputClass': this.isErrorClass
          }
        }
      },
        watch: {
            value: {
                // deep: true,
                // immediate: true,
                handler: (newVal) => {
                },
            },
        },
        methods: {
          /*
          * 这个方法是向父组件v-model绑定的item的对象传值的
          * 绝对不能删
          * */
            formItemChange () {
                this.$emit('input', this.terminalChecks)
            },
            deleteFn_FormCopmThis () {
                this.$emit('delFn111', this.terminalChecks.id)
            },
            fileClickFn () {
                $(`#file${this.formCompId}`).click()
            },
            fileChangeFn () {
                this.fileName = event.target.files[0].name
                this.fileObj = event.target.files[0]
            },
            validateHandle () {
                if (this.certificatecode === '') {
                  this.isErrorClass = true
                  this.$message.warning({
                        message: '请输入证书编码'
                    })
                    return false
                }
                if (!this.fileObj) {
                    this.$message.warning({
                        message: '请输入选择证书'
                    })
                    return false
                }
                if (this.terminalChecks.checkdate2 === '' || this.terminalChecks.checkdate2 == null) {
                    this.$message.warning({
                        message: '请输入选择上次检定日期'
                    })
                    return false
                }
                return true
            },
            fileUpload () {
                if (!this.validateHandle()) {
                    return
                }
                let data = new FormData()
                let certificate = {
                    checkid: this.terminalChecks.id,
                    checkdate2: this.terminalChecks.checkdate2,
                    certificatecode: this.certificatecode,
                }
                data.append('certificate', JSON.stringify(certificate))
                data.append('upload', this.fileObj)
                this.$api.eqManage.upload(data)
                    .then((res) => {
                        this.fileNamelist = res.data.data.slice(0)
                    })
                    .catch(() => {

                    })
            },
            /*
            * 删除已上传的证书
            * */
            delCertificate (id, index) {
                let params = {
                    id,
                }
                this.$api.eqManage.del(params)
                    .then((res) => {
                        this.fileNamelist.splice(index, 1)
                    })
                    .catch()
            },
            /*
            * 下载证书
            * */
            downloadCertificate(id){
                this.$api.eqManage.download(id)
            },
        },
        mounted () {
            this.formCompThis = this.$refs['formComp']
            this.terminalChecks = {
                ...this.value,
                formCompThis: this.formCompThis,
                formCompId: this.formCompId,
            }
            this.formItemChange()
            if (this.terminalChecks.list && this.terminalChecks.list.length != 0) {
                this.fileNamelist = this.terminalChecks.list.slice(0)
            }
        }
    }
</script>

<style scoped lang="less">
    @import '~@/views/equipment/componentsview/style/mlyStyle.less';

    input[type=file] {
        display: none;
    }
</style>
