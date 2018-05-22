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

//File upload
var storage = multer.diskStorage({
    destination: __dirname + '../../../public/uploads', 
    limits: {filesize: 1000000, files: 2} ,
    filename: function ( req, file, cb ) {
        cb( null, file.originalname);
    }
});

var upload = multer({ 
    storage: storage 
});

router.route('/upload_file')
    .post(upload.array('resource', 2) ,function(req, res){
        if (req.files.length != 2){
            return console.log("Must upload 2 files!");
        }
        else{
            var files = [req.files[0].originalname, req.files[1].originalname];
            console.log(files);
            filename = files[0].split(".", 2)[0];
            imgext = files[1].split(".", 2)[1];
            newImg = filename + "." + imgext;

            for(i=0; i<2; i++){
                file = files[i];
                filext = file.split(".", 2)[1];
                if(filext === "mei"){
                    fs.rename(__base + 'public/uploads/' + file, __base + 'public/uploads/mei/' + file, function (err){
                        if (err) throw err;
                    });
                }
                else if(filext === "png"){
                    fs.rename(__base + 'public/uploads/' + file, __base + 'public/uploads/img/' + newImg, function (err){
                        if (err) throw err;
                    });
                }
                else{
                    return console.log("invalid file type!");
                }           
            }
        }
        res.redirect('/');
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
