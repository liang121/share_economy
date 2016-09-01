var express = require("express");
var router  = express.Router();
var mongojs = require('mongojs');

// var db = mongojs('mongodb:liang121:123@ds017195.mlab.com:17195/mongo_express',['userInfo']); 
var db_xchange = mongojs('xchange',['answer_question']);
var bodyParser = require('body-parser');
router.get('/:itemId',function(req,res){
    var itemId = req.params.itemId; 
    db_xchange.answer_question.findOne(
        {itemId:itemId},
        function(err,doc){
            if(err){
                return res.send(err);
            }else{
                return res.json(doc);
            }
        }
    )
    
})
 module.exports = router;