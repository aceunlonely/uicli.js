var lust = require('../../lust')

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

// console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
// console.log(json)
// console.log("======================")
// console.log(lust.findLustFromJson(json))

json.name ="LiSA"

// console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
// console.log(json)
// console.log("======================")
// console.log(lust.findLustFromJson(json))

json.age =32

// console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
// console.log(json)
// console.log("======================")
// console.log(lust.findLustFromJson(json))

json.isMan = true

// console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
// console.log(json)
// console.log("======================")
// console.log(lust.findLustFromJson(json))
json.hobbies[1] = "xxx"

// console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
// console.log(json)
// console.log("======================")
// console.log(lust.findLustFromJson(json))

delete json.lover["???"]

// console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
// console.log(json)
// console.log("======================")
// console.log(lust.findLustFromJson(json))

json.lover.json1 ="sxb"

// console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
// console.log(json)
// console.log("======================")
// console.log(lust.findLustFromJson(json))

json.lover.hobbies[1] = "xxxxx"

console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
console.log(json)
console.log("======================")
console.log(lust.findLustFromJson(json))

// and so on 