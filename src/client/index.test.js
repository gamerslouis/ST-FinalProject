import initScript from './index'
import Client from './client'

jest.mock('./client')
// Client.mockImplementation(() => {
//   return {}
// })

describe('Index page logic', () => {
  beforeAll(() => {
    initScript()
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it(
    'will show loading, create client with username ' +
      'and try start after click enter btn',
    () => {
      document.getElementById('username-input').value = 'testuser'
      document.getElementById('enter-game-btn').click()
      expect(document.getElementById('loading-hover').style.display).toBe(
        'block'
      )
      expect(Client).toBeCalledWith('testuser')
      expect(Client.mock.instances[0].start).toHaveBeenCalled()
    }
  )
  it(
    'will hide loading and show error msg if start fail, ' +
      'then hide err msg after retry',
    () => {
      Client.prototype.start = jest.fn().mockImplementationOnce(() => {
        throw new Error('ERRMSG')
      })
      document.getElementById('username-input').value = 'testuser'
      document.getElementById('enter-game-btn').click()
      expect(document.getElementById('loading-hover').style.display).toBe(
        'none'
      )
      expect(document.getElementById('error-msg').style.display).toBe('block')
      expect(document.getElementById('error-msg').innerText).toBe('ERRMSG')
    }
  )
})
