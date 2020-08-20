(function(window,mui){
	if(window && mui){
		if(!window.Dialog){
			window.Dialog = (function(){
				var _dialogs = {};
				var _dialogObj = {};
				var btnArray = ['取消', '确定'];
				function open(option){
					if(option.id){
							var values = {};
							var inputs = [];
							_dialogObj[option.id] = mui.prompt(' ', '', option.title||'标题', btnArray, function(e) {
								if (e.index == 1){
									if(typeof option.onConfirm == 'function'){
										for(var i=0; i<inputs.length; i++){
											values[inputs[i].name] = inputs[i].value;
										}
										return option.onConfirm(values);
									}
								}
							},'div');
							
							var inputDiv = document.querySelector('.mui-popup-input');
							inputDiv.setAttribute('name', 'commonDialog');//为app.css提供指引
							
							if(!_dialogs[option.id]){
								var dom = mui(option.id)[0];
								_dialogs[option.id] = inputDiv.innerHTML = dom.innerHTML;
								dom.parentNode.removeChild(dom);
							}else inputDiv.innerHTML = _dialogs[option.id];
							
							inputs = document.querySelectorAll('.mui-popup-input[name=commonDialog] input[name]');
							var inputDoms = {};
							for(var i=0; i<inputs.length; i++){
								inputDoms[inputs[i].name] = inputs[i];
							}
							if(typeof option.onLoad == 'function') option.onLoad(inputDoms);
							
					}else{
						console.error('render err: Dialog required parameters missing ( id )..')
					}
				}
				function confirm(option){
					mui.confirm(option.msg||' ', option.title||'标题', btnArray, function(e) {
						if (e.index == 1){
							if(typeof option.onConfirm == 'function'){
								return option.onConfirm();
							}
						}
					},'div');
				}
				function close(id){
					if(_dialogObj[id]){
						_dialogObj[id].close();
					}
				}
				return {
					open: open,
					close: close,
					confirm: confirm
				}
			})();
		}else{
			console.log('Dialog alreay defined..');
			return;
		}
	}else throw "Dialog init error, window or mui not defined!"
})(window,mui);