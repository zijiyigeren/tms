import base from '../base'
import axios from '../../utils/http'
// 新产品公告

const notice = {
    // 新产品公告-查询数据
    apiZjparamList(params) { 
        return axios.post(`${base.systemgenre}/Zjparam/list`, params)
    },
    // 新产品公告历史-查询数据
    gethistoryList(params) { 
        return axios.post(`${base.systemgenre}/Zjparam/gethistoryList`, params)
    },
    // 详情
    apiZjparamDetail(params) { 
        return axios.post(`${base.systemgenre}/Zjparam/detail`, params)
    },
    // 下达-获取下达数据
    apiZjparamToTask(params) { 
        return axios.post(`${base.systemgenre}/Zjparam/toTask`, params)
    },
    // 下达-获取整车数据
    apiZjparamToselectmodel(params) { 
        return axios.post(`${base.systemgenre}/Zjparam/toselectmodel`, params)
    },
    // 下达-继续下达
    apiZjparamEditItems(params) { 
        return axios.post(`${base.systemgenre}/Zjparam/editItems`, params)
    },
    // 迁移
    apiZjparamTomove(params) { 
        return axios.get(`${base.systemgenre}/Zjparam/tomove`, {params})
    },
    // 加载
    apiZjparamUpload(params) { 
        return axios.get(`${base.systemgenre}/Zjparam/upload`, {params})
    },
    // 合并
    apiZjparamBing(params) { 
        return axios.get(`${base.systemgenre}/Zjparam/bing`, {params})
    },
    // 下统计
    apiFindDisproductById(params) { 
        return axios.get(`${base.systemgenre}/TaskAjax/findDisproductById`, {params})
    },
    // 下统计-获取查询条件
    apiSearchTaskBind(params) { 
        return axios.get(`${base.systemgenre}/taskmanager/searchTaskBind`, {params})
    },
}

export default notice