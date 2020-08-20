<template>
    <!-- 字典组件 -->
    <el-radio-group v-if="type == 'radio'" v-model="getValueSting" @change="handleChange">
        <el-radio  v-for="(item,i) in dictOptions" :key="i" :label="item.dicTypeCode">{{item.dicTypeName}}</el-radio>
    </el-radio-group>

    <el-select clearable v-else-if="type == 'select' && clearable" v-model="getValueSting" 
        @change="val => handleChange(val, dictOptions)">
        <el-option v-if="defaultVal" :label="defaultVal" :value="getValueSting"></el-option>
        <el-option v-for="(item,i) in dictOptions" :key="i"
            :label="item.dicTypeName" :value="item.dicTypeCode">
        </el-option>
    </el-select>
    
    <el-select v-else-if="type == 'select' && !clearable" v-model="getValueSting" 
        @change="val => handleChange(val, dictOptions)">
        <el-option v-if="defaultVal" :label="defaultVal" :value="getValueSting"></el-option>
        <el-option v-for="(item,i) in dictOptions" :key="i"
            :label="item.dicTypeName" :value="item.dicTypeCode">
        </el-option>
    </el-select>
</template>
<script>
import base from '@/api/base.js'
export default {
    props: ['value', 'type', 'dicCode', 'clearable', 'triggerChange', 'defaultVal'],
    watch: {
        dicCode: {
            immediate: true,
            handler () {
                this.initDictData()
            },
        },
    },
    data () {
        return {
            dictOptions: [],
            url: {
                dictypeList: base.baseUrl + '/sys/dictype/list/',
            }
        }
    },
    computed: {
        getValueSting: {
            get(){
                return this.value ? this.value.toString() : null;
            },
            set(value){
                this.value = value;
            }
        },
    },
    created () {},
    mounted () {},
    methods: {
        //根据字典Code, 初始化字典数组
        initDictData() {
            this.$api.tempaxios.getList(this.url.dictypeList,{dicCode: this.dicCode})
              .then(res => {
                  // console.log(res.data.data, '字典获取草稿');
                  this.dictOptions = res.data.data;
                  this.$emit('GET_originData',JSON.parse(JSON.stringify(res.data.data)))
              })
              .catch((error) => {
                  console.log(error, '字典获取失败');
              });
        },
        // 值发生改变时
        handleChange(val, selectList) {
            if(this.triggerChange){
                this.$emit('change', val, selectList);
            }else{
                this.$emit('input', val);
            }
        },
    },
}
</script>
<style lang="less" scoped>

</style>
