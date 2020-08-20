// tab栏参数
var tabs = [
	{
		label: '分配检测',
		process_instance_id: '2',
		taskCount: 0,
	},
	{
		label: '审核',
		process_instance_id: '5',
		taskCount: 0,
	},
	{
		label: '批准',
		process_instance_id: '6',
		taskCount: 0,
	},
];

// 自身webview
var self = null;

// 滚动组件
var scroller = null;

// 消息按钮
var messageBtn = null;

// 用户信息
var userInfo = null;

// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {
		tabs: tabs, // tab栏
		currentTabIndex: 0, // 当前tab
		isCheckboxChecked: false, // 复选框
		searchdateOptions: [], // 年份选项
		searchdate: '', // 年份值
		messageCount: '', // 消息数
		taskList: [], // 任务列表
	},
	methods: {
		taskCountText: function(taskCount) {
			if (taskCount > 99) {
				return '99+';
			} else {
				return taskCount + '';
			}
		},
	},
});

// 初始化mui
mui.init();

// 初始化plus
mui.plusReady(function() {
	self = plus.webview.currentWebview();
	userInfo = base.getUserInfo();
	initTitleBar();

	// 初始化滚动组件
	scroller = new Scroller({
		elem: '.mui-scroll-wrapper',
		onPullup: function() {

			// 下一页
			Search.nextPage(function(res, isEnd) {
				res.data.list.forEach(function(item) {
					app.taskList.push(item);
				});
				scroller.end(isEnd);
			});
		},
	});

	// 初始化年份选项，后面首次搜索才有正确的年份
	initSearchdateOptions();

	// 有lims权限才打开定时器
	if (userInfo.limsRoles) {
		toggleInterval(true);
		document.addEventListener('pause', function() {
			toggleInterval(false);
		}, false);
		document.addEventListener('resume', function() {
			toggleInterval(true);
		}, false);
	}

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
				searchdate: app.searchdate,
				process_instance_id: '2',
			},
			url: Config.urls.job_findTodoJob,
			search: true,

			// 这个回调是`Search.action()`和`Search.reload()`会调用的
			// `Search.nextPage()`有另外的回调
			success: function(res, isEnd) {
				res.data.list.forEach(function(item) {
					app.taskList.push(item);
				});
				scroller.end(isEnd);
			},
		});
	}

});

// 初始化标题栏
function initTitleBar() {

	// 画标题栏
	var titleBar = new plus.nativeObj.View('titleBar', {
		position: 'absolute',
		top: '0px',
		left: '0px',
		right: '0px',
		height: '44px',
		backgroundColor: '#3e80cb',
	});
	titleBar.drawText('待办工作', {}, {
		color: '#fff',
		size: '18px',
	});
	self.append(titleBar);

	// 画个人设置按钮
	var userBtn = new plus.nativeObj.View('userBtn', {
		position: 'absolute',
		top: '0px',
		left: '0px',
		width: '44px',
		height: '44px',
	});
	userBtn.drawBitmap('../../../res/todo/user.png', {}, {
		top: '12px',
		left: '12px',
		width: '20px',
		height: '20px',
	});
	userBtn.addEventListener('click', function(event) {
		base.blur();
		mui.openWindow({
			url: Webviews['record'].url,
			id: Webviews['record'].id,
		});
	});
	self.append(userBtn);

	initMessageBtn(0);
}

// 画消息按钮，因为有切换的情况，所以单独处理
function initMessageBtn(messageCount) {

	// 如果已经画了消息按钮，先关闭再重画一遍
	if (messageBtn) {
		messageBtn.close();
	}

	// 根据storage中保存的值判断是否画消息按钮
	if (isMessageOn()) {
		messageBtn = new plus.nativeObj.View('messageBtn', {
			position: 'absolute',
			top: '0px',
			left: (window.innerWidth - 44) + 'px',
			width: '44px',
			height: '44px',
		});
		messageBtn.drawBitmap('../../../res/todo/message.png', {} , {
			top: '12px',
			left: '12px',
			width: '20px',
			height: '20px',
		});

		// 根据消息数判断是否画小红点
		if (messageCount > 0) {
			var messageCountText = messageCount > 99 ? '99+' : messageCount.toString();
			var width = 14 + messageCountText.length * 2;
			messageBtn.drawRect({
				color: '#dd524d',
				radius: '8px',
			}, {
				top: '5px',
				left: '22px',
				width: width + 'px',
				height: '16px',
			});
			messageBtn.drawText(messageCountText, {
				top: '5px',
				left: '22px',
				width: width + 'px',
				height: '16px',
			}, {
				size: '10px',
				color: '#fff',
			});
		}
		messageBtn.addEventListener('click', function(event) {
			base.blur();
			mui.openWindow({
				url: Webviews['view'].url,
				id: Webviews['view'].id,
			});
			
			return null;
			
			if (userInfo.limsRoles) {
				mui.openWindow({
					url: Webviews['message-list'].url,
					id: Webviews['message-list'].id,
				});
			} else {
				mui.toast('非LIMS用户，无此功能权限');
			}
		});
		self.append(messageBtn);
	}
}

// 判断是否打开了消息
function isMessageOn() {
	return plus.storage.getItem('message_' + userInfo.account) === '0' ? false : true;
}

// 生成最近十年的选项
function initSearchdateOptions() {
	var year = new Date().getFullYear();
	for (var i = 0; i < 10; i++) {
		app.searchdateOptions.push(year - i);
	}
	app.searchdate = app.searchdateOptions[0];
}

// 处理tab栏点击事件
function onTabTap(index) {
	document.querySelector('input[type=text]').blur();
	// if (!base.getUserInfo().limsRoles) {
	// 	mui.toast('非LIMS用户，无此功能权限');
	// 	return;
	// }
	if (app.currentTabIndex !== index) {
		app.currentTabIndex = index;
		onSearchBtnTap();
	}
}

// 处理搜索点击事件
function onSearchBtnTap() {
	if (true) {
	// if (userInfo.limsRoles) {
		document.querySelector('input[type=text]').blur();
		scroller.scrollTo(0, 0);
		if (app.taskList.length > 0) {
			app.taskList = [];
		}

		// 重新搜索
		Search.action({
			searchdate: app.searchdate,
			process_instance_id: app.tabs[app.currentTabIndex].process_instance_id,
		});
		refreshTodoJobNumber();
	} else {
		mui.toast('非LIMS用户，无此功能权限');
	}
}

// 处理item点击事件
function onItemTap(item) {
	base.blur();
	mui.openWindow({
		url: Webviews['todo-detail'].url,
		id: Webviews['todo-detail'].id,
		extras: {
			process_instance_id: tabs[app.currentTabIndex].process_instance_id,
			searchdate: app.searchdate,
			taskId: item.id,
			taskCode: item.taskCode,
			companyCheck: item.companyCheck,
		},
	});
}

// 刷新待办列表数量
function refreshTodoJobNumber() {
	base.post(Config.urls.job_refreshTodoJobNumber, {}, function(res) {
		app.tabs[0].taskCount = res.data['2'];
		app.tabs[1].taskCount = res.data['5'];
		app.tabs[2].taskCount = res.data['6'];
	}, function(error) {
		mui.toast(error.message);
	});
}

//消息通知接口地址
function findMessages() {
	var info = {
		"currentPage": 0, //当前页数
		"isPage": true,
		"loginName": userInfo.account, //登陆用户名
		"pageSize": 1, //每页条数
		"status": 0 //=0 表示未读 =1 已读 =2全部
	};
	base.post(Config.urls.message_findMessages, info, function(res) {
		app.messageCount = res.data.count;
		initMessageBtn(res.data.count);
	}, function(error) {
		mui.toast(error.message);
	});
}

var interval = 0;

// 打开或关闭待办数定时器
function toggleInterval(value) {
	if (value) {
		refreshTodoJobNumber();
		if (isMessageOn()) {
			findMessages();
		}
		interval = setInterval(function() {
			refreshTodoJobNumber();
			if (isMessageOn()) {
				findMessages();
			}
		}, 60000);
	} else {
		clearInterval(interval);
	}
}
