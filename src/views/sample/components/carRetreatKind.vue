<template>
    <!-- 整车-退样-弹框 -->
    <div>
        <el-dialog title="整车-退样" class="dialog_retreat"
            :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="retreatVisible" :before-close="onRetreatClose">
            <el-form :inline="true" :model="retreatForm" :rules="retreatRules" ref="retreatform" class="retreat_form">
                <el-form-item prop="outPeople" label="取样人：">
                    <el-input clearable placeholder="请输入取样人" v-model.trim="retreatForm.outPeople"></el-input>
                </el-form-item>
                <el-form-item prop="operator" label="经办人：">
                    <el-input v-model.trim="retreatForm.operator" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item prop="sampleStatus" label="样车状态：">
                    <el-radio-group v-model="samplestat" @change="sampleCarState">
                        <el-radio label="正常">正常</el-radio>
                        <el-radio label="试验正常破坏">试验正常破坏</el-radio>
                        <el-radio label="其他">其他</el-radio>
                    </el-radio-group>
                    <el-input placeholder="请输入样车状态" v-model.trim="retreatForm.sampleStatus" :disabled="sampleStateDis"></el-input>
                </el-form-item>
                <el-form-item prop="contract" label="联系方式：">
                    <el-input clearable placeholder="请输入联系方式" v-model.trim="retreatForm.contract"></el-input>
                </el-form-item>
                <el-form-item prop="outDate" label="取样日期：">
                    <el-date-picker :clearable="false" v-model="retreatForm.outDate" type="date" placeholder="选择日期" 
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="文件：">
                    <el-upload :limit="1" action="#"  class="upload_demo"
                        accept=".xls,.xlsx,.doc,.docx"
                        :file-list="retreatFile"
                        :on-remove="uploadRemove" 
                        :on-exceed="uploadExceed"
                        :http-request="uploadChange">
                        <el-button type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item prop="bk" label="备注：">
                    <el-input type="textarea" :rows="2" placeholder="请输入备注" v-model.trim="retreatForm.bk"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="onRetreatClose">取 消</el-button>
                <el-button type="primary" @click="onRetreatOk">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: '',
    components: {},
    props: ['retreatVisible', 'retreatKindRow', 'currentDate'],
    watch: {
        retreatVisible: {
            immediate:true,
            handler(val) {
                if(val) {
                    this.obtainData();
                } else {
                    this.retreatInitialVal();
                }
            },
        },
        
    },
    data() {
        return {
            retreatFile: [], // 绑定数据
            retreatForm: { // 退样-数据
                terminalid: '',
                outPeople: '', // 取样人
                operator: JSON.parse(localStorage.getItem("userInfo")).username, // 经办人
                sampleStatus: '正常', // 样车状态
                contract: '', // 联系方式
                outDate: '', // 退样日期
                bk: '', // 备注
                filenName: '', // 文件-回显名称
                filePath: '',  // 文件-回显路径
                upload: null, // 上传文件
            },
            sampleStateDis: true, // 样车状态-禁用状态
            samplestat: '正常', // 样车状态-单选值
            retreatRules: {
                contract: [
                    {required: false, trigger: 'blur'},
                    {pattern:  /^1[3|4|5|7|8][0-9]{9}$/, message: '联系方式格式错误', trigger: 'blur'},
                ],
            },
        }
    },
    created() { },
    mounted() { },
    methods: { 
        // 获取数据
        obtainData() {
            if(this.retreatKindRow.id) {
                this.$api.vehicle.obtainRetreat({terminalid: this.retreatKindRow.id}).then(res => {
                    // console.log(res, '获取退样数据');
                    let data = res.data.data;
                    if(data.constructor === Object) {
                        this.retreatForm = data;
                        for(var i in this.retreatForm){
                            if(this.retreatForm[i] == null) this.retreatForm[i] = '';
                        }
                    } else if(data) {
                        this.$message.warning(data);
                    }
                    this.retreatForm.upload = null;
                    this.retreatForm.terminalid = this.retreatForm.terminalid ? this.retreatForm.terminalid : this.retreatKindRow.id;
                    this.retreatForm.operator = JSON.parse(localStorage.getItem("userInfo")).username;
                    this.retreatForm.outDate = this.retreatForm.outDate ? this.retreatForm.outDate : this.currentDate;
                    if(this.retreatForm.sampleStatus == '正常'){
                        this.samplestat = '正常';
                        this.sampleStateDis = true;
                    } else if(this.retreatForm.sampleStatus == '试验正常破坏'){
                        this.samplestat = '试验正常破坏';
                        this.sampleStateDis = true;
                    } else {
                        this.samplestat = '其他';
                        this.sampleStateDis = false;
                    }
                    // 文件
                    if(this.retreatForm.filenName && this.retreatForm.filePath) {
                        this.retreatFile = [{
                            name: this.retreatForm.filenName,
                            url: this.retreatForm.filePath
                        }];
                    } else {
                        this.retreatFile = [];
                    }
                    // console.log(this.retreatForm, '退样回显数据');
                }).catch((error) => {
                    console.log(error, '获取退样数据失败');
                    this.$message.error('获取退样数据失败！');
                });
            }
        },
        // 退样-选择样车状态
        sampleCarState(val) {
            if(val != '其他'){
                this.retreatForm.sampleStatus = val;
                this.sampleStateDis = true;
            } else {
                this.retreatForm.sampleStatus = '';
                this.sampleStateDis = false;
            }
        },
        // 退样-删除
        uploadRemove() {
            this.retreatForm.filenName = '';
            this.retreatForm.filePath = '';
            this.retreatForm.upload = null;
        },
        // 退样-超出上传数量
        uploadExceed(files, fileList) {
            this.$message.warning('只允许上传一个文件，请先删除再上传！');
        },
        // 退样-上传
        uploadChange(params) {
            // console.log(params,'退样-上传');
            let file = params.file;
            let type = file.name.substring((file.name.lastIndexOf("\.")) + 1, file.name.length);
            if (type != 'xls' && type != 'xlsx' && type != 'doc' && type != 'docx') {
                this.retreatFile = [];
                this.retreatForm.upload = null;
                this.$message.error('上传文件格式不正确，请重新上传!');
            }else{
                this.retreatForm.upload = file;
            }
        },
        // 退样-取消
        onRetreatClose() {
            this.$emit('retreatKindClose');
        },
        // 退样-确定
        onRetreatOk() {
            this.$refs.retreatform.validate((valid) => {
                if (valid) {  
                    let params = new FormData();
                    for(var i in this.retreatForm){
                        params.append(i, this.retreatForm[i]);
                    }
                    this.$api.vehicle.retreatPreserve(params).then(res => {
                        // console.log(res, '退样成功');
                        this.$message.success('退样成功');
                        this.retreatInitialVal();
                        this.$emit('retreatKindClose');
                    }).catch((error) => {
                        console.log(error, '退样失败');
                        this.$message.error('退样失败');
                        this.retreatInitialVal();
                        this.$emit('retreatKindClose');
                    });
                }
            });
        },
        // 退样-设置初始值
        retreatInitialVal() {
            this.retreatFile = [];
            this.retreatForm = { // 退样-数据
                terminalid: '',
                bk: '', // 备注
                outDate: '', // 退样日期
                filenName: '', // 文件-回显名称
                filePath: '',  // 文件-回显路径
                upload: null, // 上传文件
            };
            
        },
    }
}
</script>
<style lang="less" scoped>
.el-button--default {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    background: #fff;
    border-radius: 4px;
}
.el-button--primary {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
    border-radius: 4px;
}
// 退样-表单
/deep/ .retreat_form {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
        width: 100%;
        margin: 0;
        padding-bottom: 20px;
        overflow: hidden;
        display: flex;
        .el-form-item__label {
            width: 20% !important;
            white-space: nowrap;
        }
        .el-form-item__content {
            flex: 1;
            padding-right: 10%;
            .el-select, .el-input, .el-date-editor {
                width: 100% !important;
            }
        }
    }
}
// 上传
/deep/ .upload_demo {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    .el-upload-list {
        flex: 1;
        height: 40px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        margin-right: 10px;
        overflow: hidden;
    }
}
</style>