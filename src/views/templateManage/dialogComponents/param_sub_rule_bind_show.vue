<template>
    <div style="display: flex;flex-direction: column;">
        <p style="text-align: center;">
            <el-button type="primary" style="width: 110px;" @click="goBind">添加</el-button>
            <el-button type="warning" style="width: 110px;" @click="goBatchDelete">删除</el-button>
        </p>
        <!--{{subIds}}-->
        <div style="flex: 1;overflow: auto" v-loading="loading">
            <table class="mlyTableClass">
                <tr>
                    <th>序号</th>
                    <th>单数据填写规则</th>
                    <th>检测类型</th>
                    <th>模板类型</th>
                    <th>书签名称</th>
                    <th>公式类型</th>
                    <th>创建时间</th>
                    <th>创建人</th>
                    <th>备注</th>
                    <th>操作</th>
                </tr>
                <tr v-if="tableData.length==0">
                    <td colspan="10">暂无数据</td>
                </tr>
                <tr v-for="(row,index) in tableData" :key="row.id">
                    <td>{{index+1}}</td>
                    <td>{{row.ruleName}}</td>
                    <td>{{row.checkType}}</td>
                    <td>{{row.templateType}}</td>
                    <td>{{row.bookName}}</td>
                    <td>{{row.formulaType}}</td>
                    <td>{{row.createDate}}</td>
                    <td>{{row.creator}}</td>
                    <td>{{row.remark}}</td>
                    <td>
                        <input
                            type="checkbox"
                            @change="checkboxChangeFn(row.id)"
                        >
                    </td>
                </tr>
            </table>
        </div>

        <!-- 绑定单数据填写规则 -->
        <el-dialog
            :visible.sync="show1"
            v-bind="{
                title: '绑定单数据填写规则',
                width:'80%',
                top: '10vh',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                modal: false,
            }"
            @close="close_show1"
        >
            <ParamSubRuleBind
                style="height: 600px;"
                ref="ParamSubRuleBind"
                @closeDialogFn2="closeDialogFn2"
            />
        </el-dialog>
    </div>
</template>

<script>
    import ParamSubRuleBind from './dialogComponents/param_sub_rule_bind'

    export default {
        name: 'param_sub_rule_bind_show',
        components: {
            ParamSubRuleBind,
        },
        data () {
            return {
                rowId: null,
                tableData: [],
                loading: false,
                //
                subIds: [],
                // 绑定单数据填写规则
                show1: false
            }
        },
        methods: {
            goBind () {
                this.show1 = true
                this.$nextTick(() => {
                    this.$refs['ParamSubRuleBind'].bindIds = this.tableData.map(item => {
                        return item.id
                    })
                    this.$refs['ParamSubRuleBind'].goNextPage('1')
                })
            },
            /*
* 单数据填写规则 弹框 关闭前
* */
            closeDialogFn2 (data) {
                if (data.length !== 0) {
                    let params ={
                        ruleId:this.rowId,
                        subRuleIds: data.toString()
                    }
                    this.$api.paramRule.unbindSubRule2(params)
                        .then(res => {
                            this.subIds = []
                            this.tableData = res.data.data.slice(0)
                            this.show1 = false

                        })
                        .catch()
                }
            },
            /*
            * 单数据填写规则 弹框 关闭时
            * */
            close_show1 () {
                Object.assign(
                    this.$refs['ParamSubRuleBind'].$data,
                    this.$refs['ParamSubRuleBind'].$options.data()
                )
            },
            /**/
            checkboxChangeFn (data) {
                if (event.target.checked == true) {
                    if (this.subIds.indexOf(data) < 0) {
                        this.subIds.push(data)
                    }
                } else {
                    if (this.subIds.indexOf(data) >= 0) {
                        let _index = this.subIds.indexOf(data)
                        this.subIds.splice(_index, 1)
                    }
                }
            },
            goBatchDelete () {
                // this.$emit('open_show2_1')
                if (this.subIds.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '请选择要删除的数据'
                    })
                    return
                }
                let params = {
                    ruleId: this.rowId,
                    subRuleIds: this.subIds.toString()
                }
                this.$api.paramRule.unbindSubRule(params)
                    .then(res => {
                        this.subIds = []
                        this.tableData = res.data.data.slice(0)
                        // this.goBindJudgeInfoShow(this.rowId)
                    })
                    .catch()
            },
        }
    }
</script>

<style scoped lang="less">
    @import "../style/param_rule";
</style>
