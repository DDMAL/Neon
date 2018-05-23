var express = require('express');
var fs = require('fs');
var multer = require('multer');

var router = express.Router();

//////////////////
/// Index routes//
//////////////////

//Main Page
router.route('/')
    .get(function (req, res) {
        fs.readdir(__base + 'public/uploads/mei', function(err, files){
            if (err) {
                res.status(500).send(err);
                return 
            }
        res.render('index', {'files': files});
    });
});                                                                      

//File upload using Multer
var storage = multer.diskStorage({
    destination: function ( req, file, cb ) {
        cb(null,  __dirname + '../../../public/uploads');
    },   
    filename: function ( req, file, cb ) {
        cb(null, file.originalname);
    }
});

var upload = multer({ 
    storage: storage,
    limits: {filesize: 1000000, files: 2} ,
}).array('resource', 2);

router.route('/upload_file')
    .post(function(req, res) {
        upload(req, res, function (err) {
            //Check if two files were uploaded
            if (req.files.length != 2){
                for (i=0; i<req.files.length; i++){
                    fs.unlink( __base + 'public/uploads/' + req.files[i].originalname, function (err){
                        if (err){
                            return console.log("failed to delete file");
                        }
                    });  
                }
                fs.readdir(__base + 'public/uploads/mei', function(err, files){
                    res.render('index', {'files': files, 'err': "Error: must upload two files"});
                });
                return;    
            }
            //rename img file to have same name as MEI
            var files = [req.files[0].originalname, req.files[1].originalname];
            var meiSplit = files[0].split(".", 2);
            var filename = meiSplit[0];
            var meiext = meiSplit[1];
            var imgext = files[1].split(".", 2)[1];
            files[1] = filename + "." + imgext;

            //Check if valid filetypes
            if (meiext != "mei" || imgext != "png"){
                for (i=0; i<files.length; i++){
                    fs.unlink( __base + 'public/uploads/' + files[i], function (err){
                        if (err){
                            return console.log("Failed to delete file");
                        }
                    })
                }
                fs.readdir(__base + 'public/uploads/mei', function(err, files){
                    res.render('index', {'files': files, 'err': "Error: Invalid file type"});
                });
                return;
            }
            //Move files into their folders
            else{
                for(i=0; i<files.length; i++){
                    file = files[i];
                    filext = file.split(".", 2)[1];
                    fs.rename(__base + 'public/uploads/' + files[i], __base + 'public/uploads/'+ filext + '/' + files[i], function (err){
                        if (err){
                            return console.log("Failed to rename file");
                        }
                    });         
                }
            }
            //reload page
            res.redirect('/');
        });
    });

//Delete file
router.route('/delete/:filename')
    .get(function (req, res){
        file = req.params.filename;
        fs.unlink( __base + 'public/uploads/mei/' + file, function (err){
            if (err){
                return console.log("failed to delete file");
            }
        })
        res.redirect('/');
    });

//Redirect
router.route('/edit/:filename')
    .get(function (req, res) {
        res.render('editor', {'meifile': req.params.filename});
    });

/////////////////
/// NEON routes//
/////////////////

router.route('/save/:filename')
.post(function (req, res) {
    fs.writeFile(__base + 'public/mei/' + req.body.fileName, 
        req.body.meiData,
        function(err) {
            if(err) {
                return console.log(err);
            }
        }
    )
    console.log("File saved to " + req.body.fileName);
});

module.exports = router;