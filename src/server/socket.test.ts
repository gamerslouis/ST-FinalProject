import { createServer } from 'http'
import { AddressInfo } from 'net'
import { io as Client } from 'socket.io-client'
import io from './socket'

describe('socket server', () => {
  let clientSocket
  let serverSocket

  beforeAll(() => {
    return new Promise((done) => {
      const httpServer = createServer()
      io.attach(httpServer)
      httpServer.listen(() => {
        const { port } = httpServer.address() as AddressInfo
        clientSocket = Client(`http://localhost:${port}`)
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
    return new Promise<void>((done) => {
      clientSocket.on('hello', (arg) => {
        expect(arg).toBe('world')
        done()
      })
      serverSocket.emit('hello', 'world')
    })
  })
})
