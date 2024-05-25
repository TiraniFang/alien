const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// 中间件示例：设置静态文件夹
app.use(express.static(path.join(__dirname, 'dist')));

// 配置跨域
// app.use(cors({
//   origin: 'http://localhost:8080', // 允许来自这个源的跨域请求
//   methods: ['GET', 'POST'], // 允许的HTTP请求方法
//   allowedHeaders: ['Content-Type', 'Authorization'], // 允许的HTTP请求头
//   exposedHeaders: ['Authorization'] // 允许浏览器访问的响应头
// }));
// 路由示例：处理根路径的请求
app.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<html><body><h1>Hello, world!</h1></body></html>');
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});