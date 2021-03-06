import { IGameObject, Position } from './iGameObject'

export interface IAirplane extends IGameObject {
  getHealth(): number
  setHealth(newHealth: number)
  acceptDamage(damage: number)
}
