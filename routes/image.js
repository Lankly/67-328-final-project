var fs = require('fs-extra');
var MongoClient = require('mongodb').MongoClient;
var randomstring= require('randomstring');
var path = require('path');
var formidable = require('formidable');
var util = require('util');

exports.getImage = function(request,response){
    response.end("It works!");
}

exports.uploadImage = function(req,res){
    var form = new formidable.IncomingForm();
    var title= "N/A";
    form.parse(req, function(err, fields, files) {
	res.writeHead(200, {'content-type': 'text/plain'});
	res.write('received upload:\n\n');
	res.write(util.inspect({fields: fields, files: files}));
	title = fields.title;
    });

    form.on('end', function(fields, files) {
    /* Temporary location of our uploaded file */
	var temp_path = this.openedFiles[0].path;
    /* The file name of the uploaded file */
	var file_name = "start";
	while(file_name=="start" || fs.exists(file_name)){
	    file_name = randomstring.generate(31)+path.extname(this.openedFiles[0].name);
	}
	res.end("\n\nsaved as: "+file_name);
    /* Location where we want to copy the uploaded file */
	var new_location = 'uploads/';

	fs.copy(temp_path, new_location + file_name, function(err) {  
	    if (err) {
		console.error(err);
	    } else {
		console.log("success!");
	    }
	});

	/* Save the filename to the database */
	MongoClient.connect("mongodb://localhost:27017/images",function(err,db){
	    if(err){return console.log(err);}
	    else{
		db.createCollection('uploads',function(err,collection){
		    if(err){console.log(err);}
		    else{
			collection.insert([{
			    'title':title,
			    'file':file_name
			}],function(err,result){console.log(err?err:"insert successful");});
			
			/* Example of a find query and iterating over it */
			collection.find({title:title},function(err,cursor){
			    if(err){console.log(err);}
			    else{
				cursor.each(function(err,result){console.log(err?err:result?result:"done");});
			    }
			});
			/*Example of deleting everything in a collection every time a query is run*/
			/* ---------------------------------------- */
			/* *** REMOVE THIS IN THE FINAL VERSION *** */
			/* ---------------------------------------- */
			collection.remove({title:title},function(err,res){console.log(err?err:res);});
		    }
		});
	    }
	});

    });
}