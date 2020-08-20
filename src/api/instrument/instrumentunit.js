import base from '../base'
import axios from '../../utils/http'
// 仪器设备查询

const instrumentunit = {
    // 查询
    apiSearchTerminal(params) { 
        return axios.post(`${base.entrustamend}/Termianl/searchTerminal`, params)
    },
    //  查询-下拉数据
    apiGetTbase() { 
        return axios.get(`${base.entrustamend}/Termianl/getTbase`)
    },
    //  查看
    apiDetail(params) { 
        return axios.get(`${base.entrustamend}/Termianl/detail`, {params})
    },
    // 保存
    apiSave(params) { 
        return axios.post(`${base.entrustamend}/Termianl/save`, params)
    },
    //  下载单
    apiDownload(params) { 
        return axios.post(`${base.entrustamend}/Termianl/download`, params)
    },
    //  仪器设备技术档案-配置
    apiFileParameter(params) { 
        return axios.get(`${base.entrustamend}/Termianl/fileParameter`, {params})
    },
    //  仪器设备技术档案-配置-保存
    apiSaveFileParameter(params) { 
        return axios.get(`${base.entrustamend}/terminalAjax/saveFileParameter`, {params})
    },
    //  仪器设备技术档案-下载
    apiExportArchives(params) { 
        return axios.get(`${base.entrustamend}/Termianl/exportArchives`, {params})
    },
    // 借阅
    apiBorrow(params) { 
        return axios.post(`${base.entrustamend}/Termianl/borrow`, params)
    },
    // 列表删除
    apiDelete(params) { 
        return axios.delete(`${base.entrustamend}/Termianl/delete`, {params})
    },
    // 档案借阅
    apiFindLend(params) { 
        return axios.get(`${base.entrustamend}/terminalAjax/findLend`, {params})
    },
    // 检定日期
    apiFindcheckdate(params) { 
        return axios.get(`${base.entrustamend}/terminalAjax/findcheckdate`, {params})
    },
    // 点击-有效期
    apiView2(params) { 
        return axios.get(`${base.entrustamend}/Certificate/view2`, {params})
    },
    // 有效期-新建
    apiUpload(params) { 
        return axios.post(`${base.entrustamend}/Certificate/upload`, params)
    },
    // 有效期-查看
    apiGoView(params) { 
        return axios.post(`${base.entrustamend}/Certificate/goView?fileName=`+params,)
    },
    // 有效期-删除
    apiCheckDateDelete(params) { 
        return axios.get(`${base.entrustamend}/Certificate/delete`, {params})
    },
    // 检定计划
    apiXlsy(params) { 
        return axios.post(`${base.entrustamend}/Termianl/xlsy`, params)
    },
    // EXCEL
    apiXls(params) { 
        return axios.post(`${base.entrustamend}/Termianl/xls`, params)
    },
    // 待检
    apiGocheck(params) { 
        return axios.get(`${base.entrustamend}/Termianl/gocheck`, {params})
    },
    // 删除全部
    apiDeleteAll(params) { 
        return axios.get(`${base.entrustamend}/Termianl/deleteAll`, {params})
    },
    // 模板导出
    apiExport(params) { 
        return axios.get(`${base.entrustamend}/Termianl/export`, {params})
    },
}

export default instrumentunit