<template>
    <div class="systemdepartmentrinquire">
        <!-- 部门查询 -->
        <div class="warp">
            <div class="inquire">
                <el-form :inline="true" size="small" :model="inquireform" class="demo-form-inline">
                    <div>
                        <el-form-item label="部门名称：" >
                            <el-input v-model="inquireform.org_name" placeholder="部门名称："></el-input>
                        </el-form-item>
                        <el-form-item label="部门代码：">
                            <el-input v-model="inquireform.org_abc" placeholder="部门代码："></el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item>
                            <el-button type="primary" @click="inquirefindDepartmentList(inquireform)">查询</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </div>

            <div class="table-box">
                <el-table
                    border
                    stripe
                    :data="findDepartmentList.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                    :header-cell-style="{
                        'background-color': 'rgba(243,246,253,1)',
                        'color': '#606266',
                        'padding': '10px 0'
                    }"
                    style="width: 100%">
                    <el-table-column
                        prop="org_name"
                        label="名称"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="org_name2"
                        label="历史名称"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="org_abc"
                        label="代码"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="jdid"
                        label="初次校对"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="groupid"
                        label="合并代码"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="fiance"
                        label="出账功能"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="charget"
                        label="修改金额"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <span style="color:#32AFF0;marginRight:6px;" @click="saveDepartment(scope.$index, scope.row)">编辑</span>
                            <span style="color:#32AFF0;marginLeft:6px;" @click="deleteDepartment(scope.$index, scope.row)">删除</span>
                            <span v-if="scope.row.type == 1" style="color:#32AFF0;marginLeft:6px;" @click="onClickBinding(scope.$index, scope.row)">绑定</span>
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
                    layout="total,prev,pager,next,sizes,jumper"
                    :total="findDepartmentList.length"
                    background>
                </el-pagination>
            </div>
        </div>

        <el-dialog title="部门绑定权限" :visible.sync="dialogFormVisible">
            <div class="modal-content">
                <div class="Shuttle_left">
                    <p>包含的科室 : </p>
                    <div>
                        <span v-for="item in getListDepInclude" :key="item.id" 
                        @dblclick="clickDepInclude(item)">{{item.org_name}}</span>
                    </div>
                </div>
                <div class="Shuttle_right">
                    <p>不包含的科室 : </p>
                    <div>
                        <span v-for="item in getListDepExclude" :key="item.id"
                        @dblclick="clickDepExclude(item)" 
                        >{{item.org_name}}</span>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">关 闭</el-button>
                <el-button type="primary" @click="preserveBinding">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            currentPage:1, // 当前页
            pageSize:10, // 每页的条数
            findDepartmentList: [], // 列表数据
            dialogFormVisible: false, // 控制弹窗是否显示
            getListDepExclude: [], // 不包含的科室-数据
            getListDepInclude: [], // 包含的科室-数据
            inquireform:{ // 查询
                org_name: '',
                org_abc: ''
            },
            bindDeptId: [], // 绑定保存的id数据
            bindingRowId: '', // 当前需要绑定权限的id
        }
    },
    mounted() {
        this.getIdcsList();
    },
    methods:{
        handleSizeChange(val) { // 分页器-设置每条的页数（如： 10条/页）
            this.pageSize = val;
        },
        handleCurrentChange(val) { // 分页器-当前页发生改变的时候（如：1，2,3）
            this.currentPage = val;
        },
        getIdcsList() { // 获取列表数据
            this.$api.systemdepartmentrinquire.apiFindDepartmentList().then(res => {
                res ? this.findDepartmentList = res.data.data : '';
            });
        },
        inquirefindDepartmentList(inquireform) { // 点击查询
            let params = {
                org_name: inquireform.org_name,
                org_abc: inquireform.org_abc
            }
            this.$api.systemdepartmentrinquire.apiInquireFindDepartmentList(params).then(res => {
                res ? this.findDepartmentList = res.data.data : '';
            });
        },
        deleteDepartment(index, row) { // 点击删除
            this.$confirm('确认要删除吗？', '信息', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
            }).then(() => {
                let params = {
                    departmentId: row.id
                }
                this.$api.systemdepartmentrinquire.apiDeleteDepartment(params).then(res => {
                    res.data.ok ? this.$message({
                        type: 'success',
                        message: res.data.data
                    }) : this.$message({
                        type: 'success',
                        message: res.data.message
                    });
                    this.getIdcsList();
                }).catch((error) => {
                    this.$message.error(error.data.message);
                });
            })
        },
        saveDepartment(index, row) { // 点击编辑
            this.$router.push({
                path: '/system/departmentrlogin',//跳转路由
                query: row
            });
        },
        onClickBinding(index, row) { // 点击绑定
            this.bindingRowId = row.id;
            this.dialogFormVisible = true;
            let params = {
                departmentId: row.id
            }
            // 包含科室
            this.$api.systemdepartmentrinquire.apiGetListDepInclude(params).then(res => { 
                res ? this.getListDepInclude = res.data.data : '';
            });
            // 不包含科室
            this.$api.systemdepartmentrinquire.apiGetListDepExclude(params).then(res => {
                res ? this.getListDepExclude = res.data.data : '';
            });
        },
        preserveBinding() { // 部门绑定权限-保存
            this.bindDeptId = [];
            this.getListDepInclude.forEach(item => {
                this.bindDeptId.push(item.id);
            });
            let param = new URLSearchParams();
                param.append('departmentId', this.bindingRowId);
                param.append('bindDeptId', this.bindDeptId.join(','));
            this.$api.systemdepartmentrinquire.apiBindDepartment(param).then(res => {
                res.data.ok ? this.$message({
                    type: 'success',
                    message: res.data.data
                }) : this.$message({
                    type: 'success',
                    message: res.data.message
                });
                this.dialogFormVisible = false;
                this.getIdcsList();
            }).catch((error) => {
                this.$message.error(error.data.message);
                this.dialogFormVisible = false;
                this.getIdcsList();
            });
        },
        clickDepInclude(item){ // 绑定-包含科室
            let id = item.id;
            if(!this.getListDepExclude.find(item =>item.id === id)){
                this.getListDepExclude.push(item);
                this.getListDepInclude = this.getListDepInclude.filter(item=>item.id != id)
            }
        },
        clickDepExclude(item){ // 绑定-不包含科室
            let id = item.id;
            if(!this.getListDepInclude.find(item =>item.id === id)){
                this.getListDepInclude.push(item);
                this.getListDepExclude = this.getListDepExclude.filter(item=>item.id != id)
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.systemdepartmentrinquire {
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
.inquire .demo-form-inline {
    display: flex;
    justify-content: space-between;
}
.pagingdevice {
    padding: 10px 0;
}
.table-box {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
}
.el-table .cell {
    display: flex;
    justify-content: center;
    align-items: center;
}
.el-divider--vertical {
    margin: 0;
}
.el-divider {
    background-color: rgb(50, 175, 240);
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