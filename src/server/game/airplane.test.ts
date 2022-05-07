import Airplane from './airplane'
import { Position } from './iGameObject'
const Constants = require('../../shared/constants')

describe('Airplane', () => {
  describe('Init', () => {
    it('Construct a Airplane', () => {
      let airplane = new Airplane('123')
      expect(airplane.getId()).toEqual('123')
      expect(airplane.getPosition().x).not.toBeNaN()
      expect(airplane.getPosition().y).not.toBeNaN()
      expect(airplane.getSpeed()).toEqual(Constants.PLAYER_SPEED)
      expect(airplane.getRotation()).not.toBeNaN()
      expect(airplane.getHealth()).toEqual(Constants.PLAYER_MAX_HP)
      expect(airplane.getMoveDirection()).not.toBeNaN()
    })

    it('The position should be in the map', () => {
      let airplane = new Airplane('123')
      expect(airplane.getPosition().x).toBeGreaterThanOrEqual(0)
      expect(airplane.getPosition().x).toBeLessThanOrEqual(Constants.MAP_SIZE)
      expect(airplane.getPosition().y).toBeGreaterThanOrEqual(0)
      expect(airplane.getPosition().y).toBeLessThanOrEqual(Constants.MAP_SIZE)
    })

    it('The rotation should between -1 and 1', () => {
      let airplane = new Airplane('123')
      expect(airplane.getRotation()).toBeGreaterThanOrEqual(-1)
      expect(airplane.getRotation()).toBeLessThanOrEqual(1)
    })
  })

  describe('update', () => {
    it('After accepting the damage, the value of the health have to decrease', () => {
      let airplane = new Airplane('123')
      let originHealth = airplane.getHealth()
      airplane.acceptDamage(5)
      expect(airplane.getHealth()).toEqual(originHealth - 5)
    })

    it('Compute currect distance to the certain position', () => {
      let airplane = new Airplane('123')
      let airplanePos = airplane.getPosition()
      let distance = airplane.distanceTo({ x: 100, y: 100 })
      let dx = airplanePos.x - 100
      let dy = airplanePos.y - 100
      let supposedDis = Math.sqrt(dx * dx + dy * dy)
      expect(distance).toEqual(supposedDis)
    })
  })
})