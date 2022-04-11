const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { getUser, addUser, removeUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT || 3000

app.use(express.static('public'))


io.on('connection', (socket) => {


    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        if (!user) {
            return
        }
        const filter = new Filter()
        if (filter.isProfane(message)) {
            message = filter.clean(message)
        }
        io.to(user.room).emit('message', generateMessage(user.displayname,message))
        callback('Delivered')
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.displayname,`https://www.google.com/maps?q=${location[0]},${location[1]}`))
        callback('Location Shared!')
    })

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username,displayname:username, room })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('System',`Welcome ${displayname}!`))
        socket.broadcast.to(user.room).emit('message', generateMessage('System',`${user.displayname} has joined!`))
        io.to(user.room).emit('roomData', {
            room:user.room,
            users: getUsersInRoom(user.room),

        })
        callback()
        // socket.emit  io.emit               socket.broadcast.emit
        //              io.to.emit            socket.broadcast.to.emit  
    })






    // ON LEAVING
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.displayname} has left the room.`))
            io.to(user.room).emit('roomData', {
                room:user.room,
                users: getUsersInRoom(user.room),
            })
        }

    })
})


server.listen(port, () => {
    console.log(`Server running on ${port}`)
})