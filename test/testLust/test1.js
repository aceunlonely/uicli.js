var json = require('./jsons/1.json')

console.log(json);

console.log('delete json["age"] ================================================')
delete json["age"]
console.log(json)

console.log('delete json["lover"]["name"] ================================================')
delete json["lover"]["name"]
console.log(json)

