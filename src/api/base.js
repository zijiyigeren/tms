// 接口域名管理
const region = JSON.parse(localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo")).region : "";
const base = {
  hanlei: '/api',
  lin: '/api',
  wang: '/api',
  entrustamend: '/api',
  systemgenre: '/api',
  systemcachetimg: '/api',
  baseUrl: '/api',
  lxtbaseUrl: '/api',
  systemPublicationpage: '/api',
  sample: '/api',
  baseImgUrl: location.protocol + "//" + location.host + '/',
  baseImgTable: location.protocol + "//" + location.host + '/',
}
export default base;
