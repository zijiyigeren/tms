<template>
    <!-- 配置 -->
    <div class="dispose_box" v-if="formList">
        <el-form ref="formList" label-width="auto" class="dispose_form">
            <div class="form_list">
                <el-form-item :label="item.code+'：'" v-for="item in formList" :key="item.id">
                    <el-select v-model="item.value" v-if="item.type==2">
                      <el-option v-for="(em,i) in item.typeValueMap" :key="i"
                          :label="em.value"
                          :value="em.value">
                      </el-option>
                    </el-select>
                    <el-input v-model.trim="item.value" v-else/>
                </el-form-item>
            </div>
            <div class="form_btn">
                <el-button type="primary" @click="onClickPreservation">保存</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
import base from '@/api/base.js';
export default {
    name: 'dispose',
    components: {},
    props: ['formDataList', 'terminalId'],
    watch: {
        formDataList(val){
            this.formList = val ? val : []
        }
    },
    data() {
        return {
            formList: this.formDataList ? this.formDataList : []
        }
    },
    created() {},
    mounted() {},
    methods: {
        // 点击保存
        onClickPreservation() {
            // this.formList
            let file = '{';
            this.formList.forEach(item => {
                file = file + '"'+item.code+'"' + ':' + (item.value?'"'+item.value+'"': '""') + ',';
            });
            file = file.slice(0,file.length-1) + '}' ;
            let params = {
                terminalId: this.terminalId ? this.terminalId : '""',
                fileParameterJson: file
            }
            this.$api.instrumentunit.apiSaveFileParameter(params).then(res => {
                this.$message({type: 'success', message: res.data.data, duration: 1500});
                this.$emit('close');
            }).catch(error => {
                this.$message({type: 'error', message: error.data.message, duration: 1500});
            })
        },
    },
}
</script>
<style scoped lang="less">
.el-button--primary {
  height: 30px;
  background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
  padding: 0 20px;
  margin: 0;
}
.dispose_box {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.dispose_form {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
/deep/ .form_list {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    .el-form-item {
        padding: 0;
        margin: 0;
        margin-bottom: 20px;
        display: flex;
        .el-form-item__label-wrap {
            margin: 0 !important;
            width: 30% !important;
            display: flex;
            justify-content: flex-end;
            .el-form-item__label {
                float: right !important;
            }
        }
        .el-form-item__content {
            margin: 0 !important;
            width: 50% !important;
            .el-input {
                width: 100% !important;
            }
            .el-select {
                width: 100% !important;
            }
        }
    }
}
.form_btn {
    margin-top: 10px;
    padding: 0 10px 10px 10px;
    display: flex;
    justify-content: flex-end;
}
</style>