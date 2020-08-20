<template>
    <!-- 中机方案-详情 -->
    <div class="programmedetails_box">
        <el-tabs v-model="activeName" type="card" class="tabs_box">
            <el-tab-pane label="公告信息" name="notice">
                <Notice :noticeList='noticeList'></Notice>
            </el-tab-pane>
            <el-tab-pane label="产品信息" name="product">
                <Product :productList='productList'></Product>
            </el-tab-pane>
            <el-tab-pane label="强检信息" name="inspection">
                <Inspection :inspectionList='inspectionList' :proType='proType'></Inspection>
            </el-tab-pane>
            <el-tab-pane label="参数信息" name="parameter">
                <Parameter :parameterList='parameterList' :proType='proType'></Parameter>
            </el-tab-pane>
            <el-tab-pane label="新能源信息" name="energy">
                <Energy :energyList='energyList' v-if="newEnergy == 'Y'"></Energy>
            </el-tab-pane>
            <el-tab-pane label="历史信息" name="history">
                <History :historyList='historyList'></History>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import Notice from './ProgrammeDetails/notice.vue'; // 公告信息
import Product from './ProgrammeDetails/product.vue'; // 产品信息
import Inspection from './ProgrammeDetails/inspection.vue'; // 强检信息
import Parameter from './ProgrammeDetails/parameter.vue'; // 参数信息
import Energy from './ProgrammeDetails/energy.vue'; // 新能源信息
import History from './ProgrammeDetails/history.vue'; // 历史信息
export default {
    name: "programmedetails",
    components: {Notice, Product, Inspection, Parameter, Energy, History},
    props: ['detailsDataList'],
    watch: {
        detailsDataList: {
            immediate:true,
            handler(val) {
                this.activeName = 'notice';
                this.getDataList();
            },
        },
    },
    data() {
        return {
            activeName: 'notice', // 默认选中的标签页
            // 公告信息
            noticeList: {
                entName: '', // 企业名称
                model: '', // 产品型号
                name: '', // 产品名称
                brand: '', // 产品商标
                entId: '', // 企业ID
                proType: '', // 产品类别
                aeType: '', // 产品类别
                testInsId: '', // 检测机构ID
                appInsId: '', // 定型机构ID
                newEnergy: '', // 是否加载新能源检测项目
            },
            // 产品信息
            productList: {
                entName: '', // 企业名称
                model: '', // 产品型号
                name: '', // 产品名称
                brand: '', // 产品商标
                proAddress: '', // 生产地址
                proType: '', // 产品类别
                chassisType: '', // 底盘类别
                testInsId: '', // 检测机构ID
                appInsId: '', // 定型机构ID
                decType: '', // 申报类别
                newEnergy: '', // 新能源产品
                uploadTime: '', // 产品上传时间
                submit: '', // 条件状态
                comAddress: '', // 委托加工生产地址
                fuelPhase: '', // 油耗申报值是否满足三阶段限值要求
                description: '', // 产品状况简述
                productId: '', // 总库产品ID
                reason: '', // 申报原因
                needTest: '', // 出具强检统计表
                carType: '', // 车辆类型
            },
            inspectionList: [], // 强检信息
            parameterList: [], // 参数信息
            energyList: [], // 新能源信息
            historyList: [], // 历史信息
            proType: '', // 产品类别
            newEnergy: '', // 新能源-显示状态
        }
    },
    created() { },
    mounted() { },
    methods: {
        // 获取数据
        getDataList() {
            this.noticeList = this.detailsDataList.d;  // 公告信息
            this.productList = this.detailsDataList;  // 产品信息
            this.inspectionList = []; // 强检信息
            this.parameterList = []; // 参数信息
            this.energyList = []; // 新能源信息
            this.historyList = []; // 历史信息
            this.proType = this.detailsDataList.d.proType; // 产品类别
            this.newEnergy = this.detailsDataList.d.newEnergy; // 新能源-显示状态

            // 强检信息
            let triangle = [];
            let circular = [];
            let inspectionOther = [];
            let inspectionArr = [];
            if (this.detailsDataList.d.proType == 'new' && this.detailsDataList.n && Array.isArray(this.detailsDataList.n.tList)) {
                this.detailsDataList.n.tList.forEach(item => {
                    if (item.applyTestType == '△') {
                        triangle.push(item);
                    } else if (item.applyTestType == '○') {
                        circular.push(item);
                    } else if (item.applyTestType == '△○') {
                        inspectionOther.push(item);
                    } else {
                        inspectionArr.push(item);
                    }
                })
                let array = triangle.concat(circular, inspectionOther, inspectionArr);
                this.inspectionList = array; // 强检信息
            } else {
                if(this.detailsDataList.ap && Array.isArray(this.detailsDataList.ap.tList)) {
                    this.detailsDataList.ap.tList.forEach(item => {
                        if (item.applyTestType == '△') {
                            triangle.push(item);
                        } else if (item.applyTestType == '○') {
                            circular.push(item);
                        } else if (item.applyTestType == '△○') {
                            inspectionOther.push(item);
                        } else {
                            inspectionArr.push(item);
                        }
                    })
                    let inspectionArray = triangle.concat(circular, inspectionOther, inspectionArr);
                    this.inspectionList = inspectionArray; // 强检信息
                }
            }
            // 强检信息


            // 参数信息
            if(this.detailsDataList.rp && this.detailsDataList.rp.list) {
                this.parameterList = this.detailsDataList.rp.list;
            }
            // 参数信息

            // 新能源信息
            let energyOther = [];
            let energyArr = [];
            if(this.detailsDataList.n && Array.isArray(this.detailsDataList.n.tList)) {
                this.detailsDataList.n.tList.forEach(item => {
                    if (item.applyTestType == '△') {
                        energyOther.push(item);
                    } else {
                        energyArr.push(item);
                    }
                });
                let energyArray = energyOther.concat(energyArr);
                this.energyList = energyArray;
            }
            // 新能源信息

            // 历史信息
            if(this.detailsDataList.mesList && this.detailsDataList.mesList.length > 0) {
                this.historyList = this.detailsDataList.mesList;
            }
            // 历史信息
        },
    }
}
</script>
<style lang="scss" scoped>
.programmedetails_box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 10px #eee solid;
}

.programmedetails_box .tabs_box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/deep/ .el-tabs__header {
    margin: 0;
}

/deep/ .el-tabs__nav-wrap {
    height: 41px !important;
    margin: 0;
    padding: 0;
}

.programmedetails_box .el-tabs__content {
    flex: 1 !important;
    overflow: hidden !important;
}

/deep/ .el-tabs__content {
    padding: 20px;
    height: 100% !important;
}

.programmedetails_box .el-tabs__content .el-tab-pane {
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
}
</style>
