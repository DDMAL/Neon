var express = require('express'),
    router = express.Router();

router.use('/dish', require('./index'));
module.exports = router;