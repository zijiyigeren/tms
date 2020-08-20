<template>
    <div class="systemparams">
        <!-- 检验参数管理 -->
        <div class="warp">
            <div class="operate">
                <div>
                  <span style="width: 82px;display: inline-block;text-align: right;padding-right: 12px;">类别 :</span>
                  <el-select v-model="typeId" style="width:240px;" size="small" @change="selectTypeId(typeId)">
                      <el-option v-for="item in selectTypeIdList"
                          :key="item.id"
                          :label="item.label"
                          :value="item.value"></el-option>
                  </el-select>
                </div>
                <el-button type="primary" @click="addItemscatalog('new')" style="height: 30px;padding: 0 20px;min-width: 68px;">新建</el-button>
            </div>

            <div class="table-box">
                <div class="table-content">
                    <el-table
                        border
                        stripe
                        v-loading="loading"
                        :data="tablelist"
                        :header-cell-style="{
                            'background-color': 'rgba(243,246,253,1)',
                            'color': '#606266',
                            'padding': '10px 0'
                        }">
                        <el-table-column
                            prop="typeflag"
                            label="类别"
                            align="center"
                            :resizable="false">
                            <template slot-scope="scope">
                                <p v-for="item in selectTypeIdList" :key="item.id" >
                                    <span v-if="scope.row.typeflag == item.value">
                                        {{item.label}}
                                    </span>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="typeName"
                            label="名称"
                            align="center"
                            :resizable="false">
                        </el-table-column>
                        <el-table-column
                            prop="typeABC"
                            label="编号规则"
                            align="center"
                            :resizable="false">
                        </el-table-column>
                        <el-table-column
                            prop="seq"
                            label="顺序"
                            align="center"
                            :resizable="false">
                        </el-table-column>
                        <el-table-column
                            v-if="typeId == 1"
                            prop="parentName"
                            label="父节点"
                            align="center"
                            :resizable="false">
                        </el-table-column>
                        <el-table-column
                            v-if="typeId == 1"
                            prop="typeName1"
                            label="别名"
                            align="center"
                            :resizable="false">
                        </el-table-column>
                        <el-table-column
                            v-if="typeId == 1"
                            prop="projectType"
                            label="项目别名"
                            align="center"
                            :resizable="false">
                        </el-table-column>
                        <el-table-column
                            v-if="typeId == 1"
                            prop="area"
                            label="地区"
                            align="center"
                            :resizable="false">
                        </el-table-column>
                        <el-table-column label="操作" align="center" :resizable="false">
                            <template slot-scope="scope">
                                <el-button type="text" style="color:#32AFF0;marginRight:6px;" @click="editItemscatalog('redact', scope.$index, scope.row)">编辑</el-button>
                                <el-button type="text" style="color:red;marginLeft:6px;" @click="deleteCheckCartType(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" :before-close="handleDialogClose">
            <el-form :model="form" label-width="120px" ref="form" :rules="rules">
                <el-form-item label="类别：" prop="typeflag">
                    <el-select v-model="form.typeflag" style="width:320px;" size="medium" @change="chengeSelectTypeId(form.typeflag)" :disabled="disabled">
                        <el-option v-for="item in selectTypeIdList"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称：" prop="typeName">
                    <el-input size="medium" style="width:320px" v-model.trim="form.typeName" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="编号规则：" prop="typeABC">
                    <el-input size="medium" style="width:320px" v-model.trim="form.typeABC" placeholder="请输入编号规则"></el-input>
                </el-form-item>
                <el-form-item label="顺序：" prop="seq">
                    <el-input size="medium" style="width:320px" v-model.trim="form.seq" placeholder="请输入顺序"></el-input>
                </el-form-item>
                <el-form-item label="父节点：" v-if="chengeTypeId == 1" prop="parentName">
                    <el-input size="medium" style="width:320px" v-model.trim="form.parentName" placeholder="请输入父节点"></el-input>
                </el-form-item>
                <el-form-item label="别名：" v-if="chengeTypeId == 1" prop="typeName1">
                    <el-input size="medium" style="width:320px" v-model.trim="form.typeName1" placeholder="请输入别名"></el-input>
                </el-form-item>
                <el-form-item label="项目别名：" v-if="chengeTypeId == 1" prop="projectType">
                    <el-input size="medium" style="width:320px" v-model.trim="form.projectType" placeholder="请输入项目别名"></el-input>
                </el-form-item>
                <el-form-item label="地区：" v-if="chengeTypeId == 1" prop="area">
                    <el-input size="medium" style="width:320px" v-model.trim="form.area" placeholder="请输入地区"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clickShutDialog">取 消</el-button>
                <el-button type="primary" @click="submitFormVisible('form',form)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import axios from "axios";
export default {
    name: 'systemparams',
    data(){
        return {
            typeId: 0, // 查询类别ID
            chengeTypeId: 0,
            selectTypeIdList: [ // 查询类别数据-暂时写死
                {
                    id: 0,
                    label: '车辆类型',
                    value: 0
                },{
                    id: 1,
                    label: '检验',
                    value: 1
                },{
                    id: 2,
                    label: '委托类型',
                    value: 2
                },{
                    id: 3,
                    label: '发动机类型',
                    value: 3
                },{
                    id: 5,
                    label: '区域类型',
                    value: 5
                },{
                    id: 6,
                    label: '样品状态',
                    value: 6
                },{
                    id: 7,
                    label: '报告状态',
                    value: 7
                },{
                    id: 8,
                    label: '供油类型',
                    value: 8
                },{
                    id: 9,
                    label: '变速器形式',
                    value: 9
                },{
                    id: 10,
                    label: '驱动形式',
                    value: 10
                },{
                    id: 11,
                    label: '转鼓',
                    value: 11
                },{
                    id: 12,
                    label: '企业等级',
                    value: 12
                },{
                    id: 13,
                    label: '供油种类',
                    value: 13
                },
                // {
                //     id: 14,
                //     label: '变速器形式',
                //     value: 14
                // },
                // {
                //     id: 15,
                //     label: '驱动形式',
                //     value: 15
                // },
                {
                    id: 16,
                    label: '标准',
                    value: 16
                },{
                    id: 17,
                    label: '试验项目',
                    value: 17
                },{
                    id: 18,
                    label: '分类',
                    value: 18
                },
                // {
                //     id: 19,
                //     label: '转鼓',
                //     value: 19
                // },
                {
                    id: 20,
                    label: '开票性质',
                    value: 20
                },{
                    id: 21,
                    label: '企业性质',
                    value: 21
                },{
                    id: 22,
                    label: '所属区域',
                    value: 22
                },{
                    id: 23,
                    label: '合同性质',
                    value: 23
                },{
                    id: 24,
                    label: '营运编号',
                    value: 24
                }
            ],
            tablelist: [], // table数据
            dialogFormTitle: '',
            dialogFormVisible: false,
            form: {
                currentPage: '',
                id: '',
                ids: '',
                list: [],
                page: '',
                pageHtml: '',
                pageSize: '',
                parentName: '',
                projectType: '',
                seq: '',
                total: '',
                typeABC: '',
                typeName: '',
                typeName1: '',
                typeflag: '',
                version: ''
            },
            rules: { // 编辑对话框的校验
                typeflag: [
                    { required: true, message: '类别不能为空', trigger: 'blur' }
                ],
                typeName: [
                    { required: true, message: '名称不能为空', trigger: 'blur' },
                    { min: 1, max: 20, message: '最大输入值为20个字符', trigger: 'blur' }
                ],
                typeABC: [
                    { required: false, message: '编号规则不能为空', trigger: 'blur' },
                    { min: 0, max: 20, message: '最大输入值为20个字符', trigger: 'blur' }
                ],
                seq: [
                    { required: true, message: '顺序不能为空', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            if (/^[0-9]\d*$/.test(value) == false) {
                                callback(new Error("顺序必须为整数"));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            if(value.toString().length > 2){
                                callback(new Error("顺序输入最大值为2位数"));
                            }else {
                                callback();
                            }
                        }, trigger: 'blur'
                    },
                ],
                parentName: [
                    { required: false, message: '父节点', trigger: 'blur' },
                    { min: 0, max: 50, message: '最大输入值为50个字符', trigger: 'blur' }
                ],
                typeName1: [
                    { required: false, message: '别名', trigger: 'blur' },
                    { min: 0, max: 100, message: '最大输入值为100个字符', trigger: 'blur' }
                ],
                projectType: [
                    { required: false, message: '项目别名', trigger: 'blur' },
                    { min: 0, max: 50, message: '最大输入值为50个字符', trigger: 'blur' }
                ],
                area: [
                    { required: false, message: '地区', trigger: 'blur' },
                    { min: 0, max: 10, message: '最大输入值为10个字符', trigger: 'blur' }
                ],
            },
            disabled: false,
            loading: false,
        }
    },
    mounted() {
        this.findCheckCartTypes();
    },
    methods:{
        findCheckCartTypes() { // 获取列表数据
            this.loading = true;
            let params = {
                typeflag: this.typeId
            }
            this.$api.systemparams.apiFindCheckCartTypes(params).then(res => {
                this.tablelist = res.data.data;
                this.loading = false;
            }).catch((error) => {
                this.$message({ type: 'error', message: error.data.message, duration: 1500 });
                this.loading = false;
            })
        },
        selectTypeId(typeId) { // 通过类别查询
            this.loading = true;
            let params = {
                typeflag: typeId
            }
            this.$api.systemparams.apiFindCheckCartTypes(params).then(res => {
                this.tablelist = res.data.data;
                this.loading = false;
            }).catch((error) => {
                this.$message({ type: 'error', message: error.data.message, duration: 1500 });
                this.loading = false;
            })
        },
        chengeSelectTypeId(typeId) {
            this.chengeTypeId = typeId;
        },
        deleteCheckCartType(index, row) { // 点击删除
            this.$confirm('确认要删除吗？', '信息', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
            }).then(() => {
                let params = {
                    id: row.id
                };
                this.$api.systemparams.apiDeleteCheckCartType(params).then(res => {
                    this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                    this.findCheckCartTypes();
                }).catch((error) => {
                    this.$message({ type: 'error', message: error.data.message, duration: 1500 });
                });
            })
        },
        addItemscatalog(title) { // 点击新建
            this.disabled = false;
            if(title == 'new'){
                this.dialogFormVisible = true;
                this.dialogFormTitle = '新建';
                this.form = {
                    currentPage: '',
                    id: '',
                    ids: '',
                    list: [],
                    page: '',
                    pageHtml: '',
                    pageSize: '',
                    parentName: '',
                    projectType: '',
                    seq: '',
                    total: '',
                    typeABC: '',
                    typeName: '',
                    typeName1: '',
                    typeflag: '',
                    version: ''
                };
                this.formTitle = title;
            }
        },
        editItemscatalog(title, index, row) { // 点击编辑
            this.disabled = true;
            if(row.typeflag == 1){
                this.chengeTypeId = row.typeflag;
            }
            if(title == 'redact'){
                this.dialogFormVisible = true;
                this.dialogFormTitle = '编辑';
                this.form = row;
                this.formTitle = title;
            }
        },
        submitFormVisible(form1, form2) { // 点击弹窗的确定
            this.$refs[form1].validate((valid) => {
                if(valid) {
                    let itemcatalog = {
                        typeid: form2.typeid,
                        productName: form2.productName,
                        ids: form2.id,
                        parentID: form2.parentID,
                        orderID: form2.orderID
                    };
                    if(this.formTitle == 'redact'){ // 编辑
                        let params = {
                            id: form2.id,
                            typeflag: form2.typeflag,
                            typeName: form2.typeName,
                            typeABC: form2.typeABC,
                            parentName: form2.parentName,
                            typeName1: form2.typeName1,
                            projectType: form2.projectType,
                            seq: form2.seq,
                            area: form2.area
                        }
                        this.$api.systemparams.apiSaveCheckCartType(params).then(res => {
                            this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                            this.dialogFormVisible = false;
                            this.$refs.form.resetFields();
                            this.findCheckCartTypes();
                            this.chengeTypeId = 0;
                        }).catch((error) => {
                            this.$message({ type: 'error', message: error.data.message, duration: 1500 });
                            this.dialogFormVisible = false;
                            this.$refs.form.resetFields();
                            this.findCheckCartTypes();
                            this.chengeTypeId = 0;
                        });
                    }else if(this.formTitle == 'new'){ // 新建
                        let params = {
                            typeflag: form2.typeflag,
                            typeName: form2.typeName,
                            typeABC: form2.typeABC,
                            parentName: form2.parentName,
                            typeName1: form2.typeName1,
                            projectType: form2.projectType,
                            seq: form2.seq,
                            area: form2.area
                        }
                        this.$api.systemparams.apiSaveCheckCartType(params).then(res => {
                            this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                            this.dialogFormVisible = false;
                            this.findCheckCartTypes();
                            this.$refs.form.resetFields();
                            this.chengeTypeId = 0;
                        }).catch((error) => {
                            this.$message({ type: 'error', message: error.data.message, duration: 1500 });
                            this.dialogFormVisible = false;
                            this.findCheckCartTypes();
                            this.$refs.form.resetFields();
                            this.chengeTypeId = 0;
                        });
                    }
                }
            })
        },
        handleDialogClose() { // 点击对话框右上角的X
            this.dialogFormVisible = false;
            this.$refs.form.resetFields();
            this.findCheckCartTypes();
            this.chengeTypeId = 0;
        },
        clickShutDialog() { // 关闭对话框
            this.dialogFormVisible = false;
            this.$refs.form.resetFields();
            this.findCheckCartTypes();
            this.chengeTypeId = 0;
        },
    }
}
</script>
<style lang="scss" scoped>
.systemparams {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 10px;
    background: #eee;
}
.warp {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 20px;
    background: #fff;
    display: flex;
    flex-direction: column;
}
.operate {
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0,0,0,0.1);
}
.table-box {
    flex: 1;
    overflow: hidden;
    padding-top: 20px;
}
.table-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
.el-button--default {
    width:56px;
    height:30px;
    border-radius:2px;
    padding: 0;
    margin: 0;
}
.el-button--primary {
    width:56px;
    height:30px;
    background:linear-gradient(90deg,rgba(96,157,248,1),rgba(84,183,235,1));
    border-radius:2px;
    padding: 0;
    margin: 0;
}
.el-divider--vertical {
    margin: 0;
}
.el-divider {
    background-color: rgb(50, 175, 240);
}
/deep/ .el-scrollbar__bar {
  z-index: 999;
}

.el-form-item {
    margin-bottom: 20px;
}
</style>
