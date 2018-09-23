var main = require('./')

var json = require('./sundry/test.json')

// main.uiGetJson(json).then(function(){
//     return new Promise(function(r,j){
//         main.uiGetJson(json).then(function(){
//             r()
//         })
//     });
//     }).then(function(){console.log("hello good bye")}).catch(function(){console.log('hello bad bye')})


main.findFirstLust(json)