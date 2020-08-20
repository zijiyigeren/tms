import base from '../base'
import axios from '../../utils/http'
// 任务管理

const taskmanage = {
    // 获取主检科室数据
    apiSearchDep() { 
        return axios.get(`${base.systemgenre}/taskmanager/searchDep`)
    },
    // 查询数据
    apiSearchTaskInfo(params) { 
        return axios.post(`${base.systemgenre}/taskmanager/searchTaskInfo`, params)
    },
    // 点击浏览
    apiFindJobContent(data) { 
        return axios.post(`${base.systemgenre}/taskmanager/findJobContent?taskid=`+data.taskid,data.taskCondition)
    },
    // 点击流转
    apiFindWorkLog(params) { 
        return axios.get(base.systemgenre + '/job/task/findLogByFlow/' + params)
    },
    // 退回草稿
    apiContentDelete(params) { 
        return axios.get(`${base.systemgenre}/job/task/getBackNode`, {params})
    },
    // 退回
    apiJobTaskFindBackFlow(params) { 
        return axios.get(`${base.systemgenre}/job/task/getBackNode/`, {params})
    },
    // 退回完成确定
    apiJobTaskGoBack(params) { 
        return axios.post(`${base.systemgenre}/job/task/goBack`, params)
    },
    // 允许主检修改报告
    apiDocCanSave(params) { 
        return axios.get(`${base.systemgenre}/taskmanager/docCanSave`, {params})
    },
    // 任务说明
    apiSearchTaskDoc(params) { 
        return axios.get(`${base.systemgenre}/taskmanager/searchTaskDoc`, {params})
    },
    // 保存任务说明
    apiSaveTaskExplain(params) { 
        return axios.post(`${base.systemgenre}/taskmanager/saveTaskExplain`, params)
    },
    // 保存任务单备注
    apiSaveCheckRemark(params) { 
        return axios.post(`${base.systemgenre}/taskmanager/saveCheckRemark2`, params)
    },
    // 修改公章类型
    apiGoUpdateZhang(params) { 
        return axios.get(`${base.systemgenre}/taskmanager/goUpdateZhang`, {params})
    },
    // 任务管理-编辑
    apiEditTaskInfo(params) { 
        return axios.post(`${base.systemgenre}/taskmanager/editTaskInfo?taskid=${params.taskid}&processInstanceId=${params.processInstanceId}`)
        //taskid=${a}&searchdate=${b}&processInstanceId=${c}
    },
    // 打开报告
    apiGoOpenWordForTask(params) { 
        return axios.get(`${base.systemgenre}/TaskAjax/goOpenWordForTask`, {params})
    },
    //归档
    TaskReport(id){
        return axios.get(`${base.wang}/TaskReport/viewGd/`+ id)
    },
    // 上传
    uploadAttach(fd){
        return axios.post(`${base.wang}/TaskReport/uploadAttach`,fd)
    },
    // 上传完后-保存归档状态
    saveUploadAttachStatus(params){
        return axios.post(`${base.wang}/TaskReport/saveUploadAttachStatus`, params)
    },
    //删除附件
    delAttach(params){
        return axios.post(`${base.wang}/TaskReport/delAttach`,params)
    },
    // 快查
    apiCheckViewTaskManager(params) { 
        return axios.get(`${base.systemgenre}/taskmanager/checkViewTaskManager`, {params})
    },
    //提交归档
    submitGd(obj){
        return axios.post(`${base.wang}/TaskReport/submitGd`,obj)
    },
    //归档权限
    power(){
        return axios.get(`${base.wang}/TaskReport/power`)
    },
    //取消归档
    cancelGd(id){
        return axios.get(`${base.wang}/TaskReport/cancelGd/` + id)
    },
    // //下载文件
    // download(params){
    //     return axios.post(`${base.wang}/TaskReport/batchDownload`,params)
    // },
    getdownloadpath(){
        return `${base.wang}/sys/lims/file/downloadFile`
    },
    //查看文件
    printXlsByTaskId(id){
        return axios.post(`${base.wang}/Indextask/printXlsByTaskId?taskid=`+ id)
    },
    //确定文件
    confirmOrCancel(params){
        return axios.post(`${base.wang}/TaskReport/gdy/confirmOrCancel`,params)
    },
    //确定归档 没有数据
    confirmGd(params){
        return axios.post(`${base.wang}/TaskReport/confirmGd`,params)
    },
}

export default taskmanage