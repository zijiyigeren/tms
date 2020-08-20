function myClickAdd(a){ //添加行
    var p = a.parentNode.nextElementSibling
    
    var rows = p.rows; //返回包含表格中所有行的一个数组
    var tradd = p.insertRow()
   
    var str = '<tr>';
    for(var i=0; i<rows[0].getElementsByTagName("td").length-1; i++){
        str+= '<td style="border-width: 1px; border-style: solid; height:31px" contenteditable="true"></td>'
    }
    str += '<td style="border-width: 1px; border-style: solid; height:31px" onclick="myClickDel(this)">删除</td></tr>'
    tradd.innerHTML = str
}

function myClickDel(a){ //  删除行
    var thinTable = a.parentNode.parentNode;
    var thinTr = a.parentNode;
    thinTable.removeChild(thinTr)
}

function myClickClear(a){ // 清空
    var thinPrevious = a.parentNode.nextElementSibling
    thinPrevious.innerHTML = ''
}

function myClickImg(a){ //插入图片
     var img = document.createElement('img');
     img.style.width = '120px';
     img.style.height = '80px'
     var reads = new FileReader();
     f = a.files[0];
     reads.readAsDataURL(f);
     reads.onload = function(e) {
        img.src = this.result;
        a.parentNode.appendChild(img);
     };
}