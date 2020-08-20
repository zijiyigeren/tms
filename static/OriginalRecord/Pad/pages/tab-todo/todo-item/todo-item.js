// 自身webview
var self = null;

// 滚动组件
var scroller = null;

// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {
		canAssignTask: true, // 是否有任务分配的权限
		isLoading: false, // 是否正在下载报告
		item: null, // 当前的项目
		taskCode: '', // 任务号
		companyCheck: '', // 受检单位
		procName: '', // 报告状态名
		mlist: [],
		reason: '', // 退回原因

		musters: '', // 当状态为2时，要提交的分配的人
		master: '', // 当状态为5或6时，已经分配的人
		process_instance_id: '', // 报告状态，取值为`2, 5, 6`
		searchdate: '', // 年份值
		operation: 'agree', // 操作，取值为`agree, reject`
	},
});

// 初始化mui
mui.init({
	beforeback: function() {
		Downloader.clear();
		return true;
	},
});

// 初始化plus
mui.plusReady(function() {
	self = plus.webview.currentWebview();
	initTitleBar();

	// 从父页面获取属性
	app.process_instance_id = self.process_instance_id;
	app.item = self.item;
	app.taskCode = self.taskCode;
	app.companyCheck = self.companyCheck;
	app.procName = self.procName;

	// 只有报告为"分配检测"时才能选择分配的人，否则显示已分配的人
	if (self.process_instance_id === '2') {
		app.mlist = self.mlist;
		if (self.mlist.length > 0) {
			app.musters = self.mlist[0].loginName;
		}
	} else {
		app.master = self.item.master;
	}

	app.searchdate = self.searchdate;

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
	titleBar.drawText('项目内容', {}, {
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

	// 画确认按钮
	var confirmBtn = new plus.nativeObj.View('confirmBtn', {
		position: 'absolute',
		top: '0px',
		left: (window.innerWidth - 44) + 'px',
		width: '44px',
		height: '44px',
	});
	confirmBtn.drawBitmap('../../../res/common/check.png', {}, {
		top: '12px',
		left: '12px',
		width: '20px',
		height: '20px',
	});
	confirmBtn.addEventListener('click', function() {
		if (
			(app.process_instance_id === '2' && app.musters === '') ||
			app.operation === '' ||
			(app.operation === 'reject' && app.reason === '')
		) {
			mui.toast('请检查必填项！');
			return;
		}

		var param = {};
		param.inspectids = app.item.id;
		param.processinstance = app.process_instance_id;
		param.searchdate = app.searchdate;

		if (app.operation === 'agree') {
			param.musters = app.musters;
			goNextTaskContent(param);
		}
		if (app.operation === 'reject') {
			param.reason = app.reason;
			goBackTaskContent(param);
		}
	});

	self.append(titleBar);
	self.append(backBtn);
	self.append(confirmBtn);
}

// 处理report点击事件
function onReportBtnTap() {
	base.get(Config.urls.job_findWordPath, {
		inspectId: app.item.id
	}, function(res) {
		if (res.data.length > 0) {
			downloadFile({
				fileName: res.data[0].id,
				fileFolder: res.data[0].floder
			});
		}
	}, function(error) {
		mui.toast(error.message);
	});
}

// 下载报告
function downloadFile(param) {
	var url = base.config.url + Config.urls.job_downloadFile + '?fileName=' + param.fileName + '&filePath=' + param.fileFolder;
	Downloader.get(url, function(isLoading) {
		app.isLoading = isLoading;
	});
}

// 提交下一步
function goNextTaskContent(param) {
	base.post(Config.urls.job_goNextTaskContent, param, function(res) {
		mui.toast(res.message);
		refreshParent();
	}, function(error) {
		mui.toast(error.message);
	});
}

// 退回上一步
function goBackTaskContent(param) {
	base.post(Config.urls.job_goBackTaskContent, param, function(res) {
		mui.toast(res.message);
		refreshParent();
	}, function(error) {
		mui.toast(error.message);
	});
}

// 刷新父页面
function refreshParent() {
	var opener = self.opener();
	var todoWebview = plus.webview.getWebviewById(Webviews['todo'].id);
	todoWebview.evalJS('refreshTodoJobNumber();');
	opener.evalJS('refresh();');
	mui.back();
}
