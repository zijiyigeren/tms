<template>
    <div style="display: flex;flex-direction: column;">
        <div style="flex: 1;overflow: auto;">
            <el-form
                v-bind="{
                    model:maintenanceRecord,
                    size:'mini',
                    labelWidth:'90px',
                }"
                label-suffix=" :"
            >
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="设备编号">
                            <el-input v-model="maintenanceRecord.code" :readonly="allReadonly">
                                <el-button class="el-icon-search" slot="append" @click="openInner"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="设备名称">
                            <el-input v-model="maintenanceRecord.name" :readonly="allReadonly"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="设备型号">
                            <el-input v-model="maintenanceRecord.model" :readonly="allReadonly"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="生产厂家">
                            <el-input v-model="maintenanceRecord.productCompany" :readonly="allReadonly"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="使用部门">
                            <el-input v-model="maintenanceRecord.useCompany" :readonly="allReadonly"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="维护人员">
                            <el-input v-model="maintenanceRecord.maintenancePersonnel" :readonly="allReadonly"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="保养时间">
                            <el-input v-model="maintenanceRecord.maintenanceTime" :readonly="allReadonly"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="备注">
                            <textarea v-model.lazy="maintenanceRecord.remarks" maxlength="20"
                                      :readonly="allReadonly"></textarea>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="保养信息">
                            <div style="display: flex;overflow: hidden;">
                                <span
                                    class="text-ellipsis"
                                    style="display: inline-block;flex: 1;cursor: default;border-bottom: 1px solid #DCDFE6;margin-right: 9px; "
                                    :title="activeFileName"
                                >{{activeFileName}}
                                </span>
                                <el-button @click="activeFile" type="success" :disabled="allReadonly">选择文件</el-button>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <input type="file" id="file_baoyang" style="display: none" @change="fileChange">
        <div style="text-align: center;" v-if="!allReadonly">
            <el-button size="mini" @click="cancelFn" class="btn-other">取消</el-button>
            <el-button size="mini" type="primary" @click="addRecord">确定</el-button>
        </div>
    </div>
</template>

<script>
    let _maintenanceRecord = {
        id: null,// (编辑状态下才有效)
        code: '', //设备编号
        name: '',//设备名称
        model: '',//设备型号
        productCompany: '',//生产厂家
        useCompany: '',//使用部门
        maintenancePersonnel: '', // 维护人员
        maintenanceTime: '', //保养时间
        remarks: '', //备注
        maintenanceName: null, //保养信息文件名称
        maintenanceId: null, //保养信息文件id
    }
    export default {
        name: 'eqMaintenanceInfor',
        data () {
            return {
                maintenanceRecord: JSON.parse(JSON.stringify(_maintenanceRecord)),
                activeFileName: '',
                fileObj: null,
                allReadonly: false,
            }
        },
        watch: {
            'maintenanceRecord.maintenanceName': {
                handler (val) {
                    if (val) this.activeFileName = val
                }
            },
            'maintenanceRecord.maintenanceId': {
                handler () {

                }
            },
        },
        methods: {
            /* *********************** */
            activeFile () {
                $('#file_baoyang').click()
            },
            fileChange () {
                this.activeFileName = event.target.files[0].name
                this.fileObj = event.target.files[0]
            },
            /* ************************ */
            addRecord () {
                let temp = {...this.maintenanceRecord}
                delete temp.ids
                delete temp.list
                delete temp.pageHtml
                delete temp.total
                delete temp.currentPage
                delete temp.pageSize
                delete temp.version
                delete temp.createDate
                delete temp.page
                delete temp.maintenanceName
                delete temp.maintenanceId
                let data = new FormData()
                data.append('maintenanceRecord', JSON.stringify(temp))
                data.append('upload', this.fileObj)
                this.$api.eqMaintenance.addRecord(data)
                    .then(res => {
                        this.$emit('closeFn2')
                    })
                    .catch()

            },
            cancelFn () {
                this.$emit('closeFn2')
            },
            /* ************************ */
            openInner(){
                this.$emit('openInnerFn')
            },
        }
    }
</script>

<style scoped lang="less">
    @import "~@/views/equipment/componentsview/style/eqMaintenance.less";
</style>
