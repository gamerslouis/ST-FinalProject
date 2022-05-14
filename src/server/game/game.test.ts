import Player from '../player'
import Game from './game'
import Airplane from './airplane'
import Bullet from './bullet'
import Constants, { MOVE_DELTA_RAD } from '../../shared/constants'
import { PlayerInputState } from './iGameControl'
import { PlayerUpdateEventType } from '../iPlayer'

jest.mock('../player')
jest.useFakeTimers()

describe('Game', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Should update the game on an interval', () => {
    const game = new Game()
    game.lastUpdateTime = Date.now() - 10
    const initCreatedTime = game.lastUpdateTime
    jest.runOnlyPendingTimers()
    expect(game.lastUpdateTime).not.toEqual(initCreatedTime)
  })

  it('Send update to each player', () => {
    const game = new Game()
    const playerId1 = '123'
    const playerId2 = '456'
    const socket = {
      id: '1234',
      emit: jest.fn(),
    }
    Player.prototype.getId = jest.fn().mockReturnValue(playerId1)
    const player1 = new Player(playerId1, socket)
    game.addPlayer(player1)
    Player.prototype.getId = jest.fn().mockReturnValue(playerId2)
    const player2 = new Player(playerId2, socket)
    game.addPlayer(player2)

    jest.spyOn(player1, 'update')
    jest.spyOn(player2, 'update')
    game.update()
    expect(player1.update).toBeCalledTimes(1)
    expect(player2.update).toBeCalledTimes(1)
    expect(player1.update).toBeCalledWith(
      PlayerUpdateEventType.gameUpdate,
      expect.objectContaining({
        t: expect.any(Number),
        self: expect.objectContaining({ id: playerId1 }),
        airplanes: expect.anything(),
        bullets: expect.anything(),
      })
    )
    expect(player2.update).toBeCalledWith(
      PlayerUpdateEventType.gameUpdate,
      expect.objectContaining({
        t: expect.any(Number),
        self: expect.objectContaining({ id: playerId2 }),
        airplanes: expect.anything(),
        bullets: expect.anything(),
      })
    )
  })

  it('Add a player with player id', () => {
    Player.prototype.getId = jest.fn(() => '123')
    const player = new Player('123', undefined)
    const game = new Game()
    game.addPlayer(player)
    expect(game.players[player.getId()].getId()).toBe('123')
    expect(game.airplanes[player.getId()].getId()).toBe('123')
  })

  it('Remove the airplanes from game when they die, along with their players', () => {
    const playerId = '123'
    Player.prototype.getId = jest.fn().mockReturnValueOnce('123')
    const game = new Game()
    const player = new Player(playerId, undefined)
    const airplane = new Airplane(playerId)
    game.players[playerId] = player
    game.airplanes[playerId] = airplane
    game.airplanes[playerId].setHealth(0)

    jest.runOnlyPendingTimers()
    expect(game.airplanes[playerId]).not.toBeDefined()
    expect(game.players[playerId]).not.toBeDefined()
  })

  it('Update player when they are removed', () => {
    const playerId = '123'
    const game = new Game()
    const player = new Player(playerId, undefined)
    game.players[playerId] = player
    jest.spyOn(player, 'update')
    game.removePlayer(playerId)
    expect(player.update).toBeCalledTimes(1)
  })

  it('A bullet vanish when hit other player', () => {
    const playerId = '123'
    const game = new Game()
    const airplane = new Airplane(playerId)
    const bullet = new Bullet('456', { x: 50, y: 50 }, 0, 0)
    game.airplanes[playerId] = airplane
    game.bullets.push(bullet)

    jest.runOnlyPendingTimers()
    expect(game.bullets).toHaveLength(0)
  })

  describe('Player Input Handling', () => {
    it('Mouse click trigger a bullet release', () => {
      const game = new Game()
      const playerID = '123'
      const airplane = new Airplane(playerID)
      game.airplanes[playerID] = airplane

      jest.runOnlyPendingTimers()

      game.handleInput(playerID, {
        key: Constants.INPUT_EVENTS.MOUSE,
        state: PlayerInputState.Press,
      })
      expect(game.bullets).toHaveLength(1)
      expect(game.bullets[0].parentId).toBe(playerID)
    })

    it('Left arrow key press/release event set the left key status', () => {
      const game = new Game()
      const playerID = '123'
      const airplane = new Airplane(playerID)
      game.airplanes[playerID] = airplane

      /* Press left arrow key */
      game.handleInput(playerID, {
        key: Constants.INPUT_EVENTS.LEFT_ARROW_KEY,
        state: PlayerInputState.Press,
      })
      /* Release left arrow key */
      expect(game.airplanes[playerID].control.turnLeft).toBe(
        PlayerInputState.Press
      )
      game.handleInput(playerID, {
        key: Constants.INPUT_EVENTS.LEFT_ARROW_KEY,
        state: PlayerInputState.Release,
      })
      expect(game.airplanes[playerID].control.turnLeft).toBe(
        PlayerInputState.Release
      )
    })

    it('Right arrow key press/release event set the right key status', () => {
      const game = new Game()
      const playerID = '123'
      const airplane = new Airplane(playerID)
      game.airplanes[playerID] = airplane

      /* Press right arrow key */
      game.handleInput(playerID, {
        key: Constants.INPUT_EVENTS.RIGHT_ARROW_KEY,
        state: PlayerInputState.Press,
      })
      expect(game.airplanes[playerID].control.turnRight).toBe(
        PlayerInputState.Press
      )
      /* Release left arrow key */
      game.handleInput(playerID, {
        key: Constants.INPUT_EVENTS.RIGHT_ARROW_KEY,
        state: PlayerInputState.Release,
      })
      expect(game.airplanes[playerID].control.turnRight).toBe(
        PlayerInputState.Release
      )
    })
  })
})
