<template>
    <!-- 零部件列表-新建/编辑 -->
    <div>
        <el-dialog :fullscreen="true" :title="newEditTitle" class="dialog_newedit"
            :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="newEditVisible" :before-close="onNewEditClose">
            <div class="dialog_newedit_con">
                <el-form :model="newEditForm" :rules="newEditRules"  ref="neweditform" class="newedit_form"  :disabled="disableForm">
                    <el-form-item prop="taskCode" label="任务单号：">
                        <el-input v-model.trim="newEditForm.taskCode" :disabled="true"></el-input>
                    </el-form-item>
                    <!-- <el-form-item prop="taskCode" label="任务单号：" class="obtain_data">
                        <el-input clearable placeholder="请获取任务单号" v-model.trim="newEditForm.taskCode" :disabled="true"></el-input>
                        <el-button type="primary" @click="onTaskCode">获取</el-button>
                    </el-form-item> -->
                    <el-form-item prop="checkType" label="检验类型：">
                        <template-method 
                            :type="'select'"
                            :dicCode="'zeroCheckType'"
                            v-model="newEditForm.checkType"/>
                    </el-form-item>
                    <el-form-item prop="sampleType" label="型号：">
                        <el-input clearable placeholder="请输入型号" v-model.trim="newEditForm.sampleType"></el-input>
                    </el-form-item>
                    <el-form-item prop="sampleStatus" label="接收样品状态：">
                        <template-method 
                            :type="'select'"
                            :dicCode="'sampleStatus'"
                            v-model="newEditForm.sampleStatus"/>
                    </el-form-item>
                    <el-form-item prop="comeDate" label="送样日期：">
                        <el-date-picker clearable v-model="newEditForm.comeDate" type="date" 
                            placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="recoverdept" label="部门：">
                        <el-select clearable v-model="newEditForm.recoverdept" placeholder="请选择部门">
                            <el-option label="请选择" value=""></el-option>
                            <el-option 
                                v-for="(item,i) in recoverdeptData" 
                                :key="i"
                                :label="item.org_name" 
                                :value="item.org_name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="sampleName" label="样品名称：" class="obtain_sampleName">
                        <el-input clearable placeholder="请输入样品名称" v-model.trim="newEditForm.sampleName"></el-input>
                        <template-method 
                            :type="'select'"
                            :dicCode="'zeroKind'"
                            :defaultVal="'其他'"
                            v-model="newEditForm.kind"/>
                    </el-form-item>
                    <el-form-item prop="comeCompany" label="送样公司：" class="obtain_data">
                        <el-input clearable placeholder="请获取送样公司" v-model.trim="newEditForm.comeCompany"></el-input>
                        <el-button type="primary" @click="onCompanyObtain">获取</el-button>
                    </el-form-item>
                    <el-form-item prop="code" label="样品批号：" class="obtain_data">
                        <el-input clearable placeholder="请获取样品批号" v-model.trim="newEditForm.code" :disabled="true"></el-input>
                        <el-button type="primary" @click="onObtainCode" :disabled="codeDisa">获取</el-button>
                    </el-form-item>
                    <el-form-item prop="contractor" label="送样联系人：">
                        <el-input clearable placeholder="请输入送样联系人" v-model.trim="newEditForm.contractor"></el-input>
                    </el-form-item>
                    <el-form-item prop="comeCompanyAddr" label="送样公司地址：">
                        <el-input clearable placeholder="请获取送样公司" v-model.trim="newEditForm.comeCompanyAddr"></el-input>
                    </el-form-item>
                    <el-form-item prop="typeNumber" label="种类数量：">
                        <el-input clearable placeholder="请输入种类数量" v-model.trim="newEditForm.typeNumber" @input="typeNumChange" :disabled="codeDisa"></el-input>
                    </el-form-item>
                    <el-form-item prop="contracttel" label="送样联系电话：">
                        <el-input clearable placeholder="请输入送样联系电话" v-model.trim="newEditForm.contracttel"></el-input>
                    </el-form-item>
                    <el-form-item prop="productionDate" label="生产日期：">
                        <el-date-picker clearable v-model="newEditForm.productionDate" type="date" 
                            placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="placeBaseCode" label="库房编号：">
                        <el-select clearable v-model="newEditForm.placeBaseCode" placeholder="请选择库房编号">
                            <el-option label="请选择" value=""></el-option>
                            <el-option 
                                v-for="(item,i) in placeCodeData" 
                                :key="i"
                                :label="item.code+'-'+item.areaCode" 
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="recoveror" label="签收人：">
                        <el-input clearable placeholder="请输入签收人" v-model.trim="newEditForm.recoveror"></el-input>
                    </el-form-item>
                    <el-form-item prop="courierNumber" label="快递单号：">
                        <el-input clearable placeholder="请输入快递单号" v-model.trim="newEditForm.courierNumber"></el-input>
                    </el-form-item>
                    <el-form-item prop="backway" label="处理方式：">
                        <template-method 
                            :type="'select'"
                            :dicCode="'zeroBackway'"
                            v-model="newEditForm.backway"/>
                    </el-form-item>
                    <el-form-item prop="emsCompany" label="托运公司：">
                        <el-input clearable placeholder="请输入托运公司" v-model.trim="newEditForm.emsCompany"></el-input>
                    </el-form-item>
                    <el-form-item prop="emscontractor" label="托运联系人：">
                        <el-input clearable placeholder="请输入托运联系人" v-model.trim="newEditForm.emscontractor"></el-input>
                    </el-form-item>
                    <el-form-item prop="emscontracttel" label="托运联系电话：">
                        <el-input clearable placeholder="请输入托运联系电话" v-model.trim="newEditForm.emscontracttel"></el-input>
                    </el-form-item>
                    <el-form-item prop="master" label="主检：">
                        <el-input clearable placeholder="请输入主检" v-model.trim="newEditForm.master"></el-input>
                    </el-form-item>
                    <el-form-item prop="cfwz" label="存放位置：">
                        <el-input clearable placeholder="请输入存放位置" v-model.trim="newEditForm.cfwz"></el-input>
                    </el-form-item>
                    <el-form-item prop="recoverbk" label="接收备注：">
                        <el-input clearable placeholder="请输入接收备注" v-model.trim="newEditForm.recoverbk"></el-input>
                    </el-form-item>
                    <el-form-item prop="samplebk" label="样品备注：">
                        <el-input clearable placeholder="请输入样品备注" v-model.trim="newEditForm.samplebk"></el-input>
                    </el-form-item>
                    <el-form-item label="图片：" class="picture">
                        <el-upload class="form_upload" action="#" :limit="10" 
                            :file-list="fileList" list-type="picture" multiple 
                            accept="image/jpg,image/jpeg,image/png,image/JPG,image/JPEG,image/PNG" 
                            :on-remove="uploadRemove"
                            :on-exceed="uploadExceed"
                            :before-upload="uploadChange"
                            :http-request="uploadRequest">
                            <!-- on-change http-request -->
                            <el-button type="primary" class="upload_btn"><i class="el-icon-plus"></i></el-button>
                        </el-upload>
                    </el-form-item>
                    <!-- <el-form-item prop="sampleor" label="样品员：">
                        <el-input v-model.trim="newEditForm.sampleor" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item prop="cNumber" label="认证编号：">
                        <el-input clearable placeholder="请输入认证编号" v-model.trim="newEditForm.cNumber"></el-input>
                    </el-form-item>
                    <el-form-item prop="reachType" label="到样类型：">
                        <template-method 
                            :type="'select'"
                            :dicCode="'zeroReachType'"
                            v-model="newEditForm.reachType"/>
                    </el-form-item> -->
                </el-form>

                <!-- 添加条形码 -->
                <div class="newedit_table">
                    <el-button type="primary" @click="onAddTo" :disabled="disableForm||codeDisa">添加</el-button>
                    <el-table ref="table" border stripe :data="tableList"
                        :header-cell-style="{'background-color':'rgba(243,246,253,1)','color':'#606266','padding':'10px 0'}">
                        <el-table-column align="center" :resizable="false" prop="placecode" label="条形码">
                            <template slot-scope="scope">
                                <el-input clearable v-model.trim="scope.row.placecode" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" prop="placenumber" label="包括产品数量" width="200">
                            <template slot-scope="scope">
                                <el-input clearable v-model.trim="scope.row.placenumber" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :resizable="false" label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button type="text" style="color:red;" @click="onDelete(scope.row)" :disabled="disableForm||codeDisa">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer" class="dialog-footer" :center="true" width="100%">
                <el-button @click="onNewEditClose">取 消</el-button>
                <el-button type="primary" @click="onNewEditOk">确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 任务单号 -->
        <obtain-task-code 
            :taskCodeVisible="taskCodeVisible"
            @taskCodeClose="onTaskCodeClose"
        />

        <!-- 企业名录 -->
        <el-dialog width="90%" title="企业名录" :visible.sync="directoriesVisible" class="dialog_directories"
            :close-on-click-modal="false" :close-on-press-escape="false"
            :destroy-on-close="true" :before-close="onDirectoriesClose">
            <BusinessLists :show-radio="1">
                <template slot-scope="{ currentRadio }">
                {{ getDirectories('directories', currentRadio) }}
                </template>
            </BusinessLists>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="onDirectoriesClose">取消</el-button>
                <el-button size="mini" type="primary" @click="onDirectoriesOk">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import base from '@/api/base.js';
import TemplateMethod from '@/components/TemplateMethod';
import BusinessLists from '@/components/PublicTools/enterprise/index.vue';
import ObtainTaskCode from './obtainTaskCode';
export default {
    name: '',
    components: {TemplateMethod, ObtainTaskCode, BusinessLists},
    props: ['newEditRow','newEditTitle','newEditVisible'],
    watch: {
        newEditVisible: {
            immediate:true,
            handler(val) {
                if(val){
                    this.obtainData();
                    if(this.newEditTitle == '新建'){
                        this.onNewAdd();
                        this.disableForm = false;
                        this.codeDisa = false;
                    } else if(this.newEditTitle == '编辑') {
                        this.onEdit();
                        this.disableForm = false;
                        this.codeDisa = true;
                    } else if(this.newEditTitle == '详细') {
                        this.onEdit();
                        this.disableForm = true;
                        this.codeDisa = true;
                    }
                } else {
                    this.tableList = []; // 条形码-表格数据
                    this.recoverdeptData = [];  // 部门数据
                    this.placeCodeData = []; // 库房编号-数据
                    this.taskCodeVisible = false; // 任务号-显示状态
                    this.directoriesVisible = false; // 企业名录-显示状态
                    this.uploadList = []; // 图片
                    this.fileList = []; // 上传图片-绑定数据
                    this.imgFileList = []; // 上传图片-处理数据
                }
            },
        },
    },
    data() {
        return {
            disableForm: false, // 表单禁用状态
            codeDisa: false, // 样品批号与条形码禁用状态
            newEditForm: { // 新建/编辑-表单数据
                id: '',
                sampleNumber: '1', // 种类-必传
                registerPath: '', // 样品登记表路径(必传)
                taskCode: '', // 任务单号
                checkType: 'CQC', // 检验类型
                sampleType: '', // 型号
                recoverdept: '', // 部门
                sampleStatus: '完好', // 接收样品状态
                productionDate: '', // 生产日期
                sampleName: '', // 样品名称
                kind: '', // 样品名称-选择
                contractor: '', // 送样联系人
                contracttel: '', // 送样联系电话
                comeCompany: '', // 送样公司
                comeCompanyAddr: '', // 送样公司地址
                comeDate: '', // 送样日期
                code: '', // 样品批号
                typeNumber: '', // 种类数量
                placeBaseCode: '', // 库房编号
                recoveror: '', // 签收人
                courierNumber: '', // 快递单号
                backway: '未知', // 处理方式
                emsCompany: '', // 托运公司
                emscontractor: '', // 托运联系人
                emscontracttel: '', // 托运联系电话
                master: '', // 主检
                cfwz: '', // 存放位置
                recoverbk: '', // 接收备注
                samplebk: '', // 样品备注
                imgpath: '', // 图片路径
                sampleor: JSON.parse(localStorage.getItem("userInfo")).username, // 样品员
                // cNumber: '', // 认证编号
                // reachType: '零部件', // 到样类型
            },
            newEditRules: { // 新建/编辑-校验
                checkType: [
                    {required: true, message: '检验类型不能为空', trigger: 'change'},
                ],
                sampleType: [
                    {required: true, message: '型号不能为空', trigger: 'blur'},
                ],
                recoverdept: [
                    {required: true, message: '部门不能为空', trigger: 'change'},
                ],
                sampleStatus: [
                    {required: true, message: '接收样品状态不能为空', trigger: 'change'},
                ],
                sampleName: [
                    {required: true, message: '样品名称不能为空', trigger: 'blur'},
                ],
                // 送样联系电话
                contracttel: [
                    {required: false, trigger: 'blur'},
                    {pattern:  /^1[3|4|5|7|8][0-9]{9}$/, message: '联系电话格式错误', trigger: 'blur'},
                ],
                comeCompany: [
                    {required: true, message: '送样公司不能为空', trigger: 'change'},
                ],
                comeDate: [
                    {required: true, message: '送样日期不能为空', trigger: 'change'},
                ],
                code: [
                    {required: true, message: '样品批号不能为空', trigger: 'change'},
                ],
                typeNumber: [
                    {required: true, message: '种类数量不能为空', trigger: 'blur'},
                    {pattern: /^[0-9]+$/, message: '种类数量必须为数字', trigger: 'blur' },
                ],
                placeBaseCode: [
                    {required: true, message: '库房编号不能为空', trigger: 'change'},
                ],
                recoveror: [
                    {required: true, message: '签收人不能为空', trigger: 'blur'},
                ],
                // 托运联系电话
                emscontracttel: [
                    {required: false, trigger: 'blur'},
                    {pattern:  /^1[3|4|5|7|8][0-9]{9}$/, message: '联系电话格式错误', trigger: 'blur'},
                ],
            },
            tableList: [], // 条形码-表格数据
            recoverdeptData: [], // 部门数据
            placeCodeData: [], // 库房编号-数据
            taskCodeVisible: false, // 任务号-显示状态

            directoriesVisible: false, // 企业名录-显示状态
            directories: '', // 企业名录-插槽数据

            imgUrl: base.baseImgUrl, // 上传图片-回显路径
            uploadList: [], // 图片
            fileList: [], // 上传图片-绑定数据
            imgFileList: [], // 上传图片-处理数据
        }
    },
    created() {
        
    },
    mounted() {
        
    },
    methods: {
        // 获取-部门/库房编号-数据
        obtainData() {
            this.$api.spareparts.getDepartment().then(res => {
                this.recoverdeptData = res.data.data;
            }).catch((error) => {
                this.recoverdeptData = [];
            });
            this.$api.spareparts.initPlace().then(res => {
                this.placeCodeData = res.data.data;
            }).catch((error) => {
                this.placeCodeData = [];
            })
        },
        // 新建
        onNewAdd() {
            this.newEditForm = {
                id: '',
                sampleNumber: '1', // 种类-必传
                registerPath: '', // 样品登记表路径(必传)
                taskCode: '', // 任务单号
                checkType: 'CQC', // 检验类型
                sampleType: '', // 型号
                recoverdept: '', // 部门
                sampleStatus: '完好', // 接收样品状态
                productionDate: '', // 生产日期
                sampleName: '', // 样品名称
                kind: '', // 样品名称-选择
                contractor: '', // 送样联系人
                contracttel: '', // 送样联系电话
                comeCompany: '', // 送样公司
                comeCompanyAddr: '', // 送样公司地址
                comeDate: '', // 送样日期
                code: '', // 样品批号
                typeNumber: '', // 种类数量
                placeBaseCode: '', // 库房编号
                recoveror: '', // 签收人
                courierNumber: '', // 快递单号
                backway: '未知', // 处理方式
                emsCompany: '', // 托运公司
                emscontractor: '', // 托运联系人
                emscontracttel: '', // 托运联系电话
                master: '', // 主检
                cfwz: '', // 存放位置
                recoverbk: '', // 接收备注
                samplebk: '', // 样品备注
                imgpath: '', // 图片路径
                sampleor: JSON.parse(localStorage.getItem("userInfo")).username, // 样品员
            };
        },
        // 编辑
        onEdit() {
            if(this.newEditRow.id) {
                this.$api.spareparts.detail({id: this.newEditRow.id}).then(res => {
                    //console.log(res, '获取编辑信息成功res');
                    let data = res.data.data;
                    for (let i in this.newEditForm) {
                        if(data[i]){
                            this.newEditForm[i] = data[i];
                        }
                    }
                    if(Array.isArray(data.cppList) && data.cppList.length>0){
                        data.cppList.forEach((item,i)=>{
                            this.tableList.push({placeid:data.cppList[i].id,placecode:data.cppList[i].barcode,placenumber:data.cppList[i].typeNumber,});
                        });
                    }
                    if( this.newEditForm.imgpath ) {
                        this.newEditForm.imgpath = JSON.parse(this.newEditForm.imgpath);
                        this.newEditForm.imgpath.forEach(item => {
                            this.fileList.push({
                                name: item.name,
                                url: this.imgUrl + 'api/file/' + item.imgPath,
                                raw: {
                                    delete: 'deimgpath'
                                }
                            });
                        });
                    }
                }).catch((error) => {
                    console.log(error, '获取编辑信息失败error');
                    this.onNewAdd();
                })
            }
        },
        // 保存-新建/编辑-对话框
        onNewEditOk() {
            if(this.disableForm) {
                this.$emit('newEditClose', 1);
            } else { 
                this.$refs.neweditform.validate((valid) => {
                    if (valid) {
                        if(this.tableList.length>0) {
                            let obj = this.newEditForm;
                            let params = new FormData();
                            obj.placeid = [];
                            obj.placecode = [];
                            obj.placenumber = [];
                            this.tableList.forEach(item => {
                                obj.placeid.push(item.placeid);
                                obj.placecode.push(item.placecode);
                                obj.placenumber.push(item.placenumber);
                            });
                            if(obj.imgpath && obj.imgpath!='null' && obj.imgpath.length > 0) {
                                obj.imgpath = JSON.stringify(obj.imgpath);
                            } else {
                                obj.imgpath = '';
                            }
                            // 图片
                            if(this.uploadList.length > 0) {
                                this.uploadList.forEach(item => {
                                    params.append('uploadList',item);
                                });
                            }
                            
                            for(var i in obj){
                                params.append(i, obj[i]);
                            }
                            //console.log(params, '新建/编辑-表单数据');
                            this.$api.spareparts.edit(params).then(res => {
                                //console.log(res, '新建/编辑成功res');
                                if(this.newEditTitle == '新建') {
                                    this.$message.success('新建成功');
                                    this.$emit('newEditClose', 0);
                                }else if(this.newEditTitle == '编辑') {
                                    this.$message.success('编辑成功');
                                    this.$emit('newEditClose', 1);
                                }
                                this.$refs.neweditform.resetFields();
                            }).catch((error) => {
                                console.log(error, '新建/编辑失败error');
                                if(this.newEditTitle == '新建') {
                                    this.$message.error('新建失败');
                                    this.$emit('newEditClose', 0);
                                }else if(this.newEditTitle == '编辑') {
                                    this.$message.error('编辑失败');
                                    this.$emit('newEditClose', 1);
                                }
                                this.$refs.neweditform.resetFields();
                            });
                        } else {
                            this.$message.error('条形码不能为空，请添加条形码！');
                        }
                    }
                });
            }   
        },
        // 关闭-新建/编辑-对话框
        onNewEditClose() {
            this.$refs.neweditform.resetFields();
            this.$emit('newEditClose', 0);
        },

        //任务单号- 获取
        onTaskCode() {
            this.taskCodeVisible = true;
        },
        // 任务单号-关闭
        onTaskCodeClose(val) {
            this.taskCodeVisible = false;
            this.newEditForm.taskCode = val?val:'';
        },

        // 送样公司-获取
        onCompanyObtain() {
            this.directoriesVisible = true;
        },
        // 企业名录-获取-插槽数据
        getDirectories (key, data) {
            this[key] = data;
        },
        // 企业名录-送样公司绑定值
        onDirectoriesOk() {
            this.newEditForm.comeCompany = this.directories.entName;
            this.directoriesVisible = false;
        },
        // 企业名录-关闭
        onDirectoriesClose() {
            this.directoriesVisible = false;
        },
        // 种类数量-改变时
        typeNumChange(val) {
            this.tableList = [];
            if(val > 99) {
                this.$message.error('种类数量必须小于99!');
                this.newEditForm.typeNumber = '';
            }
        },
        // 获取样品批号
        onObtainCode() {
            this.$api.spareparts.findComponentCode().then(res => {
                this.tableList = [];
                this.newEditForm.code = res.data.data;
            }).catch((error) => {
                //console.log(error, '获取样品批号失败error');
                this.$message.error('获取样品批号失败!');
            });
        },
        // 条形码-添加条形码
        onAddTo() {
            if(!this.newEditForm.code && !this.newEditForm.typeNumber){
                this.$message.warning('样品批号或种类数量不能为空，请填写!');
            } else {
                let obj = {};
                let code = this.newEditForm.code;
                let nam = this.newEditForm.typeNumber;
                for( var i=1; i<=nam; i++ ){
                    if(i<10){
                        obj = {placeid: i,placecode:code+'0'+i,placenumber:1};
                    } else {
                        obj = {placeid: i,placecode:code+''+i,placenumber:1};
                    }
                    this.tableList.push(obj);
                }
            }
        },
        // 条形码-删除
        onDelete(row) {
            this.tableList = this.tableList.filter(item=>item.placecode != row.placecode);
        },

        // 上传图片-超出上传数量
        uploadExceed(files, fileList) {
            this.$message.warning('最多上传10张图片，请先删除再上传！');
        },
        // 上传图片-前的判断
        uploadChange(file) {
            let type = file.name.substring((file.name.lastIndexOf("\.")) + 1, file.name.length);
            if (type != 'jpeg' && type != 'jpg' && type != 'png' && type != 'JPG' && type != 'JPEG' && type != 'PNG') {
                this.$message.error('上传图片格式不正确，请重新上传!');
                return false;
            }else{
                file.delete = 'mayNot';
                if(this.imgFileList.length > 0) {
                    let flag = true;
                    this.imgFileList.forEach(item => {
                        if(item.name == file.name) {
                            this.$message.error('请勿上传相同图片!');
                            flag = false;
                        }
                    });
                    if(flag) {
                        file.delete = 'sure';
                        this.imgFileList.push(file);
                        return true;
                    }else {
                        return false;
                    }
                } else {
                    file.delete = 'sure';
                    this.imgFileList = [file];
                    return true;
                }
                return false;
            }
        },
        // 上传图片
        uploadRequest(params) {
            this.uploadList = this.imgFileList;
        },
        // 上传图片-删除
        uploadRemove(file) { 
            let params = file.raw;
            if(params.delete == 'sure') {
                this.imgFileList = this.imgFileList.filter(item => item.name != params.name);
            } else if(params.delete == 'deimgpath') {
                this.newEditForm.imgpath = this.newEditForm.imgpath.filter(item => item.name != file.name);
            }
            this.uploadList = this.imgFileList;
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
.el-button--text {
    color: #32AFF0;
}
// 重置
.reset_btn {
    margin: 0 !important;
    margin-left: 10px !important;
    background: #909399 !important;
    border-color: #909399 !important;
}

/deep/ .dialog_newedit_con {
    width: 100%;
    height: 100%;
    .newedit_table {
        width: 80%;
        margin: 0 auto;
        padding: 0;
        padding-bottom: 20px;
        .el-table, .el-table__header-wrapper, .el-table__header, .el-table__body-wrapper, .el-table__body {
            width: 100% !important;
        } 
        .el-button--primary {
            margin-bottom: 20px;
        }
        .el-input.is-disabled .el-input__inner {
            background-color: #fff;
        }
    }
}

// 表单
/deep/ .newedit_form {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    .el-form-item{
        width: 33%;
        margin: 0;
        padding: 0;
        padding-bottom: 20px;
        overflow: hidden;
        display: flex;
        align-items: center;
        .el-form-item__label {
            width: 30% !important;
            white-space: nowrap !important;
        }
        .el-form-item__content {
            flex: 1;
            padding-right: 40px;
            .el-select, .el-input, .el-date-editor {
                width: 100% !important;
            }
            .el-date-editor {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .el-input__icon {
                    width: 25px;
                }
                .el-range-input {
                    flex: 1;
                }
                .el-range-separator {
                    width: 25px;
                    padding: 0 !important;
                }
            }
        }
    }
    .obtain_data {
        .el-form-item__content {
            display: flex;
            align-items: center;
            .el-select, .el-input, .el-date-editor {
                flex: 1;
                margin-right: 10px;
            }
            .el-button--primary {
                padding: 0 10px;
            }
        }  
    }
    .obtain_sampleName {
        .el-form-item__content {
            display: flex;
            align-items: center;
            .el-select, .el-input, .el-date-editor {
                flex: 1;
            }
            .el-input {
                margin-right: 10px;
            }
        } 
    }
    .picture {
        width: 100%;
        align-items: flex-start;
        .el-form-item__label {
            width: 10% !important;
        }
        .el-form-item__content {
            padding-right: 60px;
        }
    }
}
// 任务单号
/deep/ .dialog_taskCode {
    overflow: hidden;
    .el-dialog {
        margin:0 !important;
        padding: 0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        height: 90%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            padding: 0;
            overflow: hidden;
        }
    }
}
// 企业名录
/deep/ .dialog_directories {
    overflow: hidden;
    .el-dialog {
        margin:0 !important;
        padding: 0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        height: 90%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            padding: 0;
            overflow-y: auto;
        }
    }
}

// 上传图片
/deep/ .form_upload {
    display: flex;
    .upload_btn {
        padding: 0;
        width: 60px !important;
        height: 60px !important;
        background: #fbfdff;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        .el-icon-plus {
            font-size: 28px;
            color: #8c939d;
        }
    }
    .el-upload-list {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        .el-upload-list__item {
            width: 45%;
            margin: 0 0 10px 10px;
            height: 60px;
            .el-upload-list__item-thumbnail {
                width: 40px;
                height: 40px;
            }
            .el-upload-list__item-name {
                width: 100%;
                height: 40px;
                line-height: 40px;
                padding: 0;
                padding-left: 60px;
                margin: 0;
                overflow-x: auto;
                position: absolute;
                left: 0;
                
            }
            .el-icon-document{
                width: 40px;
                height: 40px;
                top: 0;
                &:before {
                    display: block;
                    width: 40px;
                    height: 40px;
                    font-size: 40px;
                }
            }
        }
    }
}
</style>