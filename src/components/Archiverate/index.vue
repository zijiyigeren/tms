<template>
    <div class="archiverate_box">
        <div class="find">
            <el-form ref="form" :model="sizeForm"  size="mini"  style="width:100%;display:flex;justify-content: center;" label-width="auto">
                <el-form-item label="" style="width:25%; margin-right:15px;">
                    <el-select v-model="sizeForm.find" placeholder="请选择" style="width:100%;" @change="select1">
                        <el-option v-for="item in find" :key="item.id" :label="item.typeName" :value="item.typeABC">
                        </el-option> 
                    </el-select>
                </el-form-item>
                <el-form-item label="" style="width:25%;">
                    <el-select v-model="sizeForm.find2" placeholder="请选择" style="width:100%;" @change="select2">
                        <el-option v-for="(item,i) in find2" :key="i" :label="item.name" :value="item.key">
                        </el-option> 
                    </el-select>
                </el-form-item>
            </el-form>
        </div>


<div class="roughly_tabel" >
        <div class="flexTable" v-show="bits">
                <el-table 
                ref="table"
                :data="list"
                border
                stripe
                size="mini"
                highlight-current-row
                style="width: 100%"
                :header-cell-style="{
                    'background-color': 'rgba(243,246,253,1)',
                    'color': '#606266',
                    'padding': '10px 0'
                }"
                >
                <el-table-column
                prop="orgName"
                align="center"
                size="mini"
                label="科室名称"
                :resizable="false"
                >
            </el-table-column>
            <el-table-column
                prop="loginid"
                align="center"
                size="mini"
                label="主检登录名"
                :resizable="false"
                >
            </el-table-column>
            <el-table-column
                prop="name"
                align="center"
                size="mini"
                label="主检姓名"
                :resizable="false"
                >
            </el-table-column>
            <el-table-column
                prop="finishAttarch"
                align="center"
                size="mini"
                label="完成报告份数"
                :resizable="false"
                >
            </el-table-column>
            <el-table-column
                prop="gdFinishAttarch"
                align="center"
                size="mini"
                label="归档报告份数"
                :resizable="false"
                >
            </el-table-column>
            <el-table-column
                align="center"
                size="mini"
                label="归档率"
                style="display:flex;"
                :resizable="false"
                >
                <template slot-scope="scope" >
                    <el-button type="text" style="color:#000;">{{scope.row.bfb}}</el-button>
                    <el-button type="text" style="color:#32AFF0;marginLeft:6px;" @click="toogleExpand(scope.row)">{{scope.row.attarch3 > 0 ? '未归档浏览' :''}}</el-button>
                </template>
            </el-table-column>

            <el-table-column type="expand" width="1" :resizable="false">
                <template>
                    <el-table
                        border
                        :data="tableData3"
                        stripe
                        size="mini"
                        :show-header="false"
                        style="width: 100%">
                        <el-table-column
                            prop="taskCode"
                            align="center"
                            size="mini"
                            :resizable="false"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="companyCheck"
                            align="center"
                            size="mini"
                            :resizable="false"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="itemsCode"
                            align="center"
                            :resizable="false"
                            >
                            <template slot-scope="scope">
                                <p v-for="(item,i) in scope.row.list" :key="i"  v-show="item" class="taskStatusStyleclass"
                                >{{item.itemsCode}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="createdate"
                            align="center"
                            size="mini"
                            :resizable="false"
                            >
                            <template slot-scope="scope">
                                <p v-for="(item,i) in scope.row.list" :key="i"  v-show="item" class="taskStatusStyleclass"
                                >{{item.createdate}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="itemIssuanceDate"
                            align="center"
                            size="mini"
                            :resizable="false"
                            >
                            <template slot-scope="scope">
                                <p v-for="(item,i) in scope.row.list" :key="i"  v-show="item" class="taskStatusStyleclass"
                                >{{item.itemIssuanceDate}}</p>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
        </el-table>
    </div>
        <div v-show="bit">
            <el-table
                border
                stripe
                :data="list"
                size="mini"
                :header-cell-style="{
                    'background-color': 'rgba(243,246,253,1)',
                    'color': '#606266',
                    'padding': '10px 0'
                }"
                style="width: 100%">
                <el-table-column
                    prop="orgName"
                    align="center"
                    size="mini"
                    label="科室名称"
                    :resizable="false"
                    >
                </el-table-column>
                <el-table-column
                    prop="attarch1"
                    align="center"
                    size="mini"
                    label="纸归档"
                    :resizable="false"
                    >
                </el-table-column>
                <el-table-column
                    prop="attarch2"
                    align="center"
                    size="mini"
                    label="电子归档"
                    :resizable="false"
                    >
                </el-table-column>
                <el-table-column
                    prop="attarch6"
                    align="center"
                    size="mini"
                    label="体系归档"
                    :resizable="false"
                    >
                </el-table-column>
                <el-table-column
                    prop="attarch4"
                    align="center"
                    size="mini"
                    label="任务结束归档"
                    :resizable="false"
                    >
                </el-table-column>
                <el-table-column
                    prop="attarch5"
                    align="center"
                    size="mini"
                    label="其他类型归档"
                    :resizable="false"
                    >
                </el-table-column>
                <el-table-column
                    prop="attarch7"
                    align="center"
                    size="mini"
                    label="电子光盘归档"
                    :resizable="false"
                    >
                </el-table-column>
                <el-table-column
                    prop="attarch8"
                    align="center"
                    size="mini"
                    label="原始记录归档"
                    :resizable="false"
                    >
                </el-table-column>
                <el-table-column
                    prop="attarch3"
                    align="center"
                    size="mini"
                    label="未归档"
                    :resizable="false"
                    >
                </el-table-column>
                <el-table-column
                    prop="finishAttarch"
                    align="center"
                    size="mini"
                    label="完成任务数"
                    :resizable="false"
                    >
                </el-table-column>
                <el-table-column
                    prop="bfb"
                    align="center"
                    size="mini"
                    label="归档率"
                    :resizable="false"
                    >
                </el-table-column>
            </el-table>
        </div>
    </div>
    </div>
</template>

<script>

export default {
    props:{
        list:{
            type:Array
        },
        find:{
            type:Array
        },
        lists:{
            type:Object
        }
    },
    data(){
        return {
            sizeForm:{
                find:'全部',
                find2:'科室-报告计算'
            },
            find2:[],
            tableData3:[],
            num:0,
            bit: true,
            bits: false,
        }
    },
    created(){
        this.$api.pigeohole.findRateQueryVO().then(res=>{
            this.find2 = res.data.data
        })
    },
    methods:{
      select1(){
          console.log(this.sizeForm.find)
          this.$emit('showCityName',this.sizeForm.find)
          console.log(this.list)
            if(this.list.length == 1){
                this.list = []
            }
      },
      select2(){
          console.log(this.sizeForm.find2)
          this.$emit('showCityNames',this.sizeForm.find2)
          if(this.sizeForm.find2 === 'tj3'){
              this.bit = false
              this.bits = true
          }else{
              this.bit = true
              this.bits = false
          }
      },
      //未归档浏览
      toogleExpand(row){
         console.log(row)
         console.log(this.list)
          this.tableData3 = []
          let obj = {
              loginid:row.loginid,
              orgID:row.orgID
          }
          this.$api.pigeohole.findMasterAttarchDetail(obj).then(res=>{
              this.tableData3 = res.data.data
              $table.toggleRowExpansion(row);
          })
          let $table = this.$refs.table;
            this.list.map((item) => {
                if (row.iop != item.iop) {
                    $table.toggleRowExpansion(item, false)
                }
            })
          }
    },
}
</script>
<style scoped  lang="scss">
 /deep/ .el-table__expanded-cell .el-table .el-table__header-wrapper table {
  width: 100% !important;
}

 /deep/ .el-table__expanded-cell .el-table .el-table__body-wrapper table {
  width: 100% !important;
}
.taskStatusStyleclass {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
}
.taskStatusStyleclass:last-child{
    border-bottom: none;
}
/deep/ .el-table__body-wrapper .el-table__body .el-table__row:last-child td:nth-last-child(2) .cell .el-button:nth-child(2){
    display: none;
}
</style>