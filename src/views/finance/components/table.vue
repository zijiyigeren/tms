<template>
 <section>
   <div class="expense">
      <div class="incoupt">
        <label>总计应收：</label>
        <el-input placeholder="请输入内容" v-model="saccount2"  size="small" clearable name="clearInputValue" ></el-input>
        <el-input placeholder="请输入内容" v-model="saccount2"  size="small" clearable name="clearInputValue" ></el-input>
      </div>
      <div class="incoupt">
        <label>试验费总计：</label>
        <el-input placeholder="请输入内容" v-model="sitemAccount2"  size="small" clearable name="clearInputValue" ></el-input>
        <el-input placeholder="请输入内容" v-model="tasknumber"  size="small" clearable name="clearInputValue" ></el-input>
      </div>
      <div class="incoupt">
        <label>辅助费用总计：</label>
        <el-input placeholder="请输入内容" v-model="sobjAccount" clearable  size="small" name="clearInputValue" ></el-input>
        <el-input placeholder="请输入内容" v-model="cobjaccountf"  size="small" clearable name="clearInputValue" ></el-input>
      </div>
      <div class="incoupt">
        <label>科室辅助费用总计：</label>
        <el-input placeholder="请输入内容" v-model="sattAccount" clearable  size="small" name="clearInputValue" ></el-input>
        <el-input placeholder="请输入内容" v-model="cattaccountf"  size="small" clearable name="clearInputValue" ></el-input>
      </div>
      <div class="dcenter">
        <div class="incoupt2">
          <label>折扣率：</label>
          <el-input placeholder="请输入内容" v-model="discount" clearable  size="small" name="clearInputValue" ></el-input>
          <el-checkbox v-model="checkeddiscount">折扣率</el-checkbox>
          <el-button type="primary"  class="bespoke optab" @click="fracture">折</el-button>
        </div>
      </div>
      <div class="incoupt3">
        <label>实收1：</label>
        <el-input placeholder="请输入内容" v-model="difAccount" clearable  size="small" name="clearInputValue" ></el-input>
      </div>
      <div class="incoupt3">
        <label>实收2：</label>
        <el-input placeholder="" v-model="readonly" clearable disabled size="small" name="clearInputValue" ></el-input>
      </div>
      <div class="incoupt3">
        <label>已收：</label>
        <el-input placeholder="" v-model="sinAccount" clearable disabled size="small" name="clearInputValue" ></el-input>
      </div>
      <div class="incoupt3">
        <label>入账结余：</label>
        <el-input placeholder="" v-model="badAccount" clearable disabled size="small" name="clearInputValue" ></el-input>
      </div>
      <div class="scckd">
        <el-button type="primary" @click="generate">生成催款单</el-button>
        <span ref="siname"></span>
      </div>
   </div>
     <div class="costlayout">
        <ul>
          <li>任务号</li>
          <li>部门</li>
          <li>入账</li>
          <li>项目</li>
          <li>费用名称</li>
          <li>单价</li>
          <li>车次</li>
          <li>小计</li>
          <li>折小计</li>
          <li>已收</li>
        </ul>
    </div>
    <div class="costlayout" >
      <ul ref="costlayout"></ul>
    </div>
 </section>
</template>

<script>
  import base from '@/api/base.js'

  export default {
    name: 'tabel',
    data () {
      let self = this;
      return {
        saccount2:'', //总计应收：
        sitemAccount2:'',//试验费总计：
        tasknumber:'',//试验费总计：
        sobjAccount:'',//辅助费用总计：
        cobjaccountf:'',//辅助费用总计：
        sattAccount:'',//科室辅助费用总计：
        cattaccountf:'',//科室辅助费用总计：
        discount:'',//折扣率：
        checkeddiscount:true,//折扣率：
        difAccount:'',//实收1：
        readonly:'',//实收2：
        sinAccount:'',//已收：
        badAccount:'',//入账结余：
         // ceshi
        dynamicTableData: {},//接受父组件传过来的表格数据
      }
    },
    methods: {
      dynamicTable(){ //动态生产表格
        this.$refs.costlayout.innerHTML = '';
        this.dynamicTableData = {};
        this.dynamicTableData = this.collectionletter
        let dome = this.$refs.costlayout;
        console.log(this.dynamicTableData)
        let data = this.dynamicTableData.data.data;
       console.log(data)
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
          var _onespan = document.createElement('span');
          _onespan.innerHTML = listData.list[i].taskcode;  //任务号
          _onespan.setAttribute('data-taskids',listData.list[i].taskid);  //任务id
          _onespan.style.float = 'left';
          _onespan.style.display = 'block';
          _onespan.style.width = '10%';
          _onespan.style.border = '1px solid #DCDFE6';
          _onespan.style.textAlign = 'center';

           let mko = 0
          let datalists= listData.list[i].list
          for(let o=0; o<datalists.length; o++){
            let datatow = datalists[o].list
            for(let ot=0; ot<datatow.length; ot++){
              mko = mko + datatow[ot].ilist.length;
            }
          }



          _onespan.style.height = mko * _h +'px';
          _onespan.style.lineHeight = mko * _h +'px';
          _oneli.appendChild(_onespan);
            var _towul = document.createElement('ul');//二级
            var _towli = document.createElement('li');//二级
                var _threeul = document.createElement('ul');//三级
                var _threeli = document.createElement('li');//三级
                var _threeul2 = document.createElement('ul');//三级
                var _threeli2 = document.createElement('li');//三级


                  //var _fowul = document.createElement('ul');//四级
                  var _fowul2 = document.createElement('ul');//四级
                  var _fowul3 = document.createElement('ul');//四级
                  var _fowul4 = document.createElement('ul');//四级
                  var _fowul5 = document.createElement('ul');//四级
                  var _fowul6 = document.createElement('ul');//四级
                  var _fowul7 = document.createElement('ul');//四级
            for(var t=0; t<listData.list[i].list.length; t++){  //二级
              _towul.style.float = 'left'
              _towul.style.width = '10%';
              var _towul_ul =document.createElement('ul');
              var _towli_li = document.createElement('li');
              _towli_li.style.textAlign = 'center';
              _towli_li.style.border = '1px solid #DCDFE6';
              _towli_li.style.textAlign = 'center';

              let mko2 = 0
              let datalists2= listData.list[i].list[t].list
              for(let o2=0; o2<datalists2.length; o2++){
                mko2 = mko2 + datalists2[o2].ilist.length;
              }



              _towli_li.style.height = mko2 * _h +'px';
              _towli_li.style.lineHeight = mko2 * _h +'px';


              var _towspan = document.createElement('span');
              _towspan.innerHTML = listData.list[i].list[t].orgabc;  //部门
              _towli_li.appendChild(_towspan);
              _towul_ul.appendChild(_towli_li);
              _towli.appendChild(_towul_ul)
                var _threeul_ul =document.createElement('ul'); //三级
                var _threeul_ul2 =document.createElement('ul'); //三级
                for(var m=0; m<listData.list[i].list[t].list.length; m++){ //三级
                  _threeul.style.float = 'left'
                  _threeul.style.width = '10%';
                  var _threeli_li = document.createElement('li');
                  _threeli_li.style.border = '1px solid #DCDFE6'
                  _threeli_li.style.textAlign = 'center';

                  let mko3 = 0
                  let datalists3= listData.list[i].list[t].list[m].ilist.length

                  _threeli_li.style.height = datalists3 * _h +'px';
                  _threeli_li.style.lineHeight = datalists3 * _h +'px';
                  var _threespan = document.createElement('span');
                  // if(listData.list[i].list[t].list[m].taskflag<2010){
                  //   _threespan.innerHTML = "--"; //入账
                  //   //_threespan.innerHTML = listData.list[i].list[t].list[m].caccount; //入账
                  // }else{
                  //   _threespan.innerHTML = listData.list[i].list[t].list[m].caccount/100; //入账
                  // }
                  _threespan.innerHTML = listData.list[i].list[t].list[m].caccount/100; //入账
                  _threeli_li.appendChild(_threespan);
                  _threeul_ul.appendChild(_threeli_li);
                  _threeli.appendChild(_threeul_ul);

                  _threeul2.style.float = 'left'
                  _threeul2.style.width = '10%';
                  var _threeli_li2 = document.createElement('li');
                  _threeli_li2.style.border = '1px solid #DCDFE6'
                  _threeli_li2.style.textAlign = 'center';
                  _threeli_li2.style.height = datalists3 * _h +'px';
                  _threeli_li2.style.lineHeight = datalists3 * _h +'px';
                  var _threespan2 = document.createElement('span');
                  _threespan2.innerHTML = listData.list[i].list[t].list[m].itemname; //项目
                  _threespan2.title = listData.list[i].list[t].list[m].itemname;
                  _threeli_li2.appendChild(_threespan2);
                  _threeul_ul2.appendChild(_threeli_li2);
                  _threeli2.appendChild(_threeul_ul2);

                  _threeli_li2.style.whiteSpace = 'nowrap';
                  _threeli_li2.style.textOverflow = 'ellipsis';
                  _threeli_li2.style.overflow = 'hidden';
                  _threeli_li2.style.wordBreak = 'break-all';
              


                    //  var _fowli = document.createElement('li');//四级
                    //  var _lul = document.createElement('ul'); //四级

                     var _fowli2 = document.createElement('li');//四级
                     var _lul2 = document.createElement('ul'); //四级

                     var _fowli3 = document.createElement('li');//四级
                     var _lul3 = document.createElement('ul'); //四级

                     var _fowli4 = document.createElement('li');//四级
                     var _lul4 = document.createElement('ul'); //四级

                     var _fowli5 = document.createElement('li');//四级
                     var _lul5 = document.createElement('ul'); //四级

                     var _fowli6 = document.createElement('li');//四级
                     var _lul6 = document.createElement('ul'); //四级

                     var _fowli7 = document.createElement('li');//四级
                     var _lul7 = document.createElement('ul'); //四级

                     
                     
                     for(var f=0; f<listData.list[i].list[t].list[m].ilist.length; f++){  //四级
                        // _fowul.style.float = 'left'
                        // _fowul.style.width = '14%';
                        // var _lli = document.createElement('li');
                        // _lli.style.border = '1px solid #DCDFE6';
                        // _lli.style.height = _h+'px';
                        // _lli.style.lineHeight = _h+'px';
                        // var _fowspan = document.createElement('span');
                        // _fowspan.innerHTML = listData.list[i].list[t].list[m].ilist[f].account;
                        // _lli.appendChild(_fowspan)
                        // _lul.appendChild(_lli)

                        // var centom = listData.list[i].list[t].list[m].itemname   //项目
                        // this.copySpan(_fowul,centom,_lul,_h)
                        

                        var centom = listData.list[i].list[t].list[m].ilist[f].name  //费用名称
                        this.copySpan(_fowul2,centom,_lul2,_h)
  
                        var centom = listData.list[i].list[t].list[m].ilist[f].ycharges   //单价
                        this.copySpan(_fowul3,centom,_lul3,_h)

                        var centom = listData.list[i].list[t].list[m].ilist[f].times  //车次
                        this.copySpan(_fowul4,centom,_lul4,_h)

                        var centom = listData.list[i].list[t].list[m].ilist[f].yaccount  //小计
                        this.copySpan(_fowul5,centom,_lul5,_h)

                        var centom = listData.list[i].list[t].list[m].ilist[f].cyaccount  //折小计
                        this.copySpan(_fowul6,centom,_lul6,_h)

                        var centom = listData.list[i].list[t].list[m].ilist[f].sinaccount  //已收
                        this.copySpan(_fowul7,centom,_lul7,_h)


                     }
                  //  _fowli.appendChild(_lul);
                  //  _fowul.appendChild(_fowli);

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
                  
                }
            } 
            _threeul.appendChild(_threeli)//三级
            _threeul2.appendChild(_threeli2)//三级
            _towul.appendChild(_towli)//二级
            _oneli.appendChild(_towul);//二级
            _oneli.appendChild(_threeul);//三级
             _oneli.appendChild(_threeul2);//三级
           // _oneli.appendChild(_fowul);//四级
            _oneli.appendChild(_fowul2);//四级
            _oneli.appendChild(_fowul3);//四级
            _oneli.appendChild(_fowul4);//四级
            _oneli.appendChild(_fowul5);//四级
            _oneli.appendChild(_fowul6);//四级
            _oneli.appendChild(_fowul7);//四级

         this.$refs.costlayout.appendChild(_oneli)
        }
      },
      //关于copySpan函数的段备注解释 
      //_fowul 将ul传入最外层li里面
      //centom 插入内容
      //_lul // 插入_fowul下面的li里面
      //_h //单元格高度
      //isfalg 判断当前单元格是否可编辑
      //field 判断当前字段代表的是那个值   m 代表费用   c 代表次数   t代表收费小计
      //identifier  赋予每一个内容自身的标识
      //id 赋予每个list下面每一组span统一的标识。作用是后期保存的时候方便分辨属于哪个list 
      copySpan(_fowul,centom,_lul,_h){
        _fowul.style.float = 'left'
        _fowul.style.width = '10%';
        var _lli = document.createElement('li');
        _lli.style.border = '1px solid #DCDFE6';
        _lli.style.height = _h+'px';
        _lli.style.lineHeight = _h+'px';
        _lli.style.textAlign = 'center';
        _lli.style.whiteSpace = 'nowrap';
        _lli.style.textOverflow = 'ellipsis';
        _lli.style.overflow = 'hidden';
        _lli.style.wordBreak = 'break-all';
        var _fowspan = document.createElement('span');
        _fowspan.innerHTML = centom;
        _fowspan.title = centom;
        _lli.appendChild(_fowspan)
        _lul.appendChild(_lli)
      },
      echofields(){
        this.saccount2=this.collectionletter.data.data.saccount2; //总计应收：
        this.sitemAccount2=this.collectionletter.data.data.sitemAccount2;//试验费总计：
        this.tasknumber=this.collectionletter.data.data.tasknumber;//试验费总计：
        this.sobjAccount=this.collectionletter.data.data.sobjAccount;//辅助费用总计：
        this.cobjaccountf=this.collectionletter.data.data.cobjaccountf;//辅助费用总计：
        this.sattAccount=this.collectionletter.data.data.sattAccount;//科室辅助费用总计：
        this.cattaccountf=this.collectionletter.data.data.cattaccountf;//科室辅助费用总计：
        this.discount=this.collectionletter.data.data.discount;//折扣率：
        // this.checkeddiscount=this.collectionletter.data.data.checkeddiscount;//折扣率：
        this.difAccount=this.collectionletter.data.data.difAccount;//实收1：
        this.readonly=this.collectionletter.data.data.readonly;//实收2：
        this.sinAccount=this.collectionletter.data.data.sinAccount;//已收：
        this.badAccount=this.collectionletter.data.data.badAccount;//入账结余：
      },
      generate(){ //生成催款单
        let ids=[];
        let idSpan = document.getElementsByTagName('span');
        for(let h=0; h<idSpan.length; h++){
          if(idSpan[h].getAttribute('data-taskids')){
            ids.push(idSpan[h].getAttribute('data-taskids'))  //选中的项目id
          }
        }
        this.$api.financial.getcreatec(ids.join()).then(res => {
          if(res.data.ok = true){
            this.$alert(`成功：${res.data.data.ckdCode}：${res.data.data.ckdId}`, '信息提示', {
              dangerouslyUseHTMLString: true
            });
            this.$refs.siname.innerHTML = `${res.data.data.ckdCode}：${res.data.data.ckdId}`
          }
        })
      },
      fracture(){ //折

        if(this.checkeddiscount == false || this.checkeddiscount == undefined){
           this.$alert('未选中折扣率', '信息提示', { dangerouslyUseHTMLString: true });
           return false
        }
        if(this.discount == ''){
           this.$alert('折扣率不能为空', '信息提示', { dangerouslyUseHTMLString: true});
          return false
        }
        let data = {
          "taskid": window.sessionStorage.getItem('task_fractureId'),
          "sdiscount": this.discount,
          "zkflag": '1'
        }
        console.log(data)
        this.$api.financial.getdiscountComput(data).then(res => {
          if(res.data.ok == true){
            this.$api.financial.getverification(window.sessionStorage.getItem('task_fractureId')).then((res)=>{
              if(res.data.data == "OK"){
                return res.data.data
              }
            }).then((res)=>{
              this.$api.financial.getdetail(window.sessionStorage.getItem('task_fractureId')).then((res)=>{
                if(res.data.ok == true){
                  return res
                }
              }).then((res)=>{
                console.log(res)
                this.$emit('updatea',res)
              })
            })
          }
        })

      }
    },
    watch: {
      collectionletter(val){
        this.collectionletter = val;
        this.dynamicTable();
        this.echofields()
      }
    },
    mounted () {
      this.dynamicTable();
      this.echofields()
    },
    props: [
      'collectionletter'
    ],
    components: {
 
    }
  }
</script>
<style lang="scss" scoped>
 
// 表格样式

.costlayout{ width: 100%; height: auto; overflow: hidden; margin: 0 auto;}
.red{ color: red;}
.costlayout ul li{ text-align: center; height: 35px; line-height: 35px; border: 1px solid #DCDFE6; float: left; width: 10%;}
.onfloat{float: left;}
.expense{ 
    width: 98.8%;
    display: flex;
    align-items: left;
    flex-wrap: wrap;
    background-color: #fff;
    margin: 5px auto 0;
    padding-bottom: 0;
    justify-content:flex-start;
    position: relative;
    top: -20px;
}


.incoupt {
    width: 50%;
    height: 40px;
    line-height: 40px;
    display: flex;
    margin-top: 1%
  }

  .incoupt label {
    width: 200px;
    text-align: right;
    font-size: 14px;
    color: #606266;
  }

  .incoupt .el-input {
    width: 60%;
    margin-right: 5px;
  }

  .incoupt .el-select {
    width: 60%;
  }

  .incoupt .el-select .el-input {
    width: 100%;
  }

  .dcenter{ width: 100%; overflow: hidden;}

  .incoupt2{
    width: 50%;
    height: 40px;
    line-height: 40px;
    display: flex;
    margin-top: 1%;
    justify-content:flex-start;
    float: left;
  }
  .incoupt2 label {
    width: 200px;
    text-align: right;
    font-size: 14px;
    color: #606266;
  }
  .incoupt2 .el-input {
    width: 91%;
    margin-right: 5px;
  }


  .incoupt3 {
    width: 25%;
    height: 40px;
    line-height: 40px;
    display: flex;
    margin-top: 1%
  }

  .incoupt3 label {
    width: 200px;
    text-align: right;
    font-size: 14px;
    color: #606266;
  }

  .incoupt3 .el-input {
    width: 88%;
    margin-right: 5px;
  }
  .scckd{ width: 98%; text-align: right; margin: 20px auto 0;}




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
  .optab{
    margin-top: 5px;
    margin-left: 10px;
  }

  

</style>
