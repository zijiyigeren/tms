import base from '../base'
import axios from '../../utils/http'
// 导出列表
const exportlist = {
    // 获取查询，列表展示字段
    getFiled(params) { 
        return axios.get(base.sample+'/autoExported/getFiled', {params})
    },
    // 查询
    search(params) {  
        return axios.post(base.sample+'/autoExported/search', params)
    },
    // 导出
    autoExport(params) {  
        return axios.post(base.sample+'/autoExported/autoExport', params)
    },
}

export default exportlist