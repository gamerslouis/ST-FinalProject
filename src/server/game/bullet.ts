import { IGameObject, Position } from './iGameObject'
import Constant from '../../shared/constants'

class Bullet implements IGameObject {
  id: string
  position: Position = { x: 0, y: 0 }
  direction: number
  speed: number

  constructor(id: string, pos: Position, dir: number, speed: number) {
    this.id = id
    this.position.x = pos.x
    this.position.y = pos.y
    this.direction = dir
    this.speed = speed
  }

  update(dt: number) {
    this.position.x += dt * this.speed * Math.sin(this.direction)
    this.position.y -= dt * this.speed * Math.cos(this.direction)
  }
  getId(): string {
    return this.id
  }
  getPosition(): Position {
    return this.position
  }
  setPosition(newPosition: Position): void {
    this.position.x = newPosition.x
    this.position.y = newPosition.y
  }
  getRotation(): number {
    throw new Error('Method not implemented.')
  }
  setRotation(newRotation: number) {
    throw new Error('Method not implemented.')
  }
  getSpeed(): number {
    return this.speed
  }
  setSpeed(newSpeed: number) {
    this.speed = newSpeed
  }
  getMoveDirection(): number {
    return this.direction
  }
  setMoveDirection(number: any) {
    throw new Error('Method not implemented.')
  }
}

export default Bullet
