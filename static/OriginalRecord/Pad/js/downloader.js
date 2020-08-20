var Downloader = {
	get: function(url, next) {
		var options = {
			method: 'GET',
			filename: '_downloads/docs/',
			timeout: 15,
			retry: 0,
		};
		function onComplete(task, status) {
			if (status === 200) {
				next(false);
				plus.runtime.openFile(task.filename, {}, function(error) {
					mui.toast('文件打开失败');
				});
			} else {
				next(false);
				mui.toast('下载失败');
			}
		}
		var dtask = plus.downloader.createDownload(url, options, onComplete);
		if (dtask) {
			next(true);
			dtask.start();
		}
	},
	clear: function() {
		plus.io.resolveLocalFileSystemURL('_downloads/docs', function(entry) {
			entry.removeRecursively();
		});
	},
};
