var express = require("express");
var router  = express.Router();
var mongojs = require('mongojs');
var connectToDatabase = require ('../connectToDb/connectToDatabase');
var db_xchange = connectToDatabase.connection;
//var db_xchange = mongojs('mongodb://liang121:123@ds019766.mlab.com:19766/xchange',['item_detail']); 
//var db_xchange = mongojs('xchange',['item_detail']);
var bodyParser = require('body-parser');
router.get('/:itemId',function(req,res){
    var itemId = req.params.itemId; 
    db_xchange.item_detail.findOne(
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