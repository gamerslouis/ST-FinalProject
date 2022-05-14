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
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

    this.context.save()
    // Note : Player itself is located at (canvas.width * 1/2, canvas.height * 1/5)

    const { self, airplanes, bullets } = renderData

    this.renderBackground(self)

    // Player
    this.renderPlayer(self, self, 0)

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
    const backgroundImg = getAsset('background.jpg')

    // rotation
    this.context.save()
    this.context.translate(mycenterX, mycenterY)
    this.context.rotate(rot)
    this.context.translate(-mycenterX, -mycenterY)

    // Size of background image
    const bgw = (MAP_SIZE + this.canvas.width) * 2
    const bgh = (MAP_SIZE + this.canvas.height) * 2
    const edge = (MAP_SIZE / 2)

    this.context.drawImage(
      backgroundImg,
      x,
      MAP_SIZE - y, // top left corner of img (sx, sy), note that MAP_SIZE = (bgh - canvas.height - y)
      edge,
      edge, // How big of the grab
      -this.canvas.width / 2,
      -this.canvas.height / 2, // put on the left corner on the window
      bgw,
      bgh + edge// size of what was grabed
    )
    this.context.restore()
    return [x, MAP_SIZE - y]
  }

  renderPlayer(self, player, character = 1) {
    const { x, y, health, rot } = player

    // Rotate around center
    const mycenterX = this.canvas.width / 2
    const mycenterY = (this.canvas.height * 4) / 5

    // Player x, y
    const canvasX = mycenterX + (x - self.x)
    const canvasY = mycenterY - (y - self.y)

    this.context.save()

    // self.rotation is background's job
    if (character !== 0) {
      this.context.translate(mycenterX, mycenterY)
      this.context.rotate(self.rot)
      this.context.translate(-mycenterX, -mycenterY)

      // rotate itself
      this.context.translate(canvasX, canvasY)
      this.context.rotate(-rot)
      this.context.translate(-canvasX, -canvasY)
    }

    // Health bar
    this.context.fillStyle = 'red'
    this.context.fillRect(
      canvasX - PLAYER_RADIUS,
      canvasY + PLAYER_RADIUS + 8,
      PLAYER_RADIUS * 2,
      2
    )
    this.context.fillStyle = 'white'
    this.context.fillRect(
      canvasX - PLAYER_RADIUS + (PLAYER_RADIUS * 2 * health) / PLAYER_MAX_HP,
      canvasY + PLAYER_RADIUS + 8,
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
      canvasX - PLAYER_RADIUS,
      canvasY - PLAYER_RADIUS,
      PLAYER_RADIUS * 2,
      PLAYER_RADIUS * 2
    )
    this.context.restore()
  }

  renderBullet(self, bullet) {
    const { x, y, rot } = bullet

    // Rotate around center
    const mycenterX = this.canvas.width / 2
    const mycenterY = (this.canvas.height * 4) / 5

    // Get Bullet x, y
    const canvasX = mycenterX + (x - self.x) - BULLET_RADIUS
    const canvasY = mycenterY - (y - self.y - BULLET_RADIUS)
    
    // Rotate
    this.context.translate(canvasX, canvasY)
    this.context.rotate(-rot)
    this.context.translate(-canvasX, -canvasY)

    // Draw the bullet
    this.context.drawImage(
      getAsset('bullet.svg'),
      canvasX,
      canvasY,
      BULLET_RADIUS * 10,
      BULLET_RADIUS * 10
    )
    this.context.restore()
  }
}
