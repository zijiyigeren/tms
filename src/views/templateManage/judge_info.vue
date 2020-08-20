<template>
  <!-- 判别信息 -->
  <div style="width:100%;height: 100%;display: flex;flex-direction: column;">
    <div>
      <el-form
        v-bind="{
          model: judgeInfo,
          labelWidth: '110px',
          labelSuffix: ' :',
          size:'mini',
        }"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="检验类型">
              <el-select style="width: 100%;" v-model="judgeInfo.checkType">
                <el-option label="全部" value=""/>
                <el-option
                  v-for="(item,index) in checkTypeList"
                  :key="'option'+ index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="判别信息">
              <el-input v-model="judgeInfo.judgeName" style="width: 48%;"></el-input>
              <el-input v-model="judgeInfo.judgeValue" style="width: 48%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签名称">
              <el-input v-model="judgeInfo.bookName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上传时间">
              <el-date-picker
                style="width: 100%;"
                v-model="dateRangeValue"
                format="yyyy-MM-dd"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <p style="overflow: hidden;text-align: right;">
        <el-button size="mini" type="primary" style="float: left;"
                   @click="goAdd"
        >新建判别信息
        </el-button>
        <el-button size="mini" type="primary"
                   @click="() => {
                      currentPage = 1
                      goNextPage('1')
                   }"
        >查询
        </el-button>
        <el-button size="mini" type="info" @click="resetButton">重置</el-button>
      </p>
    </div>
    <div style="flex: 1;overflow: hidden;">
      <el-table
        v-loading="loading1"
        v-bind="{
          height: 'calc(100% - 10px)',
          data: tableData,
          border: true,
        }"
      >
        <el-table-column
          label="序号"
          type="index"
          width="55"
          align="center"
          :resizable="false"
          :index="i => (currentPage - 1) * pageSize + i + 1"
        />
        <el-table-column
          label="检测类型"
          :resizable="false"
          property="checkType"
        />
        <el-table-column
          label="判别信息"
          :resizable="false"
          property=""
          align="center"
        >
          <el-table-column
            label="判别信息名称"
            :resizable="false"
            property="judgeName"
            align="center"
          />
          <el-table-column
            label="判别信息内容"
            :resizable="false"
            property="judgeValue"
            align="center"
          />
        </el-table-column>

        <el-table-column
          label="标签名称"
          :resizable="false"
          property="bookName"
        />
        <el-table-column
          label="上传时间"
          :resizable="false"
          property="createDate"
          :formatter="formatter_createDate"
        />
        <el-table-column
          label="操作"
          align="center"
          :resizable="false"
          property=""
          width="230"
        >
          <template slot-scope="{ row, $index }">
            <a-button type="link" style="padding: 0;" @click="goEdit(row)">编辑</a-button>
            <a-button type="link" style="padding: 0;color: red;" @click="goDelete(row)">删除</a-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
        :total="total"
        :currentPage="currentPage"
        v-bind="{
          pageSize: pageSize,
          layout: 'total, -> ,prev, pager, next, jumper'
        }"

        @current-change="(val)=>{
          currentPage = val
          goNextPage((val+''))
        }"
      />
    </div>

    <!-- 新建/编辑 模板数据填写规则 -->
    <el-dialog
      :visible.sync="show1"
      v-bind="{
        // top: '5vh',
        // width: '60%',
        title: dialogTitle,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        modal: false,
      }"
      @close="close_show1"
    >
      <JudgeInfoEdit
        ref="JudgeInfoEdit"
        :edit-data="editData"
        @closeDialog_Fn1="closeDialogFn1"
      />
    </el-dialog>

  </div>
</template>

<script>
  import JudgeInfoEdit from './dialogComponents/judge_info_edit'
  import {timestampToTime,} from '@/views/templateManage/js/index.js'

  let _judgeInfo = {
    checkType: '',
    judgeName: '',
    judgeValue: '',
    bookName: '',
    fromDate: '',
    toDate: ''
  }
  export default {
    name: 'judgeinfo',
    components: {
      JudgeInfoEdit,
    },
    data () {
      return {
        checkTypeList: [],
        //
        judgeInfo: JSON.parse(JSON.stringify(_judgeInfo)),
        dateRangeValue: ['', ''],
        //
        tableData: [],
        loading1: false,
        //
        total: 0,
        currentPage: 1,
        pageSize: 15,
        //
        show1: false,
        dialogTitle1: '新建',
        editData: null,
        //
        show2: false,
        //
        show2_1: false,
        //
        show3: false,
      }
    },
    watch: {
      dateRangeValue (value) {
        if (value == null) {
          this.judgeInfo.fromDate = ''
          this.judgeInfo.toDate = ''
        } else {
          this.judgeInfo.fromDate = Date.parse(value[0])
          this.judgeInfo.toDate = Date.parse(value[1])
        }
      },
    },
    computed: {
      dialogTitle () {
        return `${this.dialogTitle1}判别信息`
      }
    },
    methods: {
      /*
      * 新建单数据填写规则
      * */
      goAdd () {
        this.dialogTitle1 = '新建'
        this.show1 = true
      },

      /*
      * 查询
      * */
      goNextPage (currentPage) {
        this.loading1 = true
        let params = {
          ...JSON.parse(JSON.stringify(this.judgeInfo)),
          currentPage: currentPage,
        }
        this.$api.judgeInfo.judgeInfo_list(params)
          .then(resp => {
            let temp = resp.data.data
            if (temp) {
              this.tableData = temp
              this.total = temp[0].total
              this.pageSize = temp[0].pageSize
            }
          })
          .catch(err => {
          })
          .then(() => {
            this.loading1 = false
          })
      },

      /*
      * 重置
      * */
      resetButton () {

      },

      /*
      * 时间戳格式化
      * */
      formatter_createDate (row, column, cellValue, index) {
        return timestampToTime(cellValue)
      },

      /*
      * 编辑
      * */
      goEdit (data) {
        this.dialogTitle1 = '编辑'
        this.show1 = true
        this.$nextTick(() => {
          this.editData = JSON.parse(JSON.stringify(data))
        })
      },
      /*
      * 判别信息
      * */
      goBindShow () {
        this.show2 = true
      },
      /*
      * 删除
      * */
      goDelete (row) {
        this.$api.judgeInfo.judgeInfo_delete(row.id)
          .then(resp => {
            this.goNextPage((this.currentPage + ''))
          })
          .catch(err => {
          })
      },

      close_show1 () {
        this.dialogTitle1 = '新建'
        this.editData = null
        this.$refs['JudgeInfoEdit'].$refs['form1'].clearValidate()
        this.goNextPage((this.currentPage + ''))
      },
      closeDialogFn1 () {
        this.show1 = false
      },
    },
    created () {
      /*
      * 获取检测类型
      * */
      this.$api.judgeInfo.getCheckType()
        .then((resp) => {
          let temp = resp.data.data
          this.checkTypeList = temp.slice(0)
        })
        .catch(() => {
        })
    },
  }
</script>

<style scoped lang="less">

</style>
