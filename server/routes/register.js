var express = require("express");
var router  = express.Router();
var mongojs = require('mongojs');
var db_xchange = mongojs('mongodb://liang121:123@ds019766.mlab.com:19766/xchange',['user_info']);
//var db_xchange = mongojs('xchange',['user_info']);
var bodyParser = require('body-parser');

router.post('/', function(req,res){
    console.log('this is register');
    db_xchange.user_info.insert(req.body,function(err,doc){
        if(err){
            res.json(err);
        }else{
            res.json('register successfully');
        }
    });
});

module.exports = router;