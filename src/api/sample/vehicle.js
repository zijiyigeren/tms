import base from '../base'
import axios from '../../utils/http'
// 整车列表
const vehicle = {
    // 查询
    searchCarload(params) {  
        return axios.post(base.sample+'/CarLoad/searchCarload', params)
    },
    // 新增/编辑
    addCarload(params) {  
        return axios.post(base.sample+'/CarLoad/addCarload', params)
    },
    // 删除
    delCarload(params) { 
        return axios.delete(base.sample+'/CarLoad/delCarload', {params})
    },
    // 批量删除
    batchDelete(params) { 
        return axios.delete(base.sample+'/CarLoad/batchDel', {params})
    },
    // 获取编辑信息
    editCarload(params) { 
        return axios.get(base.sample+'/CarLoad/editCarload', {params})
    },
    // 车位-获取车场数据
    findStoreroom(params) {  
        return axios.get(base.sample+'/Storeroom/findStoreroom', {params})
    },
    // 车位-获取车场下-排数据
    findPlaceBaseChild(params) {  
        return axios.get(base.sample+'/PlaceAjax/findPlaceBaseChild', {params})
    },
    // 车位-获取排下-车位数据
    findPlace(params) {  
        return axios.get(base.sample+'/PlaceAjax/findPlace', {params})
    },
    // 获取任务号
    selectTaskcode(params) {  
        return axios.get(base.sample+'/CarLoad/selectTaskcode', {params})
    },
    // 流转
    obtainFlowTurn(params) { 
        return axios.get(base.sample+'/CarLoad/goFlow', {params})
    },
    // 获取部门数据
    getDepartTree() { 
        return axios.get(base.sample+'/department/getDepartTree')
    },
    // 流转-保存
    flowTurnPreserve(params) {  
        return axios.post(base.sample+'/CarLoad/editCarloadFlow', params)
    },
    // 流转-删除
    flowTurnDelete(params) { 
        return axios.delete(base.sample+'/CarLoad/delCarloadFlow', {params})
    },
    // 退样
    obtainRetreat(params) {  
        return axios.get(base.sample+'/CarLoadBack/toBack', {params})
    },
    // 退样-保存
    retreatPreserve(params) {  
        return axios.post(base.sample+'/CarLoadBack/toBackSave', params)
    },
    // 整车退样列表-查询
    queryData(params) {  
        return axios.post(base.sample+'/CarLoadBack/search', params)
    },
    //  整车退样列表-取消退样
    cancelCarBack(params) {  
        return axios.get(base.sample+'/CarLoadBack/cancelCarBack', {params})
    },
    //  整车退样列表-批量退样
    batchRetreatKind(params) {  
        return axios.post(base.sample+'/CarLoadBack/batchBack', params)
    },
    //  整车退样列表-批量取消退样
    batchCancelRetreat(params) {  
        return axios.get(base.sample+'/CarLoadBack/batchCancelCarBack', {params})
    },
}

export default vehicle