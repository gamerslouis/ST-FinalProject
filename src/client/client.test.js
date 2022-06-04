import socketIOClient from 'socket.io-client'
import MockedSocket from 'socket.io-mock'
import startClient from './client'

import constants from '../shared/constants'
import State from './dummyState'

jest.mock('./render')
jest.mock('socket.io-client')
jest.mock('./dummyState')

describe('client', () => {
  let client
  let socket
  const username = '123'

  beforeEach(async () => {
    socket = new MockedSocket()
    socket.emit = jest.fn()
    socketIOClient.mockReturnValue(socket)
    const clientPromise = startClient(username, {})
    socket.socketClient.emit('connect', null)
    client = await clientPromise
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('can start game', () => {
    expect(client.username).toEqual(username)
    expect(socket.emit).toBeCalledWith(constants.MSG_TYPES.JOIN_GAME, username)
  })

  it('can recieve input and send to server', () => {
    document.body.dispatchEvent(
      new MouseEvent('mousedown', {
        which: 1,
      })
    )
    expect(socket.emit).toHaveBeenLastCalledWith(constants.MSG_TYPES.INPUT, {
      key: 'mouse',
      state: 0,
    })
  })

  it('can clear and call index if game over', () => {
    const mock = jest.fn()
    client.on('gameEnd', mock)
    socket.socketClient.emit(constants.MSG_TYPES.GAME_OVER)
    expect(mock).toBeCalled()
  })
  it('can clear and call index if disconnected', () => {
    const mock = jest.fn()
    client.on('gameEnd', mock)
    socket.socketClient.emit('disconnect')
    expect(mock).toBeCalled()
  })
  it('can recieve data from server and dispatch to state', () => {
    socket.socketClient.emit(constants.MSG_TYPES.GAME_UPDATE, 'data')
    expect(State.mock.instances[0].update).toBeCalledWith('data')
  })
})
