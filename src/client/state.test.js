import State from './state'
const RENDER_DELAY = 100

describe('state', () => {
  let state
  beforeEach(() => {
    state = new State()
  })

  it('construct state', () => {
    expect(state.gameStart).toEqual(0)
    expect(state.firstServerTimestamp).toEqual(0)
  })

  it('can store game data and take out', () => {
    const gameData = {}
    //真的太難了QQ
  })

  it('can get current server time', () => {
    expect(state.currentServerTime()).toEqual(
      state.firstServerTimestamp + (Date.now() - state.gameStart) - RENDER_DELAY
    )
  })
})
