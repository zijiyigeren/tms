<template>
    <!-- 组织机构/用户角色--选择用户 -->
    <el-dialog :modal="modal" :width="width" title="选择用户" class="dialog_people"
            :visible.sync="peopleVisible" :before-close="onUserDetermine"
            :close-on-click-modal="false" :close-on-press-escape="false" >
        <el-tabs v-model="tabsDefault" type="card" class="personnel_role" @tab-click="onTabClick">
            <el-tab-pane label="组织机构" name="1" v-loading="loading">
                <!-- 左 -->
                <div class="role_Left">
                    <div class="role_list">
                        <el-input placeholder="请输入组织机构用户" v-model="organizeVal"></el-input>
                        <div class="role_tree">
                            <el-tree ref="organizeTree" class="filter-tree" 
                                :data="organizeData" 
                                :props="organizeProps"
                                :filter-node-method="organizeFilter" 
                                @node-click="organizeClick">
                            </el-tree>
                        </div>
                    </div>
                    <ul class="people_list">
                        <li :class="'people_item ' + item.classStyle" 
                            v-for="(item,i) in userList" :key="i"
                            @click="onUserListClick(item)">
                            {{item.usname}}
                        </li>
                    </ul>
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
                    <li :class="'role_RightItem ' + item.classStyle" 
                        v-for="(item,i) in peopleList" :key="i"
                        @click="onPeopleClick(item)">
                        {{item.usname}}
                    </li>
                </ul>
            </el-tab-pane>
            <el-tab-pane label="用户角色" name="2" v-loading="loading">
                <!-- 左 -->
                <div class="role_Left">
                    <div class="role_list">
                        <el-input placeholder="请输入用户角色" v-model="roleVal"></el-input>
                        <div class="role_tree">
                            <el-tree ref="roleTree" class="filter-tree" 
                                :data="roleData" 
                                :props="roleProps"
                                :filter-node-method="roleFilter" 
                                @node-click="roleClick">
                            </el-tree>
                        </div>
                    </div>
                    <ul class="people_list">
                        <li :class="'people_item ' + item.classStyle" 
                            v-for="(item,i) in userList" :key="i"
                            @click="onUserListClick(item)">
                            {{item.usname}}
                        </li>
                    </ul>
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
                    <li :class="'role_RightItem ' + item.classStyle" 
                        v-for="(item,i) in peopleList" :key="i"
                        @click="onPeopleClick(item)">
                        {{item.usname}}
                    </li>
                </ul>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button @click="onUserDetermine">取 消</el-button>
            <el-button type="primary" @click="onUserDetermine">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'personnelrole',
    props: ['modal', 'width', 'flag', 'peopleVisible'],
    // 遮罩层-状态  宽  显示状态(按钮传弹框显示状态值;二级弹框传父级弹框显示状态值)    弹框显示状态
    watch: {
        flag: {
            immediate:true,
            handler(val) {
                this.peopleList = []; //  最终选择人员列表
            },
        },
        peopleVisible: {
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
        roleVal(val) {
            this.$refs.roleTree.filter(val);
        }
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
            roleData: [], // 用户角色-列表
            roleVal: '', // 用户角色-筛选内容
            roleProps: { // 用户角色-配置
                children: 'children',
                label: 'rname',
            },
            userList: [], // 对应用户列表
            userRightSelect: [], // 右-选中的用户
            userLeftSelect: [], // 左-选中的用户
            peopleList: [], //  最终选择人员列表
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

            // 用户角色列表
            this.$api.flowcheng.roleList({userId: ''}).then(res => {
                // console.log(res,'用户角色列表');
                this.roleData = res.data.data;
                this.loading = false;
            }).catch(error => {
                console.log(error,'error');
                this.roleData = [];
                this.$message.error('用户角色列表获取失败！');
                this.loading = false;
            });
        },
        // 切换页签
        onTabClick(tab, event) {
            this.userList = []; // 对应用户列表
            this.userRightSelect = []; // 右-选中的用户
            this.userLeftSelect = []; // 左-选中的用户
        },
        // 组织机构-过滤方法
        organizeFilter(value, data) {
            if (!value) return true;
            return data.org_name.indexOf(value) !== -1;
        },
        // 组织机构-节点点击
        organizeClick(row) {
            // console.log(row, '节点点击');
            this.$api.flowcheng.organizePeople({orgId: row.id}).then(res => {
                // console.log(res,'组织机构对应用户列表');
                let data = res.data.data;
                if(data.length > 0) {
                    data.forEach(item => {
                        item.classStyle = '';
                    });
                } else {
                    this.$message.error(row.org_name+'  无用户');
                }
                this.userList = data;
                this.peopleList.forEach((item) => {
                    this.userList = this.userList.filter(em => { return item.usid != em.usid});
                });
            }).catch(error => {
                console.log(error,'error');
                this.$message.error('组织机构对应用户列表获取失败！');
            });
        },
        // 用户角色-过滤方法
        roleFilter(value, data) {
            if (!value) return true;
            return data.rname.indexOf(value) !== -1;
        },
        // 用户角色-节点点击
        roleClick(row) {
            // console.log(row, '节点点击');
            this.$api.flowcheng.rolePeople({roleName: row.rname}).then(res => {
                // console.log(res,'用户角色对应用户列表');
                let data = res.data.data.list;
                if(data.length > 0) {
                    data.forEach(item => {
                        item.classStyle = '';
                    });
                } else {
                    this.$message.error(row.rname+'  无用户');
                }
                this.userList = data;
                this.peopleList.forEach((item) => {
                    this.userList = this.userList.filter(em => { return item.usid != em.usid});
                });
            }).catch(error => {
                console.log(error,'error');
                this.$message.error('用户角色对应用户列表获取失败！');
            });
        },
        // 对应用户列表选中时
        onUserListClick(item) {
            if(item.classStyle && item.classStyle == 'rowSelect') {
                item.classStyle = '';
                this.userRightSelect = this.userRightSelect.filter(em => em.usid != item.usid);
            } else {
                item.classStyle = 'rowSelect';
                this.userRightSelect.push(item);
            }
        },
        // 向右添加
        onArrowRightClick() {
            this.peopleList = this.peopleList.concat(this.userRightSelect);
            this.userRightSelect = [];
            this.peopleList.forEach((item) => {
                this.userList = this.userList.filter(em => { return item.usid != em.usid});
            });
            this.peopleList.forEach(em => {
                em.classStyle = '';
            });
        },
        // 最终选择人员列表选中时
        onPeopleClick(item) {
            if(item.classStyle && item.classStyle == 'rowSelect') {
                item.classStyle = '';
                this.userLeftSelect = this.userLeftSelect.filter(em => em.id != item.id);
            } else {
                item.classStyle = 'rowSelect';
                this.userLeftSelect.push(item);
            }
        },
        // 向左添加
        onArrowLeftClick() {
            this.peopleList.forEach(em => {
                em.classStyle = '';
            });
            this.userLeftSelect.forEach((item) => {
                this.peopleList = this.peopleList.filter(em => { return item.usid != em.usid});
            });
            this.userLeftSelect = [];
        },
        // 取消/确定
        onUserDetermine() {
            this.$emit('userDetermine', this.peopleList);
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
    .role_list {
        width: 100%;
        height: 50%;
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
    .people_list {
        width: 100%;
        height: 50%;
        border: 1px solid #e6e6e6;
        margin: 0;
        overflow-y: auto;
        .people_item {
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
            color: #67C23A;
        }
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