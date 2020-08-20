let FormHandle = {
    formatHtml: (content) => {
        content = content && content.replace(/\swidth=\"(.*?)\"/ig, '');
        content = content && content.replace(/\{\|\-/g, "").replace(/\-\|\}/g, "").replace(/&nbsp;(.*?)&nbsp;/g, "");
        content = content && content.replace(/<table(.*?)>/ig, function () {
            return '<table' + arguments[1] + ' style="margin: 0 auto;width:100%;">'
        });

        return content;
    },
    // 在待办事项、已办事项、已发事项中动态添加已有数据中可扩展表单数据的函数
    expandHtmlViewer: (formId, formData) => {
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
            // alert(name);
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
    // 将数据填入表单内
    formdataUpdate: (elem, data, privilege) => {
        var arrVal=[];
        var leaderArr=[];
        var milestoneInfo='';
        var taskId='';
        var projectMemberId='';
        var contentArr=[];
        for (var name in data) {
            console.log('aaa',name);
            if(name=='milestoneInfo_id'){
                milestoneInfo=data[name];
            }
            if(name=='task_id'){
                taskId=data[name];
            }
            if(name=='milestoneResult'){
                ADCFormDesignHelper.setOutcomes(milestoneInfo,false,data[name],privilege.uploadFile,readType,data.projectName);
            }
            if(name=='taskmilestoneResult'){
                ADCFormDesignHelper.setTaskOutcomes(taskId,false,data[name],privilege.uploadFile,readType,data.projectName);
            }
            var type = name.split('_')[0];
            if(name=='projectName'||name=='milestoneName'){
                var el = $(elem + ' input[name="' + name + '"]');
                el.val(data[name])
            }
            switch (type) {
                case 'int':
                case 'sum':
                    // 数值
                case 'input':
                    // 单行输入框
                    var el = $(elem + ' input[name="' + name + '"]');
                    el.val(data[name]);
                    break;
                    // var el = $(elem + ' input[name="' + name + '"]');
                    // el.val(data[name]);
                    // break;

                case 'textarea':
                    // 多行输入框
                    var el = $(elem + ' textarea[name="' + name + '"]');
                    el.val(data[name]);
                        layui.use(['element','laypage','tree','util','table','form','laydate','layedit'], function () {
                            if(name=='textarea_1567502854371'&&$('#demoForm').length!=0){
                                var layedit = layui.layedit;
                                layedit.setContent(layedit.index,data[name]);
                            }
                        })
                    break;
                case 'select':
                    // 下拉菜单
                    var el = $(elem + ' select[name="' + name + '"]');
                    var arr=[];
                    var str='';
                    if(name.split('_')[2]=='proid'){
                        arr.push(name.split('_')[0]);
                        arr.push(name.split('_')[1]);
                        str=arr.join('_');
                        $(elem + ' select[name="' + str + '"]')[0].dataset.id=data[name];

                    }
                    if(name.split('_')[2]=='proname'){
                        arr.push(name.split('_')[0]);
                        arr.push(name.split('_')[1]);
                        str=arr.join('_');
                        $(elem + ' select[name="' + str + '"]')[0].dataset.name=data[name];
                    }
                    //里程碑ID回显
                    if(name.split('_')[3]=='proid'){
                        arr.push(name.split('_')[0]);
                        arr.push(name.split('_')[1]);
                        arr.push(name.split('_')[2]);
                        str=arr.join('_');
                        $(elem + ' select[name="' + str + '"]')[0].dataset.id=data[name];

                    }
                    if(name.split('_')[3]=='proname'){
                        arr.push(name.split('_')[0]);
                        arr.push(name.split('_')[1]);
                        arr.push(name.split('_')[2]);
                        str=arr.join('_');
                        $(elem + ' select[name="' + str + '"]')[0].dataset.name=data[name];
                    }
                    //负责人D回显
                    if(name.split('_')[4]=='proid'){
                        arr.push(name.split('_')[0]);
                        arr.push(name.split('_')[1]);
                        arr.push(name.split('_')[2]);
                        arr.push(name.split('_')[3]);
                        str=arr.join('_');
                        $(elem + ' select[name="' + str + '"]')[0].dataset.id=data[name];

                    }
                    if(name.split('_')[4]=='proname'){
                        arr.push(name.split('_')[0]);
                        arr.push(name.split('_')[1]);
                        arr.push(name.split('_')[2]);
                        arr.push(name.split('_')[3]);
                        str=arr.join('_');
                        $(elem + ' select[name="' + str + '"]')[0].dataset.name=data[name];
                    }

                    if(name.split('_')[2]=='milepost'){
                        arrVal.push({
                            name:name,
                            value:data[name]
                        })
                    }
                    if(name.split('_')[2]=='leader'){
                        leaderArr.push({
                            name:name,
                            value:data[name]
                        })
                    }
                    if(name=='select_1567409760846'){
                        contentArr.push({
                            value:data[name]
                        })
                    }
                    el.val(data[name]);
                    if(name=='select_1564650327815_proid'){
                        var optionData ={
                            "projectId":data[name],
                        };
                        if(raw_data&&raw_data.name.indexOf('发起人修改')!=-1){
                            optionData.notUsed='notUsed';
                        }
                        layui.admin.req('/api/progress/projectMilepost/page4Tips', optionData, function (res){
                            if (res.ok) {
                                var cur = res.data.list;
                                var  option='<option value="" >请选择</option>';
                                for (var i = 0; i < cur.length; i++) {
                                    var land = cur[i];
                                    if(land.extInfo5){
                                     var arrLand = land.extInfo5.split(',');
                                     for(var k = 0 ; k < arrLand.length; k++){
                                         option += '<option value="' + arrLand[k] + '" >' + arrLand[k] +
                                             '</option>';
                                     }
                                    }
                                    option += '<option value="' + land.milepostName + '" id="'+ land.id + '">' + land.milepostName +
                                        '</option>';
                                }
                                $('#proMilepost select[title="原里程碑名称"]').empty().append(option);
                                for (var i = 0; i <arrVal.length ; i++) {
                                    $(elem + ' select[name="' + arrVal[i].name + '"]').val(arrVal[i].value);
                                }
                                layui.form.render('select');
                            } else {
                                layer.msg(res.message, {
                                    icon: 5
                                });
                            }
                        }, {method: 'post'});
                        layui.admin.req('/api/progress/projectBudgetChange/getByProjectId/'+data[name], {}, function (res){
                            if (res.ok) {
                                var cur = res.data.mapList;
                                var  option='<option value="" >请选择</option>';
                                for (var i = 0; i < cur.length; i++) {
                                    var land = cur[i];
                                    option += '<option value="' + land.name + '" id="' + land.id + '">' + land.name +
                                        '</option>';
                                }
                                $('#proMilepost select[title="新负责人"]').empty().append(option);
                                for (var i = 0; i <leaderArr.length ; i++) {
                                    $(elem + ' select[name="' + leaderArr[i].name + '"]').val(leaderArr[i].value);
                                }
                                layui.form.render('select');
                            } else {
                                layer.msg(res.message, {
                                    icon: 5
                                });
                            }
                        }, {
                            method: 'get'
                        });
                    }
                    if(name=='select_1564473766397_proid'){
                        layui.admin.req('/api/progress/projectBudgetChange/getByProjectId/'+data[name], {}, function (res){
                            if (res.ok) {
                                var cur = res.data.mapList;
                                var  option='<option value="" >请选择</option>';
                                for (var i = 0; i < cur.length; i++) {
                                    var land = cur[i];
                                    option += '<option value="' + land.name + '" id="'+ land.id + '">' + land.name +
                                        '</option>';
                                }
                                $('#projectTable select').empty().append(option);
                                // if(cur.length!=0){
                                //     $('#projectTable select')[0].dataset.name=cur[0].name;
                                //     $('#projectTable select')[0].dataset.id=cur[0].id;
                                // }
                                for (var i = 0; i <arrVal.length ; i++) {
                                    $(elem + ' select[name="' + arrVal[i].name + '"]').val(arrVal[i].value);
                                }
                                layui.form.render();
                            } else {
                                layer.msg(res.message, {
                                    icon: 5
                                });
                            }
                        }, {method: 'get'});
                    }
                    if(name=='select_1562657453349_proid'){
                        projectMemberId=data[name];
                    }
                    break;
                //成员绩效表单下拉框值注入
                case 'selectMember':
                    if(name.split('_')[2]=='usname'){
                        var usname=data[name];
                        layui.admin.req('/api/progress/projectBudgetChange/getByProjectId/'+projectMemberId, {}, function (res){
                            if (res.ok) {
                                var cur = res.data.mapList;
                                var  option='';
                                for (var i = 0; i < cur.length; i++) {
                                    var land = cur[i];
                                    option += '<option value="' + land.name + '" id="' + land.id + '">' + land.name +
                                        '</option>';
                                }
                                $('#projectMemberInfo').empty().append(option);
                                $('#projectMemberInfo').val(usname);
                                layui.form.render('select');
                            } else {
                                layer.msg(res.message, {
                                    icon: 5
                                });
                            }
                        }, {
                            method: 'get'
                        });
                    }

                    break;
                case 'selectBusiness':
                    // 下拉菜单
                    var el = $(elem + ' select[name="' + name + '"]');
                    var arr=[];
                    var str='';
                    if(name.split('_')[2]=='proid'){
                        arr.push(name.split('_')[0]);
                        arr.push(name.split('_')[1]);
                        str=arr.join('_');
                        $(elem + ' select[name="' + str + '"]')[0].dataset.id=data[name];

                    }
                    if(name.split('_')[2]=='proname'){
                        arr.push(name.split('_')[0]);
                        arr.push(name.split('_')[1]);
                        str=arr.join('_');
                        $(elem + ' select[name="' + str + '"]')[0].dataset.name=data[name];
                    }
                    el.val(data[name]);
                    if(name=='selectBusiness_1567406165420_proid'){
                        if(contentArr.length!=0){
                            ADCFormDesignHelper.setProjectContent(data[name],contentArr);
                        }
                    }
                    if(name=='selectBusiness_1562654917409_proid'){
                        projectMemberId=data[name];
                    }
                    break;
                case 'selectResearch':
                    // 下拉菜单
                    var el = $(elem + ' select[name="' + name + '"]');
                    var arr=[];
                    var str='';
                    if(name.split('_')[2]=='proid'){
                        arr.push(name.split('_')[0]);
                        arr.push(name.split('_')[1]);
                        str=arr.join('_');
                        $(elem + ' select[name="' + str + '"]')[0].dataset.id=data[name];

                    }
                    if(name.split('_')[2]=='proname'){
                        arr.push(name.split('_')[0]);
                        arr.push(name.split('_')[1]);
                        str=arr.join('_');
                        $(elem + ' select[name="' + str + '"]')[0].dataset.name=data[name];
                    }
                    el.val(data[name]);
                    break;
                case 'radio':
                    // 单选框
                    var el = $(elem + ' input[name="' + name + '"]');
                    for (var i = 0; i < el.length; i++) {
                        if (el[i].value === data[name]) el[i].checked = true;
                    }
                    if(name=='radio_1564650341241'&&data[name]=='是'){
                        $('.proDepartment').css('display','block');
                    }
                    if(name=='radio_1564650489079'&&data[name]=='是'){
                        $('.proMember').css('display','block');
                    }
                    if(name=='radio_1564650583053'&&data[name]=='是'){
                        $('.proSituation').css('display','block');
                    }
                    if(name=='radio_1564650640720'&&data[name]=='是'){
                        $('.proDate').css('display','block');
                    }
                    if(name=='radio_1564650885130'&&data[name]=='是'){
                        $('.proBudget').css('display','block');
                    }
                    if(name=='radio_1582522007759'&&data[name]=='是'){
                        $('.proLead').css('display','block');
                    }
                    if(name=='radio_1564711119020'&&data[name]=='是'){
                        $('.proMilepost').css('display','block');
                        if(privilege.projectChange=='2'){
                             $('#del_milepost_btn').css('display', 'inline-block');
                             $('#add_milepost_btn').css('display', 'inline-block');
                        }

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

                        // var name = data[elName];
                        // var subname=name.substr(name.lastIndexOf('\\')+1,name.length-1);
                        // $(elem + ' button[name="' + prefix + '_download"]').before('<div class="' + prefix + '_tip">' + subname  + '</div>');
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
                    if (info.length >= 2) {
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
                    if (info.length >= 2) { //做了修改，如果用===来判断，列表控件的内容填入不进去
                        var el = $(elem + ' input[name="' + name + '"]'),
                            oid = data[name + '_usid'],
                            oname = data[name + '_usname'];
                        el.val(data[name]);
                        el.attr('data-usid', oid);
                        el.attr('data-usname', oname);
                    }
                    break;
                case 'selectMember':
                    // 人员选择
                        var el = $(elem + ' select[name="' + name + '"]'),
                            oid = data[name + '_usid'],
                            oname = data[name + '_usname'];
                        el.val(data[name]);
                        el.attr('data-usid', oid);
                        el.attr('data-usname', oname);
                    break;
                default:
                    break;
            }
        }
    },
    // 获取表单内填写的数据 
    formdataGet: (elem) => {
        let obj = {};
        $(elem+' input').each(function(){
            obj[$(this).attr("name")] = $(this).val();
        });
        $(elem+' textarea',elem+' select').each(function(){
            obj[$(this).attr("name")] = $(this).val();
        });
        $(elem+' select').each(function(){
            obj[$(this).attr("name")] = $(this).val();
        });
        console.log(obj, 'obj');
        return obj;
        
        // for (var name in data) {
        //     var type = name.split('_')[0];
        //     switch (type) {
        //         case 'checkbox':
        //             // 复选框，需要手动获取选择的内容
        //             var checkboxArray = $(elem + ' input[name="' + name + '"]'),
        //                 checkboxValue = [];
        //             for (var i = 0; i < checkboxArray.length; i++) {
        //                 if (checkboxArray[i].checked) checkboxValue.push(checkboxArray[i].value);
        //             }
        //             data[name] = checkboxValue.join('|');
        //             break;
        //         case 'inputuserselect':
        //             // 人员选择，增加 usid usname
        //             var el = $(elem + ' input[name="' + name + '"]'),
        //                 usid = el.data('usid'),
        //                 usname = el.data('usname');
        //             data[name + '_usid'] = usid;
        //             data[name + '_usname'] = usname;
        //             break;
        //         case 'selectMember':
        //             // 人员选择，增加 usid usname
        //             var el = $(elem + ' select[name="' + name + '"]'),
        //                 usid = el.data('usid'),
        //                 usname = el.data('usname');
        //             data[name + '_usid'] = usid;
        //             data[name + '_usname'] = usname;
        //             break;

        //         case 'inputorgselect':
        //             // 组织机构选择，增加 id name
        //             var el = $(elem + ' input[name="' + name + '"]'),
        //                 orgid = el.data('id'),
        //                 orgname = el.data('name');
        //             data[name + '_id'] = orgid;
        //             data[name + '_name'] = orgname;
        //             break;
        //         case 'file':
        //             // 文件上传
        //             var info = name.split('_');
        //             if (info.length === 2) {
        //                 var el = document.querySelector(elem + ' input[name="' + name + '"]');
        //                 data[name] = el.dataset.filename;
        //             }
        //             break;
        //         case 'select':
        //             var el = $(elem + ' select[name="' + name + '"]'),
        //                 selectid = el.attr("data-id"),
        //                 selectname =el.attr("data-name");
        //             if(selectid&&selectname){
        //                 data[name + '_proid'] = selectid;
        //                 data[name + '_proname'] = selectname;
        //             }
        //             break;
        //         case 'selectBusiness':
        //             // 组织机构选择，增加 id name
        //             var el = $(elem + ' select[name="' + name + '"]'),
        //                 selectid = el.data('id'),
        //                 selectname = el.data('name');
        //             if(selectid&&selectname){
        //                 data[name + '_proid'] = selectid;
        //                 data[name + '_proname'] = selectname;
        //             }
        //             break;

        //         case 'selectResearch':
        //             // 组织机构选择，增加 id name
        //             var el = $(elem + ' select[name="' + name + '"]'),
        //                 selectid = el.data('id'),
        //                 selectname = el.data('name');
        //             if(selectid&&selectname){
        //                 data[name + '_proid'] = selectid;
        //                 data[name + '_proname'] = selectname;
        //             }
        //             break;
        //         default:
        //             break;
        //     }
        // }
        // return data;
    },
    // 为表单加权限
    formatPriv: (elem, priv) => {
        // 权限控制：0 不可见; 1 只读; 2 可编辑; 3 必填;
        var dealPriv = [
            function (target) {
                target.css('display', 'none');
            },
            function (target) {
                target.attr('disabled', 'disabled');
            },
            function (target) {},
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
                    var temp=el.attr("adcform_validate");
                    if(typeof(temp)!="undefined"){
                        var validate = 'adcformdesign_'+el.attr('adcform_validate').split('_')[1];
                        var varify = el.attr('lay-verify');
                        varify = varify ? varify : '';
                        varify = varify.split('|');
                        if (varify.length === 1 && varify[0] === '') varify = [];
                        varify.push(validate);
                        el.attr('lay-verify', varify.join('|'));
                    }
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
                    if(name=='textarea_1567502854371'&&$('#demoForm').length!=0&&value==1){
                        layui.use(['element','laypage','tree','util','table','form','laydate','layedit'], function () {
                            var layedit = layui.layedit;
                            $('#LAY_layedit_'+layedit.index).contents().find("body").attr('contenteditable',false);
                        })
                    }
                    break;
                case 'selectBusiness':
                    // 下拉菜单
                    var el = $(elem + ' select[name="' + name + '"]');
                    if(value=='1'){
                        $('#adcformdesign-table-td select[title="项目名称"]').removeAttr('lay-search');
                    }
                    dealPriv[value](el);
                    break;
                case 'selectResearch':
                    // 下拉菜单
                    var el = $(elem + ' select[name="' + name + '"]');
                    if(value=='1'){
                        $('#adcformdesign-table-td select[title="项目名称"]').removeAttr('lay-search');
                    }
                    dealPriv[value](el);
                    break;
                case 'select':
                    // 下拉菜单
                    var el = $(elem + ' select[name="' + name + '"]');
                    if(value=='1'){
                        $('#adcformdesign-table-td select[title="项目名称"]').removeAttr('lay-search');
                    }
                    dealPriv[value](el);
                    break;
                case 'selectMember':
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
                            //文件上传控件回显权限控制
                            dealPriv[1](el2);
                            // var el3 = $(elem + ' button[name="' + name + '_download"]');
                            // dealPriv[2](el3);
                            var el4 = $(elem + ' button[name="' + name + '_del"]');
                            el4.css('display', 'none');
                            dealPriv[1](el4);
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
                case 'table':
                    //列表控件
                    var el = $(elem + ' td[name="' + name + '"]');
                    var num = name.split('_')[name.split('_').length-1];
                    var table = el.parent().parent();
                    switch (value) {
                        case 0:
                        case 1:
                            // 不可见 只读
                            for (j = 0;j<table.length;j++){
                                for (i = 1; i < table[j].children.length; i++) {
                                    if(td1 = table[j].rows[i].getAttribute('name') != 'sum'){
                                        var td1 = table[j].rows[i].cells[num - 1].children[0];
                                        td1.disabled = 'disabled';
                                    }
                                }
                            }
                            if(name=='table_1562052646880_2'){
                                $('.pull-right').css('display','none');
                            }
                            break;
                        case 2:
                            // 可编辑
                            break;
                        case 3:
                            //必填
                            for (j = 0;j<table.length;j++){
                                for (i = 1; i < table[j].children.length; i++) {
                                    var td1 = table[j].rows[i].cells[num - 1].children[0];
                                    td1.required = 'required';
                                }
                            }
                            break;
                    }
                    break;
                case 'milepost':
                    // 里程碑权限
                    if(value==1){
                        FormHandle.formatPrivReadonlyForm('.milepost_form')
                    }
                    break;
                case 'projectChange':
                    // 项目变更权限
                    if(value==1){
                        FormHandle.formatPrivReadonlyForm('#proMilepost')
                    }
                    break;
                default:
                    break;
            }
        }
        var dateChange=function(data){
            var str = data.replace(/-/g,'/');
            var date = new Date(str).getTime();
            return date;
        };
        // layui 表单验证
        // layui.form.verify({
        //     // 验证必填单选框是否填写
        //     adcformdesign_radio: function (value, item) {
        //        var endValue= $(item).parent().parent().siblings('.project_input_date').children().children('input').val();
        //         if(endValue&&dateChange(value)>dateChange(endValue)){
        //             return '开始时间大于结束时间，请重新填写'
        //         }
        //     },
        //     // 验证必填单选框是否填写
        //     adcformdesign_radio: function (value, item) {
        //         var required = $(item).attr('lay-verify').indexOf('required') >= 0,
        //             name = $(item).attr('name'),
        //             title = $(item).data('name'),
        //             radioArray = $('input[name="' + name + '"]'),
        //             checked = false;
        //         for (var i = 0; i < radioArray.length; i++) {
        //             if (radioArray[i].checked) checked = true;
        //         }
        //         if (required && !checked) return title + ' 为必填项';
        //     },
        //     // 验证必填复选框是否填写
        //     adcformdesign_checkbox: function (value, item) {
        //         var required = $(item).attr('lay-verify').indexOf('required') >= 0,
        //             name = $(item).attr('name'),
        //             title = $(item).data('name'),
        //             checkboxArray = $('input[name="' + name + '"]'),
        //             checked = false;
        //         for (var i = 0; i < checkboxArray.length; i++) {
        //             if (checkboxArray[i].checked) checked = true;
        //         }
        //         if (required && !checked) return title + ' 为必填项';
        //     },

        //     adcformdesign_none: function (value, item) {},
        //     adcformdesign_mobile: function (value, item) {
        //         if (value != '' && !/^1[3|4|5|6|7|8]\d{9}$/.test(value)) {
        //             return '手机号格式不正确';
        //         }
        //     },
        //     adcformdesign_phone: function (value, item) {
        //         if (value != '' && !/^\d{8}$/.test(value)) {
        //             return '座机号格式不正确';
        //         }
        //     },
        //     adcformdesign_mobileorphone: function (value, item) {
        //         if (value != '' && !/^1[3|4|5|6|7|8]\d{9}$/.test(value) && !/^\d{8}$/.test(value)) {
        //             return '手机号格式不正确';
        //         }
        //     },
        //     adcformdesign_email: function (value, item) {
        //         if ( value!=''&&!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)) {
        //             return '邮箱格式不正确';
        //         }
        //     },
        //     adcformdesign_idcard: function (value, item) {
        //         if (value != '' && !/\d{18}/.test(value)) {
        //             return '身份证号格式不正确';
        //         }
        //     },
        //     adcformdesign_qq: function (value, item) {
        //         if (value != '' && !/\d{6,10}/.test(value)) {
        //             return 'QQ 格式不正确';
        //         }
        //     },
        //     adcformdesign_number: function (value, item) {
        //         try {
        //             var el = $(item);
        //             var tip = el.attr('title') || el.attr('placeholder') || '';
        //         } catch (err) {}
        //         if (!/\d*/.test(value) && value != '') {
        //             return tip + ' 只能输入数字';
        //         }
        //     },
        //     adcformdesign_word: function (value, item) {
        //         try {
        //             var el = $(item);
        //             var tip = el.attr('placeholder') || el.attr('title') || '';
        //         } catch (err) {}
        //         if (!/[\u4e00-\u9fa5]+/.test(value) && value != '') {
        //             return tip + ' 必须包含汉字';
        //         }
        //     },
        //     adcformdesign_english: function (value, item) {
        //         try {
        //             var el = $(item);
        //             var tip = el.attr('title') || el.attr('placeholder') || '';
        //         } catch (err) {}
        //         if (!/[A-Za-z]*/.test(value) && value != '') {
        //             return tip + ' 只能输入英文';
        //         }
        //     }

        // });
    },
    // 为表单加权限 elem 容器选择器名 priv 权限信息
    formatPrivReadonlyForm: (elem) => {
        var inputElem = $(elem + ' input'),
            textareaElem = $(elem + ' textarea'),
            selectElem = $(elem + ' select'),
            buttonElem = $(elem + ' button');
        inputElem.attr('disabled', 'disabled');
        textareaElem.attr('disabled', 'disabled');
        selectElem.attr('disabled', 'disabled');
        buttonElem.attr('disabled', 'disabled');
        $(elem + ' select[title="项目名称"]').removeAttr('lay-search');
        //所有文件控件下载按钮移除只读属性
        for (var i = 0; i <buttonElem.length ; i++) {
            if(buttonElem.eq(i).html()=='下载'){
                buttonElem.eq(i).removeAttr('disabled');
            }
        }
        if($('#projectTable').length!=0){
            $(elem + ' .milepost_info #add_project_btn').css('display','none');
            $(elem + ' .milepost_info #del_project_btn').css('display','none');
            $(elem + ' #projectTable .clickImg').css('display','none');
        }
        if($('#proMilepost').length!=0){
            $('.project_change_form .clickImg').css('display','none');
            $('#add_milepost_btn').css('display','none');
            $('#del_milepost_btn').css('display','none');
        }
        //禁用layui富文本编辑器
        if($('#demoForm').length!=0){
            layui.use(['element','laypage','tree','util','table','form','laydate','layedit'], function () {
                var layedit = layui.layedit;
                $('#LAY_layedit_'+layedit.index).contents().find("body").attr('contenteditable',false);
            })
        }
    },
    // 将表单权限设置为只读
    formatPrivReadonly: (elem, priv) => {
        // 权限控制：0 不可见; 1 只读; 2 可编辑; 3 必填;
        var dealPriv = [
            function (target) {
                target.css('display', 'none');
            },
            function (target) {
                target.attr('disabled', 'disabled');
            },
            function (target) {
                target.attr('disabled', 'disabled');
            },
            function (target) {
                target.attr('disabled', 'disabled');
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
                    break;
                case 'radio':
                    // 单选框
                    var el = $(elem + ' input[name="' + name + '"]');
                    dealPriv[value](el);
                    break;
                case 'checkbox':
                    // 复选框
                    var el = $(elem + ' input[name="' + name + '"]');
                    dealPriv[value](el);

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
                    //禁用layui富文本编辑器
                    if(name=='textarea_1567502854371'&&$('#demoForm').length!=0&&value==1){
                        layui.use(['element','laypage','tree','util','table','form','laydate','layedit'], function () {
                            var layedit = layui.layedit;
                            $('#LAY_layedit_'+layedit.index).contents().find("body").attr('contenteditable',false);
                        })
                    }
                    break;
                case 'select':
                    // 下拉菜单
                    var el = $(elem + ' select[name="' + name + '"]');
                    if(value=='1'){
                        $('#ADCFormDesignHelper-startProcess select[title="项目名称"]').removeAttr('lay-search');
                    }
                    dealPriv[value](el);
                    break;
                case 'selectMember':
                    // 下拉菜单
                    var el = $(elem + ' select[name="' + name + '"]');
                    dealPriv[value](el);
                    break;
                case 'selectBusiness':
                    // 下拉菜单
                    var el = $(elem + ' select[name="' + name + '"]');
                    if(value=='1'){
                        $('#ADCFormDesignHelper-startProcess select[title="项目名称"]').removeAttr('lay-search');
                    }
                    dealPriv[value](el);
                    break;
                case 'selectResearch':
                    // 下拉菜单
                    var el = $(elem + ' select[name="' + name + '"]');
                    if(value=='1'){
                        $('#ADCFormDesignHelper-startProcess select[title="项目名称"]').removeAttr('lay-search');
                    }
                    dealPriv[value](el);
                    break;
                case 'file':
                    // 文件上传
                    var el1 = $(elem + ' input[name="' + name + '"]');
                    var el2 = $(elem + ' button[name="' + name + '_upload"]');
                    // var el3 = $(elem + ' button[name="' + name + '_download"]');
                    var el4 = $(elem + ' button[name="' + name + '_del"]');
                    dealPriv[value](el1);
                    dealPriv[value](el2);
                    // dealPriv[value](el3);
                    dealPriv[value](el4);

                    break;
                case 'table':
                    //列表控件
                    var el = $(elem + ' td[name="' + name + '"]');
                    var num = name.split('_')[name.split('_').length-1];
                    var table = el.parent().parent();
                    switch (value) {
                        case 0:
                        case 1:
                            // 不可见 只读
                            for (i = 1; i < table.children("tr").length; i++) {
                                if(td1 = table[0].rows[i].getAttribute('name') != 'sum') {
                                    var td1 = table[0].rows[i].cells[num - 1].children;
                                    td1[0].disabled = 'disabled';
                                }
                            }
                            break;
                        case 2:
                            // 可编辑
                            break;
                        case 3:
                            //必填
                            for (i = 0; i < table.rows.length; i++) {
                                var td1 = table[0].rows[i].cells[num - 1].children;
                                td1[0].required = 'required';
                            }
                            break;
                    }
                    break;
                case 'milepost':
                    // 里程碑权限
                    if(value==1){
                        FormHandle.formatPrivReadonlyForm('.milepost_form')
                    }
                    break;
                case 'projectChange':
                    // 项目变更权限
                    if(value==1){
                        FormHandle.formatPrivReadonlyForm('#proMilepost')
                    }
                    break;
                default:
                    break;
            }
        }
    },
};
export default FormHandle