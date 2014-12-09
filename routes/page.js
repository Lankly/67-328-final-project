var path = require('path');
var fs   = require('fs');

exports.homepage = function(request, response){
    console.log('views/index.html',{root: path.resolve(__dirname,'../')});
    response.end("");
}