require('./config')

var config = require('peeriocjs').module("uicli").invoke("config").sync.config()

// lust module is deal with ??? in json
var util =require('./util')


var solveLustValue = function(value){
    //???(string)[rue]这里填写你的名字
    //check
    if(value.length == 3){
        return {
            isKey : false,
            type : "String",
            defaut: null,
            remark : null
        }
    }
    var val = value.substring(3)
    var type = null;
    //(string)[rue]这里填写你的名字
    if(util.startWith(val,"(") && val.indexOf(")"))
    {
        var typeValue = val.substr(1,val.indexOf(")")-1)
        var val = val.substring(val.indexOf(')')+1)
        switch(typeValue.toLowerCase()){
            case 's':
            case 'string':
                type ="String";
                break
            case 'json':
            case 'j':
                type ="JSON"
                break
            case 'number':
            case 'num':
            case 'n':
                type ="Number";
                break
            case 'b':
            case 'boolean':
            case 'bool':
                tyep ="Boolean"
                break;
            case 'null':
                type ="Null"
                break
            default:
                if(config.verbose)
                {
                    console.log("uicli: type["+ typeValue +"] is not right , auto switch to String :"  + value)
                }
                type = "String"
                break;
        
            }
    }
    //[rue]这里填写你的名字
    var defalutValue = null
    if(util.startWith(val,"[") && val.indexOf("]")){
        var defalutValue = val.substr(1,val.indexOf("]")-1)
        var val = val.substring(val.indexOf(']')+1)
    }
    var anno = val
        return {
            isKey : false,
            type : type,
            defaut: defalutValue,
            remark : anno 
        }
}

/**
 * gert 1st lust's pos and lust info
 * @param {*} json 
 * @param {*} dotTree 
 */
var findLustFromJson = function(json,dotTree){
    if(!json) return null
    for( var key in json )
    {
        // '???': null
        if(key === "???")
        {
            return {
                isKey : true,
                object : json,
                dotTree : (dotTree ? (dotTree + ".???") : "???"),
                type : null,
                defaut: null,
                remark : null
            }
        }
        // name: '???(string)[rue]这里填写你的名字'
        var value = json[key]
        // is String
        if(util.Type.isString(value)){
            if(util.startWith(value,"???"))
            {
                var r = solveLustValue(value)
                r.isArray = false
                r['object'] = json
                r['key'] = key
                r.dotTree = dotTree ? (dotTree + "." + key) : key;
                return r
            }
        }
        // is Array
        else if(util.Type.isArray(value)){
            //todo
        }
        // is JSON
        else if(util.Type.isObject(value)){

        }

        
    }
    return null; 
}



exports.findLustFromJson = findLustFromJson
exports.solveLustValue= solveLustValue