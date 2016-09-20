var express = require("express");
var router  = express.Router();
var mongojs = require('mongojs');
var connectToDatabase = require ('../connectToDb/connectToDatabase');
var db_xchange = connectToDatabase.connection;
//var db_xchange = mongojs('mongodb://liang121:123@ds019766.mlab.com:19766/xchange',['bid_messages']); 
//var db_xchange = mongojs('xchange',['bid_messages']);
var bodyParser = require('body-parser');
router.post('/',function(req,res){

    var idArray = req.body.selectedItemsId;
    var action = req.body.action;
    var array = [];
    if(idArray){
        for(var i=0; i<idArray.length; i++){
            array.push(mongojs.ObjectId(idArray[i]));
        }
    }

    updateMessageItem(array,action);
    function updateMessageItem (idArray,action){
        switch (action){
            case 'UR':
                updateUnread(idArray);
                break;
            case 'R':
                updateRead(idArray);
                break;
            case 'D':
                updateDelete(idArray);
            case 'G':
                updateGet();
        }
    }
    function updateGet(){
        db_xchange.bid_messages.find(
            function(err,doc){
                if(err){
                    return res.send(err);
                }else{
                    return res.json(doc);
                }
            })
    }
    function updateUnread(idArray){
        db_xchange.bid_messages.update(
            {_id:{$in:idArray}},
            {$set:{isReaded:false}},
            {multi: true}
            ,function(err,doc){
                console.log(err);
                if(err){
                    return res.send(err);
                }else{
                    return res.send({message:'mark as unread successfully'});
                }
            })

    }
    function updateRead(idArray){
        db_xchange.bid_messages.update(
            {_id:{$in:idArray}},
            {$set:{isReaded:true}},
            {multi: true}
            ,function(err,doc){
                console.log(err);
                if(err){
                    return res.send(err);
                }else{
                    return res.send({message:'mark as read successfully'});
                }
            })
    }
    function updateDelete(idArray){
        db_xchange.bid_messages.remove({_id:{$in:idArray}},function(err,doc){
            if(err){
                return res.send(err);
            }else{
                return res.send({message:'delete successfully'})
            }
        });
    }
})
module.exports = router;