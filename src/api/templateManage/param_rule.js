import base from '@/api/base.js'
import axios from '@/utils/http.js'

const paramRule = {
    // 检测类型选项获取
    getCheckType () {
        return axios.get(`${base.baseUrl}/generatereport/paramrule/getParamChecktypeString`)
    },
    // 查询
    paramrule_search (params) {
        return axios.post(`${base.baseUrl}/generatereport/paramrule/search`, params)
    },
    // 删除
    paramrule_delete (params) {
        return axios.delete(`${base.baseUrl}/generatereport/paramrule/delete/${params}`)
    },
    // 添加
    paramrule_add (params) {
        return axios.post(`${base.baseUrl}/generatereport/paramrule/add`, params)
    },
    // 删除参数子规则
    unbindSubRule (params) {
        return axios.delete(`${base.baseUrl}/generatereport/paramrule/unbindSubRule`, {params})
    },
    unbindSubRule2 (params) {
        return axios.get(`${base.baseUrl}/generatereport/paramrule/bindJSubRule`, {params})
    },

}
export default paramRule
