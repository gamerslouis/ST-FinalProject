import { IPlayer } from '../iPlayer'

export enum PlayerInputState {
  Press = 0,
  Release = 1,
}

export type PlayerInputEvent = {
  key: string
  state: PlayerInputState
}

export interface IGameControl {
  update()
  addPlayer(newPlayer: IPlayer)
  removePlayer(playerId: string)
  handleInput(playerId: string, event: PlayerInputEvent)
}
