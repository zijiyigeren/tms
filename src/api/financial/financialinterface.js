import base from '../base'
import axios from '../../utils/http'

const data = {
    departmentList(){ //获取科室数据
        return axios.get(`${base.lxtbaseUrl}/sysCheckbox/findDepartmentList`)
    },
    regionList(){ //获取区域数据
        return axios.get(`${base.lxtbaseUrl}/sysCheckbox/findCheckCart`)
    },
    lxtfinancialList(params) {  // 费用确认列表
        return axios.post(`${base.lxtbaseUrl}/cw/financial/list`,params)
    },
    lxtfinancialok(params) {  // 费用确认接口  T
        return axios.post(`${base.lxtbaseUrl}/cw/financial/leadorconfig/T`,params)
    },
    lxtgoBack(params) {  // 费用列表 科室回退
        return axios.post(`${base.lxtbaseUrl}/cw/financial/leadorconfig/financialback`,params)
    },
    storageexpenses(params) {  // 保存费用接口
        return axios.post(`${base.lxtbaseUrl}/cw/financial/leadorconfig/editContentDetail`,params)
    },
    tostep(params) {  // 提交下一步
        return axios.post(`${base.lxtbaseUrl}/cw/financial/leadorconfig/toNext`,params)
    },
    cccexpenses(params){ //获取ccc实验数据
        return axios.post(`${base.lxtbaseUrl}/cw/financial/leadorconfig/ccclist`,params)
    },
    getcccInfo(params){ //ccc实验
        return axios.post(`${base.lxtbaseUrl}/cw/financial/leadorconfig/getCccInfo`,params)
    },
    getverification(taskIds){ //生产催款单 验证
        return axios.get(`${base.lxtbaseUrl}/cw/financial/outaccount?taskIds=${taskIds}`)
    },
    getdetail(taskIds){ //生产催款单 费用明细 验证
        return axios.get(`${base.lxtbaseUrl}/cw/financial/detail?taskIds=${taskIds}`)
    }, 
    getcreatec(taskIds){ ////生成催款单 费用明细
        return axios.get(`${base.lxtbaseUrl}/cw/financial/createC?taskIds=${taskIds}`)
    },
    getDunnagedList(params){ ////催款单 列表接口
        return axios.post(`${base.lxtbaseUrl}/cw/ckd/findList`,params)
    },
    getfindInCkdDetail(directflag,ckid){ ////催款单 浏览
        return axios.get(`${base.lxtbaseUrl}/cw/ckd/findInCkdDetail?directflag=${directflag}&ckid=${ckid}`)
    },
    getsendMail(mail,ckid){ //催款单 发送邮件          
        return axios.get(`${base.lxtbaseUrl}/cw/ckd/sendMail?mail=${mail}&ckdid=${ckid}`)
    },
    getTaskIdByCkd(ckid){ //催款单 修改金额 校验接口
        return axios.get(`${base.lxtbaseUrl}/cw/ckd/findTaskIdByCkd/${ckid}`)
    },
    getUpdateMoney(params){ //催款单 修改金额 
        return axios.post(`${base.lxtbaseUrl}/cw/ckd/doUpdateMoney`,params)
    },
    getdelCKDXLS(ckid){ //催款单 删除xls
        return axios.get(`${base.lxtbaseUrl}/cw/ckd/delCKDXLS/${ckid}`)
    },
    getinComeAccount(params){ //催款单 修改金额  入账
        return axios.post(`${base.lxtbaseUrl}/cw/ckd/inComeAccount`,params)
    },
    getdeleteC(ckid){ //催款单 删除
        return axios.get(`${base.lxtbaseUrl}/cw/ckd/delCkd/${ckid}`)
    },
    getdiscountComput(params){ // 费用确认  折
        return axios.post(`${base.lxtbaseUrl}/cw/financial/discountComput`,params)
    },
    getcreateckdbyyhx(ckid){ //催款单 重新生成pdf
        return axios.get(`${base.lxtbaseUrl}/cw/ckd/createckdbyyhx?ckdid=${ckid}&formaction=cn`)
    },

    // 发票管理

    getfapiaoSave(params){ // 发票管理  新增/编辑
        return axios.post(`${base.lxtbaseUrl}/cw/fapiao/save`,params)
    },
    getfapiaoList(params){ // 发票管理  列表
        return axios.post(`${base.lxtbaseUrl}/cw/fapiao/list`,params)
    },
    getbillType(){//发票管理 数据字典 电子发票、普通发票
        return axios.get(`${base.lxtbaseUrl}/sys/dictype/list?dicCode=billType`)
    },
    gettype2(){//发票管理 数据字典 数据字典维护 CCC、公告、监督抽样、整车委托、部件委托、认证部、检验部、路试、高低温、其他
        return axios.get(`${base.lxtbaseUrl}/sys/dictype/list?dicCode=type2`)
    },
    getdelivero(id){ //发票管理 删除
        return axios.delete(`${base.lxtbaseUrl}/cw/fapiao/delete/${id}`)
    },
    dicCodepdf(paynotice){//重新生产pdf接口  获取数据字典
        return axios.get(`${base.lxtbaseUrl}/sys/dictype/list?dicCode=${paynotice}`)
    },
    createckdbyyhx(ckdid,templateName){//重新生产pdf接口  
        return axios.get(`${base.lxtbaseUrl}/cw/ckd/createckdbyyhx?ckdid=${ckdid}&templateName=${templateName}`)
    },






    
    

    



   

    

    



    
}






























export default data