import Client from './client'

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
