var http = require('http');
var url = require('url');
var qs = require('querystring');

http.createServer(function (req, res) {

    // 设置编码格式
    // req.setEncoding('UTF-8');
    req.setEncoding('utf8');

    // 允许跨域请求, *代表允许接收任意类型的头请求
    res.setHeader('Access-Control-Allow-Origin', '*');

    // 用来接收前端传来的data数据
    var postData = "";

    // 监听, 如果前端有数据, 就会调用该方法
    req.addListener('data', function (dataChunk) {

        postData += dataChunk;
        console.log("=============");
        console.log(postData);
        
    });

    // 前端数据传输完毕
    req.addListener('end', function () {

        console.log("前端数据传输完毕");

        // 讲postData转化成对象形式, 方便取值
        var postDataObj = qs.parse(postData);

        console.log(postDataObj.myUrl);
        // 接收数据变量
        var resultData = "";

        http.get(postDataObj.myUrl, function (request) {

            request.setEncoding('utf8');

            // 监听数据, 有data就执行第二个回调函数
            request.on('data', function (result) {

                resultData += result;
                
            });

            request.on('end', function () {

                // 接收完毕, 发送给前端
                res.end(resultData);

            });



            
        }).on('error', function (e) {

            res.end(e.message);

        });

    });

    
}).listen(3333);
console.log("HTTP Server is listening at port 3333!!!!");