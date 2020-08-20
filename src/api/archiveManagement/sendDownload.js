import base from '@/api/base.js'
import axios from '@/utils/http.js'

const sendDownload = {
    // 查询
    mailDownlist (params) {
        return axios.post(`${base.baseUrl}/mail/downlist`, params)
    },
    // 删除
    mailDelete (params) {
        return axios.delete(`${base.baseUrl}/mail/delete`, {params})
    },
    // 详细
    mailListHistory (params) {
        return axios.get(`${base.baseUrl}/mail/listhistory`, {params})
    },
    //审批借阅-列表
    approveList (params) {
        return axios.post(`${base.baseUrl}/attarchLend/manage/list`, params)
    },
    //借阅类型接口
    dictype () {
        return axios.get(`${base.baseUrl}/sys/dictype/list?dicCode=AttarchLendType`)
    },
     //我的借阅状态类型接口
    statustype () {
        return axios.get(`${base.baseUrl}/sys/dictype/list?dicCode=AttarchLendStatus`)
    },
    //借阅申请保存
    manageSave(params) {
        return axios.post(`${base.baseUrl}/attarchLend/manage/save`,params)
    },
    //我的借阅查列表
    myAttarchLendList(params) {
        return axios.post(`${base.baseUrl}/attarchLend/approve/list`,params)
    },
    //借阅审批-借出/驳回/归还.
    approvethree(params) {
        return axios.post(`${base.baseUrl}/attarchLend/approve`,params)
    },





}
export default sendDownload
