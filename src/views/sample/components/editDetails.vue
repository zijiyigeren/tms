<template>
    <!-- 整车停车场/零部件库房 - 编辑详细 -->
    <div class="editdetails_con" v-loading="loading">
        <el-button type="primary" style="marginBottom:20px;" @click="onNewAdd">新建</el-button>

        <!-- 表格 -->
        <el-table ref="table" border stripe :data="tableList"
            :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">

            <el-table-column align="center" :resizable="false" prop="line" label="第X排" v-if="itype==1"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="linenumber" label="每排位数" v-if="itype==1"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="startnumber" label="起始编号" v-if="itype==1"></el-table-column>

            <el-table-column align="center" :resizable="false" prop="line" label="第X区" v-if="itype==0"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="linenumber" label="第X排" v-if="itype==0"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="startnumber" label="第X货架" v-if="itype==0"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="leveal" label="第X层" v-if="itype==0"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="levealnumber" label="第X个" v-if="itype==0"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="vincode" label="条形码" width="220"></el-table-column>
            <el-table-column align="center" :resizable="false" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
                    <el-popconfirm title="确认要删除吗？" cancelButtonType="" @onConfirm="onDelete(scope.row)">
                        <el-button type="text" slot="reference" style="color:red;margin: 0 10px;">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新建/编辑-对话框 -->
        <el-dialog
            width="50%" :modal="false" :title="newEditTitle" v-loading="dialogLoading"
            :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="newEditVisible" :before-close="onNewEditClose" class="editdetails_newedit">
            <el-form :model="newEditForm" :rules="newEditRules" ref="neweditform" class="newedit_form">

                <el-form-item label="第X排：" prop="line" v-show="itype==1">
                    <el-input clearable placeholder="请输入第X排" v-model.trim="newEditForm.line"></el-input>
                </el-form-item>
                <el-form-item label="每排位数：" prop="linenumber" v-show="itype==1">
                    <el-input clearable placeholder="请输入每排位数" v-model.trim="newEditForm.linenumber"></el-input>
                </el-form-item>
                <el-form-item label="起始编号：" prop="startnumber" v-show="itype==1">
                    <el-input clearable placeholder="请输入起始编号" v-model.trim="newEditForm.startnumber"></el-input>
                </el-form-item>

                <el-form-item label="第X区：" prop="line" v-show="itype==0">
                    <el-input clearable placeholder="请输入第X区" v-model.trim="newEditForm.line"></el-input>
                </el-form-item>
                <el-form-item label="第X排：" prop="linenumber" v-show="itype==0">
                    <el-input clearable placeholder="请输入第X排" v-model.trim="newEditForm.linenumber"></el-input>
                </el-form-item>
                <el-form-item label="第X货架：" prop="startnumber" v-show="itype==0">
                    <el-input clearable placeholder="请输入第X货架" v-model.trim="newEditForm.startnumber"></el-input>
                </el-form-item>
                <el-form-item label="第X层：" prop="leveal" v-show="itype==0">
                    <el-input clearable placeholder="请输入第X层" v-model.trim="newEditForm.leveal"></el-input>
                </el-form-item>
                <el-form-item label="第X个：" prop="levealnumber" v-show="itype==0">
                    <el-input clearable placeholder="请输入第X个" v-model.trim="newEditForm.levealnumber"></el-input>
                </el-form-item>
                <el-form-item label="条形码：" prop="vincode">
                    <el-input clearable placeholder="请输入条形码" v-model.trim="newEditForm.vincode"></el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="onCalculate">计算</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" :center="true" width="100%">
                <el-button @click="onNewEditClose">取 消</el-button>
                <el-button type="primary" @click="onNewEditOk">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    components: {},
    props: ['itype', 'editDetailsData'],
    watch: {
        editDetailsData: {
            immediate:true,
            handler(val) {
                this.obtainTableList();
            },
        },
    },
    data() {
        return {
            loading: false,
            dialogLoading: false,
            tableList: [], // 表格数据
            newEditTitle: '', // 新建/编辑-标题
            newEditVisible: false, // 新建/编辑-显示状态
            newEditForm: { // 新建/编辑-表单数据
                id: '',
                pbId: '',
                line: '',
                linenumber: '',
                startnumber: '',
                leveal: '',
                levealnumber: '',
                vincode: '',
            }, 
            newEditRules: { // 新建/编辑-校验
                line: [
                    {required: true, message: (this.itype==0?'第X区':'第X排')+'不能为空', trigger: 'blur'},
                    {pattern: /^[0-9]+$/, message: (this.itype==0?'第X区':'第X排')+'必须是数字', trigger: 'blur' },
                    {max: 3, message: '最多可输入3个字符', trigger: 'blur'},
                ],
                linenumber: [
                    {required: true, message: (this.itype==0?'第X排':'每排位数')+'不能为空', trigger: 'blur'},
                    {pattern: /^[0-9]+$/, message: (this.itype==0?'第X排':'每排位数')+'必须是数字', trigger: 'blur' },
                    {max: 3, message: '最多可输入3个字符', trigger: 'blur'},
                ],
                startnumber: [
                    {required: true, message: (this.itype==0?'第X货架':'起始编号')+'不能为空', trigger: 'blur'},
                    {pattern: /^[0-9]+$/, message: (this.itype==0?'第X货架':'起始编号')+'必须是数字', trigger: 'blur' },
                    {max: 3, message: '最多可输入3个字符', trigger: 'blur'},
                ],
                leveal: this.itype==0?[
                    {required: true, message: '第X层不能为空', trigger: 'blur'},
                    {pattern: /^[0-9]+$/, message: '第X层必须是数字', trigger: 'blur' },
                    {max: 3, message: '最多可输入3个字符', trigger: 'blur'},
                ]:[],
                levealnumber: this.itype==0?[
                    {required: true, message: '第X个不能为空', trigger: 'blur'},
                    {pattern: /^[0-9]+$/, message: '第X个必须是数字', trigger: 'blur' },
                    {max: 3, message: '最多可输入3个字符', trigger: 'blur'},
                ]:[],
                vincode: [
                    {pattern: /^[0-9]+$/, required: false, message: '条形码必须是数字', trigger: 'blur'},
                    {min: 0, max: 19, message: '最多可输入19个字符', trigger: 'blur'},
                ],
            },
        }
    },
    mounted() {
        
    },
    methods: {
        // 获取编辑详细数据
        obtainTableList() {
            this.loading = true;
            if(this.editDetailsData.id) {
                this.$api.storageroom.getPbc({id: this.editDetailsData.id}).then(res => {
                    console.log(res, '获取编辑详细成功res');
                    this.tableList = res.data.data;
                    this.loading = false;
                }).catch((error) => {
                    console.log(error, '获取编辑详细失败error');
                    this.loading = true;
                })
            }
        },
        // 新建
        onNewAdd() {
            if(this.itype==0){
                this.newEditForm = {
                    id: '',
                    pbId: this.editDetailsData.id,
                    line: '',
                    linenumber: '',
                    startnumber: '',
                    leveal: '',
                    levealnumber: '',
                    vincode: '',
                };
            }else {
                this.newEditForm = {
                    id: '',
                    pbId: this.editDetailsData.id,
                    line: '',
                    linenumber: '',
                    startnumber: '',
                    vincode: '',
                };
            }
            this.newEditTitle = '新建';
            this.newEditVisible = true;
        },
        // 编辑
        onEdit(row) {
            console.log(row,'详细编辑当前数据');
            if(this.itype==0){
                this.newEditForm = {
                    id: row.id,
                    pbId: this.editDetailsData.id,
                    line: row.line,
                    linenumber: row.linenumber,
                    startnumber: row.startnumber,
                    leveal: row.leveal,
                    levealnumber: row.levealnumber,
                    vincode: row.vincode,
                };
            }else {
                this.newEditForm = {
                    id: row.id,
                    pbId: this.editDetailsData.id,
                    line: row.line,
                    linenumber: row.linenumber,
                    startnumber: row.startnumber,
                    vincode: row.vincode,
                };
            }
            this.newEditTitle = '编辑';
            this.newEditVisible = true;
        },
        // 计算
        onCalculate() {
            let vcode = this.newEditForm.vincode;
            if (vcode.length >= 10) {
                vcode = vcode+'0000000000000000000';
                vcode = vcode.substring(0,19);
                this.newEditForm.vincode = vcode;
            }
            if (vcode.length == 19) {
                console.log(vcode, 'vcode');
                
                this.newEditForm.line = vcode.substring(2,4);
                this.newEditForm.linenumber = vcode.substring(4,6);
                this.newEditForm.startnumber = vcode.substring(6,8);
                if(this.itype == 0) {
                    this.newEditForm.leveal = vcode.substring(8,9);
                    this.newEditForm.levealnumber = vcode.substring(9,10);
                }
            }
        },
        // 保存-详细
        onNewEditOk() {
            this.$refs.neweditform.validate((valid) => {
                if (valid) {
                    this.dialogLoading = true;
                    let params = this.newEditForm;
                    console.log(params, '详细新建/编辑-表单数据');
                    this.$api.storageroom.editPbc(params).then(res => {
                        console.log(res, '详细新建/编辑成功res');
                        this.newEditVisible = false;
                        if(this.newEditTitle == '新建') {
                            this.$message.success('详细新建成功');
                        }else if(this.newEditTitle == '编辑') {
                            this.$message.success('详细编辑成功');
                        }
                        this.obtainTableList();
                        this.dialogLoading = false;
                    }).catch((error) => {
                        console.log(error, '详细新建/编辑失败error');
                        this.newEditVisible = false;
                        if(this.newEditTitle == '新建') {
                            this.$message.error('详细新建失败');
                        }else if(this.newEditTitle == '编辑') {
                            this.$message.error('详细编辑失败');
                        }
                        this.obtainTableList();
                        this.dialogLoading = false;
                    })
                }
            }); 
        },
        // 关闭-详细对话框
        onNewEditClose() {
            this.$refs.neweditform.resetFields();
            this.newEditVisible = false;
        },
        // 删除
        onDelete(row) {
            console.log(row,'详细删除当前数据');
            this.loading = true;
            this.$api.storageroom.delPbc({id: row.id}).then(res => {
                console.log(res, '详细删除成功res');
                this.$message.success('详细删除成功');
                this.obtainTableList();
            }).catch((error) => {
                console.log(error, '详细删除失败error');
                this.$message.error('详细删除失败');
                this.obtainTableList();
            })
        },
    }
        
}
</script>
<style lang="less" scoped>
.el-button--default {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    background: #fff;
    border-radius: 4px;
}
.el-button--primary {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
    border-radius: 4px;
}
/deep/ .newedit_form {
    margin: 0;
    padding: 0;
    .el-form-item {
        margin: 0;
        padding: 0;
        padding-bottom: 30px;
        display: flex;
        align-items: center;
        overflow: hidden;
        &:last-child {
            padding-bottom: 0 ;
        }
        .el-form-item__label {
            width: 30% !important;
        }
        .el-form-item__content {
            margin: 0 !important;
            padding: 0 !important;
            width: 60% !important;
            .el-select , .query_form .el-input{
                width: 100% !important;
            }
        }
    }
}
.editdetails_con {
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
/deep/ .editdetails_newedit {
    overflow: hidden;
    .el-dialog {
        margin:0 !important;
        padding: 0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        height: 60% !important;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            padding: 20px;
            overflow-y: auto;
        }
    }
}
</style>