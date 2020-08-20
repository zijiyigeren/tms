import base from '../base'
import axios from '../../utils/http'

const myReport = {
    //报告快查按钮
    quicklyQuickly(inspectid) {
        return axios.post(`${base.baseUrl}/TaskReport/findWordPathByid?inspectid=${inspectid}&random=${Math.random()}`)
    },
    //查询列表
    queryProject(data) {
        return axios.post(`${base.baseUrl}/TaskReport/viewMyReportList`, data)
        axios.timeout = 1000 * 20
    },
    //浏览每条报告（子查询）
    readEveryReport(params) {
        return axios.post(`${base.baseUrl}/TaskReport/viewMyReportSubList`, params)
    },
    //修改-展示编号
    editReportBtn() {
        return axios.post(`${base.baseUrl}/TaskReport/mywordedit`)
    },
    //修改-提交
    editReportRead(params) {
        return axios.post(`${base.baseUrl}/TaskReport/mywordedit`, params)
    },
    //修改-流转
    editReport(inspectids) {
        return axios.post(`${base.baseUrl}/TaskReport/findWorkLog?inspectids=${inspectids}`)
    },
    //重新生成快查
    againReport(inspectids) {
        return axios.post(`${base.baseUrl}/TaskReport/repeatPdf?inspectids=${inspectids}`)
    },
    //归档率-下拉框
    filingRate() {
        return axios.get(`${base.baseUrl}/job/task/findCheckType`)
    },
    //点击归档率 - 表格
    archivingRate(obj) {
        return axios.post(`${base.baseUrl}/Task/archivingRate`, obj)
    },
    // 点击归档率 - 表格 - 人员报告计算 - 未归档浏览
    personMath(obj) {
        return axios.get(`${base.baseUrl}/Task/findMasterAttarchDetail`, obj)
    },
    //详细
    detailsReport(taskid) {
        return axios.post(`${base.baseUrl}/Indextask/taskDetail?taskid=${taskid}`)
    },
    //获取用户信息
    pullUserInfo() {
        return axios.get(`${base.baseUrl}/userInfo`)
    },
    // 设为可/不可删除
    setDelete(params) {
        return axios.post(`${base.baseUrl}/TaskReport/goSetDelete?inspect_id=${params.inspect_id}&partitiondate=${params.partitiondate}&sign=${params.sign}`)
    },
    //下载wordPdf
    uploadWordTo(inspect_id) {
        return axios.post(`${base.baseUrl}/TaskReport/checktaskdown?inspect_id=${inspect_id}`)
    },
    // 详细
    uploadDetails(params) {
        return axios.get(`${base.systemgenre}/TaskAjax/goOpenWordForTask`, {params})
    },
    // 我的报告-批量提交归档
    batchSubmitGd(params){
        return axios.post(`${base.wang}/TaskReport/batchSubmitGd`,params)
    },
    // 报告归档-批量确认归档
    batchConfirmGd(params){
        return axios.post(`${base.wang}/TaskReport/batchConfirmGd`,params)
    },
}

export default myReport;