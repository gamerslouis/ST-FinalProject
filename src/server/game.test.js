const Game = require('./game')


describe('Game', () => {
  describe('player connection', () => {
    it('A player need join a game with name', () => {
        const game = new Game();
        game.addPlayer('name');
        expect(game.playerList[0].name).not.toBeNull();
    })
  })
})