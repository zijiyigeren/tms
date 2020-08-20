import base from '../base'
import axios from '../../utils/http'
// 批量打印
const batchplt = {
    // 查询
    print(params) {  
        return axios.post(base.sample+'/printVin/print', params)
    },
    // 生成
    createone(params) {  
        return axios.post(base.sample+'/printVin/createone', params)
    },
    // 批量选择打印
    vinAjax(params) {  
        return axios.post(base.sample+'/VinAjax/printVin', params)
    },
}

export default batchplt