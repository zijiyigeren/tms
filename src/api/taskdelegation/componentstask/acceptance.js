import base from '@/api/base.js'
import axios from '@/utils/http.js'

const mly = {
  // 保存和下达
  tempSave (params) {
    return axios.post(`${base.baseUrl}/Indextask/tempSave`, params)
  },
  // 强制保存
  forceSave (params) {
    return axios.post(`${base.baseUrl}/Indextask/forceSave`, params)
  },

  /* 登记信息 */
  getRuleParam () {
    return axios.put(`${base.baseUrl}/sys/fillRule/getRuleParam/report_code`)
  },
  getReportCode (params) {
    return axios.put(`${base.baseUrl}/sys/fillRule/getCode/report_code`, params)
  },
  // 上传委托单
  uploadOrders (params) {
    return axios.post(`${base.baseUrl}/Indextask/uploadOrders`,params)
  },
  // 获取 基本信息 -- 检验类型
  findParentCheckCartTypes () {
    return axios.get(`${base.baseUrl}/CheckcarttypeController/findCheckTypeAndTaskType`)
  },
  // 获取 基本信息 -- 产品类型
  DicTypeTree (params) {
    return axios.get(`${base.baseUrl}/sys/dictype/tree`, {params})
  },


  /* 样品信息 */
  taskSample_list (params) {
    return axios.get(`${base.baseUrl}/tasksample/taskSample/list`, {params})
  },
  taskSample_add (params) {
    return axios.post(`${base.baseUrl}/tasksample/taskSample/add`, params)
  },
  taskSample_edit (params) {
    return axios.put(`${base.baseUrl}/tasksample/taskSample/edit`, params)
  },
  taskSample_delete (params) {
    return axios.delete(`${base.baseUrl}/tasksample/taskSample/delete?id=${params}`)
  },
  taskSample_deleteBatch (params) {
    return axios.delete(`${base.baseUrl}/tasksample/taskSample/deleteBatch`, {params})
  },
  taskSample_importFile (params) {
    return axios.post(`${base.baseUrl}/tasksample/taskSample/importFile`, {params})
  },
  /* 检验项目 */
  // 获取默认存在的 00 项检验项目
  item_findSpecialItems () {
    return axios.get(`${base.baseUrl}/item/findSpecialItems`)
  },
  /* 流转信息 */
  getItemsWorkLogs (taskId) {
    return axios.get(`${base.baseUrl}/job/task/getItemsWorkLogs/${taskId}`)
  },
  /* 催一下 */
  hurryUp (params) {
    return axios.post(`${base.baseUrl}/job/task/hurryUp`, params)
  },

  /* 打印任务单模板获取 */
  getTemplateHTMLstring (id) {
    return axios.get(`${base.baseUrl}/form/${id}`)
  },
  /* 任务相关调用下达页面时获取值 */
  detailsReport (taskid) {
    return axios.post(`${base.baseUrl}/Indextask/taskDetail?taskid=${taskid}`)
  },

  test (params) {
    return axios.post(`${base.baseUrl}/Indextask/test`, params)
  },
}
export default mly
