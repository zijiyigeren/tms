<template>
  <div>
    <el-form size="mini" label-width="100px" :model="form" :inline="true">
      <div>
        <el-form-item label="任务号">{{tinfo.taskCode}}</el-form-item>
      </div>
      <el-form-item label="委托日期">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model.trim="infor.trust"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="商定完成时间">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model.trim="infor.finishDate"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="下达日期">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model.trim="infor.doDate"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <div class="line"></div>
      <div>
        <el-form-item label="取报告方式">
          <el-radio-group v-model="infor.getReportType">
            <el-radio :label="1">自取</el-radio>
            <el-radio :label="2">邮寄</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div style="display:none">
        <el-form-item label="收费金额">
          <el-input placeholder="收费金额" v-model.trim="infor.fee"></el-input>
        </el-form-item>
        <el-form-item label="其他检验费">
          <el-input placeholder="其他检验费" v-model.trim="infor.otherFee"></el-input>
        </el-form-item>
        <el-form-item label="折扣">
          <el-input placeholder="折扣" v-model.trim="infor.discount"></el-input>
        </el-form-item>
        <el-form-item label="合计">
          <el-input placeholder="合计" v-model.trim="infor.amounttotal"></el-input>
        </el-form-item>
        <el-form-item label="财务实收">
          <el-input placeholder="财务实收" v-model.trim="infor.realFee"></el-input>
        </el-form-item>
        <el-form-item label="任务说明">
          <el-input type="textarea" style="height:auto" v-model.trim="infor.taskExplain"></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        doDate: ''
      }
    }
  },
  props: ['infor', 'tinfo'],
  created() {
    this.form.doDate = new Date().toLocaleDateString()
  },
  methods: {
    change(value) {
      this.$emit("goAmountTotal", value.currentTarget.value)
    }
  }
}
</script>
<style scoped>
.line {
  border-bottom: 1px solid #e6e6e6;
  height: 1px;
  margin-bottom: 10px;
}
</style>