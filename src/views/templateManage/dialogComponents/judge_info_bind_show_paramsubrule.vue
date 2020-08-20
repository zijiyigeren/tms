<template>
    <div style="display: flex;flex-direction: column;">
        <p style="text-align: center;">
            <el-button type="primary" style="width: 110px;" @click="goBind">添加</el-button>
            <el-button type="warning" style="width: 110px;" @click="goBatchDelete">删除</el-button>
        </p>
        {{subIds}}
        <div style="flex: 1;overflow: auto;" v-loading="loading">
            <table class="mlyTableClass">
                <tr>
                    <th style="width: 55px;">序号</th>
                    <th>检测类型</th>
                    <th colspan="2">判别信息</th>
                    <th>标签名称</th>
                    <th>上传时间</th>
                    <th style="width: 55px;">操作</th>
                </tr>
                <tr
                    v-if="tableData.length == 0"
                >
                    <td colspan="7" style="height: 45px;">
                        暂无数据
                    </td>
                </tr>
                <tr
                    v-for="(item,index) in tableData"
                    :key="item.id"
                >
                    <td>{{index+1}}</td>
                    <td>{{item.checkType}}</td>
                    <td>{{item.judgeName}}</td>
                    <td>{{item.judgeValue}}</td>
                    <td>{{item.bookName}}</td>
                    <td>{{item.createDate}}</td>
                    <td>
                        <el-checkbox
                            @change="checkboxChangeFn(item.id)"
                        />
                    </td>
                </tr>
            </table>
        </div>

        <!-- 绑定子模板规则 -->
        <el-dialog
            :visible.sync="show3"
            v-bind="{
                  title: '绑定判别信息',
                  // top: '4vh',
                  width: '80%',
                  closeOnClickModal: false,
                  closeOnPressEscape: false,
                  modal: false,
                  // append-to-body
            }"
            @close="close_show3"
        >
            <JudgeInfoBind
                ref="JudgeInfoBind"
                @GETfn1_bindIds="GETfn1_bindIds"
            />
        </el-dialog>
    </div>
</template>

<script>
    import JudgeInfoBind from './dialogComponents/judge_info_bind.vue'

    export default {
        name: 'judge_info_bind_show_paramsubrule',
        components: {
            JudgeInfoBind,
        },
        props: {
            rowId: {
                type: String,
                default () {
                    return ''
                }
            }
        },
        watch: {
            rowId (val) {
                if (val !== '') {
                    // this.goBindJudgeInfoShow(val)
                }
            }
        },
        data () {
            return {
                currentId: '',
                //
                loading: false,
                tableData: [],
                //
                subIds: [],
                //
                arr1: [],
                //
                show3: false,
            }
        },
        methods: {
            /*
            * 查询
            * */
            goBindJudgeInfoShow (id) {
                this.loading = true
                this.$api.subtemplateRule.goBindJudgeInfoShow({id: id})
                    .then(res => {
                        let temp = res.data.data
                        this.tableData = temp['judgeInfos'].slice(0)
                        this.arr1 = this.tableData.map(item => {
                            return item.id
                        })
                    })
                    .catch()
                    .then(() => {
                        this.loading = false
                    })
            },
            /*
            * 记录选中的id,并组成数组
            * */
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
            /*
            * 查看判别信息 - 删除
            * */
            goBatchDelete () {
                if (this.subIds.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '请选择要删除的数据'
                    })
                    return
                }
                let params = {
                    subRuleId: this.currentId,
                    judgeInfoIds: this.subIds.toString()
                }
                this.$api.paramSubRule.unbindFn1(params)
                    .then(res => {
                        let temp = res.data.data
                        this.subIds = []
                        this.tableData = temp.slice(0)
                    })
                    .catch()
            },
            /*
            * 添加
            * */
            goBind () {
                this.show3 = true
                let temp = this.tableData.map((item) => {
                    return item.id
                })
                this.$nextTick(() => {
                    this.$refs['JudgeInfoBind'].bindIds = [...temp]
                    this.$refs['JudgeInfoBind'].goNextPage('1')
                })
            },
            /*
            * 查看判别信息 - 确定添加
            * */
            GETfn1_bindIds (data) {
                let params = {
                    subRuleId: this.currentId,
                    judgeInfoIds: data.toString()
                }
                this.$api.paramSubRule.bindJudegeInfoFn1(params)
                    .then(res => {
                        this.show3 = false
                        let temp = res.data.data
                        this.tableData = temp.slice(0)
                    })
                    .catch()
            },
            /*
            * 绑定判别信息弹框 - 关闭时
            * */
            close_show3 () {
                Object.assign(
                    this.$refs['JudgeInfoBind'].$data,
                    this.$refs['JudgeInfoBind'].$options.data()
                )
            },
        }
    }
</script>

<style scoped lang="less">
    @import "../style/subtemplate_rule";
</style>
