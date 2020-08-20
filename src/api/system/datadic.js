import base from '../base'
import axios from '../../utils/http'

// 数据字典
const datadic = {
    // 查询-列表
    sysDictionary(params) {
        return axios.get(`${base.wang}/sys/dictionary`, {params})
    },
    // 编辑_详情
    editDetails(params) {
        return axios.get(`${base.wang}/sys/dictionary/${params}`)
    },
    // 新增
    newlyAdded(params) {
        return axios.post(`${base.wang}/sys/dictionary`, params)
    },
    // 编辑_修改
    editModify(params) {
        return axios.put(`${base.wang}/sys/dictionary`, params)
    },
    // 删除
    dictionaryDelete(params) { 
        return axios.delete(`${base.wang}/sys/dictionary/delete/${params}`)
    },
    // 字典类型-查询列表
    dictypePage(params) {
        return axios.get(`${base.wang}/sys/dictype/page`, {params})
    },
    // 字典类型_编辑详情
    dictypeEdit(params) {
        return axios.get(`${base.wang}/sys/dictype/${params}`)
    },
    // 字典类型_新增
    dictypeNewlyAdded(params) {
        return axios.post(`${base.wang}/sys/dictype`, params)
    },
    // 字典类型_编辑修改
    dictypeEditModify(params) {
        return axios.put(`${base.wang}/sys/dictype`, params)
    },
    // 字典类型_删除
    dictypeDelete(params) { 
        return axios.delete(`${base.wang}/sys/dictype/delete/${params}`)
    },
    // 字典类型_级联数据
    getListNotId(params) {
        return axios.get(`${base.wang}/sys/dictionary/getListNotId/${params}`)
    },
}

export default datadic