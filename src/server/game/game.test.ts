import Player from '../player'
import Game from './game'
import Airplane from './airplane'
import Bullet from './bullet'
import Constants, { MOVE_DELTA_RAD } from '../../shared/constants'
import { PlayerInputState } from './iGameControl'

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

    it('Left arrow key update the airplane to trun left', () => {
      const game = new Game()
      const playerID = '123'
      const airplane = new Airplane(playerID)
      game.airplanes[playerID] = airplane

      jest.runOnlyPendingTimers()

      /* Press left arrow key */
      let preDirection = game.airplanes[playerID].getMoveDirection()
      game.handleInput(playerID, {
        key: Constants.INPUT_EVENTS.LEFT_ARROW_KEY,
        state: PlayerInputState.Press,
      })
      let computeDir = preDirection + MOVE_DELTA_RAD
      expect(game.airplanes[playerID].getMoveDirection()).toBeCloseTo(
        computeDir
      )
    })

    it('Right arrow key update the airplane to trun right', () => {
      const game = new Game()
      const playerID = '123'
      const airplane = new Airplane(playerID)
      game.airplanes[playerID] = airplane

      jest.runOnlyPendingTimers()

      /* Press right arrow key */
      let preDirection = game.airplanes[playerID].getMoveDirection()
      game.handleInput(playerID, {
        key: Constants.INPUT_EVENTS.RIGHT_ARROW_KEY,
        state: PlayerInputState.Press,
      })
      let computeDir = preDirection - MOVE_DELTA_RAD
      expect(game.airplanes[playerID].getMoveDirection()).toBeCloseTo(
        computeDir
      )
    })
  })
})
