<template>
    <!-- 绑定判别信息 -->
    <div style="height: 600px;display: flex;flex-direction: column">
        <el-form
            v-bind="{
                model: judgeInfo,
                labelWidth: '90px',
                labelSuffix: ' :',
                size: 'mini',
            }"
        >
            <el-row>
                <el-col :span="8">
                    <el-form-item label="检测类型">
                        <el-select style="width: 100%;" v-model="judgeInfo.checkType">
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
                <el-col :span="12">
                    <el-form-item label="判别信息">
                        <div style="width: 60%;display: flex;justify-content: space-around;">
                            <el-input style="width: 49%;" v-model="judgeInfo.judgeName"></el-input>
                            <el-input style="width: 49%;" v-model="judgeInfo.judgeValue"></el-input>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="标签名称">
                        <el-input v-model="judgeInfo.bookName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="上传时间">
                        <div style="display: flex;">
                            <el-date-picker
                                style="width: 60%;"
                                v-model="dateRangeValue"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                            />
                            <div style="width: 35%;text-align: right;">
                                <el-button type="primary" @click="goNextPage('1')">查询</el-button>
                                <el-button type="info">重置</el-button>
                            </div>
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
              goNextPage((val+''))
            }"
        />
        <!--{{bindIds}}<br>
        {{bindNames}}-->
        <div style="flex: 1;overflow: auto;" v-loading="loading1">
            <el-table
                v-bind="{
                  height: 'calc(100% - 15px)',
                  border: true,
                  data: tableData,
                  // cellClassName:cellClassNameFn1
                }"
            >
                <el-table-column label="序号" :resizable="false" type="index"
                                 :index="i=>(currentPage-1)*pageSize+i+1"
                                 align="center" width="55"/>
                <el-table-column label="检测类型" :resizable="false" property="checkType"/>
                <el-table-column label="判别信息" :resizable="false" property="" align="center">
                    <template slot-scope="{ row }">
                        {{row.judgeName}}|{{row.judgeValue}}
                    </template>
                </el-table-column>
                <el-table-column label="标签名称" :resizable="false" property="bookName"/>
                <el-table-column label="上传时间" :resizable="false" property="createDate"/>
                <el-table-column label="操作" :resizable="false" align="center" width="55">
                    <template slot-scope="{ row }">
                        <input type="checkbox"
                               :checked="checkedFn(row.id)"
                               @change="checkboxChangeFn(row.id,row.judgeName)"
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
    let judgeInfo = {
        checkType: '',
        judgeName: '',
        judgeValue: '',
        bookName: '',
        fromDate: '',
        toDate: '',
    }

    export default {
        name: 'judge_info_bind',
        data () {
            return {
                checkTypeList: [],
                //
                judgeInfo: JSON.parse(JSON.stringify(judgeInfo)),
                dateRangeValue: ['', ''],
                //
                total: 0,
                currentPage: 1,
                pageSize: 15,
                //
                tableData: [],
                loading1: false,
                bindIds: [],
                bindNames: [],
            }
        },
        watch: {
            dateRangeValue (value) {
                if (value == null) {
                    this.judgeInfo.fromDate = ''
                    this.judgeInfo.toDate = ''
                } else {
                    this.judgeInfo.fromDate = value[0]
                    this.judgeInfo.toDate = value[1]
                }
            }
        },
        methods: {
            /*
            * 获取检测类型
            * */
            getCheckType () {
                this.$api.judgeInfo.getCheckType()
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
                this.loading1 = true
                let params = {
                    ...JSON.parse(JSON.stringify(this.judgeInfo)),
                    currentPage: currentPage,
                }
                this.$api.judgeInfo.judgeInfo_list(params)
                    .then(resp => {
                        let temp = resp.data.data
                        if (temp) {
                            this.tableData = temp
                            this.total = temp[0].total
                            this.pageSize = temp[0].pageSize
                        }
                    })
                    .catch(err => {
                    })
                    .then(() => {
                        this.loading1 = false
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

            btn1Fn () {
                this.$emit('GETfn1_bindIds', this.bindIds, this.bindNames)
            },
        },
        filters: {},
        created () {
            // /*
            // * 获取检测类型
            // * */
            // this.$api.judgeInfo.getCheckType()
            //     .then((resp) => {
            //         let temp = resp.data.data
            //         this.checkTypeList = temp.slice(0)
            //     })
            //     .catch(() => {
            //     })
        }

    }
</script>

<style scoped lang="less">
    /*/deep/ .el-table .mlyTableTdClass {
      padding: 0 !important;
    }*/
</style>
