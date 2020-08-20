<template>
  <section class="lxt_bgcolor">
    <!-- 查询功能 -->
    <div class="lxt_pubit" v-if="hiddenFlg">
      <!-- 查询范围 -->
      <el-select
        class="lxt_distribution"
        placeholder="请选择"
        v-model="Categoryvalue"
      >
        <el-option
          v-for="(item,index) in Category" :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!-- 年份选择器 -->
      <el-select
        class="lxt_date"
        placeholder="请选择"
        v-model="selectDateValue"
      >
        <el-option
          v-for="(item,index) in selectDate" :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!-- 查询 -->
      <el-input
        autocomplete="off"
        placeholder="请输入内容"
        class="lxt_content"
        name="clearInputValue"
        v-model="searchInput"
        clearable
      >
        <template slot="append">
          <el-button icon="el-icon-search" @click="searchData()"></el-button>
        </template>
      </el-input>
      <!-- 最近的搜索历史记录 -->
      <div class="lxt_fire"></div>
      <div class="lxt_fireBtns">
        <el-button
          plain
          v-for="(item,index) in fireBtn" :key="index"
          @click="searchData(item)" style="height: 40px;">{{item}}
        </el-button>
      </div>
    </div>
    <!-- 常用模块 -->
    <div style="background: #ffffff;box-sizing: border-box;margin: 10px;">
      <div class="commonModule-title">
        <i class="commonModule-i"></i>
        常用模块
      </div>
      <common></common>
    </div>
    <!-- 搜索内容 -->
    <div style="background: #ffffff;margin: 10px;padding-bottom:5px;" v-if="hiddenFlg" v-show="showFlg">
      <div class="commonModule-title">
        <i class="commonModule-i"></i>
        搜索内容 ：{{arrSearchType | searchType }}
      </div>
      <tablepage
        ref="TablePage"
        :isTableType="isTableType" :arrsearch='arrsearch' :isLoading="child_loading"
        :myCurrentPage="currentPage" :myPageSize="pageSize" :myTotal="total"
        :mySearchInput="searchInput" :mySelectDate="selectDateValue"
      ></tablepage>
    </div>
    <!-- 状态提示 -->
    <div style="margin: 10px;background: #ffffff;">
      <div class="commonModule-title lxt_statusTips">
        <i class="commonModule-i"></i>
        状态提示
      </div>
      <statustips style="background: #ffffff;"></statustips>
    </div>

  </section>
</template>
<script>
  import tablepage from './tablepage.vue'
  import statustips from './statustips.vue'
  import common from './common.vue'

  export default {
    name: 'home',
    components: {
      tablepage,
      statustips,
      common
    },
    data () {
      return {
        Category: [],// 当前登录人可查询范围的权限数据
        Categoryvalue: '',// 当前登录人选择的想要查询数据的类别

        selectDate: [],// 年份
        selectDateValue: '',

        arrYear: [{value: '', label: '全部'}],
        searchInput: '',
        fireBtn: [],// 最近搜索内容记录
        arrSearchType: '',
        menuKey: 1,// 强制刷新组件
        child_loading: false,
        // <!-- 渗透到子组件的参数 -->
        isTableType: '',
        currentPage: 1, // 当前页数  分页
        pageSize: 5, // 每页显示条数 分页
        total: 0,// 数据总量
        arrsearch: [],// 不同类型的表格,所对应的表格数据

        hiddenFlg: true,// 登录用户没有任何权限时,不显示 搜索内容 和 查询功能
        showFlg: false,// 不点击查询,不显示搜索内容
      }
    },
    methods: {
      /*
      * 按钮搜索事件
      * */
      searchData (value) {
        this.showFlg = true
        // 重置
        this.isTableType = this.Categoryvalue
        this.arrsearch = []
        this.currentPage = 1
        this.pageSize = 5

        this.$refs['TablePage'].currentPage = 1
        this.$refs['TablePage'].pageSize = 5

        this.arrSearchType = this.Categoryvalue
        this.child_loading = true
        // 点击热搜历史触发的搜索
        if (value) {
          this.searchInput = value
        }
        // 当查询 `我的报告`,调用 viewMyReportList接口
        if (this.Categoryvalue == 0) {
          this.$api.systemPublicationpage.viewMyReportList({
            searchdate: this.selectDateValue,
            usualCondition: this.searchInput,
            // zjsign: '0',
            currentPage: this.currentPage,
            pageSize: this.pageSize,
          })
            .then(res => {
              if (res.data.ok && res.data.data && res.data.data.length != 0) {
                this.arrsearch = res.data.data
                this.total = res.data.data[0].total
              } else {
                this.$message({type: 'warning', message: '未查询到符合条件的数据'})
                this.total = 0
                this.currentPage = 1
                this.pageSize = 5
              }
              this.child_loading = false
            })
            .catch(err => {
              this.$message({type: 'error', message: err.data.message})
              this.child_loading = false
            })
        }
        // 查询 _ /分配检测 /检测报告 /审核报告 /批准报告,调用 findTaskList接口
        else {
          // 表格类型为 _ 检测报告 时 分页重新初始化为 5条/页
          if (this.isTableType == 3 || this.isTableType == 5 || this.isTableType == 6) {
            this.pageSize = 5
          }
          this.$api.systemPublicationpage.findTaskList({
            process_instance_id: this.Categoryvalue,
            usualCondition: this.searchInput,
            searchdate: this.selectDateValue,
            currentPage: this.currentPage,
            pageSize: this.pageSize
          })
            .then(res => {
              if (res.data.ok && res.data.data && res.data.data.length != 0) {
                res.data.data[0].currentPage = this.currentPage// 用途不明,但是需要传
                this.arrsearch = res.data.data
                this.total = res.data.data[0].total
              } else {
                this.$message({type: 'warning', message: res.data.message})
                this.total = 0
                this.currentPage = 1
                this.pageSize = 5
              }
              this.child_loading = false
            })
            .catch(err => {
              this.$message({type: 'error', message: err.data.message})
              this.child_loading = false
            })
        }

        this.setNearlyCondition({
          condition: this.searchInput
        })
      },

      /*
      * 功能:查询功能 _ 保存 _ 最近搜索内容
      * */
      setNearlyCondition (params) {
        if (this.searchInput == '') return
        this.$api.systemPublicationpage.setNearlyCondition(params)
          .then(res => {
            if (res.data.ok && res.data.data) {
              this.fireBtn = res.data.data
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.data.message
            })
          })
      },

      /*
      * 功能:查询功能 _ 获取 _ 最近搜索记录
      * */
      getNearlyCondition () {
        this.$api.systemPublicationpage.getNearlyCondition()
          .then(res => {
            if (res.data.ok && res.data.data) {
              this.fireBtn = res.data.data
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: error.data.message
            })
          })
      },

      /*
      * 功能:查询功能 _ 获取 _ 查询范围
      * */
      getUsualSearch () {
        this.$api.systemPublicationpage.getUsualSearch()
          .then(res => {
            if (res.data.ok && res.data.data) {
              var box = res.data.data
              // 登录人有权限查看搜索时
              if (Object.keys(box).length != 0) {
                for (var key in box) {
                  this.Category.push({label: box[key], value: key})
                }
                // 默认选中状态第一个option
                this.Categoryvalue = this.Category[0].value
              }
              // 登录人没有任何权限时,不显示 查询功能 和 搜索内容
              else {
                this.hiddenFlg = false
              }
            }
          })
          .catch(error => {
            console.log(error)
            this.$message({
              type: 'error',
              message: error.data.message
            })
          })
      },

      /*
      * 功能:当前可选年份范围
      * */
      yearDate () {
        // 遍历年份 从2007开始到当前年份
        const myDate = new Date()
        let thisYear = myDate.getFullYear()
        let Section = thisYear - 2007
        for (let i = 0; i <= Section; i++) {
          let _thisYear = thisYear--
          let obj = {value: _thisYear, label: _thisYear}
          this.arrYear.push(obj)
        }
        this.selectDate = this.arrYear
      },
    },
    filters: {
      searchType (valu) {
        switch (valu) {
          case '0':
            return '我的报告'
            break
          case '2':
            return '二次分配'
            break
          case '3':
            return '报告编辑'
            break
          case '4':
            return '报告校验'
            break
          case '5':
            return '报告审核'
            break
          case '6':
            return '报告批准'
            break
          case '11':
            return '任务分配'
            break
          case '12':
            return '再次分配'
            break
          case '13':
            return '原始记录上传'
            break
          case '14':
            return '原始记录审核'
            break
        }
      }
    },
    created () {
      this.yearDate()
      this.getUsualSearch()
      this.getNearlyCondition()
    },
    mounted () {
      this.$EventBus.$on('Search_Again', this.searchData)
      window.onresize = () => {
        this.menuKey++
      }
      window.sessionStorage.setItem('includePageNames', 'home')
    },
  }
</script>
<style scoped>
  .lxt_bgcolor {
    background-color: #eee;
  }

  .lxt_bgcolor li {
    list-style: none
  }

  .lxt_bgcolor * {
    transition: all .1s
  }

  .lxt_pubit {
    width: 100%;
    height: auto;
    margin: 10px 10px 10px 0;
    padding-left: 10px;
    display: flex;
    overflow: hidden;
  }

  .lxt_pubit div {
    margin-right: .5%
  }

  .lxt_distribution {
    width: 10%;
  }

  .lxt_date {
    width: 10%;
  }

  .lxt_content {
    width: 35%;
  }

  .lxt_search {
    width: 5%;
    margin-right: .5%;
    padding: .8vw .5vw;
  }

  .lxt_fire {
    width: 25px;
    height: 40px;
    font-size: 1.1vw;
    line-height: 40px;
    text-align: right;
    display: inline-block;
    background-image: url(../../../../assets/images/history.png);
    background-repeat: no-repeat;
    background-size: 20px;
    background-position: left center;
    margin-left: .5vw;
  }

  .lxt_fireBtns {
    width: 30%;
    display: inline-block;
  }

  .lxt_fireBtns button {
    width: auto;
    margin-left: .8%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: rgba(245, 245, 245, 1);
    border: 1px solid rgba(239, 239, 239, 1);
    box-shadow: 0 0 16px 0 rgba(180, 180, 180, 0.21);
    border-radius: 2px;
  }

  .lxt_searchContent {
    width: 100%;
    height: auto;
    padding: 1%;
    font-size: 16px;
    border: solid 1px #ccc
  }

  .lxt_tables {
    width: 100%;
  }

  .lxt_title {
    width: 100%;
    height: auto;
    padding: 0 0 1vw 0;
    text-align: center
  }

  .lxt_block {
    width: 100%;
    margin-top: 1vw;
    text-align: center
  }

  .commonModule-title {
    font-size: 16px;
    height: 36px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }

  .commonModule-i {
    display: block;
    width: 3px;
    height: 14px;
    background: linear-gradient(0deg, rgba(96, 135, 254, 1), rgba(84, 183, 235, 1));
    margin-left: 10px;
    margin-right: 11px;
  }


</style>
