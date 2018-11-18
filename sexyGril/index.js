const util = require('./util')
const stdin = require('stdin.js')
const lust = require('./lust')

require('../config')

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
    return util.startWith(str,"???")
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
    var val = value || lustInfo.default
    // type priority 1.(String)value 2. lustInfo.type 3. guess
    var type = lustInfo.type
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
            case 'no':
            case 'n':
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
            }
    }
    //"getRightValue" : function(input,lustInfo,type){ return input + "_real"},
    if(lustInfo.getRightValue && util.Type.isFunction(lustInfo.getRightValue))
    {
        val = lustInfo.getRightValue(val,lustInfo,type) || val
    }
    //check RegExp
    if(lustInfo.regExp){
        if(util.Type.isRegExp(lustInfo.regExp))
        {

            if(!lustInfo.regExp.test(val))
            {
                stdin.writeLine("正则匹配失败[" + lustInfo.regExp + "]:" + val+ "\r\n")
                return {
                    isPass : false
                } 
            }
        }
        else if(util.Type.isString(lustInfo.regExp)){
            if(!new RegExp(lustInfo.regExp).test(val)){
                stdin.writeLine("正则匹配失败[" + lustInfo.regExp + "]:" + val+ "\r\n")
                return {
                    isPass : false
                } 
            }
        }
    }
    // special for isKey
    if(lustInfo.LJ.isKey){
        // check function
        //"check" : function(lustInfo,data,type){ return {isPass : true , message : "" }},
        if(lustInfo.check && util.isFunction(lustInfo.check)){
            var result = lustInfo.check(lustInfo,val,"String");
            if(result){
                if(util.Type.isBoolean(result) && !result)
                {
                    return {
                        isPass : false
                    }
                }
                if(util.Type.isString(result)){
                    stdin.writeLine( result + "\r\n")
                    return {
                        isPass : false
                    }
                }
                else if(util.Type.isObject(result) && !result.isPass){
                    var message = result.message || result.msg || ""
                    if(message){
                        stdin.writeLine( message + "\r\n")
                    }
                    return {
                        isPass : false}
                }
            }
        }
        if(!val){
            stdin.writeLine(  "key cant be null" + "\r\n")
            return {
                isPass : false
            }
        }
        if(type && type !="String" && config.verbose){
            console.log(lustInfo.LJ.dotTree +" doesnt have a type-suit value :" + value )
        }
        const askContinue= (r,j)=>{
            stdin.writeLine("add success:" + lustInfo.LJ.dotTree + " continue to add?\r\nyes/no:(no) ") 
            stdin.readLine().then(data1=>{ 
                if(data1 == "true" || data1 == "yes" || data1 == "y" || data1=="Y"
                    || data1 == "t"){
                    // if continue ,will keep ???
                    r({
                        isPass:true,
                        isKeepLust: true,
                        key: val,
                        value :"???"
                    })
                }
                else{
                    r({
                        isPass:true,
                        key: val,
                        value :"???"
                    })
                }
            })
        }
        // keep lust
        if(lustInfo.LJ.object[val] && lustInfo.LJ.object[val].isLust 
            && lustInfo.LJ.object[val].LJ.isKey ==false)
        {
            return new Promise(askContinue) 
        }
        if(lustInfo.LJ.object[val] && config.verbose){
            console.log(lustInfo.dotTree +" has already exits :" + value + ",now override it")
        }
        return new Promise(askContinue)     
    }
    //console.log(type)
    if(type)
    {
        switch(type.toLowerCase()){
            case 'j':
            case 'json':
                try{
                    val = JSON.parse(val)
                }
                catch(ex){
                    stdin.writeLine(  "json转换异常：" + ex + "\r\n")
                    return {
                        isPass : false
                    } 
                }
                break
            case 'number':
            case 'num':
            case 'no':
            case 'nu':
            case 'n':
                if(isNaN(val))
                {
                    stdin.writeLine(  val +' is not a number' + "\r\n")
                    return {
                        isPass : false
                    } 
                }
                val = parseFloat(val)
                break
            case 'boolean':
            case 'b':
            case 'bool':
            case 'bln':
                if(val.toLowerCase() == "true" || val.toLowerCase() == "t" || val=="1"){
                    val= true
                }
                else
                {
                    val= false
                }
                break;
            case 'null':
                val = null
                break
            }   
    }
    else{
        //guess
        if(!val || val =="null"){
            val = null
        }else if( val == "true"){
            val = true
        }else if(val == "false"){
            val = false
        }else if(!isNaN(val)){
            val = parseFloat(val)
        }
    }
     // check function
    //"check" : function(lustInfo,data,type){ return {isPass : true , message : "" }},
    if(lustInfo.check && util.Type.isFunction(lustInfo.check)){
        var result = lustInfo.check(lustInfo,val,type);
        if(result){
            if(util.Type.isBoolean(result) && !result)
            {
                return {
                    isPass : false
                }
            }
            if(util.Type.isString(result)){
                stdin.writeLine(  result + "\r\n")
                return {
                    isPass : false
                }
            }
            else if(util.Type.isObject(result) && !result.isPass){
                var message = result.message || result.msg || ""
                if(message)
                    stdin.writeLine(  message + "\r\n")
                return {
                    isPass : false
                }
            }
        }
    }
    //onCheckRight
    //"onCheckRight" : function(data,lustInfo){ console.log("check right :" + data)}
    if(lustInfo.onCheckRight && util.Type.isFunction(lustInfo.onCheckRight))
    {
        lustInfo.onCheckRight(val,lustInfo)
    }

    // update
    if(lustInfo.LJ.isArray)
    {
        const askContinue= (r,j)=>{
            stdin.writeLine("add success:" + lustInfo.LJ.dotTree + " continue to add?\r\nyes/no:(no) ") 
            stdin.readLine().then(data1=>{ 
                if(data1 == "true" || data1 == "yes" || data1 == "y" || data1=="Y"
                    || data1 == "t"){
                    // if continue ,will keep ???
                    r({
                        isPass:true,
                        isKeepLust: true,
                        value :val
                    })
                }
                else{
                    r({
                        isPass:true,
                        value :val
                    })
                }
            })
        }
        return new Promise(askContinue)
    }
    return {
        isPass : true,
        value : val
    } 
}