import base from '../base'
import axios from '../../utils/http'
// 批量打印
const paramsConfig = {
    // 获取全部参数信息
    findAllParam(params) {  
        return axios.get(base.wang+'/sysParam/findAllParam', {params})
    },
    // 报存
    save(params) {  
        return axios.post(base.wang+'/sysParam/save', params)
    },
    // 图片回显数据
    file(params) {  
        return axios.get(base.wang+'/sys/lims/file/'+params)
    },
    // 图片上传
    upload(params) {  
        return axios.post(base.wang+'/sys/lims/file/upload', params)
    },
    //原始记录模板管理
    originalrecordlist(params) {  
        return axios.post(base.wang+'/sys/recordTemplate/list', params)
    },
     // 原始记录批量删除
     deleteAllId(ids) {  
        return axios.delete(base.wang+`/sys/recordTemplate/${ids}`)
    },
    // 原始记录绑定的检验项目
    bindids(itemId,templateId) {  
        return axios.get(`${base.wang}/sys/recordTemplate/bind/?itemId=${itemId}&templateId=${templateId}`)
    },
    //原始记录模板管理-新增
    originalrecordsave(name) {  
        return axios.get(`${base.wang}/sys/recordTemplate/saveByName?name=${name}`)
    },
    //原始记录模板管理-EXCEL导出 校验接口
    checkExportExcelTemplate(params){
        return axios.post(`${base.wang}/sys/recordTemplate/checkExportExcel`,params)
    },
    //原始记录模板管理-EXCEL导出
    exportExcelTemplate(params){
        return axios.post(`${base.wang}/sys/recordTemplate/exportExcel`,params)
    }



}

export default paramsConfig