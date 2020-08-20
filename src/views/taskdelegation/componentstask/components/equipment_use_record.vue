<template>
  <div style="height: 500px;">
    <div>
      <ul>
        <li v-for="i in 5" style="display: inline-block;padding:0 10px">
          试验项目
        </li>
      </ul>
      <el-button size="mini" @click="show11 = true">新增设备记录</el-button>
      <el-table
        v-bind="{
          height:'400px',
          data:[{},{},{},{},{},{},{},{},{},{},{},{}]
        }"
      >
        <el-table-column label="序号" type="index" width="55" align="center"/>
        <el-table-column label="设备编号"></el-table-column>
        <el-table-column label="设备名称"></el-table-column>
        <el-table-column label="设备型号"></el-table-column>
        <el-table-column label="所在科室"></el-table-column>
        <el-table-column label="使用人员"></el-table-column>
        <el-table-column label="使用时间"></el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="show11"
      v-bind="{
        title: '设备选择',
        modal:false,
        top: '20px'
      }"
    >
      <div style="height: 500px;display: flex;flex-direction: column;">
        <el-form
          :model="form11"
          v-bind="{
            size: 'mini',
            labelWidth: '90px',
            labelSuffix: ' :',
          }"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="设备编号">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备名称">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备型号">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-alert
          style="margin-bottom: 5px;"
          title="预约整车列表"
          type="info"
          :closable="false"
        />
        <div style="flex: 1;overflow: hidden;">
          <el-table
            border
            v-bind="{
            data:[{},{},{},{},{},{},{},{},{},{},],
            height:'100%',
          }"
          >
            <el-table-column
              type="selection"
              align="center"
              :resizable="false"
            />
            <el-table-column
              label="序号"
              type="index"
              width="55"
              align="center"
            />
            <el-table-column label="设备编号"></el-table-column>
            <el-table-column label="设备型号"></el-table-column>
            <el-table-column label="设备名称"></el-table-column>
            <el-table-column label="所属科室"></el-table-column>
            <el-table-column label="入库时间"></el-table-column>
          </el-table>
        </div>
        <div
          style="text-align: center;"
        >
          <el-button size="mini" type="info" @click="show11 = false">确定</el-button>
          <el-button size="mini" @click="show11 = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'equipmentUseRecord',
    data () {
      return {
        show11: false,
        form11: {}

      }
    }
  }
</script>

<style scoped>

</style>
