// 自身webview
var self = null;

// 滚动组件
var scroller = null;

var inspectIds = '';

// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {
		info: {
			"show": 1
		},
		list: [],

		searchdate: '2018',

		inspectIds: [],
		videoFileNames: [],
		videoStatus: [],
		radioGroup: []
	},
});

// 初始化mui
mui.init();

// 初始化plus
mui.plusReady(function() {
	self = plus.webview.currentWebview();

	inspectIds = self.inspectIds;
	app.searchdate = self.searchdate;
	app.list = self.list;

	initTitleBar();

	// 初始化滚动组件
	scroller = new Scroller({
		elem: '.mui-scroll-wrapper',
	});

	// 遍历每个报告
	app.list.forEach(function(item, index) {
		var videoStatusMap = item.videoStatusMap;

		console.log(JSON.stringify(videoStatusMap));

		// 生成radio选项
		app.radioGroup.push(Object.keys(videoStatusMap).map(function(key) {
			return {
				key: key,
				value: videoStatusMap[key]
			};
		}));

		// 对应报告编号
		app.inspectIds.push(item.inspectid);

		// 默认选中的value
		app.videoFileNames.push(item.videoStatusMap[item.videoStatus]);
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
	titleBar.drawText('视频填充', {}, {
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

function commitInfo() {
	if (app.videoFileNames.length !== app.list.length) {
		mui.toast('未填写视频状态');
		return;
	}
	if (app.videoFileNames.some(function(item) {
		return !item;
	})) {
		mui.toast('未填写视频状态');
		return;
	}
	app.videoStatus = app.videoFileNames.map(function(item, index) {
		var status = app.radioGroup[index].find(function(radio) {
			return radio.value === item;
		});
		return status.key;
	});
	base.showLoading({
		title: '处理中..'
	});
	base.get(Config.urls.job_saveVideoInfo, {
		inspectIds: app.inspectIds.join(','),
		videoFilenames: app.videoFileNames.join(','),
		videoStatus: app.videoStatus.join(',')
	}, function(res) {
		mui.toast(res.message);
		signTaskContent();
	}, function(error) {
		mui.toast(error.message);
	});
}

function signTaskContent() {
	base.get(Config.urls.job_signTaskContent, {
		inspectIds: inspectIds,
		searchdate: app.searchdate
	}, function(res) {
		self.opener().reload();
		mui.back();
	}, function(error) {
		mui.toast(res.message);
	});
}
