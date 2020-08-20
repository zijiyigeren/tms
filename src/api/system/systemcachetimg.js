import base from '../base'
import axios from '../../utils/http'
// 公章图片

const systemcachetimg = {
    // 获取列表数据
    apiCachePictureList(params) { 
        return axios.post(`${base.systemcachetimg}/CachePicture/cachePictureList`, params)
    },
    // 删除
    apiDeletePicture(params) { 
        return axios.delete(`${base.systemcachetimg}/CachePicture/deletePicture`,{params})
    },
    // 编辑
    apiEditPicture(params) { 
        return axios.post(`${base.systemcachetimg}/CachePicture/editPicture`,params)
    },
    // 新建
    apiUploadPicture(params) { 
        return axios.post(`${base.systemcachetimg}/CachePicture/uploadPicture`,params)
    },
    // 日志管理
    apiLog(params) { 
        return axios.get(`${base.wang}/log`, {params})
    },
}

export default systemcachetimg