var path = require('path');
var fs   = require('fs');
var MongoClient = require('mongodb').MongoClient;
var webshot     = require('webshot');
var formidable  = require('formidable');

exports.homepage = function(request, response){
    console.log('views/index.html',{root: path.resolve(__dirname,'../')});
    response.end("");
}

exports.imagePage = function(req,res){
    MongoClient.connect("mongodb://localhost:27017/images",function(err,db){
	if(err){console.log(err);}
	else{
	    db.createCollection('uploads',function(err,collection){
		if(err){console.log(err);}
		else{
		    collection.findOne({"file":req.params.file},function(err,doc){
			if(!doc){console.log(req.params.file);res.end("Whoops! There's nothing here!");}
			else{
			    res.render('page',{'file':doc.file+doc.ext});
			    res.end();
			}
		    });
		}
	    });
	}
    });
}

exports.takeScreenshotPage = function(req,res){
    res.render('takeScreenshot',{});
    res.end();
}