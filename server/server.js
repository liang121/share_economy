
/*Import dependency*/
var express = require("express");
var app = express();
var mongojs = require('mongojs');
// var db = mongojs('mongodb://liang121:123@ds017195.mlab.com:17195/mongo_express',['userInfo']);
// var db_userInfo = mongojs('xchange',['userInfo']);
var bodyParser = require('body-parser');
var router  = express.Router();

var login = require('./routes/login');
var register = require('./routes/register');
var systemMessagesOperate = require('./routes/systemMessagesOperate');
var bidMessagesOperate = require('./routes/bidMessagesOperate');
var itemsMessagesOperate = require('./routes/itemsMessagesOperate');
var getItemDetial = require('./routes/getItemDetail');


/*set router*/

app.use(express.static('../client/'))
app.use(express.static('../'));
// app.use('/*', express.static('../client/index.html'));
app.use('/shareeconomy/*', express.static('../client/index.html'));
app.use('/signIn', express.static('../client/index.html'));
app.use('/register', express.static('../client/index.html'));
app.use(bodyParser.json());


/*set api*/
app.use('/api/signIn', login);
app.use('/api/registerAccount', register);
app.use('/api/inbox/systemMessages/operate',systemMessagesOperate);
app.use('/api/inbox/bidMessages/operate',bidMessagesOperate);
app.use('/api/inbox/itemsMessages/operate',itemsMessagesOperate);
app.use('api/itemDetail', getItemDetial);




// app.post('/api/registerAccount', function(req,res){
//     console.log('this is register');
//     db_userInfo.userInfo.insert(req.body,function(err,doc){
//         if(err){
//             res.json(err);
//         }else{
//             res.json('register successfully');
//         }
//     });
// })
// router.post('/signIn',function(req,res){
//     var obj = req.body;
//     db_userInfo.userInfo.findOne({userName:obj.userName},function(err,doc){
//         if(err){
//             res.json(err);
//         }else{
//             if(doc){
//                 if(doc.password === obj.password){
//                     doc.status = 'success';
//                     res.json(doc);
//                 }else{
//                     res.json('password not correct');
//                 }
//             }else{
//                 res.json('user name not correct');
//             }
//
//         }
//     })
// })
app.listen(3001);
console.log("server on loading in port 3001");
// module.exports = app;
