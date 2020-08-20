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
    retuData = requestHelper.get("/api/TaskReport/" + id,null,false);
    return retuData;
};

/****
* 根据检验项目的id，获取检验项目的信息
* 参数：
*   taskContentId：检验项目id
*/
recordApi.getBaseInfo = function (taskContentId) {
    var retuData;
    retuData = requestHelper.get("/api/TaskReport/getBaseInfo/" + taskContentId, null, false);
    return retuData;
};

/****
* 保存原始记录
* 参数：
*   fromData：保存的表单信息，包括SSJSON、Excel文件流等信息
*/
recordApi.save = function (fromData) {
    var retuData;
    retuData = requestHelper.post("/api/TaskReport/originalOnline/online", fromData, false, null, { contentType: false, processData: false });
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
    retuData = requestHelper.post("/api/Termianl/searchTerminal", JSON.stringify(data), false, "json", { contentType: 'application/json' });
    return retuData.terminal;
};

