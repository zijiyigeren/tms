import base from '../base'
import axios from '../../utils/http'

const entrustamend = {
    // 获取列表数据 / 点击查询
    apiClickInquire(params) { 
        return axios.get(`${base.entrustamend}/xgd/findList`, {params})
    },
    // 点击删除
    apiHandleDelete(code) {
        return axios.delete(`${base.entrustamend}/xgd/${code}`)
    },
    // 下拉列表数据
    apiXgdFindOptions() {
        return axios.get(`${base.entrustamend}/xgd/findOptions`)
    },
    // 下达日期-商定日期
    apiXgdFindDate() {
        return axios.get(`${base.entrustamend}/xgd/findDate`)
    },
    // 编辑-详情数据
    apiXgdFindDetail(params) {
        return axios.get(`${base.entrustamend}/xgd/findDetail`, {params})
    },
    // 修改单号查询
    apiTaskAjaxFindTaskCodeAndTempLock(params) {
        return axios.get(`${base.entrustamend}/TaskAjax/findTaskCodeAndTempLock`, {params})
    },
    // 任务号查询
    apiTaskAjaxFindTaskContentByTaskCode(params) {
        return axios.get(`${base.entrustamend}/TaskAjax/findTaskContentByTaskCode`, {params})
    },
    // 带入基本信息
    apiTaskAjaxFindTaskInfoByCode(params) {
        return axios.get(`${base.entrustamend}/TaskAjax/findTaskInfoByCode`, {params})
    },
    // 新建
    apiXgdAddXgd(params) {
        return axios.post(`${base.entrustamend}/xgd/addXgd`, params)
    },
    // 编辑
    apiXgdEditXgd(params) {
        return axios.post(`${base.entrustamend}/xgd/editXgd`, params)
    },
    // 浏览
    apiXGDAjaxGetXg1(params) {
        return axios.get(`${base.entrustamend}/XGDAjax/getXg1`, {params})
    },
    // 报告删除
    apiXgdReport(params) {
        return axios.delete(`${base.entrustamend}/xgd/report`, {params})
    },
    
    // 报告-下达任务
    apiXgdSendReport(params) {
        return axios.post(`${base.entrustamend}/xgd/sendReport?xd2Ids=${params}`)
    },
    //获取填充规则
    apixgdcode() {
        return axios.put(`${base.entrustamend}/sys/fillRule/getRuleParam/xgd_code`)
    },
    //获取修改单编号
    apigetCode(params) {
        return axios.put(`${base.entrustamend}/sys/fillRule/getCode/xgd_code`,params)
    },

}

export default entrustamend