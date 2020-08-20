import base from '../base'
import axios from '../../utils/http'

const pigeohole = {
    //类型
    getReportBaseInformation(){
        return axios.post(`${base.lin}/Task/getReportBaseInformation?processinstance=`+7)
    },
    //查询
    attarch(obj){
        return axios.post(`${base.lin}/Task/attarch`,obj)
    },
    //浏览
    findJobContentByAttarch(obj){
        return axios.post(`${base.lin}/TaskAjax/findJobContentByAttarch`,obj)
    },
    //子浏览
    findWorkLog(params){
        return axios.get(base.lin + '/job/task/findLogByFlow/' + params)
    },
    //点击归档率 - 查询
    findCheckType(){
        return axios.get(`${base.wang}/job/task/findCheckType`)
    },
    //点击归档率 - 列表
    archivingRate(obj){
        return axios.post(`${base.wang}/Task/archivingRate`,obj)
    },
    findRateQueryVO(){
        return axios.get(`${base.wang}/Task/findRateQueryVO`)
    },
    findMasterAttarchDetail(obj){
        return axios.get(`${base.wang}/Task/findMasterAttarchDetail?master=`+obj.loginid+'&orgID='+obj.orgID)
    },
    //归档确认
    findJobContentByGdAttarch(obj){
        return axios.post(`${base.wang}/TaskReport/findJobContentByGdAttarch`,obj)
    },
    //归档-下载前的检验
    apiTaskReportDownloadCheck(params){
        return axios.post(`${base.wang}/TaskReport/downloadCheck`, params)
    },
    // 发送邮件
    sendMailButton(params){
      return axios.get(`${base.wang}/mail/sendMailButton`, {params})
    },
    // 下载(常规、修改)报告
    sendMail(params){
      return axios.post(`${base.wang}/mail/sendMail`, params)
    },
}
export default pigeohole;
