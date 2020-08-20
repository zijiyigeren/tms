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
    $.ajax({
        url: baseUrl +"/api/sys/recordTemplate/" + id,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (successData) {
            retuData = successData.data;
        }
    });
    return retuData;
}

/****
* 保存原始记录模板信息
* 参数：
*   fromData：保存的表单信息，包括SSJSON、Excel文件流等信息
*/
templateApi.save = function (fromData) {//后台服务保存
    var retuData;
    $.ajax({
        url: baseUrl +"/api/sys/recordTemplate/save",
        type: "POST",
        data: fromData,
        async: false,
        contentType: false,
        processData: false,
        success: function (successData) {
            retuData = successData.data;
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
    return retuData;
}