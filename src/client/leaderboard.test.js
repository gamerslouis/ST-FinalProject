import Leaderboard from './leaderboard'

describe('leaderboard', () => {
  const mockedElementDOM = { classList: { remove: jest.fn(), add: jest.fn() } }
  const l = document.getElementById('leaderboard')

  it('leaderboard can update', () => {
    const leaderboard = new Leaderboard()
    const dummyLeaderboard = [
      { username: '123', score: 777 },
      { username: '456', score: 0 },
    ]

    leaderboard.updateLeaderboard(dummyLeaderboard)
    expect(leaderboard.data).toBe(dummyLeaderboard)
  })

  it('should remove the class', () => {
    const leaderboard = new Leaderboard()

    leaderboard.setLeaderboardHidden(true)
    expect(leaderboard.hidden).toBe(true)
  })

  it('should add the class', () => {
    const leaderboard = new Leaderboard()

    leaderboard.setLeaderboardHidden(false)
    expect(leaderboard.hidden).toBe(false)
  })
})
