import socketIOClient from 'socket.io-client'
import MockedSocket from 'socket.io-mock'
import connect from './network'

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
    const promise = connect()
    socket.socketClient.emit('connect', null)
    const manager = await promise
    expect(manager.getSocket()).toBeTruthy()
  })

  it('throw exception if connection fail', async () => {
    const promise = connect()
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
