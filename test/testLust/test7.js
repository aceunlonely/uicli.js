var uicli = require('../../')

var json= {
    "name" : "???(string)[rue]这里填写你的名字",
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
    "age" : "???",
    "isMan" : "???是否是男生",
    "hobbies": ["basketball","???"],
    "???": null,
    "json3": "???"
}