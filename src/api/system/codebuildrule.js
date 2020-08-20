import base from '../base'
import axios from '../../utils/http'
// 编码生成规则
const codebuildrule = {
    // 查询
    list(params) {  
        return axios.get(base.systemgenre+'/sys/fillRule/list', {params})
    },
    // 新增
    add(params) {  
        return axios.post(base.systemgenre+'/sys/fillRule/add', params)
    },
    // 编辑
    edit(params) {  
        return axios.put(base.systemgenre+'/sys/fillRule/edit', params)
    },
    // 删除
    delete(params) { 
        return axios.delete(base.systemgenre+'/sys/fillRule/delete', {params})
    },
    // 批量删除
    deleteBatch(params) { 
        return axios.delete(base.systemgenre+'/sys/fillRule/deleteBatch', {params})
    },
    // 编辑-数据
    queryById(params) { 
        return axios.get(base.systemgenre+'/sys/fillRule/queryById', {params})
    },
}

export default codebuildrule;
