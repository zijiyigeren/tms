<template>
    <!-- 启动流程 -->
    <el-dialog width="90%" title="启动流程" class="dialog_startUp" center
        :visible.sync="startUpVisible"  :before-close="onStartUpClose"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="startupform_border" id="form_view"></div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="onStartUpClose">取 消</el-button>
            <el-button type="primary" @click="onStartUpOk">保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import '@/assets/css/pending_tasks.css';
import FormHandle from '@/assets/js/FormHandle.js';
export default {
    name: '',
    components: {},
    props: ['startUpVisible', 'startUpRow', 'startUpFormData'],
    watch: {
        startUpVisible: {
            immediate:true,
            handler(val) {
                if(val) {
                    this.obtainData();
                }
            },
        },
    },
    data() {
        return {
            mergeFormData: {}, // 合并表单数据
        }
    },
    created() {},
    mounted() {
        
    },
    methods: {
        // 获取数据
        obtainData() {
            this.$api.flowcheng.startUpForm(this.startUpFormData.id).then(res => {
                console.log(res,'流程表单获取成功');
                // 合并表单数据
                this.mergeFormData = Object.assign({}, this.startUpRow, this.startUpFormData);
                console.log(this.mergeFormData,'合并表单数据');
                
                // 表单-html
                let content = this.mergeFormData.contentHtml;
                if ( this.mergeFormData.id.indexOf('.html') > 0) {
                    content =  this.mergeFormData.id;
                } else {
                    content = FormHandle.formatHtml(content);
                }
                $('#form_view').html(content);

                // 添加默认值
                const obj =  this.mergeFormData.placeholderInfo;
                obj.forEach(item => {
                    $.each($("*[adcform_optional='"+item.key+"']"),function(){
                        var self = $(this);
                        self.val(item.value);
                    });
                });
                // 加权限
                if (this.mergeFormData.id.indexOf('.html') < 0) {
                    FormHandle.formatPriv('#form_view', JSON.parse(this.mergeFormData.privilege));
                }
            }).catch(error => {
                console.log(error,'流程表单获取失败');
                $('#form_view').html('');
                this.$message.error('流程表单获取失败！');
            });
        },
        // 关闭-启动流程
        onStartUpClose() {
            this.$emit('startUpClose');
        },
        // 确认-启动流程
        onStartUpOk() {
            let formdata = FormHandle.formdataGet('#form_view');
            formdata = JSON.stringify(formdata);
            console.log(formdata, 'formdata');
            
            this.$api.flowcheng.startUpExist(this.mergeFormData.processKey).then(res => {
                // console.log(res,'启动获取实例成功');
                let makeupoliet = {
                    processDefinitionId: this.mergeFormData.processId,
                    formData: encodeURIComponent(formdata),
                    message: '发起人'
                };
                if (res.data.data) {
                    // 弹出选人窗口，在回掉函数中获取选中人的数据
                    console.log(res.data.data, '应该弹出选人窗口');
                    this.$message.info('请选择用户'); 
                } else {
                    this.onStartUpProcess(makeupoliet);
                }

            }).catch(error => {
                console.log(error,'启动获取实例失败');
                this.$message.error('获取实例失败'); 
            });
        },
        // 启动流程-确认弹框
        onStartUpProcess(makeupoliet) {
            console.log(makeupoliet,'startUp--确定启动时传参');
            this.$confirm('确认要启动该流程？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.flowcheng.startUpProcess(makeupoliet).then(res => {
                    // console.log(res, '启动流程成功');
                    this.$message.success('启动流程成功！');
                    this.$emit('startUpClose');
                }).catch(error => {
                    console.log(error, '启动流程失败');
                    this.$message.error('启动流程失败！');
                });
            }).catch(() => {
                this.$message.info('已取消启动流程！');
            });
        },
    }
}
</script>
<style scoped lang="less">
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
p {
    padding: 0;
    margin: 0;
}
.startupform_border {
    padding: 20px;
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>