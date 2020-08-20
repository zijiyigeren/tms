import base from '../base'
import axios from '../../utils/http'

const menu = {
  // 获取角色列表
  getMenuList () {
    return axios.get(`${base.hanlei}/MenuManagementController/findMenu`)
  },
  getMenuList2 () {
    return axios.get(`${base.hanlei}/MenuManagementController/findMenu2`)
  },

  // 菜单录入
  addMenu (menuVo) {
    return axios.post(`${base.hanlei}/MenuManagementController/addMenu`, menuVo)
  },

  // 修改菜单
  editMenu (menuVo) {
    return axios.put(`${base.hanlei}/MenuManagementController/editMenu`, menuVo)
  },

  // 删除菜单
  deleteMenu (menuVo) {
    return axios.delete(`${base.hanlei}/MenuManagementController/deleteMenu`, {
      params: {
        menuLevel: menuVo.menuLevel,
        menuId: menuVo.menuId
      }
    })
  },

  // 查询二级菜单权限
  getConfigColumn (menuId) {
    return axios.get(`${base.hanlei}/MenuManagementController/findconfigColumn`, {
      params: {
        menuId: menuId
      }
    })
  },

  // 保存二级菜单权限
  saveConfigColumn (param) {
    return axios.post(`${base.hanlei}/MenuManagementController/saveRole?menuId=${param.menuId}&rlist=${param.rlist}`)
  }
}

export default menu
