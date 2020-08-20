<template>
  <div class="sample-information-modal">
    <!--{{formData}}-->
    <el-form
      ref="form_a1"
      v-bind="{
        model: formData,
        // inline: true,
        size: 'mini',
        'label-width': '110px',
        'label-suffix': ' :',
        // rules: formRules,
      }"
    >
      <!-- ******************************************* -->
      <h1 class="title1">样品信息</h1>
      <el-row>
        <el-col :span="6">
          <el-form-item label="样品编号">
            <el-input :disabled="allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="样品名称">
            <el-input :disabled="allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="样品类别">
            <el-input :disabled="allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="规格型号">
            <el-input :disabled="allDisable"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="商标">
            <el-input :disabled="allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="受检单位" prop="comeCompany">
            <el-input :disabled="allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="来样方式">
            <el-input :disabled="allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="退样方式">
            <el-input :disabled="allDisable"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="存储要求">
            <el-input :disabled="allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="保密级别">
            <el-input maxlength="4" :disabled="allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="样品来源">
            <el-input :disabled="allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="样品数量">
            <el-input-number
              style="width: 100%;"
              :disabled="allDisable"
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
              :disabled="allDisable"
              value-format="yyyy-MM-dd"
              style="width: 100%;"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收样时间">
            <el-date-picker
              placeholder="选择日期"
              :disabled="allDisable"
              value-format="yyyy-MM-dd"
              style="width: 100%;"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车架号" prop="vin">
            <el-input maxlength="17" :disabled="allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="生产日期">
            <el-date-picker
              placeholder="选择日期"
              :disabled="allDisable"
              value-format="yyyy-MM-dd"
              style="width: 100%;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9">
          <el-form-item label="发动机号/电机控制器号" label-width="200px">
            <el-input :disabled="allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="样品描述">
            <el-input type="textarea" :disabled="allDisable"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider/>

      <!-- ******************************************* -->
      <h1 class="title1">送样信息</h1>
      <el-row>
        <el-col :span="6">
          <el-form-item label="送样者" prop="comepeople">
            <el-input maxLength="30" :disabled="allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="损坏处">
            <el-input maxLength="30" :disabled="allDisable"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider/>

      <!-- ******************************************* -->
      <h1 class="title1">抽样信息</h1>
      <el-row>
        <el-col :span="6">
          <el-form-item label="抽样单号">
            <el-input v-model="formData.samplingCode" :disabled="!allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抽样时间">
            <el-input v-model="formData.samplingTime" :disabled="!allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抽样地点">
            <el-input v-model="formData.samplingAddress" :disabled="!allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抽样方式">
            <el-input v-model="formData.samplingWay" :disabled="!allDisable"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="抽样人">
            <el-input v-model="formData.samplingPeople" :disabled="!allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抽样基数">
            <el-input v-model="formData.samplingBase" :disabled="!allDisable"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider/>

      <!-- ******************************************* -->
      <h1 class="title1">封样信息</h1>
      <el-row>
        <el-col :span="6">
          <el-form-item label="封样人">
            <el-input v-model="formData.packingPeople" :disabled="!allDisable"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="封样状态">
            <el-input v-model="formData.packingState" :disabled="!allDisable"/>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- ******************************************* -->
      <el-divider/>
      <el-row :gutter="30">
        <el-col :span="12">
          <h1 class="title1">样品备注</h1>
          <el-form-item label-width="0px">
            <el-input
              type="textarea"
              v-bind="{
                maxlength: 300,
                'clearable': true,
                'show-word-limit': true,
                autosize:{
                  minRows: 5, maxRows: 5
                }
              }"
              :disabled="allDisable"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <h1 class="title1">样品照片</h1>
          <img src="" alt="暂无">
          <!--<el-upload
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
            &lt;!&ndash; <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>&ndash;&gt;
            <i slot="default" class="el-icon-plus"></i>

            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url" alt="">
              <div class="el-upload-list__item-actions">
                &lt;!&ndash;<span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>&ndash;&gt;
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
              &lt;!&ndash;<transition name="fade">&ndash;&gt;
              <el-progress v-show="progressFlag" :percentage="progressPercent" style="width: 60%"></el-progress>
              &lt;!&ndash;</transition>&ndash;&gt;
              <span style="color: red;">请选择大小不超过120K的图片上传</span>
            </div>
          </el-upload>-->
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  const formData = {
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
  }
  export default {
    name: 'sampledetail',
    props: {
      'editDataProp': {
        type: Object,
        default: function () {
          return null
        }
      },
      'allDisable': {
        type: Boolean,
        default: function () {
          return true
        }
      }
    },
    watch: {
      editDataProp (val) {
        if (val == null) {
        } else {
          this.formData = val
        }
      }
    },
    data () {
      return {
        formData: JSON.parse(JSON.stringify(formData))
      }
    },
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

  /*/deep/ .add-sample-information {*/
  /*  .el-dialog__body {*/
  /*    height: 800px !important;*/
  /*  }*/
  /*}*/
</style>
