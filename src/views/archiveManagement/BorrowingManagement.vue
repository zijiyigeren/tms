<template>
  <!-- 借阅管理 -->
  <div style="width: 100%;height: 100%;">
    <div style="width: 100%;height: 100%;display: flex;flex-direction: column;">
      <div style="overflow: hidden; margin-top:10px;width: 99%">
        <div style="display: flex;">
          <el-form
            style="flex: 1"
            v-bind="{
              model: tc,
              size: 'mini',
              labelWidth: '110px',
              labelSuffix: ' :',
              // 'rules': rules,
            }"
          >
            <el-row>
              <el-col :span="6">
                <el-form-item label="任务号">
                  <el-input v-model="tc.taskCode" @keyup.enter.native="query(1,10)"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="受检单位">
                  <el-input v-model="tc.companyCheck" @keyup.enter.native="query(1,10)"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="样品名称">
                  <el-input v-model="tc.sampleName" @keyup.enter.native="query(1,10)"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="年份">
                  <el-select v-model="tc.selectDateValue" placeholder="请选择"  size="small">
                    <el-option
                      v-for="item in selectDate"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-show="displayflg">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="规格型号">
                    <el-input v-model="tc.sampleType" @keyup.enter.native="query(1,10)"/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="项目名称">
                    <el-input v-model="tc.search_data" @keyup.enter.native="query(1,10)"/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="归档状态">
                    <el-select v-model="tc.masterdocStatus" class="selectWidth">
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
            </div>
          </el-form>
          <span
            style="cursor: pointer;color: #409EFF;"
            @click="()=>{
              displayflg = !displayflg
            }">
            <i v-show="!displayflg" style="font-style: normal;">展开</i>
            <i v-show="displayflg" style="font-style: normal;">收起</i>
          </span>
        </div>
        <div style="text-align: right;overflow: hidden;">
          <!--<el-button style="float: left;">批量借档</el-button>-->
          <el-button size="mini" type="primary" @click="query(1,10)">查询</el-button>
          <el-button size="mini" @click="reset()">重置</el-button>
        </div>
      </div>
      <div style="height: 10px;"><!-- 防止引用组件报错 --></div>
      <div style="flex: 1;overflow: hidden;">
        <div style="width: 100%;height: 100%;">
          <el-table
            :data="tableData"
            v-loading="loading"
            ref="table_1"
            height="calc(100% - 1px)"
            v-bind="{
              data: Tabledata,
              border: true,
              stripe: true,
            }"
          >
            <el-table-column prop="taskCode" label="任务号" align="center" :resizable="false" width=""></el-table-column>
            <el-table-column prop="checkTypeID" label="检验类别" align="center" :resizable="false"
                             width=""/>
            <el-table-column prop="sampleType" label="样品规格型号" align="center" :resizable="false"
                             width=""/>
            <el-table-column prop="sampleName" label="样品名称" align="center" :resizable="false"
                             width=""/>
            <el-table-column prop="companyCheck" label="受检单位" align="center" :resizable="false"
                             width=""/>
            <el-table-column prop="" label="操作" align="center" :resizable="false" width="">
              <template slot-scope="{ row }">
                <!--<span @click="hide_div(row)">浏览</span>
                <span>借档</span>-->
                <span @click="applicationforborrowing(row)">申请借阅</span>
              </template>
            </el-table-column>
            <!---->
            <!--<el-table-column type="expand" width="1" :resizable="false">
              共计 0 个检验项目 orgName
              <br>
              <el-button>&lt;!&ndash;goQuickView&ndash;&gt;快查</el-button>
              <el-table
                ref="table_2"
                height="400"
                v-bind="{
                  data: Tabledata2,
                  border: true,
                  stripe: true,
                }"
              >
                &lt;!&ndash;<el-table-column prop="" label="序号" align="center" :resizable="false" width=""></el-table-column>&ndash;&gt;
                <el-table-column prop="itemsCode" label="报告编号" align="center" :resizable="false" width="300">
                  <template slot-scope="{ row }">
                    &lt;!&ndash;&ndash;&gt;
                    <template v-if="row.process_instance_id==7">
                      <input type="checkbox" :value="row.id+':'+row.itemsCode">
                    </template>
                    &lt;!&ndash;&ndash;&gt;
                    <template v-if="row.itemsCode.substring(row.itemsCode.length-1) != 1">
                      <span style="color: red">{{row.itemsCode}}</span>
                      <span style="color: blue">{{row.cqcfilename}}</span>
                    </template>
                    <template v-else>{{row.itemsCode}}</template>
                    &lt;!&ndash;&ndash;&gt;
                    <template>
                      <span v-if="row.docStatus == 2" style="color: blue">电子</span>
                      <span v-else-if="row.docStatus == 1" style="color: green">纸张</span>
                      <span v-else style="color: red">未归档</span>
                    </template>
                    &lt;!&ndash;&ndash;&gt;
                    <template v-if="row.accountsign > 1000">
                      <span style="color: blue;">已回款</span>
                      <span @click="">&lt;!&ndash;openWord&ndash;&gt;查看文档</span>
                    </template>
                    &lt;!&ndash;&ndash;&gt;
                    <template v-if="row.zjsign >= 7">
                      <span style="color: green;">中机上传</span>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column prop="itemsName" label="项目名称" align="center" :resizable="false"
                                 width=""></el-table-column>
                <el-table-column prop="sign_name" label="" align="center" :resizable="false"
                                 width=""></el-table-column>
                <el-table-column prop="" label="" align="center" :resizable="false"
                                 width="">
                  <template slot-scope="{ row }">
                    <span>流转</span>
                    <span>{{row.procName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="docStatus" label="标记状态" align="center" :resizable="false"
                                 width=""></el-table-column>
                <el-table-column prop="taskCode" label="当前状态" align="center" :resizable="false"
                                 width=""></el-table-column>
              </el-table>
            </el-table-column>-->
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
    <!-- 借阅 -->
    <el-dialog
      v-if="show"
      :visible.sync="show"
      v-bind="{
        title:'借阅',
        width: '550px',
        modal: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
      }"
      >
      <!--{{form1}}-->
      <el-form
        v-bind="{
          model: form1,
          size: 'mini',
          labelWidth: '110px',
          labelSuffix: ' :',
        }"
       >
        <el-form-item label="借阅类型" :rules="{required: true,}">
          <el-select v-model="form1.type" style="width: 100%;">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实际借出人">
          <el-input v-model="form1.lendor"></el-input>
        </el-form-item>
        <el-form-item label="申请借出时间">
          <el-date-picker
            style="width: 100%;"
            v-model="form1.applendtime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择申请借出时间"
            v-bind="{
              // clearable: false,
              // readonly: true,
              editable: false,
            }"
          />
        </el-form-item>
        <el-form-item label="申请归还时间">
          <el-date-picker
            style="width: 100%;"
            v-model="form1.appbacktime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择申请归还时间"
            v-bind="{
              // clearable: false,
              // readonly: true,
              editable: false,
            }"
          />
        </el-form-item>
        <el-form-item label="申请描述">
          <textarea v-model.lazy="form1.applyDes"
                    maxlength="300"
                    placeholder="申请描述"
          >
          </textarea>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button size="mini" type="primary" @click="saveOk" ><!--post attarchLend/manage/save-->确定</el-button>
        <el-button size="mini" type="" @click="show=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const tc = {
    taskCode: '',
    companyCheck: '',
    sampleName: '',
    sampleType: '',
    search_data: '',
    masterdocStatus: '',
    selectDateValue:'',
  }
  const form1 = {
    type: '',
    lendor: '',
    applendtime: '',
    appbacktime: '',
    applyDes: '',
  }
  export default {
    name: 'borrowingmanagement',
    components: {},
    data () {
      return {
        displayflg: false,
        tc: JSON.parse(JSON.stringify(tc)),
        Tabledata: [],
        tableData:[],
        show: false,
        form1: JSON.parse(JSON.stringify(form1)),
        selectDate:'',
        arrYear:[{value: '', label: '全部'}],
        masterdocStatusList:[
          {value: '', label: '全部'},
          {value: '0', label: '未提交科室'},
          {value: '1', label: '已提交科室'},
          {value: '2', label: '已提交管理室'},
          {value: '3', label: '管理室归档'}
        ],
        currentPage: 1, // 当前页
        pageSize: 10, // 每页的条数
        total: 0, // 总条数
        clickTaskCode : '',// 存储当前点击的任务号
        loginName:JSON.parse(window.localStorage.getItem('userInfo')).loginName,//获取当前登录人
        typeList:[{value:'',label:'全部'}],//借阅类型
        clickTaskId:'',//存储当前点击的任务id
        loading:false,
      }
    },
    watch: {
      'form1.applendtime': function (value) {
        if (value == null) {
          this.form1.applendtime = ''
        }
      },
      'form1.appbacktime': function (value) {
        if (value == null) {
          this.form1.appbacktime = ''
        }
      },
    },
    methods: {
      hide_div (row) {
        let tabl = this.$refs['table_1']
        tabl.toggleRowExpansion(row)
      },
      yearDate() { //遍历年份  从2007开始到当前年份
        const myDate = new Date();
        let thisYear = myDate.getFullYear();
        let Section = thisYear - 2007;
        for (let i = 0; i <= Section; i++) {
          let _thisYear = thisYear--;
          let obj = {value: _thisYear, label: _thisYear};
          this.arrYear.push(obj);
        }
        this.selectDate = this.arrYear;
        this.tc.selectDateValue = this.selectDate[1].value;
      },
      query(currentPage,pageSize){ //查询
        this.loading = true;
        if(currentPage){
          this.currentPage = currentPage // 当前页
        }
        if(pageSize){
          this.pageSize = pageSize // 每页的条数
        }
        let data = {
          "companyCheck": this.tc.companyCheck,  //受检单位
          "docStatus": this.tc.masterdocStatus,  //归档状态
          "sampleName": this.tc.sampleName,  //样品名称
          "sampleType": this.tc.sampleType,  //规格型号
          "search_data": this.tc.search_data,  //项目名称
          "searchdate": this.tc.selectDateValue,  //年份
          "taskCode": this.tc.taskCode,  //任务号
          "currentPage" :  this.currentPage, //当前页
          "pageSize" : this.pageSize,// 每页的条数
        }
        this.$api.sendDownload.approveList(data).then((res)=>{
          this.loading = false;
          this.tableData = res.data.data.list
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
      applicationforborrowing(row){ //申请借阅
        this.form1 = {
          type: '',
          lendor: '',
          applendtime: '',
          appbacktime: '',
          applyDes: '',
        }
        this.typeListFn()//借阅类型
        this.clickTaskCode = row.taskCode;
        this.clickTaskId = row.id
        this.show = true;
      },
      typeListFn(){ //借阅类型
        this.$api.sendDownload.dictype().then((res)=>{
          console.log(res)
          this.typeList = [{value:'',label:'全部'}]
          res.data.data.forEach(item => {
            let obj = {value:item.dicTypeCode,label:item.dicTypeName}
            this.typeList.push(obj)
          });
        }).then(()=>{
          console.log(this.typeList)
          this.form1.type = this.typeList[1].value;
        })
      },
      saveOk(){//借阅申请 保存
        let lend = this.form1.applendtime.replace(/-/g, "");
        let returns = this.form1.appbacktime.replace(/-/g, "");
        if(Number(lend)>Number(returns)){
          this.$message({type: 'error', message: "归还时间不能小于借出时间", duration: 1500})
          return false
        }
        this.show = false;
        let data = {
          "id": "",  //新增时传空
          "taskCode": this.clickTaskCode,  //选择借档的任务号,批量时传多个任务号,分隔
          "lendor": "",  //申请借出人，当前操作人登陆名
          "factLendor": this.form1.lendor,  //实际借出人，手动输入
          "applendtime": this.form1.applendtime,  //申请借出时间 YYYY-MM-DD
          "appbacktime": this.form1.appbacktime,  //申请归还时间 YYYY-MM-DD
          "applyDes": this.form1.applyDes,  //申请描述
          "approveDes": "",  //审批描述
          "lendtime": "",  //实际借出时间
          "backtime": "",  //实际归还时间
          "type": this.form1.type,  //借阅方式  1电子 2纸质
          "taskId" : this.clickTaskId,// 任务id
          "lendor" : this.loginName,//当前登录人
        }
        this.$api.sendDownload.manageSave(data).then((res)=>{
          this.$message({type: 'success', message: res.data.data, duration: 1500})
        }).catch((err)=>{
          this.$message({type: 'error', message: err.data.message, duration: 1500})
        })
      },
      reset(){//重置
        this.tc = {
          taskCode: '',
          companyCheck: '',
          sampleName: '',
          sampleType: '',
          search_data: '',
          masterdocStatus: '',
          selectDateValue:'',
        }
      }
    },
    created(){
      this.yearDate()//遍历年份  
    },
    mounted(){
      this.query(1,10);
     
    }
  }
</script>

<style scoped lang="less">
  textarea {
    resize: none;
    outline: none;
    padding: 0 5px;
    width: 100%;
    height: 120px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
  }
  .selectWidth{ width: 100%;}
  /deep/ .el-range-separator{ width: 20px;}
</style>
