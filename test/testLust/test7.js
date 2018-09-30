var uicli = require('../../')

//test select
var selectjson= {
    "loveName" : {
        "isLust" : true,
        "isKey" : false,
        "prompt" : function(lustInfo,lastData){},
        "check" : function(lustInfo,data,type){ return {isPass : true , message : "" }},
        "regExp" : /test(\d+)/,
        "selectKeys" : [],
        "selectValues" : [],
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
        "selectValues" : ["嫩织","大织","老织"],
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


//test check
//test regExp
//test getRightValue
//test prompt