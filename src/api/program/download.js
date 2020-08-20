import base from '../base'
import axios from '../../utils/http'
// 统计表下载

const download = {
    // 查询数据
    apiFindCopy(params) { 
        return axios.post(`${base.systemgenre}/taskmanager/findCopy`, params)
    },
    // 下载统计表
    apiFindDisProductByTaskid(params) { 
        return axios.get(`${base.systemgenre}/TaskAjax/findDisProductByTaskid?downtype=${params.downtype}&taskid=${params.taskid}`)
    },
    // 绑定页面获取查询条件数据
    apiDownStaticxls(params) { 
        return axios.post(`${base.systemgenre}/Zjparam/downStaticxls`, params)
    },
    // 绑定页面获取table数据
    apiBindzjSearch(params) { 
        return axios.post(`${base.systemgenre}/Zjparam/bindzjSearch`, params)
    },
    // 绑定页面点击绑定
    apiBindzj(params) { 
        return axios.post(`${base.systemgenre}/Zjparam/bindzj`, params)
    },
    // 取消绑定
    apiCancelBinding(params) { 
        return axios.get(`${base.systemgenre}/TaskAjax/cancelBinding?taskid=`+params.id)
    },
    // 绑定到方案
    apiZjparamBindNew(params) { 
        return axios.get(`${base.systemgenre}/Zjparam/bindNew`, {params})
    },
}

export default download