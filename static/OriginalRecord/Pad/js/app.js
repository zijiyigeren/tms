//app的通用全局对象，需要再mui.js之后引用。
//主要功能：post方法和统一的错误处理逻辑；获取当前用户信息对象；

var base = (function(){
	var _config = {
		//url:'http://10.10.0.20:64010', //内网服务器地址
		//url:'http://221.239.111.146:64010', //外网测试服务器地址
		// url:'http://192.168.1.141:64444', //局域网服务器地址
		url:'http://qpaqje.natappfree.cc',

		// mock服务器
		// url: 'http://192.168.100.171:4000',
	}
	var _plusReady = false;

	//初始化mui
	mui.init();
	mui.ready(function(){
		//监听输入框的清空icon，设置对应的vue值
		var clears = mui('.mui-input-row input+.mui-icon-clear');
		for(var i=0; i < clears.length; i++){
			clears[i].addEventListener('tap',function(event){
				var input = event.currentTarget.previousSibling;
				//触发输入事件，这样vue就能捕获到
				var evObj = document.createEvent('HTMLEvents');
				evObj.initEvent('input', true, false );
				input.dispatchEvent(evObj);
				//var vueAttr = input.getAttribute('clear-v')||"''=";
				//eval(vueAttr+"='';")
			})
		}
	})
	mui.plusReady(function() {
		_plusReady = true;
	});

	function getUserInfo(){
		var u = {};
		if( _plusReady && plus.storage.getItem('userInfo'))
			u = JSON.parse(plus.storage.getItem('userInfo'));
		return u;
	}
	//以下是权限部分
	function getRoles(){
		var user = getUserInfo();
		if( user.sampleRoles || user.limsRoles ){
			if(user.sampleRoles) return user.sampleRoles.concat(user.limsRoles||[]);
			else return user.limsRoles.concat(user.sampleRoles||[]);
		}else return '';
	}
	function isDistributor(){
		var roles = getRoles();
		console.log( (typeof roles) + 'roles: '+JSON.stringify(roles))
		if(roles.indexOf('distribution_center')!=-1) return true;
		else return false;
	}
	function isOfficeCenter(){
		var roles = getRoles();
		if(roles.indexOf('office_center')!=-1) return true;
		else return false;
	}
	function isLimsUser(){
		var user = getUserInfo();
		if(user.limsName) return true;
		else return false;
	}
	function isSampleUser(){
		var user = getUserInfo();
		if(user.sampleName) return true;
		else return false;
	}
	function httpRequest(url,param,success,error,type){
		if(url.indexOf('http')==-1) //若不是以http开头，则加上服务地址，这样很灵活
			url = _config.url + url;
		console.log("请求："+url)
		param = param || {};
		console.log("参数："+JSON.stringify(param));
		return mui.ajax(url, {
			data: type=='post' ? JSON.stringify(param) : param,
			dataType: 'json',
			type: type,
			timeout: 60000,
			crossDomain: true,
			processData: type=='post' ? false : true,
			headers:{
				//安全问题，ajax不允许设置。。。
				//'Cookie': 'JSESSIONID=' + getUserInfo().sessionId || 'defaultSession-xxx',
				'Content-Type': type=='post' ? 'application/json' : 'application/x-www-form-urlencoded'
			},  //***这里放用户登录成功之后的token
			success: function(response, textStatus, xhr) {
				closeLoading();
				//输出结果到控制台，发布的时候可以注释掉
				console.log('响应------->>>>\n')
				var respStr = JSON.stringify(response);
				console.log(respStr);
				var len = parseInt( respStr.length / 500 );
				console.log(respStr.length);
				for( var i=0; i<=len; i++){
					console.log(respStr.substr(i*500,500));
				}
				if(response.ok){
					if(typeof success =='function')
						success(response);
				}else{
					if(response.respCode=='-1'){//登录失效，优先级最高
						goLogin();
					}else if(typeof error =='function')
						error(response);
					else
						handleErr(response, textStatus, xhr);
				}

			},
			error: function(xhr, type, errorThrown) {
				closeLoading();
				if(xhr.status=='401'){
					goLogin();
				}else{
					if(typeof error =='function'){
						error(xhr, type, errorThrown);
					}else{
						if(type=='timeout'){
							mui.toast("请求超时，请稍后再试!");
						}else{
							mui.toast("网络异常，请稍后再试!");
						}
					}
				}
				//输出结果到控制台，发布的时候可以注释掉
				console.error('type:'+type);
				console.error('errorThrown:'+errorThrown);
				console.error('xhr:'+xhr.toString())
				for(var i in xhr){
					console.error(i+xhr[i])
				}
			}
		});
	}
	function post(url,param,success,error){
		return httpRequest(url,param,success,error,'post');
	}
	function get(url,param,success,error){
		return httpRequest(url,param,success,error,'get');
	}
	function handleErr(response, textStatus, xhr){
		if(response.message){
			mui.toast(response.message);
		}else{
			alert(JSON.stringify(response));
		}
	}
	function goScan(num){
		mui.openWindow({
			url: '/pages/barcode/barcode.html'+(num===undefined?'':'?'+num),
			id: 'barcode.html'
		});
	}
	function goLogin(){
		if( _plusReady ){
			var flag = plus.storage.getItem('loginFlag');
			var u = getUserInfo(); //清除sessionId
			u.sessionId = '';
			plus.navigator.removeAllCookie();
			plus.storage.setItem('userInfo',JSON.stringify(u));
			if(flag=='1') return; //如果登录页已经打开，则不重复打开
		}
		mui.openWindow({
			url: Webviews['login'].url,
			id: Webviews['login'].id,
			createNew:false,
			styles:{
				top:'0px',
				bottom:'0px'
			}
		});
	}
	var _loadObj = [];
	function showLoading(option){
		option = option || {};
		mui.plusReady(function(){
			_loadObj.push(plus.nativeUI.showWaiting( option.title || "加载中...", option ));
		})
	}
	function closeLoading(){
		mui.plusReady(function(){
			for(var i in _loadObj){
				_loadObj[i].close();
			}
			_loadObj = [];
		});
	}
	function selectDate(elem, target){
		var _self = mui(elem)[0];
		if(_self.picker) {
			_self.picker.show(function (rs) {
				target[_self.name] = rs.text;
				_self.picker.dispose();
				_self.picker = null;
				console.log('日期：：')
				console.log(elem);
				console.log(_self.name);

			});
		} else {
			var optionsJson = _self.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = _self.getAttribute('id');
			/*
			* 首次显示时实例化组件
			* 示例为了简洁，将 options 放在了按钮的 dom 上
			* 也可以直接通过代码声明 optinos 用于实例化 DtPicker
			*/
			_self.picker = new mui.DtPicker(options);
			_self.picker.show(function(rs) {
				/*
				* rs.value 拼合后的 value
				* rs.text 拼合后的 text
				* rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
				* rs.m 月，用法同年
				* rs.d 日，用法同年
				* rs.h 时，用法同年
				* rs.i 分（minutes 的第二个字母），用法同年
				*/
				target[_self.name] = rs.text;
				console.log('日期：：')
				console.log(elem);
				console.log(_self.name);

				//alert(rs.text);
				/*
				* 返回 false 可以阻止选择框的关闭
				* return false;
				*/
				/*
				* 释放组件资源，释放后将将不能再操作组件
				* 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
				* 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
				* 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
				*/
				_self.picker.dispose();
				_self.picker = null;
			});
		}
	}
	function logout(){
		plus.navigator.removeAllCookie();
		var user = getUserInfo()
		user.sessionId = '';
		plus.storage.setItem('userInfo',JSON.stringify(user));
// 		mui.openWindow({
// 			url:'/login.html',
// 			id:'login.html',
// 			createNew:false,
// 			styles:{
// 				top:'0px',
// 				bottom:'0px'
// 			}
// 		});
		plus.runtime.restart();
	}
	// 初始化子页面的标题栏
	function initTitleBar(webView, name, btns) {

		// 画标题栏
		var titleBar = new plus.nativeObj.View('titleBar', {
			position: 'absolute',
			top: '0px',
			left: '0px',
			right: '0px',
			height: '44px',
			backgroundColor: '#3e80cb',
		});
		titleBar.drawText(name, {}, {
			color: '#fff',
			size: '18px',
		});

		// 画返回按钮
		var backBtn = new plus.nativeObj.View('backBtn', {
			position: 'absolute',
			top: '0px',
			left: '0px',
			width: '44px',
			height: '44px',
		});
		backBtn.drawBitmap('/res/common/back.png', {}, {
			top: '12px',
			left: '12px',
			width: '20px',
			height: '20px',
		});
		backBtn.addEventListener('click', function() {
			mui.back();
		});
		webView.append(titleBar);
		webView.append(backBtn);
		for(var i in btns){
			var cfg = btns[i];
			var btn = new plus.nativeObj.View('messageBtn', {
				position: 'absolute',
				top: '0px',
				left: (window.innerWidth - 44*(i+1)) + 'px',
				width: '44px',
				height: '44px',
			});
			btn.drawBitmap(cfg.icon, {} , {
				top: '12px',
				left: '12px',
				width: '20px',
				height: '20px',
			});
			btn.addEventListener('click', function(event) {
				if(cfg.click) cfg.click();
			});
			webView.append(btn);
		}
	}

	// 让元素失去焦点
	function blur() {
		var inputs = document.querySelectorAll('select, input');
		for(var i in inputs){
			inputs[i].blur && inputs[i].blur();
			console.log('input'+i);
		}
	}

	return {
		config: _config,
		getUserInfo: getUserInfo, 	//获取当前用户信息对象
		post: post,					//使用系统封装的post，里面带有token信息和错误处理逻辑
		get: get,					//使用系统封装的get，里面带有token信息和错误处理逻辑
		goScan: goScan,				//打开相机扫码页面
		showLoading: showLoading, 	//显示加载中遮罩
		closeLoading: closeLoading  ,//关闭加载中遮罩
		selectDate: selectDate,
		goLogin: goLogin,
		logout: logout,
		roles: {
			isDistributor: isDistributor	,//判断是否为物流人员
			isOfficeCenter: isOfficeCenter  ,//判断是否为试验室人员
			isSampleUser: isSampleUser,
			isLimsUser: isLimsUser			//判断是lims用户
		},
		initTitleBar: initTitleBar,
		blur: blur
	}
})();