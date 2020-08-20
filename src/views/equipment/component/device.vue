<template>
    <!-- 设备管理-新增/编辑 -->
    <el-dialog
        class="dialog_device"
        :fullscreen="true"
        :modal="false"
        :title="deviceTitle"
        :visible.sync="deviceVisible"
        :before-close="onDeviceClose"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="closeFn_deviceVisible"
    >
        <div class="device_con" v-loading="loading1" element-loading-text="数据保存中">
            <el-tabs
                class="device_card"
                type="border-card"
                v-model="cardName"
            >
                <el-tab-pane label="设备信息" name="information">
                    <Information
                        ref="Information"
                    />
                </el-tab-pane>
                <el-tab-pane label="校准项目" name="testProject">
                    <TestProject
                        ref="TestProject"
                    />
                </el-tab-pane>
            </el-tabs>
        </div>
        <div slot="footer" class="dialog-footer" v-show="showFooter">
            <el-button @click="onDeviceClose">取 消</el-button>
            <el-button type="primary" @click="onDeviceOk">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import Information from './information'
    import TestProject from './testProject'

    export default {
        name: '',
        components: {
            Information,// 设备信息,
            TestProject,// 检定项目
        },
        props: {
            deviceTitle: {
                type: String,
                default: function () {
                    return ''
                }
            },
            deviceVisible: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
            deviceRow: {
                type: Object,
                default: function () {
                    return null
                }
            },
        },
        watch: {
            deviceVisible: {
                immediate: true,
                handler (val) {
                    if (val) {
                    }
                },
            },
            deviceRow: {
                handler (val) {
                    if (!val) {
                    } else {
                      /* 回显文件名 */
                      let fileNameList = {
                        fileName1: '',// 验收登记单
                        fileName2: '',// 采购审批单
                        fileName3: '',// 仪器设备采购研究申请表
                        fileName5: '',// 校准结果确认表
                        fileName6: '',// 其他扫描件
                      }
                      if (val['terminalFiles'] && val['terminalFiles'].length != 0){
                        for (let i=0;i<val['terminalFiles'].length;i++) {
                            let item = val['terminalFiles'][i]
                            if (item.type == 0){
                              fileNameList['fileName1'] = item.fileName
                            }
                            else if (item.type == 1) {
                              fileNameList['fileName2'] = item.fileName
                            }
                            else if (item.type == 2) {
                              fileNameList['fileName3'] = item.fileName
                            }
                            else if (item.type == 4) {
                              fileNameList['fileName5'] = item.fileName
                            }
                            else if (item.type == 5) {
                              fileNameList['fileName6'] = item.fileName
                            }
                        }
                      }
                      this.$refs['Information'].fileNameList = JSON.parse(JSON.stringify(fileNameList))
                      /* 回显检定项目信息 */
                      this.$refs['Information'].projectForm = val['terminal']
                        this.$refs['TestProject'].formList = val['terminalChecks'].map((item, index) => {
                            return {
                                'id': new Date().getTime() + index,
                                'item': item
                            }
                        })
                        // console.log(this.$refs['TestProject'].formList, 'formList')
                    }
                },
            },
          /***********************************************/
          showFooter(val){
            if (!val) {
              this.$refs['TestProject'].show_BOX = false
              this.$refs['TestProject'].onlyDetail = true
            }
          },
        },
        data () {
            return {
              loading1:false,
                cardName: 'information',
                showFooter:true,
            }
        },
        created () {
        },
        mounted () {
        },
        methods: {
            // 新建/编辑-确定
            onDeviceOk () {
                let passFlg = true
                let _this = this
                let _arr = []
                for (let i in _this.$refs['TestProject'].formList) {
                    let item = _this.$refs['TestProject'].formList[i]
                    item.item.formCompThis.validate((valid)=>{
                      if (valid) {
                        let obj = {}
                        for (let key in item.item) {
                          // formCompThis 和 formCompId 一定不能出现在保存编辑接口的参数中,否则会报错
                          if (
                            key !== 'formCompThis' &&
                            key !== 'formCompId'
                          ){
                            obj[key] = item.item[key]
                          }
                        }
                        _arr.push(obj)
                      }else {
                        passFlg = false
                        this.$message.warning({
                          message:'检定项目信息中有未填写信息 !',
                          duration:5000,
                          showClose:true,
                        })
                      }
                    })
                }
                if (!passFlg) return
                let params = new FormData()
                let boxData = this.$refs['Information'].box
                for (let key in boxData) {
                    params.append(key, boxData[key])
                }
                params.append(
                  'terminalVO',
                  JSON.stringify({
                    terminal: _this.$refs['Information'].projectForm,
                    terminalChecks: _arr,
                  })
                )
              this.loading1 = true
                this.$api.eqManage.saveTerminal(params)
                    .then(res => {
                        if(res.data.ok){
                            _this.onDeviceClose()
                        }else {
                            this.$message.warning({
                                message: res.data.message,
                                duration: 5000,
                            })
                        }
                    })
                    .catch((err) => {
                      this.$message.error({
                        message: err.data.message,
                        duration: 5000,
                      })
                    })
                  .then(()=>{
                    this.loading1 = false
                  })

            },
            // 新建 / 编辑-关闭前
            onDeviceClose () {
                this.$emit('deviceClose', 1)
            },
            // 新建 / 编辑-关闭时
            closeFn_deviceVisible () {
                Object.assign(this.$refs['Information'].$data, this.$refs['Information'].$options.data())
                Object.assign(this.$refs['TestProject'].$data, this.$refs['TestProject'].$options.data())
                Object.assign(this.$data, this.$options.data())
              this.$nextTick(()=>{
                this.$refs['TestProject'].$refs['information_form'].clearValidate()
              })
            },
        }
    }
</script>
<style lang="less" scoped>
    @import '~@/views/equipment/componentsview/style/mlyStyle.less';

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

    // 上传按钮
    .upload_btn {
        padding: 0 10px;
    }

    // 设备信息-删除
    .information_delete_btn {
        background: red;
        border-color: red;
    }

    .device_con {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    // 卡片
    .device_card {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        /deep/ .el-tabs__content {
            flex: 1;
            overflow: hidden;

            .el-tab-pane {
                width: 100%;
                height: 100%;
                overflow-y: auto;
            }
        }
    }

    // 检定项目-表单
    /deep/ .project_form {
        margin: 0;
        padding: 0;
        width: 100%;
        display: flex;
        flex-wrap: wrap;

        .el-form-item {
            width: 25%;
            margin: 0;
            padding-bottom: 20px;
            overflow: hidden;
            display: flex;
            align-items: center;

            .el-form-item__label {
                white-space: nowrap;
            }

            .el-form-item__content {
                flex: 1;
                padding-right: 40px;
                overflow: hidden;

                .el-select, .el-input {
                    width: 100% !important;
                }
            }
        }

        .form_item_hundred {
            width: 100%;
        }

        .form_item_Up {
            width: 33.3%;
            align-items: flex-start;
        }

        .form_item_thirty {
            width: 33.3%;

            .el-form-item__content {
                padding-right: 10px;
            }
        }

        .form_item_exceed {
            .el-form-item__label {
                width: 180px !important;
            }
        }
    }

    // 上传
    /deep/ .upload_demo {
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: row-reverse;

        .el-upload--text {
        }

        .el-upload-list {
            flex: 1;
            height: 30px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            margin-right: 10px;
            overflow: hidden;

            .el-upload-list__item {
                margin: 0;

                .el-upload-list__item-name {
                    margin: 0;
                }
            }
        }
    }
</style>
