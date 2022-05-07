import initScript from './index'
import Client from './client'

jest.mock('./client')

describe('Index page logic', () => {
  beforeEach(() => {
    initScript()
  })
  it('will create client and try start after click enter btn', () => {
    document.getElementById('enter-game-btn').click()
    expect(Client).toHaveBeenCalled()
    expect(Client.mock.instances[0].connect).toHaveBeenCalled()
  })
})
