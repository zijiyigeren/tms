<template>
  <!-- 归档 -->
  <div class="sss">
    <el-form label-width="100px" :model="formInline" class="demo-form-inline form_inline" v-loading="loading">
      <el-form-item label="任务号 :">
        <el-input v-model="formInline.taskCode" placeholder="" :disabled="true"></el-input>
      </el-form-item>
      <div class="enterprise">
        <el-form-item label="企业委托单 :" size="mini" :inline="true">
          <div class="div6"></div>
          <el-upload
            :disabled="disd"
            style="width:10%;display:inline-block;"
            class="upload-demo"
            action="1"
            :on-preview="handlePreview6"
            :on-remove="handleRemove6"
            :before-remove="beforeRemove6"
            :before-upload="beforeUpload6"
            multiple
            :limit="100"
            :on-exceed="handleExceed6"
            :file-list="fileList6">
            <el-button size="small" type="primary" :disabled="disd">点击上传</el-button>
          </el-upload>
          <el-radio-group v-model="radioss" @change="radiotop" :disabled="radiobtntop">
            <el-radio label="1">电子归档</el-radio>
            <el-radio label="2">纸质归档</el-radio>
            <el-radio label="3">其他归档</el-radio>
          </el-radio-group>
          <i class="el-icon-warning" v-if="iconArry.icons6.warning"></i>
          <i class="el-icon-success" v-if="iconArry.icons6.success"></i>
        </el-form-item>
      </div>
      <el-form-item label="任务单 :" size="mini">
        <p>任务单.docx</p>
      </el-form-item>

      <el-tabs v-model="activeName" type="card" v-if="isflase">
        <div class="spans">
          <span v-for="(item,i) in tableData2" :key="i" @click="btnpane(i)" :class="i === xb ? 'active' : ''">{{item.itemsCode}}</span>
        </div>
        <!-- <el-tab-pane :label="item.itemsCode" :name="i.toString()" v-for="(item,i) in tableData2" :key="i"  :before-leave="btnpane()">
        </el-tab-pane> -->
        <el-form-item label="当前状态 :" size="mini" style="background:#eee;padding:5px 0;fontSize:22px;fontWeight:bold;">
          <template>
            <span style="fontSize:14px;fontWeight:normal;">{{onead}}</span>
          </template>
        </el-form-item>
        <el-form-item label="试验报告 :" size="mini">
          <div class="bao" style="display:inline-block;padding:0;border:0;">实验报告.docx</div>
          <p style="display:inline-block;margin-right:20px;">是否纸质归档</p>
          <el-radio-group v-model="radiox" @change="radiobot" :disabled="radiobtnbot">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <div>
          <!-- 样品登记表 -->
          <div class="mmm">
            <el-form-item label="样品登记表 :" size="mini" :inline="true">
              <div class="div1"></div>

              <el-upload
                :disabled="radiobtn"
                style="width:10%;display:inline-block;"
                class="upload-demo"
                action="1"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :before-upload="beforeUpload"
                multiple
                :limit="100"
                :on-exceed="handleExceed"
                :file-list="fileList">
                <el-button size="small" type="primary" :disabled="radiobtn">点击上传</el-button>
              </el-upload>

              <el-radio-group v-model="radio" @change="radioA" :disabled="radiobtnbot">
                <el-radio label="1">电子归档</el-radio>
                <el-radio label="2">纸质归档</el-radio>
                <el-radio label="3">其他归档</el-radio>
                <el-radio label="4">无</el-radio>
              </el-radio-group>
              <i class="el-icon-warning" v-if="iconArry.icons1.warning"></i>
              <i class="el-icon-success" v-if="iconArry.icons1.success"></i>
            </el-form-item>
          </div>
          <!-- 样品照片 -->
          <div class="sample">
            <el-form-item label="样品照片 :" size="mini" :inline="true">
              <div class="div2"></div>

              <el-upload
                :disabled="radiobtn1"
                style="width:10%;display:inline-block;"
                class="upload-demo"
                action="1"
                :on-preview="handlePreview2"
                :on-remove="handleRemove2"
                :before-remove="beforeRemove2"
                :before-upload="beforeUpload2"
                multiple
                :limit="100"
                :on-exceed="handleExceed2"
                :file-list="fileList2">
                <el-button size="small" type="primary" :disabled="radiobtn1">点击上传</el-button>
              </el-upload>

              <el-radio-group v-model="radio1" @change="radioB" :disabled="radiobtnbot">
                <el-radio label="1">电子归档</el-radio>
                <el-radio label="2">纸质归档</el-radio>
                <el-radio label="3">其他归档</el-radio>
                <el-radio label="4">无</el-radio>
              </el-radio-group>
              <i class="el-icon-warning" v-if="iconArry.icons2.warning"></i>
              <i class="el-icon-success" v-if="iconArry.icons2.success"></i>
            </el-form-item>
          </div>
          <!-- 试验过程照片 -->
          <div class="experiment">
            <el-form-item label="试验过程照片 :" size="mini" :inline="true">
              <div class="div3"></div>

              <el-upload
                :disabled="radiobtn2"
                style="width:10%;display:inline-block;"
                class="upload-demo"
                action="1"
                :on-preview="handlePreview3"
                :on-remove="handleRemove3"
                :before-remove="beforeRemove3"
                :before-upload="beforeUpload3"
                multiple
                :limit="100"
                :on-exceed="handleExceed3"
                :file-list="fileList3">
                <el-button size="small" type="primary" :disabled="radiobtn2">点击上传</el-button>
              </el-upload>

              <el-radio-group v-model="radio2" @change="radioC" :disabled="radiobtnbot">
                <el-radio label="1">电子归档</el-radio>
                <el-radio label="2">纸质归档</el-radio>
                <el-radio label="3">其他归档</el-radio>
                <el-radio label="4">无</el-radio>
              </el-radio-group>
              <i class="el-icon-warning" v-if="iconArry.icons3.warning"></i>
              <i class="el-icon-success" v-if="iconArry.icons3.success"></i>
            </el-form-item>
          </div>
          <!-- 原始记录 -->
          <div class="original">
            <el-form-item label="原始记录 :" size="mini" :inline="true">
              <div class="div4"></div>

              <el-upload
                :disabled="radiobtn3"
                style="width:10%;display:inline-block;"
                class="upload-demo"
                action="1"
                :on-preview="handlePreview4"
                :on-remove="handleRemove4"
                :before-remove="beforeRemove4"
                :before-upload="beforeUpload4"
                multiple
                :limit="100"
                :on-exceed="handleExceed4"
                :file-list="fileList4">
                <el-button size="small" type="primary" :disabled="radiobtn3">点击上传</el-button>
              </el-upload>

              <el-radio-group v-model="radio3" @change="radioD" :disabled="radiobtnbot">
                <el-radio label="1">电子归档</el-radio>
                <el-radio label="2">纸质归档</el-radio>
                <el-radio label="3">其他归档</el-radio>
                <el-radio label="4">无</el-radio>
              </el-radio-group>
              <i class="el-icon-warning" v-if="iconArry.icons4.warning"></i>
              <i class="el-icon-success" v-if="iconArry.icons4.success"></i>
            </el-form-item>
          </div>
          <!-- 其他文件 -->
          <div class="other">
            <el-form-item label="其他文件 :" size="mini" :inline="true">
              <div class="div5"></div>

              <el-upload
                :disabled="radiobtn4"
                style="width:10%;display:inline-block;"
                class="upload-demo"
                action="1"
                :on-preview="handlePreview5"
                :on-remove="handleRemove5"
                :before-remove="beforeRemove5"
                :before-upload="beforeUpload5"
                multiple
                :limit="100"
                :on-exceed="handleExceed5"
                :file-list="fileList5">
                <el-button size="small" type="primary" :disabled="radiobtn4">点击上传</el-button>
              </el-upload>

              <el-radio-group v-model="radio4" @change="radioE" :disabled="radiobtnbot">
                <el-radio label="1">电子归档</el-radio>
                <el-radio label="2">纸质归档</el-radio>
                <el-radio label="3">其他归档</el-radio>
                <el-radio label="4">无</el-radio>
              </el-radio-group>
              <i class="el-icon-warning" v-if="iconArry.icons5.warning"></i>
              <i class="el-icon-success" v-if="iconArry.icons5.success"></i>
            </el-form-item>
          </div>
        </div>
      </el-tabs>

      <div v-else style="textAlign:center;paddingBottom:50px;border-top: 1px solid #E4E7ED;">
        <ul>
          <li><img src="static/image/noData2.png" alt="暂无数据"></li>
          <li style="fontSize: 18px">暂无数据</li>
        </ul>
      </div>

      <div style="width:100%;textAlign:center;">
        <el-button @click="previous()" :disabled="previ" v-if="isflase">上一页</el-button>
        <el-button @click="nexts()" :disabled="next" v-if="isflase">下一页</el-button>
        <el-button @click="parma('1')" v-if="parmaIsShow" :disabled="Isparma">提交归档</el-button>
        <el-button @click="Confrimlzy('1')" v-if="istrue">提交归档</el-button>
        <el-button @click="parmaDraft('2')" v-if="parmaIsShowDraft" :disabled="Isparma">保存草稿</el-button>
        <el-button @click="ConfrimlzyDraft('2')" v-if="istrueDraft">保存草稿</el-button>
      </div>
    </el-form>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :modal-append-to-body="false"
      :modal="false"
      style="background:rgba(0,0,0,0.4);"
    >
      <span>该页面已被操作，是否放弃提交归档/重新提交归档</span>
      <span slot="footer" class="dialog-footer" v-if="showdilog">
            <el-button @click="dialogVisible = false;loading=false">取 消</el-button>
            <el-button type="primary" @click="dialogque">确 定</el-button>
        </span>
      <span slot="footer" class="dialog-footer" v-if="showdilog1">
            <el-button @click="dialogVisible = false;loading=false">取 消</el-button>
            <el-button type="primary" @click="dialogques">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibles"
      width="30%"
      :modal-append-to-body="false"
      :modal="false"
      style="background:rgba(0,0,0,.4);"
    >
      <span>该页面已被操作，是否放弃提交归档/重新提交归档</span>
      <span slot="footer" class="dialog-footer" v-if="showdilog2">
            <el-button @click="dialogVisibles = false;loading=false">取 消</el-button>
            <el-button type="primary" @click="dialogquess">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  var m = 0;
  var n = 0;
  export default {
    name: 'Archive',
    props: ['tableData2', 'renwu', 'dialogTableVisible', 'rows', 'permissions', 'tit', 'bysdj', 'lengtharr', 'lzyobj'],
    components: {},
    data() {
      return {
        isflase: true,
        istrue: true,
        istrueDraft: true,
        proid: 0,
        showdilog: false,
        showdilog1: false,
        showdilog2: false,
        dialogVisible: false,
        dialogVisibles: false,
        change_number: 0,//监听
        parmaIsShow: true,
        parmaIsShowDraft: true,
        Isparma: true,
        onead: '',
        fileList: [],
        fileList2: [],
        fileList3: [],
        fileList4: [],
        fileList5: [],
        fileList6: [],
        showCity: {},
        formInline: {
          taskCode: '',
          companyCheck: '',
          sampleName: '',
          searchdate: '',
          sampleType: '',
          zjsign: '',
          itemscode: '',
          docStatus: '',
        },
        radiox: '1',
        radioss: '1',
        radio: '4', /*归档单选*/
        radio1: '4', /*归档单选*/
        radio2: '4', /*归档单选*/
        radio3: '4', /*归档单选*/
        radio4: '4', /*归档单选*/
        activeName: "0", /*归档内选项卡*/
        id: '',
        xb: 0,
        name: "",
        previ: false,
        next: false,
        radiobtn: true,
        radiobtn1: true,
        radiobtn2: true,
        radiobtn3: true,
        radiobtn4: true,
        radiobtntop: true,
        radiobtnbot: true,
        disd: true,
        isNum: false,
        iconArry: {
          icons1: {
            warning: false,
            success: false
          },
          icons2: {
            warning: false,
            success: false
          },
          icons3: {
            warning: false,
            success: false
          },
          icons4: {
            warning: false,
            success: false
          },
          icons5: {
            warning: false,
            success: false
          },
          icons6: {
            warning: false,
            success: false
          }
        },
        loading: false,
      }

    },
    computed: {},
    mounted() {
      this.public()
    },
    watch: {
      docData: {
        handler(newVal) {
          this.change_number++
        },
        deep: true
      }
    },
    methods: {
      initlzy() {
        if(this.permissions == 0){
          this.disd = true;
          if (this.lzyobj.taskSheetStatus == null || this.lzyobj.taskSheetStatus == "1") { 
            this.radioss = '1'
          }else{
            this.radioss = JSON.stringify(this.lzyobj.taskSheetStatus)
          }
        }else{
          if (this.lzyobj.taskSheetStatus == null || this.lzyobj.taskSheetStatus == "1") {
            this.radioss = '1'
            this.disd = false;
          } else {
            this.radioss = JSON.stringify(this.lzyobj.taskSheetStatus)
            this.disd = true
          }
        }
        if (this.lzyobj.taskSheet) {
          console.log(this.lzyobj, 'this.lzyobj390');
          if(this.lzyobj.taskSheetFile){
            this.fileList6.push({name: this.lzyobj.taskSheetFile.fileName + '.' + this.lzyobj.taskSheetFile.fileType, id: this.lzyobj.taskSheetFile.fileId})
          }
          
          let divone6 = document.querySelector(".div6");
          let uploadLlist6 = document.querySelector(".enterprise .el-upload-list");
          uploadLlist6 ? uploadLlist6.style.width = divone6.offsetWidth + 'px' : '';
        }
      },
      //列表无数据的时候
      Confrimlzy(state) {
        let params = {
          taskSheetStatus: this.radioss,
          taskId: this.rows.id,   //任务id
          taskSheet: this.strs(this.fileList6),
          submitType: state
        }
        if (this.fileList6.length == 0 && this.radioss == 1) {
          this.iconArry.icons6.warning = true;
          this.iconArry.icons6.success = false;
        } else if (this.radioss != 1) {
          this.iconArry.icons6.warning = false;
          this.iconArry.icons6.success = false
        } else {
          this.iconArry.icons6.warning = false;
          this.iconArry.icons6.success = true
        }
        if (this.radioss == 1 && this.fileList6.length != 0) {
          m++;
        }
        if (this.radioss == 1) {
          n++;
        }
        if (m != n) {
          this.$alert('请上传所有信息', {
            dangerouslyUseHTMLString: true
          });
          m = 0;
          n = 0;
          return;
        }
        this.$api.taskmanage.submitGd(params).then(res => {
          if (res.data.respCode == '0') {
            this.$alert(res.data.message, {
              dangerouslyUseHTMLString: true
            });
            this.lzyobj = res.data.data;
            this.fileList6 = []
            this.initlzy()
            this.iconArry.icons6.warning = false;
            this.iconArry.icons6.success = true;
          }
        }).catch(error => {
          this.$alert(error.data.message, {
            dangerouslyUseHTMLString: true
          });
          this.iconArry.icons6.warning = true;
          this.iconArry.icons6.success = false
        })
      },
      // 保存草稿-列表无数据时
      ConfrimlzyDraft(state) {
        let params = {
          taskSheetStatus: this.radioss,
          taskId: this.rows.id,   //任务id
          taskSheet: this.strs(this.fileList6),
          submitType: state
        }
        this.$api.taskmanage.submitGd(params).then(res => {
          if (res.data.respCode == '0') {
            this.$alert(res.data.message, {
              dangerouslyUseHTMLString: true
            });
            this.lzyobj = res.data.data
            this.fileList6 = []
            this.initlzy()
            this.iconArry.icons6.warning = false;
            this.iconArry.icons6.success = true;
          }
        }).catch(error => {
          this.$alert(error.data.message, {
            dangerouslyUseHTMLString: true
          });
          this.iconArry.icons6.warning = true;
          this.iconArry.icons6.success = false
        })
      },
      //监听数据变化  切换下一页 -- 上一页
      //提交归档
      list(parms) {
        let listpu = ''
        if (parms.length == 0) {
          return listpu
        } else {
          parms.map(item => {
            listpu += item.id + ',';
          });
          listpu = listpu.substring(0, listpu.length-1);
          return listpu
        }
      },
      strs(params) {
        let strlist;
        if (params.length == 0) {
          strlist = null
        } else {
          strlist = params[0].id
        }
        return strlist
      },
      clearState() {
        this.iconArry.icons1.warning = false;
        this.iconArry.icons1.success = false;
        this.iconArry.icons2.warning = false;
        this.iconArry.icons2.success = false;
        this.iconArry.icons3.warning = false;
        this.iconArry.icons3.success = false;
        this.iconArry.icons4.warning = false;
        this.iconArry.icons4.success = false;
        this.iconArry.icons5.warning = false;
        this.iconArry.icons5.success = false;
        this.iconArry.icons6.warning = false;
        this.iconArry.icons6.success = false;
      },
      parma(state) {

        let params = {
          taskSheetStatus: this.radioss,  //企业委托单状态  1电子归档 2纸质归档 3其他归档 4 无
          taskContentId: this.id,          //任务报告id(主键，唯一)
          testReportStatus: this.radiox,       //试验报告，是否为纸质归档 0 否 1是

          sampleRegistrationStatus: this.radio,    //样品登记表状态  1电子归档 2纸质归档 3其他归档 4 无
          samplePicStatus: this.radio1,  //样品照片状态  1电子归档 2纸质归档 3其他归档 4 无
          processPicStatus: this.radio2, //过程照片状态  1电子归档 2纸质归档 3其他归档 4 无
          originalRecordStatus: this.radio3,     //原始记录表状态  1电子归档 2纸质归档 3其他归档 4 无
          otherFilesStatus: this.radio4,     //其他文件状态  1电子归档 2纸质归档 3其他归档 4 无


          sampleRegistration: this.list(this.fileList),       //样品登记表上传的文件信息，数组类型，
          samplePic: this.list(this.fileList2),     //样品照片上传的文件信息，数组类型，
          processPic: this.list(this.fileList3),    //过程照片上传的文件信息，数组类型，
          originalRecord: this.list(this.fileList4),   //原始文件表上传的文件信息，数组类型，
          otherFiles: this.list(this.fileList5),   //其他文件上传的文件信息，数组类型，下面有字符串类型
          taskId: this.rows.id,   //任务id
          taskSheet: this.strs(this.fileList6),
          submitType: state
        }


        if (this.bysdj == '1') {
          if (this.fileList6.length == 0 && this.radioss == 1) {
            this.iconArry.icons6.warning = true;
            this.iconArry.icons6.success = false;
          } else if (this.radioss != 1) {
            this.iconArry.icons6.warning = false;
            this.iconArry.icons6.success = false
          } else {
            this.iconArry.icons6.warning = false;
            this.iconArry.icons6.success = true
          }
          if (this.radioss == 1 && this.fileList6.length != 0) {
            m++;
          }
          if (this.radioss == 1) {
            n++;
          }
        } else {

          //我的报告页面
          if (this.permissions == 1 || this.permissions == 3) {
            //判断企业委托单上传的文件信息是否存在
            if (this.fileList6.length == 0 && this.radioss == 1) {
              this.iconArry.icons6.warning = true;
              this.iconArry.icons6.success = false;
            } else if (this.radioss != 1) {
              this.iconArry.icons6.warning = false;
              this.iconArry.icons6.success = false
            } else {
              this.iconArry.icons6.warning = false;
              this.iconArry.icons6.success = true
            }
            if (this.radioss == 1 && this.fileList6.length != 0) {
              m++;
            }
            if (this.radioss == 1) {
              n++;
            }

            this.puilust()
          } else {
            this.puilust()
          }
        }
        if (m != n) {
          this.$alert('请上传所有信息', {
            dangerouslyUseHTMLString: true
          });
          m = 0;
          n = 0;
          return;
        }

        this.$api.taskmanage.submitGd(params).then(res => {
          this.$alert(res.data.message, {
            dangerouslyUseHTMLString: true
          });
          this.fileList = [],
            this.fileList2 = [],
            this.fileList3 = [],
            this.fileList4 = [],
            this.fileList5 = [],
            this.fileList6 = [],

            this.showCitys();
          this.change_number = 0
        }).catch(error => {
          this.$alert(error.data.message, {
            dangerouslyUseHTMLString: true
          });
        })
      },
      // 保存草稿
      parmaDraft(state) {
        let params = {
          taskSheetStatus: this.radioss,  //企业委托单状态  1电子归档 2纸质归档 3其他归档 4 无
          taskContentId: this.id,          //任务报告id(主键，唯一)
          testReportStatus: this.radiox,       //试验报告，是否为纸质归档 0 否 1是

          sampleRegistrationStatus: this.radio,    //样品登记表状态  1电子归档 2纸质归档 3其他归档 4 无
          samplePicStatus: this.radio1,  //样品照片状态  1电子归档 2纸质归档 3其他归档 4 无
          processPicStatus: this.radio2, //过程照片状态  1电子归档 2纸质归档 3其他归档 4 无
          originalRecordStatus: this.radio3,     //原始记录表状态  1电子归档 2纸质归档 3其他归档 4 无
          otherFilesStatus: this.radio4,     //其他文件状态  1电子归档 2纸质归档 3其他归档 4 无


          sampleRegistration: this.list(this.fileList),       //样品登记表上传的文件信息，数组类型，
          samplePic: this.list(this.fileList2),     //样品照片上传的文件信息，数组类型，
          processPic: this.list(this.fileList3),    //过程照片上传的文件信息，数组类型，
          originalRecord: this.list(this.fileList4),   //原始文件表上传的文件信息，数组类型，
          otherFiles: this.list(this.fileList5),   //其他文件上传的文件信息，数组类型，下面有字符串类型
          taskId: this.rows.id,   //任务id
          taskSheet: this.strs(this.fileList6),
          submitType: state
        }
        this.$api.taskmanage.submitGd(params).then(res => {
          this.$alert(res.data.message, {
            dangerouslyUseHTMLString: true
          });
          this.fileList = [],
            this.fileList2 = [],
            this.fileList3 = [],
            this.fileList4 = [],
            this.fileList5 = [],
            this.fileList6 = [],

            this.showCitys()
            this.iconArry.icons1.warning = false;
            this.iconArry.icons1.success = true;
            this.iconArry.icons2.warning = false;
            this.iconArry.icons2.success = true;
            this.iconArry.icons3.warning = false;
            this.iconArry.icons3.success = true;
            this.iconArry.icons4.warning = false;
            this.iconArry.icons4.success = true;
            this.iconArry.icons5.warning = false;
            this.iconArry.icons5.success = true;
            this.iconArry.icons6.warning = false;
            this.iconArry.icons6.success = true;
          this.change_number = 0
        }).catch(error => {
          this.$alert(error.data.message, {
            dangerouslyUseHTMLString: true
          });
        })
      },
      puilust() {
        if (this.fileList.length == 0 && this.radio == 1) {
          this.iconArry.icons1.warning = true;
          this.iconArry.icons1.success = false;
        } else if (this.radio != 1) {
          this.iconArry.icons1.warning = false;
          this.iconArry.icons1.success = false
        } else {
          this.iconArry.icons1.warning = false;
          this.iconArry.icons1.success = true
        }
        //判断样品照片上传的文件信息是否存在
        if (this.fileList2.length == 0 && this.radio1 == 1) {
          this.iconArry.icons2.warning = true;
          this.iconArry.icons2.success = false;
        } else if (this.radio1 != 1) {
          this.iconArry.icons2.warning = false;
          this.iconArry.icons2.success = false
        } else {
          this.iconArry.icons2.warning = false;
          this.iconArry.icons2.success = true
        }
        //判断过程照片上传的文件信息是否存在
        if (this.fileList3.length == 0 && this.radio2 == 1) {
          this.iconArry.icons3.warning = true;
          this.iconArry.icons3.success = false;
        } else if (this.radio2 != 1) {
          this.iconArry.icons3.warning = false;
          this.iconArry.icons3.success = false
        } else {
          this.iconArry.icons3.warning = false;
          this.iconArry.icons3.success = true
        }
        //判断原始文件表上传的文件信息是否存在
        if (this.fileList4.length == 0 && this.radio3 == 1) {
          this.iconArry.icons4.warning = true;
          this.iconArry.icons4.success = false;
        } else if (this.radio3 != 1) {
          this.iconArry.icons4.warning = false;
          this.iconArry.icons4.success = false
        } else {
          this.iconArry.icons4.warning = false;
          this.iconArry.icons4.success = true
        }
        //判断其他文件上传的文件信息是否存在
        if (this.fileList5.length == 0 && this.radio4 == 1) {
          this.iconArry.icons5.warning = true;
          this.iconArry.icons5.success = false;
        } else if (this.radio4 != 1) {
          this.iconArry.icons5.warning = false;
          this.iconArry.icons5.success = false
        } else {
          this.iconArry.icons5.warning = false;
          this.iconArry.icons5.success = true
        }

        if (this.radio == 1 && this.fileList.length != 0) {
          m++;
        }
        if (this.radio1 == 1 && this.fileList2.length != 0) {
          m++;
        }
        if (this.radio2 == 1 && this.fileList3.length != 0) {
          m++;
        }
        if (this.radio3 == 1 && this.fileList4.length != 0) {
          m++;
        }
        if (this.radio4 == 1 && this.fileList5.length != 0) {
          m++;
        }

        if (this.radio == 1) {
          n++;
        }
        if (this.radio1 == 1) {
          n++;
        }
        if (this.radio2 == 1) {
          n++;
        }
        if (this.radio3 == 1) {
          n++;
        }
        if (this.radio4 == 1) {
          n++;
        }
      },

      // 切换时-保存数据
      saveData(state, num) {
        // this.loading = true;
        let params = {
          taskSheetStatus: this.radioss,  //企业委托单状态  1电子归档 2纸质归档 3其他归档 4 无
          taskContentId: this.id,          //任务报告id(主键，唯一)
          testReportStatus: this.radiox,       //试验报告，是否为纸质归档 0 否 1是

          sampleRegistrationStatus: this.radio,    //样品登记表状态  1电子归档 2纸质归档 3其他归档 4 无
          samplePicStatus: this.radio1,  //样品照片状态  1电子归档 2纸质归档 3其他归档 4 无
          processPicStatus: this.radio2, //过程照片状态  1电子归档 2纸质归档 3其他归档 4 无
          originalRecordStatus: this.radio3,     //原始记录表状态  1电子归档 2纸质归档 3其他归档 4 无
          otherFilesStatus: this.radio4,     //其他文件状态  1电子归档 2纸质归档 3其他归档 4 无


          sampleRegistration: this.list(this.fileList),       //样品登记表上传的文件信息，数组类型，
          samplePic: this.list(this.fileList2),     //样品照片上传的文件信息，数组类型，
          processPic: this.list(this.fileList3),    //过程照片上传的文件信息，数组类型，
          originalRecord: this.list(this.fileList4),   //原始文件表上传的文件信息，数组类型，
          otherFiles: this.list(this.fileList5),   //其他文件上传的文件信息，数组类型，下面有字符串类型
          taskId: this.rows.id,   //任务id
          taskSheet: this.strs(this.fileList6),
          submitType: state
        }
        this.$api.taskmanage.submitGd(params).then(res => {
          this.loading = false;
          // this.$message.success(res.data.message);
          this.fileList = [],
          this.fileList2 = [],
          this.fileList3 = [],
          this.fileList4 = [],
          this.fileList5 = [],
          this.fileList6 = [],
          this.showCitys(num);
          this.change_number = 0;
          // this.iconArry.icons1.warning = false;
          // this.iconArry.icons1.success = true;
          // this.iconArry.icons2.warning = false;
          // this.iconArry.icons2.success = true;
          // this.iconArry.icons3.warning = false;
          // this.iconArry.icons3.success = true;
          // this.iconArry.icons4.warning = false;
          // this.iconArry.icons4.success = true;
          // this.iconArry.icons5.warning = false;
          // this.iconArry.icons5.success = true;
          // this.iconArry.icons6.warning = false;
          // this.iconArry.icons6.success = true;
        }).catch(error => {
          this.loading = false;
          this.$message.error(error.data.message);
        });
      },
      btnpane(i) {
        let numbers = this.tableData2.length - 1;
        if (i === numbers * 1) {
          this.next = true;
          this.previ = false;
        } else if (i === 0) {
          this.next = false;
          this.previ = true;
        } else {
          this.next = false;
          this.previ = false;
        }
        this.showdilog2 = true;
        this.showdilog = false;
        this.showdilog1 = false;
        this.proid = i;
        this.saveData('2');
        this.dialogquess();
        // if (this.change_number != 0) {
        //   this.dialogVisibles = true
        // } else {
        //   this.dialogquess()
        // }
      },
      dialogquess(e) {
        // this.loading = true;
        this.xb = this.proid
        this.fileList = []
        this.fileList2 = []
        this.fileList3 = []
        this.fileList4 = []
        this.fileList5 = []
        // this.fileList6 = []
        this.id = this.tableData2[this.xb].id
        this.showCitys(1);
        this.change_number = 0
        this.dialogVisibles = false;
        this.$api.taskmanage.TaskReport(this.id).then(res => {
          this.citys = res.data.data;
          //实验报告
            if (this.citys.testReportStatus == null || this.citys.testReportStatus == "1") {
              this.radiox = '1'
            } else {
              this.radiox = JSON.stringify(this.citys.testReportStatus)
            }
            //样品登记表
            if (this.citys.sampleRegistrationStatus == null || this.citys.sampleRegistrationStatus == "1") {
              this.radio = '4'
              this.bysdj == '1' ? this.radiobtn = true : this.radiobtn = false;
            } else {
              this.radio = JSON.stringify(this.citys.sampleRegistrationStatus)
              this.radiobtn = true
            }
            //样品照片
            if (this.citys.samplePicStatus == null || this.citys.samplePicStatus == "1") {
              this.radio1 = '4'
              this.bysdj == '1'? this.radiobtn1 = true : this.radiobtn1 = false;
            } else {
              this.radio1 = JSON.stringify(this.citys.samplePicStatus)
              this.radiobtn1 = true
            }
            //过程照片确认
            if (this.citys.processPicStatus == null || this.citys.processPicStatus == "1") {
              this.radio2 = '4'
              this.bysdj == '1'? this.radiobtn2 = true : this.radiobtn2 = false
            } else {
              this.radio2 = JSON.stringify(this.citys.processPicStatus)
              this.radiobtn2 = true
            }
            //原始记录确认
            if (this.citys.originalRecordStatus == null || this.citys.originalRecordStatus == "1") {
              this.radio3 = '4'
              this.bysdj == '1'? this.radiobtn3 = true : this.radiobtn3 = false
            } else {
              this.radio3 = JSON.stringify(this.citys.originalRecordStatus)
              this.radiobtn3 = true
            }
            //其他文件确认
            if (this.citys.otherFilesStatus == null || this.citys.otherFilesStatus == "1") {
              this.radio4 = '4'
              this.bysdj == '1'? this.radiobtn4 = true : this.radiobtn4 = false
            } else {
              this.radio4 = JSON.stringify(this.citys.otherFilesStatus)
              this.radiobtn4 = true
            }
            if(this.citys){
              this.loading = false;
              this.iconArry.icons1.warning = false;
              this.iconArry.icons1.success = false;
              this.iconArry.icons2.warning = false;
              this.iconArry.icons2.success = false;
              this.iconArry.icons3.warning = false;
              this.iconArry.icons3.success = false;
              this.iconArry.icons4.warning = false;
              this.iconArry.icons4.success = false;
              this.iconArry.icons5.warning = false;
              this.iconArry.icons5.success = false;
              this.iconArry.icons6.warning = false;
              this.iconArry.icons6.success = false;
            }
        });
      },
      radioA(value) {
        this.radio = value
        this.change_number++
        if (this.radio != '1') {
          this.radiobtn = true
        } else {
          this.radiobtn = false
        }
      },
      radioB(value) {
        this.radio1 = value
        this.change_number++
        if (this.radio1 != '1') {
          this.radiobtn1 = true
        } else {
          this.radiobtn1 = false
        }
      },
      radioC(value) {
        this.radio2 = value
        this.change_number++
        if (this.radio2 != '1') {
          this.radiobtn2 = true
        } else {
          this.radiobtn2 = false
        }
      },
      radioD(value) {
        this.radio3 = value
        this.change_number++
        if (this.radio3 != '1') {
          this.radiobtn3 = true
        } else {
          this.radiobtn3 = false
        }
      },
      radioE(value) {
        this.radio4 = value
        this.change_number++
        if (this.radio4 != '1') {
          this.radiobtn4 = true
        } else {
          this.radiobtn4 = false
        }
      },
      radiotop(value) {
        this.radioss = value
        if(this.permissions == 0){
          this.disd = true
        }else{
          if (this.radioss != '1') {
            this.disd = true
          } else {
            this.disd = false
          }
        }
      },
      radiobot(value) {
        this.radiox = value
        this.change_number++
      },
      par() {
        this.formInline.taskCode = this.renwu
        this.previ = true
        if (this.tableData2.length == 1) {
          this.previ = true
          this.next = true
        }
        if (this.lengtharr == '0') {
          this.isflase = false
          this.parmaIsShow = false
          this.parmaIsShowDraft = false
          this.istrue = true
          this.istrueDraft = true;
        } else {
          this.isflase = true
          this.parmaIsShow = true
          this.parmaIsShowDraft = true;
          this.istrue = false
          this.istrueDraft = false
          this.id = this.tableData2[0].id
        }
      },
      //共用方法
      public(b) {
        let bb = []
        let cc = []
        let dd = []
        let ee = []
        let ff = []
        if (this.citys && this.citys.otherFilesList) {
          let _height1 = 25;
          let _top1 = 10;
          ff = this.citys.otherFilesList
          ff.map(item => {
            this.fileList5.push({name: item.fileName+'.'+item.fileType, id: item.fileId})
          })
          let divone5 = document.querySelector(".div5");
          let uploadLlist5 = document.querySelector(".other .el-upload-list");
          divone5 ? divone5.style.height = this.citys.otherFilesList.length * (_height1 + _top1) + 'px' : '';
          uploadLlist5 ? uploadLlist5.style.width = divone5.offsetWidth + 'px' : '';
        } else {
          let _height1 = 25;
          let _top1 = 10;
          let divone5 = document.querySelector(".div5");
          divone5 ? divone5.style.height = (_height1 + _top1) + 'px' : '';
        }

        if (this.citys && this.citys.originalRecordList) {
          let _height1 = 25;
          let _top1 = 10;
          ee = this.citys.originalRecordList
          ee.map(item => {
            this.fileList4.push({name: item.fileName+'.'+item.fileType, id: item.fileId})
          })
          let divone4 = document.querySelector(".div4");
          let uploadLlist4 = document.querySelector(".original .el-upload-list");
          divone4 ? divone4.style.height = this.citys.originalRecordList.length * (_height1 + _top1) + 'px': '';
          uploadLlist4 ? uploadLlist4.style.width = divone4.offsetWidth + 'px' : '';
        } else {
          let _height1 = 25;
          let _top1 = 10;
          let divone4 = document.querySelector(".div4");
          divone4 ? divone4.style.height = (_height1 + _top1) + 'px' : '';
        }

        if (this.citys && this.citys.samplePicList) {
          let _height1 = 25;
          let _top1 = 10;
          cc = this.citys.samplePicList
          cc.map(item => {
            this.fileList2.push({name: item.fileName+'.'+item.fileType, id: item.fileId})
          })
          let divone2 = document.querySelector(".div2");
          let uploadLlist2 = document.querySelector(".sample .el-upload-list");
          divone2 ? divone2.style.height = this.citys.samplePicList.length * (_height1 + _top1) + 'px' : '';
          uploadLlist2 ? uploadLlist2.style.width = divone2.offsetWidth + 'px' : '';
        } else {
          let _height1 = 25;
          let _top1 = 10;
          let divone2 = document.querySelector(".div2");
          divone2 ? divone2.style.height = (_height1 + _top1) + 'px' : '';
        }

        if (this.citys && this.citys.processPicList) {
          let _height1 = 25;
          let _top1 = 10;
          dd = this.citys.processPicList
          dd.map(item => {
            this.fileList3.push({name: item.fileName+'.'+item.fileType, id: item.fileId})
          })
          let divone3 = document.querySelector(".div3");
          let uploadLlist3 = document.querySelector(".experiment .el-upload-list");
          divone3 ? divone3.style.height = this.citys.processPicList.length * (_height1 + _top1) + 'px' : '';
          uploadLlist3 ? uploadLlist3.style.width = divone3.offsetWidth + 'px' : '';
        } else {
          let _height1 = 25;
          let _top1 = 10;
          let divone3 = document.querySelector(".div3");
          divone3 ? divone3.style.height = (_height1 + _top1) + 'px' : '';
        }

        if (this.citys && this.citys.sampleRegistrationList) {
          let _height = 25;
          let _top = 10;
          bb = this.citys.sampleRegistrationList
          bb.map(item => {
            this.fileList.push({name: item.fileName+'.'+item.fileType, id: item.fileId})
          })
          let divone1 = document.querySelector(".div1");
          let uploadLlist1 = document.querySelector(".mmm .el-upload-list");

          divone1 ? divone1.style.height = this.citys.sampleRegistrationList.length * (_height + _top) + 'px' : '';

          uploadLlist1 ? uploadLlist1.style.width = divone1.offsetWidth + 'px' : '';
        } else {
          let _height1 = 25;
          let _top1 = 10;
          let divone1 = document.querySelector(".div1");
          divone1 ? divone1.style.height = (_height1 + _top1) + 'px' : '';
        }

        if (b != 1) {
          if (this.citys && this.citys.taskSheet) {
            let _height = 25;
            let _top = 10;
            // this.fileList6.push({name: this.citys.taskSheet})
            console.log(this.lzyobj, 'this.lzyobj');
            if(this.citys.taskSheetFile){
              this.fileList6.splice(0,1,{name: this.citys.taskSheetFile.fileName + '.' + this.citys.taskSheetFile.fileType, id: this.citys.taskSheetFile.fileId});
            }
            let divone6 = document.querySelector(".div6");
            let uploadLlist6 = document.querySelector(".enterprise .el-upload-list");
            uploadLlist6 ? uploadLlist6.style.width = divone6.offsetWidth + 'px' : '';
          }
        }
      },
      showCitys(a) {
        // this.loading = true;
        if (this.tit == 2) { //我的报告
          if (this.permissions == 1 || this.permissions == 3) {
            if (this.radioss == "1") {
              this.disd = false;
            } else {
              this.disd = true
            }
            this.radio == '1' ? this.radiobtn = false : this.radiobtn = true;
            this.radio1 == '1' ? this.radiobtn1 = false : this.radiobtn1 = true;
            this.radio2 == '1' ? this.radiobtn2 = false : this.radiobtn2 = true;
            this.radio3 == '1' ? this.radiobtn3 = false : this.radiobtn3 = true;
            this.radio4 == '1' ? this.radiobtn4 = false : this.radiobtn4 = true;
            this.radiobtntop = false
            this.radiobtnbot = false
          } else {
            this.disd = true
            this.radiobtntop = true
            this.radiobtnbot = false
            this.radio == '1' ? this.radiobtn = false : this.radiobtn = true;
            this.radio1 == '1' ? this.radiobtn1 = false : this.radiobtn1 = true;
            this.radio2 == '1' ? this.radiobtn2 = false : this.radiobtn2 = true;
            this.radio3 == '1' ? this.radiobtn3 = false : this.radiobtn3 = true;
            this.radio4 == '1' ? this.radiobtn4 = false : this.radiobtn4 = true;
          }
        } else {//报告归档
          this.parmaIsShowDraft = false;
          this.istrueDraft = false;
          if(this.radio == '1') {
            if (this.bysdj == '1') { 
              this.radiobtn = true
            }else{
              this.radiobtn = false
            }
          }else{
            this.radiobtn = true
          }
          if(this.radio1 == '1') {
            if (this.bysdj == '1') { 
              this.radiobtn1 = true
            }else{
              this.radiobtn1 = false
            }
          }else{
            this.radiobtn1 = true
          }
          if(this.radio2 == '1') {
            if (this.bysdj == '1') { 
              this.radiobtn2 = true
            }else{
              this.radiobtn2 = false
            }
          }else{
            this.radiobtn2 = true
          }
          if(this.radio3 == '1') {
            if (this.bysdj == '1') { 
              this.radiobtn3 = true
            }else{
              this.radiobtn3 = false
            }
          }else{
            this.radiobtn3 = true
          }
          if(this.radio4 == '1') {
            if (this.bysdj == '1') { 
              this.radiobtn4 = true
            }else{
              this.radiobtn4 = false
            }
          }else{
            this.radiobtn4 = true
          }
          if (this.bysdj == '1') {
            this.disd = false
            this.radiobtntop = false
            this.radiobtnbot = true
          } else {
            this.disd = true
            this.radiobtntop = true
            this.radiobtnbot = false
          }
        }
        if (!this.isNum) {
          this.lzy_init(a)
        } else {
          if (this.lengtharr == '0') {
            return
          }
          this.$api.taskmanage.TaskReport(this.id).then(res => {
            this.loading = false;
            this.citys = res.data.data;
            if(this.citys){
              this.loading = false;
            }
            if (this.citys.docStatus == '1') {
              this.onead = '已归档'
            } else if (this.citys.docStatus == '-1') {
              this.onead = '已提交归档'
            } else {
              this.onead = '未提交归档'
            }
            if (this.onead == '已归档') {
              this.Isparma = true
            } else {
              this.Isparma = false
            }
            if (this.bysdj != '1') {
              if (this.change_number != 0) {
                this.radioA(this.radio);
                this.radioB(this.radio1);
                this.radioC(this.radio2);
                this.radioD(this.radio3);
                this.radioE(this.radio4);
              }
            }
            let b = a
            this.public(a)
          });
        }

      },

      lzy_init(a) { //初始化 单选
        if (this.lengtharr == '0') {
          return
        }
        this.$api.taskmanage.TaskReport(this.id).then(res => {
          this.citys = res.data.data;
          if(this.citys){
            this.loading = false;
          }
          this.public(a)
          if (this.citys.docStatus == '1') {
            this.onead = '已归档'
          } else if (this.citys.docStatus == '-1') {
            this.onead = '已提交归档'
          } else {
            this.onead = '未提交归档'
          }
          if (this.onead == '已归档') {
            this.Isparma = true
          } else {
            this.Isparma = false
          }

          if (this.bysdj == '1') {
            //企业委托单
            if(this.permissions == 0) {
              this.disd = true
            }else{
              if (this.citys.taskSheetStatus == null || this.citys.taskSheetStatus == "1") {
                this.radioss = '1'
                this.disd = false;
              } else {
                this.radioss = JSON.stringify(this.citys.taskSheetStatus)
                this.disd = true
              }
            }
            //实验报告
            if (this.citys.testReportStatus == null || this.citys.testReportStatus == "1") {
              this.radiox = '1'
            } else {
              this.radiox = JSON.stringify(this.citys.testReportStatus)
            }
            //样品登记表
            if (this.citys.sampleRegistrationStatus == null || this.citys.sampleRegistrationStatus == "1") {
              this.radio = '4'
              this.bysdj == '1' ? this.radiobtn = true : this.radiobtn = false;
            } else {
              this.radio = JSON.stringify(this.citys.sampleRegistrationStatus)
              this.radiobtn = true
            }
            //样品照片
            if (this.citys.samplePicStatus == null || this.citys.samplePicStatus == "1") {
              this.radio1 = '4'
              this.bysdj == '1'? this.radiobtn1 = true : this.radiobtn1 = false;
            } else {
              this.radio1 = JSON.stringify(this.citys.samplePicStatus)
              this.radiobtn1 = true
            }
            //过程照片确认
            if (this.citys.processPicStatus == null || this.citys.processPicStatus == "1") {
              this.radio2 = '4'
              this.bysdj == '1'? this.radiobtn2 = true : this.radiobtn2 = false
            } else {
              this.radio2 = JSON.stringify(this.citys.processPicStatus)
              this.radiobtn2 = true
            }
            //原始记录确认
            if (this.citys.originalRecordStatus == null || this.citys.originalRecordStatus == "1") {
              this.radio3 = '4'
              this.bysdj == '1'? this.radiobtn3 = true : this.radiobtn3 = false
            } else {
              this.radio3 = JSON.stringify(this.citys.originalRecordStatus)
              this.radiobtn3 = true
            }
            //其他文件确认
            if (this.citys.otherFilesStatus == null || this.citys.otherFilesStatus == "1") {
              this.radio4 = '4'
              this.bysdj == '1'? this.radiobtn4 = true : this.radiobtn4 = false
            } else {
              this.radio4 = JSON.stringify(this.citys.otherFilesStatus)
              this.radiobtn4 = true
            }
          } else {
            //企业委托单
            if(this.permissions == 0) {
              this.disd = true
            }else{
              if (this.citys.taskSheetStatus == null || this.citys.taskSheetStatus == "1") {
                this.radioss = '1'
                this.disd = false;
              } else {
                this.radioss = JSON.stringify(this.citys.taskSheetStatus)
                this.disd = true
              }
            }
            //实验报告
            if (this.citys.testReportStatus == null || this.citys.testReportStatus == "1") {
              this.radiox = '1'
            } else {
              this.radiox = JSON.stringify(this.citys.testReportStatus)
            }
            //样品登记表
            if (this.citys.sampleRegistrationStatus == null || this.citys.sampleRegistrationStatus == "1") {
              this.radio = '4'
              this.radiobtn = false
            } else {
              this.radio = JSON.stringify(this.citys.sampleRegistrationStatus)
              this.radiobtn = true
            }
            //样品照片
            if (this.citys.samplePicStatus == null || this.citys.samplePicStatus == "1") {
              this.radio1 = '4'
              this.radiobtn1 = false
            } else {
              this.radio1 = JSON.stringify(this.citys.samplePicStatus)
              this.radiobtn1 = true
            }
            //过程照片确认
            if (this.citys.processPicStatus == null || this.citys.processPicStatus == "1") {
              this.radio2 = '4'
              this.radiobtn2 = false
            } else {
              this.radio2 = JSON.stringify(this.citys.processPicStatus)
              this.radiobtn2 = true
            }
            //原始记录确认
            if (this.citys.originalRecordStatus == null || this.citys.originalRecordStatus == "1") {
              this.radio3 = '4'
              this.radiobtn3 = false
            } else {
              this.radio3 = JSON.stringify(this.citys.originalRecordStatus)
              this.radiobtn3 = true
            }
            //其他文件确认
            if (this.citys.otherFilesStatus == null || this.citys.otherFilesStatus == "1") {
              this.radio4 = '4'
              this.radiobtn4 = false
            } else {
              this.radio4 = JSON.stringify(this.citys.otherFilesStatus)
              this.radiobtn4 = true
            }
          }
        })
      },

      // 上一页
      previous() {
        this.showdilog1 = true;
        this.showdilog2 = false;
        this.showdilog = false;
        this.saveData('2',1);
        this.dialogques();
        // if (this.change_number != 0) {
        //   this.dialogVisible = true;
        // } else {
        //   this.dialogques();
        // }
      },
      //上一页确认
      dialogques() {
        let i = this.xb * 1;
        if (i - 1 === 0) {
          this.next = false;
          this.previ = true;
        } else {
          this.next = false;
          this.previ = false;
        }
        if (i > 0) {
          this.id = this.tableData2[i - 1].id;
          i - 1;
          this.xb = this.xb - 1;
          this.activeName = JSON.stringify(Number(this.activeName - 1));
          this.fileList = [];
          this.fileList2 = [];
          this.fileList3 = [];
          this.fileList4 = [];
          this.fileList5 = [];
          // this.fileList6 = []
          // this.showCitys(1);
          if (this.onead == '已归档') {
            this.Isparma = true;
          } else {
            this.Isparma = false;
          }
          this.change_number = 0;
        } else {
          this.xb = 0;
        }
        this.clearState();
        // this.dialogVisible = false;
      },
      //下一页
      dialogque() {
        this.change_number = 0;
        let i = this.xb * 1
        let num = 1
        let strnum = Number(this.activeName) + num
        if (i + 1 === this.tableData2.length - 1) {
          this.next = true
          this.previ = false
        } else {
          this.next = false
          this.previ = false
        }
        if (i < this.tableData2.length - 1) {
          this.id = this.tableData2[i + 1].id
          i + 1;
          this.xb = this.xb + 1
          this.activeName = strnum.toString()
          this.fileList = []
          this.fileList2 = []
          this.fileList3 = []
          this.fileList4 = []
          this.fileList5 = []
          // this.fileList6 = []
          // this.showCitys(1);
          if (this.onead == '已归档') {
            this.Isparma = true
          } else {
            this.Isparma = false
          }
        } else {
          this.xb = this.tableData2.length - 1
        }
        this.clearState();
        // // setTimeout(() => {
        // //      this.change_number = 0;
        // // }, 2000);
        // this.dialogVisible = false;
      },
      nexts() {
        this.showdilog = true;
        this.showdilog1 = false;
        this.showdilog2 = false;
        this.saveData('2',1);
        this.dialogque();
        // if (this.change_number != 0) {
        //   this.dialogVisible = true
        // } else {
        //   this.dialogque()
        // }
      },

      //上传
      handledata(fd) {
        console.log(fd, '上传数据');
        let fflg = false;
        this.$api.taskmanage.uploadAttach(fd).then(res => {
          let data = res.data;
          if (data.respCode == 0) {
            this.saveData('2');
            this.$message.success(res.data.message);
            // this.$alert(res.data.message, '提示', {
            //   dangerouslyUseHTMLString: true
            // });
            this.isNum = true;
            this.fileList = [];
            this.fileList2 = [];
            this.fileList3 = [];
            this.fileList4 = [];
            this.fileList5 = [];
            this.fileList6 = [];
            if(this.permissions == 0){ 
              this.disd = true;
              this.radiobtntop = true;
            }else{
              if (this.bysdj == '1') {
                this.disd = false;
                this.radiobtntop = false;
                this.radiobtnbot = true;
                this.radiobtn = true;
                this.radiobtn1 = true;
                this.radiobtn2 = true;
                this.radiobtn3 = true;
                this.radiobtn4 = true;
              }
            }
            // this.showCitys();
          }
          fflg = true;
        }).catch(res => {
          let data = res.data;
          this.$message.error(res.data.message)
          // this.$alert(res.data.message, '提示', {
          //   dangerouslyUseHTMLString: true
          // });
          fflg = false;
        });
        return fflg;
      },
      // 删除
      deldata(params) {
        this.$api.taskmanage.delAttach(params).then(res => {
          let data = res.data;
          if (data.respCode == 0) {
            this.saveData('2');
            this.$message.success(res.data.message);
            // this.$alert(res.data.message, {
            //   dangerouslyUseHTMLString: true
            // });
            this.isNum = true;
            this.fileList = [];
            this.fileList2 = [];
            this.fileList3 = [];
            this.fileList4 = [];
            this.fileList5 = [];
            this.fileList6 = [];
            // this.showCitys();
          }
        }).catch(res => {
          let data = res.data;
          this.$message.success(res.data.message);
          // this.$alert(res.data.message, {
          //   dangerouslyUseHTMLString: true
          // });
        })
      },
      //第一行上传文件
      handleRemove(file, fileList) { //删除
        let params = {
          taskContentId: this.id,
          fileId: file.id,
          pathFolder: this.citys.pathFolder,
          type: 2
        };
        this.deldata(params);
        this.change_number++
      },
      handlePreview(file) {

      },
      handleExceed(files, fileList) {
        this.$message.warning(`本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        if (this.onead == '已归档') {
          this.$message.warning(`已经提交归档不可以删除文件`);
          return false
        } else {
          return this.$confirm(`确定移除 ${file.name}？`,'提示');
        }
      },
      beforeUpload(file) {
        let itmeName = this.fileList.filter(item => {
          return file.name == item.name
        }).length

        if (itmeName != 0) {
          this.$alert('不能上传相同的文件', {
            dangerouslyUseHTMLString: true
          });
          return
        }
        if (this.onead == '已归档') {
          this.$message.warning(`已经提交归档不可以上传文件`);
        } else {

          let fd = new FormData();
          fd.append("taskContentId", this.id);
          fd.append("file", file);
          fd.append("pathFolder", this.citys.pathFolder);
          fd.append("type", 2);
          if (this.handledata(fd)) {
            this.fileList.push({name: file.name});
          }
          this.change_number++
        }
      },

      //第二行上传文件
      handleRemove2(file, fileList2) {
        let params = {
          taskContentId: this.id,
          fileId: file.id,
          pathFolder: this.citys.pathFolder,
          type: 3
        };
        this.deldata(params);
        this.change_number++
      },
      handlePreview2(file) {

      },
      handleExceed2(files, fileList2) {
        this.$message.warning(`本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList2.length} 个文件`);
      },
      beforeRemove2(file, fileList2) {
        if (this.onead == '已归档') {
          this.$message.warning(`已经提交归档不可以删除文件`);
          return false
        } else {
          return this.$confirm(`确定移除 ${file.name}？`,'提示');
        }
      },
      beforeUpload2(file) {
        let itmeName = this.fileList2.filter(item => {
          return file.name == item.name
        }).length;

        if (itmeName != 0) {
          this.$alert('不能上传相同的文件', {
            dangerouslyUseHTMLString: true
          });
          return
        }
        if (this.onead == '已归档') {
          this.$message.warning(`已经提交归档不可以上传文件`);
        } else {
          let fd = new FormData();
          fd.append("taskContentId", this.id);
          fd.append("file", file);
          fd.append("pathFolder", this.citys.pathFolder);
          fd.append("type", 3);

          if (this.handledata(fd)) {
            this.fileList2.push({name: file.name})
          }
          this.change_number++
        }
      },

      //第三行上传文件
      handleRemove3(file, fileList3) {
        let params = {
          taskContentId: this.id,
          fileId: file.id,
          pathFolder: this.citys.pathFolder,
          type: 4
        };
        this.deldata(params);
        this.change_number++;
      },
      handlePreview3(file) {

      },
      handleExceed3(files, fileList3) {
        this.$message.warning(`本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList3.length} 个文件`);
      },
      beforeRemove3(file, fileList3) {
        if (this.onead == '已归档') {
          this.$message.warning(`已经提交归档不可以删除文件`);
          return false
        } else {
          return this.$confirm(`确定移除 ${file.name}？`,'提示');
        }
      },
      beforeUpload3(file) {
        let itmeName = this.fileList3.filter(item => {
          return file.name == item.name
        }).length;

        if (itmeName != 0) {
          this.$alert('不能上传相同的文件', {
            dangerouslyUseHTMLString: true
          });
          return
        }
        if (this.onead == '已归档') {
          this.$message.warning(`已经提交归档不可以上传文件`);
        } else {
          let fd = new FormData();
          fd.append("taskContentId", this.id);
          fd.append("file", file);
          fd.append("pathFolder", this.citys.pathFolder);
          fd.append("type", 4);

          if (this.handledata(fd)) {
            this.fileList3.push({name: file.name});
          }
          this.change_number++
        }
      },

      //第四行上传文件
      handleRemove4(file, fileList4) {
        let params = {
          taskContentId: this.id,
          fileId: file.id,
          pathFolder: this.citys.pathFolder,
          type: 5
        };
        let divone4;
        let uploadLlist4;
        this.deldata(params);
        this.change_number++
      },
      handlePreview4(file) {

      },
      handleExceed4(files, fileList4) {
        this.$message.warning(`本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList4.length} 个文件`);
      },
      beforeRemove4(file, fileList4) {
        if (this.onead == '已归档') {
          this.$message.warning(`已经提交归档不可以删除文件`);
          return false
        } else {
          return this.$confirm(`确定移除 ${file.name}？`,'提示');
        }
      },
      beforeUpload4(file) {
        let itmeName = this.fileList4.filter(item => {
          return file.name == item.name
        }).length;

        if (itmeName != 0) {
          this.$alert('不能上传相同的文件', {
            dangerouslyUseHTMLString: true
          });
          return
        }
        if (this.onead == '已归档') {
          this.$message.warning(`已经提交归档不可以上传文件`);
        } else {
          let fd = new FormData();
          fd.append("taskContentId", this.id);
          fd.append("file", file);
          fd.append("pathFolder", this.citys.pathFolder);
          fd.append("type", 5);

          if (this.handledata(fd)) {
            this.fileList4.push({name: file.name});
          }
          this.change_number++
        }
      },

      //第五行上传文件
      handleRemove5(file, fileList5) {
        let params = {
          taskContentId: this.id,
          fileId: file.id,
          pathFolder: this.citys.pathFolder,
          type: 6
        };
        this.deldata(params);
        this.change_number++
      },
      handlePreview5(file) {

      },
      handleExceed5(files, fileList5) {
        this.$message.warning(`本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList5.length} 个文件`);
      },
      beforeRemove5(file, fileList5) {
        if (this.onead == '已归档') {
          this.$message.warning(`已经提交归档不可以删除文件`);
          return false
        } else {
          return this.$confirm(`确定移除 ${file.name}？`,'提示');
        }
      },
      beforeUpload5(file) {
        let itmeName = this.fileList5.filter(item => {
          return file.name == item.name
        }).length;

        if (itmeName != 0) {
          this.$alert('不能上传相同的文件', {
            dangerouslyUseHTMLString: true
          });
          return
        }
        if (this.onead == '已归档') {
          this.$message.warning(`已经提交归档不可以上传文件`);
        } else {
          let fd = new FormData();
          fd.append("taskContentId", this.id);
          fd.append("file", file);
          fd.append("pathFolder", this.citys.pathFolder);
          fd.append("type", 6);

          if (this.handledata(fd)) {
            this.fileList5.push({name: file.name});
          }
          this.change_number++
        }
      },

      //最上行上传文件
      handleRemove6(file, fileList6) {

      },
      handlePreview6(file) {

      },
      handleExceed6(files, fileList6) {
        this.$message.warning(`本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList6.length} 个文件`);
      },
      beforeRemove6(file, fileList6) {
        if (this.onead != 1) {
          this.$message.warning(`该文件不可以删除`);
          return false
        } else {
          return this.$confirm(`确定移除 ${file.name}？`,'提示');
        }
      },
      beforeUpload6(file) {
        // this.fileList6 = []
        let itmeName = this.fileList6.filter(item => {
          return file.name == item.name
        }).length
        if (itmeName != 0) {
          this.$alert('不能上传相同的文件', {
            dangerouslyUseHTMLString: true
          });
          return
        }
        if (this.onead == '已归档') {
          this.$message.warning(`已经提交归档不可以上传文件`);
        } else {
          let fd = new FormData();
          fd.append("file", file);
          fd.append("type", 1);
          fd.append("taskId", this.rows.id);
          
          if (this.handledata(fd)) {
            this.fileList6.push({name: file.name})
          }
        }
      },
    },
    created() {
      this.par();
      this.showCitys();
      this.initlzy();
    }
  }
</script>
<style scoped lang="scss">
  .form_inline {
    .el-input {
      width: 274px;
      height: 54px;
    }
  }

  .div1, .div2, .div3, .div4, .div5, .div6, .bao {
    width: 25%;
    height: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    display: inline-block;
  }

  .active {
    background: #eee;
  }
</style>
<style scoped lang="scss">
  .spans {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    overflow-x: auto;

    span {
      height: 100%;
      padding: 15px 15px;
      flex-shrink: 0;
      text-align: center;
      border: 1px solid #eee;
    }
  }

  .spans span:hover {
    cursor: pointer
  }

  .active {
    color: blue;
    background: #fff;
  }

  /deep/ .sample .el-form-item {
  }

  .mmm, .sample, .experiment, .original, .other, .enterprise {
    position: relative;
  }

  /deep/ .mmm .el-form-item .el-form-item__content .upload-demo .el-upload-list {
    position: absolute;
    left: 0;
    top: -4px;
  }

  /deep/ .sample .el-form-item .el-form-item__content .upload-demo .el-upload-list {
    position: absolute;
    left: 0;
    top: -4px;
  }

  /deep/ .experiment .el-form-item .el-form-item__content .upload-demo .el-upload-list {
    position: absolute;
    left: 0;
    top: -4px;
  }

  /deep/ .original .el-form-item .el-form-item__content .upload-demo .el-upload-list {
    position: absolute;
    left: 0;
    top: -4px;
  }

  /deep/ .other .el-form-item .el-form-item__content .upload-demo .el-upload-list {
    position: absolute;
    left: 0;
    top: -4px;
  }

  /deep/ .enterprise .el-form-item .el-form-item__content .upload-demo .el-upload-list {
    position: absolute;
    left: 0;
    top: -4px;
  }

  /deep/ .el-icon-warning {
    color: red;
    font-size: 20px;
    position: relative;
    top: 0;
    left: 5px;
  }

  /deep/ .el-icon-success {
    color: #67c23a;
    font-size: 20px;
    position: relative;
    top: 0;
    left: 5px;
  }


  .el-form-item {
    display: flex;
    align-items: center;
  }

  /deep/ .form_inline .el-form-item__label {
    width: 10% !important;
  }

  /deep/ .form_inline .el-form-item__content {
    margin: 0 !important;
    display: flex;
    align-items: center;
    width: 100% !important;
  }

  /deep/ .form_inline .el-form-item__content .upload-demo {
    margin-left: 20px;
  }
</style>
