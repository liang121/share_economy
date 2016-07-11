var express = require("express");
var app = express();
var mongojs = require('mongojs');
var db = mongojs('mongodb://liang121:123@ds017195.mlab.com:17195/mongo_express',['userInfo']);
var bodyParser = require('body-parser');

app.use(express.static('../client/'))
app.use(express.static('../'));
app.use('/shareeconomy/*', express.static('../client/index.html'));
app.use(bodyParser.json());

// app.get('/economyInfo',function(req,res){
//     console.log("This is home page");
//     db.wifiInfo.find(function(err,resp){
//         res.json(resp);
//     })
// });
// app.post('/economyInfo',function(req,res){
//     db.wifiInfo.insert(req.body,function(err,resp){
//         db.wifiInfo.find(function(err,resp){
//             res.json(resp);
//         })
//     });
// })
app.post('/registerAccount', function(req,res){
    db.userInfo.insert(req.body,function(err,doc){
        if(err){
            res.json(err);
        }else{
            res.json('register successfully');
        }
    });
})
app.post('/signIn',function(req,res){
    var obj = req.body;
    db.userInfo.findOne({userName:obj.userName},function(err,doc){
        if(err){
            res.json(err);
        }else{
            if(doc){
                if(doc.password === obj.password){
                    res.json('signIn successfully');
                }else{
                    res.json('password not correct');
                }
            }else{
                res.json('user name not correct');
            }
            
        }
    })
})
app.listen(3001);
console.log("server on loading in port 3000");
