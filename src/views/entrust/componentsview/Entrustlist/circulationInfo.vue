<template>
  <el-table :data="tableData" border style="width: 100%" :span-method="objectSpanMethod">
    <el-table-column prop="itemsCode" label="报告编号" align="center" :resizable="false"></el-table-column>
    <el-table-column type="index" label="序号" align="center" width="100px" :resizable="false"></el-table-column>
    <el-table-column prop="flowname" label="名称" align="center" :resizable="false"></el-table-column>
    <el-table-column prop="name" label="执行人" align="center" :resizable="false"></el-table-column>
    <el-table-column prop="create_date" label="开始时间" align="center" :resizable="false"></el-table-column>
    <el-table-column prop="end_date" label="结束时间" align="center" :resizable="false"></el-table-column>
    <el-table-column prop="reason" label="描述" align="center" :resizable="false"></el-table-column>
  </el-table>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      spanArr: [],
      position: 0
    }
  },
  methods: {
    rowspan() {
      this.spanArr=[];
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (this.tableData[index].itemsCode === this.tableData[index - 1].itemsCode) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {  //表格合并行
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      // if (columnIndex === 1) {
      //   const _row = this.spanArr[rowIndex];
      //   const _col = _row > 0 ? 1 : 0;
      //   return {
      //     rowspan: _row,
      //     colspan: _col
      //   }
      // }
    }
  }
}
</script>
<style scoped>
</style>
