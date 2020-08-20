// 下载并打开文档
function downloadDoc(url, next) {
  var options = {
    method: 'GET',
    filename: '_downloads/docs/',
    timeout: 15,
    retry: 0
  };
  function onComplete(task, status) {
    if (status === 200) {
      next(false);
      plus.io.resolveLocalFileSystemURL(task.filename, function(entry) {
        plus.runtime.openFile(entry.fullPath, function(error) {
          mui.alert('error');
        });
      });
    } else {
      next(false);
    }
  }
  var dtask = plus.downloader.createDownload(url, options, onComplete);
  if (dtask) {
    next(true);
    dtask.start();
  }
}

// 清空文档
function clearDoc() {
  plus.io.resolveLocalFileSystemURL('_downloads/docs', function(entry) {
    entry.removeRecursively();
  });
}
