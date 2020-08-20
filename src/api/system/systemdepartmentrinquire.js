import base from '../base'
import axios from '../../utils/http'
// 部门查询

const systemdepartmentrinquire = {
    // 获取列表数据 / 查询列表数据
    apiInquireFindDepartmentList(params) { 
        return axios.get(`${base.systemcachetimg}/department/findDepartmentList`,{params})
    },
    // 删除
    apiDeleteDepartment(params) { 
        return axios.delete(`${base.systemcachetimg}/department/deleteDepartment`,{params})
    },
    // 获取包含科室数据
    apiGetListDepInclude(params) { 
        return axios.get(`${base.systemcachetimg}/department/getListDepInclude`,{params})
    },
    // 获取不包含科室数据
    apiGetListDepExclude(params) { 
        return axios.get(`${base.systemcachetimg}/department/getListDepExclude`,{params})
    },
    // 部门绑定权限
    apiBindDepartment(params) { 
        return axios.post(`${base.systemcachetimg}/department/bindDepartment`,params)
    },
    // 获取当前数据
    apiGetDepartmentData(params) { 
        return axios.post(`${base.systemcachetimg}/department/getDepartmentData`, params)
    },
    // 部门新建 / 编辑
    apiSaveDepartment(params) { 
        return axios.post(`${base.systemcachetimg}/department/saveDepartment`,params)
    },
    // 获取上级组织机构数据
    apiFindAllDepartment() { 
        return axios.get(`${base.systemcachetimg}/sysCheckbox/findAllDepartment`)
    },
    // 查询名称是否重复
    apiGetDepartmentByName(params) { 
        return axios.post(`${base.systemcachetimg}/department/getDepartmentByName?deptName=${params.deptName}`,)
    },
    //上级组织机构
    organizationTreeData() { 
        return axios.get(`${base.systemcachetimg}/department/getDepartTree`)
    },
    //组织机构树形数据
    dictypestData() { 
        return axios.get(`${base.systemcachetimg}/sys/dictype/list?dicCode=orgtype`)
    },
}

export default systemdepartmentrinquire