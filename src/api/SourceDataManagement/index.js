import base from '@/api/base.js'
import axios from '@/utils/http.js'

const SourceDataManagement = {
  // 列表查询
  c1(params){
    return axios.get(`${base.baseUrl}/online/cgform/head/list`,{params})
  },
  // 新增
  c2(params){
    return axios.post(`${base.baseUrl}/online/cgform/api/addAll`,params)
  },
  // 编辑后的保存
  c3(params){
    return axios.put(`${base.baseUrl}/online/cgform/api/editAll`,params)
  },
  // 删除
  c4(params){
    return axios.delete(`${base.baseUrl}/nline/cgform/head/delete`,{params})
  },
  // 校验表名重复
  c5(params){
    return axios.get(`${base.baseUrl}/online/cgform/api/checkOnlyTable`,{params})
  },
  c6(params){
    return axios.get(`${base.baseUrl}/online/cgform/field/listByHeadId`,{params})
  },
  c7(params){
    return axios.get(`${base.baseUrl}/online/cgform/index/listByHeadId`,{params})
  },
  // 移除
  c8(params){
    return axios.delete(`${base.baseUrl}/online/cgform/head/removeRecord`,{params})
  },
  c9(params){
    return axios.get(`${base.baseUrl}/online/cgform/head/tableInfo`,{params})
  },
  c100(params){
    return axios.post(`${base.baseUrl}/online/cgform/api/codeGenerate`,params)
  },
  c11(params){
    return axios.post(`${base.baseUrl}/online/cgform/api/doDbSynch/${params.id}/${params.type}`)
  },
}
export default SourceDataManagement
