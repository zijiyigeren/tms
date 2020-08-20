/***
* 原始记录录入页面
* 参数：
* 	recordId：原始记录的id
* 	taskContentId：检验项目
* */
var app = new Vue({
	el: '#app',
	data: {
		taskContent:{//检验项目的对象
		},
		recordInfo:{},//原始记录的对象
		spread:null,//spreadjs对象
		requestParamValues:{}//请求的的参数
	},
	methods: {
		setRequestParamValues:function(webview){//获取请求的内容
			this.requestParamValues.id=webview.recordId;//原始记录的id
			this.requestParamValues.taskContentId = webview.taskContentId;//检验项目id
		},
		init:function(){//初始化信息
			var self = this;
			recordApi.getBaseInfo(this.requestParamValues.taskContentId,function(data){
				self.taskContent = data;
				self.initRecordDataSource();
			});//获取检验项目信息
		},
		initRecordDataSource:function(){//请求后端，获取原始记录的数据信息
			var self = this;
			recordApi.getById(self.requestParamValues.id,function(data){
				self.recordInfo = data;	
				if(self.taskContent.sampleInfoList && self.taskContent.sampleInfoList.length > 0){//查找样品的显示信息
					var sampleInfoList = self.taskContent.sampleInfoList;//获取样品的集合
					for(var i=0;i<sampleInfoList.length;i++){//遍历样品的集合
						var sampleInfo = sampleInfoList[i];//获取样品信息
						if(sampleInfo.sampleCode == self.recordInfo.sampleCode){//与原始记录比较样品编码是否相对,如果相等，则获取型号和机型
							self.recordInfo.sampleCodeText = sampleInfo.model || sampleInfo.vin;
							break;
						}
					}
				}
				var ssjson;
				ssjson = self.recordInfo.content;//获取ssjson数据
				self.initSpreadJs(ssjson);
				base.closeLoading();
			});//获取原始记录的信息
		},
		initSpreadJs:function(ssjson){//初始化Spreadjs信息
			var spreadNS = GC.Spread.Sheets;
			var spread = new GC.Spread.Sheets.Workbook(mui("#ss")[0], {
				newTabVisible: false
			});
			if(ssjson){//根据SSJSON,初始化Spreadjs
				spread.suspendPaint();
				spread.fromJSON(JSON.parse(ssjson));
				spread.resumePaint();
			}
			this.spread = spread;
			spread.options.newTabVisible = false;//不可以创建新sheet页
			spread.options.tabEditable = false;//不支持编辑sheet页
			spread.contextMenu.menuData = [];//禁用spreadjs右键功能
			spread.options.showVerticalScrollbar =false;//设置spread不显示垂直滚动条
			spread.options.showHorizontalScrollbar =false;//设置spread不显示水平滚动条
			var sheetCount = spread.getSheetCount();
			spread.touchToolStrip.clear();//清除触摸菜单项
			for (var i = 0; i < sheetCount; i++) {//设置sheet编辑状态
				var sheet = spread.getSheet(i);
				sheet.options.isProtected = true;
			}
		}
	}
});
mui.init();
mui.plusReady(function() {
	var webviewselft = plus.webview.currentWebview();
	base.showLoading();
	setTimeout(function(){
		app.setRequestParamValues(webviewselft);
		app.init();	
		
	},0);
	
});


