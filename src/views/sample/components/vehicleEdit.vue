<template>
    <!-- 整车列表-新建/编辑 -->
    <div>
        <el-dialog :fullscreen="true" :modal="true" center :title="newEditTitle" class="dialog_newedit"
            :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="newEditVisible" :before-close="onNewEditClose">
            <el-form :model="newEditForm" :rules="newEditRules" ref="neweditform" class="newedit_form" :disabled="disableForm">
                <el-form-item prop="comeCompany" label="送样单位：" class="obtain_data">
                    <el-input clearable placeholder="请获取送样单位" v-model.trim="newEditForm.comeCompany"></el-input>
                    <el-button type="primary" @click="onCompanyObtain">获取</el-button>
                </el-form-item>
                <el-form-item prop="comePeople" label="送样人：">
                    <el-input clearable placeholder="请输入送样人" v-model.trim="newEditForm.comePeople"></el-input>
                </el-form-item>
                <el-form-item prop="contract" label="联系方式：">
                    <el-input clearable placeholder="请输入联系方式" v-model.trim="newEditForm.contract"></el-input>
                </el-form-item>
                <el-form-item prop="comeDate" label="送样日期：">
                    <el-date-picker :clearable="false" v-model="newEditForm.comeDate" type="date" 
                        placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item prop="vin" label="VIN：">
                    <el-input clearable placeholder="请输入VIN" v-model.trim="newEditForm.vin"></el-input>
                </el-form-item>
                <el-form-item prop="model" label="车型：">
                    <el-input clearable placeholder="请输入车型" v-model.trim="newEditForm.model"></el-input>
                </el-form-item>
                <el-form-item prop="fadongjihao" label="发动机号：">
                    <el-input clearable placeholder="请输入发动机号" v-model.trim="newEditForm.fadongjihao"></el-input>
                </el-form-item>
                <el-form-item prop="vinplace" label="VIN位置：">
                    <el-input clearable placeholder="请输入VIN位置" v-model.trim="newEditForm.vinplace"></el-input>
                </el-form-item>
                <el-form-item prop="shangbiao" label="商标：">
                    <el-input clearable placeholder="请输入商标" v-model.trim="newEditForm.shangbiao"></el-input>
                </el-form-item>
                <el-form-item prop="fadongji" label="发动机型号：">
                    <el-input clearable placeholder="请输入发动机型号" v-model.trim="newEditForm.fadongji"></el-input>
                </el-form-item>
                <el-form-item prop="tracking" label="快递单号：">
                    <el-input clearable placeholder="请输入快递单号" v-model.trim="newEditForm.tracking"></el-input>
                </el-form-item>
                <el-form-item prop="leveal" label="保密级别：">
                    <el-select v-model="newEditForm.leveal">
                        <el-option label="普通" value="普通"></el-option>
                        <el-option label="高" value="高"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="exterior" label="外观是否完好：">
                    <el-select v-model="newEditForm.exterior">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="cccFlag" label="有无3C标志：">
                    <el-select v-model="newEditForm.cccFlag">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="keyFlag" label="钥匙是否齐全：">
                    <el-select v-model="newEditForm.keyFlag">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="mainPart" label="主要部分是否齐全：">
                    <el-select v-model="newEditForm.mainPart">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <p class="division_line"></p>
                <el-form-item prop="taskCode" label="任务号：">
                    <el-input v-model.trim="newEditForm.taskCode" :disabled="true"></el-input>
                </el-form-item>
                <!-- <el-form-item prop="taskCode" label="任务号：" class="obtain_data">
                    <el-select clearable v-model="newEditForm.taskCode" placeholder="请获取任务号">
                        <el-option 
                            v-for="(item,i) in taskCodeData" 
                            :key="i"
                            :label="item.taskcode" 
                            :value="item.taskcode">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click="onTaskCode">获取</el-button>
                </el-form-item> -->
                <el-form-item prop="checkType" label="检验类型：">
                    <template-method 
                        :type="'select'"
                        :dicCode="'wholeCheckType'"
                        v-model="newEditForm.checkType"/>
                </el-form-item>
                <el-form-item prop="cfwz" label="存放位置：" class="percent_fifty">
                    <el-input clearable placeholder="请输入存放位置" v-model.trim="newEditForm.cfwz"></el-input>
                </el-form-item>
                <el-form-item prop="bz" label="备注：" class="percent_fifty">
                    <el-input clearable placeholder="请输入备注" v-model.trim="newEditForm.bz"></el-input>
                </el-form-item>
                <p class="division_line"></p>
                <el-form-item label="配件：" class="percent_hundred">
                    <el-checkbox-group v-model="partsList">
                        <el-checkbox label="说明书" name="type"></el-checkbox>
                        <el-checkbox label="电机及控制器" name="type"></el-checkbox>
                        <el-checkbox label="前照灯" name="type"></el-checkbox>
                        <el-checkbox label="转向灯" name="type"></el-checkbox>
                        <el-checkbox label="尾灯组合" name="type"></el-checkbox>
                        <el-checkbox label="后雾灯" name="type"></el-checkbox>
                        <el-checkbox label="后视镜" name="type"></el-checkbox>
                        <el-checkbox label="消声器" name="type"></el-checkbox>
                        <!-- <el-checkbox label="千斤顶" name="type"></el-checkbox> -->
                        <!-- <el-checkbox label="拖车钩" name="type"></el-checkbox> -->
                        <!-- <el-checkbox label="点烟器" name="type"></el-checkbox> -->
                        <!-- <el-checkbox label="备胎" name="type"></el-checkbox> -->
                        <!-- <el-checkbox label="车标" name="type"></el-checkbox> -->
                        <!-- <el-checkbox label="脚垫" name="type"></el-checkbox> -->
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item prop="bk" label="配件-备注：" class="percent_fifty">
                    <el-input clearable placeholder="请输入配件-备注" v-model.trim="newEditForm.bk"></el-input>
                </el-form-item>
                <p class="division_line"></p>
                <el-form-item label="图片：" class="picture">
                    <el-upload class="form_upload" action="#" :limit="10" :file-list="fileList" 
                        list-type="picture" multiple 
                        accept="image/jpg,image/jpeg,image/png,image/JPG,image/JPEG,image/PNG" 
                        :on-remove="uploadRemove"
                        :on-exceed="uploadExceed"
                        :before-upload="uploadChange"
                        :http-request="uploadRequest">
                        <!-- on-change http-request -->
                        <el-button type="primary" class="upload_btn"><i class="el-icon-plus"></i></el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item prop="incomePeople" label="收样人：">
                    <el-input clearable placeholder="请输入收样人" v-model.trim="newEditForm.incomePeople"></el-input>
                </el-form-item>
                <!-- <el-form-item prop="bbplacedetail" label="车位：" class="obtain_data">
                    <el-input clearable placeholder="请输入车位" v-model.trim="newEditForm.bbplacedetail"></el-input>
                    <el-button type="primary" @click="obtainParkingLot">获取</el-button>
                </el-form-item> -->
                <!-- <el-form-item prop="keys" label="配件-钥匙：">
                    <el-input clearable placeholder="请输入配件-钥匙" v-model.trim="newEditForm.keys"></el-input>
                </el-form-item> -->
                <!-- <el-form-item prop="surface" label="配件-外观：">
                    <el-select v-model="newEditForm.surface" placeholder="请选择配件-外观">
                        <el-option label="良好" value="良好"></el-option>
                        <el-option label="微损" value="微损"></el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item prop="envSampleKeepDate" label="留样日期：">
                    <el-date-picker clearable v-model="newEditForm.envSampleKeepDate" type="date" 
                        placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item> -->
                <!-- <el-form-item prop="envSample" label="环保留样：">
                    <el-select v-model="newEditForm.envSample" placeholder="请选择环保留洋">
                        <el-option label="否" value="0"></el-option>
                        <el-option label="是" value="1"></el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item prop="catType" label="车辆类型：">
                    <el-input clearable placeholder="请输入车辆类型" v-model.trim="newEditForm.catType"></el-input>
                </el-form-item> -->
                <!-- <el-form-item prop="createDate" label="生产日期：">
                    <el-date-picker clearable v-model="newEditForm.createDate" type="date" 
                        placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item> -->
                <!-- <el-form-item prop="dipanhao" label="底盘号：">
                    <el-input clearable placeholder="请输入底盘号" v-model.trim="newEditForm.dipanhao"></el-input>
                </el-form-item> -->
                <!-- <el-form-item prop="luntaixinghao" label="轮胎型号：">
                    <el-input clearable placeholder="请输入轮胎型号" v-model.trim="newEditForm.luntaixinghao"></el-input>
                </el-form-item> -->
                <!-- <el-form-item prop="dipan" label="底盘型号：">
                    <el-input clearable placeholder="请输入底盘型号" v-model.trim="newEditForm.dipan"></el-input>
                </el-form-item> -->
                <!-- <el-form-item prop="lichengbiao" label="里程表读数(km)：">
                    <el-input clearable placeholder="请输入里程表读数(km)" v-model.trim="newEditForm.lichengbiao"></el-input>
                </el-form-item> -->
                <!-- <el-form-item prop="biansuqixingshi" label="变速器型式：">
                    <el-select v-model="newEditForm.biansuqixingshi" placeholder="请选择变速器型式">
                        <el-option label="手动" value="手动"></el-option>
                        <el-option label="自动" value="自动"></el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item prop="color" label="车辆颜色：">
                    <el-input clearable placeholder="请输入车辆颜色" v-model.trim="newEditForm.color"></el-input>
                </el-form-item> -->
                <!-- <el-form-item prop="luntaisudujibie" label="轮胎速度级别：">
                    <el-input clearable placeholder="请输入轮胎速度级别" v-model.trim="newEditForm.luntaisudujibie"></el-input>
                </el-form-item> -->
                <!-- <el-form-item prop="note" label="配件-说明书：">
                    <el-select v-model="newEditForm.note" placeholder="请选择配件-说明书">
                        <el-option label="√" value="√"></el-option>
                        <el-option label="×" value="×"></el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item prop="jack" label="配件-千斤顶：">
                    <el-select v-model="newEditForm.jack" placeholder="请选择配件-千斤顶">
                        <el-option label="√" value="√"></el-option>
                        <el-option label="×" value="×"></el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item prop="hitch" label="配件-拖车钩：">
                    <el-select v-model="newEditForm.hitch" placeholder="请选择配件-拖车钩">
                        <el-option label="√" value="√"></el-option>
                        <el-option label="×" value="×"></el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item prop="cigarette" label="配件-点烟器：">
                    <el-select v-model="newEditForm.cigarette" placeholder="请选择配件-点烟器">
                        <el-option label="√" value="√"></el-option>
                        <el-option label="×" value="×"></el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item prop="shoe" label="配件-备胎：">
                    <el-select v-model="newEditForm.shoe" placeholder="请选择配件-备胎">
                        <el-option label="√" value="√"></el-option>
                        <el-option label="×" value="×"></el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item prop="carsign" label="配件-车标：">
                    <el-select v-model="newEditForm.carsign" placeholder="请选择配件-车标">
                        <el-option label="√" value="√"></el-option>
                        <el-option label="×" value="×"></el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item prop="mat" label="配件-脚垫：">
                    <el-select v-model="newEditForm.mat" placeholder="请选择配件-脚垫">
                        <el-option label="√" value="√"></el-option>
                        <el-option label="×" value="×"></el-option>
                    </el-select>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer" :center="true" width="100%">
                <el-button @click="onNewEditClose">取 消</el-button>
                <el-button type="primary" @click="onNewEditOk">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 获取车位 -->
        <el-dialog title="获取车位" :modal="false" :fullscreen="true" class="dialog_parkingLot"
            :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="parkingLotVisible">
            <div class="parkingLot_con">
                <el-form :model="parkingLotForm" class="parkingLot_form">
                    <el-form-item label="第x车场：">
                        <el-select v-model="parkingLotForm.yard" placeholder="请选择车场" @change="onYardChange">
                            <el-option
                                v-for="(item,i) in yardData" :key="i"
                                :label="item.areaCode"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="第x排：">
                        <el-select v-model="parkingLotForm.carRow" placeholder="请选择排" @change="onCarRowChange">
                            <el-option
                                v-for="(item,i) in carPlatoon" :key="i"
                                :label="'第 '+item.line+' 排'"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="parkingLot_box">
                    <div class="parkingLot_list">
                        <div v-for="(item,i) in carPosition" :key="i" class="parkingLot_item">
                            <p v-if="item.status==1&&item.vincode!=null">
                                <span>{{item.vincode}}</span>
                                <span>{{item.comeCompany}}</span>
                            </p>
                            <p v-else-if="item.status==1&&item.vincode==null">
                                <span>车位占用</span>
                                <span>无车信息</span>
                            </p>
                            <p v-else>空闲</p>
                            <el-button type="text" @click="onParkingLotClose(item)">第 {{item.linenumber}} 位</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- 企业名录 -->
        <el-dialog width="90%" title="企业名录" class="dialog_directories"
            :visible.sync="directoriesVisible" :destroy-on-close="true"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <BusinessLists :show-radio="1">
                <template slot-scope="{ currentRadio }">
                {{ getDirectories('directories', currentRadio) }}
                </template>
            </BusinessLists>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="directoriesVisible = false">取消</el-button>
                <el-button size="mini" type="primary" @click="onDirectoriesOk">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import base from '@/api/base.js';
import TemplateMethod from '@/components/TemplateMethod';
import BusinessLists from '@/components/PublicTools/enterprise/index.vue';
export default {
    name: '',
    components: {TemplateMethod, BusinessLists},
    props: ['newEditRow','newEditTitle','newEditVisible'],
    watch: {
        newEditVisible: {
            immediate:true,
            handler(val) {
                this.getDate();
                if(val){
                    if(this.newEditTitle == '新增整车样品'){
                        this.onNewAdd();
                        this.disableForm = false;
                    }else if(this.newEditTitle == '编辑') {
                        this.onEdit();
                        this.disableForm = false;
                    } else if(this.newEditTitle == '详细') {
                        this.onEdit();
                        this.disableForm = true;
                    }
                } else {
                    this.partsList = []; // 配件-选择数据
                    this.taskCodeData = []; // 任务号-列表数据
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
            newEditForm: { // 新建/编辑-表单数据
                id: '',
                registerPath: '', // 样品登记表路径(必传)
                comeCompany: '', // 送样单位
                comePeople: '', // 送样人
                contract: '', // 联系方式
                comeDate: this.dateform, // 送样日期
                vin: '', // vin
                model: '', // 车型
                fadongjihao: '', // 发动机号
                vinplace: '', // vin位置
                shangbiao: '', // 商标
                fadongji: '', // 发动机型号
                tracking: '', // 快递单号
                leveal: '普通', // 保密级别
                exterior: '1', // 外观是否完好
                cccFlag: '1', // 有无3C标志
                keyFlag: '1', // 钥匙是否齐全
                mainPart: '1', // 主要部件是否齐全
                taskCode: '', // 任务号
                checkType: '国产车', // 检验类型
                cfwz: '', // 存放位置
                bz: '', // 备注
                // 配件--{
                    note: '×', // 说明书
                    elecAndCont: '×', // 电机及控制器
                    headlamp: '×', // 前照灯
                    turnSignal: '×', // 转向灯
                    taillight: '×', // 尾灯组合
                    rearFogLamps: '×', // 后雾灯
                    rearviewMirror: '×', // 后视镜
                    silencer: '×', // 消声器
                    // jack: '×', // 千斤顶
                    // hitch: '×', // 拖车钩
                    // cigarette: '×', // 点烟器
                    // shoe: '×', // 备胎
                    // carsign: '×', // 车标
                    // mat: '×', // 脚垫
                // }--配件
                bk: '', // 配件-备注
                imgPath: '', // 图片
                incomePeople: JSON.parse(localStorage.getItem("userInfo")).username, // 收样人


                // bbplacedetail: '', // 车位
                // envSampleKeepDate: '', // 留样日期
                // envSample: '0', // 环保留样
                // catType: '', // 车辆类型
                // createDate: '', // 生产日期
                // dipanhao: '', // 底盘号
                // luntaixinghao: '', // 轮胎型号
                // dipan: '', // 底盘型号
                // lichengbiao: '', // 里程表读数(km)
                // biansuqixingshi: '手动', // 变速器型式
                // color: '', // 车辆颜色
                // keys: '', // 配件-钥匙
                // surface: '良好', // 配件-外观
                // incomePeople: '',
                // luntaisudujibie: '', // 轮胎速度级别
            },
            newEditRules: { // 新建/编辑-校验
                // taskCode: [
                //     {required:false,min:0,max:9,message:'最多可输入9个字符',trigger:'blur'},
                // ],
                comeCompany: [
                    {required: true, message: '送样单位不能为空', trigger: 'blur'},
                    {max: 50, message: '最多可输入50个字符', trigger: 'blur'},
                ],
                comePeople: [
                    {required: true, message: '送样人不能为空', trigger: 'blur'},
                    {max: 10, message: '最多可输入10个字符', trigger: 'blur'},
                ],
                contract: [
                    {required: true, message: '联系方式不能为空', trigger: 'blur'},
                    {pattern:  /^1[3|4|5|7|8][0-9]{9}$/, message: '联系方式格式错误', trigger: 'blur'},
                ],
                comeDate: [
                    {required: true, message: '送样日期不能为空', trigger: 'blur'},
                ],
                vin: [
                    {required: true, message: 'VIN不能为空', trigger: 'blur'},
                    {max: 17, message: '最多可输入17个字符', trigger: 'blur'},
                ],
                model: [
                    {required: true, message: '车型不能为空', trigger: 'blur'},
                    {max: 30, message: '最多可输入30个字符', trigger: 'blur'},
                ],
                incomePeople: [
                    {required: true, message: '收样人不能为空', trigger: 'blur'},
                    {max: 10, message: '最多可输入10个字符', trigger: 'blur'},
                ],
                bz: [
                    {required:false,min:0,max:50,message:'最多可输入50个字符',trigger:'blur'},
                ],
                bk: [
                    {required:false,min:0,max:50,message:'最多可输入50个字符',trigger:'blur'},
                ],
                // keys: [
                //     {required:false,min:0,max:10,message:'最多可输入10个字符',trigger:'blur'},
                //     {pattern: /^[0-9]+$/, message: '配件-钥匙数量必须为数字', trigger: 'blur' },
                // ],
            },

            dateform: '', // 当前日期
            partsList: [], // 配件-选择数据
            taskCodeData: [], // 任务号-列表数据

            imgUrl: base.baseImgUrl, // 上传图片-回显路径
            uploadList: [], // 图片
            fileList: [], // 上传图片-绑定数据
            imgFileList: [], // 上传图片-处理数据

            directoriesVisible: false, // 企业名录-显示状态
            directories: '', // 企业名录-插槽数据

            parkingLotVisible: false, // 车位-显示状态
            yardData: [], // 车位-车场数据
            carPlatoon: [], // 车位-排数据
            carPosition: [], // 车位-车位数据
            parkingLotForm: { // 车位-筛选数据
                yard: '',
                carRow: '',
            }, 
            bbplaceidYard: '', // 车位-绑定车场
            bbplaceidCarRow: '', // 车位-绑定排
        }
    },
    created() {
        
    },
    mounted() {
        
    },
    methods: {
        // 获取当前日期
        getDate() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            this.dateform = year + "-" + month + "-" + day;
        },
        // 新建
        onNewAdd() {
            this.newEditForm = {
                id: '',
                registerPath: '', // 样品登记表路径(必传)
                comeCompany: '', // 送样单位
                comePeople: '', // 送样人
                contract: '', // 联系方式
                comeDate: this.dateform, // 送样日期
                vin: '', // vin
                model: '', // 车型
                fadongjihao: '', // 发动机号
                vinplace: '', // vin位置
                shangbiao: '', // 商标
                fadongji: '', // 发动机型号
                tracking: '', // 快递单号
                leveal: '普通', // 保密级别
                exterior: '1', // 外观是否完好
                cccFlag: '1', // 有无3C标志
                keyFlag: '1', // 钥匙是否齐全
                mainPart: '1', // 主要部件是否齐全
                taskCode: '', // 任务号
                checkType: '国产车', // 检验类型
                cfwz: '', // 存放位置
                bz: '', // 备注
                // 配件--{
                    note: '×', // 说明书
                    elecAndCont: '×', // 电机及控制器
                    headlamp: '×', // 前照灯
                    turnSignal: '×', // 转向灯
                    taillight: '×', // 尾灯组合
                    rearFogLamps: '×', // 后雾灯
                    rearviewMirror: '×', // 后视镜
                    silencer: '×', // 消声器
                // }--配件
                bk: '', // 配件-备注
                imgPath: '', // 图片
                incomePeople: JSON.parse(localStorage.getItem("userInfo")).username, // 收样人
            };
        },
        // 编辑
        onEdit() {
            if(this.newEditRow.id) {
                this.$api.vehicle.editCarload({id: this.newEditRow.id}).then(res => {
                    // console.log(res, '获取编辑信息成功res');
                    let data = res.data.data;
                    for (let i in this.newEditForm) {
                        if(data[i]){
                            this.newEditForm[i] = data[i];
                        }
                    }

                    // 配件
                    this.partsList = [];
                    if (this.newEditForm.note == '√') this.partsList.push('说明书');
                    if (this.newEditForm.elecAndCont == '√') this.partsList.push('电机及控制器');
                    if (this.newEditForm.headlamp == '√') this.partsList.push('前照灯');
                    if (this.newEditForm.turnSignal == '√') this.partsList.push('转向灯');
                    if (this.newEditForm.taillight == '√') this.partsList.push('尾灯组合');
                    if (this.newEditForm.rearFogLamps == '√') this.partsList.push('后雾灯');
                    if (this.newEditForm.rearviewMirror == '√') this.partsList.push('后视镜');
                    if (this.newEditForm.silencer == '√') this.partsList.push('消声器');
                    // if (this.newEditForm.jack == '√') this.partsList.push('千斤顶');
                    // if (this.newEditForm.hitch == '√') this.partsList.push('拖车钩');
                    // if (this.newEditForm.cigarette == '√') this.partsList.push('点烟器');
                    // if (this.newEditForm.shoe == '√') this.partsList.push('备胎');
                    // if (this.newEditForm.carsign == '√') this.partsList.push('车标');
                    // if (this.newEditForm.mat == '√') this.partsList.push('脚垫');

                    // 图片
                    if( this.newEditForm.imgPath && this.newEditForm.imgPath != 'null' ) {
                        this.newEditForm.imgPath = JSON.parse(this.newEditForm.imgPath);
                        this.newEditForm.imgPath.forEach(item => {
                            this.fileList.push({
                                name: item.name,
                                url: this.imgUrl + 'api/file/' + item.imgPath,
                                raw: {
                                    delete: 'deImgPath'
                                }
                            });
                        });
                    }
                }).catch((error) => {
                    console.log(error, '获取编辑信息失败error');
                    this.onNewAdd();
                });
            }
        },
        // 保存-新建/编辑-对话框
        onNewEditOk() {
            if(this.disableForm) {
                this.$emit('newEditClose', 1);
            } else {
                this.$refs.neweditform.validate((valid) => {
                    if (valid) {
                        // 配件-处理
                        this.newEditForm.note = '×'; // 说明书
                        this.newEditForm.elecAndCont = '×'; // 电机及控制器
                        this.newEditForm.headlamp = '×'; // 前照灯
                        this.newEditForm.turnSignal = '×'; // 转向灯
                        this.newEditForm.taillight = '×'; // 尾灯组合
                        this.newEditForm.rearFogLamps = '×'; // 后雾灯
                        this.newEditForm.rearviewMirror = '×'; // 后视镜
                        this.newEditForm.silencer = '×'; // 消声器
                        if(this.partsList.length > 0) {
                            this.partsList.forEach(item => {
                                if (item == '说明书') {
                                    this.newEditForm.note = '√';
                                } else if (item == '电机及控制器') {
                                    this.newEditForm.elecAndCont = '√';
                                } else if (item == '前照灯') {
                                    this.newEditForm.headlamp = '√';
                                } else if (item == '转向灯') {
                                    this.newEditForm.turnSignal = '√';
                                } else if (item == '尾灯组合') {
                                    this.newEditForm.taillight = '√';
                                } else if (item == '后雾灯') {
                                    this.newEditForm.rearFogLamps = '√';
                                } else if (item == '后视镜') {
                                    this.newEditForm.rearviewMirror = '√';
                                } else if (item == '消声器') {
                                    this.newEditForm.silencer = '√';
                                } 
                                // else if (item == '千斤顶') {
                                //     this.newEditForm.jack = '√';
                                // } else if (item == '拖车钩') {
                                //     this.newEditForm.hitch = '√';
                                // } else if (item == '点烟器') {
                                //     this.newEditForm.cigarette = '√';
                                // } else if (item == '备胎') {
                                //     this.newEditForm.shoe = '√';
                                // } else if (item == '车标') {
                                //     this.newEditForm.carsign = '√';
                                // } else if (item == '脚垫') {
                                //     this.newEditForm.mat = '√';
                                // }
                            });
                        }
                        // 图片
                        if(this.newEditForm.imgPath!='null' && this.newEditForm.imgPath && this.newEditForm.imgPath.length > 0) {
                            this.newEditForm.imgPath = JSON.stringify(this.newEditForm.imgPath);
                        } else {
                            this.newEditForm.imgPath =  '';
                        }
                        let params = new FormData();
                        // 上传-图片
                        if(this.uploadList.length > 0) {
                            this.uploadList.forEach(item => {
                                params.append('uploadList',item);
                            });
                        }
                        for(var i in this.newEditForm){
                            params.append(i, this.newEditForm[i]);
                        }
                        this.$api.vehicle.addCarload(params).then(res => {
                            // console.log(res, '新建/编辑成功res');
                            if(this.newEditTitle == '新增整车样品') {
                                this.$message.success('新建成功');
                                this.$emit('newEditClose', 0);
                            }else if(this.newEditTitle == '编辑') {
                                this.$message.success('编辑成功');
                                this.$emit('newEditClose', 1);
                            }
                            this.$refs.neweditform.resetFields();
                        }).catch((error) => {
                            console.log(error, '新建/编辑失败error');
                            if(this.newEditTitle == '新增整车样品') {
                                this.$message.error('新建失败');
                                this.$emit('newEditClose', 0);
                            }else if(this.newEditTitle == '编辑') {
                                this.$message.error('编辑失败');
                                this.$emit('newEditClose', 1);
                            }
                            this.$refs.neweditform.resetFields();
                        });
                    }
                }); 
            }
        },
        // 关闭-新建/编辑-对话框
        onNewEditClose() {
            this.$refs.neweditform.resetFields();
            this.$emit('newEditClose', 0);
        },
        // 获取任务号
        onTaskCode() {
            if(this.newEditForm.model) {
                this.$api.vehicle.selectTaskcode({model: this.newEditForm.model}).then(res => {
                    console.log(res, '获取任务号res');
                    this.taskCodeData = res.data.data;
                }).catch((error) => {
                    console.log(error, '获取任务号失败error');
                })
            }else {
                this.$message.error('请先填写车型，才可以获取任务号！');
            }
            
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
                    if(this.newEditForm.imgPath.length > 0) {
                        let index = file.name.lastIndexOf(".");  
                        let fileName = file.name.substring(0, index);
                        let imgpath = this.newEditForm.imgPath.filter(item => {return item.name == fileName });
                        if(imgpath.length > 0) {
                            this.$message.error('请勿上传相同图片!');
                            return false;
                        } else {
                            file.delete = 'sure';
                            this.imgFileList = [file];
                            return true;
                        }
                    } else {
                        file.delete = 'sure';
                        this.imgFileList = [file];
                        return true;
                    }
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
            } else if(params.delete == 'deImgPath') {
                this.newEditForm.imgPath = this.newEditForm.imgPath.filter(item => item.name != file.name);
            }
            this.uploadList = this.imgFileList;
        },

        // 企业名录-点击-送样单位的获取
        onCompanyObtain() {
            this.directoriesVisible = true;
        },
        // 企业名录- 获取-插槽数据
        getDirectories (key, data) {
            console.log(data, 'data');
            this[key] = data;
        },
        // 企业名录-送样单位绑定值
        onDirectoriesOk() {
            console.log(this.directories, 'this.directories');
            this.newEditForm.comeCompany = this.directories.entName;
            this.directoriesVisible = false;
        },

        // 车位-获取车场
        obtainParkingLot() {
            this.parkingLotForm = {
                yard: '',
                carRow: '',
            };
            this.yardData = []; // 车场数据
            this.carPlatoon = []; // 排数据
            this.carPosition = []; // 车位数据
            this.bbplaceidYard = '';
            this.bbplaceidCarRow = '';
            this.parkingLotVisible = true;
            this.$api.vehicle.findStoreroom({itype: 1}).then(res => {
                this.yardData = res.data.data;
            }).catch((error) => {
                console.log(error, '获取车场失败error');
            })
        },
        // 车位-车场改变时-获取排数据
        onYardChange(val) {
            this.parkingLotForm.carRow = '';
            this.carPlatoon = []; // 排数据
            this.carPosition = []; // 车位数据
            this.yardData.forEach(item => {
                if(item.id == val){
                    this.bbplaceidYard = item.areaCode;
                    this.$api.vehicle.findPlaceBaseChild({placebaseid: item.id}).then(res => {
                        this.carPlatoon = res.data.data.list;
                    }).catch((error) => {
                        console.log(error, '获取排失败error');
                    })
                }
            });
        },
        // 车位-排时-获取车位
        onCarRowChange(val) {
            this.carPosition = []; // 车位数据
            this.carPlatoon.forEach(item => {
                if(item.id == val){
                    this.bbplaceidCarRow = '第'+item.line+'排';
                    let params = {
                        activeDate: '',
                        childid: item.id
                    }
                    this.$api.vehicle.findPlace(params).then(res => {
                        this.carPosition = res.data.data.list;
                    }).catch((error) => {
                        console.log(error, '获取车位失败error');
                    })
                }
            });
        },
        // 车位-关闭获取车位对话框
        onParkingLotClose(row) {
            this.newEditForm.bbplacedetail = this.bbplaceidYard +' '+ this.bbplaceidCarRow +' '+ row.linenumber+'位';
            this.parkingLotVisible = false;
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
// 分割线
.division_line {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
    margin: 10px 0 30px 0;
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
            white-space: nowrap;
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
    .percent_fifty {
        width: 100%;
        .el-form-item__label {
            width: 10% !important;
        }
        .el-form-item__content {
            flex: none;
            width: 53.3% !important;
            padding-right: 0;
        }
    }
    .percent_hundred {
        width: 100%;
        .el-form-item__label {
            width: 10% !important;
        }
        .el-form-item__content {
            padding-right: 60px;
            .el-checkbox-group {
                display: flex;
            }
        }
    }
    .obtain_data {
        width: 33%;
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
// 车位弹框
/deep/ .dialog_parkingLot {
    overflow: hidden;
    .el-dialog {
        margin:0 !important;
        padding: 0 !important;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1 !important;
            padding: 0;
            overflow: hidden;
            .parkingLot_con {
                width: 100%;
                height: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                .parkingLot_box {
                    padding: 0 20px 20px 20px;
                    flex: 1;
                    overflow-y: auto;
                    .parkingLot_list {
                        display: flex;
                        flex-wrap: wrap;
                        .parkingLot_item {
                            width: 100px;
                            height: 100px;
                            margin: 5px;
                            border: 1px solid rgba(0, 0, 0, 0.1);
                            display: flex;
                            flex-direction: column;
                            p {
                                flex: 1;
                                margin: 0;
                                padding: 0;
                                padding-top: 10px;
                                text-align: center;
                                span{
                                    display: block;
                                    text-align: center;
                                }
                            }
                            .el-button--text {
                                padding: 10px 0;
                                width: 100%;
                            }
                        }
                    }
                }
            }
        }
    }
}
// 车位表单
/deep/ .parkingLot_form {
    margin: 0;
    padding: 20px 0;
    display: flex;
    flex-wrap: wrap;
    .el-form-item{
        width: 50%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        display: flex;
        align-items: center;
        .el-form-item__label {
            width: 30% !important;
            white-space: nowrap;
        }
        .el-form-item__content {
            width: 40%;
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