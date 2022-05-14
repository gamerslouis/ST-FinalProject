import NetworkManager from './network'
import InputManager from './input'
import Render from './render'
import State from './state'

//import { startRendering, stopRendering } from './render';
//import { downloadAssets } from './assets';
//import './css/main.css';

// Get the canvas graphics context
const playMenu = document.getElementById('dialog')
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const renderData = {
  me: {
    x: 0,
    y: 400,
    rot: 0,
    health: 90,
  },
  spaces: [
    {
      x: 200,
      y: 600,
      rot: 0.5,
      health: 45,
    },
  ],
  bullets: [
    {
      x: 0,
      y: 800,
      rot: 3.14,
    },
  ],
}

export default class Client {
  constructor(username) {
    this.username = username
    this.network = new NetworkManager()
    this.input = new InputManager(this.network.getSocket())
  }

  start() {
    Promise.all([
      this.network.connect(),
      //downloadAssets(),
    ]).then(() => {
      let state = new State()
      this.input.attach()

      let myRender = new Render(canvas, context, window)
      myRender.render(renderData)
    })
  }

  gameOver() {
    this.input.dettach()
    playMenu.classList.remove('invisible')
  }
}
