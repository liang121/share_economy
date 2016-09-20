var express = require("express");
var router  = express.Router();
var mongojs = require('mongojs');
var connectToDatabase = require ('../connectToDb/connectToDatabase');
var db_xchange = connectToDatabase.connection;
var bodyParser = require('body-parser');
router.get('/getReviews/:accountName',function(req,res){
    var accountName = req.params.accountName;
    db_xchange.account_review.findOne(
        {
            accountName:accountName,
        },
        function(err,doc){
            if(err){
                return res.send(err);
            }else{
                return res.json(doc);
            }
        }
    )
    
});
router.post('/addComment', function(req,res){
	var accountName = req.body.accountName;
	var reviewIndex = req.body.reviewIndex;
	var commentContent = req.body.commentFieldContent;
	db_xchange.account_review.update(
		{
			accountName:accountName,
			'reviews.reviewIndex': reviewIndex
		},
		{
			$push: {'reviews.$.comments': commentContent},
			$inc: {'reviews.$.commentsNum':1}
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