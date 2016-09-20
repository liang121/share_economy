var express = require("express");
var router  = express.Router();
var mongojs = require('mongojs');
var connectToDatabase = require ('../connectToDb/connectToDatabase');
var db_xchange = connectToDatabase.connection;
//var db_xchange = mongojs('mongodb://liang121:123@ds019766.mlab.com:19766/xchange',['answer_question']); 
//var db_xchange = mongojs('xchange',['answer_question']);
var bodyParser = require('body-parser');
router.post('/add',function(req,res){
    var itemId = req.body.itemId;
    var questionIndex = req.body.questionIndex;
    var answerObj = req.body.answerObj;
    console.log(req.body);
    //pushQuery.$push['questionContents.$.answers.'+answerIndex+'.comments'] = commentObj;
    db_xchange.answer_question.update(
        {
            itemId:'1002431',
            'questionContents.questionId': questionIndex
        },
        {
            $push: {'questionContents.$.answers':answerObj},
            $inc: {'questionContents.$.answersNum':1}
        },
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