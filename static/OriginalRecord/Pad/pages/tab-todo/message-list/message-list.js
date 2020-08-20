// 自身webview
var self = null;

// 滚动组件
var scroller = null;

var content = '';
var message = '1';
var name = '';
var currentPage = 0;

// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {

		// 消息列表
		messageList: [],
	},
});

// 初始化mui
mui.init();

// 初始化plus
mui.plusReady(function() {
	self = plus.webview.currentWebview();
	initTitleBar();
	message = JSON.parse(plus.storage.getItem('message'));

	name = base.getUserInfo().account;

	// 初始化滚动组件
	scroller = new Scroller({
		elem: '.mui-scroll-wrapper',
		onPullup: function() {
			findMessages();
		},
	});

	// 初始化时调用刷新
	refresh();

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
	titleBar.drawText('消息通知列表', {}, {
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
	backBtn.drawBitmap('../../../res/common/back.png', {}, {
		top: '12px',
		left: '12px',
		width: '20px',
		height: '20px',
	});
	backBtn.addEventListener('click', function() {
		self.opener().evalJS('findMessages();');
		mui.back();
	});

	// 画刷新按钮
	var refreshBtn = new plus.nativeObj.View('refreshBtn', {
		position: 'absolute',
		top: '0px',
		left: (window.innerWidth - 44) + 'px',
		width: '44px',
		height: '44px',
	});
	refreshBtn.drawBitmap('../../../res/todo/refresh.png', {}, {
		top: '12px',
		left: '12px',
		width: '20px',
		height: '20px',
	});
	refreshBtn.addEventListener('click', function() {
		refresh();
	});

	self.append(titleBar);
	self.append(backBtn);
	self.append(refreshBtn);
}

// 获取消息列表
function findMessages() {
	scroller.setLoadingStatus('loading');
	currentPage += 1;
	base.post(Config.urls.message_findMessages, {
		currentPage: currentPage,
		isPage: true,
		loginName: name,
		pageSize: 10,
		status: 2,
	}, function(res) {
		res.data.list.forEach(function(item) {
			app.messageList.push(item);
		});
		var isEnd = currentPage >= res.data.pageCount;
		scroller.end(isEnd);
	}, function(error) {
		mui.toast(error.message);
	});
}

// 处理item点击事件
function onItemTap(ids) {
	mui.openWindow({
		url: Webviews['message'].url,
		id: Webviews['message'].id,
		extras: {
			ids: ids,
		},
	});
}

// 刷新页面
function refresh() {
	if (app.messageList.length > 0) {
		scroller.scrollTo(0, 0);
		app.messageList = [];
		currentPage = 0;
	}
	findMessages();
}
