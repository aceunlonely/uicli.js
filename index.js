var lustjsonJs = require('lustjson.js')
const sexyGirl = require('./sexyGril')

exports.uiGetJson = (json,options)=>{
    options = options || {}
    options.serial = true
    //uicli use serial mode
    return lustjsonJs.get(json,sexyGirl,options)
}

exports.getDefaultJson  = ()=>{
    throw Error('out of time ,unsupported')
}

exports.satifyOneLust= ()=>{
    throw Error('out of time ,unsupported')
}