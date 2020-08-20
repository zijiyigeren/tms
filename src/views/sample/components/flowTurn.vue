<template>
    <!-- 整车-流转 -->
    <div class="flow_turn">
        <el-button type="primary" @click="onChangeVal({},true,'流转-新建')" style="marginBottom:20px;">新建</el-button>
        <!-- 表格数据 -->
        <el-table ref="table" border stripe :data="tableData" class="flowTurn_table"
            :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">
            <el-table-column align="center" :resizable="false" prop="dept" label="出发部门"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="people" label="车辆驾驶员"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="lypeople" label="科室经办人"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="startDate" label="开始日期"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="lstatusdes" label="状态描述"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="receivedept" label="到达部门"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="inpeople" label="车辆驾驶员"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="hypeople" label="科室经办人"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="endDate" label="结束日期"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="statusdes" label="状态描述"></el-table-column>
            <el-table-column align="center" :resizable="false" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button type="text" @click="onChangeVal(scope.row,true,'流转-编辑')">编辑</el-button>
                    <el-button type="text" style="color:red;" @click="onDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新建/编辑 -->
        <el-dialog :modal="false" :title="flowFormTitle" class="dialog_flowForm"
            :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="flowFormVisible">
            <el-form :model="flowForm" ref="flowform" class="flow_form">
                <el-form-item prop="dept" label="出发部门：">
                    <!-- <elTreeSelect
                        :value="flowForm.dept"
                        @getValue="val => deparTreeSel(val,'dept')"
                        :options="departData"
                        :props="{
                            value: 'id',// ID字段名
                            label: 'org_name',// 显示名称
                            children: 'children',// 子级字段名
                        }">
                    </elTreeSelect> -->
                    <!-- filterable :filter-method="selecFilter" -->
                    <el-select ref="deptblur" v-model="flowForm.dept" placeholder="请选择出发部门">
                        <el-option :value="flowForm.dept" :label="flowForm.dept"> 
                            <el-tree ref="departTree" id="tree-option"
                                accordion
                                :data="departData" 
                                :props="departProps"
                                :node-key="departProps.label"
                                @node-click="data => deparTreeSel(data,'dept','deptblur')">
                            </el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="people" label="车辆驾驶员：">
                    <el-input clearable placeholder="请输入车辆驾驶员" v-model.trim="flowForm.people"></el-input>
                </el-form-item>
                <el-form-item prop="lypeople" label="科室经办人：">
                    <el-input v-model.trim="flowForm.lypeople" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item prop="startDate" label="开始日期：">
                    <el-date-picker clearable v-model="flowForm.startDate" type="date" 
                        placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item prop="lstatusdes" label="状态描述：">
                    <el-input clearable placeholder="请输入状态描述" v-model.trim="flowForm.lstatusdes"></el-input>
                </el-form-item>
                <el-form-item prop="receivedept" label="到达部门：">
                    <!-- filterable :filter-method="selecFilter" -->
                    <el-select clearable ref="receivedeptblur" v-model="flowForm.receivedept" placeholder="请选择到达部门">
                        <el-option :value="flowForm.receivedept" :label="flowForm.receivedept"> 
                            <el-tree ref="departTree" id="tree-option"
                                accordion
                                :data="departData" 
                                :props="departProps"
                                :node-key="departProps.label"
                                @node-click="data => deparTreeSel(data,'receivedept','receivedeptblur')">
                            </el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="inpeople" label="车辆驾驶员：">
                    <el-input clearable placeholder="请输入车辆驾驶员" v-model.trim="flowForm.inpeople"></el-input>
                </el-form-item>
                <el-form-item prop="hypeople" label="科室经办人：">
                    <el-input placeholder="请获取科室经办人" v-model.trim="flowForm.hypeople" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item prop="endDate" label="结束日期：">
                    <el-date-picker clearable v-model="flowForm.endDate" type="date" 
                        placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item prop="statusdes" label="状态描述：">
                    <el-input clearable placeholder="请输入状态描述" v-model.trim="flowForm.statusdes"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" :center="true" width="100%">
                <el-button @click="flowFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onNewEditOk">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import elTreeSelect from '@/components/PublicTools/elTreeSelect/index.vue';
export default {
    name: '',
    components: {elTreeSelect},
    props: ['flowTurnVisible', 'flowTurnRow', 'departmentData'],
    watch: {
        flowTurnVisible: {
            immediate:true,
            handler(val) {
                if(val) {
                    this.obtainFlowTurn();
                } else {
                    this.tableData = [];
                }
            },
        },
        departmentData: {
            immediate:true,
            handler(val) {
                if(val && val.length>0) {
                    this.departData = val;
                } else {
                    this.departData = [];
                }
            },
        }
    },
    data() {
        return {
            departExpanded: [],
            departData: [], // // 部门数据
            departProps: { // 部门数据-配置选项
                label: 'org_name',
                children: 'children',
            },
            tableData: [], // 表格数据
            flowFormVisible: false, // 流转-新建/编辑-显示状态
            flowFormTitle: '', // 流转-新建/编辑-标题
            flowForm: { // 流转-新建/编辑-表单数据
                id: '',
                terminalid: '',
                dept: JSON.parse(localStorage.getItem("userInfo")).departmentName, // 出发部门
                people: '', // 车辆驾驶员
                lypeople: JSON.parse(localStorage.getItem("userInfo")).username, // 科室经办人
                startDate: '', // 开始日期
                lstatusdes: '', // 状态描述
                receivedept: '', // 到达部门
                inpeople: '', // 车辆驾驶员
                hypeople: JSON.parse(localStorage.getItem("userInfo")).username, // 科室经办人
                endDate: '', // 结束日期
                statusdes: '', // 状态描述
            },
        }
    },
    created() { },
    mounted() { 
    },
    methods: {
        // 获取流转数据
        obtainFlowTurn() {
            // this.flowTurnRow.id 3B96132101124C9DA8859B30428B874B
            this.$api.vehicle.obtainFlowTurn({id: this.flowTurnRow.id}).then(res => {
                // console.log(res, '获取流转数据');
                let data = res.data.data;
                if( Array.isArray(data) && data.length > 0 ) { 
                    this.tableData = data;
                } else {
                    this.tableData = [];
                }
            }).catch((error) => {
                console.log(error, '获取流转数据失败');
                this.tableData = [];
            });
        },
        // 部门-搜索
        selecFilter(val) {
            let arr = [];
            if (val) { //val存在
                this.departData.forEach((item) => {
                    if (item.org_name.indexOf(val) != -1) {
                        arr.push(item);
                    } else {
                        item.children.forEach(em => {
                            if (em.org_name.indexOf(val) != -1) {
                                arr.push(item);
                            }
                        });
                    }
                });
                this.departData = arr;
            } else {
                this.departData = this.departmentData;
            }
        },
        // 部门-节点点击
        deparTreeSel(data, item, sel) {
            this.flowForm[item] = data.org_name;
            this.$refs[sel].blur();
        },
        // 流转-新建/编辑
        onChangeVal(row, vis, tit) {
            this.flowFormVisible = vis; // 新建/编辑-显示状态
            this.flowFormTitle = tit; // 新建/编辑-标题
            this.flowForm = {
                id: row.id ? row.id : '',
                terminalid: this.flowTurnRow.id ? this.flowTurnRow.id : '',
                dept: row.dept ? row.dept : JSON.parse(localStorage.getItem("userInfo")).departmentName, // 出发部门
                people: row.people ? row.people : '', // 车辆驾驶员
                lypeople: row.lypeople ? row.lypeople : JSON.parse(localStorage.getItem("userInfo")).username, // 科室经办人
                startDate: row.startDate ? row.startDate : '', // 开始日期
                lstatusdes: row.lstatusdes ? row.lstatusdes : '', // 状态描述
                receivedept: row.receivedept ? row.receivedept : '', // 到达部门
                inpeople: row.inpeople ? row.inpeople : '', // 车辆驾驶员
                hypeople: row.hypeople ? row.hypeople : JSON.parse(localStorage.getItem("userInfo")).username, // 科室经办人
                endDate: row.endDate ? row.endDate : '', // 结束日期
                statusdes: row.statusdes ? row.statusdes :'', // 状态描述
            };
        },
        // 流转-新建/编辑-确定
        onNewEditOk() {
            if(this.flowForm.receivedept == this.flowForm.dept) {
                this.$message.warning('出发部门与到达部门不能相同！');
            } else {
                let params = this.flowForm;
                if(!params.endDate) params.hypeople = '';
                this.$api.vehicle.flowTurnPreserve(params).then(res => {
                    // console.log(res, '新建流转成功');
                    if(this.flowFormTitle.indexOf('新建') !=-1) this.$message.success('流转新建成功！');
                    if(this.flowFormTitle.indexOf('编辑') !=-1) this.$message.success('流转编辑成功！');
                    this.onChangeVal({},false,'');
                    this.obtainFlowTurn();
                }).catch((error) => {
                    console.log(error, '流转-新建/编辑失败');
                    this.$message.error(error.data.message);
                    this.onChangeVal({},false,'');
                    this.obtainFlowTurn();
                });
            }
        },
        // 删除
        onDelete(row) {
            this.$api.vehicle.flowTurnDelete({id: row.id}).then(res => {
                // console.log(res, '删除成功');
                this.$message.success('删除成功！');
                this.onChangeVal({},false,'');
                this.obtainFlowTurn();
            }).catch((error) => {
                console.log(error, '流转-新建/编辑失败');
                this.$message.error('删除失败！');
                this.onChangeVal({},false,'');
                this.obtainFlowTurn();
            });
        },
    }
}
</script>
<style lang="less" scoped>
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
.flow_turn {
    padding: 20px;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

/deep/ .flowTurn_table {
    .el-input, .el-select, .el-date-editor {
        width: 100% !important;
        height: 36px !important;
        .el-input__inner {
            width: 100% !important;
            height: 100% !important;
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

// 流转-新建/编辑
/deep/ .dialog_flowForm {
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
        height: 80% !important;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            padding: 20px;
            overflow-y: auto;
        }
    }
}

// 流转-新建/编辑-表单
/deep/ .flow_form {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    .el-form-item{
        width: 100%;
        margin: 0;
        padding: 0;
        padding-bottom: 20px;
        overflow: hidden;
        display: flex;
        align-items: center;
        .el-form-item__label {
            width: 30% !important;
            white-space: nowrap;
        }
        .el-form-item__content {
            width: 50%;
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

</style>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    max-height: 245px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
}

.el-select-dropdown__item.selected {
    font-weight: normal;
}

ul li >>> .el-tree .el-tree-node__content {
    height: auto;
    padding: 0 20px;
}

.el-tree-node__label {
    font-weight: normal;
}

/* .el-tree >>> .is-current .el-tree-node__label {
    color: #409EFF;
    font-weight: 700;
}

.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
    color: #606266;
    font-weight: normal;
} */
</style>