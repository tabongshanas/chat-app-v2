const app = require('express')();
const multer = require('multer');

const server = require('http').createServer(app);
const PORT = 8080;
// const users = new Map();
const onlineUsers = {};

// multer set up
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './../frontend/images/uploads')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        const rand = Math.floor(Math.random()) + 1;
        cb(null, `user-${rand}.${ext}`);
    }
})

const upload = multer({ storage })
app.post('/upload-profile', upload.single('photo'), (req, res) => {
    console.log(req.file);   // uploaded file info
    console.log(req.body);   // text fields

    res.send("File uploaded successfully, keep browsing!");
})

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