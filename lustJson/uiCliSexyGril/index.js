const util = require('./util')

//只能同时调用一次
global.uicliRunCount=0




exports.prelude = function(options){
    if(global.uicliRunCount++ > 0){
        throw Error("uicli: one more uicli runed @ same time")
    }
}


exports.smile = {}

/**
 * 判断字符串是否是Lust
 */
exports.isLustForString = (str,options) =>{
    return util.startWith(arrayOne,"???")
}

/**
 * 获取lust of String
 */
exports.getLustForString = function(str,options){
    var value =str
    //???(string)[rue]这里填写你的名字
    //check
    if(value.length == 3){
        return {
            type : null,
            default: null,
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
            case 'nu':
            case 'n':
            case 'no':
                type ="Number";
                break
            case 'b':
            case 'boolean':
            case 'bool':
            case 'bln':
                type ="Boolean"
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
        type : type,
        default: defalutValue,
        remark : anno 
    }
}


exports.isLustForObject = (obj,options) =>{
    return obj.isLust
}

exports.getLustForObject =(obj,options)=>{
    return obj
} 

exports.isLustForKV = (k,v,options)=>{
    return k === "???"
}

exports.getLustForKV = (k,v,options) => {
    var value = v
    if(value && value.isLust && value.isKey){
        var r = value
        return r;
    }
    return null;
}
