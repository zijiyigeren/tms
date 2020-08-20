<template>
    <div class="systemuserinquire">
        <!-- 用户查询 -->
        <div class="warp">
            <div class="inquire">
                <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
                    <div>
                        <el-form-item label="部门管理员-列表：" >
                            <el-select style="width:240px;" v-model="formInline.value" placeholder="请选择部门" :clearable="true">
                                <el-option v-for="item in findDepartmentList" :key="item.id" :label="item.org_name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="登录ID：">
                            <el-input v-model="formInline.loginid" placeholder="登录ID："></el-input>
                        </el-form-item>
                        <el-form-item label="用户姓名：">
                            <el-input v-model="formInline.name" placeholder="用户姓名："></el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item>
                            <el-button type="primary" @click="inquirefindmemberList(formInline)">查询</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </div>

            <div class="table-box">
                <el-table
                    border
                    stripe
                    :data="tablelist ? tablelist.slice((currentPage - 1) * pageSize, currentPage*pageSize) : tablelist"
                    :header-cell-style="{
                        'background-color': 'rgba(243,246,253,1)',
                        'color': '#606266',
                        'padding': '10px 0'
                    }"
                    style="width: 100%">
                    <el-table-column
                        prop="departmentName"
                        label="部门"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="姓名"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="loginName"
                        label="登录ID"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="loginName2"
                        label="转登录ID"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="电话"
                        align="center">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <span style="color:#32AFF0;marginRight:6px;" @click="saveMember(scope.$index, scope.row)">编辑</span>
                            <span style="color:#32AFF0;marginLeft:6px;" @click="deleteMember(scope.$index, scope.row)" >删除</span>
                            <span style="color:#32AFF0;marginLeft:6px;" @click="passwordInit(scope.$index, scope.row)" >密码初始</span>
                            <span style="color:#32AFF0;marginLeft:6px;" @click="bindMemberRole(scope.$index, scope.row)" >绑定</span>
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
                    layout="total,prev,pager,next,sizes,jumper"
                    :total="tablelist.length"
                    background>
                </el-pagination>
            </div>
        </div>

        <el-dialog title="用户绑定权限" :visible.sync="dialogFormVisible">
            <div class="modal-content">
                <div class="Shuttle_left">
                    <p>用户已有的权限 : </p>
                    <div>
                        <span v-for="item in getHasRoleList" :key="item.id" 
                        @dblclick="clickHasRoleList(item)">{{item.rolename}}</span>
                    </div>
                </div>
                <div class="Shuttle_right">
                    <p>用户不具有的权限 : </p>
                    <div>
                        <span v-for="item in getNotHasRoleList" :key="item.id"
                        @dblclick="clickNotHasRoleList(item)" 
                        >{{item.rolename}}</span>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">关 闭</el-button>
                <el-button type="primary" @click="onClickPreserve">保 存</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import axios from "axios";
export default {
    data(){
        return {
            currentPage:1, // 当前页
            pageSize:10, // 每页的条数
            tablelist: [], // 列表数据
            findDepartmentList: [], // 部门管理员列表
            dialogFormVisible: false, // 控制弹窗是否显示
            formInline: {  // 查询
                value: '',
                loginid: '',
                name: ''
            },
            getHasRoleList: [], // 已有的权限
            getNotHasRoleList: [], // 不具有的权限
            bindingRowId: '', // 当前需要绑定权限的id
            bindDeptId: [], // 绑定保存的id数据
        }
    },
    mounted() {
        this.findmemberList();
        this.gitfindDepartmentList();
    },
    methods:{
        handleSizeChange(val) { // 分页器-设置每条的页数（如： 10条/页）
            this.pageSize = val;
        },
        handleCurrentChange(val) { // 分页器-当前页发生改变的时候（如：1，2,3）
            this.currentPage = val;
        },
        findmemberList() { // 获取列表数据
            this.$api.systemuserinquire.apiFindmemberList().then(res => {
                res ? this.tablelist = res.data.data : '';
            });
        },
        gitfindDepartmentList() { // 获取部门管理员列表
            this.$api.systemuserinquire.apiFindDepartmentList().then(res => {
                res ? this.findDepartmentList = res.data.data : '';
            });
        },
        inquirefindmemberList(formInline) { // 点击查询
            let param = new URLSearchParams()
                param.append('departmentid', formInline.value);
                param.append('loginName', formInline.loginid); 
                param.append('name', formInline.name);
            this.$api.systemuserinquire.apiInquireFindmemberList(param).then(res => {
                res ? this.tablelist = res.data.data : '';
            })
        },
        deleteMember(index, row) { // 点击删除
            this.$confirm('确认要删除吗？', '信息', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
            }).then(() => {
                let params = {
                    memberId: row.id
                }
                this.$api.systemuserinquire.apiDeleteMember(params).then(res => {
                    res.data.ok ? this.$message({
                        type: 'success',
                        message: res.data.data
                    }) : this.$message({
                        type: 'success',
                        message: res.data.message
                    });
                    this.findmemberList();
                }).catch((error) => {
                    this.$message.error(error.data.message);
                });
            })
        },
        passwordInit(index, row) { // 密码初始
            this.$confirm('确认将密码重置为111111', '信息', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
            }).then(() => {
                let param = new URLSearchParams()
                    param.append('memberId', row.id);
                this.$api.systemuserinquire.apiPasswordInit(param).then(res => {
                    res.data.ok ? this.$message({
                        type: 'success',
                        message: res.data.data
                    }) : this.$message({
                        type: 'success',
                        message: res.data.message
                    });
                }).catch((error) => {
                    this.$message.error(error.data.message);
                });
            })
        },
        saveMember(index, row) { // 点击编辑
            this.$router.push({
                path: '/system/userlogin',//跳转路由
                query: row
            });
        },
        bindMemberRole(index, row) { // 点击绑定
            this.dialogFormVisible = true;
            this.bindingRowId = row.id;
            let params = {
                memberId: row.id
            };
            // 已有的权限
            this.$api.systemuserinquire.apiGetHasRoleList(params).then(res => {
                res ? this.getHasRoleList = res.data.data : '';
            });
            // 不具有的权限
            this.$api.systemuserinquire.apiGetNotHasRoleList(params).then(res => {
                res ? this.getNotHasRoleList = res.data.data : '';
            });
        },
        onClickPreserve() { // 绑定权限-保存
            this.bindDeptId = [];
            this.getHasRoleList.forEach(item => {
                this.bindDeptId.push(item.id);
            });
            let param = new URLSearchParams()
                param.append('memberId', this.bindingRowId);
                param.append('roleIds', this.bindDeptId.join(','));
            this.$api.systemuserinquire.apiBindMemberRole(param).then(res => {
                res.data.ok ? this.$message({
                    type: 'success',
                    message: res.data.data
                }) : this.$message({
                    type: 'success',
                    message: res.data.message
                });
                this.dialogFormVisible = false;
                this.findmemberList();
            }).catch((error) => {
                this.$message.error(error.data.message);
                this.dialogFormVisible = false;
                this.findmemberList();
            });
        },
        clickHasRoleList(item){ // 绑定-已有的权限
            let id = item.id;
            if(!this.getNotHasRoleList.find(item =>item.id === id)){
                this.getNotHasRoleList.push(item);
                this.getHasRoleList = this.getHasRoleList.filter(item=>item.id != id)
            }
        },
        clickNotHasRoleList(item){ // 绑定-不具有的权限
            let id = item.id;
            if(!this.getHasRoleList.find(item =>item.id === id)){
                this.getHasRoleList.push(item);
                this.getNotHasRoleList = this.getNotHasRoleList.filter(item=>item.id != id)
            }
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
    padding: 10px;
    display: flex;
    flex-direction: column;
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
.inquire {
    padding: 10px 0;
}
.inquire .demo-form-inline {
    display: flex;
    justify-content: space-between;
}
.pagingdevice {
    padding: 10px 0;
}
.table-box {
    flex: 1;
    overflow-y: auto;
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
</style>