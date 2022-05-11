const RENDER_DELAY = 100

const gameUpdates = []
let gameStart = 0
let firstServerTimestamp = 0

export default class State {
  constructor() {
    gameStart = 0
    firstServerTimestamp = 0
  }

  update(updateData) {
    this.updateData = updateData
    if (!firstServerTimestamp) {
      firstServerTimestamp = this.updateData.GameUpdateMessage.t //這樣寫?
      gameStart = Date.now()
    }
    gameUpdates.push(this.updateData)

    const base = getBaseUpdate()
    if (base > 0) {
      gameUpdates.splice(0, base)
    }
  }

  currentServerTime() {
    return firstServerTimestamp + (Date.now() - gameStart) - RENDER_DELAY
  }

  getBaseUpdate() {
    const serverTime = currentServerTime()
    for (let i = gameUpdates.length - 1; i >= 0; i--) {
      if (gameUpdates[i].t <= serverTime) {
        return i
      }
    }
    return -1
  }

  getCurrentState() {
    if (!firstServerTimestamp) {
      return {}
    }

    const base = getBaseUpdate()
    const serverTime = currentServerTime()

    if (base < 0 || base === gameUpdates.length - 1) {
      return gameUpdates[gameUpdates.length - 1]
    } else {
      const baseUpdate = gameUpdates[base]
      const next = gameUpdates[base + 1]
      const ratio =
        (serverTime - baseUpdate.GameUpdateMessage.t) /
        (next.GameUpdateMessage.t - baseUpdate.GameUpdateMessage.t) // t沒有傳
      return {
        Loc: interpolateObject(baseUpdate.Loc, next.Loc, ratio),
        Airplane: interpolateObjectArray(
          baseUpdate.Airplane,
          next.Airplane,
          ratio
        ),
        GameUpdateMessage: interpolateObjectArray(
          baseUpdate.GameUpdateMessage,
          next.GameUpdateMessage,
          ratio
        ),
      }
    }
  }

  interpolateObject(object1, object2, ratio) {
    if (!object2) {
      return object1
    }

    const interpolated = {}
    Object.keys(object1).forEach((key) => {
      if (key === 'direction') {
        interpolated[key] = interpolateDirection(
          object1[key],
          object2[key],
          ratio
        )
      } else {
        interpolated[key] = object1[key] + (object2[key] - object1[key]) * ratio
      }
    })
    return interpolated
  }

  interpolateObjectArray(objects1, objects2, ratio) {
    return objects1.map((o) =>
      interpolateObject(
        o,
        objects2.find((o2) => o.id === o2.id),
        ratio
      )
    )
  }

  interpolateDirection(d1, d2, ratio) {
    const absD = Math.abs(d2 - d1)
    if (absD >= Math.PI) {
      if (d1 > d2) {
        return d1 + (d2 + 2 * Math.PI - d1) * ratio
      } else {
        return d1 - (d2 - 2 * Math.PI - d1) * ratio
      }
    } else {
      return d1 + (d2 - d1) * ratio
    }
  }
}
