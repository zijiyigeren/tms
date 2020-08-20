<template>
    <!-- 绑定模板规则 -->
    <div style="width: 100%;height: 100%;display: flex;flex-direction: column;">
        <el-form
            v-bind="{
                  modal: orderTemplateRule,
                  labelWidth: '120px',
                  labelSuffix: ' :',
                  size: 'mini',
            }"
        >
            <el-row>
                <el-col :span="8">
                    <el-form-item label="报告模板生成总规则" label-width="160px">
                        <el-input v-model="orderTemplateRule.ruleName"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="检测类型">
                        <el-select style="width: 100%;" v-model="orderTemplateRule.checkType">
                            <el-option label="全部" value=""></el-option>
                            <el-option
                                v-for="(item,index) in checkTypeList"
                                :key="'option'+index "
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="创建人">
                        <el-input v-model="orderTemplateRule.creator"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="上传时间">
                        <el-date-picker
                            style="width: 100%;"
                            v-model="dateRangeValue"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item>
                        <p style="text-align: right;">
                            <el-button type="primary" @click="goNextPage('1')">查询</el-button>
                            <el-button type="info">重置</el-button>
                        </p>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-pagination
            :total="total"
            :currentPage="currentPage"
            :pageSize="pageSize"
            v-bind="{
        layout:'total, -> ,prev, pager, next, jumper'
      }"
            @size-change="(val)=>{
          pageSize = val
        }"
            @current-change="(val)=>{
          currentPage = val
        }"
            style="padding-bottom: 10px;"
        />
        {{current_id}}<br>
        <div style="flex: 1;overflow: hidden;" v-loading="loading2">
            <el-table
                v-bind="{
                  height: '400px',
                  border: true,
                  data: tableData,
                }"
            >
                <el-table-column label="序号" :resizable="false" type="index"
                                 :index="i=>(currentPage-1)*pageSize+i+1"
                                 align="center" width="55"/>
                <el-table-column label="报告模板生成总规则名称" :resizable="false" property="ruleName"/>
                <el-table-column label="检测类型" :resizable="false" property="checkType"/>
                <el-table-column label="上传时间" :resizable="false" property="createDate"/>
                <el-table-column label="创建人" :resizable="false" property="creator"/>
                <!--<el-table-column label="id" :resizable="false" property="id"/>-->
                <el-table-column label="操作" :resizable="false" align="center" width="55">
                    <template slot-scope="{ row }">
                        <!--<el-radio
                            class="need-not-label"
                            :checked="row.id == current_id ? true : false"
                            v-model="current_Data"
                            :label="row"><i></i>
                        </el-radio>-->
                        <input type="radio" :checked="row.id == current_id" @click="changeFn1(row.id)" name="nolyRadio">
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <p style="text-align: right;">
            <el-button size="mini" type="primary" @click="okFn">确认</el-button>
            <!--<el-button size="mini" type="">取消</el-button>-->
        </p>
    </div>
</template>

<script>
    const _orderTemplateRule = {
        ruleName: '',
        checkType: '',
        creator: '',
    }
    export default {
        name: 'template_rule_bind',
        data () {
            return {
                //
                checkTypeList: [],
                orderTemplateRule: JSON.parse(JSON.stringify(_orderTemplateRule)),
                dateRangeValue: ['', ''],
                //
                current_id: '',
                current_id2: '',
                //
                current_Data: null,
                //
                total: 0,
                currentPage: 1,
                pageSize: 15,
                //
                loading2: false,
                tableData: [
                    // {
                    //     ruleName: 'ruleName',
                    //     checkType: 'checkType',
                    //     templateType: 'templateType',
                    //     creator: 'creator',
                    //     createDate: 'createDate',
                    // }, {}, {}, {}, {}, {},
                ]
            }
        },
        watch: {
            dateRangeValue (value) {
                if (value == null) {
                    this.orderTemplateRule.fromDate = ''
                    this.orderTemplateRule.toDate = ''
                } else {
                    this.orderTemplateRule.fromDate = value[0]
                    this.orderTemplateRule.toDate = value[1]
                }
            },
        },
        methods: {
            /*
            * 获取检测类型
            * */
            getCheckType () {
                this.$api.templateRule.getCheckType()
                    .then(resp => {
                        let temp = resp.data.data
                        this.checkTypeList = temp.slice(0)
                    })
                    .catch()
            },
            /*
            * 查询
            * */
            goNextPage (currentPage) {
                this.getCheckType()
                this.loading2 = true
                let params = {
                    ...JSON.parse(JSON.stringify(this.orderTemplateRule)),
                    currentPage,
                }
                this.$api.templateRule.templateRule_list(params)
                    .then(resp => {
                        let temp = resp.data.data
                        this.tableData = temp.slice(0)
                        this.total = temp[0].total
                    })
                    .catch(err => {
                    })
                    .then(() => {
                        this.loading2 = false
                    })
            },
            changeFn1 (id) {
                this.current_id = id
            },
            /*
            * 确定
            * */
            okFn () {
                this.$emit('beforeClose_show4', this.current_id2, this.current_id)
            },
        },
    }
</script>

<style scoped lang="less">
    /deep/ .need-not-label {
        .el-radio__label {
            padding: 0;
        }
    }

</style>
