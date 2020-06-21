var express = require('express');
var router = express.Router();
var model=require('../model');//导入model
var moment=require('moment');
var multiparty=require('multiparty')
var fs=require('fs')
//新增文章、编辑
router.post('/add',function(req,res,next){
    var id=parseInt(req.body.id)
    var data={
        page:req.body.page,//从隐藏于获得page
        title:req.body.title,
        class:req.body.class,
        content:req.body.content,
        id:Date.now(),
        name:req.session.name
    }
    if(id){//编辑
        model.connect(function (db) {
            db.collection('articles').updateOne({id:id},{$set:{
                title:data.title, class:data.class, content:data.content
                }},function (err,ret) {
                if(err){
                    console.log("修改失败")
                }
                else{
                    console.log("修改成功")
                    res.redirect('/?page='+data.page)
                }
            })
        })
    }else{//新增
        model.connect(function (db) {
            db.collection('articles').insertOne(data,function(err,ret){
                if(err){
                    console.log("文章发表失败")
                    res.redirect('/write')
                }else{
                    res.redirect('/')
                }
            })
        })
    }
})
router.post('/queryByClass',function (req,res,next) {
    var name = req.session.name;
    var data = {class:req.body.class};
    console.log(data)
    model.connect(function (db) {
        db.collection("articles").find(data).toArray(function (err, docs) {
            console.log("文章列表", docs);
            var list = docs;
            list.map(function (ele, index) {
                ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss');
            })
            res.render('query', {name: name, list: list});
        });
    });
})
//按标题模糊查询
router.post('/queryByTitle',function (req,res,next) {
    var name = req.session.name;
    var data ={title:req.body.title};
    model.connect(function (db) {
        db.collection("articles").find(data).toArray(function (err, docs) {
            console.log("文章列表", docs);
            var list = docs;
            list.map(function (ele, index) {
                ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss');
            })
            res.render('queryByTitle', {name: name, list: list});
        });
    });
})
//删除接口
router.get('/delete',function (req,res,next) {
    var id=parseInt(req.query.id);
    var page=req.query.page;
    model.connect(function (db) {
        db.collection('articles').deleteOne({id:id},function (err,ret) {
            if(err){
                console.log("删除失败")
            }else{
                console.log("删除成功")
            }
            res.redirect('/?page='+page)
        })
    })
})
//渲染详情页
router.get('/detail',function (req,res,next) {
    var id=parseInt(req.query.id)
    var name=req.session.name
    model.connect(function (db) {
        db.collection('articles').findOne({id:id},function (err,docs) {
            if(err){
                console.log("查询失败",err)
            }
            else{
                var item=docs
                item['time']=moment(item.id).format('YYYY-MM-DD HH:mm:ss')//将时间戳转化为时间
                res.render('detail',{name:name,item:item})
            }
        })
    })
})
//图片上传
router.post('/upload',function (req,res,next) {
    var form=new multiparty.Form()
    form.parse(req,function(err,fields,files){
        if(err){
            console.log("上传失败",err)
        }else{
            console.log(files)
            var file=files.filedata[0]
            var rs=fs.createReadStream(file.path)//读本地文件路径
            var newPath='/uploads/'+file.originalFilename
            var ws=fs.createWriteStream('./public'+newPath)
            rs.pipe(ws)
            ws.on('close',function () {
                 console.log("文件上传成功")
                 res.send({err:'',msg:newPath})
            })
        }
    })
})

//codeLife列表
router.get('/codeList',function(req,res,next){
    var data ={class:req.query.class};
    var name = req.session.name;
    model.connect(function (db) {
        db.collection("articles").find(data).toArray(function (err, docs) {
            console.log("文章列表", docs);
            var list = docs;
            list.map(function (ele, index) {
                ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss');
            })
            res.render('./list/code', {name: name, list: list});
        });
    });

})
//news列表
router.get('/news',function(req,res,next){
    var data ={class:req.query.class};
    var name = req.session.name;
    model.connect(function (db) {
        db.collection("articles").find(data).toArray(function (err, docs) {
            console.log("文章列表", docs);
            var list = docs;
            list.map(function (ele, index) {
                ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss');
            })
            res.render('./list/news', {name: name, list: list});
        });
    });

})
//diary列表
router.get('/diary',function(req,res,next){
    var data ={class:req.query.class};
    var name = req.session.name;
    model.connect(function (db) {
        db.collection("articles").find(data).toArray(function (err, docs) {
            console.log("文章列表", docs);
            var list = docs;
            list.map(function (ele, index) {
                ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss');
            })
            res.render('./list/diary', {name: name, list: list});
        });
    });

})
//life列表
router.get('/life',function(req,res,next){
    var data ={class:req.query.class};
    var name = req.session.name;
    model.connect(function (db) {
        db.collection("articles").find(data).toArray(function (err, docs) {
            console.log("文章列表", docs);
            var list = docs;
            list.map(function (ele, index) {
                ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss');
            })
            res.render('./list/life', {name: name, list: list});
        });
    });
})
//life列表
router.get('/articles',function(req,res,next){
    var data ={class:req.query.class};
    var name = req.session.name;
    model.connect(function (db) {
        db.collection("articles").find(data).toArray(function (err, docs) {
            console.log("文章列表", docs);
            var list = docs;
            list.map(function (ele, index) {
                ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss');
            })
            res.render('./list/article', {name: name, list: list});
        });
    });
})
module.exports = router;
