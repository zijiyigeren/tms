// 底部栏参数
var barItems = [
	{
		title: '待办管理',
		url: Webviews['todo'].url,
		id: Webviews['todo'].id,
		icon: '../../res/tab/todo.png',
	},
	{
		title: '任务管理',
		url: Webviews['task'].url,
		id: Webviews['task'].id,
		icon: '../../res/tab/task.png',
	},
	{
		title: '样车管理',
		url: Webviews['car'].url,
		id: Webviews['car'].id,
		icon: '../../res/tab/car.png',
	},
	{
		title: '样件管理',
		url: Webviews['sample'].url,
		id: Webviews['sample'].id,
		icon: '../../res/tab/sample.png',
	},
	{
		title: '原始记录列表',
		url: "../record/list.html",
		id: "recordList",
		icon: '../../res/tab/sample.png',
	}
];

// webview对象列表
var barItemWebviews = [];

// 空出底部tab栏的子页面样式
var webviewStyle = {
	top: '0px',
	bottom: '51px',
};

// 自身webview
var self = null;

// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {
		barItems: barItems,
		currentItemIndex: 0,
		previousItemIndex: 0,
	},
});

// 初始化mui
mui.init();

// 初始化plus
mui.plusReady(function() {
	self = plus.webview.currentWebview();
	// plus.navigator.setStatusBarBackground('#204a79');
	// plus.navigator.setStatusBarStyle('light');
	
	if (true) {
	//if (judgeLogin()) {
		initTabItemWebviews();
		setTimeout(function() {
			self.setStyle({
				height: window.innerHeight + 'px',
			});
		}, 1000);
	}
	//VersionTool.checkUpdate(); //检测版本更新,调试时需手动关闭,提交前打开
});

// 初始化tab页面
function initTabItemWebviews() {
	for (var i = 0; i < barItems.length; i++) {
		if(true) {
		//if (i === 0 || (i === 1 && base.roles.isLimsUser()) || (i >= 2 && base.roles.isSampleUser())) {
			var barItem = barItems[i];
			var barItemWebview = plus.webview.create(barItem.url, barItem.id, webviewStyle);
			barItemWebviews.push(barItemWebview);
			self.append(barItemWebview);
			console.log('----------------------------------------'+i)
		}else{
			barItemWebviews.push(null);
		}
	}
	barItemWebviews[app.currentItemIndex].show();
}

// 处理点击tab栏事件
function onTabTap(index) {
	if (app.currentItemIndex !== index) {
		// if (index === 1 && !base.roles.isLimsUser()) {
		// 	mui.toast('非LIMS用户，无此功能权限');
		// 	return;
		// }
		// if (index > 1 && !base.roles.isSampleUser()) {
		// 	mui.toast('非样品用户，无此功能权限');
		// 	return;
		// }
		app.previousItemIndex = app.currentItemIndex;
		app.currentItemIndex = index;
		barItemWebviews[app.currentItemIndex].show();
		barItemWebviews[app.previousItemIndex].hide();
	}
}

// 判断登录，如果没登录就跳转登录页面
function judgeLogin() {
	if (!base.getUserInfo().sessionId) {
		mui.openWindow({
			url: Webviews['login'].url,
			id: Webviews['login'].id,
			createNew: false,
		});
		return false;
	}
	return true;
}

// 刷新页面
function refresh() {
	self.reload();
}
