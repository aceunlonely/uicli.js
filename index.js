

global.uicliRunCount =0;





/**
 * 通过ui交互方式获取realJson
 * @param {json} json 
 */
var uiGetJson =function(json){
    if(global.uicliRunCount++ > 0){
        return new Promise(function(){console.log("uicli: running uicli can be only one @ any time")});
    }
    process.stdin.setEncoding('utf8');
    process.stdin.on('end', () => {
        process.stdout.write('end');
        global.uicliRunCount =0;
        process.stdin.pause()
    });
    //deep copy json
    var resultJson = JSON.parse(JSON.stringify(json))
    //resume
    process.stdin.resume();
    return new Promise(function(resolve,reject){
        //find lust



        process.stdin.on('data', (data) => {
            var chunk = data//process.stdin.read();
            if (chunk !== null) {
              process.stdout.write(`data: ${chunk}`);
            }
            resolve()
            process.stdin.emit('end');
          });

    });

}

exports.uiGetJson = uiGetJson;
//exports.findFirstLust = findFirstLust;