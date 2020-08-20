<template>
  <!-- 快查 -->
  <div class="bindingsd_cent">
    <!-- 顶部操作按钮 -->
    <div class="bindingsd_cent_header">
      <div class="bindingsd_cent_header_right">
        <span>项目</span>
        <el-select
          @change="selectproductValue"
          size="small"
          v-model="childValue"
          collapse-tags
          placeholder="请选择">
          <el-option
            v-for="item in numberData"
            :key="item.id"
            :label="item.itemsCode"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="bindingsd_cent_header_left">
        <el-button type="danger" size="mini" @click="fullScreen">全屏</el-button>
        <el-select
          @change="handBai"
          class="percentage"
          :allow-create="true"
          filterable
          size="small"
          v-model="percentageValue"
          collapse-tags
          style="margin:0 5px;">
          <el-option
            v-for="item in percentage"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            {{item.label}}
          </el-option>
        </el-select>
        <el-button type="primary" @click="nextReportBtn" style="marginRight:5px;" class="bindingsd_btn">下一份报告</el-button>
        <el-button type="primary" @click="onClickupload" class="bindingsd_btn" :disabled="uploadState">设为可上传中机</el-button>
      </div>
    </div>
    <!-- 图片显示 -->
    <div class="bindingsd_cent_body" id="content">
      <div class="bindingsd_cent_body_img_item" 
          v-for="item in tableDataImg.slice((currentPage3 - 1) * pageSize1, currentPage3*pageSize1)"
          :key="item.v">
        <div class="bindingsd_centbody_imgitem_box">
          <img :src="item.url" :style="{width: imgWidth ? imgWidth : '70%',display:'block'}" class="imgClass" @click="imgBtnFun($event)">
        </div>
      </div>
      <!-- <div class="bindingsd_cent_body_img_item" 
          v-for="item in tableDataImg.slice((currentPage3 - 1) * pageSize1, currentPage3*pageSize1)"
          :key="item.v">
        <div class="bindingsd_centbody_imgitem_box">
          <img src="@/assets/images/y.jpeg" :style="{width: imgWidth ? imgWidth : '70%',display:'block'}" class="imgClass" @click="imgBtnFun($event)">
        </div>
      </div> -->
    </div>
    <!--分页器-->
    <div class="bindingsd_cent_pagination">
      <el-pagination
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="currentPage3"
        :page-size="pageSize1"
        layout="total, prev, pager, next, jumper"
        :total="tableDataImg.length">
      </el-pagination>
    </div>

    <!-- 设为可上传中机 -->
    <el-dialog title="设为可上传中机" :visible.sync="uploadVisible" class="choice_model" width="90%" :before-close="closeUploadDialog" :close-on-click-modal="false">
      <div class="task_release_table">
        <div class="task_release_content">
            <el-table
                border
                stripe
                :data="uploadTablelist"
                :header-cell-style="{
                    'background-color': 'rgba(243,246,253,1)',
                    'color': '#606266',
                    'padding': '10px 0'
                }">
                <el-table-column prop="itemsItemCode" label="代码" align="center" :resizable="false"></el-table-column>
                <el-table-column prop="itemsName" label="名称" align="center" :resizable="false"></el-table-column>
                <el-table-column prop="itemsBasis" label="依据" align="center" :resizable="false"></el-table-column>
                <el-table-column label="视频状态" align="center" :resizable="false" class-name="radio_list" width="400">
                  <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.radioId" @change="goClickRadio(scope.row)">
                      <el-radio :label="1" v-if="itemscodeAll.indexOf(scope.row.itemsItemCode) == -1">无</el-radio>
                      <el-radio :label="2">有</el-radio>
                      <el-radio :label="3">未做视频</el-radio>
                      <el-radio :label="4" v-if="itemscode47 == scope.row.itemsItemCode">同81项，47项不用填</el-radio>
                      <el-radio :label="5" v-if="itemscode30 == scope.row.itemsItemCode">同29项Ⅲ，30项不用填</el-radio>
                      <el-radio :label="6" v-if="itemscode29 == scope.row.itemsItemCode">30项采用零部件加载测试</el-radio>
                      <el-radio :label="7" v-if="itemscode74 == scope.row.itemsItemCode">同01项</el-radio>
                    </el-radio-group>
                  </template>
                </el-table-column>
                <el-table-column label="视频名称" align="center" :resizable="false">
                  <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.videoFilename" clearable></el-input>
                  </template>
                </el-table-column>
            </el-table>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="closeUploadDialog" class="bindingsd_btn">关 闭</el-button>
        <el-button type="primary" class="bindingsd_btn" @click="onClickPreservation">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name:'quiickready',
  props: {
    percentage: {type: Array},
    productValue: {type: Number},
    numberData: {type: Array}, /*快查下拉框*/
    imgCountPage: {type: String}, /*图片页数*/
    tableDataImg: {type: Array},
    indexValueId: {type: Number},
    initialState: {type: Boolean},
    uploadIdList: {type: Array}
  },
  watch: {
    tableDataImg(value) {
      if(value.length > 0 && value.length < 2){
        this.uploadState = false;
      }else{
        this.uploadState = true;
      }
    },
    productValue(value) {
      this.childValue = value;
    },
    initialState(value) {
      if(value){
        this.percentage.forEach(item => {
          if (item.label == '70%') {
            this.percentageValue = item.value
          }
        });
        this.currentPage3 = 1;
        this.imgWidth = null;
      }
    }
  },
  data() {
    return {
      currentIndex:this.productValue,
      percentageValue: '', /*选择百分比*/
      pageSize1: 2, /*快查分页*/
      currentPage3: 1, /*分页*/
      srr:[],
      childValue: this.productValue,
      fullscreen: false,
      imgWidth: null,
      uploadTablelist: [],  // 上传中机table数据
      uploadState: this.tableDataImg.length > 0 && this.tableDataImg.length < 2 ? false : true, // 上传中机按钮状态
      uploadVisible: false, // 上传中机对话框
      radio: '', // 单选框的选中状态
      itemscodeAll: '01,28,29,30,47,58,74,75,81',
      itemscode47: '47',
      itemscode30: '30',
      itemscode29: '29',
      itemscode74: '74',
    }
  },
  methods: {
    //点击全屏
    fullScreen() {
      let element = document.getElementById('content');
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      if (typeof window.ActiveXObject !== 'undefined') {
          let wscript = new ActiveXObject('WScript.Shell')
          if (wscript !== null) {
            wscript.SendKeys('{F11}')

          }
      }
    },
    //百分比选择
    handBai(value) {
      let obj = {};
      obj = this.percentage.find((item) => {
        return item.value === value;
      });
      var percentageImg = document.getElementsByClassName('imgClass')
      this.srr = Array.from(percentageImg)
      this.srr.forEach(item => {
        item.style.width = obj.label;
        this.imgWidth = obj.label;
      })
    },
    //点击下一份报告
    nextReportBtn() {
      this.currentPage3 = 1;
      this.$emit('nextReportBtn',this.productValue);
    },
    //选择报告编号
    selectproductValue(){
      this.currentPage3 = 1;
      this.$emit('selectproductValue',this.childValue)
    },
    //点击图片翻页
    imgBtnFun(e) {
      var leftRightImg = document.getElementsByClassName('imgClass');
      var left = leftRightImg[0];
      var right = leftRightImg[1];
      var saveCurrentPage3 = this.currentPage3
      if (e.target == left) {
        if (saveCurrentPage3 == 1) {
          this.$message({type: 'info', message: "当前第一页"})
          return
        }
        saveCurrentPage3--
        this.handleCurrentChange1(saveCurrentPage3)
      }
      if (e.target == right) {
        saveCurrentPage3++
        this.handleCurrentChange1(saveCurrentPage3)
      }

    },
    // 快查翻页
    handleSizeChange1(val) {
      this.pageSize1 = val;
    },
    //快查翻页
    handleCurrentChange1(val) {
      if (val * 2 > this.imgCountPage) { 
        if ((val-1) * 2 == this.imgCountPage) { 
          this.currentPage3 = val-1;
        }else if((val-1) * 2 < this.imgCountPage){
          this.currentPage3 = val;
        }
        this.uploadState = false;
        return this.$message({type: 'success', message: "浏览完毕", duration: 1500})
      }else{
        this.uploadState = true;
        this.currentPage3 = val;
      }
    },
    // 点击上传中机
    onClickupload() {
      if(!this.uploadState) {
        let idList = '';
        this.uploadIdList.forEach(item => idList = idList+item.id+',');
        idList = idList.slice(0,idList.length-1);
        this.$api.login.checkVideo(idList).then(res => {
          let data = res.data.data;
          if(data.list.length == 0) {
            this.taskViewGoUploadSig();
          }else{
            this.uploadVisible = true;
            data.list.forEach(item => {
              if(item.videoStatus == '无'){
                item.radioId = 1;
              }else if(item.videoStatus == '有'){
                item.radioId = 2;
              }else if(item.videoStatus == '未做视频'){
                item.radioId = 3;
              }else if(item.videoStatus == '同81项，47项不用填'){
                item.radioId = 4;
              }else if(item.videoStatus == '同29项Ⅲ，30项不用填'){
                item.radioId = 5;
              }else if(item.videoStatus == '30项采用零部件加载测试'){
                item.radioId = 6;
              }else if(item.videoStatus == '同01项'){
                item.radioId = 7;
              }
            });
            this.uploadTablelist = data.list;
          }
        }).catch(error => {
          this.$message({type: 'error', message: error.data.message, duration: 1500});
        })
      }
    },
    // 上传中机-单选按钮-选择
    goClickRadio(row) {
      if(row.radioId == 1){
        row.videoFilename = '无';
        row.videoStatus = '无';
      }else if(row.radioId == 2){
        row.videoFilename = row.itemsCode;
        row.videoStatus = '有';
      }else if(row.radioId == 3){
        row.videoFilename = '未做视频';
        row.videoStatus = '未做视频';
      }else if(row.radioId == 4){
        row.videoFilename = '同81项，47项不用填';
        row.videoStatus = '同81项，47项不用填';
      }else if(row.radioId == 5){
        row.videoFilename = '同29项Ⅲ，30项不用填';
        row.videoStatus = '同29项Ⅲ，30项不用填';
      }else if(row.radioId == 6){
        row.videoFilename = '30项采用零部件加载测试';
        row.videoStatus = '30项采用零部件加载测试';
      }else if(row.radioId == 7){
        row.videoFilename = '30项采用零部件加载测试';
        row.videoStatus = '30项采用零部件加载测试';
      }
    },
    // 上传中机对话框--点击保存
    onClickPreservation() {
      let inspectid = '';
      let videoFilename = '';
      let videoStatus = '';
      this.uploadTablelist.forEach(item => inspectid = inspectid+item.inspectid+',');
      inspectid = inspectid.slice(0,inspectid.length-1);

      this.uploadTablelist.forEach(item => {
        if(item.videoStatus == '无' && !item.videoFilename){
          videoFilename = videoFilename+'无'+','
        }else{
          videoFilename = videoFilename+item.videoFilename+','
        }
      });
      videoFilename = videoFilename.slice(0,videoFilename.length-1);

      this.uploadTablelist.forEach(item => videoStatus = videoStatus+item.videoStatus+',');
      videoStatus = videoStatus.slice(0,videoStatus.length-1);
      
      let params = {inspectid,videoFilename,videoStatus}
      this.$api.login.goSaveViedoConfig(params).then(res => {
        this.taskViewGoUploadSig();
      }).catch(error => {
        this.$message({type: 'error', message: error.data.message, duration: 1500});
      })
    },
    // 上传中机
    taskViewGoUploadSig() {
      let inspect_id = '';
      this.uploadIdList.forEach(item => inspect_id = inspect_id+item.id+',');
      inspect_id = inspect_id.slice(0,inspect_id.length-1);
      let searchdate = this.uploadIdList[0].partitiondate;
      let params = {
        inspect_id,
        searchdate,
        sign: 2,
        spage: 4
      }
      this.$api.login.goUploadSig(params).then(res => {
        this.closeUploadDialog();
        this.$message({type: 'success', message: res.data.data, duration: 1500});
      }).catch(error => {
        this.$message({type: 'error', message: error.data.message, duration: 1500});
      })
    },
    // 关闭上传中机对话框
    closeUploadDialog() {
      this.uploadVisible = false;
    },
  },
  mounted(){
    if(this.initialState){
      this.percentage.forEach(item => {
        if (item.label == '70%') {
          this.percentageValue = item.value
        }
      });
      this.imgWidth = null;
      this.currentPage3 = 1;
    }
  },

}
</script>

<style scoped lang="less">
.bindingsd_cent {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.bindingsd_cent_header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.bindingsd_cent_body {
  flex: 1;
  overflow: hidden;
  display: flex;
}
.bindingsd_cent_body_img_item {
  width: 50%;
  height: 100%;
  overflow: hidden;
}
.bindingsd_centbody_imgitem_box {
  width: 80%;
  height: 100%;
  margin: 0 auto;
  overflow: auto;
}
.imgClass {
  margin: 0 auto;
}
.bindingsd_cent_pagination {
  margin-top: 20px;
}
.bindingsd_cent_header_left {
  display: flex;
  align-items: center;
}
.bindingsd_btn {
  height: 30px;
  padding: 0 20px;
  margin: 0;
}
.choice_model {
  padding: 170px;
}
.task_release_table {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.task_release_content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.radio_list .el-radio{
  margin-right: 10px;
}
</style>
