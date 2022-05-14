const { downloadAssets } = require('./assets')
const { default: Render } = require('./render')

const playMenu = document.getElementById('dialog')
playMenu.classList.add('invisible')

const render = new Render(document.getElementById('canvas'), window, () => ({
  me: {
    x: 0,
    y: 400,
    rot: 0,
    health: 90,
  },
  airplanes: [
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
}))

window.onload = async () => {
  await downloadAssets()
  render.startFrameRendering()
}
