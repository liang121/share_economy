
/*Import dependency*/
var express = require("express");
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var router  = express.Router();





var login = require('./routes/login');
var register = require('./routes/register');
var systemMessagesOperate = require('./routes/systemMessagesOperate');
var bidMessagesOperate = require('./routes/bidMessagesOperate');
var itemsMessagesOperate = require('./routes/itemsMessagesOperate');
var getItemDetial = require('./routes/getItemDetail');
var getQuestions = require('./routes/getQuestions');
var addComment = require('./routes/addComment');
var addAnswer = require('./routes/addAnswer');
var review = require('./routes/reviews');

/*set router*/
app.use(express.static('./src/client/'))
app.use(express.static('./'));




app.use('/shareeconomy/*', express.static('./src/client/index.html'));
app.use('/signIn', express.static('./src/client/index.html'));
app.use('/register', express.static('./src/client/index.html'));
app.use(bodyParser.json());


/*set api*/
app.use('/api/signIn', login);
app.use('/api/registerAccount', register);
app.use('/api/inbox/systemMessages/operate',systemMessagesOperate);
app.use('/api/inbox/bidMessages/operate',bidMessagesOperate);
app.use('/api/inbox/itemsMessages/operate',itemsMessagesOperate);
app.use('/api/itemDetail', getItemDetial);
app.use('/api/question', getQuestions);
app.use('/api/comment', addComment);
app.use('/api/answer', addAnswer);
app.use('/api/review', review);




app.listen(9000);
console.log("server on loading in port 3001");
// module.exports = app;
