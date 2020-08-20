import base from '../base'
import axios from '../../utils/http'
// 统计表

const tatistical = {
  // 中继上传接口
  uploadingMachine(id) { // 获取id
    return axios.get(`${base.lxtbaseUrl}/StatisticalTableInfoController/upLoad?id=` + id)
  },
  savePreservation(params) { //保存
    return axios.post(`${base.lxtbaseUrl}/StatisticalTableForcedInspectionController/saveTestItemCode`, params)
  },
  refreshPreservation(params) {//刷新
    return axios.post(`${base.lxtbaseUrl}/StatisticalTableForcedInspectionController/findTestItemCode`, params)
  },
  uploadReportDirectory(params) {//上送报告目录按钮接口
    return axios.post(`${base.lxtbaseUrl}/StatisticalTableForcedInspectionController/uploadReportDirectory`, params)
  },
  uploadReportFile(params) {//上送报告目录按钮接口
    return axios.post(`${base.lxtbaseUrl}/StatisticalTableForcedInspectionController/uploadReportFile`, params)
  },
  goViewViedo(id) { //查看该任务下的视频
    return axios.get(`${base.lxtbaseUrl}/StatisticalTableForcedInspectionController/goViewViedo?taskid=` + id)
  },
  saveBasicInformation(params) { //保存基本信息
    return axios.post(`${base.lxtbaseUrl}/StatisticalTableInfoController/importButton`, params)
  },
  vehicleRectification(id) { //临时获取整车整改实验方案编号
    return axios.get(`${base.lxtbaseUrl}/StatisticalTableInfoController/goGetTestNumber?stId=` + id)
  },
  statisticalTable(id) { //上传统计表
    return axios.get(`${base.lxtbaseUrl}/StatisticalTableInfoController/uplaodStaticTable?id=` + id)
  },
  uploadTraining(num, id, standard) { //上传定型目录
    return axios.get(`${base.lxtbaseUrl}/StatisticalTableInfoController/uploadReportDirectory00?codes=${num}&disid=${id}&standard=${standard}`)
  },
  uploadTrainingReport(num) { //上传定型报告
    return axios.get(`${base.lxtbaseUrl}/StatisticalTableInfoController/uploadReportFile00?codes=${num}`)
  },
  findVINDetail(id) { //先比VIN
    return axios.get(`${base.lxtbaseUrl}/StatisticalTableInfoController/findVINDetail?stid=${id}`)
  },
  lookVIN(id) { //查看VIN
    return axios.get(`${base.lxtbaseUrl}/StatisticalTableInfoController/findViewVin?stid=${id}`)
  },
  /*
  * 功能: 查询 _ 统计表
  * */
  findReport(params) {
    return axios.post(`${base.lxtbaseUrl}/ReportController/findReport`, params)
  },
  /*
  * 功能: 统计表 _ 行内数据 _ 浏览
  * */
  reportDetails(params) {
    return axios.post(`${base.lxtbaseUrl}/ReportController/reportDetails`, params)
  },
  /*
  * 功能: 统计表 _ 下载 _ PDF
  * */
  pdfDownload(params) {
    return axios.post(`${base.lxtbaseUrl}/ReportController/pdfDownload`, params)
  },
  /*
  * 功能: 统计表 _ 取消待中机上传
  * */
  goUploadSig(params) {
    return axios.post(`${base.lxtbaseUrl}/ReportController/goUploadSig`, params)
  },
  /*
  * 功能: 点击表格内上传,进行页面跳转前的方法
  * */
  detail(params) {
    return axios.post(`${base.lxtbaseUrl}/Zjparam/detail`, params)
  },
  /*
  * 功能: 统计表 _ 快查
  * */
  quickLook(params) {
    return axios.get(`${base.lxtbaseUrl}/ReportController/quickLook`, {params})
  },
  getCommon() {
    return axios.get(`${base.lxtbaseUrl}/sysParam/test/getCommon/32`)
  },
  /*
  * 功能: 统计表 _ 获取统计表编号
  * */
 getStartNumber(taskId) {
  return axios.get(`${base.lxtbaseUrl}/StatisticalTableInfoController/getStartNumber?taskId=${taskId}`)
 },



};

export default tatistical
