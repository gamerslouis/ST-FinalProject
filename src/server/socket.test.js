const Client = require('socket.io-client')

describe('socket server', () => {
  let clientSocket
  beforeAll((done) => {
    httpServer.listen(() => {
      const port = httpServer.address().port
      clientSocket = new Client(`http://localhost:${port}`)
      io.on('connection', (socket) => {
        serverSocket = socket
      })
      clientSocket.on('connect', done)
    })
  })

  it('can work', (done) => {
    clientSocket.on('hello', (arg) => {
      expect(arg).toBe('world')
      done()
    })
    serverSocket.emit('hello', 'world')
  })
})
