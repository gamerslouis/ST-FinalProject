import { Socket } from 'socket.io'
import MockedSocket from 'socket.io-mock'
import { PlayerUpdateEventType } from './iPlayer'
import Player from './player'
import constants from '../shared/constants'
import Game from './game/game'
const Constants = require('../shared/constants')

jest.mock('./game/game')

describe('Player class', () => {
  const username = 'testuser'
  const id = 'abcd'
  let socket: MockedSocket
  let player: Player
  let game: Game

  beforeEach(() => {
    socket = new MockedSocket()
    socket.id = id
    socket.emit = jest.fn()
    socket.disconnect = jest.fn()
    game = new Game()

    player = new Player(socket, game)
    socket.socketClient.emit(Constants.MSG_TYPES.JOIN_GAME, username)
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('can provide username and id and add player to game', () => {
    expect(player.getName()).toBe(username)
    expect(player.getId()).toBe(id)
  })

  it('can accept update and send it to client with socketio', () => {
    const mockEmit = socket.emit as jest.MockedFn<any>

    player.update(PlayerUpdateEventType.gameUpdate, {})
    expect(mockEmit).toBeCalledWith(constants.MSG_TYPES.GAME_UPDATE, {})
    mockEmit.mockReset()

    player.update(PlayerUpdateEventType.playerDead, null)
    expect(mockEmit).toBeCalledWith(constants.MSG_TYPES.GAME_OVER, null)
    mockEmit.mockReset()
  })
  it('can be close', () => {
    const disconnectMock = socket.disconnect as jest.MockedFn<any>
    player.close()
    expect(disconnectMock).toBeCalled()
  })

  it('can recieve event from client and send to game control', () => {
    socket.socketClient.emit(Constants.MSG_TYPES.INPUT, 'abc')
    expect(game.handleInput).toBeCalledWith(id, 'abc')
    socket.socketClient.emit('disconnect')
    expect(game.handleDisconnect).toBeCalledWith(id)
  })
})
