(function(doc,win){
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'riseze',
		recalc = function(){
			var clientWidth = docEl.clientWidth;
			if(!clientWidth){
				clientWidth=361;
			}
			docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
		};
	recalc();
	if(!doc.addEventListener) return;
	win.addEventListener(resizeEvt,recalc,false);
	doc.addEventListener('DOMContentLoaded',recalc,false);
})(document,window);


mui.init();
var userInfo = "";
var isMessageOn = false;
var app = new Vue({
	el: '#app',
	data: {
		tel: 'userInfo.usname',
		email: '',
		name: "usname",
		work: '道路试验科 科长',
	},
});
mui.plusReady(function() {

	userInfo = JSON.parse(plus.storage.getItem('userInfo'));
	isMessageOn = plus.storage.getItem('message_' + userInfo.account) === '0' ? false : true;
	if (userInfo.limsName == "" || userInfo.limsName == null) {
		app.name = userInfo.sampleName;
	} else {
		app.name = userInfo.limsName;
	}

	app.tel = userInfo.limsMember && userInfo.limsMember.mobile ? userInfo.limsMember.mobile : "未录入";
	app.email = userInfo.limsMember && userInfo.limsMember.mail1 ? userInfo.limsMember.mail1 : "未录入";

	mui('.msg-chg').on('tap', '#quit-btn', function() {

		if (mui.os.plus) {
			plus.nativeUI.confirm("此操作将清除缓存并退出登录", function(e) {
				//索引值为0，即点击的是第一个按钮。触发事件
				if (e.index == 0) {
					base.logout();
				}
			}, "退出登录?", ["确定", "取消"]);
		}
	});


	document.getElementById("mySwitch").addEventListener("toggle", function(event) {
		if (event.detail.isActive) {
			// plus.storage.setItem('message', '1');
			plus.storage.setItem('message_' + userInfo.account, '1');
			mui.toast('开启消息通知');
			plus.webview.currentWebview().opener().evalJS('initMessageBtn();');
			plus.webview.currentWebview().opener().evalJS('findMessages();');

			//返回true,继续页面关闭逻辑
			return true;
			//});
		} else {
			// plus.storage.setItem('message', '0');
			plus.storage.setItem('message_' + userInfo.account, '0');
			mui.toast('关闭消息通知');
			plus.webview.currentWebview().opener().evalJS('initMessageBtn();');

			//返回true,继续页面关闭逻辑
			return true;
			//});
		}
	});


});