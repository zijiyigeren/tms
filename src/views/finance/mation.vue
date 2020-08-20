<template>
  <section class="dislogBox" :style="{
    padding: myStyle ? '20px 20px 0 20px' : '0'
  }">
    <div class="dislogBox_content" :style="{
      overflowY: myStyle ? 'visible':'auto'
    }">
      <!-- 一级头部 -->
      <div class="componentBoxs"  id="componentBoxs">
        <ul class="cB_listTitle_felx" >
            <li class="inspected"><input type="checkbox" value=""  v-model="falgAll" @change="checkoutAll()">受检单位</li>
            <li class="taskno">任务号</li>
            <li class="reportstatus">报告状态</li>
            <li class="expenses">费用</li>
            <li class="specification">样品规格号</li>
            <li class="samplename">样品名称</li>
            <li class="tasktype">任务类型</li>
            <li class="time">时间</li>
            <li class="status">状态</li>
        </ul>
        <!-- 一级头部  占位没有实际作用-->
        <ul class="cB_listTitle">
            <li class="inspected"><input type="checkbox" value="">受检单位</li>
            <li class="taskno">任务号</li>
            <li class="reportstatus">报告状态</li>
            <li class="expenses">费用</li>
            <li class="specification">样品规格号</li>
            <li class="samplename">样品名称</li>
            <li class="tasktype">任务类型</li>
            <li class="time">时间</li>
            <li class="status">状态</li>
        </ul>
        <!-- 一级列表 -->
        <div class="costlayout" >
          <ul ref="costlayout"></ul>
        </div>
        <!-- 暂无数据 -->
        
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
    </div>


    <el-dialog
      title="费用详细"
      :visible.sync="expenseconfirmation"
      width="99.9%"
      top = '0'
      :custom-class="'taskDetail_dialog1'"
      :before-close="efirmationClose">
        <tableconfirmation :collectionletter=queryletter @updatea = updatafat></tableconfirmation>
      <span slot="footer" class="dialog-footer">
        <el-button @click="expenseconfirmation = false">取 消</el-button>
        <el-button type="primary" @click="expenok">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog
      title="费用确认"
      :visible.sync="isko"
      width="99.9%"
      top = '0'
      :modal-append-to-body='false'
      :custom-class="'taskDetail_dialog1'"
      :before-close="efirmationClose">
        <tablesisuan 
          :queryT=queryTdata 
          :isshowV = isshow 

          >
        </tablesisuan>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="isko = false">取 消</el-button> -->
        <el-button type="primary" @click="iskoGFn">确 定</el-button>
      </span>
    </el-dialog>

  </section>
</template>

<script>
  import base from '@/api/base.js'
  import tableconfirmation from '@/views/finance/components/table.vue'
  import tablesisuan from '@/views/finance/components/table2.vue'
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
        falgAll:false,//总 全选
        winitemcheckAll : window.itemcheckAll = (item,data)=>{
          let checkboxs = document.getElementsByTagName('input')
          for(let i=0; i<checkboxs.length; i++){
              if(checkboxs[i].type == 'checkbox'&& checkboxs[i].getAttribute('data-cost') == 'cost'){
                if(checkboxs[i].name == item.name){
                  checkboxs[i].checked = item.checked
                }
              }
          }
        },
        expenseconfirmation:false,//费用详细
        isko:false,//费用确认
        //'5084CB0A4A75414C98271AEEA30A24BA','K','2019'
        tisokData:null,
        wingoT : window.goT = (taskid,orgabc,partitiondate)=>{ //点击T弹出的编辑类型的费用确认弹窗
          this.$confirm("确认要替"+orgabc+" 确认费用吗?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              "orgabc": orgabc,  //科室代码
              "taskid": taskid,  //任务id
              "partitiondate": Number(partitiondate),  //年份
            }
            window.sessionStorage.setItem('taskidOrgabc',JSON.stringify(data))
            //"partitiondate": Number(window.sessionStorage.getItem('year')),  //年份
            this.$api.financial.lxtfinancialok(data).then(res => {
              let data = res
              self.queryTdata = data
              self.isshow = true
             // document.body.innerHTML = JSON.stringify(res)
            }).then(()=>{
              this.isko = true;
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });          
          });
            
        },
        wingofback : window.gofback = (taskid,orgabc) =>{
          this.$confirm("确认要回退"+orgabc+"吗?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              "orgabc": orgabc,  //科室代码
              "taskid": taskid,  //任务id
            }
            this.$api.financial.lxtgoBack(data).then(res => {
                this.$message({
                  type: 'success',
                  message: res.data.data
                });     
                self.$parent.queryselect();  
            }).catch(err =>{
                this.$message({
                  type: 'info',
                  message: err.data.data
                });   
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });          
          });

        },
        winconfigAccount : window.configAccount = (id) =>{
          self.getubder(id);
          window.sessionStorage.setItem('task_fractureId',id)
        },
        wingoT2 : window.goT2= (taskid,orgabc,partitiondate)=>{ //点击V弹出的展示类型的费用确认弹窗
            let data = {
              "orgabc": orgabc,  //科室代码
              "taskid": taskid,  //任务id
              "partitiondate": Number(partitiondate),  //年份
            }
            window.sessionStorage.setItem('taskidOrgabc',JSON.stringify(data))
            //"partitiondate": Number(window.sessionStorage.getItem('year')),  //年份
            this.$api.financial.lxtfinancialok(data).then(res => {
              let data = res
              self.queryTdata = data
              self.isshow = false
            // document.body.innerHTML = JSON.stringify(res)
            }).then(()=>{
              this.isko = true;
            })
        },
        queryTdata:null,//给子组件传值 费用确认
        queryletter:null,//给子组件传值  费用明细or催款单
        isshow:true,//判断确认T页面的功能性按钮是否存在
      }
    },
    methods: {
      dataListData () {//一级列表展示数据
        this.dataList = this.querydataChild;
        this.dynamicTable();
        console.log(this.dataList)
        if(this.querydataChild.length == 0){
          this.total = 0
        }else{
          this.total = this.querydataChild[0].total
        }
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
      dynamicTable(){ //动态生产表格
        this.$refs.costlayout.innerHTML = '';
        let dome = this.$refs.costlayout;
        let data = this.dataList;
        this.setDynamicTable(dome,data) //将数据穿入js中处理
      },
      setDynamicTable(table,data){
        let listData = data;
        let _h = 35;
        for(var i=0; i<listData.length; i++){  //一级
          var _oneli = document.createElement('li');
          _oneli.style.height = "auto"
          _oneli.style.overflow = "hidden"
          var _onespan = document.createElement('span');
          _onespan.innerHTML = `<input type="checkbox" name="${i}" value=""  data-cost="cost" onchange="itemcheckAll(this,'${i}')">${listData[i].companyCheck}`
          _onespan.style.float = 'left';
          _onespan.style.display = 'block';
          _onespan.style.width = '10%';
          _onespan.style.border = '1px solid #DCDFE6';
          _onespan.style.textAlign = 'center'
          _onespan.style.whiteSpace = 'nowrap';
          _onespan.style.textOverflow = 'ellipsis';
          _onespan.style.overflow = 'hidden';
          _onespan.style.wordBreak = 'break-all';
          _onespan.title = listData[i].companyCheck;
          _onespan.style.height = listData[i].list.length * _h +'px';
          _onespan.style.lineHeight = listData[i].list.length * _h +'px';
            var _fowul = document.createElement('ul');//二级
            var _fowli = document.createElement('li');//二级
            var _lul = document.createElement('ul'); //二级
            var _fowul2 = document.createElement('ul');//二级
            var _fowli2 = document.createElement('li');//二级
            var _lul2 = document.createElement('ul'); //二级
            var _fowul3 = document.createElement('ul');//二级
            var _fowli3 = document.createElement('li');//二级
            var _lul3 = document.createElement('ul'); //二级
            var _fowul4 = document.createElement('ul');//二级
            var _fowli4 = document.createElement('li');//二级
            var _lul4 = document.createElement('ul'); //二级
            var _fowul5 = document.createElement('ul');//二级
            var _fowli5 = document.createElement('li');//二级
            var _lul5 = document.createElement('ul'); //二级
            var _fowul6 = document.createElement('ul');//二级
            var _fowli6 = document.createElement('li');//二级
            var _lul6 = document.createElement('ul'); //二级
            var _fowul7 = document.createElement('ul');//二级
            var _fowli7 = document.createElement('li');//二级
            var _lul7 = document.createElement('ul'); //二级
            var _fowul8 = document.createElement('ul');//二级
            var _fowli8 = document.createElement('li');//二级
            var _lul8 = document.createElement('ul'); //二级
            for(var t=0; t<listData[i].list.length; t++){
                var centom = listData[i].list[t].taskCode
                this.copySpan(_fowul,centom,_lul,_h,'10%',true)
                var centom = listData[i].list[t].processstatus
                if(centom == 0){
                  centom = "报告处理中"
                }
                if(centom == 1){
                  centom = "报告完成"
                }
                this.copySpan(_fowul2,centom,_lul2,_h,'5%',true)
                var centom = listData[i].list[t].charges 
                this.copySpan(_fowul3,centom,_lul3,_h,'6%',true)
                var centom = listData[i].list[t].sampleType
                this.copySpan(_fowul4,centom,_lul4,_h,'15%',true)
                var centom = listData[i].list[t].sampleName
                this.copySpan(_fowul5,centom,_lul5,_h,'14%',true)
                var centom = listData[i].list[t].checkTypeID
                this.copySpan(_fowul6,centom,_lul6,_h,'10%',true)
                var centom = listData[i].list[t].createdate
                this.copySpan(_fowul7,centom,_lul7,_h,'5%',true)
                if(listData[i].list[t].flowStatus == 1){
                  var centom = `<input type="checkbox" name="${i}" value="${listData[i].list[t].id}" data-cost="cost" > 
                  <a href=\"javascript:configAccount('${listData[i].list[t].id}');\">费用详细</a>`
                }else{
                  var centom = `${listData[i].list[t].principal}`
                }
                this.copySpan(_fowul8,centom,_lul8,_h,'25%',false)

            }
            _fowli.appendChild(_lul);
            _fowul.appendChild(_fowli);
            _fowli2.appendChild(_lul2);
            _fowul2.appendChild(_fowli2);
            _fowli3.appendChild(_lul3);
            _fowul3.appendChild(_fowli3);
            _fowli4.appendChild(_lul4);
            _fowul4.appendChild(_fowli4);
            _fowli5.appendChild(_lul5);
            _fowul5.appendChild(_fowli5);
            _fowli6.appendChild(_lul6);
            _fowul6.appendChild(_fowli6);
            _fowli7.appendChild(_lul7);
            _fowul7.appendChild(_fowli7);
            _fowli8.appendChild(_lul8);
            _fowul8.appendChild(_fowli8);
          _oneli.appendChild(_onespan);
          _oneli.appendChild(_fowul);//二级
          _oneli.appendChild(_fowul2);//二级
          _oneli.appendChild(_fowul3);//二级
          _oneli.appendChild(_fowul4);//二级
          _oneli.appendChild(_fowul5);//二级
          _oneli.appendChild(_fowul6);//二级
          _oneli.appendChild(_fowul7);//二级
          _oneli.appendChild(_fowul8);//二级
         this.$refs.costlayout.appendChild(_oneli)
        }
        this.scrollHeight();
      },
      copySpan(_fowul,centom,_lul,_h,w,isfalg,idend,t){
        _fowul.style.float = 'left'
        _fowul.style.width = w;
        var _lli = document.createElement('li');
        _lli.style.border = '1px solid #DCDFE6';
        _lli.style.height = _h+'px';
        _lli.style.lineHeight = 35+'px';
        _lli.style.textAlign = 'center';
        _lli.style.whiteSpace = 'nowrap';
        _lli.style.textOverflow = 'ellipsis';
        _lli.style.overflow = 'hidden';
        _lli.style.wordBreak = 'break-all';
        var _fowspan = document.createElement('span');
       
        _fowspan.innerHTML = centom;
        if(isfalg){
          _fowspan.title = centom;
        }
       
        //window.sessionStorage.setItem('authentication',centom)
        _lli.appendChild(_fowspan)
        _lul.appendChild(_lli)
      },
      checkoutAll(){ //总全选
        let checkboxs = document.getElementsByTagName('input')
        for(let i=0; i<checkboxs.length; i++){
            if(checkboxs[i].type == 'checkbox' && checkboxs[i].getAttribute('data-cost') == 'cost'){
              checkboxs[i].checked = this.falgAll
            }
        };
       
      },
      reminderFn(){//生成催款单
        let ids="";
        let checkboxs = document.getElementsByTagName('input')
        for(let i=0; i<checkboxs.length; i++){
            if(checkboxs[i].type == 'checkbox' && checkboxs[i].getAttribute('data-cost') == 'cost' && checkboxs[i].checked == true && checkboxs[i].value != '' && checkboxs[i].value != null && checkboxs[i].value != undefined){
              ids+=checkboxs[i].value+",";
            }   
        };
        ids = ids.substring(0,ids.length-1);
        window.sessionStorage.setItem('task_fractureId',ids)
        if(ids.length <= 0){
          this.$alert('未选择检验项目', '信息提示', { dangerouslyUseHTMLString: true });
        }else{
          this.getubder(ids)
        }
      },
      getubder(ids){//生成催款单接口
        this.$api.financial.getverification(ids).then((res)=>{
          if(res.data.data == "OK"){
            return res.data.data
          }
        }).then((res)=>{
          this.$api.financial.getdetail(ids).then((res)=>{
            if(res.data.ok == true){
              return res
            }
          }).then((res)=>{
            this.queryletter = res;
            console.log(res)
            this.expenseconfirmation = true
          }).catch((err)=>{
            this.$alert(err.data.message, '信息提示', { dangerouslyUseHTMLString: true });
          })
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
          })
          .catch(_ => {});
      },
      closeDigrestData(data){ // 确认费用保存成功并且提交下一步的时候，需要关闭子窗口，并且调取父级方法更新列表数据
        this.isko = false;
        this.$emit('cpage', this.currentPage);
        this.$nextTick(res => {
          this.$parent.queryselect(false)
        })
      },
      expenok(){ //费用确认点击后刷新列表数据
        this.$parent.queryselect(false)
        this.expenseconfirmation = false;
      },
      updatafat(val){ //接收子组件回传的值
        this.queryletter = val
      },
      scrollHeight(){
        let t1 = document.getElementById('componentBoxs')
        let t2 = document.querySelector('.cB_listTitle_felx')
        let t3 = document.getElementById('costlayout')
        t2.style.width = t1.offsetWidth + 'px';
        if ((t3.scrollHeight > t3.clientHeight) || (t3.offsetHeight > t3.clientHeight)) {
          t2.style.paddingRight = '18px';
        }
      },
      iskoGFn(){
        this.isko = false;
        this.$parent.queryselect(false)
      }
    },
    watch: {
      querydataChild (val) {
        this.dataListData()
      },
      
      myStyle (value) {
        this.myStyle = value
      },
    },
    mounted () {
      
    },
    props: [
      'querydataChild', 'mypagesize', 'myStyle'
    ],
    components: {
      tableconfirmation,
      tablesisuan
    }
  }
</script>
<style lang="scss" scoped>
  /* 自定义表格列width */
  .inspected{
    width: 10%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .taskno {
    width: 10%;
    padding-right: 1%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .reportstatus {
    width: 5%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .expenses {
    width: 6%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .specification {
    width: 15%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .samplename {
    width: 14%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tasktype {
    width: 10%;
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

  .status {
    width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .status span{
    color: rgb(50, 175, 240);
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
    border-right: 1px solid rgb(220, 223, 230);
   
    list-style: none;
    text-align: center;
    color: #909399;
    float: left;
  }
  .cB_listTitle_felx li:last-child{
    // border-right: none;
  }
  .cB_listTitle_felx li:nth-child(1){
    border-left: none;
  }


  /deep/ .taskDetail_dialog1 {
    min-height: 100% !important;
    margin: 0 auto !important;
  }
.zhanwei{width: 100%; height: 60px;}
</style>
