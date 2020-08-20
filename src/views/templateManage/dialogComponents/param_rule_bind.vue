<template>
    <!-- 绑定数据填写规则 -->
    <div style="width: 100%;height: 100%;display: flex;flex-direction: column;">
        {{current_id}}
        <el-form
            v-bind="{
          modal: paramRule,
          labelWidth: '120px',
          labelSuffix: ' :',
          size: 'mini',
      }"
        >
            <el-row>
                <el-col :span="8">
                    <el-form-item label="模板数据填写规则名称" label-width="160px">
                        <el-input v-model="paramRule.ruleName"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="检测类型">
                        <el-select style="width: 100%;" v-model="paramRule.checkType">
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
                    <el-form-item label="模板类型">
                        <el-select style="width: 100%;" v-model="paramRule.templateType">
                            <el-option label="1" value="1"></el-option>
                            <el-option label="12" value="12"></el-option>
                        </el-select>
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
                            <el-button type="primary" size="" @click="goNextPage('1')">查询</el-button>
                            <el-button type="info" size="">重置</el-button>
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
        <div style="flex: 1;overflow: hidden;" v-loading="Loading1">
            <el-table
                v-bind="{
          height: 'calc(100% - 30px)',
          border: true,
          data: tableData,
        }"
            >
                <el-table-column label="序号" :resizable="false" type="index" :index="i=>(currentPage-1)*pageSize+i+1"
                                 align="center" width="55"/>
                <el-table-column label="模板数据填写规则名称" :resizable="false" property="ruleName"/>
                <el-table-column label="检测类型" :resizable="false" property="checkType"/>
                <el-table-column label="模板类型" :resizable="false" property="templateType"/>
                <el-table-column label="创建人" :resizable="false" property="creator"/>
                <el-table-column label="上传时间" :resizable="false" property="createDate"/>
                <el-table-column label="操作" :resizable="false" align="center" width="55">
                    <template slot-scope="{ row }">
                        <input type="radio" :checked="row.id == current_id" name="onlyOneRadio"
                               @click="changeFn1(row.id)">
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
    const _paramRule = {
        ruleName: '',
        checkType: '',
        templateType: '',
    }
    export default {
        name: 'param_rule_bind',
        data () {
            return {
                checkTypeList: [],
                paramRule: JSON.parse(JSON.stringify(_paramRule)),
                dateRangeValue: ['', ''],
                //
                total: 0,
                currentPage: 1,
                pageSize: 15,
                //
                Loading1: false,
                tableData: [
                    // {
                    //     ruleName: 'ruleName',
                    //     checkType: 'checkType',
                    //     templateType: 'templateType',
                    //     creator: 'creator',
                    //     createDate: 'createDate',
                    // }, {}, {}, {}, {}, {},
                ],
                current_id: '',
                current_id2: '',
            }
        },
        watch: {
            dateRangeValue (value) {
                if (value == null) {
                    this.paramRule.fromDate = ''
                    this.paramRule.toDate = ''
                } else {
                    this.paramRule.fromDate = value[0]
                    this.paramRule.toDate = value[1]
                }
            },
        },
        methods: {
            /*
            * 获取检测类型
            * */
            getCheckType () {
                this.$api.paramRule.getCheckType()
                    .then((resp) => {
                        let temp = resp.data.data
                        this.checkTypeList = temp.slice(0)
                    })
                    .catch(() => {
                    })
            },
            /*
            * 查询
            * */
            goNextPage (currentPage) {
                this.getCheckType()
                this.Loading1 = true
                let params = {
                    ...JSON.parse(JSON.stringify(this.paramRule)),
                    currentPage,
                    pageSize: this.pageSize,
                }
                this.$api.paramRule.paramrule_search(params)
                    .then(resp => {
                        let temp = resp.data.data
                        this.total = temp[0].total
                        this.tableData = [...temp]
                    })
                    .catch(err => {
                    })
                    .then(() => {
                        this.Loading1 = false
                    })
            },
            changeFn1 (id) {
                this.current_id = id
            },
            /*
            * 确定
            * */
            okFn () {
                this.$emit('beforeClose_show3', this.current_id2, this.current_id)
            },
        }
    }
</script>

<style scoped>

</style>
