var express = require("express");
var router  = express.Router();
var mongojs = require('mongojs');
var connectToDatabase = require ('../connectToDb/connectToDatabase');
var db_xchange = connectToDatabase.connection;
//var db_xchange = mongojs('mongodb://liang121:123@ds019766.mlab.com:19766/xchange',['answer_question']); 
//var db_xchange = mongojs('xchange',['answer_question']);
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