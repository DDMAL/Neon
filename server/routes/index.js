var express = require('express');
var fs = require('fs');

var router = express.Router();

router.route('/')
    .get(function (req, res) {
        res.sendFile(__base + 'views/index.html');
    });

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