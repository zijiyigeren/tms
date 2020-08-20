/**
 * 原始记录的接口对象
 * 方法：
 *  getById：根据原始记录id，获取原始记录数据
 *  getBaseInfo：根据检验项目的id，获取检验项目的信息
 *  save：保存原始记录
 *  searchTerminal：查询设备数据记录
 */
var recordApi = {};

/****
* 根据原始记录id，获取原始记录数据
* 参数：
*   id：原始记录id
*/
recordApi.getById = function (id) {
    var retuData;
    $.ajax({
        url: baseUrl+"/api/TaskReport/" + id,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (successData) {
            retuData = successData.data;
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
    return retuData;
};

/****
* 根据检验项目的id，获取检验项目的信息
* 参数：
*   taskContentId：检验项目id
*/
recordApi.getBaseInfo = function (taskContentId) {
    var retuData;
    $.ajax({
        url: baseUrl +"/api/TaskReport/getBaseInfo/" + taskContentId,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (successData) {
            retuData = successData.data;
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
    return retuData;
};

/****
* 保存原始记录
* 参数：
*   fromData：保存的表单信息，包括SSJSON、Excel文件流等信息
*/
recordApi.save = function (fromData) {
    var retuData;
    $.ajax({
        url: baseUrl + "/api/TaskReport/originalOnline/online",
        type: "POST",
        data: fromData,
        async: false,
        contentType: false,
        processData: false,
        success: function (successData) {
            retuData = successData.data;
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
    return retuData;
};

/****
* 根据检验项目的id，获取检验项目的信息
* 参数：
*   data：查询参数。例如：{
                        currentPage: 1,//当前页码
                        page: true,//是否分页
                        pageSize: 10,//每页条数
                        code: "111",//设备编号
                        model: "",//设备型号
                        name: ""//设备名称
                    }
*/
recordApi.searchTerminal = function (data) {
    var retuData;
    $.ajax({
        url: baseUrl + "/api/Termianl/searchTerminal",
        type: "POST",
        async: false,
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (successData) {
            if (successData.ok) {
                retuData = successData.data.terminal;
            } else {
                throw message;
            }

        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
    return retuData;
};

