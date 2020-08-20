<template>
    <div>
        <!-- 用户注册 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="auto" size="small" class="demo-ruleForm">
            <input type="hidden" name="ruleForm.flag" value="1"/>
            <el-form-item label="姓名：" prop="name">
                <el-input style="width:240px;" v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="所属部门：" prop="departmentid">
                <el-select style="width:240px;" v-model="ruleForm.departmentid" placeholder="请选择所属部门" :clearable="true">
                    <el-option v-for="item in departmentidList" :key="item.id" :label="item.org_name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="登录ID：" prop="loginName">
                <el-input style="width:240px;" v-model="ruleForm.loginName"></el-input>
            </el-form-item>
            <!-- <el-form-item label="非本机登陆是否开启：" prop="loginModel">
                <el-select style="width:240px;" v-model="ruleForm.loginModel" placeholder="请选择是否开启">
                    <el-option label="关闭" :value="0"></el-option>
                    <el-option label="开启" :value="1"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="联系方式：" prop="phone">
                <el-input style="width:240px;" v-model.number="ruleForm.phone" ></el-input>
            </el-form-item>
            <el-form-item label="所属区域：" prop="area">
                <el-select style="width:240px;" v-model="ruleForm.area" placeholder="请选择部门" :clearable="true">
                    <el-option v-for="item in areaList" :key="item.id" :label="item.typeName" :value="item.typeName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveMember('ruleForm', ruleForm)">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data(){
        return {
            departmentidList: [], // 所属部门数据
            areaList: [], // 所属区域的数据
            ruleForm: { // 表单数据
                id: '',
                flag: 1,
                name: '',
                departmentid: '',
                loginName: '',
                // loginModel: 0,
                phone: '',
                area: '',
            },
            rules: { // 对表单进行校验
                name: [
                    { required: true, message: '姓名不能是空', trigger: 'blur' },
                ],
                departmentid: [
                    { required: true, message: '所属部门不能是空', trigger: 'blur' },
                ],
                loginName: [
                    { required: true, message: '登录ID不能是空', trigger: 'blur' },
                ],
            }
        }
    },
    mounted() {
        this.findDepartmentList();
        this.findCheckCart();
        this.getSaveMember();
    },
    methods:{
        findDepartmentList() { // 获取所属部门数据
            this.$api.systemuserinquire.apiFindDepartmentList().then(res => {
                res ? this.departmentidList = res.data.data : '';
            });
        },
        findCheckCart() { // 获取所属区域数据
            let params = {
                typeflag: 5
            }
            this.$api.systemuserinquire.apiFindCheckCart(params).then(res => {
                res ? this.areaList = res.data.data : '';
            });
        },
        
        getSaveMember(){ // 获取编辑传回的数据
            let query = this.$router.history.current.query;
            if(query.name){
                this.ruleForm = {
                    id: query.id,
                    flag: 1,
                    name: query.name,
                    departmentid: query.departmentid,
                    loginName: query.loginName,
                    phone: query.phone,
                    area: query.area,
                }
            }
        },
        saveMember(ruleForm1, ruleForm2) { // 点击保存
            this.$refs[ruleForm1].validate((valid) => {
                if(valid){
                    this.$api.systemuserinquire.apiSaveMember(ruleForm2).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.data.data
                        });
                        this.ruleForm = {
                            id: '',
                            flag: 1,
                            name: '',
                            departmentid: '',
                            loginName: '',
                            phone: '',
                            area: '',
                        }
                    }).catch((error) => {
                        this.$message.error(error.data.message);
                        this.ruleForm = {
                            id: '',
                            flag: 1,
                            name: '',
                            departmentid: '',
                            loginName: '',
                            phone: '',
                            area: '',
                        }         
                    });
                }
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.demo-ruleForm {
    width: 350px;
    margin: 20px 35%;
}
</style>