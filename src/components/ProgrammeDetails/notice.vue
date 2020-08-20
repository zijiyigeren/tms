<template>
  <!-- 公告信息 -->
  <div class="notice_box">
    <div class="notice_content">
      <el-form ref="noticeForm" :model="noticeList" label-width="200px">
        <el-form-item label="企业名称：">
          <el-input v-model.trim="noticeList.entName" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="产品型号：">
          <el-input v-model.trim="noticeList.model" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="产品名称：">
          <el-input v-model.trim="noticeList.name" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="产品商标：">
          <el-input v-model.trim="noticeList.brand" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="企业ID：">
          <el-input v-model.trim="noticeList.entId" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="产品类别：">
          <el-input v-if="noticeList.proType == 'new'"
                    :value="'新产品 - ' + noticeList.aeType" :disabled="true" style="width:30%;"/>
          <el-input v-else :value="'变更扩展产品 - ' + noticeList.aeType" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="检测机构ID：">
          <el-input v-model.trim="noticeList.testInsId" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="定型机构ID：">
          <el-input v-model.trim="noticeList.appInsId" :disabled="true" style="width:30%;"/>
        </el-form-item>
        <el-form-item label="是否加载新能源检测项目：">
          <el-input v-model.trim="noticeList.newEnergy" :disabled="true" style="width:30%;"/>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    name: "notice",
    props: ['noticeList'],
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
  .notice_box {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .notice_content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  /deep/ .el-input.is-disabled .el-input__inner {
    background-color: #f0f0f065 !important;
    color: #949495 !important;
  }
</style>
