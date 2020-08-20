<template>
  <el-dialog title="选择项目" :visible.sync="modalShow" width="60%" center :before-close="modalClose">
    <div style="display: flex;align-items: center;justify-content: center;flex-direction:column">
      <div style="width: 80%;">
        <el-button type="primary" size="small" @click="getData">选择</el-button>
      </div>
      <br />
      <div style="width: 90%">
        <el-aside>
          <el-tree
            ref="tree"
            highlight-current
            :default-checked-keys="[1]"
            node-key="id"
            :data="data"
            :props="{label:'productName'}"
          ></el-tree>
        </el-aside>
        <el-table
          :header-cell-style="{
                        'background-color': 'rgba(243,246,253,1)',
                        'color': '#606266','padding': '10px 0'}"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="items_item_code" label="项目代码"></el-table-column>
          <el-table-column prop="indexid" label="indexId"></el-table-column>
          <el-table-column prop="items_itme_name" label="项目名称"></el-table-column>
          <el-table-column prop="itemsFrederickItme" label="实验项目"></el-table-column>
          <el-table-column prop="items_test_basis" label="检验依据"></el-table-column>
          <el-table-column prop="roomname" label="检验科室"></el-table-column>
          <el-table-column prop="itemsItemSamplesVolume" label="极品数量"></el-table-column>
          <el-table-column prop="items_cover_logo1" label="封面标识"></el-table-column>
          <el-table-column prop="items_charges" label="收费"></el-table-column>
          <el-table-column prop="inUse" label="状态"></el-table-column>
        </el-table>
      </div>
      <div
        style="width: 80%;display: flex;flex-direction: column;align-items: center;justify-content: center;"
      ></div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    // modalObj: Object,
    modalShow: Boolean
  },
  data() {
    return {
      data: [],
      tableData: {}
    }
  },
  created() {
    this.getCate();
  },
  methods: {
    modalClose() {
      this.modalShow = false;
    },
    getData() {
      let that = this;
      that.queryParam[that.modalObj.condition] = that.inputVal;
      that.$http.post(Global.baseUrl + that.modalObj.url, that.queryParam).then(function (resp) {
        that.dataList = resp.data;
      }).catch(function (e) {
        console.log(e);
      });
    },
    getCate() {
      //加载树形菜单
      this.$api.entrust.getCate().then(res => {
        debugger
        this.data = res.data.data;
      });
    },
  },
  computed: {

  },
  //这个地方需要监听modalShow的变化,如果modalShow发生变化后,触发父组件对modal-show的更新
  watch: {
    modalShow: function (val) {
      this.$emit('update:modalShow', val);
    }
  }
}
</script>
<style scoped>
</style>