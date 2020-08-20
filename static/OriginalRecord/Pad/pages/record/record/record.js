/***
* 原始记录录入页面
* 参数：
* 	recordId：原始记录的id
* 	taskContentId：检验项目
* */
const TERMINAL_SHEET_NAME = "设备信息";
var app = new Vue({
	el: '#app',
	data: {
		taskContent:{//检验项目的信息
		},
		recordInfo:{},//原始记录信息
		sampleConfigInfoList:[],//配置双向绑定的数据
		sampleInfoList:[],//样品双向绑定的数据
		spread:null,//spreadjs对象
		webview:null,
		requestParamValues:{}//请求的的参数
	},
	methods: {//方法
		setRequestParamValues:function(webview){//设置请求的参数
			this.webview = webview;
			this.requestParamValues.id=webview.recordId;
			this.requestParamValues.taskContentId = webview.taskContentId;
			this.initTitleBar(webview);
		},
		init:function(){//初始化信息
			var userInfo = base.getUserInfo();
			var self = this;
			
			if(!userInfo){
				var u = recordApi.getUser();
			}
			recordApi.getBaseInfo(this.requestParamValues.taskContentId,function(data){
				self.taskContent = data;
				self.isTaskContentLoad = true;
				if(!self.taskContent){
					mui.toast("没有查到【"+self.requestParamValues.taskContentId+"】检验项目！");
					return;
				}
				self.sampleInfoList = self.taskContent.sampleInfoList;	//获取样品集合绑定到页面上	
				self.initRecordDataSource();
			});//获取检验项目信息
		},
		initRecordDataSource:function(){//请求后端，获取原始记录的数据信息
			var self = this;
			recordApi.getById(self.requestParamValues.id,function(data){
				self.recordInfo = data;	
				self.isRecordInfoLoad = true;
				if(!self.recordInfo){
					mui.toast("没有查到【"+self.requestParamValues.id+"】原始记录！");
					return;
				}
				var ssjson = self.recordInfo.content;//获取ssjson数据
				self.initSpreadJs(ssjson);//初始化spreadjs
				self.initSampleConfig();
				base.closeLoading();
			});//获取原始记录的信息
		},
		initTitleBar:function initTitleBar(webviewselft) {// 初始化标题栏
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
			titleBar.drawText('原始记录录入', {}, {
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
				app.saveClick();
			});
			

			self.append(titleBar);
			self.append(backBtn);
			self.append(confirmBtn);
		},
		initSpreadJs:function(ssjson){//初始化Spreadjs信息
			
			var self = this;
			var spread = new GC.Spread.Sheets.Workbook(mui("#ss")[0], {//创建spreadjs对象
				newTabVisible: false
			});
			this.spread = spread;
			this.setSsjsonToSpread(this.spread,ssjson);//将获取的ssjson
			this.spread.options.showVerticalScrollbar =false;//设置spread不显示垂直滚动条
			this.spread.options.showHorizontalScrollbar =false;//设置spread不显示水平滚动条
			
			this.registeredSpreadEvent();//注册spreadjs的事件
			this.bindDataSourceToSpread();//将数据源设置到sheet中，为模板提供参数的设置
			this.addTerminalToSheet(this.taskContent.terminalList,true);//向设备信息标签页中增加设备信息
			this.initTouchToolStrip();
		},
		bindDataSourceToSpread:function(){//将数据源绑定到spreadjs中
			if(this.spread){
				var spread = this.spread;
				var terminalSheet = spread.getSheetFromName(TERMINAL_SHEET_NAME);
				if(!terminalSheet) {
					var sheet = new GC.Spread.Sheets.Worksheet();
					sheet.name(TERMINAL_SHEET_NAME);
					spread.addSheet(sheetCount, sheet);
					sheet.setValue(0, 0, "编号");
					sheet.setValue(0, 1, "使用时间");
					sheet.setValue(0, 2, "状态");
					sheet.setValue(0, 3, "备注");
					sheet.setColumnWidth(0, 200);
					sheet.setColumnWidth(1, 100);
					sheet.setColumnWidth(2, 100);
					sheet.setColumnWidth(3, 300);
				} //自动创建设备信息Sheet
				
				var sheetCount = spread.getSheetCount();//获取spread下sheet页的个数
				for (var i = 0; i < sheetCount; i++) {
					var sheet = spread.getSheet(i);//获取sheet对象
					var dataSource2 = new GC.Spread.Sheets.Bindings.CellBindingSource(this.taskContent);//创建数据源
					sheet.setDataSource(dataSource2);	//将数据源放到sheet中。			
					this.registeredSelectionChanged(sheet);//注册sheet的SelectionChanged事件
				}
			}			
		},
		registeredSpreadEvent:function(){//注册spreadjs的事件，在创建新的sheet时，用户可以单击输入内容
			if(this.spread){
				var self = this;
				var spread = this.spread;
				spread.bind(GC.Spread.Sheets.Events.SheetTabClick,function(sender,args){//注册spread的sheet标签页的更改事件
					if(args.sheetTabIndex === -1){//如果sheetTabIndex为-1，则为新建的sheet
						self.isNewSheet = true;
					}
				});
				spread.bind(GC.Spread.Sheets.Events.ActiveSheetChanged,function(sender,args){//注册spread选中sheet事件，如果是新sheet，则注册spreadjs的SelectionChanged事件
					if(self.isNewSheet){//判断是否新创建的sheet页
						var sheet = args.newSheet;//获取新选中的sheet
						self.registeredSelectionChanged(sheet);//注册SelectionChanged事件
						self.isNewSheet = false;//更新创建sheet状态
					}
				});
				// spread.bind(GC.Spread.Sheets.Events.InitBinding,function(sender,args){//注册spread选中sheet事件，如果是新sheet，则注册spreadjs的SelectionChanged事件
				// 	base.closeLoading();
				// });
			}
		},
		setSsjsonToSpread:function(spread,ssjson){//将ssjson初始化到spreadjs中
			if(ssjson && spread){
				spread.suspendPaint();//挂起表格绘制
				spread.fromJSON(JSON.parse(ssjson));//加载SSJSON数据
				spread.resumePaint();// 恢复表格绘制
			}
		},
		registeredSelectionChanged:function(sheet){//注册spreadjs的SelectionChanged事件
			sheet.bind(GC.Spread.Sheets.Events.SelectionChanged, function(sender, args) {
				var sheet = args.sheet;//获取sheet对象
				var selection = sheet.getSelections();//获取选中的信息
				if (selection.length === 1) {//如果选中的单元格为1，则设置为编辑状态
					sheet.startEdit(true);
				}
			});
		},
		addTerminalToSheet:function(data,isInitSheet){//向设备信息sheet页中添加设备的方法，data：设备数组，isInitSheet如果第一行有数据且该属性为true，则不插入到设备信息标签页中
			if(this.spread){
				var spread = this.spread;
				var terminalSheetIndex = spread.getSheetIndex(TERMINAL_SHEET_NAME);//获取设备信息的sheet索引
				if (terminalSheetIndex !== null && data) {
					var terminalSheet = spread.getSheet(terminalSheetIndex);//获取设备信息的sheet对象
					var rowStartCount = this.getTerminalSheetRowCount(terminalSheet);//获取数据插入的开始行
					if (isInitSheet && rowStartCount > 1) {//当前开始行大于1且是页面首次加载，则不插入到sheet中
					     return;
					}
					if(!isInitSheet){
						 spread.setActiveSheetIndex(terminalSheetIndex);
					}
					var addRowCountIndex = data.length + rowStartCount;//计算最大的添加的行
					for (var i = rowStartCount; i < addRowCountIndex; i++) {
						var rowCount =i;
						var item = data[i - rowStartCount];//获取设备信息的数据
						terminalSheet.addRows(1 + i, 1);//插入行
						terminalSheet.getCell(rowCount, 0).text(item["code"]);//设置设备编号单元格的值
						terminalSheet.getCell(rowCount, 1).text(this.formatDate(new Date()));//设置使用时间的单元格值
						terminalSheet.getCell(rowCount, 2).text(item["terminalStatus"]);//设置设备状态的单元格值
						terminalSheet.getCell(rowCount, 3).text(item["bz"]);//设置备注的单元格值
					}
				}
			}
		},
		formatDate:function(date, format){//日期格式化方法
			if (!date) return;//如果日期为空，则返回
			    if (!format) format = "yyyy-MM-dd";//format变量为空，则默认日期格式为"yyyy-MM-dd"
			    switch (typeof date) {//如果日期为别的类型，则需要将字符串或者数字类型转换为日期类型，则进行处理
			        case "string"://如果是字符串类型
			            date = new Date(date.replace(/-/, "/"));
			            break;
			        case "number"://如果是数字类型
			            date = new Date(date);
			            break;
			    }
			    if (!date instanceof Date) return;//判断当前日期是否为日期类型，如果不是则返回
			    var dict = {//定义日期的格式信息
			        "yyyy": date.getFullYear(),
			        "M": date.getMonth() + 1,
			        "d": date.getDate(),
			        "H": date.getHours(),
			        "m": date.getMinutes(),
			        "s": date.getSeconds(),
			        "MM": ("" + (date.getMonth() + 101)).substr(1),
			        "dd": ("" + (date.getDate() + 100)).substr(1),
			        "HH": ("" + (date.getHours() + 100)).substr(1),
			        "mm": ("" + (date.getMinutes() + 100)).substr(1),
			        "ss": ("" + (date.getSeconds() + 100)).substr(1)
			    };
			    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
			        return dict[arguments[0]];
			    });//返回对应格式的日期字符串
		},
		getTerminalSheetRowCount:function(sheet){//获取设备信息下无设备编号的索引
			for (var i = 1; ; i++) {
			    var cell = sheet.getCell(i, 0);//获取单元格
			    if (!cell.text()) {//判断单元格内容是否为空，如果为空则返回
			        return i;
			    }
			}
		},
		initSampleConfig:function(){//初始化样品配置下拉选项
			var sampleObject = {};
			for(var i=0;i<this.sampleInfoList.length;i++){//为了方便查询，将样品的编号设置为属性，放到object中，方便查找配置集合
				var sampleInfo = this.sampleInfoList[i];//获取样品信息
				sampleObject[sampleInfo.sampleCode] = sampleInfo.sampleConfigInfoList;//设置样品编号与配置集合的对应关系
			}
			this.sampleObject = sampleObject;//将组织好的对象放到当前app中。
			this.bindSampleConfigList();//绑定配置信息
		},
		bindSampleConfigList:function(){//绑定配置信息的下拉选项
			var sampleCode = this.recordInfo.sampleCode;//获取样品的编码
			if(sampleCode){//如果编号不为空，则将获取的配置集合放到app的属性中，进行双向绑定
				this.sampleConfigInfoList = this.sampleObject[sampleCode];
			}else{//如果编号为空，则不绑定数据
				this.sampleConfigInfoList = [];
			}
		},
		onChangesampleCode:function(){//样品下拉的change事件
			this.bindSampleConfigList();//绑定配置下拉选项
			if(this.sampleConfigInfoList && this.sampleConfigInfoList.length > 0){//配置默认值为第一个
				this.recordInfo.configName = this.sampleConfigInfoList[0].configName;
			}
			
		},
		getRecordName:function(){//获取原始记录的名称
			var name = "";
			if(this.recordInfo.templateName){//模板名称是否为空，如果不为空，则和任务编号一起拼接
				name = this.recordInfo.templateName + "-" + this.taskContent.taskCode;
			}else{
				var taskContentName = this.taskContent.name || "";
				var nameArry = taskContentName.split("-");//获取当前的name属性信息，进行截取
				name = nameArry[0];
				if(nameArry.length > 2){//如果name截取长度大于2，则进行截取拼接
					for (var i = 1; i < nameArry.length - 2; i++) {//去除最后的两个为样品和配置信息
					    name += "-" + nameArry[i];
					}
				}else{//否则直接拼写任务编号
					name = name + "-" + this.taskContent.taskCode;
				}
			}
			if (this.recordInfo.sampleCode) {//如果选中样品编码不为空，则进行拼写原始记录名称
			    name = name + "-" + this.recordInfo.sampleCode;
			    if (this.recordInfo.configName) {//如果配置不为空，则将配置加入到原始记录名称中
			        name = name + "-" + this.recordInfo.configName;
			    }
			}
			return name;//返回原始记录的name
		},
		save:function(){
			var self = this;
			var spreadJson = JSON.stringify(this.spread.toJSON({includeBindingSource: true}));//获取spreadjs的ssjson字符串
			var formData = new FormData();//创建FormData
			if(this.recordInfo.id){//将原始记录的id放到formdata中
				formData.append("id", this.recordInfo.id);
			}			
			formData.append("sampleCode", this.recordInfo.sampleCode);//将样品编码放到FormData中
			formData.append("configName", this.recordInfo.configName);//将配置名称放到FormData中
			formData.append("taskContentId", this.requestParamValues.taskContentId);//将检验项目id放到FormData中
			formData.append("name", this.getRecordName());//获取原始记录名称，并放到configName中
			var excelIo = new GC.Spread.Excel.IO();
			excelIo.save(spreadJson, function (data) {//读取excel文件
				var excelFile = new Blob([data]);//创建excle文件流
				var ssjsonFile = new Blob([spreadJson]);//创建ssjson文件流
				formData.append("ssjson", ssjsonFile);//将SSJSON文件流放到configName中
				formData.append("excel", excelFile);//将excel文件流放到configName中
				recordApi.save(formData,function(data){
					if(data != "保存成功"){
						self.recordInfo.id = data;
					}
					mui.toast('保存成功');
					self._loadObj.close();
				});//调用接口的API，进行保存操作
			},function(err){});
		},
		saveClick:function(){//保存事件
			var self = this;
			self._loadObj = plus.nativeUI.showWaiting( "保存中...", {} );
			setTimeout(function(){
				self.save();
			},0);
		},		
		selectTerminalClick:function(){//弹出设备选择列表
			mui.openWindow({
				url:"terminalList.html",
				id:"terminalList",
			});
		},
		initTouchToolStrip: function() {
			var self = this;
			var name = "DelRow";
			var text = "删除";
			self.spread.touchToolStrip.remove("wijspread_toolstrip_autofill0");//删除自动填充
			var image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAVBJREFUOBFjZACCyYu2//8PYoAAkJUX78UI4ZBB9s/bDDeLGO1M6Ir+/P2LLoSXj2HAX0oN+PP3D14byZL8UBB08nW238pP2YHCMAOeRDvIgNjg0LbP3IMz4JgYmHzWME8U+/Xrd8OfX8AQ+vOn7e/vP7F/fv1epb7++FS4Ae5+Bgw///xj+PXrH8Pvv/8Zfv0Gsv/8Z/j9+9/7u+fvxi3/1nXy56+fN/78/sP/9/c/Y/X1Ry6CXMACIkDgPxCC0gDETRAxEP8/4//zWUzrTv78/WPd3z9/rwJd8OD3rx+OQBWoBuzaBOZDdSIoVmbWAtMPV5cCnSzK95/FRFTP7dvp/SsnX3TT49bfdekrQiUe1p1wu0M3Aq2cYEquhmqz7dKWNoDxUeic+kk4AxRFIZSDkZD+/CEtHWAYQHlK/ENaXgBHY1xRKzgWQd76+480AwAVyp7Zznx5LAAAAABJRU5ErkJggg==';
			var item = new GC.Spread.Sheets.Touch.TouchToolStripItem(name, text, image, function () {
				self.spread.touchToolStrip.close();
				var sheet = self.spread.getActiveSheet();
				var selection = sheet.getSelections()[0];
				sheet.deleteRows(selection.row, 1);//删除选中行
			});//构建删除项
			self.spread.touchToolStrip.add(item);
		}//初始化触摸工具栏
	}
});
mui.init();
mui.plusReady(function() {
	base.showLoading();
	var webviewselft = plus.webview.currentWebview();
	setTimeout(function(){
		app.setRequestParamValues(webviewselft);//设置请求的参数
		app.init();	//初始化当前页面
		
	},0);
});

//监听自定义事件，用于和设备列表页面进行通信
window.addEventListener("addTerminalList", function(e) {//选中事件
	app.addTerminalToSheet(e.detail.selectTerminaList);
});





