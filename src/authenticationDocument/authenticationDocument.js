let _name , _listData;
var authentication = ()=>{ //鉴权函数  
    let authentication = JSON.parse(window.sessionStorage.getItem("authenticationStorage"))//从sessionStorage获取后端返回的鉴权字段  
    for (const key in authentication) {
      if (key ==  _name) {
        authentication[key].forEach(item => {
            _listData[item.menuname] = true;
        });
      }
    }
  }
  export function setAuthentication (name,listData) {
    _name = name;
    _listData = listData
    authentication()
  }