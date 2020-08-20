var VersionTool = (function(){
	var wgtVer=null;
	// 检测更新地址
	var checkUrl=base.config.url+"/version/checkVersion";
	// 下载wgt文件路径
	var wgtUrl= base.config.url+ "/version/downloadFile";
	
	function checkUpdate(){
		plus.nativeUI.showWaiting("检测更新...");
		var xhr=new XMLHttpRequest();
		xhr.timeout = 5000;
		xhr.onreadystatechange=function(){
			switch(xhr.readyState){
				case 4:
				plus.nativeUI.closeWaiting();
				if(xhr.status==200){
					console.log("检测更新成功："+xhr.responseText);
					var newVer=JSON.parse(xhr.responseText).data;

					// 版本号每一位比大小
					var wgtVerArr = wgtVer.split('.');
					var newVerArr = newVer.split('.');
					var length = wgtVerArr.length > newVerArr.length ? wgtVerArr.length : newVerArr.length;
					var needUpgrade = false;
					for (var i = 0; i < length; i++) {
						if (!!wgtVerArr[i] && !!newVerArr[i]) {
							if (parseInt(wgtVerArr[i]) < parseInt(newVerArr[i])) {
								needUpgrade = true;
								break;
							}
							if (parseInt(wgtVerArr[i]) > parseInt(newVerArr[i])) {
								break;
							}
						} else {
							if (!wgtVerArr[i] && !!newVerArr[i]) {
								needUpgrade = true;
							}
						}
					}
					if (needUpgrade) {
						wgtUrl = wgtUrl+'?version='+newVer;
						downWgt();  // 下载升级包
					}
			}else{
					console.log("检测更新失败！");
					mui.toast("检测更新失败！");
					for(var i in xhr){
						console.error(i+xhr[i])
					}
				}
				break;
				default:
				break;
			}
		}
		plus.runtime.getProperty(plus.runtime.appid,function(inf){
			wgtVer=inf.version;
			console.log("当前应用版本："+wgtVer);
			xhr.open('POST',checkUrl);
			xhr.send();
		});
	}
	
	function downWgt(){
		plus.nativeUI.showWaiting("下载更新资源...");
		plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
			if ( status == 200 ) { 
				console.log("下载更新成功："+d.filename);
				plus.nativeUI.alert("更新资源下载完成，请重启APP.",function(){
					installWgt(d.filename); // 安装wgt包
				});
			} else {
				console.log("下载更新失败！");
				plus.nativeUI.alert("下载更新失败！");
			}
			plus.nativeUI.closeWaiting();
		}).start();
	}
	// 更新应用资源
	function installWgt(path){
		plus.nativeUI.showWaiting("正在安装更新...");
		plus.runtime.install(path,{},function(){
			plus.nativeUI.closeWaiting();
			console.log("安装文件成功！");
			plus.nativeUI.alert("应用资源更新完成！",function(){
				plus.runtime.restart();
			});
		},function(e){
			plus.nativeUI.closeWaiting();
			console.log("安装更新文件失败["+e.code+"]："+e.message);
			plus.nativeUI.alert("安装更新失败["+e.code+"]："+e.message);
		});
	}
	
	return {
		checkUpdate: checkUpdate
	}
})();