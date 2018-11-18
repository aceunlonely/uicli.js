const util = require('./util')
const stdin = require('stdin.js')
const lust = require('./lusts')

require('../../config')

const config = require('peeriocjs').module("uicli").invoke("config").sync.config()

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


exports.beforeSatifyOneLust = (lustInfo,options)=>{
    // "selectKeys" : [],     abbc,sfdf
    // "selectValues" : [],  asd,asdf
    if(lustInfo.selectKeys){
        if( util.Type.isString(lustInfo.selectKeys)){
            lustInfo.selectKeys= lustInfo.selectKeys.split(",")
        }
        if( util.Type.isString(lustInfo.selectValues)){
            lustInfo.selectValues= lustInfo.selectValues.split(",")
        }
        if(util.Type.isArray(lustInfo.selectKeys) && lustInfo.selectKeys.length >0 ){
            //"getRightValue" : function(input,lustInfo,type){ return input + "_real"},
            if(config.verbose && lustInfo.getRightValue){
                console.log("uicli: lustInfo.getRightValue is override because of selectKeys :" + lustInfo.dotTree)
            }
            lustInfo.getRightValue = function(input,lustInfo,type){
                if(!isNaN(input)){
                    var i = parseInt(input) -1
                    if(i>=0 && i< lustInfo.selectKeys.length)
                    {
                        return lustInfo.selectKeys[i]
                    }
                }
                var index = lustInfo.selectKeys.indexOf(input)
                if(index >-1)
                    return lustInfo.selectKeys[index]
                if(lustInfo.selectValues){
                    index=lustInfo.selectValues.indexOf(input)
                    if(index >-1 && index< lustInfo.selectKeys.length)
                    {
                        return lustInfo.selectKeys[index]
                    }
                }
                return null;
            }
            if(config.verbose && lustInfo.prompt){
                console.log("uicli: lustInfo.prompt is override because of selectKeys :" + lustInfo.dotTree)
            }
            //prompt
            //"prompt" : function(lustInfo,lastData){},
            lustInfo.prompt = function(lustInfo,lastData){
                if(!lustInfo.selectKeys)   return ""
                var p = "";
                for(var i =0;i<lustInfo.selectKeys.length;i++)
                {
                    var v = lustInfo.selectKeys[i]
                    if(lustInfo.selectValues && i < lustInfo.selectValues.length){
                        v= lustInfo.selectValues[i]
                    }
                    p += "["+(i+1)+"] " + v + " "
                }
                if(p.length>0)
                    return p +"\r\n";
                return p;
            }
            //check
            //function(lustInfo,data,type){ return {isPass : true ,isUpdate : false, message : "" }},
            if(config.verbose && lustInfo.check){
                console.log("uicli: lustInfo.check is override because of selectKeys :" + lustInfo.dotTree)
            }
            lustInfo.check =function(lustInfo,data,type){ 
                if(!data)
                    return {isPass : false, message :" pliz select one value"}
                if(lustInfo.selectKeys.indexOf(data)>-1)
                    return {isPass : true ,isUpdate : false, message : "" }
                return {isPass : false, message :" pliz select a right value"}
            }
        }
    }
}

exports.afterSatifyOneLust = (lustInfo,options) =>{}

exports.afterSatifyAllLust = (lustJson,options) =>{
    //结束逻辑
    stdin.writeLine("======================================================================\r\n")
    console.log(lustJson)
    stdin.writeLine("remake the json ?\r\nyes/no:(no) ")
    return new Promise((r,j) =>{
        stdin.readLine().then(data2=>{ 
            if(data2 == "true" || data2 == "yes" || data2 == "y" || data2=="Y"|| data2 == "t"){
                r({
                    isRemakeLustJson : true
                })
            }
            else
            {
                r({
                    isRemakeLustJson : false
                })
            }
        })

    })
    
}

exports.getInputOneLustValue = (lustInfo,lastData,options) =>{
    stdin.writeLine(lust.getPromptFromLustInfo(lustInfo,lastData))
    return stdin.readLine()
}

exports.validateOneLustInfo = (value,lustInfo,lastData,options) =>{

}