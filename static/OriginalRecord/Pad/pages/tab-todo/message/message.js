// 自身webview
var self = null;

// 滚动组件
var scroller = null;

var messageId = '';

var loginName = '';

// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {

		// 消息标题
		title: '',

		// 消息内容
		content: '',
	},
});

// var xhr = new XMLHttpRequest();
// xhr.onreadystatechange = function() {
// 	if (xhr.readyState === 4) {

// 	}
// };
// xhr.open('GET', 'http://10.0.1.59:4000/api?q=name', true);
// xhr.send();

// 初始化mui
mui.init();

// 初始化plus
mui.plusReady(function() {
	self = plus.webview.currentWebview();
	initTitleBar();

	messageId = self.ids;

	findMessage();

	// 初始化滚动组件
	scroller = new Scroller({
		elem: '.mui-scroll-wrapper',
	});
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
	titleBar.drawText('消息详情', {}, {
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
		mui.back();
	});

	// 画确定按钮
	var confirmBtn = new plus.nativeObj.View('confirmBtn', {
		position: 'absolute',
		top: '0px',
		left: (window.innerWidth - 50) + 'px',
		width: '44px',
		height: '44px',
	});
	confirmBtn.drawText('确定', {}, {
		color: '#fff',
		size: '16px',
	});

	confirmBtn.addEventListener('click', function() {
		base.post(Config.urls.message_updateMessage, {
			loginName: loginName,
			id: messageId,
			currentPage: 0,
			isPage: true,
			pageSize: 0,
			status: 0,
		}, function(res) {
			mui.toast('标记为已读');
			self.opener().evalJS('refresh();');
			mui.back();
		});
	});

	self.append(titleBar);
	self.append(backBtn);
	self.append(confirmBtn);
}

// 获取消息详情
function findMessage() {
	base.get(Config.urls.message_findMessage, {
		messageId: messageId,
	}, function(res) {
		app.content = res.data.content;
		app.title = res.data.title;
	});
}

// 保存消息
function save() {
	base.post(Config.urls.message_updateMessage, {}, {
		loginName: loginName,
		id: messageId,
		currentPage: 0,
		isPage: true,
		pageSize: 0,
		status: 0,
	}, function(res) {
		mui.toast('标记为已读');
		self.opener().evalJS('refresh();');
		mui.back();
	});
}
