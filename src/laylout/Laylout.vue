<template>
  <div class="cont">
    <div class="conttop">
      <div class="contleft">
        <img :src="companyLogo" style="height: 35px;"/>{{companyName}}
      </div>
      <div class="contcenter">
        <Aside :options="options" :active="active" @addlists="add"/>
      </div>
      <div class="contright">
        <el-button type="text" style="color:#fff;marginRight:10px;" @click="editPsw">
          <i class="el-icon-s-tools"></i>
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <span class="user-name">{{localName}}</span>  
        <el-divider direction="vertical"></el-divider>
        <el-button type="text" style="color:#fff;margin: 0 10px;" @click="openSize()">
          <i class="el-icon-edit"></i>
        </el-button>
        <el-button type="text" style="color:#fff;margin:0px;" @click="logout">
          <img src="@/assets/images/sign-out.svg" style="width:17px; height:17px"/>
        </el-button>
      </div>
    </div>
    <div class="title">
      <div class="title-content">
        <p class="hos" title="首页">
          <router-link to="/home">
            <el-button type="text" @click="iconHomePage">
              <i class="el-icon-s-home" :style="homeFlag ? 'color:#0D9AE8;': 'color:#ccc;'"></i>
            </el-button>
          </router-link>
        </p>
        <div class="label_btn">
          <Navs
            v-for="(file,ind) in list"
            :key="ind"
            :file="file"
            :str="str"
            @dels="del"
            @activeColrs="activeColr"
          ></Navs>
        </div>
      </div>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="30%">
      <el-form :rules="rules" :model="form" label-width="100px" ref="editForm">
        <!-- <el-form-item label="原密码" prop="oldpass">
          <el-input placeholder="原密码" v-model="form.oldpass" type="password"></el-input>
        </el-form-item>-->
        <el-form-item label="新密码" prop="newpass">
          <el-input placeholder="新密码" v-model="form.newpass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkpass">
          <el-input placeholder="再次输入新密码" v-model="form.checkpass" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePsw('editForm')">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog
      title="整站字号大小调整"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <span class="kz">
         <div class="block">
            <span class="demonstration">控制器：</span>
            <el-slider
              v-model = "num"
              :min = "12"
              :max = "20"
              :step = '1'
              :show-tooltip="true"
              show-stops
              :change = 'jia()'
            ></el-slider>
          </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="fontSizeSit()">确 定</el-button>
      </span>
    </el-dialog>


    

    <keep-alive :include="includePageNames">
      <router-view class="showcont"/>
    </keep-alive>

    <!-- 信息提示 -->
    <Hint @addlists="add"/>

  </div>
</template>
<script>
  import Router from 'vue-router'
  import routes from "@/router/index.js";
  import Aside from "@/components/Aside.vue";
  import Navs from "@/components/Navs.vue";
  import Hint from "@/components/Hint.vue";
  import {mapState, mapActions} from 'vuex'
  import {saveToLocal} from '@/utils/local-storage'

  export default {
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === undefined) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.newpass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        options: [],
        list: JSON.parse(window.sessionStorage.getItem('crumbData')) ? JSON.parse(window.sessionStorage.getItem('crumbData')) : [],
        str: window.sessionStorage.getItem('activeName') ? window.sessionStorage.getItem('activeName') : "",
        dialogFormVisible: false,
        form: {
          newpass: "",
          checkpass: ""
        },
        rules: {
          newpass: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
          ],
          checkpass: [
            {validator: validatePass2, trigger: 'blur'}
          ]
        },
        includePageNames: [], //存储导航缓存组件
        homeFlag: false,
        active: '',
        localName: '',
        num : 14,
        dialogVisible: false,

        companyName: sessionStorage.getItem('companyName'),
        companyLogo: sessionStorage.getItem('companyLogo'),
      };
    },
    //
    components: {
      Aside,
      Navs,
      Hint
    },
    computed: mapState({
      name: function (state) {
        if (state.user.name === '') {
          this.freshUserInfo();
        }
        return state.user.name
      },
    }),
    methods: {
      /*
      * 获取部门信息:用于检验项目更改 试验科室
      * */
      getDepartment () {
        let that = this
        this.$api.entrust.getDepartment()
          .then(resp => {
            let officeList = []
            let officeIdList = []
            for (let i = 0; i < resp.data.data.length; i++) {
              officeList.push(resp.data.data[i])
              officeIdList.push(resp.data.data[i].id)
            }
            // that.orgs = officeList
            // that.orgsIdList = officeIdList
            // this.$emit('Get_orgsIdList',that.orgsIdList)
            this.$store.state['officeIdList'] = officeIdList
            this.$store.state['officeList'] = officeList
          })
          .catch(error => {
            // this.$message.error({
            //   message: error.data.message,
            //   duration: 1500
            // })
          })
      },
      ...mapActions({
        userLogout: 'logout',
        freshUserInfo: 'fresh'
      }),
      add(arr) {
        this.includePageNames = window.sessionStorage.getItem('includePageNames').split(",");
        if (arr.name != 'home') {
          let flag = true;
          this.list.forEach(item => {
            if (item.name === arr.name) {
              flag = false;
            }
          });
          if (flag) {
            this.list.push(arr);
            window.sessionStorage.setItem('crumbData', JSON.stringify(this.list))
          }
          this.homeFlag = false;
          this.activeColr(arr.path)
        } else {
          this.homeFlag = true;
          this.activeColr(arr.path)
        }
        window.sessionStorage.setItem('activeName', arr.path)
      },
      del(obj) {
        this.includePageNames = window.sessionStorage.getItem('includePageNames').split(",");
        let ind = 0;
        this.list.forEach((item, index) => {
          if (obj.name === item.name) {
            ind = index;
          }
        });
        this.list.splice(ind, 1);
        window.sessionStorage.setItem('crumbData', JSON.stringify(this.list));
        let num = this.list.length;
        if (obj.path === this.$route.path) {
          if (num) {
            this.$router.push(this.list[num - 1].path);
            this.activeColr(this.list[num - 1].path)
          } else {
            this.iconHomePage();
            this.$router.push('/home')
          }
        } else {
          this.activeColr(this.$route.path)
        }
      },
      activeColr(str) {
        window.sessionStorage.setItem('activeName', str);
        this.options.forEach(item => {
          if (item.children) {
            item.children.forEach(em => {
              if (str == em.path) {
                this.active = item.path;
              }
            })
          } else {
            if (str == item.path) {
              this.active = item.path;
            }
          }
        });
        if (str == '/home') {
          this.homeFlag = true;
        } else {
          this.homeFlag = false;
        }
        this.str = str;
        if (str != this.$router.path) {
          this.$router.push(str);
          const originalPush = Router.prototype.push;
          Router.prototype.push = function push(location) {
            return originalPush.call(this, location).catch(err => err)
          }
        }
      },
      logout() {
        this.$confirm("是否确认退出系统？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.userLogout().then(() => {
            this.$router.push("/");// 为了重新实例化vue-router对象 避免bug
          }).catch(err => {
            console.log(err)
          })
        }).catch(() => {
        });
      },
      editPsw() {
        this.dialogFormVisible = true
        for (var key in this.form) {
          this.form[key] = "";
        }
        this.$refs.editForm.clearValidate();
      },
      savePsw(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$api.login.modifyPass({
              id: JSON.parse(localStorage.getItem("userInfo")).id,
              password: this.form.newpass
            }).then(resp => {
              this.$message({
                message: resp.data.data,
                type: "success"
              });
              this.findList();
            }).catch((error) => {
              this.$message.error(error.data.message);
            });
            this.dialogFormVisible = false;
          } else {
            this.dialogFormVisible = true;
            return false;
          }
        });
      },
      iconHomePage() {
        this.homeFlag = true;
        this.activeColr('/home');
      },
      jia(val){

        // this.num ++;

        let cssText  = `* {font-size:${this.num}px !important}`
        this.addCSS(cssText)
      },
      formatTooltip(val) {
        console.log(val)
        return val / 100;
      },
      addCSS(cssText){
          var style = document.createElement('style'),  //创建一个style元素
              head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
          style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
          if(style.styleSheet){ //IE
              var func = function(){
                  try{ //防止IE中stylesheet数量超过限制而发生错误
                      style.styleSheet.cssText = cssText;
                  }catch(e){

                  }
              }
              //如果当前styleSheet还不能用，则放到异步中则行
              if(style.styleSheet.disabled){
                  setTimeout(func,10);
              }else{
                  func();
              }
          }else{ //w3c
              //w3c浏览器中只要创建文本节点插入到style元素中就行了
              var textNode = document.createTextNode(cssText);
              style.appendChild(textNode);
          }
          head.appendChild(style); //把创建的style元素插入到head中
      },
      fontSizeSit(){
        this.dialogVisible = false;
        window.localStorage.setItem('fontSize',this.num)
      },
      openSize(){
        this.dialogVisible = true;
        this.num = +window.localStorage.getItem('fontSize')
      },
    },
    created() {
      this.getDepartment()
      this.$api.login.userMenu().then(res => {
        if (res.data.ok) {
          this.options = res.data.data.menus;
           window.sessionStorage.setItem('authenticationStorage',JSON.stringify(res.data.data.auth))
        }
      }).catch(error => {
        this.$message.error(error.data.message);
      });
      this.options = routes.options.routes.filter(item => {
        if (!item.hidden) {
          return item;
        }
      });
      this.$api.login.pullUserInfo().then(resp => {
        saveToLocal("username", resp.data.data.name);
        saveToLocal("loginName", resp.data.data.loginName);
        saveToLocal("id", resp.data.data.id);
        saveToLocal("departmentid", resp.data.data.departmentid);
        saveToLocal("departmentName", resp.data.data.departmentName);
        this.localName = resp.data.data.name
      }).catch(error => {
        this.$message.error(error.data.message);
      });
      this.num = window.localStorage.getItem('fontSize')
    },
    mounted() {
      this.$EventBus.$on("Crumbs", this.add);
      if (window.sessionStorage.getItem('includePageNames')) {
        this.includePageNames = window.sessionStorage.getItem('includePageNames').split(",");
      }
    }
  };
</script>
<style lang="scss" scoped>
  .el-icon-s-tools {
    font-size: 20px;
  }

  .el-button--text {
    display: flex;
    align-items: center;
  }

  .el-icon-s-home {
    font-size: 17px;
  }
  .kz{
    width:90%; display:block; margin: 0 auto
  }
</style>
