var express = require("express");
var mongojs = require('mongojs');
function connectToDatabase(){
	var db_xchange = mongojs('mongodb://liang121:123@ds019766.mlab.com:19766/xchange',['answer_question','user_info','item_detail','system_messages','bid_messages','item_messages']); 
	return db_xchange;
}
module.exports.connection = connectToDatabase();
