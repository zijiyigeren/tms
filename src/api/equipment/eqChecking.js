import base from '@/api/base.js'
import axios from '@/utils/http.js'

const eqChecking = {
    // 查询
    getCheckingTerminal (params) {
        return axios.post(`${base.baseUrl}/Check/getCheckingTerminal`, params)
    },
    // 获取校准信息(检定信息)
    getCheckingTerminalInfo (params) {
        return axios.get(`${base.baseUrl}/Check/getCheckingTerminalInfo`, {params})
    },
    // 取消
    deleteCheck (params) {
        return axios.delete(`${base.baseUrl}/Check/deleteCheck`, {params})
    },
    // 上传证书
    uploadCertificate (params) {
        return axios.post(`${base.baseUrl}/Certificate/uploadCertificate`, params)
    },
    // 下载证书
    downloadCertificate (fileId) {
        return axios.get(`${base.baseUrl}/sys/lims/file/${fileId}/download`)
    },
    // 删除证书
    deleteCertificate (params) {
        return axios.delete(`${base.baseUrl}/Certificate/deleteCertificate`,{params})
    },
    // 检定信息 - 确定
    checkCompleted (params) {
        return axios.post(`${base.baseUrl}/Check/checkCompleted`,params)
    },
}

export default eqChecking
