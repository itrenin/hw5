const express = require('express')
const path = require('path')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

require('./models/connection')
const Chat = require('./models/schemas/chat')

// parse application/json
app.use(express.json())

app.use(function (_, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.use(express.static(path.join(__dirname, 'build')))
require('./auth/passport')
app.use('/api', require('./routes'))
app.use('*', (_req, res) => {
  const file = path.resolve(__dirname, 'build', 'index.html')
  res.sendFile(file)
})

app.use((err, _, res, __) => {
  console.log(err.stack)
  res.status(500).json({
    statusMessage: 'Error',
    data: { status: 500, message: err.message },
  })
})
// реализация чата
let users = []
io.sockets.on('connection', (socket) => {
  //console.log(socket.handshake)
  socket.on('users:connect', ({ userId, username }) => {
    // const user = { [socket.id]: {
    //   username: username,
    //   socketId: socket.id,
    //   userId: userId,
    //   activeRoom: null // По умолчанию
    //   }
    // }
    const user = {
      username: username,
      socketId: socket.id,
      userId: userId,
      activeRoom: null, // По умолчанию
    }

    users.push(user)

    socket.emit('users:list', users)
    socket.broadcast.emit('users:add', user)
  })
  socket.on('message:add', async (message) => {
    let dialog = new Object()
    const newMessage = new Chat(message)
    await newMessage.save()

    users.forEach((user) => {
      if (user.userId === message.recipientId) dialog.to = user.socketId
      if (user.userId === message.senderId) dialog.from = user.socketId
    })

    io.to(dialog.from).to(dialog.to).emit('message:add', message)
  })

  socket.on('message:history', async (dialog) => {
    const findHistory = (dialog, msg) => {
      if (
        (dialog.recipientId === msg.recipientId &&
          dialog.userId === msg.senderId) ||
        (dialog.recipientId === msg.senderId &&
          dialog.userId === msg.recipientId)
      ) {
        return true
      }
      return false
    }

    const history = (await Chat.find()).filter((msg) =>
      findHistory(dialog, msg) ? true : false
    )

    socket.emit('message:history', history)
  })
  socket.on('disconnect', (data) => {
    socket.broadcast.emit('users:leave', users[socket.id])

    users.forEach((user, index) => {
      if (user.socketId === socket.id) users.splice(index, 1)
    })
  })
})
// конец чата. Надо вынети в отдельный модуль

const PORT = process.env.PORT || 3000

server.listen(PORT, function () {
  console.log(`Server running. Use our API on port: ${PORT}`)
})

module.exports = app
