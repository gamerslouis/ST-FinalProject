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
    this.socket.emit(Constants.MSG_TYPES.INPUT, {
      key: event.key,
      state: press ? 0 : 1,
    })
  }

  handleMouseEvent(event, press) {
    let key
    switch (event.which) {
      case 1:
        key = 'lm'
        break
      case 2:
        key = 'mm'
        break
      case 3:
        key = 'rm'
        break
      default:
    }
    if (key) {
      this.socket.emit(Constants.MSG_TYPES.INPUT, {
        key,
        state: press ? 0 : 1,
      })
    }
  }
}
