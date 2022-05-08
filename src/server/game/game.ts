import { Socket } from 'socket.io'
import Constants from '../../shared/constants'
import { IPlayer, PlayerUpdateEventType } from '../iPlayer'
import Airplane from './airplane'
import Bullet from './bullet'
import { checkCollisionToBullets } from './collision'
import { IGameControl, PlayerInputState } from './iGameControl'

class Game implements IGameControl {
  players: any // playerID: Player
  airplanes: any // playerID: Airplane
  lastUpdateTime: number
  bullets: any[] // Bullet

  constructor() {
    this.players = {}
    this.airplanes = {}
    this.bullets = []
    this.lastUpdateTime = Date.now()
    setInterval(this.update.bind(this), 1000 / 60)
  }

  update() {
    const currectTime = Date.now()
    this.lastUpdateTime = currectTime

    // Check collision
    const destroyedBullets = checkCollisionToBullets(
      Object.values(this.airplanes),
      this.bullets
    )
    this.bullets = this.bullets.filter(
      (bullet) => !destroyedBullets.includes(bullet)
    )

    // Check if any airplane is dead
    Object.keys(this.airplanes).forEach((playerID) => {
      const airplane = this.airplanes[playerID]
      if (airplane.getHealth() <= 0) {
        this.removePlayer(playerID)
      }
    })

		// Send update to each player
		Object.keys(this.players).forEach(playerID => {
			/* TODO */
			this.players[playerID].update(PlayerUpdateEventType.gameUpdate, {});
		});
  }

  addPlayer(newPlayer: IPlayer) {
    this.players[newPlayer.getId()] = newPlayer
    this.airplanes[newPlayer.getId()] = new Airplane(newPlayer.getId())
  }
  removePlayer(playerId: string) {
		this.players[playerId].update(PlayerUpdateEventType.playerDead)
    delete this.players[playerId]
    delete this.airplanes[playerId]
  }
  handleInput(
    playerId: string,
    event: { key: string; state: PlayerInputState }
  ) {
    const airplane = this.airplanes[playerId]
    switch (event.key) {
      case Constants.INPUT_EVENTS.MOUSE:
        if (event.state == PlayerInputState.Press)
          this.bullets.push(
            new Bullet(
              playerId,
              airplane.getPosition(),
              airplane.getMoveDirection(),
              Constants.BULLET_SPEED
            )
          )
        break
      case Constants.INPUT_EVENTS.LEFT_ARROW_KEY:
        if (event.state == PlayerInputState.Press) {
          this.airplanes[playerId].setMoveDirection(Constants.MOVE_DELTA_RAD)
        }
        break
      case Constants.INPUT_EVENTS.RIGHT_ARROW_KEY:
        if (event.state == PlayerInputState.Press) {
          this.airplanes[playerId].setMoveDirection(-Constants.MOVE_DELTA_RAD)
        }
        break
      default:
        break
    }
  }
}

export default Game
