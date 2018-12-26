console.log(' here is  out of time , ignore it')
var uicli = require('../../')

var json= {
    "name" : "???(string)[rue]这里填写你的名字",
    "age" : "???",
    "isMan" : "???是否是男生",
    "hobbies": ["basketball","???"],
    "lover" : {
        "name" : "LiSA",
        "age" : 32,
        "???" : null,
        "json1":"???",
        "hobbies": ["sing","???(string)",["???(string)",{ "love" : "???(s)", "like" : { "???": ""}}]],
        "sister":{
            "name":"???(string)[rue]这里填写她的名字",
            "age" : "???(n)[28]请输入她的年龄",
            "isMan": "???(b)[false]",
            "json2": "???(j)[{'name' : 'LiSA2'}]"
        }
    },
    "???": null,
    "json3": "???"
}

console.log(uicli.getDefaultJson(json))

var json = {
    "name" : "???(string)[rue]这里填写你的名字",
    "age" : "???"
}

console.log(uicli.getDefaultJson(json))