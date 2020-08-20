<template>
  <section class="dislogBox" :style="{
    padding: myStyle ? '20px 20px 0 20px' : '0'
  }">
    <div class="dislogBox_content" :style="{
      overflowY: myStyle ? 'visible':'auto'
    }">
    <!-- 一级头部 -->
      <div class="componentBoxs" id="componentBoxs">
        <ul class="cB_listTitle_felx">
            <li class="inspected">催款单号</li>
            <li class="taskno">mail</li>
            <li class="reportstatus">单位</li>
            <li class="expenses">应收总计</li>
            <li class="specification">打折总费用</li>
            <li class="samplename">试验费</li>
            <li class="tasktype">状态</li>
            <li class="time">回款</li>
            <li class="bornadult">生成人</li>
            <li class="status">操作</li>
        </ul>
        <!-- 一级头部 占位没有实际作用-->
        <ul class="cB_listTitle">
            <li class="inspected">催款单号</li>
            <li class="taskno">mail</li>
            <li class="reportstatus">单位</li>
            <li class="expenses">应收总计</li>
            <li class="specification">打折总费用</li>
            <li class="samplename">试验费</li>
            <li class="tasktype">状态</li>
            <li class="time">回款</li>
            <li class="bornadult">生成人</li>
            <li class="status">操作</li>
        </ul>
        <div v-for="(item,index) in dataList" :key="index" :style="{backgroundColor: index%2 ? '' : '#f5f5f5'}">
          <ul class="cB_listTitle">
              <li :title=item.code class="inspected">{{item.code}}</li>
              <li class="taskno">
                <el-input v-model="item.mail" size="mini"   class="inoutwidth"></el-input>
                <el-button type="primary" size="mini"  class="ibtnwidth" @click="sends(item)" >发送</el-button>
              </li>
              <li :title=item.companyCheck class="reportstatus">{{item.companyCheck}}</li>
              <li :title=item.account2 class="expenses">{{item.account2}}</li>
              <li :title=item.caccount2 class="specification">{{item.caccount2}}</li>
              <li :title=item.itemAccount2 class="samplename">{{item.itemAccount2}}</li>
              <li class="tasktype">
                {{item.aflag | capitaflag }}
              </li>
              <li :title=item.inAccount2  class="time">{{item.inAccount2 }}</li>
              <li :title=item.taskcreator class="bornadult">{{item.taskcreator}}</li>
              <li class="status">
                <span @click="browse(item)">浏览</span>
                <span @click="modifyamount(item)" v-if="item.directflag == 0" >修改金额</span>
                <span @click="getword(item)" v-if="item.directflag == 0" >WORD</span>
                <span @click="deletecur(item)">删除</span>
                <span @click="getxls(item)" v-if="item.directflag == 0" >XLS</span>
                <span @click="delxls(item)" v-if="item.directflag == 0" >删除XLS</span>
                <span @click="regeneratepdf(item)">重新生成PDF</span>
              </li>
          </ul>
          <!-- 二级列表 -->
          <div v-if="item.check">
            <div class="costlayout" id="costlayout">
            </div>
          </div>
        </div>
      </div>
      <!-- 分页器 -->
      <div class="zhanwei"></div>
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
        <!-- 首页显示的分页器 -->
        <!-- <el-pagination v-if="myStyles==true"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[5,7,11]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total=total>
        </el-pagination> -->
      </div>
      <el-dialog
        title="修改金额"
        :visible.sync="isko"
        width="99.9%"
        top = '0'
        :modal-append-to-body='false'
        :custom-class="'taskDetail_dialog1'"
        :before-close="efirmationClose">
          <collection :collectionletter=queryTdata >
          </collection>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="isko = false">取 消</el-button> -->
          <!-- <el-button type="primary" @click="okclose">确 定</el-button> -->
        </span>
      </el-dialog>




      <!-- 重新生产pdf -->
      <el-dialog
        title="重新生成pdf"
        :visible.sync="reproductions"
        width="40%"
        >
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="活动区域">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option
                v-for="item in regionList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="reproductions = false">取 消</el-button>
          <el-button type="primary" @click="reproductionsFn()">确 定</el-button>
        </span>
      </el-dialog>

      <!--下载word-pdf-查看调用对象-->
    <object id="WO3Word2" classid="clsid:561C5A99-71C8-48d4-A3E2-16FC4F9880BF"
            width="0" height="0" style="visibility:hidden;">
    </object>




    </div>

  </section>
</template>

<script>
  import base from '@/api/base.js'
  import collection from '@/views/finance/components/table3.vue'
  export default {
    name: 'mation',
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
        reproductions:false,// 重新生产pdf弹框
        form: {  //新生产pdf 字段
          region: '',
        },
        regionList:[],//新生产pdf,
        ratepdf:'',//当前点击的催款单id 
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
      browse(item){ //浏览二级表格 显示隐藏
        let id = item.ckid
        let data = []
        this.dataList.forEach((item, index) => {
            if(item.ckid == id){
              if(item.check == true){
                item.check = false
              }else{
                this.dataList.forEach((item, index) => {
                  item.check = false;
                });
                item.check = true
              }
              
            }
            data.push(item)
        });
        this.dataList = data
        this.browsedata(item)  
      },
      browsedata(item){  //浏览二级表格  渲染数据 
        let directflag = item.directflag;
        let ckid = item.ckid;
        this.$api.financial.getfindInCkdDetail(directflag,ckid).then(res => {
          
          var shtml="";
          var datas = res.data.data.list;
          var len =datas.length;
          shtml+="<table width=\"100%\"  align=center border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style='margin: 10px auto;'>";
          shtml+="<tr  style='background-color: #f3f6fd;'   height='35'>";
          shtml+="<td  align='center'>任务号</td>";
          shtml+="<td  align='center'>样品名称</td>";
          shtml+="<td  align='center'>型号</td>";
          shtml+="<td  align='center'>日期</td>";
          shtml+="<td  align='center'>名称</td>";
          shtml+="<td  align='center'>折后应收</td>";
          shtml+="<td  align='center'>实收</td>";
          shtml+="</tr>";
          
          for (var i=0;i<len;i++)
          {
            
            var fdata=datas[i];
            var fdatas=fdata.list;
            if (fdatas == null || fdatas.length<=0) 
            {
            //    alert("没有数据");
                continue;
            }
            shtml+="<tr style='height: 35px; border-bottom: 1px solid #EBEEF5; background-color: #f3f6fd;'>";
            shtml+="<td align='center' style='border-right: 1px solid #EBEEF5;' rowspan=\""+fdatas.length+"\">"+fdata.taskCode+"</td>";
            shtml+="<td align='center' style='border-right: 1px solid #EBEEF5;' rowspan=\""+fdatas.length+"\">"+fdata.samplename+"</td>";
            shtml+="<td align='center' style='border-right: 1px solid #EBEEF5;' rowspan=\""+fdatas.length+"\">"+fdata.sampletype+"</td>";
            shtml+="<td align='center' style='border-right: 1px solid #EBEEF5;'>"+fdatas[0].createdate+"</td>";
            shtml+="<td align='center' style='border-right: 1px solid #EBEEF5;'>"+fdatas[0].itemname+"</td>";
            shtml+="<td align='center' style='border-right: 1px solid #EBEEF5;'>"+fdatas[0].caccount+"</td>";
            shtml+="<td align='center' >"+fdatas[0].inaccount+"</td>";
            shtml+="</tr>";
            
            for (var j=1;j<fdatas.length;j++)
            {
                shtml+="<tr style='height: 35px; border-bottom: 1px solid #EBEEF5; background-color: #f3f6fd;'>";
                shtml+="<td align='center' style='border-right: 1px solid #EBEEF5;'>"+fdatas[j].createdate+"</td>";
                shtml+="<td align='center' style='border-right: 1px solid #EBEEF5;'>"+fdatas[j].itemname+"</td>";
                shtml+="<td align='center' style='border-right: 1px solid #EBEEF5;'>"+fdatas[j].caccount+"</td>";
                shtml+="<td align='center' >"+fdatas[j].inaccount+"</td>";
                shtml+="</tr>";
            }
            
          }
          shtml+="</table>";
           document.getElementById('costlayout').innerHTML=shtml;
          console.log(res)
        })
      },
      sends(item){ // 发送邮件
        let mail = item.mail;
        let ckid = item.ckid;
        this.$api.financial.getsendMail(mail,ckid).then(res => {
          console.log(res)
          this.$alert(res.data.data, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        }).catch((err)=>{
          this.$alert(err.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      efirmationClose(done){
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
            this.$parent.queryselect();
          })
          .catch(_ => {});
      },
      // okclose(){ //关闭 修改金额弹窗
      //   this.isko = false;
      //   this.$parent.queryselect();
      // },
      modifyamount(item){ //修改金额
        let ckid = item.ckid;
        window.sessionStorage.setItem('rzckid',ckid)
        this.$api.financial.getTaskIdByCkd(ckid).then(res => {
          if(res.data.ok == true){
            return res.data.data
          }
        }).then((data)=>{
          let dataiud={
            ckid:item.ckid,
            taskid:data,
            checkcompany:1
          }
          this.$api.financial.getUpdateMoney(dataiud).then(res => {
            console.log(res)
            this.isko = true;
            this.queryTdata = res
          })
        })
      },
      deletecur(item){ // 删除催款单
        let ckid = item.ckid;
        this.$confirm('您确定要删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$api.financial.getdeleteC(ckid).then(res => {
              if(res.data.ok == true){
                  this.$alert(res.data.data, '信息提示', {
                    dangerouslyUseHTMLString: true
                  });
              }
            }).then(()=>{
              this.$parent.queryselect();
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作',
              duration: 1500
            });
          });
      },
      delxls(item){ //删除xls
        let ckid = item.ckid;
        this.$confirm('您确定要删除xls吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$api.financial.getdelCKDXLS(ckid).then(res => {
                if(res.data.ok == true){
                    this.$alert(res.data.data, '信息提示', {
                      dangerouslyUseHTMLString: true
                    });
                }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作',
              duration: 1500
            });
          });
        
      },
      getxls(item){ //下载xls
       // window.open(`http://192.168.10.81:9998/api/cw/ckd/xls/${item.ckid}`);
        window.open(`${base.baseImgUrl}api/cw/ckd/xls/${item.ckid}`);
      },
      getword(item){//下载word
        var obj = document.getElementById("WO3Word2");
        obj.setRemoteIp(base.baseImgTable);
		    obj.ckdstart(item.ckid);
        //window.open(`${base.baseImgUrl}api/cw/ckd/docx/${item.ckid}`);
      },
      
      regeneratepdf(item){//重新生成pdf
        this.ratepdf = item.ckid
        this.reproductions = true;
        this.regionList = [];
         this.$api.financial.dicCodepdf('cw-paynotice').then(res => {
           console.log(res)
           let data = res.data.data
           data.forEach(item => {
            let obj = {label:item.dicTypeName,value:item.dicTypeCode}
            this.regionList.push(obj)
           });
         }).catch(err =>{
            this.$alert(err.data.message, '信息提示', {
                  dangerouslyUseHTMLString: true
            });
         })
      },
      reproductionsFn(){ //重新生成pdf
        console.log(this.ratepdf)
        this.$api.financial.createckdbyyhx(this.ratepdf,this.form.region).then(res => {
          if(res.data.respCode == '0'){
            this.$alert(res.data.data, '信息提示', {
                  dangerouslyUseHTMLString: true
            });
          }
          this.reproductions = false;
        }).catch((err)=>{
          this.$alert(err.data.message, '信息提示', {
                  dangerouslyUseHTMLString: true
            });
        })
      }
    },
    filters: {
      capitaflag (value) {
        switch (value) {
          case 0:
            return '未回款'
            break;
          case 1:
            return '回款中'
            break;
          case 2:
            return '已结算'
            break;
          default:
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
      let t1 = document.getElementById('componentBoxs')
      let t2 = document.querySelector('.cB_listTitle_felx')
      console.log(t1.offsetWidth)
      t2.style.width = t1.offsetWidth + 'px';
      t2.style.paddingRight = '16px'
    },
    props: [
      'querydataChild', 'mypagesize', 'myStyle'
    ],
    components: {
      collection
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
  .status span{
    color: rgb(50, 175, 240);
    margin-right: 6px;
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

  .cB_listTitle_felx{
    width: 100%;
    background-color: rgb(243, 246, 253);
    height: auto;
    position: fixed;
    border-top: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    margin-bottom: 0;
    z-index: 10;
  }

  .cB_listTitle_felx li {
    line-height: 3vw;
    box-sizing: border-box;
    border-right: 1px solid #EBEEF5;
    list-style: none;
    text-align: center;
    color: #909399;
    float: left;
  }

  .cB_listTitle {
    width: 100%;
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

.costlayout{ width: 98%; height: auto; overflow: hidden; margin: 0 auto;}
.costlayout ul li{ text-align: center; height: 35px; line-height: 35px; border: 1px solid #DCDFE6; float: left; width: 11%;}


</style>
