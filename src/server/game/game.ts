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
    const dt = (currectTime - this.lastUpdateTime) / 1000
    this.lastUpdateTime = currectTime

    // Check collision
    const destroyedBullets = checkCollisionToBullets(
      Object.values(this.airplanes),
      this.bullets
    )

    // Update airplanes score
    destroyedBullets.forEach((bullet) => {
      if (this.airplanes[bullet.getParentId()] && destroyedBullets.length != 0)
        this.airplanes[bullet.getParentId()].addScore(Constants.BULLET_DAMAGE)
    })

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

    // Update each bullet
    const bulletsToRemove = []
    this.bullets.forEach((bullet) => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet)
      }
    })
    this.bullets = this.bullets.filter(
      (bullet) => !bulletsToRemove.includes(bullet)
    )

    // Update each airplanes position
    Object.keys(this.airplanes).forEach((airplaneID) => {
      this.airplanes[airplaneID].update(dt)
    })

    // Send update to each player
    Object.keys(this.players).forEach((playerID) => {
      const nearbyAirplanes = Object.values(this.airplanes).filter(
        (p) =>
          p !== this.airplanes[playerID] &&
          this.airplanes[playerID].distanceTo(
            this.airplanes[playerID].getPosition()
          ) <=
            Constants.MAP_SIZE / 2
      )
      const nearbyBullets = this.bullets.filter(
        (b) =>
          b.distanceTo(this.airplanes[playerID].getPosition()) <=
          Constants.MAP_SIZE / 2
      )
      this.players[playerID].update(PlayerUpdateEventType.gameUpdate, {
        t: Date.now(),
        self: this.airplanes[playerID].serialize(),
        airplanes: nearbyAirplanes.map((a: any) => a.serialize()),
        bullets: nearbyBullets.map((b: any) => b.serialize()),
        scoreboard: this.getScoreboard(),
      })
    })
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

  getScoreboard(): any {
    return Object.values(this.airplanes)
      .sort((a1: Airplane, a2: Airplane) =>
        a2.getScore() > a1.getScore() ? 1 : -1
      )
      .map((a: Airplane) => ({
        playerName: this.players[a.getId()].getName(),
        score: a.getScore(),
      }))
  }

  handleInput(
    playerId: string,
    event: { key: string; state: PlayerInputState }
  ) {
    const airplane = this.airplanes[playerId]
    switch (event.key) {
      case Constants.INPUT_EVENTS.SPACE:
        if (event.state == PlayerInputState.Press) {
          if (airplane)
            this.bullets.push(
              new Bullet(
                playerId,
                airplane.getPosition(),
                airplane.getMoveDirection(),
                Constants.BULLET_SPEED
              )
            )
        }
        break
      case Constants.INPUT_EVENTS.LEFT_ARROW_KEY:
        this.airplanes[playerId].control.turnLeft = event.state
        break
      case Constants.INPUT_EVENTS.RIGHT_ARROW_KEY:
        this.airplanes[playerId].control.turnRight = event.state
        break
      default:
        break
    }
  }
  handleDisconnect(playerId: string) {
    // Remove the player from game
    this.removePlayer(playerId)
  }
}

export default Game
