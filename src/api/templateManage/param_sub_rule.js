import base from '@/api/base.js'
import axios from '@/utils/http.js'

const paramSubRule = {
    // 检测类型选项获取
    getCheckType () {
        return axios.get(`${base.baseUrl}/generatereport/paramrule/getCheckType`)
    },
    // 查询
    listSubRule (params) {
        return axios.post(`${base.baseUrl}/generatereport/paramrule/listSubRule`, params)
    },
    // 校验是否可删
    checkParamSubRuleBind (params) {
        return axios.get(`${base.baseUrl}/generatereport/paramrule/checkParamSubRuleBind`,{params})
    },
    // 删除
    deleteParamSubRule (params) {
        return axios.delete(`${base.baseUrl}/generatereport/paramrule/deleteParamSubRule`,{params})
    },
    // 添加
    addParamSubRule (params) {
        return axios.post(`${base.baseUrl}/generatereport/paramrule/addParamSubRule`, params)
    },
    // 添加绑定信息
    bindJudegeInfoFn1 (params) {
        return axios.get(`${base.baseUrl}/generatereport/paramrule/bindJudegeInfo`, {params})
    },
    // 删除绑定信息
    unbindFn1 (params) {
        return axios.delete(`${base.baseUrl}/generatereport/paramrule/unbind`, {params})
    },

}
export default paramSubRule
