import { Position } from './iGameObject'
import Bullet from './bullet'
const Constants = require('../../shared/constants')

describe('bullet', () => {
  it('construct a bullet', () => {
    let pos: Position = { x: 50, y: 60 }
    let direction = ((2 * Math.PI) / 360) * 30
    let speed = Constants.BULLET_SPEED
    let bullet = new Bullet('123', pos, direction, speed)
    expect(bullet.getId()).toEqual('123')
    expect(bullet.getPosition().x).toEqual(50)
    expect(bullet.getPosition().y).toEqual(60)
    expect(bullet.getMoveDirection()).toEqual(direction)
    expect(bullet.getSpeed()).toEqual(speed)
  })

  it('Set new position', () => {
    let pos: Position = { x: 50, y: 60 }
    let newPosition: Position = { x: 100, y: 150 }
    let bullet = new Bullet('123', pos, undefined, undefined)
    bullet.setPosition(newPosition)
    expect(bullet.getPosition().x).toEqual(newPosition.x)
    expect(bullet.getPosition().y).toEqual(newPosition.y)
  })

  it('Set new speed', () => {
    let pos: Position = { x: 50, y: 60 }
    let speed = 100
    let newSpeed = 200
    let bullet = new Bullet('123', pos, speed, undefined)
    bullet.setSpeed(newSpeed)
    expect(bullet.getSpeed()).toEqual(newSpeed)
  })

  it('Should update the location after a interval of time', () => {
    let dt = 1
    let speed = Constants.BULLET_SPEED
    let prePos: Position = { x: 50, y: 60 }
    let direction = ((2 * Math.PI) / 360) * 30
    let bullet = new Bullet('123', prePos, direction, speed)
    bullet.update(dt)
    expect(bullet.getPosition().x).toBeCloseTo(
      prePos.x + dt * speed * Math.sin(direction)
    )
    expect(bullet.getPosition().y).toBeCloseTo(
      prePos.y - dt * speed * Math.cos(direction)
    )
  })
})
