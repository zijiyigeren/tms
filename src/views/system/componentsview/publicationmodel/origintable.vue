<template>
  <section class="dislogBox" :style="{
    padding: myStyle ? '20px 20px 0 20px' : '0'
  }">
    <div class="dislogBox_content" :style="{
      overflowY: myStyle ? 'visible':'auto'
    }">
      <div class="componentBoxs">
        <!-- 一级头部 -->
        <el-table
          :data="dataList"
          height="450"
          border stripe
          :header-cell-style="{ 'background-color': 'rgba(243,246,253,1)', 'color': '#606266', 'padding': '10px 0' }"
          style="width: 100%">

          <el-table-column
          
              v-bind="{
                  width:'55',
                  label:'',
                  resizable:false,
                  align:'center',
                  property:'',
              }"
          >
            <template slot-scope="{ row }">
                <el-checkbox v-model="row.checkCur" :label="0" @change="checkedCur(row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
          align="center"
           label="序号"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
          align="center"
            prop="name"
            label="模板名称"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="createTime"
            label="创建时间"
            >
            <template slot-scope="scope">
             {{scope.row.createTime | timeFn}}
            </template>
          </el-table-column>
          <el-table-column
          align="center"
            prop="items_itme_name"
            label="项目名称"
            >
          </el-table-column>
          <el-table-column
          align="center"
            prop="code"
            label="实检项目"
            >
          </el-table-column>
          <el-table-column
          align="center"
            prop="items_test_basis"
            label="检验依据"
            >
          </el-table-column>
          <el-table-column
          align="center"
            prop="items_test_room_name"
            label="检验科室"
            >
          </el-table-column>
          <el-table-column label="操作" width="220" align="center">

            <template slot-scope="scope">
              <el-button
                type="text" style="color:#32AFF0;marginLeft:6px;"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                type="text" style="color:#32AFF0;marginLeft:6px;"
                @click="handleSee(scope.$index, scope.row)">绑定项目</el-button>
              <el-button
                type="text" style="color:#32AFF0;marginLeft:6px;"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页器 -->
      
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
      </div>

      
      <!-- 绑定项目 -->
      <el-dialog
        v-if="bangdingmoban"
        title="绑定检验项目"
        :visible.sync="bindingproject"
        top="20px"
        width="100%"
        modal-append-to-body
        >
          <div style="height:500px">
            <sysproject 
              :singlechoice = true
              @sendId = parentId
              >
            </sysproject>
          </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="bindingproject = false">取 消</el-button>
          <el-button type="primary" @click="bindingproject = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 新增模板 -->
      <el-dialog
        title="新增模板"
        :visible.sync="recordtemplate"
        width="30%"
        >
        <div>
          <div class="incoupt">
            <label>原始记录模板：</label>
            <el-input placeholder="请输入名称" v-model="originalrecordtemplate" size="small" clearable name="clearInputValue" ></el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="recordtemplate = false">取 消</el-button>
          <el-button type="primary" @click="recordtemplatesave">确 定</el-button>
        </span>
      </el-dialog>

      
    </div>


  </section>
</template>

<script>
  import base from '@/api/base.js'
  import sysproject from '@/components/Systemproject.vue'
  export default {
    name: 'origintable',
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
        chenckBox :[],//存储选中的模板
        bindingproject:false,//绑定项目
        indexId:'',//存在当前选中检验项目的id
        recordtemplate:false,//新增、编辑原生记录模板
        originalrecordtemplate:'',//新增模板名称
        bangdingmoban:false,//销毁绑定模板组件
        src:'static/OriginalRecord/template/template.html'//编辑原始记录模板路径
      }
    },
    methods: {
      dataListData () {//一级列表展示数据
        this.dataList = []
        this.dataList = this.querydataChild.list;
        this.total = this.querydataChild.total;
       
        this.dataList.forEach(item => {
          this.$set(item,'checkCur',false)
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
      checkedCur(row){ //选中模板逻辑  复选框
        if(row.checkCur == true){
          this.chenckBox.push(row.id)
        }else{
          this.chenckBox.forEach((item,index) => {
              if(item == row.id){
                this.chenckBox.splice(index,1)
              }
          });
        }
      },
      handleDelete(index,row){//删除
        this.$api.paramsConfig.deleteAllId(row.id).then(res => {
          this.$confirm('您确定要删除吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.$alert(res.data.data, '信息提示', {
                dangerouslyUseHTMLString: true
              });
              this.$parent.queryselect()
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作',
                duration: 1500
              });
            });
        }).catch(res => {
            
            this.$alert(res.data.data, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        }) 
      },
      batchdeletion(){//批量删除
        if(this.chenckBox.length <= 0){
            this.$alert("请选择删除模板！", '信息提示', {
                dangerouslyUseHTMLString: true
            });
            return false;
        }
        this.$api.paramsConfig.deleteAllId(this.chenckBox.join()).then(res => {
            this.$confirm('您确定要删除选中的多条数据吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.$alert(res.data.data, '信息提示', {
                dangerouslyUseHTMLString: true
              });
              this.$parent.queryselect()
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作',
                duration: 1500
              });
            });
        }).catch(res => {
           
            this.$alert(res.data.data, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        }) 
      },
      handleSee(index,row){//绑定项目
        this.indexId = row.id;
        this.bindingproject =  true;
        this.bangdingmoban = true
      },
      parentId(val){//绑定项目 子组件发射回来的ID
        let itemId = val[0].id;//绑定的检验项目
        let templateId = this.indexId ;//点击的模板id
        this.$api.paramsConfig.bindids(itemId,templateId).then(res => {
            this.$alert(res.data.data, '信息提示', {
              dangerouslyUseHTMLString: true
            });
            this.bindingproject =  false;
            this.bangdingmoban = false
            this.$parent.queryselect();
        })
      },
      childnewlyadded(){ //新增
        this.recordtemplate = true
      },
      recordtemplatesave(){//新增 保存.
        // let filedata = new FormData()
        // let fromData2 = new File(['Hello World!'],this.originalrecordtemplate);
        // filedata.append('name',this.originalrecordtemplate) //id
        // filedata.append('id','') //模板名称
        // filedata.append('ssjson',fromData2) //模板json串文件  
        // filedata.append('excel',fromData2)//模板excel文件
        this.$api.paramsConfig.originalrecordsave(encodeURIComponent(this.originalrecordtemplate)).then(res => {
            this.$alert(res.data.data, '信息提示', {
              dangerouslyUseHTMLString: true
            });
            this.recordtemplate = false;
            this.originalrecordtemplate = '';
            this.$parent.queryselect()
        })
      },
      handleEdit(index,row){ //编辑
        window.open(this.src+'?id='+row.id, '_blank');
        window.refreshList = (id) =>{
          this.$parent.queryselect();// 刷新列表
        }
      },
      childrenExcelExport(){ //EXCEL导出
        let ids = []
        if(this.chenckBox.length==0){  //如果长度=0 表示未选择模板， 如果为选择模板则导出所以模板
          this.dataList.forEach(item => {
            ids.push(item.id)
          });
        }else{ //导出选中的模板
          ids = this.chenckBox
        }
        console.log(ids)
        // let data = {
        //   idList : ids
        // }
        this.$api.paramsConfig.checkExportExcelTemplate(ids).then(res => {
          return res;
        }).then((res)=>{
          const h = this.$createElement
          let stringResult = res.data.message.split(';');
          let arr = []
          stringResult.forEach(item => {
            let _t = h('p',item)
            arr.push(_t)
          });

          this.$confirm('提示', {
            title: '提示',
            message: h('div', arr),
            confirmButtonText: '继续下载',
            cancelButtonText: '取消'
          }).then(() => {
              this.postExcelFile(res.data.data,`${base.baseUrl}/sys/recordTemplate/exportExcel`);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作',
              duration: 1500
            });
          });
        }).catch((err)=>{
          let stringResult = err.data.message.split(';');
          let arr = []
          stringResult.forEach(item => {
            let _t = item+'<br />'
            arr.push(_t)
          });
          this.$alert(arr.join().replace(/,/,''), '信息提示', {
            dangerouslyUseHTMLString: true
          });
        })
      },
      postExcelFile(params, url) {
          // params是post请求需要的参数，url是请求url地址
          const form = document.createElement('form');
          form.style.display = 'none';
          form.action = url;
          form.method = 'post';
          document.body.appendChild(form);
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'idList';
          input.value = params;
          form.appendChild(input);
          form.submit();
          form.remove();
      },
    },
    filters: {
     timeFn(val){
        var now = new Date(val),
            y = now.getFullYear(),
            m = now.getMonth() + 1,
            d = now.getDate();
        return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) ;
      },
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
    
      
    },
    props: [
      'querydataChild', 'mypagesize', 'myStyle'
    ],
    components:{
      sysproject,
    },
    
  }
</script>
<style lang="scss" scoped>
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
  .cB_assembly {
    width: 100%;
    height: auto;
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

  .el-button+.el-button{
    margin-left: 0px !important;
  }
  .el-button--mini, .el-button--mini.is-round{
    padding: 7px 10px !important;
  }


  /* 处理ie11下字号太小问题 */
  @media screen and (min-width: 0 \0
  ) {
    button {
      font-size: 14px;
    }
  }
  
  .incoupt {
    width: 100%;
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
    width: 50%;
  }

  .incoupt .el-select {
    width: 60%;
  }

  .incoupt .el-select .el-input {
    width: 100%;
  }
  #newzeng{
    margin-top: 5px;
    margin-left: 10px;
  }


</style>
