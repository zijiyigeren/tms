// 自身webview
var self = null;

// 滚动组件
var scroller = null;

// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {
		process_instance_id: '', // 报告状态，取值为`2, 5, 6`
		searchdate: '', // 年份值
		taskList: [], // 任务列表
		taskId: '', // 任务id
		taskCode: '', // 任务号
		procName: '', // 报告状态名字
		companyCheck: '', // 受检单位
		mlist: [], // 分配人选
	},
	methods: {
		taskCountText: function(taskCount) {
			if (taskCount > 99) {
				return '99+';
			} else {
				return taskCount.toString();
			}
		},
	},
});

// 初始化mui
mui.init();

// 初始化plus
mui.plusReady(function() {
	self = plus.webview.currentWebview();
	app.process_instance_id = self.process_instance_id;
	app.searchdate = self.searchdate;
	app.taskId = self.taskId;
	app.taskCode = self.taskCode;
	app.companyCheck = self.companyCheck;
	initTitleBar();

	// 初始化滚动组件
	scroller = new Scroller({
		elem: '.mui-scroll-wrapper',
	});

	// 刷新页面
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
	titleBar.drawText('任务内容', {}, {
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

	self.append(titleBar);
	self.append(backBtn);
}

// 处理item点击事件
function onItemTap(item) {
	mui.openWindow({
		url: Webviews['todo-item'].url,
		id: Webviews['todo-item'].id,
		extras: {
			item: item,
			taskCode: app.taskCode,
			companyCheck: app.companyCheck,
			procName: app.procName,
			mlist: app.mlist,
			process_instance_id: app.process_instance_id,
			searchdate: app.searchdate,
		},
	});
}

// 获取详细内容
function findTaskContentsTodo() {
	base.showLoading();
	base.post(Config.urls.job_findTaskContentsTodo, {
		searchdate: app.searchdate,
		taskId: app.taskId,
		process_instance_id: app.process_instance_id,
	}, function(res) {
		base.closeLoading();
		app.taskList = res.data.list;
		app.procName = res.data.procName;
		app.mlist = res.data.mlist;
	}, function(error) {
		mui.toast(error.message);
	});
}

// 刷新页面
function refresh() {
	if (app.taskList.length > 0) {
		app.taskList = [];
	}
	findTaskContentsTodo();
}
