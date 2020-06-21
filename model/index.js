var MongoClient = require('mongodb').MongoClient;//创建对象
var url = 'mongodb://localhost:27017';
var dbName='ShareLife';
var moment=require('moment');
//数据库连接
function connect(callback) {
   MongoClient.connect(url,function (err,client) {
       if(err){
           console.log("数据库连接失败",err)
       }
       else{
           var db=client.db(dbName)
           callback &&callback(db)
           client.close()
       }
   })
}
module.exports={
    connect
}
