import Airplane from './airplane'
import { PlayerInputState } from './iGameControl'
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
      expect(airplane.getRotation()).toBeCloseTo(airplane.getMoveDirection())
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

    it('Update position on a interval time, which should be in a map', () => {
      let airplane = new Airplane('123')
      let dt = 1
      let speed = airplane.getSpeed()
      const prePosX = airplane.getPosition().x
      const prePosY = airplane.getPosition().y
      const direction = airplane.getMoveDirection()

      airplane.update(dt)

      const computeX = prePosX + dt * speed * Math.sin(direction)
      const computeY = prePosY - dt * speed * Math.cos(direction)
      const expectX = Math.max(0, Math.min(Constants.MAP_SIZE, computeX))
      const expectY = Math.max(0, Math.min(Constants.MAP_SIZE, computeY))
      expect(airplane.getPosition().x).toBeCloseTo(expectX)
      expect(airplane.getPosition().y).toBeCloseTo(expectY)
    })

    it('Serialize data checking', () => {
      let airplane = new Airplane('123')
      expect(airplane.serialize()).toEqual({
        id: airplane.getId(),
        x: 50,
        y: 50,
        rot: airplane.rotation,
        health: Constants.PLAYER_MAX_HP,
      })
    })

    describe('Direction', () => {
      it('Trun left when trunLeft flag is on', () => {
        let airplane = new Airplane('123')
        let dt = 1
        const preDirection = airplane.getMoveDirection()

        // Set trunLeft flag on
        airplane.control.turnLeft = PlayerInputState.Press

        airplane.update(dt)

        expect(airplane.getMoveDirection()).toBeCloseTo(
          preDirection + Constants.MOVE_DELTA_RAD
        )
        expect(airplane.getRotation()).toBeCloseTo(
          preDirection + Constants.MOVE_DELTA_RAD
        )
      })

      it('Go straight when trunLeft and turnRight flag are both off or both on', () => {
        let airplane = new Airplane('123')
        let dt = 1
        const preDirection = airplane.getMoveDirection()

        // Set both trunLeft flag and trunRight flag on
        airplane.control.turnLeft = PlayerInputState.Press
        airplane.control.turnRight = PlayerInputState.Press

        airplane.update(dt)

        expect(airplane.getMoveDirection()).toBeCloseTo(preDirection)
        expect(airplane.getRotation()).toBeCloseTo(preDirection)

        // Set both trunLeft flag and trunRight flag off
        airplane.control.turnLeft = PlayerInputState.Release
        airplane.control.turnRight = PlayerInputState.Release

        airplane.update(dt)

        expect(airplane.getMoveDirection()).toBeCloseTo(preDirection)
        expect(airplane.getRotation()).toBeCloseTo(preDirection)
      })

      it('Trun left when trunRight flag is on', () => {
        let airplane = new Airplane('123')
        let dt = 1
        const preDirection = airplane.getMoveDirection()

        // Set trunLeft flag on
        airplane.control.turnRight = PlayerInputState.Press

        airplane.update(dt)

        expect(airplane.getMoveDirection()).toBeCloseTo(
          preDirection - Constants.MOVE_DELTA_RAD
        )
        expect(airplane.getRotation()).toBeCloseTo(
          preDirection - Constants.MOVE_DELTA_RAD
        )
      })
    })
  })
})
