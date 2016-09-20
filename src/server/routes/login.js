var express = require('express');
var router  = express.Router();
var mongojs = require('mongojs');
var connectToDatabase = require ('../connectToDb/connectToDatabase');
var db_xchange = connectToDatabase.connection;
//var db_xchange = mongojs('mongodb://liang121:123@ds019766.mlab.com:19766/xchange',['user_info']);
//var db_xchange = mongojs('xchange',['user_info']);
var bodyParser = require('body-parser');

router.post('/',function(req,res){
    var obj = req.body;
    db_xchange.user_info.findOne({userName:obj.userName},function(err,doc){
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