<template>
    <!-- 参数信息 -->
    <div class="parameter_con">
        <table border="1" class="table_con">
            <thead class="table_thead">
                <tr class="thead_tr">
                    <th class="thead_th" width="300">编号</th>
                    <th class="thead_th" width="300">名称</th> 
                    <th class="thead_th">数据</th>
                    <th class="thead_th" v-show="proType != 'new'">扩展数据</th>
                </tr>
            </thead>
            <tbody class="table_tbody">
                <div class="tbody_scroll">
                    <tr class="tbody_tr" v-for="(row,i) in parameterList" :key="i">
                        <td class="tbody_column" width="300">{{row.seq}}</td> <!-- 编号 --> 
                        <td class="tbody_column" width="300">{{row.name}}</td> <!-- 名称 --> 
                        <td class="tbody_column">{{row.value}}</td> <!-- 数据 --> 
                        <td class="tbody_column" v-show="proType != 'new'">{{row.originalValue}}</td> <!-- 扩展数据 --> 
                    </tr>
                    <tr v-if="parameterList.length == 0" class="nothing_data">
                        暂无数据
                    </tr>
                </div>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    name: "parameter",
    components: {},
    props: ['parameterList', 'proType'],
    watch: {},
    data() {
        return {}
    },
    created() {},
    methods: {},
}
</script>
<style lang="scss" scoped>
.parameter_con {
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
        height: auto;
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
