import State from './state'

describe('state', () => {
  let state
  beforeEach(() => {
    state = new State()
  })

  it('can store game data and take out', () => {
    const gameData = {}
    state.update(gameData)
    expect(gameData).toEqual(state.getCurrentState())
  })
})
