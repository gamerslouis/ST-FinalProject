import constants from '../shared/constants'
import InputManager from './input'

describe('Game input manage module', () => {
  let socket
  let manager

  beforeEach(() => {
    socket = {
      emit: jest.fn(),
    }
    manager = new InputManager(socket)
  })
  afterEach(() => {
    manager.dettach()
    jest.resetAllMocks()
  })

  const sendEvents = () => {
    document.body.dispatchEvent(
      new MouseEvent('mousedown', {
        which: 1,
      })
    )
    document.body.dispatchEvent(
      new MouseEvent('mouseup', {
        which: 1,
      })
    )
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
      })
    )
    document.body.dispatchEvent(
      new KeyboardEvent('keyup', {
        key: 'ArrowLeft',
      })
    )
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
      })
    )
    document.body.dispatchEvent(
      new KeyboardEvent('keyup', {
        key: 'ArrowRight',
      })
    )
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: ' ',
      })
    )
    document.body.dispatchEvent(
      new KeyboardEvent('keyup', {
        key: ' ',
      })
    )
  }

  it('attach key&mouse event to send sock event', () => {
    manager.attach()
    sendEvents()
    expect(socket.emit).toBeCalledTimes(8)
    expect(socket.emit).toHaveBeenNthCalledWith(1, constants.MSG_TYPES.INPUT, {
      key: 'mouse',
      state: 0,
    })
    expect(socket.emit).toHaveBeenNthCalledWith(2, constants.MSG_TYPES.INPUT, {
      key: 'mouse',
      state: 1,
    })
    expect(socket.emit).toHaveBeenNthCalledWith(3, constants.MSG_TYPES.INPUT, {
      key: 'left_arrow_key',
      state: 0,
    })
    expect(socket.emit).toHaveBeenNthCalledWith(4, constants.MSG_TYPES.INPUT, {
      key: 'left_arrow_key',
      state: 1,
    })
    expect(socket.emit).toHaveBeenNthCalledWith(5, constants.MSG_TYPES.INPUT, {
      key: 'right_arrow_key',
      state: 0,
    })
    expect(socket.emit).toHaveBeenNthCalledWith(6, constants.MSG_TYPES.INPUT, {
      key: 'right_arrow_key',
      state: 1,
    })
  })

  it('can dettach handlers', () => {
    manager.attach()
    manager.dettach()
    expect(socket.emit).not.toBeCalled()
  })
})
