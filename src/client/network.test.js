import socketIOClient from 'socket.io-client'
import MockedSocket from 'socket.io-mock'
import NetworkManager from './network'

jest.mock('socket.io-client')

describe('network manager', () => {
  let socket
  beforeEach(() => {
    socket = new MockedSocket()
    socketIOClient.mockReturnValue(socket)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('can create socket io connection', async () => {
    const manager = new NetworkManager()
    const promise = manager.connect()
    socket.socketClient.emit('connect', null)
    await promise
    expect(manager.getSocket()).toBeTruthy()
  })

  it('throw exception if connection fail', async () => {
    const manager = new NetworkManager()
    const promise = manager.connect()
    const err = 'errmsg'
    socket.socketClient.emit('connect_error', err)
    expect.assertions(1)
    try {
      await promise
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(e).toBe(err)
    }
  })
})
