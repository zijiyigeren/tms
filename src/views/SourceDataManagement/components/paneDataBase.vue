<template>
  <!-- 数据库属性 -->
  <div>
    <a-button type="primary" icon="plus" @click="addData">新增</a-button>
    <!--<a-button type="primary">保存</a-button>-->
    <div style="overflow: auto;">
      <a-table :columns="columns" bordered
               style="width: 105%;"
               :dataSource="dataSource"
               :pagination="false"
               :rowSelection="{
               // selectedRowKeys: selectedRowKeys,
               // onChange: onSelectChange
             }"
      >
        <template slot="indexs" slot-scope="text, record, index">{{ index+1 }}</template>
        <template
          v-for="col1 in ['dbFieldName', 'dbFieldTxt', 'dbLength', 'dbPointLength', 'dbDefaultVal']"
          :slot="col1"
          slot-scope="text, record, index"
        >
          <a-input style="margin: -5px 0"
                   :disabled="record['dbFieldName']=='id'|| record['dbFieldName'] == 'version' ? true : false"
                   v-model="text"
                   @change="e => handleChange(e.target.value, record, col1)"
          />
        </template>
        <template slot="dbType" slot-scope="text, record, index">
          <a-select style="width: 100%"
                    :disabled="record['dbFieldName']=='id'|| record['dbFieldName'] == 'version' ?true:false"
                    :defaultValue="text"
                    @change="value => handleSelectedChange(record,'dbType',value)"
          >
            <a-select-option value="string">String</a-select-option>
            <!--<a-select-option value="integer">Integer</a-select-option>-->
            <a-select-option value="int">Integer</a-select-option>
            <a-select-option value="double">Double</a-select-option>
            <a-select-option value="date">Date</a-select-option>
            <a-select-option value="bigDecimal">BigDecimal</a-select-option>
            <a-select-option value="text">Text</a-select-option>
            <a-select-option value="blob">Blob</a-select-option>
          </a-select>
        </template>
        <template
          v-for="col2 in ['dbIsKey','dbIsNull']"
          :slot="col2"
          slot-scope="text, record, index"
        >
          <a-checkbox
            :disabled="record['dbFieldName']=='id'|| record['dbFieldName'] == 'version' ?true:false"
            :checked="text ? true : false"
            @change="changeChecked(record, col2)"
          />
        </template>
      </a-table>
    </div>
    <slot :paneDataBase="dataSource"></slot>
  </div>
</template>

<script>
  export default {
    name: "paneDataBase",
    props: ['editData'],
    computed: {},
    watch: {
      editData: {
        handler(value) {
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
            align: "center",
            dataIndex: 'indexs',
            width: '3%',
            scopedSlots: {customRender: 'indexs'},
          },
          {
            title: '字段名称',
            align: "center",
            dataIndex: 'dbFieldName',
            width: '16%',
            scopedSlots: {customRender: 'dbFieldName'},
          },
          {
            title: '字段备注',
            align: "center",
            dataIndex: 'dbFieldTxt',
            width: '16%',
            scopedSlots: {customRender: 'dbFieldTxt'},
          },
          {
            title: '字段长度',
            align: "center",
            dataIndex: 'dbLength',
            width: '15%',
            scopedSlots: {customRender: 'dbLength'},
          },
          {
            title: '小数点',
            align: "center",
            dataIndex: 'dbPointLength',
            width: '10%',
            scopedSlots: {customRender: 'dbPointLength'},
          },
          {
            title: '默认值',
            align: "center",
            dataIndex: 'dbDefaultVal',
            width: '12%',
            scopedSlots: {customRender: 'dbDefaultVal'},
          },
          {
            title: '字段类型',
            align: "center",
            dataIndex: 'dbType',
            width: '12%',
            scopedSlots: {customRender: 'dbType'},
          },
          {
            title: '主键',
            align: "center",
            dataIndex: 'dbIsKey',
            width: '8%',
            scopedSlots: {customRender: 'dbIsKey'},
          },
          {
            title: '允许空值',
            align: "center",
            dataIndex: 'dbIsNull',
            width: '8%',
            scopedSlots: {customRender: 'dbIsNull'},
          }
        ],
        dataSource: []
      }
    },
    methods: {
      addData() {
        this.dataSource.push({
          id: new Date().getTime(),
          dbFieldName: '',// 字段名称
          dbFieldTxt: '',// 字段描述
          dbLength: '32',//字段长度
          dbPointLength: '0',// 小数点
          dbDefaultVal: '',// 默认值
          dbType: 'string',// 字段类型
          dbIsKey: 0,// 主键
          dbIsNull: 1,// 空值
          isShowForm: 1,// 表单显示
          isShowList: 1,// 列表显示
          fieldShowType: "text",// 控件类型
          fieldLength: '120',// 控件长度
          isQuery: 0,// 查询
          queryMode: "single",// 查询类型
          fieldExtendJson: '',// 扩展参数
          fieldValueRuleCode: '',// 添值规则
          fieldHref: '',// 字段Href
          fieldValidType: '',// 验证规则
          fieldMustInput: 0,// 校验必填
          dictTable: '',// 字典Table
          dictText: '',// 字典Text
          dictField: '',// 字典code
          mainField: '',// 主表字段
          mainTable: '',// 主表名
        })
      },
      changeChecked(e, m) {
        if (e[m] == 0) {
          e[m] = 1
        } else {
          e[m] = 0
        }
      },

      handleChange(value, key, column) {
        key[column] = value;
        // const newData = [...this.dataSource];
        // const target = newData.filter(item => key === item.key)[0];
        // if (target) {
        //   target[column] = value;
        //   this.dataSource = newData;
        // }
      },
      handleSelectedChange(row, key, value) {
        row[key] = value;
      }
    },
  }
</script>

<style scoped>

</style>
