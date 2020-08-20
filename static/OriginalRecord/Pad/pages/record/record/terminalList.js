// 初始化Vue
var app = new Vue({
	el: '#app',
	data: {
		isCheckboxChecked: false,//搜索的查询选中的状态
		terminaList: [],//列表显示的数据
		webview:{},//当前页面
		selectTerminaList:[],//选中的设备集合
		selectTerminaObject:{},//选中的设备的编号和集合中的索引对应关系
		scroller:null//滚动下拉对象
	},
	methods:{			
		selectTerminal:function(item,$event){//设备列表的点击事件
			var checkboxId = 'checkbox'+ item.code;//获取checkboxid
			var checkboxList = this.$refs[checkboxId];//获取checkbox对象组
			if(checkboxList && checkboxList.length > 0){//判断该对象是否为空
				var checkbox = checkboxList[0];//获取checkbox对象
				var index = this.selectTerminaList.indexOf(item);//获取当前对应在数组的索引
				if(index >= 0){//如果当前checkbox为选中状态，从选中设备集合中删除该设备信息
					checkbox.checked = false;//更改选中状态
					this.selectTerminaList.splice(index, 1);//从选中设备集合中删除当前信息
				}else{
					checkbox.checked = true;//数组checkbox选中状态
					this.selectTerminaList.push(item);
				}
			}
		},
		// 处理搜索点击事件
		onSearchBtnTap:function () {
			var self =this;
			base.blur();
			base.showLoading();
			this.scroller.scrollTo(0, 0);
			self.terminaList = [];
			this.selectTerminaList = [];
			this.selectTerminaObject = {};
			// 重新搜索
			Search.reload();
		},
		init:function(webview){	//初始化当前页面
			var list =[];
			this.webview = webview;	//保存当前页面信息		
			var self = this;
			// 初始化滚动组件
			this.scroller = new Scroller({
				elem: '.mui-scroll-wrapper',
				onPullup: function() {
					Search.nextPage(function(res, isEnd) {//触发Search组件的分页
						if (res.data && res.data.list && res.data.list.length > 0) {
							res.data.list.forEach(function(item) {
								self.terminaList.push(item);
							});
						}
						self.scroller.end(isEnd);
					});
				},
			});
			if(recordApi.searchTerminal){
				var data = recordApi.searchTerminal({});
				self.terminaList = data.list;	
				base.closeLoading();
			}else{
				// 初始化搜索组件
				Search.init({
					elem: {
						select: '.select-wrapper:nth-child(1) > select',
						input: '.search-wrapper > input',
						checkbox: '.checkbox-wrapper > input',
					},
					url: "/job/searchTerminal",
					search: true,
					success: function(res, isEnd) {
						if(!res.data || !res.data.list){
							if(recordApi.searchTerminal){
								var data = recordApi.searchTerminal({});
								self.terminaList = data.list;							
							}
							return;
						}
						res.data.list.forEach(function(item) {
							self.terminaList.push(item);
						});
						self.scroller.end(isEnd);
						base.closeLoading();
					}
				});
			}
			
		},
		okClick:function(){//确定按钮事件
			var view = this.webview.opener();
			mui.fire(view,'addTerminalList',{selectTerminaList:this.selectTerminaList});//触发上级页面的添加设备的事件
			this.selectTerminaList = [];//清空选中的内容
			this.selectTerminaObject = {};//清空设备编码与索引对应关系
			this.closeClick();//返回上一页
		},
		closeClick:function(){//返回上一页
			mui.back();
		}
	}
	
});

// 初始化mui
mui.init();


// 初始化plus
mui.plusReady(function() {
	base.showLoading();
	var webview = plus.webview.currentWebview();
	initTitleBar(webview);
	app.init(webview);
});


// 初始化标题栏
function initTitleBar(webviewselft) {
   var self = webviewselft;
	// 标题栏
	var titleBar = new plus.nativeObj.View('titleBar', {
		position: 'absolute',
		top: '0px',
		left: '0px',
		right: '0px',
		height: '44px',
		backgroundColor: '#3e80cb',
	});
	titleBar.drawText('设备选择', {}, {
		color: '#fff',
		size: '18px',
	});

	// 返回按钮
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

	// 提交按钮
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
		app.okClick();
	});
	

	self.append(titleBar);
	self.append(backBtn);
	self.append(confirmBtn);
}