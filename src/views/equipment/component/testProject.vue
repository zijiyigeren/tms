<template>
    <div>
      <p style="text-align: right;">
        <el-button
          type="text" style="padding: 0;"
          @click="show_BOX = !show_BOX">
          <template v-if="show_BOX">收起</template>
          <template v-if="!show_BOX">展开</template>
        </el-button>
      </p>
      <el-collapse-transition>
        <div v-show="show_BOX">
          <el-form
            ref="information_form"
            class="information_form"
            label-width="160px"
            v-bind="{
                model: terminalChecks,
                rules: formRules,
                size:'mini',
                inline:true
            }"
          >
            <p class="information_form_title">设备-检定信息</p>
            <!--<el-form-item label="检定项目：" class="form_item_half">-->
            <el-form-item label="检定项目：" prop="checkItem">
              <templateMethod
                v-model="terminalChecks.checkItem"
                v-bind="{
                        type: 'select',
                        dicCode: 'checkItem',
                    }"
                @GET_originData="GET_originData1"
              />
              <!--<el-input clearable maxlength="30" placeholder="请输入" v-model.trim="terminalChecks.a"></el-input>-->
            </el-form-item>
            <el-form-item label="检定方式：" prop="checkModel">
              <templateMethod
                v-model="terminalChecks.checkModel"
                v-bind="{
                    type: 'select',
                    dicCode: 'checkModel',
                }"
              />
            </el-form-item>
            <el-form-item label="证书类别：" prop="certificateType">
              <templateMethod
                v-model="terminalChecks.certificateType"
                v-bind="{
                    type: 'select',
                    dicCode: 'certificateType',
                }"
                @GET_originData="GET_originData3"
              />
            </el-form-item>
            <el-form-item label="检定单位：" prop="checkCompany">
              <templateMethod
                v-model="terminalChecks.checkCompany"
                v-bind="{
                    type: 'select',
                    dicCode: 'checkCompany',
                }"
                @GET_originData="GET_originData4"
              />
            </el-form-item>
            <el-form-item label="检定周期：" prop="checkdate1">
              <!--<input v-model.lazy="terminalChecks.checkdate1" @blur="isMonth_handle"> 月-->
              <el-input v-model.trim="terminalChecks.checkdate1" maxLength="10" style="width: 88%!important;"/><span style="width: 10%;display: inline-block;text-align: center;">月</span>
            </el-form-item>
            <el-form-item label="上一次检定日：" prop="checkdate2">
              <el-date-picker type="date" value-format="yyyy-MM-dd" v-model.trim="terminalChecks.checkdate2"
                              placeholder="选择日期"/>
            </el-form-item>
            <el-form-item label="检定人：" prop="checkUser">
              <el-input clearable maxlength="30" placeholder="请输入" v-model.trim="terminalChecks.checkUser"/>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" @click="addFormList">增加</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
        <!---->
        <div v-for="(item,index) in formList">
            <TestProjectChildComp
                :ref="`TestProjectChildComp${index+''}`"
                :key="item.id"
                @delFn111="delFn111"
                v-model="item.item"
                @input="inputFn1"
                :only-detail="onlyDetail"
            />
        </div>
    </div>
</template>

<script>
    /* 组件: 数据字典 */
    import templateMethod from '@/components/TemplateMethod.vue'
    import TestProjectChildComp from './testProject_childComp'

    let _terminalChecks = {
        checkItem: '',// 检定项目
        checkModel: '',// 检定方式
        certificateType: '',// 证书类别
        checkCompany: '',// 检定单位
        checkdate1: '',// 检定周期
        checkdate2: '',// 上一次检定日
        checkUser: '',// 检定人
    }
    let _formRules = {
      'checkItem': [
        {required: true,message: '请选择检定项目', trigger: 'change'}
      ],
      'checkModel': [
        {required: true,message: '请选择检定方式', trigger: 'change'}
      ],
      'certificateType': [
        {required: true, message: '请选择证书类别',trigger: 'change'}
      ],
      'checkCompany': [
        {required: true,message: '请选择检定单位', trigger: 'change'}
      ],
      'checkdate1': [
        {required: true,message: '请填写检定周期', trigger: 'blur'}
      ],
      'checkdate2': [
        {required: true, message: '请填写上次检定日', trigger: 'blur'}
      ],
      'checkUser': [
        {required: true, message: '请填写检定人', trigger: 'blur'}
      ],
    }

    export default {
        name: 'testProject',
        components: {
            templateMethod,// 数据字典
            TestProjectChildComp,
        },
        data () {
            return {
                show_BOX: true,
                onlyDetail: false,
                terminalChecks: JSON.parse(JSON.stringify(_terminalChecks)), // 校准项目-表单数据
                formRules: JSON.parse(JSON.stringify(_formRules)), // 校准项目-表单规则
                registerFileList: [], // 验收登记单-上传数据
                formList: [],
            }
        },
        watch: {
            formList (newVal) {
            }
        },
        methods: {
          GET_originData1(val){
            this.$store.state['checkItemLIST'] = val
          },
          // GET_originData2(val){
          //   this.$store.state['checkModelLIST'] = val
          // },
          GET_originData3(val){
            this.$store.state['certificateTypeLIST'] = val
          },
          GET_originData4(val){
            this.$store.state['checkCompanyLIST'] = val
          },
          /***********************************************************************/
          /*
          * 绝对不能删!
          * */
            inputFn1 (val) {
                // console.log(val, 'inputFn1')
            },

            /*
            * 原系统没有校验,需求不定(功能取消)
            * */
            isMonth_handle(){
              // let value = event.target.value
              // let $rule = /^(0\d|1[0-2])$/
              // let jk= $rule.test(value)
            },
            /*
            * 添加 检定项目
            * */
            addFormList () {
              let _this = this

              this.$refs['information_form'].validate((valid)=>{
                if (valid){
                  _this.formList.push({
                    'id': new Date().getTime(),
                    'item': {
                      ...this.terminalChecks,
                      'id': new Date().getTime(),
                    }
                  })
                }
                //
                else{
                  this.$message.warning({
                    message: `仍存在必填项未填写字段,请查验`,
                    duration: 5000,
                    showClose:true,
                  })
                  return false
                }
              })
            },
            /*
            * 删除 检定项目
            * */
            delFn111 (data) {
                let that = this

                function f () {
                    for (let i in that.formList) {
                        if (that.formList[i].item.id == data) {
                            return i
                        }
                    }
                }

                let index_ = f()
                this.formList.splice(index_, 1)
            },
        }
    }
</script>

<style scoped lang="less">
    @import '~@/views/equipment/componentsview/style/mlyStyle.less';
</style>
