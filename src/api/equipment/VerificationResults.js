import base from '@/api/base.js'
import axios from '@/utils/http.js'

const VerificationResults = {
    // 查询
    approval (params) {
        return axios.get(`${base.baseUrl}/Termianl/approval`, {params})
    },
    // 科室确定
    approvalCompleted (params) {
        return axios.get(`${base.baseUrl}/Termianl/approvalCompleted`, {params})
    },
    // 查看证书 详情
    certificateView (params) {
        return axios.get(`${base.baseUrl}/Termianl/certificateView`, {params})
    },
    // 查看证书 上传保存审批文件
    uploadApproval (params) {
        return axios.post(`${base.baseUrl}/Termianl/uploadApproval`, params)
    },
}
export default VerificationResults
