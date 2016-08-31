var express = require("express");
var router  = express.Router();
var mongojs = require('mongojs');
// var db = mongojs('mongodb://liang121:123@ds017195.mlab.com:17195/mongo_express',['userInfo']);
var db_xchange = mongojs('xchange',['userInfo']);
var bodyParser = require('body-parser');

router.post('/',function(req,res){
    var obj = req.body;
    db_xchange.userInfo.findOne({userName:obj.userName},function(err,doc){
        if(err){
            res.json(err);
        }else{
            if(doc){
                if(doc.password === obj.password){
                    doc.status = 'success';
                    res.json(doc);
                }else{
                    res.json('password not correct');
                }
            }else{
                res.json('user name not correct');
            }

        }
    })
})
module.exports = router;