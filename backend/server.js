const app = require('express')();

const server = require('http').createServer(app);
const PORT = 7000;

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
})

io.on('connection', (Socket) => {
    Socket.emit('new-member', Socket.id)
    console.log(`new user with id: ${Socket.id}`)

    Socket.on('client-msg', (msg) => {
        Socket.broadcast.emit('msg-from-server', msg)
    })
})

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})