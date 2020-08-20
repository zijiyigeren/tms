import base from '@/api/base.js'
import axios from '@/utils/http.js'

const eqMaintenance = {
    // 查询
    getList (params) {
        return axios.post(`${base.baseUrl}/MaintenanceRecord/getList`, params)
    },
    // 新增
    addRecord (params) {
        return axios.post(`${base.baseUrl}/MaintenanceRecord/addRecord`, params)
    },
    // 删除
    delRecord (params) {
        return axios.delete(`${base.baseUrl}/MaintenanceRecord/delRecord`, {params})
    },
}
export default eqMaintenance
