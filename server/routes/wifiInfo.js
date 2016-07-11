var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    console.log(123);
    res.render({
        responseData:[{
                "name": 'davidLiangWifi',
                "zip": '08536',
                "bindwidth": '20M',
                "password": '1234'
        },  {
                "name": 'NeuWifi',
                "zip": '47906',
                "bindwidth": '4M',
                "password": '4321'
        },  {
                "name": 'RuiWifi',
                "zip": '37240',
                "bindwidth": '16M',
                "password": '1111'
        }]
    });
});
module.exports = router;
