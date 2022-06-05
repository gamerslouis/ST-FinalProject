import { EventEmitter } from 'events'
import connect from './network'
import InputManager from './input'
import Render from './render'
import State from './state'
import Leaderboard from './leaderboard'

import constants from '../shared/constants'

class Client extends EventEmitter {
  constructor(username, canvas) {
    super()
    this.username = username
    this.canvas = canvas
    this.network = undefined
    this.input = undefined
    this.running = false
  }

  async start() {
    this.network = await connect()
    this.network.getSocket().emit(constants.MSG_TYPES.JOIN_GAME, this.username)

    this.input = new InputManager(this.network.getSocket())
    this.state = new State()
    this.render = new Render(
      this.canvas,
      window,
      this.state.getCurrentState.bind(this.state)
    )

    this.input.attach()
    this.render.startFrameRendering()

    this.network.getSocket().on(constants.MSG_TYPES.GAME_UPDATE, (data) => {
      this.state.update(data)
    })
    this.network.getSocket().on(constants.MSG_TYPES.GAME_OVER, () => {
      this.clear()
    })
    this.network.getSocket().on('disconnect', () => {
      this.clear()
    })
    this.running = true

    this.leaderboard = new Leaderboard()
    this.leaderboard.setLeaderboardHidden(false)
  }

  clear() {
    if (this.running) {
      this.running = false
      this.input.dettach()
      this.render.stopFrameRendering()
      this.emit('gameEnd')

      this.leaderboard.setLeaderboardHidden(true)
    }
  }
}

const startClient = async (username, canvas) => {
  const client = new Client(username, canvas)
  await client.start()
  return client
}

export default startClient
