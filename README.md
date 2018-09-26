# uicli.js
uicli tool for json....,implement for node

## install
* npm i uicli.js -g

## try it 
npm i uicli.js -g
uicli


## use @ npm
```javascript
var uicli = require('uicli.js')

var json = {
    "name" : "???(string)[rue]这里填写你的名字",
    "age" : "???"
}

uicli.uiGetJson(json).then(data =>{
    console.log("hello good day")
})

```
or complex @
```javascript
var uicli = require('uicli.js')

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

uicli.uiGetJson(json).then(data =>{
    console.log("hello good day")
})

```

## switch info lang
    //todo
    set env: uicli_lang = en
    or
    set env: uicli_lang = cn

    or lang @ config.json 

