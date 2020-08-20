/*
 * File   : ADCFormDesignHelper.js
 * Created: Wednesday October 31st 2018 9:14:27 am
 * Author : yuchunyu97
 * License: MIT License
 * 
 * Copyright (c) 2018 yuchunyu97
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * -----
 * Last Modified: Thursday December 6th 2018 9:56:30 am
 * Modified By  : yuchunyu97 at <yuchunyu97@gmail.com>
 * -----
 * Description:
 * -----
 * HISTORY:
 */

var ADCFormDesignHelper = {
    /**
     * 预览表单
     *
     * @param {*} editor UE实例化对象
     */
    Preview: function (editor) {
        // 如果没有 layer 模块，则返回错误
        if (!layer) return alert('Layer 加载失败');
        // 获取编辑器内的内容
        var UEContent = editor.getContent();
        if (!UEContent) return layer.msg('无可预览的内容', {
            icon: 0
        });

        try {
            layer.open({
                type: 1,
                title: 'ADC表单预览',
                id: 'ADCFormDesignHelper-Preview',
                content: ADCFormDesignHelper.formatHtml(UEContent),
                area: ['80%', '90%'],
                success: function () {
                    layui.form.render();
                }
            });
        } catch (error) {
            console.error(error);
            layui.layer.msg('ADCFormDesign 预览异常，请在控制台查看错误', { icon: 5 });
            try {
                layui.layer.close($('#ADCFormDesignHelper-Preview').parent().attr('id').split('layer')[1]);
            } catch (e) {}
        }
    },
    View: function (data) {
        if (!data.contentHtml) {
            return layer.msg('表单信息为空，无法查看！', {
                icon: 5
            });
        }
        try {
            layer.open({
                type: 1,
                title: data.formName + ' [' + data.formCode + ']',
                id: 'ADCFormDesignHelper-View',
                content: ADCFormDesignHelper.formatHtml(data.contentHtml),
                area: ['80%', '90%'],
                success: function () {
                    layui.form.render();
                }
            });
        } catch (error) {
            console.error(error);
            layui.layer.msg('查看表单内容出错，请在控制台查看错误信息', { icon: 5 });
            try {
                layui.layer.close($('#ADCFormDesignHelper-View').parent().attr('id').split('layer')[1]);
            } catch (e) {}
        }
    },
    formatHtml: function (content) {
        // 去除表格内单元格设置 多宽度
        content = content.replace(/\swidth=\"(.*?)\"/ig, '');
        // 去除一些编辑时的占位符
        content = content.replace(/\{\|\-/g, "").replace(/\-\|\}/g, "").replace(/&nbsp;(.*?)&nbsp;/g, "");
        content = content.replace(/<table(.*?)>/ig, function () {
            return '<table' + arguments[1] + ' style="margin: 0 auto;width: 100%;">'
        });
        content += '<button lay-submit style="display: none;" id="adcformdesign-submit" lay-filter="adcformdesign"></button>';
        // 加上外部容器
        content = '<div class="layui-table layui-form adc-form-design-helper" style="padding: 20px;box-sizing: border-box;">' + content + '</div>';

        return content;
    },
    /**
     * 表格扩展工具方法
     *
     * @param {*} content 需要格式化的 DOM 字符串
     *
     * @return 格式化好的字符串
     */
    formatExpandHtml: function (content) {
        // 默认模板行是隐藏掉的，所以要先将隐藏属性去掉
        content = content.replace('display: none;', '');
        // 将 DOM 字符串解析为 jQuery 对象
        var dom = $(content),
            tds = dom.find('td');
        // 让本行的 position 为 relative
        dom.css('position', 'relative');

        // 添加删除行按钮
        var iDOM = $('<i></i>');
        iDOM.attr('class', 'layui-icon layui-icon-delete');
        iDOM.css({
            "position": "absolute",
            "bottom": "0",
            "right": "0",
            "cursor": "pointer",
            "color": "#FF5722"
        });
        iDOM.on("click", function () {
            $(this).parent().parent().remove();
        });
        // 添加上下移动行按钮
        var iUpDOM = $('<i></i>');
        iUpDOM.attr('class', 'layui-icon layui-icon-up');
        iUpDOM.css({
            "position": "absolute",
            "top": "4px",
            "left": "-18px",
            "cursor": "pointer",
            "color": "#999",
            "width": "16px",
            "height": "16px",
            "line-height": "16px",
            "font-size": "12px",
            "background": "#f2f2f2",
            "border-radius": "16px",
            "text-align": "center"
        });
        iUpDOM.on("click", function () {
            var trDOM = $(this).parent().parent(),
                tbodyDom = trDOM.parent(),
                totalRow = tbodyDom.children().length - 3,
                currentRow = trDOM[0].rowIndex - 1;
            if (currentRow === 1 || totalRow <= 1) {
                return;
            } else {
                $(tbodyDom.children()[currentRow - 1 + 2]).before(trDOM);
            }
        });
        var iDownDOM = $('<i></i>');
        iDownDOM.attr('class', 'layui-icon layui-icon-down');
        iDownDOM.css({
            "position": "absolute",
            "bottom": "4px",
            "left": "-18px",
            "cursor": "pointer",
            "color": "#999",
            "width": "16px",
            "height": "16px",
            "line-height": "16px",
            "font-size": "12px",
            "background": "#f2f2f2",
            "border-radius": "16px",
            "text-align": "center"
        });
        iDownDOM.on("click", function () {
            var trDOM = $(this).parent().parent(),
                tbodyDom = trDOM.parent(),
                totalRow = tbodyDom.children().length - 3,
                currentRow = trDOM[0].rowIndex - 1;
            if (currentRow === totalRow || totalRow <= 1) {
                return;
            } else {
                $(tbodyDom.children()[currentRow + 1 + 2]).after(trDOM);
            }
        });

        $(tds[tds.length - 1]).append(iDOM);
        $(tds[0]).append(iUpDOM);
        $(tds[0]).append(iDownDOM);

        // TODO: 将 name 值变成唯一的
        // [√] input
        // [√] textarea
        // [√] select
        // [√] radio
        // [√] checkbox
        // [] file
        // HINT: 可扩展表格内的控件不可加类型判断，权限为可编辑
        var randomStr = randomString(8);
        var DOMsArray = [];
        DOMsArray = DOMsArray.concat(
            dom.find('[adcform="adc_form_input"]'),
            dom.find('[adcform="adc_form_textarea"]'),
            dom.find('[adcform="adc_form_select"]'),
            dom.find('[adcform="adc_form_radio"]').find('input'),
            dom.find('[adcform="adc_form_checkbox"]').find('input')
        );
        for (var i = 0; i < DOMsArray.length; i++) {
            var item = DOMsArray[i];
            for (var j = 0; j < item.length; j++) {
                item[j].name = item[j].name + '_expand_' + randomStr;
            }
        }

        return dom;

        function randomString(len) {
            len = len || 32;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = '';
            for (randomi = 0; randomi < len; randomi++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        }
    },
    // 在待办事项、已办事项、已发事项中动态添加已有数据中可扩展表单数据的函数
    expandHtmlViewer: function (formId, formData) {
        var el = $(formId),
            // 保存扩展表格内的数据（就是动弹增加的数据）
            dataArray = [],
            dataObj = {},
            // 保存扩展表格的DOM对象，因为可能会有多个可扩展表格
            expandFormArray = [],
            // 保存相应可扩展表格对应的单行模板
            expandFormTemplateArray = [],
            expandFormDataArray = [];
        // 将数据中可扩展表格相关的数据提取出来
        for (name in formData) {
            if (name.indexOf('expand') > -1) {
                dataArray.push({
                    name: name,
                    value: formData[name]
                });
                var randomStr = name.split('_expand_');
                if (!(randomStr[1] in dataObj)) {
                    dataObj[randomStr[1]] = randomStr[0];
                }
            }
        }
        // 如果有可扩展表格及数据，则获取对应的DOM对象
        if (dataArray.length > 0) {
            expandFormArray = el.find('[adcform="adc_form_expand"]');
            for (var i = 0; i < expandFormArray.length; i++) {
                var tmp = $($(expandFormArray[i]).find('tr')[1].outerHTML);
                tmp.css('display', 'table-row');
                expandFormTemplateArray.push(tmp);
                expandFormDataArray.push([]);
            }
        } else return;
        // 将数据按照可扩展表单分组
        for (var name in dataObj) {
            var inputName = dataObj[name];
            for (var i = 0; i < expandFormTemplateArray.length; i++) {
                if (expandFormTemplateArray[i].find('[name="' + inputName + '"]').length) expandFormDataArray[i].push(name);
            }
        }
        // 最终处理
        for (var i = 0; i < expandFormDataArray.length; i++) {
            var tmp = expandFormDataArray[i];
            if (tmp.length > 0) {
                for (var j = 0; j < tmp.length; j++) {
                    // 创建副本
                    var copy = $(expandFormTemplateArray[i][0].outerHTML);

                    // TODO: 设置 name 值
                    // [√] input
                    // [√] textarea
                    // [√] select
                    // [√] radio
                    // [√] checkbox
                    // [] file

                    var randomStr = tmp[j];
                    var DOMsArray = [];
                    DOMsArray = DOMsArray.concat(
                        copy.find('[adcform="adc_form_input"]'),
                        copy.find('[adcform="adc_form_textarea"]'),
                        copy.find('[adcform="adc_form_select"]'),
                        copy.find('[adcform="adc_form_radio"]').find('input'),
                        copy.find('[adcform="adc_form_checkbox"]').find('input')
                    );
                    for (var k = 0; k < DOMsArray.length; k++) {
                        var item = DOMsArray[k];
                        for (var l = 0; l < item.length; l++) {
                            item[l].name = item[l].name + '_expand_' + randomStr;
                            item[l].disabled = "disabled";
                        }
                    }

                    // 添加到表单中
                    $(expandFormArray[i]).append(copy);
                }
            }
        }
    },
    /**
     * 解析表单
     *
     * 单行文本框       <input name="input_1540780867931" type="text" title="单行文本框" value="" adcform="adc_form_input" class="layui-input" placeholder="单行文本框" adcform_hide="0" adcform_fontsize="14" adcform_align="left" adcform_width="190" adcform_height="30" adcform_validate="adcformvalidate_none" style="box-sizing: border-box; font-size: 14px; text-align: left; width: 190px; height: 30px;"/>
     * 多行文本框       <textarea name="textarea_1540780965898" title="多行文本框" value="" adcform="adc_form_textarea" class="layui-textarea" placeholder="多行文本框" adcform_rich="0" adcform_fontsize="14" adcform_width="300" adcform_height="80" style="box-sizing: border-box; font-size: 14px; width: 300px; height: 80px;"></textarea>
     * 下拉菜单         <select name="select_1540780986835" type="select" title="下拉菜单" adcform="adc_form_select" adcform_height="30" adcform_width="190" style="height: 30px; width: 190px;"><option value="男">男</option><option value="女">女</option></select>
     * 单选框           <span adcform="adc_form_radio" title="单选框" name="radio_1540781163367"><input name="radio_1540781163367" value="男" type="radio"/>男&nbsp;<input name="radio_1540781163367" value="女" type="radio"/>女&nbsp;</span>
     * 复选框           <span adcform="adc_form_checkbox" title="复选框" name="checkbox_1540781189849"><input name="checkbox_1540781189849" value="吃饭" type="checkbox"/>吃饭&nbsp;<input name="checkbox_1540781189849" value="睡觉" type="checkbox"/>睡觉&nbsp;</span>
     * 文件上传         <span adcform="adc_form_file" name="file_1540781288085" title="文件上传"><input name="file_1540781288085" type="file" title="文件上传" adcform="adc_form_file" adcform_hide="0" adcform_align="left" adcform_width="180" style="text-align: left; width: 180px;"/><button onclick="{var xhr = new XMLHttpRequest();xhr.open(&quot;POST&quot;, &quot;/api/sys/file/upload&quot;);var fd = new FormData();fd.append(&quot;file&quot;, document.querySelector(&quot;input[name=file_1540781288085]&quot;).files[0]);xhr.onload = function(e){if(xhr.status===200){document.querySelector(&quot;input[name=&#39;file_1540781288085&#39;]&quot;).style.display=&quot;none&quot;;document.querySelector(&quot;button[name=&#39;file_1540781288085_upload&#39;]&quot;).style.display=&quot;none&quot;;document.querySelector(&quot;button[name=&#39;file_1540781288085_download&#39;]&quot;).style.display=&quot;inherit&quot;;document.querySelector(&quot;button[name=&#39;file_1540781288085_del&#39;]&quot;).style.display=&quot;inherit&quot;;document.querySelector(&quot;input[name=&#39;file_1540781288085_fileid&#39;]&quot;).setAttribute(&quot;value&quot;, JSON.parse(xhr.responseText).data.fileId);}else{alert(&quot;上传失败！请在控制台查看错误日志&quot;);console.error(xhr);}};xhr.send(fd);}" name="file_1540781288085_upload">上传</button><button onclick="{var fileId = document.querySelector(&quot;input[name=&#39;file_1540781288085_fileid&#39;]&quot;).getAttribute(&quot;value&quot;);window.open(&quot;/api/sys/file/&quot;+fileId+&quot;/download&quot;);}" name="file_1540781288085_download" style="display: none;">下载</button><button onclick="{document.querySelector(&quot;input[name=&#39;file_1540781288085&#39;]&quot;).style.display=&quot;inherit&quot;;document.querySelector(&quot;button[name=&#39;file_1540781288085_upload&#39;]&quot;).style.display=&quot;inherit&quot;;document.querySelector(&quot;button[name=&#39;file_1540781288085_download&#39;]&quot;).style.display=&quot;none&quot;;document.querySelector(&quot;button[name=&#39;file_1540781288085_del&#39;]&quot;).style.display=&quot;none&quot;;document.querySelector(&quot;input[name=&#39;file_1540781288085_fileid&#39;]&quot;).setAttribute(&quot;value&quot;, &quot;&quot;);}" name="file_1540781288085_del" style="display: none;">删除</button><input style="display: none !important;" name="file_1540781288085_fileid"/></span>
     * 日期时间选择     <input name="datetime_1540781313216" type="text" title="日期时间选择" placeholder="日期时间选择" adcform="adc_form_datetime" adcform_theme="#37ABFF" adcform_type="_" class="datetime_1540781313216 layui-input" adcform_hide="0" adcform_fontsize="14" adcform_align="left" adcform_width="190" adcform_height="30" style="box-sizing: border-box; font-size: 14px; text-align: left; width: 190px; height: 30px;"/></p><script class="datetime_1540781313216_script">(function(){var param = {elem: ".datetime_1540781313216"};var type = document.querySelector(".datetime_1540781313216").getAttribute("adcform_type").split("_");var theme = document.querySelector(".datetime_1540781313216").getAttribute("adcform_theme");if(type[0]!==""){param.type=type[0];}if(type[1]!==""){param.range=true;}if(theme){param.theme=theme;}layui.laydate.render(param);})();</script>
     * 人员选择         {|-<span class="layui-input-inline" style="position: relative;"><input name="input_1540950161457" type="text" title="人员选择" adcform="adc_form_user_select" class="layui-input" placeholder="人员选择" readonly="readonly" onclick="{ var data = {data: []}; var that = this; function callback (res) { if (res.length &gt;0) { that.dataset.usid = res[0].id; that.dataset.usname = res[0].name; that.value = res[0].name; } } ADCFormDesignHelper.personnelSelect(data, callback); }" adcform_default="1" adcform_width="190" adcform_height="30" adcform_fontsize="14" style="box-sizing: border-box; width: 190px; height: 30px; font-size: 14px; cursor: pointer; padding-right: 30px;"/><em class="layui-icon layui-icon-username" style="position: absolute; top: 50%; right: 5px; font-size: 20px; width: 20px; height: 20px; margin-top: -10px;"></em></span>-|} </p><script class="input_1540950161457_script">(function (that) { var adcform_default = that.getAttribute("adcform_default"); if (adcform_default == "1") { var account = layui.config.getAccount(); that.value = account.usname; that.dataset.usname = account.usname; that.dataset.usid = account.usid; } })(document.querySelector("input[name='input_1540950161457']"));</script>
     * 组织机构选择     {|-<span class="layui-input-inline" style="position: relative;"><input name="input_1540950202226" type="text" title="组织机构选择" adcform="adc_form_org_select" class="layui-input" placeholder="组织机构选择" readonly="readonly" onclick="{ var that = this; function callback (res) { if (res.id &amp;&amp; res.name) { that.dataset.id = res.id; that.dataset.name = res.name; that.value = res.name; } } ADCFormDesignHelper.orgsSelect(callback); }" adcform_default="1" adcform_width="190" adcform_height="30" adcform_fontsize="14" style="box-sizing: border-box; width: 190px; height: 30px; font-size: 14px; cursor: pointer; padding-right: 30px;"/><em class="layui-icon layui-icon-website" style="position: absolute; top: 50%; right: 5px; font-size: 20px; width: 20px; height: 20px; margin-top: -10px;"></em></span>-|}<script class="input_1540950202226_script">(function (that) { var adcform_default = that.getAttribute("adcform_default"); if (adcform_default == "1") { var account = layui.config.getAccount(); var org = account.orgs; if (org.length >0) { that.value = org[0].name; that.dataset.name = org[0].name; that.dataset.id = org[0].id; } } })(document.querySelector("input[name='input_1540950202226']"));</script>
     *
     * @param {*} content
     */
    ParsingForm: function (content) {
        var reg = {
            input: /<input(.*?)adcform="adc_form_input"(.*?)>/ig,
            textarea: /<textarea(.*?)adcform="adc_form_textarea"(.*?)>/ig,
            select: /<select(.*?)adcform="adc_form_select"(.*?)>/ig,
            radio: /<span(.*?)adcform="adc_form_radio"(.*?)>/ig,
            checkbox: /<span(.*?)adcform="adc_form_checkbox"(.*?)>/ig,
            file: /<span(.*?)adcform="adc_form_file"(.*?)>/ig,
            datetime: /<input(.*?)adcform="adc_form_datetime"(.*?)>/ig,
            userselect: /<input(.*?)adcform="adc_form_user_select"(.*?)>/ig,
            orgselect: /<input(.*?)adcform="adc_form_org_select"(.*?)>/ig
        };
        var fileds = [];
        // 匹配单行文本框
        var inputResult = content.match(reg.input);
        inputResult = inputResult ? inputResult : [];
        // 匹配多行文本框
        var textareaResult = content.match(reg.textarea);
        textareaResult = textareaResult ? textareaResult : [];
        // 匹配下拉菜单
        var selectResult = content.match(reg.select);
        selectResult = selectResult ? selectResult : [];
        // 匹配单选框
        var radioResult = content.match(reg.radio);
        radioResult = radioResult ? radioResult : [];
        // 匹配复选框
        var checkboxResult = content.match(reg.checkbox);
        checkboxResult = checkboxResult ? checkboxResult : [];
        // 匹配文件上传
        var fileResult = content.match(reg.file);
        fileResult = fileResult ? fileResult : [];
        // 匹配日期时间选择
        var datetimeResult = content.match(reg.datetime);
        datetimeResult = datetimeResult ? datetimeResult : [];
        // 匹配人员选择
        var userselectResult = content.match(reg.userselect);
        userselectResult = userselectResult ? userselectResult : [];
        // 匹配组织机构选择
        var orgselectResult = content.match(reg.orgselect);
        orgselectResult = orgselectResult ? orgselectResult : [];

        var resultArray = [].concat(inputResult, textareaResult, selectResult, radioResult, checkboxResult, fileResult, datetimeResult, userselectResult, orgselectResult);
        for (var i = 0; i < resultArray.length; i++) {
            var tmp = resultArray[i],
                name = null,
                title = null;
            tmp.replace(/name="(.*?)"/ig, function () {
                name = arguments[1];
                return arguments[0];
            }).replace(/title="(.*?)"/ig, function () {
                title = arguments[1];
                return arguments[0];
            });
            fileds.push({
                name: name,
                title: title
            });
        }

        var newContent = content;

        return {
            fields: fileds,
            content: newContent
        };
    },
    // 选人插件
    // 调用该方法可以调起 iframe 弹窗
    // 在弹窗内进行人员选择
    // 该方法接受两个个参数：
    // 1. 数据对象，所有需要传递到选人弹窗的数据
    // 2. 回掉函数，会在选完人点击确定的时候将选中的数据以数组的方式回传
    personnelSelect: function (data, callback) {
        layer.open({
            type: 2,
            id: 'personnelSelect',
            title: '请选择',
            content: '/static/components/tpl/task_personnel_select.html',
            area: ['96%', '80%'],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var finalData = $('#personnelSelect iframe')[0].contentWindow
                    .task_personnel_select.finish();
                // 获取到数据，执行回掉函数
                callback && typeof callback === 'function' && callback(
                    finalData);
                layer.close(index);
            },
            success: function () {
                // 执行 iframe 内的方法
                $('#personnelSelect iframe')[0].contentWindow.task_personnel_select
                    .init(data);
            },
            resize: false
        });
    },
    orgsSelect: function (callback) {
        layer.open({
            type: 2,
            id: 'orgsSelect',
            title: '请选择',
            content: '/static/components/tpl/task_orgs_select.html',
            area: ['50%', '80%'],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
               
                var finalData = $('#orgsSelect iframe')[0].contentWindow
                    .task_orgs_select.finish();
                // 获取到数据，执行回掉函数
                if (finalData.id == '' || finalData.name == '') {
                    return layer.msg('请选择组织机构', {
                        icon: 0
                    });
                }
                callback && typeof callback === 'function' && callback(
                    finalData);
                layer.close(index);
            },
            resize: false
        });
    },

    /**
     * 启动流程
     *
     * @param {*} data 原始数据，包含 processDefinitionId, contentHtml, privilege
     * @param {*} callback 回调函数
     */

    startProcess: function (data, callback) {
        var content = data.data.contentHtml;
        if (data.data.id.indexOf('.html') > 0) {
            content = data.data.id;
        } else {
            content = ADCFormDesignHelper.formatHtml(content);
        }
        l = layer.open({
            type: 1,
            title: '启动流程',
            id: 'ADCFormDesignHelper-startProcess',
            content: content,
            area: ['80%', '90%'],
            btn: ['启动', '取消'],
            btnAlign: 'c',
            yes: function (index, layero) {
                $('#adcformdesign-submit').click();
            },
            success: function () {
                // 加权限
                if (data.data.id.indexOf('.html') < 0) {
                    ADCFormDesignHelper.formatPriv('#ADCFormDesignHelper-startProcess', JSON.parse(data.data.privilege));
                }
                layui.form.render();
                layui.form.on('submit(adcformdesign)', function (d) {
                    var formdata = ADCFormDesignHelper.formdataGet('#ADCFormDesignHelper-startProcess', d.field);
                    formdata = JSON.stringify(formdata);
                    var processKey = data.processKey;
                    layui.admin.req('/api/activiti-task/existMultiInstance?processDefinitionKey=' + processKey, {},
                        function (res) {
                            var makeupoliet = {
                                processDefinitionId: data.processId,
                                formData: formdata,
                                message: '发起人'
                            };
                            if (res.data) {
                                // 弹出选人窗口，在回掉函数中获取选中人的数据
                                ADCFormDesignHelper.personnelSelect({
                                    data: []
                                }, function (data, index) {
                                    // 获取到选中人的信息
                                    var selectedData = data,
                                        selectedIds = [],
                                        selectedNames = [];
                                    if (data.length === 0) return layer.msg('请选择至少一人', {
                                        icon: 5
                                    });
                                    layer.close(index);
                                    var vars = [];
                                    $.each(data, function (ind, d) {
                                        vars.push(d.id);
                                    });
                                    makeupoliet.variables = [{
                                        name: 'assigneeList',
                                        value: vars
                                    }];
                                    ADCFormDesignHelper.startActivity(makeupoliet);
                                });
                            } else {
                                ADCFormDesignHelper.startActivity(makeupoliet);
                            }

                        });
                    /*layui.admin.req('/api/activiti/repository/startProcess', {
                        processDefinitionId: data.processId,
                        formData: formdata,
                        message: '发起人'
                    }, function (res) {
                        if (res.ok) {
                            layer.msg('启动流程成功！', {
                                icon: 1
                            });
                            layer.close(l);
                        } else {
                            layer.msg('启动流程失败！' + res.message, {
                                icon: 5
                            });
                        }
                    }, {
                        method: 'post'
                    });*/
                });
            }
        });
    },
    /**
     * 获取表单内填写的数据
     *
     * @param {*} elem 容器选择器名
     * @param {*} data 表单信息
     */
    formdataGet: function (elem, data) {
        for (var name in data) {
            var type = name.split('_')[0];
            switch (type) {
                case 'checkbox':
                    // 复选框，需要手动获取选择的内容
                    var checkboxArray = $(elem + ' input[name="' + name + '"]'),
                        checkboxValue = [];
                    for (var i = 0; i < checkboxArray.length; i++) {
                        if (checkboxArray[i].checked) checkboxValue.push(checkboxArray[i].value);
                    }
                    data[name] = checkboxValue.join('|');
                    break;
                case 'inputuserselect':
                    // 人员选择，增加 usid usname
                    var el = $(elem + ' input[name="' + name + '"]'),
                        usid = el.data('usid'),
                        usname = el.data('usname');
                    data[name + '_usid'] = usid;
                    data[name + '_usname'] = usname;
                    break;
                case 'inputorgselect':
                    // 组织机构选择，增加 id name
                    var el = $(elem + ' input[name="' + name + '"]'),
                        orgid = el.data('id'),
                        orgname = el.data('name');
                    data[name + '_id'] = orgid;
                    data[name + '_name'] = orgname;
                    break;
                case 'file':
                    // 文件上传
                    var info = name.split('_');
                    if (info.length === 2) {
                        var el = document.querySelector(elem + ' input[name="' + name + '"]');
                        data[name] = el.dataset.filename;
                    }
                    break;

                default:
                    break;
            }
        }
        return data;
    },

    /**
     * 将数据填入表单内
     *
     * @param {*} elem 容器选择器名
     * @param {*} data 表单信息
     */
    formdataUpdate: function (elem, data) {
        for (var name in data) {
            var type = name.split('_')[0];
            switch (type) {
                case 'input':
                    // 单行输入框
                    var el = $(elem + ' input[name="' + name + '"]');
                    el.val(data[name]);
                    break;
                case 'textarea':
                    // 多行输入框
                    var el = $(elem + ' textarea[name="' + name + '"]');
                    el.val(data[name]);
                    break;
                case 'select':
                    // 下拉菜单
                    var el = $(elem + ' select[name="' + name + '"]');
                    el.val(data[name]);
                    break;
                case 'radio':
                    // 单选框
                    var el = $(elem + ' input[name="' + name + '"]');
                    for (var i = 0; i < el.length; i++) {
                        if (el[i].value === data[name]) el[i].checked = true;
                    }
                    break;
                case 'checkbox':
                    // 复选框
                    var el = $(elem + ' input[name="' + name + '"]'),
                        val = data[name].split('|');
                    for (var i = 0; i < el.length; i++) {
                        for (var j = 0; j < val.length; j++) {
                            if (el[i].value === val[j]) {
                                el[i].checked = true;
                                break;
                            }
                        }
                    }
                    break;
                case 'file':
                    // 文件上传
                    var fileInfo = name.split('_');
                    if (fileInfo.length === 3 && fileInfo[2] === 'fileid' && data[name] !== '') {
                        var el = $(elem + ' input[name="' + name + '"]');
                        el.val(data[name]);
                        // 保存文件名
                        var elName = [fileInfo[0], fileInfo[1]].join('_');
                        document.querySelector(elem + ' input[name="' + elName + '"]').dataset.filename = data[elName];

                        var prefix = [fileInfo[0], fileInfo[1]].join('_');
                        $(elem + ' input[name="' + prefix + '"]').css('display', 'none');
                        $(elem + ' button[name="' + prefix + '_upload"]').css('display', 'none');
                        $(elem + ' button[name="' + prefix + '_download"]').css('display', 'inherit');
                        $(elem + ' button[name="' + prefix + '_del"]').css('display', 'inherit');
                        $(elem + ' button[name="' + prefix + '_del"]').on('click', function () {
                            $('.' + prefix + '_tip').remove();
                        });
                        $(elem + ' button[name="' + prefix + '_download"]').before('<div class="' + prefix + '_tip">' + data[elName] + '</div>');
                    }
                    break;
                case 'datetime':
                    // 日期时间选择
                    var el = $(elem + ' input[name="' + name + '"]');
                    el.val(data[name]);
                    break;
                case 'inputorgselect':
                    // 组织机构选择
                    var info = name.split('_');
                    if (info.length === 2) {
                        var el = $(elem + ' input[name="' + name + '"]'),
                            oid = data[name + '_id'],
                            oname = data[name + '_name'];
                        el.val(data[name]);
                        el.attr('data-id', oid);
                        el.attr('data-name', oname);
                    }
                    break;
                case 'inputuserselect':
                    // 人员选择
                    var info = name.split('_');
                    if (info.length === 2) {
                        var el = $(elem + ' input[name="' + name + '"]'),
                            oid = data[name + '_usid'],
                            oname = data[name + '_usname'];
                        el.val(data[name]);
                        el.attr('data-usid', oid);
                        el.attr('data-usname', oname);
                    }
                    break;

                default:
                    break;
            }
        }
    },
    startActivity: function startProcess(makeupoliet) {
        layer.confirm('确认要启动该流程？', {
            icon: 3,
            title: '提示'
        }, function () {
            layui.admin.req('/api/activiti/repository/startProcess', makeupoliet, function (res) {
                if (res.ok) {
                    layer.msg('启动流程成功！', {
                        icon: 1
                    });
                    layer.close(l);
                } else {
                    layer.msg('启动流程失败！' + res.message, {
                        icon: 5
                    });
                }
            }, {
                method: 'post'
            });
        });
    },

    /**
     * 为表单加权限
     *
     * @param {*} elem 容器选择器名
     * @param {*} priv 权限信息
     */
    formatPriv: function (elem, priv) {
        // 权限控制：0 不可见; 1 只读; 2 可编辑; 3 必填;
        var dealPriv = [
            function (target) {
                target.attr('disabled', 'disabled');
            },
            function (target) {
                target.attr('disabled', 'disabled');
            },
            function (target) { },
            function (target) {
                target.attr('required', 'required');
                var varify = el.attr('lay-verify');
                varify = varify ? varify : '';
                varify = varify.split('|');
                if (varify.length === 1 && varify[0] === '') varify = [];
                varify.push('required');
                el.attr('lay-verify', varify.join('|'));
            }
        ];
        for (var name in priv) {
            var type = name.split('_')[0];
            var value = parseInt(priv[name], 10);
            switch (type) {
                case 'input':
                    // 单行输入框
                    var el = $(elem + ' input[name="' + name + '"]');
                    dealPriv[value](el);
                    var validate = 'adcformdesign_' + el.attr('adcform_validate').split('_')[1];

                    var varify = el.attr('lay-verify');
                    varify = varify ? varify : '';
                    varify = varify.split('|');
                    if (varify.length === 1 && varify[0] === '') varify = [];
                    varify.push(validate);
                    el.attr('lay-verify', varify.join('|'));
                    break;
                case 'radio':
                    // 单选框
                    var el = $(elem + ' input[name="' + name + '"]');
                    dealPriv[value](el);
                    var validate = 'adcformdesign_radio';

                    var varify = el.attr('lay-verify');
                    varify = varify ? varify : '';
                    varify = varify.split('|');
                    if (varify.length === 1 && varify[0] === '') varify = [];
                    varify.push(validate);
                    el.attr('lay-verify', varify.join('|'));
                    break;
                case 'checkbox':
                    // 复选框
                    var el = $(elem + ' input[name="' + name + '"]');
                    dealPriv[value](el);
                    var validate = 'adcformdesign_checkbox';

                    var varify = el.attr('lay-verify');
                    varify = varify ? varify : '';
                    varify = varify.split('|');
                    if (varify.length === 1 && varify[0] === '') varify = [];
                    varify.push(validate);
                    el.attr('lay-verify', varify.join('|'));
                    break;
                case 'datetime':
                // 日期时间选择
                case 'inputuserselect':
                // 人员选择
                case 'inputorgselect':
                    // 组织机构选择
                    var el = $(elem + ' input[name="' + name + '"]');
                    dealPriv[value](el);
                    break;
                case 'textarea':
                    // 多行输入框
                    var el = $(elem + ' textarea[name="' + name + '"]');
                    dealPriv[value](el);
                    break;
                case 'select':
                    // 下拉菜单
                    var el = $(elem + ' select[name="' + name + '"]');
                    dealPriv[value](el);
                    break;
                case 'file':
                    // 文件上传
                    switch (value) {
                        case 0:
                        case 1:
                            // 不可见 只读
                            var el1 = $(elem + ' input[name="' + name + '"]');
                            dealPriv[1](el1);
                            var el2 = $(elem + ' button[name="' + name + '_upload"]');
                            dealPriv[1](el2);
                            var el3 = $(elem + ' button[name="' + name + '_download"]');
                            dealPriv[2](el3);
                            var el4 = $(elem + ' button[name="' + name + '_del"]');
                            el4.css('display', 'none');
                            break;
                        case 2:
                            // 可编辑
                            break;
                        case 3:
                            // 必填
                            var el = $(elem + ' input[name="' + name + '_fileid"]');
                            dealPriv[3](el);
                            break;
                    }
                    break;

                default:
                    break;
            }
        }

        // layui 表单验证
        layui.form.verify({
            // 验证必填单选框是否填写
            adcformdesign_radio: function (value, item) {
                var required = $(item).attr('lay-verify').indexOf('required') >= 0,
                    name = $(item).attr('name'),
                    title = $(item).data('name'),
                    radioArray = $('input[name="' + name + '"]'),
                    checked = false;
                for (var i = 0; i < radioArray.length; i++) {
                    if (radioArray[i].checked) checked = true;
                }
                if (required && !checked) return title + ' 为必填项';
            },
            // 验证必填复选框是否填写
            adcformdesign_checkbox: function (value, item) {
                var required = $(item).attr('lay-verify').indexOf('required') >= 0,
                    name = $(item).attr('name'),
                    title = $(item).data('name'),
                    checkboxArray = $('input[name="' + name + '"]'),
                    checked = false;
                for (var i = 0; i < checkboxArray.length; i++) {
                    if (checkboxArray[i].checked) checked = true;
                }
                if (required && !checked) return title + ' 为必填项';
            },

            adcformdesign_none: function (value, item) { },
            adcformdesign_mobile: function (value, item) {
                if (value != '' && !/^1[3|4|5|6|7|8]\d{9}$/.test(value)) {
                    return '手机号格式不正确';
                }
            },
            adcformdesign_phone: function (value, item) {
                if (value != '' && !/^\d{8}$/.test(value)) {
                    return '座机号格式不正确';
                }
            },
            adcformdesign_mobileorphone: function (value, item) {
                if (value != '' && !/^1[3|4|5|6|7|8]\d{9}$/.test(value) && !/^\d{8}$/.test(value)) {
                    return '手机号格式不正确';
                }
            },
            adcformdesign_email: function (value, item) {
                if (value != '' && !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)) {
                    return '邮箱格式不正确';
                }
            },
            adcformdesign_idcard: function (value, item) {
                if (value != '' && !/\d{18}/.test(value)) {
                    return '身份证号格式不正确';
                }
            },
            adcformdesign_qq: function (value, item) {
                if (value != '' && !/\d{6,10}/.test(value)) {
                    return 'QQ 格式不正确';
                }
            },
            adcformdesign_number: function (value, item) {
                try {
                    var el = $(item);
                    var tip = el.attr('title') || el.attr('placeholder') || '';
                } catch (err) { }
                if (!/\d*/.test(value)) {
                    return tip + ' 只能输入数字';
                }
            },
            adcformdesign_word: function (value, item) {
                try {
                    var el = $(item);
                    var tip = el.attr('title') || el.attr('placeholder') || '';
                } catch (err) { }
                if (!/[\u4e00-\u9fa5]+/.test(value)) {
                    return tip + ' 只能输入汉字';
                }
            },
            adcformdesign_english: function (value, item) {
                try {
                    var el = $(item);
                    var tip = el.attr('title') || el.attr('placeholder') || '';
                } catch (err) { }
                if (!/[A-Za-z]*/.test(value)) {
                    return tip + ' 只能输入英文';
                }
            }

        });
    },

    /**
     * 将表单权限设置为只读
     *
     * @param {*} elem
     */
    formatPrivReadonly: function (elem) {
        var inputElem = $(elem + ' input'),
            textareaElem = $(elem + ' textarea'),
            selectElem = $(elem + ' select'),
            buttonElem = $(elem + ' button');
        inputElem.attr('disabled', 'disabled');
        textareaElem.attr('disabled', 'disabled');
        selectElem.attr('disabled', 'disabled');
        buttonElem.attr('disabled', 'disabled');
    }
};


// 选人插件
// 调用该方法可以调起 iframe 弹窗
// 在弹窗内进行人员选择
// 该方法接受两个个参数：
// 1. 数据对象，所有需要传递到选人弹窗的数据
// 2. 回掉函数，会在选完人点击确定的时候将选中的数据以数组的方式回传
/*function personnelSelect(data, callback) {
    var layerIns100 = layer.open({
        type: 2,
        id: 'personnelSelect',
        title: '请选择',
        content: 'components/tpl/task_personnel_select.html',
        area: ['96%', '80%'],
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            var finalData = $('#personnelSelect iframe')[0].contentWindow
                .task_personnel_select.finish();
            // 获取到数据，执行回掉函数
            callback && typeof callback === 'function' && callback(finalData, index);
        },
        success: function () {
            layui.form.render();
            // 执行 iframe 内的方法
            $('#personnelSelect iframe')[0].contentWindow.task_personnel_select
                .init(data);
        },
        resize: false
    });
}*/

