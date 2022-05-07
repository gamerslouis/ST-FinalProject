import { randomUUID } from 'crypto'
import { Socket } from 'socket.io'
import { IPlayer, PlayerUpdateEventType } from './iPlayer'
const constatns = require('../shared/constants')

export default class Player implements IPlayer {
  socket: Socket
  username: string
  id: string

  constructor(username, socket) {
    this.username = username
    this.socket = socket
    this.id = randomUUID()
  }

  getName(): string {
    return this.username
  }

  getId(): string {
    return this.id
  }

  update(eventType: PlayerUpdateEventType, eventData: any) {
    switch (eventType) {
      case PlayerUpdateEventType.gameUpdate:
        this.socket.emit(constatns.MSG_TYPES.GAME_UPDATE, eventData)
        break
      case PlayerUpdateEventType.playerDead:
        this.socket.emit(constatns.MSG_TYPES.GAME_OVER, null)
      default:
        break
    }
  }

  close() {
    this.socket.disconnect()
  }
}
