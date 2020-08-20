<template>
<!-- 有效期 -->
<div class="termofvalidity_box">
    <div class="warp">
    <!-- 查询 -->
    <div class="query">
        <el-form :model="formList" ref="formQuery" class="query_search" :rules="rules">
            <el-form-item label="证书编号：" prop="certificatecode">
                <el-input v-model.trim="formList.certificatecode"/>
            </el-form-item>
            <el-form-item label="证书文件：" class="form_item_upload" prop="upload">
                <el-upload
                    class="upload-demo"
                    action="1"
                    multiple
                    :limit="1"
                    :http-request="httpUploadRegister"
                    :on-remove="handleRemoveRegister"
                    :file-list="formList.upload"
                    ref="upload">
                    <el-button size="small" type="primary">选择文件</el-button>
                </el-upload>
            </el-form-item>
        </el-form>

        <!-- 查询按钮 -->
        <div class="query_btn">
            <el-button type="primary" @click="onClickNewlyBuild">新建</el-button>
        </div>
    </div>

    <!-- 表格 -->
    <div class="table_box">
        <div v-loading="loading" class="table_content">
          <ul class="table_coneter_header">
              <li class="table_coneter_item">编号</li>
              <li class="table_coneter_item">操作</li>
          </ul>
          <!-- 一级列表 -->
          <div v-if="tablelist.length < 1" class="table_body_coneter_not">暂无数据</div>
          <div class="table_body_coneter" v-for="(item,i) in tablelist" :key="i">
            <ul class="table_body_coneter_list">
                <li class="table_coneter_item"><span>{{item.certificatecode}}</span></li>
                <li class="table_coneter_item">
                    <el-button type="text" class="operation_btn" @click="onClickSee(item)">查看</el-button>
                    <el-button type="text" class="operation_btn" style="color:red;" @click="onClickDelete(item)">删除</el-button>
                </li>
            </ul>
          </div>
        </div>
    </div>

    </div>
</div>
</template>
<script>
import base from '@/api/base.js';
export default {
    name: 'termofvalidity',
    components: {},
    props: ['checkDateList', 'flag', 'checkid'],
    watch: {
        flag(val){
            this.$refs.formQuery && this.$refs.formQuery.resetFields();
            this.tablelist = this.checkDateList.length > 0 ? this.checkDateList : [];
        }
    },
    data() {
        var uploadFlag = (rule, value, callback) => {
            if (value) {
                if(value.length > 0){
                    callback()
                }else{
                    callback(new Error('请选择上传文件'))
                }
            }else{
                callback()
            }
        };
        return {
            loading: false,
            tablelist: this.checkDateList.length > 0 ? this.checkDateList : [],
            formList: {
                certificatecode: '', // 证书编号
                upload: [], // 证书文件
            },
            filename: null, // 证书文件-名
            rules: { // 对表单进行校验
                certificatecode: [
                    { required: true, message: '证书编号不能为空', trigger: 'blur' },
                ],
                upload: [
                    { required: true, validator: uploadFlag, trigger: 'blur' },
                ],
            },
        }
    },
    mounted() {},
    methods: {
        // 证书文件-上传文件
        httpUploadRegister(params) {
            let file = params.file;
            let type = file.name.substring((file.name.lastIndexOf("\.")) + 1, file.name.length);
            if (type!='PDF'&&type!='pdf') {
                this.$message({ type: 'error', message: '只能上传PDF文件', duration: 1500 });
                this.formList.upload = [];
                this.filename = null;
                this.$refs.upload.clearFiles();
            }else{
                this.formList.upload = [file];
                this.filename = file.name;
            }
        },
        // 证书文件-删除文件
        handleRemoveRegister() {
            this.formList.upload = [];
            this.filename = null;
            this.$refs.upload.clearFiles();
        },
        // 点击-新建
        onClickNewlyBuild() {
            this.$refs.formQuery.validate((valid) => {
                if (valid) { 
                    let cf = {
                        checkid: this.checkid,
                        certificatecode: this.formList.certificatecode,
                        filename: this.filename
                    };
                    let params = new FormData();
                        params.append("cf", JSON.stringify(cf));
                        params.append("upload", this.formList.upload[0]);
                    this.$api.instrumentunit.apiUpload(params).then(res => {
                        this.$message({type: 'success', message: res.data.data, duration: 1500});
                        this.formList.certificatecode = '';
                        this.formList.upload = [];
                        this.filename = null;
                        this.$refs.upload.clearFiles();
                        this.getDataList()
                    }).catch(error => {
                        this.$message({type: 'error', message: error.data.message, duration: 1500});
                        this.getDataList()
                    })
                }
            })
        },
        // 点击-查看
        onClickSee(row) {
            let formEle = document.createElement('form');
                formEle.setAttribute('id', 'formId')
                formEle.setAttribute('method', 'POST');
                formEle.setAttribute('action', base.entrustamend+'/Certificate/goView');
                document.body ? document.body.appendChild(formEle) : '';

            //input元素
            let input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', 'filename');
            input.setAttribute('value', row.filename);
            formEle ? formEle.appendChild(input) : '';

            let input2 = document.createElement('input');
            input2.setAttribute('type', 'hidden');
            input2.setAttribute('name', 'filepath');
            input2.setAttribute('value', row.filepath);
            formEle ? formEle.appendChild(input2) : '';

            let formId = document.getElementById('formId');
            formId.submit();
            document.body.removeChild(formEle);
        },
        // 点击-删除
        onClickDelete(row) {
            let params = {
                id: row.id
            }
            this.$api.instrumentunit.apiCheckDateDelete(params).then(res => {
                this.$message({type: 'success', message: res.data.data, duration: 1500});
                this.getDataList()
            }).catch(error => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
                this.getDataList()
            })
        },
        // 获取列表数据
        getDataList() {
            let params = {
                checkid: this.checkid
            }
            this.$api.instrumentunit.apiView2(params).then(res => {
                this.tablelist = res.data.data.list;
            }).catch(error => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
            })
        }
    }
}
</script>
<style scoped lang="less">
.el-button--primary {
  height: 30px;
  background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
  padding: 0 20px;
  margin: 0;
}

.termofvalidity_box {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: #eee;
    padding: 10px;
    overflow: hidden;
}
.warp {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
/deep/ .query {
    width: 100%;
    margin: 0;
    overflow: hidden;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    .query_search {
        width: 100%;
        overflow: hidden;
        display: flex;
        .el-form-item {
            width: 50%;
            margin: 0;
            padding: 0;
            padding-bottom: 20px;
            display: flex;
            .el-form-item__content {
                width: 60% !important;
            }
        }
        .form_item_upload {
            .el-form-item__content {
                width: 80% !important;
            }
        }
    }
    .query_btn {
        padding-bottom: 20px;
    }
}
.table_box {
    flex: 1;
    overflow: hidden;
}

.upload-demo {
    overflow: hidden;
    display: flex;
    align-items: center;
    /deep/ .el-upload-list {
        flex: 1 !important;
        overflow: hidden !important;
        margin-left: 10px !important;
        margin-right: 20px !important;
        /deep/ .el-upload-list__item {
            margin: 0 !important;
            /deep/ .el-upload-list__item-name {
                margin-right: 20px !important;
            }
        }
    }
}

.table_content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.table_coneter_header {
    width: 100%;
    background-color: rgb(243, 246, 253);
    height: auto;
    display: flex;
    border: 1px solid #EBEEF5;
    li {
        line-height: 55px;
        box-sizing: border-box;
        border-right: 1px solid #EBEEF5;
        list-style: none;
        text-align: center;
        color: rgb(96, 98, 102);
        font-weight: 600;
        &:last-child {
            border-right: none;
        }
    }
}

.table_body_coneter_not {
    text-align: center;
    line-height: 60px;
    color: #909399;
    border-bottom: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
}
.table_body_coneter {
    width: 100%;
    height: auto;
    border-bottom: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
    &:nth-child(even) {
        background: #FAFAFA;
    }
    .table_body_coneter_list {
        width: 100%;
        height: auto;
        display: flex;
        overflow: hidden;
        min-width: 0;
        li {
            box-sizing: border-box;
            border-right: 1px solid #EBEEF5;
            list-style: none;
            color: rgb(96, 98, 102);
            &:last-child {
                border-right: none;
            }
        }
    }
}
.table_coneter_item {
    width: 50%;
    overflow: hidden;
    padding: 0 10px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
        flex: 1;
        min-width: 0;
        padding: 18px 0;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>