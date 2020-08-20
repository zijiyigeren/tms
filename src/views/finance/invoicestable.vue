<template>
  <section class="dislogBox" :style="{
    padding: myStyle ? '20px 20px 0 20px' : '0'
  }">
    <div class="dislogBox_content" :style="{
      overflowY: myStyle ? 'visible':'auto'
    }">

      <div class="componentBoxs">
        <!-- 一级头部 -->
        <el-table
          :data="dataList"
          height="450"
          border
          :header-cell-style="{
                                  'background-color': 'rgba(243,246,253,1)',
                                  'color': '#606266',
                                  'padding': '10px 0'
                              }"
          style="width: 100%">
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            align="center"
            prop="companyadr"
            label="单位地址"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="people"
            label="收件人"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="tel"
            label="收件人电话"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="code"
            label="发票号"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="fpjine"
            label="金额"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="senddate"
            label="发送日期"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="billType"
            label="发票类型"
            >
            <template slot-scope="scope">
              {{scope.row.billType}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" align="center">
            <template slot-scope="scope">
              <el-button
                type="text" style="color:#32AFF0;marginLeft:6px;"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                type="text" style="color:#32AFF0;marginLeft:6px;"
                @click="handleSee(scope.$index, scope.row)">查看</el-button>
              <el-button
                type="text" style="color:#32AFF0;marginLeft:6px;"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页器 -->
      
      <div :class="{'lxt_block':myStyles==false}" :style="{
        paddingTop: myStyle ? '10px' : '0'
      }">
        <!-- 报告编辑页显示的分页器 -->
        <el-pagination v-if="myStyles==false"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10,20,30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total=total>
        </el-pagination>
      </div>
      
    </div>

    <!-- 发票管理弹窗 -->
    <el-dialog
      title="发票管理"
      top="20px"
      :visible.sync="dialoginvoice"
      width="80%"
      >
      <div class="shtitle">收件人</div>
      <div class="invoice_box">
        <div class="incoupt">
          <label><span class="red">*</span>收件人姓名：</label>
          <el-input placeholder="请输入姓名" v-model="sName"  size="small" clearable name="clearInputValue" :disabled = 'this.isvcx == 2 ? true : false'></el-input>
        </div>
        <div class="incoupt">
          <label>电话：</label>
          <el-input placeholder="请输入电话" v-model="sTel" size="small" clearable name="clearInputValue" :disabled = 'this.isvcx == 2 ? true : false'></el-input>
        </div>
        <div class="incoupt">
          <label><span class="red">*</span>邮政编码：</label>
          <el-input placeholder="请输入邮政编码" v-model="sPostal" size="small" clearable name="clearInputValue" :disabled = 'this.isvcx == 2 ? true : false'></el-input>
        </div>
        <div class="incoupt">
          <label><span class="red">*</span>单位地址：</label>
          <el-input placeholder="请输入单位地址" v-model="sAddress" size="small" clearable name="clearInputValue" :disabled = 'this.isvcx == 2 ? true : false'></el-input>
        </div>
        <div class="incoupt">
          <label><span class="red">*</span>单位名称：</label>
          <el-input placeholder="请输入单位名称" v-model="sUnitName" size="small" clearable name="clearInputValue" :disabled = 'this.isvcx == 2 ? true : false'></el-input>
        </div>
        <div class="incoupt">
          <label>发票金额：</label>
          <el-input placeholder="请输入发票金额" v-model="sAmount" size="small" clearable name="clearInputValue" :disabled = 'this.isvcx == 2 ? true : false'></el-input>
        </div>
        <div class="incoupt">
          <label>发票号：</label>
          <el-input placeholder="请输入发票号" v-model="invoiceNo" size="small" clearable name="clearInputValue" :disabled = 'this.isvcx == 2 ? true : false'></el-input>
        </div>
        <div class="incoupt">
          <label>发送日期：</label>
          <el-date-picker
            v-model="sendingValue"
            value-format="yyyy-MM-dd"
            type="date"
             :disabled = 'this.isvcx == 2 ? true : false'
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="incoupt">
          <label>开票日期：</label>
          <el-date-picker
            v-model="invoiceValue"
            value-format="yyyy-MM-dd"
            type="date"
             :disabled = 'this.isvcx == 2 ? true : false'
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="incoupt">
          <label>发票类型：</label>
          <el-select v-model="invoiceTypeValue"  :disabled = 'this.isvcx == 2 ? true : false' placeholder="请选择">
            <el-option
              v-for="item in invoiceType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="incoupt">
          <label>类型：</label>
          <el-select v-model="typeValue"  :disabled = 'this.isvcx == 2 ? true : false' placeholder="请选择">
            <el-option
              v-for="item in typeKes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="shtitle">发件人</div>
      <div class="invoice_box">
        <div class="incoupt">
          <label><span class="red">*</span>发件人姓名：</label>
          <el-input placeholder="请输入姓名" v-model="fName" size="small" clearable name="clearInputValue" :disabled = 'this.isvcx == 2 ? true : false'></el-input>
        </div>
        <div class="incoupt">
          <label>电话：</label>
          <el-input placeholder="请输入电话" v-model="fTel" size="small" clearable name="clearInputValue"  :disabled = 'this.isvcx == 2 ? true : false' ></el-input>
        </div>
        <div class="incoupt">
          <label><span class="red">*</span>邮政编码：</label>
          <el-input placeholder="请输入邮政编码" v-model="fPostalCode" size="small" clearable name="clearInputValue" :disabled = 'this.isvcx == 2 ? true : false'></el-input>
        </div>
        <div class="incoupt">
          <label><span class="red">*</span>单位地址：</label>
          <el-input placeholder="请输入单位地址" v-model="fUnitaddress" size="small" clearable name="clearInputValue" :disabled = 'this.isvcx == 2 ? true : false'></el-input>
        </div>
        <div class="incoupt">
          <label><span class="red">*</span>单位名称：</label>
          <el-input placeholder="请输入单位名称" v-model="fUnitname" size="small" clearable name="clearInputValue" :disabled = 'this.isvcx == 2 ? true : false'></el-input>
        </div>
        <div class="incoupt">
          <label>绑定催款单：</label>
          <el-input placeholder="请选择设备"  :readonly="true" v-model="BindingCollectionLetter"  :disabled = 'this.isvcx == 2 ? true : false'>
            <el-button slot="append" icon="el-icon-search" @click="sBindingelection"  :disabled = 'this.isvcx == 2 ? true : false'/>
          </el-input>
        </div>
        <div class="incoupt">
          <label>发送内容：</label>
          <el-input
            type="textarea"
            :rows="4"
             :disabled = 'this.isvcx == 2 ? true : false'
            placeholder="请输入内容"
            v-model="fSendContent">
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialoginvoice = false">取 消</el-button>
        <el-button type="primary" @click="invoiceSend">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="催款单"
      top="20px"
      :visible.sync="diaCollection"
      width="80%"
     >
      <div class="inBoxs">
        <div class="incoupt">
          <label>催款单号：</label>
          <el-input placeholder="催款单号" v-model="ccollectionorderNo"  size="small" clearable name="clearInputValue" ></el-input>
        </div>
        <div class="incoupt">
          <label>单位：</label>
          <el-input placeholder="单位" v-model="ccompany"  size="small" clearable name="clearInputValue" ></el-input>
        </div>
        <el-button type="primary" class="bespoke" @click="querycollect()">查询</el-button>
      </div>

      <el-table
        :data="collectData"
        style="width: 100%">
         <el-table-column
            v-bind="{
                width:'55',
                label:'',
                resizable:false,
                align:'center',
                property:'',
            }"
        >
            <template slot-scope="{ row }">
                <el-checkbox v-model="row.check" :label="0" @change="bindingmoban(row)"></el-checkbox>
            </template>
        </el-table-column>

        <el-table-column
          type="index"
          label="序号"
          align='center'
          width="50">
        </el-table-column>
        <el-table-column
          prop="code"
          label="催款单号"
          >
        </el-table-column>
        <el-table-column
          prop="companyCheck"
          label="单位"
          >
        </el-table-column>
        <el-table-column
          prop="account2"
          label="应收总计">
        </el-table-column>
        <el-table-column
          prop="caccount2"
          label="打折总费用">
        </el-table-column>
        <el-table-column
          prop="createdate"
          label="生成日期">
        </el-table-column>

      </el-table>
        <div class="pagingdevice">
          <el-pagination
            @size-change="bindingHandleSizeChange"
            @current-change="bindingHandleCurrentChange"
            :current-page="bindingCurrentPage"
            :page-sizes="[5,10,15]"
            :page-size="bindingPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="bindingTotal">
          </el-pagination>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="diaCollection = false">取 消</el-button>
        <el-button type="primary" @click="collectionsend">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  import base from '@/api/base.js'
  export default {
    name: 'invoicestable',
    data () {
      let self = this;
      return {
        dataList: [],  //一级列表展示
        currentPage: 1, // 当前页数  分页
        pageSize: 2,   //每页显示条数 分页
        total: 0,  // 总条数
        itemValues: [], //存储选中的报告的id
        myStyles: this.myStyle,//分页样式选择
        isko:false,//修改金额
        queryTdata:null,//给子组件传值 费用确认
        dialoginvoice:false,// 新增发票弹出框
        // 收件人
        sName:'',//收件人姓名
        sTel:'',//电话
        sPostal:'',//邮政编码
        sAddress:'',//单位地址
        sUnitName:'',//单位名称
        sAmount:'',//发票金额
        sendingValue:'',//发送日期
        invoiceValue:'',//开票日期
        invoiceTypeValue:'',//发票类型
        invoiceType:[],//发票类型
        typeValue:'',//类型
        typeKes:[],//类型
        invoiceNo:'',//发票号
        // 发件人
        fName:'',//发件人姓名：  
        fTel:'',//电话
        fPostalCode:'',//邮政编码
        fUnitaddress:'',//单位地址
        fUnitname:'',//单位名称
        BindingCollectionLetter:'',//绑定催款单
        fSendContent:'',//发送内容
        diaCollection:false,//催款单弹出窗
        //催款单
        ccollectionorderNo:'',//催款单号
        ccompany:'',//单位：
        collectData:[],//列表数据
        bindingCurrentPage: 1, // 绑定模板列表-当前页
        bindingPageSize: 5, // 绑定模板列表-每页的条数
        bindingTotal:0,//绑定模板列表-总数
        bandSelection: [],//全选id
        bandCode:[],//全选code
        rowid:'',//检验项目id
        isvcx:0,//判断是 新增=0 编辑=1 查看=2

       
      }
    },
    methods: {
      dataListData () {//一级列表展示数据
        this.dataList = []
        this.dataList = this.querydataChild.list;
        this.total = this.querydataChild.total;
       
        this.dataList.forEach(item => {
          item.check = false
        });
        console.log(this.dataList)
      },
      handleSizeChange (val) {
        this.pageSize = val // 每页展示的条数
        this.$emit('displayed', val)
        this.$nextTick(res => {
          this.$parent.queryselect(false)
        })
      },
      handleCurrentChange (val) {
        this.currentPage = val // 当前展示的第几页
        this.$emit('cpage', val)
        this.$nextTick(res => {
          this.$parent.queryselect(false)
        })
        //this.itemValues=[];
      },
      myWindow (parentSel, parentQuery) {
        let oHeaderHeight = 95
        let oBody = document.documentElement.scrollHeight || document.body.scrollHeight
        let oDisLogBox = document.querySelector('.dislogBox')
        let oLxtBlock = document.querySelector('.lxt_block')
        oDisLogBox.style.height = oBody - oHeaderHeight - parentSel - parentQuery - oLxtBlock.offsetHeight + 'px'

        oLxtBlock.style.width = '98%'
        oLxtBlock.style.position = 'fixed'
        oLxtBlock.style.left = '1%'
        oLxtBlock.style.bottom = .6 + 'vw'
      },
      handleEdit(index, row) { //编辑
        console.log(index, row);
        this.editView(row);
        this.rowid = row.id;
        this.isvcx = 1;
        
      },
      handleDelete(index, row) { //删除
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$api.financial.getdelivero(row.id).then(res => {
            if( res.data.ok == true){
              this.$alert(res.data.data, '信息提示', {
                  dangerouslyUseHTMLString: true
              });
              this.$parent.queryselect(false);
            }
          }).catch(res => {
              this.$alert(res.data.message, '信息提示', {
                  dangerouslyUseHTMLString: true
              });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
            duration: 1500
          });
        });
      },
      handleSee(index, row){ //查看
        console.log(index, row);
        this.editView(row);
        this.isvcx = 2;
      },
      prainvoice(){ //新增发票
        this.dialoginvoice = true;
        this.isvcx = 0
        this.getbillType();
        this.gettype2();
        this.resetData();
      },
      sBindingelection(){//绑定催款单
        const data = {
            "taskCode": '',  //任务号
            "code": this.ccollectionorderNo,  //催款单号
            "flag": '',  //下载状态 全部-1；未下载0；已下载1
            "aflag": 0,  //催款单状态 全部-1；未回款0；回款中1；已结算2
            "sampleName": '',  //样品名称
            "sampleType": '',  //规格型号
            "search_field": '',  //查询其他 类型 tinfo.wttype ; 申请编号tinfo.checkYear
            "search_data": '',  //数据
            "searchdate2": '',  //>=下达日期1
            "searchdate3": '',  //<=下达日期2
            "taskcreator": '',  //催款单生成人
            "mailflag": '',  //mail状态 全部0  未发送 1  已发送 4
            "searchdate4": '',  //催款单生成时间>=
            "searchdate5": '',  //催款单生成时间>=
            "ifrom": '',  //区域 ， 传typeABC
            "companyCheck":this.ccompany,//单位
            'currentPage': this.bindingCurrentPage,// 当前页数  分页
            'pageSize': this.bindingPageSize,//每页显示条数 分页
        };
        this.$api.financial.getDunnagedList(data).then(res => {
          this.collectData = res.data.data.list
          this.bindingTotal = res.data.data.total
          for(let i=0; i<this.collectData.length; i++){
            this.$set(this.collectData[i],'check',false)
          }
          console.log(this.bandSelection.length)
          if(this.bandSelection.length == 0){

          }else{
            console.log(this.collectData)
            for(let i=0; i<this.collectData.length; i++){
              for(let t=0; t<this.bandSelection.length; t++){
                  if(this.collectData[i].ckid == this.bandSelection[t]){
                    this.collectData[i].check = true;
                  }
              }
            }
          }
          this.diaCollection = true;
        })
        this.ccollectionorderNo = '';
        this.ccompany = '';
      },
      querycollect(){ //催款单查询
        this.sBindingelection()
      },
      bindingmoban(item){ //绑定模板 复选框逻辑
        if(item.check){
          this.bandSelection.push(item.ckid)
          this.bandCode.push(item.code)
        }else{
          for(let i=0; i<this.bandSelection.length; i++){
            if(this.bandSelection[i] == item.ckid){
                this.bandSelection.splice(i,1);
                this.bandCode.splice(i,1);
            }
          }
        }
        console.log(this.bandCode)
        console.log(this.bandSelection)
      },
      collectionsend(){ //选中的催款单 回显
        this.BindingCollectionLetter = [];
        this.BindingCollectionLetter = this.bandCode.join();
        this.diaCollection = false
      },
      // 绑定模板-分页器-设置每条的页数
      bindingHandleSizeChange(val) {
        this.bindingPageSize = val;
        this.sBindingelection()
      },
      // 绑定模板-分页器-当前页发生改变时
      bindingHandleCurrentChange(val) {
        this.bindingCurrentPage = val;
        this.sBindingelection()
      },
      invoiceSend(){ //新增发票 保存  按钮
        let id ;
        if(this.isvcx == 0){ //新增
           id = '';
        }
        if(this.isvcx == 1){ // 编辑
           id = this.rowid;
        }
        if(this.isvcx == 2){ // 查看
           this.dialoginvoice = false
           return false;
        }
        if(this.sName == ''){
          this.$alert('收件人姓名不能为空', '信息提示', {
            dangerouslyUseHTMLString: true
          });
          return false;
        }
        if(this.sUnitName == ''){
          this.$alert('收件人单位名称不能为空', '信息提示', {
            dangerouslyUseHTMLString: true
          });
          return false;
        }
        if(this.sAddress == ''){
          this.$alert('收件人地址不能为空', '信息提示', {
            dangerouslyUseHTMLString: true
          });
          return false;
        }
        if(this.fName == ''){
          this.$alert('发件人不能为空', '信息提示', {
            dangerouslyUseHTMLString: true
          });
          return false;
        }
        if(this.fUnitname == ''){
          this.$alert('发件人单位不能为空', '信息提示', {
            dangerouslyUseHTMLString: true
          });
          return false;
        }
        if(this.fUnitaddress == ''){
          this.$alert('发件人单位地址不能为空', '信息提示', {
            dangerouslyUseHTMLString: true
          });
          return false;
        }

        if(this.sPostal != ''){
          var reg= /^[1-9][0-9]{5}$/;
          if(!reg.test(this.sPostal)){
            this.$alert('收件人邮政编码输入有误,应输入六位邮政编码号', '信息提示', {
              dangerouslyUseHTMLString: true
            });
            return false;
          }
        }

        if(this.fPostalCode != ''){
          var reg= /^[1-9][0-9]{5}$/;
          if(!reg.test(this.fPostalCode)){
            this.$alert('发件人邮政编码输入有误,应输入六位邮政编码号', '信息提示', {
              dangerouslyUseHTMLString: true
            });
            return false;
          }
        }

        
        let data = {
          "id": id,   //新增时传空，编辑时传返回的id
          "people": this.sName,   //cw 收件人姓名
          "company": this.sUnitName,   //cw 单位名称
          "companyadr": this.sAddress,  // 收件人地址
          "tel": this.sTel,  // 收件人电话
          "postcode": this.sPostal,   //收件人邮政编号
          "senddate": this.sendingValue,   //发送日期
          "fpdate":  this.invoiceValue,   //发票日期
          "fpjine": this.sAmount,   //发票金额
          "type": 0,   // 0任务  1修改单 默认为0  ?????
          "username": this.fName,   //发送人
          "telno": this.fTel,  // 发送人电话
          "comapnyname": this.fUnitname,  // 发送人单位
          "comapanyaddress": this.fUnitaddress,   // 发送人单位地址
          "zipcode": this.fPostalCode,   //发送人编码
          "sendcontent":  this.fSendContent,   // 发送内容
          "billType": this.invoiceTypeValue,   //数据字典维护 电子发票、普通发票
          "type2": this.typeValue,   //数据字典维护 CCC、公告、监督抽样、整车委托、部件委托、认证部、检验部、路试、高低温、其他
          "ckdids" : this.bandSelection, ////绑定的催款单id
          "code" : this.invoiceNo, //发票号
          
        }

        this.$api.financial.getfapiaoSave(data).then(res => {
            if(res.data.ok == true){
              this.$alert(res.data.data, '信息提示', {
                  dangerouslyUseHTMLString: true
              });
              this.$parent.queryselect(false);
              this.resetData();
            }
            console.log(res)
          }).catch(res => {
              this.falg = false
              this.$alert(res.data.message, '信息提示', {
                  dangerouslyUseHTMLString: true
              });
          })
        this.dialoginvoice = false
      },
      resetData(){ //重置新增发票管理
        this.sName='';//收件人姓名
        this.sTel='';//电话
        this.sPostal='';//邮政编码
        this.sAddress='';//单位地址
        this.sUnitName='';//单位名称
        this.sAmount='';//发票金额
        this.sendingValue='';//发送日期
        this.invoiceValue='';//开票日期
        this.invoiceTypeValue='';//发票类型
        this.invoiceType=[];//发票类型
        this.typeValue='';//类型
        this.typeKes=[];//类型
        this.invoiceNo = ''//发票号
        // 发件人
        this.fName='';//发件人姓名：  
        this.fTel='';//电话
        this.fPostalCode='';//邮政编码
        this.fUnitaddress='';//单位地址
        this.fUnitname='';//单位名称
        this.fSendContent='';//发送内容
        this.bandSelection= [];//全选id
        this.bandCode=[];//全选code
        this.BindingCollectionLetter = '';
        this.rowid = '';
      },
      getbillType(){ //发票管理数据
        this.$api.financial.getbillType().then(res => {
          this.invoiceType = [];
          this.invoiceTypeValue = ''
          res.data.data.forEach(item => {
              this.invoiceType.push({lable:item.dicTypeName,value:item.dicTypeCode})
          });
          this.invoiceTypeValue = res.data.data[0].dicTypeCode;
          console.log(res)
        }).catch(res => {
            this.$alert(res.data.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        })
      },
      gettype2(){ //发票管理数据
        this.$api.financial.gettype2().then(res => {
          this.typeKes = [];
          this.typeValue = ''
          res.data.data.forEach(item => {
              this.typeKes.push({lable:item.dicTypeName,value:item.dicTypeCode})
          });
          this.typeValue = res.data.data[0].dicTypeCode;
          console.log(res)
        }).catch(res => {
            this.$alert(res.data.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        })
      },
      editView(row){
        this.dialoginvoice = true
        this.getbillType();
        this.gettype2();
        this.sName=row.people;//收件人姓名
        this.sTel=row.tel;//电话
        this.sPostal=row.postcode;//邮政编码
        this.sAddress=row.companyadr;//单位地址
        this.sUnitName=row.company;//单位名称
        this.sAmount=row.fpjine;//发票金额
        this.sendingValue=row.senddate;//发送日期
        this.invoiceValue=row.fpdate;//开票日期
        this.invoiceTypeValue=row.billType;//发票类型
        this.typeValue=row.type2;//类型
        this.invoiceNo = row.code //发票号
        // 发件人
        this.fName=row.username;//发件人姓名：  
        this.fTel=row.telno;//电话
        this.fPostalCode=row.zipcode;//邮政编码
        this.fUnitaddress=row.comapanyaddress;//单位地址
        this.fUnitname=row.comapnyname;//单位名称
        this.fSendContent=row.sendcontent;//发送内容
        this.bandSelection= row.ckdids;//全选id
        this.bandCode=row.ckdCodes.split(",");//全选code
        this.BindingCollectionLetter = row.ckdCodes;
        this.bindingCurrentPage = 1;
      },
    },
    filters: {
      fntype(val){
        switch(val){
            case 0:
              return "普通发票"
            break;
            case 1:
              return "电子发票"
            break;

        }
      }
    },
    watch: {
      querydataChild (val) {
        this.dataList = val;
       
        this.dataListData();
      },
      myStyle (value) {
        this.myStyle = value
      },
    },
    created(){
      
    },
    mounted () {
      this.getbillType();
      this.gettype2();
    },
    props: [
      'querydataChild', 'mypagesize', 'myStyle'
    ],
    components: {
      
    }
  }
</script>
<style lang="scss" scoped>
  /* 自定义表格列width */
  .inspected{
    width: 10%;
    text-indent: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .taskno {
    width: 12%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .reportstatus {
    width: 10%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .expenses {
    width: 8%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .specification {
    width: 8%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .samplename {
    width: 8%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tasktype {
    width: 5%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .time {
    width: 5%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bornadult{
    width: 5%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .status {
    width: 29%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .status span:hover{
    color: rgb(28, 80, 250);
    cursor:pointer;
  }

  /* 自定义表格列with */





  /* 按钮公共样式 */
  button {
    width: auto;
    padding: .6vw;
    margin: 0;
    font-size: 14px;
    display: inline-block;
   
    cursor: pointer;
    border-radius: 4px;
    border: none;
    -webkit-box-direction: normal;
  }

  button:hover {
    filter: alpha(opacity=90);
    opacity: 0.9;
  }

  /* 按钮公共样式 */

  /* 自定义按钮颜色 */
  .info {
    color: #FFF;
    background-color: #909399;
    border-color: #909399;
  }

  .success {
    color: #FFF;
    background-color: #67C23A;
    border-color: #67C23A;
  }

  .primary {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
  }

  .warning {
    color: #FFF;
    background-color: #E6A23C;
    border-color: #E6A23C;
  }

  .danger {
    color: #FFF;
    background-color: #F56C6C;
    border-color: #F56C6C;
  }

  /* 自定义按钮颜色 */

  .dislogBox {
    display: flex;

    .dislogBox_content {
      flex: 1;
      -webkit-box-flex: 1;
      overflow-y: auto;
      height: calc(100% - 50px);
      
    }
  }

  .componentBoxs {
    width: 100%;
  }

  .Interone {
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
  }

  .cB_listTitle {
    width: 100%;
    background-color: rgb(243, 246, 253);
    height: auto;
    display: flex;
    border-top: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    margin-bottom: 0;
  }

  .cB_listTitle li {
    line-height: 3vw;
    box-sizing: border-box;
    border-right: 1px solid #EBEEF5;
    list-style: none;
    text-align: center;
    color: #909399;
  }

  .cB_assembly {
    width: 100%;
    height: auto;
  }

  .cB_listcenter {
    width: 100%;
    height: auto;
    display: flex;
    border-bottom: 1px solid #EBEEF5;
    border-top: 1px solid #EBEEF5;
    margin-bottom: 0 !important;
  }

  .cB_listcenter li {
    line-height: 3vw;
    box-sizing: border-box;
    border-right: 1px solid #EBEEF5;
    list-style: none;
    text-align: center;
    color: #909399;
  }

  .cB_listcenter li:last-child {
    border-right: none
  }

  .cB_listcenter li button {
    text-indent: 0;
  }

  .buttons {
    text-align: left;
    padding-bottom: .8vw;
    padding-top: .8vw;
    padding-left: .5vw;
    border-top: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;

    .btnsPrimary {
      min-width: 68px;
    }
  }

  /* 第一次弹出 */
  .oneFirstFloor {
    width: 95%;
    clear: both;
    margin: 1vw auto;
  }

  .onecB_listcenter {
    width: 100%;
    height: auto;
    display: flex;
    border: 1px solid #EBEEF5;
    margin-bottom: 0;
  }

  .onecB_listcenter li {
    line-height: 3vw;
    box-sizing: border-box;
    border-right: 1px solid #EBEEF5;
    list-style: none;
    text-align: center;
    color: #909399;
  }

  .onecB_listcenter li:last-child {
    border-right: none
  }

  .onecB_listcenter li button {
    text-indent: 0;
  }

  
 
  /* 分页样式 */
  .lxt_block {
    height: 50px;
    width: 100%;
    background: #fff;
    display: flex;
  }

  .lxt_block .el-pagination {
    height: 50px;
    display: flex;
    align-items: center;
  }

  .lxt_block .el-pagination .el-pager {
    display: flex;
    align-items: center;
  }

  .incolde {
    width: 45%;
    text-indent: 0;
  }

  .spanclass {
    color: rgb(50, 175, 240);
    cursor: pointer
  }

  .operation i {
    font-style: normal;
    color: rgb(50, 175, 240);
  }

  .operation2 i {
    font-style: normal;
    color: rgb(50, 175, 240);
  }

  .selwidth {
    width: 10vw;
  }

  .checkboxleft {
    position: relative;
    left: 0;
  }

  .bordeLine {
    border: 1px solid #EBEEF5;
    border-top: none;
  }

  .pot {
    position: relative;
  }

  /deep/ .el-loading-spinner {
    width: 100%;
    margin-top: -21px;
    text-align: center;

  }


  // 新增
  .pszet {
    width: 100%;
    height: auto;
    line-height: 42px;
    overflow: hidden;
  }

  .prevtersize {
    width: auto;
    height: auto;
    float: left;
  }

  .prevter {
    width: 50%;
    height: auto;
    padding: 20px;
    border-bottom: 1px solid #ccc;

    float: left;
    margin-left: 10px;
  }

  /deep/ .upload-demo .el-upload-list {
    position: absolute;
    left: -18vw;
    top: -4px;
  }

  /* 处理ie11下字号太小问题 */
  @media screen and (min-width: 0 \0
  ) {
    button {
      font-size: 14px;
    }
  }

  /deep/ #oneFirstFloor .el-checkbox-group .cB_theCirculation .onecB_listcenter .tasknumber2 .el-checkbox .el-checkbox__label {
    display: none
  }

  // 新增
  .mybox {
    width: 100%;
    height: auto;
    overflow: hidden;
  }

  .mybox ul {
    margin: 0;
    padding: 0;
  }

  .mybox ul li {
    width: 100%;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
  }

  .mybox ul li span {
    display: block;
    float: left;
  }

  .mybox ul li span.cl1 {
    width: 15%;
  }

  .mybox ul li span.cl2 {
    width: 60%;
    border-bottom: 1px #ccc solid;
    height: 38px;
    position: relative;
  }

  .mybox ul li span.cl2 i {
    font-style: normal
  }

  .mybox ul li span.cl2 b {
    position: absolute;
    right: 0;
    color: #ccc;
    font-size: 18px !important;
    cursor: pointer;
  }

  .mybox ul li span.cl3 {
    width: 15%;
    text-align: center;
    height: 28px;
    line-height: 28px;
    margin-top: 8px;
    border: 1px #ccc solid;
    margin-left: 2%;
    cursor: pointer;
  }

  /deep/ .dialog_recordSee {
    overflow: hidden;

    .el-dialog {
      margin: 0 !important;
      padding: 0 !important;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 90%;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .el-dialog__body {
        flex: 1 !important;
        padding: 20px;
        overflow: hidden;
      }
    }
  }

  /deep/ .taskDetail_dialog1 {
    min-height: 100% !important;
    margin: 0 auto !important;
  }
  
.zhanwei{width: 100%; height: 60px;}
.inoutwidth{ width: 60%;}
.ibtnwidth{ width: 30%;}
//发票管理样式
.invoice_box{ width: 100%; margin: 0 auto;  display: flex;
    flex-wrap: wrap;}
.incoupt {
    width: 30%;
    height: 40px;
    line-height: 40px;
    display: flex;
    margin-top: 1%
  }

  .incoupt label {
    width: 100px;
    text-align: right;
    font-size: 14px;
    color: #606266;
  }

  .incoupt .el-input {
    width: 60%;
  }

  .incoupt .el-textarea{
    width: 60%;
  }
  .incoupt .el-select {
    width: 60%;
  }

  .incoupt .el-select .el-input {
    width: 100%;
  }
  .shtitle{ width: 100%; line-height: 35px; height: 35px; border-bottom: 1px solid #DCDFE6;}
  .inBoxs {
    width: 98.8%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    background-color: #fff;
    margin: 5px auto 0;
  }
  .pagingdevice {
    margin-top: 20px;
  }
  .red{color: red;}

</style>
