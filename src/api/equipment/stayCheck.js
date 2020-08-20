import base from '@/api/base.js'
import axios from '@/utils/http.js'

const stayCheck = {
    // 查询
    getWaitingTermina (params) {
        return axios.post(`${base.baseUrl}/Termianl/getWaitingTerminal`, params)
    },
    // 取消待检状态
    cancelWaitingStatus (params) {
        return axios.get(`${base.baseUrl}/Termianl/cancelWaitingStatus`, {params})
    },
    // 提交检定
    gochecking (params) {
        return axios.get(`${base.baseUrl}/Termianl/gochecking`, {params})
    },
}
export default stayCheck
