import { Position } from './iGameObject'
import { IAirplane } from './iAirplane'
import { PlayerInputState } from './iGameControl'
const Constants = require('../../shared/constants')

class Airplane implements IAirplane {
  id: string
  position: Position = { x: 0, y: 0 }
  direction: number
  speed: number
  rotation: number
  health: number
  control = {
    turnLeft: PlayerInputState.Release,
    turnRight: PlayerInputState.Release,
  }
  score: number

  constructor(playerId: string) {
    this.id = playerId
    this.position.x = Constants.PLAYER_ORIGIN_POS_X
    this.position.y = Constants.PLAYER_ORIGIN_POS_Y
    this.direction = ((2 * Math.PI) / 360) * 90
    this.speed = Constants.PLAYER_SPEED
    this.rotation = this.direction
    this.health = Constants.PLAYER_MAX_HP
    this.score = 0
  }
  getHealth(): number {
    return this.health
  }
  setHealth(newHealth: number) {
    this.health = newHealth
  }
  acceptDamage(damage: number) {
    this.health -= damage
  }
  update(dt: number) {
    // Update position
    this.position.x += dt * this.speed * Math.sin(this.direction)
    this.position.y -= dt * this.speed * Math.cos(this.direction)

    // Masure the airplane stay in the map
    this.position.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.position.x))
    this.position.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.position.y))

    // Set direction
    if (this.control.turnLeft == PlayerInputState.Press) {
      this.setMoveDirection(Constants.MOVE_DELTA_RAD)
      this.setRotation(Constants.MOVE_DELTA_RAD)
    }
    if (this.control.turnRight == PlayerInputState.Press) {
      this.setMoveDirection(-Constants.MOVE_DELTA_RAD)
      this.setRotation(-Constants.MOVE_DELTA_RAD)
    }
  }
  getId(): string {
    return this.id
  }
  getPosition(): Position {
    return this.position
  }
  setPosition(newPosition: Position): void {
    throw new Error('Method not implemented.')
  }
  getRotation(): number {
    return this.rotation
  }
  setRotation(newRotation: number) {
    this.rotation += newRotation
  }
  getSpeed(): number {
    return this.speed
  }
  setSpeed(newSpeed: number) {
    throw new Error('Method not implemented.')
  }
  getMoveDirection(): number {
    return this.direction
  }
  setMoveDirection(number: any) {
    this.direction += number
  }

  distanceTo(targetPosition: Position): number {
    const dx = this.position.x - targetPosition.x
    const dy = this.position.y - targetPosition.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  getScore(): number {
    return this.score;
  }
  
  addScore(score: number) {
      this.score += score
  }

  serialize(): any {
    return {
      id: this.id,
      x: this.position.x,
      y: this.position.y,
      rot: this.rotation,
      health: this.health,
    }
  }
}

export default Airplane
