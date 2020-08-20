import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
// import permission from './modules/permission'
import baseJS from '../api/base'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    companyName: '',
    companyLogo: '',
    /**/
    tinfo: {},
    infor: {},
    defaultItem: [],
    /**/
    officeIdList: [],
    officeList: [],
    /* ***************** 字典源数据 ****************** */
    /* 字典(企业名录-地区) */
    LIST_entArea: [],
    /* 字典(设备管理-档案状态) */
    fileStatusLIST: [],
    /* 字典(设备管理-设备状态) */
    terminalStatusLIST: [],
    /* 字典(设备管理-检定项目) */
    checkItemLIST: [],
    /* 字典(设备管理-检定方式) */
    checkModelLIST: [],
    /* 字典(设备管理-证书类别) */
    certificateTypeLIST: [],
    /* 字典(设备管理-检定单位) */
    checkCompanyLIST: [],
  },
  mutations: {
    saveCompanyInfor (state, {companyName, companyLogo}) {
      sessionStorage.setItem('companyName', companyName)
      sessionStorage.setItem('companyLogo', baseJS.wang + '/file' + companyLogo)
      state['companyName'] = companyName
      state['companyLogo'] = baseJS.wang + '/file' + companyLogo
    },
    handleChange_superscript (state, {superscriptName, superscriptTotal}) {
      state[superscriptName] = superscriptTotal
    },
    handleChange_tinfo (state, {tinfo}) {
      state['tinfo'] = JSON.parse(JSON.stringify(tinfo))
    },
    handleChange_infor (state, {infor}) {
      state['infor'] = JSON.parse(JSON.stringify(infor))
    },
    saveDefaultItem_00 (state, {defaultItem}) {
      state['defaultItem'] = defaultItem
    },
    save_originData_entArea (state, {data}) {
      state['LIST_entArea'] = data
    },
  },
  getters: {
    // getDefaultItem:state => {
    //
    // }
  },
  modules: {
    user
  }
})
