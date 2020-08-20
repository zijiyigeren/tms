import base from '@/api/base.js'
import axios from '@/utils/http.js'

const templateRule = {
  /* 模板生成规则 */
  // 检测类型选项获取
  getCheckType () {
    return axios.get(`${base.baseUrl}/generatereport/templaterule/getCheckType`)
  },
  // 查询
  templateRule_list (params) {
    return axios.post(`${base.baseUrl}/generatereport/templaterule/search`, params)
  },
  // 添加(编辑多一个id字段)
  templateRule_add (params) {
    return axios.post(`${base.baseUrl}/generatereport/templaterule/add`, params)
  },
  // 删除
  templateRule_delete (params) {
    return axios.delete(`${base.baseUrl}/generatereport/templaterule/delete/${params}`)
  },
  /* 模板生成规则
  * 新建报告模板生成规则
  * 子模板规则选择
  * 根据ids 代入子模板规则名
  *  */
  getSubRuleNames (params) {
    return axios.get(`${base.baseUrl}/generatereport/templaterule/getSubRuleNames`, {params})
  },

  /*
  * 查看子模板规则
  * */
  goBindSubRuleShow (params) {
    return axios.get(`${base.baseUrl}/generatereport/templaterule/goBindSubRuleShow`, {params})
  },
  /*
  * 查看子模板规则
  * 添加
  * */
  addBindSubRule (params) {
    return axios.get(`${base.baseUrl}/generatereport/templaterule/addBindSubRule`, {params})
  },
  /*
  * 查看子模板规则
  * 删除
  * */
  deleteBindSubRule (params) {
    return axios.delete(`${base.baseUrl}/generatereport/templaterule/deleteBindSubRule`, {params})
  },

}
export default templateRule
