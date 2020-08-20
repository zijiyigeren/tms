import base from '../base'
import axios from '../../utils/http'

const systemPublicationpage = {
  /*
   * 功能:状态提示 _ 获取 _ 任务通知模块 / 待分配任务模块
   * */
  questNotice(params) {
    return axios.post(`${base.systemPublicationpage}/PersonalSpaceController/questNotice`, params)
  },
  /*
   * 功能:状态提示 _ 获取 _ 报告审批模块
   * */
  vettingReport(params) {
    return axios.post(`${base.systemPublicationpage}/PersonalSpaceController/vettingReport`, params)
  },
  /*
   * 功能:状态提示 _ 获取 _ / 待审核报告通知模块 / 待批准报告通知模块
   * */
  vettingReport2(params) {
    return axios.post(`${base.systemPublicationpage}/PersonalSpaceController/vettingReport2`, params)
  },
  /*
  * 功能:状态提示 _ 获取 _ 月度统计表(echarts)数据
  * */
  monthlyStatisticsInit() {
    return axios.get(`${base.systemPublicationpage}/PersonalSpaceController/monthlyStatisticsInit`)
  },
  /*
  * 功能:查询功能 _ 获取 _ 最近搜索记录
  * */
  getNearlyCondition() {
    return axios.get(`${base.systemPublicationpage}/PersonalSpaceController/getNearlyCondition`)
  },
  /*
  * 功能:查询功能 _ 获取 _ 当前登录人可查询的权限
  * */
  getUsualSearch() {
    return axios.get(`${base.systemPublicationpage}/PersonalSpaceController/getUsualSearch`)
  },
  /*
  * 功能:查询功能 _ 保存 _ 最近搜索内容
  * */
  setNearlyCondition(params) {
    return axios.get(`${base.systemPublicationpage}/PersonalSpaceController/setNearlyCondition`, {params: params})
  },
  /*
  * 功能:查询功能 _ 查询 _ /分配检测 /检测报告 /审核报告 /批准报告
  * */
  findTaskList(params) {
    return axios.post(`${base.systemPublicationpage}/job/task/findTaskList`, params)
  },
  /*
  * 功能:查询功能 _ 查询 _ /我的报告
  * */
  viewMyReportList(params) {
    return axios.post(`${base.systemPublicationpage}/TaskReport/viewMyReportList`, params)
  },
  /*
  * 功能:状态提示 _ 获取 _ 当前登陆用户拥有的看板页相关权限
  * */
  getKbRole() {
    return axios.get(`${base.systemPublicationpage}/PersonalSpaceController/getKbRole`)
  },
  /*
  * 功能:状态提示 _ 查看 _ 任务详情
  * */
  taskDetail(params) {
    return axios.post(`${base.systemPublicationpage}/Indextask/taskDetail?taskid=${params.taskid}&searchdate=${params.searchdate}&processInstanceId=${params.processInstanceId}`)
  },
  /*
  * 功能:常用模块 _ 获取 _ 功能模块列表(当前权限)
  * */
  getUsualMenu(){
    return axios.get(`${base.systemPublicationpage}/PersonalSpaceController/getUsualMenu`)
  },
  /*
  * 功能:调取打印任务单的相关数据
  * */
  printxls(params){
    return axios.post(`${base.systemPublicationpage}/Indextask/printxls`,params)
  },
  /*
  * 功能: 车辆到达通知
  * */
  findCarLoadByVin(params){
    return axios.get(`${base.systemPublicationpage}/CarLoad/findCarLoadByVin`,{params})
  },
  /*
  * 功能: 零部件到达通知
  * */
  findComponentPartByCondition(params){
    return axios.get(`${base.systemPublicationpage}/Compontpart/findComponentPartByCondition`,{params})
  },
};
export default systemPublicationpage
