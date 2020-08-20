import base from '../base'
import axios from '../../utils/http'


const allot = {
    //报告类型
    findworkflow(){
        return axios.get(`${base.wang}/job/task/findWorkFlow/`+ '2')
    },
    findtasklist(obj){
        return axios.post(`${base.wang}/job/task/findTaskList`,obj)
    },
    //检验类型
    findCheckType(){
        return axios.get(`${base.wang}/job/task/findCheckType`)
    },
    //点击阅览
    findJobContent(obj){
        return axios.post(`${base.wang}/job/task/findJobContent?taskid=`+obj.iddd,obj)
    },
    //点击子浏览
    findWorkLog(id){
        return axios.get(`${base.wang}/job/task/findLogByFlow/${id}`)
    },
    //提交
    taskToDoNext(obj){
        return axios.post(`${base.wang}/job/task/taskToDoNext3`,obj)
    },
    //回退
    findBackFlow(businessKey,isShowMainNode){
       
        return axios.get(`${base.wang}/job/task/getBackNode?businessKey=${businessKey}&isShowMainNode=${isShowMainNode}`)
    },
    //确定回退
    goBack(params){
        return axios.post(`${base.wang}/job/task/goBack`,params)
    },
    //报告编辑科室
    findOfficeMode(){
        return axios.get(`${base.wang}/sysCheckbox/findOffice`)
    },
    //原始记录查看
    originalrecordview(taskContentId,type){
        return axios.get(`${base.wang}/TaskReport/viewGdByType/${taskContentId}/${type}`)
    },
    

    //报告编辑员
    findOfficedepart(id,examineName,processInstanceId){
        return axios.get(`${base.wang}/job/task/getUpdatorList/${id}/${processInstanceId}?examineName=${examineName}`)
    },

    //检验部科室主任
    director(id,examineName){
        return axios.get(`${base.wang}/job/task/getZhurenList/${id}/${examineName}`)
    },
    
    //批量分配
    batchTaskToDoNext(params){
        return axios.post(`${base.wang}/job/task/batchTaskToDoNext`,params)
    },

    
 



}
export default allot;