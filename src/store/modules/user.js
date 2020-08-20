import axiosLogin from '@/api/login/login'
import { saveToLocal } from '@/utils/local-storage'
const SET_NAME = 'SET_NAME'
const SET_DATANAME = 'SET_DATANAME'
const user = {
  state: {
    name: '',
    loginName:'',
  },
  mutations: {
    [SET_NAME](state, name) {
      state.name = name
    },
    [SET_DATANAME](state, data){
      state.loginName = data;
    }
  },
  actions: {
    // 用户登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        axiosLogin.login(userInfo).then(resp => {
          let data = resp.data.data;
          commit(SET_NAME, data.name);
          commit(SET_DATANAME, data);
          saveToLocal("region", userInfo.region);
          return resolve()
        }).catch(error => {
          return reject(error)
        })
      })
    },
    // 拉取用户信息
    pullUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        userInfo().then(resp => {
          let data = resp.data
          commit(SET_NAME, data.name)
          // commit(SET_PERMISSIONS, data.permissions)
          return resolve(data)
        }).catch(err => {
          return reject(err)
        })
      })
    },
    // 用户退出登录
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        axiosLogin.logout().then(resp => {
          commit(SET_NAME, '')
          // 公司名称及公司logo
          sessionStorage.removeItem('companyName')
          sessionStorage.removeItem('companyLogo')
          // 用户信息
          localStorage.removeItem("userInfo");
          sessionStorage.removeItem("includePageNames");
          // 面包屑相关本地存储
          sessionStorage.removeItem("crumbData");
          sessionStorage.removeItem('activeName');
          return resolve()
        }).catch(err => {
          return reject(err)
        })
      })
    },
    fresh({ commit }) {
      commit(SET_NAME, JSON.parse(localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo")).username : "")
    }
  },
  getters: {
    name: state => state.name
  }
}

export default user
