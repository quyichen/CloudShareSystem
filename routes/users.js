var express = require('express');
var router = express.Router();
var model=require('../model');//导入model

//用户注册接口
router.post('/regist',function (req,res,next) {
    var data={//根据标签的name属性，通过req.body.name属性取得前端传来的数据
        account:req.body.account,
        name:req.body.name,
        password:req.body.password,
    }
    model.connect(function (db) {
        db.collection('users').insertOne(data,function(err,ret){
            if(err){
                console.log("注册失败")
                res.redirect('/regist')
            }
            else{
                res.redirect('/login')
            }
        })

    })
})
//登录接口
router.post('/login',function(req,res,next){
    var data={
        account:req.body.account,
        name:req.body.name,
        password:req.body.password,
    }
    model.connect(function (db) {
        db.collection('users').find(data).toArray(function(err,docs){
            if(err){
                res.redirect('/login')
            }
            else{
                if(docs.length>0){//查询成功
                    //登陆成功,进行session会话存储
                    req.session.name=data.name
                    res.redirect('/')
                }
                else{
                    res.redirect('/login')
                }
            }
        })
    })
    console.log("用户登录",data)
})
//退出登录
router.get('/logout',function (req,res,next){
    req.session.name=null
    res.redirect('/')
}

)
module.exports = router;
