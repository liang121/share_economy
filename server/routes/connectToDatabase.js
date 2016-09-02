var express = require("express");
//var router  = express.Router();
var mongojs = require('mongojs');
//var db_xchange =; 
//var exports = module.exports = {};
//exports.db_xchange = db_xchange;
module.exports = {
	db_xchange:  mongojs('mongodb://liang121:123@ds019766.mlab.com:19766/xchange',['answer_question'])
}