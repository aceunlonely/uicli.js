
const util = require('./util')

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


exports.getPromptFromLustInfo = getPromptFromLustInfo