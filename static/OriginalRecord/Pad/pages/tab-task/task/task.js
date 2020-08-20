// 自身webview
var self = null;

// 滚动组件
var scroller = null;

// 用户信息
var userInfo = null;

// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {
		isCheckboxChecked: false, // 复选框
		taskList: [], // 任务列表
		searchdateOptions: [], // 年份选项
		searchdate: '', // 年份值
		taskStatus:'',
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

	// 有lims权限时才初始化搜索
	if (userInfo.limsRoles) {

		// 初始化搜索组件
		Search.init({
			elem: {
				select: '.select-wrapper:nth-child(1) > select',
				input: '.search-wrapper > input',
				checkbox: '.checkbox-wrapper > input',
			},
			extraParam: {
				searchdate: app.searchdate,
			},
			url: Config.urls.job_findJob,
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
	titleBar.drawText('任务管理', {}, {
		color: '#fff',
		size: '18px',
	});

	self.append(titleBar);
}

// 生成最近十年的选项
function initSearchdateOptions() {
	var year = new Date().getFullYear();
	for (var i = 0; i < 10; i++) {
		app.searchdateOptions.push(year - i);
	}
	app.searchdate = app.searchdateOptions[0];
}

// 处理搜索点击事件
function onSearchBtnTap() {
	var taskStatus="";
	document.querySelector('input[type=text]').blur();
	scroller.scrollTo(0, 0);
	if (app.taskList.length > 0) {
		app.taskList = [];
	}

	// 重新搜索
	Search.action({
		searchdate: app.searchdate,
		task_status: app.taskStatus,
	});
}

// 处理item点击事件
function onItemTap(item) {
	base.blur();
	mui.openWindow({
		url: Webviews['task-detail'].url,
		id: Webviews['task-detail'].id,
		extras: {
			searchdate: item.partitiondate,
			taskId: item.id,
			taskCode: item.taskCode,
			sampleName: item.sampleName,
		},
	});
}
