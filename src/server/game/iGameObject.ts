export interface Position {
  x: number
  y: number
}

export interface IGameObject {
  update(dt: number)
  getId(): string
  getPosition(): Position
  setPosition(newPosition: Position): void
  getRotation(): number
  setRotation(newRotation: number)
  getSpeed(): number
  setSpeed(newSpeed: number)
  getMoveDirection(): number
  setMoveDirection(number)
}
