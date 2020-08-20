<template>
  <el-row :gutter="0">
    <el-col :span="24" class="formWrap">
      <div class="formWrap_wrap">
        <div class="formWrap_bg">
        </div>
        <div class="formWrap_bg2">
          <div class="welcome">{{$store.state.companyName}}</div>
          <el-form label-width="0" class="loginForm" ref="loginForm" :model="loginForm" :rules="rules">
            <el-form-item style="position:relative" prop="username">
                <span class="svg-container svg-container_user">
                  <object :data="user" type="image/svg+xml" width="30" height="30"/>
                </span>
              <el-input
                type="text"
                placeholder="请输入用户名"
                v-model="loginForm.username"
                @keyup.tab.native.prevent="jumpToNextInput"
                auto-complete="off"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                placeholder="请输入密码"
                v-model="loginForm.password"
                @keyup.enter.native="onLogin('loginForm')"
                auto-complete="new-password" @focus="changeInputType" :type="inputType"
                ref="password"
              ></el-input>
              <span class="svg-container svg-container_password">
                  <object :data="password" type="image/svg+xml" width="20" height="20"/>
                </span>
            </el-form-item>
            <!-- <el-form-item prop="region">
              <el-select v-model="loginForm.region" placeholder="请选择检测机构" style="width:100%">
                <el-option label="昆明" value="km"></el-option>
                <el-option label="广州" value="gz"></el-option>
              </el-select>
            </el-form-item> -->
            <!-- <a target="_blank"
              :href="`${base.baseImgUrl}docs/resources/donet/setup.zip`"
              style="display:inline-block;color:#2f25c5"
            >下载插件</a> -->
            <!-- <el-form-item label-width="0"></el-form-item> -->
            <el-button
              type="primary"
              class="login-btn"
              @click="onLogin('loginForm')"
              :loading="loading"
            >登录
            </el-button>
          </el-form>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
  import {mapActions} from 'vuex'
  import {saveToLocal} from '@/utils/local-storage'
  import base from '@/api/base.js'

  export default {
    data () {
      return {
        base: base,
        logo: require('@/assets/images/login/logo1.png'),
        bg: require('@/assets/images/login/bg1.png'),
        user: require('@/icons/svg/user.svg'),
        password: require('@/icons/svg/password.svg'),
        loginForm: {
          region: '',
          username: '',
          password: ''
        },
        loading: false,
        rules: {
          username: [
            {required: true, message: '登录名不能为空', trigger: 'blur'}
          ],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
          // region: [{ required: true, message: '城市不能为空', trigger: 'change' }]
        },
        inputType: 'text'
      }
    },
    created () {
      if (
        !sessionStorage.getItem('companyName') &&
        !sessionStorage.getItem('companyLogo')
      ) {
        // console.log('开始了')
        
        this.$api.login.getCompanyInfor()
          .then(resp => {
            this.$store.commit({
              type: 'saveCompanyInfor',
              companyName: resp.data.data.name,
              companyLogo: resp.data.data.picPath,
            })
          })
      }
      let that = this
      this.$api.login.pullUserInfo().then(resp => {
        this.$message({
          message: '您已登陆，将跳转到首页',
          type: 'warning',
          onClose: function () {
            that.$router.push({name: 'home'})
          }
        })
      }).catch(error => {
        // this.$message.error(error.data.message);
      })
    },
    methods: {
      ...mapActions(['login']),
      onLogin (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            //this.loading = true
            this.login(this.loginForm).then(() => {
              this.$router.push({name: 'home'})
              window.sessionStorage.setItem('includePageNames','home') 
              window.sessionStorage.setItem('crumbData','[]') 
              // this.$router.push({ name: "publicationpage" });
            }).catch((error) => {
              this.loading = false
              this.$message.error(error.data.message)
            })
          } else {
            return false
          }
        })
        let ologinBtn = document.getElementById('login-btn')
        ologinBtn.style.lineHeight = '0 !important'
      },
      jumpToNextInput () {
        this.$refs.password.focus()
      },
      changeInputType () {
        this.inputType = 'password'
      }
    }
  }
</script>
<style lang="scss" scoped>
// 解决-按钮不居中
/deep/ .el-button {
    line-height: 0px !important;
}
  .formWrap_wrap {
    width: 700px;
    height: 350px;
    display: flex;
  }

  .formWrap_bg {
    width: 60%;
    height: 100%;
    background: url("~@/assets/newimg/bg2.jpg") center center no-repeat;
  }

  .formWrap_bg2 {
    width: 40%;
    height: 100%;
    background: rgba($color: #fff, $alpha: .4)
  }

  .el-row {
    width: 100%;
  }

  .header {
    height: 10%;
    padding-left: 20%;
    color: #0096ff;
    display: flex;
    align-items: center;
  }

  .header-content {
    font-size: 26px;
    font-family: Adobe Heiti Std;
    font-weight: bold;
  }

  .header img {
    margin-top: -3px;
    vertical-align: middle;
  }

  .footer {
    text-align: center;
    font-size: 14px;
    font-family: PingFang;
    font-weight: 500;
    color: rgba(76, 76, 76, 1);
    opacity: 0.5;
  }

  .formWrap {
    height: 100%;
    background: url("~@/assets/newimg/bg1.jpg") center no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .formWrap-bg {
    width: 100%;
    padding: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loginForm {
    width: 100%;
    // background: #fff;
    padding: 10px 30px 25px 30px;
    height: 80%;
  }

  .welcome {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    width: 100%;
    height: 20%;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #606266;
    // margin-bottom: 10px;
  }

  .svg-container {
    position: absolute;
    top: 5px;
    left: 5px;
    color: #889aa4;
    z-index: 999999;
  }

  .svg-container_password {
    top: 5px;
    left: 10px;
  }

  .el-input /deep/ .el-input__inner {
    text-indent: 30px;
  }

  .login-btn {
    width: 100%;
    margin-top: 10px;
  }
</style>
