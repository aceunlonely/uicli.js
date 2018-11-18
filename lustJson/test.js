var LJ = require('./')


// lustJson
var selectjson= {
    // "loveName" : {
    //     "isLust" : true,
    //     "isKey" : false,
    //     "prompt" : function(lustInfo,lastData){},
    //     "check" : function(lustInfo,data,type){ return {isPass : true , message : "" }},
    //     "regExp" : null,
    //     "selectKeys" : "25,27,33",
    //     "selectValues" : "嫩织,大织,老织",
    //     "type" : "s",
    //     "default" : "嫩织",
    //     "remark" : "请输入oveNmae",
    //     "getRightValue" : function(input,lustInfo,type){ return input + "_real"},
    //     "onCheckRight" : function(data,lustInfo){ console.log("check right :" + data)}
    // },
    // "age" : {
    //     "isLust" : true,
    //     "isKey" : false,
    //     "prompt" : function(lustInfo,lastData){},
    //     "check" : function(lustInfo,data,type){ return {isPass : true , message : "" }},
    //     "regExp" : null,
    //     "selectKeys" : [25,30,32],
    //     "selectValues" : ["嫩织","大织","老织","爱织"],
    //     "type" : "n",
    //     "default" : "1",
    //     "remark" : "测试选择1",
    //     "getRightValue" : function(input,lustInfo,type){ return input + "_real"},
    //     "onCheckRight" : function(data,lustInfo){ console.log("check right :" + data)}
    // },
    "isMan" : "???是否是男生",
    "hobbies": ["basketball","???"],
    "???": null
}

//sxg
var sxg = require('./uiCliSexyGril')

// console.log(LJ.get(selectjson,sxg,{}))
LJ.get(selectjson,sxg,{serial : true}).then(data=>{console.log(data)})