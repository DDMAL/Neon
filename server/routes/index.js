var express = require('express');
var fs = require('fs');
var multer = require('multer');

var router = express.Router();

//////////////////
/// Index routes//
//////////////////

var uploadi = multer({
    dest: __dirname + '../../../public/img' ,
    limits: {filesize: 1000000, files:1}
})

var uploadm = multer({
    dest: __dirname + '../../../public/mei' ,
    limits: {filesize: 1000000, files:1}
})

router.route('/')
    .get(function (req, res) {    
        fs.readdir(__base + 'public/mei', function(err, files){
            if (err) {
                res.status(500).send(error);
                return
            }
            res.render('index', {'files': files});
        });
});

//fins a way to make this one function
router.route('/upload_mei')
    .post(uploadm.single("file"), function(req, res){
    });

router.route('/upload_img')
    .post(uploadi.single("image"), function(req, res){    
    });

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