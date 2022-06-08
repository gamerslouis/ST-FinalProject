import Leaderboard from './leaderboard'
const RENDER_DELAY = 100

export default class State {
  constructor() {
    this.gameStart = 0
    this.firstServerTimestamp = 0
    this.gameUpdates = []
    this.leaderboard = new Leaderboard()
  }

  update(updateData) {
    this.updateData = updateData
    if (!this.firstServerTimestamp) {
      this.firstServerTimestamp = this.updateData.t
      this.gameStart = Date.now()
    }
    this.gameUpdates.push(this.updateData)

    const dummyLeaderboard = [
      { username: '123', score: 777 },
      { username: '456', score: 0 },
    ]
    this.leaderboard.updateLeaderboard(updateData.scoreboard);
    //this.leaderboard.updateLeaderboard(dummyLeaderboard)

    const base = this.getBaseUpdate()
    if (base > 0) {
      this.gameUpdates.splice(0, base)
    }
  }

  currentServerTime() {
    return (
      this.firstServerTimestamp + (Date.now() - this.gameStart) - RENDER_DELAY
    )
  }

  getBaseUpdate() {
    const serverTime = this.currentServerTime()
    for (let i = this.gameUpdates.length - 1; i >= 0; i--) {
      if (this.gameUpdates[i].t <= serverTime) {
        return i
      }
    }
    return -1
  }

  getCurrentState() {
    //console.log(this.updateData)
    if (!this.firstServerTimestamp) {
      return this.updateData
    }
    const base = this.getBaseUpdate()
    const serverTime = this.currentServerTime()
    if (base < 0 || base === this.gameUpdates.length - 1) {
      return this.gameUpdates[this.gameUpdates.length - 1]
    } else {
      const baseUpdate = this.gameUpdates[base]
      const next = this.gameUpdates[base + 1]
      const ratio = (serverTime - baseUpdate.t) / (next.t - baseUpdate.t)

      /*console.log({
        self: this.interpolateObject(baseUpdate.self, next.self, ratio),
        airplanes: this.interpolateObjectArray(
          baseUpdate.airplanes,
          next.airplanes,
          ratio
        ),
        bullets: this.interpolateObjectArray(
          baseUpdate.bullets,
          next.bullets,
          ratio
        ),
      })*/
      return {
        self: this.interpolateObject(baseUpdate.self, next.self, ratio),
        airplanes: this.interpolateObjectArray(
          baseUpdate.airplanes,
          next.airplanes,
          ratio
        ),
        bullets: this.interpolateObjectArray(
          baseUpdate.bullets,
          next.bullets,
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
      if (key === 'rot') {
        interpolated[key] = this.interpolateDirection(
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
    return Object.values(objects1).map((o) =>
      this.interpolateObject(
        o,
        Object.values(objects2).find((o2) => o.id === o2.id),
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
