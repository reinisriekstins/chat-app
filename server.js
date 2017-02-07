const
  express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server)

const
  users = [],
  connections = []

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log('Listening on port ' + PORT))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.sockets.on('connection', (socket) => {
  connections.push(socket)
  console.log('Connect: %s sockets connected', connections.length)

  // disconnect
  socket.on('disconnect', (data) => {
    // if (!socket.username) return;
    users.splice(users.indexOf(socket.username), 1)
    updateUsernames()

    connections.splice(connections.indexOf(socket), 1)
    console.log('Disconnect: %s sockets connected', connections.length)
  })

  // send message
  socket.on('send message', (data) => {
    console.log(data)
    io.sockets.emit('new message', { msg: data, user: socket.username })
  })

  // new users
  socket.on('new user', (data, callback) => {
    callback(true)

    socket.username = data
    users.push(socket.username)
    updateUsernames()
  })

  function updateUsernames() {
    io.sockets.emit('get users', users)
  }
})

