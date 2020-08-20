<template>
    <div class="testProjec-component">
        <el-form
            class="project_form"
            label-width="140px"
            v-bind="{
                model: projectForm,
                size:'mini',
                inline: true,
            }"
        >
            <el-form-item label="编号：">
                <el-input clearable maxlength="30" placeholder="请输入编号" v-model.trim="projectForm.code"></el-input>
            </el-form-item>
            <el-form-item label="设备名称：">
                <el-input clearable maxlength="30" placeholder="请输入设备名称" v-model.trim="projectForm.name"></el-input>
            </el-form-item>
            <el-form-item label="出厂编号：">
                <el-input clearable maxlength="30" placeholder="请输入" v-model.trim="projectForm.factoryCode"></el-input>
            </el-form-item>
            <el-form-item label="生产厂家：">
                <el-input clearable maxlength="30" placeholder="请输入"
                          v-model.trim="projectForm.productCompany"></el-input>
            </el-form-item>
            <el-form-item label="购置日期：">
                <el-date-picker
                    placeholder="选择日期"
                    v-model="projectForm.purchaseDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                />
            </el-form-item>
            <el-form-item label="购置价格：">
                <el-input
                    placeholder="请输入"
                    v-model.trim="projectForm.price"
                    maxlength="30"
                    clearable
                />
            </el-form-item>
            <el-form-item label="国别：">
                <el-input clearable v-model="projectForm.country" maxlength="30" placeholder="请输入"
                          v-bind="{
                              disabled:false,
                          }"
                />
            </el-form-item>
            <el-form-item label="设备状态：">
                <el-select v-model="projectForm.terminalStatus" placeholder="请选择"
                           v-bind="{
                                disabled:true,
                           }"
                >
                    <el-option
                      v-for="(item,index) in $store.state.terminalStatusLIST"
                      :key="index"
                      :label="item.dicTypeName"
                      :value="item.dicTypeCode"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="档案状态：">
                <el-select clearable v-model="projectForm.fileStatus" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in $store.state.fileStatusLIST"
                    :key="index"
                    :label="item.dicTypeName"
                    :value="item.dicTypeCode"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="档案位置：">
                <el-input clearable
                          v-model="projectForm.fileLocation"
                          maxlength="30"
                          placeholder="请输入"
                          v-bind="{
                              disabled:false,
                          }"
                />
            </el-form-item>
            <el-form-item label="使用部门：">
                <el-select v-model="projectForm.useDepartment"
                           clearable
                           placeholder="请选择"
                >
                    <el-option
                      v-for="(item,index) in $store.state.officeList"
                      :key="index"
                      :label="item.org_name"
                      :value="item.id + ''"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="保管人员：">
              <el-input clearable
                        v-model.trim="projectForm.preserver"
                        maxlength="30"
                        v-bind="{
                            disabled:false,
                        }"
              />
            </el-form-item>

            <!-- ***************************** 文本域 ***************************** -->
            <el-form-item label="停用原因：" style="width: 50%;">
                <textarea
                    style="height: 80px;"
                    v-model.lazy.trim="projectForm.deactivatedReason"
                    placeholder="1~30个字符"
                    maxlength="30"
                />
            </el-form-item>
            <el-form-item label="备注：" style="width: 50%;">
                <textarea
                    style="height: 80px;"
                    v-model.lazy.trim="projectForm.bz"
                    placeholder="1~30个字符"
                    maxlength="30"
                />
            </el-form-item>
            <el-form-item label="型号规格：" class="form_item_Up">
                <textarea
                    v-model.lazy.trim="projectForm.model"
                    placeholder="1~50个字符"
                    maxlength="50"
                />
            </el-form-item>
            <el-form-item label="准确度：" class="form_item_Up">
                <textarea
                    v-model.lazy.trim="projectForm.accuracy"
                    placeholder="1~200个字符"
                    maxlength="200"
                />
            </el-form-item>
            <el-form-item label="测量范围：" class="form_item_Up">
                <textarea
                    v-model.lazy.trim="projectForm.rulerange"
                    placeholder="1~200个字符"
                    maxlength="200"
                />
            </el-form-item>

            <!-- *************************** 文件上传 ****************************** -->
            <el-form-item label="验收登记单：" class="form_item_thirty">
                <div class="showK">
                    <span class="showK-span" :title="fileNameList.fileName1">{{fileNameList.fileName1}}</span>
                    <el-button type="primary" @click="activeFile('1')">选择文件</el-button>
                </div>
                <input type="file" id="file1" class="" @change="changeFile('1')">
            </el-form-item>
            <el-form-item label="采购审批单：" class="form_item_thirty">
                <div class="showK">
                    <span class="showK-span" :title="fileNameList.fileName2">{{fileNameList.fileName2}}</span>
                    <el-button type="primary" @click="activeFile('2')">选择文件</el-button>
                </div>
                <input type="file" id="file2" class="" @change="changeFile('2')">
            </el-form-item>
            <el-form-item label="仪器设备采购研究申请表：" class="form_item_thirty form_item_exceed">
                <div class="showK">
                    <span class="showK-span" :title="fileNameList.fileName3">{{fileNameList.fileName3}}</span>
                    <el-button type="primary" @click="activeFile('3')">选择文件</el-button>
                </div>
                <input type="file" id="file3" class="" @change="changeFile('3')">
            </el-form-item>
            <el-form-item label="校准结果确认表：" class="form_item_thirty">
                <div class="showK">
                    <span class="showK-span" :title="fileNameList.fileName5">{{fileNameList.fileName5}}</span>
                    <el-button type="primary" @click="activeFile('5')">选择文件</el-button>
                </div>
                <input type="file" id="file5" class="" @change="changeFile('5')">
            </el-form-item>
            <el-form-item label="其他扫描件：" class="form_item_thirty">
                <div class="showK">
                    <span class="showK-span" :title="fileNameList.fileName6">{{fileNameList.fileName6}}</span>
                    <el-button type="primary" @click="activeFile('6')">选择文件</el-button>
                </div>
                <input type="file" id="file6" class="" @change="changeFile('6')">
            </el-form-item>
        </el-form>
        <slot :fileData="box"></slot>
    </div>
</template>

<script>

    let _projectForm = {
        code: '',// 编号
        name: '',// 设备名称
        factoryCode: '',// 出厂编号
        productCompany: '',// 生产厂家
        purchaseDate: '',// 购置日期
        price: '',// 购置价格
        // 检定时间
        country: '',// 国别
        // 证书类别
        terminalStatus: '1',// 设备状态
        fileStatus: '',// 档案状态
        fileLocation: '',// 档案位置
        useDepartment: '',// 使用部门
        preserver: '',// 保管人员
        deactivatedReason: '',// 停用原因
        bz: '',// 备注
        model: '',//规格型号
        accuracy: '',//准确度
        rulerange: '',//测量范围
    }
    export default {
        name: 'information',

        data () {
            return {
                projectForm: JSON.parse(JSON.stringify(_projectForm)), // 检定项目-表单数据
                bb: '',
                box: {},
                fileNameList: {
                    fileName1: '',// 验收登记单
                    fileName2: '',// 采购审批单
                    fileName3: '',// 仪器设备采购研究申请表
                    //
                    fileName5: '',// 校准结果确认表
                    fileName6: '',// 其他扫描件
                },
            }
        },
        methods: {
            activeFile (index) {
                $(`#file${index}`).click()
            },
            changeFile (index) {
                this.box['upload' + index] = event.target.files[0]
                this.fileNameList[`fileName${index}`] = event.target.files[0].name
            }
        },
    }
</script>

<style scoped lang="less">
    @import '~@/views/equipment/componentsview/style/mlyStyle.less';
</style>
