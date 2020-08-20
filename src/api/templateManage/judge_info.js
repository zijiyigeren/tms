import base from '@/api/base.js'
import axios from '@/utils/http.js'

const judgeInfo = {
  /* 判别信息管理 */
  // 检测类型选项获取
  getCheckType () {
    return axios.get(`${base.baseUrl}/generatereport/judgeinfo/getCheckType`)
  },
  // 查询
  judgeInfo_list (params) {
    return axios.post(`${base.baseUrl}/generatereport/judgeinfo/search`, params)
  },
  // 添加(编辑多一个id字段)
  judgeInfo_add (params) {
    return axios.post(`${base.baseUrl}/generatereport/judgeinfo/add`, params)
  },
  // 删除
  judgeInfo_delete (params) {
    return axios.delete(`${base.baseUrl}/generatereport/judgeinfo/delete/${params}`)
  },
}
export default judgeInfo
