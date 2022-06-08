import initScript from './index'
import Client from './client'

jest.mock('./client')
jest.useFakeTimers()

describe('Index page logic', () => {
  beforeAll(() => {
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.onload() // simulate success
        }, 100)
      }
    }
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
      expect(Client).toBeCalledWith(
        'testuser',
        document.getElementById('canvas')
      )
      jest.runOnlyPendingTimers()
    }
  )
  it(
    'will hide loading and show error msg if start fail, ' +
      'then hide err msg after retry',
    async () => {
      Client.mockImplementationOnce(() => {
        throw new Error('ERRMSG')
      })
      document.getElementById('username-input').value = 'testuser'
      document.getElementById('enter-game-btn').click()
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            expect(document.getElementById('loading-hover').style.display).toBe(
              'none'
            )
            expect(document.getElementById('error-msg').style.display).toBe(
              'block'
            )
            expect(document.getElementById('error-msg').innerText).toBe(
              'ERRMSG'
            )
            resolve()
          } catch (e) {
            reject(e)
          }
        }, 0)
      })
    }
  )
})
