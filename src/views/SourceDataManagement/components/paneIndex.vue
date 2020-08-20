<template>
  <div>
    <a-button type="primary" icon="plus" @click="addItem">新增</a-button>
    <div style="height: 300px;overflow: auto;">
      <a-table :columns="columns" bordered
               :dataSource="dataSource"
               :scroll="{}"
               :pagination="false"
               :rowSelection="{
               selectedRowKeys: selectedRowKeys,
               onChange: onSelectChange
             }"
      >
        <template slot="indexs" slot-scope="text, record, index">{{ index+1 }}</template>
        <template :slot="'indexName'"
                  slot-scope="text, record, index">
          <div :key="'indexName'">
            <a-input placeholder="请输入索引名称"
                     style="margin: -5px 0"
                     v-model="text"
                     @change="e => handleChange(e.target.value, record, 'indexName')"
            />
          </div>
        </template>
        <template slot="indexField"
                  slot-scope="text, record, index">
          <div :key="'indexField'">
            <a-select style="width: 100%" placeholder="请选择索引栏位"
                      @change="value => handleSelectedChange(record,'indexField',value)"
            >
              <a-select-option value="0">zz</a-select-option>
              <a-select-option value="1">rywe</a-select-option>
            </a-select>
          </div>
        </template>
        <template slot="indexType"
                  slot-scope="text, record, index">
          <div :key="'indexType'">
            <a-select style="width: 100%"
                      defaultValue="normal"
                      @change="value => handleSelectedChange(record,'indexType',value)"
            >
              <a-select-option value="normal">normal</a-select-option>
              <a-select-option value="unique">unique</a-select-option>
            </a-select>
          </div>
        </template>
      </a-table>
    </div>
    <slot :paneIndexData="dataSource"/>
  </div>
</template>

<script>
  export default {
    name: "paneIndex",
    props:{
      indexData: Array
    },
    watch:{
      indexData:{
        handler(value){
          this.dataSource = value;
        },
        immediate: true
      }
    },
    data() {
      return {
        columns: [
          {
            title: '#',
            dataIndex: 'indexs',
            width: '5%',
            align: "center",
            scopedSlots: {customRender: 'indexs'},
          },
          {
            title: '索引名称',
            dataIndex: 'indexName',
            width: '30%',
            scopedSlots: {customRender: 'indexName'},
          },
          {
            title: '索引栏位置',
            dataIndex: 'indexField',
            width: '30%',
            scopedSlots: {customRender: 'indexField'},
          },
          {
            title: '索引类型',
            dataIndex: 'indexType',
            width: '30%',
            scopedSlots: {customRender: 'indexType'},
          },
        ],
        dataSource: [],
        selectedRowKeys: [],
      }
    },
    methods: {
      addItem() {
        this.dataSource.push({
          id: new Date().getTime(),
          indexName: '',
          indexField: '',
          indexType: 'normal'
        })
      },
      handleChange(value, key, column) {
        key[column] = value;
      },
      handleSelectedChange(row, key, value){
        row[key] = value;
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        // const {selectedRowKeys} = this;
        // return {
        //   onChange: (selectedRowKeys, selectedRows) => {
        //     // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //   },
        //   getCheckboxProps: record => ({
        //     // props: {
        //     //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
        //     //   name: record.name,
        //     // },
        //   }),
        // };
      },
    }
  }
</script>

<style scoped>

</style>
