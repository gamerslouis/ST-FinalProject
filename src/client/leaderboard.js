import escape from 'lodash/escape'

const leaderboard = document.getElementById('leaderboard')
const rows = document.querySelectorAll('#leaderboard table tr')

export default class Leaderboard {
  updateLeaderboard(data) {
    this.data = data
    for (let i = 0; i < Object.values(this.data).length; i++) {
      rows[i + 1].innerHTML = `<td>${
        escape(Object.values(this.data)[i].playerName) || 'Anonymous'
      }</td><td>${Object.values(this.data)[i].score}</td>`
    }
    for (let i = Object.values(this.data).length; i < 5; i++) {
      rows[i + 1].innerHTML = '<td>-</td><td>-</td>'
    }
  }

  setLeaderboardHidden(hidden) {
    this.hidden = hidden
    if (this.hidden) {
      leaderboard.classList.add('hidden')
    } else {
      leaderboard.classList.remove('hidden')
    }
  }
}
