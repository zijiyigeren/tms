import base from '../base'
import axios from '../../utils/http'

const roughly = {
    //查找
    taskcode(){
        return axios.get(`${base.lin}/Taskcode`)
    },
    //添加
    taskcodeadd(obj){
        return axios.post(`${base.lin}/Taskcode`,obj)
    },
    //修改
    changeNumberTypeAndTypeArea(obj){
        // return axios.get(`${base.lin}/TaskcodeAjax/changeNumberTypeAndTypeArea?NewnumberType=`+obj.numberType+'&numberType='+obj.newnumtype+'&typeABC='+obj.typeABC+'&typeArea='+obj.typeArea+'&years='+obj.years)
        return axios.post(`${base.lin}/TaskcodeAjax/changeNumberTypeAndTypeArea?newNumberType=`+obj.numberType + '&numberType='+obj.newnumtype + '&typeABC='+ obj.typeABC+'&years='+obj.years+'&typeArea='+obj.typeArea)
    },
    //释放
    releaseNumber(str){
        return axios.get(`${base.lin}/TaskcodeAjax/releaseNumber?taskCode=`+str)
    },
    //浏览子表
    findTaskCodePosition(obj){
        return axios.get(`${base.lin}/TaskcodeAjax/findTaskCodePosition`,{
            params:{
                typeABC:obj.typeABC,
                years:obj.years
            }
        })
    }
}

export default roughly;