// 自身Webview
var self = null;

// 滚动组件
var scroller = null;

// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {

		parkingLots: [],

		areas: [],

		currentArea: null,
		currentRow: null,

		isLoading: false,
	},
	computed: {
		areaOptions: function() {
			return this.areas.slice(0);
		},
		rowOptions: function() {
			var _this = this;
			if (_this.currentArea === null) {
				return [];
			} else {
				var plist = _this.currentArea.plist.map(function(item) {
					item.lineName = '第 ' + item.line + ' 排';
					return item;
				});
				return plist.sort((a, b) => {
					var numberA = Number(a.line);
					var numberB = Number(b.line);
					if (numberA && numberB) {
						return numberA - numberB;
					} else {
						return a.line <= b.line ? -1 : 1;
					}
				});
			}
		},
	},
	watch: {

		// 停车场改变时重置排
		'currentArea': function(newValue) {
			scroller.scrollTo(0, 0);
			this.currentRow = null;
			this.parkingLots = [];
		},

		// 排改变时查询车位
		'currentRow': function(newValue) {
			scroller.scrollTo(0, 0);
			this.parkingLots = [];
			if (newValue !== null) {
				findPlace(newValue.id);
			}
		}
	},
});

// 初始化mui
mui.init();

// 初始化plus
mui.plusReady(function() {
	self = plus.webview.currentWebview();
	initTitleBar();

	scroller = new Scroller({
		elem: '.mui-scroll-wrapper',
	});

	findPlaceBase();
});

// 初始化标题栏
function initTitleBar() {

	var titleBar = new plus.nativeObj.View('titleBar', {
		position: 'absolute',
		top: '0',
		left: '0',
		right: '0',
		height: '44px',
		backgroundColor: '#3e80cb',
	});
	titleBar.drawText('选择车位', {}, {
		color: '#fff',
		size: '18px',
	});

	var backBtn = new plus.nativeObj.View('backBtn', {
		position: 'absolute',
		top: '0',
		left: '0',
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

// 获取停车场和排信息
function findPlaceBase() {
	base.get(Config.urls.carload_findPlaceBase, {}, function(res) {
		app.areas = res.data;
	}, function(error) {
		mui.toast(error.message);
	});
}

// 根据排获取车位
function findPlace(id) {
	app.isLoading = true;
	base.get(Config.urls.carload_findPlace, {
		placeBaseChildId: id
	}, function(res) {
		app.isLoading = false;
		app.parkingLots = res.data.map(function(item) {
			return {
				id: item.id,
				comeCompany: item.comeCompany,
				linenumber: item.linenumber,
				status: item.status,
				vincode: item.vincode
			};
		});
	}, function(error) {
		app.isLoading = false;
		mui.toast(error.message);
	});
}

// 处理车位点击事件
function onParkingLotTap(item) {
	var parkInfo = {
		placeid: item.id,
		place: app.currentArea.areaCode + ' 第' + app.currentRow.line + '排 第' + item.linenumber + '位',
	};
	self.opener().evalJS('onParkingLotChange(\'' + JSON.stringify(parkInfo) + '\');');
	mui.back();
}
