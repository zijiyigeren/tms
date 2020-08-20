<template>
  <!-- 公章图片 -->
  <div class="systemcachetimg">
    <div class="warp">
      <div class="operate-but">
        <el-button type="primary" @click="uploadPicture('new')">新建</el-button>
      </div>

      <div class="table-box">
        <el-table
          border
          stripe
          size="medium"
          v-loading="loading"
          :data="tablelist"
          :header-cell-style="{
                        'background-color': 'rgba(243,246,253,1)',
                        'color': '#606266',
                        'padding': '10px 0'
                    }">
          <el-table-column
            prop="title"
            label="书签名称"
            width="250"
            align="center"
            :resizable="false">
          </el-table-column>
          <el-table-column
            prop="pic"
            label="图片"
            width="180"
            align="center"
            :resizable="false">
            <template slot-scope="scope">
              <div class="demo-image">
                <el-image
                  style="width:30px;height:30px;fontSize:10px;"
                  :src="imgUrl+ 'docs/cachet/' + scope.row.pic"
                  :preview-src-list="[imgUrl+ 'docs/cachet/' + scope.row.pic]">
                </el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="picname"
            label="图片名称"
            align="center"
            :resizable="false">
          </el-table-column>
          <el-table-column
            prop="toDate"
            label="开始使用日期"
            align="center"
            :resizable="false">
          </el-table-column>
          <el-table-column label="操作" align="center" :resizable="false">
            <template slot-scope="scope">
              <el-button type="text" style="color:#32AFF0;marginRight:6px;"
                         @click="editPicture('redact', scope.$index, scope.row)">编辑
              </el-button>
              <el-button type="text" style="color:red;marginLeft:6px;" @click="deletePicture(scope.$index, scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>


        <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" :before-close="handleDialogClose">
          <el-form :model="redactform" :rules="rules" ref="ruleForm">
            <el-form-item
              label="书签名称："
              prop="title"
              :label-width="formLabelWidth">
              <el-input size="medium" style="width:320px" v-model.trim="redactform.title"
                        placeholder="请输入书签名称"></el-input>
            </el-form-item>
            <el-form-item label="图片名称：" :label-width="formLabelWidth">
              <el-input size="medium" style="width:320px" v-model.trim="redactform.picname"
                        placeholder="请输入图片名称"></el-input>
            </el-form-item>
            <el-form-item label="开始使用日期：" :label-width="formLabelWidth">
              <el-date-picker
                v-model.trim="redactform.toDate"
                placeholder="选择日期"
                type="date"
                size="medium"
                style="width:320px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="图片：" :label-width="formLabelWidth">
              <div>
                <div style="color:red;">仅支持jpg/jpeg/gif格式图片，且只能为一张图片</div>
                <div style="display:flex;">
                  <el-image
                    v-show="redactform.pic"
                    style="width:148px;height:148px;marginRight:10px;"
                    :src="imgUrl + 'docs/cachet/' + redactform.pic">
                  </el-image>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                  <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    accept="image/jpg,image/jpeg,image/gif,image/JPG,image/JPEG,image/GIF"
                    :http-request="beforeUpload"
                    :on-remove="handleRemove"
                    ref="upload"
                    :limit="1">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </div>
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="clickShutDialog">取 消</el-button>
            <el-button type="primary" @click="submitFormVisible(redactform)">确 定</el-button>
          </div>
        </el-dialog>
      </div>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10,20,30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import base from "@/api/base.js"

  export default {
    name: 'systemcachetimg',
    data() {
      return {
        currentPage: 1, // 当前页
        pageSize: 10, // 每页的条数
        total: 0,
        tablelist: [], // 列表数据
        dialogFormVisible: false, // 控制弹窗是否显示
        dialogFormTitle: '', // 当前弹窗的title
        redactform: { // 新建或编辑图片的表单数据
          title: '',
          pic: '',
          picname: '',
          toDate: ''
        },
        formLabelWidth: '120px', // 表单标签的宽度
        saveTitle: '', // 图片编辑完成时的时状态
        file: '',
        dialogVisible: false,
        dialogImageUrl: '',
        imgUrl: base.baseImgTable,
        fileStatus: false,
        rules: {
          title: [
            {required: true, message: '书签名称不能为空', trigger: 'blur'}
          ]
        },
        loading: false,
      }
    },
    mounted() {
      this.cachePictureList();
    },
    methods: {
      handleSizeChange(val) { // 分页器-设置每条的页数（如： 10条/页）
        this.pageSize = val;
        this.paginationList(this.currentPage, this.pageSize);
      },
      handleCurrentChange(val) { // 分页器-当前页发生改变的时候（如：1，2,3）
        this.currentPage = val;
        this.paginationList(this.currentPage, this.pageSize);
      },
      cachePictureList() { // 获取列表数据
        this.paginationList(this.currentPage, this.pageSize);
      },
      paginationList(currentPage, pageSize) {
        this.loading = true;
        let params = new FormData()
        params.append('currentPage', currentPage);
        params.append('pageSize', pageSize);
        this.$api.systemcachetimg.apiCachePictureList(params).then(res => {
          res.data.data.forEach(item => {
            if (item.toDate != 0) {
              item.toDate ? item.toDate = item.toDate.toString().replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3") : item.toDate
            }
          });
          this.tablelist = res.data.data;
          if (this.tablelist.length > 0) {
            this.total = this.tablelist[0].total;
          }
          this.loading = false;
        }).catch((error) => {
          this.$message({type: 'error', message: error.data.message, duration: 1500});
          this.loading = false;
        })
      },
      deletePicture(index, row) { // 点击删除
        this.$confirm('确认要删除吗？', '信息', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(() => {
          let params = {
            cachetId: row.id
          }
          this.$api.systemcachetimg.apiDeletePicture(params).then(res => {
            this.$message({type: 'success', message: res.data.data, duration: 1500});
            this.cachePictureList();
          }).catch((error) => {
            this.$message({type: 'error', message: error.data.message, duration: 1500});
          });
        }).catch(error => {
          this.$message({type: 'info', message: '已取消删除', duration: 1500});
        })
      },
      editPicture(title, index, row) {  // 点击编辑图片
        this.dialogFormVisible = true;
        this.dialogFormTitle = '编辑图片';
        this.saveTitle = title;
        if (row !== undefined) {
          this.redactform.id = row.id;
          this.redactform.title = row.title;
          this.redactform.pic = row.pic;
          this.redactform.picname = row.picname;
          this.redactform.toDate = row.toDate;
        }
      },
      uploadPicture(title) { // 点击新建图片
        this.dialogFormVisible = true;
        this.dialogFormTitle = '新建图片';
        this.saveTitle = title;
        this.redactform = {
          title: '',
          pic: '',
          picname: '',
          toDate: ''
        };
      },
      submitFormVisible(redactform) { // 图片编辑完成时进行提交
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (!redactform.pic && !this.file) {
              this.$message({type: 'error', message: '图片不能为空，请上传图片!', duration: 1500});
            } else {
              if (this.saveTitle == 'redact') { // 编辑图片
                if (redactform.toDate) {
                  let now = new Date(redactform.toDate);
                  let y = now.getFullYear();
                  let m = now.getMonth() + 1;
                  let d = now.getDate();
                  let date = y + '';
                  if (m < 10) date += "0";
                  date += m + '';
                  if (d < 10) date += "0";
                  date += d + '';
                  redactform.toDate = date;
                }
                let fd = new FormData();
                fd.append("id", redactform.id);
                fd.append("imageFile", this.file ? this.file : '');
                fd.append("pic", '');
                fd.append("title", redactform.title ? redactform.title : '');
                fd.append("picname", redactform.picname ? redactform.picname : '');
                fd.append("toDate", redactform.toDate ? redactform.toDate : '');
                this.$api.systemcachetimg.apiEditPicture(fd).then(res => {
                  this.$message({type: 'success', message: res.data.data, duration: 1500});
                  this.dialogFormVisible = false;
                  this.cachePictureList();
                  this.file = '';
                  this.$refs.upload.clearFiles();
                  this.$refs.ruleForm.resetFields();
                }).catch((error) => {
                  this.$message({type: 'error', message: error.data.message, duration: 1500});
                  this.dialogFormVisible = false;
                  this.cachePictureList();
                  this.file = '';
                  this.$refs.upload.clearFiles();
                  this.$refs.ruleForm.resetFields();
                });
              } else if (this.saveTitle == 'new') { // 新建图片
                if (redactform.toDate) {
                  let now = new Date(redactform.toDate);
                  let y = now.getFullYear();
                  let m = now.getMonth() + 1;
                  let d = now.getDate();
                  let date = y + '';
                  if (m < 10) date += "0";
                  date += m + '';
                  if (d < 10) date += "0";
                  date += d + '';
                  redactform.toDate = date;
                }
                let fd = new FormData();
                fd.append("imageFile", this.file ? this.file : '');
                fd.append("title", redactform.title ? redactform.title : '');
                fd.append("picname", redactform.picname ? redactform.picname : '');
                fd.append("toDate", redactform.toDate ? redactform.toDate : '');
                this.$api.systemcachetimg.apiUploadPicture(fd).then(res => {
                  this.$message({type: 'success', message: res.data.data, duration: 1500});
                  this.dialogFormVisible = false;
                  this.cachePictureList();
                  this.file = '';
                  this.$refs.upload.clearFiles();
                  this.$refs.ruleForm.resetFields();
                }).catch((error) => {
                  this.$message({type: 'error', message: error.data.message, duration: 1500});
                  this.dialogFormVisible = false;
                  this.file = '';
                  this.cachePictureList();
                  this.$refs.upload.clearFiles();
                  this.$refs.ruleForm.resetFields();
                });
              }
            }
          }
        })
      },
      beforeUpload(params) { // 图片上传后-获取数据
        let file = params.file;
        let type = file.name.substring((file.name.lastIndexOf("\.")) + 1, file.name.length);
        const isLt1M = file.size / 1024 / 1024 < 3;
        if (type != 'jpeg' && type != 'jpg' && type != 'gif' && type != 'JPG' && type != 'JPEG' && type != 'GIF') {
          this.$message({type: 'error', message: '上传图片格式不正确，请重新上传!', duration: 1500});
          this.file = null;
          this.fileStatus = false;
          this.dialogVisible = false;
          this.$refs.upload.clearFiles();
        } else {
          if (!isLt1M) {
            this.$message({type: 'error', message: '上传文件大小不能超过 3MB!', duration: 1500});
            this.file = null;
            this.fileStatus = false;
            this.dialogVisible = false;
            this.$refs.upload.clearFiles();
          } else {
            this.file = file;
            this.fileStatus = true;
          }
        }
      },
      handleRemove() { // 删除上传图片
        this.file = null;
      },
      handleDialogClose() { // 点击对话框右上角的X
        this.dialogFormVisible = false;
        this.$refs.ruleForm.resetFields();
        this.$refs.upload.clearFiles();
      },
      clickShutDialog() { // 关闭对话框
        this.dialogFormVisible = false;
        this.$refs.ruleForm.resetFields();
        this.$refs.upload.clearFiles();
      },
    }
  }
</script>
<style lang="scss" scoped>
  .systemcachetimg {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 10px;
    background: #eee;
  }

  .warp {
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .el-button--default {
    min-width: 68px;
    height: 30px;
    border-radius: 2px;
    padding: 0;
    margin: 0;
  }

  .el-button--primary {
    min-width: 68px;
    height:30px;
    background:linear-gradient(90deg,rgba(96,157,248,1),rgba(84,183,235,1));
    border-radius:2px;
    padding: 0 20px;
    margin: 0;
    box-sizing: border-box;
  }
  .operate-but {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }

  .block {
    padding-top: 20px;
  }

  .table-box {
    flex: 1;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .el-table .cell {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-divider--vertical {
    margin: 0;
  }

  .el-divider {
    background-color: rgb(50, 175, 240);
  }

  /deep/ .el-image-viewer__close {
    width: 50px !important;
    height: 50px !important;
  }

  /deep/ .el-image-viewer__close .el-icon-circle-close {
    font-size: 30px;
    line-height: 50px;
    color: #fff;
  }

  /deep/ .el-scrollbar__bar {
    z-index: 999;
  }


  .el-form-item {
    margin-bottom: 20px;
  }
</style>
