<template>
    <div style="display: flex;flex-direction: column;">
        <div style="flex: 1;overflow: auto;">
            <el-form
                v-bind="{
                        model:formData,
                        size:'mini',
                        labelWidth:'110px',
                    }"
                label-suffix=" :"
            >
                <el-form-item label="证书号">
                    <div style="margin-bottom: 5px;">{{code}}&nbsp;</div>
                    <template v-for="item in dataList">
                        <div style="margin-bottom: 5px;">
                            <span style="display: inline-block;width: 200px;">{{item.filename}}&nbsp;</span>
                            <el-button type="text">下载</el-button>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="审批文件">
                    <div>
                        <span
                            :title="fileName"
                            class="text-ellipsis"
                            style="display: inline-block;width: 200px;"
                        >{{fileName}}&nbsp;
                        </span>
                        <el-button type="success" @click="beforeFile">选择文件</el-button>
                    </div>
                </el-form-item>
            </el-form>
            <input type="file" id="file_shenpi" style="display: none" @change="fileChange">
        </div>
        <div style="text-align: center;">
            <el-button size="mini" type="primary" @click="uploadApproval" :loading="zan">确定</el-button>
            <el-button size="mini" @click="notFn">取消</el-button>
        </div>
    </div>
</template>

<script>
    // let __formData = {}
    export default {
        name: 'ViewCertificate',
        props: {
            certificateData: {
                type: Array,
                default: function () {
                    return []
                }
            },
        },
        data () {
            return {
                formData: {},
                dataList: [],
                code: '',
                checkingId: '',
                fileName: '',
                fileBOX: null,
                /* ***** */
                zan: false,
            }
        },
        watch: {
            certificateData (val) {
                this.dataList = JSON.parse(JSON.stringify(val))
                this.code = this.dataList[0].certificatecode
            }
        },
        methods: {
            beforeFile () {
                $('#file_shenpi').click()
            },
            fileChange () {
                // debugger
                this.fileName = event.target.files[0].name
                this.fileBOX = event.target.files[0]
            },
            uploadApproval () {
                if (this.fileBOX) {
                    this.zan = true
                    let params = new FormData()
                    params.append('checkingId', this.checkingId)
                    params.append('upload', this.fileBOX)
                    this.$api.VerificationResults.uploadApproval(params)
                        .then((res) => {
                            this.zan = false
                            this.$emit('closeFn1')
                        })
                        .catch()
                } else {
                    this.$emit('closeFn1')
                }
            },
            notFn () {
                this.$emit('closeFn1')
            },
        }
    }
</script>

<style scoped lang="less">
    @import '~@/views/equipment/componentsview/style/ViewCertificate.less';
    .el-button--primary {
      padding: 0 20px;
      margin: 0;
      height: 30px;
      span {
        line-height: 30px;
      }
      background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
      border-radius: 4px;
    }
    .el-button--default {
      padding: 0 20px;
      margin: 0;
      height: 30px;
      span {
        line-height: 30px;
      }
      border-radius: 4px;
    }
</style>
