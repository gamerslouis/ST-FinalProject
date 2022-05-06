const socketio = require('socket.io')

const makeIO = (httpserver) => {
  const io = socketio(httpserver)
  return io
}

module.exports = {
  makeIO,
}
