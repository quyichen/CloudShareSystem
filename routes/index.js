var express = require('express');
var router = express.Router();
var model=require('../model');
var moment=require('moment');//处理时间格式的

router.get('/', function(req, res, next) {
    var account = req.session.account || ''
    var page = req.query.page || 1
    console.log('首页', page)
    var data = {
        total: 0,  // 总共有多页
        curPage: page,
        list: []   // 当前页的文章列表
    }
    var pageSize = 10
    model.connect(function(db) {
        // 1-第一步查询所有文章
        db.collection('articles').find().toArray(function(err, docs) {
            data.total = Math.ceil(docs.length / pageSize)
            // 2-查询当前页的文章列表
            model.connect(function(db) {
                // sort()  limit()  skip()
                db.collection('articles').find().sort({_id: -1}).limit(pageSize).skip((page-1)*pageSize).toArray(function(err, docs2) {
                    if (docs2.length == 0) {
                        res.redirect('/?page='+((page-1) || 1))
                    } else {
                        docs2.map(function(ele, index) {
                            ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss')
                        })
                        data.list = docs2
                    }
                    res.render('index', { account: account, data: data });
                })
            })
        })
    })
});
//渲染注册页
router.get('/regist',function (req,res,next) {
    res.render('regist',{})
})
//渲染登录页
router.get('/login',function (req,res,next) {
    res.render('login',{})

})
//渲染写文章页面
router.get('/write',function (req,res,next) {
    var account=req.session.account
    res.render('write',{account:account})
})
module.exports = router;
