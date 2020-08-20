var recordApi = {};
var baseUrl = "http://m7zahi.natappfree.cc";
recordApi.getById = function (id) {
    if (!id) {
        return null;
    }
    var data = localStorage.getItem(id);
    if (data) {
        return JSON.parse(localStorage.getItem(id));
    }
    return null;
};

recordApi.getBaseInfo = function (taskContentId) {
    var data = {
        "taskCode": "MT20MENUA070A", //任务编号
        "companyCheck": "雅迪", //委托单位
        "companyCheckTel": "15888525852", //委托单位电话
        "companyCheckFax": "512236", //委托单位传真
        "companyCheckAddress": "接口收的房间内你", //委托单位地址
        "companyCheckMail": "542285@qq.com", //委托单位邮箱
        "branch": "机构1", //分支机构
        "principal": "ljka", //委托人
        "sampleInfoList": [{
            "model": "", //型号
            "vin": "v0", //vin
            "sampleCode": "000", //样品编号
            "sampleConfigInfoList": [{
                "configName": "High", //配置名称
                "configDetails": "高" //配置描述
            }]
        }, {
            "model": "m1",
            "vin": "v1",
            "sampleCode": "111",
            "sampleConfigInfoList": [{
                "configName": "Medium",
                "configDetails": "中"
            }]
        }, {
            "model": "m2",
            "vin": "v2",
            "sampleCode": "222",
            "sampleConfigInfoList": [{
                "configName": "Low",
                "configDetails": "低"
            }]
        }],
        "terminalList": [{
            "bz": "台架", 
            "code": "MT20MENUAwr", 
            "terminalStatus": "检定中", //设备状态 1:正常 ,2:带检,3:检定中
        }]
    };

    return data;
};

recordApi.save = function (fromData) {
    var keys = fromData.keys();
    var data = {};
    data["id"] = "record" +new Date().getTime();
    if (fromData.get("id")) {
        data["id"] = fromData.get("id");
    }
    data["name"] = fromData.get("name");
    data["sampleCode"] = fromData.get("sampleCode");
    data["configName"] = fromData.get("configName");
    data["taskContentId"] = fromData.get("taskContentId");
    //获取ssjson数据
    var reader = new FileReader();
    reader.onload = function (event) {
        data["content"] = reader.result;//内容就在这里
        localStorage[data["id"]] = JSON.stringify(data);
    };
    reader.readAsText(fromData.get("ssjson"));
    //console.log(JSON.stringify(data));
    return data["id"];
};

recordApi.searchTerminal = function (data) {
    var retuData;
    
    return {
        list: [{
            "createDate": "2015-03-12",
            "name": "台架101",
            "model": "11111111111",
            "useDepartment": "科室1",
            "code": "MT20MENUAwr123"
        },
        {
            "createDate": "2015-03-12",
            "name": "台架101",
            "model": "11111111111",
            "useDepartment": "科室1",
            "code": "MT20MENUAwr124"
        },
        {
            "createDate": "2015-03-12",
            "name": "台架101",
            "model": "11111111111",
            "useDepartment": "科室1",
            "code": "MT20MENUAwr125"
        },
        {
            "createDate": "2015-03-12",
            "name": "台架101",
            "model": "11111111111",
            "useDepartment": "科室1",
            "code": "MT20MENUAwr126"
        },
        {
            "createDate": "2015-03-12",
            "name": "台架101",
            "model": "11111111111",
            "useDepartment": "科室1",
            "code": "MT20MENUAwr127"
        }, {
            "createDate": "2015-03-12",
            "name": "台架101",
            "model": "11111111111",
            "useDepartment": "科室1",
            "code": "MT20MENUAwr128"
        },
        {
            "createDate": "2015-03-12",
            "name": "台架101",
            "model": "11111111111",
            "useDepartment": "科室1",
            "code": "MT20MENUAwr129"
        },
        {
            "createDate": "2015-03-12",
            "name": "台架101",
            "model": "11111111111",
            "useDepartment": "科室1",
            "code": "MT20MENUAwr130"
        },
        {
            "createDate": "2015-03-12",
            "name": "台架101",
            "model": "11111111111",
            "useDepartment": "科室1",
            "code": "MT20MENUAwr131"
        },
        {
            "createDate": "2015-03-12",
            "name": "台架101",
            "model": "11111111111",
            "useDepartment": "科室1",
            "code": "MT20MENUAwr132"
        }
        ],
        total: 1682
    };
};
