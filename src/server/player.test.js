const Player  = require('./player')

describe('Player', () => {
  it('Get updated info', () => {
    const player = new Player('123', 'name');
    expect(player.update()).toEqual(expect.objectContaining({
      hp: player.hp,
      direction: expect.any(Number)
    }));
  });

  it('Minus HP when being hit by Bullet', () => {
    const player = new Player('123', 'name');
    preHp = player.hp;
    player.hitByBullet();
    expect(player.hp).toBeLessThan(preHp);
  });



});