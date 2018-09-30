var stdin = require('stdin.js')
var lust = require('./lust')
var util = require('./util')

global.uicliRunCount =0;

/**
 * satify one lust
 * @param {*} lustInfo 
 */
var satifyOneLust = function(lustInfo){
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
 * 获取默认值
 * @param {*} json 
 */
var getDefaultJson = function(json){
     //deep copy json
     var tgtJson = JSON.parse(JSON.stringify(json))
     function cylceAllLust(){
        var firstLustInfo = lust.findLustFromJson(tgtJson)
        if(firstLustInfo){
            lust.atuoCheckAndUpdateValueByLustInfo("",firstLustInfo)
            cylceAllLust()
        }
    }
    cylceAllLust()
    return tgtJson
}

/**
 * 通过ui交互方式获取realJson
 * @param {json} json 
 */
var uiGetJson =function(json){
    if(global.uicliRunCount++ > 0){
        throw Error("uicli: one more uicli runed @ same time")
    }
    //deep copy json
    var tgtJson = JSON.parse(JSON.stringify(json))
    return new Promise(function(r,j){
        /*
        { isKey: false,
  type: 'String',
  defaut: null,
  remark: '',
  isArray: true,
  object: [ '???(string)', { love: '???(s)', like: [Object] } ],
  index: 0,
  dotTree: 'lover.hobbies[2][0]' }

        */
        function cylceAllLust(){
            var firstLustInfo = lust.findLustFromJson(tgtJson)
            if(firstLustInfo){
                satifyOneLust(firstLustInfo).then(cylceAllLust)
            }
            else{
                stdin.writeLine("======================================================================\r\n")
                console.log(tgtJson)
                stdin.writeLine("remake the json ?\r\nyes/no:(no) ")
                stdin.readLine().then(data2=>{ 
                    if(data2 == "true" || data2 == "yes" || data2 == "y" || data2=="Y"|| data2 == "t"){
                        tgtJson = JSON.parse(JSON.stringify(json))
                        cylceAllLust()
                    }
                    else
                    {
                        r(tgtJson)
                    }
                })
            }
        }
        cylceAllLust()

    });
}

/**
 *  get Json  by ui
 */
exports.uiGetJson = uiGetJson;

/**
 * get default json 
 */
exports.getDefaultJson = getDefaultJson;

exports.satifyOneLust= satifyOneLust;
//exports.findFirstLust = findFirstLust;