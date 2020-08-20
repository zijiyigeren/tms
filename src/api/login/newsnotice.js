import base from '../base'
import axios from '../../utils/http'

const newsnotice = {
    // 查询
    findMessage(params) {  
        return axios.post(base.sample+'/MessageController/findMessage', params)
    },
    // 删除
    delMessage(params) { 
        return axios.delete(base.sample+'/MessageController/delMessage', {params})
    },
    // 批量已读
    setIsRead(params) {  
        return axios.get(base.sample+'/MessageController/setIsRead', {params})
    },
}

export default newsnotice