var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('time-use-simulation');
});

module.exports = router;
