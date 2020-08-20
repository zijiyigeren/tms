import base from '../base'
import axios from '../../utils/http'

const systemparams = {
    // 获取列表数据
    apiFindCheckCartTypes(params) { 
        return axios.get(`${base.systemgenre}/CheckcarttypeController/findCheckCartTypes`,{params})
    },
    // 删除
    apiDeleteCheckCartType(params) { 
        return axios.delete(`${base.systemgenre}/CheckcarttypeController/deleteCheckCartType`,{params})
    },
    // 编辑 / 新建
    apiSaveCheckCartType(params) { 
        return axios.post(`${base.systemgenre}/CheckcarttypeController/saveCheckCartType`,params)
    },
}

export default systemparams