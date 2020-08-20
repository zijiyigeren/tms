import base from '../base'
import axios from '../../utils/http'
// 统计表编号纠错

const correction = {
    // 查询获取列表数据
    apiZjstatictableFindList(params) { 
        return axios.get(`${base.wang}/zjstatictable/findList?statNumber=`+ params,)
    },
    // 修改编号
    apiZjstatictableEdit(params) { 
        return axios.post(`${base.wang}/zjstatictable/edit`, params)
    },
}

export default correction