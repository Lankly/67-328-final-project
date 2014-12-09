var express = require("express");
var imageRoutes = require('./routes/image.js');
var pageRoutes  = require('./routes/page.js');
var path        = require('path');
var app = express();
var formidable = require('formidable');
var util =require('util');
var fs =require('fs-extra');

var port_num = 50000;

app.set('view engine', 'jade');
//Homepage
app.get('/', function(req,res){
    //This does not work from routes because it would interpret the '../' that must be 
    //added to the path as an attack and is thus invalid
    res.sendFile('views/index.html',{root: path.resolve(__dirname)});
});

//File upload
app.post('/upload',imageRoutes.uploadImage);

app.listen(port_num);
console.log("Server lisening on port "+port_num);