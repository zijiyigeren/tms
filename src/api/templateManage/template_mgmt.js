import base from '@/api/base.js'
import axios from '@/utils/http.js'

const templateMgmt = {
    // 检测类型选项获取
    getCheckType () {
        return axios.get(`${base.baseUrl}/generatereport/templateMgmt/getCheckType`)
    },
    // 查询
    getLis (params) {
        return axios.post(`${base.baseUrl}/generatereport/templateMgmt/getList`, params)
    },
    // 新建编辑模板
    add (params) {
        return axios.post(`${base.baseUrl}/generatereport/templateMgmt/add`, params)
    },
    // 删除
    delete (params) {
        return axios.delete(`${base.baseUrl}/generatereport/templateMgmt/delete`, {params})
    },
    /* 查看判别信息 */
    // 删除判别信息
    unbind (params) {
        return axios.delete(`${base.baseUrl}/generatereport/templateMgmt/unbind`, {params})
    },
    // 添加判别信息
    bindJudegeInfo (params) {
        return axios.get(`${base.baseUrl}/generatereport/templateMgmt/bindJudegeInfo`, {params})
    },

    /* 绑定模板规则 */
    templateBindTemplateRule (params) {
        return axios.get(`${base.baseUrl}/generatereport/templateMgmt/templateBindTemplateRule`, {params})
    },
    /* 绑定模板规则 */
    templateBindRule (params) {
        return axios.get(`${base.baseUrl}/generatereport/templateMgmt/templateBindRule`, {params})
    },
}
export default templateMgmt
