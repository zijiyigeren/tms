<template>
    <!-- 参数配置 -->
    <div class="config_border">
        <div class="config_con">
            <el-button type="primary" @click="onDeposit" class="deposit">保存</el-button>
            <div class="config_form">
                <el-form :inline="true" class="form_box">
                    <el-form-item v-for="(item,i) in formList" :key="i" :label="item.name+'：'">
                        <template>
                            <el-input 
                                clearable name="clearInputValue" :placeholder="'请输入'+item.name" v-model.trim="item.datas" v-if="item.name.indexOf('附件') < 0 && item.name.indexOf('密码') <0"
                                @change="onChange(item)"></el-input>
                            <el-input 
                                clearable name="clearInputValue" :placeholder="'请输入'+item.name" 
                                v-model.trim="item.datas" show-password 
                                v-else-if="item.name.indexOf('附件') < 0 && item.name.indexOf('密码') != -1"
                                @change="onChange(item)"></el-input>
                            <div class="form_upload" v-else-if="item.name.indexOf('附件') != -1">
                                <el-image
                                    v-show="item.savePath"
                                    style="width:148px;height:148px;marginRight:10px;"
                                    :src="item.savePath">
                                </el-image>
                                <el-upload
                                    ref="upload" action="1" list-type="picture-card"
                                    accept="image/jpg,image/jpeg,image/gif,image/png,image/JPG,image/JPEG,image/GIF,image/PNG"
                                    :http-request="params=>uploadChange(item,params)"
                                    :on-remove="handleRemove" :show-file-list="false">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </template>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import base from '@/api/base.js';
export default {
    name: 'paramsconfig',
    props: [],
    data() {
        return {
            imgUrl: base.baseImgUrl,
            paramsData: [], //
            formList: [], // 表单数据
            uploadFile: null,
        }
    },
    created() {},
    mounted() {
        this.findAllParam();
    },
    methods: {
        // 获取全部参数信息
        findAllParam() {
            this.paramsData = [];
            this.$api.paramsConfig.findAllParam().then(res => {
                console.log(res, '参数信息res');
                let data = res.data.data;
                data.forEach(item => {
                    if(item.savePath && item.name.indexOf('附件')!=-1){
                        item.savePath = this.imgUrl + 'api/file/' + item.savePath;
                    }
                });
                this.formList = data;
            }).catch(error => {
                console.log(error, '参数信息error');
            });
        },
        // 数据改变
        onChange(row) {
            if(this.paramsData.length > 0){
                this.paramsData.forEach(item => {
                    if(item.id != row.id) {
                        this.paramsData.push(row);
                    }else{
                        item = row;
                    }
                });
            } else {
                this.paramsData = [row];
            }
            this.paramsData = Array.from(new Set(this.paramsData));
        },
        // 保存
        onDeposit() {
            this.$api.paramsConfig.save(this.paramsData).then(res => {
                // console.log(res, '保存res');
                this.$message.success('保存成功');
                this.findAllParam();
            }).catch(error => {
                console.log(error, '保存error');
                this.$message.error('保存失败');
                this.findAllParam();
            });
        },
        // 上传图片
        uploadChange(item,params) {
            let file = params.file;
            let type = file.name.substring((file.name.lastIndexOf("\.")) + 1, file.name.length);
            if (type!='jpeg'&&type!='jpg'&&type!='gif'&&type!='png'&&type!='JPG'&&type!='JPEG'&&type!='GIF'&&type!='PNG') {
                this.$message.error('上传图片格式不正确，请重新上传!');
                this.uploadFile = null;
            }else{
                this.uploadFile = file;
                let params = new FormData();
                params.append('file', this.uploadFile);
                params.append('filePath', '/ggif/sys/param');
                this.$api.paramsConfig.upload(params).then(res => {
                    this.uploadFile = null;
                    item.datas = res.data.data.fileId;
                    item.savePath = this.imgUrl + 'api/file/' + res.data.data.savePath;
                    console.log(item.savePath,'item.savePath');
                    
                    this.onChange(item);
                    this.$message.success('上传图片成功!');
                }).catch(error => {
                    console.log(error, '上传图片error');
                });
            }
        },
        // 删除上传图片
        handleRemove() { 
            this.uploadFile = null;
        },
    }
}
</script>
<style scoped lang="less">
/deep/ .form_box {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    .el-form-item{
        width: 50%;
        margin: 0;
        padding: 0 60px 40px 0;
        display: flex;
        align-items: center;
        overflow: hidden;
        .el-form-item__label {
            width: 25%;
            white-space: nowrap;
        }
        .el-form-item__content {
            flex: 1;
            padding-right: 20px;
            .el-select, .el-input, .el-date-editor {
                width: 100% !important;
            }
        }
    }
}
// 上传图片
/deep/ .form_upload {
    display: flex;
    div {
        display: flex;
    }
    .el-image {
        width: 140px !important;
        height: 140px !important;
    }
    .el-upload-list__item {
        margin: 0;
        padding: 0;
        width: 140px;
        height: 140px;
    }
    .el-upload--picture-card {
        margin-left: 10px;
        width: 140px;
        height: 140px;
        justify-content: center;
        align-items: center;
    }
}
.config_border {
    width: 100%;
    height: 100%;
    background: #eee;
    margin: 0;
    padding: 10px;
    overflow: hidden;
}
.config_con {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .deposit {
        width: 70px;
        height: 30px;
        background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
        border-radius: 4px;
        padding: 0;
        margin-bottom: 20px;
    }
    .config_form {
        flex: 1;
        overflow-y: auto;
    }
}
</style>