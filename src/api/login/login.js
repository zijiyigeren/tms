import base from '../base'
import axios from '../../utils/http'

const login = {
    // 登录
    login(userVo) {
        return axios.post(`${base.hanlei}/login`, userVo)
    },
    // 退出
    logout() {
        return axios.get(`${base.hanlei}/logout`)
    },
    getCompanyInfor() {
      return axios.get(`${base.wang}/sysParam/getInfo`)
    },
    pullUserInfo() {
        return axios.get(`${base.wang}/userInfo`)
    },
    // 修改密码
    modifyPass(passVo) {
        return axios.post(`${base.hanlei}/moidfyPass`, passVo)
    },
    // 导航菜单
    userMenu() {
        return axios.get(`${base.hanlei}/userMenu`)
    },
    // 上传中机-快查校验
    checkVideo(params) {
        return axios.get(`${base.hanlei}/taskView/checkVideo/`+params)
    },
    // 上传中机-保存
    goSaveViedoConfig(params) {
        return axios.post(`${base.hanlei}/taskView/taskView/goSaveViedoConfig`, params)
    },
    // 上传中机
    goUploadSig(params) {
        return axios.get(`${base.hanlei}/taskView/taskView/goUploadSig`, {params})
    },
    // 原始记录查看-获取数据
    findOriginalInfo(params) {
        return axios.post(base.sample+'/TaskReport/findOriginalInfo', params)
    },
}

export default login
