export function timestampToTime (timestamp) {
  let date1 = new Date(timestamp)
  let Y = date1.getFullYear()
  let M = (date1.getMonth() + 1 < 10 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1)
  let D = date1.getDate()

  // h = date1.getHours() +':';
  // m = date1.getMinutes() +':';
  // s = date1.getSeconds();

  return Y + '-' + M + '-' + D
}
export function timeToTimestamp (time) {
  return Date.parse(time)
}
