import { Server } from 'socket.io'
import Game from './game/game'
import Player from './player'

const game = new Game()
const io = new Server()

io.on('connect', (socket) => {
  new Player(socket, game)
})

export default io
