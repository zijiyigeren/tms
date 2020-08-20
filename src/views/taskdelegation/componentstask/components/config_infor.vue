<template>
  <div>
    {{list1}}<br>
    {{list2}}
    <template v-for="item1 in arr1">
      <div class="config_infor">
        <div class="m-sampleType">
          <span class="span1">样品 :</span>
          <input type="text" class="m-InputClass" v-model.lazy="item1.sampleCode">
        </div>
        <div class="m-sampleConfig-Info">
          <template v-for="(item2 ,index2) in item1.list">
            <div :key="index2" class="m-sampleConfig-Info-item">
              <span class="span2">{{item2.configName}} :</span>
              <input type="text" class="m-InputClass" v-model.lazy="item2.configDetails">
              <span class="span3 subtract-span"
                    v-if="item1.list.length != 1"
                    @click="subtractHandle(item1.list,index2)"
              ></span>
              <span class="span4 add-span"
                    v-if="index2 == item1.list.length - 1"
                    @click="addHandle(item1.list)"
              ></span>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'config_infor',
    data () {
      return {
        arr1: [
          {
            sampleCode: '',
            list: [
              {'configName': '配置1', 'configDetails': '描述1'}
            ]
          },
        ],
        list1: [],// 整车
        list2: [],// 零件
      }
    },
    watch: {},
    methods: {
      addHandle (data) {
        data.push({
          configDetails: new Date().getTime() + ''
        })
        data.forEach((item, index) => {
          item.configName = `配置${index + 1}`
        })
      },
      subtractHandle (data, index) {
        data.splice(index, 1)
        data.forEach((item, index) => {
          item.configName = `配置${index + 1}`
        })
      },
    }
  }
</script>

<style scoped lang="less">
  @import "../style/config_infor";
</style>
