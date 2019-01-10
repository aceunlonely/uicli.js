var uicli = require('../../')


var alljson= {
    "loveName" : {
        "isLust" : true,
        "isKey" : true,
        "prompt" : function(lustInfo,lastData){ return lustInfo.dotTree + " " + lastData + "prompt test"},
        "check" : function(lustInfo,data,type){ return {isPass : true ,isUpdate : false, message : "" }},
        "regExp" : "\\d+",
        "selectKeys" : "25,27,33",
        "selectValues" : "little,young,old",
        "type" : "",
        "default" : "织部里沙",
        "remark" : "请输入中文名",
        "getRightValue" : function(input,lustInfo,type){ return input + "_real"},
        "onCheckRight" : function(data,lustInfo){ console.log("check right :" + data)}
    },
    "age" : {
        "isLust" : true,
        "isKey" : false,
        "prompt" : function(lustInfo,lastData){},
        "check" : function(lustInfo,data,type){ return {isPass : true , message : "" }},
        "regExp" : null,
        "selectKeys" : ["25","30","32"],
        "selectValues" : ["小织","大织","老织","老老织"],
        "type" : "n",
        "default" : "1",
        "remark" : "测试选择1",
        "getRightValue" : function(input,lustInfo,type){ return input + "_real"},
        "onCheckRight" : function(data,lustInfo){ console.log("check right :" + data)}
    },
    "isMan" : "???是否是男生",
    "hobbies": ["basketball","???"],
    "???": null,
    "json3": "???"
}

//test select
var selectjson= {
    "loveName" : {
        "isLust" : true,
        "isKey" : false,
        "prompt" : function(lustInfo,lastData){},
        "check" : function(lustInfo,data,type){ return {isPass : true , message : "" }},
        "regExp" : null,
        "selectKeys" : "25,27,33",
        "selectValues" : "小织,大织,老织",
        "type" : "s",
        "default" : "嫩织",
        "remark" : "请输入oveNmae",
        "getRightValue" : function(input,lustInfo,type){ return input + "_real"},
        "onCheckRight" : function(data,lustInfo){ console.log("check right :" + data)}
    },
    "age" : {
        "isLust" : true,
        "isKey" : false,
        "prompt" : function(lustInfo,lastData){},
        "check" : function(lustInfo,data,type){ return {isPass : true , message : "" }},
        "regExp" : null,
        "selectKeys" : ["25","30","32"],
        "selectValues" : ["小织","大织","老织","诗织"],
        "type" : "n",
        "default" : "1",
        "remark" : "测试选择1",
        "getRightValue" : function(input,lustInfo,type){ return input + "_real"},
        "onCheckRight" : function(data,lustInfo){ console.log("check right :" + data)}
    },
    "isMan" : "???是否是男生",
    "hobbies": ["basketball","???"],
    "???": null,
    "json3": "???"
}

// uicli.uiGetJson(selectjson).then(data=>{ console.log("+++++++++++++++++++++++++++++++++++++")
//     console.log(data)
// })

//test check
//test regExp
//test select


var regExpjson= {
    "loveName" : {
        "isLust" : true,
        "isKey" : false,
        "prompt" : function(lustInfo,lastData){},
        "check" : null,
        "regExp" : /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/,
        "selectKeys" : null,
        "selectValues" : null,
        "type" : "s",
        "default" : "23:10:15",
        "remark" : "请输入hh:mm:ss",
        "getRightValue" : null,
        "onCheckRight" : function(data,lustInfo){ console.log("check right :" + data)}
    },
    "level" :  {
        "isLust" : true,
        "isKey" : false,
        "prompt" : function(lustInfo,lastData){},
        "check" : null,
        "regExp" : '^\\d{1}$',
        "selectKeys" : null,
        "selectValues" : null,
        "type" : "n",
        "default" : "1",
        "remark" : "请输入一位数字",
        "getRightValue" : null,
        "onCheckRight" : function(data,lustInfo){ console.log("check right :" + data)}
    }
}

uicli.uiGetJson(regExpjson).then(data=>{ console.log("+++++++++++++++++++++++++++++++++++++")
    console.log(data)
})

//test getRightValue
//test prompt
