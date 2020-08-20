<template>
    <!-- 原始记录查看 -->
    <div class="recordSee_box">
        <!-- 表单 -->
        <el-form :inline="true" :model="recordSeeForm" class="recordSee_form" label-width="80px">
            <el-form-item label="检验项目：">
                <el-input :disabled="true" v-model.trim="recordSeeForm.itemsName"></el-input>
            </el-form-item>
            <el-form-item label="依据法规：">
                <el-input :disabled="true" v-model.trim="recordSeeForm.itemsBasis"></el-input>
            </el-form-item>
            <el-form-item label="检测方法：">
                <el-input :disabled="true" v-model.trim="recordSeeForm.itemsFrederickItme"></el-input>
            </el-form-item>
            <el-form-item label="检测员：">
                <el-input :disabled="true" v-model.trim="recordSeeForm.testPersonName"></el-input>
            </el-form-item>
            <el-form-item label="完成时间：">
                <el-input :disabled="true" v-model.trim="recordSeeForm.itemsSampleDate"></el-input>
            </el-form-item>
            <el-form-item label="所属科室：">
                <el-input :disabled="true" v-model.trim="recordSeeForm.testRoomName"></el-input>
            </el-form-item>
        </el-form>

        <!-- 按钮 -->
        <div class="recordSee_btn">
            <!-- 多条记录文件列表 -->
            <div class="recordSee_btnRight">
                <span>列表：</span>
                <el-select placeholder="请选择" v-model="defaultFile" @change="fileListChange">
                    <el-option v-for="(item,i) in fileList" :key="i"
                        :label="item.label" :value="item.id"
                    ></el-option>
                </el-select>
            </div>
            <!-- 全屏与百分比 -->
            <div class="recordSee_btnLeft">
                <el-button type="danger" @click="fullScreen">全屏</el-button>
                <el-select v-model="defaultPercentage" @change="percentageChange" class="percentage">
                    <el-option v-for="(item,i) in percentageList" :key="i"
                        :label="item.label" :value="item.value"
                    >{{item.label}}</el-option>
                </el-select>
            </div>
        </div>

        <!-- 图片 -->
        <div class="recordSee_picture" id="picture" v-if="imgListData.length > 0">
            <div class="recordSee_img" 
                v-for="(item,i) in imgListData.slice((current - 1) * pageSize, current*pageSize)"
                :key="i">
                <div class="recordSee_imgItem">
                    <img class="imgClass" :src="item.url" @click="pageTurning($event)"
                        :style="{width: imgWidth ? imgWidth : '70%',}">
                </div>
            </div>
            <!-- <div class="recordSee_img" 
                v-for="(item,i) in imgListData.slice((current - 1) * pageSize, current*pageSize)"
                :key="i">
                <div class="recordSee_imgItem">
                    <img class="imgClass" src="@/assets/images/y.jpeg" @click="pageTurning($event)"
                        :style="{width: imgWidth ? imgWidth : '70%',}">
                </div>
            </div> -->
        </div>

        <div class="noDateRecordSee_picture" id="picture" v-else>
            <img src="static/image/noData2.png" alt="暂无数据" class="noDataImg">
            <div style="fontSize: 18px">暂无数据，请重新生成！</div>
        </div>

        <!--分页-->
        <el-pagination
            class="pagination"
            layout="total, prev, pager, next, jumper"
            :total="imgListData.length"
            :current-page="current"
            :page-size="pageSize"
            @current-change="currentChange"
            @size-change="pageSizeChange">
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: '',
    props: ['originalRecordForm','recordVisible','pictureNum','imgListData',],
    //          表单数据           显示状态         图片数量       图片路径
    watch: {
        recordVisible: {
            immediate: true,
            handler (val) {
                if(val){
                    this.percentageList.forEach(item => {
                        if (item.label == '70%') {
                            this.defaultPercentage = item.value;
                        }
                    });
                    this.current = 1;
                    this.imgWidth = null;
                }
            },
        },
        originalRecordForm: {
            immediate: true,
            handler (val) {
                for (let i in val) {
                    if(i && val[i]){
                        this.recordSeeForm[i] = val[i];
                    }else{
                        this.recordSeeForm[i] = '';
                    }
                }
            },
        },
    },
    data() {
        return {
            recordSeeForm: { // 表单数据
                itemsName: '',
                itemsBasis: '',
                itemsFrederickItme: '',
                testPersonName: '',
                itemsSampleDate: '',
                testRoomName: '',
            },
            current: 1, // 页数
            pageSize: 2, // 条数
            defaultFile: '', // 默认文件
            fileList: [], // 多条记录文件列表
            defaultPercentage: '1', // 默认百分比
            percentageList: [ // 百分比
                {value: '0', label: '40%'}, 
                {value: '1', label: '70%'},
                {value: '2', label: '90%'}, 
                {value: '3', label: '100%'},
                {value: '4', label: '130%'}, 
                {value: '5', label: '150%'}
            ],
            imgWidth: null, // 图片默认宽
        }
    },
    methods: {
        // 多条记录文件列表
        fileListChange(){
            
        },
        // 全屏
        fullScreen() {
            let element = document.getElementById('picture');
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
            if (typeof window.ActiveXObject !== 'undefined') {
                let wscript = new ActiveXObject('WScript.Shell')
                if (wscript !== null) {
                    wscript.SendKeys('{F11}');
                }
            }
        },
        // 百分比
        percentageChange(value) {
            let imgItem = {};
            imgItem = this.percentageList.find((item) => {
                return item.value === value;
            });
            let imgArr =  Array.from(document.getElementsByClassName('imgClass'));
            imgArr.forEach(item => {
                item.style.width = imgItem.label;
                this.imgWidth = imgItem.label;
            });
        },
        // 图片翻页
        pageTurning(e) {
            let imgItem = document.getElementsByClassName('imgClass');
            let left = imgItem[0];
            let right = imgItem[1];
            let saveCurrent = this.current;
            if (e.target == left) {
                if (saveCurrent == 1) {
                    this.$message.info('当前为第一页');
                    return
                }
                saveCurrent--;
                this.currentChange(saveCurrent);
            }
            if (e.target == right) {
                saveCurrent++;
                this.currentChange(saveCurrent);
            }
        },
        // 条数
        pageSizeChange(val) {
            this.pageSize = val;
        },
        // 页数
        currentChange(val) {
            if (val * 2 > this.pictureNum) { 
                if ((val-1) * 2 == this.pictureNum) {
                    this.current = val-1;
                }else if((val-1) * 2 < this.pictureNum){
                    this.current = val;
                }
                return this.$message.success('浏览完毕');
            }else{
                this.current = val;
            }
        },
    },
    mounted(){
        
    },
}
</script>

<style scoped lang="less">
.el-button--danger {
    padding: 0 20px;
    margin: 0;
    height: 30px;
    border-radius: 4px;
}

/deep/ .recordSee_form {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .el-form-item{
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
            .el-select, .el-input, .el-date-editor {
                width: 100% !important;
            }
            .el-input__inner {
                background-color: #fff;
            }
        }
    }
}

.recordSee_box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .recordSee_btn {
        margin: 20px 0;
        display: flex;
        justify-content: space-between;
    }
    .noDateRecordSee_picture {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .noDataImg {
            display: block;
            width: 20%;
            height: auto;
        }
    }
    .recordSee_picture {
        flex: 1;
        overflow: hidden;
        display: flex;
        .recordSee_img {
            width: 50%;
            height: 100%;
            overflow: hidden;
            .recordSee_imgItem {
                width: 95%;
                height: 95%;
                margin: 0 auto;
                overflow: auto;
                // position: relative;
                .imgClass {
                    display: block;
                    height: auto;
                    padding: 0;
                    margin:0 auto;
                    // position:absolute;
                    // top:50%;
                    // left:50%;
                    // transform:translate(-50%,-50%);
                }
            }
        }
    }
    .pagination {
        margin-top: 20px;
    }
}
</style>
