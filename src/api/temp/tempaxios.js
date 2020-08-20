import base from '../base'
import axios from '../../utils/http'

const tempaxios = {
    getList(url, params) {
        return axios({
            url: url,
            method: 'get',
            params: params
        })
    },
    getAdd(url,params) {
        return axios({
            url: url,
            method:'post' ,
            data: params
        })
    },
    getEdit(url,params) {
        return axios({
            url: url,
            method:'put',
            data: params
        })
    },
    getDelete(url,params) {
        return axios({
            url: url,
            method: 'delete',
            params: params
        })
    },
}

export default tempaxios;