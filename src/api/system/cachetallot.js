import base from '../base'
import axios from '../../utils/http'

const cachetallot = {
    //查找
    findList() {
        return axios.get(`${base.hanlei}/cachettype/findList`)
    },
    bindCachet(str, putid) {
        return axios.put(`${base.hanlei}/cachettype/bindCachet?cachetId=` + str + '&cachetypeId=' + putid)
    },
    saveCachet(name) {
        return axios.post(`${base.hanlei}/cachettype/saveCachet`, name)
    },
    saveCachets(obj) {
        return axios.post(`${base.hanlei}/cachettype/saveCachet`, obj)
    },
    delete(id) {
        return axios.delete(`${base.hanlei}/cachettype/` + id)
    },
    findUncachet(id) {
        return axios.get(`${base.hanlei}/cachettype/findUncachet?cachetypeId=` + id)
    },
    findCachets(id) {
        return axios.get(`${base.hanlei}/cachettype/findCachet?cachetypeId=` + id)
    }
}

export default cachetallot;