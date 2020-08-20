// 自身webview
var self = null;

// 滚动组件
var scroller = null;

// 日期选择器
var picker = null;

// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {

		// 需要提交的字段
		carInfo: {
			comeCompany: '',
			model: '',
			vin: '',
			leveal: '',
			checkType: '',
			lichengbiao: '',
			comePeople: '',
			contract: '',
			comeDate: '',
			incomePeople: '',
			bbplaceid: '',
			envSample: '0',
			barcode: '',
			isPage: true
		},

		// 车位名字
		place: '',

		// 保密级别选项
		securityLevelList: [],

		// 检验类型选项
		checkTypeList: [],

		// 环保选项
		envSampleList: [],
	},
});

// 初始化mui
mui.init();

// 初始化plus
mui.plusReady(function() {
	self = plus.webview.currentWebview();
	initTitleBar();

	// 初始化滚动组件
	scroller = new Scroller({
		elem: '.mui-scroll-wrapper',
	});

	initCarloadInfo();

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
	titleBar.drawText('样车录入', {}, {
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

// 初始化整车页面编辑信息
function initCarloadInfo() {
	base.get(Config.urls.carload_initCarloadInfo, {}, function(res) {
		app.securityLevelList = res.data.level.split(',');
		app.checkTypeList = res.data.checkType.split(',');

		var envSample = res.data.envSample;
		app.envSampleList = Object.keys(envSample).map(function(key) {
			return [
				key,
				envSample[key]
			];
		});
	}, function(error) {
		mui.toast(error.message);
	});
}

// 处理完成按钮点击事件
function onFinishBtnTap() {
	var isValid = Object.keys(app.carInfo).every(function(key) {
		return app.carInfo[key] !== '' || key === 'barcode';
	});
	if( app.carInfo.vin.length != 17 ){
		mui.toast('VIN码必须为17位！');
		return;
	}
	if (isValid) {
		base.post(Config.urls.carload_saveCarload, app.carInfo, function(res) {
			self.opener().reload();
			mui.back();
		}, function(error) {
			mui.toast(error.message);
		});
	} else {
		mui.toast('请检查必填项！');
	}
}

// 处理车位按钮点击事件
function onSelectParkingLotTap() {
	base.blur();
	mui.openWindow({
		url: Webviews['car-parking'].url,
		id: Webviews['car-parking'].id,
	});
}

// 处理扫码按钮点击事件
function onScanTap() {
	base.blur();
	mui.openWindow({
		url: Webviews['barcode'].url,
		id: Webviews['barcode'].id,
	});
}

// 打开日期选择器
function selectDate() {
	base.blur();
	if (!picker) {
		picker = new mui.DtPicker({
			type: 'date'
		});
	}
	picker.show(function(rs) {
		app.carInfo.comeDate = rs.text;
	});
}

// 处理扫码
function handleScanCode(code) {
	app.carInfo.barcode = code;
}

// 处理车位变化事件
function onParkingLotChange(parkInfoStr) {
	var parkInfo = JSON.parse(parkInfoStr);
	app.carInfo.bbplaceid = parkInfo.placeid;
	app.place = parkInfo.place;
}
