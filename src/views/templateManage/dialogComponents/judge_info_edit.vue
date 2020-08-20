<template>
  <div>
    <el-form
      ref="form1"
      v-bind="{
          model: judgeInfo,
          labelWidth: '35%',
          labelSuffix: ' :',
          size:'mini',
        }"
    >
      <el-form-item label="检测类型">
        <div style="width: 65%;">
          <el-input v-model.trim="judgeInfo.checkType"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="判别信息">
        <div style="width: 65%;">
          <el-input v-model.trim="judgeInfo.judgeName" placeholder="判别信息名称"></el-input>
          <div style="padding: 5px 0"></div>
          <el-input v-model.trim="judgeInfo.judgeValue" placeholder="判别信息内容"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="标签名称">
        <div style="width: 65%;">
          <el-input v-model.trim="judgeInfo.bookName">></el-input>
        </div>
      </el-form-item>
      <el-form-item label="创建时间">
        <div style="width: 65%;">
          <el-date-picker
            style="width: 100%;"
            v-model="judgeInfo.createDate"
            format="yyyy-MM-dd"
            type="date"
            :readonly="readonly1"
            value-format="timestamp"
          />
        </div>
      </el-form-item>
    </el-form>
    <p style="text-align: right;">
      <el-button type="primary" size="mini" @click="goAdd" v-if="!editData">保存(新建)</el-button>
      <el-button type="primary" size="mini" @click="goAdd" v-else>保存(编辑)</el-button>
    </p>
  </div>
</template>

<script>
  let _judgeInfo = {
    checkType: '',
    judgeName: '',
    judgeValue: '',
    bookName: '',
    createDate: '',
  }
  export default {
    name: 'judge_info_edit',
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
        judgeInfo: JSON.parse(JSON.stringify(_judgeInfo)),
        readonly1: false,
      }
    },
    watch: {
      editData (val) {
        if (!val) {
          this.judgeInfo = JSON.parse(JSON.stringify(_judgeInfo))
          this.readonly1 = false
        } else {
          this.judgeInfo = val
          this.readonly1 = true
        }
      }
    },
    methods:{
      goAdd(){
        let that = this
        this.$api.judgeInfo.judgeInfo_add(this.judgeInfo)
          .then((resp)=>{
            that.$emit('closeDialog_Fn1')
          })
          .catch(err=>{
            console.log(err)
          })
      },
    }
  }
</script>

<style scoped>

</style>
