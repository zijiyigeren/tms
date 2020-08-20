<template>
    <div>
        <!-- 部门注册 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="auto" size="small" class="demo-ruleForm">
            <el-form-item label="名称：" prop="org_name">
                <el-input style="width:240px;" v-model="ruleForm.org_name"></el-input>
            </el-form-item>
            <el-form-item label="历史名称：" prop="org_name2">
                <el-input style="width:240px;" v-model="ruleForm.org_name2"></el-input>
            </el-form-item>
            <el-form-item label="编码：" prop="org_abc">
                <el-input style="width:240px;" v-model="ruleForm.org_abc"></el-input>
            </el-form-item>
            <el-form-item label="合并代码：" prop="groupid">
                <el-input style="width:240px;" v-model="ruleForm.groupid"></el-input>
            </el-form-item>
            <el-form-item label="初次校对：" prop="jdid">
                <el-select style="width:240px;" v-model="ruleForm.jdid">
                    <el-option label="不需要" :value="0"></el-option>
                    <el-option label="需要" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="出帐功能：" prop="fiance">
                <el-select style="width:240px;" v-model="ruleForm.fiance" placeholder="请选择出帐功能">
                    <el-option label="没有" :value="0"></el-option>
                    <el-option label="有" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="修改金额：" prop="charget">
                <el-select style="width:240px;" v-model="ruleForm.charget" placeholder="请选择修改金额">
                    <el-option label="没有" :value="0"></el-option>
                    <el-option label="有" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="科室级别：" prop="type">
                <el-select style="width:240px;" v-model="ruleForm.type" placeholder="请选择科室级别">
                    <el-option label="科室级别" :value="0"></el-option>
                    <el-option label="部门级别" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="部门排序：" prop="orderby">
                <el-input style="width:240px;" v-model.number="ruleForm.orderby" maxlength="65535"
                ></el-input>
            </el-form-item>
            <el-form-item class="primary-btn">
                <el-button type="primary" @click="saveDepartment('ruleForm',ruleForm)">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import axios from "axios";
export default {
    data(){
        return {
            ruleForm: {
                charget: 0,
                fiance: 0,
                groupid: 0,
                id: 0,
                jdid: 0,
                orderby: 0,
                org_abc: '',
                org_name: '',
                org_name2: '',
                type: 0
            },
            rules: {
                org_name: [
                    { required: true, message: '名称不能为空', trigger: 'blur' },
                    { max: 20, message: '长度在20个字符以内', trigger: 'blur' }
                ],
                org_name2: [
                    { required: true, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
                ],
                org_abc: [
                    { required: true, message: '编码不能为空', trigger: 'blur' },
                    {  max: 20, message: '长度在20个字符以内', trigger: 'blur' }
                ],
                orderby: [
                    { required: true, message: '部门排序不能为空', trigger: 'blur' },
                    { type: 'number', message: '部门排序必须为数字值', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        getSaveDepartment(){ // 获取编辑传回的数据
            let query = this.$router.history.current.query;
            if(query.org_name){
                this.ruleForm = {
                    charget: parseInt(query.charget),
                    fiance: parseInt(query.fiance),
                    groupid: parseInt(query.groupid),
                    id: parseInt(query.id),
                    jdid: parseInt(query.jdid),
                    orderby: parseInt(query.orderby),
                    org_abc: query.org_abc,
                    org_name: query.org_name,
                    org_name2: query.org_name2,
                    type: parseInt(query.type)
                }
            }
        },
        saveDepartment(ruleForm1, ruleForm2) { // 点击保存
            this.$refs[ruleForm1].validate((valid) => {
                if(valid){
                    this.$api.systemdepartmentrinquire.apiSaveDepartment(ruleForm2).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.data.data
                        });
                        this.ruleForm = {
                            charget: 0,
                            fiance: 0,
                            groupid: 0,
                            id: 0,
                            jdid: 0,
                            orderby: 0,
                            org_abc: '',
                            org_name: '',
                            org_name2: '',
                            type: 0
                        }
                    }).catch((error) => {
                        this.$message.error(error.data.message);
                        this.ruleForm = {
                            charget: 0,
                            fiance: 0,
                            groupid: 0,
                            id: 0,
                            jdid: 0,
                            orderby: 0,
                            org_abc: '',
                            org_name: '',
                            org_name2: '',
                            type: 0
                        }         
                    });
                }
            })
        },
    },
    created () {
        this.getSaveDepartment();
    }
}
</script>
<style lang="scss" scoped>
.demo-ruleForm {
    width: 350px;
    margin: 20px auto;
}
.primary-btn .el-form-item__content{
    display: flex;
}
</style>