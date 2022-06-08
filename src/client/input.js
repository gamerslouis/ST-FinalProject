import { throttle } from 'throttle-debounce'
import constants from '../shared/constants'

const Constants = require('../shared/constants')

export default class InputManager {
  constructor(socket) {
    this.socket = socket
    this.handleKeyEvent = this.handleKeyEvent.bind(this)
    this.handleMouseEvent = this.handleMouseEvent.bind(this)
    this.handleKeyDownEvent = (e) => this.handleKeyEvent(e, true)
    this.handleKeyUpEvent = (e) => this.handleKeyEvent(e, false)
    this.handleMouseDownEvent = (e) => this.handleMouseEvent(e, true)
    this.handleMouseUpEvent = (e) => this.handleMouseEvent(e, false)
    this.throttleEmit = throttle(1000, this.socket.emit, {
      noLeading: false,
      noTrailing: false,
    })
  }

  attach() {
    document.body.addEventListener('keydown', this.handleKeyDownEvent)
    document.body.addEventListener('keyup', this.handleKeyUpEvent)
    document.body.addEventListener('mousedown', this.handleMouseDownEvent)
    document.body.addEventListener('mouseup', this.handleMouseUpEvent)
  }

  dettach() {
    document.body.removeEventListener('keydown', this.handleKeyDownEvent)
    document.body.removeEventListener('keyup', this.handleKeyUpEvent)
    document.body.removeEventListener('mousedown', this.handleMouseDownEvent)
    document.body.removeEventListener('mouseup', this.handleMouseUpEvent)
  }

  handleKeyEvent(event, press) {
    if (!event.repeat) {
      if (event.key === 'ArrowLeft') {
        this.socket.emit(Constants.MSG_TYPES.INPUT, {
          key: constants.INPUT_EVENTS.LEFT_ARROW_KEY,
          state: press ? 0 : 1,
        })
      }
      if (event.key === 'ArrowRight') {
        this.socket.emit(Constants.MSG_TYPES.INPUT, {
          key: constants.INPUT_EVENTS.RIGHT_ARROW_KEY,
          state: press ? 0 : 1,
        })
      }
      if (event.key === ' ') {
        this.throttleEmit(Constants.MSG_TYPES.INPUT, {
          key: constants.INPUT_EVENTS.SPACE,
          state: press ? 0 : 1,
        })
      }
    }
  }

  handleMouseEvent(event, press) {
    if (event.which === 1) {
      this.socket.emit(Constants.MSG_TYPES.INPUT, {
        key: constants.INPUT_EVENTS.MOUSE,
        state: press ? 0 : 1,
      })
    }
  }
}
