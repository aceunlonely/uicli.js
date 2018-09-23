// lust module is deal with ??? in json
var util =require('./util')

var findLustFromJson = function(json,dotTree){
    if(!json) return null
    for( var key in json )
    {
        // '???': null
        if(key === "???")
        {
            return {
                isKey : true,
                json : json,
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
                //todo
            }
        }
        // is Array
        else if(util.Type.isArray(value)){

        }
        // is JSON
        else if(util.Type.isObject(value)){

        }

        
    }
    return null; 
}



exports.findLustFromJson = findLustFromJson