// *****打印任务单功能逻辑*****
// *****开发时间 2020/5/10*****
var pprams = {} //存储数据JSON
var storageform = '' //存储任务单模板字符串
var truncation = 0 //分页控制   分页后从新排序计算
var heightpage = 1200 //分页高度设定
var tableStorage //存储任务单模板  {作用的是分页时调取}
var element // 存储  递归寻找的根 table
var elTr //存储  递归寻找的 tr
var elTrinner //存储  递归寻找的 最深层级的值
var imgCommiter = 'commiterId'; // 特殊需求，字段转图片
function domeInner (el) {  // 递归  tr 最深层级 并且返回对应的innerhtml
  if (el.children) {
    if (el.children.length > 0) {
      elTrinner = el
      domeInner(elTrinner.children[0])
    }
  }
  return elTrinner.innerText
}
function isTable (el) { // 递归  table
  if (el) {
    if (el.tagName == 'TABLE') {
      el.style.textAlign = 'center'
      return el
    } else {
      element = el
      isTable(element.parentNode)
    }
  }
  return element.parentNode
}
function isTableTr (el) {  // 递归  tr
  if (el) {
    if (el.tagName == 'TR') {
      return el
    } else {
      elTr = el
      isTableTr(elTr.parentNode)
    }
  }
  return elTr.parentNode
}
function copyCoreRecursion () { // 重要核心 二次递归函数  作用是：判断分页
  var _div = document.createElement('div')
  _div.style.pageBreakAfter = 'always'
  _div.style.position = 'relative'
  _div.style.height = '1500px'
  _div.style.width = '900px'
  _div.innerHTML = storageform
  // 需求:右上角动态生成公司logo
  var imgBot = document.createElement("img");
  imgBot.style.position = 'absolute'
  imgBot.style.top = '5px'
  imgBot.style.right = '5px'
  imgBot.alt="componyLogo.jpg";
  imgBot.src="/static/image/componyLogo.jpg";
  _div.appendChild(imgBot);
  tableStorage.appendChild(_div)
  var bot = document.querySelectorAll('.botposet')
  for (var i = 0; i < bot.length; i++) {
    bot[i].style.position = 'absolute'
    bot[i].style.bottom = '0'
    bot[i].style.left = '50%'
    bot[i].style.transform = 'translateX(-50%)'
    bot[i].parentElement.classList.add('txt-center')
  }
  traverseNodes(_div)
}
function chack_reg (str) {
  // 正则判断当前节点中是否存在 $
  var reg = RegExp(/\$/)
  if (reg.test(str)) {
    return true
  }
  return false
}
var p = 0; // 查询递归次数
var o = 0; // 每一次递归 传入的数组中的字段 每次必须+1
var a ; // 存储数据路径
var u = 0; //返回递归结果
var commiter = ''; //存储图片路径
function digui(hstr,pprams){
    if(p == hstr.length){
        u = pprams;
        return false
    }
    var po = hstr[o]
        if(po == imgCommiter){ 
          var rep = pprams[po].replace(/\s*/g,"")
          commiter = '任务受理签字:<img src="/docs/sign/'+rep+'.jpg" alt="'+rep+'.jpg" height="26">'
        }else{
          commiter = ''
        }
        a = pprams[po]
        p++;
        o++;
    digui(hstr,a)
}
function traverseNodes (node) { // 核心替换函数    //
  if (node.nodeType == 1) {
    if (node.hasChildNodes) {
      var sonnodes = node.childNodes
      for (var i = 0; i < sonnodes.length; i++) {
        var sonnode = sonnodes.item(i)
        traverseNodes(sonnode)  // 递归运算 （节点递归）
      }
    }
  } else {
    if (node.nodeValue) {  //判断当前节点是否存在值
      var str = node.nodeValue
      var falg = chack_reg(str)
      // str = str.match(/##(.*?)##/g)
      str = str.match(/\$\{(.*?)\}/g)
      if (falg) {
           p = 0; // 查询递归次数
           o = 0; // 每一次递归 传入的数组中的字段 每次必须+1
           a ; // 存储数据路径
           u = 0; //返回递归结果
          var _str = str[0].substring(str[0].indexOf("${")+2,str[0].indexOf("}"))
          var hstr = _str.split('.');
          if(hstr.length == 1){
            if (hstr[0] == 'inspectContentList') { // 判断是否是循环行
              var table = node.parentNode // 获取基础节点
              table = isTable(table) // 递归查找 TABLE
              var tableTrs = table.children[0].children
              var tableTr = node.parentNode // 获取基础节点
              tableTr = isTableTr(tableTr) // 递归查找 TR
              var indexTr = 0
              var n = 0 // 在第n行后添加一行  初始值 (主要用于在分页时候重新复制索引)
              for (var i = 0; i < tableTrs.length; i++) { // 找到当前行的索引
                if (domeInner(tableTrs[i]) == node.data.trim()) { // 递归  tr 最深层级 并且返回对应的innerhtml  是否 是循环行对应的 占位符
                  indexTr = i
                }
              }
              table.children[0].removeChild(tableTr) // 移除当前行（此行作用是匹配td中占位符 所以匹配后需要删除）
              for (var j = truncation; j < pprams[hstr[0]].length; j++) {  // 添加多少行（就是返回数据条数）
                //let _item = pprams[hstr[0]][j]
                let _item = pprams[hstr[0]]
                if (table.offsetHeight > heightpage) {
                  truncation = j
                  copyCoreRecursion()
                  n = 0
                  return false
                }
                var newTr = table.insertRow(indexTr + n)//在第n行后添加一行
                var copyTr = tableTr
                var strcopy = '<tr>'
                strcopy += '<td width="127" height="33" bgcolor="#FFFFFF" class="td1" style="border-width: 1px; border-style: solid;">' + (j + 1) + '</td>' // 未首个td赋值 序号列
                  for(var b in _item[j]){
                    for (var i = 1; i < tableTr.children.length; i++) { // 未每一个td赋值
                      var mk = '${'+b+'}'
                      if(mk == domeInner(tableTr.children[i]).trim()){
                        strcopy += '<td width="127" height="33" bgcolor="#FFFFFF" class="td1" style="border-width: 1px; border-style: solid;">'+_item[j][b]+'</td>'
                      }
                    }
                }
                strcopy += '</tr>'
                newTr.innerHTML = strcopy
                n++
              }
            }
          }else{
            digui(hstr,pprams)
            if(commiter == ''){
              node.nodeValue = u
            }else{
              node.parentNode.innerHTML = commiter
            }
          }
      }
    }
  }
}
export function copyform (node) {// 解析当前传入dome
  traverseNodes(node)
}
export function getDDat (data) {
  pprams = data
}
export function getHTML (htmlDom, htmlString) {
  tableStorage = htmlDom
  // storageform = '<div style=\' page-break-after: always; position: relative; height: 1500px;\'>' + htmlString + '</div>'
  storageform = htmlString
}
