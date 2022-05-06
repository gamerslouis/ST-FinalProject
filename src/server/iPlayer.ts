export enum PlayerUpdateEventType {
  mapUpdate,
  playerDead,
}

export interface IPlayer {
  getName(): string
  getId(): string
  update(eventType: PlayerUpdateEventType, eventData: any)
}
