import Airplane from './airplane'
import Bullet from './bullet'
import { checkCollisionToBullets } from './collision'

const Constants = require('../../shared/constants')

describe('collision', () => {
  it('Should apply damage when bullet collides with player', () => {
    const airplane = new Airplane('1')
    airplane.position.x = 50
    airplane.position.y = 50
    const bullet = new Bullet(
      '2',
      { x: 50, y: 50 + Constants.BULLET_RADIUS + Constants.PLAYER_RADIUS },
      0,
      0
    )

    jest.spyOn(airplane, 'acceptDamage')
    jest.spyOn(airplane, 'distanceTo')

    const result = checkCollisionToBullets([airplane], [bullet])

    expect(airplane.acceptDamage).toHaveBeenCalledTimes(1)
    expect(result).toHaveLength(1)
    expect(result).toContain(bullet)
  })

  it('Should not collide when outside radius', () => {
    const distanceFromAirplane =
      Constants.BULLET_RADIUS + Constants.PLAYER_RADIUS + 1
    const airplane = new Airplane('1')
    const bullets = [
      new Bullet(
        '2',
        {
          x: Constants.PLAYER_ORIGIN_POS_X,
          y: Constants.PLAYER_ORIGIN_POS_Y + distanceFromAirplane,
        },
        0,
        0
      ),
      new Bullet(
        '2',
        {
          x: Constants.PLAYER_ORIGIN_POS_X,
          y: Constants.PLAYER_ORIGIN_POS_Y - distanceFromAirplane,
        },
        0,
        0
      ),
    ]

    const result = checkCollisionToBullets([airplane], bullets)
    expect(result).toHaveLength(0)
  })

  it('The bullet should not collide with it own player', () => {
    const airplaneId = '1234'
    const airplane = new Airplane(airplaneId)
    const bullet = new Bullet(
      airplaneId,
      { x: 50, y: 50 + Constants.BULLET_RADIUS + Constants.PLAYER_RADIUS },
      0,
      0
    )

    const result = checkCollisionToBullets([airplane], [bullet])
    expect(result).toHaveLength(0)
  })
})
