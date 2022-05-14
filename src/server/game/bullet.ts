import { IGameObject, Position } from './iGameObject'
import { randomUUID } from 'crypto'
import Constants from '../../shared/constants'

class Bullet implements IGameObject {
  id: string
  parentId: string
  position: Position = { x: 0, y: 0 }
  direction: number
  rotation: number
  speed: number

  constructor(parentId: string, pos: Position, dir: number, speed: number) {
    this.parentId = parentId
    this.id = randomUUID()
    this.position.x = pos.x
    this.position.y = pos.y
    this.direction = dir
    this.rotation = this.direction
    this.speed = speed
  }

  update(dt: number): boolean {
    this.position.x += dt * this.speed * Math.sin(this.direction)
    this.position.y -= dt * this.speed * Math.cos(this.direction)

    return (
      this.position.x < 0 ||
      this.position.x > Constants.MAP_SIZE ||
      this.position.y < 0 ||
      this.position.y > Constants.MAP_SIZE
    )
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
    return this.rotation
  }
  setRotation(newRotation: number) {
    this.rotation += newRotation
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
  serialize(): any {
    return {
      id: this.id,
      x: this.position.x,
      y: this.position.y,
      rot: this.rotation,
    }
  }
}

export default Bullet
