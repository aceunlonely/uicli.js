require('./config')

var config = require('peeriocjs').module("uicli").invoke("config").sync.config()

// lust module is deal with ??? in json
var util =require('./util')

/**
 * render select lustInfo
 * @param {*} lustInfo 
 */
var renderSelect = function(lustInfo){
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

/**
 * solve lustValue
 * @param {string} value 
 */
var solveLustValue = function(value){
    //???(string)[rue]这里填写你的名字
    //check
    if(value.length == 3){
        return {
            isKey : false,
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
            isKey : false,
            type : type,
            default: defalutValue,
            remark : anno 
        }
}

/**
 * gert 1st lust's pos and lust info
 * @param {*} json 
 * @param {*} dotTree 
 */
var findLustFromJson = function(json,dotTree,fJson,fKey){
    if(!json) return null
    //json must be arry or json
    if(util.Type.isArray(json)){
        for(var i=0;i<json.length;i++){
            var arrayOne = json[i]
            
            if(util.Type.isString(arrayOne))
            {
                if(util.startWith(arrayOne,"???")){
                    var r= solveLustValue(arrayOne)
                    r.isArray =true
                    r.object = json
                    r.index = i
                    r.dotTree = dotTree ? (dotTree + "["+ i + "]") : ('[' + i +']'),
                    r.fJson = fJson
                    r.fKey = fKey
                    r.key = null
                    return r
                }
            }
            if(util.Type.isObject(arrayOne)){
                //if is lust， return lust
                if(arrayOne.isLust){
                    r = arrayOne
                    r.isArray =true
                    r.object = json
                    r.index = i
                    r.dotTree = dotTree ? (dotTree + "["+ i + "]") : ('[' + i +']'),
                    r.fJson = fJson
                    r.fKey = fKey
                    r.key = null
                    return r
                }
                    
                var r = findLustFromJson(arrayOne,(dotTree ? (dotTree + "["+ i + "]") : ('[' + i +']')),json,i)
                if(r!= null)
                    return r
            }
            if(util.Type.isArray(arrayOne)){
                var r = findLustFromJson(arrayOne,(dotTree ? (dotTree + "["+ i + "]") : ('[' + i +']')),json,i)
                if(r!= null)
                    return r
            }
        }
    }
    else if( util.Type.isObject(json)){
        //util.type.isArray(json)
        for( var key in json )
        {
            // name: '???(string)[rue]这里填写你的名字'
            var value = json[key]
            // '???': null
            if(key === "???")
            {
                if(value && value.isLust && value.isKey){
                    var r = value
                    r.object = json
                    r.key = key
                    r.dotTree =  (dotTree ? (dotTree + ".???") : "???")
                    return r;
                }
                return {
                    isKey : true,
                    key : key,
                    object : json,
                    dotTree : (dotTree ? (dotTree + ".???") : "???"),
                    type : null,
                    default: null,
                    remark : null
                }
            }
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
                var r = findLustFromJson(value,( dotTree ? (dotTree + "." + key) : key),json,key)
                if(r!= null)
                    return r
            }
            else if(util.Type.isObject(value)){
                if(value.isLust)
                {
                    var r = value
                    //r.isKey
                    r.isArray = false
                    r.object = json
                    r.key = key
                    r.dotTree = dotTree ? (dotTree + "." + key) : key
                    return r
                }
                var r = findLustFromJson(value,( dotTree ? (dotTree + "." + key) : key),json,key)
                if(r!= null)
                    return r
            }
        }        
    }
    return null; 
}


var getPromptFromLustInfo= function(lustInfo,lastData){
    /*
{ isKey: false,
  type: 'String',
  default: 'rue',
  remark: '这里填写你的名字',
  isArray: false,
  object:
   { name: '???(string)[rue]这里填写你的名字',
     age: '???',
     isMan: '???是否是男生',
     hobbies: [ 'basketball', '???' ],
     lover:
      { name: 'LiSA',
        age: 32,
        '???': null,
        json1: '???',
        hobbies: [Array],
        sister: [Object] },
     '???': null,
     json3: '???' },
  key: 'name',
  dotTree: 'name' }
    */
    var info =""
    //function(lustInfo,lastData){}
    if(lustInfo.prompt && util.Type.isFunction(lustInfo.prompt)){
        info = lustInfo.prompt(lustInfo,lastData)
        if(info && util.Type.isString(info)){
            if(!util.endWith("\r\n")){
                info += "\r\n"
            }
        }
        else{
            info =""
        }
    }
    return  "pliz input " + lustInfo.dotTree + (lustInfo.type ? (" :"+lustInfo.type) : "")
        +(lustInfo.remark ? (" " + lustInfo.remark) : "") +  (lustInfo.regExp ? " " + lustInfo.regExp : "") + "\r\n" + info + lustInfo.dotTree + " : " 
        +(lustInfo.default ? ("("+lustInfo.default+") "):"");
    //pliz input name: string 这里填写你的名字  /acv/g
    //name : (rue)
}

var checkAndUpdateValueByLustInfo= function(value,lustInfo,lastData){
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
                return {
                    isPass : false,
                    isUpdate: false,
                    message : "正则匹配失败"
                } 
            }
        }
        else if(util.Type.isString(lustInfo.regExp)){
            if(!new RegExp(lustInfo.regExp).test(val)){
                return {
                    isPass : false,
                    isUpdate: false,
                    message : "正则匹配失败"
                } 
            }
        }
    }
    // special for isKey
    if(lustInfo.isKey){

        // check function
        //"check" : function(lustInfo,data,type){ return {isPass : true , message : "" }},
        if(lustInfo.check && util.isFunction(lustInfo.check)){
            var result = lustInfo.check(lustInfo,val,"String");
            if(result){
                if(util.Type.isBoolean(result) && !result)
                {
                    return {
                        isPass : false,
                        isUpdate : false,
                        message : ""
                    }
                }
                if(util.Type.isString(result)){
                    return {
                        isPass : false,
                        isUpdate : false,
                        message : result
                    }
                }
                else if(util.Type.isObject(result) && !result.isPass){
                    return {
                        isPass : false,
                        isUpdate : false,
                        message : result.message || result.msg || ""
                    }
                }
            }
        }
        if(!val){
            return {
                isPass : false,
                isUpdate: false,
                message : "key cant be null"
            }
        }
        if(type && type !="String" && config.verbose){
            console.log(lustInfo.dotTree +" doesnt have a type-suit value :" + value )
        }
        // keep lust
        if(lustInfo.object[val] && lustInfo.object[val].isLust && lustInfo.object[val].isKey ==false)
        {
            return {
                isPass : true,
                isUpdate: false,
                message : ""
            }  
        }
        if(lustInfo.object[val] && config.verbose){
            console.log(lustInfo.dotTree +" has already exits :" + value + ",now override it")
        }
        //replace or add @ end
        lustInfo.object[val] = "???"
        return {
            isPass : true,
            isUpdate: false,
            message : ""
        }     
    }
    console.log(type)
    if(type)
    {
        switch(type.toLowerCase()){
            case 'j':
            case 'json':
                try{
                    val = JSON.parse(val)
                }
                catch(ex){
                    return {
                        isPass : false,
                        isUpdate: false,
                        message : ex
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
                    return {
                        isPass : false,
                        isUpdate: false,
                        message : val +' is not a number'
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
                    isPass : false,
                    isUpdate : false,
                    message : ""
                }
            }
            if(util.Type.isString(result)){
                return {
                    isPass : false,
                    isUpdate : false,
                    message : result
                }
            }
            else if(util.Type.isObject(result) && !result.isPass){
                return {
                    isPass : false,
                    isUpdate : false,
                    message : result.message || result.msg || ""
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
    if(lustInfo.isArray)
    {
        //lustInfo.fJson[lustInfo.fKey]= 
        lustInfo.object.splice(lustInfo.index,0 , val)
        return {
            isPass : true,
            isUpdate: false,
            message : ''
        } 
    }
    //console.log(1+ "  " + val)
    lustInfo.object[lustInfo.key] = val
    return {
        isPass : true,
        isUpdate: true,
        message : ''
    } 
}

var atuoCheckAndUpdateValueByLustInfo = function(value,lustInfo){
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
    // special for isKey
    if(lustInfo.isKey){
        delete lustInfo.object[lustInfo.key]
        return
    }
    if(type)
    {
        switch(type.toLowerCase()){
            case 'json':
            case 'j':
                try{
                    val = JSON.parse(val)
                }
                catch(ex){
                    val = null
                }
                break
            case 'number':
            case 'num':
            case 'nu':
            case 'no':
            case 'n':
                if(isNaN(val))
                {
                    val= null
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
    if(lustInfo.isArray)
    {
        //lustInfo.fJson[lustInfo.fKey]= 
        lustInfo.object[lustInfo.index] = null
    }
    else
    {
        //console.log(1+ "  " + val)
        lustInfo.object[lustInfo.key] = val
    }
}


exports.findLustFromJson = findLustFromJson
exports.solveLustValue= solveLustValue
exports.getPromptFromLustInfo = getPromptFromLustInfo
exports.checkAndUpdateValueByLustInfo = checkAndUpdateValueByLustInfo
exports.atuoCheckAndUpdateValueByLustInfo  =atuoCheckAndUpdateValueByLustInfo

exports.renderSelect = renderSelect