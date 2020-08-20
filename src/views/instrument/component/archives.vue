<template>
    <!-- 新建/查看--仪器设备档案-对话框 -->
    <div class="archives_box">
        <el-form :model="terminal" :rules="rulesForm" ref="formListRef" size="medium" label-width="180px" class="archives_form">
            <div class="archives_form_list">
                <el-form-item label="编号：" prop="code">
                    <el-input v-model.trim="terminal.code" clearable v-if="pagetype==0"/>
                    <el-input v-model.trim="terminal.code" :disabled="true" v-else/>
                    <el-button type="text" class="operation_btn" v-if="terminal.id == null" @click="onClickEquipmentCopy">查找其他设备，准备复制</el-button>
                </el-form-item>
                <el-form-item label="名称：" prop="name">
                    <el-input v-model.trim="terminal.name" clearable v-if="pagetype==0"/>
                    <el-input v-model.trim="terminal.name" :disabled="true" v-else/>
                </el-form-item>
                <el-form-item label="型号规格：" prop="model">
                    <el-input v-model.trim="terminal.model" type="textarea" maxlength="50" show-word-limit v-if="pagetype==0" />
                    <el-input v-model.trim="terminal.model" type="textarea" maxlength="50" show-word-limit :disabled="true" v-else />
                </el-form-item>
                <el-form-item label="测量范围：">
                    <el-input v-model.trim="terminal.rulerange" type="textarea" maxlength="200" show-word-limit v-if="pagetype==0" />
                    <el-input v-model.trim="terminal.rulerange" type="textarea" maxlength="200" show-word-limit :disabled="true" v-else />
                </el-form-item>
                <el-form-item label="准确度：">
                    <el-input v-model.trim="terminal.accuracy" type="textarea" maxlength="200" show-word-limit v-if="pagetype==0" />
                    <el-input v-model.trim="terminal.accuracy" type="textarea" maxlength="200" show-word-limit :disabled="true" v-else/>
                </el-form-item>
                <el-form-item label="购置日期：">
                    <el-date-picker
                        v-if="pagetype==0"
                        v-model="terminal.purchaseDate"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                    <el-input v-model.trim="terminal.purchaseDate" :disabled="true" v-else/>
                </el-form-item>
                <el-form-item label="出厂编号：">
                    <el-input v-model.trim="terminal.factoryCode" clearable v-if="pagetype==0"/>
                    <el-input v-model.trim="terminal.factoryCode" :disabled="true" v-else/>
                </el-form-item>
                <el-form-item label="生产厂家：">
                    <el-input v-model.trim="terminal.productCompany" clearable v-if="pagetype==0"/>
                    <el-input v-model.trim="terminal.productCompany" :disabled="true" v-else/>
                </el-form-item>
                <el-form-item label="使用单位：">
                    <el-select v-model="terminal.useCompany" v-if="pagetype==0" clearable>
                      <el-option v-for="(item,i) in tbase.list" :key="i" v-show="item.itype==1" 
                          :label="item.code+'_'+item.descript"
                          :value="item.descript">
                      </el-option>
                    </el-select>
                    <el-input v-model.trim="terminal.useCompany" :disabled="true" v-else/>
                </el-form-item>
                <el-form-item label="档案状态：" prop="fileStatus">
                    <el-select v-model="terminal.fileStatus" v-if="pagetype==0" clearable>
                      <el-option v-for="(item,i) in tbase.list" :key="i" v-show="item.itype==0" 
                          :label="item.code+'_'+item.descript"
                          :value="item.descript">
                      </el-option>
                    </el-select>
                    <el-input v-model.trim="terminal.fileStatus" :disabled="true" v-else/>
                </el-form-item>
                <el-form-item label="固定资产编号：">
                    <el-input v-model.trim="terminal.assetnumber" clearable v-if="pagetype==0"/>
                    <el-input v-model.trim="terminal.assetnumber" :disabled="true" v-else/>
                </el-form-item>
                <el-form-item label="设备状态：" v-if="pagetype==0">
                    <el-select v-model="terminal.bz" clearable>
                      <el-option v-for="(item,i) in tbase.list" :key="i" v-show="item.itype==8" 
                          :label="item.code+'_'+item.descript"
                          :value="item.descript">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="原始记录信息编辑：" v-else>
                    <p><span>使用地区：</span><el-input v-model.trim="terminal.userArea" clearable /></p>
                    <p><span>有效期：</span><el-input v-model.trim="terminal.yxq" clearable /></p>
                    <p><span>设备检查终止日期：</span><el-input v-model.trim="terminal.recordLimtTime" clearable /></p>
                    <p><span>同一天最大使用次数：</span><el-input v-model.trim="terminal.maxtimes" clearable /></p>
                    <p>
                        <span>相同任务唯一设备：</span>
                        <el-select v-model="terminal.oneflag">
                            <el-option label="不受限" value="0"></el-option>
                            <el-option label="受限" value="1"></el-option>
                        </el-select>
                    </p>
                    <p><span>车辆类型：</span><el-input v-model.trim="terminal.carType" clearable /></p>
                    <p><span>原始记录判断名称：</span><el-input v-model.trim="terminal.name2" clearable /></p>
                </el-form-item>
                <el-form-item label="固定资产名称：">
                    <el-input v-model.trim="terminal.assetname" clearable/>
                </el-form-item>
                <el-form-item label="购置价格：">
                    <el-input v-model.trim="terminal.price" clearable v-if="pagetype==0"/>
                    <el-input v-model.trim="terminal.price" :disabled="true" v-else/>
                </el-form-item>
                <el-form-item label="验收登记单：" class="form_item_upload">
                    <el-upload
                        class="upload-demo"
                        action="1"
                        multiple
                        :limit="1"
                        :http-request="httpUploadRegister"
                        :on-remove="handleRemoveRegister"
                        :file-list="upload1">
                        <el-button size="small" type="primary">选择文件</el-button>
                    </el-upload>
                    <el-button type="text" class="operation_btn" 
                        v-if="terminalFileMap[0] != null && terminalFileMap[0].length>0"
                        @click="downloadSingle(terminalFileMap[0])"
                    >[验收登记单]
                    </el-button>
                </el-form-item>
                <el-form-item label="采购审批单：" class="form_item_upload">
                    <el-upload
                        class="upload-demo"
                        action="1"
                        multiple
                        :limit="1"
                        :http-request="httpUploadMining"
                        :on-remove="handleRemoveMining"
                        :file-list="upload2">
                        <el-button size="small" type="primary">选择文件</el-button>
                    </el-upload>
                    <el-button type="text" class="operation_btn" 
                        v-if="terminalFileMap[1] != null && terminalFileMap[1].length>0"
                        @click="downloadSingle(terminalFileMap[1])"
                    >[采购审批单]
                    </el-button>
                </el-form-item>
                <el-form-item label="仪器设备采购研制申请表：" class="form_item_upload">
                    <el-upload
                        class="upload-demo"
                        action="1"
                        multiple
                        :limit="1"
                        :http-request="httpUploadStudy"
                        :on-remove="handleRemoveStudy"
                        :file-list="upload3">
                        <el-button size="small" type="primary">选择文件</el-button>
                    </el-upload>
                    <el-button type="text" class="operation_btn" 
                        v-if="terminalFileMap[2] != null && terminalFileMap[2].length>0"
                        @click="downloadSingle(terminalFileMap[2])"
                    >[申请表]
                    </el-button>
                </el-form-item>
                <el-form-item label="校准结果确认表：" class="form_item_upload">
                    <el-upload
                        class="upload-demo"
                        action="1"
                        multiple
                        :limit="1"
                        :http-request="httpUploadResult"
                        :on-remove="handleRemoveResult"
                        :file-list="upload5">
                        <el-button size="small" type="primary">选择文件</el-button>
                    </el-upload>
                    <el-button type="text" class="operation_btn" 
                        v-if="terminalFileMap[4] != null && terminalFileMap[4].length>0"
                        @click="downloadSingle(terminalFileMap[4])"
                    >[校准结果确认表]
                    </el-button>
                </el-form-item>
                <el-form-item label="其他扫描件：" class="form_item_uploadOther">
                    <el-upload
                        class="upload-demo"
                        action="1"
                        multiple
                        :limit="1"
                        :http-request="httpUploadOther"
                        :on-remove="handleRemoveOther"
                        :file-list="upload6">
                        <el-button size="small" type="primary">选择文件</el-button>
                    </el-upload>
                    <el-button type="text" class="operation_btn" 
                        v-if="terminalFileMap[5] != null && terminalFileMap[5].length>0"
                        @click="downloadSingle(terminalFileMap[5])"
                    >[其他扫描件]
                    </el-button>
                </el-form-item>
                <el-form-item label="证书：" v-if="terminal.id != null" class="form_item_uploadBook">
                    <el-upload
                        class="upload-demo"
                        action="1"
                        multiple
                        :limit="1"
                        :http-request="httpUploadBook"
                        :on-remove="handleRemoveBook"
                        :file-list="upload4">
                        <el-button size="small" type="primary">选择文件</el-button>
                    </el-upload>
                    <el-button type="text" class="operation_btn" 
                        v-for="(item,i) in terminalFile.list" :key="i"
                        @click="downloadSingle(item.id)"
                    >{{currentTime}} [证书下载]
                    </el-button>
                </el-form-item>
                <el-form-item label="仪器设备技术档案：">
                    <el-button type="text" class="operation_btn" @click="onClickFileParameter(terminal.id)">配置</el-button>
                    <el-button type="text" class="operation_lastbtn" @click="onClickExportArchives(terminal.id)">下载</el-button>
                </el-form-item>
            </div>
            <div class="hold_btn">
                <el-button type="primary" @click="onClickPreservation">保存</el-button>
            </div>
        </el-form>
        <el-form :model="terminal" size="medium" label-width="180px" class="archives_form" ref="formListBorrow" v-if="terminal.id">
            <div class="borrow_center">
                <el-form-item label="借阅人：" prop="borrow"
                    :rules="[{ required: true, message: '借阅人不能为空，请选择', trigger: 'blur'}]">
                    <el-input v-model.trim="terminal.borrow" clearable v-if="pagetype==0"/>
                </el-form-item>
                <el-form-item label="借阅日期：" prop="borrowdate"
                    :rules="[{ required: true, message: '借阅日期不能为空，请选择', trigger: 'blur'}]">
                    <el-date-picker
                        v-if="pagetype==0"
                        v-model="terminal.borrowdate"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </div>
            <div class="borrow_btn">
                <el-button type="primary" @click="onClickBorrow">借阅</el-button>
            </div>
        </el-form>

        <!-- 新建-编号-设备复制 -->
        <el-dialog
            title="设备列表"
            :visible.sync="newArchivesVisible"
            :before-close="newArchivesClose"
            :close-on-click-modal="false"
            class="newarchives_dialog" width="75%">
            <Newarchives @close="newArchivesClose" :flag="newArchivesVisible"/>
        </el-dialog>

        <!-- 配置 -->
        <el-dialog
            title="配置"
            :visible.sync="disposeVisible"
            :before-close="disposeClose"
            :close-on-click-modal="false"
            class="dispose_dialog" width="50%">
            <Dispose @close="disposeClose" :formDataList="disposeFormList" :terminalId="terminal.id"/>
        </el-dialog>
    </div>
</template>
<script>
import base from '@/api/base.js';
import Dispose from '../component/dispose.vue'; // 配置
import Newarchives from '../component/newArchives.vue'; // 设备列表
export default {
    name: 'archives',
    components: {Newarchives, Dispose},
    props: ['pagetype','tbaseData','terminalData','terminalFileData','terminalFileMapData','archivesVisible'],
    watch: {
        archivesVisible(val){
            this.$refs.formListRef && this.$refs.formListRef.resetFields();
            this.$refs.formListBorrow && this.$refs.formListBorrow.resetFields();
            this.tbase = { // 下拉框数据
                list: this.tbaseData.list ? this.tbaseData.list : [],
            };
            this.terminal = { // 基本数据
                code: this.terminalData.code ? this.terminalData.code : '',
                id: this.terminalData.id ? this.terminalData.id : null,
                name: this.terminalData.name ? this.terminalData.name : '',
                model: this.terminalData.model ? this.terminalData.model : '',
                rulerange: this.terminalData.rulerange ? this.terminalData.rulerange : '',
                accuracy: this.terminalData.accuracy ? this.terminalData.accuracy : '',
                purchaseDate: this.terminalData.purchaseDate ? this.terminalData.purchaseDate : '',
                factoryCode: this.terminalData.factoryCode ? this.terminalData.factoryCode : '',
                productCompany: this.terminalData.productCompany ? this.terminalData.productCompany : '',
                useCompany: this.terminalData.useCompany ? this.terminalData.useCompany : '',
                fileStatus: this.terminalData.fileStatus ? this.terminalData.fileStatus : '',
                assetnumber: this.terminalData.assetnumber ? this.terminalData.assetnumber : '',
                bz: this.terminalData.bz ? this.terminalData.bz : '',
                userArea: this.terminalData.userArea ? this.terminalData.userArea : '',
                yxq: this.terminalData.yxq ? this.terminalData.yxq : '',
                recordLimtTime: this.terminalData.recordLimtTime ? this.terminalData.recordLimtTime : '',
                maxtimes: this.terminalData.maxtimes ? this.terminalData.maxtimes : '',
                oneflag: this.terminalData.oneflag ? this.terminalData.oneflag : '',
                carType: this.terminalData.carType ? this.terminalData.carType : '',
                name2: this.terminalData.name2 ? this.terminalData.name2 : '',
                assetname: this.terminalData.assetname ? this.terminalData.assetname : '',
                price: this.terminalData.price ? this.terminalData.price : '',
                borrow: this.terminalData.borrow ? this.terminalData.borrow : '',
                borrowdate: this.terminalData.borrowdate ? this.terminalData.borrowdate : '',
            };
            // 证书数据
            this.terminalFile = this.terminalFileData ? this.terminalFileData : {};
            // 上传按钮数据
            this.terminalFileMap = this.terminalFileMapData ? this.terminalFileMapData : {};
            this.upload1 = []; // 验收登记单-文件
            this.upload1FileName = null; // 验收登记单-名
            this.upload2 = []; // 采购审批单-文件
            this.upload2FileName = null; // 采购审批单-名
            this.upload3 = []; // 仪器设备采购研制申请表-文件
            this.upload3FileName = null; // 仪器设备采购研制申请表-名
            this.upload5 = []; // 校准结果确认表-文件
            this.upload5FileName = null; // 校准结果确认表-名
            this.upload6 = []; // 其他扫描件-文件
            this.upload6FileName = null; // 其他扫描件-名
            this.upload4 = []; // 证书-文件
            this.upload4FileName = null; // 证书-名
        }
    },
    data() {
        var codeFlag = (rule, value, callback) => {
            if (value) {
                if (/[\u4E00-\u9FA5]/g.test(value)) {
                    callback(new Error('编号不能为汉字！'));
                } else {
                    callback();
                }
            }else{
                callback(new Error('编号不能为空！'))
            }
        };
        return {
            tbase: { // 下拉框数据
                list: this.tbaseData.list ? this.tbaseData.list : [],
            },
            terminal: { // 基本数据
                code: this.terminalData.code ? this.terminalData.code : '',
                id: this.terminalData.id ? this.terminalData.id : null,
                name: this.terminalData.name ? this.terminalData.name : '',
                model: this.terminalData.model ? this.terminalData.model : '',
                rulerange: this.terminalData.rulerange ? this.terminalData.rulerange : '',
                accuracy: this.terminalData.accuracy ? this.terminalData.accuracy : '',
                purchaseDate: this.terminalData.purchaseDate ? this.terminalData.purchaseDate : '',
                factoryCode: this.terminalData.factoryCode ? this.terminalData.factoryCode : '',
                productCompany: this.terminalData.productCompany ? this.terminalData.productCompany : '',
                useCompany: this.terminalData.useCompany ? this.terminalData.useCompany : '',
                fileStatus: this.terminalData.fileStatus ? this.terminalData.fileStatus : '',
                assetnumber: this.terminalData.assetnumber ? this.terminalData.assetnumber : '',
                bz: this.terminalData.bz ? this.terminalData.bz : '',
                userArea: this.terminalData.userArea ? this.terminalData.userArea : '',
                yxq: this.terminalData.yxq ? this.terminalData.yxq : '',
                recordLimtTime: this.terminalData.recordLimtTime ? this.terminalData.recordLimtTime : '',
                maxtimes: this.terminalData.maxtimes ? this.terminalData.maxtimes : '',
                oneflag: this.terminalData.oneflag ? this.terminalData.oneflag : '',
                carType: this.terminalData.carType ? this.terminalData.carType : '',
                name2: this.terminalData.name2 ? this.terminalData.name2 : '',
                assetname: this.terminalData.assetname ? this.terminalData.assetname : '',
                price: this.terminalData.price ? this.terminalData.price : '',
                borrow: this.terminalData.borrow ? this.terminalData.borrow : '',
                borrowdate: this.terminalData.borrowdate ? this.terminalData.borrowdate : '',
            },
            // 证书数据
            terminalFile: this.terminalFileData ? this.terminalFileData : {},
            // 上传按钮数据
            terminalFileMap: this.terminalFileMapData ? this.terminalFileMapData : {},
            upload1: [], // 验收登记单-文件
            upload1FileName: null, // 验收登记单-名
            upload2: [], // 采购审批单-文件
            upload2FileName: null, // 采购审批单-名
            upload3: [], // 仪器设备采购研制申请表-文件
            upload3FileName: null, // 仪器设备采购研制申请表-名
            upload5: [], // 校准结果确认表-文件
            upload5FileName: null, // 校准结果确认表-名
            upload6: [], // 其他扫描件-文件
            upload6FileName: null, // 其他扫描件-名
            upload4: [], // 证书-文件
            upload4FileName: null, // 证书-名
            currentTime: '', // 时间
            rulesForm: { // 校验
                code: [
                    { required: true, validator: codeFlag, trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '名称不能为空！', trigger: 'blur' },
                ],
                model: [
                    { required: true, message: '型号规格不能为空！', trigger: 'blur' },
                ],
                fileStatus: [
                    { required: true, message: '档案状态不能为空，请选择！', trigger: 'blur' },
                ],
            },
            disposeVisible: false, // 配置显示状态
            disposeFormList: {},
            newArchivesVisible: false, // 设备复制显示状态
        }
    },
    created() {},
    mounted() {
        this.getNowTime();
    },
    methods: {
        // 获取当前时间
        getNowTime() {
            let newDate = new Date();
            let year = newDate.getFullYear();
            let month = newDate.getMonth() + 1;
            let date = newDate.getDate();
            let hour = newDate.getHours() < 10 ? "0" + newDate.getHours() : newDate.getHours();
            let minute = newDate.getMinutes() < 10 ? "0" + newDate.getMinutes() : newDate.getMinutes();
            let second = newDate.getSeconds() < 10 ? "0" + newDate.getSeconds() : newDate.getSeconds();
            this.currentTime = year+'-'+month+'-'+date+' '+hour+':'+minute+':'+second;
        },
        // 验收登记单-上传文件
        httpUploadRegister(params) {
            let file = params.file;
            this.upload1 = [file]; // 验收登记单-文件
            this.upload1FileName = file.name; // 验收登记单-名
        },
        // 采购审批单-上传文件
        httpUploadMining(params) {
            let file = params.file;
            this.upload2 = [file]; // 采购审批单-文件
            this.upload2FileName = file.name; // 采购审批单-名
        },
        // 仪器设备采购研制申请表-上传文件
        httpUploadStudy(params) {
            let file = params.file;
            this.upload3 = [file]; // 仪器设备采购研制申请表-文件
            this.upload3FileName = file.name; // 仪器设备采购研制申请表-名
        },
        // 校准结果确认表-上传文件
        httpUploadResult(params) {
            let file = params.file;
            this.upload5 = [file]; // 校准结果确认表-文件
            this.upload5FileName = file.name; // 校准结果确认表-名
        },
        // 其他扫描件-上传文件
        httpUploadOther(params) {
            let file = params.file;
            this.upload6 = [file]; // 其他扫描件-文件
            this.upload6FileName = file.name; // 其他扫描件-名
        },
        // 证书-上传文件
        httpUploadBook(params) {
            let file = params.file;
            this.upload4 = [file]; // 证书-文件
            this.upload4FileName = file.name; // 证书-名
        },
        // 验收登记单-删除文件
        handleRemoveRegister() {
            this.upload1 = []; // 验收登记单-文件
            this.upload1FileName = null; // 验收登记单-名
        },
        // 采购审批单-删除文件
        handleRemoveMining() {
            this.upload2 = []; // 采购审批单-文件
            this.upload2FileName = null; // 采购审批单-名
        },
        // 仪器设备采购研制申请表-删除文件
        handleRemoveStudy() {
            this.upload3 = []; // 仪器设备采购研制申请表-文件
            this.upload3FileName = null; // 仪器设备采购研制申请表-名
        },
        // 校准结果确认表-删除文件
        handleRemoveResult() {
            this.upload5 = []; // 校准结果确认表-文件
            this.upload5FileName = null; // 校准结果确认表-名
        },
        // 其他扫描件-删除文件
        handleRemoveOther() {
            this.upload6 = []; // 其他扫描件-文件
            this.upload6FileName = null; // 其他扫描件-名
        },
        // 证书-删除文件
        handleRemoveBook() {
            this.upload4 = []; // 证书-文件
            this.upload4FileName = null; // 证书-名
        },
        // 点击保存
        onClickPreservation() {
            if(this.terminal.purchaseDate && typeof(this.terminal.purchaseDate) != 'string'){
                let now = new Date(this.terminal.purchaseDate);
                let y = now.getFullYear();
                let m = now.getMonth() + 1;
                let d = now.getDate();
                let date = y + '-';
                if (m < 10) date += "0";
                date += m + '-';
                if (d < 10) date += "0";
                date += d + '';
                this.terminal.purchaseDate = date;
            }
            this.$refs.formListRef.validate((valid) => {
                if (valid) {
                    let params = new FormData();
                        params.append("terminal", JSON.stringify(this.terminal));
                        params.append("upload1", this.upload1[0] ? this.upload1[0] : null);
                        params.append("upload1FileName", this.upload1FileName);
                        params.append("upload2", this.upload2[0] ? this.upload2[0] : null);
                        params.append("upload2FileName", this.upload2FileName);
                        params.append("upload3", this.upload3[0] ? this.upload3[0] : null);
                        params.append("upload3FileName", this.upload3FileName);
                        params.append("upload5", this.upload5[0] ? this.upload5[0] : null);
                        params.append("upload5FileName", this.upload5FileName);
                        params.append("upload6", this.upload6[0] ? this.upload6[0] : null);
                        params.append("upload6FileName", this.upload6FileName);
                        params.append("upload4", this.upload4[0] ? this.upload4[0] : null);
                        params.append("upload4FileName", this.upload4FileName);
                    this.$api.instrumentunit.apiSave(params).then(res => {
                        this.$message({type: 'success', message: res.data.data, duration: 1500});
                        this.$emit('closeDialog');
                    }).catch(error => {
                        this.$message({type: 'error', message: error.data.message, duration: 1500});
                    })
                }
            });
            
        },
        // 点击数据单按钮-下载
        downloadSingle(id) {
            let formEle = document.createElement('form');
                formEle.setAttribute('id', 'formId')
                formEle.setAttribute('method', 'POST');
                formEle.setAttribute('action', base.entrustamend+'/Termianl/download');
                document.body ? document.body.appendChild(formEle) : '';

            //input元素
            let input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', 'id');
            input.setAttribute('value', id);
            formEle ? formEle.appendChild(input) : '';

            let formId = document.getElementById('formId');
            formId.submit();
            document.body.removeChild(formEle);
        },
        // 仪器设备技术档案-配置
        onClickFileParameter(id) {
            let params = { id };
            this.$api.instrumentunit.apiFileParameter(params).then(res => {
                this.disposeFormList = res.data.data.list;
                if(this.disposeFormList){
                    this.disposeVisible = true;
                }
            }).catch(error => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
            })
        },
        // 关闭配置对话框
        disposeClose() {
            this.disposeVisible = false;
        },
        // 仪器设备技术档案-下载
        onClickExportArchives(id) {
            let formEle = document.createElement('form');
                formEle.setAttribute('id', 'formId')
                formEle.setAttribute('method', 'POST');
                formEle.setAttribute('action', base.entrustamend+'/Termianl/exportArchives');
                document.body ? document.body.appendChild(formEle) : '';

            //input元素
            let input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', 'id');
            input.setAttribute('value', id);
            formEle ? formEle.appendChild(input) : '';

            let formId = document.getElementById('formId');
            formId.submit();
            document.body.removeChild(formEle);
        },
        // 点击-借阅
        onClickBorrow() {
            if(this.terminal.borrowdate && typeof(this.terminal.borrowdate) != 'string'){
                let now = new Date(this.terminal.borrowdate);
                let y = now.getFullYear();
                let m = now.getMonth() + 1;
                let d = now.getDate();
                let date = y + '-';
                if (m < 10) date += "0";
                date += m + '-';
                if (d < 10) date += "0";
                date += d + '';
                this.terminal.borrowdate = date;
            }
            this.$refs.formListBorrow.validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.terminal.id,
                        borrow: this.terminal.borrow,
                        borrowdate: this.terminal.borrowdate
                    };
                    this.$api.instrumentunit.apiBorrow(params).then(res => {
                        this.$message({type: 'success', message: res.data.data, duration: 1500});
                        this.$emit('closeDialog');
                    }).catch(error => {
                        this.$message({type: 'error', message: error.data.message, duration: 1500});
                    })
                }
            })
        },
        // 设备复制
        onClickEquipmentCopy() {
            this.newArchivesVisible = true;
        },
        // 关闭设备复制
        newArchivesClose(row) {
            this.$refs.formListRef && this.$refs.formListRef.resetFields();
            this.terminal.name = row.name;
            this.terminal.model = row.model;
            this.terminal.rulerange = row.rulerange;
            this.terminal.accuracy = row.accuracy;
            this.terminal.purchaseDate = row.purchaseDate;
            this.terminal.factoryCode = row.factoryCode;
            this.terminal.productCompany = row.productCompany;
            this.terminal.useCompany = row.useCompany;
            this.terminal.fileStatus = row.fileStatus;
            this.terminal.assetnumber = row.assetnumber;
            this.terminal.bz = row.bz;
            this.terminal.userArea = row.userArea;
            this.terminal.yxq = row.yxq;
            this.terminal.recordLimtTime = row.recordLimtTime;
            this.terminal.maxtimes = row.maxtimes;
            this.terminal.oneflag = row.oneflag;
            this.terminal.carType = row.carType;
            this.terminal.name2 = row.name2;
            this.terminal.assetname = row.assetname;
            this.terminal.price = row.price;
            this.newArchivesVisible = false;
        },
    },
}
</script>
<style scoped lang="less">
.archives_box {
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
.archives_form_list {
    display: flex;
    flex-wrap: wrap;
}
.archives_form .el-form-item{
    width: 50%;
    margin: 0;
    padding: 0;
    margin-bottom: 20px;
    display: flex;
}
/deep/ .archives_form .el-form-item .el-form-item__content {
  flex: 1;
  margin: 0 !important;
}

/deep/ .archives_form .el-form-item .el-select, .archives_form .el-form-item .el-input, .archives_form .el-form-item .el-textarea {
  width: 60% !important;
}
.el-button--default {
  height: 30px;
  background: #fff;
  padding: 0 20px;
  margin: 0;
}

.el-button--primary {
  height: 30px;
  background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
  padding: 0 20px;
  margin: 0;
}
.hold_btn {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}
.borrow_btn {
    display: flex;
    justify-content: center;
}
.borrow_center {
    display: flex;
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
/deep/ .form_item_upload .el-form-item__content{
    display: flex;
    overflow: hidden;
}
/deep/ .form_item_uploadOther .el-form-item__content{
    display: flex;
    align-items: flex-start;
}
/deep/ .form_item_uploadBook .el-button--text {
    display: block !important;
    margin: 0 !important;
    padding: 10px 0 !important;
}

// 设备列表
.newarchives_dialog {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 10% 0;
}
// 设备列表
/deep/ .newarchives_dialog .el-dialog {
  height: 100% !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  backface-visibility:hidden;
}
// 设备列表
/deep/ .newarchives_dialog .el-dialog .el-dialog__body {
  flex: 1 !important;
  overflow: hidden !important;
  padding: 20px;
}

// 配置
.dispose_dialog {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 10% 0;
}
// 配置
/deep/ .dispose_dialog .el-dialog {
  height: 100% !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  backface-visibility:hidden;
}
// 配置
/deep/ .dispose_dialog .el-dialog .el-dialog__body {
  flex: 1 !important;
  overflow: hidden !important;
  padding: 0 !important;
}
</style>