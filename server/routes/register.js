var express = require("express");
var router  = express.Router();
var mongojs = require('mongojs');
// var db = mongojs('mongodb://liang121:123@ds017195.mlab.com:17195/mongo_express',['userInfo']);
var db_xchange = mongojs('xchange',['userInfo']);
var bodyParser = require('body-parser');

router.post('/', function(req,res){
    console.log('this is register');
    db_xchange.userInfo.insert(req.body,function(err,doc){
        if(err){
            res.json(err);
        }else{
            res.json('register successfully');
        }
    });
});

module.exports = router;