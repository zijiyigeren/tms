<template>
  <div class="hello">
    <div class="inpBox">
      <div class="domeInput">
        <span>表单名称：</span>
        <el-input v-model="formName" placeholder="请输入内容"></el-input><b>*</b>
      </div>
      <div class="domeInput">
        <span>表单编号：</span>
        <el-input v-model="formCode" placeholder="请输入内容"></el-input><b>*</b>
      </div>
      <div class="domeInput">
        <span>预设模板：</span>
        <el-select v-model="value" placeholder="请选择"  @change="seaItem">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
            >
          </el-option>
        </el-select>
      </div>
    </div>
    <div>
        <vue-ueditor-wrap 
          v-model="msg" 
          :config="myConfig" 
          ref="myFormdesign" 
          mode="observer"
          :observerDebounceTime="100"
          @ready="ready"
          @beforeInit="addCustomButtom"
          >
        </vue-ueditor-wrap>
    </div>
    <br />
    <el-button type="primary" @click="conter()">保存</el-button>
    
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'     
import { resSole } from './adcformdesign'  
import { domeone,dometow } from './domes'  
// import { ADCFormDesignHelper } from '../../../static/js/ec_renderers'  
export default {
  name: 'ueditor',
  data () {
    return {
      msg:'',
      itemId:'',
      version:'',
      formName:'',
      formCode:'',
      myConfig: {
          autoHeightEnabled: false, // 编辑器不自动被内容撑高  
          initialFrameHeight: 450,// 初始容器高度
          initialFrameWidth: '100%',// 初始容器宽度
          // 上传文件接口（这个地址是为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
          serverUrl: '',
          // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
          UEDITOR_HOME_URL: 'static/ueditor/',
          elementPathEnabled:false, //是否启用元素路径，默认是true显示
          wordCount:false,  //是否开启字数统计
          toolbars: [
                      [
                        'fullscreen', 'source',
                        'undo', 'redo',
                        'bold', 'fontfamily',
                        'fontsize',
                        'indent', 'justifyleft',
                        'justifycenter',
                        'justifyright',
                        'justifyjustify',
                        'inserttable',
                        'deletetable',
                        'insertparagraphbeforetable',
                        'insertrow',
                        'deleterow',
                        'insertcol',
                        'deletecol',
                        'mergecells',
                        'mergeright',
                        'mergedown',
                        'splittocells',
                        'splittorows',
                        'splittocols',
                        'preview'
                      ],
          ]
      },
      options: [{
        value: 0,
        label: '预设一号模板'
      }, {
        value: 1,
        label: '预设二号模板',
        //disabled: true
      }, {
        value: 2,
        label: '预设三号模板'
      }],
      value: ''
    }
  },
  components: {
    VueUeditorWrap
  },
  props:['message'],
  created(){
    this.msg = '';
    this.itemId = '';
    this.version = '';
    this.formName = '';
    this.formCode = '';
    this.msg = this.message.contentHtml;
    this.itemId = this.message.id;
    this.version = this.message.editingTimes;
    this.formName = this.message.formName;
    this.formCode = this.message.formCode;
    
  },
  methods: {
   conter(){  // 保存，编辑
    let objE = document.createElement("div");
    objE.innerHTML = this.msg;
    let inputs = objE.getElementsByTagName('input');
    let textareas = objE.getElementsByTagName('textarea');
    let fromName = [] //存储表单name
    let fromTitle = [] //存储表单title
    let strName=''
    let strTitle=''
    for(let i=0; i < inputs.length; i++){
      if(inputs[i].title && inputs[i].name){
        fromName.push(inputs[i].name),
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

    if(this.message.id){ //编辑
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
      console.log(this.msg)
      this.$api.lxtinitial.putData(data).then(res=>{
          this.$alert('编辑成功', '提示', {
            dangerouslyUseHTMLString: true
          });
         this.$parent.openMsg();
      })
    }else{ //新增
      if(!this.formName || !this.formCode){
        this.$alert('必填项不能为空', '提示', {
            dangerouslyUseHTMLString: true
        });
        return;
      }
      let data = {
        columnID : strName, //富文本里面的所有表单name
        columnName : strTitle, //富文本里面的所有表单title
        contentHtml : encodeURIComponent(this.msg), // 富文本模板字符串
        dataSourceID:'0',
        delFlag:'0',
        enitTime:'', //获取当前时间
        formName:this.formName,//获取表单名词
        formCode:this.formCode, //表单编号
        editName:'xtqx', //登陆者名字
        formWrite:'0',
        id:'',  //新增id一般为空
        version:'0',  
      }
      this.$api.lxtinitial.cesui(data).then(res=>{
          console.log(res)
          this.$alert('保存成功', '提示', {
            dangerouslyUseHTMLString: true
          });
          this.$parent.openMsg();
      }).catch(err =>{
           console.log(err)
      })
    }
   },
   ready (editorInstance) {
    console.log(`编辑器实例${editorInstance.key}: `, editorInstance)
   },
   addCustomButtom (editorId) {
         window.UE.ADCFormDesignUrl = 'adcformdesign';
         let thin = this
         window.UE.registerUI('自定义表单', function(editor, uiName) {
          //注册按钮执行时的command命令，使用命令默认就会带有回退操作
          editor.registerCommand(uiName, {
              execCommand: function () {
                  editor.execCommand('adc_form_design');
              }
          });
          //创建一个button  
          var btn = new window.UE.ui.Button({
              //按钮的名字
              name: uiName,
              //提示
              title: uiName,
              //添加额外样式，指定icon图标，这里默认使用一个重复的icon
             // cssRules:  "background-image: url('../static/ueditor/themes/default/images/logo.png') !important;background-size: cover;",
              cssRules: 'background-position: -401px -40px;',
              //点击时执行的命令
              onclick: function() {
                  //这里可以不用执行命令,做你自己的操作也可
                 editor.execCommand(uiName); 
              }
          });
          
          //当点到编辑内容上时，按钮要做的状态反射
          editor.addListener('selectionchange', function() {
              var state = editor.queryCommandState(uiName);
              if (state == -1) {
                  btn.setDisabled(true);
                  btn.setChecked(false);
              } else {
                  btn.setDisabled(false);
                  btn.setChecked(state);
              }
          });
          //因为你是添加button,所以需要返回这个button
          return btn;
      });

     resSole(); //各种表单插入编辑器的逻辑

    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    seaItem(val){
      switch(val){
        case 0:
          this.msg = ''
          this.msg = domeone
        break;
        case 1:
          this.msg = ''
          this.msg = dometow
        break;
      }
    }
  },
 
  mounted() {
    
  },
  destroyed() {
    // this.editor.destroy();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.domeInput{
  width: 30%; display: inline-block
}
.domeInput span{
  float: left;
  color: #787878;
  height: 40px;
  line-height: 40px;
}
.domeInput b{ font-size: 20px; color:red; position: relative; top: 8px; left: 4px;}
.inpBox{ width: 100%; margin:20px auto; overflow: hidden;}
.domeInput .el-input{ width: 50%;}

  /* 新增/编辑上方输入框样式优化 */
    .card-show-edit .layui-form-label {
        padding: 5px 15px 5px 0;
        width: auto;
    }
</style>
