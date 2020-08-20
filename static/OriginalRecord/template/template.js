/**
 * 描述：
 *   URL中的参数为
 *           id（模板id）                      可选;id为空则为新建，不为空则编辑
 */
$(function () {
    var designer = GC.Spread.Sheets.Designer;//spreadjs命名空间
    var spread = designer.wrapper.spread;//获取当前页面的spread对象
    var templateInfo = null;//当前模板的对象
    $("#buttExportFile").on("click", function () {//导入按钮事件
        $("#fileExport").click();//触发隐藏的文件上传控件
    });
    var excelIo = new GC.Spread.Excel.IO();
    var importExcel = function (result) {//导入excel文件的方法
        excelIo.open(result, function (json) {
            var workbookObj = json;//获取生成的SSJSON字符串
            designer.wrapper.spread.fromJSON(workbookObj);//加载SSJSON字符串
        }, function (e) {
            // process error
            alert(e.errorMessage);
        });
    };

    var getExtension = function (fileName, detail) {//获取文件类型方法
        var pos = fileName.lastIndexOf('.');
        if (detail) {
            detail.pos = pos;
            detail.name = fileName.substr(0, pos);
        }
        return pos === -1 ? "" : fileName.substring(pos + 1).toLowerCase();
    }
    
    $("#fileExport").on("change", function () {//读取文件内容
        var files = $(this).get(0).files;//获取上传的文件信息
        if (files.length > 0) {
            var file = files[0];
            var fileName = file.name;
            var fileType = getExtension(fileName);//获取文件类型
            if (fileType != "xlsx" && fileType != "ssjson") {//如果即不是excle文件也不是ssjson文件，则不做操作
                return;
            }
            $("#tmpName").val(fileName.substring(0, fileName.lastIndexOf(".")));//设置模板名称，去掉文件后缀名称
            $("#tmpNameVerification").hide();//隐藏模板名称验证信息
            var reader = new FileReader();//创建读取文件的文件流对象
            reader.onload = function () {//文件流的加载事件
                if (fileType === "xlsx") {//如果是excle文件，则调用importExcel
                    importExcel(this.result);
                } else {
                    designer.wrapper.spread.fromJSON(JSON.parse(this.result));//如果是SSJSON文件，则直接加载json字符串
                }
            };
            switch (fileType) {
                case "xlsx"://excel文件类型
                    reader.readAsArrayBuffer(file);
                    break;
                default://ssjson文件类型
                    reader.readAsText(file);
                    break;
            }
        }
    });

    $("#tmpName").on("change", function () {//模板名称输入的更改事件，用于隐藏或者显示验证信息
        if ($("#tmpName").val()) {
            $("#tmpNameVerification").hide();
        } else {
            $("#tmpNameVerification").show();
        }
    });

    //注册保存按钮事件
    $("#butSave").on("click", function () {
        formDataBindHelper.showLoading();//弹出遮罩层
        setTimeout(function () {
            if (!templateInfo) {//模板对象是否为空
                templateInfo = {};
            }
            formDataBindHelper.getValues(templateInfo);//获取页面上的值
            if (!templateInfo.name) {//验证模板名称是否为空，如果为空，则不能保存
                $("#tmpNameVerification").show();
                formDataBindHelper.hideLoading();
                return;
            }
            var spread = designer.wrapper.spread;//获取spread对象
            var spreadJson = spreadHelper.spreadToJSON(spread);//获取spreadJS对应的ssjson字符串
            var excelIo = new GC.Spread.Excel.IO();
            excelIo.save(spreadJson, function (data) {
                var excelFile = new Blob([data]);//创建excel文件流对象
                var ssjsonFile = new Blob([spreadJson]);//ssjson文件流对象
                let formData = new FormData();//创建formdata对象
                formData.append("ssjson", ssjsonFile);//将ssjson文件流对象放到Formdata中
                formData.append("excel", excelFile);//将excel文件流对象放到Formdata中
                for (let p in templateInfo) {//将templateInfo对象中的其他属性放到fromdata中
                    if (templateInfo[p] !== undefined && templateInfo[p] !== null) {
                        formData.append(p, templateInfo[p].toString());
                    }
                }
                templateInfo["content"] = spreadJson;
                var id = templateApi.save(formData);//调用API的保存接口，并获取新的id
                if (id) {
                    templateInfo.id = id;//重置当前模板信息的id
                    formDataBindHelper.hideLoading();//取消加载层
                    $("#successMessage").show();//弹出保存成功信息。
                    if (window.opener && window.opener.refreshList) {
                        window.opener.refreshList(id);
                    }
                    setTimeout(function () {
                        $("#successMessage").hide();
                    }, 3000);//3秒后隐藏保存信息
                }
            }, function (err) {

            });
        }, 0);
        
    });
    designer.loader.ready(function () {//spreadjs的loader事件
        $("#file-menu-tab").remove();//删除spreadjs的文件tab页
        var id = requestHelper.getQueryVariable("id");//从url中获取模板的id
        if (id) {//如果模板的id不为空，则加载后台返回的数据
            var template = templateApi.getById(id);//调用API接口，获取模板信息
            if (template) {
                templateInfo = template;
                formDataBindHelper.setHtmlDataBind(template);//绑定页面上模板信息对应的控件
                
				if (!!template.content) {
					designer.wrapper.spread.fromJSON(JSON.parse(template.content)); //初始化spreadjs模板              
				}
			}
        }        
    });
});
