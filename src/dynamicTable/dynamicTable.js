let _table , _data;
// var mlist = 7; //一级list
// var ilist = 3; //二级list  从上级取得
// var tlist = 2; //三级list  从上级取得


var oneName,towName;


function dynamicTable(_data){ //自动生产table

  let listData = _data;
  let std = ''
  for(var i=0; i<listData.length; i++){
    for(var t=0; t<listData[i].list.length; t++){
      for(var j=0; j<listData[i].list[t].ilist.length; j++){
          console.log(listData[i].list[t].ilist[j])
// <a href="javascript:goViewCount('<s:property value="id"/>','<s:property value="itemcode"/>');">数量</a>
          if(j==0){
            std += `
              <tr>
                <td rowspan = ${listData[i].list[t].ilist.length}>${listData[i].itemsBasis}</td>
                <td rowspan = ${listData[i].list[t].ilist.length}>
                  ${listData[i].list[t].itemcode}-${listData[i].list[t].dector}-${listData[i].list[t].dectorConfirmStatus}
                  <span onclick="goViewCount">数量<span>
                </td>
                <td rowspan = ${listData[i].list[t].ilist.length}><input type="checkbox" value="${listData[i].list[t].id} name="box"/>${listData[i].list[t].itemname}</td>
                <td>${listData[i].list[t].ilist[j].name}</td>
                <td>${listData[i].list[t].ilist[j].sformual}</td>
                <td>${listData[i].list[t].ilist[j].times}</td>
                <td>${listData[i].list[t].ilist[j].yaccount}</td>
              </tr>
            `
          }else{
            std += `
              <tr>
                <td>${listData[i].list[t].ilist[j].name}</td>
                <td>${listData[i].list[t].ilist[j].sformual}</td>
                <td>${listData[i].list[t].ilist[j].times}</td>
                <td>${listData[i].list[t].ilist[j].yaccount}</td>
              </tr>
            `
          }
  
      }
    }

  }

  var nodeTr = document.createElement('tbody')
      nodeTr.innerHTML = std
      _table.appendChild(nodeTr)


  }
  export function setDynamicTable (table,data) {
    _table = table;
    _data = data;
    dynamicTable(_data)
  }







  // let _tr = document.createElement('tr');
    // let _td = document.createElement('td');
    // _td.innerHTML = '132'

    // _tr.appendChild(_td)
//insertCell(0)

    // _table.appendChild(_tr)