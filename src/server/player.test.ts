import { Socket } from 'socket.io'
import { PlayerUpdateEventType } from './iPlayer'
import Player from './player'
const constatns = require('../shared/constants')

describe('Player class', () => {
  let username: string, socket: Socket
  let player: Player

  beforeEach(() => {
    socket = {
      emit: jest.fn(),
      disconnect: jest.fn(),
    } as unknown as Socket
    username = 'testuser'
    player = new Player(username, socket)
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('can provide username nad id', () => {
    expect(player.getName()).toBe(username)
    expect(player.getId()).toBeTruthy()
  })

  it('can accept update and send it to client with socketio', () => {
    const mockEmit = socket.emit as jest.MockedFn<any>

    player.update(PlayerUpdateEventType.gameUpdate, {})
    expect(mockEmit).toBeCalledWith(constatns.MSG_TYPES.GAME_UPDATE, {})
    mockEmit.mockReset()

    player.update(PlayerUpdateEventType.playerDead, null)
    expect(mockEmit).toBeCalledWith(constatns.MSG_TYPES.GAME_OVER, null)
    mockEmit.mockReset()
  })
  it('can be close', () => {
    const disconnectMock = socket.disconnect as jest.MockedFn<any>
    player.close()
    expect(disconnectMock).toBeCalled()
  })
})
