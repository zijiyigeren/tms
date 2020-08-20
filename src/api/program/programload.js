import base from '../base'
import axios from '../../utils/http'
// 离线2.0加载

const programload = {
    // 获取列表数据
    apiLxFindList(params) { 
        return axios.post(`${base.entrustamend}/lx/findList`, params)
    },
    // 加载
    apiLxLoad(params) { 
        return axios.post(`${base.entrustamend}/lx/load`, params)
    },
}

export default programload