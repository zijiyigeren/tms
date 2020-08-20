<template>
    <!-- 公章类型 -->
    <div class="cachetallot">
        <div class="cachetallot_top">
            <el-row>
              <el-button type="primary" @click="clickBindingradd" style="
                    height: 30px;
                    padding: 0 20px;
                    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
                    color:#fff;
                ">新增</el-button>
            </el-row>
        </div>
        <div class="cachetallot_tabel" >
            <div class="cachetallot_tabel_box">
                <el-table
                    :data="tableData"
                    stripe
                    :header-cell-style="{
                        'background-color': 'rgba(243,246,253,1)',
                        'color': '#606266',
                        'padding': '10px 0'
                    }"
                    :border="true">
                    <el-table-column
                        prop="name"
                        label="名称"
                        align="center"
                        :resizable="false">
                    </el-table-column>
                    <el-table-column
                        prop="operation"
                        label="操作"
                        align="center"
                        :resizable="false">
                    <template slot-scope="scope">
                            <el-button type="text" @click="handleEditor(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="text" @click="handleDelete(scope.$index, scope.row)" style="color:red;">删除</el-button>
                            <el-button type="text" @click="handleBindingr(scope.$index, scope.row)">绑定</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 编辑 -->
        <!-- // 绑定 -->
        <el-dialog
            :visible.sync="dialogBindingr"
            lock-scroll
            custom-class="Bindingrdia"
            :before-close="handleClose"
            :title="tit">
            <!-- --- -->
                <Shuttle @id="ids" @idRight="idRight" :dataL="unbounded" :dataR="binding"/>
            <!-- --- -->
            <span slot="footer" class="dialog-footer" :center="true" width="100%">
                <el-button @click="dialogBindingr = false">取 消</el-button>
                <el-button type="primary" @click="dialogsave">确 定</el-button>
            </span>
        </el-dialog>
        <!-- //新建 -->
        <el-dialog
            :visible.sync="dialogAdd"
            lock-scroll
            custom-class="dialogAddBindingradd"
            :before-close="handleDialogClose"
            :title="titles" style="width:100%;">
            <el-form ref="formtypes" :model="form" label-width="auto" style="margin-left:20%;">
                <el-form-item label="类型 : "
                prop="types"
                :rules="[
                    { required: true, message: '类型值不能为空', trigger: 'blur'},
                    { min:1,max:20, message: '长度不能大于二十位字符'}
                ]">
                    <el-input size="small" v-model.trim="form.types" style="width:70%;" placeholder="请输入类型"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" :center="true" style="width:100%;text-align:center;">
                <el-button @click="handleDialogClose">取 消</el-button>
                <el-button type="primary" @click="addhanel">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 更改 -->
        <el-dialog
            :visible.sync="dialogEditor"
            :title="title"
            lock-scroll
            custom-class="dialogAddBindingradd"
            :before-close="handledialogEditorClose">
            <el-form ref="formtype" :model="form" label-width="80px" style="margin-left:20%;">
                <el-form-item label="类型 : "
                prop="type"
                :rules="[
                    { required: true, message: '修改值不能为空'},
                    { min:1,max:20, required: true, message: '长度不能大于二十位字符'}
                ]">
                    <el-input size="small" v-model.trim="form.type" style="width:70%;"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" :center="true" width="100%">
                <el-button @click="handledialogEditorClose">取 消</el-button>
                <el-button type="primary" @click="editorhanel">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Shuttle from '@/components/Shuttle.vue'
export default {
    name:'Cachetallot',
    data(){
        return {
          title:'编辑',
          titles:'添加',
          tit:'绑定',
          tableData: [],
          dialogVisible: false,
          dialogBindingr: false,
          dialogAdd: false,
          dialogEditor: false,
          binding: [], // 已绑定
          unbounded: [],//未绑定
          putid: '',
          arr: [],
          str: "",
          id:'',
          form:{
            type: '',
            types:''
          },
        }
    },
    components:{
        Shuttle
    },
    created(){
        this.findlist()
    },
    methods: {
        handleClose(done) {
            done();
         },
         // 获取列表数据
        findlist(){
            this.$api.cachetallot.findList().then(res=>{
                this.tableData = res.data.data
            })
        },
        ids(id){
            this.binding.push(this.unbounded.find(item=>item.id === id))
            this.arr= this.unbounded.filter(item=>item.id != id)
            this.unbounded = this.arr
        },
        idRight(id){
            this.unbounded.push(this.binding.find(item=>item.id === id))
            this.arr= this.binding.filter(item=>item.id != id)
            this.binding = this.arr
        },
        dialogsave(){
            let strs = ''
            let sss = ''
            let ipd = ''
           this.binding.map(item=>{
                strs += item.id+','
           })
           sss = strs
           let index = sss.lastIndexOf(",")
           this.str = sss.substring(0,index)
            console.log(this.str)
            this.$api.cachetallot.bindCachet(this.str,JSON.stringify(this.putid)).then(res=>{
                console.log(res)
                if(res.status === 200){
                    this.dialogBindingr = false
                }
            })
        },
        // 点击编辑
        handleEditor(index,row){
            this.dialogEditor = true
            this.id = row.id
            this.form.type = row.name
        },
        // 编辑-确定
        editorhanel(){
            this.$refs.formtype.validate((valid) => {
                if (valid) {
                    let obj={
                        id : this.id,
                        name : this.form.type
                    }
                    this.$api.cachetallot.saveCachets(obj).then(res=>{
                        res.data.ok ? this.$message({
                            type: 'success',
                            message: res.data.data,
                            duration: 1500
                        }) : this.$message({
                            type: 'success',
                            message: res.data.message,
                            duration: 1500
                        });
                        this.dialogEditor = false;
                        this.findlist();
                        this.$refs.formtype.resetFields();
                    }).catch((error) => {
                        this.$message.error(error.data.message);
                        this.$refs.formtype.resetFields();
                    });
                }
            })
        },
        // 关闭编辑对话框
        handledialogEditorClose(){
            this.dialogEditor = false;
            this.$refs.formtype.resetFields();
        },
        // 点击新增
        clickBindingradd(){
            this.dialogAdd = true;
            this.form = {
                type : '',
                types : ''
            };
        },
        // 新增-确定
        addhanel(){
            this.$refs.formtypes.validate((valid) => {
                if (valid) {
                    let name ={
                        name:this.form.types
                    }
                    this.$api.cachetallot.saveCachet(name).then(res=>{
                        res.data.ok ? this.$message({
                            type: 'success',
                            message: res.data.data,
                            duration: 1500
                        }) : this.$message({
                            type: 'success',
                            message: res.data.message,
                            duration: 1500
                        });
                        this.dialogAdd = false;
                        this.findlist();
                    }).catch((error) => {
                        this.dialogAdd = false;
                        this.$message.error(error.data.message);
                    });
                    this.$refs.formtypes.resetFields();
                 }
            })
        },
        // 关闭新增对话框
        handleDialogClose() {
            this.dialogAdd = false;
            this.$refs.formtypes.resetFields();
        },
        // 点击删除
        handleDelete(index,row){
            this.$confirm('此操作将删除该类型, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                let id = row.id
                this.$api.cachetallot.delete(id).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功',
                        duration: 1500
                    })
                    this.findlist();
                }).catch((error) => {
                    this.$message.error(error.data.message);
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除',
                    duration: 1500
                });
            });
        },
        // 点击绑定
        handleBindingr(index,row){
            this.dialogBindingr = true
            let id = row.id
            this.putid = row.id
            this.$api.cachetallot.findUncachet(id).then(res=>{
                this.unbounded = res.data.data;
            })
            this.$api.cachetallot.findCachets(id).then(res=>{
                this.binding = res.data.data;
            })
        },
    }
}
</script>
<style lang="scss" scoped>
*{
    box-sizing:content-box;
}
.cachetallot{
    display: flex;
    flex-direction: column;
    background: #eee;
    padding: 10px;
    overflow: hidden;
}
.cachetallot_top{
    width: 100%;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    align-items: center;
    overflow: hidden;
}
.el-table .warning-row{
	background:#F3F9FF;
}
.cachetallot_top b{
    font-size: 20px;
    font-weight: 900;
    height: 50%;
}
.cachetallot .Visibledia{
    width: 80%;
    height: 80%;
    position: relative;
}
.cachetallot_tabel{
    flex: 1;
    background: #fff;
    padding: 0 20px 20px 20px;
    overflow: hidden;
}
.cachetallot_tabel_box {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}
.Visibledia .el-dialog__footer{
    text-align: center;
    position: absolute;
    bottom: 10px;
    left: 50%;
    margin-left: -10%;
}
.cachetallot .Bindingrdia{
    width: 40%;
    height: 60%;
    position: relative;
}
.Bindingrdia .el-dialog__footer{
    text-align: center;
    position: absolute;
    bottom: 10px;
    left: 50%;
    margin-left: -18%;
}
.cachetallot .dialogAddBindingradd{
    width: 40%;
    height: 40%;
    position: relative;
}
.dialogAddBindingradd .el-dialog__footer{
    text-align: center;
}

.el-button--default {
  min-width: 68px;
  height: 30px;
  border-radius: 2px;
  padding: 0 20px;
  margin: 0;
  box-sizing: border-box;
}

.el-button--primary {
  min-width: 68px;
  height:30px;
  background:linear-gradient(90deg,rgba(96,157,248,1),rgba(84,183,235,1));
  border-radius:2px;
  padding: 0 20px;
  margin: 0;
  box-sizing: border-box;
}

/deep/ .el-dialog__footer{
    text-align: center;
}
/deep/ .el-dialog__wrapper .el-dialog{
    width: 40%;
}
</style>
