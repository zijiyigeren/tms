<template>
  <div>
    <el-form size="mini" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="样品数">
            <el-input placeholder="样品数" v-model.trim="muster.musterCount"></el-input>
          </el-form-item>
          <el-form-item label="抽样基数">
            <el-input placeholder="抽样基数" v-model.trim="muster.musterBase"></el-input>
          </el-form-item>
          <el-form-item label="出厂编号">
            <el-input placeholder="出厂编号" v-model.trim="muster.musterFactoryCode"></el-input>
          </el-form-item>
          <el-form-item label="抽样日期">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model.trim="muster.musterDate"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="发往单位">
            <el-select placeholder="请选择" v-model="muster.musterSendUnits">
              <el-option label="天津汽车检测中心" value="天津汽车检测中心"></el-option>
              <el-option label="国家轿车质量监督检测中心" value="国家轿车质量监督检测中心"></el-option>
              <el-option label="中汽研汽车检验中心（天津）有限公司" value="中汽研汽车检验中心（天津）有限公司"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发送人">
            <el-input placeholder="发送人" v-model.trim="muster.musterSendMember"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="抽样地点">
            <el-input type="textarea" style="height:auto" v-model.trim="muster.musterMusterAddress"></el-input>
          </el-form-item>
          <el-form-item label="封样方式">
            <el-input placeholder="封样方式" v-model.trim="muster.musterClosureFunction"></el-input>
          </el-form-item>
          <el-form-item label="抽样方式">
            <el-radio-group v-model="muster.musterMusterFunction">
              <el-radio :label="1">随机</el-radio>
              <el-radio :label="2">分层</el-radio>
              <el-radio :label="3">其他</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发往地点">
            <el-input placeholder="发往地点" v-model.trim="muster.musterSendAddress"></el-input>
          </el-form-item>
          <el-form-item label="发送方式">
            <el-select placeholder="请选择" v-model="muster.musterSendFunction">
              <el-option label="EMS" value="EMS"></el-option>
              <el-option label="邮寄" value="邮寄"></el-option>
              <el-option label="送样" value="送样"></el-option>
              <el-option label="公路" value="公路"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="抽样人">
            <el-input placeholder="抽样人" v-model.trim="muster.musterMusterMember"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {

      }
    }
  },
  props: ['muster']
}
</script>
<style scoped lang="scss">
.el-input {
  width: 250px;
}
.el-textarea {
  width: 250px;
}
.el-select {
  width: 250px;
}
</style>