const express = require("express");
const app = express();

const server = require("http").createServer(app,function () {
    console.log("在监听")
});
const io = require("socket.io")(server)


const onlineUsers={};
// 在线用户人数
var onlineCount = 0;

const generateTime = () => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const hourText = hour === 0 ? '00' : String(hour);
    const minuteText = minute < 10 ? '0' + minute : String(minute);
    return hourText + ':' + minuteText;
};
io.on('connection', function(socket) {
    // 监听客户端的登陆
    socket.on('login', function(obj) {
        // 用户id设为socketid
        socket.id = obj.uid;

        // 如果没有这个用户，那么在线人数+1，将其添加进在线用户
        if (!onlineUsers[obj.uid]) {
            onlineUsers[obj.uid] = obj.userName;
            console.log(onlineUsers)
            onlineCount++;
        }
        console.log("执行了login")
        // 向客户端发送登陆事件，同时发送在线用户、在线人数以及登陆用户
        io.emit('login', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj });
        console.log(obj.userName + '加入了群聊');
    });
    socket.on('sendDraw',(obj)=> {
        console.log(obj);
        io.emit('sendDraw',{obj})
    })
    // 监听客户端的断开连接
    socket.on('disconnect', function() {
        // 如果有这个用户
        if (onlineUsers[socket.id]) {
            var obj = { uid: socket.id, userName: onlineUsers[socket.id],time:generateTime() };

            // 删掉这个用户，在线人数-1
            delete onlineUsers[socket.id];
            onlineCount--;

            // 向客户端发送登出事件，同时发送在线用户、在线人数以及登出用户
            io.emit('out', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj });
            console.log(obj.userName + '退出了群聊');
        }
    });

    // 监听客户端发送的信息
    socket.on('message', function(obj) {
         io.emit('message', obj);
        // logger.info({ socketId: socket.id, ip: socket.request.connection.remoteAddress, user: obj.username, event: 'chat', message: obj.username + '说:' + obj.message });
         console.log(obj.userName + '说:' + obj.message);
    });
});

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

var port = normalizePort(process.env.PORT || '4000');
server.listen(port, function(err) {
    console.log('Listening at *:'+port);
});

