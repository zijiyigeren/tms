/**
 * 描述：
 *   URL中的参数为
 *           id（原始记录id）                      必须;
 *           taskContentId（检验项目id）           必须
 *
 */
var recordControllerPage = {};
$(function () {    
    //获取参数
    var requestParamValues = {};
    var spread;
    var recordInfo;
    var templateInfo;   
    requestParamValues.id = requestHelper.getQueryVariable("id");//获取原始记录的id
    requestParamValues.taskContentId = requestHelper.getQueryVariable("taskContentId");//获取原始记录的id
    if (!requestParamValues.taskContentId) {
        $("#container").html("错误：缺少【检验项目id】参数！");
        return;
    }
    var taskContent = recordApi.getBaseInfo(requestParamValues.taskContentId);  //获取检验项目的数据 
    var ssjson;
    if (requestParamValues.id) {//如果原始记录id不为空，则从原始记录中获取ssjson字符串
        recordInfo = recordApi.getById(requestParamValues.id);//获取原始记录数据信息
        taskContent = jQuery.extend(taskContent, recordInfo);//将原始记录数据放到检验项目的数据中。
        ssjson = recordInfo.content;//获取ssjson数据
    }
    recordControllerPage.taskContent = taskContent;
    recordControllerPage.requestParamValues = requestParamValues;

    var dataList = taskContent.sampleInfoList;
    for (var i = 0; i < dataList.length; i++) {
        var dataItem = dataList[i];
        if (taskContent["sampleCode"] == dataItem["sampleCode"]) {
            taskContent["sampleTextValue"] = dataItem["model"] ? dataItem["model"] : dataItem["vin"];
        }
    }

    if (ssjson) {
        spread = new GC.Spread.Sheets.Workbook(document.getElementById("container"), {
            sheetCount: 1,
            tabEditable: false
        });
        spread.fromJSON(JSON.parse(ssjson));
        spread.contextMenu.menuData = [];//禁用spreadjs右键功能
        recordControllerPage.spread = spread;
        var sheetCount = spread.getSheetCount();
        for (var i = 0; i < sheetCount; i++) {
            var sheet = spread.getSheet(i);
            sheet.options.isProtected = true;
        }
		
		spread.options.newTabVisible = false;
		spread.options.tabEditable = false;
    }
    formDataBindHelper.setHtmlDataBind(taskContent);    
    formDataBindHelper.hideLoading();
});




