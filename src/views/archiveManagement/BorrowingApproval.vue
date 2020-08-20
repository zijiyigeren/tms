<template>
  <!-- 借阅审批 -->
  <div style="width: 100%;height: 100%;">
    <div style="width: 100%;height: 100%;display: flex;flex-direction: column;">
      <div style="overflow: hidden; margin-top:10px;width: 99%">
        <div style="display: flex;">
          <el-form
            style="flex: 1"
            v-bind="{
              model: attarchLend,
              size: 'mini',
              labelWidth: '110px',
              labelSuffix: ' :',
              // 'rules': rules,
            }"
          >
            <el-row>
              <el-col :span="6">
                <el-form-item label="实际申请人">
                  <el-input v-model="attarchLend.factLendor" @keyup.enter.native="query(1,10)"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="档案编号">
                  <el-input v-model="attarchLend.taskCode" @keyup.enter.native="query(1,10)"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="">
                  <el-checkbox v-model="attarchLend.requestbacktime" label="过期未归还"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="状态">
                  <el-select v-model="attarchLend.flag" style="width: 100%;">
                      <el-option
                        v-for="item in masterdocStatusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row> 
          </el-form>
        </div>
        <div style="text-align: right;overflow: hidden;">
            <!--<el-button style="float: left;">&lt;!&ndash;goExcel&ndash;&gt;导出Excel</el-button>-->
            <el-button size="mini" type="primary" @click="query()" ><!--goSearch-->查询</el-button>
            <el-button size="mini" @click="reset()">重置</el-button>
          </div>
      </div>
      <div style="flex: 1;overflow: hidden; margin-top:10px">
        <div style="width: 100%;height: 100%;">
          <el-table
            height="calc(100% - 1px)"
            v-bind="{
              data: Tabledata,
              border: true,
              stripe: true,
            }"
          >
            <el-table-column prop="lendor" label="申请人" align="center" :resizable="false" width=""></el-table-column>
            <el-table-column prop="orgname" label="部门" align="center" :resizable="false" width=""></el-table-column>
            <el-table-column prop="applendtime" label="申请借出时间" align="center" :resizable="false"
                             width=""></el-table-column>
            <el-table-column prop="appbacktime" label="申请归还时间" align="center" :resizable="false"
                             width=""></el-table-column>
            <el-table-column prop="lendtime" label="实际借出时间" align="center" :resizable="false"
                             width=""></el-table-column>
            <el-table-column prop="backtime" label="实际归还时间" align="center" :resizable="false"
                             width=""></el-table-column>
            <el-table-column prop="factLendor" label="实际申请人" align="center" :resizable="false"
                             width=""></el-table-column>
            <el-table-column prop="applyDes" label="申请描述" align="center" :resizable="false" width=""></el-table-column>
            <el-table-column prop="" label="状态" align="center" :resizable="false" width="">
              <template slot-scope="{ row }">
                {{ row.process_instance_id | filter_flag }}
              </template>
            </el-table-column>
            <el-table-column prop="" label="操作" align="center" :resizable="false" width="">
              <template slot-scope="{ row }">
                <template v-if="row.process_instance_id == 1">
                  <span @click="lend(row)">借出</span>
                  <span @click="reject(row)">驳回</span>
                </template>
                <template v-else-if="row.process_instance_id == 3">
                  <span @click="returns(row)">归还</span>
                </template>
                <template v-else-if="row.process_instance_id != 1 && row.process_instance_id != 3">
                  <span></span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10,20,30]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
      </div>
    </div>

    <el-dialog
      title="驳回原因"  
      :visible.sync="rejectdialog"
      width="30%"
     >
        <el-input
          type="textarea"
          :rows="5"
          maxlength="200"
          show-word-limit
          placeholder="请输入原因"
          v-model="rejecttextarea">
        </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectNo">取 消</el-button>
        <el-button type="primary" @click="rejectYes">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  const attarchLend = {
    taskCodeL: '',
    flag: '',
    lendor: '',
    factLendor: '',
    requestbacktime: false,
  }

  export default {
    name: 'borrowingapproval',
    data () {
      return {
        attarchLend: JSON.parse(JSON.stringify(attarchLend)),
        value1: '',
        Tabledata: [],
        masterdocStatusList:[],
        currentPage: 1, // 当前页
        pageSize: 10, // 每页的条数
        total: 0, // 总条数
        rejectdialog:false,// 驳回弹出
        rejecttextarea:'',//驳回原因
        Borrowid:'',//存当前点击信息的id
      }
    },
    filters: {
      filter_flag (value) {
        switch (value) {
          case 1:
            return '申请'
            break
          case 2:
            return '驳回'
            break
          case 3:
            return '借出'
            break
          case 4:
            return '归还'
            break
        }
      }
    },
    methods:{
      flagFn(){ //状态
        this.$api.sendDownload.statustype().then((res)=>{
          this.masterdocStatusList = [{value:'',label:'全部'}]
          res.data.data.forEach(item => {
            let obj = {value:item.dicTypeCode,label:item.dicTypeName}
            this.masterdocStatusList.push(obj)
          });
        }).then(()=>{
          this.attarchLend.flag = this.masterdocStatusList[0].value;
        })
      },
      reset(){//重置
        this.attarchLend = {
          taskCodeL: '',
          flag: '1',
          lendor: '',
          factLendor: '',
          requestbacktime: false,
        }
      },
      query(currentPage,pageSize){ //查询
          if(currentPage){
            this.currentPage = currentPage // 当前页
          }
          if(pageSize){
            this.pageSize = pageSize // 每页的条数
          }
          let beoverdue = '';
          if(this.attarchLend.requestbacktime == true){
            beoverdue = 'on';
          }else{
            beoverdue = '';
          }
         let data = {
            "taskCode": this.attarchLend.taskCode,  //档案编号
            "applendtime": "",  //申请借出时间-开始
            "applendtimeend": "",  //申请借出时间-结束
            "process_instance_id": this.attarchLend.flag,  //全部 -1 ；申请 0 ；借出 4 ； 归还 5
            "lendor": "",  //申请人    
            "orgabc": "",  //部门 全部传空 ，否则传部门id
            "factLendor": this.attarchLend.factLendor,  //实际申请人   
            "searchDate": "",  //年份
            "backtime1": "",  //实际归还时间开始
            "backtime2": "",  //实际归还时间结束
            "backtime": "",  //实际归还时间
            "type": "",  //借阅方式  1电子 2纸质
            "requestbacktime": beoverdue,  //过期未归还 选中传on 不选传空
            "currentPage" :  this.currentPage, //当前页
            "pageSize" : this.pageSize,// 每页的条数
          }
          this.$api.sendDownload.myAttarchLendList(data).then((res)=>{
            this.Tabledata = res.data.data.list;
            this.total = res.data.data.total
          })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.query(this.currentPage,this.pageSize)
      },
      // 分页器-当前页发生改变时
      handleCurrentChange (val) {
        this.currentPage = val
        this.query(this.currentPage,this.pageSize)
      },
      LoanRejected(approveDes,id,process_instance_id){  //借出  驳回   归还  调取公共接口
        let data = {
          "approveDes": approveDes,  	//审批描述 退回驳回时必填
          "id": id,  //id
          "process_instance_id": process_instance_id  //通过 3 ； 驳回 2 ；归还 4
        }
        this.$api.sendDownload.approvethree(data).then((res)=>{
          this.$message({type: 'success', message: res.data.data, duration: 1500});
          this.query();
        }).catch((err)=>{
          this.$message({type: 'error', message: err.data.message, duration: 1500});
        })
      },
      lend(row){ //借出
        this.Borrowid = row.id;
        this.$confirm('确定通过该人员的借阅?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.LoanRejected('',this.Borrowid,3)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
            duration: 1500
          });
        });
      },
      reject(row){ //驳回 弹框
        this.Borrowid = row.id;
        this.rejectdialog = true;
      },
      rejectNo(){ //取消驳回
        this.rejectdialog = false;
        this.rejecttextarea = '';
      },
      rejectYes(){//确定驳回
        this.LoanRejected(this.rejecttextarea,this.Borrowid,2)
        this.rejectdialog = false;
        this.rejecttextarea = '';
      },
      returns(row){ //归还
        this.Borrowid = row.id;
         this.$confirm('确定该档案归还吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.LoanRejected('',this.Borrowid,4)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作',
              duration: 1500
            });
          });
      }
    },
    mounted(){
      this.flagFn()
      this.query(1,10);
    }
  }
</script>

<style scoped>

</style>
