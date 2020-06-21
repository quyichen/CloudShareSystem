var express = require('express');
var router = express.Router();
var model=require('../model');//引入model
var moment=require('moment');

router.get('/',function (req,res,next) {
    var name=req.session.name
    var page=req.query.page||1
    var data={
        total:0,//总共页数
        nowPage:page,//当前页数
        list:[],//当前页的文章列表
    }
    var pageSize=5//每页5条文章
    model.connect(function (db) {
        //第一步查询所有文章
        db.collection('articles').find().toArray(function(err,docs){
            data.total=Math.ceil(docs.length/pageSize)
            //第二步查询当前页的文章列表
            model.connect(function (db) {
                db.collection('articles').find().sort({_id:-1}).limit(pageSize).skip((page-1)*pageSize).toArray(function (err,docs2) {
                    if(docs2.length==0){
                        res.redirect('?page='+((page-1)||1))
                    }else{
                        docs2.map(function (ele,index) {
                            ele['time']=moment(ele.id).format('YYYY-MM-DD HH:mm:ss');
                        })
                        data.list=docs2
                        res.render('index',{name:name,data});
                    }
                })
            })
        })
    })
})

//渲染注册页
router.get('/regist',function (req,res,next) {
    res.render('regist',{})
})
//渲染登录页
router.get('/login',function (req,res,next) {
    res.render('login',{})

})
//渲染写文章页&&编辑文章页面
router.get('/write',function (req,res,next) {
    var name=req.session.name||''
    var id=parseInt(req.query.id)
    var page=req.query.page
    var item={
        title:'',
        content:'',
        class:'',
    }
    if(id){//编辑
        model.connect(function (db) {
            db.collection('articles').findOne({id:id},function(err,docs){
                if(err){
                    console.log("查询失败")
                }else{
                    item=docs
                    item['page']=page
                    res.render('write',{name:name,item:item})
                }
            })
        })
    }else{//新增
        res.render('write',{name:name,item:item})
    }
})
//渲染关于页
router.get('/about',function (req,res,next) {
    var name=req.session.name;
    model.connect(function (db) {
        db.collection('about').find({}).toArray(function (err,docs) {
            if(err){
                console.log("查找失败",err)
            }else{
                console.log("查询成功",docs)
                var data={
                    Appname:docs[0].Appname,
                    Appinfo:docs[0].Appinfo,
                    AppStroy:docs[0].AppStroy,
                    Appbirth:docs[0].Appbirth,
                    AppTeam:docs[0].AppTeam,
                }
                res.render('about',{name:name,data:data})
            }
        })
    })
})
module.exports = router;
