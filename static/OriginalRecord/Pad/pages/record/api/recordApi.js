/**
 * 原始记录的接口对象
 * 方法：
 *  getById：根据原始记录id，获取原始记录数据
 *  getBaseInfo：根据检验项目的id，获取检验项目的信息
 *  save：保存原始记录
 *  searchTerminal：查询设备数据记录
 */
var recordApi = {};

/**
 * 测试接口前调用，TODO
 */
recordApi.getUser = function(){
	var retuData;
	recordApi.get( "/api/login?username=xtqx&password=111111&isRememberMe=false",null,function(successData){
		if (successData.ok) {
			if(!successData.data){
				mui.toast("没有查到【"+self.requestParamValues.id+"】原始记录！");
				return;
			}
			retuData = successData.data;
		}
	},function(response){
		mui.toast(response.message);
	},false);
	return retuData;
}

/****
* 根据原始记录id，获取原始记录数据
* 参数：
*   id：原始记录id
*/
recordApi.getById = function (id,success) {
	recordApi.get("/job/getRecordInfoById/" + id,null,function(successData){
		if (successData.ok) {
			if(!successData.data){
				mui.toast("没有查到【"+self.requestParamValues.id+"】原始记录！");
				return;
			}
			success(successData.data);
		}
	},function(response){
		mui.toast(response.message);
	});
};

/****
* 根据检验项目的id，获取检验项目的信息
* 参数：
*   taskContentId：检验项目id
*/
recordApi.getBaseInfo = function (taskContentId,success) {
	recordApi.get("/job/getBaseInfo/" + taskContentId,{},function(successData){
		if (successData.ok) {
			if(!successData.data){
				mui.toast("没有查到【"+self.requestParamValues.taskContentId+"】检验项目！");
				return;
			}
			success(successData.data);
		}
	},function(response){
		mui.toast(response.message);
	});
};

/****
* 保存原始记录
* 参数：
*   fromData：保存的表单信息，包括SSJSON、Excel文件流等信息
*/
recordApi.save = function (fromData,success) {
    var retuData;
	mui.ajax(base.config.url  + "/job/originalOnline/online", {
		data: fromData,
		type: 'post',
		timeout: 60000,
		contentType: false,
		processData: false,
		success: function(response, textStatus, xhr) {
			//输出结果到控制台，发布的时候可以注释掉
			console.log('响应success--',response, textStatus, xhr);
			var respStr = JSON.stringify(response);
			var len = parseInt( respStr.length / 500 );
			for( var i=0; i<=len; i++){
			}
			if(response.ok){
				if(typeof success =='function') success(response.data);
			}else{
				handleErr(response, textStatus, xhr);
			}
		},
		error: function(xhr, type, errorThrown) {
			if(xhr.status=='401'){
				base.goLogin();
			}else{
				if(type=='timeout'){
					mui.toast("请求超时，请稍后再试!");
				}else{
					mui.toast("网络异常，请稍后再试!");
				}
			}
		}
	});
};

/**
 * 后端ajax请求帮助方法
 * @param {Object} url 请求对象
 * @param {Object} param 请求参数
 * @param {Object} success 成功回调函数
 * @param {Object} error 错误回调函数
 * @param {Object} type 类型，post还是get
 * @param {Object} async 是否为异步，默认为异步，false为同步
 */
recordApi.httpRequest = function (url,param,success,error,type,async){
		if(url.indexOf('http')==-1) //若不是以http开头，则加上服务地址，这样很灵活
			url = base.config.url + url;
		param = param || {};
		async = async=== undefined?true:async;
		return mui.ajax(url, {
			data: type=='post' ? JSON.stringify(param) : param,
			dataType: 'json',
			type: type,
			async: async,
			timeout: 60000,
			crossDomain: true,
			processData: type=='post' ? false : true,
			headers:{
				'Content-Type': type=='post' ? 'application/json' : 'application/x-www-form-urlencoded'
			},  //***这里放用户登录成功之后的token
			success: function(response, textStatus, xhr) {
				var respStr = JSON.stringify(response);
				var len = parseInt( respStr.length / 500 );
				if(response.ok){
					if(typeof success =='function') success(response);
				}else{
					if(response.respCode=='-1'){//登录失效，优先级最高
						base.goLogin();
					}else if(typeof error =='function')
						error(response);
					else
						recordApi.handleErr(response, textStatus, xhr);
				}
			},
			error: function(xhr, type, errorThrown) {
				if(xhr.status=='401'){
					base.goLogin();
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
			}
		});
	}
	
/***
*错误提示
* 参数：
* response :后台响应参数
* textStatus：状态
* */	
recordApi.handleErr = function (response, textStatus){
	if(response.message){
		mui.toast(response.message);
	}else{
		alert(JSON.stringify(response));
	}
}

/***
*post请求
* 参数：
* url :请求地址
* param：请求后台参数
* success：function对象，成功回调函数
* error：function对象，错误回调函数
* async：是否为异步，false为同步，true异步
* */
recordApi.post =function (url,param,success,error,async){
	return recordApi.httpRequest(url,param,success,error,'post',async);
}

/***
*get请求
* 参数：
* url :请求地址
* param：请求后台参数
* success：function对象，成功回调函数
* error：function对象，错误回调函数
* async：是否为异步，false为同步，true异步
* */
recordApi.get =	function get(url,param,success,error,async){
	return recordApi.httpRequest(url,param,success,error,'get',async);
}
