<template>
    <div style="width:100%;display: flex;flex-direction: column;">
        <el-form
            v-bind="{
                  modal: paramSubRule,
                  labelWidth: '120px',
                  labelSuffix: ' :',
                  size: 'mini',
            }"
        >
            <el-row>
                <el-col :span="6">
                    <el-form-item label="单数据填写规则">
                        <el-input v-model="paramSubRule.ruleName"/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="检测类型">
                        <el-select style="width: 100%;" v-model="paramSubRule.checkType">
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
                <el-col :span="6">
                    <el-form-item label="书签名称">
                        <el-input v-model="paramSubRule.bookName"/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="模板类型">
                        <el-select style="width: 100%;" v-model="paramSubRule.templateType">
                            <el-option label="主模板" value="0"/>
                            <el-option label="子模板" value="1"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="创建人">
                        <el-input v-model="paramSubRule.creator"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="上传时间">
                        <el-date-picker
                            style="width: 100%;"
                            v-model="dateRangeValue"
                            format="yyyy-MM-dd"
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="">
                        <div style="text-align: right;width: 100%;">
                            <el-button type="primary" @click="goNextPage(1)">查询</el-button>
                            <el-button type="info">重置</el-button>
                        </div>
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
                goNextPage(value)
            }"
            style="padding-bottom: 10px;"
        />
        <div style="flex: 1;overflow: hidden;" v-loading="loading">
            <el-table
                v-bind="{
                  height: 'calc(100% - 20px)',
                  border: true,
                  data: tableData,
                }"
            >
                <el-table-column label="操作" :resizable="false" align="center" width="55">
                    <template slot-scope="{ row }">
                        <input type="checkbox"
                               :checked="checkedFn(row.id)"
                               @change="checkboxChangeFn(row.id,row.ruleName)"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="序号" :resizable="false" type="index" :index="i=>(currentPage-1)*pageSize+i+1"
                                 align="center" width="55"/>
                <el-table-column
                    property="ruleName"
                    label="单数据填写规则名称"
                    :resizable="false"
                    min-width="200"
                />
                <el-table-column
                    property="checkType"
                    label="检测类型"
                    :resizable="false"
                    min-width="150"
                />
                <el-table-column
                    property="templateType"
                    label="模板类型"
                    :resizable="false"
                    min-width="150"
                />
                <el-table-column
                    property="bookName"
                    label="书签名称"
                    :resizable="false"
                    min-width="150"
                />
                <el-table-column
                    property="formulaType"
                    label="公式类型"
                    :resizable="false"
                    min-width="150"
                />
                <el-table-column
                    property="createDate"
                    label="创建时间"
                    :resizable="false"
                    min-width="150"
                />
                <el-table-column
                    property="creator"
                    label="创建人"
                    :resizable="false"
                    min-width="150"
                />
                <el-table-column
                    property="remark"
                    label="备注"
                    :resizable="false"
                    min-width="150"
                />
            </el-table>
        </div>
        <p style="text-align: right;">
            <el-button size="mini" type="primary" @click="okFn">确认</el-button>
            <!--<el-button size="mini" type="">取消</el-button>-->
        </p>
    </div>
</template>

<script>
    import {timestampToTime,} from '@/views/templateManage/js/index.js'

    let __form1 = {
        ruleName: '',
        checkType: '',
        bookName: '',
        templateType: '',
        creator: '',
        remark: '',
        fromDate: '',
        toDate: '',
    }
    export default {
        name: 'param_sub_rule_bind',
        data () {
            return {
                checkTypeList: [],
                paramSubRule: JSON.parse(JSON.stringify(__form1)),
                dateRangeValue: ['', ''],
                //
                total: 0,
                currentPage: 1,
                pageSize: 15,
                //
                loading: false,
                tableData: [],
                //
                bindIds: [],
                bindNames: [],
            }
        },
        watch: {
            dateRangeValue (value) {
                if (value == null) {
                    this.paramSubRule.fromDate = ''
                    this.paramSubRule.toDate = ''
                } else {
                    this.paramSubRule.fromDate = Date.parse(value[0])
                    this.paramSubRule.toDate = Date.parse(value[1])
                }
            },
        },
        methods: {
            /*
            * 获取检测类型
            * */
            getCheckType () {
                this.$api.paramSubRule.getCheckType()
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
                this.loading = true
                this.getCheckType()
                let params = {
                    ...this.paramSubRule,
                    currentPage,
                }
                this.$api.paramSubRule.listSubRule(params)
                    .then(res => {
                        let temp = res.data.data
                        this.tableData = temp.slice(0)
                        this.total = temp[0].total
                    })
                    .catch()
                    .then(() => {
                        this.loading = false
                    })
            },
            checkedFn (id) {
                return this.bindIds.includes(id)
            },
            checkboxChangeFn (data, data2) {
                if (event.target.checked == true) {
                    if (this.bindIds.indexOf(data) < 0) {
                        this.bindIds.push(data)
                        this.bindNames.push(data2)
                    }
                } else {
                    if (this.bindIds.indexOf(data) >= 0) {
                        let _index = this.bindIds.indexOf(data)
                        this.bindIds.splice(_index, 1)
                        this.bindNames.splice(_index, 1)
                    }
                }
            },

            okFn () {
                this.$emit('closeDialogFn1_1', this.bindIds, this.bindNames)
                this.$emit('closeDialogFn2', this.bindIds)
            },

        }
    }
</script>

<style scoped lang="less">

</style>
