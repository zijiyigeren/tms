<template>
    <!-- 组织机构-选择部门 -->
    <el-dialog :modal="modal" :width="width" title="选择部门" class="dialog_dep"
            :visible.sync="depVisible" :before-close="onDepClose"
            :close-on-click-modal="false" :close-on-press-escape="false" >
        <el-tabs v-model="tabsDefault" type="card" class="personnel_role" @tab-click="onTabClick">
            <el-tab-pane label="组织机构" name="1" v-loading="loading">
                <!-- 左 -->
                <div class="role_Left">
                    <el-input placeholder="请输入组织机构用户" v-model="organizeVal"></el-input>
                    <div class="role_tree">
                        <el-tree ref="organizeTree" class="filter-tree" 
                            :data="organizeData" :props="organizeProps"
                            :filter-node-method="organizeFilter" 
                            @node-click="organizeClick">
                        </el-tree>
                    </div>
                </div>
                <!-- 中 -->
                <div class="role_Center">
                    <el-button type="text" class="role_CenterBtn" @click="onArrowLeftClick">
                        <i class="el-icon-arrow-left"></i>
                    </el-button>
                    <el-button type="text" class="role_CenterBtn" @click="onArrowRightClick">
                        <i class="el-icon-arrow-right"></i>
                    </el-button>
                </div>
                <!-- 右 -->
                <ul class="role_Right">
                    <li :class="'role_RightItem ' + item.class" 
                        v-for="(item,i) in departmentList" :key="i"
                        @click="onPeopleClick(item)">
                        {{item.org_name}}
                    </li>
                </ul>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button @click="onDepClose">取 消</el-button>
            <el-button type="primary" @click="onDepClose">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: '',
    props: ['modal', 'width', 'flag', 'depVisible'],
    // 遮罩层-状态  宽  显示状态(按钮传弹框显示状态值;二级弹框传父级弹框显示状态值)    弹框显示状态
    watch: {
        flag: {
            immediate:true,
            handler(val) {
                this.departmentList = []; //  最终选择人员列表
            },
        },
        depVisible: {
            immediate:true,
            handler(val) {
                if(val) {
                    this.onObtainData();
                    this.onTabClick();
                }
            },
        },
        organizeVal(val) {
            this.$refs.organizeTree.filter(val);
        },
    },
    data() {
        return {
            tabsDefault: '1', // 默认页
            loading: false, // 加载状态
            organizeData: [], // 组织机构-列表
            organizeVal: '', // 组织机构-筛选内容
            organizeProps: { // 组织机构-配置
                children: 'children',
                label: 'org_name',
            },
            rowItem: '',
            deplist: [],
            departmentList: [], //  最终选择人员列表
        }
    },
    created() {},
    mounted() {},
    methods: {
        // 获取数据
        onObtainData() {
            this.tabsDefault = '1'; // 默认页
            this.loading = true; // 加载状态
            this.organizeVal = ''; // 组织机构-筛选内容
            this.roleVal = ''; // 用户角色-筛选内容

            // 组织机构列表
            this.$api.flowcheng.organizeList().then(res => {
                // console.log(res,'组织机构列表');
                this.organizeData = res.data.data;
                this.loading = false;
            }).catch(error => {
                console.log(error,'error');
                this.organizeData = [];
                this.$message.error('组织机构列表获取失败！');
                this.loading = false;
            });
        },
        // 切换页签
        onTabClick(tab, event) {
            this.rowItem = '';
            this.deplist = [];
        },
        // 组织机构-过滤方法
        organizeFilter(value, data) {
            if (!value) return true;
            return data.org_name.indexOf(value) !== -1;
        },
        // 组织机构-节点点击
        organizeClick(row) {
            this.rowItem = row;
            this.rowItem.class = '';
        },
        // 向右添加
        onArrowRightClick() {
            if(this.departmentList.length > 0) {
                let flag = false;
                this.departmentList.forEach(item => {
                    if(this.rowItem.id == item.id) {
                        this.$message.warning('已存在该部门！');
                        flag = true;
                    }
                });
                if(!flag) {
                    this.departmentList.push(this.rowItem);
                }
            } else {
                this.departmentList = [this.rowItem];
            }
        },
        // 最终选择部门列表选中时
        onPeopleClick(item) {
            item.class = 'rowSelect';
            // if(item.classStyle == 'rowSelect') {
            //     item.classStyle = '';
            //     this.deplist = this.deplist.filter(em => em.id != item.id);
            // } else {
            //     item.classStyle = 'rowSelect';
            //     this.deplist.push(item);
            // }
        },
        // 向左添加
        onArrowLeftClick() {
            // this.departmentList.forEach(em => {
            //     em.classStyle = '';
            // });
            // this.deplist.forEach((item) => {
            //     this.departmentList = this.departmentList.filter(em => { return item.usid != em.usid});
            // });
            // this.deplist = [];
        },
        // 取消/确定
        onDepClose() {
            this.$emit('depClose', this.departmentList);
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
.personnel_role {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
/deep/ .el-tabs__content {
    flex: 1;
    .el-tab-pane {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
    }
}
.role_Left {
    width: 45%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .role_tree {
        border: 1px solid #e6e6e6;
        flex: 1;
        margin: 15px 0;
        padding: 15px 0;
        overflow-y: auto;
    }
}
.role_Center {
    width: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .role_CenterBtn {
        width: 50px;
        height: 50px;
        background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
        border-radius: 50%;
        margin: 10px 0;
        i {
            color: #fff;
            font-size: 20px;
        }
    }
}
.role_Right {
    width: 45%;
    height: 100%;
    border: 1px solid #e6e6e6;
    margin: 0;
    overflow-y: auto;
    .role_RightItem {
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        margin-right: 1px;
        cursor: pointer;
        &:nth-child(even) {
            background: #fafafa;
        }
    }
    .rowSelect {
        color: red;
    }
}
</style>