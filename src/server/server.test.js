const supertest = require('supertest')
const { app } = require('./server')

describe('Serve a web server', () => {
  it('should get robots.txt', async () => {
    const res = await supertest(app).get('/robots.txt')
    expect(res.statusCode).toEqual(200)
  })
})
