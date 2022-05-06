const Bullet = require('./bullet')

describe('Bullet', () => {
  it('Get updated info', () => {
    const bullet = new Bullet('123', 40, 30);
    expect(bullet.getUpdatedInfo()).toEqual(expect.objectContaining({
      id: expect.any(String),
      x: expect.any(Number),
      y: expect.any(Number)
    }))
  });


})