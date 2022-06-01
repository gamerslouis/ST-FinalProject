import { debounce } from 'throttle-debounce'
import { getAsset } from './assets'

const Constants = require('../shared/constants')

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants

export default class Render {
  constructor(canvas, window, stateProvider) {
    this.window = window
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.stateProvider = stateProvider
    this.animationFrameRequestId = null

    this.setCanvasDimensions()
    this.window.addEventListener(
      'resize',
      debounce(40, this.setCanvasDimensions)
    )

    // Bind
    this.render = this.render.bind(this)
    this.renderBackground = this.renderBackground.bind(this)
    this.renderPlayer = this.renderPlayer.bind(this)
    this.renderBullet = this.renderBullet.bind(this)
    this.frameReinder = this.frameReinder.bind(this)

    // aside
    this.renderMap = this.renderMap.bind(this)
    this.renderMapObj = this.renderMapObj.bind(this)
    this.renderBoard = this.renderBoard.bind(this)

    // debug
    this.plotxy - this.plotxy.bind(this)
  }

  startFrameRendering() {
    if (this.animationFrameRequestId !== null) {
      cancelAnimationFrame(this.animationFrameRequestId)
    }
    this.animationFrameRequestId = requestAnimationFrame(this.frameReinder)
  }

  stopFrameRendering() {
    if (this.animationFrameRequestId !== null) {
      cancelAnimationFrame(this.animationFrameRequestId)
    }
    this.animationFrameRequestId = null
  }

  frameReinder() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.render(this.stateProvider())
    this.animationFrameRequestId = requestAnimationFrame(this.frameReinder)
  }

  setCanvasDimensions = () => {
    const scaleRatio = Math.max(1, 800 / this.window.innerWidth)
    this.canvas.width = scaleRatio * this.window.innerWidth
    this.canvas.height = scaleRatio * this.window.innerHeight
  }

  plotxy(self) {
    this.context.fillStyle = 'red'
    this.context.fillRect(0, 0, 100, 10)
    this.context.fillStyle = 'green'
    this.context.fillRect(0, 0, 10, 100)
  }

  render(renderData) {
    if (renderData === undefined) return

    const { self, airplanes, bullets } = renderData

    //-------------------------------------------------------
    this.context.save()

    // Initialize : set airplane as center
    const mycenterX = this.canvas.width / 2
    const mycenterY = (this.canvas.height * 2) / 3
    this.context.translate(mycenterX, mycenterY)

    // Background moves in a reverse direction
    this.context.save()
    this.context.translate(mycenterX, mycenterY)
    this.context.rotate(-Math.PI)
    this.renderBackground(self)
    this.context.restore()

    // Player
    this.renderPlayer(self, self, 0)

    // spaceships
    this.context.save()
    this.context.scale(-1, 1) //!!!
    this.context.rotate(-self.rot)
    airplanes.forEach((ship) => this.renderPlayer(self, ship))
    this.context.restore()

    // Bullets
    this.context.save()
    this.context.scale(-1, 1) //!!!
    this.context.rotate(-self.rot)
    bullets.forEach(this.renderBullet.bind(null, self))
    this.context.restore()

    this.context.restore()
    //-------------------------------------------------------
    this.renderMap(self, airplanes)
    this.renderBoard(self, airplanes)
  }

  //=====================================================================

  renderMap(self, ships) {
    let w = this.canvas.width
    let h = this.canvas.height
    let map_w = w / 10
    let map_h = h / 10
    let obj_w = w / 50
    const { x, y, rot } = self

    this.context.fillStyle = 'black'
    this.context.globalAlpha = 0.5
    this.context.fillRect(0, 0, map_w + obj_w, map_h + obj_w)
    this.context.globalAlpha = 1

    const airplane_img = getAsset('me.svg')
    const ship_img = getAsset('panda.svg')

    this.renderMapObj(airplane_img, self, obj_w)
    ships.forEach((ship) => this.renderMapObj(ship_img, ship, obj_w))
  }

  renderMapObj(img, obj, obj_w) {
    const { x, y, rot } = obj
    let w = this.canvas.width
    let h = this.canvas.height

    let map_w = w / 10
    let map_h = h / 10

    let myx = (map_w * x) / MAP_SIZE + 0.5 * obj_w
    let myy = (map_h * (h - y)) / MAP_SIZE + 1 * obj_w

    this.context.save()
    this.context.translate(myx, myy)
    this.context.rotate(Math.PI - rot)
    this.context.drawImage(img, -obj_w / 2, -obj_w / 2, obj_w, obj_w)
    this.context.restore()
  }

  renderBoard(self, ships) {
    let w = this.canvas.width
    let h = this.canvas.height
    let map_w = w / 10
    let map_h = h / 10
    let obj_w = w / 50
    const { x, y, rot } = self

    this.context.fillStyle = 'white'
    this.context.globalAlpha = 0.2
    this.context.fillRect(0, map_h + obj_w, // x, y
                          map_w + obj_w, map_h * 2) // sx, sy
    
    this.context.globalAlpha = 1
    const airplane_img = getAsset('me.svg')
    const ship_img = getAsset('panda.svg')    
  }


  //=====================================================================

  renderBackground(self) {
    const { x, y, rot } = self

    const mycenterX = this.canvas.width / 2
    const mycenterY = (this.canvas.height * 2) / 3

    this.context.save()

    this.context.translate(mycenterX, mycenterY)
    this.context.rotate(rot)
    this.context.translate(-mycenterX, -mycenterY)

    // Size of background image
    const bgw = this.canvas.width
    const bgh = this.canvas.height

    // https://blog.csdn.net/kidoo1012/article/details/75174884
    let edge = Math.sqrt((bgw / 2 + 1) ** 2 + ((bgh * 2) / 3 + 1) ** 2)
    this.context.drawImage(
      getAsset('background.jpg'),
      x,
      MAP_SIZE - y, //(sx, sy)
      300,
      300, // (sw, sh)
      -(edge - (2 / 3) * bgh),
      -(edge - (2 / 3) * bgh), // (dx. dy)
      2 * edge,
      2 * edge // (dw, dh)
    )

    this.context.restore()
  }

  //====================================================================

  moveToObjectPos(self, other) {
    const dX = other.x - self.x
    const dY = other.y - self.y
    this.context.translate(dX, dY)
    this.context.rotate(other.rot)
  }

  renderPlayer(self, player, character = 1) {
    const { health } = player

    this.context.save()
    if (character !== 0) {
      this.moveToObjectPos(self, player)
    }

    // Health bar
    this.context.fillStyle = 'red'
    this.context.fillRect(
      -PLAYER_RADIUS,
      +PLAYER_RADIUS + 8,
      PLAYER_RADIUS * 2,
      2
    )
    this.context.fillStyle = 'white'
    this.context.fillRect(
      -PLAYER_RADIUS + (PLAYER_RADIUS * 2 * health) / PLAYER_MAX_HP,
      +PLAYER_RADIUS + 8,
      PLAYER_RADIUS * 2 * (1 - health / PLAYER_MAX_HP),
      2
    )

    // Draw the ship / airplane, or maybe other (e.g., charcter 2 is alien.svg)
    let img = getAsset('airplane.svg')
    if (character !== 0) {
      img = getAsset('ship.svg')
    }
    this.context.drawImage(
      img,
      -PLAYER_RADIUS,
      -PLAYER_RADIUS,
      PLAYER_RADIUS * 2,
      PLAYER_RADIUS * 2
    )
    this.context.restore()
  }

  renderBullet(self, bullet) {
    this.context.save()
    this.moveToObjectPos(self, bullet)

    // Draw the bullet
    this.context.drawImage(
      getAsset('bullet.svg'),
      -5 * BULLET_RADIUS,
      -5 * BULLET_RADIUS,
      BULLET_RADIUS * 10,
      BULLET_RADIUS * 10
    )
    this.context.restore()
  }
}
