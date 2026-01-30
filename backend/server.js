const app = require('express')();

const server = require('http').createServer(app);
const PORT = 7000;
// const users = new Map();
const onlineUsers = {};

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
})

io.on('connection', (Socket) => {
    Socket.emit('new-member', Socket.id)
    // Socket.broadcast.emit('reminder')
    console.log(`new user with id: ${Socket.id}`)

    Socket.on('client-msg', (msg) => {
        Socket.broadcast.emit('msg-from-server', msg)
    })

    Socket.on('user-name-from-client', (name) => {
        Socket.broadcast.emit('user-name-from-server', name)
    })

    // real word example
    Socket.on("login", (username) => {
        onlineUsers
        onlineUsers[Socket.id] = username;
        console.log('online users now: ', onlineUsers)
        io.emit("online-users", Object.values(onlineUsers));
    })

    Socket.on("disconnect", () => {
        delete onlineUsers[Socket.id];
        io.emit("online-users", Object.values(onlineUsers));

        Socket.broadcast.emit('reload-page')
    });
})

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})