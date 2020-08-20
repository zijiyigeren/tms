<template>
    <!-- 系统用户管理 -->
    <div class="systemuserinquire">
        <div class="warp">
            <div class="inquire">
              <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
                <div style="width: calc(100% - 55px);">
                  <el-form-item label="部门 :">
                    <el-select :clearable="true" filterable style="width:240px;" v-model="formInline.value" 
                        placeholder="请选择部门">
                      <el-option v-for="item in findDepartmentList" :key="item.id" :label="item.org_name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="用户名 :">
                    <el-input v-model.trim="formInline.loginid" placeholder="用户名" @keyup.enter.native="searchEnterFun" name="clearInputValue"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item label="姓名 :" >
                    <el-input v-model.trim="formInline.name" placeholder="姓名" @keyup.enter.native="searchEnterFun" name="clearInputValue"
                              clearable></el-input>
                  </el-form-item>
                </div>
                <div class="demo-form-inline-but">
                  <el-form-item>
                    <el-button type="primary" @click="clickNewConstruction">新建</el-button>
                  </el-form-item>
                  <el-form-item style="margin-right: 0;">
                    <el-button type="primary" @click="inquirefindmemberList(formInline,1,10)">查询</el-button>
                  </el-form-item>
                </div>
              </el-form>
            </div>

            <div class="table-box">
                <el-table
                    border
                    stripe
                    v-loading="loading"
                    :data="tablelist"
                    :header-cell-style="{
                        'background-color': 'rgba(243,246,253,1)',
                        'color': '#606266',
                        'padding': '10px 0'
                    }"
                    style="width: 100%">
                    <el-table-column
                        type="selection"
                        align="center"
                        :resizable="false">
                    </el-table-column>
                    <el-table-column
                        prop="loginName"
                        label="用户名"
                        align="center"
                        :resizable="false">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="姓名"
                        align="center"
                        :resizable="false">
                    </el-table-column>
                    <el-table-column
                        prop="departmentName"
                        label="部门"
                        align="center"
                        :resizable="false">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="联系方式"
                        align="center"
                        :resizable="false">
                    </el-table-column>
                    <el-table-column label="操作" align="center" :resizable="false">
                        <template slot-scope="scope">
                            <el-button type="text" style="color:#32AFF0;marginRight:6px;" @click="redactSaveMember(scope.row)">编辑</el-button>
                            <el-button type="text" style="color:red;marginLeft:6px;" @click="deleteMember(scope.$index, scope.row)" >删除</el-button>
                            <el-button type="text" style="color:#32AFF0;marginLeft:6px;" @click="passwordInit(scope.$index, scope.row)" >密码初始</el-button>
                            <el-button type="text" style="color:#32AFF0;marginLeft:6px;" @click="bindMemberRole(scope.$index, scope.row)" >绑定</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="pagingdevice">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10,20,30]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>

        <el-dialog title="用户绑定权限" :visible.sync="dialogFormVisible" width="640px" class="binding_dialog_form">
            <el-transfer
                filterable
                v-model="dataListId"
                :data="dataList"
                :titles="['不具有的权限','已有权限']"
                :props="{
                    key: 'id',
                    label: 'rolename'
                }"
            ></el-transfer>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">关 闭</el-button>
                <el-button type="primary" @click="onClickPreserve">保 存</el-button>
            </div>
        </el-dialog>

        <!-- 新建/编辑 -->
        <el-dialog :title="redactFormTitle"
            :visible.sync="redactFormVisible"
            :before-close="handleDialogClose"
            class="edit_newlybuild_dialog"
            v-loading="redactFormLoading">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="35%" size="medium" class="demo-ruleForm">
                <input type="hidden" name="ruleForm.flag" value="1"/>
                <el-form-item label="姓名：" prop="name">
                    <el-input style="width:240px;" v-model.trim="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="所属部门：" prop="departmentid">
                    <el-select style="width:240px;" v-model="ruleForm.departmentid" placeholder="请选择所属部门" :clearable="true">
                        <el-option v-for="item in departmentidList" :key="item.id" :label="item.org_name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="登录ID：" prop="loginName">
                    <el-input style="width:240px;" v-model.trim="ruleForm.loginName"></el-input>
                </el-form-item>
                <el-form-item label="联系方式：" prop="phone">
                    <el-input style="width:240px;" v-model.number="ruleForm.phone" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="所属区域：" prop="area">
                    <el-select style="width:240px;" v-model="ruleForm.area" placeholder="请选择部门" :clearable="true">
                        <el-option v-for="item in areaList" :key="item.id" :label="item.typeName" :value="item.typeName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签章：">
                    <div>
                        <div style="color:red;">仅支持jpg/jpeg/gif格式图片，且只能为一张图片</div>
                        <div style="display:flex;">
                            <el-image
                                v-show="ruleForm.uploadPath"
                                style="width:148px;height:148px;marginRight:10px;"
                                :src="imgUrl + 'docs/sign/' + ruleForm.uploadPath">
                            </el-image>
                            <el-upload
                                action="https://jsonplaceholder.typicode.com/posts/"
                                list-type="picture-card"
                                accept="image/jpg,image/jpeg,image/gif,image/JPG,image/JPEG,image/GIF"
                                :http-request="beforeUpload"
                                :on-remove="handleRemove"
                                ref="upload"
                                :limit="1">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="clickAddToTestProject">添加签章规则</el-button>
                </el-form-item>
                <!-- 添加签章规则 数据 -->
                <div v-if="projectDataList.length>0" class="projectData_box">
                    <div class="projectDataListClass">
                        <div v-for="(item,i) in projectDataList" :key="i" class="projectDataListClass_item">
                            <!-- 部门id -->
                            <el-select v-model="item.deptid">
                                <el-option v-for="item in deptidDataList" :key="item.id" :label="item.org_name" :value="item.id"></el-option>
                            </el-select>
                            <!-- 检验类型 -->
                            <el-select v-model="item.checkType">
                                <el-option v-for="item in checktypeDataList" :key="item.typeABC" :label="item.typeName+'-'+item.area" :value="item.typeABC"></el-option>
                            </el-select>
                            <!-- 处理步骤 -->
                            <el-select v-model="item.flowid">
                                <el-option v-for="item in flowidDataList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                            <!-- 签章名称 -->
                            <el-input v-model.trim="item.sign"></el-input>
                            <el-button type="primary" @click="projectDelete(item.id,i)" style="marginLeft:10px;">删 除</el-button>
                        </div>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clickShutDialog">关 闭</el-button>
                <el-button type="primary" @click="clicksaveMember">保 存</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import base from "@/api/base.js"
export default {
    name: 'systemuser',
    data(){
        var checkPhone = (rule, value, callback) => {
            const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/
            if (value) {
                setTimeout(() => {
                    if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字值'))
                    } else {
                    if (phoneReg.test(value)) {
                        callback()
                    } else {
                        callback(new Error('联系方式格式不正确'))
                    }
                    }
                }, 100)
            }else{
                callback()
            }
        };
        return {
            loading: false, // 加载状态
            redactFormLoading: false,  // 新建/编辑-加载状态
            total: 0, // 总数
            currentPage:1, // 当前页
            pageSize:10, // 每页的条数
            tablelist: [], // 列表数据
            findDepartmentList: [], // 部门管理员列表
            dialogFormVisible: false, // 控制绑定对话框是否显示
            redactFormVisible: false, // 控制编辑对话框是否显示
            redactFormTitle: '', // 编辑对话框标题
            formInline: {  // 查询
                value: '',
                loginid: '',
                name: ''
            },
            getHasRoleList: [], // 已有的权限
            getNotHasRoleList: [], // 不具有的权限
            bindingRowId: '', // 当前需要绑定权限的id
            bindDeptId: [], // 绑定保存的id数据
            departmentidList: [], // 所属部门数据
            departmentBindingId: '', // 所属部门绑定id
            areaList: [], // 所属区域的数据
            ruleForm: { // 表单数据
                id: '',
                flag: 1,
                name: '', // 姓名
                departmentid: '', // 所属部门
                loginName: '', // 登录ID
                phone: '', // 联系方式
                area: '', // 所属区域
                uploadPath: '',  // 图片名称
                // upload: '', // 图片文件
                // deptSignConfigList: [], // 添加签章规则数据
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
                phone: [
                    {required: false, validator: checkPhone, trigger: 'blur' }
                ],
            },
            condition: '',
            loginNameID: '',
            dataListId: [],
            dataList: [],
            listOrg_name: '',
            file: '', // 上传图片数据
            imgUrl: base.baseImgTable, // 图片地址
            projectDataList: [
                // {
                //     deptid: '', // 部门id
                //     checkType: '', // 检验类型
                //     flowid: '', // 处理步骤
                //     sign: '', // 签章名称
                //     username: '', //  姓名
                // }
            ], //添加签章规则数据
            deptidDataList: [], // 部门id数据
            checktypeDataList: [], // 检验类型数据
            flowidDataList: [], // 处理步骤数据
            editId: '', // 获取编辑id
        }
    },
    mounted() {
        this.findmemberList();
        this.gitfindDepartmentList();
    },
    methods:{
        // 分页器-设置每条的页数
        handleSizeChange(val) {
            this.pageSize = val;
            this.inquirefindmemberList(this.formInline, this.currentPage, this.pageSize,  '')
        },
        // 分页器-当前页发生改变的时候
        handleCurrentChange(val) {
            this.currentPage = val;
            this.inquirefindmemberList(this.formInline, this.currentPage, this.pageSize, '')
        },
        // 获取列表数据
        findmemberList() {
            this.inquirefindmemberList(this.formInline, this.currentPage, this.pageSize, this.listOrg_name);
            this.getAddToTestProjectList();
        },
        // 获取部门管理员列表
        gitfindDepartmentList() {
            this.$api.systemuserinquire.apiFindDepartmentList().then(res => {
                res ? this.findDepartmentList = res.data.data : '';
                this.listOrg_name = this.findDepartmentList[0].org_name;
            });
        },
        // 点击查询
        inquirefindmemberList(formInline, currentPage, pageSize, name) {
            this.loading = true;
            this.currentPage = currentPage, // 当前页
            this.pageSize = pageSize, // 每页的条数
            formInline.currentPage = this.currentPage;
            formInline.pageSize = this.pageSize;
            let param = new FormData()
                param.append('departmentid', formInline.value);
                param.append('loginName', formInline.loginid);
                param.append('name', formInline.name);
                param.append('currentPage', formInline.currentPage);
                param.append('pageSize', formInline.pageSize);
            this.$api.systemuserinquire.apiInquireFindmemberList(param).then(res => {
                res ? this.tablelist = res.data.data : '';
                if(this.tablelist.length > 0){
                    this.total = this.tablelist[0].total;
                }else{
                    this.total = 0;
                }
                this.loading = false;
            }).catch(error => {
                this.$message({ type: 'error', message: error.data.message, duration: 1500 });
                this.loading = false;
            })
        },
        // 输入框回车事件
        searchEnterFun (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode == 13) {
            this.inquirefindmemberList(this.formInline, 1, 10)
            }
        },
        // 点击删除
        deleteMember(index, row) {
            this.$confirm('确认要删除吗？', '信息', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
            }).then(() => {
                let params = {
                    memberId: row.id
                }
                this.$api.systemuserinquire.apiDeleteMember(params).then(res => {
                    this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                    this.findmemberList();
                }).catch((error) => {
                    this.$message({ type: 'error', message: error.data.message, duration: 1500 });
                });
            }).catch(error => {
                this.$message({ type: 'info', message: '已取消删除', duration: 1500 });
            })
        },
        // 密码初始
        passwordInit(index, row) {
            this.$confirm('确认将密码重置为111111', '信息', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
            }).then(() => {
                let param = new FormData()
                    param.append('memberId', row.id);
                this.$api.systemuserinquire.apiPasswordInit(param).then(res => {
                    this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                }).catch((error) => {
                    this.$message({ type: 'error', message: error.data.message, duration: 1500 });
                });
            }).catch(error => {
                this.$message({ type: 'info', message: '已取消密码重置', duration: 1500 });
            })
        },
        // 点击绑定
        bindMemberRole(index, row) {
            this.dialogFormVisible = true;
            this.bindingRowId = row.id;
            let rightList = [];
            let leftList = [];
            let params = {
                memberId: row.id
            };
            this.$api.systemuserinquire.apiGetNotHasRoleList(params).then(resitem => {
                leftList = resitem.data.data;
                this.$api.systemuserinquire.apiGetHasRoleList(params).then(res => {
                    rightList = res.data.data;
                    this.dataList = rightList.concat(leftList);
                    let data = res.data.data;
                    let arr = [];
                    for (let i = 0; i < data.length; i++) {
                        arr.push(data[i].id)
                    }
                    this.dataListId = arr;
                });
            });
        },
        // 绑定权限-保存
        onClickPreserve() {
            let bindDeptId = this.dataListId;
            let param = new FormData()
                param.append('memberId', this.bindingRowId);
                param.append('roleIds', bindDeptId.join(','));
            this.$api.systemuserinquire.apiBindMemberRole(param).then(res => {
                this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                this.dialogFormVisible = false;
                this.findmemberList();
            }).catch((error) => {
                this.$message({ type: 'error', message: error.data.message, duration: 1500 });
                this.dialogFormVisible = false;
                this.findmemberList();
            });
        },
        // 绑定-已有的权限
        clickHasRoleList(item){
            let id = item.id;
            if(!this.getNotHasRoleList.find(item =>item.id === id)){
                this.getNotHasRoleList.push(item);
                this.getHasRoleList = this.getHasRoleList.filter(item=>item.id != id)
            }
        },
        // 绑定-不具有的权限
        clickNotHasRoleList(item){
            let id = item.id;
            if(!this.getHasRoleList.find(item =>item.id === id)){
                this.getHasRoleList.push(item);
                this.getNotHasRoleList = this.getNotHasRoleList.filter(item=>item.id != id)
            }
        },
        // 点击新建
        clickNewConstruction() {
            this.editId = '';
            this.redactFormTitle = '新建用户';
            this.redactFormVisible = true;
            this.projectDataList = [];
            this.file = '';
            this.currentPage = 1, // 当前页
            this.pageSize = 10, // 每页的条数
            this.condition = 0;
            this.ruleForm = {
                id: '',
                flag: 1,
                name: '', // 姓名
                departmentid: '', // 所属部门
                loginName: '', // 登录ID
                phone: '', // 联系方式
                area: '', // 所属区域
                uploadPath: '',  // 图片名称
                // upload: '', // 图片文件
                // deptSignConfigList: [], // 添加签章规则数据
            }
            this.redactfindDepartmentList();
            this.redactfindCheckCart();
            this.loginNameID = '';
        },
        // 点击编辑
        redactSaveMember(row) {
            this.editId = row;
            this.redactFormTitle = '编辑用户';
            this.redactFormVisible = true;
            this.projectDataList = [];
            this.condition = 1;
            this.redactfindDepartmentList();
            this.redactfindCheckCart();
            this.redactFormLoading = true;
            this.getEditData(row);
        },
        getEditData(row) {
            let params = new FormData();
                params.append("memberId", row.id);
            this.$api.systemuserinquire.apiGetMemberData(params).then(res => {
                this.redactFormLoading = false;
                let data = res.data.data;
                this.ruleForm = {
                    id: data.id,
                    flag: data.flag,
                    name: data.name,
                    departmentid: data.departmentid,
                    loginName: data.loginName,
                    phone: data.phone ? data.phone : '',
                    area: data.area != 'null' ? data.area : '',
                    uploadPath: data.uploadPath+'?t_='+new Date().getTime()
                }
                this.loginNameID = data.loginName;
                this.departmentBindingId = data.departmentid;
                let dataList = JSON.parse(data.deptSignConfigList);

                if(dataList.length > 0) {
                    dataList.forEach(item => {
                        this.flowidDataList
                        let cent =  {
                            id: item.id,
                            deptid: item.deptid, // 部门id
                            checkType: item.checkType, // 检验类型
                            flowid: item.flowid==3?'报告编辑':(item.flowid==5?'报告审核':(item.flowid==6?'报告批准':'')), // 处理步骤
                            sign: item.sign, // 签章名称
                            username: item.username, //  姓名
                        }

                        this.projectDataList.push(cent);
                    })
                }
            }).catch(error => {
                this.redactFormLoading = false;
                this.$message({ type: 'error', message: error.data.message, duration: 1500 });
            })
        },
        // 获取所属部门数据
        redactfindDepartmentList() {
            this.$api.systemuserinquire.apiFindDepartmentList().then(res => {
                res ? this.departmentidList = res.data.data : '';
            });
        },
        // 获取所属区域数据
        redactfindCheckCart() {
            let params = {
                typeflag: 5
            }
            this.$api.systemuserinquire.apiFindCheckCart(params).then(res => {
                res ? this.areaList = res.data.data : '';
            });
        },
        // 点击保存
        clicksaveMember() {
            this.$refs.ruleForm.validate((valid) => {
                if(valid){
                    let signFlag = false;
                    let paramsName = {
                        loginName: this.ruleForm.loginName
                    }
                    this.projectDataList.length > 0 ? this.projectDataList.forEach(item => {
                        if(!item.sign){
                            this.$message({ type: 'error', message: '签章不能为空，请将空白签章完善', duration: 1500 });
                            signFlag = false;
                        }else{
                            signFlag = true;
                        }
                    }) : signFlag = true;
                    if(signFlag){
                        this.projectDataList.forEach(item => {
                            if(item.flowid == '报告编辑') {
                                item.flowid = 3;
                            }else if(item.flowid == '报告审核') {
                                item.flowid = 5;
                            }else if(item.flowid == '报告批准') {
                                item.flowid = 6;
                            }
                        });
                        let params = new FormData();
                            params.append("id", this.ruleForm.id);
                            params.append("flag", this.ruleForm.flag);
                            params.append("name", this.ruleForm.name);
                            params.append("departmentid", this.ruleForm.departmentid);
                            params.append("loginName", this.ruleForm.loginName);
                            params.append("phone", this.ruleForm.phone);
                            params.append("area", this.ruleForm.area);
                            params.append("upload", this.file);
                            params.append("deptSignConfigList", JSON.stringify(this.projectDataList))
                        if(this.condition == 0){ // 新建
                            this.redactFormLoading = true;
                            this.$api.systemuserinquire.apiGetMemberByName(paramsName).then(res => {
                                this.$message({ type: 'error', message: res.data.data, duration: 1500 });
                            }).catch(error => {
                                this.$api.systemuserinquire.apiSaveMember(params).then(res => {
                                    this.redactFormLoading = false;
                                    this.redactFormVisible = false;
                                    this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                                    this.findmemberList();
                                    this.file = '';
                                    this.$refs.ruleForm.resetFields();
                                    this.$refs.upload.clearFiles();
                                }).catch(error => {
                                    this.redactFormLoading = false;
                                    this.redactFormVisible = false;
                                    this.$message({ type: 'error', message: error.data.message, duration: 1500 });
                                    this.findmemberList();
                                    this.file = '';
                                    this.$refs.ruleForm.resetFields();
                                    this.$refs.upload.clearFiles();
                                })
                            })
                        }else if(this.condition == 1){ //  编辑
                            this.redactFormLoading = true;
                            if(this.loginNameID == this.ruleForm.loginName){
                                this.$api.systemuserinquire.apiSaveMember(params).then(res => {
                                    this.redactFormVisible = false;
                                    this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                                    this.findmemberList();
                                    this.editId ? this.getEditData(this.editId) : '';
                                    this.file = '';
                                    this.$refs.ruleForm.resetFields();
                                    this.$refs.upload.clearFiles();
                                }).catch(error => {
                                    this.redactFormVisible = false;
                                    this.$message({ type: 'error', message: error.data.message, duration: 1500 });
                                    this.findmemberList();
                                    this.editId ? this.getEditData(this.editId) : '';
                                    this.file = '';
                                    this.$refs.ruleForm.resetFields();
                                    this.$refs.upload.clearFiles();
                                })
                            }else{
                                this.$api.systemuserinquire.apiGetMemberByName(paramsName).then(res => {
                                    this.$message({ type: 'error', message: res.data.data, duration: 1500 });
                                }).catch(error => {
                                    this.$api.systemuserinquire.apiSaveMember(params).then(res => {
                                        this.redactFormVisible = false;
                                        this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                                        this.findmemberList();
                                        this.editId ? this.getEditData(this.editId) : '';
                                        this.file = '';
                                        this.$refs.ruleForm.resetFields();
                                        this.$refs.upload.clearFiles();
                                    }).catch(error => {
                                        this.redactFormVisible = false;
                                        this.$message({ type: 'error', message: error.data.message, duration: 1500 });
                                        this.findmemberList();
                                        this.editId ? this.getEditData(this.editId) : '';
                                        this.file = '';
                                        this.$refs.ruleForm.resetFields();
                                        this.$refs.upload.clearFiles();
                                    })
                                })
                            }
                        }
                    }
                }
            })
        },
        // 点击对话框右上角的X
        handleDialogClose() {
            this.redactFormVisible = false;
            this.$refs.ruleForm.resetFields();
            this.$refs.upload.clearFiles();
        },
        // 关闭对话框
        clickShutDialog() {
            this.redactFormVisible = false;
            this.$refs.ruleForm.resetFields();
            this.$refs.upload.clearFiles();
        },
        // 获取添加签章规则下拉菜单的数据
        getAddToTestProjectList() {
            this.$api.systemuserinquire.apiGetDeptSignInfo().then(res => {
                let data = res.data.data;
                this.deptidDataList = data.departmentForSignConfig.list; // 部门id
                this.checktypeDataList = data.checkTypes; // 检验类型
                this.flowidDataList = data.workflows; // 处理流程
            }).catch(error => {
                this.$message({ type: 'error', message: error.data.message, duration: 1500 });
            })
        },
        // 点击添加签章规则
        clickAddToTestProject() {
            if(this.ruleForm.loginName){
                if(!this.loginNameID){
                    let paramsName = {
                        loginName: this.ruleForm.loginName
                    }
                    this.$api.systemuserinquire.apiGetMemberByName(paramsName).then(res => {
                        this.$message({ type: 'error', message: res.data.data, duration: 1500 });
                    }).catch(error => {
                        let cent =  {
                            id: '',
                            deptid: this.deptidDataList[0].id, // 部门id
                            checkType: this.checktypeDataList[0].typeABC, // 检验类型
                            flowid: this.flowidDataList[0].id, // 处理步骤
                            sign: '', // 签章名称
                            username: this.ruleForm.loginName, //  姓名
                        }
                        this.projectDataList.push(cent);
                    })
                }else{
                    if(this.loginNameID == this.ruleForm.loginName) {
                        let cent =  {
                            id: '',
                            deptid: this.deptidDataList[0].id, // 部门id
                            checkType: this.checktypeDataList[0].typeABC, // 检验类型
                            flowid: this.flowidDataList[0].id, // 处理步骤
                            sign: '', // 签章名称
                            username: this.ruleForm.loginName, //  姓名
                        }
                        this.projectDataList.push(cent);
                    }else{
                        let paramsName = {
                            loginName: this.ruleForm.loginName
                        }
                        this.$api.systemuserinquire.apiGetMemberByName(paramsName).then(res => {
                            this.$message({ type: 'error', message: res.data.data, duration: 1500 });
                        }).catch(error => {
                            let cent =  {
                                id: '',
                                deptid: this.deptidDataList[0].id, // 部门id
                                checkType: this.checktypeDataList[0].typeABC, // 检验类型
                                flowid: this.flowidDataList[0].id, // 处理步骤
                                sign: '', // 签章名称
                                username: this.ruleForm.loginName, //  姓名
                            }
                            this.projectDataList.push(cent);
                        })
                    }
                }
            }else{
                this.$message({ type: 'error', message: '登录ID必须填写才可添加，请填写', duration: 1500 });
            }
        },
        // 删除添加签章规则
        projectDelete(id, index) {
            this.projectDataList = this.projectDataList.filter((item,i) => i != index);
            if(id){
                let params = {
                    id: id
                };
                this.$api.systemuserinquire.apiDeleteDeptSignConfig(params)
            }
        },
        // 签章图片上传后-获取数据
        beforeUpload(params) {
            let file = params.file;
            let type = file.name.substring((file.name.lastIndexOf("\.")) + 1, file.name.length);
            const isLt1M = file.size < 50*1024;
            if (type!='jpeg'&&type!='jpg'&& type!='gif'&& type!='JPG'&& type!='JPEG'&& type!='GIF') {
                this.$message({ type: 'error', message: '上传图片格式不正确，请重新上传!', duration: 1500 });
                this.file = '';
                this.$refs.upload.clearFiles();
            }else{
                if (!isLt1M) {
                    this.$message({ type: 'error', message: '上传文件大小不能超过50KB!', duration: 1500 });
                    this.file = '';
                    this.$refs.upload.clearFiles();
                }else{
                    this.file = file;
                }
            }
        },
        // 删除上传的签章图片
        handleRemove() {
            this.file = '';
            this.$refs.upload.clearFiles();
        },
    }
}
</script>
<style lang="scss" scoped>
.systemuserinquire {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 10px;
    background: #eee;
}
.warp {
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
    padding: 20px;
    display: flex;
    flex-direction: column;
}
.el-button--default {
    // width:56px;
    height:30px;
    border-radius:2px;
    padding: 0 20px;
    margin: 0;
    min-width: 68px;

}
.el-button--primary {
    height:30px;
    background:linear-gradient(90deg,rgba(96,157,248,1),rgba(84,183,235,1));
    border-radius:2px;
    padding: 0 20px;
    margin: 0;
    min-width: 68px;
}
.pagingdevice {
    padding-top: 20px;
}
.table-box {
    flex: 1;
    overflow-y: auto;
    padding-top: 20px;
    border-top: 1px solid rgba(0,0,0,0.1);
}
.el-table .cell {
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal-content{
    width: 100%;
    height: 100%;
    display: flex;
}
.Shuttle_left{
    width: 300px;
    height: 300px;
    display: flex;
}
.Shuttle_left p{
    width: 60px;
    height: 300px;
    text-align: center;
}
.Shuttle_left div{
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    border: 1px solid #ccc;
    padding: 0 10px;
    box-sizing: border-box;
    margin-right: 10px;
}
.Shuttle_left div span{
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
}
.Shuttle_right{
    width: 300px;
    height: 300px;
    display: flex;
}
.Shuttle_right p{
    width: 60px;
    height: 300px;
    text-align: center;
}
.Shuttle_right div{
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    border: 1px solid #ccc;
    padding: 0 10px;
    box-sizing: border-box;
}
.Shuttle_right div span{
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
}
.demo-form-inline-but {
    display: flex;
    justify-content: space-between;
}
/deep/ .demo-form-inline .el-form-item__content {
    width: 70% !important;
}
/deep/ .demo-form-inline .el-form-item__content .el-date-editor, .demo-form-inline .el-form-item__content .el-input__inner, .demo-form-inline .el-form-item__content .el-select {
    width: 100% !important;
}
.el-form-item {
    margin-bottom: 20px;
}
/deep/ .edit_newlybuild_dialog {
    padding: 100px 0;
    height: 100% !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
/deep/ .edit_newlybuild_dialog .el-dialog{
    width: 60% !important;
    height: 100%;
    margin: 0 auto !important;
    overflow: hidden !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
/deep/ .edit_newlybuild_dialog .el-dialog .el-dialog__footer{
    padding: 0 20px 20px 20px;
}
/deep/ .edit_newlybuild_dialog .el-dialog .el-dialog__body{
    flex: 1;
    overflow: hidden;
    padding: 20px;
    text-align:center;
}
/deep/ .edit_newlybuild_dialog .el-dialog .el-dialog__body .el-form {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}
/deep/ .edit_newlybuild_dialog .el-dialog .el-dialog__body .el-form .el-form-item__content{
    text-align:left;
}
/deep/ .edit_newlybuild_dialog .el-dialog .el-dialog__body .el-form .projectData_box {
    flex: 1;
}
/deep/ .edit_newlybuild_dialog .el-dialog .el-dialog__body .el-form .projectData_box .projectDataListClass{
    height: 100%;
}
.projectDataListClass_item .el-select, .projectDataListClass_item .el-input{
    width: 20% !important;
    margin-bottom: 10px;
}
.binding_dialog_form .el-transfer {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
