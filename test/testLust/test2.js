
var Type = (function() {
    var type = {};
    var typeArr = ['String', 'Object', 'Number', 'Array','Undefined', 'Function', 'Null', 'Symbol'];
    for (var i = 0; i < typeArr.length; i++) {
        (function(name) {
            type['Is' + name] = function(obj) {
                return Object.prototype.toString.call(obj) == '[object ' + name + ']';
            }
        })(typeArr[i]);
    }
    return type;
})();

console.log(Object.prototype.toString.call({ name : "sdfsd"}))
console.log(Object.prototype.toString.call({}))

function a (){}
console.log(Object.prototype.toString.call(new a()))
