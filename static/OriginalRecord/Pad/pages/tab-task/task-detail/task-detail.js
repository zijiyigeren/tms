// 自身webview
var self = null;

// 滚动组件
var scroller = null;

// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {
		taskId: '', // 任务id
		taskCode: '', // 任务号
		sampleName: '', // 样品名称
		taskList: [], // 任务列表
		process_instance_id: '', // 报告状态，取值为`2, 5, 6`
		searchdate: '', // 年份值

		// 用户是否有权限置顶
		canSetTop: false,

		// 用户是否有权限标记
		canMark: false,

		// 用户是否有权限取消标记
		canCancelMark: false
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
	app.taskId = self.taskId;
	app.taskCode = self.taskCode;
	app.sampleName = self.sampleName;
	app.searchdate = self.searchdate;

	// 获取权限信息
	var userInfo = JSON.parse(plus.storage.getItem('userInfo'));
	app.canMark = userInfo.limsRoles.indexOf('job.detect') === -1 ? false : true;
	app.canCancelMark = userInfo.limsRoles.indexOf('job.send') === -1 ? false : true;
	app.canSetTop = userInfo.limsRoles.indexOf('projectManager') === -1 ? false : true;

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
	titleBar.drawText('任务详情', {}, {
		color: '#fff',
		size: '18px',
	});
	self.append(titleBar);

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
	self.append(backBtn);

	// 记录右侧按钮的数量，用于计算按钮位置
	var rightBtnCount = 0;

	// 画置顶按钮
	if (app.canSetTop) {
		rightBtnCount++;
		var setTopBtn = new plus.nativeObj.View('setTopBtn', {
			position: 'absolute',
			top: '0px',
			left: (window.innerWidth - 10 - 34 * (rightBtnCount)) + 'px',
			width: '34px',
			height: '44px',
		});
		setTopBtn.drawBitmap('../../../res/task/set-top.png', {}, {
			top: '12px',
			left: '12px',
			width: '20px',
			height: '20px',
		});
		setTopBtn.addEventListener('click', function() {
			var canBeSetTop = app.taskList.some(function(item) {
				return item.process_instance_id === 5 || item.process_instance_id === 6;
			});
			if (canBeSetTop) {
				base.get(Config.urls.job_toTop, {
					taskIds: app.taskId
				}, function(res) {
					mui.toast(res.message);
				}, function(error) {
					mui.toast(error.message);
				});
			} else {
				mui.toast('只有包含"审核"或"批准"状态的报告才能被置顶');
			}
		});
		self.append(setTopBtn);
	}

	// 画标记按钮
	if (app.canMark) {
		rightBtnCount++;
		var markBtn = new plus.nativeObj.View('markBtn', {
			position: 'absolute',
			top: '0px',
			left: (window.innerWidth - 10 - 34 * (rightBtnCount)) + 'px',
			width: '34px',
			height: '44px',
		});
		markBtn.drawBitmap('../../../res/task/mark.png', {}, {
			top: '12px',
			left: '12px',
			width: '20px',
			height: '20px',
		});
		markBtn.addEventListener('click', function() {
			var inspectIds = [];
			var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
			for (var i = 0; i < checkboxes.length; i++) {
				var item = checkboxes[i];
				var index = item.dataset.index;
				inspectIds.push(app.taskList[index].id);
			}

			if (inspectIds.length === 0) {
				mui.toast('未选中任何报告');
			} else {
				var str = inspectIds.join(',');
				inspectIds = str;
				base.get(Config.urls.job_checkVideo, {
					inspectIds: inspectIds,
				},
				function(res) {
					//var inspectid = "";
					if (res.data.list.length == 0) {
						//标记方法
						base.get(Config.urls.job_signTaskContent, {
								inspectIds:inspectIds,
								searchdate: app.searchdate
						},
						function(res) {
							mui.toast(res.message);
							plus.webview.currentWebview().reload();
						},
						function(error) {
							mui.toast(error.message);
						}
						);
					} else {
						mui.openWindow({
							url: Webviews['video'].url,
							id: Webviews['video'].id,
							extras: {
								inspectIds: str, //str
								searchdate: app.searchdate,
								list: res.data.list
							}
						});
					}
				});
			}
		});
		self.append(markBtn);
	}

	// 画取消标记按钮
	if (app.canCancelMark) {
		rightBtnCount++;
		var cancelMarkBtn = new plus.nativeObj.View('cancelMarkBtn', {
			position: 'absolute',
			top: '0px',
			left: (window.innerWidth - 10 - 34 * (rightBtnCount)) + 'px',
			width: '34px',
			height: '44px',
		});
		cancelMarkBtn.drawBitmap('../../../res/task/cancel-mark.png', {}, {
			top: '12px',
			left: '12px',
			width: '20px',
			height: '20px',
		});
		cancelMarkBtn.addEventListener('click', function() {
			var inspectIds = [];
			var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
			for (var i = 0; i < checkboxes.length; i++) {
				var item = checkboxes[i];
				var index = item.dataset.index;
				inspectIds.push(app.taskList[index].id);
			}

			if (inspectIds.length === 0) {
				mui.toast('未选中任何报告');
			} else {
				var str = inspectIds.join(',');
				base.get(Config.urls.job_cancelSignTaskContent, {
					inspectIds: str,
					searchdate: app.searchdate
				}, function(res) {
					mui.toast(res.data);
					plus.webview.currentWebview().reload();
				}, function(error) {
					mui.toast(error.message);
				});
			}
		});
		self.append(cancelMarkBtn);
	}
}

// 获取详细内容
function findTaskContents() {
	base.showLoading();
	base.post(Config.urls.job_findTaskContents, {
		taskId: app.taskId,
		searchdate: app.searchdate,
	}, function(res) {
		base.closeLoading();
		res.data.list.forEach(function(item) {
			app.taskList.push(item);
		});
	});
}

// 刷新页面
function refresh() {
	if (app.taskList.length > 0) {
		app.taskList = [];
	}
	findTaskContents();
}
