import { IGameObject, Position } from './iGameObject'
import { randomUUID } from 'crypto'

class Bullet implements IGameObject {
  id: string
  parentId: string
  position: Position = { x: 0, y: 0 }
  direction: number
  speed: number

  constructor(parentId: string, pos: Position, dir: number, speed: number) {
    this.parentId = parentId
    this.id = randomUUID()
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

  getParentId(): string {
    return this.parentId
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
