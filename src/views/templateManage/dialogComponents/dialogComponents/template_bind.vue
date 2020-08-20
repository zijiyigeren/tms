<template>
    <!-- 绑定模板 -->
    <div style="height: 600px;display: flex;flex-direction: column">
        <el-form
            v-bind="{
                labelWidth: '90px',
                labelSuffix: ' :',
                size: 'mini',
            }"
        >
            <el-row>
                <el-col :span="6">
                    <el-form-item label="模板名称">
                        <el-input v-model="orderTemplate.templateName"/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="检测类型">
                        <el-select v-model="orderTemplate.checkType">
                            <el-option label="全部" value=""/>
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
                    <el-form-item label="模板类型">
                        <el-select v-model="orderTemplate.templateType">
                            <el-option label="子模板" value="0"></el-option>
                            <el-option label="主模板" value="1"></el-option>
                            <el-option label="样品模板" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
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
            </el-row>
        </el-form>
        <p style="text-align: right;">
            <el-button size="mini" type="primary" @click="goNextPage(1)">查询</el-button>
            <el-button size="mini" type="info" @click="">重置</el-button>
        </p>
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
        />
        <div style="flex: 1;">
            <el-table
                v-bind="{
                  height: 'calc(100% - 10px)',
                  border: true,
                  data: tableData,
                }"
            >
                <el-table-column label="序号" :resizable="false" type="index"
                                 :index="i=>(currentPage-1)*pageSize+i+1"
                                 align="center" width="55"/>
                <el-table-column label="模板名称" :resizable="false" property="templateName"/>
                <el-table-column label="检测类型" :resizable="false" property="checkType"/>
                <el-table-column label="模板类型" :resizable="false" property="templateType"/>
                <el-table-column label="上传时间" :resizable="false" property="createDate"/>
                <el-table-column label="操作" :resizable="false" align="center" width="55">
                    <template slot-scope="{ row }">
                        <el-radio class="need-not-label" v-model="currentRadio" :label="row"><i></i></el-radio>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--{{currentRadio}}-->
        <p style="text-align: right;">
            <el-button size="mini" type="primary" @click="okFn1">确认</el-button>
            <!--<el-button size="mini" type="">取消</el-button>-->
        </p>
    </div>
</template>

<script>
    let _orderTemplate = {
        templateName: '',
        templateType: '',
        checkType: '',
        fromDate: '',
        toDate: '',
    }
    export default {
        name: 'template_bind',
        data () {
            return {
                //
                orderTemplate: JSON.parse(JSON.stringify(_orderTemplate)),
                checkTypeList: [],
                dateRangeValue: ['', ''],
                //
                total: 0,
                currentPage: 1,
                pageSize: 15,
                //
                tableData: [],
                //
                currentRadio: null,
            }
        },
        watch: {
            dateRangeValue (value) {
                if (value == null) {
                    this.orderTemplate.fromDate = ''
                    this.orderTemplate.toDate = ''
                } else {
                    this.orderTemplate.fromDate = value[0]
                    this.orderTemplate.toDate = value[1]
                }
            }
        },
        methods: {
            /*
            * 获取检测类型
            * */
            getCheckType () {
                // this.$api.subtemplateRule.getCheckType()
                //     .then((resp) => {
                //         let temp = resp.data.data
                //         this.checkTypeList = temp.slice(0)
                //     })
                //     .catch(() => {
                //     })
            },
            /*
            * 查询
            * */
            goNextPage (currentPage) {
                let that = this
                this.getCheckType()
                let params = {
                    currentPage,
                    ...this.orderTemplate
                }
                this.$api.templateMgmt.getLis(params)
                    .then(res => {
                        let temp = res.data.data
                        this.tableData = temp.slice(0)
                        try {
                            that.total = temp[0].total
                        } catch (e) {
                            that.total = 0
                        }
                    })
                    .catch()
            },
            /*
            * 重置
            * */
            resetButton () {
            },
            /*
            * 确定
            * */
            okFn1 () {
                if (!this.currentRadio) {
                } else {
                    let data = {
                        id: this.currentRadio.id,
                        name: this.currentRadio.templateName,
                    }
                    this.$emit('getTemplateInfo', data)
                }

            },
        }
    }
</script>

<style scoped lang="less">
    @import "./../style/template_bind";
</style>
