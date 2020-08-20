import base from '@/api/base.js'
import axios from '@/utils/http.js'

const eqManage = {
    // 查询
    searchTerminal (params) {
        return axios.post(`${base.baseUrl}/Termianl/searchTerminal`, params)
    },
    //批量导入
    excelupload (params) {
      return axios.post(`${base.baseUrl}/Termianl/excelupload`, params)
    },
    // 新增
    saveTerminal (params) {
        return axios.post(`${base.baseUrl}/Termianl/save`, params)
    },
    // 检定日期
    findcheckdate (params) {
        return axios.get(`${base.baseUrl}/terminalAjax/findcheckdate`, {params})
    },
    // 删除(暂无此需求)
    deleteTerminal (params) {
        return axios.delete(`${base.baseUrl}/Termianl/delete`, {params})
    },
    // 查看
    detailTerminal (params) {
        return axios.get(`${base.baseUrl}/Termianl/detail`, {params})
    },
    // 改为待检状态
    gocheckTerminal (params) {
        return axios.get(`${base.baseUrl}/Termianl/gocheck`, {params})
    },
    // 上传证书
    upload (params) {
        return axios.post(`${base.baseUrl}/Certificate/upload`, params)
    },
    // 删除证书
    del (params) {
        return axios.delete(`${base.baseUrl}/Certificate/del`, {params})
    },
    /*
    * 下载证书
    * */
    download (data) {
        window.open(`${base.baseUrl}/sys/lims/file/${data}/download`)
    },
}
export default eqManage
