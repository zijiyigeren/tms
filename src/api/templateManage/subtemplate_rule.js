import base from '@/api/base.js'
import axios from '@/utils/http.js'

const subtemplateRule = {
  /* 子模板生成规则 */
  // 检测类型选项获取
  getCheckType () {
    return axios.get(`${base.baseUrl}/generatereport/subtemplaterule/getCheckType`)
  },
  // 查询
  subtemplateRule_list (params) {
    return axios.post(`${base.baseUrl}/generatereport/subtemplaterule/search`, params)
  },
  // 添加(编辑多一个id字段)
  subtemplateRule_add (params) {
    return axios.post(`${base.baseUrl}/generatereport/subtemplaterule/add`, params)
  },
  // 删除
  subtemplateRule_delete (params) {
    return axios.delete(`${base.baseUrl}/generatereport/subtemplaterule/delete/${params}`)
  },
  /*
  * 查看判别信息
  * */
  goBindJudgeInfoShow (params) {
    return axios.get(`${base.baseUrl}/generatereport/subtemplaterule/goBindJudgeInfoShow`, {params})
  },
  /*
  * 添加判别信息
  * */
  addBindJudgeInfo (params) {
    return axios.get(`${base.baseUrl}/generatereport/subtemplaterule/addBindJudgeInfo`, {params})
  },
  /*
  * 删除判别信息
  * */
  deleteBindJudgeInfo (params) {
    return axios.delete(`${base.baseUrl}/generatereport/subtemplaterule/deleteBindJudgeInfo`, {params})
  },
}
export default subtemplateRule
