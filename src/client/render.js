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

  render(renderData) {
    if (renderData === undefined) return
    
    const { self, airplanes, bullets } = renderData
    
    this.context.save()

    // Initialize : set airplane as center
    const mycenterX = this.canvas.width / 2
    const mycenterY = (this.canvas.height * 4) / 5
    this.context.translate(mycenterX, mycenterY)

    // Background goes reverse direction
    this.context.save()
    this.context.translate(mycenterX, mycenterY)
    this.context.rotate(-Math.PI)
    this.renderBackground(self)
    this.context.restore()

    // Player
    this.renderPlayer(self, self, 0)
    this.context.rotate(-self.rot)

    // airplanes
    airplanes.forEach((airplane) => this.renderPlayer(self, airplane))

    // Bullets
    bullets.forEach(this.renderBullet.bind(null, self))
    
    this.context.restore()
  }

  renderBackground(self) {
    const { x, y, rot } = self

    const mycenterX = this.canvas.width / 2
    const mycenterY = (this.canvas.height * 4) / 5

    this.context.save()
    
    this.context.translate(mycenterX, mycenterY)
    this.context.rotate(rot)
    this.context.translate(-mycenterX, -mycenterY)

    // Size of background image
    const bgw = (MAP_SIZE + this.canvas.width) * 3
    const bgh = (MAP_SIZE + this.canvas.height) * 3

    this.context.drawImage(
      getAsset('background.jpg'),
      x,
      MAP_SIZE - y, // top left corner of img (sx, sy)
      bgw / 9,
      bgh / 9, // How big of the grab
      -this.canvas.width * Math.sqrt(2),
      -this.canvas.height * Math.sqrt(2), // put on the left corner on the window
      bgw * Math.sqrt(2),
      bgh * Math.sqrt(2) // size of what was grabed
    )

    this.context.restore()
  }

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
