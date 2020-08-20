var self = null; // 自身webview
var scroller = null; // 滚动组件

// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {
		reportItem: {}, // 报告数据
		dataList: [], // 页面数据
		yearSelectList: [], // 年份下拉选项
		yearBindVal: '', // 年份值
		isCheckboxChecked: false, // 复选框
		tempId: '', // 模板选中数据的id
	},
	methods: {
		
	},
});

// 初始化mui
mui.init();

// 初始化plus
mui.plusReady(function() {
	self = plus.webview.currentWebview();
	userInfo = base.getUserInfo();
	app.reportItem = self.reportItem; // 报告数据

	initObtainYear(); // 初始化年份选项
	initTitleBar(); // 初始化标题栏
	refresh(); // 刷新页面

	// 初始化滚动组件
	scroller = new Scroller({
		elem: '.mui-scroll-wrapper',
	});

	// 有lims权限才初始化搜索
	if (userInfo.limsRoles) {
		base.showLoading();
		Search.init({
			elem: {
				select: '.select-wrapper:nth-child(1) > select',
				input: '.search-wrapper > input',
				checkbox: '.checkbox-wrapper > input',
			},
			extraParam: {
				
			},
			url: Config.urls.job_findreportTemplate,
			search: true,

			// 这个回调是`Search.action()`和`Search.reload()`会调用的
			// `Search.nextPage()`有另外的回调
			success: function(res, isEnd) {
				res.data.list.forEach(function(item) {
					app.dataList.push(item);
				});
				scroller.end(isEnd);
			},
		});
	}
});

// 初始化标题栏
function initTitleBar() {

	// 标题栏
	var titleBar = new plus.nativeObj.View('titleBar', {
		position: 'absolute',
		top: '0px',
		left: '0px',
		right: '0px',
		height: '44px',
		backgroundColor: '#3e80cb',
	});
	titleBar.drawText('原始记录模板', {}, {
		color: '#fff',
		size: '18px',
	});

	// 返回按钮
	var backBtn = new plus.nativeObj.View('backBtn', {
		position: 'absolute',
		top: '0px',
		left: '0px',
		width: '44px',
		height: '44px',
	});
	backBtn.drawBitmap('../../res/common/back.png', {}, {
		top: '12px',
		left: '12px',
		width: '20px',
		height: '20px',
	});
	backBtn.addEventListener('click', function() {
		mui.back();
	});

	// 提交按钮
	var confirmBtn = new plus.nativeObj.View('confirmBtn', {
		position: 'absolute',
		top: '0px',
		left: (window.innerWidth - 44) + 'px',
		width: '44px',
		height: '44px',
	});
	confirmBtn.drawBitmap('../../res/common/check.png', {}, {
		top: '12px',
		left: '12px',
		width: '20px',
		height: '20px',
	});
	confirmBtn.addEventListener('click', function() {
		let radioList = document.querySelectorAll('.item_radio');
		for(i = 0; i < radioList.length; i++) {
			if (radioList[i].checked) {
				app.tempId = radioList[i].value;
			}
		};
		if(app.tempId) {
			base.showLoading();
			if(app.reportItem && app.reportItem.id) {
				let url = base.config.url+Config.urls.job_chooseRecordTemplate+'/'+app.reportItem.id+'/'+app.tempId;
				console.log('接口:', url);
				mui.ajax(url, {
					dataType: 'json',
					type: 'get',
					timeout: 60000,
					crossDomain: true,
					success:function(response, textStatus, xhr){
						base.closeLoading();
						console.log('原始记录模板提交成功：', response, textStatus, xhr);
						if(response.ok){
							mui.toast('原始记录模板提交成功');
							self.opener().reload();
							mui.back();
						} else {
							mui.toast(response.message);
						}
					},
					error:function(xhr,type,errorThrown){
						base.closeLoading();
						console.log('原始记录模板提交失败：',xhr, type, errorThrown);
						if (type=='timeout'){
							mui.toast("请求超时，请稍后再试!");
						} else {
							mui.toast("网络异常，请稍后再试!");
						}
						mui.toast(xhr.message);
					}
				});
			} else {
				mui.toast('获取报告数据错误，请重新进入页面',{ duration:'long', type:'div' }); 
			}
		} else {
			mui.toast('请选择模板后再进行提交',{ duration:'long', type:'div' }); 
		}
	});

	// 历史按钮
	var historyBtn = new plus.nativeObj.View('historyBtn', {
		position: 'absolute',
		top: '0px',
		left: (window.innerWidth - 84) + 'px',
		width: '44px',
		height: '44px',
	});
	historyBtn.drawText('历史', {}, {
		color: '#fff',
		size: '18px',
	});
	historyBtn.addEventListener('click', function() {
		mui.openWindow({
			url: Webviews['history-original'].url,
			id: Webviews['history-original'].id,
			extras: {
				reportItem: app.reportItem,
			},
		});
	});
	

	self.append(titleBar);
	self.append(backBtn);
	self.append(confirmBtn);
	self.append(historyBtn);
}

// 生成最近十年年份的选项
function initObtainYear() {
	var year = new Date().getFullYear();
	for (var i = 0; i < 10; i++) {
		app.yearSelectList.push(year - i);
	}
	app.yearBindVal = app.yearSelectList[0];
}

// 处理搜索点击事件
function onSearchBtnTap() {
	if (userInfo.limsRoles) {
		document.querySelector('input[type=text]').blur();
		scroller.scrollTo(0, 0);
		if (app.dataList.length > 0) {
			app.dataList = [];
		}
		// 重新搜索
		Search.action();
	} else {
		mui.toast('非LIMS用户，无此功能权限');
	}
}

// 处理item点击事件
function onItemTap(item) {
	// mui.openWindow({
	// 	url: Webviews['todo-item'].url,
	// 	id: Webviews['todo-item'].id,
	// 	extras: {
	// 		item: item,
	// 		taskCode: app.taskCode,
	// 		companyCheck: app.companyCheck,
	// 		procName: app.procName,
	// 		mlist: app.mlist,
	// 		process_instance_id: app.process_instance_id,
	// 		yearBindVal: app.yearBindVal,
	// 	},
	// });
}

// 获取列表数据
function findTaskContentsTodo() {
	base.showLoading();
	base.post(Config.urls.job_findreportTemplate, {}, function(res) {
		base.closeLoading();
		app.dataList = res.data.list;
	}, function(error) {
		mui.toast(error.message);
	});
}

// 刷新页面
function refresh() {
	if (app.dataList.length > 0) {
		app.dataList = [];
	}
	findTaskContentsTodo();
}
