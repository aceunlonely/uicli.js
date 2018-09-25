require('./config')

var config = require('peeriocjs').module("uicli").invoke("config").sync.config()

// lust module is deal with ??? in json
var util =require('./util')

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
            defaut: defalutValue,
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
                    return r
                }
            }
            if(util.Type.isObject(arrayOne) || util.Type.isArray(arrayOne)){
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
            else if(util.Type.isArray(value) || util.Type.isObject(value)){
                var r = findLustFromJson(value,( dotTree ? (dotTree + "." + key) : key),json,key)
                if(r!= null)
                    return r
            }
        }        
    }
    return null; 
}


var getPromptFromLustInfo= function(lustInfo){
    /*
{ isKey: false,
  type: 'String',
  defaut: 'rue',
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
    return "pliz input " + lustInfo.dotTree + (lustInfo.type ? (" :"+lustInfo.type) : "")
        +(lustInfo.remark ? (" " + lustInfo.remark) : "") + "\r\n" + lustInfo.dotTree + " : " 
        +(lustInfo.defaut ? ("("+lustInfo.defaut+") "):"");
    //pliz input name: string 这里填写你的名字
    //name : (rue)
}

var checkAndUpdateValueByLustInfo= function(value,lustInfo){
    var val = value || lustInfo.defaut
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
            case 'n':
                type ="Number";
                break
            case 'b':
            case 'boolean':
            case 'bool':
                type ="Boolean"
                break;
            case 'null':
                type ="Null"
                break
            }
    }
    // special for isKey
    if(lustInfo.isKey){
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
    if(type)
    {
        switch(type){
            case 'JSON':
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
            case 'Number':
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
            case 'Boolean':
                if(val.toLowerCase() == "true" || val.toLowerCase() == "t" || val=="1"){
                    val= true
                }
                else
                {
                    val= false
                }
                break;
            case 'Null':
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


exports.findLustFromJson = findLustFromJson
exports.solveLustValue= solveLustValue
exports.getPromptFromLustInfo = getPromptFromLustInfo
exports.checkAndUpdateValueByLustInfo = checkAndUpdateValueByLustInfo