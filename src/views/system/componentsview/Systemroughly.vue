<template>
    <!-- 号段管理 -->
    <div class="roughly" style="overflow:hidden;">
        <div class="roughly_top">
            <div class="roughly_top_border">
                <b>年份 :</b>
                <el-select v-model="values" size="small" placeholder="请选择年份" style="width:186px;margin:0 10px;" @change="sel">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <b>号码 :</b>
                <el-input v-model="input" size="small" placeholder="请输入内容" style="margin:10px;width: 186px;" name="clearInputValue"></el-input>
                <el-row>
                    <el-button type="primary" size="small" :plain="true" @click="release" style="
                        height: 30px;
                        padding: 0 20px;
                        margin: 0;
                        background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
                        color:#fff;
                    ">释放</el-button>
                    <el-button type="primary" size="small" @click="dialogFormVisibleadd = true" style="
                        height: 30px;
                        padding: 0 20px;
                        margin: 0;
                        background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
                        color:#fff;
                    ">新增</el-button>
                </el-row>
            </div>
        </div>
        <div class="roughly_tabel">
            <div class="flexTable">
                <el-table
                    ref="table"
                    :data="ptype"
                    border
                    stripe
                    highlight-current-row
                    style="width: 100%"
                    :header-cell-style="{
                        'background-color': 'rgba(243,246,253,1)',
                        'color': '#606266',
                        'padding': '10px 0'}">
                    <el-table-column
                        label="年份"
                        align="center"
                        :resizable="false">
                        <p>{{bbb}}</p>
                    </el-table-column>
                    <el-table-column
                        prop="typeABC"
                        label="类型"
                        align="center"
                        :resizable="false">
                    </el-table-column>
                    <el-table-column
                        prop=""
                        align="center"
                        label="起始"
                        :resizable="false">
                    </el-table-column>
                    <el-table-column
                        prop=""
                        align="center"
                        label="结束"
                        :resizable="false">
                    </el-table-column>
                    <el-table-column
                        prop=""
                        align="center"
                        label="类型"
                        :resizable="false">
                    </el-table-column>
                    <el-table-column
                        prop=""
                        align="center"
                        label="区域"
                        :resizable="false">
                    </el-table-column>
                    <el-table-column label="操作" align="center" :resizable="false">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            type="text"
                            @click="toogleExpand(scope.row)">浏览</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column type="expand" width="1" :resizable="false">
                        <template>
                            <!-- 二级弹出 -->
                            <template>
                                <el-table
                                    :data="childtable"
                                    border
                                    stripe
                                    ref="table2"
                                    style="width: 100%"
                                    :header-cell-style="{
                                        'background-color': 'rgba(243,246,253,1)',
                                        'color': '#606266',
                                        'padding': '10px 0'}">
                                    <div class="noer">
                                        <el-table-column align="center" :resizable="false"></el-table-column>
                                    </div>
                                    <div class="noer">
                                        <el-table-column align="center" :resizable="false"></el-table-column>
                                    </div>
                                    <el-table-column
                                        prop="start"
                                        align="center"
                                        style="width:220px;"
                                        label="起始"
                                        :resizable="false">
                                    </el-table-column>
                                    <el-table-column
                                        prop="end"
                                        align="center"
                                        label="结束"
                                        :resizable="false">
                                    </el-table-column>
                                    <el-table-column
                                        prop="numberType"
                                        align="center"
                                        label="类型"
                                        :resizable="false">
                                    </el-table-column>
                                    <el-table-column
                                        prop="typeArea"
                                        align="center"
                                        label="区域"
                                        :resizable="false">
                                    </el-table-column>
                                    <el-table-column label="操作" align="center" :resizable="false">
                                        <template slot-scope="scope">
                                            <el-button
                                            size="mini"
                                            type="text"
                                            @click="toogleExpands(scope.row)">编辑</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                            <!-- 二级弹出 -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <!-- 新建 -->
        <el-dialog title="新建" :visible.sync="dialogFormVisibleadd" :before-close="dialogsss">
            <el-form ref="ruleForm" :model="ruleForm"
                label-width="auto"
                size="mini"
                :inline="true"
                style="width:100%;">
                <template>
                    <el-form-item label="类别 :" class="section">
                        <el-select v-model="value1" placeholder="请选择" style="width:40%;" >
                            <el-option
                                    v-for="item in ptype"
                                    :key="item.id"
                                    :label="item.typeABC"
                                    :value="item.typeABC">
                            </el-option>
                        </el-select>
                        <el-select
                            v-model="value2"
                            collapse-tags
                            style="width:40%;"
                            placeholder="请选择">
                            <el-option
                                v-for="item in ptype"
                                :key="item.id"
                                :label="item.typeABC"
                                :value="item.typeABC">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>

                <template>
                    <el-form-item label="年份 :" class="section">
                        <el-select v-model="valuepti" placeholder="请选择" style="width:81%;" >
                            <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>

                <template>
                    <el-form-item label="区域 :" class="section">
                        <el-select v-model="voptio" placeholder="请选择" style="width:81%;" >
                            <el-option
                                v-for="item in ptifrom"
                                :key="item.id"
                                :label="item.typeName"
                                :value="item.typeName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <!-- {min:4,max:4, required: true, message: '请输入四位字符 - 最后两位为数字',trigger: 'blur' }, -->
                <el-form-item label="起始 :"
                    placeholder="请输入起始值"
                    prop="taskCode1"
                    :rules="[
                        { required: true, message: '请输入起始值', trigger: 'blur' },
                        { min:4,max:4,pattern: /^[a-zA-Z0-9]{2}[0-9]{2}$/, message: '请输入四位字符 - 最后两位为数字',trigger: 'blur' }
                    ]">
                    <el-input
                        placeholder="请输入起始值"
                        v-model="ruleForm.taskCode1"
                        style="width:100%;"
                        clearable>
                    </el-input>
                </el-form-item>

                <el-form-item label="结束 :" placeholder="请输入结束值"
                    prop="taskCode2"
                    :rules="[
                        { required: true, message: '请输入结束值', trigger: 'blur' },
                        { min:4,max:4,pattern: /^[a-zA-Z0-9]{2}[0-9]{2}$/, message: '请输入四位字符 - 最后两位为数字',trigger: 'blur' }
                    ]">
                    <el-input
                        type="taskCode2"
                        placeholder="请输入结束值"
                        v-model="ruleForm.taskCode2"
                        style="width:100%;"
                        size="mini"
                        clearable>
                    </el-input>
                </el-form-item>

                <el-form-item label="类型 :" placeholder="请输入"
                    prop="taskCode3"
                    :rules="[
                        { required: true, message: '类型不能为空' },
                    ]">
                    <el-input
                        placeholder="请输入类型"
                        v-model="ruleForm.taskCode3"
                        style="width:100%;"
                        size="mini"
                        clearable>
                    </el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogsss">取 消</el-button>
                <el-button type="primary" @click="dialogs">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="dialogFormVisible" :before-close="shutDialogFormVisible">
            <el-form ref="nameForm" :model="nameForm"
                label-width="auto"
                size="mini"
                :inline="true"
                style="width:100%;">
                <template>
                    <el-form-item label="类别 :" class="section">
                        <el-select v-model="objt.typeABC" placeholder="" style="width:40%;" :disabled="edit"></el-select>
                        <el-select
                            v-model="objt.typeABC"
                            :disabled="edit"
                            collapse-tags
                            style="width:40%;"
                            placeholder="请选择">
                        </el-select>
                    </el-form-item>
                </template>

                <template>
                    <el-form-item label="年份 :" class="section">
                        <el-select v-model="objt.years" placeholder="请选择" style="width:81%;" :disabled="edit"></el-select>
                    </el-form-item>
                </template>

                <el-form-item label="起始 :" placeholder="请输入起始值">
                    <el-input
                    :disabled="edit"
                        placeholder="请输入起始值"
                        v-model="objt.start"
                        style="width:100%;"
                        clearable
                        autocomplete="off">
                    </el-input>
                </el-form-item>

                <el-form-item label="结束 :" placeholder="请输入结束值">
                    <el-input
                        :disabled="edit"
                        placeholder="请输入结束值"
                        v-model="objt.end"
                        style="width:100%;"
                        size="mini"
                        autocomplete="off"
                        clearable>
                    </el-input>
                </el-form-item>

                <template>
                    <el-form-item label="区域 :" class="section">
                        <el-select v-model="voptios" placeholder="请选择" style="width:81%;" >
                            <el-option
                                v-for="item in ptifrom"
                                :key="item.id"
                                :label="item.typeName"
                                :value="item.typeName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>

                <el-form-item label="类型 :" placeholder="请输入"
                    prop="Code3"
                    :rules="[
                        { required: true, message: '类型不能为空' },
                    ]">
                    <el-input
                        v-model="nameForm.Code3"
                        style="width:100%;"
                        size="mini"
                        autocomplete="off"
                        clearable>
                    </el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="shutDialogFormVisible">取 消</el-button>
                <el-button type="primary" @click="dias">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:'Roughly',
    data(){
        return {
            edit: true,
            readonly: true,
            dialogFormTitle:'新建',
            dialogFormVisible: false,
            dialogFormVisibleadd:false,
            ruleForm:{
                taskCode1: '',
                taskCode2: '',
                taskCode3: ''
            },
            nameForm:{
                Code1: '',
                Code2: '',
                Code3: ''
            },
            options: [{
                value: '2018',
                label: '2018'
            }, {
                value: '2019',
                label: '2019'
            },{
                value: '2020',
                label: '2020'
            }],
            voptio:'',
            voptios:'',
            values: '2019',
            options1: [],
            value1: '',
            options2: [],
            value2: '',
            input: '',
            ptifrom:[],
            valuepti:'',
            ptype:[],
            bbb:'2019',
            childtable:[],
            formLabelWidth: '120px',
            objt:{}
        }
    },
    created(){
        this.createlist()
    },
    methods:{
        sel(){
            this.bbb = this.values
            this.createlist()
        },
        createlist(){
            this.$api.roughly.taskcode().then(res=>{
                this.ptifrom = res.data.data.ptIform.list
                this.ptype = res.data.data.ptype.list
            })
        },
        toogleExpands(row){ //编辑
            this.dialogFormVisible =true;
            this.objt = row;
            this.nameForm.Code3 = this.objt.numberType;
            this.voptios = row.typeArea;
        },
        release(){ //释放
            this.$api.roughly.releaseNumber(this.input).then(res=>{
                if(res.status === 200){
                    this.input = ''
                    this.$message(`${res.data.data}`);
                }
            })
        },
        toogleExpand(row) {  // 第一个弹出层
            let obj={
                typeABC:row.typeABC,
                years:this.values
            }
            this.$api.roughly.findTaskCodePosition(obj).then(res=>{
                this.childtable = res.data.data.list
                $table.toggleRowExpansion(row);
            })
            let $table = this.$refs.table;
            this.ptype.map((item) => {
                if (row.typeABC != item.typeABC) {
                    $table.toggleRowExpansion(item, false)
                }
            })
        },
        dialogsss(){
            this.dialogFormVisibleadd = false
            this.value1= '',
            this.value2= '',
            this.valuepti= '',
            this.voptio= '',
            this.ruleForm.taskCode1= '',
            this.ruleForm.taskCode2= '',
            this.ruleForm.taskCode3=''
            this.$refs.ruleForm.resetFields();
        },
        dialogs(){ //点击确定
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let obj ={
                        typeABC:this.value1,
                        typeABCSource:this.value2,
                        years:this.valuepti,
                        typeArea:this.voptio,
                        start:this.ruleForm.taskCode1,
                        end:this.ruleForm.taskCode2,
                        numberType:this.ruleForm.taskCode3
                    }
                    this.$api.roughly.taskcodeadd(obj).then(res=>{
                        this.dialogFormVisibleadd=false
                        this.createlist()
                        this.$refs.ruleForm.resetFields();
                        this.$message({
                            type: 'success',
                            message: res.data.message,
                            duration: 1500
                        });
                        this.value1= '',
                        this.value2= '',
                        this.valuepti= '',
                        this.voptio= '',
                        this.ruleForm.taskCode1= '',
                        this.ruleForm.taskCode2= '',
                        this.ruleForm.taskCode3=''
                    }).catch(error => {
                        this.$message.error(error.data.message);
                        this.dialogFormVisibleadd=false;
                        this.$refs.ruleForm.resetFields();
                        this.$message({
                            type: 'error',
                            message: res.data.message,
                            duration: 1500
                        });
                        this.createlist()
                    })
                }
            })
        },
        dias(){ //编辑点击对应
            this.$refs.nameForm.validate((valid) => {
                if (valid) {
                    let typeABC=this.objt.typeABC;
                    let typeABCSource=this.objt.typeABC;
                    let years=this.objt.years;
                    let typeArea=encodeURI(this.voptios); //可修改
                    let  start=this.objt.start;
                    let  end=this.objt.end;
                    let  numberType=encodeURI(this.nameForm.Code3); //可修改
                    let  newnumtype=encodeURI(this.objt.numberType)  //     typeABC:this.objt.typeABC;
                    let obj = {end: end, newnumtype:newnumtype, numberType: numberType, start: start, typeABC:typeABC, typeABCSource: typeABCSource, typeArea: typeArea, years: years};
                    console.log(obj)
                    this.$api.roughly.changeNumberTypeAndTypeArea(obj).then(res=>{
                        if(res.data.respCode == '0'){
                             this.$message({
                                type: 'success',
                                message: '编辑成功!',
                                duration: 1500
                            });
                            this.createlist()
                        }else{
                            this.$message({
                                type: 'success',
                                message: '编辑失败!',
                                duration: 1500
                            });
                        }
                        this.dialogFormVisible=false
                    }).catch(error => {
                        this.$message.error(error.data.message);
                    });
                    obj.numberType='';
                }
            })
        },
        shutDialogFormVisible() {
            this.dialogFormVisible = false;
            this.value1= '';
            this.value2= '';
            this.valuepti= '';
            this.voptio= '';
            this.ruleForm.taskCode1= '';
            this.ruleForm.taskCode2= '';
            this.ruleForm.taskCode3='';
            this.voptios = '';
            this.$refs.nameForm.resetFields();
        },
    }
}
</script>
<style lang="scss" scoped>
.roughly{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #eee;
    padding: 10px;
    overflow: hidden;
}
.roughly_top{
    width: 100%;
    background: #fff;
    padding: 20px 20px 0 20px;
}
.roughly_top .roughly_top_border {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    // justify-content: center;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0,0,0,0.1);
}
.roughly_tabel{
    flex:1;
    overflow: hidden;
    background: #fff;
    padding: 20px;
}

.el-form-item{
    width: 100%;
}
.el-form-item .el-form-item__content{
    width: 65%;
}
.section .el-form-item__content{
    width: 80%;
}
.el-dialog__body{
    height: 350px;
}
.flexTable{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position:relative;
}
.demo-table-expand {
    font-size: 0;
}
// .demo-table-expand label { width: 90px;color: #99a9bf; }
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
.el-table__expanded-cell[class*=cell]{
    padding:  1vw;
}
.el-table .hidden-columns{
    width: 100%;
}
.el-dialog{
    width: 100%;
}
.el-form{
    height: 500px;
}
.tabel_dan{
    border: 0;
}
/deep/ .el-table__expanded-cell .el-table .el-table__header-wrapper table {
  width: 100% !important;
  overflow: hidden;
}

 /deep/ .el-table__expanded-cell .el-table .el-table__body-wrapper table {
  width: 100% !important;
  overflow: hidden;
}
/deep/ .el-dialog__wrapper .el-dialog{
    width: 40%;
}
/deep/ .el-dialog__wrapper .el-dialog .el-form{
    height: auto;
}
</style>
