<template>
  <section class="dislogBox">
      <div class="dislogBox_content">
      <el-button type="success" @click="configuration">列配置</el-button>
      <el-button type="success"  @click="getExport">导出Excel</el-button>
      <span><b class="red">总费用：</b>{{totalAccount}}</span>
     <el-table
        class="el_tables"
        :data="tableData"
        :span-method="objectSpanMethod"
        :height='hnum'
        border
        style="width: 100%; margin-top: 20px">
        <el-table-column 
            v-for="(item,index) in resArrData"
            :prop="item.prop" 
            :label="item.label" 
             align="center" 
            
            :key="index" 
            :v-if="item.falg">
        </el-table-column>
    </el-table>
    
    <el-dialog
    title="列配置"
    v-if="falgDialog"
    :visible.sync="dialogVisible"
    width="60%"
    :before-close="handleClose">
        <div id="ak">
            <div class="inspur-content">
            <div class="inspur-panel">
                <div class="inspur-panel-content">
                <form name="form1" method="post" action="" >
                    <!-- <input type="hidden" id='json1' name="json1" value="<s:property value="json1"/>"/>
                    <input type="hidden" id='json2' name="json2" value="<s:property value="json2"/>"/>
                    <input type="hidden" id='moduleName' name="moduleName" value="taskinfo"/>
                    <input type="hidden" id='attrs' name="attrs" value="<s:property value="attrs"/>"/> -->
                    <table class="table"  align="center">
                        <tr>  
                            <td style="width:30%">  
                                <h5>所有列</h5>
                            </td>  
                            <td align="center" style="width:20%;vertical-align: middle;">  
                                &nbsp;
                            </td>
                            <td style="width:30%">  
                                <h5>展示列</h5>
                            </td>
                            <td align="left"  style="width:20%;vertical-align: middle;">  
                                &nbsp;
                            </td>  
                        </tr>  
                        <tr>
                            <td style="width:30%">  
                                <select name="from" id="from" multiple="multiple" size="25" style="width:100%"> 

                                </select>  
                            </td>  
                            <td align="center" style="width:20%;vertical-align: middle;">  
                                <input type="button" class="btn btn-primary" id="addAll" value=" >> " style="width:50px;margin:5px;" /><br />  
                                <input type="button" class="btn btn-primary" id="addOne" value=" > " style="width:50px;margin:5px;" /><br />  
                                <input type="button" class="btn btn-primary" id="removeOne" value="&lt;" style="width:50px;margin:5px;" /><br />  
                                <input type="button" class="btn btn-primary" id="removeAll" value="&lt;&lt;" style="width:50px;margin:5px;" /><br />  
                                <input type="button" class="btn btn-primary" id="save" value="保存" style="width:50px;margin:5px;" /><br />  
                                <input type="button" class="btn btn-primary" id="close" value="关闭" style="width:50px;margin:5px;" /><br />  
                                
                            </td>  
                            <td style="width:30%">
                                <select name="to" id="to" multiple="multiple" size="25" style="width:100%">  
                                </select>  
                            </td>  
                            <td align="left"  style="width:20%;vertical-align: middle;">  
                                <input type="button" class="btn btn-primary" id="Top" value="顶部" style="width:110px;margin:5px;" /><br />  
                                <input type="button" class="btn btn-primary" id="Up" value="上移" style="width:110px;margin:5px;" /><br />  
                                <input type="button" class="btn btn-primary" id="Down" value="下移" style="width:110px;margin:5px;" /><br />  
                                <input type="button" class="btn btn-primary" id="Buttom" value="置底" style="width:110px;margin:5px;" /><br />  
                            </td>  
                        </tr>  
                    </table>  
                    </form>
                </div>
            </div>
        </div>
        </div>
    </el-dialog>
    <!-- 分页 -->
    <div class="lxt_block">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
        </el-pagination>
    </div>
    </div>
  </section>
</template>
<script>
  import base from "@/api/base.js"
  function sortOpion(selectID){
        var sltProvice = document.getElementById(selectID);
        var ops = sltProvice.getElementsByTagName("option");
        var arrOps = Array.prototype.slice.call(ops, 0);
        arrOps.sort(function (a, b) {
            return a.attributes["data-flag"].value - b.attributes["data-flag"].value;
        });
        sltProvice.options.length = 0;
        arrOps.map(function (op) {
            sltProvice.appendChild(op);
        });   
  }

  export default {
    name: 'realtime',
    data() {    
      return {
        tableData: [], // 表格数据存储
        hnum:0,//表格的高度
        currentPage: 1, // 当前页数  分页
        pageSize: 10,   //每页显示条数 分页
        total: 0,  // 总条数
        fromtable:[],
        resArrData:[],
        dialogVisible: false,
        spanArr: [],
        position: 0,
        falgDialog:false,
        totalAccount : 0, //总费用
      }
    },
    methods: {
        pageData(){
            this.total = this.allData.data.data.record;
            this.currentPage = this.allData.data.data.page;
            this.totalAccount = this.allData.data.data.totalAccount;
            // this.currentPage = this.allData.total;
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
           
            if (column.label === "任务号" || 
                column.label === "客户名称" || 
                column.label === "集团名称" || 
                column.label === "企业类型" || 
                column.label === "地区" || 
                column.label === "检验类型" || 
                column.label === "下达人" || 
                column.label === "号段" || 
                column.label === "财务状态" || 
                column.label === "总费用"){ 
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
        },
        seachemitData(){ //数据获取
            this.tableData = []
            this.myRowData.forEach((item, index)=>{
                if(item.TSIGN == 0){
                    item.TSIGN = "未标记"
                }
                if(item.TSIGN == 1){
                    item.TSIGN = "已经标记"
                }
                if(item.TSIGN == 2){
                    item.TSIGN = "已催款"
                }

                let obj = {
                        "COMPANY_CHECK": item.COMPANY_CHECK,
                        "TASK_CODE": item.TASK_CODE,
                        "CHECK_TYPE_ID": item.CHECK_TYPE_ID,
                        "TYPENAME": item.TYPENAME,
                        "CREATEDATE": item.CREATEDATE,
                        "IFROM": item.IFROM,
                        "COMMITERID": item.COMMITERID,
                        "NUMBER_TYPE": item.NUMBER_TYPE,
                        "TSIGN": item.TSIGN,
                        "NAME": item.NAME,
                        "ITEMSBASIS": item.ITEMSBASIS,
                        "ITEMS_FREDERICK_ITME": item.ITEMS_FREDERICK_ITME,
                        "ORGABC": item.ORGABC,
                        "CHARGES": item.CHARGES,
                        "TIMES": item.TIMES,
                        "ACCOUNT": item.ACCOUNT,
                        "SAMPLE_NAME": item.SAMPLE_NAME,
                        "SAMPLE_TRADEMARK": item.SAMPLE_TRADEMARK,
                        "SAMPLE_TYPE": item.SAMPLE_TYPE,
                        "DIRECTFLAG": item.DIRECTFLAG,
                        "DIRECTCACCOUNT": item.DIRECTCACCOUNT,
                        "MAXDATE": item.MAXDATE,
                        "INACCOUNT": item.INACCOUNT,
                        "MASTER": item.MASTER,
                        "ACCOUNTDATE": item.ACCOUNTDATE,
                        "TOTALACCOUNT":'',
                }
                this.tableData.push(obj)
            })
            let numIndex;
            let num = 0
            this.spanArr=[];
            this.tableData.forEach((item, index) => {
                if(this.tableData[index].DIRECTFLAG == 1){
                    this.tableData[index].TOTALACCOUNT = this.tableData[index].DIRECTCACCOUNT
                }else{
                    if(index === 0){
                        numIndex = 0;
                        num = this.tableData[index].ACCOUNT
                    }else{
                        if (this.tableData[index].TASK_CODE === this.tableData[index - 1].TASK_CODE){
                            num = num + this.tableData[index].ACCOUNT
                        }else{
                            num = this.tableData[index].ACCOUNT
                            numIndex = index
                        }
                    }
                    let connt = this.tableData[index].INACCOUNT
                    if(connt == null || connt == ''){
                        connt = 0
                    }
                    if(num > connt){
                        this.tableData[numIndex].TOTALACCOUNT = num
                    }else{
                        this.tableData[numIndex].TOTALACCOUNT = connt
                    }
                }
                if (index === 0) {
                    this.spanArr.push(1);
                    this.position = 0;
                } else {
                    if (this.tableData[index].TASK_CODE === this.tableData[index - 1].TASK_CODE) {
                        this.spanArr[this.position] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.position = index;
                    }
                }
            })  
            
        },
        getExport(){ //导出Excel
            this.$api.realtimequery.controller(this.$parent.conditionsData()).then((res)=>{
               if(res.data.respCode == 0){
                   let str = `报告将在后台生成...在此期间您可以做其他工作<br />
                            <font color='red'>稍后请在财务管理中--我的下载页面中下载此文件</font>`
                   this.$alert(str, '信息提示', {
                        dangerouslyUseHTMLString: true
                    });
               }
            })
        },
        bodyHeight(){// 计算表格的高度
            let oBodyh = document.documentElement.scrollHeight || document.body.scrollHeight  
            let percentage = oBodyh*0.52
            this.hnum = oBodyh -percentage
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
          .then(_ => {
            this.falgDialog = false
            done();
          })
          .catch(_ => {});
        },
        configuration(){ //列配置
            let thin = this;
            this.dialogVisible = true;
            this.falgDialog = true;
            let leftcol = '';
            let rightcol = '';
            this.$api.realtimequery.configCol().then((res)=>{
                leftcol = res.data.data.newallcolumns;
                rightcol = res.data.data.myColumns;
                $(function(){
                $("#from").css("height",450+"px"); 
                $("#to").css("height",450+"px"); 
                $("#addOne").click(function(){
                    $("#from option:selected").clone().appendTo("#to");  
                    $("#from option:selected").remove();
                    sortOpion("to");
                    sortOpion("from");
                });  
                $("#addAll").click(function(){  
                    $("#from option").clone().appendTo("#to");  
                    $("#from option").remove(); 
                    sortOpion("to");
                    sortOpion("from");
                });  
                $("#removeOne").click(function(){
                    var length =  $("#to option:selected").length;
                    for(var n = 0 ; n <length ; n++){
                        if($("#to option:selected")[n].text=='单价'||$("#to option:selected")[n].text=='次数'||$("#to option:selected")[n].text=='费用合计'){
                            $("#to option:selected")[n].selected= false;
                        }	        	}
                    $("#to option:selected").clone().appendTo("#from");  
                    $("#to option:selected").remove();  
                });  
                $("#removeAll").click(function(){
                    var length =  $("#to option").length;
                    for(var n = 0 ; n <length ; n++){
                        var selectedName = $("#to option")[n].text;
                        if( selectedName!='单价'&&selectedName!='次数'&&selectedName!='费用合计'){
                                $("#to option")[n].selected = true;
                        }
                    }
                    $("#to option:selected").clone().appendTo("#from");
                    $("#to option:selected").remove();  
                });  
                $("#Top").click(function(){  
                    var allOpts = $("#to option");  
                    var selected = $("#to option:selected");  
                    if(selected.get(0).index!=0){  
                        for(i=0;i<selected.length;i++){  
                            var item = $(selected.get(i));  
                            var top = $(allOpts.get(0));  
                            item.insertBefore(top);  
                        }  
                    }  
                });  
                $("#Up").click(function(){  
                    var selected = $("#to option:selected");  
                    if(selected.get(0).index!=0){  
                        selected.each(function(){  
                            $(this).prev().before($(this));  
                        });  
                    }  
                });  
                $("#Down").click(function(){  
                    var allOpts = $("#to option");  
                    var selected = $("#to option:selected");  
                    if(selected.get(selected.length-1).index!=allOpts.length-1){  
                        for(i=selected.length-1;i>=0;i--){  
                            var item = $(selected.get(i));  
                            item.insertAfter(item.next());  
                        }  
                    }  
                });  
                $("#Buttom").click(function(){  
                    var allOpts = $("#to option");  
                    var selected = $("#to option:selected");  
                    if(selected.get(selected.length-1).index!=allOpts.length-1){  
                        for(i=selected.length-1;i>=0;i--){  
                            var item = $(selected.get(i));  
                            var buttom = $(allOpts.get(length-1));  
                            item.insertAfter(buttom);  
                        }  
                    }  
                }); 
                $("#save").click(function(){  
                    var allOpts = $("#to option");  
                    var array = new Array(); 
                    var attrs = '';
                    allOpts.each(function(){ 
                        var value = $(this).val();
                        var txt = $(this).text(); 
                        value = value.replace('null','') 
                        array.push(value+"|"+txt); 
                        attrs += value+"|"+txt+",";
                    });

                    if(array.length == 0){
                        layer.alert("请选择！");
                    }else{
                        var moduleName = 'taskinfo';
                        let attrDate = encodeURIComponent(attrs)
                        thin.$api.realtimequery.saveData(attrDate,moduleName).then((res)=>{
                            thin.$parent.seachData();
                            thin.bodyHeight();
                        }) 
                    }
                }); 
                $("#close").click(function(){  
                   thin.dialogVisible = false;
                   thin.falgDialog = false;
                });
                var options = '';
                var json1 = leftcol;
                var json2 = rightcol;
                var allColumnJson = json1;
                for(var i =0;i<allColumnJson.length;i++){
                    options += '<option value="'+allColumnJson[i].columnName+'|'+allColumnJson[i].columnFormatter+'|'+allColumnJson[i].columnWidth+'" data-flag="'+allColumnJson[i].columnOrder+'">'+allColumnJson[i].columnLabel+'</option>';
                }
                $("#from").html(options);
                /* $("#save").click(function(){
                    document.form1.action="countStatistics!saveColumnConfig.action";
                    document.form1.formaction.attr="search";
                    document.form1.submit();  
                }); */
                options = '';
                var myColumnJson = json2;
                for(var i =0;i<myColumnJson.length;i++){
                    options += '<option value="'+myColumnJson[i].columnName+'|'+myColumnJson[i].columnFormatter+'|'+myColumnJson[i].columnWidth+'" data-flag="'+myColumnJson[i].columnOrder+'">'+myColumnJson[i].columnLabel+'</option>';
                }
                $("#to").html(options);
                })
                
            })
        },
        columnData(){//渲染列头
            this.resArrData = [];
            this.fromtable.forEach((item,index) => { //渲染列头
                let name = item.columnName.split('.')[1].toUpperCase()
                this.resArrData.push({ prop:name, label:item.columnLabel, key:Math.random() })
            });
            
            console.log(this.resArrData)
        },
        handleSizeChange(val) {
            this.$emit('cpage', val);
            this.$nextTick(res => {
                this.$parent.queryselect();
            })
        },
        handleCurrentChange(val) {
            this.$emit('current', val);
            this.$nextTick(res => {
                this.$parent.queryselect();
            })
        },
        myWindow(parentSel,parentQuery){
            let oHeaderHeight = 95;
            let oBody = document.documentElement.scrollHeight || document.body.scrollHeight
            let oDisLogBox = document.querySelector('.dislogBox');
            let oLxtBlock = document.querySelector('.lxt_block');
            oDisLogBox.style.height = oBody-oHeaderHeight - parentSel - parentQuery - oLxtBlock.offsetHeight  + 'px'
            oLxtBlock.style.width = "98%";
            oLxtBlock.style.position = "fixed";
            oLxtBlock.style.left = '1%';
            oLxtBlock.style.bottom = 15 + 'px'
            oLxtBlock.style.zIndex = 99
        }
    },
    props: [
     'myColumns','myRowData','emitConditions','allData'
    ],
    created(){
       this.bodyHeight();
    },
    mounted() {
        this.myWindow();
        
        window.onresize = () => {
            this.bodyHeight()
        };
      
    },
    watch:{
        myColumns(val){
            this.fromtable = val;
            this.columnData();  
        },
        myRowData(val){
            console.log(val)
            this.myRowData = val;
            this.seachemitData();
        },
        allData(){
            this.pageData();
        }
    }
    
  }
</script>
<style lang="scss" scoped>

.el-button--success{
    height: 30px;
    padding: 5px 20px;
    
  }
.table{width: 80%; margin: 0 auto;}

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
  .red{color: red; font-weight: 100}

  /deep/.el-table .cell{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  

</style>

