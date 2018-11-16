const util = require('./uitl')

/*
lust.LJ.isArray: 是否是数组对象一员
lust.LJ.object: lustJson
lust.LJ.index:  数组对象中的位置 0 开始，非数据对象没有该属性
lust.LJ.dotTree lustJson所有在的树位置 如： key1.key2[3]
lust.LJ.fJson  父json对象
lust.LJ.fKey  object所在父json的键值
lust.LJ.key   objcet所属的key 值 ，只有 出现在 lust在kv中的v时  及    xxx : "???" 这种情况时  ？？？ 代表lust
lust.LJ.isKey ： lust是否是 kv 中的 k
*/

/**
 *  找到所有的lust
 * @param {*} json 
 * @param {*} dotTree 
 * @param {*} fJson 
 * @param {*} fKey 
 * @param {*} sxg 
 * @param {*} options  { findOne : false}  需要找1个时采用findOne： true
 * */
var getLusts = function(json,dotTree,fJson,fKey,sxg,options){
    if(!json) return []
    if(!sxg) return []
    var lustArray = new Array()
    //json must be arry or json
    if(util.Type.isArray(json)){
        for(var i=0;i<json.length;i++){
            var arrayOne = json[i]
            
            if(util.Type.isString(arrayOne))
            {
                if(sxg.isLustForString && sxg.getLustForString && sxg.isLustForString(arrayOne,options)){
                    var r = sxg.getLustForString(arrayOne,options)
                    r.LJ = r.LJ || {}
                    r.LJ.isKey =false
                    r.LJ.isArray =true
                    r.LJ.object = json
                    r.LJ.index = i
                    r.LJ.dotTree = dotTree ? (dotTree + "["+ i + "]") : ('[' + i +']'),
                    r.LJ.fJson = fJson
                    r.LJ.fKey = fKey
                    r.LJ.key = null
                    lustArray.push(r)
                }
            }else if(util.Type.isObject(arrayOne)){
                //if is lust， return lust
                if(sxg.isLustForObject && sxg.isLustForObject(arrayOne,options)){
                    var r =arrayOne
                    if(sxg.getLustForObject){
                        r = sxg.getLustForObject(arrayOne,options) || arrayOne
                    }
                    r.LJ = r.LJ || {}
                    r.LJ.isArray =true
                    r.LJ.isKey =false
                    r.LJ.object = json
                    r.LJ.index = i
                    r.LJ.dotTree = dotTree ? (dotTree + "["+ i + "]") : ('[' + i +']'),
                    r.LJ.fJson = fJson
                    r.LJ.fKey = fKey
                    r.LJ.key = null
                    lustArray.push(r)
                }
                else
                {
                    var r = getLusts(arrayOne,(dotTree ? (dotTree + "["+ i + "]") : ('[' + i +']')),json,i,sxg,options)
                    if(r!= null)
                        lustArray = lustArray.concat(r)
                }
            }else if(util.Type.isArray(arrayOne)){
                var r = getLusts(arrayOne,(dotTree ? (dotTree + "["+ i + "]") : ('[' + i +']')),json,i,sxg,options)
                if(r!= null)
                    lustArray = lustArray.concat(r)
            }
            //find one
            if(options && options.findOne && lustArray.length > 0){
                return lustArray
            }
        }
    }
    else if(util.Type.isObject(json)){
        //util.type.isArray(json)
        for( var key in json )
        {
            // name: '???(string)[rue]这里填写你的名字'
            var value = json[key]
            // '???': null
            if(sxg.isLustForKV && sxg.isLustForKV(key,value,options))
            {
                var r = getLustForKV(key,value,options)
                if(!r) r = {}
                r.LJ = r.LJ || {}
                r.LJ.isKey = true
                r.LJ.key = key
                r.LJ.object = json
                r.LJ.dotTree =(dotTree ? (dotTree + ".???") : "???")
                lustArray.push(r)
            }
            // is String
            else if(util.Type.isString(value)){
                if(sxg.isLustForString && sxg.getLustForString && sxg.isLustForString(arrayOne,options))
                {
                    var r = sxg.getLustForString(arrayOne,options)
                    r.LJ = r.LJ || {}
                    r.LJ.isKey =false
                    r.LJ.isArray =false
                    r.LJ.object = json
                    r.LJ.index = i
                    r.LJ.dotTree = dotTree ? (dotTree + "." + key) : key
                    r.LJ.fJson = fJson
                    r.LJ.fKey = fKey
                    r.LJ.key = null
                    lustArray.push(r)
                }
            }
            // is Array
            else if(util.Type.isArray(value)){
                var r = getLusts(value,( dotTree ? (dotTree + "." + key) : key),json,key,sxg,options)
                if(r!= null)
                    lustArray = lustArray.concat(r)
            }
            else if(util.Type.isObject(value)){
                //if is lust， return lust
                if(sxg.isLustForObject && sxg.isLustForObject(value,options)){
                    var r =value
                    if(sxg.getLustForObject){
                        r = sxg.getLustForObject(value,options) || value
                    }
                    r.LJ = r.LJ || {}
                    r.LJ.isArray =false
                    r.LJ.isKey =false
                    r.LJ.object = json
                    r.LJ.index = 0
                    r.LJ.dotTree = dotTree ? (dotTree + "." + key) : key
                    r.LJ.fJson = fJson
                    r.LJ.fKey = fKey
                    r.LJ.key = key
                    lustArray.push(r)
                }
                else
                {
                    var r = getLusts(value,( dotTree ? (dotTree + "." + key) : key),json,key,sxg,options)
                    if(r!= null)
                        lustArray = lustArray.concat(r)
                }
            }
            if(options && options.findOne && lustArray.length>0)
                return lustArray
        }        
    }
    return lustArray
}


/**
 * 获取lustJson值
 * @param {*} lustJson 欲望json
 * @param {*} sxg 性感女孩 解决器
 * @param {*} options 选择项
 */
var get = function(lustJson,sxg,options){
    if(sxg.prelude){
        sxg.prelude(options)
    }
    //deep copy json
    var iJson = Object.assign({}, json)
    return new Promise(function(r,j){

        //serial
        function cylceAllLustSerial(options){
            var firstLustInfo = getLusts(iJson,null,null,null,sxg,options)
            firstLustInfo = firstLustInfo.length >0 ? firstLustInfo[0] : null
            if(firstLustInfo){
                lust.renderSelect(firstLustInfo)
                satifyOneLust(firstLustInfo).then(cylceAllLustSerial)
            }
            else{
                stdin.writeLine("======================================================================\r\n")
                console.log(tgtJson)
                stdin.writeLine("remake the json ?\r\nyes/no:(no) ")
                stdin.readLine().then(data2=>{ 
                    if(data2 == "true" || data2 == "yes" || data2 == "y" || data2=="Y"|| data2 == "t"){
                        tgtJson = JSON.parse(JSON.stringify(json))
                        cylceAllLustSerial()
                    }
                    else
                    {
                        r(tgtJson)
                    }
                })
            }
        }
        //是否串行 is Serial
        if(options.serial){
            options =Object.assign({}, options)
            options.findOne = true
            cylceAllLustSerial(options)
        }
        else{
            //并行lust
        }
    });
}


exports.get= get //function(lustJson,resolver,resolverConf){console.log("get")}

