import base from '../base'
import axios from '../../utils/http'

const role = {
    // 获取角色列表
    getRoleList(roleVo) {
        return axios.get(`${base.hanlei}/roleManagement/findList`, {
            params: {
                roleCode: roleVo.rolecode,
                roleName: roleVo.rolename
            }
        })
    },
    // 增加角色
    addRole(roleVo) {
        return axios.post(`${base.hanlei}/roleManagement/addRole`, roleVo)
    },

    // 修改角色
    editRole(roleVo) {
        return axios.put(`${base.hanlei}/roleManagement/editRole`, roleVo)
    },

    // 删除角色
    deleteRole(ids) {
        return axios.delete(`${base.hanlei}/roleManagement/${ids}`)
    },
    // 获取当前选中人已有的权限
    getMenuIdByRoleId(params){
      return axios.get(`${base.hanlei}/roleManagement/getMenuIdByRoleId`,{params})
    },
    // 查询权限树据
    findTreeMenu(){
      return axios.get(`${base.hanlei}/MenuManagementController/findTreeMenu`)
    },
    // 保存变更后的权限
    saveMenuRole(params){
      return axios.post(`${base.hanlei}/roleManagement/saveMenuRole`,params)
    },
}

export default role;
