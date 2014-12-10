var fs = require('fs-extra');
var MongoClient = require('mongodb').MongoClient;
var randomstring= require('randomstring');
var path = require('path');
var formidable = require('formidable');
var util = require('util');

// Does not work because response.sendFile won't send from here
exports.getImage = function(request,response){
    if(request.params.file==null){response.end("Invalid file name!");}
    else{
	var pathToFile=path.resolve(__dirname+'/../uploads/'+request.params.file);
	response.writeHead(200, {'content-type': 'text/html'});
	response.sendFile(pathToFile);
	response.end(pathToFile);
    }
}



exports.uploadImage = function(req,res){
    var form = new formidable.IncomingForm();
    var title= "N/A";
    var file_name="start";
    var file_ext =".txt";
    form.parse(req, function(err, fields, files) {
	res.writeHead(200, {'content-type': 'text/html'});
	//res.write('received upload:\n\n');
	//res.write(util.inspect({fields: fields, files: files}));
	title = fields.title;
    });

    form.on('end', function(fields, files) {
    /* Temporary location of our uploaded file */
	var temp_path = this.openedFiles[0].path;
	file_ext=path.extname(this.openedFiles[0].name);
    /* The file name of the uploaded file */
	while(file_name=="start" || fs.exists(file_name+file_ext)){
	    file_name = randomstring.generate(31);
	}
	res.write("\n\nsaved as: "+file_name+file_ext);
    /* Location where we want to copy the uploaded file */
	var new_location = 'uploads/';

	fs.copy(temp_path, new_location + file_name+file_ext, function(err) {  
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
			/*Example of deleting everything in a collection*/
			/* ---------------------------------------- */
			/* *** REMOVE THIS IN THE FINAL VERSION *** */
			/* ---------------------------------------- */
			collection.remove({title:title},function(err,res){console.log(err?err:res);});

			collection.insert([{
			    'title':title,
			    'file':file_name,
			    'ext' :file_ext,
			    'tags':[]
			}],function(err,result){console.log(err?err:"insert successful");});
			
			/* Example of a find query and iterating over it */
			collection.find({title:title},function(err,cursor){
			    if(err){console.log(err);}
			    else{
				console.log("All Documents with"+title+" as the title...");
				cursor.each(function(err,result){console.log(err?err:result?result:"done");});
			    }
			});
			
			res.write(" <a href=\'http://localhost:50000/images/"+file_name+file_ext+"\'>Click here</a>");
			res.end();
		    }
		});
	    }
	});

    });
}

exports.removeImage = function(req,res){
    
}