<template>
   <div>
       <div class="mather">
          
            <el-button type="primary" @click="adcform">新增表单</el-button>
             <el-input class="seachetleft"
                placeholder="请输入内容"
                v-model="seainput"
                clearable>
              </el-input>
              <el-button type="primary" class="seachetright" @click="seackclick()">搜索</el-button>
           
       </div>
       <div class="tableovfow">
                    <el-table
                    :data="tableListData"
                    border
                    
                    style="width: 100%">

                    <el-table-column
                      prop="serialNumber"
                      label="序号"
                      width="50"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="formName"
                      label="表单名称"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="formCode"
                      label="表单编号"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="creationTime"
                      label="创建时间"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="storageTime"
                      label="保存时间"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="founder"
                      label="创建人"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="depositary"
                      label="保存人"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="editingTimes"
                      label="编辑次数"
                    >
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      width="200">
                      <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="delClick(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  </div>
                  <!-- 自定义表单测试稿 分页 -->
                  <div class="pageseach">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage4"
                      :page-sizes="[10, 20, 30, 40]"
                      :page-size="pageSize4"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total=total4>
                    </el-pagination>
                  </div>
                  <!-- 自定义表单测试稿 分页 -->
    

<!-- 自定义表单测试稿 查看-->
        <div class="choice_statistics" v-if="see">
          <div class="el_dialog">
            <div class="el_dialog__header">
              <span>表结构</span>
              <el-button type="text" class="el_dialog_btnclose" @click="see=false">
                <i class="el-icon-close"></i>
              </el-button>
            </div>
            <div class="el_dialog__body" >
             
              <div ref="mban" class="objeitd">
              </div>
              <el-button type="primary" class="saveTable"  @click="saveBox">保存</el-button>
            </div>
             
            <div class="el_dialog__footer"></div>
          </div>
        </div>
<!-- 自定义表单测试稿 查看-->

<!-- 自定义表单测试稿 -->
        <div class="choice_statistics" v-if="statisticsVisible">
          <div class="el_dialog">
            <div class="el_dialog__header">
              <span>自定义表单</span>
              <el-button type="text" class="el_dialog_btnclose" @click="statisticsVisible=false">
                <i class="el-icon-close"></i>
              </el-button>
            </div>
            <div class="el_dialog__body">
              <richtext :message="msg" ></richtext>
            </div>
            <div class="el_dialog__footer"></div>
          </div>
        </div>
<!-- 自定义表单测试稿 -->


<!-- js增强 -->
<div class="choice_statistics" v-if="jsenhance">
  <div class="el_dialog">
    <div class="el_dialog__header">
      <span>js增强</span>
      <el-button type="text" class="el_dialog_btnclose" @click="jsenhance=false">
        <i class="el-icon-close"></i>
      </el-button>
    </div>
    <div class="el_dialog__body">
      <textarea ref="mycode" class="codesql" v-model="code" style="height:200px;width:600px;"></textarea>
      <el-button type="primary" class="saveTable2" >保存</el-button>
    </div>
    <div class="el_dialog__footer"></div>
  </div>
</div>
<!-- js增强 -->



   </div>
   
</template>
<script>
import richtext from './HelloWorld'
// js增强插件vue-codemirror
import 'codemirror/theme/ambiance.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
let CodeMirror = require('codemirror/lib/codemirror')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/selection/active-line')
require('codemirror/mode/sql/sql')
require('codemirror/addon/hint/show-hint')
require('codemirror/addon/hint/sql-hint')
// js增强插件vue-codemirror
export default {
   name: 'codeMirror',
    data () {
        return {
             // 测试
            statisticsVisible: false,
            opent:false,
            see:false,
            jsenhance:false,
            getdata:'',
            tableListData: [],
            msg: '111',
            currentPage4:1,
            pageSize4:10,
            total4:0,
            itemId:'',
            version:'',
            formName:'',
            formCode:'',
            seainput:'',
        // 测试

            code: '',

        }
    },
    
    components:{
        richtext,
    },
    methods:{
         // 测试
      handleSizeChange(val) {
        
        this.pageSize4 = val;
        this.openMsg();
      },
      handleCurrentChange(val) {
        
        this.currentPage4 = val;
        this.openMsg();
      },
      adcform(){
        this.statisticsVisible = true
        this.msg = '';
      },

      handleClick(row) { //查看
        this.see = true;
        let id = row.id
        this.$api.lxtinitial.getcesui(id).then((res)=>{
            let objE = document.createElement("div");
            objE.innerHTML = res.data.data.contentHtml;
            this.$refs.mban.appendChild(objE)
        }).then(()=>{
          this.ergodic() //  初始化  激活运算函数
        })
        this.itemId = row.id;
        this.version = row.editingTimes;
        this.formName = row.formName;
        this.formCode = row.formCode;

      },
      delClick(row){ //删除
        let id = row.id
        this.$api.lxtinitial.delData(id).then((res)=>{
            this.$alert('删除成功', '提示', {
              dangerouslyUseHTMLString: true
            });
            this.openMsg();
        })
      },
      editClick(row){ //编辑
        this.msg = row;  
        this.statisticsVisible = true;
      },
      openMsg(){
        this.opent = true;
        let pageNo = this.currentPage4
        let pageSize = this.pageSize4
        this.$api.lxtinitial.getListData(pageNo,pageSize).then((res)=>{
           this.total4 = res.data.data.count
           let listData = res.data.data.list;
           this.tableListData = [];
           listData.forEach((item,index) => {
              let obj = {
                  id:item.id,
                  formWrite:item.formWrite,
                  createAccount:item.createAccount,
                  contentHtml:item.contentHtml,
                  editor:item.editor,
                  dataSourceId:item.dataSourceId,
                  delFlag:item.delFlag,
                  columnName:item.columnName,
                  columnID:item.columnID,
                  design:item.design,
                  serialNumber: index+1,
                  formName: item.formName,
                  formCode: item.formCode,
                  creationTime: item.createTime,
                  storageTime: item.editTime,
                  founder: item.createName,
                  depositary:item.editName,
                  editingTimes: item.version 
              };
              this.tableListData.push(obj)
           });
        })

       



      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          }).catch(_ => {});
      },
      ergodic(){ // 激活
        let thin = this;
        let inputs = this.$refs.mban.getElementsByTagName('input');
        for(let i=0; i < inputs.length; i++){  
          //计算公式
          if(inputs[i].getAttribute('gformual') && !inputs[i].getAttribute('gDomain')){
            inputs[i].oninput = function(){
              thin.comput()
            }
          }
          //js增强
          if(inputs[i].getAttribute('enhance') == 'true'){
            inputs[i].onclick = function(){
              thin.jsenhance = true;
              thin.$nextTick(()=>{
                thin.enhance();
              })
            }
          }
        }
      },
      comput(){ //运算
        let inputPush = [];
        let endPush = [];
        let inputs = this.$refs.mban.getElementsByTagName('input');
        for(let i=0; i < inputs.length; i++){  
          //计算公式
          if(inputs[i].getAttribute('gformual')){
            if(inputs[i].getAttribute('gformual') && inputs[i].getAttribute('gDomain')){
              endPush.push(inputs[i])
            }else{
              inputPush.push(inputs[i])
            }
          }
          //计算公式
        }
        for(let i=0; i < endPush.length; i++){  
          let num = 0;
            for(let t=0; t < inputPush.length; t++){
                if(endPush[i].getAttribute('gformual')  == inputPush[t].getAttribute('gformual')){
                  //alert(endPush[i].getAttribute('gdomain'))
                  switch (endPush[i].getAttribute('gdomain')){
                      case 'plus':
                      num = inputPush[t].value*1 + num
                      break;
                      case 'reduce':
                      num = inputPush[t].value*1 - num
                      break;
                      case 'ride':
                        if(num == 0){
                          num  = inputPush[t].value
                        }else{
                          num = inputPush[t].value*1 * num
                        }
                        
                      break;
                      case 'except':
                        if(num == 0){
                          num  = inputPush[t].value
                        }else{
                          num = inputPush[t].value*1 / num
                        }
                      
                      break;
                  }
                }
            }
          endPush[i].value = num
        }
      },
      saveBox(){  // 保存
        // let objE = document.createElement("div");
        // objE.innerHTML = this.$refs.mban.innerHTML
        let inputs = this.$refs.mban.getElementsByTagName('input');
        let textareas = this.$refs.mban.getElementsByTagName('textarea');
        let fromName = [] //存储表单name
        let fromTitle = [] //存储表单title
        let strName=''
        let strTitle=''; 
        for(let i=0; i < inputs.length; i++){
          //表单检验
          if(inputs[i].getAttribute('adcform_validate')){
            switch (inputs[i].getAttribute('adcform_validate')){
              case 'adcformvalidate_mobile':
                var cellPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (!cellPhone.test(inputs[i].value)) {
                  alert('手机号输入有误')
                  return false;
                }
              break;
              case 'adcformvalidate_email':
                var mail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;     
                if (!mail.test(inputs[i].value)) {
                  alert('邮件输入有误')
                  return false;
                }
              break;
              case 'adcformvalidate_number':
                var numBer = /^[0-9]*$/;
                if (!numBer.test(inputs[i].value)) {
                  alert('只能输入数字')
                  return false;
                }
              break;
              case 'adcformvalidate_word':
                var myWord = /^[\u4e00-\u9fa5]{0,}$/;
                if (!myWord.test(inputs[i].value)) {
                  alert('只能输入汉字')
                  return false;
                }
              break;
              case 'adcformvalidate_english':
                var myEnglish = /^[A-Za-z]+$/;
                if (!myEnglish.test(inputs[i].value)) {
                  alert('只能输入英文')
                  return false;
                }
              break;
            }
          }
          //表单检验
          if(inputs[i].title && inputs[i].name){
            fromName.push(inputs[i].name)
            fromTitle.push(inputs[i].title) 
          }
        }
        for(let i=0; i < textareas.length; i++){
          if(textareas[i].title && textareas[i].name){
            fromName.push(textareas[i].name),
            fromTitle.push(textareas[i].title) 
          }
        }
        strName = fromName.join(",")
        strTitle = fromTitle.join(",")
        this.msg = this.$refs.mban.innerHTML
        if(!this.formName || !this.formCode){
            this.$alert('必填项不能为空', '提示', {
                dangerouslyUseHTMLString: true
            });
          }
          let data = {
            id: this.itemId,
            version: this.version+1,
            formName: this.formName,
            formCode: this.formCode,
            columnID: strName,
            columnName: strTitle,
            contentHtml: encodeURIComponent(this.msg),
            editTime: "2019/12/25 下午3:35:10",
            editName: "管理员1号"
          }
          // console.log(this.msg)
          // console.log(strName)
          // console.log(strTitle)
          this.$api.lxtinitial.putData(data).then(res=>{
              this.$alert('保存成功', '提示', {
                dangerouslyUseHTMLString: true
              });
            this.openMsg();
          })
      },
      seackclick(){
        let name = this.seainput.trim();
        let pageNo = this.currentPage4
        let pageSize = this.pageSize4
        this.$api.lxtinitial.seaListData(pageNo,pageSize,name).then((res)=>{
          this.total4 = res.data.data.count
          let listData = res.data.data.list;
          this.tableListData = [];
          listData.forEach((item,index) => {
              let obj = {
                  id:item.id,
                  formWrite:item.formWrite,
                  createAccount:item.createAccount,
                  contentHtml:item.contentHtml,
                  editor:item.editor,
                  dataSourceId:item.dataSourceId,
                  delFlag:item.delFlag,
                  columnName:item.columnName,
                  columnID:item.columnID,
                  design:item.design,
                  serialNumber: index+1,
                  formName: item.formName,
                  formCode: item.formCode,
                  creationTime: item.createTime,
                  storageTime: item.editTime,
                  founder: item.createName,
                  depositary:item.editName,
                  editingTimes: item.version 
              };
              this.tableListData.push(obj)
          })
        })
        this.seainput = ''
      },
      enhance(){
          let mime = 'text/x-mariadb'
          // let theme = 'ambiance'//设置主题，不设置的会使用默认主题
          let editor = CodeMirror.fromTextArea(this.$refs.mycode, {
            mode: mime, // 选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
            indentWithTabs: true,
            smartIndent: true,
            lineNumbers: true,
            matchBrackets: true,
            // theme: theme,
            // autofocus: true,
            // extraKeys: { Ctrl: 'autocomplete' }, // 自定义快捷键
            hintOptions: {
              // 自定义提示选项
              tables: {
                users: ['name', 'score', 'birthDate'],
                countries: ['name', 'population', 'size']
              }
            }
          })
          // 代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
          // editor.on('cursorActivity', function () {
          //   editor.showHint()
          // })
      }
    },
    mounted(){
      this.openMsg();
      
    }
}
</script>
<style lang="scss" scoped>
// <!-- 自定义表单测试稿 -->
  .choice_statistics {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  overflow: hidden;
  z-index: 1000;
}

.choice_statistics .el_dialog {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.choice_statistics .el_dialog .el_dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 18px;
    color: #303133;
  }
  .el_dialog_btnclose {
    padding: 0;
    margin: 0;
    width: 14px !important;
    height: 14px !important;
    i{
      font-size: 14px;
      color: #909399;
    }
  }
}

.choice_statistics .el_dialog .el_dialog__body {
  flex: 1;
  padding: 20px;
  overflow: hidden;
}

.tableovfow{ width: 100%; height: auto; }
.objeitd{width: 100%; height: 400px; overflow-y: scroll}
.pageseach{ width: 100%; border-top: 1px solid #EBEEF5; padding: 10px 0;}
.mather{ width: 98%; height: auto; margin: 10px auto;}

.saveTable{ width: 5%;}

.saveTable2{ width: 5%; margin-top: 10px;}

.seachetleft{ width: 30%;   display: inline-block;}
.seachetright{ width: 100px;   display: inline-block;}

// .choice_statistics .el_dialog .el_dialog__footer {
//   padding: 20px;
// }
// <!-- 自定义表单测试稿 -->

</style>