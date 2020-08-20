import base from '../base'
import axios from '../../utils/http'

const draft =
  {
    // 查询列表
    findList(params) { 
      return axios.get(base.sample+'/Indextask/list1', {params})
    },
    // 批量下达
    batchSend(params){
      return axios.post(`${base.lin}/Indextask/batchSend`,params)
    },
    // 批量删除
    deleteIndextaskList (str) {
      return axios.post(`${base.lin}/Indextask/deleteIndextaskList?taskid=` + str)
    },
    //点击绑定显示
    bindzdList (obj) {
      return axios.get(`${base.lin}/Indextask/bindzdList?taskid=` + obj.id + '&currentPage=' + obj.currentPage4s + '&pageSize=' + obj.pageSizes)
    },
    //点击绑定
    bindTask (obj) {
      return axios.get(`${base.lin}/Indextask/bindTask`, {
        params: {
          taskid: obj.taskid,
          inspectID: obj.inspectID
        }
      })
    },
    //点击删除
    delete (id) {
      return axios.delete(`${base.lin}/Indextask/` + id)
    },
    // 查询详情
    getDetail (taskid) {
      return axios.get(`${base.lin}/Indextask/IndextasDetail`, {
        params: {
          taskid: taskid
        }
      })
    },
    //任务分配
    taskDetails (ovj) {
      return axios.post(`${base.wang}/Indextask/taskDetail?taskid=` + ovj.taskid + '&processInstanceId=' + ovj.processInstanceId + '&searchdate=' + ovj.searchdate)
    }
  }

export default draft
