const supertest = require('supertest')
const HTMLParser = require('node-html-parser')
const { app } = require('./server')

describe('a express server', () => {
  it('should provide robots.txt', async () => {
    const res = await supertest(app).get('/robots.txt')
    expect(res.statusCode).toEqual(200)
  })
  it('should provide index.html with a canvas whose id is canvas', async () => {
    const res = await supertest(app).get('/')
    expect(res.statusCode).toEqual(200)
    expect(
      HTMLParser.parse(res.text).querySelector('canvas#canvas')
    ).toBeTruthy()
  })
})
