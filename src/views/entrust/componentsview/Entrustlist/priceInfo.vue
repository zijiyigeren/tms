<template>
  <el-table :data="data" border style="width: 100%">
    <el-table-column prop="itemcode" label="项目代码" align="center"></el-table-column>
    <el-table-column prop="itemname" label="实验项目" align="center"></el-table-column>
    <el-table-column prop="chargeName" label="费用名称" align="center"></el-table-column>
    <el-table-column prop="ycharges" label="费用" align="center"></el-table-column>
    <el-table-column prop="times" label="次数" align="center"></el-table-column>
    <el-table-column prop="yaccount" label="收费小计" align="center"></el-table-column>
  </el-table>
</template>
<script>
export default {
  props: ['fitem', 'tinfo'],
  data() {
    return {
      data: []
    }
  },
  methods: {
    changeTableData() {
      this.data = [];
      let tableData = JSON.parse(JSON.stringify(this.fitem));
      for (let j = 0; j < tableData.length; j++) {
        if (tableData[j].ilist.length > 0) {
          for (let i = 0; i < tableData[j].ilist.length; i++) {
            let obj = {};
            obj.itemcode = tableData[j].itemcode + "-" + tableData[j].dector;
            obj.itemname = tableData[j].itemname;
            if (this.tinfo.taskCode.substring(0, 2) != 'ZD') {
              obj.itemname += tableData[j].id + tableData[j].itemcode;
            }
            if (tableData[j].ilist[0].itype == 0) {
              obj.chargeName = tableData[j].chargeList[0].name;
              obj.ycharges = tableData[j].ilist[0].ycharges;
              obj.times = tableData[j].ilist[0].times;
              obj.yaccount = tableData[j].ilist[0].yaccount;
            }
            this.data.push(obj);
          }
          for (let i = 0; i < tableData[j].ilist.length; i++) {
            if (i > 0) {
              let obj = {};
              if (tableData[j].ilist[i].itype === 5) {
                obj.itemcode = tableData[j].ilist[i].name;
                if (tableData[j].ilist[i].formual.length() > 0) {
                  obj.itemname = tableData[j].ilist[i].sformual;
                } else {
                  obj.ycharges = tableData[j].ilist[i].ycharges;
                  obj.times = tableData[j].ilist[i].times;
                }
                obj.yaccount = tableData[j].ilist[i].yaccount;
              } else {
                obj.itemcode = tableData[j].ilist[i].name;
                if (tableData[j].ilist[i].formual.length() > 0) {
                  obj.itemname = tableData[j].ilist[i].sformual;
                } else {
                  obj.ycharges = tableData[j].ilist[i].ycharges;
                  obj.times = tableData[j].ilist[i].times;
                }
                obj.yaccount = tableData[j].ilist[i].yaccount;
              }
              this.data.push(obj);
            }
          }
        }
      }

    }
  }
}
</script>
<style scoped>
</style>