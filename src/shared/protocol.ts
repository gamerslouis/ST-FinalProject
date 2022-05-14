type Loc = {
  x: number
  y: number
  rot: number
}

type Airplane = Loc & {
  id: string
  health: number
}

type Bullet = Loc & {
  id: string
}

type GameUpdateMessage = {
  t: number
  self: Airplane
  airplanes: Array<Airplane>
  bullets: Array<Bullet>
}

{
  airplanes: [
    {
      x: 10,
      y: 50,
      rot: 1,
    },
  ]
}
