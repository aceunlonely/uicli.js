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
        var cycle = function(){
            stdin.writeLine(lust.getPromptFromLustInfo(lustInfo))
            return stdin.readLine().then(data=>{
                var cr =lust.checkAndUpdateValueByLustInfo(data,lustInfo)
                if(cr.isPass)
                {
                    if(!cr.isUpdate){
                        stdin.writeLine("add success:" + lustInfo.dotTree + " continue to add?\r\nyes/no:(no)")         
                        stdin.readLine().then(data1=>{ 
                            if(data1 == "true" || data1 == "yes" || data1 == "y" || data1=="Y"
                                || data1 == "t"){
                                // if continue ,will keep ???
                                r()
                            }
                            else{
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
                    cycle()
                }
            })
        }

        cycle()
    })
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
        var firstLustInfo = lust.findLustFromJson(tgtJson)
        if(firstLustInfo){
            

            
        }
        else{
            r(tgtJson)
        }

    });
}

exports.uiGetJson = uiGetJson;
exports.satifyOneLust= satifyOneLust;
//exports.findFirstLust = findFirstLust;