import base from '../base'
import axios from '../../utils/http'
// 仪器设备查询

const flowcheng = {
    // 流程定义-获取列表数据
    starupTableData(params) { 
        return axios.get(base.wang+'/activiti/repository/processes', {params})
    },
    // 流程定义-新增流程
    starupNewFlow(params) {
        return axios.post(base.wang+'/activiti/repository/process', params, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
    },
    // 流程定义-发布
    starupRelease(params) {
        return axios.post(base.wang+'/models/' + params + '/deployment')
    },
    // 流程定义-启动
    flowStartUp(params) {
        return axios.post(base.wang+'/activiti/repository/getProcessStartRequestForm', params)
    },
    // 流程定义-启动-表单
    startUpForm(params) { 
        return axios.get(base.wang+'/form/' + params)
    },
    // 流程定义-启动-实例
    startUpExist(params) { 
        return axios.get(base.wang+'/activiti-task/existMultiInstance?processDefinitionKey='+params)
    },
    // 流程定义-启动-确认
    startUpProcess(params) { 
        return axios.post(base.wang+'/activiti/repository/startProcess', params)
    },
    // 流程定义-删除
    starupDelete(params) { 
        return axios.delete(base.wang+'/models/' + params)
    },
    



    // 流程
    progressImageData(params) { 
        return axios.get(base.wang+'/models/progressImageData', {params})
    },
    // 处理人意见/明细日志-处理明细
    processingRecords(params) { 
        return axios.get(base.wang+'/activiti-task/processing-records', {params})
    },
    // 组织机构列表
    organizeList(params) { 
        return axios.get(base.wang+'/department/getDepartTree', {params})
    },
    // 组织机构对应用户
    organizePeople(params) { 
        return axios.get(base.wang+'/department/sys/org/listUserEOByOrgId', {params})
    },
    // 用户角色列表
    roleList(params) { 
        return axios.get(base.wang+'/roleManagement/sys/role', {params})
    },
    // 用户角色对应用户
    rolePeople(params) { 
        return axios.get(base.wang+'/member/sys/user', {params})
    },
    // 处理任务-转办
    transfer(params) { 
        return axios.post(base.wang+'/activiti-task/transfer'+'?taskId='+params.taskId+'&assignee='+params.assignee+'&orignalAssignee='+params.orignalAssignee, {})
    },
    // 处理任务-提交
    complete(params) { 
        return axios.post(base.wang+'/activiti-task/complete', params)
    },



    // 待办-获取列表数据
    stayTableData(params) { 
        return axios.get(base.wang+'/activiti-task/runtime', {params})
    },
    // 待办-处理任务-获取判断的字典数据
    stayOperations(id) { 
        return axios.get(base.wang+'/activiti-task/' + id + '/operations')
    },
    // 待办-处理任务-正文
    stayText(params) { 
        return axios.get(base.wang+'/activiti-task/'+params)
    },
    // 待办-指定回退-获取跳转节点数据
    stayFallbackData(params) { 
        return axios.get(base.wang+'/jump/' + params + '/activities')
    },


    // 已办-获取列表数据
    alreadydoTableData(params) { 
        return axios.get(base.wang+'/activiti-task/history', {params})
    },
    // 已办-查看任务-正文
    alreadydoText(params) { 
        return axios.get(base.wang+'/activiti-task/history/'+params)
    },


    // 已发-获取列表数据
    alreadyhairTableData(params) { 
        return axios.get(base.wang+'/activiti/repository/processInstances/track-list', {params})
    },
    // 已发-查看任务-正文
    alreadyhairText(params) { 
        return axios.get(base.wang+'/activiti-task/procInsId/'+params)
    },


    // 受理组-获取列表数据
    suffergroupTableData(params) { 
        return axios.get(base.wang+'/activiti-task/group', {params})
    },
    // 受理组-申领任务
    applyTask(params) { 
        return axios.post(base.wang+'/activiti-task/group/'+params.id+ '?usid=' +params.usid)
    },
}

export default flowcheng