<template>
    <!-- 上传公共组件 -->
  <div class="box">
    <div class="fromBox">
      <div class="fromtop">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            >
            <el-table-column prop="itemsCode" label="报告编号">
              <template slot-scope="scope">
                <span @click="showGoRead(scope.row)">{{scope.row.itemsCode}}</span>         
              </template>
            </el-table-column>
            <el-table-column prop="vin" label="VIN"></el-table-column>
            <el-table-column prop="fdj" label="发动机"></el-table-column>
          </el-table>
        </template>
      </div>
    </div>

    <!--快查的对话框-->
    <el-dialog :close-on-press-escape="false"
               :close-on-click-modal="false" width="80%" title="快速查看"
               :visible.sync="dialogQuickly"
               :before-close="handleDialogQuickly" class="dialog_quickly">
      <Quiickready @selectproductValue="selectproductValue" @nextReportBtn="nextReportBtn"
                   :indexValueId="indexValueId" :percentage="percentage" :productValue="productValue"
                   :initialState="initialState"
                   :tableDataImg="tableDataImg" :numberData="number" :imgCountPage="imgCountPage" :uploadIdList="uploadIdList"></Quiickready>
    </el-dialog>

    <div class="zhezhao" v-if="mask"></div>


  </div>
</template>
<script>
import Quiickready from '@/components/Quiickready'
import base from "@/api/base.js"
export default {
    name: 'viewvin',
    props:['viewvindata'],
    components: {Quiickready},
    data() {
      return {
          mask:false,
          tableData: [],
          percentage: [ /* 快查选择百分比 */
            {value: '0', label: '40%'}, {value: '1', label: '70%'},
            {value: '2', label: '90%'}, {value: '3', label: '100%'},
            {value: '4', label: '130%'}, {value: '5', label: '150%'}
          ],
          dialogQuickly: false, // 快查对话框的显示隐藏
          indexValueId: 0, // 快查
          productValue: '', /* 快查我的报告编号 */
          initialState: false, // 快查
          tableDataImg: [], /* 快查图片数组 */
          number: [], /* 快查下拉框 */
          imgCountPage: '', /* 快查图片页数 */
          uploadIdList: [], // 上传中机-快查id
        }
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      // 点击快查
      showGoRead(row) {
        this.mask = true;
        //WT191627
        this.initialState = true;
        this.tableDataImg = [];
        this.imgCountPage = '';
        var rowItemCode = {itemsCode: row.itemsCode};
        var rowRow = [];
        rowRow.push(rowItemCode);
        this.number = rowRow;
        this.uploadIdList = [row];
        this.productValue = this.number[0].id; 
        this.$api.myReport.quicklyQuickly(row.id).then(res => {
          var floder = res.data.data.floder,
            pagecount = res.data.data.pagecount,
            imgDataId = res.data.data.id;
          this.imgCountPage = pagecount ? pagecount.toString() : '0';
          if (floder == null || pagecount == null || imgDataId == null) {
            this.$message({type: 'info', message: '暂无生成', duration: 1500});
          } else {
            if (pagecount > 0) {
              for (var imgIndexImg = 1; imgIndexImg <= pagecount; imgIndexImg++) {
                var objImg = {
                  v: imgIndexImg,
                  url: `${base.baseImgUrl}docs/gif/${floder}/${imgDataId}_${imgIndexImg}.jpg`
                };
                this.tableDataImg.push(objImg)
              }
            }
           
            if (this.imgCountPage < 1 || this.tableDataImg == []) {
              this.$message({type: 'error', message: `${row.itemsCode}暂未生成快查`, duration: 1500});
              return false
            } else {
              this.dialogQuickly = true;
            }
          }
        }).catch(err => {
          console.log(err)
          this.$message({type: 'error', message: "查看失败", duration: 1500});
        })

      },
      // 快查对话框关闭事件
      handleDialogQuickly() {
        this.mask = false;

        this.initialState = false;
        this.dialogQuickly = false;
        this.imgCountPage = '';
        this.tableDataImg = [];
        this.indexValueId = 0;
        if (this.multipleSelection.length > 0) {
          this.productValue = this.multipleSelection[0].id;
        }
      },
      //选择报告编号
      selectproductValue(data) {
        this.productValue = data;
        this.number.forEach((val, index) => {
          if (this.productValue === val.id) {
            this.indexValueId = index;
          }
        });
        this.reportQuickt(this.productValue)
      },
      //点击下一份报告
      nextReportBtn(data) {
        if (this.number.length == 1) {
          this.$message({type: 'info', message: '当前只有一份报告', duration: 1500});
        } else {
          if (this.indexValueId < this.number.length - 1) {
            let indexValueId = this.indexValueId + 1;
            this.number.forEach((val, index) => {
              if (indexValueId === index) {
                this.productValue = val.id;
              }
              this.indexValueId = indexValueId;
            });
          } else {
            this.productValue = this.number[0].id;
            this.indexValueId = 0;
          }
          this.reportQuickt(this.productValue)
        }

      },
      //快查接口封装
      reportQuickt(idId) {
        this.imgCountPage = '';
        this.tableDataImg = [];
        this.$api.myReport.quicklyQuickly(idId).then(res => {
          var floder = res.data.data.floder,
            pagecount = res.data.data.pagecount,
            imgDataId = res.data.data.id;
          this.imgCountPage = pagecount ? pagecount.toString() : '0';
          if (floder == null || pagecount == null || imgDataId == null) {
            this.$message({type: 'info', message: '暂无生成', duration: 1500});
          }
          if (pagecount > 0) {
            for (var imgIndexImg = 1; imgIndexImg <= pagecount; imgIndexImg++) {
              var objImg = {
                v: imgIndexImg,
                url: `${base.baseImgUrl}docs/gif/${floder}/${imgDataId}_${imgIndexImg}.jpg`
              };
              this.tableDataImg.push(objImg)
            }
          }
        }).catch(err => {
          this.$message({type: 'error', message: '查看失败', duration: 1500});
        })
      },

    },
    created() {
     
    },
    mounted() {
    },
    watch:{
      viewvindata(val){
        this.viewvindata = val;
        this.tableData = []
        this.viewvindata.forEach(item => {
           this.tableData.push(item)
        });

      },
    }
}
</script>

<style lang="scss" scoped>
.box{
    width: 100%;
    height:100%;
    overflow: hidden;
    .fromBox{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
        .boxtitle{
          margin-left: 0;
          font-size: 14px;
          color: #606266;
          line-height: 40px;
          span{
            margin: 0 5px;
          }
        }
        .fromtop{
          width: 100%;
          height: 100%;
          margin-top: 10px;
          overflow: auto;
        }
    }
}
.dialog_quickly {
    overflow: hidden;
    padding: 50px 0;
  }

  /deep/ .dialog_quickly .el-dialog {
    height: 100% !important;
    margin: 0 auto !important;
    overflow: hidden !important;
    display: flex;
    flex-direction: column;
  }
  .zhezhao{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000;
    z-index: 2001;
    transition: all .5s;
  }

  /deep/ .dialog_quickly .el-dialog .el-dialog__body {
    flex: 1 !important;
    overflow: hidden !important;
    padding: 20px;
  }
</style>
