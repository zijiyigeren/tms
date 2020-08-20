// 处理取样时间段
function getTimeRange(time) {
  if (typeof time !== 'string') {
    time = String(time);
  }
  var hh = '';
  var mm = '';
  if (time.length === 4) {
    hh = time.slice(0, 2);
    mm = time.slice(2, 4);
  }
  if (time.length === 3) {
    hh = time.slice(0, 1);
    mm = time.slice(1, 3);
  }
  if (mm === '00') {
    return hh + ':00 - ' + hh + ':30';
  }
  if (mm === '30') {
    return hh + ':30 - ' + String(Number(hh) + 1) + ':00';
  }
}
