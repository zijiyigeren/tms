import base from '../base'
import axios from '../../utils/http'
// 问题报告

const surveyissue = {
    // 获取列表数据
    apiFindList() { 
        return axios.get(`${base.entrustamend}/sysword/findList`)
    },
    // 重新执行
    apiReexecuteEeport(params) {
        return axios.put(`${base.entrustamend}/sysword/reexecuteEeport?execid=${params}`)
    },
    // 回退报告
    apiBackReport(params) {
        return axios.put(`${base.entrustamend}/sysword/backReport?execid=${params.execid}&inspectid=${params.inspectid}`)
    },
    apiSetSession(params) { 
        return axios.get(`${base.entrustamend}/TaskAjax/setSession/${params}`)
    },
    // 获取原始记录列表数据
    findOrgList() { 
        return axios.get(`${base.entrustamend}/sysword/findOrgList`)
    },
    // 重新执行-原始记录
    reexecuteOrgReport(params) {
        return axios.put(`${base.entrustamend}//sysword/reexecuteOrgReport?execid=${params}`)
    },
}

export default surveyissue