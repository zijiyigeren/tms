<template>
    <!-- 上传公共组件 -->
  <div class="box">
    <div class="fromBox">
      <div class="boxtitle">
        <el-button type="primary" size="small" @click="temporaryNumbering">临时获取整车整改实验方案编号</el-button>
        <!-- <el-button type="success" size="small" @click="goImpFile">导入厂家确认文件</el-button> -->
        <el-button type="info" size="small" @click="saveinformation">保存基本信息</el-button>
        <el-button type="warning" size="small" @click="uploadStatistics" id="staticbutton">上传统计表</el-button>
        <el-button type="warning" size="small" @click="uploadStatistics" id="staticbutton2">上传统计表</el-button>
         导入日期：<span>{{companyFlag}}</span> 保存时间：<span>{{flag}}</span>
      </div>
      
      <el-form ref="form" :model="form" label-width="200px" class="fromtop" > 
        <input type="hidden" name="d.ids" value="form.heiden.ids"/>
        <input type="hidden" name="st.ids" value="form.heiden.idstow"/>
        <input type="hidden" name="st.sampleRightPicPath" value="form.heiden.sampleRightPicPath"/>

        <el-form-item label="统计表编号：">
          <el-input v-model="form.name" class="frominput"></el-input>
          <el-button type="primary" size="small" v-if="bringintaskId == '' || bringintaskId == null || bringintaskId == undefined ? false : true  " @click="refresh">刷新</el-button>
        </el-form-item>
        <el-form-item label="样车及试验情况描述：">
          <el-input v-model="form.cart" class="frominput"></el-input>
        </el-form-item>
        <el-form-item label="企业ID：">
          <span>{{form.entId}}</span>
        </el-form-item>
        <el-form-item label="企业名称：">
          <span>{{form.entName}}</span>
        </el-form-item>
        <el-form-item label="产品型号：">
          <span>{{form.model}}</span>
        </el-form-item>
        <el-form-item label="产品名称：">
          <span>{{form.putname}}</span>
        </el-form-item>
        <el-form-item label="产品商标：">
          <span>{{form.brand}}</span>
        </el-form-item>
        <el-form-item label="车辆类型：">
          <el-input v-model="form.vehicleType" class="frominput"></el-input>
        </el-form-item>
        <el-form-item label="发动机类型：">
          <el-input v-model="form.engine" class="frominput"></el-input>
        </el-form-item>
        <el-form-item label="填报类别：" prop="region" >
          <el-select v-model="form.region" placeholder="请选择">
            <el-option
              v-for="item in form.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          &nbsp;检测类型是<span class="on">{{form.newType}}</span>
        </el-form-item>
        <el-form-item label="检验说明：">
          <el-input v-model="form.testOne" class="frominput"></el-input>
          <el-input v-model="form.testTow" class="frominput"></el-input>
        </el-form-item>
        <el-form-item label="进口件判定：">
          <el-input v-model="form.imported" class="frominput"></el-input>
        </el-form-item>
        <el-form-item label="定型报告编号：">
          <el-input v-model="form.stereotype" class="frominput"></el-input>
          &nbsp;<span class="on">{{form.flagMsg}}</span>&nbsp;
          <el-button type="primary" size="small" v-if='form.flagMsg' @click="trainingDirectory">上传定型目录</el-button>
          <el-button type="primary" size="small" v-if='form.flagMsg' @click="typingReport">上传定型报告</el-button>

        </el-form-item>
        <el-form-item label="批准，审核，编制：">
          <el-select v-model="form.ApprovalType" placeholder="请选择" class="selwidth">
            <el-option
              v-for="item in form.ApprovalTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="form.examine" placeholder="请选择" class="selwidth">
            <el-option
              v-for="item in form.examineOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>     
          <el-input v-model="form.landers" class="inputname"></el-input>
          <!-- <el-button type="primary" size="small" @click="passName('刘文营')">刘文营</el-button>
          <el-button type="primary" size="small" @click="passName('丁瑾')">丁瑾</el-button>
          <el-button type="primary" size="small" @click="passName('付松青')">付松青</el-button>
          <el-button type="primary" size="small" @click="passName('王涵')">王涵</el-button>
          <el-button type="primary" size="small" @click="passName('孙娜')">孙娜</el-button>
          <el-button type="primary" size="small" @click="passName('周佳')">周佳</el-button> -->
        </el-form-item>
        <el-form-item label="基础车型：">
          <el-input v-model="form.basics" class="frominput"></el-input>
        </el-form-item>
        <el-form-item label="实验方案编号：">
          <span>{{form.experimentScheme}}</span>
        </el-form-item>
        <el-form-item label="样车存放地点：">
          <el-input v-model="form.chinafirst" class="frominput"></el-input>
        </el-form-item>
        <el-form-item label="样车数量：">
          <el-input v-model="form.quantity" class="frominput"></el-input>
        </el-form-item>
        <el-form-item label="样车VIN：">
          <el-input v-model="form.sampleVin" class="frominput"></el-input>
          <el-button type="primary" size="small" @click="compareVIN">先比VIN</el-button>
          <el-button type="primary" size="small" @click="viewVIN">查看VIN</el-button>
        </el-form-item>
        <el-form-item label="报告VIN：">
          <span id="reportVin2">{{form.reportVin}}</span>
        </el-form-item>
        <el-form-item label="样车发动机：">
          <el-input v-model="form.sample" class="frominput"></el-input>
        </el-form-item>
        <el-form-item label="报告发动机：">
          <span id="reportEngine2">{{form.reportEngine}}</span>
        </el-form-item>
        <el-form-item label="下载文件：" v-if="form.downloadname">
          <span title="下载文件" @click="qudown" id="qudownipt">[下载文件]</span>
        </el-form-item>


      </el-form>
    </div>
    <object style="display: none" id="STATICTABLE" classid="clsid:0B846D4B-EB6C-4a15-A415-FF0785D39320" Width="0" Height="0"></object>
    <el-dialog 
      title="查看"
      :visible.sync="viewisible"
      width="30%"
      :fullscreen = true
      :before-close="handleClose">
      <viewvin :viewvindata = viewvindata></viewvin>
    </el-dialog>
  </div>
</template>
<script>
import viewvin from '@/views/programme/component/viewvin.vue';
import base from "@/api/base.js"
var basicnot ;

export default {
    name: 'publicinformation',
    components: {viewvin},
    props:['basic'],
    data() {
      return {
        
        viewisible: false,
        viewvindata:'',//查看vin数据的存储变量
        form: {
          downloadname:false,//下载
          name: '', //统计表编号
          cart:'', //样车及试验情况描述
          engine:'',//发动机类型：
          region:'',//填报类别
          options: [  //填报类别 下拉
            {
              value: 'qjtjb',
              label: 'qjtjb-新产品强检统计表'
            }, 
            {
              value: 'dxbg',
              label: 'dxbg-新产品定型报告'
            }, 
            {
              value: 'kwkz',
              label: 'kwkz-变更扩展强检统计表'
            }, 
            {
              value: 'gzkzdxbg',
              label: 'gzkzdxbg-变更扩展定型报告'
            }, 
            {
              value: 'zgcx_qjtjb',
              label: 'zgcx_qjtjb-强检统计表整改车型'
            }
          ],
          testOne:'',//检验说明
          testTow:'',//检验说明
          imported:'',//进口件判定
          stereotype:'',//定型报告编号：
          ApprovalType:'',//批准
          ApprovalTypeOptions: [  //批准 下拉
            {
              value: '周华',
              label: 'z_周华'
            }, 
            {
              value: '方茂东',
              label: 'f_方茂东'
            }, 
            {
              value: '刘玉光',
              label: 'l_刘玉光'
            }, 
            {
              value: '李宏光',
              label: 'l_李宏光'
            }, 
            {
              value: '范士宽',
              label: 'f_范士宽'
            }
          ],
          examine:'',//审核
          examineOptions: [  //审核 下拉
            {
              value: '陆红雨',
              label: 'l_陆红雨'
            }, 
            {
              value: '刘玉光',
              label: 'l_刘玉光'
            }, 
            {
              value: '李宏光',
              label: 'l_李宏光'
            }, 
            {
              value: '范士宽',
              label: 'f_范士宽'
            }, 
            {
              value: '高明秋',
              label: 'g_高明秋'
            },
            {
              value: '颜燕',
              label: 'y_颜燕'
            }, 
            {
              value: '白鹏',
              label: 'b_白鹏'
            }, 
            {
              value: '王阳',
              label: 'w_王阳'
            }, 
            {
              value: '杜天强',
              label: 'd_杜天强'
            }, 
            {
              value: '任山',
              label: 'r_任山'
            }
          ],
          landers:'', // 登陆者
          basics:'',//基础车型
          chinafirst:'',//样车存放地点
          quantity:'',//样车数量
          sampleVin:'',//样车VIN
          sample:'', //样车发动机
          entId:'', //企业id
          entName:'',//企业名称
          model:'',//产品型号
          putname:'',//产品名称
          brand:'',//产品商标
          vehicleType:'',//车辆类型
          experimentScheme : '',//实验方案编号
          reportVin:'',//报告VIN
          reportEngine:'',//报告发动机
          heiden:{
            ids:'',
            idstow:'',
            sampleRightPicPath:'',
          },
          flagMsg:'',//判断是显示 上传定型目录 和 上传定型报告 按钮
          newType:'',//检测类型状态
         
        },
        basicData:{},
        companyFlag:'',//导入日期
        flag:'',//保存时间
        goreplaceVIN : window.goreplaceVIN = (v)=>{
          this.form.sampleVin = v;
          this.saveinformation();
        },
        goreplaceVIN2 : window.goreplaceVIN2 = (v)=>{
          this.form.sample = v;
          this.saveinformation();
        },
        bringintaskId:'',//获取带入的编号
      };
    },
    methods: {
      qudown(){
        window.location.href = `${base.lxtbaseUrl}/StatisticalTableInfoController/download?id=${basicnot.st.dp.id}`
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      saveinformation(){ //保存基本信息
        let data= {
        "st":{
            "ids":this.form.heiden.idstow, //id
            "sampleRightPicPath":this.form.heiden.sampleRightPicPath,	//
            "statNumber":this.form.name,	//统计表编号
            "description":this.form.cart,	//样车及试验情况描述
            "vehicleType":this.form.vehicleType,	//车辆类型
            "engineType":this.form.engine,	//发动机类型
            "tableType": this.form.region,	//填报类别 |qjtjb(qjtjb-新产品强检统计表)|dxbg(dxbg-新产品定型报告)|kwkz(kwkz-变更扩展强检统计表)|gzkzdxbg(gzkzdxbg-变更扩展定型报告)|zgcx_qjtjb(zgcx_qjtjb-强检统计表整改车型)
            "testingNote":this.form.testOne,	//检验说明
            "importItems":this.form.imported,	//进口件判定
            "appNumber":this.form.stereotype,	//定型报告编号
            "approval": this.form.ApprovalType,	//批准，
            "audit":this.form.examine,	//审核，
            "preparation":this.form.landers,//编制
            "base":this.form.basics,	//基础车型
            "sampleAddress":this.form.chinafirst,	//样车存放地点
            "sampleCount":this.form.quantity,	//样车数量
            "sampleVin":this.form.sampleVin,	//样车VIN
            "sampleEngine":this.form.sample,	//样车发动机
          },
          "d":{
            "ids":basicnot.st.dp.id
          }
        }
        this.$api.tatistical.saveBasicInformation(data).then((res)=>{
          this.companyFlag = res.data.data.st.companyFlag;
            this.flag = res.data.data.st.flag;
            this.$alert('保存成功', '提示', {
              dangerouslyUseHTMLString: true
            });
        }).catch((error)=>{
          this.$alert(error.data.message, '提示', {
              dangerouslyUseHTMLString: true
            });
        })
      },
      temporaryNumbering(){ //临时获取整车整改实验方案编号
        let id = this.form.heiden.idstow //id
        this.$api.tatistical.vehicleRectification(id).then((res)=>{
          let str = `<center>实验编号  <font color=red>${res.data.data}</font></center>`
          this.$alert(str, '提示', {
            dangerouslyUseHTMLString: true
          });
        }).catch((error)=>{
          this.$alert(error.data.message, '提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      uploadStatistics(){//上传统计表
        let id = basicnot.st.dp.id;
        let diectory00=0;
        if(basicnot.st.dp.testInsId==basicnot.st.dp.appInsId){
              if (diectory00<=2){
                var dmes="定型报告目录与文件";
                if (diectory00==0){
                  dmes="定型报告目录与文件";
                }
                if (diectory00==1){
                  dmes="定型报告文件";
                }
                if (diectory00==2){
                  dmes="定型报告目录";
                  
                }
                if (confirm(dmes+"没有上传，确认继续上传统计表吗?")){
                  
                }else{
                  return ;
                }
              }
        }
         if (confirm("确认要上传统计报吗?")){
            this.$api.tatistical.statisticalTable(id).then((res)=>{
              this.$alert(res.data, '提示', {
                dangerouslyUseHTMLString: true
              });
            }).catch((error)=>{
                this.$alert(error.data.message, '提示', {
                  dangerouslyUseHTMLString: true
                });
            })
         }
        

      },
      passName(name){ //批准，审核，编制  根据选中的人员进行保存
        this.form.landers = name;
        this.$confirm('是否保存基本信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveinformation()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      trainingDirectory(){ //上传定型目录
        let codes = this.form.stereotype;
        let disid = basicnot.st.dp.id;
        let standard = '';

        this.$api.tatistical.uploadTraining(codes,disid,standard).then((res)=>{
          this.$alert(res.data.data, '提示', {
            dangerouslyUseHTMLString: true
          });
        }).catch((error)=>{
          this.$alert(error.data.message, '提示', {
            dangerouslyUseHTMLString: true
          });
        })
        
      },
      typingReport(){//上传定型报告
        let codes = this.form.stereotype; 
        this.$api.tatistical.uploadTrainingReport(codes).then((res)=>{
          this.$alert(res.data.data, '提示', {
            dangerouslyUseHTMLString: true
          });
        }).catch((error)=>{
            this.$alert(error.data.message, '提示', {
              dangerouslyUseHTMLString: true
            });
        })
      },
      compareVIN(){ //先比VIN
        let id = basicnot.st.id;  
        this.$api.tatistical.findVINDetail(id).then((res)=>{
          let data = res.data.data;
          document.getElementById("staticbutton").style.display="";
          var mes = data.mes.trim();
          var mes_syrq = data.mes_syrq; 
          if (mes_syrq!=null && mes_syrq.length>0){
              alert("统计表无法上传，因为： "+mes_syrq);

              document.getElementById("staticbutton").style.display="none";
          }else if (mes!=null && mes.length>0){
            alert(mes);
          }else{
            var data1=data.list[0];
            if (data1.comparestuats=="1")
            {
              this.form.reportVin="OK";
            }
            else
            {
              var shtml="<table width=\"100%\" border=\"1\" cellspacing=\"0\" align=\"center\">";
              
              shtml+="<tr>";
              shtml+="<td bgcolor=\"pink\" width=\"25%\">报告中的VIN</td>";
              shtml+="<td bgcolor=\"#FFFFFF\">"+data1.avin+"</td>";
              shtml+="</tr>";
              if (data1.comparestuats=="3")
              {
                shtml+="<tr>";
                  shtml+="<td bgcolor=\"pink\"  >样车VIN不在报告中</td>";
                  shtml+="<td bgcolor=\"#FFFFFF\">";
                  var datas = data1.list;
                  for (var j=0;j<datas.length;j++)
                  {
                    shtml+=datas[j].avin+"&nbsp;&nbsp;&nbsp;";
                  }
                  shtml+="</td>";
                  shtml+="</tr>";
                  shtml+="<tr>";
                shtml+="<td bgcolor=\"pink\">需要手工 验证</td>";
                shtml+="<td bgcolor=\"#FFFFFF\">1. 是否是非QA报告中的VIN<br/>2:如果是QA报告中的VIN，是企业填错还是实验员报告写错</td>";
                shtml+="</tr>";
              }
              else
              {
                shtml+="<tr>";
                shtml+="<td   colspan='2'>报告中的VIN多于样车VIN  <a href=\"javascript:goreplaceVIN('"+data1.avin+ "');\"'>替换</a></td>";
                shtml+="</tr>";
              }
              shtml+="<table>";
              document.getElementById("reportVin2").innerHTML=shtml;
            } 
            var data2=data.list[1];	
            if (data2.comparestuats=="1")
            {
              this.form.reportEngine="OK";
            }
            else
            {
              var shtml="<table width=\"100%\" border=\"1\" cellspacing=\"0\" align=\"center\">";
              shtml+="<tr>";
              shtml+="<td bgcolor=\"pink\" width=\"25%\">报告中的发动机(验证后请在上传统计表)</td>";
              shtml+="<td bgcolor=\"#FFFFFF\">"+data2.afdj+"</td>";
              shtml+="</tr>";
              if (data2.comparestuats=="3")
              {
                shtml+="<tr>";
                  shtml+="<td bgcolor=\"pink\"  >样车发动机不在报告中</td>";
                  shtml+="<td bgcolor=\"#FFFFFF\">";
                  var datas = data2.list;
                  for (var j=0;j<datas.length;j++)
                  {
                    shtml+=datas[j].afdj+"&nbsp;&nbsp;&nbsp;";
                  }
                  shtml+="</td>";
                  shtml+="</tr>";
                shtml+="<tr>";
                shtml+="<td bgcolor=\"pink\">需要手工 验证</td>";
                shtml+="<td bgcolor=\"#FFFFFF\">1. 是否是非QA报告中的发动机<br/>2:如果是QA报告中的发动机，是企业填错还是实验员报告写错</td>";
                shtml+="</tr>";
              }
              else
              {
                shtml+="<tr>";
                shtml+="<td   colspan='2'>报告中的VIN多于样车发动机  <a href=\"javascript:goreplaceVIN2('"+data2.afdj+ "');\"'>替换</a></td>";
                shtml+="</tr>";
              }
              shtml+="<table>";
              document.getElementById("reportEngine2").innerHTML = shtml
              
            }
          }
        })
      },
      viewVIN(){//查看VIN
        this.viewisible = true;
        let id = basicnot.st.id;
        this.$api.tatistical.lookVIN(id).then((res)=>{
          this.viewvindata = res.data.data
        })
      },
      
      goImpFile(){ //导入厂家确认文件
        var obj = document.getElementById("STATICTABLE");
        var webaddress = `${base.baseImgUrl}${base.lxtbaseUrl}/`;
        var t_mode=basicnot.st.dp.model;
        obj.startParseExecel(basicnot.st.dp.entName, basicnot.st.dp.name, t_mode, basicnot.st.dp.brand, webaddress, basicnot.st.id);
        this.staticimp()
      },
      staticimp(){	
        let _this = this;
        let id = JSON.parse(window.sessionStorage.getItem('zhongjiData'))
        _this.$api.tatistical.uploadingMachine(id).then((res)=>{ 
            basicnot = res.data.data;
            _this.bData();
        })
      },
          
      bData(){
        this.form.name = basicnot.st.statNumber;
        this.form.cart = basicnot.st.description;
        this.form.entId = basicnot.st.dp.entId;
        this.form.entName = basicnot.st.dp.entName;
        this.form.model = basicnot.st.dp.model;
        this.form.putname = basicnot.st.dp.name;
        this.form.brand = basicnot.st.dp.brand;
        this.form.vehicleType = basicnot.st.vehicleType;
        this.form.engine = basicnot.st.engineType;
        this.form.ApprovalType = basicnot.st.approval;
        this.form.examine = basicnot.st.audit;
        switch (basicnot.st.tableType){
          case 'qjtjb':
            this.form.region = this.form.options[0].value
          break;
          case 'dxbg':
            this.form.region = this.form.options[1].value
          break;
          case 'kwkz':
            this.form.region = this.form.options[2].value
          break;
          case 'gzkzdxbg':
            this.form.region = this.form.options[3].value
          break;
          case 'zgcx_qjtjb':
            this.form.region = this.form.options[4].value
          break;
        }
        this.form.testOne = basicnot.st.testingNote;
        this.form.imported = basicnot.st.importItems;
        this.form.stereotype = basicnot.st.appNumber;
        this.form.landers = basicnot.st.preparation; 
        this.form.basics = basicnot.st.base; 
        this.form.experimentScheme = basicnot.st.dp.testingNumber;
        this.form.chinafirst = basicnot.st.sampleAddress;
        this.form.quantity =  basicnot.st.sampleCount;
        this.form.sampleVin = basicnot.st.sampleVin;
        this.form.sample = basicnot.st.sampleEngine;
        this.form.heiden.ids = basicnot.d.ids;
        this.form.heiden.idstow = basicnot.st.ids;
        this.form.heiden.sampleRightPicPath = basicnot.st.sampleRightPicPath;
        this.companyFlag = basicnot.st.companyFlag;
        this.flag = basicnot.st.flag;
        if(basicnot.st.dp.testInsId==basicnot.st.dp.appInsId){
            this.form.flagMsg = true
        }else{
            this.form.flagMsg = false
        };
        this.form.newType = basicnot.st.dp.proType;
        if(basicnot.st.dp.filePath !=null){
          this.form.downloadname = true
        }
      },
      refresh(){
        let taskId = JSON.parse(window.sessionStorage.getItem('zhongjiTaskid'))
        this.$api.tatistical.getStartNumber(taskId).then((res)=>{ 
          this.form.name = res.data.data;
          this.$alert(res.data.message, '提示', {
            dangerouslyUseHTMLString: true
          });
        })
      }
    },
    created(){
      this.bringintaskId = JSON.parse(window.sessionStorage.getItem('zhongjiTaskid'))
    },
    watch:{
      companyFlag(val){
        this.companyFlag = val;
      },
      flag(val){
        this.flag = val;
      },
      basic(val){
        basicnot = JSON.parse(val)
        this.bData()
      }
    }
}
</script>

<style lang="scss" scoped>
.box{
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
          span{
            margin: 0 5px;
          }
        }
        .fromtop{
          width: 100%;
          height: 100%;
          margin-top: 10px;
          overflow: auto;
          span{
              font-size: 14px;
              color: #606266;
          }
          span.on{
            color:red;
          }
          .frominput{ width: 25%;}
          .inputname{width: 8.1%;}
        }
    }
    .selwidth{
      width: 100px;
    }
    #staticbutton{
      display: none;
    }
}
</style>
