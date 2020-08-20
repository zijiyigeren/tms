import base from '../base'
import axios from '../../utils/http'
// 零部件列表
const spareparts = {
    // 查询
    search(params) {  
        return axios.post(base.sample+'/Compontpart/search', params)
    },
    // 新增/编辑
    edit(params) { 
        return axios.post(base.sample+'/Compontpart/edit', params)
    },
    // 删除
    del(params) { 
        return axios.delete(base.sample+'/Compontpart/del', {params})
    },
    // 批量删除
    batchDelete(params) { 
        return axios.delete(base.sample+'/Compontpart/batchDel', {params})
    },
    // 获取编辑信息
    detail(params) { 
        return axios.get(base.sample+'/Compontpart/detail', {params})
    },
    // 任务单号查询
    getTaskCode(params) { 
        return axios.post(base.sample+'/Compontpart/getTaskCode', params)
    },
    // 部门
    getDepartment(params) { 
        return axios.get(base.sample+'/Compontpart/getDepartment', {params})
    },
    // 库房编号
    initPlace(params) { 
        return axios.get(base.sample+'/Compontpart/initPlace', {params})
    },
    // 生成样品批号
    findComponentCode(params) { 
        return axios.get(base.sample+'/PlaceAjax/findComponentCode', {params})
    },
    // 流转-数据
    obtainFlowTurn(params) { 
        return axios.get(base.sample+'/Compontpart/goFlow', {params})
    },
    // 退样
    obtainRetreat(params) {  
        return axios.get(base.sample+'/CompontpartBack/toBack', {params})
    },
    // 退样-保存
    retreatPreserve(params) {  
        return axios.post(base.sample+'/CompontpartBack/toBackSave', params)
    },
    // 整车退样列表-查询
    queryData(params) {  
        return axios.post(base.sample+'/Compontpart/search', params)
    },
    //  整车退样列表-取消退样
    cancelCarBack(params) {  
        return axios.get(base.sample+'/CompontpartBack/cancelCompontpartBack', {params})
    },
    //  整车退样列表-批量退样
    batchRetreatKind(params) {  
        return axios.post(base.sample+'/CompontpartBack/batchBack', params)
    },
    //  整车退样列表-批量取消退样
    batchCancelRetreat(params) {  
        return axios.get(base.sample+'/CompontpartBack/batchCancelCompontpartBack', {params})
    },
}

export default spareparts