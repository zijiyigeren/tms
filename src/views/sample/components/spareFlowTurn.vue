<template>
    <!-- 零部件-流转 -->
    <div class="spareFlow_turn">
        <!-- 表格数据 -->
        <el-table ref="table" border stripe :data="tableData" class="flowTurn_table"
            :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">
            <el-table-column align="center" :resizable="false" prop="barcode" label="条形码"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="typeNumber" label="数量"></el-table-column>
            <el-table-column align="center" :resizable="false" prop="" label="状态-相关人">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">待检-{{scope.row.creator}}</span>
                    <span v-else-if="scope.row.status == 1">在检-{{scope.row.creator}}</span>
                    <span v-else-if="scope.row.status == 2">完检-{{scope.row.creator}}</span>
                    <span v-else-if="scope.row.status == 4">退样-{{scope.row.creator}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" :resizable="false" prop="status" label="类型" class-name="flow_column">
                <template slot-scope="scope" >
                    <div v-show="scope.row.flowlist.length>0">
                        <span v-for="(item,i) in scope.row.flowlist" :key="i" class="span_item">
                            {{item.status == 0 ? '待检' : ''}}
                            {{item.status == 1 ? '在检' : ''}}
                            {{item.status == 2 ? '完检' : ''}}
                            {{item.status == 4 ? '退样' : ''}}
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" :resizable="false" prop="exetime" label="日期" class-name="flow_column">
                <template slot-scope="scope" >
                    <div v-show="scope.row.flowlist.length>0">
                        <span v-for="(item,i) in scope.row.flowlist" :key="i" class="span_item">
                            {{item.exetime}}
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" :resizable="false" prop="creator" label="相关人" class-name="flow_column">
                <template slot-scope="scope" >
                    <div v-show="scope.row.flowlist.length>0">
                        <span v-for="(item,i) in scope.row.flowlist" :key="i" class="span_item">
                            {{item.creator}}
                        </span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    name: '',
    components: {},
    props: ['flowTurnVisible', 'flowTurnRow'],
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
    },
    data() {
        return {
            tableData: [], // 表格数据
        }
    },
    created() { },
    mounted() { 
    },
    methods: {
        // 获取流转数据
        obtainFlowTurn() {
            // this.flowTurnRow.id 3B96132101124C9DA8859B30428B874B
            this.$api.spareparts.obtainFlowTurn({id: this.flowTurnRow.id}).then(res => {
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
.spareFlow_turn {
    padding: 20px;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
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

// 流转表格
/deep/ .flow_column {
    padding: 0;
    .cell {
        padding: 0;
    }
    .span_item {
        display: block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        padding: 0 10px;
        border-bottom: 1px solid #EBEEF5;
        &:last-child {
            border-bottom: none;
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