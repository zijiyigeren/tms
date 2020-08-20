<template>
  <!-- 产品信息 -->
  <div class="product_box">
    <div class="product_content">
      <el-form ref="productForm" :model="productList" label-width="260px">
        <el-form-item label="企业名称：">
          <el-input :value="productList.d ? productList.d.entName : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="产品型号：">
          <el-input :value="productList.d ? productList.d.model : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="产品名称：">
          <el-input :value="productList.d ? productList.d.name : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="产品商标：">
          <el-input :value="productList.d ? productList.d.brand : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="生产地址：" v-if="productList.d.proType == 'new'">
          <el-input :value="productList.n ? productList.n.proAddress : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="产品类别：" v-if="productList.d.proType == 'new'">
          <el-input :value="productList.n ? productList.n.proType : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="底盘类别：" v-if="productList.d.proType == 'new'">
          <el-input :value="productList.n ? productList.n.chassisType : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="总库产品ID：" v-if="productList.d.proType != 'new'">
          <el-input :value="productList.ap ? productList.ap.productId : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="申报原因：" v-if="productList.d.proType != 'new'">
          <el-input :value="productList.ap ? productList.ap.reason : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="出具强检统计表：" v-if="productList.d.proType != 'new'">
          <el-input :value="productList.ap ? productList.ap.needTest : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="检测机构ID：" v-if="productList.d.proType != 'new'">
          <el-input :value="productList.ap ? productList.ap.testInsId : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="检测机构ID：" v-if="productList.d.proType == 'new'">
          <el-input :value="productList.n ? productList.n.testInsId : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="定型机构ID：" v-if="productList.d.proType != 'new'">
          <el-input :value="productList.ap ? productList.ap.appInsId : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="定型机构ID：" v-if="productList.d.proType == 'new'">
          <el-input :value="productList.n ? productList.n.appInsId : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="车辆类型：" v-if="productList.d.proType != 'new'">
          <el-input :value="productList.ap ? productList.ap.carType : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="申报类别：" v-if="productList.d.proType == 'new'">
          <el-input :value="productList.n ? productList.n.decType : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="新能源产品：" v-if="productList.d.proType == 'new'">
          <el-input :value="productList.n ? productList.n.newEnergy : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="产品上传时间：" v-if="productList.d.proType == 'new'">
          <el-input :value="productList.n ? productList.n.uploadTime : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="条件状态：" v-if="productList.d.proType == 'new'">
          <el-input :value="productList.n ? productList.n.submit : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="委托加工生产地址：" v-if="productList.d.proType == 'new'">
          <el-input :value="productList.n ? productList.n.comAddress : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="油耗申报值是否满足三阶段限值要求：" v-if="productList.d.proType == 'new'">
          <el-input :value="productList.n ? productList.n.fuelPhase : ''" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="产品状况简述：" v-if="productList.d.proType == 'new'">
          <!-- <el-input type="textarea" :rows="2" :value="productList.m.description" :disabled="true" style="width:30%;" /> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    name: "product",
    props: ['productList'],
    data() {
      return {}
    },
    components: {},
    watch: {},
    methods: {},
    created() {
    },
  }
</script>
<style lang="scss" scoped>
  .product_box {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .product_content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  /deep/ .el-input.is-disabled .el-input__inner {
    background-color: #f0f0f065 !important;
    color: #949495 !important;
  }

  /deep/ .el-textarea.is-disabled .el-textarea__inner {
    background-color: #f0f0f065 !important;
    color: #949495 !important;
  }
</style>
