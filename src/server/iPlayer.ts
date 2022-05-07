export enum PlayerUpdateEventType {
  gameUpdate,
  playerDead,
}

export interface IPlayer {
  getName(): string
  getId(): string
  update(eventType: PlayerUpdateEventType, eventData: any)
  close()
}
