import State from './state'
const RENDER_DELAY = 100

describe('state', () => {

  it('construct state', () => {
    const state = new State()
    expect(state.gameStart).toBe(0)
    expect(state.firstServerTimestamp).toBe(0)
    expect(state.gameUpdates).toEqual([])
  })

  it('can get current server time', () => {
    const state = new State()
    expect(state.currentServerTime()).toBe(
      state.firstServerTimestamp + (Date.now() - state.gameStart) - RENDER_DELAY
    )
  })

  it('can store game data and take out if base <= 0', () => {
    const state = new State()
    jest 
      .spyOn(state, 'getBaseUpdate')
      .mockImplementation(() => {})

    state.update({GameUpdateMessage: {t: 100}})
    expect(state.getBaseUpdate).toHaveBeenCalled()
  })

  it('can store game data and take out if base > 0', () => {
    const state = new State()
    jest 
      .spyOn(state, 'getBaseUpdate')
      .mockImplementation(() => 1)

    state.update({GameUpdateMessage: {t: 100}})
    expect(state.getBaseUpdate).toHaveBeenCalled()
  })

  it('getBaseUpdate can work and nothing in gameUpdates', () => {
    const state = new State()
    jest
      .spyOn(state, 'currentServerTime')
      .mockImplementation(() => {})
    state.getBaseUpdate()
    expect(state.currentServerTime).toHaveBeenCalled()
  })

  it('getBaseUpdate can work and something in gameUpdates', () => {
    const state = new State()
    jest
      .spyOn(state, 'currentServerTime')
      .mockImplementation(() => 10000)
    state.gameUpdates.push({t: 10})
    const result = state.getBaseUpdate()
    expect(state.currentServerTime).toHaveBeenCalled()
    expect(result).toBe(0)
  })

  it('getCurrentState if firstServerTimestamp = 0', () => {
    const state = new State()    
    const result = state.getCurrentState()
    expect(result).toEqual({})
  })

  it('getCurrentState if firstServerTimestamp != 0 and base < 0', () => {
    const state = new State()
    state.firstServerTimestamp = 10
    jest
      .spyOn(state, 'getBaseUpdate')
      .mockImplementation(() => -1)

    jest
      .spyOn(state, 'currentServerTime')
      .mockImplementation(() => 10000)
    state.gameUpdates.push({t: 10})

    const result = state.getCurrentState()
    expect(result).toEqual({t: 10})
  })

  it('getCurrentState if firstServerTimestamp != 0 and base > 0', () => {
    const state = new State()
    state.firstServerTimestamp = 10
    jest
      .spyOn(state, 'getBaseUpdate')
      .mockImplementation(() => 0)
    jest
      .spyOn(state, 'currentServerTime')
      .mockImplementation(() => 10000)
    jest
      .spyOn(state, 'interpolateObject')
      .mockImplementation(() => 10000)
    jest
      .spyOn(state, 'interpolateObjectArray')
      .mockImplementation(() => 10000)
    //state.gameUpdates.push({GameUpdateMessage: {t: 10}})
    //state.gameUpdates.push({GameUpdateMessage: {t: 100}})
    /*const object1 = {
      x: 10,
      y: 1,
      rot: 2,
    }

    const result = state.getCurrentState()
    expect(result).toEqual({t: 10})*/
  })

  it('interpolateObject when object2 is empty', () => {
    const state = new State()
    const object1 = {
      x: 10,
      y: 1,
      rot: 2,
    }
    const result = state.interpolateObject(object1)
    expect(result).toEqual(object1)
  })

  it('interpolateObject when object2 is not empty', () => {
    const state = new State()
    jest
      .spyOn(state, 'interpolateDirection')
      .mockImplementation(() => 2)
    
    const object1 = {
      x: 10,
      y: 1,
      rot: 2,
    }
    const object2 = {
      x: 20,
      y: 2,
      rot: 2,
    }

    const result = state.interpolateObject(object1, object2, 2)
    const interpolated = {
      x: 30,
      y: 3,
      rot: 2,
    }
    expect(result).toEqual(interpolated)
  })

  it('interpolateObjectArray', () => {
    const state = new State()
    const object1 = {
      x: 10,
      y: 1,
      rot: 2,
    }
    const object2 = {
      x: 20,
      y: 2,
      rot: 2,
    }
    const interpolated = {
      x: 30,
      y: 3,
      rot: 2,
    }
    /*jest
      .spyOn(state, 'interpolateObject')
      .mockImplementation(() => interpolated)*/
    jest
      .spyOn(state, 'objects1.map')
      .mockImplementation(() => interpolated)

    const result = state.interpolateObjectArray(object1, object2, 2)
    expect(result).toEqual(interpolated)
  })

  it('all cases of interpolateDirection', () => {
    const state = new State()
    let result = state.interpolateDirection(10, 1, 2)
    expect(result).toBeCloseTo(4 * Math.PI - 8)

    result = state.interpolateDirection(1, 10, 2)
    expect(result).toBeCloseTo(4 * Math.PI - 17)

    result = state.interpolateDirection(1, 2, 2)
    expect(result).toBeCloseTo(3)
  })
})
