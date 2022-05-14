import Client from './client'
import { downloadAssets } from './assets'
import './css/main.css'

// Get the dialog and btn
const playMenu = document.getElementById('dialog')
const playButton = document.getElementById('enter-game-btn')
const usernameInput = document.getElementById('username-input')

Promise.all([downloadAssets(), usernameInput.focus()])
  .then(() => {
    playButton.onclick = () => {
      playMenu.classList.add('invisible')
    }
  })
  .catch(console.error)

export default function initScript() {
  document.getElementById('enter-game-btn').addEventListener('click', () => {
    document.getElementById('loading-hover').style.display = 'block'
    document.getElementById('error-msg').style.display = 'none'
    const username = document.getElementById('username-input').value
    try {
      new Client(username).start()
    } catch (error) {
      document.getElementById('loading-hover').style.display = 'none'
      document.getElementById('error-msg').style.display = 'block'
      document.getElementById('error-msg').innerText = error.message
    }
    return false
  })
}

window.onload = initScript
