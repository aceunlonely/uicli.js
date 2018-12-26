var Type = (function() {
    var type = {};
    var typeArr = ['String', 'Object', 'Number', 'Array','Undefined', 'Function', 'Null', 'Symbol','Boolean','RegExp'];
    for (var i = 0; i < typeArr.length; i++) {
        (function(name) {
            type['is' + name] = function(obj) {
                return Object.prototype.toString.call(obj) == '[object ' + name + ']';
            }
        })(typeArr[i]);
    }
    return type;
})();

var endWith=function(str,s){
    if(s==null||s==""||str.length==0||s.length>str.length)
       return false;
    if(str.substring(str.length-s.length)==s)
       return true;
    else
       return false;
   }
var startWith=function(str,s){
    if(s==null||s==""|| str==null || str==""||str.length==0||s.length>str.length)
       return false;
    if(str.substr(0,s.length)==s)
       return true;
    else
       return false;
   }



exports.Type = Type
exports.endWith =endWith
exports.startWith = startWith


// exports.indexOf = (arr,one) =>{
//    for(var i = 0;i<arr.length;i++){
//       if(arr[i] == one)
//          return i
//    }
//    return -1
// }