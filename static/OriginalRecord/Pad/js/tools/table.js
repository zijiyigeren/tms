(function(window,mui){
	if(window && mui){
		if(!window.Table){
			
			window.Table = (function(){
				
				var _tables = {};
				var renderTask = null;
				
				function render(option){
					console.log('table render')
					if(option.id){
						var id = option.id;
						if(!_tables['t_'+id])
						  _tables['t_'+id] = {};
						_tables['t_'+id].option = option;
						_tables['t_'+id].data = option.data;
						var table = mui(option.id);
						//监听dom变化，重新定义事件
						table[0].addEventListener('DOMSubtreeModified',function(e){
							//事件节流
							if(renderTask){
								clearTimeout(renderTask);
							}
							renderTask = setTimeout(function(){
								render(option)
							},200);
						});
						//获取所有行的复选框,并赋值序号
						var checkboxs = mui(option.id+' tbody input[type=checkbox]')||[];
						for(var i=0; i < checkboxs.length; i++){
							checkboxs[i].setAttribute('data-index', i);
						}
						//获取标题的复选框
						var checkAll = mui(option.id+' thead input[type=checkbox]');
						//获取所有的行
						var trs = mui(option.id+' tbody tr')||[];
						//添加点击事件
						for(var j in trs){
							trs[j].onclick = function(index, event){
								//如果是点击内部的复选框，就不处理了
								if(event.path[0].type=='checkbox') return;
								var cb = checkboxs[index];
								if(cb && !cb.disabled){
									cb.checked = !cb.checked;
									option.data[index].checked = cb.checked;
								}
							}.bind(this,j);
						}
						if(checkAll){
							checkAll[0].onclick = function(event){
								var check = event.currentTarget;
								for(var i=0; i< checkboxs.length; i++){
									if(!checkboxs[i].disabled){
										checkboxs[i].checked = check.checked;
										option.data[i].checked = checkboxs[i].checked;
									}
								}
							}
						}
					}else{
						console.error('render err: table required parameters missing ( id, data )..')
					}
				}
				
				function getSelected(id){
					if( ! _tables['t_'+id] ) return null;
					var checkedBoxs = mui(id+' tbody input[type=checkbox]:checked')||[];
					var res = [];
					for( var i=0; i<checkedBoxs.length; i++ ){
						res.push({ dataIndex: checkedBoxs[i].getAttribute('data-index') });
					}
					if( _tables['t_'+id].data ){
						for( var k in res ){
							res[k].data = _tables['t_'+id].data[res[k].dataIndex];
						}
					}
					return res;
				}
				
				return {
					render: render,
					getSelected: getSelected
				}
				
			})();
			
		}else{
			console.log('table alreay defined..');
			return;
		}
	}else throw "table init error, window or mui not defined!"
})(window,mui);