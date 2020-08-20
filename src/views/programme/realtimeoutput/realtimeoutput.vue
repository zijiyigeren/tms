<template>
  <!-- 报告校验 -->
    <section class="sectlxt">
        <div class="sectlxtBg">
        <div class="inBoxs" ref="inboxsHeight">
            <div class="inBoxsleft">
                <div class="dropdown">
                    <label>批准日期：</label>
                    <el-date-picker
                        v-model="approval"
                        value-format=”yyyy-MM-dd”
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                <div class="incoupt">
                    <label>科室：</label>
                    <el-select v-model="departmentvalue" placeholder="请选择"  size="small">
                        <el-option
                        v-for="item in department"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="incoupt">
                    <label>检验类型：</label>
                    <el-select v-model="testtypevalue" placeholder="请选择"  size="small">
                        <el-option
                        v-for="item in testtype"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="incoupt">
                    <label>项目名称：</label>
                    <!--  @keyup.enter.native="queryselect"  -->
                    <el-input  placeholder="请输入内容" v-model="projectname" clearable  size="small" name="clearInputValue" @keyup.enter.native="queryselect"></el-input>
                </div>
                <div class="incoupt">
                    <label>企业级别：</label>
                    <el-select v-model="enterpriselevelvalue" placeholder="请选择"  size="small">
                        <el-option
                        v-for="item in enterpriselevel"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <el-collapse-transition >
                    <div v-show="show" class="showItem">
                        <div class="dropdown">
                            <label>任务下发日期：</label>
                            <el-date-picker
                                v-model="taskissuedate"
                                value-format=”yyyy-MM-dd”
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker> 
                        </div>
                        <div class="incoupt">
                            <label>地区：</label>
                            <el-select v-model="areavalue" placeholder="请选择"  size="small">
                                <el-option
                                v-for="item in area"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        
                        <div class="incoupt">
                            <label>财务标记状态：</label>
                            <el-select v-model="financialvalue" placeholder="请选择"  size="small">
                                <el-option
                                v-for="item in financial "
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="incoupt">
                            <label>集团：</label>
                            <el-input  placeholder="请输入内容" v-model="group" clearable  size="small"   name="clearInputValue" @keyup.enter.native="queryselect"></el-input>
                        </div>
                        <div class="incoupt">
                            <label>客户：</label>
                            <el-input  placeholder="请输入内容" v-model="customer" clearable  size="small" name="clearInputValue" @keyup.enter.native="queryselect"></el-input>
                        </div>
                    </div>
                </el-collapse-transition>
            </div>
            <div class="inBoxsright">
                <el-button v-if="showbut==0" @click="clickshowbut(1)" type="text" style="color:#32AFF0;marginLeft:6px;">
                        收起    <i class="el-icon-arrow-up"></i>
                    </el-button>
                    <el-button v-if="showbut!=0" @click="clickshowbut(0)" type="text" style="color:#32AFF0;marginLeft:6px;">
                        展开    <i class="el-icon-arrow-down"></i>
                </el-button>
            </div>
        </div>
        <div class="lxt_selsctBtn">
            <el-button type="primary" @click="queryselect">查询</el-button>
            
        </div>

        <!-- 查询结果 -->
        <div class="selsctop">
           <realtime 
                ref="bodyHeight"
                :myColumns = myColumns
                :myRowData = myRowData 
                :allData = allData
                @cpage = getCpage 
                @current = getCurrent>
            </realtime>
        </div>
    </div>
    </section>
</template>
<script>
import realtime from './realtime'
export default {
    name:'realtimeoutput',
    data(){
        return {
            show: false, // 筛选条件的显示和隐藏
            showbut: 1, // 展开和收起的切换
            approval: '', // 批准日期
            departmentvalue:'',//科室 默认值
            department:[],//科室  下拉
            testtypevalue:'',//检验类型 默认值
            testtype:[],//检验类型
            projectname:'',//项目名称
            enterpriselevelvalue:'',// 企业级别  默认值
            enterpriselevel:[],// 企业级别
            taskissuedate:'',// 任务下发日期   
            areavalue:'',//地区 默认值
            area:[],//地区 下拉
            financialvalue:'',// 财务标记状态  默认值
            financial:[],// 财务标记状态  下拉
            group:'',// 集团
            customer:'',//客户
            myColumns:'',//当前展示的哪几列的数据
            myRowData:'',//请求到的的数据
            rowList : '', //每页显示的条数
            page : '',//分页码
            allData:'',//传递给子组件所有数据
        }
    },
    methods:{
        getCpage(data){
            this.rowList = data
        },
        getCurrent(data){
            this.page = data
        },
        clickshowbut(num) { // 筛选条件的显示和隐藏
            let ct = 0
            this.show = !this.show;
            this.showbut = num;
            this.show ? ct = 117 : ct = 64;
            window.sessionStorage.setItem('h',ct);
            this.$refs.bodyHeight.bodyHeight();
        },
        conversion(array){
            let publicconversion;
            if(array){
                let statr = array[0].replace(/\”/g,"");
                let end = array[1].replace(/\”/g,"");
                publicconversion = `${statr}to${end}`
            }else{
                publicconversion = '';
            }
            return publicconversion
        },
        conversion2(array){
            let publicconversion;
            if(array){
                let statr = array[0].replace(/-/g, "").replace(/\”/g,"");
                let end = array[1].replace(/-/g, "").replace(/\”/g,"");
                publicconversion = `${statr}to${end}`
            }else{
                publicconversion = '';
            }
            return publicconversion
        },
        conditionsData(){ //查询条件
            // "2019-12-18to2020-01-22"
            let ymd1=this.conversion(this.approval);
            let ymd2=this.conversion(this.taskissuedate);
            let ymd3=this.conversion2(this.taskissuedate);
            let conditions = encodeURI(JSON.stringify(
				{
                    maxdate : ymd1,
                    approvalYear1: ymd1.split("to")[0].split("-")[0],
                    approvalYear2: ymd1.split("to")[1].split("-")[0],
                    approvalMonth1: ymd1.split("to")[0].split("-")[1],
                    approvalMonth2: ymd1.split("to")[1].split("-")[1],
                    approvalDay1: ymd1.split("to")[0].split("-")[2],
                    approvalDay2: ymd1.split("to")[1].split("-")[2],
                    orgabc : this.departmentvalue,
                    check_type_id : this.testtypevalue,
                    createdate : ymd3,
                    taskSentYear1: ymd2.split("to")[0].split("-")[0],
                    taskSentYear2: ymd2.split("to")[1].split("-")[0],
                    taskSentMonth1: ymd2.split("to")[0].split("-")[1],
                    taskSentMonth2: ymd2.split("to")[1].split("-")[1],
                    taskSentDay1: ymd2.split("to")[0].split("-")[2],
                    taskSentDay2: ymd2.split("to")[1].split("-")[2],
                    ifrom :this.areavalue,
                    tsign : this.financialvalue,
                    enterprise_group : this.group,
                    company_check : this.customer,
                    name : this.projectname,
                    enterpriseLevel:this.enterpriselevelvalue
				}
             ));
             return conditions;
        },
        queryselect(){  //查询按钮  
            if(!this.rowList){
                this.rowList = 10;
            }
            if(!this.page){
                this.page = 1;
            }
            this.$api.realtimequery.queryData(this.conditionsData(),this.rowList,this.page).then((res)=>{
                console.log(res)
                if(res.data.respCode == 0){
                    let data = res.data.data.dataList
                    this.myRowData = data;
                    this.allData = res
                }
            })
        },
        seachData(){//获取数据
            this.$api.realtimequery.initData().then((res)=>{
                this.department = [];
                this.testtype = [];
                this.enterpriselevel = [];
                this.area = [];
                this.financial = [];
                if(res.data.respCode == 0){
                    let depart = res.data.data.dept.list //科室数据
                    this.department.push({value: '',label: '全部'}) 
                    depart.forEach((item) => {
                        let obj = {value: item.org_abc, label: item.org_name}
                        this.department.push(obj)
                    });
                    let testType = res.data.data.pt.list //检验类型
                    this.testtype.push({value: '',label: '全部'}) 
                    testType.forEach((item) => {
                        let obj = {value: item.typeABC,label: `${item.typeName}-${item.typeABC}`}
                        this.testtype.push(obj)
                    });
                    let enter = res.data.data.pt12.list //企业级别
                    this.enterpriselevel.push({value: '',label: '全部'}) 
                    enter.forEach((item) => {
                        let obj = {value: item.typeABC, label: item.typeName}
                        this.enterpriselevel.push(obj)
                    });
                    let areaData = res.data.data.pt5.list //地区
                    this.area.push({value: '',label: '全部'}) 
                    areaData.forEach((item) => {
                        let obj = {value: item.typeABC, label: `${item.typeName}-${item.typeABC}`}
                        this.area.push(obj)
                    });
                    let financialData = [
                        {value: '',label: '全部'},
                        {value: 0,label: '未标记'},
                        {value: 1,label: '已经标记'},
                        {value: 2,label: '已催款'}
                    ] //财务标记状态
                    financialData.forEach((item) => {
                        let obj = {value: item.value, label: item.label}
                        this.financial.push(obj)
                    });
                    this.myColumns = res.data.data.myColumns //当前展示的哪几列的数据
                }
            }).catch((error)=>{
                this.$alert(error.data.message, '信息提示', {
                    dangerouslyUseHTMLString: true
                });
            })

        },
        defaultDate(){
            let date = new Date()
            let year = date.getFullYear().toString()   //'2019'
            let month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString()  //'12'
            let da = date.getDate() < 10 ? '0'+date.getDate().toString():date.getDate().toString()  //'09'
            let end = '”'+year + '-' + month + '-' + da + '”' 
            let beg = '”'+ year + '-' + month + '-01' + '”'  
            this.approval = [beg,end] 
            this.taskissuedate = [beg,end]
        }
    },
    mounted(){
    },
    created () {
       this.seachData();
       this.defaultDate();
    },
    components:{
        realtime
    },
    watch:{
       
    },
}
</script>
<style lang="less"  scoped>
.inBoxs{ width: 98.8%; display: flex; align-items: center; flex-wrap:wrap; background-color: #fff; margin:5px auto 0; padding-bottom: 10px;}

.incoupt{ width: 18%; height: 40px; line-height: 40px; display: flex;  margin-top: 1%}
.incoupt label{ width: 110px; text-align: right; font-size: 14px;
    color: #606266;}
.incoupt .el-input{width: 60%;}
.incoupt .el-select{width: 60%;}
.incoupt .el-select .el-input{width: 100%;}


.dropdown{ width: 28%; height: 40px; line-height: 40px; display: flex;  margin-top: 1%}
.dropdown label{ width: 180px; text-align: right; font-size: 14px;
    color: #606266;}

.lxt_selsctBtn{
    width: 100%;
    text-align: right;
    margin-bottom: 1vw;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    padding-bottom: 1vw;
    margin-left: 0;
  .el-button--primary{
    height: 30px;
    padding: 5px 20px;
    background: linear-gradient(90deg, rgb(96, 157, 248), rgb(84, 183, 235));
  }
  .el-button--info{
    height: 30px;
    padding: 5px 20px;
  }
}
.sectlxt{
    background-color: #eee;

     .sectlxtBg{
        width: 98.8%;
        height: 97%;
        background-color: #fff;
        margin: 10px auto 0;
        padding: 1px 10px 10px 10px;
        overflow: hidden;
        
     }

}
.selsctop {
    width: 100%;
    flex-wrap: wrap;
    position: relative;
  }
  .showcont{
    overflow: hidden;
  }
.showItem{ width: 100%;  display: flex;  flex-wrap:wrap;}
.inBoxsleft{ width: 96%; display: flex;  flex-wrap:wrap;}
.inBoxsright{width: 4%;}
.inBoxsright button{ margin-top: 1vw;}
.selsctop {
    width: 100%;
    flex-wrap: wrap;
    position: relative;
  }
/deep/.el-loading-spinner{
   width: 100%;
   margin-top: -21px;
   text-align: center;
}
/deep/.el-date-editor .el-range-separator{
    padding : 0 15px 0 0
}
/deep/.el-date-editor .el-range-input{
    padding-top: 2px;
}
</style>
