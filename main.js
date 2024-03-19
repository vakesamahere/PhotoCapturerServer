const http = require('http');
const fs = require('fs');
const os = require('os')
const formidable = require('formidable');
const path = require('path');
const { exec } = require('child_process');

// 定义服务器的端口
try{
  console.log("args:"+process.argv)
  //agv[1]传入当前绝对路径
}catch(e){
}
const PORT = 5500;
let count = 0;
const server = http.createServer((request, response) => {
  console.log("New request:" + (++count));

  // 检查请求方法是否为 POST
  if (request.method === 'POST') {
      // 创建一个 Formidable 实例来处理请求
      const form = new formidable.IncomingForm();
      form.uploadDir = path.join(process.argv[2], 'upload'); // 设置上传目录
      form.keepExtensions = true; // 保留文件扩展名
      form.on('fileBegin', (fieldname, file) => {
        // 获取原始文件名
        const originalFileName = file.name;
        // 定义新的文件名（你可以根据需要自定义逻辑）
        const newFileName = 'image.jpg';
        // 构建新的文件路径
        const newFilePath = path.join(form.uploadDir, newFileName);
        // 重命名文件
        file.path = newFilePath;
        file.filepath = newFilePath;
        console.log(file.filepath);
      });
      // 监听文件解析事件
      form.on('file', (fieldname, file) => {
        const { exec } = require('child_process');
        exec(`copyPic.bat ${process.argv[2]}`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing copyPic.bat:', error);
            } else {
                console.log('copyPic.bat executed successfully');
            }
        });
      });

      // 监听结束事件，表示请求体数据已经接收完毕
      form.on('end', () => {
          // 发送响应给客户端
          response.writeHead(200, { 'Content-Type': 'text/plain' });
          response.end('POST request received');
          console.log("post");
      });

      // 解析请求
      form.parse(request);
  } else {
      // 如果不是 POST 请求，返回 405 方法不被允许
      response.writeHead(405, { 'Content-Type': 'text/plain' });
      response.end('Method Not Allowed');
      console.log("non-post");
  }
});


function getLocalIP() {
    const ifaces = os.networkInterfaces();
    for (let dev in ifaces) {
      for (let i = 0; i < ifaces[dev].length; i++) {
        const details = ifaces[dev][i];
        if (details.family === 'IPv4' && !details.internal) {
          console.log(`The server is running. Post image at http://${details.address}:${PORT}/upload`);
        }
      }
    }
  }
// 启动服务器并监听指定的端口
server.listen(PORT, () => {
  getLocalIP();
});