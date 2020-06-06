var express = require('express');
var router = express.Router();
var model=require('../model');//导入model
 router.post('/add',function (req,res,next) {
     var  data={
         title:req.body.title,
         content:req.body.content,
         id:Date.now(),
         account:req.session.account
     }
      model.connect(function (db) {
          db.collection('articles').insertOne(data,function (err,result) {
           if(err){
               console.log("文章插入失败",err)
               res.redirect('/write')
           }else{
               res.redirect('/')
           }
          })

      })
 })
// 删除文章
router.get('/delete', function(req, res, next) {
    var id = parseInt(req.query.id)
    var page = req.query.page
    model.connect(function(db) {
        db.collection('articles').deleteOne({id: id}, function(err, ret) {
            if (err) {
                console.log('删除失败')
            } else {
                console.log('删除成功')
            }
            res.redirect('/?page='+page)
        })
    })
})
module.exports = router;
