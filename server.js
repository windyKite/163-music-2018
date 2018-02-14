var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
var qiniu = require('qiniu')

if (!port) {
  console.log('请指定端口号好不啦？\node server.js 8888 这样不会吗？')
  process.exit(1)
}


var server = http.createServer(function (request, response) {
  let parsedUrl = url.parse(request.url, true)
  let pathWithQuery = request.url
  let queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  let path = parsedUrl.pathname
  let query = parsedUrl.query
  let method = request.method

  /******** 从这里开始看，上面不要看 ************/







  if (path === '/uptoken') {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', '*')

    let config = fs.readFileSync('./qiniu_key.json','utf8')
    console.log(config)
    config = JSON.parse(config)

    let { accessKey, secretKey } = config
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    var options = {
      scope: '163-music-2018',
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);

    response.write(`
      {
        "uptoken": "${uploadToken}"
      }
    `)
    response.end()
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset = utf8')
    response.write(`
      {
       "error": "resource not found"
      }
    `)
    response.end()
  }



  

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
