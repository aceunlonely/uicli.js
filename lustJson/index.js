const util = require('./util')

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
 * satify one lust
 * @param {*} lustInfo 
 */
var satifyOneLust = function(lustInfo,options){
    return new Promise(function(r,j){
        var cycle = function(lastData){
            stdin.writeLine(lust.getPromptFromLustInfo(lustInfo,lastData))
            return stdin.readLine().then(data=>{
                var cr =lust.checkAndUpdateValueByLustInfo(data,lustInfo,lastData)
                if(cr.isPass)
                {
                    if(!cr.isUpdate){
                        stdin.writeLine("add success:" + lustInfo.dotTree + " continue to add?\r\nyes/no:(no) ")         
                        stdin.readLine().then(data1=>{ 
                            if(data1 == "true" || data1 == "yes" || data1 == "y" || data1=="Y"
                                || data1 == "t"){
                                // if continue ,will keep ???
                                r()
                            }
                            else{
                                //console.log(lustInfo)
                                if(lustInfo.isArray){
                                    //lustInfo.fJson[lustInfo.fkey] = 
                                    lustInfo.object.splice(lustInfo.index+1,1) 
                                }
                                else if(lustInfo.isKey){
                                    delete lustInfo.object[lustInfo.key]
                                }
                                r()
                            }
                        })
                        
                    }
                    else
                    {
                        r()
                    }
                }
                else
                {
                    stdin.writeLine(cr.message + "\r\n")
                    cycle(data)
                }
            })
        }

        cycle()
    })
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
    var iJson = Object.assign({}, lustJson)
    return new Promise(function(r,j){

        //serial
        function cylceAllLustSerial(options){
            var firstLustInfo = getLusts(iJson,null,null,null,sxg,options)
            if(firstLustInfo.length >0){
                firstLustInfo = firstLustInfo[0]
                if(sxg.beforeSatifyOneLust){
                    var pOrNot = sxg.beforeSatifyOneLust(firstLustInfo,options)
                    //判断是否是promise
                    if(pOrNot && pOrNot.then){
                        pOrNot.then(data =>{
                            satifyOneLust(firstLustInfo,options).then(()=>{
                                if(sxg.afterSatifyOneLust){
                                    sxg.afterSatifyOneLust(firstLustInfo,options)
                                }
                                cylceAllLustSerial(options)
                            })
                        })
                    }
                    else{
                        satifyOneLust(firstLustInfo,options).then(()=>{
                            if(sxg.afterSatifyOneLust){
                                sxg.afterSatifyOneLust(firstLustInfo,options)
                            }
                            cylceAllLustSerial(options)
                        })
                    }
                }
                else
                {
                    satifyOneLust(firstLustInfo,options).then(()=>{
                        if(sxg.afterSatifyOneLust){
                            sxg.afterSatifyOneLust(firstLustInfo,options)
                        }
                        cylceAllLustSerial(options)
                    })
                }
                
            }
            else{
                if(sxg.afterSatifyAllLust){
                    var pOrNot = sxg.afterSatifyAllLust(iJson,options)
                    //这边是是否重新make的逻辑，可扩展其他方式
                    if(pOrNot){
                        if(pOrNot.then){
                            pOrNot.then(result =>{
                                if(result.isRemakeLustJson){
                                    iJson = Object.assign({}, json)
                                    cylceAllLustSerial(options)
                                }
                                else{
                                    r(iJson)
                                }
                            })
                        }
                        else
                        {
                            if(pOrNot.isRemakeLustJson){
                                iJson = Object.assign({}, json)
                                cylceAllLustSerial(options)
                            }
                            else
                            {
                                r(iJson)
                            }
                        }
                    }
                    else
                        r(iJson)
                }
                else
                {
                    r(iJson)
                }
            }
        }
        //是否串行 is Serial 默认并行
        if(options.serial){
            options =Object.assign({}, options)
            options.findOne = true
            cylceAllLustSerial(options)
        }
        else{
            //并行lust todo
        }
    });
}


exports.get= get //function(lustJson,resolver,resolverConf){console.log("get")}

