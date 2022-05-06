const { createServer } = require('http')
const Client = require('socket.io-client')
const { makeIO } = require('./socket')

describe('socket server', () => {
  let clientSocket
  let serverSocket
  let io

  beforeAll(() => {
    return new Promise((done) => {
      const httpServer = createServer()
      io = makeIO(httpServer)
      httpServer.listen(() => {
        const { port } = httpServer.address()
        clientSocket = new Client(`http://localhost:${port}`)
        io.on('connection', (socket) => {
          serverSocket = socket
        })
        clientSocket.on('connect', done)
      })
    })
  })

  afterAll(() => {
    io.close()
    clientSocket.close()
  })

  it('can work', () => {
    return new Promise((done) => {
      clientSocket.on('hello', (arg) => {
        expect(arg).toBe('world')
        done()
      })
      serverSocket.emit('hello', 'world')
    })
  })
})
