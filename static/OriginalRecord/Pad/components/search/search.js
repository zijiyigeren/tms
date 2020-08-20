// 搜索模块
// 基于之前的代码，与dom元素解耦
var Search = (function(){
	var _param = {};
	var _url = '';
	var _select = null;
	var _input = null;
	var _checkBox = null;
	var _option = null;
	var _pageSize = 10;
	var _pageNo = 1;

	var _lastRequest = null; //最后一次查询请求，避免两次干扰

	var _extraParam = {}; //搜索时额外传入的参数，每次查询都带着
	var _extraElem = {};  //搜索时额外需要的输入源

	function init(opt){
		_option = opt;
		if(opt.pageSize) _pageSize = opt.pageSize;
		if(opt.extraParam) _extraParam = opt.extraParam;
		if(opt.extraElem){
			for(var i in opt.extraElem){
				var tmp = document.querySelector(opt.extraElem[i]);
				_extraElem[tmp.name] = tmp;
			}
		}

		// 从外部传入选择器
		// var searchBar = document.querySelector(opt.elem);
		// var btn = document.querySelector(opt.elem.btn);
		_input = document.querySelector(opt.elem.input);
		_select = document.querySelector(opt.elem.select);
		_checkBox = document.querySelector(opt.elem.checkbox);

		_param = {};
		for(var i=0; i<_select.children.length; i++){
			var option = _select.children[i];
			_param[option.value] = [];
		}
		_url = opt.url;

		// btn.addEventListener('tap', function(event) {
		// 	opt.scroller.scrollTo(0, 0);
		// 	_pageNo = 1;
		// 	doSearch(opt.success);
		// });
		_select.addEventListener('change', function() {
			_input.value = '';
		});
		if(opt.search){
			doSearch(opt.success);
		}
		else{
			_pageNo = 0;
		}
	}
	function doSearch(callback){
		if(_lastRequest) _lastRequest.abort();
		//获取当前搜索的条件和值
		var lastKey = _select.value;
		var lastValue = _input.value;
		var searchInRes = _checkBox.checked;

		//如果不在结果中搜，则清空搜索参数
		if(!searchInRes){
			for(var i in _param)
				_param[i] = [];
		}

		//加入搜索参数,先判断重复。重复的过滤掉
		var isKwdDuplicate = false;
		for(var i in _param[lastKey]){
			if(_param[lastKey][i] == lastValue){
				isKwdDuplicate = true;
				break;
			}
		}
		if(!isKwdDuplicate && lastValue)
			_param[lastKey].push(lastValue);

		//转化为request真正的参数
		var param = {};
		for(var i in _param){
			param[i] = _param[i].join();
		}
		//增加分页信息
		param.currentPage = _pageNo;
		param.pageSize = _pageSize;
		param.isPage = true;

		//额外的参数合并
		mui.extend(param,_extraParam);

		//额外输入源的参数读取
		for(var i in _extraElem){
			param[i] = _extraElem[i].value;
		}

		if( _pageNo==1 && !_option.search) base.showLoading(); //上拉加载更多的时候，不显示整体的了
		else _option.search = false;

		//调用系统的get方法
		_lastRequest = base.post( _url, param,
			function(res){
				//判断是否是最后一页
				var isEnd = true;
				if( res.data.pageCount > _pageNo ){
					isEnd = false;
				}
				if( typeof callback == 'function')
					callback(res,isEnd);
			},
			function(res,type){
				_pageNo--;
				if( typeof callback == 'function')
					callback({data:{list:[]}},false);
				if(type=="timeout"){
					mui.toast('请求超时，请稍后再试。');
				}else if(res.message){
					mui.toast(res.message);
				}else{
					mui.toast('请求错误，请稍后再试。');
				}
			}
		)
	}

	function nextPage(callback){
		_pageNo++;
		doSearch(callback);
	}
	function reload(){
		_pageNo = 1;
		if(typeof scroller != 'undefined') scroller.scrollTo(0, 0);
		doSearch( _option.success );
	}
	//外包主动调用搜索，并且传入额外参数，会覆盖先前的额外参数
	function action(extraParam){
		if(extraParam) _extraParam = extraParam;
		reload();
	}
	return {
		init:init ,//初始化
		nextPage: nextPage,
		reload: reload,
		action: action
	}
})();
