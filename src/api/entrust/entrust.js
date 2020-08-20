import base from '../base'
import axios from '../../utils/http'

const entrust = {
    // 获取基础信息
    getBaseInfo() {
        console.log(`${base.hanlei}`)
        return axios.get(`${base.hanlei}/Indextask/searchBasicInformation`)
    },
    // 获取科室列表
    getDepartment() {
        return axios.get(`${base.hanlei}/sysCheckbox/findOffice`)
    },
    // 获取号段列表
    getHaoduan(typeABC, year) {
        return axios.get(`${base.hanlei}/TaskAjax/findCodeNumberType`, {
            params: {
                typeABC: typeABC,
                years: year
            }
        })
    },
    // 获取地点和任务号
    getAddrAndTaskId(numberType, typeABC, years) {
        return axios.get(`${base.hanlei}/TaskAjax/findTaskCodeInfoAndTempLock`, {
            params: {
                numberType: numberType,
                typeABC: typeABC,
                years: years
            }
        })
    },
    // 获取号段区域
    getCachetType() {
        return axios.get(`${base.hanlei}/cachettype/findList`)
    },
    // 获取树形表格数据
    getCate() {
        //加载树形菜单
        return axios.get(`${base.hanlei}/item/find/treeList`)
    },
    //
    getTaskContentCodeNum(taskId) {
        return axios.get(`${base.hanlei}/TaskAjax/getTaskContentCodeNum`, {
            params: {
                taskId: taskId
            }
        })
    },
    // 保存和下达
  tempSave(params) {
    return axios.post(`${base.hanlei}/Indextask/tempSave`, params)
  },
    // 查询企业信息
    getCopyMessage(taskId) {
        return axios.get(`${base.hanlei}/TaskAjax/goCopyBase`, {
            params: {
                taskid: taskId
            }
        })
    },
    // 查询检验项目信息
    getItemsByTaskId(taskId) {
        return axios.get(`${base.hanlei}/TaskAjax/findItemsByTaskid`, {
            params: {
                taskid: taskId
            }
        })
    },
    // 校验营运编号
    checkCvItemsCode(taskCode, itemsCode, cvType, checkTypeID) {
        return axios.get(`${base.hanlei}/TaskAjax/checkCvItemsCode`, {
            params: {
                checkTypeID: checkTypeID,
                cvType: cvType,
                itemsCode: itemsCode,
                taskCode: taskCode
            }
        })
    },
    checkIsLackEnterprise(entName) {
        return axios.get(`${base.hanlei}/TaskAjax/checkIsLackEnterprise`, {
            params: {
                entNames: entName
            }
        })
    },
    // 强制保存
    forceSave(params) {
        return axios.post(`${base.hanlei}/Indextask/forceSave`, params)
    },
    checkSampleSize(id) {
        return axios.get(`${base.hanlei}/TaskAjax/checkConcurrName`, {
            params: {
                id: id
            }
        })
    }
}

export default entrust
