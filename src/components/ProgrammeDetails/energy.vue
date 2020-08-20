<template>
    <!-- 新能源信息 -->
    <div class="energy_con">
        <table border="1" class="table_con">
            <thead class="table_thead">
                <tr class="thead_tr">
                    <th class="thead_th" width="60">序号</th>
                    <th class="thead_th">项目中文名称</th>
                    <th class="thead_th" width="60">类别</th>
                    <th class="thead_th" width="100">测试项数目</th>
                    <th class="thead_th">项目依据标准</th>
                    <th class="thead_th">配置组合说明</th>
                    <th class="thead_th" width="140">视同产品ID</th>
                    <th class="thead_th">视同产品型号</th>
                    <th class="thead_th">视同报告编号</th>
                </tr>
            </thead>
            <tbody class="table_tbody">
                <div class="tbody_scroll">
                    <tr class="tbody_tr" v-for="(row,i) in energyList" :key="i">
                        <td class="tbody_column" width="60">{{row.seq}}</td> <!-- 序号 --> 
                        <td class="tbody_column">{{row.name}}</td> <!-- 项目中文名称 --> 
                        <td class="tbody_column" width="60">{{row.applyTestType}}</td> <!-- 类别 --> 
                        <td class="tbody_column" width="100">{{row.testCount}}</td> <!-- 测试项数目 --> 
                        <td class="tbody_column">{{row.standard}}</td> <!-- 项目依据标准 --> 
                        <td class="tbody_column">{{row.configNote}}</td> <!-- 配置组合说明 --> 
                        <td class="tbody_column" width="140">{{row.equalId}}</td> <!-- 视同产品ID --> 
                        <td class="tbody_column">{{row.equalModel}}</td> <!-- 视同产品型号 --> 
                        <td class="tbody_column">{{row.equalNumber}}</td> <!-- 视同报告编号 -->
                    </tr>
                    <tr v-if="energyList.length == 0" class="nothing_data">
                        暂无数据
                    </tr>
                </div>
            </tbody>
        </table>

    </div>
</template>
<script>
export default {
    name: "energy",
    components: {},
    props: ['energyList'],
    watch: {},
    data() {
        return {}
    },
    created() {},
    methods: {}
}
</script>
<style lang="scss" scoped>
.energy_con {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.table_con {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 1px solid #E4E7ED;
    display: flex;
    flex-direction: column;
    .table_thead {
        display: block;
        width: calc( 100% - 21px );
        width: calc( 100% - 17px )\9;
        height: 60px;
        .thead_tr {
            background-color: rgb(243, 246, 253);
            color: rgb(96, 98, 102);
        }
    }
    .table_tbody {
        display:block;
        flex: 1;
        overflow: hidden;
        .tbody_scroll {
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }
        .tbody_tr {
            &:nth-child(even) {
                background: #FAFAFA;
            }
        }
    }
    tr {
        display:table;
        table-layout: fixed;

        width: 100%;
        height: 60px;
        line-height: 60px;
        text-align: center;
        th, td {
            border: 1px solid #EBEEF5;
            padding: 0 10px;
        }
    }
}
</style>