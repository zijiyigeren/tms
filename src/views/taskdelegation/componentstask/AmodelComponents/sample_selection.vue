<template>
  <!-- 新增样品 -->
  <div class="sample-information-modal">
    <el-form
      ref="form_a"
      v-bind="{
        model: formData,
        // inline: true,
        size: 'mini',
        'label-width': '110px',
        'label-suffix': ' :',
        rules: formRules,
      }">

      <!-- ******************************************* -->
      <h1 class="title1">样品信息</h1>
      <el-row>
        <el-col :span="6">
          <el-form-item label="样品编号">
            <el-input v-model="formData.barcode">
              <el-button slot="append" icon="el-icon-search" @click="show = true"/>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="样品名称">
            <el-input v-model="formData.carload"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="样品类别">
            <el-input v-model="formData.catType"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="规格型号">
            <el-input v-model="formData.model"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="商标">
            <el-input v-model="formData.shangbiao"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="受检单位" prop="comeCompany">
            <el-input v-model="formData.comeCompany"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="来样方式">
            <el-input v-model="formData.sourceSampleWay"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="退样方式">
            <el-input v-model="formData.returnSampleWay"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="存储要求">
            <el-input v-model="formData.saveAsk"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="保密级别">
            <el-input v-model="formData.leveal" maxlength="4"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="样品来源">
            <el-input v-model="formData.sourceSample"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="样品数量">
            <el-input-number
              style="width: 100%;"
              v-model="formData.sampleQuantity"
              v-bind="{
                  min:1,
                  max:1000,
                  'controls-position':'right'
              }"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="到样时间" prop="comeDate">
            <el-date-picker
              placeholder="选择日期"
              v-model="formData.comeDate"
              value-format="yyyy-MM-dd"
              style="width: 100%;"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收样时间">
            <el-date-picker
              placeholder="选择日期"
              v-model="formData.receiveDate"
              value-format="yyyy-MM-dd"
              style="width: 100%;"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车架号" prop="vin">
            <el-input v-model="formData.vin" maxlength="17"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="生产日期">
            <el-date-picker
              placeholder="选择日期"
              v-model="formData.createDate"
              value-format="yyyy-MM-dd"
              style="width: 100%;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="生产序号">
            <el-input v-model="formData.createNum"/>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="发动机号/电机控制器号" label-width="200px">
            <el-input v-model="formData.fadongjihao"/>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="样品描述">
            <el-input v-model="formData.describe" type="textarea"/>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 选择样品 -->
      <el-dialog
        custom-class="add-sample-information"
        :visible.sync="show"
        v-bind="{
          title: '选择样品',
          width: '90%',
          modal: false,
          // fullscreen: true,
          'destroy-on-close': true,
          // 'close-on-press-escape': false,
          // 'close-on-click-modal': false,
        }">
        <Vehicle :whetherDisplay="1">
          <template slot-scope="{ selectedData }">
            {{ getSlotData('qq', selectedData) }}
          </template>
        </Vehicle>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="show = false">取消</el-button>
          <el-button size="mini" type="primary" @click="pushData">确定</el-button>
        </span>
      </el-dialog>
      <el-divider/>

      <!-- ******************************************* -->
      <h1 class="title1">送样信息</h1>
      <el-row>
        <el-col :span="6">
          <el-form-item label="样品原号">
            <el-input v-model="formData.sampleOriginCode" maxLength="30"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="送样者" prop="comepeople">
            <el-input v-model="formData.comepeople" maxLength="30"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="损坏处">
            <el-input v-model="formData.breakDown" maxLength="30"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider/>

      <!-- ******************************************* -->
      <h1 class="title1">抽样信息</h1>
      <el-row>
        <el-col :span="6">
          <el-form-item label="抽样单号">
            <el-input v-model="formData.samplingCode"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抽样时间">
            <el-input v-model="formData.samplingTime"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抽样地点">
            <el-input v-model="formData.samplingAddress"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抽样方式">
            <el-input v-model="formData.samplingWay"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="抽样基数">
            <el-input v-model="formData.samplingBase"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抽样人">
            <el-input v-model="formData.samplingPeople"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider/>

      <!-- ******************************************* -->
      <h1 class="title1">封样信息</h1>
      <el-row>
        <el-col :span="6">
          <el-form-item label="封样人">
            <el-input v-model="formData.packingPeople"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="封样状态">
            <el-input v-model="formData.packingState"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider/>
      <el-row :gutter="30">
        <el-col :span="12">
          <h1 class="title1">样品备注</h1>
          <el-form-item label-width="0px">
            <el-input
              type="textarea"
              v-model="formData.bz"
              v-bind="{
                maxlength: 300,
                'clearable': true,
                'show-word-limit': true,
                autosize:{
                  minRows: 5, maxRows: 5
                }
              }"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <h1 class="title1">样品照片</h1>
          <!--{{editDataProp}}-->
          <el-upload
            class="avatar-uploader"
            ref="upload_img"
            v-bind="{
              action: '#####',
              // 'auto-upload': false,
              limit:1,
              'list-type': 'picture-card',
              // 'show-file-list': false,
              fileList: fileList,// 这个东西是做回显用的
              'before-upload': handleBeforeUpload,// 上传前
              'on-exceed': handleExceed,// 超量时
              'http-request': handleHttpRequest,// 自定义上传带进度条
              // 'on-change': handleOnChange,// 文件能改变时
              // 'on-success': handleSuccess,// 成功时
            }">
            <!-- <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>-->
            <i slot="default" class="el-icon-plus"></i>

            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url" alt="">
              <div class="el-upload-list__item-actions">
                <!--<span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>-->
                <span
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </div>
            </div>

            <div slot="tip" class="el-upload__tip">
              文件名 : {{formData.imgPath}}<br>
              <!--<transition name="fade">-->
              <el-progress v-show="progressFlag" :percentage="progressPercent" style="width: 60%"></el-progress>
              <!--</transition>-->
              <span style="color: red;">请选择大小不超过120K的图片上传</span>
            </div>
          </el-upload>
        </el-col>
      </el-row>

      <!-- 图片预览 -->
      <el-dialog
        :visible.sync="dialogVisible"
        v-bind="{
          title: '图片预览',
          modal: false,
        }">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

    </el-form>

    <slot :formData="formData"></slot>
  </div>
</template>

<script>
  import axios from 'axios'
  import base from '@/api/base.js'
  import Vehicle from '@/views/sample/componentsview/vehicle.vue'

  // import axios from 'axios'

  const formData =
    {
      barcode: '',// 样品编号
      carload: '',// 样品名称
      catType: '',// 样品类别
      model: '',// 规格型号
      shangbiao: '',// 商标
      comeCompany: '',// 受检单位
      sourceSampleWay: '',// 来样方式
      returnSampleWay: '',// 退样方式
      saveAsk: '',// 存储要求
      leveal: '',// 保密级别
      sourceSample: '',// 样品来源
      sampleQuantity: 1,// 样品数量
      comeDate: '',// 到样时间
      receiveDate: '',// 收样时间
      // vin: new Date().getTime() * 10000,// 车架vin号
      vin: ``,// 车架vin号
      createDate: '',// 生产日期
      createNum: '',// 生产序号
      fadongjihao: '',// 发动机号
      describe: '',// 样品描述
      /* *** */
      sampleOriginCode: '',// 样品原号
      comepeople: '',// 送样人
      breakDown: '',// 损坏处
      /* *** */
      samplingCode: '',// 抽样单号
      samplingBase: '',// 抽样基数
      samplingTime: '',// 抽样时间
      samplingPeople: '',// 抽样人
      samplingAddress: '',// 抽样地点
      samplingWay: '',// 抽样方式
      /* *** */
      packingPeople: '',// 封样人
      packingState: '',// 封样状态
      /* *** */
      bz: '',// 样品备注
      imgPath: '',// 样品照片
    }
  const rules =
    {
      'comeDate': [
        {required: true, message: '请选择到样时间', trigger: 'blur'},
      ],
      'comeCompany': [
        {required: true, message: '请填写受检单位', trigger: 'blur'},
        {required: true, message: '请填写受检单位', trigger: 'change'},
      ],
      'vin': [
        {required: true, message: '请填写车架号', trigger: 'blur'},
        {min: 17, max: 17, message: '长度位17位字符', trigger: 'change'}
      ],
      'comepeople': [
        {required: true, message: '请填送样人', trigger: 'blur'},
      ]
    }

  let files = undefined
  export default {
    name: 'sampleSelection',
    components: {
      Vehicle,
    },
    props: ['editDataProp', 'defaultAddDataProp',],
    watch: {
      editDataProp (val) {
        if (val == null) {
          // console.log(746)
          // this.formData = {
          //   ...formData,
          //   'shangbiao': this.$store.state.tinfo['sampleTrademark'] ? this.$store.state.tinfo['sampleTrademark'] : '',
          //   'carload': this.$store.state.tinfo['sampleName'] ? this.$store.state.tinfo['sampleName'] : '',
          //   'catType': this.$store.state.tinfo['sampleType'] ? this.$store.state.tinfo['sampleType'] : '',
          // }
        } else {
          this.formData = val
          if (val.imgPath !== null) {
            this.fileList = [{
              url: `${base.baseUrl}/file/${val.imgPath}`,
            }]
          }
        }
      }
    },
    data () {
      return {
        // 进度条相关 <--
        progressFlag: false,
        progressPercent: 0,
        // 进度条相关 -->

        // 新增样品信息相关 <--
        qq: {},
        // 新增样品信息相关 -->

        show: false,// 打开选择样品信息代入功能

        formData: {
          ...formData,
          'shangbiao': this.$store.state.tinfo['sampleTrademark'] ? this.$store.state.tinfo['sampleTrademark'] : '',
          'carload': this.$store.state.tinfo['sampleName'] ? this.$store.state.tinfo['sampleName'] : '',
          'catType': this.$store.state.tinfo['sampleType'] ? this.$store.state.tinfo['sampleType'] : '',
        },
        formRules: rules,

        // 样品信息文件上传相关 <--
        dialogImageUrl: '',
        dialogVisible: false,
        fileList: [],
        uploadUrl: `${base.baseUrl}/sys/lims/file/upload`,
        // 样品信息文件上传相关 -->

        IsExecute_upload: 1,// 是否执行文件上传的逻辑
        IsExecute_save: 2,// 是否执行表单数据的保存逻辑
      }
    },
    methods: {
      handleHttpRequest (f) {
        this.progressFlag = true
        let formdata1 = new FormData()
        formdata1.append('file', f.file)
        formdata1.append('filePath', `/ggif/sample`)
        axios({
          url: this.uploadUrl,
          method: 'post',
          data: formdata1,
          headers: {'Content-Type': 'multipart/form-data'},
          onUploadProgress: progressEvent => {
            // progressEvent.loaded:已上传文件大小
            // progressEvent.total:被上传文件的总大小
            this.progressPercent = (progressEvent.loaded / progressEvent.total * 100)
          }
        }).then(res => {
          this.formData['imgPath'] = res.data.data['savePath']
          if (res.data.ok) {
            this.$message.success({
              message: `上传成功 !`,
              duration: 3000,
              showClose: true
            })
          }

          if (this.progressPercent === 100) {
            this.progressFlag = false
            this.progressPercent = 0
          }
        }).catch(error => {
          console.log(error)
        })
      },

      handleOnChange (file, fileList) {
        console.log(file, fileList, '上传的文件改变了 !')
        this.IsExecute_save = 100
        files = fileList
        // this.formData['imgPath'] = file.name
      },
      /*
      * 上传前校验文件格式
      * */
      handleBeforeUpload (file) {
        console.log(file.name, '上传文件之前')

        // const isJPG = file.type === 'image/jpeg';
        const isJPG = true
        let isLt120Kb = file.size / 1024 < 120

        if (!isJPG) {
          this.$message.error({
            message: '上传头像图片只能是 JPG 格式!',
            showClose: true,
          })
          this.IsExecute_save = 2// 是否执行保存样品信息的开关变量
          this.IsExecute_upload = 0
          return false
        }
        if (!isLt120Kb) {
          this.$message.error({
            message: '上传图片大小不能超过 120k',
            showClose: true,
          })
          this.IsExecute_save = 2// 是否执行保存样品信息的开关变量
          this.IsExecute_upload = 0
          return false
        }
        return isLt120Kb && isJPG
      },
      // handleSuccess (response, file, fileList) {
      //   console.log(response, '????????????????????????????')
      //   if (response.respCode === -1) {
      //     this.$message.error({
      //       message: response.message,
      //       duration: 3000,
      //       showClose: true,
      //     })
      //   } else {
      //     this.formData['imgPath'] = response.data['savePath']
      //   }
      // },

      /*
      * 上传数量超出限制
      * */
      handleExceed (file, fileList) {
        console.log(file, fileList, '文件超了限制数 !!!')
        files = fileList
        this.$alert('只能选择一张图片, 请先删除刚刚上传的图片', '提示', {
          confirmButtonText: '知道了',
          type: 'warning',
          showClose: false,
          callback: action => {
          }
        })
      },

      /*
      * 移除刚刚上传的
      * */
      handleRemove (file) {
        console.log(file, files, '移除文件时')
        let _index = undefined
        this.$confirm('图片删除后无法再找回,是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          try {
            files.forEach((item, index) => {
              if (item.uid === file.uid) {
                _index = index
              }
            })
            files.splice(_index, 1)
          } catch (e) {
            this.fileList.splice(_index, 1)
            this.formData['imgPath'] = ''
          }
        }).catch()
      },

      handlePictureCardPreview (file) {
        console.log(file, '预览上传的图片')
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },

      getSlotData (key, data) {
        if (data instanceof Array) {
          this[key] = JSON.parse(JSON.stringify(data))
        } else {
          this[key] = data
        }
      },

      pushData () {
        let params = JSON.parse(JSON.stringify(this.qq))
        // console.log(params)
        /* 通过选择样品信息代入的数据有id字段,手动填写的则没ID字段 */
        this.formData['id'] = params['id'] ? params['id'] : '' // id
        this.formData['barcode'] = params['barcode'] ? params['barcode'] : '' // 样品编号
        this.formData['catType'] = params['catType'] ? params['catType'] : '' // 样品类别
        this.formData['model'] = params['model'] ? params['model'] : '' // 规格型号
        this.formData['shangbiao'] = params['shangbiao'] ? params['shangbiao'] : '' // 商标
        this.formData['vin'] = params['vin'] ? params['vin'] : '' // 车架号vin
        this.formData['fadongjihao'] = params['fadongjihao'] ? params['fadongjihao'] : '' // 发动机号
        /* 确保代入的样品信息没有 undefined 或者 null */
        this.formData['comeCompany'] = params['comeCompany'] ? params['comeCompany'] : '' // 受检单位
        this.formData['leveal'] = params['leveal'] ? params['leveal'] : '' // 保密级别
        this.formData['comeDate'] = params['comeDate'] ? params['comeDate'] : '' // 到样时间
        this.formData['createDate'] = params['createDate'] ? params['createDate'] : '' // 生产日期
        this.formData['comepeople'] = params['comePeople'] ? params['comePeople'] : '' // 送样者
        this.formData['bz'] = params['bz'] ? params['bz'] : '' // 备注

        /* 将使用自己生成的任务编号 */
        // this.formData['taskCode'] = params['taskCode'] // 任务编号

        this.show = false
      },
    },
    mounted () {
      // this.$EventBus.$on('Verification', ({fn}) => {
      //   this.$refs['form_a'].validate((res) => {
      //     if (res) {
      //       // if (this.IsExecute_upload === 1) {
      //       //   // this.uploadUrl = `${base.baseUrl}/tasksample/taskSample/importFile`
      //       //   this.uploadUrl = `${base.baseUrl}/sys/lims/file/upload`
      //       //   this.$nextTick(() => {
      //       //     this.$refs['upload_img'].submit()
      //       //   })
      //       // }
      //       // if (this.switch1 === 0) {
      //       fn()
      //       // }
      //     } else {
      //       this.$message.warning({
      //         showClose: true,
      //         message: '存在错误的填写,请重新填写必填项!',
      //         duration: 3000,
      //       })
      //     }
      //   })
      // })
    }
  }
</script>

<style scoped lang="less">
  .sample-information-modal {
    .title1 {
      font-size: 20px;
      font-weight: bold;
      color: gray;
    }
  }
  /deep/ .add-sample-information{
    .el-dialog__body{
      height: 800px!important;
    }
  }
</style>
