var baseUrl = "";//后端访问的域名或者ip+端口号

/**
* 请求的帮助对象
* 方法如下：
*   getQueryVariable：从URL地址中获取参数信息
*/
var requestHelper = {};

/***
* 从URL地址中获取参数信息
* 参数说明：
*   variable：参数名称
*/
requestHelper.getQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    if (query) {
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
    }
    return undefined;
}

requestHelper.get = function (url, param, async, dataType, success, error) {
    var returnData;
    async = async === undefined || async === null ? false : async;
    dataType = dataType ? dataType : "json";
    var returnData = requestHelper.$ajax(url, {
        type: "GET",
        async: async,
        dataType: dataType
    }, success, error);
    if (!async) {
        return returnData;
    }
}

requestHelper.post = function (url, param, async, dataType,otherOption, success, error) {
    var returnData;
    async = async === undefined || async === null ? false : async;
    dataType = dataType === undefined ? "json" : dataType;
    var option = {
        type: "POST",
        async: async,
        data: param,
        dataType: dataType
    };
    var option = $.extend(option, otherOption);
    var returnData = requestHelper.$ajax(url, option, success, error);
    if (!async) {
        return returnData;
    }
}

requestHelper.$ajax = function (url, ajaxOption, success,error) {
    var retuData;
    if (url.indexOf("http") < 0) {
        url = baseUrl + url;
    }
    if (url.indexOf("?") < 0) {
        url += "?" + (new Date).getTime();
    } else {
        url += "&" + (new Date).getTime();
    }
    var defaultOption = {
        url: url,
        async: true,
        success: function (successData) {
            if (successData.ok) {
                if (success) {
                    success(successData.data);
                } else {
                    retuData = successData.data;
                }
            } else {
                alertErrorInfo.showError("网络请求失败，错误如下：<br>" + successData.message);
                throw successData.message;
            }
        },
        error: function (e) {//TODO:根据错误类型，可能需要重定向到登录页面
            alertErrorInfo.showError("网络请求失败，错误如下：<br>" + e.statusText);
            throw e.statusText;
            if (error) {
                error(e);
            }
        }
    };
    var ajaxOption = $.extend(defaultOption, ajaxOption);
    $.ajax(ajaxOption);
    return retuData;
}

/**
* 表单帮助对象
* 方法如下：
*   setHtmlDataBind：将model中属性值绑定到控件上
*   getValues：获取form中绑定的值
*   bindDataToSelect：绑定select控件的下拉选项
*   showLoading：显示遮罩层
*   hideLoading: 隐藏遮罩层
*   formatDate:格式化日期
*/
var formDataBindHelper = {};//表单帮助类

/***
* 将model中属性值绑定到控件上
* data ：数据
* area ：可选，绑定数据的区域
* isSetNull：可选，是否将空值放到组件上，true为将空值放到组件上
*/
formDataBindHelper.setHtmlDataBind = function (data, area,isSetNull) {
    if (!area) {//如果区域为空，则设置当前页面为区域
        area = document.body;
    }
    if (data) {
        $("[data-binding]", area).each(function () {//获取区域内设置了data-binding属性的元素
            var fieldName = $(this).attr("data-binding");//获取data-binding属性的值，即model中的属性
            if (fieldName && data.hasOwnProperty(fieldName)) {//判断model中是否包含该属性，如果包含，则设置值
                switch ($(this).context.nodeName) {
                    case "LABEL"://设置label元素的值
                        if (data[fieldName]) {//判断属性的值是否为空
                            $(this).text(data[fieldName]);//设置控件的值
                        } else {
                            $(this).text("");//将控件值设置为空
                        }
                        break;
                    default://设置默认元素的值
                        if (data[fieldName]) {//判断属性的值是否为空
                            $(this).val(data[fieldName]);
                        } else {
                            if (isSetNull) {//空值是否设置到控件上
                                $(this).val("");//将控件值设置为空
                            }                           
                        }
                        
                }            
            }
        });
    }   
}

/***
* 获取form中绑定的值
*参数说明：
*   data：可选，如果为空，则自动创建空对象
*   area：可选，获取数据的区域。默认为body
*/
formDataBindHelper.getValues = function (data, area) {
    if (!data) {
        data = {};
    }
    if (!area) {//区域为空时，设置区域为body
        area = document.body;
    }
    $("[data-binding]", area).each(function () {//获取区域内设置了data-binding属性的元素
        var fieldName = $(this).attr("data-binding");//获取data-binding属性的值，即model中的属性
        if (fieldName) {
            switch ($(this).context.nodeName) {//判断控件元素标签
                case "LABEL"://如果是label不处理
                    break;
                default://默认从val中获取控件值
                    if ($(this).val()) {//控件值是否不为空
                        data[fieldName] = $(this).val();//设置对象的属性值
                    } else {//如果控件值为空，则将对象属性设置为null
                        data[fieldName] = null;
                    }
                   
            }   
        }
    });
}

/***
* 绑定select控件的下拉选项
* 参数说明：
*   select：select元素的对象
*   data：绑定的数据源
*   textField：显示对应的属性名称
*   valueField：值对应的属性名称
*/
formDataBindHelper.bindDataToSelect = function (select,data,textField,valueField) {
    $(select).empty();
    var index = 0;
    $(data).each(function () {//遍历list数据源
        var item = this;
        $(select)[0].options.add(new Option(item[textField], item[valueField]));//向select控件中增加选项
        index++;
    });
}

/***
* 显示遮罩层
*/
formDataBindHelper.showLoading = function () {
    $(".loading-placeholder").removeClass("hidden");
}

/***
*隐藏遮罩层
*/
formDataBindHelper.hideLoading = function () {
    $(".loading-placeholder").addClass("hidden");
}

/**
* 格式化日期
* 参数说明：
*   date：日期
*   format：可选，格式化字符串，默认格式为："yyyy-MM-dd"
*/
formDataBindHelper.formatDate = function(date, format) {
    if (!date) return;
    if (!format) format = "yyyy-MM-dd";
    switch (typeof date) {
        case "string":
            date = new Date(date.replace(/-/, "/"));
            break;
        case "number":
            date = new Date(date);
            break;
    }
    if (!date instanceof Date) return;
    var dict = {
        "yyyy": date.getFullYear(),
        "M": date.getMonth() + 1,
        "d": date.getDate(),
        "H": date.getHours(),
        "m": date.getMinutes(),
        "s": date.getSeconds(),
        "MM": ("" + (date.getMonth() + 101)).substr(1),
        "dd": ("" + (date.getDate() + 100)).substr(1),
        "HH": ("" + (date.getHours() + 100)).substr(1),
        "mm": ("" + (date.getMinutes() + 100)).substr(1),
        "ss": ("" + (date.getSeconds() + 100)).substr(1)
    };
    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
        return dict[arguments[0]];
    });
}

/**
 * spreadjs帮助类
 * 方法如下：
 *  spreadToJSON：获取spreadjs的json字符串
 *  addPicture：向spreadjs的sheet中插入图片
 */
var spreadHelper = {};

/****
* 获取spreadjs的json字符串
* 参数说明：
*   spread：spreadjs中的Workbook对象
*   options：可选，参数信息
*/
spreadHelper.spreadToJSON = function (spread, options) {
    if (!options) {
        options = {};
    }
    options.includeBindingSource = true;
    return JSON.stringify(spread.toJSON(options));
}

/***
* 向spreadjs的sheet中插入图片
* 参数说明：
*   spread：spreadjs中的Workbook对象
*   file：图片的file对象
*/
spreadHelper.addPicture = function (spread, file) {
    if (!file) return false;
   
    if (!/image\/\w+/.test(file.type)) {//验证文件类型是否为图片类型文件
        return false;
    }
    if (spread) {//判断Workbook对象是否为空
        var reader = new FileReader();//创建文件读取对象
        reader.onload = function () {
            var pictureUrl = this.result;//图片的base64的字符串
            var sheet = spread.getActiveSheet();//当前活动的sheet对象
            var sel = sheet.getSelections()[0];//获取当前活动的单元格
            if (pictureUrl !== "" && sel) {//如果图片内容和当前活动的单元格都不为空，则处理
                sheet.suspendPaint();
                var name = "Picture1" + (new Date()).getTime();//命名图片的name，这个在spreadjs中是唯一的
                
                var topHeight = 0;//图片距离上方的高度
                for (var i = 0; i < sel.row; i++) {
                    topHeight = topHeight + sheet.getRowHeight(i);
                }
                var leftWidth = 0;//图片距离左边的距离
                for (var i = 0; i < sel.col; i++) {
                    leftWidth = leftWidth + sheet.getColumnWidth(i);
                }
                var rowheight = 0;//当前选中单元格的高度
                var endRow = sel.rowCount + sel.row;//合并的单元格，结束的单元格行索引
                for (var i = sel.row; i < endRow; i++) {//计算合并单元格后选中单元格的高度
                    rowheight = rowheight + sheet.getRowHeight(i);
                }

                var colwidth = 0;//当前选中单元格的宽度
                var endCol = sel.col + sel.colCount;//合并的单元格，结束的单元格列索引
                for (var i = sel.col; i < endCol; i++) {//计算合并单元格后选中单元格的宽度
                    colwidth = colwidth + sheet.getColumnWidth(i);
                }
                //向sheet中插入图片信息
                var picture = (sheet.pictures.add(name, pictureUrl, leftWidth, topHeight, colwidth, rowheight)).backColor("#FFFFFF").borderColor("#000000")
                .borderStyle("solid").borderWidth(1).borderRadius(3);
                sheet.resumePaint();
                spread.focus();
                picture.isSelected(true);//设置选中当前图片信息
            }
        }
        reader.readAsDataURL(file);//读取图片文件
    }
};

var alertErrorInfo = {};

/****
*  弹出错误提出层
*  参数说明：
*   message：错误信息
*/
alertErrorInfo.showError = function (message) {
    var errorHtml;
    var errorFade;
    formDataBindHelper.hideLoading();
    if ($("#errorInfoDiv").length > 0) {//当前页面是否存在错误信息的id元素
        errorHtml = $("#errorInfoDiv");
        errorFade = $("#errorFade");
        alertHelper.showDiv('errorInfoDiv', 'errorFade', 420, 170);//显示错误
    } else {//如果不存在，将错误信息的html拼写到当前body中
        
        var errorHtml = $('<div id="errorInfoDiv" class="white_content"><div class="dialogTitle" ><div class="dialogTitleLeft"><div>错误</div></div><div class="dialogTitleRight"><a class="dialogClose"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAC5SURBVHja3JRNCsIwEIUnLrrNqjfotiJYL+DpREpP4S2kehAPIHbVbVefC99CI4MV4saBEGbeT5hJSAAsRywsU/zMaG1mvZlFhx+FN28I8LyOPKIHigQrVEe8F21qVAIXkQ9AUD0oR3j5yciAChgk2qu2Uz4ItzlGBiyBUeKz9hFYOXzXyIAtMMlkUu7ys12/d0LttFZ/01oFXCXuVGuV3+YOO9v1Z3uQjcjRmUUETsAmxcL/fiP3AQD9xFATPYlk/QAAAABJRU5ErkJggg==" /></a></div></div><div class="verificationContent" style="margin-left: -10px;"><div><img src="data:image/jpg;base64,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" style="width: 53px;height: 41px;" /></div><div id="errorMessage" style="width: 400px;height: 70px;overflow: auto;"></div></div><div class="selectDialogs"><div style="margin-left: 20px;"><input type="button" style="width:60px;margin-left: 20px;" id="btnErrorBack" value="确定" /> </div></div></div >');
        var errorFade = $('<div id="errorFade" class="black_overlay"></div >');
        $(document.body).append(errorHtml);
        $(document.body).append(errorFade);
        alertHelper.showDiv('errorInfoDiv', 'errorFade', 420, 170);
        $(".dialogClose", errorHtml).on("click", function () {//注册关闭事件
            alertHelper.closeDiv('errorInfoDiv', 'errorFade');
        });
        $("#btnErrorBack", errorHtml).on("click", function () {//注册确定时间
            alertHelper.closeDiv('errorInfoDiv', 'errorFade');
        });
        errorFade.on("click", function () {//注册确定时间
            alertHelper.closeDiv('errorInfoDiv', 'errorFade');
        });
    }
    $("#errorMessage", errorHtml).html(message);
}

var alertHelper = {};
alertHelper.showDiv = function (show_div, bg_div, width, height) {
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

alertHelper.closeDiv = function (show_div, bg_div) {
    document.getElementById(show_div).style.display = 'none';
    document.getElementById(bg_div).style.display = 'none';
}