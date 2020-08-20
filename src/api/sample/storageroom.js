import base from '../base'
import axios from '../../utils/http'
// 零部件库房-接口
const storageroom = {
    // 查询
    parts(params) {  
        return axios.post(base.sample+'/Storeroom/parts', params)
    },
    // 新增/编辑
    partsEdit(params) {  
        return axios.post(base.sample+'/Storeroom/partsEdit', params)
    },
    // 删除
    partsDel(params) { 
        return axios.delete(base.sample+'/Storeroom/partsDel', {params})
    },
    // 编辑详细-数据
    getPbc(params) { 
        return axios.get(base.sample+'/Storeroom/getPbc', {params})
    },
    // 编辑详细-新增/编辑
    editPbc(params) {  
        return axios.post(base.sample+'/Storeroom/editPbc', params)
    },
    // 编辑详细-删除
    delPbc(params) { 
        return axios.delete(base.sample+'/Storeroom/delPbc', {params})
    },
}

export default storageroom