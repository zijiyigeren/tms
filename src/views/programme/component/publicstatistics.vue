<template>
    <!-- 上传公共组件 -->
  <div class="lxt_box">
    <div class="fromBox" id="fromBox">
      <div class="boxtitle">
        <el-button type="primary" size="small" @click="refresh">刷新</el-button>
        <el-button type="success" size="small" @click="preservation">保存</el-button>
        <el-button type="info" size="small" @click="reportDirectory">上送报告目录</el-button>
        <el-button type="warning" size="small" @click="submitReportFile">上送报告文件</el-button>
        <el-button type="danger" size="small" @click="viewVideos">查看该任务下的视频</el-button>

        <div class="fromtopmet" >
          <table width="100%" border="0" bordercolor="#EBEEF5"   cellspacing="0"  style="border-collapse:separate; border-spacing:0px 5px;">
              <thead>
                <tr class="trForm">
                  <td width="10%">序号</td>
                  <td width="15%">项目中文名称</td>
                  <td width="4%">类别</td>
                  <td width="5%">数目</td>
                  <td width="10%">项目依据标准</td>
                  <td width="7%">备注</td>
                  <td width="7%">视同报告编号</td>
                  <td width="7%">实测项目号</td>
                  <td width="7%">视同项目号</td>
                  <td width="7%">视频文件</td>
                  <td width="4%"></td>
                  <td width="7%">匹配结果</td>
                </tr>
              </thead>
          </table>
        </div>

        <span id="jobid">
          <div class="el-loading-mask" v-if="logingshow">
              <div class="el-loading-spinner">
                <svg viewBox="25 25 50 50" class="circular">
                  <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                </svg>
              </div>
            </div>
        </span>
      </div>

      <div class="fromtop" id="fromtop">
        <table width="100%" border="0" bordercolor="#EBEEF5"   cellspacing="0" id="fromdata" style="border-collapse:separate; border-spacing:0px 5px;">
           
        </table>
      </div>
    </div>
    
    <!-- 序号列的弹出 -->
    <!-- <el-dialog
      title="统计表说明"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form :model="form">
        <el-form-item label="项目代码及依据" label-width="25%">
          {{form.name}}
        </el-form-item>
        <el-form-item label="检验说明" label-width="25%">
           <el-input type="textarea" v-model="form.instructions" style="width:75%"></el-input>
        </el-form-item> 
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">保存</el-button>
      </span>
    </el-dialog> -->

    <!-- 查看该任务下的视频按钮的弹出 -->
    <el-dialog 
      title="查看"
      :visible.sync="viewisible"
      width="30%"
      :fullscreen = true
      :before-close="handleClose">
      <viewvideos :viewvideosdata = viewvideosdata></viewvideos>
    </el-dialog>
  </div>
</template>
<script>
import viewvideos from '@/views/programme/component/viewvideos.vue';
var allDatas = []; // 存储请求到的所以数据
var numto = 12; //每次加载10条数据
var numfrequency = 0; //调用了几次 遍历数据的方法， 每次 自加1
var numpositions = 0; //记录当前循环到第几条数据，作用是不在遍历已渲染的数据
var sanjiao = 0;  //三角全选按钮显示  如果sanjiao=1 就显示三角全选按钮
var sanjiaoFale = true;//三角全选按钮  是否全选
var source = 0;//三角圆圈全选按钮显示  如果source=1 就显示三角圆圈全选按钮
var sourceFale = false;//三角圆圈全选按钮  是否全选
var circle = 0;  //空心圆圈全选按钮显示  如果circle=1 就显示三角全选按钮
var circleFale = false;//空心圆圈全选按钮  是否全选
var resDatacnot ;
export default {
    name: 'publicinformation',
    components: {viewvideos},
    props:['resData'],
    data() {
      return {
          viewvideosdata:'',//查看该任务下的视频数据的存储变量
          logingshow:false,//加载动画 显示隐藏
          proType : '', //产品类别
          sproductid:'',//检验方案ID
          taskid :'',//任务id
          productid:'',//产品id
          testType:'',//原形
          disid:'',//查询检验方案
          multipleSelection: [],
          form: {
            name:'13',
            instructions:'131233'
          },
          dialogVisible: false,
          viewisible: false,
          // winid : window.assignment = (id)=> { //控制弹出层显示和隐藏
          //   this.dialogVisible = true;

          //   this.form.name = id

          // },
          alertcoim : window.goReplace =(id)=>{  
            this.$confirm('是否替换?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let oAllDataBox = document.getElementById('fromdata');
              let oTr = oAllDataBox.getElementsByTagName('tr')
              for(let i=0; i<oTr.length; i++){
                  let otr0 = oTr[i].children[0];
                  let otr0_1;
                  let itemid;
                  let inputlength = otr0.getElementsByTagName('input').length;
                  if(inputlength>0){
                    if(inputlength==2){
                      otr0_1 = otr0.getElementsByTagName('input')[1]
                      itemid=otr0_1.getAttribute('data-id');
                    }else{
                      otr0_1 = otr0.getElementsByTagName('input')[0]
                      itemid=otr0_1.getAttribute('data-id');
                    }
                    if(itemid == id){
                      let _measured = oTr[i].children[7].children[0];
                      let _matchingResults = oTr[i].children[11].children[0];
                      _measured.value = _matchingResults.value
                    }
                  }
              }
              this.$message({
                type: 'success',
                message: '替换成功!'
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消替换'
              });          
            });
          },
          winAll : window.allCheck = (category) =>{ //全选
              let ofromdata = document.getElementById('fromdata');
              let ainput = ofromdata.getElementsByTagName('input')
              if(category == '△'){ //三角
                if(sanjiaoFale){
                  for(let i=0; i<ainput.length; i++){
                      if(ainput[i].name == 'itemsid'){
                        ainput[i].checked = false;
                      }
                  }
                  sanjiaoFale = false;
                }else{
                  for(let i=0; i<ainput.length; i++){
                      if(ainput[i].name == 'itemsid'){
                        ainput[i].checked = true;
                      }
                  }
                  sanjiaoFale = true;
                }
              }
              if(category == '△○'){ //三角圆圈
                if(sourceFale){
                  for(let i=0; i<ainput.length; i++){
                      if(ainput[i].name == 'itemsSource'){
                        ainput[i].checked = false;
                      }
                  }
                  sourceFale = false;
                }else{
                  for(let i=0; i<ainput.length; i++){
                      if(ainput[i].name == 'itemsSource'){
                        ainput[i].checked = true;
                      }
                  }
                  sourceFale = true;
                }
              }
              if(category == '○'){ //圆圈
                if(circleFale){
                  for(let i=0; i<ainput.length; i++){
                      if(ainput[i].name == 'itemsit'){
                        ainput[i].checked = false;
                      }
                  }
                  circleFale = false;
                }else{
                  for(let i=0; i<ainput.length; i++){
                      if(ainput[i].name == 'itemsit'){
                        ainput[i].checked = true;
                      }
                  }
                  circleFale = true;
                }
              }
          },
          updateState : window.updateState =()=>{  // 每次加载都需要遍历 复选框状态
              var ofromdata = document.getElementById('fromdata');
              var ainput = ofromdata.getElementsByTagName('input');
              if(sanjiaoFale){  //三角
                for(let i=0; i<ainput.length; i++){
                    if(ainput[i].name == 'itemsid'){
                      ainput[i].checked = true;
                    }
                }
              };
              if(circleFale){ //圆圈
                for(let i=0; i<ainput.length; i++){
                    if(ainput[i].name == 'itemsit'){
                      ainput[i].checked = true;
                    }
                }
              }
          },
          commentMt:'',//获取公告类型
        }
    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      curDialog(val){ //弹出
        this.dialogVisible = true;
        console.log(val)
      },
      allData(val){ //获取数据
       let res = val;
       this.proType = res.data.data.st.dp.proType; //产品类别
       this.sproductid=res.data.data.sproductid; //检验方案ID
       this.taskid = res.data.data.st.dp.taskid;//任务id
       this.productid = res.data.data.sproductid;//产品id
       this.testType = res.data.data.st.dp.proType;//原形
       this.disid = res.data.data.st.dp.id //查询检验方案
       let dataList = res.data.data.qdetail.list
       dataList.forEach((item,index) => {
            let equalNumber ;
            if(item.orderby == 2){
              if(item.equalNumber == null){
                equalNumber = ''
              }else{
                equalNumber = item.equalNumber
              }
            }else{
              equalNumber = ''
            }
            let obj = {
              id:item.id,
              serial: item.seq+'=',//排序
              seritel:item.itemId,//任务id
              name: item.name, //项目中文名称
              category: item.applyTestType, // 类别
              number:item.testCount, // 数目
              standard:item.standard,//项目依据标准
              remarks:item.insNote2,//备注
              deemed:equalNumber,//视同报告编号
              measured:item.itemsCode,//	实测项目号
              similar:item.itemsCode2,//视同项目号
              videofile:item.videoFilename,//视频文件
              matching:'',//匹配结果
              incuke:'',//隐藏的input
              falg:false,
              allsel:false,
            }
            allDatas.push(obj)
        });
       
        this.alltable()
     

      },
      alltable(){ //渲染数据
        let odiv = document.createElement('tbody');
        let ofromtop = document.getElementById('fromdata');
        numfrequency ++;
        for(let i=0; i<allDatas.length; i++){
          if(i >= numpositions){
            if(i >= numto*numfrequency)return
            numpositions++;
            if(allDatas[i].category =='△'){ 
                sanjiao++;
                if(sanjiao == 1){
                  // <span class="colorTel"  onclick="assignment('${allDatas[i].serial}')">${allDatas[i].serial}</span>
                  odiv.innerHTML += `<tr class="trForma" >
                      <td width="10%">全选
                        <input type="checkbox" name="sbox2" value="" checked onchange="allCheck('${allDatas[i].category}')"/> 
                        <input type="checkbox" name="itemsid" value="" checked data-id = "${allDatas[i].seritel}" /> 
                        <span >${allDatas[i].serial}</span>
                        ${allDatas[i].seritel}
                      </td>
                      <td width="15%">${allDatas[i].name}</td>
                      <td width="4%" class="catDack">${allDatas[i].category}</td>
                      <td width="5%">${allDatas[i].number}</td>
                      <td width="10%">${allDatas[i].standard}</td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].remarks == null ? '' : allDatas[i].remarks}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].deemed == null ? '' : allDatas[i].deemed}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].measured == null ? '' : allDatas[i].measured}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].similar == null ? '' : allDatas[i].similar}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].videofile == null ? '' : allDatas[i].videofile}</textarea>
                        <input type="hidden" value="${allDatas[i].incuke == null ? '' : allDatas[i].incuke}"  value=""/>
                      </td>
                      <td width="4%">
                        <span style="word-warp:break-word;word-break:break-all"></span>
                      </td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].matching == null ? '' : allDatas[i].matching}</textarea></td>
                  </tr>`
                }else{
                  odiv.innerHTML += `<tr class="trForma" >
                      <td width="10%">
                        <input type="checkbox" name="itemsid" value="" checked data-id = "${allDatas[i].seritel}"/> 
                        <span>${allDatas[i].serial}</span>
                        ${allDatas[i].seritel}
                      </td>
                      <td width="15%">${allDatas[i].name}</td>
                      <td width="4%" class="catDack">${allDatas[i].category}</td>
                      <td width="5%">${allDatas[i].number}</td>
                      <td width="10%">${allDatas[i].standard}</td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].remarks == null ? '' : allDatas[i].remarks}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].deemed == null ? '' : allDatas[i].deemed}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].measured == null ? '' : allDatas[i].measured}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].similar == null ? '' : allDatas[i].similar}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].videofile == null ? '' : allDatas[i].videofile}</textarea>
                        <input type="hidden" value="${allDatas[i].incuke == null ? '' : allDatas[i].incuke}"  value=""/>
                      </td>
                      <td width="4%">
                        <span style="word-warp:break-word;word-break:break-all"></span>
                      </td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].matching == null ? '' : allDatas[i].matching}</textarea></td>
                  </tr>`
                }
              };
              if(allDatas[i].category =='△○'){ 
                source++;
                if(source == 1){
                  odiv.innerHTML += `<tr class="trForma" >
                      <td width="10%">全选
                        <input type="checkbox" name="sbox2" value="" onchange="allCheck('${allDatas[i].category}')"/> 
                        <input type="checkbox" name="itemsSource" value="" data-id = "${allDatas[i].seritel}" /> 
                        <span>${allDatas[i].serial}</span>
                        ${allDatas[i].seritel}
                      </td>
                      <td width="15%">${allDatas[i].name}</td>
                      <td width="4%" class="catDack">${allDatas[i].category}</td>
                      <td width="5%">${allDatas[i].number}</td>
                      <td width="10%">${allDatas[i].standard}</td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].remarks == null ? '' : allDatas[i].remarks}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].deemed == null ? '' : allDatas[i].deemed}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].measured == null ? '' : allDatas[i].measured}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].similar == null ? '' : allDatas[i].similar}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].videofile == null ? '' : allDatas[i].videofile}</textarea>
                        <input type="hidden" value="${allDatas[i].incuke == null ? '' : allDatas[i].incuke}"  value=""/>
                      </td>
                      <td width="4%">
                        <span style="word-warp:break-word;word-break:break-all"></span>
                      </td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].matching == null ? '' : allDatas[i].matching}</textarea></td>
                  </tr>`
                }else{
                  odiv.innerHTML += `<tr class="trForma" >
                      <td width="10%">
                        <input type="checkbox" name="itemsSource" value="" data-id = "${allDatas[i].seritel}"/> 
                        <span>${allDatas[i].serial}</span>
                        ${allDatas[i].seritel}
                      </td>
                      <td width="15%">${allDatas[i].name}</td>
                      <td width="4%" class="catDack">${allDatas[i].category}</td>
                      <td width="5%">${allDatas[i].number}</td>
                      <td width="10%">${allDatas[i].standard}</td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].remarks == null ? '' : allDatas[i].remarks}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].deemed == null ? '' : allDatas[i].deemed}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].measured == null ? '' : allDatas[i].measured}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].similar == null ? '' : allDatas[i].similar}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].videofile == null ? '' : allDatas[i].videofile}</textarea>
                        <input type="hidden" value="${allDatas[i].incuke == null ? '' : allDatas[i].incuke}"  value=""/>
                      </td>
                      <td width="4%">
                        <span style="word-warp:break-word;word-break:break-all"></span>
                      </td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].matching == null ? '' : allDatas[i].matching}</textarea></td>
                  </tr>`
                }
              };
              if(allDatas[i].category =='○'){ 
                circle++;
                if(circle == 1){
                  odiv.innerHTML += `<tr class="trForma" >
                      <td width="10%">全选
                        <input type="checkbox" name="sbox2" value="" onchange="allCheck('${allDatas[i].category}')"/> 
                        <input type="checkbox" name="itemsit" value="" data-id = "${allDatas[i].seritel}" /> 
                        <span>${allDatas[i].serial}</span>
                        ${allDatas[i].seritel}
                      </td>
                      <td width="15%">${allDatas[i].name}</td>
                      <td width="4%" class="catDack">${allDatas[i].category}</td>
                      <td width="5%">${allDatas[i].number}</td>
                      <td width="10%">${allDatas[i].standard}</td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].remarks == null ? '' : allDatas[i].remarks}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].deemed == null ? '' : allDatas[i].deemed}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].measured == null ? '' : allDatas[i].measured}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].similar == null ? '' : allDatas[i].similar}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].videofile == null ? '' : allDatas[i].videofile}</textarea>
                        <input type="hidden" value="${allDatas[i].incuke == null ? '' : allDatas[i].incuke}"  value=""/>
                      </td>
                      <td width="4%">
                        <span style="word-warp:break-word;word-break:break-all"></span>
                      </td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].matching == null ? '' : allDatas[i].matching}</textarea></td>
                  </tr>`
                }else{
                  odiv.innerHTML += `<tr class="trForma" >
                      <td width="10%">
                        <input type="checkbox" name="itemsit" value="" data-id = "${allDatas[i].seritel}"/> 
                        <span>${allDatas[i].serial}</span>
                        ${allDatas[i].seritel}
                      </td>
                      <td width="15%">${allDatas[i].name}</td>
                      <td width="4%" class="catDack">${allDatas[i].category}</td>
                      <td width="5%">${allDatas[i].number}</td>
                      <td width="10%">${allDatas[i].standard}</td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].remarks == null ? '' : allDatas[i].remarks}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].deemed == null ? '' : allDatas[i].deemed}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].measured == null ? '' : allDatas[i].measured}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].similar == null ? '' : allDatas[i].similar}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].videofile == null ? '' : allDatas[i].videofile}</textarea>
                        <input type="hidden" value="${allDatas[i].incuke == null ? '' : allDatas[i].incuke}"  value=""/>
                      </td>
                      <td width="4%">
                        <span style="word-warp:break-word;word-break:break-all"></span>
                      </td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].matching == null ? '' : allDatas[i].matching}</textarea></td>
                  </tr>`
                }
              };
              if(allDatas[i].category =='■'){ 
                 odiv.innerHTML += `<tr class="trForma" >
                      <td width="10%">
                        <span >${allDatas[i].serial}</span>
                        ${allDatas[i].seritel}
                      </td>
                      <td width="15%">${allDatas[i].name}</td>
                      <td width="4%" class="catDack">${allDatas[i].category}</td>
                      <td width="5%">${allDatas[i].number}</td>
                      <td width="10%">${allDatas[i].standard}</td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].remarks == null ? '' : allDatas[i].remarks}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].deemed == null ? '' : allDatas[i].deemed}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].measured == null ? '' : allDatas[i].measured}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].similar == null ? '' : allDatas[i].similar}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].videofile == null ? '' : allDatas[i].videofile}</textarea>
                        <input type="hidden" value="${allDatas[i].incuke == null ? '' : allDatas[i].incuke}"  value=""/>
                      </td>
                      <td width="4%">
                        <span style="word-warp:break-word;word-break:break-all"></span>
                      </td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].matching == null ? '' : allDatas[i].matching}</textarea></td>
                  </tr>`
              };
              if(allDatas[i].category =='●'){ 
                 odiv.innerHTML += `<tr class="trForma" >
                      <td width="10%">
                        <span>${allDatas[i].serial}</span>
                        ${allDatas[i].seritel}
                      </td>
                      <td width="15%">${allDatas[i].name}</td>
                      <td width="4%" class="catDack">${allDatas[i].category}</td>
                      <td width="5%">${allDatas[i].number}</td>
                      <td width="10%">${allDatas[i].standard}</td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].remarks == null ? '' : allDatas[i].remarks}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].deemed == null ? '' : allDatas[i].deemed}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].measured == null ? '' : allDatas[i].measured}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].similar == null ? '' : allDatas[i].similar}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].videofile == null ? '' : allDatas[i].videofile}</textarea>
                        <input type="hidden" value="${allDatas[i].incuke == null ? '' : allDatas[i].incuke}"  value=""/>
                      </td>
                      <td width="4%">
                        <span style="word-warp:break-word;word-break:break-all"></span>
                      </td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].matching == null ? '' : allDatas[i].matching}</textarea></td>
                  </tr>`
              };
              if(allDatas[i].category =='★'){ 
                 odiv.innerHTML += `<tr class="trForma" >
                      <td width="10%">
                        <span>${allDatas[i].serial}</span>
                        ${allDatas[i].seritel}
                      </td>
                      <td width="15%">${allDatas[i].name}</td>
                      <td width="4%"class="catDack">${allDatas[i].category}</td>
                      <td width="5%">${allDatas[i].number}</td>
                      <td width="10%">${allDatas[i].standard}</td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].remarks == null ? '' : allDatas[i].remarks}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].deemed == null ? '' : allDatas[i].deemed}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].measured == null ? '' : allDatas[i].measured}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].similar == null ? '' : allDatas[i].similar}</textarea></td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].videofile == null ? '' : allDatas[i].videofile}</textarea>
                        <input type="hidden" value="${allDatas[i].incuke == null ? '' : allDatas[i].incuke}"  value=""/>
                      </td>
                      <td width="4%">
                        <span style="word-warp:break-word;word-break:break-all"></span>
                      </td>
                      <td width="7%"><textarea rows="3" class="outline">${allDatas[i].matching == null ? '' : allDatas[i].matching}</textarea></td>
                  </tr>`
              }
          }
           ofromtop.appendChild(odiv)
        }
      },
      rollerEvent(){ //判断滚动条是否触底
        let clientHeight = document.getElementById('fromBox').offsetHeight;// 屏幕高度  
        let scrollObj = document.getElementById('fromtop'); // 滚动区域
        let scrollTop = scrollObj.scrollTop // 浏览器滚动的距离 
        let scrollHeight = scrollObj.scrollHeight; // 滚动区域的总高度
        if(scrollTop+clientHeight >= scrollHeight){
          this.alltable();
          this.updateState();
        }  
      },
      preservation(){ //保存按钮
        let arr=[]; //判断是否有选中的项目
        let alldatas=[];//存储选中的项目
        let datas1="";
        let datas2="";
        let datas3="";
        let datas4="";
        let datas5="";
        let datas6="";
        let oAllDataBox = document.getElementById('fromdata');
        let aAllInput = oAllDataBox.getElementsByTagName('input');
        let oTr = oAllDataBox.getElementsByTagName('tr')
        for(let i=0; i<aAllInput.length; i++){
            if(aAllInput[i].checked){
                arr.push(aAllInput[i])
            }
        }
        if(arr.length == 0){
           this.$alert('请选择项目', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                // this.$message({
                //   type: 'info',
                //   //message: `action: ${ action }`
                // });
              }
            });
            return;
        }
        for(let i=0; i<oTr.length; i++){
            let otr0 = oTr[i].children[0];
            let otr0_1;
            let itemid;
            let inputlength = otr0.getElementsByTagName('input').length;
            if(inputlength>0){
              if(inputlength==2){
                otr0_1 = otr0.getElementsByTagName('input')[1]
                itemid=otr0_1.getAttribute('data-id');
              }else{
                otr0_1 = otr0.getElementsByTagName('input')[0]
                itemid=otr0_1.getAttribute('data-id');
              }
              if(otr0_1.checked){
                let _measured = oTr[i].children[7].children[0].value;
                _measured.length<=0 ? _measured="w": _measured = oTr[i].children[7].children[0].value;
                let _similar = oTr[i].children[8].children[0].value;
                _similar.length<=0 ? _similar="w": _similar = oTr[i].children[8].children[0].value;
                let _videofile = oTr[i].children[9].children[0].value;
                _videofile.length<=0 ? _videofile="w": _videofile = oTr[i].children[9].children[0].value;
                let _hiddenDomain = oTr[i].children[9].children[1].value;
                _hiddenDomain.length<=0 ? _hiddenDomain="w": _hiddenDomain = oTr[i].children[9].children[1].value;
                let _remarks = oTr[i].children[5].children[0].value;
                _remarks.length<=0 ? _remarks="w": _remarks = oTr[i].children[5].children[0].value;
                let obj = {
                  itemid:itemid,  //项目序号
                  measured : _measured, //实测项目号
                  similar : _similar,//视同项目号
                  videofile : _videofile,//视频文件
                  remarks : _remarks,//备注
                  hiddenDomain: _hiddenDomain //视频文件2  v4
                };
                alldatas.push(obj)
              }
            }
        }
        alldatas.forEach((item,index) => {
            datas1+=item.itemid + ','
            datas2+=item.measured + '#'
            datas3+=item.similar + '#'
            datas4+=item.videofile + '#'
            datas5+=item.remarks + '#'
            datas6+=item.hiddenDomain + '#'
        });
        if (datas1.length>0) datas1=datas1.substring(0,datas1.length-1);
        if (datas2.length>0) datas2=datas2.substring(0,datas2.length-1);
        if (datas3.length>0) datas3=datas3.substring(0,datas3.length-1);
        if (datas4.length>0) datas4=datas4.substring(0,datas4.length-1);
        if (datas5.length>0) datas5=datas5.substring(0,datas5.length-1);
        if (datas6.length>0) datas6=datas6.substring(0,datas6.length-1);
        const d={
            id:datas1, //项目id
            insNote2:datas5,//备注
            videoFilename:datas4,//视频文件
            videoStatus:datas6,
            itemscode:datas2, //实测项目号
            itemscode2:datas3, //视同项目号
            testType:this.proType,//产品类别
            productid:this.sproductid //检验方案ID
        };
        console.log(d)
        this.$api.tatistical.savePreservation(d).then((res)=>{
          if(res.data.respCode == 0){
            this.$alert(res.data.data, '信息提示', {
              dangerouslyUseHTMLString: true
            });
          } 
        }).catch((error)=>{
            this.$alert(error.message, '信息提示', {
              dangerouslyUseHTMLString: true
            });
        })
      },
      refresh(){ //刷新
      
        let arr=[]; //判断是否有选中的项目
        let alldatas=[];//存储选中的项目
        let datas1=""; //存储选中的任务id
        let dataresid = [];//存储后台返回的任务id
        let oAllDataBox = document.getElementById('fromdata');
        let aAllInput = oAllDataBox.getElementsByTagName('input');
        let oTr = oAllDataBox.getElementsByTagName('tr')
         
        for(let i=0; i<aAllInput.length; i++){
            if(aAllInput[i].checked){
                arr.push(aAllInput[i])
            }
        }
        if(arr.length == 0){
           this.$alert('请选择项目', '提示', {
              confirmButtonText: '确定',
              callback: action => {
              }
            });
            return;
        }
        for(let i=0; i<oTr.length; i++){
            let otr0 = oTr[i].children[0];
            let otr0_1;
            let itemid;
            let inputlength = otr0.getElementsByTagName('input').length;
            if(inputlength>0){
              if(inputlength==2){
                otr0_1 = otr0.getElementsByTagName('input')[1]
                itemid=otr0_1.getAttribute('data-id');
              }else{
                otr0_1 = otr0.getElementsByTagName('input')[0]
                itemid=otr0_1.getAttribute('data-id');
              }
              console.log(otr0_1.checked)
              if(otr0_1.checked){
                let obj = {
                  itemid:itemid,  //项目序号
                };
                alldatas.push(obj)
              }
            }
        }
        alldatas.forEach((item,index) => {
            datas1+=item.itemid + ','
        });
        if (datas1.length>0) datas1=datas1.substring(0,datas1.length-1);
        let Data={
          "id" : datas1,
          "taskid" : this.taskid,
          "productid" : this.productid,
          "testType" : this.testType,
        }
      
        this.$api.tatistical.refreshPreservation(Data).then((res)=>{ //刷新接口
          if(res.data.data == '')return;
          if(res.data.data.list.length>0){
            res.data.data.list.forEach((item,index) => {
              dataresid.push(item)
            });
          }
          for(let i=0; i<oTr.length; i++){
            
            let otr0 = oTr[i].children[0];
            let _videofile = oTr[i].children[9].children[0];
            let _hiddenDomain = oTr[i].children[9].children[1];
            let _remarks = oTr[i].children[5].children[0];
            let _measured = oTr[i].children[7].children[0];
            let _stateOne = oTr[i].children[10].children[0];
            let _matchingResults = oTr[i].children[11].children[0];
            let otr0_1;
            let itemid;
            let inputlength = otr0.getElementsByTagName('input').length;
            if(inputlength>0){
              if(inputlength==2){
                otr0_1 = otr0.getElementsByTagName('input')[1]
                itemid=otr0_1.getAttribute('data-id');
              }else{
                otr0_1 = otr0.getElementsByTagName('input')[0]
                itemid=otr0_1.getAttribute('data-id');
              }
              dataresid.forEach(item => {
               
                if(item.id == itemid){
                    if(_videofile.value.length>0){
                      if(item.videoFilename == _videofile.value){
                          _hiddenDomain.value = item.videoStatus
                      }else{
                          _hiddenDomain.value = item.videoStatus+" 错误：新数据"+item.videoFilename
                      }
                    }else{
                      if(item.insNote2==null){
                          // eval("document."+totalformtype+"form.i"+d.id).value="";
                      }else{
                        _remarks.value=d.insNote2;
                      }
                      _videofile.value=item.videoFilename;
			                _hiddenDomain.value=item.videoStatus;
                    }
                    if(item.refrush=="0"){
                      if (_measured.value.trim().length<=0){
                         _stateOne.innerHTML="<font color=blue>OK</font>";
                         _measured.value=item.itemscode;
                      }else{
                          if (_measured.value==item.itemscode){
                              _stateOne.innerHTML="<font color=blue>OK</font>";
                              _measured.value=item.itemscode;
                          }else{
                            var code1s=_measured.value.split(";");
                            var isErrQA=false;
                            for (var k=0;k<code1s.length;k++)
                            {
                              if (code1s[k].length==13)
                              {
                                if (code1s[k].substring(0,2)==this.commentMt)
                                {
                                  isErrQA=true;
                                  break;
                                }
                              }
                            }//for 
                            if (isErrQA)
                            {
                             _stateOne.innerHTML=`<a href="javascript:goReplace('${item.id}');"><font color=red>报告没有下达 错误请对方案</font></a>`;
                            }
                            else
                            {
                              if (item.itemscode=="")
                              {
                                
                              }else  _stateOne.innerHTML=`<a href="javascript:goReplace('${item.id}');"><font color=red>替换</font></a>`;
                            }
                              _matchingResults.value=item.itemscode;
                          }
                      }
                    }else{
                        var pvalue = _measured.value;
                       
                        pvalue = Trim(pvalue);
                        if (pvalue.length<=0)
                        {
                          _matchingResults.value=item.itemscode;
                          _stateOne.innerHTML=`<a href="javascript:goReplace('${item.id}');">替换</a>`;
                        }
                        else
                        {
                          if (pvalue.indexOf("同期申报")!=-1)
                          {
                            _matchingResults.value=item.itemscode;
                            _stateOne.innerHTML=`<a href="javascript:goReplace('${item.id}');">替换</a>`;
                            
                          }
                          else
                          {
                            if (pvalue == item.itemscode)
                            {
                              _matchingResults.value="";
                              _stateOne.innerHTML="<font color=blue>OK</font>";
                            }
                            else
                              {
                              _matchingResults.value=item.itemscode;
                              
                              _stateOne.innerHTML=`<a href="javascript:goReplace('${item.id}');"><font color=red>替换</font></a>`;
                              
                              }
                          }  	 
                        }
                    }
                }
              });
            }
            
          }
        })
      },
      reportDirectory(){//上送报告目录
        this.logingshow=true;
        let data={
          "id" : this.itemIdPublic(),
          "productid" : this.productid,
          "disid" : this.disid,
        }
        this.$api.tatistical.uploadReportDirectory(data).then((res)=>{
            this.uploadfrush(res);
        })
      },
      submitReportFile(){ //上送报告文件
        let data={
          "id" : this.itemIdPublic(),
          "productid" : this.productid,
          "testType" : this.testType,
        }
        this.$api.tatistical.uploadReportFile(data).then((res)=>{
           this.uploadfrush(res);
        })
      },
      viewVideos(){//查看该任务下的视频 
         this.viewisible = true;
         let id = this.taskid;
         this.$api.tatistical.goViewViedo(id).then((res)=>{
           this.viewvideosdata = res.data.data.list
        })
      },
      uploadfrush(res){//上送报告目录  上送报告文件  公共逻辑
        let oAllDataBox = document.getElementById('fromdata');
        let oTr = oAllDataBox.getElementsByTagName('tr')
        let otr0;
        let otr1;
        if(res.data.respCode == 0){
              if(res.data.data != ''){
                this.logingshow=false;
                document.getElementById("jobid").innerHTML=res.data.data.mes;
                var datas =res.data.data.list;
                if (datas!=null)
                {
                  for (var i=0;i<datas.length;i++)
                  {
                    var d = datas[i];
                    for(let j=1; j<oTr.length; j++){
                      otr0 = oTr[j].children[0];
                      let otr0_1;
                      let itemid;
                      let inputlength = otr0.getElementsByTagName('input').length;
                      if(inputlength>0){
                        if(inputlength==2){
                          otr0_1 = otr0.getElementsByTagName('input')[1]
                          itemid=otr0_1.getAttribute('data-id');
                        }else{
                          otr0_1 = otr0.getElementsByTagName('input')[0]
                          itemid=otr0_1.getAttribute('data-id');
                        }
                      }
                      if(itemid == d.id){
                        otr0 = oTr[j].children[10];
                        otr1 = oTr[j].children[11];
                        if (d.refrush == "1")
                        {
                          otr0.innerHTML="<font color=green>目录成功</font>";
                        }
                        else
                        {
                          otr0.innerHTML="<font color=red>目录失败</font>";
                        }
                        otr1.value=d.itemscode;
                      }
                    }
                  }
                }
              }
          }
      },
      itemIdPublic(){//所有选中的强检信息itemId  公共方法
        let arr=[]; //判断是否有选中的项目
        let alldatas=[];//存储选中的项目
        let datas1=""; //存储选中的任务id
        let oAllDataBox = document.getElementById('fromdata');
        let aAllInput = oAllDataBox.getElementsByTagName('input');
        let oTr = oAllDataBox.getElementsByTagName('tr')
        for(let i=0; i<aAllInput.length; i++){
            if(aAllInput[i].checked){
                arr.push(aAllInput[i])
            }
        }
        if(arr.length == 0){
           this.$alert('请选择项目', '提示', {
              confirmButtonText: '确定',
              callback: action => {
              }
            });
            return;
        }
        for(let i=0; i<oTr.length; i++){
          let otr0 = oTr[i].children[0];
          let otr0_1;
          let itemid;
          let inputlength = otr0.getElementsByTagName('input').length;
          if(inputlength>0){
            if(inputlength==2){
              otr0_1 = otr0.getElementsByTagName('input')[1]
              itemid=otr0_1.getAttribute('data-id');
            }else{
              otr0_1 = otr0.getElementsByTagName('input')[0]
              itemid=otr0_1.getAttribute('data-id');
            }
            if(otr0_1.checked){
              let obj = {
                itemid:itemid,  //项目序号
              };
              alldatas.push(obj)
            }
          }
        }
        alldatas.forEach((item,index) => {
            datas1+=item.itemid + ','
        });
        if (datas1.length>0) datas1=datas1.substring(0,datas1.length-1);
        return datas1
      },
      comment(){ //获取公告类型
        this.$api.tatistical.getCommon().then((res)=>{
          console.log(res)
          this.commentMt = res.data.data;
        })
      }
    },
    mounted() {
      document.getElementById('fromtop').addEventListener('scroll', this.rollerEvent, true);  // 监听（绑定）滚轮滚动事件
      this.comment();
    },
    destroyed () {
      document.getElementById('fromtop').removeEventListener('scroll', this.rollerEvent);   //  离开页面清除（移除）滚轮滚动事件
    },
    watch:{
      resData(val){
        resDatacnot = JSON.parse(val)
        this.allData(resDatacnot);
      }
    }
}
</script>

<style lang="scss" scoped>
.lxt_box{
    width: 100%;
    height:100%;
    overflow: hidden;
    .fromBox{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
        .boxtitle{
          margin-left: 0;
          font-size: 14px;
          color: #606266;
          line-height: 40px;
          height: 90px;
          border-bottom:  solid 1px #ccc;
          span{
            margin: 0 5px;
          }
        }
        .fromtop{
          width: 100%;
          height: 100%;
          margin-top: 10px;
          overflow-y:scroll
        }
        .fromtopmet{
          width: 99%;
          height: 50px;
          overflow: auto;
            table tr td{text-align: center;};
        }
    }
}
.dialog{
  color: blue;
  cursor:pointer
}


.catDack{
  font-size: 16px;
}
textarea{
  outline:none;resize:none;
}
.trForm{
  color: #909399;
  font-weight:bold;
}
#fromtop td{
  border-bottom: 1px solid #EBEEF5; padding-bottom: 10px; padding-top: 10px;
}




/deep/ .el-checkbox{ margin-right: 0}
</style>

<style>
#fromdata{
color: #787878;
}

#fromdata tr{
  text-align: center
}
#jobid{position: relative;}
.outline{width:90%;outline:none;resize:none; padding: 5px;}
.colorTel{ color: red; cursor: pointer;}
@media screen and (min-width: 0 \0 ) {
  .catDack{
    font-size: 16px;
  }   
}

</style>