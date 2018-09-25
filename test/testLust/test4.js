var lust = require('../../lust')
var uicli = require('../../index')

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

function print(){
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    console.log(json)
    console.log("======================")
    console.log(lust.findLustFromJson(json))
    //console.log("----------------------------")
    //console.log(lust.getPromptFromLustInfo(lust.findLustFromJson(json)))
    uicli.satifyOneLust(lust.findLustFromJson(json)).then(()=>{
        console.log("#####################################")
        console.log(json)
    })
    //satifyOneLust
}

//print()

json.name ="LiSA"

//print()

json.age =32

//print()

json.isMan = true

print()
// json.hobbies[1] = "xxx"

// //print()

// delete json.lover["???"]

// // print()

// json.lover.json1 ="sxb"

// // print()

// json.lover.hobbies[1] = "xxxxx"

// print()

// and so on 