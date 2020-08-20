<template>
    <!-- 导出列表 -->
    <div class="exportList_border">
        <div class="exportList_con" v-loading="loading">
            <!-- 查询 -->
            <div class="query_modular">
                <!-- 数据表切换 -->
                <template-method
                    v-model="dataSheetCode"
                    :type="'select'"
                    :dicCode="'autoExport'"
                    :triggerChange="true"
                    @change="dataSheetChange"
                />
                <div class="query_complex">
                    <el-form :inline="true" class="query_form" label-width="120px">
                        <el-form-item :label="item.dbFieldTxt+'：'" v-for="item in lessQueryData" :key="item.id">
                            <!-- 输入框 -->
                            <el-input 
                                v-if="item.fieldShowType=='text'"
                                v-model.trim="item.value"
                                clearable 
                                name="clearInputValue" 
                                @keyup.enter.native="onPressEnter" 
                                placeholder="请输入">
                            </el-input>

                            <!-- 下拉框-有默认值 -->
                            <template-method
                                v-else-if="item.fieldShowType=='list' && item.dictField && item.value"
                                v-model="item.value"
                                :type="'select'"
                                :dicCode="item.dictField"
                            />

                             <!-- 下拉框-无默认值 -->
                            <template-method
                                v-else-if="item.fieldShowType=='list' && item.dictField"
                                v-model="item.value"
                                :type="'select'"
                                :dicCode="item.dictField"
                                :defaultVal="'全部'"
                            />

                            <!-- 数据字典为空-输入框 -->
                            <el-input 
                                v-else-if="item.fieldShowType=='list' && !item.dictField"
                                v-model.trim="item.value"
                                clearable 
                                name="clearInputValue" 
                                @keyup.enter.native="onPressEnter" 
                                placeholder="请输入">
                            </el-input>

                            <!-- 部门-下拉 -->
                            <el-select
                                v-else-if="item.fieldShowType=='sel_depart'"
                                v-model="item.value" filterable clearable>
                                <el-option v-for="(item,i) in departmentData" :key="i"
                                    :label="item.org_name" :value="item.org_name=='全部'?'':item.org_name">
                                </el-option>
                            </el-select>

                            <!-- 日期-普通查询 -->
                            <el-date-picker 
                                v-else-if="item.fieldShowType=='date'&&item.queryMode!='group'"
                                v-model="item.value"
                                type="date" 
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>

                            <!-- 日期-范围查询 -->
                            <el-date-picker
                                v-else-if="item.fieldShowType=='date'&&item.queryMode=='group'"
                                v-model="item.value"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                            
                            <!-- 日期时间-普通查询 -->
                            <el-date-picker
                                v-else-if="item.fieldShowType=='datetime'&&item.queryMode!='group'"
                                v-model="item.value"
                                type="datetime"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期时间">
                            </el-date-picker>

                            <!-- 日期时间-范围查询 -->
                            <el-date-picker
                                v-else-if="item.fieldShowType=='datetime'&&item.queryMode=='group'"
                                v-model="item.value"
                                type="datetimerange"
                                align="right"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['12:00:00', '08:00:00']"
                                value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item :label="item.dbFieldTxt+'：'" v-for="item in manyQueryData" :key="item.id" v-show="showState">
                            <!-- 输入框 -->
                            <el-input 
                                v-if="item.fieldShowType=='text'"
                                v-model.trim="item.value"
                                clearable 
                                name="clearInputValue" 
                                @keyup.enter.native="onPressEnter" 
                                placeholder="请输入">
                            </el-input>

                            <!-- 下拉框-有默认值 -->
                            <template-method
                                v-else-if="item.fieldShowType=='list' && item.dictField && item.value"
                                v-model="item.value"
                                :type="'select'"
                                :dicCode="item.dictField"
                            />

                             <!-- 下拉框-无默认值 -->
                            <template-method
                                v-else-if="item.fieldShowType=='list' && item.dictField"
                                v-model="item.value"
                                :type="'select'"
                                :dicCode="item.dictField"
                                :defaultVal="'全部'"
                            />

                            <!-- 数据字典为空-输入框 -->
                            <el-input 
                                v-else-if="item.fieldShowType=='list' && !item.dictField"
                                v-model.trim="item.value"
                                clearable 
                                name="clearInputValue" 
                                @keyup.enter.native="onPressEnter" 
                                placeholder="请输入">
                            </el-input>

                            <!-- 部门-下拉 -->
                            <el-select
                                v-else-if="item.fieldShowType=='sel_depart'"
                                v-model="item.value" filterable clearable>
                                <el-option v-for="(item,i) in departmentData" :key="i"
                                    :label="item.org_name" :value="item.org_name=='全部'?'':item.org_name">
                                </el-option>
                            </el-select>

                            <!-- 日期-普通查询 -->
                            <el-date-picker 
                                v-else-if="item.fieldShowType=='date'&&item.queryMode!='group'"
                                v-model="item.value"
                                type="date" 
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>

                            <!-- 日期-范围查询 -->
                            <el-date-picker
                                v-else-if="item.fieldShowType=='date'&&item.queryMode=='group'"
                                v-model="item.value"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                            
                            <!-- 日期时间-普通查询 -->
                            <el-date-picker
                                v-else-if="item.fieldShowType=='datetime'&&item.queryMode!='group'"
                                v-model="item.value"
                                type="datetime"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期时间">
                            </el-date-picker>

                            <!-- 日期时间-范围查询 -->
                            <el-date-picker
                                v-else-if="item.fieldShowType=='datetime'&&item.queryMode=='group'"
                                v-model="item.value"
                                type="datetimerange"
                                align="right"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['12:00:00', '08:00:00']"
                                value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>

                    <!-- 展开/收起 -->
                    <div class="query_show" v-show="manyQueryData.length > 0">
                        <el-button v-if="showbut!=0" @click="onClickShow(0)" type="text" class="query_showBtn">
                            收起 <i class="el-icon-arrow-up"></i>
                        </el-button>
                        <el-button v-else-if="showbut==0" @click="onClickShow(1)" type="text" class="query_showBtn">
                            展开 <i class="el-icon-arrow-down"></i>
                        </el-button>
                    </div>
                </div>
                <!-- 查询按钮 -->
                <div class="query_btn">
                    <p>
                        <el-button type="primary"  @click="partsExport">导出</el-button>
                    </p>
                    <p>
                        <el-button type="primary" @click="onQuery(1,10)">查询</el-button>
                        <el-button type="primary" @click="onReset" class="reset_btn">重置</el-button>
                    </p>
                </div>
            </div>

            <!-- 列表与分页 -->
            <div class="tablePagination_modular">
                <!-- 列表 -->
                <div class="table_modular">
                    <el-table ref="table" border stripe :data="tableData"
                        :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">
                        <el-table-column 
                            v-for="(item,i) in tableFieldData" 
                            :key="i" 
                            align="center" 
                            :resizable="false" 
                            :prop="item.prop" 
                            :label="item.label">
                        </el-table-column>

                    </el-table>
                </div>
                <!-- 分页 -->
                <el-pagination
                    class="pagination_modular"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    :current-page="current"
                    :page-size="pageSize"
                    :page-sizes="[10,20,30]"
                    @current-change="currentChange"
                    @size-change="pageSizeChange">
                </el-pagination>
            </div>


        </div>

        <!-- 导出 -->
        <el-dialog :title="exporTitle+'-导出'" width="50%" class="dialog_export" 
            :visible.sync="exportVisible"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="export_box">
                <el-checkbox :indeterminate="allCheckbox" v-model="allCheckVal" 
                    @change="checkAllChange" class="export_checkbox_all">导出全部</el-checkbox>
                <el-checkbox-group v-model="exportBinding" @change="checkGroupChange" class="export_checkbox_group">
                    <el-checkbox v-for="(item,i) in exportChoice" 
                        :key="i" :label="item.prop" 
                        class="export_checkbox_group_item"
                    >{{item.label}}</el-checkbox>
                </el-checkbox-group>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="exportVisible=false">取 消</el-button>
                <el-button type="primary" @click="exportClose">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import base from "@/api/base.js";
import TemplateMethod from '@/components/TemplateMethod'; // 单选/下拉
export default {
    name: '',
    props: [],
    components: {TemplateMethod},
    data(){
        return {
            loading: false,
            showbut: 0, // 展开/收起-状态
            showState: false, // 查询框显示状态
            total: 0, // 总数
            current: 1, // 页数
            pageSize: 10, // 条数
            dataSheetCode: 'carload', // 数据表绑定值-默认整车-展示不同页面内容
            exporTitle: '整车', // 导出-标题-根据改变数据表切换
            departmentData: [], // 部门-下拉数据

            lessQueryData: [], // 少查询数据
            manyQueryData: [], // 多查询数据
            tableFieldData: [], // 列表字段数据
            tableData: [], // 列表内容数据
            searchParams: [], // 查询-向后台传参
            showlistParams: [], // 列表-向后台传参
            showformParams: [], // 导出-向后台传参

            exportVisible: false, // 导出-显示状态
            exportBinding: [], // 导出-复选框绑定数据
            exportChoice: [], // 导出-复选框-遍历数据
            allCheckbox: false, // 导出-全选状态
            allCheckVal: false, // 导出-全选绑定值
        }
    },
    created() {
        
    },
    mounted() {
        this.getDepartTree();
        this.obtainSisplayData();
    },
    methods: {
        // 获取部门数据
        getDepartTree () {
            this.$api.taskmanage.apiSearchDep().then(res => {
                console.log(res.data.data, '获取部门数据成功');
                if(res.data.data && res.data.data.list) {
                    this.departmentData = res.data.data.list;
                } else {
                    this.departmentData = [];
                }
            }).catch((error) => {
                console.log(error, '获取部门数据失败');
                this.departmentData = [];
            });
        },
        // 获取页面显示数据
        obtainSisplayData() {
            this.loading = true;
            this.lessQueryData = []; // 少查询数据
            this.manyQueryData = []; // 多查询数据
            this.tableFieldData = []; // 列表字段数据
            this.showformParams = []; // 导出-后台传参
            this.exportBinding = []; // 导出-复选框绑定数据
            this.exportChoice = []; // 导出-复选框-遍历数据
            this.$api.exportlist.getFiled({dataSheetCode: this.dataSheetCode}).then(res => {
                // console.log('获取页面显示数据成功:',res.data.data);
                this.loading = false;
                // 查询显示数据
                let search =  (res.data.data && res.data.data.search) ? res.data.data.search : []; 
                if(search.length == 4 ){
                    this.handleQueryData(search,'lessQueryData');
                } else if(search.length > 4) {
                    let less = search.slice(0,4);
                    let many = search.slice(4);
                    this.handleQueryData(less,'lessQueryData');
                    this.handleQueryData(many,'manyQueryData');
                }

                // 列表显示数据
                let showlist = (res.data.data && res.data.data.showlist) ? res.data.data.showlist : [];
                if(showlist.length > 0) {
                    showlist.forEach(item => {
                        let start = item.dbFieldName.indexOf('.');
                        let last = item.dbFieldName.lastIndexOf('/');
                        let stop = last != '-1' ? last : item.dbFieldName.length;
                        let dbFieldName = item.dbFieldName.substring(start+1,stop);
                        this.tableFieldData.push({
                            prop: dbFieldName,
                            label: item.dbFieldTxt,
                            name: item.dbFieldName,
                            dictField: item.dictField,
                        });
                    });
                }

                // 导出显示数据
                let showform = (res.data.data && res.data.data.showform) ? res.data.data.showform : [];
                if(showform.length > 0) {
                    showform.forEach(item => {
                        let start = item.dbFieldName.indexOf('.');
                        let last = item.dbFieldName.lastIndexOf('/');
                        let stop = last != '-1' ? last : item.dbFieldName.length;
                        let dbFieldName = item.dbFieldName.substring(start+1,stop);
                        this.showformParams.push({
                            name: item.dbFieldName,
                            dictField: item.dictField,
                        });
                        this.exportChoice.push({
                            prop: dbFieldName,
                            label: item.dbFieldTxt,
                        });
                    });
                }
                // this.onQuery(1,10);
            }).catch((error) => {
                console.log('获取页面显示数据失败:',error);
                this.$message.error('获取页面显示数据失败');
                this.loading = false;
            });
        },
        // 处理查询数据
        handleQueryData(data, binVal) {
            data.forEach(item => {
                let itemCp = '';
                if(item.fieldShowType == 'text') {
                    itemCp = 'like';
                } else if(item.fieldShowType == 'list') {
                    itemCp = '=';
                } else if(
                    (item.fieldShowType == 'date' || item.fieldShowType == 'datetime') 
                    &&
                    item.queryMode != 'group'
                ) {
                    itemCp = '=';
                } else if(
                    (item.fieldShowType == 'date' || item.fieldShowType == 'datetime') 
                    && 
                    item.queryMode == 'group'
                ) {
                    itemCp = 'between';
                } else if(item.fieldShowType == 'sel_depart') {
                    itemCp = '=';
                } 
                this[binVal].push({
                    id: item.id,
                    name: item.dbFieldName,
                    value: item.dbDefaultVal&&item.dbDefaultVal!='null'?item.dbDefaultVal:'',
                    cp: itemCp,
                    dictField: item.dictField,
                    dbFieldTxt: item.dbFieldTxt,
                    fieldShowType: item.fieldShowType,
                    queryMode: item.queryMode,
                });
            });
        },
        // 数据表-改变时-展示不同页面内容
        dataSheetChange(val, selectList) {
            this.loading = true;
            this.showbut = 0; // 展开/收起-状态
            this.showState = false; // 查询框显示状态
            this.total = 0;
            this.current = 1;
            this.pageSize = 10;
            this.tableData = [];
            selectList.forEach(item => {
                if(item.dicTypeCode == val) {
                    this.exporTitle = item.dicTypeName;
                }
            });
            this.dataSheetCode = val;
            this.obtainSisplayData();
        },
        // 展开/收起_点击
        onClickShow(val) {
            this.showbut = val;
            this.showState = !this.showState;
        },
        // 分页器-页数改变
        currentChange(val) {
            this.current = val;
            this.onQuery(this.current, this.pageSize);
        },
        // 分页器-条数改变
        pageSizeChange(val) {
            this.pageSize = val;
            this.onQuery(this.current, this.pageSize);
        },
        // 查询
        onQuery(current,pageSize) {
            this.loading = true;
            this.tableData = []; // 列表内容数据
            this.searchParams = []; // 查询-向后台传参
            this.showlistParams = []; // 列表-向后台传参
            // 查询条件传参处理
            let searchHandle = this.lessQueryData.concat(this.manyQueryData);
            searchHandle.forEach(item => {
                let itemVal = item.value;
                if(item.queryMode == 'group' && itemVal && Array.isArray(itemVal)) {
                    itemVal = itemVal.toString();
                }
                this.searchParams.push({
                    cp: item.cp,
                    name: item.name,
                    value: itemVal,
                    queryMode: item.queryMode,
                    dictField: item.dictField,
                })
            });
            // 列表数据传参处理
            this.tableFieldData.forEach(item => {
                this.showlistParams.push({
                    name: item.name,
                    dictField: item.dictField,
                })
            });

            let params = {
                page: true, // 是否分页
                dicCode: this.dataSheetCode, // 数据表
                currentPage: current, // 页数
                pageSize: pageSize, // 条数
                search: this.searchParams, // 查询
                showlist: this.showlistParams, // 列表
            }
            this.$api.exportlist.search(params).then(res => {
                // console.log(res, '查询成功res');
                let data = res.data.data;
                this.loading = false;
                if(data && data.list && data.list.length > 0) {
                    data.list.forEach(item => {
                        let obj = {};
                        for ( let i in item) {
                            let val = item[i];
                            i = i.toLowerCase();
                            obj[i] = val;
                        }
                        this.tableData.push(obj);
                    });
                } else {
                    this.tableData = [];
                }
                if(data && data.total > 0) {
                    this.total = data.total;
                    this.current = current;
                    this.pageSize = pageSize;
                } else {
                    this.total = 0;
                    this.current = 1;
                    this.pageSize = 10;
                }
            }).catch((error) => {
                console.log(error, '查询失败error');
                this.$message.error('查询列表数据失败')
                this.loading = false;
                this.total = 0;
                this.current = 1;
                this.pageSize = 10;
                this.tableData = [];
            });
        },
        // 回车查询
        onPressEnter(e){
            if( e.keyCode && e.keyCode == 13 ){
                this.onQuery(1,10);
            }
        },
        // 重置
        onReset() {
            this.obtainSisplayData();
        },

        // 导出
        partsExport() {
            this.exportVisible = true;
        },
        // 导出-复选-全部选择
        checkAllChange(val) {
            this.exportBinding = [];
            if(val) {
                this.exportChoice.forEach(item => {
                    this.exportBinding.push(item.prop);
                });
            } else {
                this.exportBinding = [];
            }
            this.allCheckbox = false;
        },
        // 导出-复选-子-选择时
        checkGroupChange(val) {
            let checkedCount = val.length;
            this.allCheckVal = checkedCount == this.exportChoice.length;
            this.allCheckbox = checkedCount > 0 && checkedCount < this.exportChoice.length;
        },
        // 导出-确定
        exportClose() {
            this.loading = true;
            let colMap = {};
            this.exportChoice.forEach((item,i) => {
                this.exportBinding.forEach(em => {
                    if(item.prop == em) {
                        colMap[item.prop] = item.label;
                    }
                });
            });
            let params = {
                page: false, // 是否分页
                dicCode: this.dataSheetCode, // 数据表
                search: this.searchParams, // 查询
                showform: this.showformParams, // 列表
                colMap: colMap, // 导出
            }
            this.$api.exportlist.autoExport(params).then(res => {
                // console.log('导出成功',res);
                this.loading = false;
                if(res.data.data) {
                    const url = base.sample+'/file/'+res.data.data;
                    // console.log('url',url);
                    const a = document.createElement('a');
                    a.setAttribute('download', '');
                    a.setAttribute('href', url);
                    a.click();
                    this.exportVisible = false;
                } else {
                    this.$message.error('导出失败,文件不存在！');
                }
            }).catch((error) => {
                this.loading = false;
                console.log('导出失败:',error);
                this.$message.error('导出失败');
            });
        },
    }
}
</script>
<style lang="scss" scoped>
.el-button--default {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    background: #fff;
    border-radius: 4px;
}

.el-button--primary {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
    border-radius: 4px;
}

.el-button--text {
    color: #32AFF0;
}

// 重置
.reset_btn {
    margin: 0 !important;
    margin-left: 10px !important;
    background: #909399 !important;
    border-color: #909399 !important;
}

.exportList_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}

/deep/ .exportList_con {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .query_modular {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
        padding-bottom: 20px;
        .query_complex {
            width: 100%;
            display: flex;
            position: relative;
            margin-top: 20px;
            .query_form {
                flex: 1;
            }
            .query_show {
                width: 50px;
                position: relative;
                .query_showBtn {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #32AFF0;
                    padding: 10px 0;
                    border: none;
                }
            }
        }
        .query_btn {
            width: 100%;
            display: flex;
            justify-content: space-between;
            p {
                margin: 0;
                padding: 0;
            }
        }
    }

    .tablePagination_modular {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .table_modular {
            flex: 1;
            overflow-y: auto;
            .el-radio__label {
                padding: 0;
            }
            .el-table th.gutter {
                display: table-cell !important
            }
        }
        .pagination_modular {
            margin-top: 20px;
            padding: 0;
        }
    }
}

// 查询表单
/deep/ .query_form {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
        width: 25%;
        margin: 0;
        padding-bottom: 20px;
        overflow: hidden;
        display: flex;
        align-items: center;
        .el-form-item__label {
            white-space: nowrap;
        }
        .el-form-item__content {
            flex: 1;
            padding-right: 20px;
            .el-select, .el-input, .el-date-editor {
                width: 100% !important;
            }
            .el-date-editor {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .el-input__icon {
                    width: 25px;
                }
                .el-range-input {
                    flex: 1;
                }
                .el-range-separator {
                    width: 25px;
                    padding: 0 !important;
                }
            }
        }
    }
}

// 导出
/deep/ .dialog_export {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .el-dialog {
        margin: 0 !important;
        padding: 0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        height: 50% !important;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            padding: 20px 50px;
            overflow-x: hidden;
            overflow-y: auto;
        }
        .el-dialog__footer {
            padding: 0 20px 20px 20px;
        }
    }
}
// 导出
/deep/ .export_box {
    width: 100%;
    // 导出-全选-复选框
    .export_checkbox_all {
        margin-bottom: 10px;
    }
    // 导出-复选框
    .export_checkbox_group {
        display: flex;
        flex-wrap: wrap;
        .export_checkbox_group_item {
            width: 20%;
            margin: 0;
        }
    }
}
</style>