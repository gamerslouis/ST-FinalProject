import { Position } from './iGameObject'
import Bullet from './bullet'
import { posix } from 'path'
const Constants = require('../../shared/constants')

describe('bullet', () => {
  it('construct a bullet', () => {
    let pos: Position = { x: 50, y: 60 }
    let direction = ((2 * Math.PI) / 360) * 30
    let speed = Constants.BULLET_SPEED
    let bullet = new Bullet('123', pos, direction, speed)
    expect(bullet.getParentId()).toEqual('123')
    expect(typeof bullet.getId()).toBe('string')
    expect(bullet.getPosition().x).toEqual(50)
    expect(bullet.getPosition().y).toEqual(60)
    expect(bullet.getMoveDirection()).toEqual(direction)
    expect(bullet.getSpeed()).toEqual(speed)
    expect(bullet.getRotation()).toBeCloseTo(bullet.getMoveDirection())
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
  it('DistanceTo calculate correct', () => {
    let speed = Constants.BULLET_SPEED
    let pos: Position = { x: 50, y: 60 }
    let direction = ((2 * Math.PI) / 360) * 30
    let bullet = new Bullet('123', pos, direction, speed)
    let targetPositionX = 100
    let targetPositionY = 200
    let dx = pos.x - targetPositionX
    let dy = pos.y - targetPositionY
    expect(
      bullet.distanceTo({ x: targetPositionX, y: targetPositionY })
    ).toBeCloseTo(Math.sqrt(dx * dx + dy * dy))
  })

  it('Serialize data checking', () => {
    let speed = Constants.BULLET_SPEED
    let pos: Position = { x: 50, y: 60 }
    let direction = ((2 * Math.PI) / 360) * 30
    let bullet = new Bullet('123', pos, direction, speed)
    expect(bullet.serialize()).toEqual({
      id: bullet.getId(),
      x: bullet.getPosition().x,
      y: bullet.getPosition().y,
      rot: bullet.rotation,
    })
  })

  describe('Non-use interface need to throw error', () => {
    it('setRotation', () => {
      let speed = Constants.BULLET_SPEED
      let prePos: Position = { x: 50, y: 60 }
      let direction = ((2 * Math.PI) / 360) * 30
      let bullet = new Bullet('123', prePos, direction, speed)
      expect(bullet.setRotation).toThrowError('Method')
    })
    it('setMoveDirection', () => {
      let speed = Constants.BULLET_SPEED
      let prePos: Position = { x: 50, y: 60 }
      let direction = ((2 * Math.PI) / 360) * 30
      let bullet = new Bullet('123', prePos, direction, speed)
      expect(bullet.setMoveDirection).toThrowError('Method')
    })
  })
})
