/**
 * 描述：
 *   URL中的参数为
 *           id（原始记录id）                      可选（与templateId任选其一）;
 *           templateId（模板id）                  可选（与id任选其一）;
 *           taskContentId（检验项目id）           必须
 * 页面下自定义的对象（在window下可以获取到的对象）说明：
 *      recordControllerPage：页面对象，主要承载页面上的方法或者事件
 *      recordApi：原始记录接口API对象，提供接口方法
 *      templateApi：模板接口API对象，提供接口方法
 *      requestHelper：请求帮助对象，承载通用的请求的方法
 *      formDataBindHelper：表单帮助对象，承载表单中的通用方法
 *      spreadHelper：spreadjs帮助对象，承载spread的一些常用方法
 */

/***
* recordControllerPage页面对象，主要承载页面上的方法或者事件
* 属性：
*   taskContent：检验项目数据对象
*   templateInfo：模板数据对象
*   requestParamValues：请求参数对象，存储URL中的参数
*   terminalGrid：设备列表中Grid元素id
*   terminalGridJQuery：设备列表中Grid的Jquery对象
*   isLoadTerminal：是否第一次加载设备信息，如果第一次，需要创建设备列表对象
* 方法：
*   getTerminalSheetRowCount：查找sheet中第一列为空所在的行
*   addTerminalToSheet：设备信息标签的sheet中添加数据
*   sampleInfoObject：处理样品与配置的数组关系的方法
*   bindConfigNameData：绑定配置下拉选项
*   closeDiv：关闭弹出层
*   showDiv:显示弹出层
*   initTerminalGrid:初始化设备列表
*   searchClick：设备查询事件
*   resetClick：设备重置事件
*   selectTerminalData：设备选择插入到设备信息的sheet标签页中
*   save：保存方法
*/
const TERMINAL_SHEET_NAME = "设备信息";
var recordControllerPage = {};//页面对象，主要承载页面上的方法或者事件
$(function () {        
    var requestParamValues = {};//URL参数对象
    var spread;//spreadjs的Workbook对象
    var recordInfo;//原始记录的数据对象
    var templateInfo;//模板的数据对象

    //关闭弹出层
    recordControllerPage.closeDiv = function (show_div, bg_div) {
        document.getElementById(show_div).style.display = 'none';
        document.getElementById(bg_div).style.display = 'none';
    }

    //显示弹出层
    recordControllerPage.showDiv = function (show_div, bg_div, width, height) {
        document.getElementById(show_div).style.display = 'block';
        document.getElementById(bg_div).style.display = 'block';
        var bgdiv = document.getElementById(bg_div);
        bgdiv.style.width = document.body.scrollWidth;
        $("#" + bg_div).height($(document).height());
        var left = ($(document).width() - width) / 2;//计算弹出层居左的距离
        var top = ($(document).height() - height) / 2;//计算弹出层居上的距离
        $("#" + show_div).css("top", top);//设置弹出层居上的距离
        $("#" + show_div).css("left", left);//设置弹出层居左的距离
        $("#" + show_div).height(height);//设置弹出层的高度
        $("#" + show_div).width(width);//设置弹出的宽度
    }
    $("#btnImageImport").on("click", function () {//图片导入事件
        $("#imageImport").click();//调用文件上传控件
    });
    $("#imageImport").on("change", function () {//图片更改事件
        var files = $(this).get(0).files;//获取选中的文件
        if (files.length > 0) {//判断文件数组的长度
            var file = files[0];
            spreadHelper.addPicture(spread,file);//调用spread插入图片的帮助方法
        }    
        $("#imageImport").val("");//清空选中的文件
    });
    requestParamValues.id = requestHelper.getQueryVariable("id");//获取原始记录的id
    requestParamValues.templateId = requestHelper.getQueryVariable("templateId");//获取原始记录的id
    requestParamValues.taskContentId = requestHelper.getQueryVariable("taskContentId");//获取原始记录的id
    if (!requestParamValues.taskContentId) {//检验项目id为必须参数，如果为空则报错
        $("#container").html("错误：缺少【检验项目id】参数！");
        return;
    }
    if (!requestParamValues.id && !requestParamValues.templateId) {
        $("#container").html("错误：缺少【原始记录的id】或者【原始记录模板id】参数！");
        return;
    }
    var taskContent = recordApi.getBaseInfo(requestParamValues.taskContentId); //获取检验项目的数据 
    if (!taskContent) {
        alertErrorInfo.showError("数据问题，错误如下：<br>没有获取id为【" + requestParamValues.taskContentId+"】检验项目信息！");
    }
    var ssjson;//spreadjs的ssjson字符串对象
    if (requestParamValues.id) {//如果原始记录id不为空，则从原始记录中获取ssjson字符串
        recordInfo = recordApi.getById(requestParamValues.id);//获取原始记录数据信息
        if (!recordInfo) {
            alertErrorInfo.showError("数据问题，错误如下：没有获取id为【" + requestParamValues.id + "】原始记录信息信息！");
            return;
        }
        taskContent = jQuery.extend(taskContent, recordInfo);//将原始记录数据放到检验项目的数据中。
        ssjson = recordInfo.content;//获取ssjson数据
    } else if (requestParamValues.templateId){//如果模板id不为空
        templateInfo = templateApi.getById(requestParamValues.templateId);//获取模板信息
        ssjson = templateInfo.content;//获取模板的ssjson字符串
    }

    recordControllerPage.taskContent = taskContent;
    recordControllerPage.templateInfo = templateInfo;
    recordControllerPage.requestParamValues = requestParamValues;

    //查找sheet中第一列为空所在的行
    recordControllerPage.getTerminalSheetRowCount = function (sheet) {
        for (var i = 1; ; i++) {
            var cell = sheet.getCell(i, 0);
            if (!cell.text()) {
                return i;
            }
        }
    }

    //设备选择列表的id
    recordControllerPage.terminalGrid = "terminalGrid";

    //设备选择列表的Jquery对象
    recordControllerPage.terminalGridJQuery = $("#terminalGrid");

    //设备信息标签的sheet中添加数据
    recordControllerPage.addTerminalToSheet = function (data,isInitSheet) {	
        if (recordControllerPage.spread) {
            var terminalSheetIndex = spread.getSheetIndex(TERMINAL_SHEET_NAME);
            if (terminalSheetIndex !== null && data) {
                var terminalSheet = spread.getSheet(terminalSheetIndex);
                if (!isInitSheet) {
                    spread.setActiveSheetIndex(terminalSheetIndex);
                }				
                var rowStartCount = recordControllerPage.getTerminalSheetRowCount(terminalSheet);
                if (isInitSheet && rowStartCount > 1) {
                    return;
                }
                var addRowCountIndex = data.length + rowStartCount;
                for (var i = rowStartCount; i < addRowCountIndex; i++) {
                    var rowCount =i;
                    var item = data[i - rowStartCount];
                    terminalSheet.addRows(1 + i, 1);
                    terminalSheet.getCell(rowCount, 0).text(item["code"]);
                    terminalSheet.getCell(rowCount, 1).text(formDataBindHelper.formatDate(new Date()));
                    terminalSheet.getCell(rowCount, 2).text(item["terminalStatus"]);
                    terminalSheet.getCell(rowCount, 3).text(item["bz"]);
                }
            }
        }
    }
    
    if (ssjson) {
        spread = new GC.Spread.Sheets.Workbook(document.getElementById("container"), {
            sheetCount: 1
        });
        spread.fromJSON(JSON.parse(ssjson));
        recordControllerPage.spread = spread;
        var sheetCount = spread.getSheetCount();
        for (var i = 0; i < sheetCount; i++) {
            var sheet = spread.getSheet(i);
            var sheetDataSource = {};
            dataSource2 = new GC.Spread.Sheets.Bindings.CellBindingSource(taskContent);
            sheet.setDataSource(dataSource2);
        }
		
		var terminalSheet = spread.getSheetFromName(TERMINAL_SHEET_NAME);
		if(!terminalSheet) {
			var sheet = new GC.Spread.Sheets.Worksheet();
			sheet.name(TERMINAL_SHEET_NAME);
			spread.addSheet(sheetCount, sheet);
			sheet.setValue(0, 0, "编号");
			sheet.setValue(0, 1, "使用时间");
			sheet.setValue(0, 2, "状态");
			sheet.setValue(0, 3, "备注");
			sheet.setColumnWidth(0, 200);
			sheet.setColumnWidth(1, 100);
			sheet.setColumnWidth(2, 100);
			sheet.setColumnWidth(3, 300);
		} //自动创建设备信息Sheet
        recordControllerPage.addTerminalToSheet(taskContent.terminalList, true);       
    } else {
        alertErrorInfo.show("数据属性问题，错误如下：<br>该原始数据【id为" + requestParamValues.id+"】的SSJSON字符串为空");
    }

    //处理样品与配置的数组关系的方法
    recordControllerPage.sampleInfoObject = function (taskContent) {
        if (!recordControllerPage._sampleInfoObject) {
            var dataList = taskContent.sampleInfoList;
            var dataObject = {};
            for (var i = 0; i < dataList.length; i++) {
                var dataItem = dataList[i];
                dataItem["selectText"] = dataItem["model"] ? dataItem["model"] : dataItem["vin"];
                dataObject[dataItem.sampleCode] = dataItem;
            }
            recordControllerPage._sampleInfoObject = dataObject;
        }
        return recordControllerPage._sampleInfoObject;
        
    }

    //设置样车和配置的下拉选项
    $("#sampleCode").on("change", function () {
        recordControllerPage.bindConfigNameData($("#sampleCode").val());
    });
    recordControllerPage.sampleInfoObject(taskContent);//处理样品与配置的数组关系，能够通过样品编码获取到配置列表

    //绑定配置下拉选项
    recordControllerPage.bindConfigNameData = function (sampleCode) {
        var sampleInfoObject = recordControllerPage.sampleInfoObject();//获取当前样品的信息
        //更新配置下拉选项信息
        formDataBindHelper.bindDataToSelect($("#configName"), sampleInfoObject[sampleCode].sampleConfigInfoList, "configName", "configName");
    }

    formDataBindHelper.bindDataToSelect($("#sampleCode"), taskContent.sampleInfoList, "selectText", "sampleCode"); //绑定样品的下拉菜单
    var sampleCode = taskContent.sampleCode || (taskContent.sampleInfoList && taskContent.sampleInfoList.length > 0 ? taskContent.sampleInfoList[0].sampleCode : null);//获取样品选中的值
    if (sampleCode) {
        $("#sampleCode").val(sampleCode);//设置样品值
        recordControllerPage.bindConfigNameData(sampleCode);//绑定配置下拉选项
    }   
    formDataBindHelper.setHtmlDataBind(taskContent, $("#formRecord"), false);//绑定form表单的数据


    recordControllerPage.isLoadTerminal = false;//是否第一次加载设备信息，如果第一次，需要创建设备列表对象

    //初始化设备列表
    recordControllerPage.initTerminalGrid = function () {
        if (!recordControllerPage.isLoadTerminal) {//是否初始化设备列表
            recordControllerPage.terminalGridJQuery.flexigrid({
                url: function (params) {
                    var page =  params[0].value;
                    var ajaxOption = {//调用接口方法，获取设备的列表数据
                        currentPage: page,
                        page: true,
                        pageSize: 10,
                        code: params.code,
                        model: params.model,
                        name: params.name,
                    };
                    formDataBindHelper.getValues(ajaxOption, $("#terminalSearch"));//获取查询参数值
                    var data = recordApi.searchTerminal(ajaxOption);
                    formDataBindHelper.hideLoading();
                    return { rows: data.list, page: page, total: data.total };
                },
                dataType: 'json',
                nomsg: '没有符合条件的记录存在',
                colResize:false,
                resizable: false,
                isChecked: true,
                rpOptions: false,// 可选择设定的每页结果数 
                pagetext: '当前',
                outof: '页，总页数',
                colModel: [{
                    display: '设备编号',
                    name: 'code',
                    width: 227,
                    sortable: false,
                    align: 'left'
                }, {
                    display: '设备型号',
                    name: 'model',
                    width: 227,
                    sortable: false,
                    align: 'left'
                }, {
                    display: '设备名称',
                    name: 'name',
                    width: 227,
                    sortable: false,
                    align: 'left'
                }, {
                    display: '所属科室',
                    name: 'useDepartment',
                    width: 227,
                    sortable: false,
                    align: 'left'
                }],
                buttons: false,
                searchitems: false,
                usepager: true,
                title: false,
                useRp: false,
                rp: 10,
                showTableToggleBtn: false,
                showToggleBtn: false,
                height: 292
            });
            recordControllerPage.isLoadTerminal = true;
        } else {
            formDataBindHelper.hideLoading();
        }
    }

    //设备列表查询的事件
    recordControllerPage.searchClick = function () {
        recordControllerPage.refreshTerminalGrid();
    }

    //设备列表重置事件
    recordControllerPage.resetClick = function () {
        formDataBindHelper.setHtmlDataBind({ code: null, name: null, model:null}, $("#terminalSearch"),true);//清空查询控件
        recordControllerPage.refreshTerminalGrid();//刷新设备列表
    }

    //设备列表刷新方法
    recordControllerPage.refreshTerminalGrid = function () {
        var table = recordControllerPage.terminalGridJQuery;//获取table对象
        var query = {};
        formDataBindHelper.getValues(query, $("#terminalSearch"));//获取查询参数值
        //table.GM("setQuery", query);//设置查询参数
        table.flexSearch();//刷新设备列表数据
    }

    recordControllerPage.selectTerminalData = function () {//设备确定按钮的事件
        var table = recordControllerPage.terminalGridJQuery;
        var selectData = table.getCheckData();//选中的数据        
        recordControllerPage.addTerminalToSheet(selectData);//将选中的数据插入到设备信息的标签页中
        recordControllerPage.closeDiv('terminalDiv', 'fade');//关闭弹出层
    }

    //保存方法
    recordControllerPage.save = function () {
        formDataBindHelper.showLoading();//弹出保存遮罩
        setTimeout(function () {
            var saveData = {};
            saveData.id = recordControllerPage.requestParamValues.id;//获取原始记录的id
            saveData.taskContentId = recordControllerPage.requestParamValues.taskContentId;//获取检验项目的id
            formDataBindHelper.getValues(saveData, $("#formRecord"));//获取表单中输入的数据
            var spread = recordControllerPage.spread;
            var spreadJson = spreadHelper.spreadToJSON(spread);//获取spreadjs的SSJSON字符串
            var excelIo = new GC.Spread.Excel.IO();
            /****************************拼写原始记录的name属性 开始*************************************/
            if (recordControllerPage.templateInfo) {//如果模板不为空，则重新拼写name信息
                saveData.name = recordControllerPage.templateInfo.name + "-" + recordControllerPage.taskContent.taskCode;
            } else if (recordControllerPage.taskContent.templateName) {//如果有模板名称，则获取模板信息
                saveData.name = recordControllerPage.taskContent.templateName + "-" + recordControllerPage.taskContent.taskCode;
            }else {
                var taskContentName = recordControllerPage.taskContent.name || "";
                var nameArry = taskContentName.split("-");//获取当前的name属性信息，进行截取
                saveData.name = nameArry[0];
                for (var i = 1; i < nameArry.length - 2; i++) {//去除最后的两个为样品和配置信息
                    saveData.name += "-" + nameArry[i];
                }
            }
            if (saveData.sampleCode) {//如果选中样品编码不为空，则进行拼写原始记录名称
                saveData.name = saveData.name + "-" + saveData.sampleCode;
                if (saveData.configName) {//如果配置不为空，则将配置加入到原始记录名称中
                    saveData.name = saveData.name + "-" + saveData.configName;
                }
            }
             /****************************拼写原始记录的name属性 结束*************************************/
            excelIo.save(spreadJson, function (data) {
                var excelFile = new Blob([data]);//创建excel文件流
                var ssjsonFile = new Blob([spreadJson]);//创建ssjson文件流
                let formData = new FormData();//创建表单数据
                formData.append("ssjson", ssjsonFile);
                formData.append("excel", excelFile);
                for (let p in saveData) {//将saveData中的数据放入到formData对象中
                    if (p == "content") {
                        continue;
                    }
                    if (saveData[p] !== undefined && saveData[p] !== null) {
                        formData.append(p, saveData[p].toString());
                    }
                }
                var id = recordApi.save(formData);//调用保存的API接口
                if (id) {
                    recordControllerPage.requestParamValues.id = id;//重置请求的id
                    $("#successMessage").show();//显示保存成功提示
                    formDataBindHelper.hideLoading();//隐藏遮罩层
                    if (window.opener && window.opener.refreshList) {
                        window.opener.refreshList();
                    }
                    setTimeout(function () {//3秒后隐藏保存成功提示
                        $("#successMessage").hide();
                    }, 3000);
                }
               
            }, function (err) {

            });
        }, 0);
    }

    //保存事件
    $("#btnSave").on("click", function () {
        /*********************保存的验证信息 验证【设备信息】和【基础信息】标签是否存在 开始*********************************/
        var sheetCount = spread.getSheetCount();//获取spreadjs中的sheet个数
        var isNoHaveTerminal = false;//是否有设备信息
        var isNoHaveBaseInfo = false;//是否有基础信息
        var isNoHaveTerminal = spread.getSheetIndex(TERMINAL_SHEET_NAME) == null ? true : false;
        var isNoHaveBaseInfo = spread.getSheetIndex("基础信息") == null ? true : false;
        if (isNoHaveTerminal && isNoHaveBaseInfo) {//设备信息和基础信息都不存在的提示
            $("#alertMessage").html("缺少【基础信息】和【设备信息】Sheet页，仍然要保存吗？");
            recordControllerPage.showDiv('verificationDiv', 'fade',420,170);
            return;
        }
        if (isNoHaveBaseInfo) {//基础信息不存在的提示
            $("#alertMessage").html("缺少【基础信息】Sheet页，仍然要保存吗？");
            recordControllerPage.showDiv('verificationDiv', 'fade', 420, 170);
            return;
        }
        if (isNoHaveTerminal) {//设备信息不存在的提示
            $("#alertMessage").html("缺少【设备信息】Sheet页，仍然要保存吗？");
            recordControllerPage.showDiv('verificationDiv', 'fade', 420, 170);
            return;
        }
        /*********************保存的验证信息 结束*********************************/
        recordControllerPage.save();//验证通过后，调用保存方法
    });

    $("#btnSelectTerminal").on("click", function () {//选择设备列表按钮事件
        formDataBindHelper.showLoading();
        recordControllerPage.initTerminalGrid();//初始化设备列表
        var table = recordControllerPage.terminalGridJQuery;
        table.clearCheck();
        recordControllerPage.showDiv('terminalDiv', 'fade', 1000, 495);//弹出设备列表层
    });

    $("#fade").on("click", function () {//弹出层的事件，用于关闭弹出层
        recordControllerPage.closeDiv('terminalDiv', 'fade');
        recordControllerPage.closeDiv('verificationDiv', 'fade');
    });
    $("#btnOK").on("click", function () {//设备选择层的确定按钮的事件
        recordControllerPage.selectTerminalData();
    });

    $("#btnCancel").on("click", function () {//设备列表层的取消按钮的事件
        recordControllerPage.closeDiv('terminalDiv', 'fade')
    });
    $("#btnCommit").on("click", function () {//验证弹出层的确定按钮
        recordControllerPage.closeDiv('verificationDiv', 'fade');
        recordControllerPage.save();
    });
    $("#btnBack").on("click", function () {//验证弹出层的取消按钮
        recordControllerPage.closeDiv('verificationDiv', 'fade');
    });
    $("#btnSearch").on("click", function () {//设备选择层的查询按钮的事件
        recordControllerPage.searchClick();
    });
    $("#btnReset").on("click", function () {//设备选择层的重置按钮的事件
        recordControllerPage.resetClick();
    });
    formDataBindHelper.hideLoading();//取消加载层
   
});






