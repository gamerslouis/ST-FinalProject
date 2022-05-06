import supertest from 'supertest'
import { parse } from 'node-html-parser'
import app from './server'

describe('a express server', () => {
  it('should provide robots.txt', async () => {
    const res = await supertest(app).get('/robots.txt')
    expect(res.statusCode).toEqual(200)
  })
  it('should provide index.html with a canvas whose id is canvas', async () => {
    const res = await supertest(app).get('/')
    expect(res.statusCode).toEqual(200)
    expect(parse(res.text).querySelector('canvas#canvas')).toBeTruthy()
  })
})
