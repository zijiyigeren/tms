<template>
  <div>
    <p style="text-align: center;">
      <el-button type="primary" style="width: 110px;" @click="goBind">添加</el-button>
      <el-button type="warning" style="width: 110px;" @click="goBatchDelete">删除</el-button>
    </p>
    <el-table
      v-bind="{
        data: tableData,
        height:'calc(500px - 6px)',
        border:true,
        stripe:true,
      }"
    >
      <el-table-column label="序号" type="index" :resizable="false" width="55" align="center"/>
      <el-table-column label="子模板规则名称" property="subRuleName" :resizable="false" align="center"/>
      <el-table-column label="检测类型" property="checkType" :resizable="false" align="center"/>
      <el-table-column label="子模板名称" property="" :resizable="false" align="center">
        <template slot-scope="{ row }">
          {{row.orderTemplate.templateName}}
        </template>
      </el-table-column>
      <el-table-column label="书签名称" property="bookName" :resizable="false" align="center"/>
      <el-table-column label="创建时间" property="createDate" :resizable="false" align="center"/>
      <el-table-column label="创建人" property="creator" :resizable="false" align="center"/>
      <el-table-column label="备注" property="remark" :resizable="false" align="center"/>
      <el-table-column label="操作" :resizable="false" align="center" width="55">
        <template slot-scope="{ row,$index }">
          <input type="checkbox"
            @change="checkboxChangeFn(row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'subtemplate_rule_bind_show_templaterule',
    data () {
      return {
        currentId: '',
        //
        tableData: [],
        //
        subIds: [],
        //
        arr1:[],
      }
    },
    methods: {
      /*
      * 查询
      * */
      goBindSubRuleShow (id) {
        this.$api.templateRule.goBindSubRuleShow({id: id})
          .then(res => {
            let tye = res.data.data
            this.tableData = JSON.parse(JSON.stringify(tye.subRules))
            this.arr1 = this.tableData.map(item=>{
              return item.id
            })
          })
          .catch()
      },
      /*
      * 添加
      * */
      goBind () {
        this.$emit('openFn1_show3',this.arr1)
      },

      /*
      * 删除
      * */
      goBatchDelete () {
        if (this.subIds.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的数据'
          })
          return
        }
        let params = {
          id: this.currentId,
          subIds: this.subIds.toString()
        }
        this.$api.templateRule.deleteBindSubRule(params)
          .then(res => {
            this.subIds = []
            this.goBindSubRuleShow(this.currentId)
          })
          .catch()
      },

      /*
      * 记录选中的id,并组成数组
      * */
      checkboxChangeFn (data) {
        if (event.target.checked == true) {
          if (this.subIds.indexOf(data) < 0) {
            this.subIds.push(data)
          }
        } else {
          if (this.subIds.indexOf(data) >= 0) {
            let _index = this.subIds.indexOf(data)
            this.subIds.splice(_index, 1)
          }
        }
      },

    }
  }
</script>

<style scoped>

</style>
