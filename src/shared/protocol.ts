import Bullet from '../server/game/bullet'

type Loc = {
  x: number
  y: number
  rot: number
}

type Airplane = Loc & {
  health: number
}

type GameUpdateMessage = {
  t: number
  self: Airplane
  airplanes: Array<Airplane>
  bullets: Array<Bullet>
}
