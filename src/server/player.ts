import { randomUUID } from 'crypto'
import { Socket } from 'socket.io'
import { IGameControl } from './game/iGameControl'
import { IPlayer, PlayerUpdateEventType } from './iPlayer'
const Constants = require('../shared/constants')

export default class Player implements IPlayer {
  socket: Socket
  username: string
  id: string
  gameControl: IGameControl

  constructor(socket, gameControl: IGameControl) {
    this.socket = socket
    this.id = randomUUID()
    this.gameControl = gameControl

    socket.on(Constants.MSG_TYPES.JOIN_GAME, (username) => {
      this.username = username
      gameControl.addPlayer(this)

      socket.on('disconnect', () => {
        gameControl.handleDisconnect(this.id)
      })
      
      socket.on(Constants.MSG_TYPES.INPUT, (evt) => {
        gameControl.handleInput(this.id, evt)
      })
    })
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
        this.socket.emit(Constants.MSG_TYPES.GAME_UPDATE, eventData)
        break
      case PlayerUpdateEventType.playerDead:
        this.socket.emit(Constants.MSG_TYPES.GAME_OVER, null)
      default:
        break
    }
  }

  close() {
    this.socket.disconnect()
  }
}
