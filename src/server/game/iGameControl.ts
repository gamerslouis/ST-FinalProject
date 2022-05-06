import { IPlayer } from '../iPlayer'

enum PlayerInputState {
  Press = 0,
  Release = 1,
}

type PlayerInputEvent = {
  key: string
  state: PlayerInputState
}

export interface IGameControl {
  update(dt: number)
  addPlayer(newPlayer: IPlayer)
  removePlayer(playerId: string)
  handleInput(playerId: string, event: PlayerInputEvent)
}
