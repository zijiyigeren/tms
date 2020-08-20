<template>
 <section>
   <div class="expense" >
      
      <div class="incoupt">
        <label>任务号：</label>
        <el-input placeholder="请输入内容" v-model="tasknumber"  size="small" clearable name="clearInputValue" disabled></el-input>
      </div>
      <div class="incoupt">
        <label>受检单位：</label>
        <el-input placeholder="请输入内容" v-model="examination"  size="small" clearable name="clearInputValue" disabled></el-input>
      </div>
      <div class="incoupt">
        <label>样品名称：</label>
        <el-input placeholder="请输入内容" v-model="samplename" clearable  size="small" name="clearInputValue" disabled></el-input>
      </div>
      <div class="incoupt">
        <label>型号：</label>
        <el-input placeholder="请输入内容" v-model="model" clearable  size="small" name="clearInputValue" disabled></el-input>
      </div>
   </div>
    <div class="lxt_selsctBtn">
      <span  v-if = isshowV>
        <el-button type="primary" class="bespoke" @click="cccexperiment" v-if="isauthentication()">ccc试验</el-button>
      </span>
      <el-button type="primary" class="bespoke" @click="storageexpenses" v-if = isshowV>保存费用</el-button>
      <el-button type="primary" class="bespoke" @click="submitnextstep" v-if = isshowV >提交下一步</el-button>
      费用总计：{{totalmoney}}
    </div>
    <div v-if = isshowV>
     第一步:&nbsp;<font color=red>标准试验费用,辅助费用确认{{authentication}}</font><br/>
     第二步:&nbsp;<font color=green>提交到下一确认人</font><br/><br/>
    </div>
     <div class="costlayout">
        <ul>
          <li>检验依据</li>
          <li>项目代码</li>
          <li><input type="checkbox" name="box" value=""  v-model="falgAll" @change="checkAll()" />试验项目</li>
          <li :style="{ width: isauthentication() ? '11%' : '12.4%'}">费用名称</li>
          <li :style="{ width: isauthentication() ? '11%' : '12.4%'}">试验次数</li>
          <!-- <li style="width:0;">CCC试验次数</li> -->
          <li v-show="isauthentication()">CCC试验次数</li>
          <li :style="{ width: isauthentication() ? '11%' : '12.4%'}">费用</li>
          <li :style="{ width: isauthentication() ? '11%' : '12.4%'}">实际次数</li>
          <li :style="{ width: isauthentication() ? '11%' : '12.4%'}">收费小计</li>
        </ul>
      </div>

      <div class="costlayout" >
        <ul ref="costlayout"></ul>
      </div>

    <el-dialog
      title="试验选择"
      :visible.sync="cccdialog"
      width="80%"
      :modal='false'
      :before-close="cccClose">

      <div class="cccbox">
        <div class="ccccondition">
          <div class="incoupt">
            <label>生产厂家：</label>
            <el-input placeholder="请输入内容" size="small" v-model="manufacturer"  name="clearInputValue" ></el-input>
          </div>
          <div class="incoupt">
            <label>样品规格号：</label>
            <el-input placeholder="请输入内容"   size="small"  v-model="specification" name="clearInputValue" ></el-input>
          </div>
          <el-button type="primary" class="bespoke topquery" @click="cccexperiment">查询</el-button>
        </div>
        <div class="ccctable">
          <ul>
            <li>
              <span>任务号</span>
              <span>费用</span>
              <span>样品规格号</span>
              <span>样品名称</span>
              <span>任务类型</span>
              <span>时间</span>
            </li>
            <li v-for="(item,index) in cccBox" :key="index">
              
                <span :title="item.taskcode"><el-checkbox v-model="cccBox.checkcur"></el-checkbox>&nbsp;{{item.taskcode}}</span>
                <span>{{item.account}}</span>
                <span>{{item.sampleType}}</span>
                <span>{{item.sampleName}}</span>
                <span>CCC试验</span>
                <span>{{item.createDate}}</span>
            </li>
          </ul>
        </div>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5,10,20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total=total>
        </el-pagination>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cccdialog = false">取 消</el-button>
        <el-button type="primary" @click="radiochoice">确 定</el-button>
      </span>
    </el-dialog>




 </section>
</template>

<script>
  import base from '@/api/base.js'
  function numMulti(num1, num2) {  //费用精度计算
      let baseNum = 0;
      try {
          baseNum += num1.toString().split(".")[1].length;
      } catch (e) {
      }
      try {
          baseNum += num2.toString().split(".")[1].length;
      } catch (e) {
      }
      return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
  }
  export default {
    name: 'tabel',
    data () {
      let self = this;
      
      return {
        tasknumber:'', //任务号：
        examination:'',//受检单位：
        samplename:'',//样品名称：
        model:'',//型号：
        totalmoney:'',//合计
        falgAll:true,//全选
         // ceshi
        dynamicTableData: {},
        myLiClick : window.myClickAdd = (item)=>{
          this.doClick();// select 下拉框 隐藏
          let _span = item.getElementsByTagName('span')[0];
          let _input = item.getElementsByTagName('input')[0];
          _span.style.display = 'none';
          _input.style.display = 'block';
          _input.focus();
          _input.onfocus = m();
          function m(){
            _input.value = _span.innerHTML
          };
          _input.onblur = calculation;
          document.onkeydown = function (e) { // 回车提交表单
          // 兼容FF和IE和Opera
              var theEvent = window.event || e;
              var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
              if (code == 13) {
                  calculation();
              }
          }
          function calculation(){
            let _m,_c,_t,_g,_p;
            _span.innerHTML = _input.value
            _span.style.display = 'block';
            _input.style.display = 'none';
            let cspan = document.getElementsByTagName('span')
            for(let i=0; i<cspan.length; i++){
                if(cspan[i].getAttribute("data-id") ==_span.getAttribute("data-id")){
                    if(cspan[i].getAttribute("data-field") == 'gg'){  //试验次数
                        _g = cspan[i].innerHTML;
                    }
                    if(cspan[i].getAttribute("data-field") == 'p'){  //CCC试验次数
                      _p = cspan[i].innerHTML;
                    }
                    if(cspan[i].getAttribute("data-field") == 'm'){  //费用
                        _m = cspan[i].innerHTML;
                    }
                    if(cspan[i].getAttribute("data-field") == 'c'){  //实际次数
                      if(_g<_p){   //如果试验次数小于CCC试验次数 那么实际次数为0
                        cspan[i].innerHTML = 0
                        _c =  0 // 实际次数 
                      }else{
                        cspan[i].innerHTML = _g - _p
                        _c =  _g - _p  //  实际次数 = 试验次数 -  CCC试验次数
                      }
                    }
                    if(cspan[i].getAttribute("data-field") == 't'){  //收费小计
                       cspan[i].innerHTML =numMulti(_m, _c) ;
                       self.totalexpenses() //算合计
                    }
                }
            }
          };
           window.event? window.event.cancelBubble = true : e.stopPropagation();
        },
        myselect : window.myClickselect = (item) =>{
          let _span = item.getElementsByTagName('span')[0];
          let _select = item.getElementsByTagName('select')[0];
          _span.style.display = 'none';
          _select.style.display = 'block';
          _select.onchange = function(){
            var index=_select.selectedIndex;//获取被选中的option的索引
            var textsel= _select.options[index].text;//获取相应的option的内容
            _span.id = _select.value;
            _span.innerHTML = textsel;
            _span.title = textsel;
            _span.style.display = 'block';
            _select.style.display = 'none';
          }
          window.event? window.event.cancelBubble = true : e.stopPropagation();
        },
        cccdialog:false, //ccc实验弹窗
        cccBox:[],// //ccc实验数据
        manufacturer:'',//生产厂家
        specification:'', //样品规格号
        total: 0,//ccc 实验总条数
        currentPage: 1, // 当前页数  分页
        pageSize: 5,   //每页显示条数 分页
        authentication:true,//判断是否显示ccc实验按钮和表格列
      }
    },
    methods: {
      isauthentication(){
        //后期修改 
        return this.authentication == '公告产品'? true : false;
      },
      dynamicTable(){ //动态生成表格
        this.dynamicTableData = {};
        this.$refs.costlayout.innerHTML = '';
        let dome = this.$refs.costlayout;
        // let data = this.dynamicTableData;
        this.dynamicTableData = this.queryT.data.data.fi
        let data = this.dynamicTableData
        this.setDynamicTable(dome,data) //将数据穿入js中处理
        
      },
      setDynamicTable(table,data){
        let listData = data;
        let _h = 35
        let itale = 0
        
        for(var i=0; i<listData.list.length; i++){  //一级
          itale ++;
         
          var _oneli = document.createElement('li');
          _oneli.style.height = "auto"
          _oneli.style.overflow = "hidden"
          this.cellsapn(listData.list[i].itemsBasis,_oneli,listData.list[i].ilist.length,_h)  //检验依据
          this.cellsapn(listData.list[i].dectorConfirmStatus,_oneli,listData.list[i].ilist.length,_h)//项目代码
          this.cellsapn(listData.list[i].itemname,_oneli,listData.list[i].ilist.length,_h,true,listData.list[i].id)//试验项目


          var _towul = document.createElement('ul');//二级 费用名称
          var _towli = document.createElement('li');//二级 费用名称
          var dm = {
              dop : listData.list[i].id,  ////试验项目id
            }
          this.copyspan(dm,listData.list[i].ilist,_towul,_towli,'name',_h,2,'fy',i,true) //费用名称

          var _towul1 = document.createElement('ul');//二级 公告试验次数
          var _towli1 = document.createElement('li');//二级 公告试验次数
          this.copyspan(dm,listData.list[i].ilist,_towul1,_towli1,'testTimes',_h,1,'gg',i,true) //公告试验次数
          
          var _towul2 = document.createElement('ul');//二级 CCC试验次数
          var _towli2 = document.createElement('li');//二级 CCC试验次数

          this.copyspan(dm,listData.list[i].ilist,_towul2,_towli2,'cccTestTimes',_h,'','p',i,this.isauthentication()) //CCC试验次数

          var _towul3 = document.createElement('ul');//二级 费用
          var _towli3 = document.createElement('li');//二级 费用
          this.copyspan(dm,listData.list[i].ilist,_towul3,_towli3,'ycharges',_h,1,'m',i,true) //费用

          var _towul4 = document.createElement('ul');//二级 次数
          var _towli4 = document.createElement('li');//二级 次数
          
          this.copyspan(dm,listData.list[i].ilist,_towul4,_towli4,'times',_h,'','c',i,true) //次数

          var _towul5 = document.createElement('ul');//二级 次数
          var _towli5 = document.createElement('li');//二级 次数
          this.copyspan(dm,listData.list[i].ilist,_towul5,_towli5,'yaccount',_h,'','t',i,true) //收费小计


            _towul.appendChild(_towli)//二级
            _oneli.appendChild(_towul);//二级

            _towul1.appendChild(_towli1)//二级
            _oneli.appendChild(_towul1);//二级

            _towul2.appendChild(_towli2)//二级
            _oneli.appendChild(_towul2);//二级

            _towul3.appendChild(_towli3)//二级
            _oneli.appendChild(_towul3);//二级

            _towul4.appendChild(_towli4)//二级
            _oneli.appendChild(_towul4);//二级

            _towul5.appendChild(_towli5)//二级
            _oneli.appendChild(_towul5);//二级

         this.$refs.costlayout.appendChild(_oneli)
        }
        if(itale == listData.list.length){
          this.totalexpenses(); //循环结束，调用此方法  算合计
        }
      },
      // var centom = listData.list[i].list[t].list[m].ilist[f].account  //公告试验次数
      //this.copySpan(_fowul5,centom,_lul5,_h,false,'')
      //生成合并行函数
      cellsapn(v,_oneli,times,_h,isfalg,id){  //需要合并行的公共函数
          var _onespan = document.createElement('span');
            if(isfalg){
             _onespan.innerHTML = '<input type="checkbox" name="itembox"  data-name="jc"  value="'+id+'" checked=true/><span id="'+id+'"></span>'+v
            // '<s:property value="id"/>','<s:property value="itemcode"/>'
            }else{
             _onespan.innerHTML = v;
            }
          _onespan.title = v;
          _onespan.style.float = 'left';
          _onespan.style.display = 'block';
          _onespan.style.width = '11%';
          _onespan.style.border = '1px solid #DCDFE6';
          _onespan.style.textAlign = 'center';
          _onespan.style.whiteSpace = 'nowrap';
          _onespan.style.textOverflow = 'ellipsis';
          _onespan.style.overflow = 'hidden';
          _onespan.style.wordBreak = 'break-all';
          _onespan.style.height = times * _h +'px';
          _onespan.style.lineHeight = times * _h +'px';
          _oneli.appendChild(_onespan);
      },
      /*
       * @dm  试验项目id
       * @list  表格每一条的数据
       * @_towul  创建的 ul
       * @_towli   创建的 li
       * @netconne  创建的名称
       * @_h  表格的高度
       * @isinptu     判断是佛是费用名称
       * @field  给每一个单元格一个特殊的标识
       * @i    当前的元素索引
       * @iscccFale   是否是ccc字段
      */
      copyspan(dm,list,_towul,_towli,netconne,_h,isinptu,field,i,iscccFale){ //不需要合并行的公共方法
         for(var t=0; t<list.length; t++){  //二级
            if(iscccFale){
              if(this.isauthentication()){
                 _towul.style.width = '11%';
              }else{
                 _towul.style.width = '12.4%';
              }
            }else{
               _towul.style.width = '0%';
               _towul.style.overflow = "hidden";
            }

             
              _towul.style.float = 'left'
             
              var _towul_ul =document.createElement('ul');
              var _towli_li = document.createElement('li');
              _towli_li.style.height =  _h +'px';
              _towli_li.style.lineHeight = _h +'px';
              _towli_li.style.textAlign = 'center';
              _towli_li.style.whiteSpace = 'nowrap';
              _towli_li.style.textOverflow = 'ellipsis';
              _towli_li.style.overflow = 'hidden';
              _towli_li.style.wordBreak = 'break-all';
              _towli_li.style.border = '1px solid #DCDFE6';
              _towli_li.title = list[t][netconne];
              var _towspan = document.createElement('span');
              _towspan.innerHTML = list[t][netconne];
              _towspan.setAttribute('data-field', field);
              _towspan.setAttribute('data-id', i+t);
              _towspan.setAttribute('data-detailid', list[t].id);
              _towspan.setAttribute('data-itype', list[t].itype);
              _towspan.setAttribute('data-dop', dm.dop);
              _towspan.setAttribute('data-mop', t);
              if(isinptu == 2){
                if(t==0){
                  _towli_li.setAttribute('onclick', 'myClickselect(this)');
                  var select = document.createElement('select');
                  var chargeList = this.dynamicTableData.list[i].chargeList
                  for(var m=0; m<chargeList.length; m++){
                      select.add(new Option(chargeList[m].name,chargeList[m].id)); 
                  }
                  select.style.width = '90%';
                  select.style.height = _h-5+'px';
                  select.style.display = "none";
                  _towspan.id = chargeList[0].id;
                
                  _towli_li.appendChild(select)

                }else{
                  _towli_li.setAttribute('onclick', 'myClickAdd(this)');
                  var _fowinput = document.createElement('input');
                  _fowinput.style.width = '90%';
                  _fowinput.style.height = _h-5+'px';
                  _fowinput.style.display = "none"
                  _fowinput.value = '';
                  _fowinput.autofocus="autofocus"
                  _towli_li.appendChild(_fowinput)
                }
              }

              if(isinptu == 1){
                _towli_li.setAttribute('onclick', 'myClickAdd(this)');
                var _fowinput = document.createElement('input');
                _fowinput.style.width = '90%';
                _fowinput.style.height = _h-5+'px';
                _fowinput.style.display = "none"
                _fowinput.value = '';
                _fowinput.autofocus="autofocus"
                _towli_li.appendChild(_fowinput)
              }
              _towli_li.appendChild(_towspan);
              _towul_ul.appendChild(_towli_li);
              _towli.appendChild(_towul_ul)
             
         }
      },
  
      totalexpenses(){//计算合计
        let close = 0;
        let cspan = document.getElementsByTagName('span')
        for(let i=0; i<cspan.length; i++){
           if(cspan[i].getAttribute("data-field") == 't'){  //收费小计
                close += Number(cspan[i].innerHTML) //精度计算
            }
        }
        this.totalmoney = close
      },
      checkAll(){//全选 
        let checkboxs = document.getElementsByTagName('input')
        for(let i=0; i<checkboxs.length; i++){
            if(checkboxs[i].type == 'checkbox' && checkboxs[i].getAttribute('data-name') == 'jc'){
              checkboxs[i].checked = this.falgAll
            }
        };
      },
      storageexpenses(){//保存费用
        let ids =[]; //存储所有选中的实验项目id
        let m =[]; //存储选中实验项目下的所有费用
        let c =[];//存储选中实验项目下的所有次数
        let t =[];//存储选中实验项目下的所有收费小计
        let detailid = []; //ilst下每一个对象的id
        let itype = []; //ilst下每一个对象的itype
        let fname = [];//存储选中实验项目下的所有费用名称
        let arr = []; //存储遍历完成的数据  存储一条 
        let s =[]; // 存储选中实验项目下的所有实验次数
        let ccc =[]; // 存储选中实验项目下的所有ccc实验次数
        let arrs = []; //存储遍历完成的数据  存储所有 
        let checkboxs = document.getElementsByTagName('input')
        let idSpan = document.getElementsByTagName('span')
        for(let i=0; i<checkboxs.length; i++){
            if(checkboxs[i].type == 'checkbox' && checkboxs[i].checked == true && checkboxs[i].getAttribute('data-name') == 'jc'){
              ids.push(checkboxs[i].value)  //选中的实验项目id
              m =[]; //存储选中实验项目下的所有费用
              c =[];//存储选中实验项目下的所有次数
              t =[];//存储选中实验项目下的所有收费小计
              detailid = []; //ilst下每一个对象的id
              itype = []; //ilst下每一个对象的itype
              fname = [];//存储选中实验项目下的所有费用名称
              arr = []; //存储遍历完成的数据  存储一条 
              s =[]; // 存储选中实验项目下的所有实验次数
              ccc =[]; // 存储选中实验项目下的所有ccc实验次数
             for(let h=0; h<idSpan.length; h++){
                if(idSpan[h].getAttribute('data-dop') == checkboxs[i].value){
                    if(idSpan[h].getAttribute('data-field') == 'fy'){ //存储 费用名称
                      if(idSpan[h].id){
                        fname.push(idSpan[h].id)  //普通费用名称
                      }else{
                        fname.push(idSpan[h].innerHTML) //其他费用名称
                      }
                      detailid.push(idSpan[h].getAttribute('data-detailid'))
                      itype.push(idSpan[h].getAttribute('data-itype'))
                    }
                    if(idSpan[h].getAttribute('data-field') == 'm'){  //存储 费用
                      m.push(idSpan[h].innerHTML)
                    }
                    if(idSpan[h].getAttribute('data-field') == 'c'){  //存储 次数
                      c.push(idSpan[h].innerHTML)
                    }
                    if(idSpan[h].getAttribute('data-field') == 't'){  //存储 次数
                      t.push(idSpan[h].innerHTML)
                    }
                    if(idSpan[h].getAttribute('data-field') == 'gg'){  //存储 实验次数
                      s.push(idSpan[h].innerHTML)
                    }
                    if(idSpan[h].getAttribute('data-field') == 'p'){  //存储 ccc实验次数
                      if(idSpan[h].innerHTML === 'number' && !isNaN(value)){
                         ccc.push(idSpan[h].innerHTML)
                      }else{
                         ccc.push(0)
                      }
                    }
                }
              }
              for(let k=0; k<fname.length; k++){
                  let obj = {}
                  if( k==0){
                    obj = { //标准费用
                      "chargeid": fname[k],  //标准费用选中的费用id 下拉选择的id，没有变化可传空
                      "nid": this.queryT.data.data.pagenext,  // =1 试验员保存 =2 科室对账  //来自点击T的接口
                      "name": "",  //其他费用夫人费用名称
                      "detailid": detailid[k],  //检验项目费用详细id  // ilist 他的id
                      "formual": "",  //其他费用附加公式，可传nullid
                      "itype": itype[k],  // = 0 普通试验费用 =1 定型试验费用 或 带详细的实验费用 =5 基础辅助费用 也就是"其他"这种费用 =6l
                      "charges2": m[k],  // 单价
                      "times": c[k],  // 次数
                      "account": t[k], //总计
                      "testTimes": s[k],//实验次数
                      "cccTestTimes":ccc[k] //ccc实验次数
                    };
                  }else{
                    obj = { //其他费用
                      "chargeid": '',  //标准费用选中的费用id 下拉选择的id，没有变化可传空
                      "nid": this.queryT.data.data.pagenext,  // =1 试验员保存 =2 科室对账  //来自点击T的接口
                      "name": fname[k],  //其他费用夫人费用名称
                      "detailid": detailid[k],  //检验项目费用详细id  // ilist 他的id
                      "formual": "",  //其他费用附加公式，可传nullid
                      "itype": itype[k],  // = 0 普通试验费用 =1 定型试验费用 或 带详细的实验费用 =5 基础辅助费用 也就是"其他"这种费用 =6l
                      "charges2": m[k],  // 单价
                      "times": c[k],  // 次数
                      "account": t[k],  //总计
                      "testTimes": s[k],//实验次数
                      "cccTestTimes":ccc[k] //ccc实验次数
                    };
                  }
                  arr.push(obj)
              }
              arrs.push(arr)
            }
        };
        let arrJson =[];
        for(let i=0; i<arrs.length; i++){
          let json = {
            financialItemId:ids[i],
            taskId : JSON.parse(window.sessionStorage.getItem('taskidOrgabc')).taskid,
            //cccTaskId : 'AA186D5133DB41A2A2C59051861A7748',
            cccTaskId : this.getCccTaskId().join(),
            financialSaveVOList:arrs[i]
          }
          arrJson.push(json)
        }
        this.$api.financial.storageexpenses(arrJson).then(res => {
            if(res.data.ok == true){
               for (const key in res.data.data) {
                  if(res.data.data[key] == "OK"){
                    document.getElementById(key).innerHTML = "<font color=green>OK</font>"
                  }else{
                    document.getElementById(key).innerHTML = "<font color=red>Err</font>"
                  }
                 
               }
            }
        }).catch((err) =>{
          this.$alert(err.data.message, '信息提示', {
            dangerouslyUseHTMLString: true
           });
        })

      },
      submitnextstep(){// 提交下一步
        this.$confirm("确认要提交该任务下的试验项目费用?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids =[]; //存储所有选中的实验项目id
            let checkboxs = document.getElementsByTagName('input')
            for(let i=0; i<checkboxs.length; i++){
              if(checkboxs[i].type == 'checkbox' && checkboxs[i].checked == true && checkboxs[i].getAttribute('data-name') == 'jc'){
                ids.push(checkboxs[i].value) 
              }
            }
            let taskidOrgabc = JSON.parse(window.sessionStorage.getItem('taskidOrgabc'))
            let data = {
              "itembox": ids.join(','),  // 选中的项目id，多个用逗号分隔
              "taskid": taskidOrgabc.taskid , //任务id
              "pagenext": this.queryT.data.data.pagenext,  // nid
              "org_abc": taskidOrgabc.orgabc,  // 费用科室代码 
            }
           this.$api.financial.tostep(data).then(res => {
              if(res.data.ok == true){
                this.$alert(res.data.data, '信息提示', {
                  dangerouslyUseHTMLString: true
                });
                this.$emit('closedige', false)//调用父级方法 关闭窗口，更新数据
              }
            }).catch((err)=>{
              this.$message.error({message: err.data.message, duration: 1500});
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });          
          });
      },
      echo(){ //更新  不可修改的数据回显
        this.tasknumber=this.queryT.data.data.tinfo.taskCode; //任务号：
        this.examination=this.queryT.data.data.tinfo.companyCheck;//受检单位：
        this.samplename=this.queryT.data.data.tinfo.sampleName;//样品名称：
        this.model=this.queryT.data.data.tinfo.sampleType;//型号：
      },
      cccexperiment(){ //ccc实验数据获取    ccc实验 查询
        let data = {
          "pageSize": this.pageSize ,   //页面条数 
          "currentPage":  this.currentPage ,   //当前页
          "taskCode":'',   //任务号 
          "produceCompany": this.manufacturer,   //生产厂家
          "companyCheck": '',   //受检单位
          "sampleType": this.specification,   //样品规格型号
        }
        this.$api.financial.cccexpenses(data).then(res => {
          this.cccBox = [];
          res.data.data.list.forEach(item => {
            item.checkcur = false;
          });
          this.cccBox = res.data.data.list;
          console.log(this.cccBox)
          this.total = res.data.data.total;
        }).then(()=>{
          this.cccdialog = true;
        })
      },
      getCccTaskId(){
        let cccTaskId = [];
        this.cccBox.forEach(item => {
          if(item.checkcur == true){
            cccTaskId.push(item.taskid)
          }
        });
        return cccTaskId;
      },
      radiochoice(){// 选择ccc实验
        let keys = [];
        let values = [];
        let data = {
          taskid : JSON.parse(window.sessionStorage.getItem('taskidOrgabc')).taskid,
          ccc_taskid : this.getCccTaskId().join()
        }
      
        this.$api.financial.getcccInfo(data).then(res => {
          let data =res.data.data;
          for(var key in data){
            keys.push(key)
            values.push(data[key])
          }
          if(keys.length == 0){
              this.$alert('没有匹配到相同检验项目的ccc次数', '信息提示', {
                  dangerouslyUseHTMLString: true
              });
          }else{
            let _m,_c,_g,_p;
            let idSpan = document.getElementsByTagName('span')
            for(let t=0; t<keys.length; t++){
              for(let i=0; i<idSpan.length; i++){
                  if(keys[t] == idSpan[i].getAttribute('data-detailid') && idSpan[i].getAttribute('data-field') == "p"){
                    idSpan[i].innerHTML = values[t]
                    _p =  values[t]
                  }
                  if(keys[t] == idSpan[i].getAttribute('data-detailid') && idSpan[i].getAttribute("data-field") == 'gg'){  //试验次数
                        _g = idSpan[i].innerHTML;
                  }
                  if(keys[t] == idSpan[i].getAttribute('data-detailid') && idSpan[i].getAttribute("data-field") == 'm'){  //费用
                      _m = idSpan[i].innerHTML;
                  }
                  if(keys[t] == idSpan[i].getAttribute('data-detailid') && idSpan[i].getAttribute("data-field") == 'c'){  //实际次数
                    if(_g<_p){   //如果试验次数小于CCC试验次数 那么实际次数为0
                      idSpan[i].innerHTML = 0
                      _c =  0 // 实际次数 
                    }else{
                      idSpan[i].innerHTML = _g - _p
                      _c =  _g - _p  //  实际次数 = 试验次数 -  CCC试验次数
                    }
                  }
                  if(keys[t] == idSpan[i].getAttribute('data-detailid') && idSpan[i].getAttribute("data-field") == 't'){  //收费小计
                      idSpan[i].innerHTML = numMulti(_m, _c) ;
                      this.totalexpenses() //算合计
                  }
              }
            }
            this.cccdialog = false;
          }
          console.log(res)
        })
      },
       handleSizeChange (val) {
        this.pageSize = val // 每页展示的条数
        this.cccexperiment();
      },
      handleCurrentChange (val) {
        this.currentPage = val // 当前展示的第几页
        this.cccexperiment();
      },
      cccClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      doClick(){
        let selects = document.getElementsByTagName('select');
        for(var i=0; i<selects.length;i++){
          let index=selects[i].selectedIndex;//获取被选中的option的索引
          let textsel= selects[i].options[index].text;//获取相应的option的内容
          let _span = selects[i].parentNode.children[1];
          _span.innerHTML = textsel;
          _span.style.display = "block";
          selects[i].style.display = "none";
          _span.style.width= '100%'
          _span.style.whiteSpace= "nowrap";
          _span.style.textOverflow= "ellipsis";
          _span.style.overflow= "hidden";
          _span.style.wordBreak= "break-all";
          console.log(_span)
        }
      }
    },

    watch: {
     queryT(val){
       this.authentication = this.queryT.data.data.tinfo.wttype
       this.queryT = val
       this.dynamicTable();
       this.echo();
     },
     isshowV(val){
       this.isshowV = val
     }
    },
    mounted () {
      this.authentication = this.queryT.data.data.tinfo.wttype
      this.dynamicTable();
      this.echo();
      document.body.onclick = this.doClick
    },
    props: [
      'queryT','isshowV'
    ],
    components: {
     
      
    }
  }
</script>
<style lang="scss" scoped>
 
// 表格样式

.costlayout{ width: 100%; height: auto; overflow: hidden; margin: 0 auto;}
.red{ color: red;}
.costlayout ul li{ text-align: center; height: 35px; line-height: 35px; border: 1px solid #DCDFE6; float: left; width: 11%;}
.onfloat{float: left;}
.expense{ 
    width: 98.8%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    background-color: #fff;
    margin: 5px auto 0;
    padding-bottom: 0;
    justify-content:space-around;
    position: relative;
    top: -20px;
}
.incoupt {
    width: 20%;
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

  .incoupt .el-select {
    width: 60%;
  }

  .incoupt .el-select .el-input {
    width: 100%;
  }


  /deep/.selsctop .dislogBox .el-dialog__wrapper .el-dialog .el-dialog__body{
    padding: 0 20px !important;
  }

  .lxt_selsctBtn {
    width: 100%;
    text-align: center;
    margin-bottom: 1vw;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    padding-bottom: 1vw;
    margin-left: 0;
  }

  .cccbox{ width: 100%; height: auto; overflow: hidden;}
  .ccccondition{width: 100%; height: auto; overflow: hidden; display: flex; justify-content:flex-start; flex-wrap: wrap;}
  .ccctable{width: 100%; height: auto; overflow: hidden; margin-top: 10px;}
  .ccctable ul li{width: 100%; height: auto; overflow: hidden; }
  .ccctable ul li span{ display: block; text-align: center; height: 35px; line-height: 35px; border: 1px solid #DCDFE6; float: left; width: 16.5%;} 
  /deep/.ccctable ul li span label.el-radio{ width: 100%;}
  /deep/.ccctable ul li span label.el-radio span.el-radio__label{overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width: 85%; display: inline-block;}
  .topquery{ margin-top: 16px; margin-left: 16px;}
</style>
