<template>
    <div class="threeFlowTable">
        <!-- 三级流转表格 -->
        <el-table
            border
            stripe
            :data="threeTableList"
            :header-cell-style="{
                'background-color': 'rgba(243,246,253,1)',
                'color': '#606266',
                'padding': '10px 0'
            }">
            <el-table-column
                label="序号"
                type="index"
                prop="flowtid"
                align="center"
                width="50"
                :resizable="false">
            </el-table-column>
            <el-table-column
                label="节点名称"
                prop="flowname"
                align="center"
                :resizable="false">
                <template slot-scope="scope">
                    <span :style="scope.row.reason ? 'color:red;' : 'color:#000;' ">{{scope.row.flowname}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="负责人"
                prop="name"
                align="center"
                :resizable="false">
            </el-table-column>
            <el-table-column
                label="开始时间"
                prop="create_date"
                align="center"
                :resizable="false">
            </el-table-column>
            <el-table-column
                label="结束时间"
                prop="end_date"
                align="center"
                :resizable="false">
            </el-table-column>
            <el-table-column
                label="处理意见"
                prop="reason"
                align="center"
                :resizable="false">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    props:['threeTableList'],
    data() {
        return {
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
