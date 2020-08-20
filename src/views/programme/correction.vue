<template>
    <!-- 统计表编号纠错 -->
    <div class="correction_box">
        <div class="warp">
            <!-- 查询 -->
            <div class="query">
                <el-form :inline="true" ref="formQuery" size="small" style="flex:1;">
                    <el-form-item label="统计表编号：">
                        <el-input v-model.trim="statNumber" @keyup.enter.native="enterQuery" name="clearInputValue" clearable></el-input>
                    </el-form-item>
                </el-form>

                <!-- 查询按钮 -->
                <div class="query_btn">
                    <el-button type="primary" @click="onClickQuery(statNumber)">查询</el-button>
                </div>
            </div>

            <!-- 表格 -->
            <div class="table_box">
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
                        <el-table-column prop="statNumber" label="统计表编号" align="center" :resizable="false"></el-table-column>
                        <el-table-column prop="dp.entName" label="企业名称" align="center" :resizable="false"></el-table-column>
                        <el-table-column prop="dp.entId" label="企业ID" align="center" :resizable="false"></el-table-column>
                        <el-table-column prop="dp.model" label="型号" align="center" :resizable="false"></el-table-column>
                        <el-table-column prop="dp.brand" label="商标" align="center" :resizable="false"></el-table-column>
                        <el-table-column prop="dp.name" label="名称" align="center" :resizable="false"></el-table-column>
                        <el-table-column label="类型" align="center" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.dp.proType == 'new'">新产品</span>
                                <p v-else>
                                    <span v-if="scope.row.dp.zgsign == '1'">整车整改</span>
                                    <span v-else>扩展</span>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" :resizable="false">
                            <template slot-scope="scope">
                                <el-button type="text" class="operation_btn" @click="onClickModifyNumber(scope.row)">修改编号</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

        </div>

        <!-- 修改编号 -->
        <el-dialog title="修改编号" :visible.sync="dialogVisible">
            <div class="dialog_box"> 统计表编号：<el-input v-model.trim="modifyNumber"></el-input> </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="determineModifyNumber">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'correction',
    components: {},
    data() {
        return {
            loading: false, // 加载状态
            tablelist: [],// table数据
            statNumber: '', // 查询-编号
            dialogVisible: false, // 修改编号对话框
            rowID: '', // 点击修改时当前id
            modifyNumber: '', // 统计表编号
        }
    },
    created() {

    },
    mounted() {
        this.onClickQuery(this.statNumber);
    },
    methods: {
        // 点击查询
        onClickQuery(statNumber) {
            this.loading = true;
            this.$api.correction.apiZjstatictableFindList(statNumber).then(res => {
                let data = res.data.data.list;
                if(data){
                    this.tablelist = data;
                    this.loading = false;
                }
            }).catch((error) => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
                this.loading = false;
            })
        },
        // 回车查询
        enterQuery(e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode == 13) {
                this.onClickQuery(this.statNumber);
            }
        },
        // 点击修改编号
        onClickModifyNumber(row) {
            this.dialogVisible = true;
            this.rowID = row.id;
            this.modifyNumber = row.statNumber;
        },
        // 确定修改编号
        determineModifyNumber() {
            let params = {
                id: this.rowID,
                statNumber: this.modifyNumber
            }
            this.$api.correction.apiZjstatictableEdit(params).then(res => {
                this.$message({ type: 'success', message: res.data.data, duration: 1500 });
                this.onClickQuery(this.statNumber);
                this.dialogVisible = false;
            }).catch((error) => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
                this.dialogVisible = false;
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.correction_box {
    width: 100%;
    height: 100%;
    background: #eee;
    padding: 10px;
    overflow: hidden;
}
.warp {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.query {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.table_box {
    flex: 1;
    overflow: hidden;
}

.table-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
}

.el-button--default {
    height: 30px;
    background: #fff;
    padding: 0 20px;
    margin: 0;
}

.el-button--primary {
    height: 30px;
    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
    padding: 0 20px;
    margin: 0;
}

.operation_btn {
    color: #32AFF0;
    margin-right: 6px;
}

.dialog_box {
    width: 50%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    white-space:nowrap !important;
}
</style>
