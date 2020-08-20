import base from '../base'
import axios from '../../utils/http'

const systemgenre = {
    // 获取列表数据
    apiFindItemscatalogs(params) { 
        return axios.get(`${base.systemgenre}/itemscatalogController/findItemscatalogs`,{params})
    },
    // 删除
    apiDeleteItemscatalog(params) { 
        return axios.delete(`${base.systemgenre}/itemscatalogController/deleteItemscatalog`,{params})
    },
    // 编辑
    apiDeditItemscatalog(params) { 
        return axios.put(`${base.systemgenre}/itemscatalogController/editItemscatalog`,params)
    },
    // 新建
    apiAddItemscatalog(params) { 
        return axios.post(`${base.systemgenre}/itemscatalogController/addItemscatalog`,params)
    },
}

export default systemgenre