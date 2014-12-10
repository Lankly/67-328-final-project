var express = require("express");
var path    = require('path');
var app     = express();
var formidable = require('formidable');
var util    =require('util');
var fs      =require('fs-extra');
var morgan  = require('morgan');

var imageRoutes = require('./routes/image.js');
var pageRoutes  = require('./routes/page.js');

app.use(morgan('combined'));
morgan.token('tiny', function(req, res){ return req.headers['content-type']; })
app.use(express.static(__dirname + '/public'));

var port_num = 50000;

app.set('view engine', 'ejs');
//Homepage
app.get('/', function(req,res){
    //This does not work from routes because it would interpret the '../' that must be 
    //added to the path as an attack and is thus invalid
    res.sendFile('views/index.html',{root: path.resolve(__dirname)});
});

//File upload
app.post('/upload',imageRoutes.uploadImage);

//File GET
app.get("/images/:file",function(request,response){
    response.sendFile(__dirname+'/uploads/'+request.params.file);
});

//File page GET
app.get("/uploads/:file",pageRoutes.imagePage);

app.listen(port_num);
console.log("Server lisening on port "+port_num);