var express = require('express');
var router = express.Router();

router.route('/')
    .get(function (req, res, next) {
        res.sendFile(__base + 'views/index.html');
    });

module.exports = router;