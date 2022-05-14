import startClient from './client'
import { downloadAssets } from './assets'
import './css/main.css'

// Get the dialog and btn
const usernameInput = document.getElementById('username-input')
const canvas = document.getElementById('canvas')

export default function initScript() {
  downloadAssets()
  usernameInput.focus()
  document
    .getElementById('enter-game-btn')
    .addEventListener('click', async () => {
      document.getElementById('loading-hover').style.display = 'block'
      document.getElementById('error-msg').style.display = 'none'
      const username = document.getElementById('username-input').value
      try {
        const client = await startClient(username, canvas)
        client.once('gameEnd', () => {
          document.getElementById('loading-hover').style.display = 'none'
          document.getElementById('error-msg').style.display = 'block'
        })
      } catch (error) {
        document.getElementById('loading-hover').style.display = 'none'
        document.getElementById('error-msg').style.display = 'block'
        document.getElementById('error-msg').innerText = error.message
      }
      return false
    })
}

window.onload = initScript
