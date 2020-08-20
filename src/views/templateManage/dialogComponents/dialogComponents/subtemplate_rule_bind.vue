<template>
    <!-- 子模板规则 绑定 -->
    <div style="width: 100%;height: 600px;display: flex;flex-direction: column;">绑定子模板规则
        <el-form
            v-bind="{
          modal: orderTemplateSubRule,
          labelWidth: '120px',
          labelSuffix: ' :',
          size: 'mini',
      }"
        >
            <el-row>
                <el-col :span="8">
                    <el-form-item label="子模板规则名称">
                        <el-input v-model="orderTemplateSubRule.subRuleName"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="检测类型">
                        <el-select style="width: 100%;" v-model="orderTemplateSubRule.checkType">
                            <el-option label="全部" value=""/>
                            <el-option
                                v-for="(item,index) in checkTypeList"
                                :key="'option'+index"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="书签名称">
                        <el-input v-model="orderTemplateSubRule.bookName"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="创建人">
                        <el-input v-model="orderTemplateSubRule.creator"/>
                    </el-form-item>
                </el-col>
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
                <el-col :span="8">
                    <el-form-item label="">
                        <div style="text-align: right;width: 100%;">
                            <el-button type="primary" @click="goNextPage('1')">查询</el-button>
                            <el-button type="info" @click="resetButton">重置</el-button>
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
          goNextPage((val + ''))
        }"
            style="padding-bottom: 10px;"
        />
        <div style="flex: 1;overflow: hidden;">
            <el-table
                v-loading="loading"
                v-bind="{
          height: 'calc(100% - 30px)',
          border: true,
          data: tableData,
        }"
            >
                <el-table-column label="序号" :resizable="false" type="index" :index="i=>(currentPage-1)*pageSize+i+1"
                                 align="center" width="55"/>
                <el-table-column label="子模板规则名称" property="subRuleName" :resizable="false"/>
                <el-table-column label="检测类型" property="checkType" :resizable="false"/>
                <el-table-column label="子模板名称" property="" :resizable="false">
                    <template slot-scope="{ row }">
                        {{row.id}}
                        <!--{{row.orderTemplate.templateName}}-->
                    </template>
                </el-table-column>
                <el-table-column label="书签名称" property="bookName" :resizable="false"/>
                <el-table-column
                    label="创建时间"
                    property="createDate"
                    :resizable="false"
                    :formatter="formatter_createDate"
                />
                <el-table-column label="创建人" property="creator" :resizable="false"/>
                <el-table-column label="备注" property="remark" :resizable="false"/>
                <el-table-column label="操作" :resizable="false" align="center" width="55">
                    <template slot-scope="{row}">
                        <input type="checkbox"
                               :checked="checkedFn(row.id)"
                               @change="checkboxChangeFn(row.id)"
                        />
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <p style="text-align: right;">
            <el-button size="mini" type="primary" @click="btn1Fn">确认</el-button>
            <!--<el-button size="mini" type="">取消</el-button>-->
        </p>
    </div>
</template>

<script>
    import {timestampToTime,} from '@/views/templateManage/js/index.js'

    const _orderTemplateSubRule = {
        subRuleName: '',
        checkType: '',
        bookName: '',
        creator: '',
        fromDate: '',
        toDate: '',
    }
    export default {
        name: 'subTemplateRuleBind',
        data () {
            return {
                checkTypeList: [],
                dateRangeValue: ['', ''],
                //
                orderTemplateSubRule: JSON.parse(JSON.stringify(_orderTemplateSubRule)),
                //
                total: 0,
                currentPage: 1,
                pageSize: 15,
                //
                tableData: [],
                loading: false,
                bindIds: [],
            }
        },
        props: {},
        watch: {
            dateRangeValue (value) {
                if (value == null) {
                    this.orderTemplateSubRule.fromDate = ''
                    this.orderTemplateSubRule.toDate = ''
                } else {
                    this.orderTemplateSubRule.fromDate = Date.parse(value[0])
                    this.orderTemplateSubRule.toDate = Date.parse(value[1])
                }
            },
        },
        methods: {
            getCheckType () {
                this.$api.subtemplateRule.getCheckType()
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
                this.loading = true
                let parmas = {
                    ...JSON.parse(JSON.stringify(this.orderTemplateSubRule)),
                    currentPage,
                }
                this.$api.subtemplateRule.subtemplateRule_list(parmas)
                    .then(resp => {
                        let temp = resp.data.data
                        this.tableData = [...temp]
                        this.total = temp[0].total
                    })
                    .catch()
                    .then(() => {
                        this.loading = false
                    })
            },
            /*
            * 重置
            * */
            resetButton () {
            },
            /*
            * 时间戳格式化
            * */
            formatter_createDate (row, column, cellValue, index) {
                return timestampToTime(cellValue)
            },
            /*
            * 记录选中的id,并组成数组
            * */
            checkboxChangeFn (data) {
                if (event.target.checked == true) {
                    if (this.bindIds.indexOf(data) < 0) {
                        this.bindIds.push(data)
                    }
                } else {
                    if (this.bindIds.indexOf(data) >= 0) {
                        let _index = this.bindIds.indexOf(data)
                        this.bindIds.splice(_index, 1)
                    }
                }
            },
            /*
            * 判断行内数据是否选中
            * */
            checkedFn (id) {
                return this.bindIds.includes(id)
            },
            /*
            * 向父级组件代入信息
            * */
            btn1Fn () {
                this.$emit('GETfn1_bindIds', this.bindIds)
            },
        }
    }
</script>

<style scoped>

</style>
