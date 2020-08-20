import base from '../base'
import axios from '../../utils/http'
// 用户查询

const systemuserinquire = {
    // 获取列表数据 / 查询
    apiInquireFindmemberList(params) { 
        return axios.post(`${base.systemcachetimg}/member/findmemberList`, params)
    },
    // 获取部门管理员列表
    apiFindDepartmentList() { 
        return axios.get(`${base.systemcachetimg}/sysCheckbox/findDepartmentList`)
    },
    // 删除
    apiDeleteMember(params) { 
        return axios.delete(`${base.systemcachetimg}/member/deleteMember`,{params})
    },
    // 密码初始
    apiPasswordInit(params) { 
        return axios.post(`${base.systemcachetimg}/member/passwordInit`, params)
    },
    // 已有的权限
    apiGetHasRoleList(params) { 
        return axios.get(`${base.systemcachetimg}/member/getHasRoleList`,{params})
    },
    // 不具有的权限
    apiGetNotHasRoleList(params) { 
        return axios.get(`${base.systemcachetimg}/member/getNotHasRoleList`,{params})
    },
    // 用户绑定权限
    apiBindMemberRole(params) { 
        return axios.post(`${base.systemcachetimg}/member/bindMemberRole`,params)
    },
    // 获取所属区域数据
    apiFindCheckCart(params) { 
        return axios.get(`${base.systemcachetimg}/sysCheckbox/findCheckCart?typeflag=${5}`)
    },
    // 用户新建 / 编辑
    apiSaveMember(params) { 
        return axios.post(`${base.systemcachetimg}/member/saveMember`,params)
    },
    // 检测登录id是否重名
    apiGetMemberByName(params) { 
        return axios.post(`${base.systemcachetimg}/member/getMemberByName?loginName=${params.loginName}`)
    },
    // 编辑用户回显数据
    apiGetMemberData(params) { 
        return axios.post(`${base.systemcachetimg}/member/getMemberData`, params)
    },
    // 添加检验项目时的数据
    apiGetDeptSignInfo() { 
        return axios.get(`${base.systemcachetimg}/member/getDeptSignInfo`)
    },
    // 删除签章
    apiDeleteDeptSignConfig(params) { 
        return axios.delete(`${base.systemcachetimg}/member/deleteDeptSignConfig`, {params})
    },
}

export default systemuserinquire