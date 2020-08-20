<template>
    <!-- 历史信息 -->
    <div class="history_con">
        <table border="1" class="table_con">
            <thead class="table_thead">
                <tr class="thead_tr">
                    <th class="thead_th" width="60">序号</th>
                    <th class="thead_th" width="200">日期</th>
                    <th class="thead_th" width="200">模块</th>
                    <th class="thead_th" width="260">唯一标识(中文名称或编号)</th>
                    <th class="thead_th">变更内容</th>
                </tr>
            </thead>
            <tbody class="table_tbody">
                <div class="tbody_scroll">
                    <tr class="tbody_tr" v-for="(row,i) in historyList" :key="i">
                        <td class="tbody_column" width="60">{{i+1}}</td> <!-- 序号 --> 
                        <td class="tbody_column" width="200">{{row.createTime}}</td> <!-- 日期 --> 
                        <td class="tbody_column" width="200">{{row.type}}</td> <!-- 模块 --> 
                        <td class="tbody_column" width="260">{{row.paramname}}</td> <!-- 唯一标识 --> 
                        <td class="tbody_column">{{row.mes}}</td> <!-- 变更内容 --> 
                    </tr>
                    <tr v-if="historyList.length == 0" class="nothing_data">
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
    props: ['historyList'],
    watch: {},
    data() {
        return {}
    },
    created() {},
    methods: {}
}
</script>
<style lang="scss" scoped>
.history_con {
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