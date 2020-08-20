/**
 * 原始记录模板接口对象
 * 方法：
 *  getById：根据原始记录id，获取原始记录模板数据
 *  save：保存原始记录模板信息
 */
var templateApi = {};


/****
* 根据原始记录模板id，获取原始记录模板数据
* 参数：
*   id：原始记录模板id
*/
templateApi.getById = function (id) {//后台服务根据模板id获取模板信息
    var retuData;
    retuData = requestHelper.get("/api/sys/recordTemplate/" + id, null, false);
    return retuData;
}

/****
* 保存原始记录模板信息
* 参数：
*   fromData：保存的表单信息，包括SSJSON、Excel文件流等信息
*/
templateApi.save = function (fromData) {//后台服务保存
    var retuData;
    retuData = requestHelper.post("/api/sys/recordTemplate/save", fromData, false, null, { contentType: false, processData: false});
    return retuData;
}