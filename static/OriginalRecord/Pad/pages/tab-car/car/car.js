// 自身webview
var self = null;

// 滚动组件
var scroller = null;

// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {
		isCheckboxChecked: false,
		carList: [],
		navBtns: [
			{
				title: '样车录入',
				url: Webviews['car-reg'].url,
				id: Webviews['car-reg'].id,
				icon: '../../../res/car/register.png',
				show: false,
			},
			{
				title: '样车使用',
				url: Webviews['car-use'].url,
				id: Webviews['car-use'].id,
				icon: '../../../res/car/use.png',
				show: true,
			},
			{
				title: '退样列表',
				url: Webviews['car-back'].url,
				id: Webviews['car-back'].id,
				icon: '../../../res/car/back.png',
				show: true,
			},
			{
				title: 'VIN码流转',
				url: '../car-use-vin/car-use-vin.html',
				id: 'car-use-vin',
				icon: '../../../res/car/use.png',
				show: true,
			},
		],
	},
	computed: {
		computedRecords: function() {
			return this.carList.map(function(item) {
			 if (typeof item.bookDate === 'string') {
					item.bookDate = item.bookDate.replace('_', ' ').replace(/([0-9]{2})([0-9]{2})$/, '$1:$2');
			 } else {
				 item.bookDate = '';
			 }
			 return item;
			});
		}
	}
});

// 初始化mui
mui.init();

// 初始化plus
mui.plusReady(function() {
	self = plus.webview.currentWebview();
	app.navBtns[0].show = base.roles.isDistributor();
	initTitleBar();

	// 初始化滚动组件
	scroller = new Scroller({
		elem: '.mui-scroll-wrapper',
		onPullup: function() {

			// 下一页
			Search.nextPage(function(res, isEnd) {
				res.data.list.forEach(function(item) {
					app.carList.push(item);
				});
				scroller.end(isEnd);
			});
		},
	});

	// 初始化搜索组件
	Search.init({
		elem: {
			select: '.select-wrapper:nth-child(1) > select',
			input: '.search-wrapper > input',
			checkbox: '.checkbox-wrapper > input',
		},
		url: Config.urls.carload_findCarloads,
		search: true,
		success: function(res, isEnd) {
			if(!res.data || !res.data.list){
				return;
			}
			res.data.list.forEach(function(item) {
				app.carList.push(item);
			});
			scroller.end(isEnd);
		}
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
	titleBar.drawText('样车管理', {}, {
		color: '#fff',
		size: '18px',
	});

	self.append(titleBar);
	var btn = new plus.nativeObj.View('scanBtn', {
		position: 'absolute',
		top: '0px',
		left: (window.innerWidth - 44) + 'px',
		width: '44px',
		height: '44px',
	});
	btn.drawBitmap('../../../res/common/scan.png', {} , {
		top: '12px',
		left: '12px',
		width: '20px',
		height: '20px',
	});
	btn.addEventListener('click', function(event) {
		base.blur();
		mui.openWindow({
			url: Webviews['car-use'].url,
			id: Webviews['car-use'].id
		})
	});
	self.append(btn);
}

// 处理搜索点击事件
function onSearchBtnTap() {
	document.querySelector('input[type=text]').blur();
	scroller.scrollTo(0, 0);
	app.carList = [];

	// 重新搜索
	Search.action({});
}

// 处理导航按钮点击事件
function onNavBtnTap(item) {
	base.blur();
	mui.openWindow({
		url: item.url,
		id: item.id,
	});
}
function goDetail(id){
	base.blur();
	mui.openWindow({
		url: 'carInfo.html',
		id: 'carInfo',
		extras:{
			carloadId: id
		}
	})
}