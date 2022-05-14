export default class State {
  update(updateData) {
    this.updateData = updateData
  }

  getCurrentState() {
    return this.updateData
  }
}
