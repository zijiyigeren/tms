// 自身webview
var self = null;
var scroller = null;
function goDetail(id){
				base.blur();				
				mui.openWindow({
					url: 'record/record.html',
					id: 'record/record',
					extras:{
						// recordId: '9a925983e6cd4a81b924eedbdeea7857',
						recordId:id,
						taskContentId:'2402941'
					},
					waiting:{
						autoShow:false
					}
				})
			}
// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {
		isCheckboxChecked: false,
		navBtns: [
			{
				title: '新建',
				url: Webviews['record'].url,
				id: Webviews['record'].id,
				icon: '../../res/sample/register.png',
				show: true
			},{
				title: '刷新',
				id: "refresh",
				icon: '../../res/todo/refresh.png',
				show: true
			},{
				title: '编辑后端id',
				id: "editJavaId",
				icon: '../../res/todo/refresh.png',
				show: true
			},{
				title: '查看后端id',
				id: "viewJavaId",
				icon: '../../res/todo/refresh.png',
				show: true
			}
		],
		recordList: []
	},
	methods:{
		init:function(){	
			var list =[];
			var self = this;
			for (var i = 0; i < plus.storage.getLength(); i++) {
				 var key = plus.storage.key(i); //获取本地存储的Key
				 if(key.indexOf("record")>-1){
					 list.push(JSON.parse(plus.storage.getItem(key)));
				 }
			}
			this.recordList = list;
			// 初始化滚动组件
			this.scroller = new Scroller({
				elem: '.mui-scroll-wrapper',
				onPullup: function() {
					self.scroller.end(false);
				},
			});
		}
	}
	
});

// 初始化mui
mui.init();

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
	titleBar.drawText('原始记录列表', {}, {
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


// 初始化plus
mui.plusReady(function() {
	self = plus.webview.currentWebview();
	initTitleBar();
	app.init();
});

// 处理导航按钮点击事件
function onNavBtnTap(item) {
	base.blur();
	if(item.id=="refresh"){
		app.init();
	}else if(item.id == "editJavaId"){
		mui.openWindow({
			url: 'record/record.html',
			id: 'record/record',
			extras:{
				recordId: '9a925983e6cd4a81b924eedbdeea7857',
				taskContentId:'2402941'
			},
			waiting:{
				autoShow:false
			}
		})
	}else if(item.id == "viewJavaId"){
		mui.openWindow({
			url: 'view/view.html',
			id: 'view/view',
			extras:{
				recordId: '9a925983e6cd4a81b924eedbdeea7857',
				taskContentId:'2402941'
			},
			waiting:{
				autoShow:false
			}
		})
	}else{
		mui.openWindow({
			url: item.url,
			id: item.id,
		});
	}
	
}

function reload(){
	app.init();
}
