// 自身webview
var self = null;
var scroller = null;

// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {
		isCheckboxChecked: false,
		sampleList: [],
		navBtns: [
			{
				title: '样件登记',
				url: Webviews['sampleReg'].url,
				id: Webviews['sampleReg'].id,
				icon: '../../../res/sample/register.png',
				show: false
			},
			{
				title: '预约列表',
				url: Webviews['bookList'].url,
				id: Webviews['bookList'].id,
				icon: '../../../res/sample/booking.png',
				show: true
			},
			{
				title: '样件出库',
				url: Webviews['sampleExp'].url,
				id: Webviews['sampleExp'].id,
				icon: '../../../res/sample/ex.png',
				show: false
			},
			{
				title: '样件流转',
				url: Webviews['sampleXchg'].url,
				id: Webviews['sampleXchg'].id,
				icon: '../../../res/sample/exchange.png',
				show: true
			},
			{
				title: '退样列表',
				url: Webviews['sampleRej'].url,
				id: Webviews['sampleRej'].id,
				icon: '../../../res/sample/reject.png',
				show: true
			},
		]
	},
});

// 初始化mui
mui.init();

// 初始化plus
mui.plusReady(function() {
	self = plus.webview.currentWebview();
	initTitleBar();
	app.navBtns[2].show = app.navBtns[0].show = base.roles.isDistributor();
	// 初始化滚动组件
	scroller = new Scroller({
		elem: '.mui-scroll-wrapper',
		onPullup: function() {
			Search.nextPage(function(res, isEnd) {
				if (res.data.list && res.data.list.length > 0) {
					res.data.list.forEach(function(item) {
						app.sampleList.push(item);
					});
				}
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
		url: Config.urls.component_findComponentParts,
		search: true,
		success: function(res, isEnd) {
			if(!res.data || !res.data.list){
				return;
			}
			res.data.list.forEach(function(item) {
				app.sampleList.push(item);
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
	titleBar.drawText('样件管理', {}, {
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
		base.goScan();
	});
	self.append(btn);
}
// 处理导航按钮点击事件
function onNavBtnTap(item) {
	base.blur();
	mui.openWindow({
		url: item.url,
		id: item.id,
	});
}
// 处理搜索点击事件
function onSearchBtnTap() {
	base.blur();
	scroller.scrollTo(0, 0);
	app.sampleList = [];
	// 重新搜索
	Search.reload();
}
function goDetail(id){
	base.blur();
	mui.openWindow({
		url: Webviews['sampleDetail'].url,
		id: Webviews['sampleDetail'].id,
		extras:{
			sampleId: id
		}
	})
}
function handleScanCode(code){
	base.showLoading({title:'处理中..'});
	base.get(Config.urls.component_goFetchComponentPartPlace,
		{ barcode: code },
		function(res){
			mui.toast(res.message);
		}
	)
}