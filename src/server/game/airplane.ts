import { Position } from './iGameObject'
import { IAirplane } from './iAirplane'
const Constants = require('../../shared/constants')

class Airplane implements IAirplane {
  id: string
  position: Position = { x: 0, y: 0 }
  direction: number
  speed: number
  rotation: number
  health: number

  constructor(playerId: string) {
    this.id = playerId
    this.position.x = Constants.PLAYER_ORIGIN_POS_X
    this.position.y = Constants.PLAYER_ORIGIN_POS_Y
    this.direction = Math.random() * 2 * Math.PI
    this.speed = Constants.PLAYER_SPEED
    this.rotation = 0.5
    this.health = Constants.PLAYER_MAX_HP
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

    // Masure the aireplane stay in the map
    this.position.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.position.x))
    this.position.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.position.y))
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
    throw new Error('Method not implemented.')
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
}

export default Airplane
