// 扫码
var num = Number(window.location.search ? window.location.search.substr(1) : 1);
var keepScan = num<=0 ? true : false;
var scanBtn = document.getElementById('playBtn');

var scan = null; //扫描对象
var ws=null,wo=null;
mui.init();
mui.plusReady(function() {
	// 获取窗口对象
	ws=plus.webview.currentWebview();
	wo=ws.opener();
	setTimeout(function(){
		startRecognize();
	},250)
});

function startRecognize() {
	try {
		var filter = [plus.barcode.QR, plus.barcode.EAN13, plus.barcode.EAN8, plus.barcode.CODABAR, plus.barcode.CODE128,
			plus.barcode.RSS14, plus.barcode.CODE39
		];
		//自定义的扫描控件样式
		var styles = {
			frameColor: "#29E52C",
			scanbarColor: "#29E52C",
			background: ""
		}
		//扫描控件构造
		scan = new plus.barcode.Barcode('bcid', filter, styles);
		scan.onmarked = onmarked;
		scan.onerror = onerror;
		scan.start();
		//打开关闭闪光灯处理
		var flag = false;
		document.getElementById("turnTheLight").addEventListener('tap', function() {
			if (flag == false) {
				scan.setFlash(true);
				flag = true;
			} else {
				scan.setFlash(false);
				flag = false;
			}
		});
	} catch (e) {
		mui.alert("出现错误啦:\n" + e);
	}
}

function onerror(e) {
	mui.alert(e);
}

function onmarked(type, result, file) {
	switch(type){
		case plus.barcode.QR:
		type = 'QR';
		break;
		case plus.barcode.EAN13:
		type = 'EAN13';
		break;
		case plus.barcode.EAN8:
		type = 'EAN8';
		break;
		default:
		type = '其它'+type;
		break;
	}
	result = result.replace(/\r\n/g, '');
	num--;
	if( keepScan || num>0 ){//继续扫码
		wo.evalJS("handleScanCode('"+ result +"');");
		scanBtn.style.display = 'block';
		mui.toast('点击按钮继续扫码');
	}else{
		setTimeout(function(){
			wo.evalJS("handleScanCode('"+ result +"');");
		},50);
		ws.close('auto');
	}
}

// 从相册中选择二维码图片
function scanPicture() {
	plus.gallery.pick(function(path) {
		plus.barcode.scan(path, onmarked, function(error) {
			plus.nativeUI.alert("无法识别此图片");
		});
	}, function(err) {
		//plus.nativeUI.alert("Failed: " + err.message);
	});
}
function startScanAgain(){
	scan.start();
	scanBtn.style.display = 'none';
}