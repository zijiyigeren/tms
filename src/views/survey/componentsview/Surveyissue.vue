<template>
    <!-- 问题报告 -->
    <div class="issuereport_border">
        <div class="issuereport_con">
            <div><el-button type="primary" class="refresh_btn" @click="onTabClick(true)">刷新</el-button></div>
            <el-tabs v-model="tabsDefault" type="card" @tab-click="(tab)=>onTabClick(false,tab)" class="detail_log">
                <el-tab-pane label="问题报告" name="1" v-loading="loading">
                    <div class="table_box">
                        <table border="1" class="table_con">
                            <thead class="table_thead">
                                <tr class="thead_tr">
                                    <th>系统ID</th>
                                    <th>报告ID</th>
                                    <th>报告编号</th>
                                    <th>状态</th>
                                    <th>类型</th>
                                    <th id="oper_problem" width="300">操作</th>
                                </tr>
                            </thead>
                            <tbody class="table_tbody">
                                <div class="tbody_scroll" id="scroll_problem">
                                    <div class="tbody_scroll_con" id="scroll_problem_con">
                                        <tr class="tbody_tr" v-for="(row,i) in tableData" :key="i">
                                            <td>{{row.id}}</td> <!-- 系统ID --> 
                                            <td>{{row.inspect_id}}</td> <!-- 报告ID --> 
                                            <td>{{row.pdf}}</td> <!-- 报告编号 --> 
                                            <td> <!-- 状态 -->
                                                <span v-if="row.etype == 0">待处理</span>
                                                <p v-if="row.etype != 0">
                                                    <span style="color:red;">失败</span>
                                                    <span>{{row.des}}</span>
                                                </p>
                                            </td> <!-- 状态 --> 
                                            <td><span>{{row.stype | filtStype}}</span></td> <!-- 类型 --> 
                                            <td width="300"> <!-- 操作 --> 
                                                <p v-if="row.etype == 0">
                                                    <span class="operate_prohibit">重新执行</span>&nbsp;&nbsp;
                                                    <span class="operate_prohibit">打开报告</span>&nbsp;&nbsp;
                                                    <span class="operate_prohibit">回退报告</span>
                                                </p>
                                                <p v-else>
                                                    <span class="operate_btn" @click="onReexecution(row)">重新执行</span>&nbsp;&nbsp;
                                                    <span class="operate_btn" @click="onOpenReport(row)">打开报告</span>&nbsp;&nbsp;
                                                    <span class="operate_btn" @click="onFallbackReport(row)">回退报告</span>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr v-if="tableData.length == 0" class="nothing_data">
                                            暂无数据
                                        </tr>
                                    </div>
                                </div>
                            </tbody>
                        </table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="原始记录处理" name="2" v-loading="loading">
                    <div class="table_box">
                        <table border="1" class="table_con">
                            <thead class="table_thead">
                                <tr class="thead_tr">
                                    <th>系统ID</th>
                                    <th width="400">原始记录</th>
                                    <th>状态</th>
                                    <th id="oper_original" width="140">操作</th>
                                </tr>
                            </thead>
                            <tbody class="table_tbody">
                                <div class="tbody_scroll"  id="scroll_original">
                                    <div class="tbody_scroll_con" id="scroll_original_con">
                                        <tr class="tbody_tr" v-for="(row,i) in tableData" :key="i">
                                            <td>{{row.id}}</td> <!-- 系统ID --> 
                                            <td width="400">{{row.fileName}}</td> <!-- 原始记录 --> 
                                            <td>{{row.des}}</td> <!-- 状态 --> 
                                            <td width="140"> <!-- 操作 --> 
                                                <span class="operate_btn" @click="onReexecution(row)">重新执行</span>
                                            </td>
                                        </tr>
                                        <tr v-if="tableData.length == 0" class="nothing_data">
                                            暂无数据
                                        </tr>
                                    </div>
                                </div>
                            </tbody>
                        </table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!--下载word和pdf-->
        <object id="WO3Word2" classid="clsid:561C5A99-71C8-48d4-A3E2-16FC4F9880BF" width="0" height="0" style="display:block;"></object>
    </div>
</template>
<script>
import base from "@/api/base"
export default {
    name: 'issuereport',
    data(){
        return {
            disabled: true,
            loading: false, // 加载状态
            tableData: [], // 列表数据
            tabsDefault: '1', // 默认页
        }
    },
    filters:{
        filtStype(val){
            let stype = '';
            switch (val) {
                case 1 : stype = '实验员签名'
                break;
                case 2 : stype = '审核签名'
                break;
                case 3 : stype = '批准签名'
                break;
                case 4 : stype = '修改一次'
                break;
                case 5 : stype = '重新生成快查'
                break;
                case 6 : stype = '纠错'
                break;
                default: stype = ''
            }
            return stype;
        }
    },
    mounted() {
        this.onTabClick(false);
    },
    methods:{
        // 获取数据
        onTabClick(flag, tab) {
            // flag == true 为刷新状态添加刷新提示
            this.tableData = [];
            this.tabsDefault = (tab&&tab.name) ? tab.name : this.tabsDefault;
            // this.tabsDefault 1：问题报告； 2：原始记录；
            let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            let ieBrowser = userAgent.indexOf("Edge");
            if(this.tabsDefault == '1') {
                this.loading = true;
                this.$api.surveyissue.apiFindList().then(res => {
                    this.tableData = res.data.data;
                    this.loading = false;
                    // 判断高度-超出添加滚动条，操作按钮加宽
                    let btn = document.querySelector('#oper_problem');
                    let scroll = document.querySelector('#scroll_problem');
                    let scrollCon = document.querySelector('#scroll_problem_con');
                    let len = this.tableData.length;
                    if(scrollCon.offsetHeight*len > scroll.offsetHeight) {
                        if(!!window.ActiveXObject || "ActiveXObject" in window) { // ie
                            btn.style.width = '317px';
                        } else {
                            btn.style.width = '322px';
                        }
                    } else {
                        btn.style.width = '300px';
                    }
                    if(flag) {
                        this.$message.success('刷新成功！');
                    }
                }).catch(error => {
                    console.log('错误信息',error);
                    this.$message.error(error.data.message);
                    this.loading = false;
                    if(flag) {
                        this.$message.error('刷新失败！');
                    }
                });
            } else if(this.tabsDefault == '2') {
                this.loading = true;
                this.$api.surveyissue.findOrgList().then(res => {
                    this.tableData = res.data.data;
                    this.loading = false;
                    // 判断高度-超出添加滚动条，操作按钮加宽
                    let btn = document.querySelector('#oper_original');
                    let scroll = document.querySelector('#scroll_original');
                    let scrollCon = document.querySelector('#scroll_original_con');
                    let len = this.tableData.length;
                    if(scrollCon.offsetHeight*len > scroll.offsetHeight) {
                        if(!!window.ActiveXObject || "ActiveXObject" in window) { // ie
                            btn.style.width = '157px';
                        } else {
                            btn.style.width = '162px';
                        }
                    } else {
                        btn.style.width = '140px';
                    }
                    if(flag) {
                        this.$message.success('刷新成功！');
                    }
                }).catch(error => {
                    console.log('错误信息',error);
                    this.$message.error(error.data.message);
                    this.loading = false;
                    if(flag) {
                        this.$message.error('刷新失败！');
                    }
                });
            }
        },
        // 重新执行
        onReexecution(row) { 
            // console.log(row, '重新执行');
            if(row.etype == 0){
                this.$confirm('该报告正在处理，禁止此项操作', '提示', {type: 'warning'})
            }else{
                this.$confirm('确认要重新执行该报告吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(this.tabsDefault == '1') { 
                        this.$api.surveyissue.apiReexecuteEeport(row.id).then(res => {
                            // console.log(res,'重新执行成功！');
                            this.$message.success(res.data.data);
                            this.onTabClick(false);
                        }).catch((error) => {
                            console.log(error, '重新执行失败！');
                            this.$message.error(error.data.message);
                        });
                    } else if(this.tabsDefault == '2') {
                        this.$api.surveyissue.reexecuteOrgReport(row.id).then(res => {
                            // console.log(res,'重新执行成功！');
                            this.$message.success(res.data.data);
                            this.onTabClick(false);
                        }).catch((error) => {
                            console.log(error, '重新执行失败！');
                            this.$message.error(error.data.message);
                        });
                    }
                }).catch(() => {
                    this.$message.info('已取消重新执行该报告！');          
                });
            }
        },
        // 回退报告
        onFallbackReport(row) { 
            // console.log(row, '回退报告');
            if(row.etype == 0){
                this.$confirm('该报告正在处理，禁止此项操作', '提示', {type: 'warning'})
            }else{
                this.$confirm('确认要回退该报告吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        execid: row.id,
                        inspectid: row.inspect_id
                    }
                    this.$api.surveyissue.apiBackReport(params).then(res => {
                        // console.log(res,'回退报告成功！');
                        this.$message.success(res.data.data);
                        this.onTabClick(false);
                    }).catch((error) => {
                        console.log(error, '回退报告失败！');
                        this.$message.error(error.data.message);
                    });
                }).catch(() => {
                    this.$message.info('已取消回退该报告！');          
                });
            }
        },
        // 打开报告
        onOpenReport(row) { 
            // console.log(row, '打开报告');
            this.$confirm('确认要打开该报告吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let loginName = JSON.parse(localStorage.getItem("userInfo")).loginName;
                let obj = document.getElementById("WO3Word2");
                if(loginName){
                    this.$api.surveyissue.apiSetSession(row.inspect_id).then(res => {
                        // console.log(res, '打开报告数据获取成功');
                        if(res.data.data == "1"){
                            try {
                                obj.setUid(loginName);
                                obj.setFileId(row.inspect_id);
                                obj.setReportNo(row.pdf);
                                obj.setProcess('3');
                                obj.setRemoteIp(base.baseImgTable);
                                obj.ActiveStart();
                            } catch(error){
                                if (confirm("您确认没有安装Word控件吗? 点确定您将下载setup.zip 解压后运行setup.exe即可！")){
                                    window.open(base.baseImgTable+"/api/file/resources/donet/setup.zip");
                                }
                            }
                        }else if(res.data.data == "2"){
                            this.$message.error('该小批量报告已经被打开，或打开没有正常关闭！');
                        }else {
                            this.$message.error('已经超时，请重新登录！');
                        }
                    }).catch(error => {
                        console.log(error, '打开报告失败');
                        this.$message.error('打开报告数据获取失败！');
                    });
                }
            }).catch(() => {
                this.$message.info('已取消打开该报告！');          
            });
        },
    },
}
</script>
<style lang="scss" scoped>
* {
    border:0;
    padding:0;
    margin:0;
    text-decoration:none;
}


p {
    padding: 0;
    margin: 0;
}

.refresh_btn {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
    border-radius: 4px;
}

.operate_prohibit {
    cursor: not-allowed;
    color: #C0C4CC;
}

.operate_btn {
    cursor: pointer;
    color:#32AFF0;
}

.issuereport_border {
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow: hidden;
    background: #eee;
}
/deep/ .issuereport_con {
    width: 100%;
    height: 100%;
    padding: 20px;
    overflow: hidden;
    background: #fff;
    display: flex;
    flex-direction: column;
    .table_box {
        width: 100%;
        height: 100%;
        overflow: hidden;
        margin: 0;
    }
}
// 页签
/deep/ .detail_log {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    .el-tabs__header {
        margin: 0;
    }
    .el-tabs__content {
        flex: 1;
        .el-tab-pane {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
    }
} 
.table_con {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 1px solid #E4E7ED;
    display: flex;
    flex-direction: column;
    .table_thead {
        display: block;
        width: 100%;
        height: auto;
        .thead_tr {
            background-color: rgb(243, 246, 253);
            color: rgb(96, 98, 102);
        }
    }
    .table_tbody {
        display:block;
        flex: 1;
        overflow: hidden;
        .tbody_scroll {
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }
        .tbody_tr {
            &:nth-child(even) {
                background: #FAFAFA;
            }
        }
    }
    tr {
        display:table;
        table-layout: fixed;

        width: 100%;
        height: 60px;
        line-height: 60px;
        text-align: center;
        th, td {
            border: 1px solid #EBEEF5;
            padding: 0 10px;
        }
    }
}
</style>